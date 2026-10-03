"use client";

import { useRouter } from "next/navigation";

type Opt = { value: string; label: string };

export function Selectors({
  month,
  months,
  company,
  companies,
}: {
  month: string;
  months: Opt[];
  company: string | null;
  companies: Opt[];
}) {
  const router = useRouter();
  const go = (m: string, c: string | null) => router.push(c ? `/report/${m}/${c}` : `/report/${m}`);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        label="Month"
        value={month}
        options={months}
        onChange={(m) => go(m, company)}
      />
      <Select
        label="Company"
        value={company ?? ""}
        options={[{ value: "", label: "All companies" }, ...companies]}
        onChange={(c) => go(month, c || null)}
        wide
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  wide,
}: {
  label: string;
  value: string;
  options: Opt[];
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 cursor-pointer appearance-none rounded-lg border border-line bg-white py-0 pl-3 pr-9 text-sm font-medium text-ink shadow-sm outline-none transition hover:border-ink-3 focus:border-brand focus:ring-4 focus:ring-brand/15 ${wide ? "w-full sm:w-64" : ""}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 h-4 w-4 text-ink-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
