import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { verifyDemoToken, DEMO_COOKIE_NAME } from "@/lib/demo-session";
import { DEMO_USER } from "@/lib/mock-data";
import type { SessionUser } from "@/types";

export interface AppSession {
  user: SessionUser;
  isDemo: boolean;
}

/**
 * Unified session resolver for server components and API route handlers.
 * Checks NextAuth session first, then falls back to the demo JWT cookie.
 * Returns null when neither is present/valid.
 */
export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();

  // 1. Check for demo JWT cookie first (fast path — no DB needed)
  const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value;
  if (demoToken && (await verifyDemoToken(demoToken))) {
    return { user: DEMO_USER, isDemo: true };
  }

  // 2. Try NextAuth (real users). Guard against DB unavailability.
  try {
    const nextAuthSession = await auth();
    if (nextAuthSession?.user?.id) {
      return {
        user: {
          id: nextAuthSession.user.id,
          name: nextAuthSession.user.name,
          email: nextAuthSession.user.email,
          image: nextAuthSession.user.image,
        },
        isDemo: false,
      };
    }
  } catch {
    // DB not available — no real session
  }

  return null;
}
