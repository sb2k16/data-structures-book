# Chapter 3: Basic Data Structures (Arrays and Strings)

## 3.1 Introduction to Arrays

An **array** is a collection of elements of the same data type stored in contiguous memory locations. Arrays provide direct access to elements using indices, making them one of the most fundamental and efficient data structures.

### Key Characteristics of Arrays
- **Fixed size** (in most programming languages)
- **Homogeneous elements** (all elements of the same type)
- **Contiguous memory allocation**
- **Random access** capability (O(1) access time)
- **Zero-based indexing** (in most languages including C++)

## 3.2 Static Arrays in C++

### Declaration and Initialization
```cpp
#include <iostream>
#include <array>
using namespace std;

int main() {
    // Method 1: Traditional C-style array
    int arr1[5];                    // Uninitialized array
    int arr2[5] = {1, 2, 3, 4, 5}; // Initialized array
    int arr3[] = {1, 2, 3};         // Auto-sized array
    
    // Method 2: std::array (recommended)
    array<int, 5> arr4;             // Uninitialized
    array<int, 5> arr5 = {1, 2, 3, 4, 5}; // Initialized
    array<int, 5> arr6 = {1, 2};    // Partial initialization (rest are 0)
    
    return 0;
}
```

### Basic Operations on Static Arrays
```cpp
void demonstrateStaticArray() {
    array<int, 5> arr = {1, 2, 3, 4, 5};
    
    // Access elements
    cout << "Element at index 2: " << arr[2] << endl;
    cout << "Element at index 2: " << arr.at(2) << endl; // Bounds checking
    
    // Modify elements
    arr[0] = 10;
    arr.at(1) = 20;
    
    // Get array properties
    cout << "Size: " << arr.size() << endl;
    cout << "Empty: " << arr.empty() << endl;
    
    // Iterate through array
    cout << "Array elements: ";
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    // Range-based for loop
    cout << "Array elements: ";
    for (int element : arr) {
        cout << element << " ";
    }
    cout << endl;
}
```

## 3.3 Dynamic Arrays (Vectors) in C++

The `std::vector` class provides a dynamic array that can grow and shrink in size.

### Basic Vector Operations
```cpp
#include <vector>
#include <iostream>
using namespace std;

void demonstrateVector() {
    // Declaration and initialization
    vector<int> vec1;                    // Empty vector
    vector<int> vec2(5);                 // Vector of size 5 (all zeros)
    vector<int> vec3(5, 10);             // Vector of size 5 with value 10
    vector<int> vec4 = {1, 2, 3, 4, 5};  // Initialized vector
    
    // Adding elements
    vec1.push_back(1);
    vec1.push_back(2);
    vec1.push_back(3);
    
    // Insert elements
    vec1.insert(vec1.begin() + 1, 10);   // Insert 10 at index 1
    
    // Remove elements
    vec1.pop_back();                     // Remove last element
    vec1.erase(vec1.begin() + 1);        // Remove element at index 1
    
    // Access elements
    cout << "First element: " << vec1.front() << endl;
    cout << "Last element: " << vec1.back() << endl;
    cout << "Element at index 1: " << vec1[1] << endl;
    
    // Vector properties
    cout << "Size: " << vec1.size() << endl;
    cout << "Capacity: " << vec1.capacity() << endl;
    cout << "Empty: " << vec1.empty() << endl;
    
    // Reserve space
    vec1.reserve(100);                   // Reserve space for 100 elements
    
    // Resize
    vec1.resize(10, 5);                  // Resize to 10, fill new elements with 5
    
    // Clear vector
    vec1.clear();
}
```

### Vector Performance Characteristics
- **Access**: O(1) - random access by index
- **Insertion at end**: O(1) amortized - occasionally O(n) when resizing
- **Insertion at beginning/middle**: O(n) - need to shift elements
- **Deletion from end**: O(1)
- **Deletion from beginning/middle**: O(n) - need to shift elements
- **Search**: O(n) - linear search required

## 3.4 Dynamic Vector Growth Mechanisms

Understanding how vectors dynamically grow is crucial for efficient programming and performance optimization. This section explores the internal mechanisms, growth strategies, and optimization techniques.

### How Vector Growth Works

Vectors maintain two key properties:
- **Size**: Number of elements currently stored
- **Capacity**: Number of elements that can be stored without reallocation

```cpp
#include <vector>
#include <iostream>
#include <chrono>
using namespace std;

void demonstrateVectorGrowth() {
    vector<int> vec;
    
    cout << "Initial state:" << endl;
    cout << "Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
    
    // Add elements and observe growth
    for (int i = 1; i <= 20; i++) {
        vec.push_back(i);
        cout << "After adding " << i << ": Size = " << vec.size() 
             << ", Capacity = " << vec.capacity() << endl;
    }
}
```

### Growth Strategy Analysis

Most C++ implementations use a **doubling strategy** where capacity is doubled when more space is needed:

```cpp
// Simple demonstration of vector growth
void demonstrateGrowthPattern() {
    vector<int> vec;
    
    cout << "Vector growth pattern:" << endl;
    cout << "Elements\tSize\tCapacity" << endl;
    
    for (int i = 0; i < 20; i++) {
        vec.push_back(i);
        cout << i + 1 << "\t\t" << vec.size() 
             << "\t" << vec.capacity() << endl;
    }
}
```

> **Note**: For detailed performance analysis and benchmarking, see `examples/arrays/vector_growth_analysis.cpp`

### Memory Reallocation Process

When a vector needs to grow, it performs these steps:

```cpp
// Simplified vector reallocation process
class SimpleVector {
private:
    int* data;
    size_t size;
    size_t capacity;
    
public:
    SimpleVector() : data(nullptr), size(0), capacity(0) {}
    
    ~SimpleVector() {
        delete[] data;
    }
    
    void push_back(int value) {
        if (size >= capacity) {
            // Need to reallocate
            size_t newCapacity = (capacity == 0) ? 1 : capacity * 2;
            reallocate(newCapacity);
        }
        
        data[size] = value;
        size++;
    }
    
private:
    void reallocate(size_t newCapacity) {
        cout << "Reallocating from capacity " << capacity 
             << " to " << newCapacity << endl;
        
        int* newData = new int[newCapacity];
        
        // Copy existing elements
        for (size_t i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        
        delete[] data;
        data = newData;
        capacity = newCapacity;
    }
    
public:
    size_t getSize() const { return size; }
    size_t getCapacity() const { return capacity; }
};
```

### Optimization Techniques

#### 1. Reserve Capacity
```cpp
// Use reserve() when you know the approximate size
void efficientVectorUsage() {
    vector<int> vec;
    vec.reserve(1000);  // Pre-allocate capacity
    
    for (int i = 0; i < 1000; i++) {
        vec.push_back(i);  // No reallocations needed
    }
}
```

#### 2. Shrink to Fit
```cpp
// Use shrink_to_fit() to reduce memory usage
void optimizeMemoryUsage() {
    vector<int> vec;
    
    // Add many elements
    for (int i = 0; i < 10000; i++) {
        vec.push_back(i);
    }
    
    // Remove most elements
    vec.erase(vec.begin() + 100, vec.end());
    
    // Shrink to save memory
    vec.shrink_to_fit();
}
```

#### 3. Emplace vs Push Back
```cpp
// Use emplace_back() for better performance with complex objects
void preferEmplaceBack() {
    vector<pair<string, int>> vec;
    
    // Good: constructs in place
    vec.emplace_back("Alice", 25);
    
    // Less efficient: creates temporary
    vec.push_back(make_pair("Bob", 30));
}
```

> **Note**: For detailed performance comparisons and benchmarking, see `examples/arrays/vector_optimization_tests.cpp`

### Best Practices Summary

1. **Use `reserve()`** when you know the approximate size
2. **Use `emplace_back()`** instead of `push_back()` for complex objects
3. **Use move semantics** when possible to avoid unnecessary copies
4. **Consider `shrink_to_fit()`** for memory optimization after removing many elements
5. **Avoid frequent reallocations** in loops by pre-allocating capacity

```cpp
// Example combining best practices
void processDataEfficiently(const vector<int>& input) {
    vector<int> result;
    result.reserve(input.size());  // Pre-allocate
    
    for (int value : input) {
        result.emplace_back(value * 2);  // Construct in place
    }
    
    // Optional: shrink if we know we won't add more
    result.shrink_to_fit();
}
```

## 3.6 Common Array Algorithms

### Linear Search
```cpp
// Returns index of target, -1 if not found
int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// Using iterator
int linearSearchIterator(const vector<int>& arr, int target) {
    auto it = find(arr.begin(), arr.end(), target);
    return (it != arr.end()) ? distance(arr.begin(), it) : -1;
}
```

### Binary Search (for sorted arrays)
```cpp
int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // Prevents overflow
        
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

// Using STL
bool binarySearchSTL(const vector<int>& arr, int target) {
    return binary_search(arr.begin(), arr.end(), target);
}
```

### Array Rotation
```cpp
// Rotate array left by k positions
void rotateLeft(vector<int>& arr, int k) {
    k = k % arr.size();  // Handle k > array size
    reverse(arr.begin(), arr.begin() + k);
    reverse(arr.begin() + k, arr.end());
    reverse(arr.begin(), arr.end());
}

// Rotate array right by k positions
void rotateRight(vector<int>& arr, int k) {
    k = k % arr.size();
    reverse(arr.begin(), arr.end());
    reverse(arr.begin(), arr.begin() + k);
    reverse(arr.begin() + k, arr.end());
}
```

### Finding Maximum Subarray (Kadane's Algorithm)
```cpp
int maxSubarraySum(const vector<int>& arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    
    for (int i = 1; i < arr.size(); i++) {
        maxEndingHere = max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}
```

### Two Pointers Technique
```cpp
// Find pair with given sum in sorted array
vector<int> twoSumSorted(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};  // No pair found
}

// Remove duplicates from sorted array
int removeDuplicates(vector<int>& arr) {
    if (arr.empty()) return 0;
    
    int writeIndex = 1;
    for (int readIndex = 1; readIndex < arr.size(); readIndex++) {
        if (arr[readIndex] != arr[readIndex - 1]) {
            arr[writeIndex] = arr[readIndex];
            writeIndex++;
        }
    }
    return writeIndex;
}
```

## 3.7 Multidimensional Arrays

### 2D Arrays (Matrices)
```cpp
#include <vector>
#include <iostream>
using namespace std;

void demonstrate2DArray() {
    // Method 1: Traditional 2D array
    int matrix1[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    // Method 2: Vector of vectors (recommended)
    vector<vector<int>> matrix2 = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    // Method 3: Dynamic allocation
    vector<vector<int>> matrix3(3, vector<int>(4, 0));  // 3x4 matrix filled with 0s
    
    // Access elements
    cout << "Element at [1][2]: " << matrix2[1][2] << endl;
    
    // Iterate through 2D array
    for (int i = 0; i < matrix2.size(); i++) {
        for (int j = 0; j < matrix2[i].size(); j++) {
            cout << matrix2[i][j] << " ";
        }
        cout << endl;
    }
}
```

### Matrix Operations
```cpp
// Matrix multiplication
vector<vector<int>> multiplyMatrices(const vector<vector<int>>& a, 
                                   const vector<vector<int>>& b) {
    int rows = a.size();
    int cols = b[0].size();
    int common = a[0].size();
    
    vector<vector<int>> result(rows, vector<int>(cols, 0));
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            for (int k = 0; k < common; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    return result;
}

// Transpose matrix
vector<vector<int>> transpose(const vector<vector<int>>& matrix) {
    int rows = matrix.size();
    int cols = matrix[0].size();
    
    vector<vector<int>> result(cols, vector<int>(rows));
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
}
```

## 3.8 String Manipulation

### Basic String Operations
```cpp
#include <string>
#include <iostream>
#include <algorithm>
using namespace std;

void demonstrateStringOperations() {
    // String declaration and initialization
    string str1 = "Hello";
    string str2("World");
    string str3(5, 'A');  // "AAAAA"
    
    // String concatenation
    string result = str1 + " " + str2;
    str1 += " World";
    
    // String properties
    cout << "Length: " << str1.length() << endl;
    cout << "Size: " << str1.size() << endl;
    cout << "Empty: " << str1.empty() << endl;
    
    // Access characters
    cout << "First character: " << str1[0] << endl;
    cout << "Last character: " << str1.back() << endl;
    
    // String modification
    str1.insert(5, " Beautiful");
    str1.erase(5, 10);  // Remove 10 characters starting from index 5
    str1.replace(0, 5, "Hi");  // Replace 5 characters starting from 0
    
    // Substring
    string sub = str1.substr(0, 5);
    
    // Find operations
    size_t pos = str1.find("World");
    if (pos != string::npos) {
        cout << "Found 'World' at position: " << pos << endl;
    }
}
```

### String Algorithms

#### Palindrome Check
```cpp
bool isPalindrome(const string& str) {
    int left = 0;
    int right = str.length() - 1;
    
    while (left < right) {
        if (str[left] != str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Case-insensitive palindrome check
bool isPalindromeIgnoreCase(const string& str) {
    string lower = str;
    transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
    return isPalindrome(lower);
}
```

#### String Reversal
```cpp
string reverseString(string str) {
    int left = 0;
    int right = str.length() - 1;
    
    while (left < right) {
        swap(str[left], str[right]);
        left++;
        right--;
    }
    return str;
}

// Using STL
string reverseStringSTL(string str) {
    reverse(str.begin(), str.end());
    return str;
}
```

#### Anagram Check
```cpp
bool areAnagrams(const string& str1, const string& str2) {
    if (str1.length() != str2.length()) {
        return false;
    }
    
    vector<int> count(256, 0);  // Assuming ASCII characters
    
    for (char c : str1) {
        count[c]++;
    }
    
    for (char c : str2) {
        count[c]--;
        if (count[c] < 0) {
            return false;
        }
    }
    
    return true;
}

// Using sorting
bool areAnagramsSort(string str1, string str2) {
    if (str1.length() != str2.length()) {
        return false;
    }
    
    sort(str1.begin(), str1.end());
    sort(str2.begin(), str2.end());
    
    return str1 == str2;
}
```

#### Longest Common Subsequence
```cpp
int longestCommonSubsequence(const string& text1, const string& text2) {
    int m = text1.length();
    int n = text2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
```

## 3.9 Advanced Array Techniques

### Sliding Window Technique
```cpp
// Maximum sum of k consecutive elements
int maxSumKConsecutive(const vector<int>& arr, int k) {
    if (arr.size() < k) return -1;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Longest substring without repeating characters
int lengthOfLongestSubstring(const string& s) {
    unordered_set<char> charSet;
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (charSet.find(s[right]) != charSet.end()) {
            charSet.erase(s[left]);
            left++;
        }
        charSet.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

### Prefix Sum Technique
```cpp
class PrefixSum {
private:
    vector<int> prefix;
    
public:
    PrefixSum(const vector<int>& arr) {
        prefix.resize(arr.size() + 1);
        prefix[0] = 0;
        for (int i = 0; i < arr.size(); i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
    }
    
    // Sum of elements from index left to right (inclusive)
    int rangeSum(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};

// Example usage
void demonstratePrefixSum() {
    vector<int> arr = {1, 2, 3, 4, 5};
    PrefixSum ps(arr);
    
    cout << "Sum from index 1 to 3: " << ps.rangeSum(1, 3) << endl;  // 2+3+4 = 9
}
```

## 3.10 Memory Management and Best Practices

### Memory Layout of Arrays
```cpp
void demonstrateMemoryLayout() {
    // Stack-allocated array
    int stackArray[5] = {1, 2, 3, 4, 5};
    
    // Heap-allocated array
    int* heapArray = new int[5];
    for (int i = 0; i < 5; i++) {
        heapArray[i] = i + 1;
    }
    
    // Don't forget to free heap memory
    delete[] heapArray;
    
    // Vector (automatic memory management)
    vector<int> vec = {1, 2, 3, 4, 5};
    // Memory is automatically managed
}
```

### Best Practices
1. **Use `std::vector` over raw arrays** when possible
2. **Use `std::array` over C-style arrays** for fixed-size arrays
3. **Always initialize arrays** to avoid undefined behavior
4. **Check bounds** when accessing array elements
5. **Use range-based for loops** for cleaner code
6. **Prefer algorithms from `<algorithm>`** header

## 3.11 Key Takeaways

1. **Arrays** provide O(1) random access but fixed size in C++
2. **Vectors** offer dynamic sizing with automatic memory management
3. **Strings** in C++ are mutable and support many operations
4. **Common algorithms** include search, sort, and manipulation techniques
5. **Memory management** is crucial for performance and correctness
6. **STL containers and algorithms** provide efficient, tested implementations

## 3.12 Exercises

1. Implement a function to find the second largest element in an array.
2. Write a function to rotate an array to the right by k steps.
3. Create a function that finds the longest increasing subsequence in an array.
4. Implement a function to merge two sorted arrays into one sorted array.
5. Write a function that finds the majority element in an array (appears more than n/2 times).
6. **Vector Growth Analysis**: Write a program that demonstrates the growth pattern of `std::vector` and measures the performance difference between using `reserve()` and not using it.
7. **Custom Vector Implementation**: Implement a simplified version of `std::vector` with dynamic growth capabilities, including `push_back()`, `reserve()`, and `shrink_to_fit()` methods.
8. **Memory Optimization**: Create a function that efficiently processes a large dataset by minimizing vector reallocations using appropriate reserve strategies.

## 3.13 Summary

Arrays and strings are fundamental data structures that form the building blocks of more complex algorithms and data structures. Understanding their properties, operations, and common algorithms is essential for any programmer. The techniques learned in this chapter—such as two pointers, sliding window, and prefix sums—are widely applicable in solving various algorithmic problems.

In the next chapter, we'll explore linked lists, which provide a different way of organizing data with their own set of advantages and trade-offs compared to arrays.
