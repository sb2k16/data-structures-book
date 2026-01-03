# Chapter 17: Divide and Conquer

## 17.1 Introduction to Divide and Conquer

**Divide and Conquer** is a fundamental algorithmic paradigm that solves problems by:
1. **Divide**: Break the problem into smaller subproblems
2. **Conquer**: Solve the subproblems recursively
3. **Combine**: Combine solutions to subproblems to solve the original problem

### Key Characteristics

- **Recursive Structure**: Problems are solved recursively
- **Subproblem Independence**: Subproblems are independent
- **Base Case**: Small enough problems are solved directly
- **Efficiency**: Often leads to efficient algorithms

### When to Use Divide and Conquer

1. **Problem can be divided** into similar subproblems
2. **Subproblems are independent** and can be solved separately
3. **Combining solutions** is straightforward
4. **Base cases** are easy to solve

### Divide and Conquer Template

```cpp
T divideAndConquer(Problem problem) {
    // Base case
    if (problem.isSmall()) {
        return solveDirectly(problem);
    }
    
    // Divide
    Subproblem[] subproblems = divide(problem);
    
    // Conquer
    Solution[] solutions = new Solution[subproblems.length];
    for (int i = 0; i < subproblems.length; i++) {
        solutions[i] = divideAndConquer(subproblems[i]);
    }
    
    // Combine
    return combine(solutions);
}
```

## 17.2 Merge Sort

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

## 17.3 Quick Sort

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

## 17.4 Binary Search (Divide and Conquer)

Binary search is a divide and conquer algorithm.

```cpp
// Already covered in Chapter 13
// Divide: Check middle element
// Conquer: Search in left or right half
// Combine: Return result
```

## 17.5 Power Calculation

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

## 17.6 Maximum Subarray Problem (Kadane's vs Divide and Conquer)

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

## 17.7 Closest Pair of Points

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

## 17.8 Strassen's Matrix Multiplication

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

## 17.9 Master Theorem

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

## 17.10 Divide and Conquer Patterns

### Pattern 1: Array Problems
- Divide array into halves
- Solve recursively
- Combine results

### Pattern 2: Tree Problems
- Divide tree into subtrees
- Solve recursively
- Combine results

### Pattern 3: Geometric Problems
- Divide plane/space
- Solve recursively
- Handle boundary cases

### Pattern 4: Optimization Problems
- Divide problem space
- Find optimal in each part
- Combine optimally

## 17.11 Key Takeaways

1. **Divide and Conquer** breaks problems into smaller subproblems
2. **Recursive structure** is fundamental
3. **Base cases** must be handled
4. **Combining solutions** is crucial
5. **Master Theorem** helps analyze complexity
6. **Many algorithms** use this paradigm
7. **Efficiency** often comes from reducing problem size

## 17.12 Exercises

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

## 17.13 Summary

Divide and Conquer is a powerful algorithmic paradigm that solves problems by breaking them into smaller subproblems, solving them recursively, and combining the solutions. Understanding divide and conquer, the Master Theorem, and common patterns is essential for designing efficient algorithms and analyzing their complexity.

