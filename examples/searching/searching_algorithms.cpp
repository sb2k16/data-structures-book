#include <iostream>
#include <vector>
#include <algorithm>
#include <limits>
#include <unordered_map>
#include <unordered_set>
using namespace std;

// ============================================================================
// Linear Search
// ============================================================================

int linearSearch(const vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1;
}

// ============================================================================
// Binary Search
// ============================================================================

int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
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

int binarySearchFirst(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

int binarySearchLast(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;
            left = mid + 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// ============================================================================
// Exponential Search
// ============================================================================

int binarySearchRecursive(const vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

int exponentialSearch(const vector<int>& arr, int target) {
    int n = arr.size();
    
    if (arr[0] == target) return 0;
    
    int i = 1;
    while (i < n && arr[i] <= target) {
        i *= 2;
    }
    
    int left = i / 2;
    int right = min(i, n - 1);
    
    return binarySearchRecursive(arr, target, left, right);
}

// ============================================================================
// Interpolation Search
// ============================================================================

int interpolationSearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left == right) {
            if (arr[left] == target) return left;
            return -1;
        }
        
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

// ============================================================================
// Demonstration
// ============================================================================

void demonstrateSearching() {
    cout << "\n=== Searching Algorithms ===" << endl;
    
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 45, 67, 78, 90};
    int target = 23;
    
    cout << "Array: ";
    for (int val : arr) {
        cout << val << " ";
    }
    cout << "\nTarget: " << target << endl;
    
    cout << "\nLinear Search: " << linearSearch(arr, target) << endl;
    cout << "Binary Search: " << binarySearch(arr, target) << endl;
    cout << "Exponential Search: " << exponentialSearch(arr, target) << endl;
    cout << "Interpolation Search: " << interpolationSearch(arr, target) << endl;
    
    vector<int> arrWithDups = {1, 2, 2, 2, 3, 4, 4, 5};
    cout << "\nArray with duplicates: ";
    for (int val : arrWithDups) {
        cout << val << " ";
    }
    cout << "\nFirst occurrence of 2: " << binarySearchFirst(arrWithDups, 2) << endl;
    cout << "Last occurrence of 2: " << binarySearchLast(arrWithDups, 2) << endl;
}

int main() {
    demonstrateSearching();
    return 0;
}

