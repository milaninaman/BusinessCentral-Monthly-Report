"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Access password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 block w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base text-ink shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
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
