/**
 * Fibonacci Performance Comparison
 * 
 * This file demonstrates and compares different approaches to computing Fibonacci numbers:
 * 1. Naive Recursive (O(2^n))
 * 2. Memoization (Top-Down, O(n))
 * 3. Tabulation (Bottom-Up, O(n))
 * 4. Space-Optimized (O(n) time, O(1) space)
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o fibonacci_comparison fibonacci_performance_comparison.cpp
 * Run with: ./fibonacci_comparison
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <chrono>
using namespace std;

// ============================================================================
// Naive Recursive Approach - O(2^n) time complexity
// ============================================================================

long long fibonacciNaive(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// ============================================================================
// Memoization Approach (Top-Down) - O(n) time complexity
// ============================================================================

long long fibonacciMemo(int n, unordered_map<int, long long>& memo) {
    if (n <= 1) {
        return n;
    }
    
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

long long fibonacciMemo(int n) {
    unordered_map<int, long long> memo;
    return fibonacciMemo(n, memo);
}

// Alternative with vector
long long fibonacciMemoVector(int n, vector<long long>& memo) {
    if (n <= 1) {
        return n;
    }
    
    if (memo[n] != -1) {
        return memo[n];
    }
    
    memo[n] = fibonacciMemoVector(n - 1, memo) + fibonacciMemoVector(n - 2, memo);
    return memo[n];
}

long long fibonacciMemoVector(int n) {
    vector<long long> memo(n + 1, -1);
    return fibonacciMemoVector(n, memo);
}

// ============================================================================
// Tabulation Approach (Bottom-Up) - O(n) time, O(n) space
// ============================================================================

long long fibonacciTab(int n) {
    if (n <= 1) {
        return n;
    }
    
    vector<long long> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// ============================================================================
// Space-Optimized Fibonacci - O(n) time, O(1) space
// ============================================================================

long long fibonacciOptimized(int n) {
    if (n <= 1) {
        return n;
    }
    
    long long prev2 = 0;  // F(n-2)
    long long prev1 = 1;  // F(n-1)
    long long current;    // F(n)
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}

// ============================================================================
// Performance Comparison
// ============================================================================

void compareFibonacciApproaches() {
    cout << "\n=== Fibonacci Performance Comparison ===\n" << endl;
    
    // Test with different values
    vector<int> testValues = {10, 20, 30, 40};
    
    for (int n : testValues) {
        cout << "Computing Fibonacci(" << n << "):" << endl;
        cout << "----------------------------------------" << endl;
        
        // Memoization
        auto start = chrono::high_resolution_clock::now();
        long long result1 = fibonacciMemo(n);
        auto end = chrono::high_resolution_clock::now();
        auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
        
        // Tabulation
        start = chrono::high_resolution_clock::now();
        long long result2 = fibonacciTab(n);
        end = chrono::high_resolution_clock::now();
        auto duration2 = chrono::duration_cast<chrono::microseconds>(end - start);
        
        // Space-optimized
        start = chrono::high_resolution_clock::now();
        long long result3 = fibonacciOptimized(n);
        end = chrono::high_resolution_clock::now();
        auto duration3 = chrono::duration_cast<chrono::microseconds>(end - start);
        
        // Naive (only for small values to avoid long wait)
        long long result4 = 0;
        long long duration4 = 0;
        if (n <= 30) {
            start = chrono::high_resolution_clock::now();
            result4 = fibonacciNaive(n);
            end = chrono::high_resolution_clock::now();
            duration4 = chrono::duration_cast<chrono::microseconds>(end - start).count();
        }
        
        cout << "Memoization:      " << result1 << " (" << duration1.count() << " μs)" << endl;
        cout << "Tabulation:       " << result2 << " (" << duration2.count() << " μs)" << endl;
        cout << "Space-optimized:  " << result3 << " (" << duration3.count() << " μs)" << endl;
        if (n <= 30) {
            cout << "Naive Recursive:  " << result4 << " (" << duration4 << " μs)" << endl;
        } else {
            cout << "Naive Recursive:  (skipped - too slow)" << endl;
        }
        cout << endl;
    }
    
    cout << "\n=== Key Observations ===" << endl;
    cout << "1. Naive recursive approach is exponentially slow (O(2^n))" << endl;
    cout << "2. Memoization and Tabulation both achieve O(n) time complexity" << endl;
    cout << "3. Space-optimized version uses O(1) space instead of O(n)" << endl;
    cout << "4. For large values, naive approach becomes impractical" << endl;
}

// ============================================================================
// Main Function
// ============================================================================

int main() {
    compareFibonacciApproaches();
    return 0;
}






