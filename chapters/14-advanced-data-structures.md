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
7. **Skip Lists**: Probabilistic alternative to balanced trees
8. **Bloom Filters**: Space-efficient probabilistic membership testing
9. **Count-Min Sketch**: Probabilistic frequency counting for data streams
10. **Fibonacci Heap**: Advanced heap with O(1) amortized decrease-key
11. **Suffix Array/Tree**: Efficient string operations and pattern matching
12. **Persistent Data Structures**: Maintain all versions of data structure

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

## 14.8 Skip Lists

A **skip list** is a probabilistic data structure that provides O(log n) average-case performance for search, insertion, and deletion operations. It's simpler to implement than balanced trees (Chapter 6) while offering similar performance characteristics.

### 14.8.1 Introduction to Skip Lists

Skip lists use multiple sorted linked lists (Chapter 4) with different levels of "express lanes" to skip over elements. Higher levels contain fewer elements, allowing fast navigation.

#### Key Characteristics

- **Probabilistic Structure**: Height determined probabilistically
- **O(log n) Average Performance**: Similar to balanced trees
- **Simpler than Trees**: Easier to implement than AVL/Red-Black trees
- **Dynamic**: Supports efficient insertions and deletions

### 14.8.2 Skip List Structure

```
Level 3:  [1] --------------------------> [9]
Level 2:  [1] --------> [5] --------> [9]
Level 1:  [1] -> [3] -> [5] -> [7] -> [9]
Level 0:  [1] [2] [3] [4] [5] [6] [7] [8] [9]
```

Each node has:
- **Data**: The value stored
- **Forward pointers**: Array of pointers to next nodes at each level
- **Level**: Maximum level this node appears in

### 14.8.3 Skip List Implementation

```cpp
#include <iostream>
#include <vector>
#include <random>
#include <climits>
using namespace std;

class SkipListNode {
public:
    int value;
    vector<SkipListNode*> forward;
    int level;
    
    SkipListNode(int val, int lvl) : value(val), level(lvl) {
        forward.resize(lvl + 1, nullptr);
    }
};

class SkipList {
private:
    SkipListNode* header;
    int maxLevel;
    int currentLevel;
    random_device rd;
    mt19937 gen;
    uniform_real_distribution<> dis;
    
    int randomLevel() {
        int level = 0;
        while (dis(gen) < 0.5 && level < maxLevel) {
            level++;
        }
        return level;
    }
    
public:
    SkipList(int maxLvl = 16) : maxLevel(maxLvl), currentLevel(0), gen(rd()), dis(0.0, 1.0) {
        header = new SkipListNode(INT_MIN, maxLevel);
    }
    
    bool search(int target) {
        SkipListNode* current = header;
        
        // Start from highest level
        for (int i = currentLevel; i >= 0; i--) {
            while (current->forward[i] != nullptr && 
                   current->forward[i]->value < target) {
                current = current->forward[i];
            }
        }
        
        current = current->forward[0];
        return (current != nullptr && current->value == target);
    }
    
    void insert(int value) {
        vector<SkipListNode*> update(maxLevel + 1, nullptr);
        SkipListNode* current = header;
        
        // Find insertion point at each level
        for (int i = currentLevel; i >= 0; i--) {
            while (current->forward[i] != nullptr && 
                   current->forward[i]->value < value) {
                current = current->forward[i];
            }
            update[i] = current;
        }
        
        current = current->forward[0];
        
        // If value already exists, don't insert
        if (current == nullptr || current->value != value) {
            int newLevel = randomLevel();
            
            // Update max level if needed
            if (newLevel > currentLevel) {
                for (int i = currentLevel + 1; i <= newLevel; i++) {
                    update[i] = header;
                }
                currentLevel = newLevel;
            }
            
            // Create new node
            SkipListNode* newNode = new SkipListNode(value, newLevel);
            
            // Insert at each level
            for (int i = 0; i <= newLevel; i++) {
                newNode->forward[i] = update[i]->forward[i];
                update[i]->forward[i] = newNode;
            }
        }
    }
    
    void remove(int value) {
        vector<SkipListNode*> update(maxLevel + 1, nullptr);
        SkipListNode* current = header;
        
        // Find node to delete
        for (int i = currentLevel; i >= 0; i--) {
            while (current->forward[i] != nullptr && 
                   current->forward[i]->value < value) {
                current = current->forward[i];
            }
            update[i] = current;
        }
        
        current = current->forward[0];
        
        // If found, remove from all levels
        if (current != nullptr && current->value == value) {
            for (int i = 0; i <= currentLevel; i++) {
                if (update[i]->forward[i] != current) {
                    break;
                }
                update[i]->forward[i] = current->forward[i];
            }
            
            delete current;
            
            // Update current level
            while (currentLevel > 0 && header->forward[currentLevel] == nullptr) {
                currentLevel--;
            }
        }
    }
    
    void print() {
        for (int i = currentLevel; i >= 0; i--) {
            SkipListNode* node = header->forward[i];
            cout << "Level " << i << ": ";
            while (node != nullptr) {
                cout << node->value << " ";
                node = node->forward[i];
            }
            cout << endl;
        }
    }
};
```

### 14.8.4 Performance Analysis

**Time Complexity:**
- **Search**: O(log n) average, O(n) worst case
- **Insert**: O(log n) average
- **Delete**: O(log n) average

**Space Complexity:** O(n) average (each element appears in ~2 levels on average)

**Comparison with Balanced Trees:**
- **Skip Lists**: Simpler implementation, probabilistic guarantees
- **Balanced Trees** (Chapter 6): Deterministic guarantees, more complex

### 14.8.5 Applications

- **Redis**: Uses skip lists for sorted sets
- **Concurrent Data Structures**: Easier to make thread-safe than trees
- **Alternative to Balanced Trees**: When simplicity matters

## 14.9 Bloom Filters

A **Bloom filter** is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It can have false positives but never false negatives.

### 14.9.1 Introduction to Bloom Filters

Bloom filters provide O(1) insertion and lookup with minimal space overhead, making them ideal for large-scale systems where approximate membership testing is acceptable.

#### Key Characteristics

- **Probabilistic**: May return false positives (but never false negatives)
- **Space Efficient**: Uses much less memory than hash tables (Chapter 10)
- **Fast Operations**: O(k) where k is number of hash functions (typically small)
- **No Deletion**: Standard Bloom filters don't support deletion

### 14.9.2 How Bloom Filters Work

1. **Initialization**: Create a bit array of size m (all bits set to 0)
2. **Insertion**: Hash element with k hash functions, set corresponding bits to 1
3. **Lookup**: Hash element with k hash functions, check if all bits are 1

```
Insert "apple":
  hash1("apple") = 3  → set bit[3] = 1
  hash2("apple") = 7  → set bit[7] = 1
  hash3("apple") = 12 → set bit[12] = 1

Check "apple":
  hash1("apple") = 3  → bit[3] = 1 ✓
  hash2("apple") = 7  → bit[7] = 1 ✓
  hash3("apple") = 12 → bit[12] = 1 ✓
  → "apple" is probably in set
```

### 14.9.3 Bloom Filter Implementation

```cpp
#include <iostream>
#include <vector>
#include <functional>
#include <bitset>
#include <cmath>
using namespace std;

class BloomFilter {
private:
    vector<bool> bits;
    int size;
    int numHashFunctions;
    
    // Simple hash functions
    size_t hash1(const string& key) const {
        hash<string> hasher;
        return hasher(key) % size;
    }
    
    size_t hash2(const string& key) const {
        hash<string> hasher;
        return (hasher(key) * 31) % size;
    }
    
    size_t hash3(const string& key) const {
        hash<string> hasher;
        return (hasher(key) * 17 + 7) % size;
    }
    
public:
    BloomFilter(int expectedElements, double falsePositiveRate) {
        // Calculate optimal size: m = -n * ln(p) / (ln(2)^2)
        size = static_cast<int>(-expectedElements * log(falsePositiveRate) / (log(2) * log(2)));
        
        // Calculate optimal number of hash functions: k = (m/n) * ln(2)
        numHashFunctions = static_cast<int>((size / expectedElements) * log(2));
        
        bits.resize(size, false);
        
        cout << "Bloom Filter initialized:" << endl;
        cout << "  Size: " << size << " bits" << endl;
        cout << "  Hash functions: " << numHashFunctions << endl;
    }
    
    void insert(const string& key) {
        bits[hash1(key)] = true;
        bits[hash2(key)] = true;
        bits[hash3(key)] = true;
        
        // Add more hash functions if needed
        for (int i = 3; i < numHashFunctions; i++) {
            size_t h = (hash1(key) + i * hash2(key)) % size;
            bits[h] = true;
        }
    }
    
    bool contains(const string& key) const {
        if (!bits[hash1(key)]) return false;
        if (!bits[hash2(key)]) return false;
        if (!bits[hash3(key)]) return false;
        
        // Check additional hash functions
        for (int i = 3; i < numHashFunctions; i++) {
            size_t h = (hash1(key) + i * hash2(key)) % size;
            if (!bits[h]) return false;
        }
        
        return true; // Probably in set (may be false positive)
    }
    
    double getFalsePositiveRate(int numElements) const {
        // p = (1 - e^(-kn/m))^k
        double exponent = -numHashFunctions * numElements / (double)size;
        return pow(1 - exp(exponent), numHashFunctions);
    }
};
```

### 14.9.4 Performance Analysis

**Time Complexity:**
- **Insert**: O(k) where k is number of hash functions (typically 3-10)
- **Lookup**: O(k)
- **Space**: O(m) where m is bit array size

**False Positive Rate:**
- Depends on size m, number of elements n, and hash functions k
- Optimal k ≈ (m/n) * ln(2)
- False positive rate ≈ (1 - e^(-kn/m))^k

### 14.9.5 Applications

- **Database Systems**: Avoid expensive disk lookups
- **Web Caches**: Check if URL is cached before expensive lookup
- **Network Routers**: Fast packet routing decisions
- **Distributed Systems**: Reduce network queries
- **Spell Checkers**: Quick word existence check

### 14.9.6 Counting Bloom Filters

Standard Bloom filters don't support deletion. **Counting Bloom Filters** use counters instead of bits to enable deletion:

```cpp
class CountingBloomFilter {
private:
    vector<int> counters;
    int size;
    int numHashFunctions;
    
public:
    CountingBloomFilter(int expectedElements, double falsePositiveRate) {
        size = static_cast<int>(-expectedElements * log(falsePositiveRate) / (log(2) * log(2)));
        numHashFunctions = static_cast<int>((size / expectedElements) * log(2));
        counters.resize(size, 0);
    }
    
    void insert(const string& key) {
        // Increment counters instead of setting bits
        counters[hash1(key)]++;
        counters[hash2(key)]++;
        counters[hash3(key)]++;
    }
    
    void remove(const string& key) {
        // Decrement counters
        counters[hash1(key)]--;
        counters[hash2(key)]--;
        counters[hash3(key)]--;
    }
    
    bool contains(const string& key) const {
        return counters[hash1(key)] > 0 &&
               counters[hash2(key)] > 0 &&
               counters[hash3(key)] > 0;
    }
};
```

## 14.10 Count-Min Sketch

A **Count-Min Sketch** is a probabilistic data structure that provides approximate frequency counts for elements in a stream. It's space-efficient and uses multiple hash functions, similar to Bloom Filters (Section 14.9), but designed for counting rather than membership testing.

### 14.10.1 Introduction to Count-Min Sketch

Count-Min Sketch estimates the frequency of elements in a data stream with guaranteed error bounds. It's particularly useful for:
- **Heavy hitters**: Finding most frequent elements
- **Frequency estimation**: Approximate counts in large datasets
- **Stream processing**: Real-time frequency tracking
- **Network monitoring**: Tracking packet frequencies

#### Key Characteristics

- **Probabilistic**: Provides approximate counts (may overestimate, never underestimate)
- **Space Efficient**: Uses O(d × w) space where d is depth (hash functions) and w is width
- **Fast Operations**: O(d) time for increment and query
- **Guaranteed Bounds**: Error is bounded with high probability

### 14.10.2 How Count-Min Sketch Works

Count-Min Sketch uses a 2D array (d rows × w columns) and d independent hash functions:

1. **Initialization**: Create d × w array, all initialized to 0
2. **Increment**: For element x, hash it with each of d hash functions, increment corresponding cells
3. **Query**: For element x, hash it with each hash function, return minimum count across all d cells

**Why minimum?** Since we may have collisions, counts can only increase. Taking the minimum gives the best estimate (closest to true count).

```
Example with d=3, w=5:

Increment "apple":
  hash1("apple") = 2  → increment sketch[0][2]
  hash2("apple") = 0  → increment sketch[1][0]
  hash3("apple") = 4  → increment sketch[2][4]

Query "apple":
  hash1("apple") = 2  → sketch[0][2] = 1
  hash2("apple") = 0  → sketch[1][0] = 1
  hash3("apple") = 4  → sketch[2][4] = 1
  → min(1, 1, 1) = 1 (true count)
```

### 14.10.3 Count-Min Sketch Implementation

```cpp
#include <iostream>
#include <vector>
#include <functional>
#include <algorithm>
#include <climits>
#include <cmath>
using namespace std;

class CountMinSketch {
private:
    vector<vector<int>> sketch;
    int depth;  // Number of hash functions (rows)
    int width;  // Number of buckets per hash function (columns)
    vector<function<size_t(const string&)>> hashFunctions;
    
    // Simple hash functions (in practice, use better ones)
    size_t hash1(const string& key) const {
        hash<string> hasher;
        return hasher(key) % width;
    }
    
    size_t hash2(const string& key) const {
        hash<string> hasher;
        return (hasher(key) * 31) % width;
    }
    
    size_t hash3(const string& key) const {
        hash<string> hasher;
        return (hasher(key) * 17 + 7) % width;
    }
    
    size_t hash4(const string& key) const {
        hash<string> hasher;
        return (hasher(key) * 13 + 11) % width;
    }
    
public:
    CountMinSketch(int d, int w) : depth(d), width(w) {
        sketch.resize(depth, vector<int>(width, 0));
        
        // Initialize hash functions
        hashFunctions.push_back([this](const string& k) { return hash1(k); });
        hashFunctions.push_back([this](const string& k) { return hash2(k); });
        hashFunctions.push_back([this](const string& k) { return hash3(k); });
        if (depth > 3) {
            hashFunctions.push_back([this](const string& k) { return hash4(k); });
        }
    }
    
    // Increment count for an element
    void increment(const string& key) {
        for (int i = 0; i < depth; i++) {
            size_t index = hashFunctions[i](key);
            sketch[i][index]++;
        }
    }
    
    // Query approximate count
    int query(const string& key) const {
        int minCount = INT_MAX;
        for (int i = 0; i < depth; i++) {
            size_t index = hashFunctions[i](key);
            minCount = min(minCount, sketch[i][index]);
        }
        return minCount;
    }
    
    // Get error bound (with probability 1 - δ)
    // Error ≤ (ε × N) with probability ≥ (1 - δ)
    // where N is total number of increments
    double getErrorBound(int totalIncrements, double epsilon, double delta) const {
        // width = ceil(e/ε), depth = ceil(ln(1/δ))
        // Error ≤ ε × N with probability ≥ 1 - δ
        return epsilon * totalIncrements;
    }
    
    void print() const {
        cout << "Count-Min Sketch (depth=" << depth << ", width=" << width << "):" << endl;
        for (int i = 0; i < depth; i++) {
            cout << "Row " << i << ": ";
            for (int j = 0; j < width; j++) {
                cout << sketch[i][j] << " ";
            }
            cout << endl;
        }
    }
};
```

### 14.10.4 Performance Analysis

**Time Complexity:**
- **Increment**: O(d) where d is number of hash functions
- **Query**: O(d)
- **Space**: O(d × w)

**Error Analysis:**
- **Guarantee**: With probability ≥ (1 - δ), error ≤ ε × N
- **Parameters**: 
  - Width w = ⌈e/ε⌉ (e ≈ 2.718)
  - Depth d = ⌈ln(1/δ)⌉
- **Example**: For ε = 0.01 (1% error), δ = 0.01 (1% failure probability):
  - w = ⌈2.718/0.01⌉ = 272
  - d = ⌈ln(100)⌉ = 5
  - Space = 272 × 5 = 1,360 integers

**Why It Works:**
- Hash collisions cause overestimation (never underestimation)
- Taking minimum across d independent hash functions reduces error
- More hash functions (depth) → higher accuracy
- More buckets (width) → lower collision probability

### 14.10.5 Applications

**1. Heavy Hitters Problem**
Find elements with frequency > threshold:

```cpp
vector<string> findHeavyHitters(const vector<string>& stream, 
                                 double threshold, 
                                 int totalElements) {
    CountMinSketch cms(5, 272); // ε=0.01, δ=0.01
    
    // Count all elements
    for (const string& elem : stream) {
        cms.increment(elem);
    }
    
    // Find heavy hitters
    vector<string> heavyHitters;
    for (const string& elem : stream) {
        int count = cms.query(elem);
        if (count >= threshold * totalElements) {
            heavyHitters.push_back(elem);
        }
    }
    
    return heavyHitters;
}
```

**2. Network Traffic Monitoring**
- Track packet frequencies
- Identify DDoS attacks (unusual frequency patterns)
- Monitor bandwidth usage

**3. Database Query Optimization**
- Estimate frequency of query patterns
- Cache frequently accessed data

**4. Recommendation Systems**
- Track item view frequencies
- Identify trending items

### 14.10.6 Comparison with Other Structures

| Structure | Purpose | Space | Error | Notes |
|-----------|---------|-------|-------|-------|
| **Hash Table** (Chapter 10) | Exact counting | O(n) | None | Exact but uses more space |
| **Count-Min Sketch** | Approximate counting | O(d×w) | Overestimate | Space-efficient, probabilistic |
| **Bloom Filter** (Section 14.9) | Membership test | O(m) | False positives | Different purpose (membership vs. counting) |

**When to Use Count-Min Sketch:**
- ✅ Large data streams where exact counts aren't needed
- ✅ Space is constrained
- ✅ Approximate counts are acceptable
- ✅ Need to handle high-frequency updates

**When NOT to Use:**
- ❌ Exact counts are required
- ❌ Small datasets (overhead not worth it)
- ❌ Need to decrement counts (standard CMS doesn't support)

### 14.10.7 Variants and Extensions

**1. Count Sketch**
Similar to Count-Min but can have negative errors (more accurate on average):

```cpp
class CountSketch {
    // Uses random signs (+1/-1) to reduce bias
    // Better average error, but can underestimate
};
```

**2. Hierarchical Count-Min Sketch**
Tracks frequencies at multiple time scales (recent, hourly, daily).

**3. Conservative Update**
Only updates minimum cells, reducing overestimation.

## 14.11 Fibonacci Heap

**Fibonacci Heap** is an advanced heap data structure that provides better amortized time complexity for decrease-key and merge operations compared to binary heaps. It's particularly useful for algorithms like Dijkstra's shortest path.

### Why Fibonacci Heap?

While binary heaps are excellent for most applications, Fibonacci heaps offer:
- **O(1) amortized decrease-key**: Critical for Dijkstra's algorithm
- **O(1) amortized merge**: Efficient heap merging
- **O(log n) extract-min**: Same as binary heap
- **Lazy operations**: Defer work until necessary

### Structure

Fibonacci heaps are collections of heap-ordered trees (min-heap property) with:
- **Root list**: Circular doubly-linked list of tree roots
- **Min pointer**: Points to minimum root
- **Degree array**: Tracks trees by degree
- **Marked nodes**: Track nodes that lost a child (for decrease-key optimization)

### Key Operations

| Operation | Binary Heap | Fibonacci Heap |
|-----------|-------------|----------------|
| Insert | O(log n) | O(1) amortized |
| Extract Min | O(log n) | O(log n) amortized |
| Decrease Key | O(log n) | O(1) amortized |
| Merge | O(n) | O(1) amortized |
| Delete | O(log n)) | O(log n) amortized |

### Implementation Overview

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <climits>
using namespace std;

class FibonacciHeap {
private:
    struct Node {
        int key;
        int degree;
        bool marked;
        Node* parent;
        Node* child;
        Node* left;
        Node* right;
        
        Node(int k) : key(k), degree(0), marked(false),
                     parent(nullptr), child(nullptr),
                     left(this), right(this) {}
    };
    
    Node* minNode;
    int numNodes;
    
    // Consolidate trees of same degree
    void consolidate() {
        vector<Node*> degreeTable(64, nullptr);  // Max degree ~64 for practical sizes
        
        Node* current = minNode;
        list<Node*> roots;
        
        // Collect all roots
        do {
            roots.push_back(current);
            current = current->right;
        } while (current != minNode);
        
        // Process each root
        for (Node* root : roots) {
            int degree = root->degree;
            
            // Merge trees of same degree
            while (degreeTable[degree] != nullptr) {
                Node* other = degreeTable[degree];
                
                // Make root with smaller key the parent
                if (root->key > other->key) {
                    swap(root, other);
                }
                
                // Link other as child of root
                link(other, root);
                degreeTable[degree] = nullptr;
                degree++;
            }
            
            degreeTable[degree] = root;
        }
        
        // Rebuild root list and find new min
        minNode = nullptr;
        for (Node* node : degreeTable) {
            if (node != nullptr) {
                if (minNode == nullptr || node->key < minNode->key) {
                    minNode = node;
                }
            }
        }
    }
    
    // Link node as child of parent
    void link(Node* node, Node* parent) {
        // Remove from root list
        node->left->right = node->right;
        node->right->left = node->left;
        
        // Add to parent's child list
        if (parent->child == nullptr) {
            parent->child = node;
            node->left = node;
            node->right = node;
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
    
public:
    FibonacciHeap() : minNode(nullptr), numNodes(0) {}
    
    void insert(int key) {
        Node* node = new Node(key);
        
        if (minNode == nullptr) {
            minNode = node;
        } else {
            // Add to root list
            node->right = minNode;
            node->left = minNode->left;
            minNode->left->right = node;
            minNode->left = node;
            
            if (key < minNode->key) {
                minNode = node;
            }
        }
        
        numNodes++;
    }
    
    int extractMin() {
        if (minNode == nullptr) {
            throw runtime_error("Heap is empty");
        }
        
        Node* min = minNode;
        int minKey = min->key;
        
        // Add children to root list
        if (min->child != nullptr) {
            Node* child = min->child;
            do {
                Node* next = child->right;
                child->parent = nullptr;
                
                // Add to root list
                child->right = minNode;
                child->left = minNode->left;
                minNode->left->right = child;
                minNode->left = child;
                
                child = next;
            } while (child != min->child);
        }
        
        // Remove min from root list
        min->left->right = min->right;
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
    
    bool empty() const {
        return minNode == nullptr;
    }
};
```

### When to Use Fibonacci Heap

**Use Fibonacci Heap When**:
- Implementing Dijkstra's algorithm with many decrease-key operations
- Need frequent heap merging
- Decrease-key is the dominant operation

**Use Binary Heap When**:
- Simplicity is important
- Operations are balanced (not just decrease-key)
- Memory overhead matters (Fibonacci heaps have higher constant factors)

### Real-World Application: Dijkstra's Algorithm

```cpp
// Dijkstra's with Fibonacci Heap - O(V log V + E) instead of O((V + E) log V)
// Better when E >> V (dense graphs)
```

**Key Insight**: Fibonacci heaps shine when decrease-key operations dominate, as in Dijkstra's algorithm on dense graphs. For most applications, binary heaps are simpler and sufficient.

## 14.12 Suffix Array and Suffix Tree

**Suffix Array** and **Suffix Tree** are advanced data structures for efficient string operations, particularly substring search and pattern matching.

### Suffix Array

A **suffix array** is a sorted array of all suffixes of a string. It enables efficient substring search and many string algorithms.

#### Construction

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class SuffixArray {
private:
    string text;
    vector<int> suffixArray;
    vector<int> lcp;  // Longest Common Prefix array
    
    void buildSuffixArray() {
        int n = text.length();
        suffixArray.resize(n);
        
        // Initialize with indices
        for (int i = 0; i < n; i++) {
            suffixArray[i] = i;
        }
        
        // Sort by suffixes (naive O(n² log n) approach)
        // In practice, use O(n log n) algorithms like DC3 or SA-IS
        sort(suffixArray.begin(), suffixArray.end(), 
             [this](int a, int b) {
                 return text.substr(a) < text.substr(b);
             });
    }
    
    void buildLCP() {
        int n = text.length();
        lcp.resize(n);
        lcp[0] = 0;
        
        for (int i = 1; i < n; i++) {
            int len = 0;
            int a = suffixArray[i - 1];
            int b = suffixArray[i];
            
            while (a + len < n && b + len < n && 
                   text[a + len] == text[b + len]) {
                len++;
            }
            
            lcp[i] = len;
        }
    }
    
public:
    SuffixArray(const string& s) : text(s) {
        text += '$';  // Sentinel character
        buildSuffixArray();
        buildLCP();
    }
    
    // Search for pattern - O(m log n) where m is pattern length
    bool search(const string& pattern) {
        int left = 0, right = suffixArray.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int suffixIndex = suffixArray[mid];
            string suffix = text.substr(suffixIndex);
            
            if (suffix.substr(0, pattern.length()) == pattern) {
                return true;
            } else if (suffix < pattern) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return false;
    }
    
    // Find all occurrences of pattern
    vector<int> findAllOccurrences(const string& pattern) {
        vector<int> occurrences;
        int left = 0, right = suffixArray.size() - 1;
        
        // Binary search for first occurrence
        int first = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int suffixIndex = suffixArray[mid];
            string suffix = text.substr(suffixIndex);
            
            if (suffix.substr(0, pattern.length()) == pattern) {
                first = mid;
                right = mid - 1;
            } else if (suffix < pattern) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        if (first == -1) return occurrences;
        
        // Find last occurrence
        left = first;
        right = suffixArray.size() - 1;
        int last = first;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int suffixIndex = suffixArray[mid];
            string suffix = text.substr(suffixIndex);
            
            if (suffix.substr(0, pattern.length()) == pattern) {
                last = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Collect all occurrences
        for (int i = first; i <= last; i++) {
            occurrences.push_back(suffixArray[i]);
        }
        
        return occurrences;
    }
    
    vector<int> getSuffixArray() const {
        return suffixArray;
    }
    
    vector<int> getLCP() const {
        return lcp;
    }
};
```

### Suffix Tree

A **suffix tree** is a compressed trie containing all suffixes of a string. It enables O(m) substring search where m is pattern length.

#### Key Properties

- **Space**: O(n) with Ukkonen's algorithm
- **Construction**: O(n) with Ukkonen's algorithm
- **Search**: O(m) for pattern of length m
- **Applications**: Longest common substring, longest repeated substring, substring search

#### Applications

1. **Substring Search**: O(m) time for pattern of length m
2. **Longest Common Substring**: Between two strings
3. **Longest Repeated Substring**: In a single string
4. **String Compression**: LZ77 algorithm uses suffix trees
5. **Bioinformatics**: DNA sequence analysis

**Note**: Suffix trees are complex to implement. Suffix arrays are often preferred in practice due to simpler implementation and similar performance.

### When to Use

**Use Suffix Array/Tree When**:
- Need to search for many patterns in same text
- String processing is performance-critical
- Need advanced string operations (LCS, repeated substrings)

**Use Simple String Search When**:
- Single pattern search
- Text is small
- Simplicity is important

## 14.13 Persistent Data Structures

**Persistent data structures** maintain all previous versions when modified. They're essential for functional programming and time-travel queries.

### Types of Persistence

1. **Partial Persistence**: Can access all previous versions, but only modify latest
2. **Full Persistence**: Can access and modify any previous version
3. **Confluent Persistence**: Can merge versions

### Persistent Segment Tree Example

```cpp
#include <iostream>
#include <vector>
using namespace std;

class PersistentSegmentTree {
private:
    struct Node {
        int value;
        Node* left;
        Node* right;
        
        Node(int v) : value(v), left(nullptr), right(nullptr) {}
        Node(Node* l, Node* r) : value(0), left(l), right(r) {
            if (l) value += l->value;
            if (r) value += r->value;
        }
    };
    
    vector<Node*> roots;  // Store roots of all versions
    int n;
    
    Node* build(vector<int>& arr, int left, int right) {
        if (left == right) {
            return new Node(arr[left]);
        }
        
        int mid = left + (right - left) / 2;
        Node* l = build(arr, left, mid);
        Node* r = build(arr, mid + 1, right);
        return new Node(l, r);
    }
    
    Node* update(Node* node, int left, int right, int index, int value) {
        if (left == right) {
            return new Node(value);
        }
        
        int mid = left + (right - left) / 2;
        if (index <= mid) {
            return new Node(update(node->left, left, mid, index, value), 
                           node->right);
        } else {
            return new Node(node->left, 
                           update(node->right, mid + 1, right, index, value));
        }
    }
    
    int query(Node* node, int left, int right, int qLeft, int qRight) {
        if (qRight < left || qLeft > right) return 0;
        if (qLeft <= left && right <= qRight) return node->value;
        
        int mid = left + (right - left) / 2;
        return query(node->left, left, mid, qLeft, qRight) +
               query(node->right, mid + 1, right, qLeft, qRight);
    }
    
public:
    PersistentSegmentTree(vector<int>& arr) {
        n = arr.size();
        roots.push_back(build(arr, 0, n - 1));
    }
    
    // Create new version by updating
    void update(int version, int index, int value) {
        Node* newRoot = update(roots[version], 0, n - 1, index, value);
        roots.push_back(newRoot);
    }
    
    // Query a specific version
    int query(int version, int left, int right) {
        return query(roots[version], 0, n - 1, left, right);
    }
    
    int getLatestVersion() {
        return roots.size() - 1;
    }
};
```

### Applications

1. **Time-Travel Queries**: "What was the sum at time t?"
2. **Functional Programming**: Immutable data structures
3. **Version Control**: Track changes over time
4. **Rollback Operations**: Revert to previous state

### When to Use

**Use Persistent Structures When**:
- Need to access historical versions
- Functional programming paradigm
- Time-travel queries required

**Use Regular Structures When**:
- Only need current state
- Memory is constrained
- Simplicity is important

## 14.14 Failure Modes and Common Pitfalls

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

## 14.15 Key Takeaways

1. **Heaps** provide efficient priority queue operations
2. **Tries** excel at prefix-based string operations
3. **Segment Trees** support range queries and updates
4. **Fenwick Trees** are simpler and faster for prefix sums
5. **Sparse Table** provides O(1) queries for static arrays
6. **Sqrt Decomposition** offers simple O(√n) queries and updates
7. Choose the right structure based on operation requirements and constraints

## 14.16 Exercises

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

## 14.17 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to heaps and priority queues. See Section 3.5.3 for invariant-based reasoning and Section 3.5.9 for producer-consumer patterns.

### 14.14.1 Shared-State Invariants

**Core Heap Invariants** (see Section 3.5.3):
1. **Heap Property Invariant**: "Parent >= all children (max-heap) or Parent <= all children (min-heap)"
2. **Complete Tree Invariant**: "Tree is complete (all levels filled except possibly last, left-to-right)"
3. **Size Invariant**: "`size` equals number of elements"

**What Must Not Be Observed Half-Updated**:
- Heap property violations during bubble up/down
- Size changes while elements are being inserted/extracted
- Parent-child relationships during tree restructuring

### 14.14.2 Operations That Must Be Atomic

**Insert Operation** (see Section 3.5.4):
```cpp
void insert(int value) {
    heap[size] = value;        // Step 1: Add to end
    size++;                     // Step 2: Update size
    bubbleUp(size - 1);         // Step 3: Restore heap property
}
```

**Tie to Invariants**: Between steps, the **Size Invariant** and **Heap Property Invariant** are violated. Another thread may see incorrect size or inconsistent heap structure.

**Extract Operation**:
```cpp
int extractMax() {
    int max = heap[0];          // Step 1: Get root
    heap[0] = heap[size - 1];   // Step 2: Move last to root
    size--;                      // Step 3: Decrease size
    bubbleDown(0);              // Step 4: Restore heap property
    return max;
}
```

**Tie to Invariants**: Similar race conditions, plus check-then-act bug (checking `size > 0` and extracting must be atomic).

**Operations Requiring Atomicity**:
- **Insert**: Entire operation (add element, update size, bubble up)
- **Extract**: Entire operation (get root, move last, update size, bubble down)
- **Empty Check + Extract**: Must be atomic (check-then-act)

### 14.14.3 Naïve Approaches and Why They Fail

**1. Partial Updates**:
```cpp
// Thread 1: Inserting 10, bubble up
// Thread 2: Inserting 20, bubble up
// Both may see inconsistent parent values during bubble up
```
**Why It Fails**: Insert is not atomic. Invariant violation: **Heap Property Invariant** broken.

**2. Check-Then-Act Bugs**:
```cpp
if (size > 0) {        // Check
    // Another thread extracts here!
    return extractMax();  // May extract from empty heap
}
```
**Why It Fails**: Check and extract are not atomic. Invariant violation: **Size Invariant** broken.

**3. Locking Only Part of the Structure**:
```cpp
// Locking only during insert, not during extract
void insert(int value) {
    std::lock_guard<std::mutex> lock(mtx);
    // insert operation
}
// But extract is unprotected!
int extractMax() {
    return heap[0];  // Race condition!
}
```
**Why It Fails**: Operations are not mutually exclusive. Invariant violation: **Heap Property Invariant** broken.

### 14.14.4 Locking Strategies

**Coarse-Grained Lock** (see Section 3.5.8):
```cpp
class ThreadSafeHeap {
    std::vector<int> heap;
    std::mutex mtx;
    
public:
    void insert(int value) {
        std::lock_guard<std::mutex> lock(mtx);
        // Entire operation atomic
    }
};
```
- ✅ Simple, prevents all race conditions
- ❌ Very low parallelism (only one operation at a time)

**Fine-Grained Lock (Per-Node)**:
- Not practical for heaps (operations traverse tree, need multiple locks)
- High overhead, complex deadlock avoidance
- **Not recommended**

**Read-Write Locks** (see Section 3.5.8):
- Use `std::shared_mutex` for read-heavy workloads
- Multiple readers, single writer
- Less useful for heaps (operations are write-heavy)

**Lock-Free** (see Section 3.5.9):
- Lock-free heaps are extremely complex
- Lock-free skip lists can be used to implement priority queues
- Lock-free binomial heaps are research-level implementations
- **Recommendation**: Use lock-based approach. Lock-free heaps are rarely worth the complexity.

### 14.14.5 Performance and Scalability Implications

**Contention** (see Section 3.5.8):
- Coarse-grained locking: Very high contention, throughput collapses
- Fine-grained locking: Not practical for heaps

**Throughput Collapse Under Load**:
- With many threads, coarse-grained locking becomes severe bottleneck
- Consider multiple heaps (thread-local heaps, merge periodically)

**Producer-Consumer Pattern** (see Section 3.5.9):
- Use `std::condition_variable` for bounded priority queues
- Allows efficient blocking when queue is empty
- Always check condition in loop (spurious wakeups)

### 14.14.6 When Not to Do This Yourself

**Use Library Implementations**:
- `std::priority_queue` with external synchronization
- Thread-safe priority queues from well-tested libraries
- Lock-free implementations from proven libraries (see Section 3.5.9)

**Avoid Premature Optimization**:
- Start with coarse-grained locking
- Only consider lock-free if profiling shows it's necessary
- Lock-free heaps are extremely complex (see Section 3.5.9 warning)

**For Production**: Prefer `std::priority_queue` with external synchronization or thread-safe priority queues from proven libraries. See Section 3.5.10 for guidance on using libraries.

## 14.18 Summary

Advanced data structures provide specialized operations for specific use cases. Understanding when and how to use heaps, tries, segment trees, and Fenwick trees is essential for solving complex problems efficiently.

**What We Learned:**
- Heaps maintain heap property invariant for efficient priority queue operations
- Tries enable fast prefix-based string operations
- Segment Trees and Fenwick Trees support efficient range queries
- Sparse Table and Sqrt Decomposition offer alternative approaches for range queries
- Common pitfalls: heap property violations, index calculation errors, memory leaks
- Concurrency considerations for thread-safe implementations

**Why the Next Chapter Follows:**
Now that we've covered advanced data structures, we'll explore **greedy algorithms** in Chapter 16. These algorithms make locally optimal choices at each step, and many greedy algorithms (like Huffman coding) rely on heaps and other advanced structures we've just learned.

