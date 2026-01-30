# Chapter 17: Divide and Conquer

## Table of Contents

- [17.1 Problem Statement & Motivation](#problem-statement-motivation)
  - [What Problem Does Divide and Conquer Solve?](#what-problem-does-divide-and-conquer-solve)
  - [When to Use Divide and Conquer](#when-to-use-divide-and-conquer)
  - [When NOT to Use Divide and Conquer](#when-not-to-use-divide-and-conquer)
- [17.2 Conceptual Overview](#conceptual-overview)
  - [Intuitive Explanation](#intuitive-explanation)
  - [Key Characteristics](#key-characteristics)
  - [Divide and Conquer vs. Dynamic Programming](#divide-and-conquer-vs-dynamic-programming)
- [17.3 Abstract Model & Invariants ⭐ (Mandatory)](#abstract-model-invariants-mandatory)
  - [Abstract Model](#abstract-model)
  - [Core Invariants](#core-invariants)
  - [Algorithm-Specific Invariants](#algorithm-specific-invariants)
  - [Assumptions](#assumptions)
- [17.4 Operations & Interface](#operations-interface)
  - [Behavioral Guarantees](#behavioral-guarantees)
- [17.5 Time & Space Complexity](#time-space-complexity)
  - [Time Complexity Analysis](#time-complexity-analysis)
  - [Common Recurrences](#common-recurrences)
  - [Space Complexity](#space-complexity)
  - [Master Theorem](#master-theorem)
- [17.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)](#pseudocode-language-neutral-mandatory)
  - [Generic Divide and Conquer Pattern](#generic-divide-and-conquer-pattern)
  - [Merge Sort](#merge-sort)
  - [Quick Sort](#quick-sort)
  - [Binary Search](#binary-search)
  - [Maximum Subarray (Divide and Conquer)](#maximum-subarray-divide-and-conquer)
- [17.7 Implementation (Reference Language: C++) ⭐](#implementation-reference-language-c)
- [17.8 Correctness Argument](#correctness-argument)
  - [Invariant Preservation](#invariant-preservation)
  - [Algorithm-Specific Correctness](#algorithm-specific-correctness)
  - [Informal Proof Sketch](#informal-proof-sketch)
- [17.9 Edge Cases & Failure Modes](#edge-cases-failure-modes)
  - [Empty Input](#empty-input)
  - [Already Sorted Input](#already-sorted-input)
  - [Integer Overflow](#integer-overflow)
  - [Common Failure Patterns](#common-failure-patterns)
- [17.10 Performance & System Considerations ⭐ (Differentiator)](#performance-system-considerations-differentiator)
  - [Recursion vs Iteration](#recursion-vs-iteration)
  - [Cache Locality](#cache-locality)
  - [Parallelization](#parallelization)
  - [Practical Recommendations](#practical-recommendations)
- [17.11 Merge Sort](#merge-sort)
  - [Implementation](#implementation)
  - [Time Complexity](#time-complexity)
- [17.12 Quick Sort](#quick-sort)
  - [Implementation](#implementation)
  - [Randomized Quick Sort](#randomized-quick-sort)
  - [Time Complexity](#time-complexity)
- [17.13 Binary Search (Divide and Conquer)](#binary-search-divide-and-conquer)
- [17.14 Power Calculation](#power-calculation)
  - [Implementation](#implementation)
  - [Time Complexity](#time-complexity)
- [17.15 Maximum Subarray Problem (Kadane's vs Divide and Conquer)](#maximum-subarray-problem-kadanes-vs-divide-and-conquer)
  - [Divide and Conquer Approach](#divide-and-conquer-approach)
  - [Time Complexity](#time-complexity)
- [17.16 Closest Pair of Points](#closest-pair-of-points)
  - [Implementation](#implementation)
  - [Time Complexity](#time-complexity)
- [17.17 Strassen's Matrix Multiplication](#strassens-matrix-multiplication)
  - [Implementation](#implementation)
  - [Time Complexity](#time-complexity)
- [17.18 Master Theorem](#master-theorem)
  - [Recurrence Form](#recurrence-form)
  - [Master Theorem Cases](#master-theorem-cases)
  - [Examples](#examples)
- [17.19 Advanced Divide and Conquer Problems](#advanced-divide-and-conquer-problems)
  - [17.10.1 Counting Inversions](#1-counting-inversions)
  - [17.10.2 Closest Pair of Points](#2-closest-pair-of-points)
  - [17.10.3 Majority Element](#3-majority-element)
  - [17.10.4 Karatsuba Multiplication](#4-karatsuba-multiplication)
  - [17.10.5 Fast Fourier Transform (FFT) - Overview](#5-fast-fourier-transform-fft-overview)
- [17.20 Divide and Conquer Patterns](#divide-and-conquer-patterns)
  - [Pattern 1: Array Problems](#pattern-1-array-problems)
  - [Pattern 2: Tree Problems](#pattern-2-tree-problems)
  - [Pattern 3: Geometric Problems](#pattern-3-geometric-problems)
  - [Pattern 4: Optimization Problems](#pattern-4-optimization-problems)
- [17.21 Key Takeaways](#key-takeaways)
- [17.22 Exercises](#exercises)
- [17.23 Summary](#summary)



## 17.1 Problem Statement & Motivation

### What Problem Does Divide and Conquer Solve?

Many problems can be solved more efficiently by breaking them into smaller subproblems:

- **Sorting**: Merge sort, quick sort divide array into halves
- **Searching**: Binary search divides search space in half
- **Mathematical Problems**: Power calculation, matrix multiplication
- **Geometric Problems**: Closest pair of points, convex hull
- **Optimization**: Maximum subarray, optimal binary search tree

**Naive Approaches and Their Limitations**:

- **Brute Force**: Try all possibilities → exponential time
- **Iterative Solutions**: Often O(n²) or worse
- **No Structure**: Can't leverage problem decomposition

**The Divide and Conquer Solution**: Divide problem into smaller subproblems, solve recursively, combine results. Often achieves O(n log n) or better performance.

### When to Use Divide and Conquer

✅ **Use divide and conquer when**:
- Problem can be divided into similar subproblems
- Subproblems are independent
- Combining solutions is efficient
- Base cases are easy to solve
- Recursive structure is natural

✅ **Real-world applications**:
- Sorting (merge sort, quick sort)
- Searching (binary search)
- Matrix operations (Strassen's algorithm)
- Geometric algorithms (closest pair)
- Optimization problems

### When NOT to Use Divide and Conquer

❌ **Avoid when**:
- Subproblems are not independent
- Combining is expensive
- Problem doesn't divide naturally
- Iterative solution is simpler
- Overlapping subproblems (use DP instead)

**Key Trade-off**: Divide and conquer trades problem decomposition complexity for algorithmic efficiency.

## 17.2 Conceptual Overview

**Divide and Conquer** is a fundamental algorithmic paradigm that solves problems by:
1. **Divide**: Break the problem into smaller subproblems
2. **Conquer**: Solve the subproblems recursively
3. **Combine**: Combine solutions to subproblems to solve the original problem

### Intuitive Explanation

Think of divide and conquer like organizing a large event:
- **Divide**: Break event into smaller tasks (catering, music, decorations)
- **Conquer**: Handle each task separately (assign teams)
- **Combine**: Bring everything together for the final event

Think of it like a binary tree:
- **Root**: Original problem
- **Children**: Subproblems
- **Leaves**: Base cases (solved directly)
- **Combine**: Work your way back up the tree

### Key Characteristics

- **Recursive Structure**: Problems are solved recursively
- **Subproblem Independence**: Subproblems are independent (unlike DP)
- **Base Case**: Small enough problems are solved directly
- **Efficiency**: Often leads to O(n log n) algorithms

### Divide and Conquer vs. Dynamic Programming

| Aspect | Divide and Conquer | Dynamic Programming |
|--------|-------------------|---------------------|
| **Subproblems** | Independent | Overlapping |
| **Memoization** | Not needed | Often needed |
| **Combining** | Usually O(n) | Usually O(1) |
| **Examples** | Merge sort, Quick sort | Fibonacci, LCS |

## 17.3 Abstract Model & Invariants ⭐ (Mandatory)

**Purpose**: Define correctness independent of implementation.

### Abstract Model

A divide and conquer algorithm consists of:
- **Problem Instance**: Input to be solved
- **Divide Function**: Breaks problem into subproblems
- **Base Case Function**: Solves small problems directly
- **Combine Function**: Merges subproblem solutions
- **Recurrence Relation**: T(n) = aT(n/b) + f(n)

### Core Invariants

These invariants must **always** hold for divide and conquer algorithms:

#### 1. Problem Decomposition Invariant

```
For any problem instance P:
  divide(P) = {P₁, P₂, ..., Pₖ} where:
    - Each Pᵢ is a valid subproblem
    - Size(Pᵢ) < Size(P) for all i
    - combine(solve(P₁), ..., solve(Pₖ)) = solve(P)
```

**Meaning**: Problem can be correctly decomposed and solutions combined.

#### 2. Base Case Invariant

```
For base case problems B:
  solve(B) is computed directly (not recursively)
  solve(B) is correct
  Base cases are reachable from any problem instance
```

**Meaning**: Base cases provide correct termination.

#### 3. Subproblem Independence Invariant

```
For subproblems P₁, P₂, ..., Pₖ:
  solve(Pᵢ) does not depend on solve(Pⱼ) for i ≠ j
  Subproblems can be solved in any order (or in parallel)
```

**Meaning**: Subproblems are independent (unlike DP where they overlap).

#### 4. Progress Invariant

```
For any recursive call:
  Problem size decreases: Size(subproblem) < Size(problem)
  Eventually reaches base case
  Algorithm terminates
```

**Meaning**: Each recursive call makes progress toward base case.

### Algorithm-Specific Invariants

#### Merge Sort Invariants

1. **Sorted Subarray Invariant**: After conquering, each subarray is sorted
2. **Merge Invariant**: Merge combines two sorted arrays into one sorted array
3. **Completeness Invariant**: All elements are processed exactly once

#### Quick Sort Invariants

1. **Partition Invariant**: After partition, pivot is in correct position
2. **Ordering Invariant**: Elements left of pivot ≤ pivot ≤ elements right of pivot
3. **Recursive Invariant**: Left and right subarrays are independent

### Assumptions

1. **Finite Problem Size**: Problem instances are finite
2. **Well-Defined Division**: Problem can be divided consistently
3. **Efficient Combination**: Combining solutions is efficient (usually O(n))
4. **Base Cases Exist**: Base cases are well-defined and reachable
5. **No Overlapping Subproblems**: Unlike DP, subproblems are independent

This abstract model provides the intellectual backbone for understanding divide and conquer correctness.

## 17.4 Operations & Interface

**Purpose**: Define what operations are supported.

Divide and conquer algorithms support the following conceptual operations:

| Operation | Description | Precondition | Postcondition |
|-----------|-------------|--------------|---------------|
| `divide(problem)` | Break into subproblems | Problem is valid | Returns list of subproblems |
| `conquer(subproblem)` | Solve subproblem | Subproblem is valid | Returns solution |
| `combine(solutions)` | Merge solutions | Solutions are valid | Returns combined solution |
| `isBaseCase(problem)` | Check if base case | Problem is valid | Returns true if base case |
| `solveDirectly(problem)` | Solve base case | Problem is base case | Returns solution |

### Behavioral Guarantees

1. **Correctness**: Combined solution correctly solves original problem
2. **Termination**: Algorithm eventually reaches base cases
3. **Efficiency**: Time complexity meets recurrence relation
4. **Independence**: Subproblems can be solved independently

## 17.5 Time & Space Complexity

**Purpose**: Make trade-offs explicit.

### Time Complexity Analysis

Divide and conquer algorithms follow recurrence relations of the form:
```
T(n) = aT(n/b) + f(n)
```

Where:
- `a` = number of subproblems
- `n/b` = size of each subproblem
- `f(n)` = cost of dividing and combining

### Common Recurrences

| Recurrence | Solution | Examples |
|-----------|----------|----------|
| T(n) = 2T(n/2) + O(n) | O(n log n) | Merge sort, Quick sort (average) |
| T(n) = T(n/2) + O(1) | O(log n) | Binary search |
| T(n) = 2T(n/2) + O(1) | O(n) | Tree traversal |
| T(n) = T(n-1) + O(n) | O(n²) | Some divide and conquer |
| T(n) = 7T(n/2) + O(n²) | O(n^log₂7) ≈ O(n^2.81) | Strassen's matrix multiplication |

### Space Complexity

| Algorithm | Space Complexity | Notes |
|-----------|------------------|-------|
| **Merge Sort** | O(n) | Auxiliary array for merging |
| **Quick Sort** | O(log n) | Recursion stack (average) |
| **Binary Search** | O(1) iterative<br>O(log n) recursive | Stack space |
| **Closest Pair** | O(n log n) | Sorting and recursion |

### Master Theorem

The Master Theorem provides solutions for recurrences of the form T(n) = aT(n/b) + f(n):

**Case 1**: If f(n) = O(n^(log_b a - ε)) for some ε > 0
- Then T(n) = Θ(n^(log_b a))

**Case 2**: If f(n) = Θ(n^(log_b a))
- Then T(n) = Θ(n^(log_b a) log n)

**Case 3**: If f(n) = Ω(n^(log_b a + ε)) for some ε > 0, and af(n/b) ≤ cf(n) for some c < 1
- Then T(n) = Θ(f(n))

## 17.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)

**Purpose**: Bridge theory → implementation.

**Rules**: No language syntax, no pointers/templates, focus on logic only.

### Generic Divide and Conquer Pattern

```
FUNCTION divideAndConquer(problem):
  IF isBaseCase(problem):
    RETURN solveDirectly(problem)
  END IF
  
  subproblems ← divide(problem)
  solutions ← empty list
  
  FOR EACH subproblem IN subproblems:
    solution ← divideAndConquer(subproblem)
    solutions.add(solution)
  END FOR
  
  RETURN combine(solutions)
END FUNCTION
```

### Merge Sort

```
FUNCTION mergeSort(array, left, right):
  IF left ≥ right:
    RETURN  // Base case: single element or empty
  END IF
  
  mid ← (left + right) / 2
  
  mergeSort(array, left, mid)      // Conquer left
  mergeSort(array, mid + 1, right)  // Conquer right
  merge(array, left, mid, right)    // Combine
END FUNCTION

FUNCTION merge(array, left, mid, right):
  temp ← empty array
  i ← left
  j ← mid + 1
  
  WHILE i ≤ mid AND j ≤ right:
    IF array[i] ≤ array[j]:
      temp.append(array[i])
      i ← i + 1
    ELSE:
      temp.append(array[j])
      j ← j + 1
    END IF
  END WHILE
  
  WHILE i ≤ mid:
    temp.append(array[i])
    i ← i + 1
  END WHILE
  
  WHILE j ≤ right:
    temp.append(array[j])
    j ← j + 1
  END WHILE
  
  FOR k FROM 0 TO temp.size() - 1:
    array[left + k] ← temp[k]
  END FOR
END FUNCTION
```

### Quick Sort

```
FUNCTION quickSort(array, left, right):
  IF left ≥ right:
    RETURN  // Base case
  END IF
  
  pivot_index ← partition(array, left, right)
  quickSort(array, left, pivot_index - 1)   // Conquer left
  quickSort(array, pivot_index + 1, right) // Conquer right
END FUNCTION

FUNCTION partition(array, left, right):
  pivot ← array[right]
  i ← left - 1
  
  FOR j FROM left TO right - 1:
    IF array[j] ≤ pivot:
      i ← i + 1
      swap(array[i], array[j])
    END IF
  END FOR
  
  swap(array[i + 1], array[right])
  RETURN i + 1
END FUNCTION
```

### Binary Search

```
FUNCTION binarySearch(array, target, left, right):
  IF left > right:
    RETURN -1  // Not found
  END IF
  
  mid ← left + (right - left) / 2
  
  IF array[mid] = target:
    RETURN mid
  ELSE IF array[mid] < target:
    RETURN binarySearch(array, target, mid + 1, right)
  ELSE:
    RETURN binarySearch(array, target, left, mid - 1)
  END IF
END FUNCTION
```

### Maximum Subarray (Divide and Conquer)

```
FUNCTION maxSubarray(array, left, right):
  IF left = right:
    RETURN array[left]  // Base case
  END IF
  
  mid ← (left + right) / 2
  
  left_max ← maxSubarray(array, left, mid)
  right_max ← maxSubarray(array, mid + 1, right)
  cross_max ← maxCrossingSubarray(array, left, mid, right)
  
  RETURN max(left_max, right_max, cross_max)
END FUNCTION

FUNCTION maxCrossingSubarray(array, left, mid, right):
  left_sum ← -infinity
  sum ← 0
  
  FOR i FROM mid DOWNTO left:
    sum ← sum + array[i]
    left_sum ← max(left_sum, sum)
  END FOR
  
  right_sum ← -infinity
  sum ← 0
  
  FOR j FROM mid + 1 TO right:
    sum ← sum + array[j]
    right_sum ← max(right_sum, sum)
  END FOR
  
  RETURN left_sum + right_sum
END FUNCTION
```

This pseudocode should be readable by any engineer, regardless of their programming language background.

## 17.7 Implementation (Reference Language: C++) ⭐

**Note to Reader**: This section provides concrete C++ implementations. The correctness relies on the invariants defined in Section 17.3 and the pseudocode in Section 17.6.

Detailed C++ implementations for each divide and conquer algorithm are provided in the following sections:
- Section 17.9: Merge Sort Implementation
- Section 17.10: Quick Sort Implementation
- Section 17.11: Binary Search Implementation
- And other algorithms in subsequent sections

## 17.8 Correctness Argument

**Purpose**: Explain why the implementations work.

### Invariant Preservation

Divide and conquer algorithms preserve the core invariants defined in Section 17.3:

#### 1. Problem Decomposition Invariant

**For Merge Sort**:
- Array divided into two halves
- Each half sorted recursively
- Merge combines two sorted halves into one sorted array
- **Preserves**: Final array is sorted

**For Quick Sort**:
- Array partitioned around pivot
- Left and right subarrays sorted recursively
- Partition ensures pivot in correct position
- **Preserves**: Final array is sorted

#### 2. Base Case Invariant

**For All Algorithms**:
- Base cases (single element or empty) are handled correctly
- Base case solutions are correct by definition
- **Preserves**: Algorithm terminates correctly

#### 3. Subproblem Independence

**For Divide and Conquer**:
- Subproblems are independent (unlike DP)
- Can be solved in any order
- Solutions don't depend on each other
- **Preserves**: Correctness of individual subproblems

### Algorithm-Specific Correctness

#### Merge Sort Correctness

**Why it works**:
1. Base case: Single element is sorted
2. Divide: Array split into two halves
3. Conquer: Each half sorted recursively
4. Combine: Merge combines two sorted arrays into one sorted array
5. **Correct**: Final array is sorted

#### Quick Sort Correctness

**Why it works**:
1. Partition places pivot in correct position
2. Elements left of pivot ≤ pivot ≤ elements right of pivot
3. Left and right subarrays sorted recursively
4. **Correct**: Final array is sorted

### Informal Proof Sketch

**For Divide and Conquer**:
1. **Base Case**: Correct by definition/verification
2. **Inductive Step**: If subproblems solved correctly, combination is correct
3. **Termination**: Problem size decreases, eventually reaches base case
4. **Conclusion**: Divide and conquer solution is correct

This correctness argument provides engineers with confidence that divide and conquer implementations work correctly.

## 17.9 Edge Cases & Failure Modes

**Purpose**: Build defensive thinking.

### Empty Input

**Problem**: Empty array or list.

**Edge Cases**:
- Empty array `[]`
- Single element `[x]`
- Two elements `[x, y]`

**Handling**:
```cpp
if (left >= right) {
    return;  // Base case: empty or single element
}
```

### Already Sorted Input

**Problem**: Input is already sorted.

**Edge Cases**:
- Sorted ascending
- Sorted descending
- All same elements

**Handling**: Usually handled correctly, but verify performance.

### Integer Overflow

**Problem**: `(left + right) / 2` may overflow.

**Edge Cases**:
- Very large indices
- `left + right > INT_MAX`

**Handling**:
```cpp
int mid = left + (right - left) / 2;  // Avoid overflow
```

### Common Failure Patterns

1. **Off-by-One Errors**: Incorrect array bounds
2. **Missing Base Case**: Infinite recursion
3. **Incorrect Merge**: Not handling remaining elements
4. **Partition Errors**: Pivot not in correct position
5. **Integer Overflow**: `(left + right) / 2` overflow

This section maps directly to production bugs and helps engineers write robust code.

## 17.10 Performance & System Considerations ⭐ (Differentiator)

**Purpose**: Connect algorithms to real machines.

### Recursion vs Iteration

#### Stack Space

**Recursive Divide and Conquer**:
- Uses call stack: O(log n) depth typically
- Stack overflow risk for very large inputs
- Function call overhead

**Iterative Alternatives**:
- No stack overflow risk
- Better performance (no function calls)
- More complex to implement

### Cache Locality

#### Merge Sort

**Cache Behavior**:
- Good: Sequential access in merge phase
- Bad: Recursive calls may cause cache misses
- **Optimization**: Use iterative merge sort for better cache performance

#### Quick Sort

**Cache Behavior**:
- Good: In-place partitioning (cache-friendly)
- Bad: Recursive calls
- **Optimization**: Use iterative version or limit recursion depth

### Parallelization

#### Divide and Conquer is Naturally Parallel

**Opportunities**:
- Independent subproblems can be solved in parallel
- Merge/combine phase may be parallelizable

**Challenges**:
- Overhead of parallelization
- Load balancing
- Synchronization

### Practical Recommendations

1. **Use Iterative When Possible**: Better performance, no stack risk
2. **Consider Hybrid**: Recursive for clarity, iterative for performance
3. **Profile**: Measure actual performance
4. **Parallelize**: When subproblems are independent and large enough

This section connects divide and conquer algorithms to real system performance.

## 17.11 Merge Sort

**Merge Sort** is a classic divide and conquer sorting algorithm.

### Implementation
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> leftArr(n1);
    vector<int> rightArr(n2);
    
    for (int i = 0; i < n1; i++) {
        leftArr[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        rightArr[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
    }
}

void mergeSort(vector<int>& arr) {
    mergeSort(arr, 0, arr.size() - 1);
}
```

### Time Complexity
- **Time**: O(n log n) in all cases
- **Space**: O(n) for temporary arrays
- **Stable**: Yes
- **In-place**: No

## 17.12 Quick Sort

**Quick Sort** uses divide and conquer with a pivot element.

### Implementation
```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void quickSort(vector<int>& arr) {
    quickSort(arr, 0, arr.size() - 1);
}
```

### Randomized Quick Sort
```cpp
#include <cstdlib>
#include <ctime>

int randomizedPartition(vector<int>& arr, int low, int high) {
    srand(time(nullptr));
    int random = low + rand() % (high - low + 1);
    swap(arr[random], arr[high]);
    return partition(arr, low, high);
}

void randomizedQuickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = randomizedPartition(arr, low, high);
        randomizedQuickSort(arr, low, pi - 1);
        randomizedQuickSort(arr, pi + 1, high);
    }
}
```

### Time Complexity
- **Best Case**: O(n log n)
- **Average Case**: O(n log n)
- **Worst Case**: O(n²) - when pivot is always smallest/largest
- **Space**: O(log n) for recursion stack
- **In-place**: Yes (with some modifications)

## 17.13 Binary Search (Divide and Conquer)

Binary search is a divide and conquer algorithm.

```cpp
// Already covered in Chapter 13
// Divide: Check middle element
// Conquer: Search in left or right half
// Combine: Return result
```

## 17.14 Power Calculation

Calculate x^n efficiently using divide and conquer.

### Implementation
```cpp
double power(double x, int n) {
    if (n == 0) {
        return 1.0;
    }
    
    if (n < 0) {
        x = 1.0 / x;
        n = -n;
    }
    
    double half = power(x, n / 2);
    
    if (n % 2 == 0) {
        return half * half;
    } else {
        return half * half * x;
    }
}
```

### Time Complexity
- **Time**: O(log n)
- **Space**: O(log n)

## 17.15 Maximum Subarray Problem (Kadane's vs Divide and Conquer)

### Divide and Conquer Approach
```cpp
struct SubarrayResult {
    int maxSum;
    int maxLeftSum;
    int maxRightSum;
    int totalSum;
};

SubarrayResult maxCrossingSubarray(const vector<int>& arr, 
                                   int low, int mid, int high) {
    int leftSum = numeric_limits<int>::min();
    int sum = 0;
    int maxLeft = mid;
    
    for (int i = mid; i >= low; i--) {
        sum += arr[i];
        if (sum > leftSum) {
            leftSum = sum;
            maxLeft = i;
        }
    }
    
    int rightSum = numeric_limits<int>::min();
    sum = 0;
    int maxRight = mid + 1;
    
    for (int i = mid + 1; i <= high; i++) {
        sum += arr[i];
        if (sum > rightSum) {
            rightSum = sum;
            maxRight = i;
        }
    }
    
    return {leftSum + rightSum, leftSum, rightSum, 
            accumulate(arr.begin() + low, arr.begin() + high + 1, 0)};
}

int maxSubarrayDivideConquer(const vector<int>& arr, int low, int high) {
    if (low == high) {
        return arr[low];
    }
    
    int mid = low + (high - low) / 2;
    
    int leftMax = maxSubarrayDivideConquer(arr, low, mid);
    int rightMax = maxSubarrayDivideConquer(arr, mid + 1, high);
    SubarrayResult cross = maxCrossingSubarray(arr, low, mid, high);
    
    return max({leftMax, rightMax, cross.maxSum});
}

int maxSubarray(const vector<int>& arr) {
    return maxSubarrayDivideConquer(arr, 0, arr.size() - 1);
}
```

### Time Complexity
- **Time**: O(n log n)
- **Space**: O(log n)

## 17.16 Closest Pair of Points

**Problem**: Find the closest pair of points in a 2D plane.

### Implementation
```cpp
#include <cmath>
#include <algorithm>

struct Point {
    double x, y;
    
    Point(double x, double y) : x(x), y(y) {}
    
    double distance(const Point& other) const {
        double dx = x - other.x;
        double dy = y - other.y;
        return sqrt(dx * dx + dy * dy);
    }
};

bool compareX(const Point& a, const Point& b) {
    return a.x < b.x;
}

bool compareY(const Point& a, const Point& b) {
    return a.y < b.y;
}

double closestPairRecursive(vector<Point>& points, int left, int right) {
    if (right - left <= 3) {
        // Brute force for small sets
        double minDist = numeric_limits<double>::max();
        for (int i = left; i <= right; i++) {
            for (int j = i + 1; j <= right; j++) {
                minDist = min(minDist, points[i].distance(points[j]));
            }
        }
        return minDist;
    }
    
    int mid = left + (right - left) / 2;
    Point midPoint = points[mid];
    
    double leftDist = closestPairRecursive(points, left, mid);
    double rightDist = closestPairRecursive(points, mid + 1, right);
    double minDist = min(leftDist, rightDist);
    
    // Check points in strip
    vector<Point> strip;
    for (int i = left; i <= right; i++) {
        if (abs(points[i].x - midPoint.x) < minDist) {
            strip.push_back(points[i]);
        }
    }
    
    sort(strip.begin(), strip.end(), compareY);
    
    for (size_t i = 0; i < strip.size(); i++) {
        for (size_t j = i + 1; j < strip.size() && 
             (strip[j].y - strip[i].y) < minDist; j++) {
            minDist = min(minDist, strip[i].distance(strip[j]));
        }
    }
    
    return minDist;
}

double closestPair(vector<Point>& points) {
    sort(points.begin(), points.end(), compareX);
    return closestPairRecursive(points, 0, points.size() - 1);
}
```

### Time Complexity
- **Time**: O(n log² n)
- **Space**: O(n)

## 17.17 Strassen's Matrix Multiplication

**Strassen's algorithm** multiplies two matrices using divide and conquer.

### Implementation
```cpp
#include <vector>

vector<vector<int>> addMatrix(const vector<vector<int>>& A, 
                              const vector<vector<int>>& B) {
    int n = A.size();
    vector<vector<int>> C(n, vector<int>(n));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
    return C;
}

vector<vector<int>> subtractMatrix(const vector<vector<int>>& A, 
                                    const vector<vector<int>>& B) {
    int n = A.size();
    vector<vector<int>> C(n, vector<int>(n));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = A[i][j] - B[i][j];
        }
    }
    return C;
}

vector<vector<int>> strassenMultiply(const vector<vector<int>>& A, 
                                     const vector<vector<int>>& B) {
    int n = A.size();
    
    // Base case
    if (n == 1) {
        return {{A[0][0] * B[0][0]}};
    }
    
    // Divide matrices into submatrices
    int half = n / 2;
    
    vector<vector<int>> A11(half, vector<int>(half));
    vector<vector<int>> A12(half, vector<int>(half));
    vector<vector<int>> A21(half, vector<int>(half));
    vector<vector<int>> A22(half, vector<int>(half));
    
    vector<vector<int>> B11(half, vector<int>(half));
    vector<vector<int>> B12(half, vector<int>(half));
    vector<vector<int>> B21(half, vector<int>(half));
    vector<vector<int>> B22(half, vector<int>(half));
    
    // Split matrices (simplified - assumes n is power of 2)
    for (int i = 0; i < half; i++) {
        for (int j = 0; j < half; j++) {
            A11[i][j] = A[i][j];
            A12[i][j] = A[i][j + half];
            A21[i][j] = A[i + half][j];
            A22[i][j] = A[i + half][j + half];
            
            B11[i][j] = B[i][j];
            B12[i][j] = B[i][j + half];
            B21[i][j] = B[i + half][j];
            B22[i][j] = B[i + half][j + half];
        }
    }
    
    // Calculate 7 products
    auto P1 = strassenMultiply(A11, subtractMatrix(B12, B22));
    auto P2 = strassenMultiply(addMatrix(A11, A12), B22);
    auto P3 = strassenMultiply(addMatrix(A21, A22), B11);
    auto P4 = strassenMultiply(A22, subtractMatrix(B21, B11));
    auto P5 = strassenMultiply(addMatrix(A11, A22), addMatrix(B11, B22));
    auto P6 = strassenMultiply(subtractMatrix(A12, A22), addMatrix(B21, B22));
    auto P7 = strassenMultiply(subtractMatrix(A11, A21), addMatrix(B11, B12));
    
    // Calculate result submatrices
    auto C11 = addMatrix(subtractMatrix(addMatrix(P5, P4), P2), P6);
    auto C12 = addMatrix(P1, P2);
    auto C21 = addMatrix(P3, P4);
    auto C22 = subtractMatrix(subtractMatrix(addMatrix(P5, P1), P3), P7);
    
    // Combine result
    vector<vector<int>> C(n, vector<int>(n));
    for (int i = 0; i < half; i++) {
        for (int j = 0; j < half; j++) {
            C[i][j] = C11[i][j];
            C[i][j + half] = C12[i][j];
            C[i + half][j] = C21[i][j];
            C[i + half][j + half] = C22[i][j];
        }
    }
    
    return C;
}
```

### Time Complexity
- **Time**: O(n^log₂7) ≈ O(n^2.81)
- **Space**: O(n²)

## 17.18 Master Theorem

The **Master Theorem** provides asymptotic analysis for divide and conquer recurrences.

### Recurrence Form
```
T(n) = aT(n/b) + f(n)
```
where:
- `a ≥ 1`: number of subproblems
- `b > 1`: factor by which problem size is reduced
- `f(n)`: cost of dividing and combining

### Master Theorem Cases

**Case 1**: If f(n) = O(n^(log_b a - ε)) for some ε > 0
- Then T(n) = Θ(n^(log_b a))

**Case 2**: If f(n) = Θ(n^(log_b a))
- Then T(n) = Θ(n^(log_b a) log n)

**Case 3**: If f(n) = Ω(n^(log_b a + ε)) for some ε > 0, and af(n/b) ≤ cf(n) for some c < 1
- Then T(n) = Θ(f(n))

### Examples

1. **Merge Sort**: T(n) = 2T(n/2) + O(n)
   - a = 2, b = 2, f(n) = n
   - log_b a = 1, f(n) = Θ(n^1)
   - Case 2: T(n) = Θ(n log n)

2. **Binary Search**: T(n) = T(n/2) + O(1)
   - a = 1, b = 2, f(n) = 1
   - log_b a = 0, f(n) = Θ(n^0)
   - Case 2: T(n) = Θ(log n)

3. **Quick Sort (average)**: T(n) = 2T(n/2) + O(n)
   - Same as merge sort: Θ(n log n)

## 17.19 Advanced Divide and Conquer Problems

### 17.10.1 Counting Inversions

Count the number of inversions (pairs where i < j but arr[i] > arr[j]):

```cpp
#include <iostream>
#include <vector>
using namespace std;

long long mergeAndCount(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    long long inversions = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            inversions += (mid - i + 1); // All remaining left elements form inversions
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left, k = 0; i <= right; i++, k++) {
        arr[i] = temp[k];
    }
    
    return inversions;
}

long long countInversions(vector<int>& arr, int left, int right) {
    if (left >= right) return 0;
    
    int mid = left + (right - left) / 2;
    long long inversions = 0;
    
    inversions += countInversions(arr, left, mid);
    inversions += countInversions(arr, mid + 1, right);
    inversions += mergeAndCount(arr, left, mid, right);
    
    return inversions;
}

// Time: O(n log n), Space: O(n)
```

### 17.10.2 Closest Pair of Points

Find the closest pair of points in 2D space:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <climits>
using namespace std;

struct Point {
    double x, y;
    Point(double x, double y) : x(x), y(y) {}
};

double distance(const Point& p1, const Point& p2) {
    return sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

double closestPairRec(vector<Point>& points, int left, int right) {
    if (right - left <= 3) {
        // Brute force for small sets
        double minDist = INT_MAX;
        for (int i = left; i <= right; i++) {
            for (int j = i + 1; j <= right; j++) {
                minDist = min(minDist, distance(points[i], points[j]));
            }
        }
        return minDist;
    }
    
    int mid = left + (right - left) / 2;
    double midX = points[mid].x;
    
    double dl = closestPairRec(points, left, mid);
    double dr = closestPairRec(points, mid + 1, right);
    double d = min(dl, dr);
    
    // Check strip around mid line
    vector<Point> strip;
    for (int i = left; i <= right; i++) {
        if (abs(points[i].x - midX) < d) {
            strip.push_back(points[i]);
        }
    }
    
    // Sort by y-coordinate
    sort(strip.begin(), strip.end(), 
         [](const Point& a, const Point& b) { return a.y < b.y; });
    
    // Check points in strip (at most 6 points need checking)
    for (int i = 0; i < strip.size(); i++) {
        for (int j = i + 1; j < strip.size() && (strip[j].y - strip[i].y) < d; j++) {
            d = min(d, distance(strip[i], strip[j]));
        }
    }
    
    return d;
}

double closestPair(vector<Point>& points) {
    sort(points.begin(), points.end(), 
         [](const Point& a, const Point& b) { return a.x < b.x; });
    return closestPairRec(points, 0, points.size() - 1);
}

// Time: O(n log² n), can be optimized to O(n log n)
```

### 17.10.3 Majority Element

Find element appearing more than n/2 times:

```cpp
int majorityElement(vector<int>& nums, int left, int right) {
    if (left == right) return nums[left];
    
    int mid = left + (right - left) / 2;
    int leftMajority = majorityElement(nums, left, mid);
    int rightMajority = majorityElement(nums, mid + 1, right);
    
    if (leftMajority == rightMajority) return leftMajority;
    
    // Count occurrences of each candidate
    int leftCount = count(nums.begin() + left, nums.begin() + right + 1, leftMajority);
    int rightCount = count(nums.begin() + left, nums.begin() + right + 1, rightMajority);
    
    return leftCount > rightCount ? leftMajority : rightMajority;
}

// Time: O(n log n), Space: O(log n) for recursion
```

### 17.10.4 Karatsuba Multiplication

**Karatsuba multiplication** is a fast multiplication algorithm that multiplies two n-digit numbers in O(n^log₂3) ≈ O(n^1.585) time, which is faster than the traditional O(n²) schoolbook method.

#### The Problem

Multiplying two n-digit numbers using the standard method:
```
   1234
 × 5678
--------
   O(n²) operations
```

#### Karatsuba's Insight

For two numbers `x` and `y`, split them:
- `x = a × 10^(n/2) + b` (a = high half, b = low half)
- `y = c × 10^(n/2) + d` (c = high half, d = low half)

**Standard multiplication**:
```
x × y = (a × 10^(n/2) + b) × (c × 10^(n/2) + d)
      = ac × 10^n + (ad + bc) × 10^(n/2) + bd
```
This requires **4 multiplications**: ac, ad, bc, bd

**Karatsuba's trick**:
```
x × y = ac × 10^n + ((a+b)(c+d) - ac - bd) × 10^(n/2) + bd
```
This requires **3 multiplications**: ac, bd, (a+b)(c+d)

#### Implementation

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

// Helper: Add two numbers represented as strings
string addStrings(string num1, string num2) {
    int i = num1.length() - 1, j = num2.length() - 1;
    int carry = 0;
    string result = "";
    
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += num1[i--] - '0';
        if (j >= 0) sum += num2[j--] - '0';
        result += (sum % 10) + '0';
        carry = sum / 10;
    }
    
    reverse(result.begin(), result.end());
    return result;
}

// Helper: Subtract two numbers (assumes num1 >= num2)
string subtractStrings(string num1, string num2) {
    int i = num1.length() - 1, j = num2.length() - 1;
    int borrow = 0;
    string result = "";
    
    while (i >= 0) {
        int diff = (num1[i] - '0') - borrow;
        if (j >= 0) diff -= (num2[j] - '0');
        
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        result += diff + '0';
        i--; j--;
    }
    
    reverse(result.begin(), result.end());
    // Remove leading zeros
    while (result.length() > 1 && result[0] == '0') {
        result = result.substr(1);
    }
    return result;
}

// Helper: Multiply by power of 10
string multiplyByPowerOf10(string num, int power) {
    return num + string(power, '0');
}

// Karatsuba multiplication
string karatsuba(string x, string y) {
    // Make both numbers same length
    int n = max(x.length(), y.length());
    while (x.length() < n) x = "0" + x;
    while (y.length() < n) y = "0" + y;
    
    // Base case: small numbers
    if (n <= 2) {
        // Use standard multiplication for small numbers
        long long a = stoll(x);
        long long b = stoll(y);
        return to_string(a * b);
    }
    
    int m = n / 2;
    
    // Split numbers
    string a = x.substr(0, n - m);
    string b = x.substr(n - m);
    string c = y.substr(0, n - m);
    string d = y.substr(n - m);
    
    // Three recursive multiplications
    string ac = karatsuba(a, c);
    string bd = karatsuba(b, d);
    string abcd = karatsuba(addStrings(a, b), addStrings(c, d));
    
    // Calculate (ad + bc) = (a+b)(c+d) - ac - bd
    string ad_plus_bc = subtractStrings(subtractStrings(abcd, ac), bd);
    
    // Combine: ac × 10^(2m) + (ad+bc) × 10^m + bd
    string result = addStrings(
        multiplyByPowerOf10(ac, 2 * m),
        addStrings(
            multiplyByPowerOf10(ad_plus_bc, m),
            bd
        )
    );
    
    // Remove leading zeros
    while (result.length() > 1 && result[0] == '0') {
        result = result.substr(1);
    }
    
    return result;
}

// Example usage
int main() {
    string x = "1234";
    string y = "5678";
    cout << karatsuba(x, y) << endl;  // Output: 7006652
    return 0;
}
```

#### Complexity Analysis

**Recurrence Relation**: T(n) = 3T(n/2) + O(n)

**Using Master Theorem**:
- a = 3, b = 2, f(n) = O(n)
- log_b(a) = log₂(3) ≈ 1.585
- Since f(n) = O(n^1) < O(n^1.585), case 1 applies
- **Time Complexity**: O(n^log₂3) ≈ O(n^1.585)

**Space Complexity**: O(log n) for recursion stack

#### Comparison with Standard Multiplication

| Method | Time Complexity | When to Use |
|--------|----------------|-------------|
| **Schoolbook** | O(n²) | Small numbers, simple cases |
| **Karatsuba** | O(n^1.585) | Large numbers (> 100 digits) |
| **FFT-based** | O(n log n) | Very large numbers (> 1000 digits) |

#### When to Use Karatsuba

- **Large number multiplication**: When dealing with numbers with hundreds or thousands of digits
- **Cryptography**: RSA, elliptic curve cryptography
- **Arbitrary precision arithmetic**: Libraries like GMP (GNU Multiple Precision)
- **Competitive programming**: Problems involving very large integers

#### Real-World Applications

- **Cryptographic systems**: RSA encryption/decryption
- **Computer algebra systems**: Mathematica, Maple
- **Arbitrary precision libraries**: GMP, MPFR
- **Blockchain**: Cryptographic operations with large numbers

### 17.10.5 Fast Fourier Transform (FFT) - Overview

The **Fast Fourier Transform (FFT)** is an efficient algorithm for computing the Discrete Fourier Transform (DFT) and its inverse. While FFT is primarily used in signal processing, it has important applications in computer science, particularly for **polynomial multiplication**.

#### Polynomial Multiplication with FFT

**Problem**: Multiply two polynomials of degree n in O(n log n) time instead of O(n²).

**Standard Method**:
```
P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ
Q(x) = b₀ + b₁x + b₂x² + ... + bₙxⁿ
P(x) × Q(x) = Σᵢⱼ aᵢbⱼx^(i+j)  // O(n²) operations
```

**FFT Method**:
1. **Evaluate** P and Q at 2n+1 points using FFT: O(n log n)
2. **Multiply** point values: O(n)
3. **Interpolate** to get coefficients using inverse FFT: O(n log n)
4. **Total**: O(n log n)

#### Key Insight

FFT uses **divide and conquer** to evaluate polynomials at special points (roots of unity) efficiently:
- Divide polynomial into even and odd powers
- Recursively evaluate at half the points
- Combine results using properties of roots of unity

#### Complexity

- **Time**: O(n log n) for polynomial multiplication
- **Space**: O(n) for storing coefficients and intermediate results

#### Applications

1. **Polynomial Multiplication**: Fast multiplication of large polynomials
2. **Large Integer Multiplication**: Can multiply n-digit numbers in O(n log n) using FFT
3. **Signal Processing**: Audio, image processing, compression
4. **Convolution**: Efficient computation of convolutions
5. **Competitive Programming**: Problems involving polynomial operations

#### When to Use FFT

- **Very large polynomials**: Degree > 1000
- **Large integer multiplication**: Numbers with > 1000 digits (faster than Karatsuba)
- **Convolution problems**: When you need to compute many convolutions
- **Signal processing**: Audio/image processing applications

#### Implementation Note

FFT implementation is complex and typically uses:
- **Complex number arithmetic**: Roots of unity are complex numbers
- **Iterative or recursive approach**: Both have trade-offs
- **Optimizations**: Bit-reversal, in-place computation

**For this book**: We provide an overview. Full FFT implementation is typically found in specialized libraries or advanced algorithm courses.

**Example Libraries**:
- **FFTW** (Fastest Fourier Transform in the West): C library
- **NumPy**: Python library with FFT support
- **Eigen**: C++ library with FFT

#### Comparison: Multiplication Methods

| Method | Time Complexity | Best For |
|--------|----------------|----------|
| **Schoolbook** | O(n²) | Small numbers (< 10 digits) |
| **Karatsuba** | O(n^1.585) | Medium numbers (10-1000 digits) |
| **FFT-based** | O(n log n) | Very large numbers (> 1000 digits) |

**Note**: FFT has higher constant factors, so Karatsuba is often faster for practical sizes. FFT becomes advantageous for extremely large numbers.

## 17.20 Divide and Conquer Patterns

### Pattern 1: Array Problems
- **Divide**: Split array into halves
- **Conquer**: Solve recursively on each half
- **Combine**: Merge results (often O(n) work)
- **Examples**: Merge Sort, Quick Sort, Counting Inversions

### Pattern 2: Tree Problems
- **Divide**: Split tree into subtrees
- **Conquer**: Solve recursively on each subtree
- **Combine**: Aggregate results from subtrees
- **Examples**: Tree traversals, tree construction, tree queries

### Pattern 3: Geometric Problems
- **Divide**: Partition plane/space
- **Conquer**: Solve recursively in each partition
- **Combine**: Handle boundary cases and merge
- **Examples**: Closest Pair, Convex Hull, Line Intersection

### Pattern 4: Optimization Problems
- **Divide**: Split problem space
- **Conquer**: Find optimal in each part
- **Combine**: Select best from parts
- **Examples**: Maximum Subarray, Optimal Binary Search Tree

## 17.21 Key Takeaways

1. **Divide and Conquer** breaks problems into smaller subproblems
2. **Recursive structure** is fundamental
3. **Base cases** must be handled
4. **Combining solutions** is crucial
5. **Master Theorem** helps analyze complexity
6. **Many algorithms** use this paradigm
7. **Efficiency** often comes from reducing problem size

## 17.22 Exercises

1. Implement merge sort for linked lists.

2. Create a divide and conquer solution for finding the k-th largest element.

3. Implement a divide and conquer algorithm for counting inversions in an array.

4. Create a solution for "Majority Element" using divide and conquer.

5. Implement divide and conquer for "Pow(x, n)" with optimization.

6. Create a divide and conquer solution for "Search in Rotated Sorted Array".

7. Implement divide and conquer for "Construct Binary Tree from Preorder and Inorder".

8. Create a solution for "Different Ways to Add Parentheses" using divide and conquer.

9. Implement divide and conquer for "Expression Add Operators".

10. Create a divide and conquer solution for "The Skyline Problem".

## 17.23 Summary

Divide and Conquer is a powerful algorithmic paradigm that solves problems by breaking them into smaller subproblems, solving them recursively, and combining the solutions. Understanding divide and conquer, the Master Theorem, and common patterns is essential for designing efficient algorithms and analyzing their complexity.

