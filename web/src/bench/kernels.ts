/**
 * Measurement kernels for the memory-hierarchy benchmarks.
 *
 * These run in a worker and are the substance of the essay: every number the
 * reader sees is measured on their own machine, not replayed from a fixture.
 *
 * Three things are load-bearing and easy to get wrong:
 *
 *   1. The JIT will delete a loop whose result is unused. Every kernel returns
 *      an accumulator that the caller feeds into `sink`.
 *   2. The hardware prefetcher hides latency for any access pattern it can
 *      predict. Latency kernels chase a pointer through a random cycle so the
 *      next address is unknowable until the current load retires.
 *   3. performance.now() is coarsened for Spectre. A measurement is only valid
 *      if it spans enough work to dwarf that resolution, so each kernel is
 *      calibrated up to a target duration before the timed reps run.
 */

/** Consumes kernel results so nothing can be optimized away. */
export let sink = 0;
export function consume(v: number): void {
  sink += v;
  // Never true, but the JIT cannot prove it.
  if (!Number.isFinite(sink)) throw new Error('unreachable');
}

/** Deterministic PRNG — a reader re-running gets the same access pattern. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sattolo's algorithm: a permutation guaranteed to be a *single* cycle of
 * length n. A plain Fisher-Yates shuffle would give several short cycles, and
 * a chase would revisit a small subset — silently measuring L1 no matter how
 * large the allocation.
 */
export function randomCycle(n: number, seed = 0x9e3779b9): Int32Array {
  const a = new Int32Array(n);
  for (let i = 0; i < n; i++) a[i] = i;
  const rand = mulberry32(seed);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * i); // strictly less than i — this is what makes it one cycle
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** The predictable counterpart: i -> i+1. The prefetcher eats this alive. */
export function sequentialCycle(n: number): Int32Array {
  const a = new Int32Array(n);
  for (let i = 0; i < n - 1; i++) a[i] = i + 1;
  a[n - 1] = 0;
  return a;
}

/**
 * Dependent-load chain. Each iteration's address depends on the previous
 * load's *value*, so loads cannot overlap and we measure true latency rather
 * than bandwidth.
 */
export function chase(next: Int32Array, steps: number): number {
  let p = 0;
  for (let i = 0; i < steps; i++) p = next[p];
  return p;
}

export interface Timing {
  /** Nanoseconds per access — the number that matters. */
  nsPerOp: number;
  /** How many ops the winning rep ran, for the methodology note. */
  ops: number;
}

const TARGET_MS = 40; // long enough to dwarf clock coarsening, short enough to stay responsive
const MIN_STEPS = 50_000;
const MAX_STEPS = 40_000_000;

/**
 * Calibrate to TARGET_MS, then take the *minimum* of several reps. For latency,
 * noise is strictly additive — a scheduler preemption or an interrupt can only
 * make a rep slower, never faster — so the minimum is the best estimate of the
 * hardware's actual latency, and the mean is just a measure of how busy the
 * machine was.
 */
export function timeChase(next: Int32Array, reps = 3): Timing {
  consume(chase(next, Math.min(next.length, 200_000))); // warm caches + tier up the JIT

  let steps = 200_000;
  const t0 = performance.now();
  consume(chase(next, steps));
  const probe = performance.now() - t0;

  if (probe > 0) {
    steps = Math.round(steps * (TARGET_MS / probe));
  }
  steps = Math.max(MIN_STEPS, Math.min(MAX_STEPS, steps));

  let best = Infinity;
  for (let r = 0; r < reps; r++) {
    const start = performance.now();
    consume(chase(next, steps));
    const ms = performance.now() - start;
    if (ms < best) best = ms;
  }
  return { nsPerOp: (best * 1e6) / steps, ops: steps };
}

/**
 * Sums every `stride`-th float. Both the array-of-structures and the
 * structure-of-arrays case run through this same kernel — only `stride`
 * differs — so the comparison cannot be an artifact of two different loops.
 *
 * The four accumulators matter. With a single `sum +=`, each add waits on the
 * previous one and the loop becomes bound by the floating-point adder's
 * latency, not by memory. That floor is high enough to hide the entire effect
 * we are trying to show: a naive version of this benchmark reports AoS and SoA
 * as exactly equal.
 */
export function sumStrided(buf: Float32Array, stride: number, passes: number): number {
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  const len = buf.length;
  const step = stride * 4;
  for (let p = 0; p < passes; p++) {
    for (let i = 0; i + step <= len; i += step) {
      s0 += buf[i];
      s1 += buf[i + stride];
      s2 += buf[i + 2 * stride];
      s3 += buf[i + 3 * stride];
    }
  }
  return s0 + s1 + s2 + s3;
}

export function sumRowMajor(m: Float32Array, n: number, passes: number): number {
  let sum = 0;
  for (let p = 0; p < passes; p++) {
    for (let r = 0; r < n; r++) {
      const base = r * n;
      for (let c = 0; c < n; c++) sum += m[base + c];
    }
  }
  return sum;
}

export function sumColumnMajor(m: Float32Array, n: number, passes: number): number {
  let sum = 0;
  for (let p = 0; p < passes; p++) {
    for (let c = 0; c < n; c++) {
      for (let r = 0; r < n; r++) sum += m[r * n + c];
    }
  }
  return sum;
}

/** Time an arbitrary thunk that returns an accumulator. */
export function timeFn(fn: () => number, reps = 3): number {
  consume(fn());
  let best = Infinity;
  for (let r = 0; r < reps; r++) {
    const start = performance.now();
    consume(fn());
    const ms = performance.now() - start;
    if (ms < best) best = ms;
  }
  return best;
}
