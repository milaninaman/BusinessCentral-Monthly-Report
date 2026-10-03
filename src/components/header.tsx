import Link from "next/link";
import { logout } from "@/app/login/actions";
import { formatMonth, getMonthReport, listMonths } from "@/lib/report";
import { Selectors } from "./selectors";

export function Header({ month, company }: { month: string; company: string | null }) {
  const report = getMonthReport(month)!;
  const months = listMonths().map((m) => ({ value: m, label: formatMonth(m) }));
  const companies = [...report.companies]
    .sort((a, b) => a.info.name.localeCompare(b.info.name))
    .map((c) => ({ value: c.info.slug, label: c.info.name }));

  return (
    <header className="no-print z-20 sm:sticky sm:top-0 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={`/report/${month}`} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-sm font-extrabold text-sun-bright">
            BC
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-ink">Business Central</span>
            <span className="block text-xs text-ink-2">Monthly Business Central Report</span>
          </span>
        </Link>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Selectors month={month} months={months} company={company} companies={companies} />
          <form action={logout}>
            <button
              type="submit"
              className="h-10 rounded-lg px-3 text-sm font-medium text-ink-2 transition hover:bg-line-soft hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
