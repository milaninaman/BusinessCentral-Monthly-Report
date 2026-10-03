"use client";

import { useState } from "react";
import { Check, Copy } from "./icons";

/** Shows a login password for a linked app, with a one-click copy. */
export function PasswordChip({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the password is still visible to type in.
    }
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-page py-1 pr-1 pl-3 text-sm text-ink-2">
      Password:
      <code className="rounded bg-white px-1.5 py-0.5 font-semibold text-ink ring-1 ring-line">{password}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Password copied" : "Copy password"}
        title={copied ? "Copied" : "Copy password"}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-white hover:text-ink focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:outline-none"
      >
        {copied ? <Check className="h-4 w-4 text-good" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Password copied" : ""}
      </span>
    </span>
  );
}
