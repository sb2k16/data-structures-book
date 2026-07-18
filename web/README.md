# The website

Astro site that publishes *Data Structures on Systems* at
[sb2k16.github.io](https://sb2k16.github.io), plus the interactive benchmarks that make the
memory-hierarchy chapter run on the reader's own CPU.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Deploys as a static site (Vercel, Netlify, Cloudflare Pages, GitHub Pages — no server needed).
Copy `.env.example` to `.env` to switch on the newsletter form or the ad slot.

## How the chapters get here

Chapters come from two places. The **algorithm** chapters are plain markdown in `../chapters/*.md`,
read directly by `src/content.config.ts` (no copy step; ids are derived from the filename slug). The
11 **systems** chapters that need live benchmarks or "watch it run" visualizations are hand-authored
MDX in `src/pages/chapters/*.mdx`, marked `custom: true` in `src/lib/book.ts` so the dynamic markdown
route doesn't also generate a page at the same URL. Titles, ordering, blurbs, and chapter numbers all
live in `src/lib/book.ts` — the single source of chapter metadata.

The remark/rehype plugins in `src/lib/remark.mjs` adapt the markdown for the web: they strip each
chapter's hand-written table of contents and duplicate H1 (the layout supplies both), hand `mermaid`
blocks to the client-side renderer, group adjacent multi-language code fences into C++/Python/Java/Go
tabs, rewrite `.md` links to site routes, and wrap wide tables in a scroll container.

## The benchmarks

`src/bench/` is the interesting part. Every number a reader sees is measured in their browser, in a
worker, on their hardware. Getting that right is mostly about not measuring the wrong thing:

- **`kernels.ts`** — the measurement loops. Each returns an accumulator that the caller feeds into
  `consume()`, or the JIT deletes the loop. Latency kernels chase a pointer through a random cycle
  built by **Sattolo's algorithm**, which guarantees a *single* cycle covering every element; an
  ordinary shuffle yields several short cycles, the chase revisits a cached subset, and every
  working set reports L1 latency. The summing kernel uses **four accumulators**, because with one
  the loop is bound by the FP adder's latency rather than by memory — the first version of the
  AoS/SoA benchmark did exactly that and reported the two layouts as identical.
- **`levels.ts`** — infers the cache hierarchy from the knees in the latency curve. It reports a
  level only when the curve shows a sustained step (median of the 3 samples before vs. after, ≥1.45×,
  ≥2 octaves apart), and names nothing beyond DRAM. A machine whose last-level cache blurs into main
  memory is reported as L1/L2/DRAM rather than handed an L3 it cannot demonstrate.
- **`memory.worker.ts`** — runs a suite off the main thread, streaming each point as it lands.

Calibration targets ~40 ms per measurement so the browser's deliberately-coarsened
`performance.now()` is noise rather than signal, and each measurement reports the **minimum** of
several repetitions: interference can only make a run slower, so the minimum is the best estimate of
the hardware and the mean is a measure of how busy the machine was.

### What isn't here, and why

A stride sweep that reveals the cache line size. In C++ it works; in JavaScript the ~0.45 ns
per-iteration floor (bounds checks, dispatch) sits *above* the amortized cost of an access that
shares a line with its neighbours, so the informative half of the curve is under the noise floor. A
version that plotted it anyway confidently told Apple Silicon readers their cache line was 256 bytes.
The credibility of every other number on the page depends on not shipping that one.

## Monetization

`AdSlot.astro` renders nothing until `PUBLIC_ADS_ENABLED=true`. That is deliberate, and the reasoning
is in the file. The short version: display ads on a systems-engineering audience earn roughly nothing
until the traffic is large, and they suppress exactly the sharing that produces that traffic. The
email list is the asset; ads are a late, secondary layer. When the time comes, EthicalAds or Carbon —
not AdSense.
