# Chapter 19: Benchmarking and Load Testing

This is the chapter the rest of the book leans on. Every performance claim we have made — that an array outruns a linked list, that a B-tree beats a binary tree, that open addressing wins — is a claim about a number someone measured. The live benchmarks that run in your browser as you read the online edition are all built on the handful of techniques in this chapter. So is every benchmark you will ever be tempted to trust from a blog post, a vendor, or your own terminal.

Measuring performance sounds like the easy part. You start a timer, run the code, stop the timer. It is not the easy part. A microbenchmark is one of the most reliable ways to lie to yourself in all of software: the compiler deletes the work you meant to measure, the timer is coarser than the thing you are timing, the first run pays for cold caches you will never see again in production, and the CPU quietly changes its clock speed underneath you. Every one of these produces a number. None of them produces the truth.

This chapter is about measuring honestly — getting a number you can stake a decision on, and knowing when you cannot.

## The noise is one-sided

Start with the single most important fact about timing a piece of code, because it dictates everything else: **measurement noise only ever makes things slower.**

Think about what perturbs a running benchmark. The scheduler preempts your thread to run something else. An interrupt fires. The CPU drops its frequency to cool down. A cache line gets evicted by another process. Every one of these events *adds* time. There is no event that makes your code run faster than the hardware is physically capable of. The distribution of run times has a hard floor — the true cost — and a long, ragged tail of contamination above it.

This is why reporting the **mean** is a beginner's mistake. The mean averages in the noise. Two runs of identical code on a busy laptop can have means 40% apart, entirely because one of them caught more interrupts. The **minimum**, by contrast, is the run that got interrupted least — the closest you got to measuring the machine instead of the weather. Report the minimum. Report the median if you want a sense of the typical case under real contention. Report the mean almost never, and never alone.

> The online benchmarks follow this rule literally. Each one runs its inner loop many times and reports the fastest repetition, precisely because "a scheduler preemption can only make a run slower, never faster." That is the whole justification, in one sentence.

Everything that follows is a technique for pushing that minimum down toward the real floor, and for making sure the thing you are timing is actually the thing you meant to time.

## A harness that does it right

Here is a complete timing harness in about forty lines. Read it once, then we will justify every design decision in it.

```cpp
#include <chrono>
#include <algorithm>
#include <limits>

using clock_type = std::chrono::steady_clock;

// Prevent the optimizer from discarding a computed value. Emits no
// instructions — it only tells the compiler the value is observed, which is
// enough to stop dead-code elimination. (GCC/Clang. On MSVC, a volatile
// write or _ReadWriteBarrier() serves the same purpose.)
template <typename T>
inline void doNotOptimize(const T& value) {
    asm volatile("" : : "r,m"(value) : "memory");
}

// Returns the MINIMUM nanoseconds-per-operation over `trials` trials, each of
// which times a batch of `batch` calls to op(). op() must return the result
// we want measured, so we can feed it to doNotOptimize.
template <typename Op>
double benchmarkNsPerOp(Op op, int batch = 1000, int trials = 200,
                        int warmup = 50) {
    using namespace std::chrono;

    // Warm up: pull code and data into cache, train the branch predictor, and
    // let the CPU ramp to its steady clock. These runs are thrown away.
    for (int i = 0; i < warmup; ++i) doNotOptimize(op());

    double best = std::numeric_limits<double>::infinity();
    for (int t = 0; t < trials; ++t) {
        auto start = clock_type::now();
        for (int b = 0; b < batch; ++b)
            doNotOptimize(op());          // defeat dead-code elimination
        auto end = clock_type::now();

        double ns = duration_cast<nanoseconds>(end - start).count();
        best = std::min(best, ns / batch);
    }
    return best;
}
```

Four decisions in that code are the whole art of microbenchmarking.

**`steady_clock`, not `high_resolution_clock`.** The obvious choice is wrong. `std::chrono::high_resolution_clock` is allowed to be an alias for the *system* clock, which can jump backward when NTP adjusts it or a leap second lands — and a clock that runs backward mid-measurement gives you negative durations. `steady_clock` is guaranteed monotonic: it only ever moves forward, at a constant rate, which is exactly the guarantee a stopwatch needs. Use it for every duration you measure.

**`doNotOptimize` defeats dead-code elimination.** This is the trap that catches everyone. Consider the "benchmark" the optimizer sees when you sum a loop and never look at the result:

```cpp
long sum = 0;
for (int i = 0; i < n; ++i) sum += data[i];
// sum is never used again
```

The compiler is allowed to prove `sum` has no observable effect and delete the entire loop. Your timer then measures an empty region of code and reports a few nanoseconds. **A benchmark that discards its result measures nothing** — and it does so silently, handing you a beautiful, fast, meaningless number. `doNotOptimize` fixes this by telling the compiler the value escapes, so the work that produced it cannot be removed. It compiles to zero instructions; it only constrains what the optimizer is allowed to assume.

**Batching beats the timer's resolution.** `steady_clock::now()` is not free and not infinitely fine. Calling it costs tens of nanoseconds, and its tick may be coarser still. If the operation you are timing takes 3 ns, wrapping each call in a pair of `now()` calls measures the clock, not the code. The fix is to time a *batch* of `batch` operations and divide: the fixed overhead of two `now()` calls is amortized across a thousand operations until it disappears into rounding. As a rule, size the batch so each timed region lasts at least a few hundred microseconds.

**Warmup, then measure the minimum.** The first calls to `op()` pay one-time costs that production traffic does not: instructions faulted in, data pulled into cache from cold, branch predictors untrained, and the CPU still at its idle clock speed. Those warmup iterations are run and thrown away so the measured region starts from a realistic steady state. Then, as argued above, we keep the fastest batch across all trials.

## Isolate the variable

A benchmark is a controlled experiment, and it obeys the same rule as any experiment: change one thing at a time. If implementation A and implementation B run on different input, or different compiler flags, or a different machine, or with the CPU at a different temperature, the difference in their timings tells you nothing about the code.

The most common violation is subtle — feeding the two contenders different data:

```cpp
// WRONG: each side sorts a different array, so any difference could be the data
bench(sortA, makeRandomData());
bench(sortB, makeRandomData());

// RIGHT: build the input once, hand both sides an identical copy
auto input = makeRandomData();
bench(sortA, input);
bench(sortB, input);   // fresh copy inside the harness if the op mutates it
```

The same discipline applies to the whole environment. Compare like with like: same compiler, same flags (`-O3 -march=native` for both, or `-O2` for both — never one of each), same CPU governor, same background load. Document what the machine was so the result is reproducible. A speedup you cannot reproduce is a rumor, not a measurement.

## Measure a realistic size and cache state

The number you get depends enormously on how much data you touch, because — as [the memory hierarchy chapter](03.6-memory-hierarchy-and-performance.md) showed at length — the same code is an order of magnitude slower when its working set spills from L2 to DRAM. A benchmark on a 100-element array lives entirely in L1 and will happily tell you a linear scan and a binary search cost the same. Run the real workload's size, or a spread of sizes, and watch where the curves cross.

Cache state is part of the input, not a nuisance to be scrubbed away. There are two honest questions and they have different answers:

- **Hot-cache (warm) cost:** the data is already in cache when the operation runs. This is what you measure with a warmup loop, and it is the right number for a tight inner loop that runs millions of times over resident data.
- **Cold-cache cost:** the data starts in DRAM, as it does the first time a request touches it. To measure this you must *evict* between trials — touch enough unrelated memory to flush the caches — because a warmup loop measures the opposite of what you want.

Neither is more correct. What is incorrect is measuring the hot-cache cost and then quoting it for a cold-cache workload, which is how a data structure that looks brilliant in a microbenchmark falls over in production.

## Latency versus throughput

These are different questions and a good benchmark answers only one at a time.

**Latency** is how long a single operation takes, start to finish — the number you care about for a keystroke, a database query, a p99 tail. **Throughput** is how many operations complete per unit time under sustained load — the number you care about for a batch job or a saturated server.

They are not reciprocals, because modern hardware overlaps work. A CPU can have a dozen memory loads in flight at once, so a loop that issues independent operations achieves a throughput far higher than `1 / latency` would predict. The memory-hierarchy chapter's pointer chase makes this concrete: each load depends on the previous one, so nothing overlaps and you measure pure latency. Change the access pattern to independent loads and throughput leaps, though the latency of any single load is unchanged.

Decide which you are measuring before you start. To measure latency, serialize: make each operation depend on the result of the last (a dependency chain), so the hardware cannot hide one behind another. To measure throughput, do the opposite: keep many independent operations in flight and count completions over a fixed interval. A benchmark that mixes them measures neither.

## How to lie to yourself with a microbenchmark

Every item on this list has produced a confident, published, wrong number. Read it as a pre-flight checklist.

- **Let the compiler delete the work.** Discard the result and the optimizer removes the computation. Defeat it with `doNotOptimize`, or your loop measures nothing. (This one has probably caused more bogus benchmarks than all the others combined.)
- **Time a constant.** If the input is known at compile time, the optimizer may compute the whole answer during compilation and your benchmark times a single load of a precomputed value. Generate inputs at runtime.
- **Hoist the work out of the loop.** If the operation does not depend on the loop variable, the compiler runs it once and reuses the result. Make the work depend on the iteration.
- **Report the mean of a noisy sample.** The noise is one-sided; the mean is contaminated by it. Report the minimum.
- **Skip the warmup.** Your first iteration pays for cold caches and a downclocked CPU, and if you only run once, that is the number you ship.
- **Measure a toy size.** L1-resident data hides every cache effect that dominates the real workload. Measure the size you actually run.
- **Trust one run.** A single measurement has no error bar. If you cannot state the variance, you cannot tell a real 5% win from scheduler noise.
- **Believe a null result.** If a benchmark reports that a real effect does not exist — two layouts "identical," a change with "no impact" — suspect the benchmark before you believe it. That is exactly how the online array-of-structures benchmark initially reported a 1.0× ratio: a single accumulator serialized the additions and measured the floating-point adder in both cases, and the memory system in neither. If a benchmark tells you an effect does not exist, suspect the benchmark.

## Controlling the machine

Once the harness is honest, the remaining variance is the machine changing underneath you. You cannot eliminate it, but you can pin down the big sources. In rough order of impact:

- **Frequency scaling.** Modern CPUs boost and throttle constantly, which is the single largest source of run-to-run variance. Pin the clock before measuring: on Linux, `cpupower frequency-set -g performance`; on macOS, expect more variance because you have less control. Let the machine reach thermal steady state first — a benchmark that starts cold and heats up shows a downward drift that is pure artifact.
- **Core migration.** When the OS moves your thread to another core, it lands with cold caches. Pin the thread to one core (`sched_setaffinity` / `pthread_setaffinity_np` on Linux, `taskset` from the shell) so every trial runs on the same caches.
- **Background load.** Close the browser, pause the sync client, kill the antivirus scan. Other processes evict your cache lines and steal your cores. The cleaner the machine, the lower and tighter your minimum.
- **The build.** Benchmark an optimized build (`-O3 -march=native -flto`) unless you are specifically studying debug behavior. A number from a `-O0` build describes a program you will never ship.

Do not over-invest here. The goal is a stable *minimum*, and the techniques above — minimum-of-many, warmup, batching — already absorb most of the noise these settings would remove. Reach for frequency pinning and core affinity when you are chasing a 5% difference; skip them when you are confirming a 40× one.

## Load testing

Everything so far measures a single operation in isolation. Load testing asks a different question: **how does the whole system behave as concurrent demand rises?** It is the difference between "how fast is one query" and "what happens at ten thousand queries per second." The two are not related by simple arithmetic, because under load you hit contention — locks, connection pools, cache thrash, garbage collection — that never appears one request at a time.

You sweep the load through several regimes and watch the metrics bend:

- **Baseline** — one request at a time, the best case.
- **Normal** — expected production concurrency.
- **Peak** — the busiest you expect to survive.
- **Stress** — past the limit, to find where and how it breaks.

The metrics that matter under load are not the mean either. Throughput (requests/second) tells you capacity; **tail latency** (p95, p99) tells you what your unlucky users feel. A system with a great average and a terrible p99 is a system with a queue backing up somewhere. Track error rate too — the point where errors climb is usually the real capacity limit, well before throughput flatlines.

Here is a compact load driver: fixed number of worker threads, each hammering the operation for a fixed duration, collecting per-request latencies for percentile analysis.

```cpp
#include <thread>
#include <vector>
#include <atomic>
#include <chrono>
#include <algorithm>
#include <cstdio>

struct LoadResult {
    double throughput;    // requests / second
    double p50, p95, p99; // microseconds
    double errorRate;     // fraction failed
};

template <typename Op>
LoadResult loadTest(Op operation, int numThreads, int durationSeconds) {
    using clock_type = std::chrono::steady_clock;
    std::atomic<long long> failures{0};
    std::vector<std::vector<long long>> perThread(numThreads); // latencies, µs

    auto start = clock_type::now();
    auto deadline = start + std::chrono::seconds(durationSeconds);

    std::vector<std::thread> workers;
    for (int id = 0; id < numThreads; ++id) {
        workers.emplace_back([&, id] {
            auto& samples = perThread[id];          // thread-local: no locking
            while (clock_type::now() < deadline) {
                auto t0 = clock_type::now();
                bool ok = operation();
                auto t1 = clock_type::now();
                if (!ok) failures.fetch_add(1, std::memory_order_relaxed);
                samples.push_back(
                    std::chrono::duration_cast<std::chrono::microseconds>(
                        t1 - t0).count());
            }
        });
    }
    for (auto& w : workers) w.join();

    // Merge, sort, and read off percentiles.
    std::vector<long long> all;
    for (auto& s : perThread) all.insert(all.end(), s.begin(), s.end());
    std::sort(all.begin(), all.end());

    double elapsed = std::chrono::duration<double>(
        clock_type::now() - start).count();
    long long total = static_cast<long long>(all.size());
    if (total == 0) return {0, 0, 0, 0, 0};   // guard the empty run

    auto pct = [&](double p) {
        return static_cast<double>(all[std::min<size_t>(
            all.size() - 1, static_cast<size_t>(p * all.size()))]);
    };
    return {total / elapsed, pct(0.50), pct(0.95), pct(0.99),
            static_cast<double>(failures.load()) / total};
}
```

Two details make this correct where the naive version is not. Each thread writes to its **own** latency vector, so there is no lock on the hot path — a shared, mutex-guarded vector would have you measuring lock contention instead of the system under test. And the percentile index is **clamped** against `all.size() - 1`, because `p * size` for p = 0.99 rounds up to a valid-looking index that is one past the end on small samples; an unclamped version reads out of bounds exactly when the test is short. The empty-run guard covers the case where the deadline passes before any thread completes a request, which would otherwise divide by zero.

Run it as a sweep, not a single point: step `numThreads` up — 1, 2, 4, 8, 16 — and plot throughput and p99 against concurrency. Throughput climbs, then flattens as you saturate a resource; p99 stays flat, then hockey-sticks upward as requests start queueing. Where those two curves bend is your real capacity, and it is almost never the number you would have guessed.

## The interview trap

A favorite interview question: *"Your benchmark says function X runs in 0.3 nanoseconds. What happened?"* The answer is dead-code elimination — 0.3 ns is well under the cost of a single cache miss, so the work was optimized away and the timer measured an empty loop. The follow-up — *"how would you fix it?"* — is `doNotOptimize`, or consuming the result in a way the compiler cannot see through. The deeper trap, and the one that separates people who have actually measured things from people who have read about it, is the impossibly-good result: a number faster than physics allows, or a change that shows "no effect." The reflex to distrust your own benchmark before you trust its happy news is the whole skill.

## Exercises

1. Take the summing loop from this chapter, benchmark it with `doNotOptimize` removed, and inspect the assembly (`-O3 -S`). Confirm the loop is gone. Add the barrier back and watch it return.
2. Time a single operation that takes roughly 2 ns with a batch size of 1, then 10, then 1000. Explain the curve.
3. Measure the same array-sum at sizes 1 KiB, 1 MiB, and 128 MiB. Relate the three numbers to the cache hierarchy from [Chapter 3.6](03.6-memory-hierarchy-and-performance.md).
4. Build the same operation two ways — as a latency measurement (dependency chain) and a throughput measurement (independent operations) — and explain why the two numbers differ.
5. Run the load driver as a concurrency sweep and find the point where p99 latency turns sharply upward. What resource is saturating there?

## Summary

Honest measurement is a discipline, and it comes down to a short list of non-negotiables:

- **The noise is one-sided, so report the minimum**, not the mean. The fastest run is the one that measured the machine instead of the interference.
- **Defeat the optimizer.** A benchmark that discards its result measures nothing. `doNotOptimize`, every time.
- **Beat the timer with batching.** Do not time a 3 ns operation with a 30 ns clock.
- **Warm up, then measure**, so cold caches and a cold CPU do not become your headline number.
- **Isolate one variable.** Same data, same flags, same machine — a controlled experiment or nothing.
- **Match the real workload's size and cache state**, because both change the answer by an order of magnitude.
- **Know whether you are measuring latency or throughput.** They are different questions with different rigs.

These are not academic niceties. They are the exact techniques the book's live benchmarks use to earn the numbers they show you — and once you have them, you can stop trusting anyone else's benchmark, including your own past self's, and go measure the machine in front of you.
