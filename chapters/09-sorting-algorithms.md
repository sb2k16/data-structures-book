# Chapter 9: Sorting Algorithms

## 9.1 Introduction to Sorting

**Sorting** is the process of arranging data in a particular order (ascending or descending). Sorting is one of the most fundamental operations in computer science and is used in countless applications, from organizing databases to preparing data for efficient searching.

### Why Sorting Matters

1. **Search Efficiency**: Sorted data enables binary search (O(log n)) vs. linear search (O(n))
2. **Data Analysis**: Statistical operations often require sorted data
3. **User Interface**: Displaying sorted results improves user experience
4. **Database Operations**: Many database queries benefit from sorted indexes
5. **Algorithm Prerequisites**: Some algorithms require sorted input

### Sorting Criteria

- **Stability**: Maintains relative order of equal elements
- **In-place**: Uses O(1) extra space
- **Adaptive**: Performance improves with partially sorted data
- **Comparison-based**: Uses comparisons to determine order
- **Time Complexity**: Best, average, and worst-case performance

## 9.2 Comparison-Based Sorting Algorithms

### 1. Bubble Sort

Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
using namespace std;

// Basic Bubble Sort
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// Optimized Bubble Sort (stops if no swaps in a pass)
void optimizedBubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swaps occurred, array is sorted
        if (!swapped) {
            break;
        }
    }
}

// Time Complexity: O(n²) worst/average, O(n) best
// Space Complexity: O(1)
// Stable: Yes
// In-place: Yes
```

### 2. Selection Sort

Selection Sort finds the minimum element and places it at the beginning.

```cpp
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        
        // Find minimum element in remaining array
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap with first element of unsorted portion
        if (minIndex != i) {
            swap(arr[i], arr[minIndex]);
        }
    }
}

// Time Complexity: O(n²) always
// Space Complexity: O(1)
// Stable: No
// In-place: Yes
```

### 3. Insertion Sort

Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position.

```cpp
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
}

// Time Complexity: O(n²) worst/average, O(n) best
// Space Complexity: O(1)
// Stable: Yes
// In-place: Yes
// Adaptive: Yes
```

### 4. Merge Sort

Merge Sort uses the divide-and-conquer approach to sort arrays.

```cpp
// Merge function to combine two sorted arrays
void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    vector<int> leftArr(n1);
    vector<int> rightArr(n2);
    
    // Copy data to temporary arrays
    for (int i = 0; i < n1; i++) {
        leftArr[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        rightArr[j] = arr[mid + 1 + j];
    }
    
    // Merge the temporary arrays back
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
    
    // Copy remaining elements
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

// Merge sort function
void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

// Wrapper function
void mergeSort(vector<int>& arr) {
    if (arr.size() > 1) {
        mergeSort(arr, 0, arr.size() - 1);
    }
}

// Time Complexity: O(n log n) always
// Space Complexity: O(n)
// Stable: Yes
// In-place: No
```

### 5. Quick Sort

Quick Sort uses a pivot element to partition the array and recursively sorts the partitions.

```cpp
// Partition function
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];  // Choose last element as pivot
    int i = low - 1;        // Index of smaller element
    
    for (int j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

// Quick sort function
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

// Wrapper function
void quickSort(vector<int>& arr) {
    if (arr.size() > 1) {
        quickSort(arr, 0, arr.size() - 1);
    }
}

// Randomized Quick Sort (better average performance)
int randomizedPartition(vector<int>& arr, int low, int high) {
    int randomIndex = low + rand() % (high - low + 1);
    swap(arr[randomIndex], arr[high]);
    return partition(arr, low, high);
}

void randomizedQuickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIndex = randomizedPartition(arr, low, high);
        randomizedQuickSort(arr, low, pivotIndex - 1);
        randomizedQuickSort(arr, pivotIndex + 1, high);
    }
}

// Time Complexity: O(n log n) average, O(n²) worst
// Space Complexity: O(log n) average, O(n) worst
// Stable: No
// In-place: Yes
```

### 6. Heap Sort

Heap Sort uses a binary heap data structure to sort elements.

```cpp
// Heapify function to maintain heap property
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;        // Initialize largest as root
    int left = 2 * i + 1;   // Left child
    int right = 2 * i + 2;  // Right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest != i) {
        swap(arr[i], arr[largest]);
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Heap sort function
void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // One by one extract elements from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        swap(arr[0], arr[i]);
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

// Time Complexity: O(n log n) always
// Space Complexity: O(1)
// Stable: No
// In-place: Yes
```

## 9.3 Non-Comparison Sorting Algorithms

### 1. Counting Sort

Counting Sort works by counting the number of objects having distinct key values.

```cpp
void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    
    // Find the maximum element
    int maxElement = *max_element(arr.begin(), arr.end());
    
    // Create count array
    vector<int> count(maxElement + 1, 0);
    
    // Count occurrences of each element
    for (int num : arr) {
        count[num]++;
    }
    
    // Modify count array to store actual position
    for (int i = 1; i <= maxElement; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copy output back to original array
    arr = output;
}

// Time Complexity: O(n + k) where k is range of input
// Space Complexity: O(k)
// Stable: Yes
// In-place: No
```

### 2. Radix Sort

Radix Sort sorts numbers by processing individual digits.

```cpp
// Counting sort for individual digit
void countingSortByDigit(vector<int>& arr, int exp) {
    vector<int> output(arr.size());
    vector<int> count(10, 0);
    
    // Count occurrences of each digit
    for (int num : arr) {
        count[(num / exp) % 10]++;
    }
    
    // Change count[i] to position of digit i in output
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy output back to original array
    arr = output;
}

// Radix sort function
void radixSort(vector<int>& arr) {
    if (arr.empty()) return;
    
    // Find maximum number to know number of digits
    int maxNum = *max_element(arr.begin(), arr.end());
    
    // Do counting sort for every digit
    for (int exp = 1; maxNum / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

// Time Complexity: O(d × (n + k)) where d is number of digits
// Space Complexity: O(n + k)
// Stable: Yes
// In-place: No
```

### 3. Bucket Sort

Bucket Sort distributes elements into buckets and sorts each bucket.

```cpp
void bucketSort(vector<double>& arr) {
    if (arr.empty()) return;
    
    int n = arr.size();
    vector<vector<double>> buckets(n);
    
    // Put array elements in different buckets
    for (double num : arr) {
        int bucketIndex = n * num;
        buckets[bucketIndex].push_back(num);
    }
    
    // Sort individual buckets
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
    }
    
    // Concatenate all buckets into arr[]
    int index = 0;
    for (const auto& bucket : buckets) {
        for (double num : bucket) {
            arr[index++] = num;
        }
    }
}

// Time Complexity: O(n + k) average, O(n²) worst
// Space Complexity: O(n + k)
// Stable: Yes
// In-place: No
```

## 9.4 Hybrid Sorting Algorithms

### Timsort (Used in Python and Java)

Timsort is a hybrid stable sorting algorithm derived from merge sort and insertion sort.

```cpp
const int RUN = 32;

// Insertion sort for small arrays
void insertionSort(vector<int>& arr, int left, int right) {
    for (int i = left + 1; i <= right; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Merge function for Timsort
void mergeTim(vector<int>& arr, int left, int mid, int right) {
    int len1 = mid - left + 1;
    int len2 = right - mid;
    
    vector<int> leftArr(len1);
    vector<int> rightArr(len2);
    
    for (int i = 0; i < len1; i++) {
        leftArr[i] = arr[left + i];
    }
    for (int j = 0; j < len2; j++) {
        rightArr[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    
    while (i < len1 && j < len2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }
    
    while (i < len1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }
    while (j < len2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

// Timsort function
void timSort(vector<int>& arr) {
    int n = arr.size();
    
    // Sort individual subarrays of size RUN
    for (int i = 0; i < n; i += RUN) {
        insertionSort(arr, i, min(i + RUN - 1, n - 1));
    }
    
    // Start merging from size RUN
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = min(left + 2 * size - 1, n - 1);
            
            if (mid < right) {
                mergeTim(arr, left, mid, right);
            }
        }
    }
}
```

## 9.5 Performance Comparison

### Time Complexity Summary

| Algorithm | Best Case | Average Case | Worst Case | Space Complexity |
|-----------|-----------|--------------|------------|------------------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) |
| Radix Sort | O(d × n) | O(d × n) | O(d × n) | O(n + k) |
| Bucket Sort | O(n + k) | O(n + k) | O(n²) | O(n + k) |

### When to Use Which Algorithm

1. **Small datasets (< 50 elements)**: Insertion Sort
2. **Nearly sorted data**: Insertion Sort or Bubble Sort
3. **General purpose**: Quick Sort or Merge Sort
4. **Memory constrained**: Heap Sort
5. **Stable sort required**: Merge Sort or Insertion Sort
6. **Integer data with small range**: Counting Sort
7. **Large datasets**: Merge Sort or Heap Sort
8. **Real-world applications**: Timsort or Introsort

## 9.6 Testing and Benchmarking

```cpp
// Utility functions for testing
vector<int> generateRandomArray(int size, int minVal = 1, int maxVal = 1000) {
    vector<int> arr(size);
    for (int i = 0; i < size; i++) {
        arr[i] = minVal + rand() % (maxVal - minVal + 1);
    }
    return arr;
}

vector<int> generateSortedArray(int size) {
    vector<int> arr(size);
    for (int i = 0; i < size; i++) {
        arr[i] = i;
    }
    return arr;
}

vector<int> generateReverseSortedArray(int size) {
    vector<int> arr(size);
    for (int i = 0; i < size; i++) {
        arr[i] = size - i;
    }
    return arr;
}

bool isSorted(const vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

void printArray(const vector<int>& arr) {
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

// Benchmarking function
template<typename SortFunction>
double benchmarkSort(SortFunction sortFunc, vector<int> arr) {
    auto start = chrono::high_resolution_clock::now();
    sortFunc(arr);
    auto end = chrono::high_resolution_clock::now();
    
    auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
    return duration.count() / 1000.0; // Return time in milliseconds
}

void runSortingBenchmarks() {
    const int sizes[] = {100, 1000, 10000};
    const string algorithms[] = {"Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap"};
    
    for (int size : sizes) {
        cout << "\nArray size: " << size << endl;
        cout << "Algorithm\t\tTime (ms)" << endl;
        cout << "----------------------------------------" << endl;
        
        vector<int> originalArray = generateRandomArray(size);
        
        // Test each algorithm
        vector<int> testArray = originalArray;
        cout << "Bubble Sort\t\t" << benchmarkSort(bubbleSort, testArray) << endl;
        
        testArray = originalArray;
        cout << "Selection Sort\t\t" << benchmarkSort(selectionSort, testArray) << endl;
        
        testArray = originalArray;
        cout << "Insertion Sort\t\t" << benchmarkSort(insertionSort, testArray) << endl;
        
        testArray = originalArray;
        cout << "Merge Sort\t\t" << benchmarkSort(mergeSort, testArray) << endl;
        
        testArray = originalArray;
        cout << "Quick Sort\t\t" << benchmarkSort(quickSort, testArray) << endl;
        
        testArray = originalArray;
        cout << "Heap Sort\t\t" << benchmarkSort(heapSort, testArray) << endl;
    }
}
```

## 9.7 Key Takeaways

1. **Sorting algorithms** vary in performance characteristics and use cases
2. **Comparison-based sorts** have O(n log n) lower bound in worst case
3. **Non-comparison sorts** can achieve O(n) time complexity under specific conditions
4. **Stability** and **in-place** properties are important considerations
5. **Real-world performance** depends on data characteristics and implementation details
6. **Hybrid algorithms** combine benefits of multiple sorting techniques

## 9.8 Exercises

1. Implement a stable version of Quick Sort.
2. Write a function to sort an array of strings using Radix Sort.
3. Create a hybrid sorting algorithm that uses Insertion Sort for small arrays and Merge Sort for larger ones.
4. Implement a function to find the kth smallest element using Quick Select.
5. Write a program to sort an array of custom objects with multiple fields.

## 9.9 Summary

Sorting algorithms are fundamental tools in computer science, each with unique characteristics and optimal use cases. Understanding the trade-offs between different sorting algorithms helps in choosing the right one for specific applications. From simple O(n²) algorithms like Bubble Sort to sophisticated O(n log n) algorithms like Merge Sort and Quick Sort, each has its place in the programmer's toolkit. Non-comparison sorting algorithms like Counting Sort and Radix Sort can achieve linear time complexity under specific conditions, making them valuable for specialized use cases.

In the next chapter, we'll explore searching algorithms, which often work in conjunction with sorting to provide efficient data retrieval mechanisms.
