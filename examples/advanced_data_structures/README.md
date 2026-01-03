# Advanced Data Structures Examples

This directory contains comprehensive examples demonstrating advanced data structures.

## Files

- `advanced_structures.cpp` - Basic implementations of Heaps and Tries
- `sparse_table_sqrt_decomp.cpp` - Sparse Table and Sqrt Decomposition implementations

## Compilation

```bash
# Compile advanced structures
g++ -std=c++17 -O2 -o advanced_structures advanced_structures.cpp

# Compile sparse table and sqrt decomposition
g++ -std=c++17 -O2 -o sparse_sqrt sparse_table_sqrt_decomp.cpp

# Run
./advanced_structures
./sparse_sqrt
```

## What's Included

### 1. Heaps
- **Max Heap**: Maximum element at root
- **Min Heap**: Minimum element at root
- **Priority Queue**: Generic priority queue implementation
- **Heap Operations**: Insert, extract, heapify

### 2. Tries
- **Basic Trie**: Prefix tree for strings
- **Compact Trie**: Array-based implementation
- **Operations**: Insert, search, prefix matching

### 3. Sparse Table
- **Range Minimum Query**: O(1) queries on static arrays
- **Range Maximum Query**: O(1) queries for maximum
- **Generic Operations**: Supports any idempotent operation

### 4. Sqrt Decomposition
- **Range Minimum**: O(√n) queries and updates
- **Range Sum**: O(√n) queries and updates
- **Block-based Optimization**: Simple and effective

## Key Features Demonstrated

- **Heaps**: Priority queue operations and heap sort
- **Tries**: String prefix matching and autocomplete
- **Sparse Table**: Fast range queries on immutable arrays
- **Sqrt Decomposition**: Simple range queries with updates

## Learning Objectives

After studying these examples, you should understand:
1. How to implement and use heaps
2. How to build and query tries
3. When to use Sparse Table vs Segment Tree
4. How Sqrt Decomposition works
5. Trade-offs between different data structures

## Complexity Analysis

| Data Structure | Query | Update | Space | Use Case |
|---------------|-------|--------|-------|----------|
| Heap | O(1) peek | O(log n) | O(n) | Priority queue |
| Trie | O(m) | O(m) | O(ALPHABET × N × M) | String matching |
| Sparse Table | O(1) | N/A | O(n log n) | Static arrays |
| Sqrt Decomp | O(√n) | O(√n) | O(n) | Simple queries |

## Exercises

1. Implement a heap that supports decrease key operation
2. Create a trie that supports wildcard matching
3. Implement Sparse Table for range GCD queries
4. Build Sqrt Decomposition for range maximum with updates
5. Compare performance of Sparse Table vs Segment Tree

