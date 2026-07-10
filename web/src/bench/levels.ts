export interface CachePoint {
  bytes: number;
  nsPerOp: number;
}

export interface CacheLevel {
  /** L1, L2, L3, DRAM. */
  label: string;
  /** Largest working set still served at this level; null for DRAM. */
  upToBytes: number | null;
  /** Representative latency of this level, in nanoseconds. */
  ns: number;
}

/** Smallest step up in latency that counts as crossing a cache boundary. */
const MIN_JUMP = 1.45;
/** A plateau is compared against its neighbours over this many samples. */
const W = 3;
/** Two knees closer than this many samples (2 octaves) are one knee, seen twice. */
const MIN_SEPARATION = 4;
/** Beyond L1/L2/L3 → DRAM there is nothing we can name honestly. */
const MAX_KNEES = 3;

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Median-of-three, to keep one unlucky sample from inventing a boundary. */
function smooth(ys: number[]): number[] {
  return ys.map((y, i) => {
    if (i === 0 || i === ys.length - 1) return y;
    return median([ys[i - 1], y, ys[i + 1]]);
  });
}

/**
 * k knees bound k+1 levels, and the last one is always DRAM. A machine with no
 * separable L3 should not be told it has one, and nothing past DRAM gets a name
 * — an earlier version confidently reported a "DRAM → TLB-limited" boundary off
 * a 1.04x step, which is noise wearing a label.
 */
function levelNames(k: number): string[] {
  if (k >= 3) return ['L1', 'L2', 'L3', 'DRAM'];
  if (k === 2) return ['L1', 'L2', 'DRAM'];
  if (k === 1) return ['cache', 'DRAM'];
  return [];
}

/** Indices where latency takes a sustained step up. */
function findKnees(points: CachePoint[]): number[] {
  const logNs = smooth(points.map((p) => Math.log2(p.nsPerOp)));
  const minJump = Math.log2(MIN_JUMP);

  const candidates: { i: number; jump: number }[] = [];
  for (let i = W; i < points.length - W; i++) {
    const below = median(logNs.slice(i - W, i));
    const above = median(logNs.slice(i + 1, i + 1 + W));
    const jump = above - below;
    if (jump >= minJump) candidates.push({ i, jump });
  }

  // Cache boundaries occur in increasing order of working-set size, so walk the
  // candidates forward: cluster the ones that describe the same transition, take
  // the steepest sample from each cluster, and keep the first MAX_KNEES clusters.
  //
  // Keeping the globally steepest three instead loses the L1 boundary on
  // machines whose DRAM ramp is long enough to supply three steeper jumps of its
  // own — which reports L1 as "serves working sets up to 2.8 MiB".
  const clusters: { i: number; jump: number }[] = [];
  for (const c of candidates) {
    const last = clusters[clusters.length - 1];
    if (last && c.i - last.i < MIN_SEPARATION) {
      if (c.jump > last.jump) clusters[clusters.length - 1] = c;
    } else {
      clusters.push(c);
    }
  }
  return clusters.slice(0, MAX_KNEES).map((k) => k.i);
}

/**
 * Summarize a latency-versus-working-set curve as the hierarchy that produced it.
 *
 * Reporting each knee's "latency before / latency after" reads as a
 * contradiction whenever two knees sit close together on a steep ramp: one
 * knee's *after* is 54ns while the next knee's *before* is 21ns, and the table
 * appears to claim two different latencies for L3. Summarizing the plateaus
 * *between* the knees instead gives each level exactly one latency and one
 * capacity, which is also the thing a reader actually wants to know.
 *
 * This is a heuristic over noisy data from a JIT-compiled language in a browser.
 * The knee positions are approximate; the ordering and the ratios are real.
 */
export function detectLevels(points: CachePoint[]): CacheLevel[] {
  if (points.length < 2 * W + 2) return [];

  const knees = findKnees(points);
  const names = levelNames(knees.length);
  if (names.length === 0) return [];

  const bounds = [0, ...knees, points.length];
  return names.map((label, j) => {
    const from = bounds[j];
    const to = bounds[j + 1];
    const segment = points.slice(from, to);
    return {
      label,
      // The last size still served at this level, i.e. the sample before the step.
      upToBytes: j === names.length - 1 ? null : points[to - 1].bytes,
      ns: median(segment.map((p) => p.nsPerOp)),
    };
  });
}
