import type { ReactNode } from "react";
import { STATUS_LABEL, type CompanyStatus } from "@/lib/report";
import type { Project } from "@/lib/types";
import { Alert, Check, Clock, Dot, Pause } from "./icons";

const STATUS_STYLE: Record<CompanyStatus, { cls: string; icon: ReactNode }> = {
  live: { cls: "bg-good-soft text-good-ink", icon: <Check className="h-3.5 w-3.5" strokeWidth={3} /> },
  loaded: { cls: "bg-brand-soft text-brand-strong", icon: <Dot className="h-3.5 w-3.5" /> },
  setup: { cls: "bg-neutral-soft text-ink-2", icon: <Pause className="h-3.5 w-3.5" /> },
};

export function StatusPill({ status }: { status: CompanyStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      {s.icon}
      {STATUS_LABEL[status]}
    </span>
  );
}

const PROJECT_STYLE: Record<Project["status"], { cls: string; icon: ReactNode }> = {
  live: { cls: "bg-good-soft text-good-ink", icon: <Check className="h-3.5 w-3.5" strokeWidth={3} /> },
  testing: { cls: "bg-brand-soft text-brand-strong", icon: <Clock className="h-3.5 w-3.5" /> },
  "in-progress": { cls: "bg-brand-soft text-brand-strong", icon: <Clock className="h-3.5 w-3.5" /> },
  blocked: { cls: "bg-sun-soft text-sun-ink", icon: <Alert className="h-3.5 w-3.5" /> },
};

export function ProjectPill({ status, label }: { status: Project["status"]; label: string }) {
  const s = PROJECT_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
      {s.icon}
      {label}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_3px_rgba(18,35,63,0.05)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-ink">{title}</h3>
        {sub && <p className="mt-1 text-sm text-ink-2">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/** A big page-level heading that separates major parts of the report. */
export function PartHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="h-8 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden />
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-ink-2">{sub}</p>}
      </div>
    </div>
  );
}

export function Kpi({
  label,
  value,
  note,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  note?: ReactNode;
  icon: ReactNode;
  tone?: "brand" | "sun" | "good" | "navy";
}) {
  const toneCls = {
    brand: "bg-brand-soft text-brand",
    sun: "bg-sun-soft text-sun-ink",
    good: "bg-good-soft text-good-ink",
    navy: "bg-navy text-sun-bright",
  }[tone];
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-2">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneCls}`}>{icon}</span>
      </div>
      <p className="tnum mt-3 text-[2.5rem] leading-none font-extrabold tracking-tight text-ink">{value}</p>
      {note && <p className="mt-2.5 text-sm text-ink-3">{note}</p>}
    </Card>
  );
}
