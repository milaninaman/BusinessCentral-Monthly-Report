import { formatDate, type MonthReport } from "@/lib/report";

export function Footer({ report }: { report: MonthReport }) {
  const snap = report.data.snapshot;
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-xs leading-5 text-ink-3 sm:px-6">
        <p>Confidential. For internal use only.</p>
      </div>
    </footer>
  );
}
