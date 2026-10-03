import type { AttentionItem, Project } from "@/lib/types";
import { Alert, Check, Decision, External, Link2 } from "./icons";
import { Card, ProjectPill } from "./ui";

export function ProjectCard({ p }: { p: Project }) {
  const done = p.steps.filter((s) => s.state === "done").length;
  const pct = Math.round((done / p.steps.length) * 100);

  return (
    <Card className="flex flex-col p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight text-ink">{p.name}</h3>
        <ProjectPill status={p.status} label={p.statusLabel} />
      </div>
      <p className="mt-2 text-[15px] leading-6 text-ink-2">{p.summary}</p>

      <div className="mt-5 border-l-4 border-sun pl-4">
        <p className="text-sm font-bold text-ink">Purpose</p>
        <p className="mt-1 text-[15px] leading-6 text-ink-2">{p.impact}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-bold text-ink">Progress</span>
          <span className="tnum text-ink-2">
            {done} of {p.steps.length} steps done
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-line-soft">
          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        <ol className="mt-4 space-y-2.5">
          {p.steps.map((s) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <StepIcon state={s.state} />
              <span
                className={
                  s.state === "done" ? "text-ink" : s.state === "current" ? "font-semibold text-ink" : "text-ink-3"
                }
              >
                {s.label}
                {s.state === "current" && <span className="ml-2 rounded-full bg-sun-soft px-2 py-0.5 text-xs font-semibold text-sun-ink">In progress</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <details className="group mt-5 border-t border-line-soft pt-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-brand hover:text-brand-strong">
          <span className="group-open:hidden">Show details</span>
          <span className="hidden group-open:inline">Hide details</span>
        </summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink-2">
          {p.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </details>

      {p.link && (
        <a
          href={p.link.url}
          target="_blank"
          rel="noreferrer"
          className="no-print mt-5 inline-flex items-center gap-2 self-start rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-strong"
        >
          <Link2 className="h-4 w-4" />
          {p.link.label}
          <External className="h-3.5 w-3.5" />
        </a>
      )}
    </Card>
  );
}

function StepIcon({ state }: { state: "done" | "current" | "todo" }) {
  if (state === "done")
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-good text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  if (state === "current")
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand">
        <span className="h-2 w-2 rounded-full bg-brand" />
      </span>
    );
  return <span className="h-5 w-5 shrink-0 rounded-full border-2 border-line" />;
}

const KIND = {
  decision: { label: "Decision needed", icon: Decision, cls: "bg-brand-soft text-brand-strong" },
  dependency: { label: "Dependency", icon: Alert, cls: "bg-sun-soft text-sun-ink" },
  risk: { label: "Risk", icon: Alert, cls: "bg-critical-soft text-critical-ink" },
} as const;

export function AttentionList({ items }: { items: AttentionItem[] }) {
  return (
    <Card className="divide-y divide-line-soft">
      {items.map((a) => {
        const k = KIND[a.kind];
        const Icon = k.icon;
        return (
          <div key={a.title} className="flex gap-4 p-6">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${k.cls}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${k.cls}`}>{k.label}</span>
              <p className="mt-2 font-bold text-ink">{a.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-2">{a.detail}</p>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
