import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_jwt_key_for_kredo_dev";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  role: string;
  username: string;
  branch?: string;
  [key: string]: unknown;
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedSecret);

  return token;
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as SessionPayload;
  } catch (_error) {
    return null;
  }
}
