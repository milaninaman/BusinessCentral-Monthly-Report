import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HBarChart, Legend, type BarRow } from "@/components/charts";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Building, Check, Database, Receipt, Users } from "@/components/icons";
import { AttentionList, ProjectCard } from "@/components/projects";
import { Card, Kpi, PartHeading, SectionTitle } from "@/components/ui";
import { fmt, formatMonth, getMonthReport, listMonths, type CompanyReport } from "@/lib/report";

const MASTER = { name: "Full records", color: "var(--color-series-master)" };
const TXN = { name: "Transactions", color: "var(--color-series-txn)" };

export function generateStaticParams() {
  return listMonths().map((month) => ({ month }));
}

export async function generateMetadata({ params }: PageProps<"/report/[month]">): Promise<Metadata> {
  const { month } = await params;
  return { title: formatMonth(month) };
}

export default async function MonthPage({ params }: PageProps<"/report/[month]">) {
  const { month } = await params;
  const report = getMonthReport(month);
  if (!report) notFound();

  const { totals, companies, data, previousMonth } = report;
  const withData = companies.filter((c) => c.totalAdded > 0);
  const waiting = companies.filter((c) => c.totalAdded <= 0);
  const since = previousMonth ? `since ${formatMonth(previousMonth)}` : "this month";

  const companyRows: BarRow[] = withData.map((c) => ({
    key: c.info.slug,
    label: c.info.name,
    sublabel: `${fmt(c.masterAdded)} full records, ${fmt(c.transactionsAdded)} transactions`,
    href: `/report/${month}/${c.info.slug}`,
    segments: [
      { ...MASTER, value: c.masterAdded },
      { ...TXN, value: c.transactionsAdded },
    ],
  }));
  const categoryRows = (bucket: string, color: string): BarRow[] =>
    report.topCategories
      .filter((c) => c.bucket === bucket)
      .slice(0, 6)
      .map((c) => ({ key: c.label, label: c.label, segments: [{ name: c.label, value: c.added, color }] }));

  return (
    <>
      <Header month={month} company={null} />

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-center lg:py-14">
          <div>
            <span className="inline-flex rounded-full bg-sun-bright px-3.5 py-1 text-sm font-bold text-navy">
              {formatMonth(month)}
            </span>
            <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
              Business Central <br></br>Monthly Report
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">
             Monthly report for how much work was done within Business Central.
            </p>
          </div>
          <CompanyStrip month={month} companies={companies} live={totals.live} />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Quick summary */}
        {data.notes.summary.length > 0 && (
          <section className="pt-12">
            <PartHeading title="Quick summary" />
            <Card className="p-2">
              <ul className="grid sm:grid-cols-2">
                {data.notes.summary.map((line) => (
                  <li key={line} className="flex items-start gap-4 rounded-xl p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="pt-1 text-base leading-7 text-ink">
                      {fill(line, { added: fmt(totals.added), companies: String(withData.length) })}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* Detailed overview */}
        <section className="pt-16">
          <PartHeading title="Detailed overview" sub="The numbers behind this month's progress." />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              label="Records added"
              value={fmt(totals.added)}
              note={`Across all companies, ${since}`}
              icon={<Database className="h-[18px] w-[18px]" />}
              tone="navy"
            />
            <Kpi
              label="Full records"
              value={fmt(totals.masterAdded)}
              note="Customers, vendors, items"
              icon={<Users className="h-[18px] w-[18px]" />}
              tone="brand"
            />
            <Kpi
              label="Transactions"
              value={fmt(totals.transactionsAdded)}
              note="Postings, invoices, orders"
              icon={<Receipt className="h-[18px] w-[18px]" />}
              tone="sun"
            />
            <Kpi
              label="Companies live"
              value={`${totals.live} of ${totals.companies}`}
              note={`${totals.setup} more set up and ready for data`}
              icon={<Building className="h-[18px] w-[18px]" />}
              tone="good"
            />
          </div>

          <Card className="mt-8 p-6 sm:p-8">
            <SectionTitle
              title="Data added by company"
              sub="Select a company to see exactly what was added."
              right={<Legend items={[MASTER, TXN]} />}
            />
            <HBarChart rows={companyRows} labelWidth="15rem" />

            {waiting.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm font-semibold text-ink">
                  Set up and ready for data <span className="font-normal text-ink-3">({waiting.length})</span>
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {waiting.map((c) => (
                    <li key={c.info.slug}>
                      <Link
                        href={`/report/${month}/${c.info.slug}`}
                        className="inline-flex rounded-full border border-line bg-page px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-brand hover:text-brand"
                      >
                        {c.info.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <SectionTitle title="Full records added" sub="All companies combined" />
              <HBarChart rows={categoryRows("master", MASTER.color)} labelWidth="11rem" />
            </Card>
            <Card className="p-6 sm:p-8">
              <SectionTitle title="Transactions added" sub="Top six types, all companies combined" />
              <HBarChart rows={categoryRows("transaction", TXN.color)} labelWidth="11rem" />
            </Card>
          </div>
        </section>

        {/* Projects */}
        {data.notes.projects.length > 0 && (
          <section className="pt-16">
            <PartHeading
              title="Projects making the migration easier"
              sub="Internal tools built to speed up and simplify the migration process."
            />
            <div className="grid gap-8 lg:grid-cols-2">
              {data.notes.projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}

        {/* Attention */}
        {data.notes.attention.length > 0 && (
          <section className="pt-16">
            <PartHeading title="Needs your attention" />
            <AttentionList items={data.notes.attention} />
          </section>
        )}
      </main>
      <Footer report={report} />
    </>
  );
}

/** One tile per company, coloured by how far along it is. Doubles as navigation. */
function CompanyStrip({ month, companies, live }: { month: string; companies: CompanyReport[]; live: number }) {
  const order = { live: 0, loaded: 1, setup: 2 } as const;
  const sorted = [...companies].sort(
    (a, b) => order[a.status] - order[b.status] || a.info.name.localeCompare(b.info.name),
  );
  return (
    <div className="rounded-2xl bg-navy-2 p-5 ring-1 ring-white/10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-base font-bold">
          <span className="text-sun-bright">{live}</span> of {companies.length} companies live
        </p>
        <div className="flex gap-4 text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sun-bright" /> Live
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-white/50" /> Ready
          </span>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sorted.map((c) => {
          const on = c.status === "live";
          return (
            <li key={c.info.slug}>
              <Link
                href={`/report/${month}/${c.info.slug}`}
                title={c.info.name}
                className={`flex h-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  on
                    ? "bg-sun-bright font-semibold text-navy hover:bg-white"
                    : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${on ? "bg-navy" : "border border-white/50"}`}
                  aria-hidden
                />
                <span className="leading-5">{c.info.name}</span>
                <span className="sr-only">({on ? "live" : "ready for data"})</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Replaces {added} / {companies} placeholders with this month's figures. */
function fill(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
}

