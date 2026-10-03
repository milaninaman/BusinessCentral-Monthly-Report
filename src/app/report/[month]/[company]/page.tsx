import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HBarChart, type BarRow } from "@/components/charts";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ArrowLeft, Building, Database, Pause, Receipt, Users } from "@/components/icons";
import { Card, Kpi, PartHeading, SectionTitle, StatusPill } from "@/components/ui";
import { fmt, formatMonth, getCompanyReport, getMonthReport, listMonths, type Line } from "@/lib/report";

export function generateStaticParams() {
  return listMonths().flatMap((month) =>
    getMonthReport(month)!.companies.map((c) => ({ month, company: c.info.slug })),
  );
}

export async function generateMetadata({ params }: PageProps<"/report/[month]/[company]">): Promise<Metadata> {
  const { month, company } = await params;
  const r = getCompanyReport(month, company);
  return { title: r ? `${r.company.info.name}, ${formatMonth(month)}` : "Not found" };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function toRows(lines: Line[], color: string, withGroup: boolean): BarRow[] {
  return lines
    .filter((l) => l.added > 0)
    .sort((a, b) => b.added - a.added)
    .map((l) => ({
      key: String(l.no),
      label: l.label,
      sublabel: withGroup ? l.group : undefined,
      segments: [{ name: l.label, value: l.added, color }],
    }));
}

function NotYet({ lines }: { lines: Line[] }) {
  const empty = lines.filter((l) => l.added <= 0);
  if (!empty.length) return null;
  return (
    <p className="mt-6 border-t border-line pt-4 text-sm text-ink-3">
      <span className="font-semibold text-ink-2">Nothing yet:</span> {empty.map((l) => l.label).join(", ")}
    </p>
  );
}

export default async function CompanyPage({ params }: PageProps<"/report/[month]/[company]">) {
  const { month, company: slug } = await params;
  const found = getCompanyReport(month, slug);
  if (!found) notFound();
  const { report, company: c } = found;
  const since = report.previousMonth ? `since ${formatMonth(report.previousMonth)}` : "this month";

  const master = c.lines.filter((l) => l.bucket === "master");
  const txn = c.lines.filter((l) => l.bucket === "transaction");
  const bank = c.lines.find((l) => l.no === 270)?.current ?? 0;

  return (
    <>
      <Header month={month} company={slug} />

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link
            href={`/report/${month}`}
            className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All companies
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c.info.name}</h1>
            <StatusPill status={c.status} />
          </div>
          <p className="mt-3 text-white/70">
            <span className="mr-2 inline-flex rounded-full bg-sun-bright px-3 py-0.5 text-sm font-bold text-navy">
              {formatMonth(month)}
            </span>
            {norm(c.info.name) !== norm(c.info.bcName) && <>Named “{c.info.bcName}” in Business Central</>}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="pt-12">
          <PartHeading title="At a glance" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Records added" value={fmt(c.totalAdded)} note={since} icon={<Database className="h-[18px] w-[18px]" />} tone="navy" />
            <Kpi label="Full records" value={fmt(c.masterAdded)} note="Customers, vendors, items" icon={<Users className="h-[18px] w-[18px]" />} tone="brand" />
            <Kpi label="Transactions" value={fmt(c.transactionsAdded)} note="Postings, invoices, orders" icon={<Receipt className="h-[18px] w-[18px]" />} tone="sun" />
            <Kpi
              label="Chart of accounts"
              value={fmt(c.glAccounts)}
              note={`G/L accounts set up${bank ? `, plus ${bank} bank account${bank > 1 ? "s" : ""}` : ""}`}
              icon={<Building className="h-[18px] w-[18px]" />}
              tone="good"
            />
          </div>
        </section>

        {c.totalAdded <= 0 ? (
          <Card className="mt-8 flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sun-soft text-sun-ink">
              <Pause className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-ink">Set up and ready for data</h2>
            <p className="mt-2 max-w-md leading-7 text-ink-2">
              This company is set up in Business Central with its chart of accounts
              {bank ? " and bank account" : ""}. No customers, vendors or transactions have been entered yet.
            </p>
          </Card>
        ) : (
          <section className="pt-16">
            <PartHeading title="What was added" sub="Every bar is a type of record, with the number added." />
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <Card className="p-6 sm:p-8">
                <SectionTitle title="Full records" sub="The core records the business runs on" />
                <HBarChart rows={toRows(master, "var(--color-series-master)", false)} labelWidth="11rem" />
              </Card>
              <Card className="p-6 sm:p-8">
                <SectionTitle title="Transactions" sub="Activity recorded in Business Central" />
                <HBarChart rows={toRows(txn, "var(--color-series-txn)", true)} labelWidth="12rem" />
              </Card>
            </div>
          </section>
        )}

        <details className="group mt-12">
          <summary className="no-print cursor-pointer list-none text-sm font-semibold text-brand hover:text-brand-strong">
            <span className="group-open:hidden">Show technical detail: every BC table with data ({c.technical.length})</span>
            <span className="hidden group-open:inline">Hide technical detail</span>
          </summary>
          <Card className="mt-3 overflow-hidden">
            <div className="max-h-[28rem] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-page text-left text-xs text-ink-2">
                  <tr>
                    <th className="px-4 py-3 font-semibold">BC table</th>
                    <th className="px-4 py-3 font-semibold">Table no.</th>
                    <th className="px-4 py-3 text-right font-semibold">Records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {c.technical.map((t) => (
                    <tr key={t.no}>
                      <td className="px-4 py-2.5 text-ink">{t.name}</td>
                      <td className="tnum px-4 py-2.5 text-ink-3">{t.no}</td>
                      <td className="tnum px-4 py-2.5 text-right text-ink">{fmt(t.records)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-2 text-xs text-ink-3">
            Includes BC system and setup tables. Only the record types shown above are counted in the report.
          </p>
        </details>
      </main>
      <Footer report={report} />
    </>
  );
}
