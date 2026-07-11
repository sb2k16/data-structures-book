/// <reference lib="webworker" />
/**
 * Runs the benchmark suite off the main thread so the page stays responsive
 * and so the measurements aren't polluted by rendering work.
 *
 * Results stream back point-by-point: a cache-cliff sweep takes several seconds
 * and watching the curve build is most of the appeal.
 */
import {
  chase,
  randomCycle,
  sequentialCycle,
  sumStrided,
  sumRowMajor,
  sumColumnMajor,
  sumLight,
  sumHeavy,
  timeChase,
  timeFn,
  consume,
} from './kernels';
import { detectLevels, type CacheLevel, type CachePoint } from './levels';

export type BenchId =
  | 'cacheCliff'
  | 'seqVsRand'
  | 'aosSoa'
  | 'rowCol'
  | 'constantFactor'
  | 'arrayVsList'
  | 'hashProbe'
  | 'btreeVsBst';
export type { CacheLevel, CachePoint };

export interface BarPoint {
  label: string;
  nsPerOp: number;
  detail: string;
}

export type WorkerOut =
  | { type: 'point'; bench: BenchId; point: CachePoint | BarPoint }
  | { type: 'progress'; bench: BenchId; done: number; total: number }
  | { type: 'done'; bench: BenchId; levels?: CacheLevel[] }
  | { type: 'error'; bench: BenchId; message: string };

const KIB = 1024;
const MIB = 1024 * 1024;

/** Cap allocation on memory-constrained devices rather than crashing the tab. */
function maxWorkingSet(): number {
  const gb = (self.navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (gb <= 2) return 16 * MIB;
  if (gb <= 4) return 32 * MIB;
  return 128 * MIB;
}

/** Geometric sweep, two points per doubling. */
function sizeSweep(minBytes: number, maxBytes: number): number[] {
  const out: number[] = [];
  const step = Math.SQRT2;
  for (let b = minBytes; b <= maxBytes; b *= step) {
    // Round to a whole number of Int32s so the cycle covers the allocation exactly.
    const elems = Math.max(1024, Math.round(b / 4));
    const bytes = elems * 4;
    if (out[out.length - 1] !== bytes) out.push(bytes);
  }
  return out;
}


function post(msg: WorkerOut) {
  (self as unknown as Worker).postMessage(msg);
}

function runCacheCliff() {
  const sizes = sizeSweep(4 * KIB, maxWorkingSet());
  const points: CachePoint[] = [];

  sizes.forEach((bytes, i) => {
    const cycle = randomCycle(bytes / 4);
    const { nsPerOp } = timeChase(cycle);
    const point: CachePoint = { bytes, nsPerOp };
    points.push(point);
    post({ type: 'point', bench: 'cacheCliff', point });
    post({ type: 'progress', bench: 'cacheCliff', done: i + 1, total: sizes.length });
  });

  post({ type: 'done', bench: 'cacheCliff', levels: detectLevels(points) });
}

function runSeqVsRand() {
  const n = (32 * MIB) / 4;
  const seq = sequentialCycle(n);
  const seqT = timeChase(seq);
  post({
    type: 'point',
    bench: 'seqVsRand',
    point: {
      label: 'Sequential',
      nsPerOp: seqT.nsPerOp,
      detail: 'next address is i+1 — the prefetcher has the line before you ask',
    },
  });
  post({ type: 'progress', bench: 'seqVsRand', done: 1, total: 2 });

  const rnd = randomCycle(n);
  const rndT = timeChase(rnd);
  post({
    type: 'point',
    bench: 'seqVsRand',
    point: {
      label: 'Random',
      nsPerOp: rndT.nsPerOp,
      detail: 'next address is unknowable until this load retires — full DRAM latency, every time',
    },
  });
  post({ type: 'progress', bench: 'seqVsRand', done: 2, total: 2 });
  post({ type: 'done', bench: 'seqVsRand' });
}

function runArrayVsList() {
  // The same 32 MiB of integers, visited in a full cycle. Laid out in order,
  // this is what walking a std::vector costs; scattered into a random cycle, it
  // is what chasing a std::list's node->next pointers costs. Same element count,
  // same O(n), same "one dereference per element".
  const n = (32 * MIB) / 4;

  const arr = sequentialCycle(n);
  const arrT = timeChase(arr);
  post({
    type: 'point',
    bench: 'arrayVsList',
    point: {
      label: 'Array (std::vector)',
      nsPerOp: arrT.nsPerOp,
      detail: 'elements are contiguous, so the prefetcher has the next one before you ask',
    },
  });
  post({ type: 'progress', bench: 'arrayVsList', done: 1, total: 2 });

  const list = randomCycle(n);
  const listT = timeChase(list);
  post({
    type: 'point',
    bench: 'arrayVsList',
    point: {
      label: 'Linked list (std::list)',
      nsPerOp: listT.nsPerOp,
      detail: 'each node->next lands somewhere unpredictable — a cache miss per element',
    },
  });
  post({ type: 'progress', bench: 'arrayVsList', done: 2, total: 2 });
  post({ type: 'done', bench: 'arrayVsList' });
}

function runAosSoa() {
  // 16 floats = a 64-byte particle: position, velocity, orientation, mass, flags.
  // At 8 fields the AoS array is only 31 MiB and the effect is a muted 2.6x;
  // at 16 the struct is exactly one cache line and the mechanism is unmistakable.
  const FIELDS = 16;
  const n = maxWorkingSet() >= 128 * MIB ? 1_000_000 : 400_000;
  const PASSES = 3;

  const aos = new Float32Array(n * FIELDS); // 64 MiB at n = 1M
  const soa = new Float32Array(n); //  4 MiB
  for (let i = 0; i < n; i++) {
    aos[i * FIELDS] = i * 0.5;
    soa[i] = i * 0.5;
  }

  const aosMs = timeFn(() => sumStrided(aos, FIELDS, PASSES));
  const utilization = (4 / (FIELDS * 4)) * 100;
  post({
    type: 'point',
    bench: 'aosSoa',
    point: {
      label: 'Array of structures',
      nsPerOp: (aosMs * 1e6) / (n * PASSES),
      detail: `the loop wants one float; the cache hauls in the whole particle — ${utilization.toFixed(1)}% of the bytes moved are ever read`,
    },
  });
  post({ type: 'progress', bench: 'aosSoa', done: 1, total: 2 });

  const soaMs = timeFn(() => sumStrided(soa, 1, PASSES));
  post({
    type: 'point',
    bench: 'aosSoa',
    point: {
      label: 'Structure of arrays',
      nsPerOp: (soaMs * 1e6) / (n * PASSES),
      detail: 'every byte of every line fetched is a byte the loop wanted',
    },
  });
  post({ type: 'progress', bench: 'aosSoa', done: 2, total: 2 });
  post({ type: 'done', bench: 'aosSoa' });
}

function runRowCol() {
  const n = 2048; // 2048² × 4B = 16 MiB
  const m = new Float32Array(n * n);
  for (let i = 0; i < m.length; i++) m[i] = i & 0xff;

  const rowMs = timeFn(() => sumRowMajor(m, n, 1));
  post({
    type: 'point',
    bench: 'rowCol',
    point: {
      label: 'Row-major',
      nsPerOp: (rowMs * 1e6) / (n * n),
      detail: 'walks memory in the order it is laid out',
    },
  });
  post({ type: 'progress', bench: 'rowCol', done: 1, total: 2 });

  const colMs = timeFn(() => sumColumnMajor(m, n, 1));
  post({
    type: 'point',
    bench: 'rowCol',
    point: {
      label: 'Column-major',
      nsPerOp: (colMs * 1e6) / (n * n),
      detail: 'strides 8 KiB per step — a new cache line, and a new page, every access',
    },
  });
  post({ type: 'progress', bench: 'rowCol', done: 2, total: 2 });
  post({ type: 'done', bench: 'rowCol' });
}

function runConstantFactor() {
  // 64 KiB — fits in L2 on every machine, so neither loop waits on memory and
  // the gap you measure is pure per-element work: the constant Big-O discards.
  const n = 16384;
  const buf = new Uint32Array(n);
  for (let i = 0; i < n; i++) buf[i] = (i * 2654435761) >>> 0;
  const passes = Math.round(40_000_000 / n);

  const lightMs = timeFn(() => sumLight(buf, passes));
  post({
    type: 'point',
    bench: 'constantFactor',
    point: {
      label: 'Sum each value',
      nsPerOp: (lightMs * 1e6) / (n * passes),
      detail: 'one add per element — a checksum',
    },
  });
  post({ type: 'progress', bench: 'constantFactor', done: 1, total: 2 });

  const heavyMs = timeFn(() => sumHeavy(buf, passes));
  post({
    type: 'point',
    bench: 'constantFactor',
    point: {
      label: 'Hash each value',
      nsPerOp: (heavyMs * 1e6) / (n * passes),
      detail: '~15 integer ops per element — same loop, same O(n), more work inside',
    },
  });
  post({ type: 'progress', bench: 'constantFactor', done: 2, total: 2 });
  post({ type: 'done', bench: 'constantFactor' });
}

function runHashProbe() {
  // Both structures hold the same 2M keys at load factor 0.5 — the regime a
  // well-tuned hash table runs in. Both are "O(1) average". The difference is
  // pure memory layout: open addressing probes a flat array (stays on one cache
  // line); separate chaining dereferences a heap-scattered node (an extra miss).
  const n = 2_000_000;
  const cap = Math.ceil(n / 0.5);

  // Deterministic keys, so a reader re-running gets the same table.
  let s = 0x9e3779b9;
  const rng = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const hash = (k: number) => (Math.imul(k, 2654435761) >>> 0) % cap;

  const keys = new Int32Array(n);
  for (let i = 0; i < n; i++) keys[i] = (Math.floor(rng() * 2 ** 31) | 1) >>> 0; // odd, non-zero

  // Open addressing: one flat array, linear probe. 0 marks an empty slot.
  const oaKeys = new Int32Array(cap);
  for (let i = 0; i < n; i++) {
    let h = hash(keys[i]);
    while (oaKeys[h] !== 0) h = h + 1 === cap ? 0 : h + 1;
    oaKeys[h] = keys[i];
  }

  // Separate chaining: bucket heads plus node arrays, with nodes placed in
  // SHUFFLED physical order so `next` jumps around memory — exactly what a heap
  // allocator does to real list nodes.
  const head = new Int32Array(cap).fill(-1);
  const nodeKey = new Int32Array(n);
  const nodeNext = new Int32Array(n);
  const order = new Int32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  for (let i = 0; i < n; i++) {
    const slot = order[i];
    const b = hash(keys[i]);
    nodeKey[slot] = keys[i];
    nodeNext[slot] = head[b];
    head[b] = slot;
  }

  // Query present keys in random order — realistic, and worst case for the cache.
  const Q = 1_000_000;
  const queries = new Int32Array(Q);
  for (let i = 0; i < Q; i++) queries[i] = keys[Math.floor(rng() * n)];

  const lookupOpen = () => {
    let found = 0;
    for (let i = 0; i < Q; i++) {
      const key = queries[i];
      let h = hash(key);
      while (oaKeys[h] !== 0) {
        if (oaKeys[h] === key) { found++; break; }
        h = h + 1 === cap ? 0 : h + 1;
      }
    }
    return found;
  };
  const lookupChain = () => {
    let found = 0;
    for (let i = 0; i < Q; i++) {
      const key = queries[i];
      for (let p = head[hash(key)]; p !== -1; p = nodeNext[p]) {
        if (nodeKey[p] === key) { found++; break; }
      }
    }
    return found;
  };

  const openMs = timeFn(lookupOpen);
  post({
    type: 'point',
    bench: 'hashProbe',
    point: {
      label: 'Open addressing',
      nsPerOp: (openMs * 1e6) / Q,
      detail: 'keys live in one flat array; a linear probe stays on the same cache line',
    },
  });
  post({ type: 'progress', bench: 'hashProbe', done: 1, total: 2 });

  const chainMs = timeFn(lookupChain);
  post({
    type: 'point',
    bench: 'hashProbe',
    point: {
      label: 'Separate chaining',
      nsPerOp: (chainMs * 1e6) / Q,
      detail: 'every lookup dereferences a heap-scattered node — one extra cache miss',
    },
  });
  post({ type: 'progress', bench: 'hashProbe', done: 2, total: 2 });
  post({ type: 'done', bench: 'hashProbe' });
}

function runBtreeVsBst() {
  // Same 2M sorted keys in both structures. Both lookups are O(log n). A binary
  // search tree does one comparison per node and follows a pointer to a
  // heap-scattered child — a cache miss on every level, ~21 levels deep. A
  // B-tree packs 32 keys into a flat, cache-line-sized node, so it does a
  // handful of comparisons per cache line and its tree is only ~4 levels deep.
  const n = 2_000_000;
  const B = 32;
  const keys = new Int32Array(n);
  for (let i = 0; i < n; i++) keys[i] = i * 2 + 1; // sorted, distinct, non-zero

  let s = 0x1234567;
  const rng = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const shuffle = (a: Int32Array) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
  };

  // Binary search tree with nodes placed at SHUFFLED slots, so parent→child
  // jumps around memory the way heap-allocated tree nodes really do.
  const bKey = new Int32Array(n);
  const bLeft = new Int32Array(n).fill(-1);
  const bRight = new Int32Array(n).fill(-1);
  const slot = new Int32Array(n);
  for (let i = 0; i < n; i++) slot[i] = i;
  shuffle(slot);
  let bstRoot = -1;
  let alloced = 0;
  const insertOrder = Int32Array.from(keys);
  shuffle(insertOrder); // random insertion → roughly balanced, avoids a degenerate chain
  for (let q = 0; q < n; q++) {
    const k = insertOrder[q];
    if (bstRoot === -1) {
      bstRoot = slot[alloced++];
      bKey[bstRoot] = k;
      continue;
    }
    let cur = bstRoot;
    for (;;) {
      if (k < bKey[cur]) {
        if (bLeft[cur] === -1) { const nn = slot[alloced++]; bKey[nn] = k; bLeft[cur] = nn; break; }
        cur = bLeft[cur];
      } else {
        if (bRight[cur] === -1) { const nn = slot[alloced++]; bKey[nn] = k; bRight[cur] = nn; break; }
        cur = bRight[cur];
      }
    }
  }

  // Static B-tree, bulk-loaded bottom-up into flat typed arrays.
  const keysPer = B;
  const childPer = B + 1;
  const nk: number[] = [];
  const nc: number[] = [];
  const nch: number[] = [];
  const newNode = () => {
    const id = nc.length;
    nc.push(0);
    for (let i = 0; i < keysPer; i++) nk.push(0);
    for (let i = 0; i < childPer; i++) nch.push(-1);
    return id;
  };
  let level: { min: number; id: number }[] = [];
  for (let i = 0; i < n; ) {
    const id = newNode();
    const take = Math.min(keysPer, n - i);
    for (let c = 0; c < take; c++) nk[id * keysPer + c] = keys[i + c];
    nc[id] = take;
    level.push({ min: keys[i], id });
    i += take;
  }
  while (level.length > 1) {
    const parents: { min: number; id: number }[] = [];
    for (let i = 0; i < level.length; ) {
      const id = newNode();
      const take = Math.min(childPer, level.length - i);
      let cnt = 0;
      for (let c = 0; c < take; c++) {
        nch[id * childPer + c] = level[i + c].id;
        if (c > 0) { nk[id * keysPer + (c - 1)] = level[i + c].min; cnt++; }
      }
      nc[id] = cnt;
      parents.push({ min: level[i].min, id });
      i += take;
    }
    level = parents;
  }
  const btRoot = level[0].id;
  const nodeKeys = Int32Array.from(nk);
  const nodeCount = Int32Array.from(nc);
  const nodeChild = Int32Array.from(nch);

  const Q = 1_000_000;
  const queries = new Int32Array(Q);
  for (let i = 0; i < Q; i++) queries[i] = keys[Math.floor(rng() * n)];

  const lookupBst = () => {
    let hits = 0;
    for (let i = 0; i < Q; i++) {
      const target = queries[i];
      let cur = bstRoot;
      while (cur !== -1) {
        const k = bKey[cur];
        if (target === k) { hits++; break; }
        cur = target < k ? bLeft[cur] : bRight[cur];
      }
    }
    return hits;
  };
  const lookupBtree = () => {
    let hits = 0;
    for (let i = 0; i < Q; i++) {
      const target = queries[i];
      let node = btRoot;
      for (;;) {
        const cnt = nodeCount[node];
        const base = node * keysPer;
        let j = 0;
        while (j < cnt && target > nodeKeys[base + j]) j++;
        if (j < cnt && target === nodeKeys[base + j]) { hits++; break; }
        const child = nodeChild[node * childPer + j];
        if (child === -1) break;
        node = child;
      }
    }
    return hits;
  };

  const bstMs = timeFn(lookupBst);
  post({
    type: 'point',
    bench: 'btreeVsBst',
    point: {
      label: 'Binary search tree',
      nsPerOp: (bstMs * 1e6) / Q,
      detail: 'one comparison per node, chasing a scattered pointer — a cache miss on every level, ~21 deep',
    },
  });
  post({ type: 'progress', bench: 'btreeVsBst', done: 1, total: 2 });

  const btMs = timeFn(lookupBtree);
  post({
    type: 'point',
    bench: 'btreeVsBst',
    point: {
      label: 'B-tree (32 keys / node)',
      nsPerOp: (btMs * 1e6) / Q,
      detail: 'many keys per cache-line-sized node — a shallow tree, a few misses per lookup',
    },
  });
  post({ type: 'progress', bench: 'btreeVsBst', done: 2, total: 2 });
  post({ type: 'done', bench: 'btreeVsBst' });
}

const RUNNERS: Record<BenchId, () => void> = {
  cacheCliff: runCacheCliff,
  seqVsRand: runSeqVsRand,
  aosSoa: runAosSoa,
  rowCol: runRowCol,
  constantFactor: runConstantFactor,
  arrayVsList: runArrayVsList,
  hashProbe: runHashProbe,
  btreeVsBst: runBtreeVsBst,
};

self.onmessage = (e: MessageEvent<{ bench: BenchId }>) => {
  const { bench } = e.data;
  try {
    RUNNERS[bench]();
  } catch (err) {
    post({
      type: 'error',
      bench,
      message: err instanceof Error ? err.message : 'benchmark failed',
    });
  }
};

// Keep the tree-shaker away from the kernels' side-effecting sink.
consume(chase(sequentialCycle(16), 16));
