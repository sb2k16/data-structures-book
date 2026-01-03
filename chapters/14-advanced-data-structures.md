# Chapter 14: Advanced Data Structures

## 14.1 Introduction

This chapter covers advanced data structures that are essential for solving complex problems efficiently. These structures provide specialized operations beyond basic arrays, lists, and trees.

### Data Structures Covered

1. **Heaps**: Priority queues and heap operations
2. **Tries**: Prefix trees for string operations
3. **Segment Trees**: Range query and update operations
4. **Fenwick Trees**: Binary Indexed Trees for prefix sums
5. **Sparse Table**: O(1) range queries on static arrays
6. **Sqrt Decomposition**: Simple range queries and updates

## 14.2 Heaps

A **heap** is a complete binary tree that satisfies the heap property. In a max-heap, parent nodes are greater than or equal to their children. In a min-heap, parent nodes are less than or equal to their children.

### Heap Properties

- **Complete Binary Tree**: All levels are filled except possibly the last
- **Heap Property**: Parent-child relationship maintained
- **Array Representation**: Efficiently stored in an array

### 14.2.1 Core Invariants

Heaps maintain critical invariants that must be preserved by all operations.

#### Core Invariants of a Heap

1. **Heap Property Invariant**:
   - **Max-Heap**: For every node, `parent >= all children`
   - **Min-Heap**: For every node, `parent <= all children`
   - This property holds recursively for all subtrees

2. **Complete Binary Tree Invariant**:
   - All levels are completely filled except possibly the last level
   - Last level is filled from left to right
   - No gaps exist in the tree structure

3. **Array Representation Invariant**:
   - `heap[0]` is the root
   - For node at index `i`: parent at `(i-1)/2`, children at `2i+1` and `2i+2`
   - Array size equals number of elements (no unused slots)

4. **Shape Invariant**:
   - Tree height is always ⌊log₂(n)⌋ or ⌊log₂(n)⌋ + 1
   - Adding elements maintains left-to-right filling order

#### Why Invariants Matter

- **Extract Operations**: Heap property ensures root is max/min
- **Insert Operations**: Must maintain both shape and heap property
- **Heapify**: Restores invariants after violations
- **Correctness**: All operations must preserve invariants

**Example**: When inserting a value:
1. Add to end (preserves shape invariant)
2. Heapify up (restores heap property invariant)
3. If heapify fails, heap property is violated → invalid heap

**Example**: When extracting max:
1. Remove root, move last element to root (may violate heap property)
2. Heapify down (restores heap property invariant)
3. If heapify fails, result is not a valid heap

### Array Representation

For a node at index `i`:
- Parent: `(i - 1) / 2`
- Left child: `2 * i + 1`
- Right child: `2 * i + 2`

### 14.2.2 Systems Perspective: Cache Performance and Memory Layout

Heaps excel at cache performance due to their array representation, similar to the cache benefits we discussed for arrays in Chapter 3.

#### Memory Layout and Cache Behavior

**Array-Based Storage:**
- **Contiguous Memory**: All elements stored in single array (like arrays from Chapter 3)
- **Cache Locality**: Excellent - parent and children are nearby in memory
- **Memory Overhead**: Minimal - only data, no pointers (unlike trees from Chapter 6)
- **Access Pattern**: Heapify operations access parent → children → grandchildren (spatial locality)

**Cache Performance Analysis:**
```
Operation          | Cache Misses | Notes
-------------------|---------------|------------------
heapifyUp          | 0-1           | Sequential parent access
heapifyDown        | 0-2           | Children are adjacent
insert            | 0-1           | Append + heapifyUp
extractMax        | 0-2           | Swap + heapifyDown
buildHeap         | ~log n        | Bottom-up construction
```

**Why Heaps Beat Tree-Based Priority Queues:**
- **Trees** (Chapter 6): Pointer chasing → 2-5 cache misses per level
- **Heaps**: Array access → 0-1 cache misses per operation
- **Real Impact**: Heaps are 2-3x faster in practice despite same O(log n) complexity

#### When Heaps Become a Bottleneck

1. **Large Heap Operations**:
   - Heapify traverses O(log n) levels → cache misses accumulate
   - Solution: Use d-ary heaps (more children, fewer levels) for better cache behavior

2. **Frequent Resizing**:
   - Vector reallocation (like arrays in Chapter 3) → O(n) cost
   - Solution: Pre-allocate capacity if size is known

3. **Memory Fragmentation**:
   - Many small heaps → fragmentation
   - Solution: Use memory pools or fewer, larger heaps

**Comparison with Balanced Trees:**
While balanced trees (Chapter 6) also provide O(log n) operations, heaps win in practice:
- **Memory**: Heaps use ~50% less memory (no pointers)
- **Cache**: Heaps have better cache locality (contiguous array, as we saw in Chapter 3)
- **Overhead**: Heaps have lower constant factors

This demonstrates the same principle we established in Chapter 3: contiguous memory layouts (arrays) provide superior cache performance compared to pointer-based structures (trees from Chapter 6).

### Max Heap Implementation
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
            if (heap[parent] >= heap[index]) {
                break;
            }
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
            
            if (left < size && heap[left] > heap[largest]) {
                largest = left;
            }
            
            if (right < size && heap[right] > heap[largest]) {
                largest = right;
            }
            
            if (largest == index) {
                break;
            }
            
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
        if (heap.empty()) {
            throw runtime_error("Heap is empty");
        }
        
        int max = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!heap.empty()) {
            heapifyDown(0);
        }
        
        return max;
    }
    
    int peek() const {
        if (heap.empty()) {
            throw runtime_error("Heap is empty");
        }
        return heap[0];
    }
    
    bool empty() const {
        return heap.empty();
    }
    
    size_t size() const {
        return heap.size();
    }
    
    void buildHeap(const vector<int>& arr) {
        heap = arr;
        for (int i = (heap.size() - 2) / 2; i >= 0; i--) {
            heapifyDown(i);
        }
    }
    
    void print() const {
        for (int val : heap) {
            cout << val << " ";
        }
        cout << endl;
    }
};
```

### Min Heap Implementation
```cpp
class MinHeap {
private:
    vector<int> heap;
    
    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (heap[parent] <= heap[index]) {
                break;
            }
            swap(heap[parent], heap[index]);
            index = parent;
        }
    }
    
    void heapifyDown(int index) {
        int size = heap.size();
        
        while (true) {
            int smallest = index;
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            
            if (left < size && heap[left] < heap[smallest]) {
                smallest = left;
            }
            
            if (right < size && heap[right] < heap[smallest]) {
                smallest = right;
            }
            
            if (smallest == index) {
                break;
            }
            
            swap(heap[index], heap[smallest]);
            index = smallest;
        }
    }
    
public:
    void insert(int value) {
        heap.push_back(value);
        heapifyUp(heap.size() - 1);
    }
    
    int extractMin() {
        if (heap.empty()) {
            throw runtime_error("Heap is empty");
        }
        
        int min = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!heap.empty()) {
            heapifyDown(0);
        }
        
        return min;
    }
    
    int peek() const {
        if (heap.empty()) {
            throw runtime_error("Heap is empty");
        }
        return heap[0];
    }
    
    bool empty() const {
        return heap.empty();
    }
    
    size_t size() const {
        return heap.size();
    }
};
```

### Priority Queue Implementation
```cpp
template<typename T, typename Compare = less<T>>
class PriorityQueue {
private:
    vector<T> heap;
    Compare comp;
    
    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (!comp(heap[parent], heap[index])) {
                break;
            }
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
            
            if (left < size && comp(heap[extreme], heap[left])) {
                extreme = left;
            }
            
            if (right < size && comp(heap[extreme], heap[right])) {
                extreme = right;
            }
            
            if (extreme == index) {
                break;
            }
            
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
        if (heap.empty()) {
            throw runtime_error("Priority queue is empty");
        }
        
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!heap.empty()) {
            heapifyDown(0);
        }
    }
    
    T top() const {
        if (heap.empty()) {
            throw runtime_error("Priority queue is empty");
        }
        return heap[0];
    }
    
    bool empty() const {
        return heap.empty();
    }
    
    size_t size() const {
        return heap.size();
    }
};
```

### Heap Sort
```cpp
void heapSort(vector<int>& arr) {
    MaxHeap heap;
    heap.buildHeap(arr);
    
    for (int i = arr.size() - 1; i >= 0; i--) {
        arr[i] = heap.extractMax();
    }
}
```

### Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Insert | O(log n) |
| Extract Max/Min | O(log n) |
| Peek | O(1) |
| Build Heap | O(n) |
| Heap Sort | O(n log n) |

## 14.3 Tries (Prefix Trees)

A **trie** (prefix tree) is a tree-like data structure for storing strings. It's particularly efficient for prefix-based searches.

### Trie Node Structure
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
        
        for (auto& pair : node->children) {
            deleteNode(pair.second);
        }
        delete node;
    }
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    ~Trie() {
        deleteNode(root);
    }
    
    void insert(const string& word) {
        TrieNode* current = root;
        
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                current->children[c] = new TrieNode();
            }
            current = current->children[c];
        }
        
        current->isEndOfWord = true;
    }
    
    bool search(const string& word) {
        TrieNode* current = root;
        
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        
        return current->isEndOfWord;
    }
    
    bool startsWith(const string& prefix) {
        TrieNode* current = root;
        
        for (char c : prefix) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        
        return true;
    }
    
    bool deleteWord(const string& word) {
        return deleteHelper(root, word, 0);
    }
    
private:
    bool deleteHelper(TrieNode* node, const string& word, int index) {
        if (!node) return false;
        
        if (index == word.length()) {
            if (!node->isEndOfWord) {
                return false;
            }
            node->isEndOfWord = false;
            return node->children.empty();
        }
        
        char c = word[index];
        if (node->children.find(c) == node->children.end()) {
            return false;
        }
        
        bool shouldDelete = deleteHelper(node->children[c], word, index + 1);
        
        if (shouldDelete) {
            delete node->children[c];
            node->children.erase(c);
            return node->children.empty() && !node->isEndOfWord;
        }
        
        return false;
    }
};
```

### Compact Trie (Array-based)
```cpp
class CompactTrie {
private:
    struct TrieNode {
        TrieNode* children[26];
        bool isEndOfWord;
        
        TrieNode() : isEndOfWord(false) {
            for (int i = 0; i < 26; i++) {
                children[i] = nullptr;
            }
        }
    };
    
    TrieNode* root;
    
public:
    CompactTrie() {
        root = new TrieNode();
    }
    
    void insert(const string& word) {
        TrieNode* current = root;
        
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) {
                current->children[index] = new TrieNode();
            }
            current = current->children[index];
        }
        
        current->isEndOfWord = true;
    }
    
    bool search(const string& word) {
        TrieNode* current = root;
        
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) {
                return false;
            }
            current = current->children[index];
        }
        
        return current->isEndOfWord;
    }
};
```

### Applications
- Autocomplete
- Spell checker
- IP routing
- Prefix matching
- String dictionary

## 14.4 Segment Trees

A **segment tree** is a data structure for range queries and updates.

### Implementation
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
            if (idx <= mid) {
                update(2 * node, start, mid, idx, val);
            } else {
                update(2 * node + 1, mid + 1, end, idx, val);
            }
            tree[node] = tree[2 * node] + tree[2 * node + 1];
        }
    }
    
    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) {
            return 0;
        }
        if (l <= start && end <= r) {
            return tree[node];
        }
        
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
    
    void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }
    
    int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }
};
```

### Range Minimum Query Segment Tree
```cpp
class RMQSegmentTree {
private:
    vector<int> tree;
    int n;
    const int INF = numeric_limits<int>::max();
    
    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2 * node, start, mid);
            build(arr, 2 * node + 1, mid + 1, end);
            tree[node] = min(tree[2 * node], tree[2 * node + 1]);
        }
    }
    
    void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            if (idx <= mid) {
                update(2 * node, start, mid, idx, val);
            } else {
                update(2 * node + 1, mid + 1, end, idx, val);
            }
            tree[node] = min(tree[2 * node], tree[2 * node + 1]);
        }
    }
    
    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) {
            return INF;
        }
        if (l <= start && end <= r) {
            return tree[node];
        }
        
        int mid = (start + end) / 2;
        return min(query(2 * node, start, mid, l, r),
                   query(2 * node + 1, mid + 1, end, l, r));
    }
    
public:
    RMQSegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n);
        build(arr, 1, 0, n - 1);
    }
    
    void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }
    
    int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }
};
```

### Time Complexity
- **Build**: O(n)
- **Query**: O(log n)
- **Update**: O(log n)
- **Space**: O(n)

## 14.5 Fenwick Trees (Binary Indexed Trees)

A **Fenwick Tree** (Binary Indexed Tree) is efficient for prefix sum queries and point updates.

### Implementation
```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;
    
    int getSum(int index) {
        int sum = 0;
        index = index + 1;
        
        while (index > 0) {
            sum += tree[index];
            index -= index & (-index); // Get parent
        }
        
        return sum;
    }
    
    void update(int index, int delta) {
        index = index + 1;
        
        while (index <= n) {
            tree[index] += delta;
            index += index & (-index); // Get next node
        }
    }
    
public:
    FenwickTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(n + 1, 0);
        
        for (int i = 0; i < n; i++) {
            update(i, arr[i]);
        }
    }
    
    int rangeSum(int l, int r) {
        return getSum(r) - getSum(l - 1);
    }
    
    void updateValue(int index, int newValue) {
        int oldValue = rangeSum(index, index);
        int delta = newValue - oldValue;
        update(index, delta);
    }
    
    int prefixSum(int index) {
        return getSum(index);
    }
};
```

### Time Complexity
- **Build**: O(n log n)
- **Query**: O(log n)
- **Update**: O(log n)
- **Space**: O(n)

### Advantages over Segment Tree
- Less memory
- Simpler implementation
- Faster in practice
- Better cache performance

## 14.6 Sparse Table

A **Sparse Table** is a data structure that allows range minimum/maximum queries (RMQ) on a static array in O(1) time after O(n log n) preprocessing. It's particularly useful when the array doesn't change.

### Key Properties

- **Static Data**: Array must be immutable (no updates)
- **Idempotent Operations**: Works for min, max, GCD (operations where f(x, x) = x)
- **Fast Queries**: O(1) query time after preprocessing
- **Memory**: O(n log n) space

### Implementation
```cpp
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

class SparseTable {
private:
    vector<vector<int>> table;
    vector<int> logTable;
    int n;
    function<int(int, int)> op; // Operation (min, max, gcd)
    
    void buildTable(const vector<int>& arr) {
        int maxLog = log2(n) + 1;
        table.resize(n, vector<int>(maxLog));
        logTable.resize(n + 1);
        
        // Precompute logarithms
        logTable[1] = 0;
        for (int i = 2; i <= n; i++) {
            logTable[i] = logTable[i / 2] + 1;
        }
        
        // Initialize first column (length 1)
        for (int i = 0; i < n; i++) {
            table[i][0] = arr[i];
        }
        
        // Build table for lengths 2^j
        for (int j = 1; j < maxLog; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                table[i][j] = op(table[i][j - 1], 
                                 table[i + (1 << (j - 1))][j - 1]);
            }
        }
    }
    
public:
    SparseTable(const vector<int>& arr, function<int(int, int)> operation) 
        : n(arr.size()), op(operation) {
        buildTable(arr);
    }
    
    // Range query [l, r] (inclusive)
    int query(int l, int r) {
        int j = logTable[r - l + 1];
        return op(table[l][j], table[r - (1 << j) + 1][j]);
    }
};

// Convenience classes
class RMQSparseTable {
private:
    SparseTable st;
    
public:
    RMQSparseTable(const vector<int>& arr) 
        : st(arr, [](int a, int b) { return min(a, b); }) {}
    
    int query(int l, int r) {
        return st.query(l, r);
    }
};

class MaxSparseTable {
private:
    SparseTable st;
    
public:
    MaxSparseTable(const vector<int>& arr) 
        : st(arr, [](int a, int b) { return max(a, b); }) {}
    
    int query(int l, int r) {
        return st.query(l, r);
    }
};
```

### Time Complexity
- **Preprocessing**: O(n log n)
- **Query**: O(1)
- **Space**: O(n log n)

### When to Use
- Static arrays (no updates)
- Many range queries
- Need O(1) query time
- Idempotent operations (min, max, GCD)

### Limitations
- Cannot handle updates efficiently
- Only works for idempotent operations
- Higher memory usage than segment trees

## 14.7 Sqrt Decomposition

**Sqrt Decomposition** is a simple technique that divides an array into √n blocks, allowing range queries and updates in O(√n) time.

### Key Idea

Divide array into blocks of size √n:
- Precompute answers for each block
- For queries spanning multiple blocks, combine block answers with individual elements

### Implementation
```cpp
#include <vector>
#include <cmath>
#include <algorithm>
#include <climits>
using namespace std;

class SqrtDecomposition {
private:
    vector<int> arr;
    vector<int> blocks;
    int blockSize;
    int n;
    
    int getBlockIndex(int index) {
        return index / blockSize;
    }
    
    int getBlockStart(int blockIndex) {
        return blockIndex * blockSize;
    }
    
    int getBlockEnd(int blockIndex) {
        return min((blockIndex + 1) * blockSize - 1, n - 1);
    }
    
public:
    SqrtDecomposition(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        int numBlocks = (n + blockSize - 1) / blockSize;
        blocks.resize(numBlocks, INT_MAX);
        
        // Precompute minimum for each block
        for (int i = 0; i < n; i++) {
            int blockIdx = getBlockIndex(i);
            blocks[blockIdx] = min(blocks[blockIdx], arr[i]);
        }
    }
    
    // Range minimum query [l, r]
    int rangeMin(int l, int r) {
        int minVal = INT_MAX;
        int leftBlock = getBlockIndex(l);
        int rightBlock = getBlockIndex(r);
        
        if (leftBlock == rightBlock) {
            // Query within single block
            for (int i = l; i <= r; i++) {
                minVal = min(minVal, arr[i]);
            }
        } else {
            // Query spans multiple blocks
            // Left partial block
            for (int i = l; i <= getBlockEnd(leftBlock); i++) {
                minVal = min(minVal, arr[i]);
            }
            
            // Complete blocks
            for (int i = leftBlock + 1; i < rightBlock; i++) {
                minVal = min(minVal, blocks[i]);
            }
            
            // Right partial block
            for (int i = getBlockStart(rightBlock); i <= r; i++) {
                minVal = min(minVal, arr[i]);
            }
        }
        
        return minVal;
    }
    
    // Update value at index
    void update(int index, int value) {
        arr[index] = value;
        int blockIdx = getBlockIndex(index);
        
        // Recompute block minimum
        blocks[blockIdx] = INT_MAX;
        int start = getBlockStart(blockIdx);
        int end = getBlockEnd(blockIdx);
        
        for (int i = start; i <= end; i++) {
            blocks[blockIdx] = min(blocks[blockIdx], arr[i]);
        }
    }
    
    // Range sum query [l, r]
    int rangeSum(int l, int r) {
        int sum = 0;
        int leftBlock = getBlockIndex(l);
        int rightBlock = getBlockIndex(r);
        
        if (leftBlock == rightBlock) {
            for (int i = l; i <= r; i++) {
                sum += arr[i];
            }
        } else {
            // Left partial block
            for (int i = l; i <= getBlockEnd(leftBlock); i++) {
                sum += arr[i];
            }
            
            // Complete blocks
            for (int i = leftBlock + 1; i < rightBlock; i++) {
                // Would need to precompute block sums
                int start = getBlockStart(i);
                int end = getBlockEnd(i);
                for (int j = start; j <= end; j++) {
                    sum += arr[j];
                }
            }
            
            // Right partial block
            for (int i = getBlockStart(rightBlock); i <= r; i++) {
                sum += arr[i];
            }
        }
        
        return sum;
    }
};
```

### Optimized Sqrt Decomposition with Block Sums
```cpp
class SqrtDecompositionSum {
private:
    vector<int> arr;
    vector<long long> blockSums;
    int blockSize;
    int n;
    
    int getBlockIndex(int index) {
        return index / blockSize;
    }
    
    int getBlockStart(int blockIndex) {
        return blockIndex * blockSize;
    }
    
    int getBlockEnd(int blockIndex) {
        return min((blockIndex + 1) * blockSize - 1, n - 1);
    }
    
public:
    SqrtDecompositionSum(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        int numBlocks = (n + blockSize - 1) / blockSize;
        blockSums.resize(numBlocks, 0);
        
        // Precompute block sums
        for (int i = 0; i < n; i++) {
            blockSums[getBlockIndex(i)] += arr[i];
        }
    }
    
    long long rangeSum(int l, int r) {
        long long sum = 0;
        int leftBlock = getBlockIndex(l);
        int rightBlock = getBlockIndex(r);
        
        if (leftBlock == rightBlock) {
            for (int i = l; i <= r; i++) {
                sum += arr[i];
            }
        } else {
            // Left partial block
            for (int i = l; i <= getBlockEnd(leftBlock); i++) {
                sum += arr[i];
            }
            
            // Complete blocks
            for (int i = leftBlock + 1; i < rightBlock; i++) {
                sum += blockSums[i];
            }
            
            // Right partial block
            for (int i = getBlockStart(rightBlock); i <= r; i++) {
                sum += arr[i];
            }
        }
        
        return sum;
    }
    
    void update(int index, int value) {
        int blockIdx = getBlockIndex(index);
        blockSums[blockIdx] += (value - arr[index]);
        arr[index] = value;
    }
};
```

### Time Complexity
- **Preprocessing**: O(n)
- **Query**: O(√n)
- **Update**: O(√n)
- **Space**: O(n)

### When to Use
- Need both queries and updates
- Simpler than segment trees
- O(√n) performance is acceptable
- Learning step before advanced structures

### Comparison with Other Structures

| Structure | Query | Update | Space | Complexity |
|-----------|-------|--------|-------|------------|
| Sparse Table | O(1) | N/A | O(n log n) | Static only |
| Segment Tree | O(log n) | O(log n) | O(n) | Full support |
| Fenwick Tree | O(log n) | O(log n) | O(n) | Prefix/point |
| Sqrt Decomp | O(√n) | O(√n) | O(n) | Simple |

## 14.8 Failure Modes and Common Pitfalls

Understanding common failure modes helps avoid bugs and performance issues.

#### 1. Heap Property Violation
```cpp
// WRONG: Not maintaining heap property
void insert(int value) {
    heap.push_back(value);  // Violates heap property!
    // Missing heapifyUp()
}

// CORRECT: Always restore heap property
void insert(int value) {
    heap.push_back(value);
    heapifyUp(heap.size() - 1);  // Restore invariant
}
```

**Why it happens**: Forgetting to restore heap property after modification
**Impact**: Extract operations return wrong value, heap becomes invalid

#### 2. Index Out of Bounds
```cpp
// WRONG: Not checking bounds
int parent(int i) {
    return (i - 1) / 2;  // Crashes if i == 0
}

void heapifyUp(int index) {
    while (index > 0) {  // Must check!
        int p = parent(index);
        // ...
    }
}
```

**Why it happens**: Array indexing without bounds checking
**Impact**: Out-of-bounds access, undefined behavior

#### 3. Incorrect Heapify Logic
```cpp
// WRONG: Only checking one child
void heapifyDown(int index) {
    int left = 2 * index + 1;
    if (heap[index] < heap[left]) {
        swap(heap[index], heap[left]);
    }
    // Missing right child check!
}

// CORRECT: Check both children
void heapifyDown(int index) {
    int largest = index;
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    
    if (left < heap.size() && heap[left] > heap[largest])
        largest = left;
    if (right < heap.size() && heap[right] > heap[largest])
        largest = right;
    // ...
}
```

**Why it happens**: Incomplete comparison logic
**Impact**: Heap property not maintained, incorrect results

#### 4. Trie Memory Leaks
```cpp
// WRONG: Not deleting children
~TrieNode() {
    // Children not deleted!
}

// CORRECT: Recursive deletion
~TrieNode() {
    for (auto& pair : children) {
        delete pair.second;  // Recursively delete
    }
}
```

**Why it happens**: Trees require recursive cleanup
**Impact**: Memory leaks, especially with many words

#### 5. Segment Tree Index Calculation Errors
```cpp
// WRONG: Incorrect segment tree indexing
int query(int node, int start, int end, int l, int r) {
    if (l > end || r < start) return 0;
    if (l <= start && end <= r) return tree[node];
    
    int mid = (start + end) / 2;
    return query(2 * node, start, mid, l, r) +  // Wrong: should be mid+1
           query(2 * node + 1, mid, end, l, r);   // Wrong: should be mid+1
}

// CORRECT: Proper range splitting
int query(int node, int start, int end, int l, int r) {
    if (l > end || r < start) return 0;
    if (l <= start && end <= r) return tree[node];
    
    int mid = (start + end) / 2;
    return query(2 * node, start, mid, l, r) +
           query(2 * node + 1, mid + 1, end, l, r);
}
```

**Why it happens**: Off-by-one errors in range splitting
**Impact**: Incorrect query results, infinite recursion

#### 6. Fenwick Tree Index Confusion
```cpp
// WRONG: Using 0-based indexing directly
void update(int index, int delta) {
    index++;  // Convert to 1-based
    while (index <= n) {
        tree[index] += delta;
        index += index & -index;  // Correct
    }
}

int query(int index) {
    // WRONG: Forgot to convert to 1-based
    int sum = 0;
    while (index > 0) {
        sum += tree[index];
        index -= index & -index;
    }
    return sum;
}
```

**Why it happens**: Fenwick trees use 1-based indexing internally
**Impact**: Incorrect prefix sums, wrong query results

## 14.9 Key Takeaways

1. **Heaps** provide efficient priority queue operations
2. **Tries** excel at prefix-based string operations
3. **Segment Trees** support range queries and updates
4. **Fenwick Trees** are simpler and faster for prefix sums
5. **Sparse Table** provides O(1) queries for static arrays
6. **Sqrt Decomposition** offers simple O(√n) queries and updates
7. Choose the right structure based on operation requirements and constraints

## 14.10 Exercises

1. Implement a k-way merge using a min-heap.

2. Create a trie that supports wildcard matching.

3. Implement a segment tree for range maximum query with lazy propagation.

4. Build a Fenwick tree that supports range updates.

5. Implement a heap that supports decrease key operation.

6. Create a trie that can find all words with a given prefix.

7. Implement a segment tree for range sum with range updates.

8. Build a priority queue that supports updating priorities.

9. Create a trie-based autocomplete system.

10. Implement a Fenwick tree for 2D prefix sums.

11. Create a Sparse Table for range GCD queries.

12. Implement Sqrt Decomposition for range sum with range updates.

13. Compare the performance of Sparse Table vs Segment Tree for static arrays.

14. Implement a Sqrt Decomposition that supports range minimum and range sum queries.

## 14.10 Summary

Advanced data structures provide specialized operations for specific use cases. Understanding when and how to use heaps, tries, segment trees, and Fenwick trees is essential for solving complex problems efficiently.

**What We Learned:**
- Heaps maintain heap property invariant for efficient priority queue operations
- Tries enable fast prefix-based string operations
- Segment Trees and Fenwick Trees support efficient range queries
- Sparse Table and Sqrt Decomposition offer alternative approaches for range queries
- Common pitfalls: heap property violations, index calculation errors, memory leaks

**Why the Next Chapter Follows:**
Now that we've covered advanced data structures, we'll explore **greedy algorithms** in Chapter 16. These algorithms make locally optimal choices at each step, and many greedy algorithms (like Huffman coding) rely on heaps and other advanced structures we've just learned.

