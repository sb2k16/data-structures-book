# Multi-Language Support — Rollout Plan

**Book:** Data Structures on Systems · **Scope:** offer code (prose snippets + runnable
problems) in more than C++. Prose stays English. **Status:** draft / not started.

---

## 1. Goal

Let a reader pick a programming language and see the book's *code* — inline snippets and the
in-page runnable problems — in that language, without leaving the page and without a backend.
Visualizations, benchmarks, and prose are unchanged.

## 2. Principles (read these before writing any code)

1. **The systems chapters do not translate — and that's a feature, not a gap.** This book's edge is
   "data structures down to the cache line." Memory layout, `alignas(64)`, `reserve()`, pointer-chasing,
   SIMD, false sharing, cache-line-sized B-tree nodes — these are only expressible and only *measurable*
   in a systems language. A Python "equivalent" would be misleading. Those chapters stay C++, with a
   one-line note explaining why, not a broken tab.
2. **Multi-language is for the algorithmic/interview code**, where readers actually want Python/Java
   and the concepts are language-portable.
3. **Code language is a within-page toggle, not a URL locale.** No `/py/` routes, no duplicate-content
   SEO problem, no route multiplication. One page ships all its languages; a client preference picks one.
4. **Every runnable variant is verified like the C++ ones were** — correct solution passes, starter
   fails — or it doesn't ship. The plumbing is cheap; the verified content is the cost.
5. **Ship one language end-to-end before adding a second.** Prove the pattern on Python, then fan out.

## 3. Target languages

Judge runs client-side on **Wandbox** (public, CORS-open, same service the C++ judge already uses).
Pin exact compiler IDs at build time from `GET https://wandbox.org/api/list.json` (they drift).

| Language | Wandbox compiler (as of 2026-07) | Options | Notes / gotchas |
|----------|----------------------------------|---------|-----------------|
| C++ (current) | `gcc-head` | `c++17` | Baseline; already shipping. |
| **Python** | `cpython-3.13.8` | — | Cleanest target. Phase 1. No boilerplate. |
| **Java** | `openjdk-jdk-22+36` | — | Fiddliest: single file, entry class needs `public static void main`; solution as a second non-public class. Only 2 JDKs available. |
| **Go** | `go-1.23.2` | — | Needs `package main` + `func main()`; harness imports `fmt`. |
| Rust | `rust-1.82.0` | — | Needs `fn main()`; ownership makes some starters verbose. Lower priority. |
| JS (Node) | `nodejs-20.17.0` | — | Trivial to host; low interview demand for DS/A. Optional. |

**Recommended set:** Python (Phase 1) → Java, Go (Phase 3) → Rust/JS only on request.

## 4. Per-chapter code-language policy

Three tiers. "Multi" = gets language tabs; "C++-anchored" = stays C++ with a rationale note;
"Mixed" = algorithmic snippets/problems get tabs, systems asides stay C++.

| # | Chapter | Tier | Rationale |
|---|---------|------|-----------|
| 1 | Introduction | Multi | Conceptual, portable. |
| 2 | Complexity Analysis | Mixed | Binary-search snippet → Multi; constant-factor/cache benches stay C++. |
| 3 | Arrays and Strings | Mixed | Kadane problem → Multi; AoS/SoA/SIMD/`reserve()` → **C++-anchored**. |
| 3.5 | Concurrency | **C++-anchored** | Locks/atomics/false-sharing/`alignas` are systems-specific. |
| 3.6 | Memory Hierarchy | **C++-anchored** | The whole point is the machine. |
| 4 | Linked Lists | Mixed | Reverse-list problem → Multi; pointer-chase/cache framing → C++. |
| 5 | Stacks and Queues | Mixed | Valid-parens problem → Multi; ring-buffer/kernel framing → C++. |
| 6 | Trees and Binary Trees | Multi | Portable. |
| 7 | String Search | Multi | Portable. |
| 8 | Recursion & Backtracking | Multi | Portable. |
| 9 | Sorting | Multi | Portable; keep the branch-predictor aside as a C++ note. |
| 10 | Hash Tables | Mixed | Two-sum + core → Multi; open-addressing cache behavior → C++. |
| 11 | Graphs | Multi | Portable. |
| 12 | Dynamic Programming | Multi | Portable; high Python demand. |
| 13 | Searching | Multi | Portable. |
| 14 | Heaps, Tries, and Beyond | Multi | Portable. |
| 15 | Problem-Solving Strategies | Multi | Meta/portable. |
| 16 | Greedy | Multi | Portable. |
| 17 | Divide and Conquer | Multi | Portable. |
| 18 | Modern Optimizations | **C++-anchored** | SIMD/branchless/false-sharing. |
| 19 | Benchmarking & Load Testing | **C++-anchored** | Methodology is systems-level. |
| 20 | B-Trees | **C++-anchored** | Cache-line-sized nodes are the lesson. |
| 21 | LSM Trees | Mixed | Merge/flush logic → Multi-friendly; keep IO framing prose-level. |

Runnable problems today live in ch. 3 (Kadane), 4 (reverse-list), 5 (valid-parens), 10 (two-sum) —
all algorithmic, all Phase-1 candidates even though two sit in mixed chapters.

## 5. Architecture changes

All under `web/`. Framework work is ~1 focused session; the rest is content.

- **`components/problem/CppProblem.tsx` → `CodeProblem.tsx`.** Add a `language` prop; map
  `language → { compiler, options }` (replaces the hardcoded `gcc-head`/`c++17` at line 58). The
  `[PASS]`/`[FAIL]`/`[SUMMARY]` parser is already language-neutral and stays. Header label and editor
  `aria-label` become dynamic. Keep `CppProblem` as a thin `language="cpp"` alias for a migration window.
- **`lib/problems.ts` shape change.** From one C++ triad per problem to:
  ```ts
  export const twoSum: Record<Lang, ProblemVariant> = {
    cpp:  { compiler: 'gcc-head', options: 'c++17', prelude, starter, harness },
    py:   { compiler: 'cpython-3.13.8',              starter, harness },
    java: { compiler: 'openjdk-jdk-22+36',           starter, harness },
    // ...
  };
  ```
  A `Lang` union + a `LANGUAGES` registry (id, label, Wandbox compiler, options, monaco/prism grammar).
- **New `components/CodeTabs.tsx`** — tabbed wrapper for prose snippets (one child per language).
- **New `lib/langStore.ts`** — a tiny shared preference (nanostores `atom` or a localStorage value +
  `CustomEvent`) so choosing "Python" once switches *every* `CodeTabs` and `CodeProblem` on the page
  simultaneously, and persists across pages. Default = C++.
- **Remark plugin (`lib/remark.mjs`)** — optional: fold consecutive fenced blocks tagged
  ` ```py title=twoSum ` / ` ```cpp title=twoSum ` into a single `<CodeTabs>` at build time, so authors
  keep writing fences instead of JSX. Nice-to-have; can start with explicit `<CodeTabs>`.
- **No routing changes. No new pages. No sitemap change.** Language is client state.
- **Unchanged:** `AlgoViz.tsx`, `traces*.ts`, `bench/*`, `memory.worker.ts`, `book.ts`, layouts.

## 6. The judge contract (per-language harness)

The solution editor holds **only the function the reader writes**. The harness (appended, hidden) calls
it on fixed cases and prints the protocol. Contract for every language:

- One `[PASS] <case>` or `[FAIL] <case> (got X, want Y)` line per test case.
- One final `[SUMMARY] <pass>/<total>` line.
- Nothing else on stdout that starts with `[PASS]`/`[FAIL]`/`[SUMMARY]`.

Skeletons (two-sum), showing the signature drift the author handles per language:

```cpp
// C++ (current): reader writes  vector<int> twoSum(vector<int>& nums, int target)
int main(){ auto r=twoSum(a,t); bool ok=(r==expected);
  cout<<(ok?"[PASS] ":"[FAIL] ")<<"...\n"; ... cout<<"[SUMMARY] "<<pass<<"/"<<total<<"\n"; }
```
```python
# Python: reader writes  def two_sum(nums, target) -> list[int]
cases = [([2,7,11,15], 9, [0,1]), ...]
p = t = 0
for nums, target, want in cases:
    t += 1; got = two_sum(nums, target)
    ok = got == want; p += ok
    print(f"[{'PASS' if ok else 'FAIL'}] two_sum({nums},{target}) -> {got}")
print(f"[SUMMARY] {p}/{t}")
```
```go
// Go: reader writes  func twoSum(nums []int, target int) []int
func main(){ pass:=0; total:=0
  for _, c := range cases { total++; got:=twoSum(c.nums,c.target)
    ok := eq(got,c.want); if ok {pass++}
    fmt.Printf("[%s] twoSum(%v,%d) -> %v\n", tag(ok), c.nums, c.target, got) }
  fmt.Printf("[SUMMARY] %d/%d\n", pass, total) }
```
```java
// Java: reader writes  int[] twoSum(int[] nums, int target)  inside class Solution
public class Main { public static void main(String[] a){ int p=0,t=0;
  /* per case: t++; int[] got=new Solution().twoSum(...); ... */
  System.out.printf("[SUMMARY] %d/%d%n", p, t); } }
```

Each variant is authored once and **verified in isolation** (correct solution → all pass; starter →
fails) before it enters `problems.ts`.

## 7. Authoring & verification workflow

Reuse the pattern that worked for the book review: hand-author one exemplar, then fan out agents
against a rubric, then verify mechanically.

1. **Exemplar per language** — port two-sum by hand; lock the harness idioms (I/O, equality, signature).
2. **Fan-out** — one agent per (problem × language) or (chapter × language) producing snippet/harness
   from the exemplar rubric.
3. **Verify every runnable variant** with a script that POSTs the assembled program to Wandbox and
   asserts: correct-solution → `[SUMMARY] n/n`; starter-stub → not all-pass; no compile error. Gate the
   commit on green (same discipline as the benchmark-honesty checks).
4. **Prose snippets** — build + spot-read; no runtime check, but they must be idiomatic (agent + review).

## 8. Phased rollout

Each phase is independently shippable and reversible.

- **Phase 0 — Framework (no user-visible change).** `CodeProblem` + `Lang`/`LANGUAGES` registry +
  `langStore` + `CodeTabs`. `CppProblem` becomes an alias. Verify existing C++ problems still pass.
  *Exit:* build green, all four C++ problems still 5/5, selector present but only C++ populated.
- **Phase 1 — Python on the runnable problems.** Port the 4 problems (two-sum, Kadane, valid-parens,
  reverse-list) to Python; wire the page-level language selector. *Exit:* each Python variant verified
  against Wandbox; reader can flip C++↔Python and re-run.
- **Phase 2 — Python on the algorithmic prose (Tier "Multi" chapters).** Convert `cpp` snippets to
  `CodeTabs` in ch. 6–17 (excluding C++-anchored ones). Add the "this chapter is C++ because it's about
  the machine" note to Tier B chapters. *Exit:* every Multi/Mixed chapter offers Python for its
  algorithmic snippets; systems asides labeled.
- **Phase 3 — Add Java + Go.** Same problems + snippets, two more columns. Java harness idioms locked
  first (the fiddly one). *Exit:* verified Java/Go variants across Phase-1/2 surface.
- **Phase 4 — Polish.** Syntax highlighting per language (Prism/Shiki grammar), remark plugin for
  fence-based `CodeTabs` authoring, remember-my-language across sessions, per-language copy button.
- **Phase 5 (optional) — Rust/JS**, only if requested; same machinery.

## 9. Effort & sequencing

| Phase | Framework | Content (author + verify) | Rough size |
|-------|-----------|---------------------------|-----------|
| 0 | CodeProblem/registry/store/tabs | none | ~1 session |
| 1 | page selector | 4 problems × Python | ~1 session |
| 2 | — | ~12 Multi/Mixed chapters × Python snippets | largest; fan-out, several passes |
| 3 | Java class-wrapping | 4 problems + snippets × 2 langs | ~2 sessions |
| 4 | highlighting + remark plugin | — | ~1 session |

Content dominates. Cost scales with (chapters opted-in × languages), which is exactly why the
algorithm-chapters-first, one-language-first sequencing keeps it bounded.

## 10. Risks & mitigations

- **Wandbox instability / rate limits.** It's a free public service. Mitigate: pin compiler IDs, keep
  the 30s timeout + graceful error (already present), and treat "run" as best-effort. If it becomes a
  problem, a self-hosted Judge0/piston is the fallback (same `[PASS]` protocol survives the swap).
- **Java single-file friction.** Lock the `Main`/`Solution` two-class layout in Phase 3's exemplar.
- **Signature drift confusing readers.** State the expected signature in each starter's comment (already
  the convention) so a language switch shows the idiomatic shape, not a translated C++ one.
- **Snippet rot / drift between language versions.** The verification script covers runnable problems;
  prose snippets rely on review. Keep prose snippets short and idiomatic to limit surface.
- **Scope creep into systems chapters.** Hold the line on Principle #1; the policy table is the contract.
- **Page weight.** Shipping N languages inline grows HTML/JS a little; code is a small fraction of page
  weight and only the chosen language hydrates. Acceptable; revisit only if measured.

## 11. Open decisions (need a call before Phase 1)

1. **Language set & order** — confirm Python-first, then Java+Go; Rust/JS deferred?
2. **Default language** — keep C++ as the default (systems identity) or default to the reader's last
   choice? Recommend: C++ default, remember last choice after first switch.
3. **How far into prose** — all Tier-Multi chapters, or just the runnable problems + a few flagship
   chapters (trees, sorting, DP) to start?
4. **C++-anchored note wording** — one shared sentence, or per-chapter?
5. **Highlighting engine** — Prism (light) vs Shiki (accurate, heavier) for multi-grammar.

## 12. Success metrics

- Reader can switch language on any Tier-Multi chapter and re-run problems, no backend.
- 100% of shipped runnable variants pass their own verification in CI/pre-commit.
- Systems chapters remain C++ and clearly labeled — no misleading "equivalents."
- No new routes, no duplicate-content penalty, no measurable regression in page-load.
