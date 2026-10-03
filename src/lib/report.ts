import companiesJson from "@/data/companies.json";
import { MONTHS } from "@/data/registry";
import { CATALOG, CATALOG_BY_NO, STAGING_TABLES, type CatalogEntry } from "./catalog";
import type { CompanyInfo, MonthData, SnapshotCompany, TableRow } from "./types";

const COMPANIES = companiesJson as CompanyInfo[];

export type CompanyStatus = "live" | "loaded" | "setup";

export const STATUS_LABEL: Record<CompanyStatus, string> = {
  live: "Live in BC",
  loaded: "Records loaded",
  setup: "Ready for data",
};

export type Line = CatalogEntry & { current: number; previous: number; added: number };

export type CompanyReport = {
  info: CompanyInfo;
  status: CompanyStatus;
  masterAdded: number;
  transactionsAdded: number;
  totalAdded: number;
  masterTotal: number;
  transactionsTotal: number;
  glAccounts: number;
  lines: Line[];
  technical: TableRow[];
};

export type MonthReport = {
  month: string;
  previousMonth: string | null;
  data: MonthData;
  companies: CompanyReport[];
  totals: {
    added: number;
    masterAdded: number;
    transactionsAdded: number;
    live: number;
    loaded: number;
    setup: number;
    companies: number;
  };
  topCategories: { label: string; bucket: string; added: number }[];
};

// ---------- months ----------

export function listMonths(): string[] {
  return MONTHS.map((m) => m.month).sort().reverse();
}

export function latestMonth(): string {
  return listMonths()[0];
}

export function isMonth(m: string): boolean {
  return MONTHS.some((x) => x.month === m);
}

export function formatMonth(m: string, style: "long" | "short" = "long"): string {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString("en-CA", {
    month: style,
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDate(iso: string): string {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const fmt = (n: number) => n.toLocaleString("en-CA");

// ---------- companies ----------

function infoFor(bcName: string): CompanyInfo {
  return (
    COMPANIES.find((c) => c.bcName === bcName) ?? {
      bcName,
      name: bcName,
      slug: bcName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }
  );
}

function counts(c: SnapshotCompany | undefined): Map<number, number> {
  return new Map((c?.tables ?? []).map((t) => [t.no, t.records]));
}

function buildCompany(cur: SnapshotCompany, prev: SnapshotCompany | undefined): CompanyReport {
  const now = counts(cur);
  const before = counts(prev);

  const lines: Line[] = CATALOG.map((entry) => {
    const current = now.get(entry.no) ?? 0;
    const previous = before.get(entry.no) ?? 0;
    return { ...entry, current, previous, added: current - previous };
  });

  const sum = (bucket: string, key: "added" | "current") =>
    lines.filter((l) => l.bucket === bucket).reduce((s, l) => s + l[key], 0);

  const masterAdded = sum("master", "added");
  const transactionsAdded = sum("transaction", "added");
  const transactionsTotal = sum("transaction", "current");

  const status: CompanyStatus =
    (now.get(17) ?? 0) > 0 || transactionsTotal > 0 ? "live" : sum("master", "current") > 0 ? "loaded" : "setup";

  return {
    info: infoFor(cur.bcName),
    status,
    masterAdded,
    transactionsAdded,
    totalAdded: masterAdded + transactionsAdded,
    masterTotal: sum("master", "current"),
    transactionsTotal,
    glAccounts: now.get(15) ?? 0,
    lines,
    technical: cur.tables.filter((t) => !STAGING_TABLES.has(t.no)),
  };
}

// ---------- month ----------

export function getMonthReport(month: string): MonthReport | null {
  const data = MONTHS.find((m) => m.month === month);
  if (!data) return null;

  const earlier = listMonths().filter((m) => m < month);
  const previousMonth = earlier[0] ?? null;
  const prevData = previousMonth ? MONTHS.find((m) => m.month === previousMonth) : undefined;

  const companies = data.snapshot.companies
    .map((c) => buildCompany(c, prevData?.snapshot.companies.find((p) => p.bcName === c.bcName)))
    .sort((a, b) => b.totalAdded - a.totalAdded || a.info.name.localeCompare(b.info.name));

  const byLabel = new Map<number, { label: string; bucket: string; added: number }>();
  for (const c of companies) {
    for (const l of c.lines) {
      if (l.bucket === "setup") continue;
      const e = byLabel.get(l.no) ?? { label: l.label, bucket: l.bucket, added: 0 };
      e.added += l.added;
      byLabel.set(l.no, e);
    }
  }

  return {
    month,
    previousMonth,
    data,
    companies,
    totals: {
      added: companies.reduce((s, c) => s + c.totalAdded, 0),
      masterAdded: companies.reduce((s, c) => s + c.masterAdded, 0),
      transactionsAdded: companies.reduce((s, c) => s + c.transactionsAdded, 0),
      live: companies.filter((c) => c.status === "live").length,
      loaded: companies.filter((c) => c.status === "loaded").length,
      setup: companies.filter((c) => c.status === "setup").length,
      companies: companies.length,
    },
    topCategories: [...byLabel.values()].filter((c) => c.added > 0).sort((a, b) => b.added - a.added),
  };
}

export function getCompanyReport(month: string, slug: string) {
  const report = getMonthReport(month);
  const company = report?.companies.find((c) => c.info.slug === slug);
  return report && company ? { report, company } : null;
}

export { CATALOG_BY_NO };
