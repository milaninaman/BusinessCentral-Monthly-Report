"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  checkPassword,
  createSessionToken,
  missingConfig,
  safeNext,
} from "@/lib/auth";

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const missing = missingConfig();
  if (missing.length) {
    console.error(`[auth] Missing environment variable(s): ${missing.join(", ")}`);
    return {
      error: `The report isn't set up yet: ${missing.join(" and ")} ${missing.length > 1 ? "are" : "is"} missing on the server. Add ${missing.length > 1 ? "them" : "it"} in Vercel, then redeploy.`,
    };
  }
  const password = String(form.get("password") ?? "");
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "That password is not correct. Please try again." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  redirect(safeNext(String(form.get("next") ?? "/")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
