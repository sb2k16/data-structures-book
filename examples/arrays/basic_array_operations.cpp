/**
 * Basic Array Operations Example
 * 
 * This example demonstrates fundamental array operations including:
 * - Declaration and initialization
 * - Accessing elements
 * - Basic algorithms (search, find max/min)
 * - Time complexity analysis
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -o basic_array_operations basic_array_operations.cpp
 * Run with: ./basic_array_operations
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
using namespace std;

// Function to display array contents
void displayArray(const vector<int>& arr, const string& message = "") {
    if (!message.empty()) {
        cout << message << ": ";
    }
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

// Linear search - O(n) time complexity
int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// Find maximum element - O(n) time complexity
int findMax(const vector<int>& arr) {
    if (arr.empty()) {
        throw invalid_argument("Array is empty");
    }
    
    int maxVal = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

// Find minimum element - O(n) time complexity
int findMin(const vector<int>& arr) {
    if (arr.empty()) {
        throw invalid_argument("Array is empty");
    }
    
    int minVal = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] < minVal) {
            minVal = arr[i];
        }
    }
    return minVal;
}

// Reverse array in-place - O(n) time complexity
void reverseArray(vector<int>& arr) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}

// Calculate sum of array elements - O(n) time complexity
int arraySum(const vector<int>& arr) {
    int sum = 0;
    for (int num : arr) {
        sum += num;
    }
    return sum;
}

// Count occurrences of target - O(n) time complexity
int countOccurrences(const vector<int>& arr, int target) {
    int count = 0;
    for (int num : arr) {
        if (num == target) {
            count++;
        }
    }
    return count;
}

int main() {
    cout << "=== Basic Array Operations Demo ===" << endl << endl;
    
    // Initialize array with sample data
    vector<int> numbers = {5, 2, 8, 1, 9, 3, 7, 4, 6, 2};
    displayArray(numbers, "Original array");
    
    // Demonstrate basic operations
    cout << "\n--- Basic Operations ---" << endl;
    
    // Access elements
    cout << "Element at index 0: " << numbers[0] << endl;
    cout << "Element at index 5: " << numbers[5] << endl;
    cout << "Array size: " << numbers.size() << endl;
    
    // Find max and min
    cout << "\nMaximum element: " << findMax(numbers) << endl;
    cout << "Minimum element: " << findMin(numbers) << endl;
    
    // Calculate sum
    cout << "Sum of all elements: " << arraySum(numbers) << endl;
    
    // Search operations
    cout << "\n--- Search Operations ---" << endl;
    int target = 8;
    int index = linearSearch(numbers, target);
    if (index != -1) {
        cout << "Found " << target << " at index " << index << endl;
    } else {
        cout << target << " not found in array" << endl;
    }
    
    // Count occurrences
    int count = countOccurrences(numbers, 2);
    cout << "Number 2 appears " << count << " times" << endl;
    
    // Reverse array
    cout << "\n--- Array Manipulation ---" << endl;
    displayArray(numbers, "Before reverse");
    reverseArray(numbers);
    displayArray(numbers, "After reverse");
    
    // Using STL algorithms
    cout << "\n--- STL Algorithm Examples ---" << endl;
    vector<int> copy = numbers;
    
    // Sort array
    sort(copy.begin(), copy.end());
    displayArray(copy, "Sorted array");
    
    // Binary search (requires sorted array)
    bool found = binary_search(copy.begin(), copy.end(), 5);
    cout << "Binary search for 5: " << (found ? "Found" : "Not found") << endl;
    
    // Find maximum using STL
    auto maxIt = max_element(copy.begin(), copy.end());
    cout << "Maximum using STL: " << *maxIt << endl;
    
    // Performance comparison
    cout << "\n--- Performance Analysis ---" << endl;
    vector<int> largeArray(1000000);
    for (int i = 0; i < largeArray.size(); i++) {
        largeArray[i] = rand() % 1000;
    }
    
    // Time linear search
    auto start = chrono::high_resolution_clock::now();
    int result = linearSearch(largeArray, 500);
    auto end = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
    cout << "Linear search time: " << duration.count() << " microseconds" << endl;
    
    // Time STL find
    start = chrono::high_resolution_clock::now();
    auto it = find(largeArray.begin(), largeArray.end(), 500);
    end = chrono::high_resolution_clock::now();
    duration = chrono::duration_cast<chrono::microseconds>(end - start);
    cout << "STL find time: " << duration.count() << " microseconds" << endl;
    
    cout << "\n=== Demo Complete ===" << endl;
    
    return 0;
}
