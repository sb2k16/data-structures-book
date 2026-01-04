# Chapter 13: Searching Algorithms

## 13.1 Introduction to Searching

**Searching** is the process of finding a specific element or value within a data structure. It's one of the most fundamental operations in computer science and is used in virtually every application.

### Why Searching Matters

1. **Data Retrieval**: Finding information in databases, files, and data structures
2. **Performance Critical**: Search operations are often in hot paths
3. **Foundation for Other Algorithms**: Many algorithms rely on efficient searching
4. **Real-world Applications**: Search engines, databases, file systems
5. **Interview Importance**: Frequently asked in technical interviews

### Search Problem Types

- **Existence Check**: Does the element exist?
- **Position Finding**: Where is the element located?
- **Count**: How many times does it appear?
- **Range Queries**: Find all elements in a range
- **Nearest Neighbor**: Find closest matching element

## 13.2 Linear Search

**Linear Search** (also called sequential search) checks each element sequentially until the target is found or the end is reached.

### Implementation
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Basic linear search
int linearSearch(const vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1; // Not found
}

// Linear search with iterator
template<typename Iterator, typename T>
Iterator linearSearchIterator(Iterator begin, Iterator end, const T& target) {
    for (auto it = begin; it != end; ++it) {
        if (*it == target) {
            return it;
        }
    }
    return end; // Not found
}

// Linear search returning all occurrences
vector<int> linearSearchAll(const vector<int>& arr, int target) {
    vector<int> indices;
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            indices.push_back(static_cast<int>(i));
        }
    }
    return indices;
}

// Optimized linear search with sentinel
int linearSearchSentinel(vector<int>& arr, int target) {
    int n = arr.size();
    int last = arr[n - 1];
    arr[n - 1] = target; // Set sentinel
    
    int i = 0;
    while (arr[i] != target) {
        i++;
    }
    
    arr[n - 1] = last; // Restore original value
    
    if (i < n - 1 || last == target) {
        return i;
    }
    return -1;
}
```

### Time Complexity
- **Best Case**: O(1) - element at first position
- **Average Case**: O(n) - element in middle
- **Worst Case**: O(n) - element not found or at end
- **Space Complexity**: O(1)

### When to Use
- Unsorted data
- Small datasets
- Single search operation
- Data structure doesn't support random access

## 13.3 Binary Search

**Binary Search** is an efficient search algorithm for sorted arrays that repeatedly divides the search space in half.

### Basic Implementation
```cpp
// Iterative binary search
int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2; // Avoid overflow
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Recursive binary search
int binarySearchRecursive(const vector<int>& arr, int target, 
                          int left, int right) {
    if (left > right) {
        return -1;
    }
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

int binarySearchRecursive(const vector<int>& arr, int target) {
    return binarySearchRecursive(arr, target, 0, arr.size() - 1);
}
```

### Binary Search Variations

#### 1. Find First Occurrence
```cpp
int binarySearchFirst(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;
            right = mid - 1; // Continue searching left
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

#### 2. Find Last Occurrence
```cpp
int binarySearchLast(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;
            left = mid + 1; // Continue searching right
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

#### 3. Find Insertion Position
```cpp
int binarySearchInsert(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}
```

#### 4. Search in Rotated Sorted Array
```cpp
int searchRotated(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        
        // Left half is sorted
        if (arr[left] <= arr[mid]) {
            if (target >= arr[left] && target < arr[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // Right half is sorted
            if (target > arr[mid] && target <= arr[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

### Time Complexity
- **Best Case**: O(1)
- **Average Case**: O(log n)
- **Worst Case**: O(log n)
- **Space Complexity**: O(1) iterative, O(log n) recursive

### Requirements
- Array must be sorted
- Random access to elements
- Elements must be comparable

## 13.4 Jump Search

**Jump Search** is a search algorithm for sorted arrays that works by jumping ahead by fixed steps, then performing a linear search in the identified block. It's faster than linear search but simpler than binary search.

### How Jump Search Works

1. **Jump Ahead**: Jump by `√n` steps until we find a block that might contain the target
2. **Linear Search**: Perform linear search in the identified block
3. **Optimal Step Size**: `√n` minimizes the total number of comparisons

### Implementation

```cpp
#include <cmath>
#include <algorithm>
using namespace std;

int jumpSearch(const vector<int>& arr, int target) {
    int n = arr.size();
    if (n == 0) return -1;
    
    // Calculate optimal jump size
    int step = sqrt(n);
    int prev = 0;
    
    // Jump ahead until we find a block that might contain target
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        
        // If we've jumped past the array, target not found
        if (prev >= n) {
            return -1;
        }
    }
    
    // Perform linear search in the identified block
    while (arr[prev] < target) {
        prev++;
        
        // If we've reached the next block or end, target not found
        if (prev == min(step, n)) {
            return -1;
        }
    }
    
    // Check if we found the target
    if (arr[prev] == target) {
        return prev;
    }
    
    return -1;
}
```

### Time Complexity

- **Best Case**: O(1) - target at first position
- **Average Case**: O(√n) - optimal step size
- **Worst Case**: O(√n) - target in last block
- **Space Complexity**: O(1)

### When to Use Jump Search

- **Sorted arrays** with uniform distribution
- **When binary search is overkill** (simpler implementation)
- **When jumping is faster** than binary search (cache-friendly)
- **Bounded arrays** (unlike exponential search for unbounded)

### Comparison with Other Algorithms

| Algorithm | Time Complexity | When to Use |
|-----------|----------------|-------------|
| Linear Search | O(n) | Unsorted, small arrays |
| Binary Search | O(log n) | Sorted, general purpose |
| Jump Search | O(√n) | Sorted, simpler than binary |
| Exponential Search | O(log i) | Unbounded sorted arrays |

**Key Insight**: Jump Search is a middle ground between linear search (O(n)) and binary search (O(log n)), with O(√n) complexity. It's simpler than binary search but still efficient for sorted arrays.

## 13.5 Exponential Search

**Exponential Search** is useful for unbounded or very large sorted arrays. It finds the range where the target might be, then uses binary search.

### Implementation
```cpp
int exponentialSearch(const vector<int>& arr, int target) {
    int n = arr.size();
    
    // If target is at first position
    if (arr[0] == target) {
        return 0;
    }
    
    // Find range for binary search
    int i = 1;
    while (i < n && arr[i] <= target) {
        i *= 2;
    }
    
    // Binary search in the found range
    int left = i / 2;
    int right = min(i, n - 1);
    
    return binarySearchRecursive(arr, target, left, right);
}
```

### Time Complexity
- **Time**: O(log i) where i is the position of target
- **Space**: O(1)

### Use Cases
- Unbounded arrays
- Very large sorted arrays
- When target is likely near the beginning

## 13.5 Interpolation Search

**Interpolation Search** is an improvement over binary search for uniformly distributed sorted arrays. It uses the value of the target to estimate its position.

### Implementation
```cpp
int interpolationSearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left == right) {
            if (arr[left] == target) {
                return left;
            }
            return -1;
        }
        
        // Calculate position using interpolation formula
        int pos = left + ((target - arr[left]) * (right - left)) / 
                  (arr[right] - arr[left]);
        
        if (arr[pos] == target) {
            return pos;
        } else if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }
    
    return -1;
}
```

### Time Complexity
- **Best Case**: O(log log n) for uniformly distributed data
- **Average Case**: O(log log n)
- **Worst Case**: O(n) for non-uniform distribution
- **Space Complexity**: O(1)

### When to Use
- Uniformly distributed sorted data
- Large datasets
- When binary search is too slow

## 13.6 Ternary Search

**Ternary Search** divides the search space into three parts instead of two, useful for finding maximum/minimum in unimodal functions.

### Implementation
```cpp
// Ternary search for finding maximum in unimodal function
int ternarySearchMax(const vector<int>& arr) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (right - left > 2) {
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;
        
        if (arr[mid1] < arr[mid2]) {
            left = mid1;
        } else {
            right = mid2;
        }
    }
    
    // Find maximum in remaining elements
    int maxIdx = left;
    for (int i = left + 1; i <= right; i++) {
        if (arr[i] > arr[maxIdx]) {
            maxIdx = i;
        }
    }
    
    return maxIdx;
}

// Ternary search for target in sorted array
int ternarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;
        
        if (arr[mid1] == target) {
            return mid1;
        } else if (arr[mid2] == target) {
            return mid2;
        } else if (target < arr[mid1]) {
            right = mid1 - 1;
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }
    
    return -1;
}
```

### Time Complexity
- **Time**: O(log₃ n) ≈ O(log n)
- **Space**: O(1)

## 13.7 Hash-Based Searching

Hash tables provide O(1) average-case search time.

### Implementation
```cpp
#include <unordered_map>
#include <unordered_set>

// Using unordered_map
bool hashSearch(const unordered_map<int, string>& map, int key) {
    return map.find(key) != map.end();
}

// Using unordered_set
bool hashSearchSet(const unordered_set<int>& set, int value) {
    return set.find(value) != set.end();
}
```

### Time Complexity
- **Average Case**: O(1)
- **Worst Case**: O(n) due to collisions
- **Space Complexity**: O(n)

## 13.8 Tree-Based Searching

### Binary Search Tree Search
```cpp
struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

bool bstSearch(TreeNode* root, int target) {
    if (!root) {
        return false;
    }
    
    if (root->data == target) {
        return true;
    } else if (target < root->data) {
        return bstSearch(root->left, target);
    } else {
        return bstSearch(root->right, target);
    }
}

// Iterative version
bool bstSearchIterative(TreeNode* root, int target) {
    while (root) {
        if (root->data == target) {
            return true;
        } else if (target < root->data) {
            root = root->left;
        } else {
            root = root->right;
        }
    }
    return false;
}
```

### Time Complexity
- **Average Case**: O(log n) for balanced BST
- **Worst Case**: O(n) for skewed tree
- **Space Complexity**: O(1) iterative, O(log n) recursive

## 13.9 String Searching

### Naive String Search
```cpp
int naiveStringSearch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    
    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        if (j == m) {
            return i; // Pattern found at index i
        }
    }
    
    return -1; // Pattern not found
}
```

### Boyer-Moore (Simplified)
```cpp
int boyerMooreSearch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    
    // Bad character table
    vector<int> badChar(256, -1);
    for (int i = 0; i < m; i++) {
        badChar[pattern[i]] = i;
    }
    
    int shift = 0;
    while (shift <= n - m) {
        int j = m - 1;
        
        while (j >= 0 && pattern[j] == text[shift + j]) {
            j--;
        }
        
        if (j < 0) {
            return shift; // Pattern found
        } else {
            shift += max(1, j - badChar[text[shift + j]]);
        }
    }
    
    return -1;
}
```

## 13.10 Comparison of Search Algorithms

| Algorithm | Best Case | Average Case | Worst Case | Space | Requirements |
|-----------|-----------|--------------|------------|-------|--------------|
| Linear Search | O(1) | O(n) | O(n) | O(1) | None |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) | Sorted array |
| Jump Search | O(1) | O(√n) | O(√n) | O(1) | Sorted array |
| Exponential Search | O(1) | O(log i) | O(log n) | O(1) | Sorted array |
| Interpolation Search | O(1) | O(log log n) | O(n) | O(1) | Sorted, uniform |
| Ternary Search | O(1) | O(log n) | O(log n) | O(1) | Sorted array |
| Hash Search | O(1) | O(1) | O(n) | O(n) | Hash table |
| BST Search | O(1) | O(log n) | O(n) | O(1) | Binary search tree |

## 13.11 Key Takeaways

1. **Linear Search** is simple but slow - use for unsorted data
2. **Binary Search** is efficient for sorted arrays - O(log n)
3. **Exponential Search** is good for unbounded arrays
4. **Interpolation Search** works well for uniformly distributed data
5. **Hash-based search** provides O(1) average-case performance
6. **Tree-based search** is efficient for dynamic data
7. Choose the right algorithm based on data characteristics

## 13.12 Choosing the Right Search Algorithm

Search algorithms are engineering decisions, not just theoretical choices. Here's how to choose:

### Decision Framework

#### 1. Data Structure and Ordering

**Sorted Array:**
- **Binary Search**: O(log n), standard choice
- **Interpolation Search**: O(log log n) average for uniform distribution
- **Exponential Search**: O(log i) where i is position (unbounded arrays)
- **Why**: Sorted data enables divide-and-conquer (like we saw in Chapter 9 sorting)

**Unsorted Array:**
- **Linear Search**: O(n), only option
- **Hash Table** (Chapter 10): O(1) average if you can preprocess
- **Why**: No structure to exploit

**Dynamic Data (Insertions/Deletions):**
- **Hash Table** (Chapter 10): O(1) average, O(n) worst
- **Binary Search Tree** (Chapter 6): O(log n) average, maintains order
- **Why**: Need structure that supports updates efficiently

#### 2. Search Frequency

**Single Search:**
- **Linear Search**: Simple, no preprocessing
- **Why**: Overhead of building index not worth it

**Many Searches:**
- **Hash Table**: O(1) average, worth preprocessing cost
- **Binary Search Tree**: O(log n), maintains sorted order
- **Why**: Amortize preprocessing cost over many searches

#### 3. Memory Constraints

**Tight Memory:**
- **Linear/Binary Search**: No extra space
- **Avoid**: Hash tables (require O(n) extra space)

**Adequate Memory:**
- **Hash Table**: Best average performance
- **Tree Structures**: Good balance of performance and features

#### 4. Data Distribution

**Uniform Distribution:**
- **Interpolation Search**: O(log log n) average
- **Why**: Can estimate position accurately

**Skewed Distribution:**
- **Binary Search**: Consistent O(log n)
- **Avoid**: Interpolation search (may degrade)

**Unknown Distribution:**
- **Binary Search**: Safe default
- **Why**: Guaranteed O(log n) regardless of distribution

#### 5. Additional Requirements

**Need Range Queries:**
- **Binary Search Tree** (Chapter 6): Supports range queries
- **Segment Tree** (Chapter 14): O(log n) range queries
- **Avoid**: Hash tables (no ordering)

**Need Ordering:**
- **Binary Search**: Maintains sorted order
- **Tree Structures**: Natural ordering
- **Avoid**: Hash tables (no order)

**Need Fast Updates:**
- **Hash Table**: O(1) insert/delete
- **Tree Structures**: O(log n) insert/delete
- **Avoid**: Sorted arrays (O(n) updates)

### Real-World Recommendations

**Database Indexing:**
- **B-Trees**: Multi-level trees for disk-based systems
- **Hash Indexes**: For equality lookups only

**In-Memory Caches:**
- **Hash Tables**: O(1) lookups, fast eviction
- **Why**: Speed matters more than ordering

**Search Engines:**
- **Inverted Index**: Hash table mapping terms to documents
- **Why**: Need fast keyword lookup

**Autocomplete:**
- **Trie** (Chapter 14): Prefix-based search
- **Why**: Need prefix matching, not exact search

### Decision Tree

```
Is data sorted?
├─ Yes → Continue
│   │
│   Is distribution uniform?
│   ├─ Yes → Interpolation Search
│   └─ No → Binary Search
│
└─ No → Continue
    │
    How many searches?
    ├─ One → Linear Search
    └─ Many → Continue
        │
        Need ordering?
        ├─ Yes → Binary Search Tree
        └─ No → Hash Table
```

**Remember**: The best search algorithm depends on your data structure, access patterns, and requirements. Often, the data structure choice (sorted array vs. hash table) matters more than the search algorithm itself.

## 13.13 Exercises

1. Implement a function to find the number of occurrences of a target in a sorted array.

2. Implement binary search for a 2D sorted matrix.

3. Create a function to find the peak element in an array (unimodal array).

4. Implement a search function that works on a rotated sorted array with duplicates.

5. Create a function to find the k-th largest element using binary search on answer.

6. Implement a function to search in an infinite sorted array.

7. Create a function to find the minimum element in a rotated sorted array.

8. Implement a function to find the square root of a number using binary search.

9. Create a function to find the first and last position of an element in a sorted array.

10. Implement a function to search in a nearly sorted array (elements can be at most k positions away from their sorted position).

## 13.14 Summary

Searching is a fundamental operation in computer science. The choice of search algorithm depends on:
- Whether data is sorted
- Data distribution
- Data structure used
- Frequency of searches
- Memory constraints

Understanding different search algorithms and their trade-offs is essential for writing efficient code and solving problems effectively.

