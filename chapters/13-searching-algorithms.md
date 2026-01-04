# Chapter 13: Searching Algorithms

## 13.1 Problem Statement & Motivation

### What Problem Do Searching Algorithms Solve?

Finding elements in data structures is a fundamental operation:

- **Linear Search**: O(n) time - too slow for large datasets
- **No Structure**: Unsorted data requires checking every element
- **Performance Critical**: Search is often in hot code paths
- **User Expectations**: Fast search results expected

**Naive Approaches and Their Limitations**:

- **Check Every Element**: O(n) time, doesn't scale
- **No Optimization**: Can't leverage data structure properties
- **Inefficient**: Repeated searches are expensive

**The Searching Solution**: Different search algorithms optimize for different scenarios - linear search for unsorted data, binary search for sorted data, and specialized algorithms for specific structures.

### When to Use Different Search Algorithms

✅ **Use Linear Search when**:
- Data is unsorted
- Small dataset
- Single search operation
- No structure to leverage

✅ **Use Binary Search when**:
- Data is sorted
- Need O(log n) performance
- Multiple searches expected
- Random access supported

✅ **Use Specialized Search when**:
- Hash table available (O(1) lookup)
- Tree structure (BST search)
- Specific data properties (interpolation search)

### When NOT to Use Certain Search Algorithms

❌ **Avoid Binary Search when**:
- Data is unsorted (must sort first, O(n log n) cost)
- No random access (linked lists)
- Single search (sorting overhead not worth it)

**Key Trade-off**: Search algorithm choice depends on data structure and whether data is sorted.

## 13.2 Conceptual Overview

**Searching** is the process of finding a specific element or value within a data structure. It's one of the most fundamental operations in computer science and is used in virtually every application.

### Intuitive Explanation

Think of searching like finding a book in a library:
- **Linear Search**: Check each shelf sequentially
- **Binary Search**: Use catalog, eliminate half the shelves each time
- **Hash Table**: Direct lookup by call number (O(1))

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

## 13.3 Abstract Model & Invariants ⭐ (Mandatory)

**Purpose**: Define correctness independent of implementation.

### Abstract Model

A search problem consists of:
- **Data Structure**: Collection of elements (array, list, tree, etc.)
- **Target**: Element to find
- **Comparison Function**: How to compare elements
- **Result**: Position/index of target (or indication of not found)

### Core Invariants

These invariants must **always** hold for search algorithms to be correct:

#### 1. Completeness Invariant

```
If target exists in data structure:
  Target is found and correct position returned
```

**Meaning**: All existing targets are found.

#### 2. Correctness Invariant

```
If position i is returned:
  data_structure[i] == target (or equivalent)
```

**Meaning**: Returned position contains the target.

#### 3. Not Found Invariant

```
If target does not exist:
  Algorithm returns "not found" indicator
```

**Meaning**: Non-existent targets are correctly identified.

#### 4. Search Space Invariant

```
For binary search and variants:
  Search space decreases by at least 1/2 each iteration
  Eventually reduces to empty or single element
```

**Meaning**: Search makes progress and terminates.

#### 5. Sorted Array Invariant (for binary search)

```
For binary search:
  Array is sorted: data[i] ≤ data[i+1] for all i
  Comparison respects sort order
```

**Meaning**: Binary search requires and maintains sorted order assumption.

### Algorithm-Specific Invariants

#### Binary Search Invariants

1. **Range Invariant**:
   - `left ≤ right` initially and maintained
   - `left` and `right` bound the search space
   - Target is in `[left, right]` if it exists

2. **Midpoint Invariant**:
   - `mid = (left + right) / 2` (or `left + (right - left) / 2`)
   - `mid` is always in `[left, right]`
   - Search space reduces by at least 1/2

### Assumptions

1. **Comparable Elements**: Elements can be compared (equality, ordering)
2. **Random Access**: For binary search, array supports O(1) indexing
3. **Sorted Data**: For binary search, data is sorted
4. **Finite Data Structure**: Data structure has finite size
5. **Deterministic Comparison**: Same elements always compare the same way

This abstract model provides the intellectual backbone for understanding search algorithm correctness.

## 13.4 Operations & Interface

**Purpose**: Define what operations are supported.

Search algorithms support the following conceptual operations:

| Operation | Description | Precondition | Postcondition |
|-----------|-------------|--------------|---------------|
| `search(data, target)` | Find target in data | Data and target are valid | Returns position or "not found" |
| `findFirst(data, target)` | Find first occurrence | Data and target are valid | Returns first position or "not found" |
| `findLast(data, target)` | Find last occurrence | Data and target are valid | Returns last position or "not found" |
| `count(data, target)` | Count occurrences | Data and target are valid | Returns count of target |
| `findRange(data, low, high)` | Find elements in range | Data and bounds are valid | Returns positions in range |
| `findNearest(data, target)` | Find closest element | Data and target are valid | Returns position of closest element |

### Behavioral Guarantees

1. **Correctness**: Returned position contains target (if found)
2. **Completeness**: All occurrences are found (for find-all operations)
3. **Efficiency**: Time complexity meets algorithm guarantees
4. **Termination**: Algorithm always terminates

## 13.5 Time & Space Complexity

**Purpose**: Make trade-offs explicit.

### Time Complexity Comparison

| Algorithm | Best Case | Average Case | Worst Case | Requirements |
|-----------|-----------|--------------|------------|--------------|
| **Linear Search** | O(1) | O(n) | O(n) | None |
| **Binary Search** | O(1) | O(log n) | O(log n) | Sorted array |
| **Jump Search** | O(1) | O(√n) | O(√n) | Sorted array |
| **Exponential Search** | O(1) | O(log i) | O(log n) | Sorted array |
| **Interpolation Search** | O(1) | O(log log n) | O(n) | Sorted, uniform |
| **Ternary Search** | O(1) | O(log n) | O(log n) | Sorted array |
| **Hash Search** | O(1) | O(1) | O(n) | Hash table |
| **BST Search** | O(1) | O(log n) | O(n) | Binary search tree |

### Space Complexity

| Algorithm | Space Complexity | Notes |
|-----------|------------------|-------|
| **Linear Search** | O(1) | No extra space |
| **Binary Search** | O(1) iterative<br>O(log n) recursive | Stack space for recursion |
| **Jump Search** | O(1) | No extra space |
| **Exponential Search** | O(1) | No extra space |
| **Interpolation Search** | O(1) | No extra space |
| **Ternary Search** | O(1) iterative<br>O(log n) recursive | Stack space for recursion |
| **Hash Search** | O(n) | Hash table storage |
| **BST Search** | O(1) | Tree structure already exists |

### Detailed Analysis

#### When Each Algorithm Excels

**Linear Search**: Unsorted data, small datasets, single search
**Binary Search**: Sorted data, O(log n) guaranteed, multiple searches
**Jump Search**: Sorted data, simpler than binary search
**Exponential Search**: Unbounded sorted arrays, unknown size
**Interpolation Search**: Uniformly distributed sorted data
**Hash Search**: Fastest average case, O(1) expected
**BST Search**: Dynamic data, maintains sorted order

## 13.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)

**Purpose**: Bridge theory → implementation.

**Rules**: No language syntax, no pointers/templates, focus on logic only.

### Linear Search

```
FUNCTION linearSearch(data, target):
  FOR i FROM 0 TO length(data) - 1:
    IF data[i] = target:
      RETURN i
    END IF
  END FOR
  RETURN -1  // Not found
END FUNCTION
```

### Binary Search (Iterative)

```
FUNCTION binarySearch(data, target):
  left ← 0
  right ← length(data) - 1
  
  WHILE left ≤ right:
    mid ← left + (right - left) / 2
    
    IF data[mid] = target:
      RETURN mid
    ELSE IF data[mid] < target:
      left ← mid + 1
    ELSE:
      right ← mid - 1
    END IF
  END WHILE
  
  RETURN -1  // Not found
END FUNCTION
```

### Binary Search (Recursive)

```
FUNCTION binarySearchRecursive(data, target, left, right):
  IF left > right:
    RETURN -1  // Not found
  END IF
  
  mid ← left + (right - left) / 2
  
  IF data[mid] = target:
    RETURN mid
  ELSE IF data[mid] < target:
    RETURN binarySearchRecursive(data, target, mid + 1, right)
  ELSE:
    RETURN binarySearchRecursive(data, target, left, mid - 1)
  END IF
END FUNCTION
```

### Find First Occurrence

```
FUNCTION findFirst(data, target):
  left ← 0
  right ← length(data) - 1
  result ← -1
  
  WHILE left ≤ right:
    mid ← left + (right - left) / 2
    
    IF data[mid] = target:
      result ← mid
      right ← mid - 1  // Continue searching left
    ELSE IF data[mid] < target:
      left ← mid + 1
    ELSE:
      right ← mid - 1
    END IF
  END WHILE
  
  RETURN result
END FUNCTION
```

### Find Last Occurrence

```
FUNCTION findLast(data, target):
  left ← 0
  right ← length(data) - 1
  result ← -1
  
  WHILE left ≤ right:
    mid ← left + (right - left) / 2
    
    IF data[mid] = target:
      result ← mid
      left ← mid + 1  // Continue searching right
    ELSE IF data[mid] < target:
      left ← mid + 1
    ELSE:
      right ← mid - 1
    END IF
  END WHILE
  
  RETURN result
END FUNCTION
```

### Jump Search

```
FUNCTION jumpSearch(data, target):
  n ← length(data)
  step ← √n
  prev ← 0
  
  WHILE data[min(step, n) - 1] < target:
    prev ← step
    step ← step + √n
    IF prev ≥ n:
      RETURN -1
    END IF
  END WHILE
  
  FOR i FROM prev TO min(step, n):
    IF data[i] = target:
      RETURN i
    END IF
  END FOR
  
  RETURN -1
END FUNCTION
```

This pseudocode should be readable by any engineer, regardless of their programming language background.

## 13.7 Implementation (Reference Language: C++) ⭐

**Note to Reader**: This section provides concrete C++ implementations. The correctness relies on the invariants defined in Section 13.3 and the pseudocode in Section 13.6.

Detailed C++ implementations for each search algorithm are provided in the following sections:
- Section 13.9: Linear Search Implementation
- Section 13.10: Binary Search Implementation
- Section 13.11: Jump Search Implementation
- Section 13.12: Exponential Search Implementation
- Section 13.13: Interpolation Search Implementation
- Section 13.14: Ternary Search Implementation

## 13.8 Correctness Argument

**Purpose**: Explain why the implementations work.

### Invariant Preservation

Search algorithms preserve the core invariants defined in Section 13.3:

#### 1. Completeness Invariant

**For Linear Search**:
- Every element is checked sequentially
- Target is found if it exists
- **Preserves**: All existing targets are found

**For Binary Search**:
- Search space always contains target if it exists
- Range invariant maintained: target in [left, right]
- **Preserves**: Target is found if it exists

#### 2. Correctness Invariant

**For All Algorithms**:
- Returned position is verified to contain target
- Comparison ensures correctness
- **Preserves**: Returned position is correct

#### 3. Search Space Invariant (Binary Search)

**For Binary Search**:
- Search space reduces by at least 1/2 each iteration
- `left` and `right` correctly bound search space
- Eventually reduces to empty or single element
- **Preserves**: Search terminates and finds target if exists

### Algorithm-Specific Correctness

#### Binary Search Correctness

**Why it works**:
- Sorted array property: `data[i] ≤ data[i+1]`
- If `data[mid] < target`, target must be in `[mid+1, right]`
- If `data[mid] > target`, target must be in `[left, mid-1]`
- Search space reduces by at least 1/2 each iteration
- **Correct**: Guaranteed to find target if it exists

#### Linear Search Correctness

**Why it works**:
- Checks every element sequentially
- Stops when target found
- Continues until end if not found
- **Correct**: Finds target if it exists, reports not found otherwise

### Termination Guarantee

**Why algorithms terminate**:
- **Linear Search**: Finite array, loop bounded by array size
- **Binary Search**: Search space reduces by at least 1/2, eventually becomes empty
- **Jump Search**: Step size and bounds ensure termination

This correctness argument provides engineers with confidence that search implementations work correctly.

## 13.9 Edge Cases & Failure Modes

**Purpose**: Build defensive thinking.

### Empty Data Structure

**Problem**: Data structure is empty.

**Edge Cases**:
- Empty array `[]`
- Empty list
- Empty tree

**Handling**:
```cpp
if (data.empty()) {
    return -1;  // Not found
}
```

**Failure Mode**: Accessing `data[0]` when empty causes out-of-bounds error.

### Single Element

**Problem**: Data structure has only one element.

**Edge Cases**:
- Array with one element `[x]`
- Target matches: should return 0
- Target doesn't match: should return -1

**Handling**: Usually handled correctly, but verify base cases.

### Target Not Present

**Problem**: Target doesn't exist in data structure.

**Edge Cases**:
- Target smaller than all elements
- Target larger than all elements
- Target between elements (for sorted data)

**Handling**:
```cpp
// Binary search: left > right indicates not found
if (left > right) {
    return -1;
}
```

**Failure Mode**: Infinite loop if termination condition incorrect.

### Duplicate Elements

**Problem**: Multiple occurrences of target.

**Edge Cases**:
- All elements are target
- Target appears multiple times
- Need first/last occurrence

**Handling**:
- Standard binary search finds any occurrence
- Modified binary search finds first/last
- Linear search finds first occurrence

### Unsorted Data (Binary Search)

**Problem**: Binary search used on unsorted data.

**Edge Cases**:
- Data not sorted
- Partially sorted data
- Reverse sorted data

**Handling**:
```cpp
// Verify sorted before binary search
if (!isSorted(data)) {
    throw invalid_argument("Data must be sorted");
}
```

**Failure Mode**: Binary search fails on unsorted data, incorrect results.

### Integer Overflow

**Problem**: `(left + right) / 2` may overflow.

**Edge Cases**:
- Very large indices
- `left + right > INT_MAX`

**Handling**:
```cpp
// Use: left + (right - left) / 2
// Instead of: (left + right) / 2
int mid = left + (right - left) / 2;
```

**Failure Mode**: Integer overflow causes incorrect mid calculation.

### Common Failure Patterns

1. **Off-by-One Errors**: `left <= right` vs `left < right`
2. **Incorrect Mid Calculation**: Overflow in `(left + right) / 2`
3. **Wrong Comparison**: `data[mid] < target` vs `data[mid] <= target`
4. **Missing Base Case**: Not handling empty array
5. **Unsorted Data**: Using binary search on unsorted data

This section maps directly to production bugs and helps engineers write robust search code.

## 13.10 Performance & System Considerations ⭐ (Differentiator)

**Purpose**: Connect algorithms to real machines.

### Cache Locality

#### Sequential vs Random Access

**Linear Search**:
- **Excellent Cache Locality**: Sequential access pattern
- **Prefetching Friendly**: CPU can prefetch next elements
- **Cache Hits**: Most accesses are cache hits

**Binary Search**:
- **Poor Cache Locality**: Random access pattern (jumps around)
- **Cache Misses**: Each access may be cache miss
- **Performance Impact**: Cache misses add 100-300 cycles

**Performance Comparison**:
- Linear search on small arrays (< cache size): Often faster due to cache
- Binary search on large arrays: Better despite cache misses (fewer comparisons)

### Branch Prediction

#### Conditional Branches

**Comparison Operations**:
- `if (data[i] == target)` creates branch
- Well-predicted: ~1 cycle
- Mispredicted: ~10-20 cycles

**Binary Search**:
- Multiple branches per iteration
- Branch prediction helps when pattern is predictable
- Random data: branches harder to predict

### Memory Access Patterns

#### Sequential Access (Linear Search)

**Advantages**:
- Predictable access pattern
- Prefetching works well
- Good cache utilization

**Disadvantages**:
- Must check every element
- O(n) comparisons

#### Random Access (Binary Search)

**Advantages**:
- Fewer comparisons (O(log n))
- Efficient for large arrays

**Disadvantages**:
- Random memory access
- Cache misses
- Prefetching less effective

### Practical Recommendations

1. **Small Arrays**: Use linear search (cache-friendly, simple)
2. **Large Sorted Arrays**: Use binary search (fewer comparisons)
3. **Multiple Searches**: Sort once, search many times
4. **Cache-Critical**: Consider linear search for small datasets
5. **Profile**: Measure actual performance, don't assume

This section connects search algorithms to real system performance.

## 13.11 Linear Search

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

## 13.12 Binary Search

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

## 13.13 Jump Search

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

## 13.14 Exponential Search

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

## 13.15 Interpolation Search

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

## 13.16 Ternary Search

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

## 13.17 Hash-Based Searching

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

## 13.18 Tree-Based Searching

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

## 13.19 String Searching

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

## 13.20 Comparison of Search Algorithms

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

## 13.21 Key Takeaways

1. **Linear Search** is simple but slow - use for unsorted data
2. **Binary Search** is efficient for sorted arrays - O(log n)
3. **Exponential Search** is good for unbounded arrays
4. **Interpolation Search** works well for uniformly distributed data
5. **Hash-based search** provides O(1) average-case performance
6. **Tree-based search** is efficient for dynamic data
7. Choose the right algorithm based on data characteristics

## 13.22 Choosing the Right Search Algorithm

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

## 13.23 Exercises

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

## 13.24 Summary

Searching is a fundamental operation in computer science. The choice of search algorithm depends on:
- Whether data is sorted
- Data distribution
- Data structure used
- Frequency of searches
- Memory constraints

Understanding different search algorithms and their trade-offs is essential for writing efficient code and solving problems effectively.

