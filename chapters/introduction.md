# Introduction

There is no shortage of books on data structures and algorithms. This one is different in a
specific way, and it's worth saying up front so you can decide whether it's the book you want.

Most books teach data structures as abstractions and stop at Big-O. You learn that a hash table
is `O(1)` and a balanced tree is `O(log n)`, you memorize the operations, and you move on. That
knowledge is necessary and it is not sufficient, because on a real machine running real software,
the abstraction leaks everywhere. Two `O(n)` loops can differ by 50×. A linked list and an array
have the same traversal complexity and the array is often forty times faster. The "constant
factors" that Big-O throws away are frequently the entire story — and the reason your database
index is a B-tree and not a binary tree, the reason `std::vector` is almost always the right
default, and the reason a cache in front of your database can bring the whole system down when a
server is added.

**This book teaches data structures the way working systems actually use them** — down to the
cache line the CPU fetches, and out to the cluster of machines a distributed database runs on. It
is opinionated, it is measured (many chapters run live benchmarks you can execute yourself), and
it is built around a single question asked of every structure: *why does this exist, and what
problem with the previous one does it solve?*

## The through-line

The structures in this book are not a disconnected list. Each one exists because the one before it
hit a wall:

- An **array** gives you unbeatable cache performance, but inserting in the middle is `O(n)`.
- A **linked list** makes insertion `O(1)` — by scattering its nodes across memory and giving up
  the cache performance that made arrays fast.
- A **hash table** gives you `O(1)` lookup — by throwing away all ordering.
- A **tree** restores ordering *and* `O(log n)` operations — but a binary tree pays a cache miss on
  every level.
- A **B-tree** fixes that with wide, cache-line-sized nodes, which is why every database index is
  one — but its in-place updates punish write-heavy workloads.
- An **LSM tree** turns those random writes into sequential appends — and when one machine is no
  longer enough, **consistent hashing** spreads the data across many, landing us back at the
  hashing idea we started with, now running a distributed database.

Follow that arc and you don't just learn a catalog of structures; you learn the reasoning that
produced them, which is the thing that actually transfers to the systems you build.

## Who this is for

Software engineers and serious students who already write code and want to understand what happens
*beneath* the interface. You should be comfortable reading modern C++ (the examples use C++17/20)
and know what a pointer, a loop, and a class are. You do not need a computer-science degree or any
prior algorithms coursework.

This is not a first programming tutorial, and it is not an exhaustive academic reference. It favors
the structures you will actually use, explained with the depth that makes you good at using them:
their invariants, their failure modes, their behavior on real hardware, and where they show up in
production systems like Redis, PostgreSQL, the Linux kernel, and search engines.

## How to read it

The chapters build on each other and are best read roughly in order, at least through the core
structures — the through-line above only works if you follow it. That said, each chapter stands on
its own well enough to be a reference when you come back to it later, which is the real test of a
book like this: whether you *return* to it.

Read it online, where the interactive benchmarks run in your own browser on your own CPU — a claim
about performance means far more when you watch it happen on your machine than when you read a
number someone else measured. Code appears inline in C++, Python, Java, and Go, and the practice
problems compile and run right in the browser — so you can read, edit, and run without leaving the page.

A note on complexity analysis, since it's the one piece of formal machinery the rest of the book
leans on: [Chapter 2](https://data-structures-on-systems.vercel.app/chapters/complexity-analysis) covers Big-O, and just as importantly, the two
things Big-O deliberately hides — the constant factor and the memory hierarchy — that decide which
`O(n)` algorithm actually wins. If you read only one foundational chapter closely, read that one.

## What each chapter gives you

- **Why it exists** — the problem it solves that the previous structure couldn't.
- **How it works** — the core mechanism and its invariants, with correct, modern C++.
- **What it costs on real hardware** — cache behavior, memory layout, and (where it sharpens the
  point) a live benchmark.
- **Where it lives in production** — the real systems built on it.
- **Engineering judgment** — when to actually reach for it, and when not to.
- **An interview checklist** — the questions you'll be asked and the mistakes to avoid.

Let's begin where every performance conversation should: with [what the machine actually
does](https://data-structures-on-systems.vercel.app/chapters/complexity-analysis), and why the tidy `O(1)` you were promised is only half the truth.
