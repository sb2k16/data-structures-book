# Chapter 14: Advanced Data Structures

Basic containers — arrays, linked lists, balanced trees — are generalists. They do everything adequately and a handful of things badly: a range sum over an array is O(n), finding the minimum of an unsorted set is O(n), matching a string prefix is O(n·m), an exact membership set costs O(n) space, snapshotting a structure per version costs O(n). Every structure in this chapter buys back one of those operations by giving up generality. A heap answers "what's most urgent?" in O(log n) but can't search. A segment tree answers any range query in O(log n) but is heavier than the array it wraps. A Bloom filter tests membership in a fraction of the space but occasionally lies. The skill isn't memorizing these structures — it's recognizing the one operation your workload leans on hardest, and reaching for the specialist only when a plain array or tree genuinely can't keep up.

One systems lesson runs through the whole chapter, the same one from [Chapter 3](03-basic-data-structures.md): a structure that lives in a contiguous array beats a pointer-based one doing the same asymptotic work. A binary heap keeps every node a few array slots from its parent, so the prefetcher streams it in and there are no per-node allocations — it runs 2–3× faster than a pointer-based priority queue of the same O(log n) and uses about half the memory. Tries and skip lists, built from many small scattered nodes, pay a cache miss on nearly every step and fragment the allocator; a memory pool or a fixed-array node layout is the usual fix. When two structures share a Big-O, the array-backed one almost always wins — but measure the miss rate before you optimize.

| Structure | Insert | Delete | Search | Query | Space |
|-----------|--------|--------|--------|-------|-------|
| Heap | O(log n) | O(log n) | O(n) | O(1) peek | O(n) |
| Trie | O(m) | O(m) | O(m) | O(m) prefix | O(Σ·N·M) |
| Segment tree | O(log n) | — | O(log n) | O(log n) | O(n) |
| Fenwick tree | O(log n) | — | O(log n) | O(log n) | O(n) |
| Sparse table | O(n log n) build | — | O(1) | O(1) | O(n log n) |
| Skip list | O(log n) | O(log n) | O(log n) | O(log n) | O(n) exp. |
| Bloom filter | O(k) | — | O(k) | O(1) | O(m) bits |

(m = word/pattern length, k = hash functions, Σ = alphabet size, N words of average length M.)

## 14.1 Heaps

Reach for a heap when you repeatedly need the most extreme element — the highest-priority task, the nearest point, the smallest remaining edge — and nothing else. A **heap** is a complete binary tree obeying one rule, the *heap property*: every parent dominates its children (≥ for a max-heap, ≤ for a min-heap). Because the tree is complete — every level full but the last, which fills left to right — it needs no pointers: it lives in a flat array where node `i` has parent `(i-1)/2` and children `2i+1`, `2i+2`. That layout is the whole reason a heap is fast, and it bounds the height at ⌊log₂ n⌋.

Insertion appends at the end (still complete) and bubbles up along one root-to-leaf path; extraction returns the root, moves the last element up to fill it, then sifts down. Each touches a single path, so both are O(log n); peek is O(1). Search is O(n) — a heap orders parents against children, never siblings, so there is no shortcut to an arbitrary value. Accessing an empty heap must throw rather than read `heap[0]`.

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

A **min-heap** is identical with the comparisons reversed. Rather than duplicate the class, parameterize the comparison to get a reusable priority queue — `PriorityQueue<int, greater<int>>` is a min-heap:

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

**Heap sort** falls straight out: build a max-heap, then repeatedly extract the maximum into the back of the array. Extraction yields descending values, filling the array ascending.

```cpp
void heapSort(vector<int>& arr) {
    MaxHeap heap;
    heap.buildHeap(arr);
    for (int i = arr.size() - 1; i >= 0; i--) {
        arr[i] = heap.extractMax();
    }
}
```

The array layout also gives the heap its cache edge. Every operation walks a single path of adjacent slots, so misses are few — a pointer-based tree of the same height would chase 2–5 cache lines per level.

| Heap operation | Time | Cache misses |
|----------------|------|--------------|
| Insert / extract | O(log n) | 0–2 (adjacent parent/children) |
| Peek | O(1) | 0 |
| Build heap | O(n) | ~log n |
| Heap sort | O(n log n) | — |

## 14.2 Tries (Prefix Trees)

A **trie** stores strings along tree paths: the path from the root to a node spells a prefix, and a per-node flag marks where a stored word ends. Lookups and inserts cost O(m) in the word length, *independent of how many words are stored* — which is what makes tries the natural fit for autocomplete, spell checkers, and IP-prefix routing. The map-based node handles any alphabet:

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

`search` distinguishes a stored word from a mere prefix by checking `isEndOfWord`; `startsWith` doesn't care. The destructor deletes children recursively — omit that and every inserted word leaks its trailing nodes.

When the alphabet is small and fixed (say `a`–`z`), replace the hash map with a fixed array of child pointers. This drops the per-lookup hashing and stores children contiguously, improving cache behavior — at the cost of `26 × sizeof(ptr)` per node even when sparse:

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

## 14.3 Segment Trees

A **segment tree** answers range aggregate queries *and* point updates in O(log n) — the full-service option when both the data and the queries move. Each node covers a contiguous range and stores the aggregate of its two children, so a query walks down only the O(log n) nodes whose ranges partition `[l, r]`. The tree lives in an array sized `4n` (enough for every node of the recursive layout). This version aggregates by sum:

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

To answer a different aggregate, change only the combine step and the out-of-range identity: for range-minimum, replace `+` with `min(...)` and return `numeric_limits<int>::max()` instead of `0`. Build is O(n); query and update O(log n); space O(n). The one recurring bug is the range split — the right child must start at `mid + 1`, not `mid`, or overlapping ranges double-count and can recurse forever.

## 14.4 Fenwick Trees (Binary Indexed Trees)

When the aggregate is invertible (a sum, not a min), a **Fenwick tree** does everything a segment tree does for prefix/point work in half the memory and with better cache behavior — from a single array and one bit trick. The operation `index & (-index)` isolates the lowest set bit, which is how each node reaches its parent (query) or next responsible node (update). Indices are 1-based internally, so both `update` and `query` convert the incoming 0-based index — forget it in one and every prefix sum is wrong.

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

Build is O(n log n), query and update O(log n), space O(n). Less memory, less code, and faster in practice than a segment tree — the price is that it handles only invertible aggregates without extra machinery.

## 14.5 Sparse Table

If the array never changes and the operation is idempotent (`f(x, x) = x` — min, max, GCD), a **sparse table** beats every log-time structure: O(1) queries after O(n log n) preprocessing. It precomputes the answer for every interval whose length is a power of two; a query covers `[l, r]` with two overlapping such intervals, and the overlap is harmless precisely because the operation is idempotent.

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

The catch is right there in the premise: no updates, and O(n log n) space. When the data is static and read-heavy, it's unbeatable; the moment an element can change, you're back to a segment tree.

## 14.6 Sqrt Decomposition

**Sqrt decomposition** is the simplest range structure worth knowing, and a good stepping stone to the segment tree. Split the array into √n blocks and precompute one answer per block; a query then combines whole-block answers with the individual elements of the two partial end blocks — O(√n) per query and update. Here it maintains block minima:

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

For an invertible aggregate like sum, store a running block total so updates drop to O(1) while queries stay O(√n):

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

That rounds out the range-query family. Pick by what constrains you:

| Structure | Query | Update | Space | When |
|-----------|-------|--------|-------|------|
| Sparse table | O(1) | — | O(n log n) | static, idempotent |
| Segment tree | O(log n) | O(log n) | O(n) | full support |
| Fenwick tree | O(log n) | O(log n) | O(n) | invertible, prefix/point |
| Sqrt decomp | O(√n) | O(√n) | O(n) | simplest to write |

## 14.7 Skip Lists

A **skip list** gets you a balanced tree's O(log n) search, insert, and delete without any of the rotation logic — you pay for it with randomness instead. It layers several sorted linked lists ([Chapter 4](04-linked-lists.md)), with higher "express lane" levels holding progressively fewer nodes; a node's height is chosen by coin flip. Redis uses skip lists for its sorted sets, partly because they are far easier to make concurrent than trees.

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

Search, insert, and delete are O(log n) expected, O(n) worst case; space is O(n), since each element appears in ~2 levels on average. You trade a balanced tree's deterministic guarantees for a much simpler implementation.

## 14.8 Bloom Filters

A **Bloom filter** answers "have I seen this?" in a tiny fraction of the space of an exact set — as long as you can tolerate a *maybe*. It's a bit array plus k hash functions; insertion sets the k hashed bits, and a lookup passes only if all k are set. It can report a false positive but never a false negative: if it says "not present," the element is definitely absent. That asymmetry is exactly what you want in front of an expensive lookup — a database block, a web cache, a router table — to cheaply rule out absent keys. Standard Bloom filters can't delete, since clearing a bit could evict other elements.

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

Insert and lookup are O(k); space is O(m) bits, independent of element size. To support deletion, a **counting Bloom filter** replaces each bit with a small counter, incremented on insert and decremented on remove:

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

## 14.9 Count-Min Sketch

The **Count-Min sketch** is the counting analogue of a Bloom filter: it estimates element *frequencies* in a stream from a `d × w` counter grid and d hash functions. Increment bumps one cell per row; a query returns the *minimum* of those d cells. Because collisions only ever add to a cell, the minimum is the tightest estimate — the sketch may overestimate but never underestimates.

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

Increment and query are O(d); space is O(d × w). With width `w = ⌈e/ε⌉` and depth `d = ⌈ln(1/δ)⌉`, the error is at most `ε·N` (N = total increments) with probability at least `1 − δ`. For ε = δ = 0.01 that's w = 272, d = 5 — about 1,360 counters regardless of stream size. More depth raises confidence; more width lowers collisions.

A common use is **heavy hitters** — elements exceeding a frequency threshold, as in network monitoring or trending-item detection:

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

Reach for a Count-Min sketch when the stream is large, approximate counts suffice, and space is tight; skip it when you need exact counts or the data fits a plain hash table. Variants include Count sketch (±1 signs, lower average error but can underestimate) and conservative-update (increments only the minimum cells to curb overestimation).

## 14.10 Fibonacci Heap

A **Fibonacci heap** is a collection of heap-ordered trees that defers restructuring, buying O(1) *amortized* insert, decrease-key, and merge, with O(log n) amortized extract-min. The decrease-key bound is the one that matters: it's what lowers Dijkstra's algorithm on dense graphs from O((V+E) log V) to O(V log V + E).

| Operation | Binary heap | Fibonacci heap |
|-----------|-------------|----------------|
| Insert | O(log n) | O(1) amortized |
| Extract min | O(log n) | O(log n) amortized |
| Decrease key | O(log n) | O(1) amortized |
| Merge | O(n) | O(1) amortized |

The structure keeps a circular doubly-linked *root list* with a pointer to the minimum, plus a *marked* bit per node tracking whether it has lost a child (used to bound decrease-key's cascading cuts). Insert and merge just splice into the root list; all the real work is deferred to `extractMin`, which promotes the removed node's children to roots and then **consolidates** trees of equal degree so no two roots share one.

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

In practice Fibonacci heaps carry large constant factors and poor cache behavior — pointer-heavy nodes, exactly the layout the intro warned against — so a plain binary heap, or a pairing heap, usually wins outside of graph algorithms dominated by decrease-key. Reach for one only when decrease-key or merge is genuinely the bottleneck.

## 14.11 Suffix Array and Suffix Tree

A **suffix array** is the sorted array of starting indices of all suffixes of a string. Sort the suffixes once and you can find any substring by binary search — at a fraction of a suffix tree's memory. The build below is the simple O(n² log n) comparison sort; production code uses an O(n) or O(n log n) builder such as SA-IS or DC3. An accompanying LCP (longest-common-prefix) array records the overlap between adjacent suffixes and unlocks most of the interesting queries.

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

A **suffix tree** is a compressed trie of all suffixes; Ukkonen's algorithm builds it in O(n) and searches a pattern in O(m), and it directly solves longest-common-substring, longest-repeated-substring, and drives applications from LZ77 compression to DNA analysis. But it is notoriously intricate to implement correctly, so a suffix array plus LCP is usually preferred in practice — comparable performance, far less code. Reach for either only when the same text is searched for many patterns; for a single search over small text, a direct string search ([Chapter 7](07-string-search-algorithms.md)) is simpler.

## 14.12 Persistent Data Structures

A **persistent** structure keeps its old versions when modified — so you can query the past, not just the present. (Partial persistence reads any version but writes only the latest; full persistence writes any version; confluent persistence merges them.) The standard trick is *path copying*: an update clones only the O(log n) nodes on the path it changes and shares the rest with the previous version, so each version costs O(log n) extra space instead of O(n).

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

Persistence powers time-travel queries ("what was the sum at version t?"), immutable/functional data, and rollback. Use it when history matters; a regular structure is smaller and simpler when only the current state does.

## 14.13 Failure Modes and Common Pitfalls

Each pitfall below is a real production bug shown as a wrong/right pair.

**1. Heap property not restored after mutation.**
```cpp
void insert(int value) { heap.push_back(value); }            // WRONG: no heapifyUp
void insert(int value) { heap.push_back(value); heapifyUp(heap.size() - 1); }  // CORRECT
```
Extract then returns a non-extreme element and the heap is silently invalid.

**2. Index out of bounds.** `parent(0)` computes `(0-1)/2`; heapify-up must guard `index > 0` before reading the parent, and heapify-down must bound-check both child indices.

**3. Incomplete heapify-down.** Comparing only the left child breaks the heap property whenever the right child is the true extreme — always pick the extreme of index, left, and right before swapping.

**4. Trie memory leaks.** A node's destructor must recursively delete its children; otherwise every inserted word leaks its trailing nodes.

**5. Segment-tree off-by-one range split.**
```cpp
return query(2*node, start, mid, l, r) + query(2*node+1, mid, end, l, r);      // WRONG
return query(2*node, start, mid, l, r) + query(2*node+1, mid + 1, end, l, r);  // CORRECT
```
Overlapping `mid`/`mid` ranges double-count and can recurse forever.

**6. Fenwick 0-vs-1-based confusion.** Both `update` and `query` must convert the incoming 0-based index to 1-based; forgetting it in one yields wrong prefix sums.

## 14.14 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to heaps and priority queues (see 3.5.3 for invariant-based reasoning and 3.5.9 for producer-consumer patterns).

A heap's invariants — the heap property, the complete-tree shape, and `size` matching the element count — must never be observed half-updated, yet `insert` and `extractMax` are both multi-step, and between the steps the invariants are temporarily broken. Two concurrent inserts can see each other's in-progress bubble-up and write inconsistent parents; testing `size > 0` and then extracting is a race, since another thread can empty the heap in between; guarding `insert` but not `extractMax` leaves extraction racing against insertion.

The practical answer is a **coarse-grained lock** — one `std::mutex` around each whole operation. Simple and correct, but it serializes all access, so throughput collapses under contention. Fine-grained per-node locking is impractical here (operations traverse the tree and would need many locks with deadlock risk), and read-write locks help little because heap operations are write-heavy. If contention is the real problem, prefer multiple thread-local heaps merged periodically, or a bounded priority queue on a `std::condition_variable` (re-checking the predicate in a loop to handle spurious wakeups). Lock-free heaps are research-grade and rarely worth it — a lock-free skip list is the usual route to a concurrent priority queue. For production, reach for `std::priority_queue` with external synchronization or a proven library, and go more exotic only when profiling demands it.

## 14.15 Summary

Advanced data structures each specialize one operation that basic structures handle poorly:

- **Heaps** give O(log n) priority operations from a cache-friendly array; **Fibonacci heaps** improve decrease-key on paper but lose to them in practice on constants.
- **Tries** give O(m) prefix/word operations independent of dictionary size; **suffix arrays** (plus LCP) do the same for substring search, and beat suffix trees on code and memory.
- **Segment and Fenwick trees** answer range queries in O(log n) — Fenwick is smaller and faster but limited to invertible aggregates; **sparse tables** give O(1) on static idempotent data, and **sqrt decomposition** is the simplest O(√n) all-rounder.
- **Skip lists, Bloom filters, and Count-Min sketches** trade exactness or determinism for simplicity and space.

The systems throughline recurs: array-backed layouts beat pointer-chasing on cache, and the asymptotically fanciest structure is often the wrong practical choice because of its constant factors. Choose by the dominant operation, the data's mutability, and whether approximate answers are acceptable.

The next chapter turns to **greedy algorithms**, many of which — Huffman coding among them — are built directly on the heaps introduced here.

## 14.16 Exercises

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
</content>
</invoke>
