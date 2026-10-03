import Link from "next/link";
import { fmt } from "@/lib/report";

export type Segment = { name: string; value: number; color: string };
export type BarRow = { key: string; label: string; sublabel?: string; href?: string; segments: Segment[] };

/** Rounds the axis maximum up to a friendly number and returns ~4 evenly spaced ticks. */
function niceScale(max: number) {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const rough = max / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)!;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  return { top, ticks };
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-2">
      {items.map((i) => (
        <li key={i.name} className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: i.color }} />
          {i.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Horizontal bar chart (stacked when a row has several segments): category labels
 * on the left, value axis with gridlines along the bottom, total printed at the
 * end of each bar.
 */
export function HBarChart({ rows, labelWidth = "13rem" }: { rows: BarRow[]; labelWidth?: string }) {
  const totals = rows.map((r) => r.segments.reduce((s, x) => s + x.value, 0));
  const { top, ticks } = niceScale(Math.max(...totals, 0));
  const pct = (v: number) => `${(v / top) * 100}%`;

  return (
    <div style={{ ["--label-w" as string]: labelWidth }}>
      <div className="relative">
        {/* gridlines, drawn behind the rows inside the plot column */}
        <div className="pointer-events-none absolute inset-y-0 right-14 hidden sm:left-[calc(var(--label-w)+1.5rem)] sm:block" aria-hidden>
          {ticks.map((t) => (
            <span
              key={t}
              className={`absolute inset-y-0 w-px ${t === 0 ? "bg-ink-3/40" : "bg-line"}`}
              style={{ left: pct(t) }}
            />
          ))}
        </div>

        <ul className="relative">
          {rows.map((r, i) => {
            const total = totals[i];
            const body = (
              <>
                <div className="min-w-0 sm:w-[var(--label-w)] sm:shrink-0 sm:text-right">
                  <p className="text-sm leading-5 font-semibold text-ink">{r.label}</p>
                  {r.sublabel && <p className="mt-0.5 text-xs text-ink-3">{r.sublabel}</p>}
                </div>
                <div className="relative mr-14 flex h-6 items-center sm:flex-1">
                  <div className="flex h-full items-stretch gap-[2px]" style={{ width: pct(total) }}>
                    {r.segments
                      .filter((s) => s.value > 0)
                      .map((s, j, arr) => (
                        <span
                          key={s.name}
                          className={j === arr.length - 1 ? "rounded-r-md" : ""}
                          style={{ width: `${(s.value / total) * 100}%`, minWidth: 4, background: s.color }}
                        />
                      ))}
                  </div>
                  <span className="tnum absolute pl-2.5 text-sm font-bold text-ink" style={{ left: pct(total) }}>
                    {fmt(total)}
                  </span>
                </div>
              </>
            );
            const cls =
              "group relative flex flex-col gap-2 rounded-lg py-3.5 sm:flex-row sm:items-center sm:gap-6";
            return (
              <li key={r.key}>
                {r.href ? (
                  <Link
                    href={r.href}
                    className={`${cls} outline-none transition-colors hover:bg-brand-soft/60 focus-visible:ring-4 focus-visible:ring-brand/20`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* value axis */}
      <div className="relative mt-1 mr-14 hidden h-5 sm:ml-[calc(var(--label-w)+1.5rem)] sm:block" aria-hidden>
        {ticks.map((t) => (
          <span
            key={t}
            className="tnum absolute -translate-x-1/2 text-xs text-ink-3 first:translate-x-0"
            style={{ left: pct(t) }}
          >
            {fmt(t)}
          </span>
        ))}
      </div>
    </div>
  );
}
