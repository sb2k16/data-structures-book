export const REPO_URL = 'https://github.com/sb2k16/data-structures-book';

export interface ChapterMeta {
  /** Content-collection id, derived from the filename. */
  id: string;
  /** URL slug. Usually the id; the flagship essay overrides it. */
  slug: string;
  number: string;
  title: string;
  part: string;
  /** One line for the contents page and the OG description. */
  blurb: string;
  /** Set when the chapter is rendered by a hand-authored page, not the loader. */
  custom?: boolean;
}

export const PARTS = [
  'Foundations',
  'Linear Structures',
  'Non-Linear Structures',
  'Algorithm Design',
  'Advanced Topics',
  'Storage Engines at Scale',
] as const;

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'introduction',
    slug: 'introduction',
    number: '1',
    title: 'Introduction to Data Structures and Algorithms',
    part: 'Foundations',
    blurb: 'What a data structure actually is, and why the choice of one decides the shape of everything above it.',
  },
  {
    id: 'complexity-analysis',
    slug: 'complexity-analysis',
    number: '2',
    title: 'Time and Space Complexity Analysis',
    part: 'Foundations',
    blurb: 'Big-O, and the two things it hides — the constant factor and the memory hierarchy — that decide which O(n) actually wins. Measured live.',
    custom: true,
  },
  {
    id: 'basic-data-structures',
    slug: 'basic-data-structures',
    number: '3',
    title: 'Arrays and Strings',
    part: 'Linear Structures',
    blurb: 'The structure the hardware loves: why contiguity makes arrays fast, how layout (AoS vs SoA) decides their speed, and where columnar databases take it. Measured live.',
    custom: true,
  },
  {
    id: 'concurrency-fundamentals',
    slug: 'concurrency-fundamentals',
    number: '3.5',
    title: 'Concurrency for Data Structures',
    part: 'Linear Structures',
    blurb: 'Locks, atomics, and what "thread-safe" costs you — with the data race and its fix animated step by step.',
    custom: true,
  },
  {
    id: 'memory-hierarchy-and-performance',
    slug: 'memory-hierarchy',
    number: '3.6',
    title: 'Memory Hierarchy and Performance',
    part: 'Linear Structures',
    blurb: 'Cache lines, prefetchers, and the 100× that Big-O cannot see. Measured live, in your browser.',
    custom: true,
  },
  {
    id: 'linked-lists',
    slug: 'linked-lists',
    number: '4',
    title: 'Linked Lists',
    part: 'Linear Structures',
    blurb: 'O(1) insertion — bought by giving up the contiguity that made arrays fast, a trade real hardware rarely rewards. Measured live.',
    custom: true,
  },
  {
    id: 'stacks-and-queues',
    slug: 'stacks-and-queues',
    number: '5',
    title: 'Stacks and Queues',
    part: 'Linear Structures',
    blurb: 'The two most useful restrictions on a sequence — LIFO and FIFO — running everything from your call stack to message brokers.',
    custom: true,
  },
  {
    id: 'trees-and-binary-trees',
    slug: 'trees-and-binary-trees',
    number: '6',
    title: 'Trees and Binary Trees',
    part: 'Non-Linear Structures',
    blurb: 'Ordering and O(log n) at once — the thing hash tables threw away — plus why databases don’t actually use binary trees.',
    custom: true,
  },
  {
    id: 'string-search-algorithms',
    slug: 'string-search-algorithms',
    number: '7',
    title: 'String Search Algorithms',
    part: 'Non-Linear Structures',
    blurb: 'KMP, Boyer-Moore, Rabin-Karp — and why the naive scan often wins in practice.',
  },
  {
    id: 'recursion-and-backtracking',
    slug: 'recursion-and-backtracking',
    number: '8',
    title: 'Recursion and Backtracking',
    part: 'Non-Linear Structures',
    blurb: 'The call stack as a data structure, and pruning as the only thing that makes search tractable.',
  },
  {
    id: 'sorting-algorithms',
    slug: 'sorting-algorithms',
    number: '9',
    title: 'Sorting Algorithms',
    part: 'Non-Linear Structures',
    blurb: 'From quicksort to Tim Sort, plus the branch predictor that decides which one is fast today.',
  },
  {
    id: 'hash-tables-and-hashing',
    slug: 'hash-tables-and-hashing',
    number: '10',
    title: 'Hash Tables and Hashing',
    part: 'Non-Linear Structures',
    blurb: 'Why they exist, why chaining loses to open addressing on real hardware, and how the same idea scales from a dict to OpenSearch shard routing. Measured live.',
    custom: true,
  },
  {
    id: 'graphs',
    slug: 'graphs',
    number: '11',
    title: 'Graphs',
    part: 'Non-Linear Structures',
    blurb: 'Traversal, shortest paths, A*, flow, and the representation choices that dominate runtime.',
  },
  {
    id: 'dynamic-programming',
    slug: 'dynamic-programming',
    number: '12',
    title: 'Dynamic Programming',
    part: 'Algorithm Design',
    blurb: 'A taxonomy of DP patterns, and the space optimizations that turn a table into a row.',
  },
  {
    id: 'searching-algorithms',
    slug: 'searching-algorithms',
    number: '13',
    title: 'Searching Algorithms',
    part: 'Algorithm Design',
    blurb: 'Binary search, and why a linear scan beats it on small arrays every single time.',
  },
  {
    id: 'advanced-data-structures',
    slug: 'advanced-data-structures',
    number: '14',
    title: 'Heaps, Tries, and Beyond',
    part: 'Algorithm Design',
    blurb: 'Fibonacci heaps, suffix arrays, persistent structures, and when the constant factor kills them.',
  },
  {
    id: 'problem-solving-strategies',
    slug: 'problem-solving-strategies',
    number: '15',
    title: 'Problem Solving Strategies',
    part: 'Algorithm Design',
    blurb: 'Pattern recognition as a learnable skill, with a framework for the interview and the job.',
  },
  {
    id: 'greedy-algorithms',
    slug: 'greedy-algorithms',
    number: '16',
    title: 'Greedy Algorithms',
    part: 'Algorithm Design',
    blurb: 'When local choices are provably global, and how to tell before you ship.',
  },
  {
    id: 'divide-and-conquer',
    slug: 'divide-and-conquer',
    number: '17',
    title: 'Divide and Conquer',
    part: 'Algorithm Design',
    blurb: 'Recurrences, the master theorem, and cache-oblivious algorithms that win for free.',
  },
  {
    id: 'advanced-topics',
    slug: 'advanced-topics',
    number: '18',
    title: 'Modern Optimizations',
    part: 'Advanced Topics',
    blurb: 'SIMD, branchless code, false sharing, and the tricks that separate fast from fastest.',
  },
  {
    id: 'benchmarking-and-load-testing',
    slug: 'benchmarking-and-load-testing',
    number: '19',
    title: 'Benchmarking and Load Testing',
    part: 'Advanced Topics',
    blurb: 'How to measure without lying to yourself. The chapter most books skip entirely.',
  },
  {
    id: 'b-trees',
    slug: 'b-trees',
    number: '20',
    title: 'B-Trees',
    part: 'Storage Engines at Scale',
    blurb: 'Why every database index is a B-tree and not a binary tree: wide, cache-line-sized nodes turn 20 cache misses into a handful. ~8× faster, measured live.',
    custom: true,
  },
  {
    id: 'lsm-trees',
    slug: 'lsm-trees',
    number: '21',
    title: 'LSM Trees',
    part: 'Storage Engines at Scale',
    blurb: 'Turning every random write into a sequential append — the engine behind RocksDB, Cassandra, and the write path of modern data infrastructure.',
    custom: true,
  },
];

export const BY_SLUG = new Map(CHAPTERS.map((c) => [c.slug, c]));

export function neighbors(slug: string): { prev?: ChapterMeta; next?: ChapterMeta } {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  if (i === -1) return {};
  return { prev: CHAPTERS[i - 1], next: CHAPTERS[i + 1] };
}

export function byPart(): { part: string; chapters: ChapterMeta[] }[] {
  return PARTS.map((part) => ({ part, chapters: CHAPTERS.filter((c) => c.part === part) }));
}
