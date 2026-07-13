import { useEffect, useRef, useState } from 'react';
import type { Step } from '../../lib/traces';

/**
 * Plays a step-by-step algorithm trace produced by the AlgoTutor engine
 * (algo-tutor/engine). The engine emits one event per step — array, the hash
 * map filling, the current index, the complement, the match — and this
 * component animates that trace client-side, with play / scrub controls.
 *
 * Absorbing AlgoTutor: we reuse the engine's TRACE (static JSON) and render it
 * with a lean book-native player rather than shipping AlgoTutor's whole app.
 * The renderer here handles the array + hash-map shape (two-sum); other shapes
 * (stack, list) get their own small renderers as they're added.
 */
interface Props {
  steps: Step[];
  title?: string;
}

export default function AlgoViz({ steps, title = 'Watch the reference solution run' }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = steps[i];
  const atEnd = i >= steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (atEnd) { setPlaying(false); return; }
    timer.current = setTimeout(() => setI((n) => Math.min(n + 1, steps.length - 1)), 1300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, i, atEnd, steps.length]);

  function togglePlay() {
    if (atEnd && !playing) { setI(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  }

  const arr: number[] = step?.state?.array ?? [];
  const curIdx: number | undefined = step?.state?.current_idx;
  const complement = step?.state?.complement;
  const curVal = step?.state?.current_val;
  const result: number[] = step?.state?.result_indices ?? [];
  const map: Record<string, number> = step?.state?.map ?? {};
  const mapEntries = Object.entries(map);

  const cellStyle = (idx: number): React.CSSProperties => {
    if (result.includes(idx)) return { borderColor: 'var(--series-2)', background: 'color-mix(in srgb, var(--series-2) 16%, var(--surface-1))', color: 'var(--text-primary)' };
    if (idx === curIdx) return { borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 14%, var(--surface-1))', color: 'var(--text-primary)' };
    return { borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-secondary)' };
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--series-5, #4a3aa7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>
          <path d="M9 6l6 6-6 6" />
        </svg>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{open ? '' : 'from the AlgoTutor engine'}</span>
      </button>

      {open && (
        <div className="border-t px-4 py-5 sm:px-6" style={{ borderColor: 'var(--border)' }}>
          {/* the array */}
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>nums</div>
          <div className="flex flex-wrap gap-2">
            {arr.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold tabular-nums transition-colors" style={cellStyle(idx)}>
                  {v}
                </div>
                <span className="mt-1 font-mono text-[10px]" style={{ color: idx === curIdx ? 'var(--accent)' : 'var(--text-muted)' }}>{idx}</span>
              </div>
            ))}
          </div>

          {/* the check / complement line */}
          <div className="mt-4 min-h-[1.5rem] text-sm" style={{ color: 'var(--text-secondary)' }}>
            {complement !== undefined && (
              <span>
                nums[{curIdx}] = <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{curVal}</span>{' '}
                → need <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{complement}</span>
                {String(complement) in map ? ' — in the map!' : ' — not seen yet'}
              </span>
            )}
            {result.length > 0 && (
              <span style={{ color: 'var(--series-2)', fontWeight: 600 }}>Found: indices [{result.join(', ')}] sum to the target.</span>
            )}
          </div>

          {/* the hash map */}
          <div className="mt-4">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>hash map · value → index</div>
            <div className="flex min-h-[2rem] flex-wrap gap-2">
              {mapEntries.length === 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>empty</span>}
              {mapEntries.map(([k, val]) => (
                <span key={k} className="rounded-md border px-2.5 py-1 font-mono text-xs" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>
                  {k} <span style={{ color: 'var(--text-muted)' }}>→</span> {val}
                </span>
              ))}
            </div>
          </div>

          {/* narration */}
          <div className="mt-4 rounded-lg border p-3 text-sm leading-relaxed" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>
            {step?.message}
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center gap-3">
            <button onClick={togglePlay} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--accent)', color: '#fff' }} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button onClick={() => { setPlaying(false); setI((n) => Math.max(0, n - 1)); }} disabled={i === 0} className="text-sm disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Previous step">◀</button>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={i}
              onChange={(e) => { setPlaying(false); setI(Number(e.target.value)); }}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Step"
            />
            <button onClick={() => { setPlaying(false); setI((n) => Math.min(steps.length - 1, n + 1)); }} disabled={atEnd} className="text-sm disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Next step">▶</button>
            <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}/{steps.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
