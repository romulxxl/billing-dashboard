import { SignJWT, jwtVerify } from "jose";

export const DEMO_COOKIE_NAME = "synapse-demo-token";
const DEMO_USER_SUB = "demo-user";

function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

/** Creates a signed 24-hour JWT for the demo user. No database involved. */
export async function createDemoToken(): Promise<string> {
  return new SignJWT({ sub: DEMO_USER_SUB })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

/** Returns true if the token is a valid, unexpired demo JWT. */
export async function verifyDemoToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub === DEMO_USER_SUB;
  } catch {
    return false;
  }
}
