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

## 17.10 Advanced Divide and Conquer Problems

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

## 17.11 Divide and Conquer Patterns

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

## 17.12 Key Takeaways

1. **Divide and Conquer** breaks problems into smaller subproblems
2. **Recursive structure** is fundamental
3. **Base cases** must be handled
4. **Combining solutions** is crucial
5. **Master Theorem** helps analyze complexity
6. **Many algorithms** use this paradigm
7. **Efficiency** often comes from reducing problem size

## 17.13 Exercises

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

## 17.14 Summary

Divide and Conquer is a powerful algorithmic paradigm that solves problems by breaking them into smaller subproblems, solving them recursively, and combining the solutions. Understanding divide and conquer, the Master Theorem, and common patterns is essential for designing efficient algorithms and analyzing their complexity.

