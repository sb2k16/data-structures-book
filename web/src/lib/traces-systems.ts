// Hand-authored traces for the systems chapters, in the same Step[] shape the
// AlgoTutor engine emits. These structures (B-tree splits, LSM flush/compaction,
// thread interleavings) aren't in the engine, so their steps are authored here.
import type { Step } from './traces';

/* ------------------------------------------------------------------ B-TREE --
 * Order t=2: a node holds at most 3 keys and splits on the 4th, promoting its
 * median to the parent. We insert 40, then 50, then 60 into a tree that starts
 * as a single full leaf — showing a leaf split that grows the root, an insert
 * with room to spare, and a second split into the existing root.
 * state.tree: { id, keys, children (node ids), leaf }[]  · state.root: id
 */
export const btreeTrace: Step[] = [
  { step: 1, type: 'start', message: 'Insert 40. The tree is a single leaf that is already full (3 keys).',
    state: { tree: [{ id: 0, keys: [10, 20, 30], children: [], leaf: true }], root: 0, active: 0 } },
  { step: 2, type: 'descend', message: '40 is greater than every key here, so it belongs in this leaf — but there is no room.',
    state: { tree: [{ id: 0, keys: [10, 20, 30], children: [], leaf: true }], root: 0, active: 0 } },
  { step: 3, type: 'overflow', message: 'Inserting anyway gives 4 keys — one too many. The node overflows and must split.',
    state: { tree: [{ id: 0, keys: [10, 20, 30, 40], children: [], leaf: true }], root: 0, active: 0, splitting: 0 } },
  { step: 4, type: 'split', message: 'Split around the median: 20 moves up, the rest divides into two leaves.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40], children: [], leaf: true },
    ], root: 1, active: 1, promoted: 20 } },
  { step: 5, type: 'done', message: '20 became a new root. The tree grew one level — the only way a B-tree gets taller, and why every leaf stays the same depth.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40], children: [], leaf: true },
    ], root: 1 } },
  { step: 6, type: 'start', message: 'Insert 50. Start at the root [20]: 50 > 20, so descend right.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40], children: [], leaf: true },
    ], root: 1, active: 1 } },
  { step: 7, type: 'descend', message: 'Reach the leaf [30, 40]. It has room, and 50 is the largest — insert at the end.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40], children: [], leaf: true },
    ], root: 1, active: 2 } },
  { step: 8, type: 'done', message: 'Room in the leaf, so no split. Most inserts look exactly like this — cheap.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40, 50], children: [], leaf: true },
    ], root: 1 } },
  { step: 9, type: 'start', message: 'Insert 60. Root [20]: 60 > 20, descend right again.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40, 50], children: [], leaf: true },
    ], root: 1, active: 1 } },
  { step: 10, type: 'descend', message: 'The leaf [30, 40, 50] is full, and 60 belongs here. It will overflow.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40, 50], children: [], leaf: true },
    ], root: 1, active: 2 } },
  { step: 11, type: 'overflow', message: 'Four keys again — split. This time the median 40 has a parent to move up into.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20], children: [0, 2], leaf: false },
      { id: 2, keys: [30, 40, 50, 60], children: [], leaf: true },
    ], root: 1, active: 2, splitting: 2 } },
  { step: 12, type: 'split', message: '40 rises into the existing root [20, 40]; the leaf divides into [30] and [50, 60].',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20, 40], children: [0, 2, 3], leaf: false },
      { id: 2, keys: [30], children: [], leaf: true },
      { id: 3, keys: [50, 60], children: [], leaf: true },
    ], root: 1, active: 1, promoted: 40 } },
  { step: 13, type: 'done', message: 'The root absorbed the promoted key without splitting, so the tree stayed two levels deep. A B-tree of this width holds millions of keys in three or four levels — that is the whole point.',
    state: { tree: [
      { id: 0, keys: [10], children: [], leaf: true },
      { id: 1, keys: [20, 40], children: [0, 2, 3], leaf: false },
      { id: 2, keys: [30], children: [], leaf: true },
      { id: 3, keys: [50, 60], children: [], leaf: true },
    ], root: 1 } },
];

/* -------------------------------------------------------------------- LSM ---
 * Every write lands in a small sorted in-memory buffer (the memtable). When it
 * fills, it is flushed as an immutable sorted run to L0 — a sequential write,
 * never an in-place update. When L0 accumulates runs, compaction merges them
 * into one larger sorted run in L1.
 * state: memtable, cap, l0 (runs), l1 (runs), phase, note
 */
const lsm = (memtable: number[], l0: number[][], l1: number[][], phase: string, note: string): Step['state'] =>
  ({ memtable, cap: 4, l0, l1, phase, note });

export const lsmTrace: Step[] = [
  { step: 1, type: 'write', message: 'Write 30. It goes straight into the in-memory memtable — no disk seek, no in-place update.',
    state: lsm([30], [], [], 'write', 'write 30') },
  { step: 2, type: 'write', message: 'Write 10. The memtable is kept sorted, so 10 slots in front of 30.',
    state: lsm([10, 30], [], [], 'write', 'write 10') },
  { step: 3, type: 'write', message: 'Write 20. Still room, still sorted.',
    state: lsm([10, 20, 30], [], [], 'write', 'write 20') },
  { step: 4, type: 'write', message: 'Write 40. The memtable is now full (4 entries).',
    state: lsm([10, 20, 30, 40], [], [], 'full', 'write 40 — memtable full') },
  { step: 5, type: 'flush', message: 'Flush: the full memtable is written to L0 as one immutable, sorted run — a single sequential write. The memtable is cleared for new writes.',
    state: lsm([], [[10, 20, 30, 40]], [], 'flush', 'flush → L0') },
  { step: 6, type: 'write', message: 'Writes keep coming into a fresh memtable. Write 25.',
    state: lsm([25], [[10, 20, 30, 40]], [], 'write', 'write 25') },
  { step: 7, type: 'write', message: 'Write 15.',
    state: lsm([15, 25], [[10, 20, 30, 40]], [], 'write', 'write 15') },
  { step: 8, type: 'write', message: 'Write 35.',
    state: lsm([15, 25, 35], [[10, 20, 30, 40]], [], 'write', 'write 35') },
  { step: 9, type: 'write', message: 'Write 5. The memtable is full again.',
    state: lsm([5, 15, 25, 35], [[10, 20, 30, 40]], [], 'full', 'write 5 — memtable full') },
  { step: 10, type: 'flush', message: 'Second flush. L0 now holds two runs whose key ranges overlap — a read might have to check both.',
    state: lsm([], [[10, 20, 30, 40], [5, 15, 25, 35]], [], 'flush', 'flush → L0 (2 runs)') },
  { step: 11, type: 'compact', message: 'Compaction: L0 has too many runs, so they are merged into one sorted run in L1 — a k-way merge, again all sequential I/O.',
    state: lsm([], [], [[5, 10, 15, 20, 25, 30, 35, 40]], 'compact', 'compact L0 → L1') },
  { step: 12, type: 'done', message: 'A read checks the memtable first, then each level. Compaction keeps the number of runs bounded, so it trades background write work for fast, sequential writes and predictable reads.',
    state: lsm([], [], [[5, 10, 15, 20, 25, 30, 35, 40]], 'done', 'steady state') },
];

/* ------------------------------------------------------------ CONCURRENCY ---
 * Two threads each run counter++, which compiles to three steps: load, add,
 * store. The RACE trace interleaves them so an update is lost; the LOCKED trace
 * serializes them with a mutex so both increments land.
 * state: counter, threads:[{reg,pc,blocked}], active, lockOwner, result
 * pc indexes into the per-mode instruction list; the renderer holds those.
 */
export const concurrencyRaceTrace: Step[] = [
  { step: 1, type: 'init', message: 'Two threads each run counter++ — which is really three instructions: load counter into a register, increment the register, store it back. counter starts at 0.',
    state: { mode: 'race', counter: 0, active: -1, threads: [{ reg: null, pc: 0 }, { reg: null, pc: 0 }] } },
  { step: 2, type: 'step', message: 'Thread A loads counter (0) into its register.',
    state: { mode: 'race', counter: 0, active: 0, threads: [{ reg: 0, pc: 1 }, { reg: null, pc: 0 }] } },
  { step: 3, type: 'race', message: 'The scheduler switches to Thread B before A finishes. B loads the same counter — still 0. This stale read is the bug.',
    state: { mode: 'race', counter: 0, active: 1, threads: [{ reg: 0, pc: 1 }, { reg: 0, pc: 1 }] } },
  { step: 4, type: 'step', message: 'Thread A increments its register to 1.',
    state: { mode: 'race', counter: 0, active: 0, threads: [{ reg: 1, pc: 2 }, { reg: 0, pc: 1 }] } },
  { step: 5, type: 'step', message: 'Thread A stores 1 back. counter is now 1.',
    state: { mode: 'race', counter: 1, active: 0, threads: [{ reg: 1, pc: 3 }, { reg: 0, pc: 1 }] } },
  { step: 6, type: 'step', message: 'Thread B increments its own (stale) register — from 0 to 1.',
    state: { mode: 'race', counter: 1, active: 1, threads: [{ reg: 1, pc: 3 }, { reg: 1, pc: 2 }] } },
  { step: 7, type: 'lost', message: 'Thread B stores 1, overwriting A’s write. Two increments ran, but counter is 1 — one update was silently lost. This is a data race.',
    state: { mode: 'race', counter: 1, active: 1, threads: [{ reg: 1, pc: 3 }, { reg: 1, pc: 3 }], result: 'lost' } },
];

export const concurrencyLockedTrace: Step[] = [
  { step: 1, type: 'init', message: 'Same two threads, but now a mutex guards the counter. The rule: you must hold the lock to touch it, and only one thread can hold it.',
    state: { mode: 'locked', counter: 0, active: -1, lockOwner: null, threads: [{ reg: null, pc: 0 }, { reg: null, pc: 0 }] } },
  { step: 2, type: 'lock', message: 'Thread A acquires the lock.',
    state: { mode: 'locked', counter: 0, active: 0, lockOwner: 0, threads: [{ reg: null, pc: 1 }, { reg: null, pc: 0 }] } },
  { step: 3, type: 'block', message: 'Thread B tries to lock too, but A holds it — so B blocks. It cannot read or write the counter until the lock is free.',
    state: { mode: 'locked', counter: 0, active: 1, lockOwner: 0, threads: [{ reg: null, pc: 1 }, { reg: null, pc: 0, blocked: true }] } },
  { step: 4, type: 'step', message: 'Alone in the critical section, Thread A loads counter (0).',
    state: { mode: 'locked', counter: 0, active: 0, lockOwner: 0, threads: [{ reg: 0, pc: 2 }, { reg: null, pc: 0, blocked: true }] } },
  { step: 5, type: 'step', message: 'Thread A increments its register to 1.',
    state: { mode: 'locked', counter: 0, active: 0, lockOwner: 0, threads: [{ reg: 1, pc: 3 }, { reg: null, pc: 0, blocked: true }] } },
  { step: 6, type: 'step', message: 'Thread A stores 1. counter is now 1.',
    state: { mode: 'locked', counter: 1, active: 0, lockOwner: 0, threads: [{ reg: 1, pc: 4 }, { reg: null, pc: 0, blocked: true }] } },
  { step: 7, type: 'unlock', message: 'Thread A releases the lock.',
    state: { mode: 'locked', counter: 1, active: 0, lockOwner: null, threads: [{ reg: 1, pc: 5 }, { reg: null, pc: 0, blocked: true }] } },
  { step: 8, type: 'lock', message: 'Only now can Thread B acquire the lock and unblock.',
    state: { mode: 'locked', counter: 1, active: 1, lockOwner: 1, threads: [{ reg: 1, pc: 5 }, { reg: null, pc: 1 }] } },
  { step: 9, type: 'step', message: 'Thread B loads counter — and this time it sees A’s write: 1. No stale read.',
    state: { mode: 'locked', counter: 1, active: 1, lockOwner: 1, threads: [{ reg: 1, pc: 5 }, { reg: 1, pc: 2 }] } },
  { step: 10, type: 'step', message: 'Thread B increments its register to 2.',
    state: { mode: 'locked', counter: 1, active: 1, lockOwner: 1, threads: [{ reg: 1, pc: 5 }, { reg: 2, pc: 3 }] } },
  { step: 11, type: 'step', message: 'Thread B stores 2. counter is now 2.',
    state: { mode: 'locked', counter: 2, active: 1, lockOwner: 1, threads: [{ reg: 1, pc: 5 }, { reg: 2, pc: 4 }] } },
  { step: 12, type: 'done', message: 'Thread B releases the lock. Both increments landed — counter = 2. The lock made the whole load-increment-store sequence atomic, so no interleaving could lose an update.',
    state: { mode: 'locked', counter: 2, active: 1, lockOwner: null, threads: [{ reg: 1, pc: 5 }, { reg: 2, pc: 5 }], result: 'correct' } },
];
