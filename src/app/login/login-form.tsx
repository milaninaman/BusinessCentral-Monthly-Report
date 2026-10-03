"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "@/components/icons";
import { login, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Access password
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            className="block w-full rounded-lg border border-line bg-white py-3 pr-12 pl-3.5 text-base text-ink shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            aria-controls="password"
            title={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-1 my-auto flex h-10 w-10 items-center justify-center rounded-md text-ink-3 transition-colors hover:text-ink focus-visible:text-ink focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:outline-none"
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg bg-critical-soft px-3 py-2 text-sm text-critical-ink">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-strong disabled:opacity-60"
      >
        {pending ? "Checking…" : "View report"}
      </button>
    </form>
  );
}
