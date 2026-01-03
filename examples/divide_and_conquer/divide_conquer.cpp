#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

// ============================================================================
// Merge Sort
// ============================================================================

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> leftArr(n1), rightArr(n2);
    
    for (int i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (int j = 0; j < n2; j++) rightArr[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    while (i < n1) arr[k++] = leftArr[i++];
    while (j < n2) arr[k++] = rightArr[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

// ============================================================================
// Quick Sort
// ============================================================================

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            swap(arr[++i], arr[j]);
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

// ============================================================================
// Power Calculation
// ============================================================================

double power(double x, int n) {
    if (n == 0) return 1.0;
    if (n < 0) {
        x = 1.0 / x;
        n = -n;
    }
    double half = power(x, n / 2);
    return (n % 2 == 0) ? half * half : half * half * x;
}

// ============================================================================
// Demonstration
// ============================================================================

void demonstrateMergeSort() {
    cout << "\n=== Merge Sort ===" << endl;
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    cout << "Before: ";
    for (int val : arr) cout << val << " ";
    mergeSort(arr, 0, arr.size() - 1);
    cout << "\nAfter: ";
    for (int val : arr) cout << val << " ";
    cout << endl;
}

void demonstrateQuickSort() {
    cout << "\n=== Quick Sort ===" << endl;
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    cout << "Before: ";
    for (int val : arr) cout << val << " ";
    quickSort(arr, 0, arr.size() - 1);
    cout << "\nAfter: ";
    for (int val : arr) cout << val << " ";
    cout << endl;
}

void demonstratePower() {
    cout << "\n=== Power Calculation ===" << endl;
    cout << "2^10 = " << power(2, 10) << endl;
    cout << "2^-3 = " << power(2, -3) << endl;
}

int main() {
    demonstrateMergeSort();
    demonstrateQuickSort();
    demonstratePower();
    return 0;
}

