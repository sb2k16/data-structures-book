import type { BarPoint, BenchId } from '../../bench/memory.worker';
import RunButton from './RunButton';
import { formatNs, ratio } from './format';
import { useBench } from './useBench';

interface Props {
  bench: BenchId;
  title: string;
  blurb: string;
  seconds: number;
  /** Reads as a sentence: "…is {verb} than…" */
  unit?: string;
  /**
   * Trailing clause of the ratio callout. Defaults to the same-work framing
   * (correct for array-vs-list, AoS/SoA, row/column); override it for the
   * constant-factor demo, where differing work is the whole point.
   */
  caption?: string;
}

/**
 * Two strategies, one measure. That's a single series over two nominal
 * categories, so both bars wear the same hue — coloring them differently would
 * double-encode bar length as identity and say nothing extra.
 */
export default function Compare({
  bench,
  title,
  blurb,
  seconds,
  unit = 'ns per element',
  caption = 'for identical work and identical asymptotics',
}: Props) {
  const { points, running, finished, progress, error, run } = useBench<BarPoint>(bench);

  const max = points.length ? Math.max(...points.map((p) => p.nsPerOp)) : 1;
  const slow = points.length === 2 ? points.reduce((a, b) => (a.nsPerOp > b.nsPerOp ? a : b)) : null;
  const fast = points.length === 2 ? points.reduce((a, b) => (a.nsPerOp < b.nsPerOp ? a : b)) : null;

  return (
    <figure className="not-prose my-10 rounded-xl border p-5 sm:p-6" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Live measurement
      </div>
      <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {blurb}
      </p>

      <RunButton running={running} finished={finished} progress={progress} onRun={run} seconds={seconds} />

      {error && (
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {error}
        </p>
      )}

      {points.length > 0 && (
        <div className="mt-6 space-y-5">
          {points.map((p) => (
            <div key={p.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {p.label}
                </span>
                <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {formatNs(p.nsPerOp)} {unit}
                </span>
              </div>
              {/* Bars wait for the last measurement. Drawn as they stream in, the
                  first result would set the scale, render full-width, then visibly
                  shrink when the second arrives — a frame that reads as "these are
                  about equal" for exactly as long as anyone is looking at it. */}
              <div className="h-2.5 w-full overflow-hidden rounded-sm" style={{ background: 'var(--surface-3)' }}>
                {finished && (
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.max(1.5, (p.nsPerOp / max) * 100)}%`,
                      background: 'var(--series-1)',
                      borderRadius: '0 4px 4px 0',
                    }}
                  />
                )}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      )}

      {finished && slow && fast && (
        <div className="mt-6 rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {ratio(slow.nsPerOp, fast.nsPerOp)}
          </div>
          <div className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {slow.label.toLowerCase()} is {ratio(slow.nsPerOp, fast.nsPerOp)} the cost of {fast.label.toLowerCase()},{' '}
            {caption}.
          </div>
        </div>
      )}
    </figure>
  );
}
