/**
 * Sparse Table and Sqrt Decomposition Examples
 * 
 * This file demonstrates:
 * - Sparse Table for O(1) range queries on static arrays
 * - Sqrt Decomposition for range queries and updates
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o sparse_sqrt sparse_table_sqrt_decomp.cpp
 * Run with: ./sparse_sqrt
 */

#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <climits>
#include <functional>
using namespace std;

// ============================================================================
// Sparse Table
// ============================================================================

class SparseTable {
private:
    vector<vector<int>> table;
    vector<int> logTable;
    int n;
    function<int(int, int)> op;
    
    void buildTable(const vector<int>& arr) {
        int maxLog = log2(n) + 1;
        table.resize(n, vector<int>(maxLog));
        logTable.resize(n + 1);
        
        logTable[1] = 0;
        for (int i = 2; i <= n; i++) {
            logTable[i] = logTable[i / 2] + 1;
        }
        
        for (int i = 0; i < n; i++) {
            table[i][0] = arr[i];
        }
        
        for (int j = 1; j < maxLog; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                table[i][j] = op(table[i][j - 1], 
                                 table[i + (1 << (j - 1))][j - 1]);
            }
        }
    }
    
public:
    SparseTable(const vector<int>& arr, function<int(int, int)> operation) 
        : n(arr.size()), op(operation) {
        buildTable(arr);
    }
    
    int query(int l, int r) {
        int j = logTable[r - l + 1];
        return op(table[l][j], table[r - (1 << j) + 1][j]);
    }
};

class RMQSparseTable {
private:
    SparseTable st;
    
public:
    RMQSparseTable(const vector<int>& arr) 
        : st(arr, [](int a, int b) { return min(a, b); }) {}
    
    int query(int l, int r) {
        return st.query(l, r);
    }
};

class MaxSparseTable {
private:
    SparseTable st;
    
public:
    MaxSparseTable(const vector<int>& arr) 
        : st(arr, [](int a, int b) { return max(a, b); }) {}
    
    int query(int l, int r) {
        return st.query(l, r);
    }
};

// ============================================================================
// Sqrt Decomposition
// ============================================================================

class SqrtDecomposition {
private:
    vector<int> arr;
    vector<int> blocks;
    int blockSize;
    int n;
    
    int getBlockIndex(int index) {
        return index / blockSize;
    }
    
    int getBlockStart(int blockIndex) {
        return blockIndex * blockSize;
    }
    
    int getBlockEnd(int blockIndex) {
        return min((blockIndex + 1) * blockSize - 1, n - 1);
    }
    
public:
    SqrtDecomposition(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        int numBlocks = (n + blockSize - 1) / blockSize;
        blocks.resize(numBlocks, INT_MAX);
        
        for (int i = 0; i < n; i++) {
            int blockIdx = getBlockIndex(i);
            blocks[blockIdx] = min(blocks[blockIdx], arr[i]);
        }
    }
    
    int rangeMin(int l, int r) {
        int minVal = INT_MAX;
        int leftBlock = getBlockIndex(l);
        int rightBlock = getBlockIndex(r);
        
        if (leftBlock == rightBlock) {
            for (int i = l; i <= r; i++) {
                minVal = min(minVal, arr[i]);
            }
        } else {
            for (int i = l; i <= getBlockEnd(leftBlock); i++) {
                minVal = min(minVal, arr[i]);
            }
            
            for (int i = leftBlock + 1; i < rightBlock; i++) {
                minVal = min(minVal, blocks[i]);
            }
            
            for (int i = getBlockStart(rightBlock); i <= r; i++) {
                minVal = min(minVal, arr[i]);
            }
        }
        
        return minVal;
    }
    
    void update(int index, int value) {
        arr[index] = value;
        int blockIdx = getBlockIndex(index);
        
        blocks[blockIdx] = INT_MAX;
        int start = getBlockStart(blockIdx);
        int end = getBlockEnd(blockIdx);
        
        for (int i = start; i <= end; i++) {
            blocks[blockIdx] = min(blocks[blockIdx], arr[i]);
        }
    }
};

class SqrtDecompositionSum {
private:
    vector<int> arr;
    vector<long long> blockSums;
    int blockSize;
    int n;
    
    int getBlockIndex(int index) {
        return index / blockSize;
    }
    
    int getBlockStart(int blockIndex) {
        return blockIndex * blockSize;
    }
    
    int getBlockEnd(int blockIndex) {
        return min((blockIndex + 1) * blockSize - 1, n - 1);
    }
    
public:
    SqrtDecompositionSum(const vector<int>& input) : arr(input), n(input.size()) {
        blockSize = sqrt(n);
        int numBlocks = (n + blockSize - 1) / blockSize;
        blockSums.resize(numBlocks, 0);
        
        for (int i = 0; i < n; i++) {
            blockSums[getBlockIndex(i)] += arr[i];
        }
    }
    
    long long rangeSum(int l, int r) {
        long long sum = 0;
        int leftBlock = getBlockIndex(l);
        int rightBlock = getBlockIndex(r);
        
        if (leftBlock == rightBlock) {
            for (int i = l; i <= r; i++) {
                sum += arr[i];
            }
        } else {
            for (int i = l; i <= getBlockEnd(leftBlock); i++) {
                sum += arr[i];
            }
            
            for (int i = leftBlock + 1; i < rightBlock; i++) {
                sum += blockSums[i];
            }
            
            for (int i = getBlockStart(rightBlock); i <= r; i++) {
                sum += arr[i];
            }
        }
        
        return sum;
    }
    
    void update(int index, int value) {
        int blockIdx = getBlockIndex(index);
        blockSums[blockIdx] += (value - arr[index]);
        arr[index] = value;
    }
};

// ============================================================================
// Demonstration Functions
// ============================================================================

void demonstrateSparseTable() {
    cout << "\n=== Sparse Table (Range Minimum Query) ===" << endl;
    
    vector<int> arr = {1, 3, 4, 2, 5, 6, 7, 8, 9, 0};
    RMQSparseTable st(arr);
    
    cout << "Array: ";
    for (int val : arr) cout << val << " ";
    cout << endl;
    
    cout << "RMQ(0, 3): " << st.query(0, 3) << endl;
    cout << "RMQ(2, 5): " << st.query(2, 5) << endl;
    cout << "RMQ(4, 9): " << st.query(4, 9) << endl;
    
    MaxSparseTable maxSt(arr);
    cout << "\nRange Maximum Query:" << endl;
    cout << "Max(0, 3): " << maxSt.query(0, 3) << endl;
    cout << "Max(2, 5): " << maxSt.query(2, 5) << endl;
}

void demonstrateSqrtDecomposition() {
    cout << "\n=== Sqrt Decomposition (Range Minimum) ===" << endl;
    
    vector<int> arr = {1, 3, 4, 2, 5, 6, 7, 8, 9, 0};
    SqrtDecomposition sd(arr);
    
    cout << "Array: ";
    for (int val : arr) cout << val << " ";
    cout << endl;
    
    cout << "RangeMin(0, 3): " << sd.rangeMin(0, 3) << endl;
    cout << "RangeMin(2, 5): " << sd.rangeMin(2, 5) << endl;
    cout << "RangeMin(4, 9): " << sd.rangeMin(4, 9) << endl;
    
    cout << "\nUpdating index 9 to 10..." << endl;
    sd.update(9, 10);
    cout << "RangeMin(4, 9): " << sd.rangeMin(4, 9) << endl;
}

void demonstrateSqrtDecompositionSum() {
    cout << "\n=== Sqrt Decomposition (Range Sum) ===" << endl;
    
    vector<int> arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    SqrtDecompositionSum sd(arr);
    
    cout << "Array: ";
    for (int val : arr) cout << val << " ";
    cout << endl;
    
    cout << "RangeSum(0, 4): " << sd.rangeSum(0, 4) << endl;
    cout << "RangeSum(2, 7): " << sd.rangeSum(2, 7) << endl;
    cout << "RangeSum(0, 9): " << sd.rangeSum(0, 9) << endl;
    
    cout << "\nUpdating index 0 to 10..." << endl;
    sd.update(0, 10);
    cout << "RangeSum(0, 4): " << sd.rangeSum(0, 4) << endl;
}

int main() {
    cout << "Sparse Table and Sqrt Decomposition Examples\n" << endl;
    
    demonstrateSparseTable();
    demonstrateSqrtDecomposition();
    demonstrateSqrtDecompositionSum();
    
    return 0;
}






