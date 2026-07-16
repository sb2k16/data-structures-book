import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
type Kind = 'twoSum' | 'kadane' | 'parens' | 'list' | 'binarySearch' | 'bst' | 'btree' | 'lsm' | 'concurrency';

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
  // Colours stay on a CSS transition (they use var() which motion can't tween);
  // motion adds a springy scale-pop so the active/best cell lifts as the
  // highlight sweeps across the array.
  const pop = s.border === ACCENT.border || s.border === GREEN.border;
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-semibold tabular-nums transition-colors"
        style={{ borderColor: s.border, background: s.bg, color: 'var(--text-primary)' }}
        animate={{ scale: pop ? 1.12 : 1 }}
        transition={{ type: 'spring', stiffness: 460, damping: 24 }}
      >
        {v}
      </motion.div>
      {label !== undefined && <span className="mt-1 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}

/** A stack/queue item that slides in on push and out on pop. */
function StackItem({ children, s }: { children: React.ReactNode; s: { border: string; bg: string } }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex h-11 min-w-[2.75rem] flex-col items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-semibold tabular-nums transition-colors"
      style={{ borderColor: s.border, background: s.bg, color: 'var(--text-primary)' }}
    >
      {children}
    </motion.div>
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
          <AnimatePresence mode="popLayout" initial={false}>
            {Object.entries(map).map(([k, val]) => (
              <motion.span
                key={k}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="rounded-md border px-2.5 py-1 font-mono text-xs"
                style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}
              >
                {k} <span style={{ color: 'var(--text-muted)' }}>→</span> {val}
              </motion.span>
            ))}
          </AnimatePresence>
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
          <AnimatePresence mode="popLayout" initial={false}>
            {stack.map((c, i) => (
              <StackItem key={i} s={i === stack.length - 1 ? ACCENT : NEUTRAL}>{c}</StackItem>
            ))}
          </AnimatePresence>
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

function BinarySearchStage({ st }: { st: any }) {
  const arr: number[] = st.array ?? [];
  const cellS = (i: number) => {
    if (i === st.result && st.result >= 0) return GREEN;
    if (i === st.mid) return ACCENT;
    if (i < st.lo || i > st.hi) return { border: 'var(--border)', bg: 'var(--surface-2)', dim: true };
    return ACCENT_SOFT;
  };
  return (
    <>
      <Label>sorted array · <span style={{ color: 'var(--accent)' }}>blue = midpoint</span>, live window shaded, eliminated half greyed</Label>
      <div className="flex flex-wrap gap-2">
        {arr.map((v, i) => {
          const s = cellS(i) as any;
          return (
            <div key={i} className="flex flex-col items-center" style={{ opacity: s.dim ? 0.35 : 1 }}>
              <Cell v={v} label={i} s={{ border: s.border, bg: s.bg }} />
              <span className="mt-1 h-3 font-mono text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                {i === st.lo && i === st.hi ? 'lo·hi' : i === st.lo ? 'lo' : i === st.hi ? 'hi' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Stat k="target" v={st.target} />
        <Stat k="window" v={`[${st.lo}, ${st.hi}]`} />
        <Stat k="size" v={Math.max(0, st.hi - st.lo + 1)} />
      </div>
    </>
  );
}

/** Lay out a tree: leaves get consecutive x slots, a parent sits above its children's centre. */
function layoutTree(rootId: number, childrenOf: (id: number) => number[]) {
  const pos = new Map<number, { x: number; depth: number }>();
  let leaf = 0;
  let maxDepth = 0;
  const visit = (id: number, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth);
    const kids = childrenOf(id).filter((k) => k !== -1 && k !== undefined && k !== null);
    if (kids.length === 0) {
      const x = leaf++;
      pos.set(id, { x, depth });
      return x;
    }
    const xs = kids.map((k) => visit(k, depth + 1));
    const x = (Math.min(...xs) + Math.max(...xs)) / 2;
    pos.set(id, { x, depth });
    return x;
  };
  if (rootId !== -1 && rootId !== undefined) visit(rootId, 0);
  return { pos, leaves: Math.max(1, leaf), maxDepth };
}

function BSTStage({ st }: { st: any }) {
  const tree: { id: number; val: number; left: number; right: number }[] = st.tree ?? [];
  const byId = new Map(tree.map((n) => [n.id, n]));
  const { pos, leaves, maxDepth } = layoutTree(st.root, (id) => { const n = byId.get(id); return n ? [n.left, n.right] : []; });
  const path: number[] = st.path ?? [];
  const cur = byId.get(st.current_id);
  const found = !!cur && cur.val === st.target; // search hit or freshly-inserted node
  const XU = 62, YU = 74, PAD = 26;
  const W = leaves * XU, H = (maxDepth + 1) * YU;
  const cx = (id: number) => (pos.get(id)!.x + 0.5) * XU;
  const cy = (id: number) => pos.get(id)!.depth * YU + PAD;
  const fill = (id: number) => id === st.current_id ? (found ? 'var(--series-2)' : 'var(--accent)') : path.includes(id) ? 'color-mix(in srgb, var(--accent) 12%, var(--surface-1))' : 'var(--surface-1)';
  const stroke = (id: number) => id === st.current_id ? (found ? 'var(--series-2)' : 'var(--accent)') : path.includes(id) ? 'color-mix(in srgb, var(--accent) 45%, var(--border))' : 'var(--border-strong)';
  const textColor = (id: number) => id === st.current_id ? '#fff' : 'var(--text-primary)';
  return (
    <>
      <Label>binary search tree · <span style={{ color: 'var(--accent)' }}>blue = node being compared</span>, path shaded</Label>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} style={{ maxWidth: '100%', height: 'auto' }} role="img">
          {tree.map((n) => [n.left, n.right].filter((c) => c !== -1).map((c) => (
            <line key={`${n.id}-${c}`} x1={cx(n.id)} y1={cy(n.id)} x2={cx(c)} y2={cy(c)} stroke="var(--border-strong)" strokeWidth={1.5} />
          )))}
          {tree.map((n) => (
            <g key={n.id}>
              <circle cx={cx(n.id)} cy={cy(n.id)} r={18} fill={fill(n.id)} stroke={stroke(n.id)} strokeWidth={2} />
              <text x={cx(n.id)} y={cy(n.id)} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={600} fill={textColor(n.id)} style={{ fontFamily: 'var(--font-mono, monospace)' }}>{n.val}</text>
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}

function BTreeStage({ st }: { st: any }) {
  const tree: { id: number; keys: number[]; children: number[]; leaf: boolean }[] = st.tree ?? [];
  const byId = new Map(tree.map((n) => [n.id, n]));
  const { pos, leaves, maxDepth } = layoutTree(st.root, (id) => byId.get(id)?.children ?? []);
  const KW = 32, KH = 34, GAPX = 34, YU = 92, PAD = 22;
  const nodeW = (n: { keys: number[] }) => n.keys.length * KW + 12;
  const unit = 3 * KW + GAPX; // horizontal slot per leaf
  const W = leaves * unit, H = (maxDepth + 1) * YU;
  const cx = (id: number) => (pos.get(id)!.x + 0.5) * unit;
  const cy = (id: number) => pos.get(id)!.depth * YU + PAD;
  return (
    <>
      <Label>B-tree (order 4: up to 3 keys per node) · <span style={{ color: 'var(--accent)' }}>blue = active node</span>, <span style={{ color: '#e0803a' }}>orange = splitting</span></Label>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} style={{ maxWidth: '100%', height: 'auto' }} role="img">
          {tree.map((n) => n.children.filter((c) => c !== -1).map((c) => (
            <line key={`${n.id}-${c}`} x1={cx(n.id)} y1={cy(n.id) + KH / 2} x2={cx(c)} y2={cy(c) - KH / 2} stroke="var(--border-strong)" strokeWidth={1.5} />
          )))}
          {tree.map((n) => {
            const w = nodeW(n);
            const active = n.id === st.active, splitting = n.id === st.splitting;
            const border = splitting ? '#e0803a' : active ? 'var(--accent)' : 'var(--border-strong)';
            const bg = splitting ? 'color-mix(in srgb, #e0803a 12%, var(--surface-1))' : active ? 'color-mix(in srgb, var(--accent) 10%, var(--surface-1))' : 'var(--surface-1)';
            return (
              <g key={n.id}>
                <rect x={cx(n.id) - w / 2} y={cy(n.id) - KH / 2} width={w} height={KH} rx={7} fill={bg} stroke={border} strokeWidth={2} />
                {n.keys.map((k, ki) => {
                  const kx = cx(n.id) - w / 2 + 6 + ki * KW + KW / 2;
                  return (
                    <g key={ki}>
                      {ki > 0 && <line x1={kx - KW / 2} y1={cy(n.id) - KH / 2 + 5} x2={kx - KW / 2} y2={cy(n.id) + KH / 2 - 5} stroke="var(--border)" strokeWidth={1} />}
                      <text x={kx} y={cy(n.id)} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill={st.promoted === k && (active || splitting) ? 'var(--accent)' : 'var(--text-primary)'} style={{ fontFamily: 'var(--font-mono, monospace)' }}>{k}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}

function Run({ keys, tone }: { keys: number[]; tone: 'l0' | 'l1' }) {
  const border = tone === 'l1' ? 'var(--series-2)' : 'var(--accent)';
  const bg = tone === 'l1' ? 'color-mix(in srgb, var(--series-2) 12%, var(--surface-1))' : 'color-mix(in srgb, var(--accent) 10%, var(--surface-1))';
  return (
    <div className="flex items-center gap-1 rounded-lg border-2 px-1.5 py-1" style={{ borderColor: border, background: bg }}>
      {keys.map((k, i) => <span key={i} className="font-mono text-xs font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>{k}{i < keys.length - 1 && <span style={{ color: 'var(--text-muted)' }}> · </span>}</span>)}
    </div>
  );
}

function LsmStage({ st }: { st: any }) {
  const mem: number[] = st.memtable ?? [];
  const cap: number = st.cap ?? 4;
  const l0: number[][] = st.l0 ?? [];
  const l1: number[][] = st.l1 ?? [];
  const flushing = st.phase === 'flush', compacting = st.phase === 'compact';
  return (
    <>
      <Label>memtable <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)' }}>· in-memory, sorted{flushing ? ' — flushing ↓' : ''}</span></Label>
      <div className="flex flex-wrap gap-2" style={{ opacity: flushing ? 0.5 : 1 }}>
        {Array.from({ length: cap }).map((_, i) => (
          <Cell key={i} v={mem[i] ?? ''} s={i < mem.length ? ACCENT : { border: 'var(--border)', bg: 'var(--surface-2)' }} />
        ))}
      </div>
      <div className="mt-5"><Label>L0 <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)' }}>· on-disk sorted runs (immutable){compacting ? ' — compacting ↓' : ''}</span></Label>
        <div className="flex min-h-[2.25rem] flex-wrap items-center gap-3" style={{ opacity: compacting ? 0.5 : 1 }}>
          {l0.length === 0 ? <span className="text-sm" style={{ color: 'var(--text-muted)' }}>empty</span> : l0.map((run, i) => <Run key={i} keys={run} tone="l0" />)}
        </div>
      </div>
      <div className="mt-5"><Label>L1 <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)' }}>· larger merged run</span></Label>
        <div className="flex min-h-[2.25rem] flex-wrap items-center gap-3">
          {l1.length === 0 ? <span className="text-sm" style={{ color: 'var(--text-muted)' }}>empty</span> : l1.map((run, i) => <Run key={i} keys={run} tone="l1" />)}
        </div>
      </div>
    </>
  );
}

const RACE_INSTR = ['LOAD   r ← counter', 'INC    r', 'STORE  counter ← r'];
const LOCK_INSTR = ['LOCK', 'LOAD   r ← counter', 'INC    r', 'STORE  counter ← r', 'UNLOCK'];

function ThreadCol({ name, t, active, instr }: { name: string; t: any; active: boolean; instr: string[] }) {
  return (
    <div className="flex-1 rounded-lg border-2 p-3" style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'color-mix(in srgb, var(--accent) 6%, var(--surface-1))' : 'var(--surface-1)' }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>{name}</span>
        {t.blocked && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: 'color-mix(in srgb, #e0803a 18%, transparent)', color: '#c06a28' }}>BLOCKED</span>}
      </div>
      <div className="flex flex-col gap-1">
        {instr.map((line, i) => {
          const cur = i === t.pc && !t.blocked;
          return (
            <div key={i} className="rounded px-2 py-1 font-mono text-[11px] leading-tight" style={{ background: cur ? 'var(--accent)' : 'transparent', color: cur ? '#fff' : i < t.pc ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{line}</div>
          );
        })}
      </div>
      <div className="mt-2 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>register r = <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t.reg === null || t.reg === undefined ? '—' : t.reg}</span></div>
    </div>
  );
}

function ConcurrencyStage({ st }: { st: any }) {
  const locked = st.mode === 'locked';
  const instr = locked ? LOCK_INSTR : RACE_INSTR;
  const ts = st.threads ?? [{}, {}];
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-md border-2 px-3 py-1.5 font-mono text-sm font-semibold" style={{ borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 12%, var(--surface-1))', color: 'var(--text-primary)' }}>shared counter = {st.counter}</span>
        {locked && <span className="rounded-md border px-2.5 py-1 text-xs" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>🔒 lock: <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{st.lockOwner === null || st.lockOwner === undefined ? 'free' : st.lockOwner === 0 ? 'Thread A' : 'Thread B'}</span></span>}
      </div>
      <div className="flex gap-3">
        <ThreadCol name="Thread A" t={ts[0]} active={st.active === 0} instr={instr} />
        <ThreadCol name="Thread B" t={ts[1]} active={st.active === 1} instr={instr} />
      </div>
      {st.result === 'lost' && <div className="mt-4 rounded-lg border-2 px-3 py-2 text-sm font-semibold" style={{ borderColor: '#e34948', background: 'color-mix(in srgb, #e34948 8%, transparent)', color: '#e34948' }}>✗ Lost update — two increments ran, but counter = 1. Expected 2.</div>}
      {st.result === 'correct' && <div className="mt-4 rounded-lg border-2 px-3 py-2 text-sm font-semibold" style={{ borderColor: 'var(--series-2)', background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', color: 'var(--series-2)' }}>✓ counter = 2 — both increments landed. The critical section was atomic.</div>}
    </>
  );
}

function Stage({ kind, st }: { kind: Kind; st: any }) {
  if (!st) return null;
  if (kind === 'kadane') return <KadaneStage st={st} />;
  if (kind === 'parens') return <ParensStage st={st} />;
  if (kind === 'list') return <ListStage st={st} />;
  if (kind === 'binarySearch') return <BinarySearchStage st={st} />;
  if (kind === 'bst') return <BSTStage st={st} />;
  if (kind === 'btree') return <BTreeStage st={st} />;
  if (kind === 'lsm') return <LsmStage st={st} />;
  if (kind === 'concurrency') return <ConcurrencyStage st={st} />;
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
