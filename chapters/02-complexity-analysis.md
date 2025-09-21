# Chapter 2: Time and Space Complexity Analysis

## 2.1 Introduction to Complexity Analysis

Complexity analysis is the process of determining how the resource requirements (time and space) of an algorithm scale with the input size. This helps us:
- Compare different algorithms for the same problem
- Predict performance on large inputs
- Choose the most appropriate algorithm for our constraints
- Optimize code when performance is critical

## 2.2 Big O Notation

Big O notation describes the upper bound of an algorithm's growth rate. It tells us how an algorithm's performance scales as the input size increases.

### Mathematical Definition
For functions f(n) and g(n), we say f(n) = O(g(n)) if there exist positive constants c and n₀ such that:
```
f(n) ≤ c × g(n) for all n ≥ n₀
```

### Common Big O Notations (from best to worst)

| Notation | Name | Description | Example |
|----------|------|-------------|---------|
| O(1) | Constant | Time/space doesn't change with input | Array access by index |
| O(log n) | Logarithmic | Time/space grows logarithmically | Binary search |
| O(n) | Linear | Time/space grows linearly | Linear search |
| O(n log n) | Linearithmic | Time/space grows as n times log n | Merge sort |
| O(n²) | Quadratic | Time/space grows quadratically | Bubble sort |
| O(n³) | Cubic | Time/space grows cubically | Matrix multiplication |
| O(2ⁿ) | Exponential | Time/space grows exponentially | Brute force subset generation |
| O(n!) | Factorial | Time/space grows factorially | Permutation generation |

### Visual Representation of Growth Rates

```
n     | O(1) | O(log n) | O(n) | O(n log n) | O(n²) | O(2ⁿ)
------|------|----------|------|------------|-------|-------
1     | 1    | 0        | 1    | 0          | 1     | 2
10    | 1    | 3.32     | 10   | 33.2       | 100   | 1024
100   | 1    | 6.64     | 100  | 664        | 10000 | 1.27×10³⁰
1000  | 1    | 9.97     | 1000 | 9966       | 10⁶   | Massive
```

## 2.3 Time Complexity Analysis

### Rules for Analyzing Time Complexity

1. **Drop Constants**: O(2n) becomes O(n)
2. **Drop Lower Order Terms**: O(n² + n + 1) becomes O(n²)
3. **Different Terms for Inputs**: O(a + b) for different inputs, O(a × b) for nested operations
4. **Focus on Worst Case**: Unless specified otherwise

### Examples of Time Complexity Analysis

#### Example 1: Simple Loop
```cpp
void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {  // O(n)
        cout << arr[i] << " ";              // O(1)
    }
    cout << endl;                           // O(1)
}
// Time Complexity: O(n)
```

#### Example 2: Nested Loops
```cpp
void printPairs(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {        // O(n)
        for (int j = i + 1; j < arr.size(); j++) { // O(n)
            cout << "(" << arr[i] << ", " << arr[j] << ") ";
        }
    }
}
// Time Complexity: O(n²)
```

#### Example 3: Logarithmic Time
```cpp
int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // O(1)
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
// Time Complexity: O(log n)
```

#### Example 4: Multiple Operations
```cpp
void processData(const vector<int>& arr) {
    // Sort the array: O(n log n)
    vector<int> sortedArr = arr;
    sort(sortedArr.begin(), sortedArr.end());
    
    // Print each element: O(n)
    for (int num : sortedArr) {
        cout << num << " ";
    }
    
    // Binary search for each element: O(n log n)
    for (int num : arr) {
        binary_search(sortedArr.begin(), sortedArr.end(), num);
    }
}
// Time Complexity: O(n log n) - dominated by the largest term
```

### Recursive Time Complexity

#### Example 5: Fibonacci (Inefficient)
```cpp
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
// Time Complexity: O(2ⁿ)
```

#### Example 6: Merge Sort
```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    // O(n) - merging two sorted arrays
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);      // T(n/2)
        mergeSort(arr, mid + 1, right); // T(n/2)
        merge(arr, left, mid, right);   // O(n)
    }
}
// Recurrence: T(n) = 2T(n/2) + O(n)
// Time Complexity: O(n log n)
```

## 2.4 Space Complexity Analysis

Space complexity measures the amount of memory an algorithm uses relative to the input size.

### Types of Space Complexity

1. **Input Space**: Memory used to store input data
2. **Auxiliary Space**: Extra space used by the algorithm (excluding input)
3. **Total Space**: Input space + auxiliary space

### Examples of Space Complexity Analysis

#### Example 1: Constant Space
```cpp
int findMax(const vector<int>& arr) {
    int maxVal = arr[0];  // O(1) auxiliary space
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}
// Space Complexity: O(1)
```

#### Example 2: Linear Space
```cpp
vector<int> reverseArray(const vector<int>& arr) {
    vector<int> reversed(arr.size());  // O(n) auxiliary space
    for (int i = 0; i < arr.size(); i++) {
        reversed[i] = arr[arr.size() - 1 - i];
    }
    return reversed;
}
// Space Complexity: O(n)
```

#### Example 3: Recursive Space
```cpp
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
// Space Complexity: O(n) - due to recursion stack
```

#### Example 4: Two-Dimensional Space
```cpp
vector<vector<int>> createMatrix(int n, int m) {
    return vector<vector<int>>(n, vector<int>(m, 0));
}
// Space Complexity: O(n × m)
```

## 2.5 Best, Average, and Worst Case Analysis

### Best Case (Ω - Omega)
The minimum time/space required for any input of size n.

### Average Case (Θ - Theta)
The expected time/space for a typical input of size n.

### Worst Case (O - Big O)
The maximum time/space required for any input of size n.

### Example: Quick Sort Analysis
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
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}
```

**Analysis:**
- **Best Case**: O(n log n) - pivot always divides array in half
- **Average Case**: O(n log n) - pivot is reasonably balanced on average
- **Worst Case**: O(n²) - pivot is always the smallest or largest element

## 2.6 Amortized Analysis

Amortized analysis considers the average time per operation over a sequence of operations, even if some individual operations are expensive.

### Example: Dynamic Array (Vector)
```cpp
class DynamicArray {
private:
    int* data;
    int size;
    int capacity;
    
public:
    DynamicArray() : data(nullptr), size(0), capacity(0) {}
    
    void push_back(int value) {
        if (size >= capacity) {
            resize();  // Expensive operation
        }
        data[size++] = value;
    }
    
private:
    void resize() {
        int newCapacity = capacity == 0 ? 1 : capacity * 2;
        int* newData = new int[newCapacity];
        
        for (int i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        
        delete[] data;
        data = newData;
        capacity = newCapacity;
    }
};
```

**Analysis:**
- Individual push_back: O(1) amortized, O(n) worst case
- Sequence of n push_back operations: O(n) total time
- Average time per operation: O(1)

## 2.7 Practical Complexity Analysis Examples

### Example 1: Two Sum Problem
```cpp
// Brute Force Approach - O(n²)
vector<int> twoSumBruteForce(const vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}

// Hash Map Approach - O(n)
vector<int> twoSumHashMap(const vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}
```

### Example 2: Finding Duplicates
```cpp
// Sorting Approach - O(n log n)
bool containsDuplicateSort(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] == nums[i - 1]) {
            return true;
        }
    }
    return false;
}

// Hash Set Approach - O(n)
bool containsDuplicateHash(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    return false;
}
```

## 2.8 Space-Time Tradeoffs

Many algorithms involve tradeoffs between time and space complexity:

| Problem | Time-Optimized | Space-Optimized |
|---------|----------------|-----------------|
| Finding duplicates | O(n) time, O(n) space (hash set) | O(n log n) time, O(1) space (sorting) |
| Fibonacci | O(n) time, O(n) space (memoization) | O(n) time, O(1) space (iterative) |
| String matching | O(n) time, O(m) space (KMP) | O(nm) time, O(1) space (naive) |

## 2.9 Key Takeaways

1. **Big O notation** describes the upper bound of algorithm performance
2. **Time complexity** measures how runtime scales with input size
3. **Space complexity** measures how memory usage scales with input size
4. **Worst-case analysis** is most commonly used for algorithm comparison
5. **Amortized analysis** provides average performance over many operations
6. **Space-time tradeoffs** are common in algorithm design

## 2.10 Exercises

1. Analyze the time and space complexity of the following function:
```cpp
void mystery(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            cout << i << " " << j << endl;
        }
    }
}
```

2. Compare the time complexity of linear search vs. binary search on a sorted array of size n.

3. What is the space complexity of merge sort? Can you optimize it?

4. Analyze the amortized time complexity of inserting n elements into a dynamic array.

5. Given two algorithms: Algorithm A runs in O(n²) time with O(1) space, and Algorithm B runs in O(n) time with O(n) space. Which would you choose for a system with limited memory?

## 2.11 Summary

Understanding complexity analysis is fundamental to becoming an effective programmer. It allows you to make informed decisions about algorithm selection, predict performance characteristics, and optimize code when necessary. The ability to analyze and compare different approaches to the same problem is a crucial skill that will serve you well in interviews, competitive programming, and real-world software development.

In the next chapter, we'll explore basic data structures, starting with arrays and strings, and see how our understanding of complexity analysis helps us choose the right data structure for different problems.
