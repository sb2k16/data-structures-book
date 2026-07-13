import { useEffect, useRef, useState } from 'react';
import type { Step } from '../../lib/traces';

/**
 * Plays a step-by-step algorithm trace produced by the AlgoTutor engine
 * (algo-tutor/engine). The engine emits one event per step; we ship the trace
 * as static JSON and animate it here with play / scrub controls — reusing
 * AlgoTutor's real value (the traces) without running it as a separate app.
 *
 * `kind` selects the renderer for the trace's state shape:
 *   twoSum — array + hash map     kadane — array + running window
 *   parens — string + stack       list   — nodes + flipping pointers
 */
type Kind = 'twoSum' | 'kadane' | 'parens' | 'list';

interface Props {
  steps: Step[];
  kind: Kind;
  title?: string;
}

const GREEN = { border: 'var(--series-2)', bg: 'color-mix(in srgb, var(--series-2) 16%, var(--surface-1))' };
const ACCENT = { border: 'var(--accent)', bg: 'color-mix(in srgb, var(--accent) 14%, var(--surface-1))' };
const ACCENT_SOFT = { border: 'color-mix(in srgb, var(--accent) 45%, var(--border))', bg: 'color-mix(in srgb, var(--accent) 6%, var(--surface-1))' };
const NEUTRAL = { border: 'var(--border)', bg: 'var(--surface-1)' };

function Cell({ v, label, s }: { v: string | number; label?: string | number; s: { border: string; bg: string } }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-semibold tabular-nums transition-colors"
        style={{ borderColor: s.border, background: s.bg, color: 'var(--text-primary)' }}
      >
        {v}
      </div>
      {label !== undefined && <span className="mt-1 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{children}</div>;
}

function Stat({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <span className="rounded-md border px-2.5 py-1 text-xs" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>
      {k} <span className="font-mono font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>{v}</span>
    </span>
  );
}

function TwoSumStage({ st }: { st: any }) {
  const arr: number[] = st.array ?? [];
  const result: number[] = st.result_indices ?? [];
  const map: Record<string, number> = st.map ?? {};
  const cellS = (i: number) => (result.includes(i) ? GREEN : i === st.current_idx ? ACCENT : NEUTRAL);
  return (
    <>
      <Label>nums</Label>
      <div className="flex flex-wrap gap-2">{arr.map((v, i) => <Cell key={i} v={v} label={i} s={cellS(i)} />)}</div>
      <div className="mt-4 min-h-[1.5rem] text-sm" style={{ color: 'var(--text-secondary)' }}>
        {st.complement !== undefined && (
          <span>nums[{st.current_idx}] = <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{st.current_val}</span> → need <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{st.complement}</span>{String(st.complement) in map ? ' — in the map!' : ' — not seen yet'}</span>
        )}
        {result.length > 0 && <span style={{ color: 'var(--series-2)', fontWeight: 600 }}>Found: indices [{result.join(', ')}] sum to the target.</span>}
      </div>
      <div className="mt-4"><Label>hash map · value → index</Label>
        <div className="flex min-h-[2rem] flex-wrap gap-2">
          {Object.entries(map).length === 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>empty</span>}
          {Object.entries(map).map(([k, val]) => <span key={k} className="rounded-md border px-2.5 py-1 font-mono text-xs" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>{k} <span style={{ color: 'var(--text-muted)' }}>→</span> {val}</span>)}
        </div>
      </div>
    </>
  );
}

function KadaneStage({ st }: { st: any }) {
  const arr: number[] = st.array ?? [];
  const inBest = (i: number) => st.best_start <= i && i <= st.best_end && st.max_sum !== undefined;
  const inWindow = (i: number) => st.cur_start <= i && i <= st.current_index;
  const cellS = (i: number) => (inBest(i) ? GREEN : inWindow(i) ? ACCENT_SOFT : NEUTRAL);
  const border = (i: number) => (i === st.current_index ? 'var(--accent)' : cellS(i).border);
  return (
    <>
      <Label>nums · <span style={{ color: 'var(--series-2)' }}>green = best so far</span>, <span style={{ color: 'var(--accent)' }}>blue = current run</span></Label>
      <div className="flex flex-wrap gap-2">{arr.map((v, i) => <Cell key={i} v={v} label={i} s={{ border: border(i), bg: cellS(i).bg }} />)}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Stat k="current run" v={st.current_sum} />
        <Stat k="best sum" v={st.max_sum} />
      </div>
    </>
  );
}

function ParensStage({ st }: { st: any }) {
  const s: string = st.s ?? '';
  const stack: string[] = st.stack ?? [];
  return (
    <>
      <Label>input</Label>
      <div className="flex flex-wrap gap-2">{[...s].map((c, i) => <Cell key={i} v={c} label={i} s={i === st.current_index ? ACCENT : NEUTRAL} />)}</div>
      <div className="mt-4"><Label>stack {stack.length > 0 && <span style={{ textTransform: 'none', letterSpacing: 0 }}>(top on the right)</span>}</Label>
        <div className="flex min-h-[2.75rem] flex-wrap items-end gap-2">
          {stack.length === 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>empty</span>}
          {stack.map((c, i) => <Cell key={i} v={c} label={i === stack.length - 1 ? 'top' : undefined} s={i === stack.length - 1 ? ACCENT : NEUTRAL} />)}
        </div>
      </div>
      {st.valid === false && <div className="mt-3 text-sm font-semibold" style={{ color: '#e34948' }}>✗ Not valid.</div>}
      {st.valid === true && (st.current_index ?? -1) >= s.length - 1 && <div className="mt-3 text-sm font-semibold" style={{ color: 'var(--series-2)' }}>✓ Valid — every bracket matched, stack empty.</div>}
    </>
  );
}

function ListStage({ st }: { st: any }) {
  const nodes: { id: number; val: number }[] = st.nodes ?? [];
  const nextMap: Record<string, number> = st.next_map ?? {};
  const pos = new Map(nodes.map((n, i) => [n.id, i]));
  const arrowFor = (id: number) => {
    const nx = nextMap[String(id)];
    if (nx === undefined || nx === -1) return '⌀';
    return (pos.get(nx) ?? 0) < (pos.get(id) ?? 0) ? '←' : '→';
  };
  const cellS = (id: number) => (id === st.current_id ? ACCENT : id === st.prev_id ? GREEN : NEUTRAL);
  return (
    <>
      <Label>nodes · <span style={{ color: 'var(--accent)' }}>current</span>, <span style={{ color: 'var(--series-2)' }}>prev</span> · arrow = where next points</Label>
      <div className="flex flex-wrap gap-3">
        {nodes.map((n) => (
          <div key={n.id} className="flex flex-col items-center">
            <Cell v={n.val} s={cellS(n.id)} />
            <span className="mt-1 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{arrowFor(n.id)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Stage({ kind, st }: { kind: Kind; st: any }) {
  if (!st) return null;
  if (kind === 'kadane') return <KadaneStage st={st} />;
  if (kind === 'parens') return <ParensStage st={st} />;
  if (kind === 'list') return <ListStage st={st} />;
  return <TwoSumStage st={st} />;
}

export default function AlgoViz({ steps, kind, title = 'Watch the reference solution run' }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = steps[i];
  const atEnd = i >= steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (atEnd) { setPlaying(false); return; }
    timer.current = setTimeout(() => setI((n) => Math.min(n + 1, steps.length - 1)), 1200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, i, atEnd, steps.length]);

  function togglePlay() {
    if (atEnd && !playing) { setI(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2.5 px-4 py-3 text-left" aria-expanded={open}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--series-5, #4a3aa7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}><path d="M9 6l6 6-6 6" /></svg>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{open ? '' : 'from the AlgoTutor engine'}</span>
      </button>

      {open && (
        <div className="border-t px-4 py-5 sm:px-6" style={{ borderColor: 'var(--border)' }}>
          <Stage kind={kind} st={step?.state} />

          <div className="mt-4 rounded-lg border p-3 text-sm leading-relaxed" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>{step?.message}</div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={togglePlay} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--accent)', color: '#fff' }} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={() => { setPlaying(false); setI((n) => Math.max(0, n - 1)); }} disabled={i === 0} className="text-sm disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Previous step">◀</button>
            <input type="range" min={0} max={steps.length - 1} value={i} onChange={(e) => { setPlaying(false); setI(Number(e.target.value)); }} className="flex-1 accent-[var(--accent)]" aria-label="Step" />
            <button onClick={() => { setPlaying(false); setI((n) => Math.min(steps.length - 1, n + 1)); }} disabled={atEnd} className="text-sm disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Next step">▶</button>
            <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}/{steps.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
