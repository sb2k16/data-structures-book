# Chapter 14: Advanced Data Structures

## 14.1 Problem Statement & Motivation

Basic structures (arrays, linked lists, balanced trees) leave specific operations expensive:

- **Range queries** (sum/min/max over `[l, r]`): O(n) per query with a plain array.
- **Prefix operations**: recomputing a prefix sum is O(n).
- **Priority operations**: finding and removing the min/max is O(n) with linear search.
- **String prefix / substring search**: O(n×m) brute force.
- **Approximate membership at scale**: an exact set costs O(n) space.
- **Version history**: naively snapshotting a structure costs O(n) per version.

Each structure in this chapter specializes one of these: heaps for priority, segment and Fenwick trees for range queries, tries and suffix structures for strings, Bloom filters and Count-Min sketches for space-efficient approximation, persistent structures for history. The trade is generality for specialized performance — reach for them only when a simpler structure genuinely can't meet the requirement.

## 14.2 Conceptual Overview

Think of each structure as a specialized tool: a heap is a hospital triage queue (most urgent first), a segment tree is a building directory answering "any floor range" quickly, a trie is a phone book organized by prefix, and a Bloom filter is a membership card that may say "maybe" but never wrongly says "not a member."

The chapter groups them as:

- **Priority**: binary heaps, Fibonacci heaps.
- **Range query**: segment trees, Fenwick trees, sparse tables, sqrt decomposition.
- **String**: tries, suffix arrays/trees.
- **Probabilistic**: Bloom filters, Count-Min sketch, skip lists.
- **Versioned**: persistent structures.

## 14.3 Abstract Model & Invariants

Each structure is defined by its state, its supported operations, and the **invariants** every operation must preserve. Correctness is exactly "no operation ever leaves an invariant broken."

**Heap.** (1) *Heap property*: `parent ≥ children` (max-heap) or `parent ≤ children` (min-heap), recursively. (2) *Complete tree*: all levels full except the last, which fills left to right. (3) *Array mapping*: root at index 0, and for node `i`, parent `(i-1)/2`, children `2i+1` and `2i+2`, with no gaps. The complete-tree shape bounds the height at ⌊log₂ n⌋.

**Segment tree.** Each node owns a range `[l, r]`; an internal node's value is the combination of its two children's values, so any query decomposes into O(log n) node values.

**Trie.** The path from the root to a node spells a prefix; each edge is labeled with one character; an end-of-word marker distinguishes stored words from mere prefixes.

These assume finite data, comparable/orderable elements, valid operation arguments, and sufficient memory.

## 14.4 Operations & Interface

**Heap** — `insert(v)` O(log n), `extractMin/Max()` O(log n), `peek()` O(1), `decreaseKey(i, v)` O(log n). Extraction and peek require a non-empty heap.

**Range structures (segment/Fenwick tree)** — `query(l, r)` returns the aggregate over `[l, r]`; `update(i, v)` sets one element; segment trees also support `rangeUpdate(l, r, v)` with lazy propagation. All require `0 ≤ l ≤ r < n`.

**Trie** — `insert(word)`, `search(word)` (exact word), `startsWith(prefix)` (any word with that prefix).

Every operation must return the correct result, preserve the structure's invariants, and meet its complexity bound.

## 14.5 Time & Space Complexity

| Structure | Insert | Delete | Search | Query | Update | Space |
|-----------|--------|--------|--------|-------|--------|-------|
| Heap | O(log n) | O(log n) | O(n) | O(1) peek | O(log n) | O(n) |
| Trie | O(m) | O(m) | O(m) | O(m) prefix | O(m) | O(Σ·N·M) |
| Segment tree | O(log n) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Fenwick tree | O(log n) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Sparse table | O(n log n) build | — | O(1) | O(1) | — | O(n log n) |
| Skip list | O(log n) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) exp. |
| Bloom filter | O(k) | — | O(k) | O(1) | — | O(m) bits |

(m = word/pattern length, k = number of hash functions, Σ = alphabet size, N words of average length M.) The recurring trade-off: heaps give fast priority ops but O(n) search; segment trees give flexible O(log n) range queries at O(n) space; tries give O(m) string ops at high space; Bloom filters are tiny but admit false positives.

## 14.6 Correctness

Each operation is correct because it restores every invariant before returning. For a **heap insert**, appending at the end preserves completeness and the array mapping, and bubble-up restores the heap property along the single path to the root; **extract** moves the last element into the root (preserving completeness) and heapify-down restores the heap property. The argument is inductive: a one-element heap is trivially valid, and each operation maps a valid heap to a valid heap. For a **segment tree**, leaves hold array elements and every internal node holds the combination of its children, so `build` is correct bottom-up and `query` is correct because the visited nodes exactly partition `[l, r]`. **Trie** insert creates the character path and marks the terminal node; search follows the same path and checks the marker.

## 14.7 Edge Cases & Failure Modes

- **Empty-heap access**: `extractMax()`/`peek()` on an empty heap must throw rather than read `heap[0]`.
- **Out-of-range segment-tree query**: reject or clamp `l < 0`, `r ≥ n`, or `l > r` before recursing.
- **Empty string in a trie**: decide explicitly whether `""` is a valid word (the marker on the root node).
- **Recurring bugs**: index-out-of-bounds from unchecked child indices, heap-property violations from an incomplete heapify, off-by-one range splits (`mid` vs `mid+1`), Fenwick 0-vs-1-based confusion, and un-freed trie nodes. Section 14.21 shows each as a concrete wrong/right pair.

## 14.8 Performance & System Considerations

This is where the choice of structure meets the machine.

**Array-backed structures win on cache.** A binary heap stores everything in one contiguous `vector`: parent and children are a few array slots apart, prefetching works, and there are no per-node pointers. A pointer-based priority queue (a balanced tree from Chapter 6) chases 2–5 cache lines per level. Same O(log n), but the heap is typically 2–3× faster and uses ~50% less memory. This is the Chapter 3 lesson again: contiguous layout beats pointer-chasing.

| Heap operation | Cache misses | Why |
|----------------|--------------|-----|
| heapifyUp | 0–1 | sequential parent access |
| heapifyDown | 0–2 | children are adjacent |
| buildHeap | ~log n | bottom-up construction |

**Pointer-based structures (tries, skip lists) pay for allocation.** Many small nodes fragment the heap and scatter across memory, causing a cache miss on nearly every traversal step. Mitigate with memory pools or pre-allocation, and prefer an array-backed representation (for instance a d-ary heap, which trades more children per node for fewer levels) when the access pattern allows. Profile before optimizing — measure the actual miss rate rather than guessing.

## 14.9 Heaps

A **heap** is a complete binary tree satisfying the heap property (Section 14.3): in a max-heap every parent is ≥ its children; in a min-heap every parent is ≤ its children. Because the tree is complete it lives in a flat array with no pointers — the layout responsible for its cache advantage (Section 14.8). For a node at index `i`: parent `(i-1)/2`, left `2i+1`, right `2i+2`.

Insertion appends at the end (preserving completeness) then bubbles up; extraction returns the root, moves the last element into the root, and heapifies down. Each touches one root-to-leaf path, so both are O(log n).

### Max-Heap

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <stdexcept>
using namespace std;

class MaxHeap {
private:
    vector<int> heap;

    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (heap[parent] >= heap[index]) break;
            swap(heap[parent], heap[index]);
            index = parent;
        }
    }

    void heapifyDown(int index) {
        int size = heap.size();
        while (true) {
            int largest = index;
            int left = 2 * index + 1;
            int right = 2 * index + 2;

            if (left < size && heap[left] > heap[largest])  largest = left;
            if (right < size && heap[right] > heap[largest]) largest = right;
            if (largest == index) break;

            swap(heap[index], heap[largest]);
            index = largest;
        }
    }

public:
    void insert(int value) {
        heap.push_back(value);
        heapifyUp(heap.size() - 1);
    }

    int extractMax() {
        if (heap.empty()) throw runtime_error("Heap is empty");
        int max = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) heapifyDown(0);
        return max;
    }

    int peek() const {
        if (heap.empty()) throw runtime_error("Heap is empty");
        return heap[0];
    }

    bool empty() const { return heap.empty(); }
    size_t size() const { return heap.size(); }

    // Bottom-up O(n) construction: heapify every internal node.
    void buildHeap(const vector<int>& arr) {
        heap = arr;
        for (int i = (int)heap.size() / 2 - 1; i >= 0; i--) {
            heapifyDown(i);
        }
    }
};
```

A **min-heap** is identical with the comparisons reversed (`<=` in `heapifyUp`, `<` in `heapifyDown`). Rather than duplicate the class, parameterize the comparison to get a reusable priority queue — `PriorityQueue<int, greater<int>>` is a min-heap:

```cpp
template<typename T, typename Compare = less<T>>
class PriorityQueue {
private:
    vector<T> heap;
    Compare comp;

    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (!comp(heap[parent], heap[index])) break;
            swap(heap[parent], heap[index]);
            index = parent;
        }
    }

    void heapifyDown(int index) {
        int size = heap.size();
        while (true) {
            int extreme = index;
            int left = 2 * index + 1;
            int right = 2 * index + 2;

            if (left < size && comp(heap[extreme], heap[left]))   extreme = left;
            if (right < size && comp(heap[extreme], heap[right])) extreme = right;
            if (extreme == index) break;

            swap(heap[index], heap[extreme]);
            index = extreme;
        }
    }

public:
    void push(const T& value) {
        heap.push_back(value);
        heapifyUp(heap.size() - 1);
    }

    void pop() {
        if (heap.empty()) throw runtime_error("Priority queue is empty");
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) heapifyDown(0);
    }

    T top() const {
        if (heap.empty()) throw runtime_error("Priority queue is empty");
        return heap[0];
    }

    bool empty() const { return heap.empty(); }
    size_t size() const { return heap.size(); }
};
```

### Heap Sort

Build a max-heap, then repeatedly extract the maximum into the back of the array. Extraction yields values in descending order, filling the array ascending:

```cpp
void heapSort(vector<int>& arr) {
    MaxHeap heap;
    heap.buildHeap(arr);
    for (int i = arr.size() - 1; i >= 0; i--) {
        arr[i] = heap.extractMax();
    }
}
```

| Operation | Time |
|-----------|------|
| Insert / Extract | O(log n) |
| Peek | O(1) |
| Build heap | O(n) |
| Heap sort | O(n log n) |

## 14.10 Tries (Prefix Trees)

A **trie** stores strings along tree paths: the path from the root to a node spells a prefix, and a per-node flag marks where a stored word ends. Lookups and inserts cost O(m) in the word length, independent of how many words are stored. The map-based node handles any alphabet:

```cpp
#include <unordered_map>
#include <string>

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    TrieNode() : isEndOfWord(false) {}
};

class Trie {
private:
    TrieNode* root;

    void deleteNode(TrieNode* node) {
        if (!node) return;
        for (auto& pair : node->children) deleteNode(pair.second);
        delete node;
    }

    // Returns true if the child at `node` can be pruned after deletion.
    bool deleteHelper(TrieNode* node, const string& word, int index) {
        if (!node) return false;
        if (index == word.length()) {
            if (!node->isEndOfWord) return false;
            node->isEndOfWord = false;
            return node->children.empty();
        }
        char c = word[index];
        if (node->children.find(c) == node->children.end()) return false;

        bool shouldDelete = deleteHelper(node->children[c], word, index + 1);
        if (shouldDelete) {
            delete node->children[c];
            node->children.erase(c);
            return node->children.empty() && !node->isEndOfWord;
        }
        return false;
    }

public:
    Trie() { root = new TrieNode(); }
    ~Trie() { deleteNode(root); }   // recursive cleanup avoids leaks

    void insert(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            if (current->children.find(c) == current->children.end())
                current->children[c] = new TrieNode();
            current = current->children[c];
        }
        current->isEndOfWord = true;
    }

    bool search(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            if (current->children.find(c) == current->children.end())
                return false;
            current = current->children[c];
        }
        return current->isEndOfWord;
    }

    bool startsWith(const string& prefix) {
        TrieNode* current = root;
        for (char c : prefix) {
            if (current->children.find(c) == current->children.end())
                return false;
            current = current->children[c];
        }
        return true;   // reached the end of the prefix path
    }

    bool deleteWord(const string& word) { return deleteHelper(root, word, 0); }
};
```

When the alphabet is small and fixed (e.g. lowercase `a`–`z`), replace the hash map with a fixed array of child pointers. This removes the per-lookup hashing and stores children contiguously, improving cache behavior at the cost of `26 × sizeof(ptr)` per node even when sparse:

```cpp
class CompactTrie {
private:
    struct TrieNode {
        TrieNode* children[26];
        bool isEndOfWord;
        TrieNode() : isEndOfWord(false) {
            for (int i = 0; i < 26; i++) children[i] = nullptr;
        }
    };
    TrieNode* root;

public:
    CompactTrie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) current->children[index] = new TrieNode();
            current = current->children[index];
        }
        current->isEndOfWord = true;
    }

    bool search(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) return false;
            current = current->children[index];
        }
        return current->isEndOfWord;
    }
};
```

Tries power autocomplete, spell checkers, IP-prefix routing, and any dictionary keyed by prefix.

## 14.11 Segment Trees

A **segment tree** answers range aggregate queries and point updates in O(log n). Each node covers a contiguous range and stores the aggregate of its children; a query walks down only the O(log n) nodes whose ranges partition `[l, r]`. The tree is stored in an array sized `4n` (enough to hold every node of the recursive layout). The version below aggregates by sum:

```cpp
class SegmentTree {
private:
    vector<int> tree;
    int n;

    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2 * node, start, mid);
            build(arr, 2 * node + 1, mid + 1, end);
            tree[node] = tree[2 * node] + tree[2 * node + 1];
        }
    }

    void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            if (idx <= mid) update(2 * node, start, mid, idx, val);
            else            update(2 * node + 1, mid + 1, end, idx, val);
            tree[node] = tree[2 * node] + tree[2 * node + 1];
        }
    }

    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;              // identity for sum
        if (l <= start && end <= r) return tree[node];    // fully inside
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r) +
               query(2 * node + 1, mid + 1, end, l, r);
    }

public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n);
        build(arr, 1, 0, n - 1);
    }
    void update(int idx, int val) { update(1, 0, n - 1, idx, val); }
    int query(int l, int r)       { return query(1, 0, n - 1, l, r); }
};
```

To answer a different aggregate, change only the combine step and the out-of-range identity. For range-minimum, replace `+` with `min(...)` and return `numeric_limits<int>::max()` (instead of `0`) for a range that lies entirely outside the query. Build is O(n); query and update are O(log n); space is O(n).

## 14.12 Fenwick Trees (Binary Indexed Trees)

A **Fenwick tree** supports prefix sums and point updates in O(log n) using a single array and bit tricks, with roughly half the memory and better cache behavior than a segment tree. The key operation `index & (-index)` isolates the lowest set bit, which is how each node reaches its parent (query) or next responsible node (update). Indices are 1-based internally:

```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;

    int getSum(int index) {         // prefix sum of arr[0..index]
        int sum = 0;
        index += 1;                 // to 1-based
        while (index > 0) {
            sum += tree[index];
            index -= index & (-index);
        }
        return sum;
    }

    void update(int index, int delta) {
        index += 1;                 // to 1-based
        while (index <= n) {
            tree[index] += delta;
            index += index & (-index);
        }
    }

public:
    FenwickTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(n + 1, 0);
        for (int i = 0; i < n; i++) update(i, arr[i]);
    }

    int rangeSum(int l, int r) { return getSum(r) - getSum(l - 1); }

    void updateValue(int index, int newValue) {
        int delta = newValue - rangeSum(index, index);
        update(index, delta);
    }

    int prefixSum(int index) { return getSum(index); }
};
```

Build is O(n log n), query and update O(log n), space O(n). Compared with a segment tree it uses less memory, is simpler to code, and is faster in practice — but it only supports invertible aggregates (sums, not min/max) without extra machinery.

## 14.13 Sparse Table

A **sparse table** answers idempotent range queries (min, max, GCD — any `f` with `f(x, x) = x`) in O(1) after O(n log n) preprocessing, provided the array never changes. It precomputes the answer for every interval whose length is a power of two; a query covers `[l, r]` with two overlapping such intervals, and overlap is harmless because the operation is idempotent.

```cpp
#include <vector>
#include <cmath>
#include <functional>
#include <algorithm>
using namespace std;

class SparseTable {
private:
    vector<vector<int>> table;
    vector<int> logTable;
    int n;
    function<int(int, int)> op;   // min, max, gcd, ...

    void buildTable(const vector<int>& arr) {
        int maxLog = log2(n) + 1;
        table.assign(n, vector<int>(maxLog));
        logTable.resize(n + 1);
        logTable[1] = 0;
        for (int i = 2; i <= n; i++) logTable[i] = logTable[i / 2] + 1;

        for (int i = 0; i < n; i++) table[i][0] = arr[i];   // length 1

        for (int j = 1; j < maxLog; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                table[i][j] = op(table[i][j - 1],
                                 table[i + (1 << (j - 1))][j - 1]);
    }

public:
    SparseTable(const vector<int>& arr, function<int(int, int)> operation)
        : n(arr.size()), op(operation) {
        buildTable(arr);
    }

    int query(int l, int r) {   // inclusive [l, r]
        int j = logTable[r - l + 1];
        return op(table[l][j], table[r - (1 << j) + 1][j]);
    }
};

// Usage: range-minimum
//   SparseTable rmq(arr, [](int a, int b) { return min(a, b); });
//   rmq.query(l, r);
```

Preprocessing is O(n log n), queries O(1), space O(n log n). Use it for static arrays with many queries and an idempotent operation; it cannot handle updates and uses more memory than a segment tree.

## 14.14 Sqrt Decomposition

**Sqrt decomposition** splits the array into √n blocks and precomputes an answer per block. A query combines whole-block answers with the individual elements of the two partial end blocks, giving O(√n) queries and updates — simpler than a segment tree and a good stepping stone to it. The version below maintains block minima:

```cpp
#include <vector>
#include <cmath>
#include <algorithm>
#include <climits>
using namespace std;

class SqrtDecomposition {
private:
    vector<int> arr;
    vector<int> blocks;   // minimum of each block
    int blockSize, n;

    int blockIndex(int i)  { return i / blockSize; }
    int blockStart(int b)  { return b * blockSize; }
    int blockEnd(int b)    { return min((b + 1) * blockSize - 1, n - 1); }

public:
    SqrtDecomposition(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        blocks.assign((n + blockSize - 1) / blockSize, INT_MAX);
        for (int i = 0; i < n; i++)
            blocks[blockIndex(i)] = min(blocks[blockIndex(i)], arr[i]);
    }

    int rangeMin(int l, int r) {
        int minVal = INT_MAX;
        int lb = blockIndex(l), rb = blockIndex(r);
        if (lb == rb) {
            for (int i = l; i <= r; i++) minVal = min(minVal, arr[i]);
        } else {
            for (int i = l; i <= blockEnd(lb); i++)     minVal = min(minVal, arr[i]);
            for (int b = lb + 1; b < rb; b++)           minVal = min(minVal, blocks[b]);
            for (int i = blockStart(rb); i <= r; i++)   minVal = min(minVal, arr[i]);
        }
        return minVal;
    }

    void update(int index, int value) {
        arr[index] = value;
        int b = blockIndex(index);
        blocks[b] = INT_MAX;                    // recompute this block's minimum
        for (int i = blockStart(b); i <= blockEnd(b); i++)
            blocks[b] = min(blocks[b], arr[i]);
    }
};
```

For an invertible aggregate like sum, store a running block total so updates become O(1) and queries stay O(√n):

```cpp
class SqrtDecompositionSum {
private:
    vector<int> arr;
    vector<long long> blockSums;
    int blockSize, n;
    int blockIndex(int i) { return i / blockSize; }
    int blockStart(int b) { return b * blockSize; }
    int blockEnd(int b)   { return min((b + 1) * blockSize - 1, n - 1); }

public:
    SqrtDecompositionSum(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        blockSums.assign((n + blockSize - 1) / blockSize, 0);
        for (int i = 0; i < n; i++) blockSums[blockIndex(i)] += arr[i];
    }

    long long rangeSum(int l, int r) {
        long long sum = 0;
        int lb = blockIndex(l), rb = blockIndex(r);
        if (lb == rb) {
            for (int i = l; i <= r; i++) sum += arr[i];
        } else {
            for (int i = l; i <= blockEnd(lb); i++)   sum += arr[i];
            for (int b = lb + 1; b < rb; b++)         sum += blockSums[b];
            for (int i = blockStart(rb); i <= r; i++) sum += arr[i];
        }
        return sum;
    }

    void update(int index, int value) {
        blockSums[blockIndex(index)] += (value - arr[index]);
        arr[index] = value;
    }
};
```

| Structure | Query | Update | Space | Notes |
|-----------|-------|--------|-------|-------|
| Sparse table | O(1) | — | O(n log n) | static, idempotent only |
| Segment tree | O(log n) | O(log n) | O(n) | full support |
| Fenwick tree | O(log n) | O(log n) | O(n) | prefix/point, invertible |
| Sqrt decomp | O(√n) | O(√n) | O(n) | simplest |

## 14.15 Skip Lists

A **skip list** is a probabilistic alternative to a balanced tree (Chapter 6): it layers several sorted linked lists (Chapter 4), where higher "express lane" levels contain progressively fewer nodes. A node's height is chosen randomly, giving O(log n) expected search, insert, and delete without the rotation logic of AVL or red-black trees. Redis uses skip lists for sorted sets, partly because they are easier to make concurrent than trees.

```
Level 3:  [1] --------------------------> [9]
Level 2:  [1] --------> [5] --------> [9]
Level 1:  [1] -> [3] -> [5] -> [7] -> [9]
Level 0:  [1] [2] [3] [4] [5] [6] [7] [8] [9]
```

Each node stores its value and a `forward` array of next-pointers, one per level it participates in.

```cpp
#include <vector>
#include <random>
#include <climits>
using namespace std;

class SkipListNode {
public:
    int value;
    vector<SkipListNode*> forward;
    SkipListNode(int val, int lvl) : value(val), forward(lvl + 1, nullptr) {}
};

class SkipList {
private:
    SkipListNode* header;
    int maxLevel, currentLevel;
    mt19937 gen;
    uniform_real_distribution<> dis;

    int randomLevel() {
        int level = 0;
        while (dis(gen) < 0.5 && level < maxLevel) level++;
        return level;
    }

public:
    SkipList(int maxLvl = 16)
        : maxLevel(maxLvl), currentLevel(0), gen(random_device{}()), dis(0.0, 1.0) {
        header = new SkipListNode(INT_MIN, maxLevel);
    }

    bool search(int target) {
        SkipListNode* current = header;
        for (int i = currentLevel; i >= 0; i--)
            while (current->forward[i] && current->forward[i]->value < target)
                current = current->forward[i];
        current = current->forward[0];
        return current && current->value == target;
    }

    void insert(int value) {
        vector<SkipListNode*> update(maxLevel + 1, nullptr);
        SkipListNode* current = header;
        for (int i = currentLevel; i >= 0; i--) {
            while (current->forward[i] && current->forward[i]->value < value)
                current = current->forward[i];
            update[i] = current;
        }
        current = current->forward[0];
        if (current && current->value == value) return;   // no duplicates

        int newLevel = randomLevel();
        if (newLevel > currentLevel) {
            for (int i = currentLevel + 1; i <= newLevel; i++) update[i] = header;
            currentLevel = newLevel;
        }
        SkipListNode* newNode = new SkipListNode(value, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->forward[i] = update[i]->forward[i];
            update[i]->forward[i] = newNode;
        }
    }

    void remove(int value) {
        vector<SkipListNode*> update(maxLevel + 1, nullptr);
        SkipListNode* current = header;
        for (int i = currentLevel; i >= 0; i--) {
            while (current->forward[i] && current->forward[i]->value < value)
                current = current->forward[i];
            update[i] = current;
        }
        current = current->forward[0];
        if (!current || current->value != value) return;

        for (int i = 0; i <= currentLevel; i++) {
            if (update[i]->forward[i] != current) break;
            update[i]->forward[i] = current->forward[i];
        }
        delete current;
        while (currentLevel > 0 && header->forward[currentLevel] == nullptr)
            currentLevel--;
    }
};
```

Search, insert, and delete are O(log n) expected and O(n) worst case; space is O(n) (each element appears in ~2 levels on average). Skip lists trade the deterministic guarantees of balanced trees for a far simpler implementation.

## 14.16 Bloom Filters

A **Bloom filter** is a bit array plus k hash functions that tests set membership in O(k) time and a fraction of the space of an exact set. It can report a false positive but never a false negative: if it says "not present," the element is definitely absent. Insertion sets the k hashed bits; a lookup passes only if all k bits are set. Standard Bloom filters cannot delete (clearing a bit could evict other elements).

```
Insert "apple":  bits[3], bits[7], bits[12] ← 1
Check  "apple":  bits[3] && bits[7] && bits[12] ?  → "probably present"
```

```cpp
#include <vector>
#include <string>
#include <cmath>
using namespace std;

class BloomFilter {
private:
    vector<bool> bits;
    int size, numHashFunctions;

    size_t hash1(const string& k) const { return hash<string>{}(k) % size; }
    size_t hash2(const string& k) const { return (hash<string>{}(k) * 31) % size; }
    size_t hash3(const string& k) const { return (hash<string>{}(k) * 17 + 7) % size; }

public:
    BloomFilter(int expectedElements, double falsePositiveRate) {
        // Optimal size m = -n·ln(p)/(ln 2)^2, hash count k = (m/n)·ln 2.
        size = (int)(-expectedElements * log(falsePositiveRate) / (log(2) * log(2)));
        numHashFunctions = (int)((size / (double)expectedElements) * log(2));
        bits.assign(size, false);
    }

    void insert(const string& key) {
        bits[hash1(key)] = bits[hash2(key)] = bits[hash3(key)] = true;
        for (int i = 3; i < numHashFunctions; i++)
            bits[(hash1(key) + i * hash2(key)) % size] = true;
    }

    bool contains(const string& key) const {
        if (!bits[hash1(key)] || !bits[hash2(key)] || !bits[hash3(key)]) return false;
        for (int i = 3; i < numHashFunctions; i++)
            if (!bits[(hash1(key) + i * hash2(key)) % size]) return false;
        return true;   // may be a false positive
    }

    // False-positive rate ≈ (1 - e^(-kn/m))^k for n inserted elements.
    double getFalsePositiveRate(int numElements) const {
        double exponent = -numHashFunctions * (double)numElements / size;
        return pow(1 - exp(exponent), numHashFunctions);
    }
};
```

Insert and lookup are O(k); space is O(m) bits, independent of element size. Bloom filters guard expensive lookups (database blocks, web caches, network routers) by cheaply ruling out absent keys.

To support deletion, a **counting Bloom filter** replaces each bit with a small counter, incremented on insert and decremented on remove:

```cpp
class CountingBloomFilter {
private:
    vector<int> counters;
    int size, numHashFunctions;

    size_t hash1(const string& k) const { return hash<string>{}(k) % size; }
    size_t hash2(const string& k) const { return (hash<string>{}(k) * 31) % size; }
    size_t hash3(const string& k) const { return (hash<string>{}(k) * 17 + 7) % size; }

public:
    CountingBloomFilter(int expectedElements, double falsePositiveRate) {
        size = (int)(-expectedElements * log(falsePositiveRate) / (log(2) * log(2)));
        numHashFunctions = (int)((size / (double)expectedElements) * log(2));
        counters.assign(size, 0);
    }

    void insert(const string& key) {
        counters[hash1(key)]++; counters[hash2(key)]++; counters[hash3(key)]++;
    }
    void remove(const string& key) {
        counters[hash1(key)]--; counters[hash2(key)]--; counters[hash3(key)]--;
    }
    bool contains(const string& key) const {
        return counters[hash1(key)] > 0 && counters[hash2(key)] > 0
            && counters[hash3(key)] > 0;
    }
};
```

## 14.17 Count-Min Sketch

A **Count-Min sketch** estimates element frequencies in a stream using a `d × w` counter grid and d hash functions — the counting analogue of a Bloom filter. Increment hashes the element into one cell per row and bumps it; a query returns the *minimum* of those d cells. Because collisions only ever add to a cell, the minimum is the tightest estimate and the sketch may overestimate but never underestimates.

```
Increment "apple":  sketch[0][h0], sketch[1][h1], sketch[2][h2]  += 1
Query     "apple":  min(sketch[0][h0], sketch[1][h1], sketch[2][h2])
```

```cpp
#include <vector>
#include <string>
#include <functional>
#include <algorithm>
#include <climits>
using namespace std;

class CountMinSketch {
private:
    vector<vector<int>> sketch;
    int depth, width;
    vector<function<size_t(const string&)>> hashFunctions;

public:
    CountMinSketch(int d, int w) : depth(d), width(w) {
        sketch.assign(depth, vector<int>(width, 0));
        // Build `depth` independent hashes from one base hash + per-row seed.
        for (int i = 0; i < depth; i++) {
            size_t seed = i;
            int w_ = width;
            hashFunctions.push_back([seed, w_](const string& k) {
                return (hash<string>{}(k) * (2 * seed + 1) + seed * 7) % w_;
            });
        }
    }

    void increment(const string& key) {
        for (int i = 0; i < depth; i++)
            sketch[i][hashFunctions[i](key)]++;
    }

    int query(const string& key) const {
        int minCount = INT_MAX;
        for (int i = 0; i < depth; i++)
            minCount = min(minCount, sketch[i][hashFunctions[i](key)]);
        return minCount;
    }
};
```

Increment and query are O(d); space is O(d × w). With width `w = ⌈e/ε⌉` and depth `d = ⌈ln(1/δ)⌉`, the error is at most `ε·N` (N = total increments) with probability at least `1 − δ`. For ε = δ = 0.01 that is w = 272, d = 5 — about 1,360 counters regardless of stream size. More depth raises accuracy; more width lowers collisions.

A common use is the **heavy-hitters** problem — elements exceeding a frequency threshold:

```cpp
vector<string> findHeavyHitters(const vector<string>& stream,
                                double threshold, int totalElements) {
    CountMinSketch cms(5, 272);                 // ε≈0.01, δ≈0.01
    for (const string& e : stream) cms.increment(e);

    vector<string> heavyHitters;
    for (const string& e : stream)
        if (cms.query(e) >= threshold * totalElements)
            heavyHitters.push_back(e);
    return heavyHitters;
}
```

Use a Count-Min sketch for large streams where approximate counts suffice and space is tight (network monitoring, trending items, query-frequency estimation); avoid it when exact counts are required or when the dataset is small enough that a hash table is cheaper. Variants include Count sketch (uses ±1 signs for lower average error, but can underestimate) and conservative-update (increments only the minimum cells to curb overestimation).

## 14.18 Fibonacci Heap

A **Fibonacci heap** is a collection of heap-ordered trees that defers restructuring work, achieving O(1) *amortized* insert, decrease-key, and merge, with O(log n) amortized extract-min. The decrease-key bound is what matters for Dijkstra's algorithm on dense graphs, lowering its cost from O((V+E) log V) to O(V log V + E).

| Operation | Binary heap | Fibonacci heap |
|-----------|-------------|----------------|
| Insert | O(log n) | O(1) amortized |
| Extract min | O(log n) | O(log n) amortized |
| Decrease key | O(log n) | O(1) amortized |
| Merge | O(n) | O(1) amortized |
| Delete | O(log n) | O(log n) amortized |

The structure keeps a circular doubly-linked *root list* with a pointer to the minimum root, plus a *marked* bit per node tracking whether it has already lost a child (used to bound decrease-key's cascading cuts). Insert and merge just splice into the root list; the real work is deferred to `extractMin`, which promotes the removed node's children to roots and then **consolidates** trees of equal degree so no two roots share a degree.

```cpp
#include <vector>
#include <list>
#include <stdexcept>
using namespace std;

class FibonacciHeap {
private:
    struct Node {
        int key, degree;
        bool marked;
        Node *parent, *child, *left, *right;
        Node(int k) : key(k), degree(0), marked(false),
                      parent(nullptr), child(nullptr), left(this), right(this) {}
    };

    Node* minNode;
    int numNodes;

    // Make `node` a child of `parent` (both currently roots).
    void link(Node* node, Node* parent) {
        node->left->right = node->right;      // unlink from root list
        node->right->left = node->left;
        if (parent->child == nullptr) {
            parent->child = node;
            node->left = node->right = node;
        } else {
            node->right = parent->child;
            node->left = parent->child->left;
            parent->child->left->right = node;
            parent->child->left = node;
        }
        node->parent = parent;
        parent->degree++;
        node->marked = false;
    }

    void consolidate() {
        vector<Node*> degreeTable(64, nullptr);   // 64 covers any practical n
        list<Node*> roots;
        Node* current = minNode;
        do { roots.push_back(current); current = current->right; }
        while (current != minNode);

        for (Node* root : roots) {
            int degree = root->degree;
            while (degreeTable[degree] != nullptr) {
                Node* other = degreeTable[degree];
                if (root->key > other->key) swap(root, other);
                link(other, root);                 // smaller key becomes parent
                degreeTable[degree] = nullptr;
                degree++;
            }
            degreeTable[degree] = root;
        }

        minNode = nullptr;
        for (Node* node : degreeTable)
            if (node && (minNode == nullptr || node->key < minNode->key))
                minNode = node;
    }

public:
    FibonacciHeap() : minNode(nullptr), numNodes(0) {}

    void insert(int key) {
        Node* node = new Node(key);
        if (minNode == nullptr) {
            minNode = node;
        } else {
            node->right = minNode;
            node->left = minNode->left;
            minNode->left->right = node;
            minNode->left = node;
            if (key < minNode->key) minNode = node;
        }
        numNodes++;
    }

    int extractMin() {
        if (minNode == nullptr) throw runtime_error("Heap is empty");
        Node* min = minNode;
        int minKey = min->key;

        if (min->child != nullptr) {               // move children to root list
            Node* child = min->child;
            do {
                Node* next = child->right;
                child->parent = nullptr;
                child->right = minNode;
                child->left = minNode->left;
                minNode->left->right = child;
                minNode->left = child;
                child = next;
            } while (child != min->child);
        }

        min->left->right = min->right;             // unlink min
        min->right->left = min->left;
        if (min == min->right) {
            minNode = nullptr;
        } else {
            minNode = min->right;
            consolidate();
        }
        numNodes--;
        delete min;
        return minKey;
    }

    bool empty() const { return minNode == nullptr; }
};
```

In practice Fibonacci heaps carry large constant factors and poor cache behavior (pointer-heavy nodes), so a plain binary heap — or a pairing heap — usually wins outside of graph algorithms dominated by decrease-key. Reach for a Fibonacci heap only when decrease-key or merge is genuinely the bottleneck.

## 14.19 Suffix Array and Suffix Tree

A **suffix array** is the sorted array of starting indices of all suffixes of a string. It supports substring search by binary search and underpins many string algorithms, at a fraction of the memory of a suffix tree. The construction below is the simple O(n² log n) comparison sort; production code uses O(n) or O(n log n) builders such as SA-IS or DC3. An accompanying LCP (longest-common-prefix) array records the overlap between adjacent suffixes.

```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class SuffixArray {
private:
    string text;
    vector<int> suffixArray;
    vector<int> lcp;

    void buildSuffixArray() {
        int n = text.length();
        suffixArray.resize(n);
        for (int i = 0; i < n; i++) suffixArray[i] = i;
        sort(suffixArray.begin(), suffixArray.end(),
             [this](int a, int b) { return text.substr(a) < text.substr(b); });
    }

    void buildLCP() {
        int n = text.length();
        lcp.assign(n, 0);
        for (int i = 1; i < n; i++) {
            int len = 0, a = suffixArray[i - 1], b = suffixArray[i];
            while (a + len < n && b + len < n && text[a + len] == text[b + len]) len++;
            lcp[i] = len;
        }
    }

public:
    SuffixArray(const string& s) : text(s) {
        text += '$';               // sentinel smaller than any real char
        buildSuffixArray();
        buildLCP();
    }

    // O(m log n): binary-search for any suffix beginning with `pattern`.
    bool search(const string& pattern) {
        int left = 0, right = suffixArray.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            string suffix = text.substr(suffixArray[mid]);
            if (suffix.compare(0, pattern.length(), pattern) == 0) return true;
            if (suffix < pattern) left = mid + 1;
            else                  right = mid - 1;
        }
        return false;
    }

    vector<int> findAllOccurrences(const string& pattern) {
        vector<int> occ;
        int lo = 0, hi = suffixArray.size() - 1, first = -1;
        while (lo <= hi) {                         // first matching suffix
            int mid = lo + (hi - lo) / 2;
            string suffix = text.substr(suffixArray[mid]);
            if (suffix.compare(0, pattern.length(), pattern) == 0) { first = mid; hi = mid - 1; }
            else if (suffix < pattern) lo = mid + 1;
            else                       hi = mid - 1;
        }
        if (first == -1) return occ;

        lo = first; hi = suffixArray.size() - 1;
        int last = first;
        while (lo <= hi) {                         // last matching suffix
            int mid = lo + (hi - lo) / 2;
            string suffix = text.substr(suffixArray[mid]);
            if (suffix.compare(0, pattern.length(), pattern) == 0) { last = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        for (int i = first; i <= last; i++) occ.push_back(suffixArray[i]);
        return occ;
    }

    const vector<int>& getSuffixArray() const { return suffixArray; }
    const vector<int>& getLCP() const { return lcp; }
};
```

A **suffix tree** is a compressed trie of all suffixes; with Ukkonen's algorithm it builds in O(n) and searches a pattern in O(m). It also solves longest-common-substring, longest-repeated-substring, and drives applications from LZ77 compression to DNA analysis. Suffix trees are intricate to implement correctly, so suffix arrays (plus LCP) are usually preferred in practice for comparable performance with far less code. Reach for either only when the same text is searched for many patterns or you need advanced string operations; for a single search over small text, a direct string search is simpler.

## 14.20 Persistent Data Structures

A **persistent** structure keeps its previous versions when modified. Partial persistence allows reading any past version but modifying only the latest; full persistence allows modifying any version; confluent persistence allows merging versions. The standard technique is *path copying*: an update clones only the O(log n) nodes on the path it changes and shares the rest with the old version, so each version costs O(log n) extra space rather than O(n).

```cpp
#include <vector>
using namespace std;

class PersistentSegmentTree {
private:
    struct Node {
        int value;
        Node *left, *right;
        Node(int v) : value(v), left(nullptr), right(nullptr) {}
        Node(Node* l, Node* r) : value(0), left(l), right(r) {
            if (l) value += l->value;
            if (r) value += r->value;
        }
    };

    vector<Node*> roots;   // one root per version
    int n;

    Node* build(vector<int>& arr, int left, int right) {
        if (left == right) return new Node(arr[left]);
        int mid = left + (right - left) / 2;
        return new Node(build(arr, left, mid), build(arr, mid + 1, right));
    }

    Node* update(Node* node, int left, int right, int index, int value) {
        if (left == right) return new Node(value);
        int mid = left + (right - left) / 2;
        if (index <= mid)
            return new Node(update(node->left, left, mid, index, value), node->right);
        else
            return new Node(node->left, update(node->right, mid + 1, right, index, value));
    }

    int query(Node* node, int left, int right, int qL, int qR) {
        if (qR < left || qL > right) return 0;
        if (qL <= left && right <= qR) return node->value;
        int mid = left + (right - left) / 2;
        return query(node->left, left, mid, qL, qR)
             + query(node->right, mid + 1, right, qL, qR);
    }

public:
    PersistentSegmentTree(vector<int>& arr) {
        n = arr.size();
        roots.push_back(build(arr, 0, n - 1));
    }

    // Create a new version from an existing one.
    void update(int version, int index, int value) {
        roots.push_back(update(roots[version], 0, n - 1, index, value));
    }

    int query(int version, int left, int right) {
        return query(roots[version], 0, n - 1, left, right);
    }

    int getLatestVersion() { return roots.size() - 1; }
};
```

Persistent structures enable time-travel queries ("what was the sum at version t?"), immutable/functional data, and rollback. Use them when history matters; a regular structure is smaller and simpler when only the current state is needed.

## 14.21 Failure Modes and Common Pitfalls

Each pitfall below is a real production bug shown as a wrong/right pair.

**1. Heap property not restored after mutation.**
```cpp
void insert(int value) { heap.push_back(value); }            // WRONG: no heapifyUp
void insert(int value) { heap.push_back(value); heapifyUp(heap.size() - 1); }  // CORRECT
```
Extract then returns a non-extreme element; the heap is silently invalid.

**2. Index out of bounds.** `parent(0)` computes `(0-1)/2`; heapify-up must guard `index > 0` before reading the parent. Unchecked child indices in heapify-down are the same class of bug.

**3. Incomplete heapify-down.**
```cpp
// WRONG: only compares the left child, ignores the right
// CORRECT: pick the extreme of index, left, and right, then swap
```
Comparing a single child breaks the heap property whenever the right child is the true extreme.

**4. Trie memory leaks.** A node's destructor must recursively delete its children; otherwise every inserted word leaks its trailing nodes.

**5. Segment-tree off-by-one range split.**
```cpp
return query(2*node, start, mid, l, r) + query(2*node+1, mid, end, l, r);      // WRONG
return query(2*node, start, mid, l, r) + query(2*node+1, mid + 1, end, l, r);  // CORRECT
```
Overlapping `mid`/`mid` ranges double-count and can recurse forever.

**6. Fenwick 0-vs-1-based confusion.** Both `update` and `query` must convert the incoming 0-based index to 1-based; forgetting it in one of them yields wrong prefix sums.

## 14.22 Key Takeaways

- **Heaps** give O(log n) priority operations from a cache-friendly array.
- **Tries** give O(m) prefix/word operations independent of dictionary size.
- **Segment and Fenwick trees** answer range queries in O(log n); Fenwick is smaller and faster but limited to invertible aggregates.
- **Sparse tables** give O(1) queries on static, idempotent data; **sqrt decomposition** is the simplest O(√n) all-rounder.
- **Skip lists, Bloom filters, and Count-Min sketches** trade exactness or determinism for simplicity and space.
- **Fibonacci heaps** and **suffix trees** have strong asymptotics but large constants — prefer simpler structures unless their specific strength is the bottleneck.

Match the structure to the dominant operation and the data's mutability.

## 14.23 Exercises

1. Implement a k-way merge using a min-heap.
2. Create a trie that supports wildcard (`.`) matching.
3. Implement a segment tree for range-maximum query with lazy propagation.
4. Build a Fenwick tree that supports range updates.
5. Implement a heap that supports a decrease-key operation.
6. Return all words in a trie that share a given prefix.
7. Implement a segment tree for range-sum with range updates.
8. Build a priority queue that supports updating priorities.
9. Create a trie-based autocomplete system.
10. Implement a Fenwick tree for 2D prefix sums.
11. Create a sparse table for range-GCD queries.
12. Implement sqrt decomposition for range-sum with range updates.
13. Benchmark sparse table vs segment tree on static arrays.
14. Implement sqrt decomposition supporting both range-minimum and range-sum.

15. **Find All Duplicates in Array**: given `nums` of length `n` with values in `[1, n]`, each appearing at most twice, return the values that appear twice in O(n) time and O(1) auxiliary space.

    ```cpp
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> result;
        for (int i = 0; i < (int)nums.size(); i++) {
            int idx = abs(nums[i]) - 1;
            if (nums[idx] < 0) result.push_back(abs(nums[i]));
            else               nums[idx] = -nums[idx];
        }
        return result;
    }
    ```

    Because values lie in `[1, n]`, value `x` maps to index `x-1`, and the array doubles as its own hash table. The *sign* at index `x-1` records whether `x` has been seen: positive means unseen (flip it negative); already negative means `x` is a duplicate. Since each value appears at most twice, one bit of state (the sign) suffices, so no extra space is needed. Time O(n), auxiliary space O(1).

16. **Split Array Largest Sum**: split `nums` into `k` contiguous non-empty subarrays minimizing the largest subarray sum.

    ```cpp
    bool canSplit(vector<int>& nums, int target, int k) {
        int curr_sum = 0, count = 1;
        for (int x : nums) {
            if (curr_sum + x > target) { curr_sum = x; count++; }
            else                         curr_sum += x;
        }
        return count <= k;
    }

    int splitArray(vector<int>& nums, int k) {
        int low = 0, high = 0;
        for (int x : nums) { low = max(low, x); high += x; }
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canSplit(nums, mid, k)) high = mid;
            else                        low = mid + 1;
        }
        return low;
    }
    ```

    This is *binary search on the answer*. The result lies in `[max(nums), sum(nums)]`: the lower bound must hold the largest single element, the upper bound puts everything in one subarray. For a candidate `mid`, a greedy pass (`canSplit`) counts how many subarrays are needed if each is capped at `mid`; feasibility is monotone in `mid`, so binary search converges on the smallest feasible cap. Time O(n·log(sum)), space O(1).

## 14.24 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to heaps and priority queues (see Section 3.5.3 for invariant-based reasoning and 3.5.9 for producer-consumer patterns).

A heap's invariants — the heap property, the complete-tree shape, and `size` matching the element count — must never be observed half-updated. But `insert` (append, increment size, bubble up) and `extractMax` (read root, move last element in, decrement size, bubble down) are multi-step: between the steps the invariants are temporarily broken. Any of these interleavings corrupts the heap or crashes:

- **Partial updates**: two concurrent inserts see each other's in-progress bubble-up and both write inconsistent parents.
- **Check-then-act**: testing `size > 0` and then extracting is a race — another thread can empty the heap in between, so the pair must be atomic.
- **Partial locking**: guarding `insert` but not `extractMax` leaves extraction racing against insertion.

The practical answer is a **coarse-grained lock**: one `std::mutex` around each whole operation. It is simple and correct but serializes all access, so throughput collapses under contention. Per-node fine-grained locking is impractical for heaps (operations traverse the tree and would need many locks with deadlock risk); read-write locks help little because heap operations are write-heavy. If contention is the problem, prefer multiple thread-local heaps merged periodically, or a bounded priority queue using a `std::condition_variable` (always re-checking the predicate in a loop to handle spurious wakeups).

Lock-free heaps are research-grade and rarely worth it; lock-free skip lists are the usual route to a concurrent priority queue. For production, prefer `std::priority_queue` with external synchronization, or a proven thread-safe/lock-free library, and only reach for anything more exotic if profiling demands it.

## 14.25 Summary

Advanced data structures each specialize one operation that basic structures handle poorly: heaps for priority, tries and suffix structures for strings, segment and Fenwick trees (and sparse tables, sqrt decomposition) for range queries, Bloom filters and Count-Min sketches for space-efficient approximation, and persistent structures for history. The systems lesson recurs throughout — array-backed layouts beat pointer-chasing on cache, and the asymptotically fanciest structure (Fibonacci heap, suffix tree) is often the wrong practical choice because of its constant factors. Choose by the dominant operation, the data's mutability, and whether approximate answers are acceptable.

The next chapter turns to **greedy algorithms**, many of which (such as Huffman coding) are built directly on the heaps introduced here.
