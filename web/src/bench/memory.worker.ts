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
  timeChase,
  timeFn,
  consume,
} from './kernels';
import { detectLevels, type CacheLevel, type CachePoint } from './levels';

export type BenchId = 'cacheCliff' | 'seqVsRand' | 'aosSoa' | 'rowCol';
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

const RUNNERS: Record<BenchId, () => void> = {
  cacheCliff: runCacheCliff,
  seqVsRand: runSeqVsRand,
  aosSoa: runAosSoa,
  rowCol: runRowCol,
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
