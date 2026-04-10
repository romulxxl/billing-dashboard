import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";
import type { Subscription } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json<ApiResponse<Subscription | null>>({
    data: subscription,
    error: null,
  });
}
