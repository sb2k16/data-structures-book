import { useMemo, useRef, useState } from 'react';

export interface Pt {
  x: number;
  y: number;
}

export interface Band {
  from: number;
  to: number;
  label: string;
  /** Alternating regions are filled; every region is labeled. */
  shaded?: boolean;
}

interface Props {
  points: Pt[];
  xTicks: number[];
  yTicks: number[];
  formatX: (n: number) => string;
  formatY: (n: number) => string;
  xTitle: string;
  yTitle: string;
  seriesLabel: string;
  bands?: Band[];
  /** Rendered under the plot; the table view that the contrast WARN obligates. */
  tableHeaders?: [string, string];
}

const VW = 760;
const VH = 400;
const PAD = { top: 30, right: 26, bottom: 52, left: 62 };
const PW = VW - PAD.left - PAD.right;
const PH = VH - PAD.top - PAD.bottom;

export default function LatencyChart({
  points,
  xTicks,
  yTicks,
  formatX,
  formatY,
  xTitle,
  yTitle,
  seriesLabel,
  bands = [],
  tableHeaders = ['x', 'y'],
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { sx, sy, path, xDomain, yDomain } = useMemo(() => {
    if (points.length === 0) {
      const noop = { sx: () => 0, sy: () => 0, path: '' };
      return { ...noop, xDomain: [1, 2] as [number, number], yDomain: [1, 2] as [number, number] };
    }
    // Domains come from the data, not the tick list — otherwise a 200ns tick the
    // measurement never reaches squeezes the curve into the bottom of the plot.
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys) / 1.25;
    const y1 = Math.max(...ys) * 1.25;

    const lx0 = Math.log(x0);
    const lx1 = Math.log(x1);
    const ly0 = Math.log(y0);
    const ly1 = Math.log(y1);

    const sx = (x: number) => PAD.left + ((Math.log(x) - lx0) / (lx1 - lx0 || 1)) * PW;
    const sy = (y: number) => PAD.top + PH - ((Math.log(y) - ly0) / (ly1 - ly0 || 1)) * PH;

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' ');
    return { sx, sy, path, xDomain: [x0, x1] as [number, number], yDomain: [y0, y1] as [number, number] };
  }, [points]);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * VW;
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(sx(p.x) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  }

  const hp = hover !== null ? points[hover] : null;
  const visibleXTicks = xTicks.filter((t) => t >= xDomain[0] && t <= xDomain[1]);
  const visibleYTicks = yTicks.filter((t) => t >= yDomain[0] && t <= yDomain[1]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={`${seriesLabel}: ${yTitle} versus ${xTitle}`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Cache-level bands: neutral, never a categorical hue — they mark regions, not series. */}
        {bands.map((b) => {
          const x = sx(Math.max(b.from, xDomain[0]));
          const w = sx(Math.min(b.to, xDomain[1])) - x;
          if (w <= 0) return null;
          return (
            <g key={b.label}>
              {b.shaded && (
                <rect
                  x={x}
                  y={PAD.top}
                  width={w}
                  height={PH}
                  fill="var(--band)"
                  opacity="var(--band-alpha)"
                />
              )}
              {w > 36 && (
                <text
                  x={x + w / 2}
                  y={PAD.top + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-muted)"
                  fontWeight={550}
                >
                  {b.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Recessive hairline grid. Solid — dashing reads as noise. */}
        {visibleYTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              x1={PAD.left}
              x2={PAD.left + PW}
              y1={sy(t)}
              y2={sy(t)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 10}
              y={sy(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--text-muted)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t}
            </text>
          </g>
        ))}

        {visibleXTicks.map((t) => (
          <text
            key={`x${t}`}
            x={sx(t)}
            y={PAD.top + PH + 20}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-muted)"
          >
            {formatX(t)}
          </text>
        ))}

        <text
          x={PAD.left + PW / 2}
          y={VH - 8}
          textAnchor="middle"
          fontSize="11.5"
          fill="var(--text-secondary)"
          fontWeight={550}
        >
          {xTitle}
        </text>
        <text
          transform={`translate(16, ${PAD.top + PH / 2}) rotate(-90)`}
          textAnchor="middle"
          fontSize="11.5"
          fill="var(--text-secondary)"
          fontWeight={550}
        >
          {yTitle}
        </text>

        {/* Crosshair sits under the marks. */}
        {hp && (
          <line
            x1={sx(hp.x)}
            x2={sx(hp.x)}
            y1={PAD.top}
            y2={PAD.top + PH}
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
        )}

        <path d={path} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={hover === i ? 5 : 4}
            fill="var(--series-1)"
            stroke="var(--surface-1)"
            strokeWidth="2"
          />
        ))}

        {/* One series needs no legend and no direct label — the figure's title
            names it, and a label pinned to the last point collides with the
            band labels exactly where the curve is most interesting. */}
      </svg>

      {hp && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border px-2.5 py-1.5 text-xs shadow-sm"
          style={{
            left: `${(sx(hp.x) / VW) * 100}%`,
            top: `${(sy(hp.y) / VH) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 12px))',
            background: 'var(--surface-1)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ color: 'var(--text-muted)' }}>{formatX(hp.x)}</div>
          <div className="font-semibold tabular-nums">{formatY(hp.y)} ns</div>
        </div>
      )}

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer" style={{ color: 'var(--text-muted)' }}>
          View as table
        </summary>
        <div className="table-scroll mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>{tableHeaders[0]}</th>
                <th>{tableHeaders[1]}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i}>
                  <td className="tabular-nums">{formatX(p.x)}</td>
                  <td className="tabular-nums">{formatY(p.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
