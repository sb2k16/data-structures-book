import type { CachePoint, CacheLevel } from '../../bench/levels';
import LatencyChart, { type Band } from './LatencyChart';
import RunButton from './RunButton';
import { formatBytes, formatNs, ratio } from './format';
import { useBench } from './useBench';

const X_TICKS = [4096, 32768, 262144, 2097152, 16777216, 134217728];
const Y_TICKS = [1, 2, 5, 10, 20, 50, 100, 200];

/** Each detected level owns the stretch of the x-axis it still fits inside. */
function bandsFor(levels: CacheLevel[], minBytes: number, maxBytes: number): Band[] {
  if (levels.length === 0) return [];
  let from = minBytes;
  return levels.map((l, i) => {
    const to = l.upToBytes ?? maxBytes;
    const band: Band = {
      from,
      to,
      label: l.label,
      // Only every other region is filled, or the plot stripes into noise.
      shaded: i % 2 === 1,
    };
    from = to;
    return band;
  });
}

export default function CacheCliff() {
  const { points, running, finished, progress, levels, error, run } = useBench<CachePoint>('cacheCliff');

  const chartPoints = points.map((p) => ({ x: p.bytes, y: p.nsPerOp }));
  const minBytes = points.length ? points[0].bytes : 4096;
  const maxBytes = points.length ? points[points.length - 1].bytes : 134217728;
  const bands = finished ? bandsFor(levels, minBytes, maxBytes) : [];

  const fastest = points.length ? Math.min(...points.map((p) => p.nsPerOp)) : 0;
  const slowest = points.length ? Math.max(...points.map((p) => p.nsPerOp)) : 0;

  return (
    <figure className="not-prose my-10 rounded-xl border p-5 sm:p-6" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Live measurement
      </div>
      <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        The memory mountain
      </h3>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        One random dependent load, repeated millions of times, over working sets from 4 KiB to 128 MiB. The
        access pattern never changes. Only the size of the array does.
      </p>

      <RunButton running={running} finished={finished} progress={progress} onRun={run} seconds={8} />

      {error && (
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {error}
        </p>
      )}

      {points.length > 1 && (
        <div className="mt-6">
          <LatencyChart
            points={chartPoints}
            xTicks={X_TICKS}
            yTicks={Y_TICKS}
            formatX={formatBytes}
            formatY={formatNs}
            xTitle="Working set size"
            yTitle="Latency per access (ns)"
            seriesLabel="Random access latency"
            bands={bands}
            tableHeaders={['Working set', 'Latency (ns)']}
          />
        </div>
      )}

      {finished && points.length > 1 && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              On this machine, the same instruction took{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{formatNs(fastest)} ns</strong> when the array was
              small and{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{formatNs(slowest)} ns</strong> when it was large —
              a{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{Math.round(slowest / fastest)}× spread</strong>{' '}
              with no change to the algorithm, the code, or the number of operations.
            </div>
          </div>

          {levels.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                The hierarchy this curve implies
              </div>
              <div className="table-scroll">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Serves working sets up to</th>
                      <th>Latency</th>
                      <th>Versus L1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((l) => (
                      <tr key={l.label}>
                        <td className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {l.label}
                        </td>
                        <td className="tabular-nums">
                          {l.upToBytes === null ? 'everything larger' : `≈ ${formatBytes(l.upToBytes)}`}
                        </td>
                        <td className="tabular-nums">{formatNs(l.ns)} ns</td>
                        <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          {l.ns / levels[0].ns < 1.05 ? '—' : `${ratio(l.ns, levels[0].ns)} slower`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Inferred from the knees in your curve, not read from the CPU. Browsers deliberately blur their
                timers, JavaScript bounds-checks every load, and a busy machine reports slower numbers — so treat
                the sizes as approximate and the <em>ordering and the ratios</em> as the real result.
              </p>
            </div>
          )}
        </div>
      )}
    </figure>
  );
}
