# Data Structures on Systems

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Read online](https://img.shields.io/badge/read-online-2a78d6.svg)](https://data-structures-on-systems.vercel.app)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sb2k16/data-structures-book/issues)

**A free, interactive book about data structures as the machine actually runs them.**

Here are two loops. They perform the same number of operations on the same number of elements. Every complexity analysis you have ever been taught calls them both `O(n)`.

```cpp
for (int i = 0; i < n; ++i) sum += data[i];         // Loop A
for (int i = 0; i < n; ++i) sum += data[index[i]];  // Loop B — index is a random permutation
```

Loop B takes **thirty to sixty times longer**. Not thirty percent — thirty times. Nothing is hidden: the two loops issue the same instructions and differ only in the *order* in which they touch memory, and that order matters more than almost any algorithmic choice you will make this year.

Most data structures books stop at Big-O. This one keeps going — into cache lines, prefetchers, memory layout, false sharing, B-trees, LSM-trees, and concurrency — because that is where the performance of real systems is decided.

## → Read it online: **[data-structures-on-systems.vercel.app](https://data-structures-on-systems.vercel.app)**

The site is the book. It's where everything interactive lives:

- **Live benchmarks that run on *your* CPU.** The [memory hierarchy chapter](https://data-structures-on-systems.vercel.app/chapters/memory-hierarchy) measures your machine while you read it — the latency of every cache level, the cost of a miss, what array-of-structures really charges you. No screenshots of someone else's laptop.
- **"Watch it run" visualizations.** Step through two-sum, Kadane's, a BST search, a B-tree split, LSM flush/compaction, a thread race vs. a mutex, and a BFS traversal — animated, at your own pace.
- **Runnable coding problems, in four languages.** Solve them in **C++, Python, Java, or Go**, compiled and judged right in the browser. Prose code snippets carry the same language tabs.
- **[Practice problems](https://data-structures-on-systems.vercel.app/practice)** — short, original concept checks (not interview brain-teasers), also in all four languages.

## Running it locally

This repo *is* the site. The app lives in [`web/`](web/) (Astro + React islands); it reads the
markdown chapters in [`chapters/`](chapters/) and adds the interactive layer on top.

```bash
cd web
npm install
npm run dev     # http://localhost:4321
```

See [`web/README.md`](web/README.md) for how the benchmarks avoid measuring the wrong thing — JIT elimination, prefetcher interference, and the accumulator dependency chain that made an early version report two very different memory layouts as identical.

## Repository layout

```
data-structures-book/
├── web/            The Astro site — the product. Rewritten chapters live in
│                   web/src/pages/chapters/*.mdx; interactive bits in web/src/components/.
├── chapters/       Markdown source for the chapters served straight from markdown.
├── README.md · CONTRIBUTING.md · LICENSE
```

## Contributing

Contributions are welcome — fixes, clearer explanations, better examples, new language tabs.

1. Fork the repo
2. Create a branch (`git checkout -b fix/thing`)
3. Make your change (edit the chapter markdown in `chapters/`, or the site/interactive pieces in `web/`)
4. Run `cd web && npm run build` to check it still builds
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more.

## License

MIT — see [LICENSE](LICENSE). Free to read, fork, and build on.

---

If it helped you see the machine underneath the code, a ⭐ on GitHub — or a note on the [support page](https://data-structures-on-systems.vercel.app/support) — keeps it free and growing.
