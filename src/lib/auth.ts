// Shared-password session. The cookie holds "<issuedAt>.<signature>", signed with
// a key derived from AUTH_SECRET + DASHBOARD_PASSWORD, so changing the password
// signs everyone out.

export const SESSION_COOKIE = "bcr_session";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

function config() {
  const password = process.env.DASHBOARD_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!password || !secret) return null;
  return { password, secret };
}

export function isConfigured(): boolean {
  return config() !== null;
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(message: string): Promise<string | null> {
  const cfg = config();
  if (!cfg) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`${cfg.secret}|${cfg.password}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(input: string): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(input)),
    crypto.subtle.digest("SHA-256", enc.encode(cfg.password)),
  ]);
  return safeEqual(toHex(a), toHex(b));
}

export async function createSessionToken(): Promise<string> {
  const issued = Date.now().toString();
  const sig = await sign(issued);
  if (!sig) throw new Error("Auth is not configured");
  return `${issued}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig || !/^\d+$/.test(issued)) return false;
  if (Date.now() - Number(issued) > SESSION_DAYS * 86_400_000) return false;
  const expected = await sign(issued);
  return expected !== null && safeEqual(sig, expected);
}

export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
}
