# Chapter 14: Advanced Data Structures

## 14.1 Introduction

This chapter covers advanced data structures that are essential for solving complex problems efficiently. These structures provide specialized operations beyond basic arrays, lists, and trees.

### Data Structures Covered

1. **Heaps**: Priority queues and heap operations
2. **Tries**: Prefix trees for string operations
3. **Segment Trees**: Range query and update operations
4. **Fenwick Trees**: Binary Indexed Trees for prefix sums

## 14.2 Heaps

A **heap** is a complete binary tree that satisfies the heap property. In a max-heap, parent nodes are greater than or equal to their children. In a min-heap, parent nodes are less than or equal to their children.

### Heap Properties

- **Complete Binary Tree**: All levels are filled except possibly the last
- **Heap Property**: Parent-child relationship maintained
- **Array Representation**: Efficiently stored in an array

### Array Representation

For a node at index `i`:
- Parent: `(i - 1) / 2`
- Left child: `2 * i + 1`
- Right child: `2 * i + 2`

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

## 14.6 Key Takeaways

1. **Heaps** provide efficient priority queue operations
2. **Tries** excel at prefix-based string operations
3. **Segment Trees** support range queries and updates
4. **Fenwick Trees** are simpler and faster for prefix sums
5. Choose the right structure based on operation requirements

## 14.7 Exercises

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

## 14.8 Summary

Advanced data structures provide specialized operations for specific use cases. Understanding when and how to use heaps, tries, segment trees, and Fenwick trees is essential for solving complex problems efficiently.

