import type { Metadata } from "next";
import { safeNext } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const target = safeNext(typeof next === "string" ? next : "/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Mark />
          <div>
            <p className="text-sm font-semibold text-ink">Business Central</p>
            <p className="text-sm text-ink-2">Monthly Migration Report</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Welcome</h1>
          <p className="mt-1.5 mb-6 text-sm leading-6 text-ink-2">
            Enter the password you were given to view the report.
          </p>
          <LoginForm next={target} />
        </div>
        <p className="mt-6 text-center text-xs text-ink-3">Confidential. For internal use only.</p>
      </div>
    </main>
  );
}

function Mark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-sm font-extrabold text-sun-bright">
      BC
    </span>
  );
}
