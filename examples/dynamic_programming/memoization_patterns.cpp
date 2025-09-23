/**
 * Advanced Memoization Patterns and Techniques
 * 
 * This file demonstrates various memoization patterns and techniques
 * for solving complex dynamic programming problems efficiently.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o memoization_patterns memoization_patterns.cpp
 * Run with: ./memoization_patterns
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <chrono>
#include <iomanip>
#include <functional>
#include <thread>
using namespace std;

// State compression for efficient memoization
class StateCompressor {
private:
    unordered_map<long long, int> cache;
    
public:
    long long compressState(const vector<int>& state) {
        long long compressed = 0;
        for (size_t i = 0; i < state.size(); i++) {
            compressed = compressed * 1000 + state[i];
        }
        return compressed;
    }
    
    int getMemoized(long long state) {
        return cache.find(state) != cache.end() ? cache[state] : -1;
    }
    
    void setMemoized(long long state, int value) {
        cache[state] = value;
    }
    
    void clearCache() {
        cache.clear();
    }
    
    size_t getCacheSize() const {
        return cache.size();
    }
};

// Multi-dimensional memoization
class MultiDimMemoization {
private:
    unordered_map<string, int> memo;
    
    string createKey(const vector<int>& dimensions) {
        string key = "";
        for (int dim : dimensions) {
            key += to_string(dim) + ",";
        }
        return key;
    }
    
public:
    int knapsack3D(vector<int>& weights, vector<int>& values, 
                   vector<int>& volumes, int maxWeight, int maxVolume) {
        return knapsack3DMemo(0, maxWeight, maxVolume, weights, values, volumes);
    }
    
private:
    int knapsack3DMemo(int index, int remainingWeight, int remainingVolume,
                      const vector<int>& weights, const vector<int>& values,
                      const vector<int>& volumes) {
        if (index >= static_cast<int>(weights.size()) || remainingWeight < 0 || remainingVolume < 0) {
            return 0;
        }
        
        vector<int> state = {index, remainingWeight, remainingVolume};
        string key = createKey(state);
        
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        // Don't take current item
        int notTake = knapsack3DMemo(index + 1, remainingWeight, remainingVolume,
                                   weights, values, volumes);
        
        // Take current item
        int take = 0;
        if (weights[index] <= remainingWeight && volumes[index] <= remainingVolume) {
            take = values[index] + knapsack3DMemo(index + 1, 
                                                remainingWeight - weights[index],
                                                remainingVolume - volumes[index],
                                                weights, values, volumes);
        }
        
        int result = max(notTake, take);
        memo[key] = result;
        return result;
    }
    
public:
    void printMemoizationStats() {
        cout << "Memoization cache size: " << memo.size() << " entries" << endl;
    }
};

// Custom hash function for complex states
class CustomHashMemoization {
private:
    struct State {
        int x, y, z;
        
        bool operator==(const State& other) const {
            return x == other.x && y == other.y && z == other.z;
        }
    };
    
    struct StateHash {
        size_t operator()(const State& s) const {
            return hash<int>{}(s.x) ^ (hash<int>{}(s.y) << 1) ^ (hash<int>{}(s.z) << 2);
        }
    };
    
    unordered_map<State, int, StateHash> memo;
    
public:
    int complexDP(int x, int y, int z) {
        State state = {x, y, z};
        
        if (memo.find(state) != memo.end()) {
            return memo[state];
        }
        
        if (x <= 0 || y <= 0 || z <= 0) {
            return 0;
        }
        
        int result = complexDP(x - 1, y, z) + 
                    complexDP(x, y - 1, z) + 
                    complexDP(x, y, z - 1);
        
        memo[state] = result;
        return result;
    }
    
    void printStats() {
        cout << "Custom hash memoization cache size: " << memo.size() << " entries" << endl;
    }
};

// Memory-optimized memoization with size limits
class MemoryOptimizedMemoization {
private:
    unordered_map<long long, int> memo;
    size_t maxCacheSize;
    
    long long compressState(const vector<int>& state) {
        long long compressed = 0;
        for (size_t i = 0; i < state.size(); i++) {
            compressed |= ((long long)state[i]) << (i * 8);
        }
        return compressed;
    }
    
public:
    MemoryOptimizedMemoization(size_t maxSize = 1000000) : maxCacheSize(maxSize) {}
    
    int optimizedDP(const vector<int>& state) {
        long long key = compressState(state);
        
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        // Compute result
        int result = computeResult(state);
        memo[key] = result;
        
        // Memory management: limit cache size
        if (memo.size() > maxCacheSize) {
            memo.clear(); // Clear cache if it gets too large
        }
        
        return result;
    }
    
private:
    int computeResult(const vector<int>& state) {
        // Implementation depends on specific problem
        int sum = 0;
        for (int val : state) {
            sum += val;
        }
        return sum;
    }
    
public:
    void printStats() {
        cout << "Memory-optimized cache size: " << memo.size() << " entries" << endl;
        cout << "Max cache size: " << maxCacheSize << " entries" << endl;
    }
};

// Template-based memoization for different function types
template<typename ReturnType, typename... Args>
class TemplateMemoizer {
private:
    unordered_map<string, ReturnType> cache;
    
    string createKey(Args... args) {
        string key = "";
        ((key += to_string(args) + ","), ...);
        return key;
    }
    
public:
    template<typename Func>
    ReturnType memoize(Func func, Args... args) {
        string key = createKey(args...);
        
        if (cache.find(key) != cache.end()) {
            return cache[key];
        }
        
        ReturnType result = func(args...);
        cache[key] = result;
        return result;
    }
    
    void clearCache() {
        cache.clear();
    }
    
    size_t getCacheSize() const {
        return cache.size();
    }
};

// Performance analyzer for memoization
class MemoizationAnalyzer {
private:
    unordered_map<string, int> callCount;
    unordered_map<string, int> memoHits;
    unordered_map<string, chrono::microseconds> totalTime;
    
public:
    void recordCall(const string& functionName) {
        callCount[functionName]++;
    }
    
    void recordMemoHit(const string& functionName) {
        memoHits[functionName]++;
    }
    
    void recordTime(const string& functionName, chrono::microseconds time) {
        totalTime[functionName] += time;
    }
    
    void printAnalysis(const string& functionName) {
        cout << "=== Memoization Analysis for " << functionName << " ===" << endl;
        cout << "Total calls: " << callCount[functionName] << endl;
        cout << "Memo hits: " << memoHits[functionName] << endl;
        cout << "Hit rate: " << fixed << setprecision(2) 
             << (double)memoHits[functionName] / callCount[functionName] * 100 << "%" << endl;
        cout << "Total time: " << totalTime[functionName].count() << " microseconds" << endl;
        cout << "Average time per call: " 
             << totalTime[functionName].count() / callCount[functionName] << " microseconds" << endl;
        cout << endl;
    }
    
    void printOverallStats() {
        cout << "=== Overall Memoization Statistics ===" << endl;
        int totalCalls = 0;
        int totalHits = 0;
        for (const auto& pair : callCount) {
            totalCalls += pair.second;
            totalHits += memoHits[pair.first];
        }
        cout << "Total function calls: " << totalCalls << endl;
        cout << "Total memo hits: " << totalHits << endl;
        cout << "Overall hit rate: " << fixed << setprecision(2) 
             << (double)totalHits / totalCalls * 100 << "%" << endl;
        cout << endl;
    }
};

// Demo class
class MemoizationPatternsDemo {
private:
    MemoizationAnalyzer analyzer;
    
public:
    void demonstrateStateCompression() {
        cout << "=== State Compression Memoization ===" << endl;
        
        StateCompressor compressor;
        vector<int> state = {1, 2, 3, 4, 5};
        
        auto start = chrono::high_resolution_clock::now();
        
        for (int i = 0; i < 1000; i++) {
            long long compressed = compressor.compressState(state);
            int value = compressor.getMemoized(compressed);
            if (value == -1) {
                compressor.setMemoized(compressed, i * 10);
            }
        }
        
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
        
        cout << "State compression completed in " << duration.count() << " microseconds" << endl;
        cout << "Cache size: " << compressor.getCacheSize() << " entries" << endl;
        cout << endl;
    }
    
    void demonstrateMultiDimMemoization() {
        cout << "=== Multi-Dimensional Memoization ===" << endl;
        
        vector<int> weights = {10, 20, 30};
        vector<int> values = {60, 100, 120};
        vector<int> volumes = {5, 10, 15};
        int maxWeight = 50;
        int maxVolume = 25;
        
        MultiDimMemoization memo;
        
        auto start = chrono::high_resolution_clock::now();
        int result = memo.knapsack3D(weights, values, volumes, maxWeight, maxVolume);
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
        
        cout << "3D Knapsack result: " << result << endl;
        cout << "Computed in " << duration.count() << " microseconds" << endl;
        memo.printMemoizationStats();
        cout << endl;
    }
    
    void demonstrateCustomHash() {
        cout << "=== Custom Hash Function Memoization ===" << endl;
        
        CustomHashMemoization memo;
        
        auto start = chrono::high_resolution_clock::now();
        int result = memo.complexDP(10, 10, 10);
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
        
        cout << "Complex DP result: " << result << endl;
        cout << "Computed in " << duration.count() << " microseconds" << endl;
        memo.printStats();
        cout << endl;
    }
    
    void demonstrateMemoryOptimization() {
        cout << "=== Memory-Optimized Memoization ===" << endl;
        
        MemoryOptimizedMemoization memo(1000); // Max 1000 entries
        
        auto start = chrono::high_resolution_clock::now();
        
        for (int i = 0; i < 2000; i++) {
            vector<int> state = {i, i + 1, i + 2};
            memo.optimizedDP(state);
        }
        
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
        
        cout << "Memory-optimized DP completed in " << duration.count() << " microseconds" << endl;
        memo.printStats();
        cout << endl;
    }
    
    void demonstrateTemplateMemoization() {
        cout << "=== Template-Based Memoization ===" << endl;
        
        TemplateMemoizer<int, int> memoizer;
        
        // Define a function to memoize
        function<int(int)> fibonacci = [&](int n) -> int {
            if (n <= 1) return n;
            return fibonacci(n - 1) + fibonacci(n - 2);
        };
        
        auto start = chrono::high_resolution_clock::now();
        
        for (int i = 0; i < 20; i++) {
            int result = memoizer.memoize(fibonacci, i);
            cout << "Fibonacci(" << i << ") = " << result << endl;
        }
        
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
        
        cout << "Template memoization completed in " << duration.count() << " microseconds" << endl;
        cout << "Cache size: " << memoizer.getCacheSize() << " entries" << endl;
        cout << endl;
    }
    
    void demonstratePerformanceAnalysis() {
        cout << "=== Performance Analysis ===" << endl;
        
        // Simulate some function calls with memoization
        string functionName = "testFunction";
        
        for (int i = 0; i < 100; i++) {
            analyzer.recordCall(functionName);
            
            if (i % 3 == 0) {
                analyzer.recordMemoHit(functionName);
            }
            
            auto start = chrono::high_resolution_clock::now();
            // Simulate some work
            this_thread::sleep_for(chrono::microseconds(1));
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            analyzer.recordTime(functionName, duration);
        }
        
        analyzer.printAnalysis(functionName);
        analyzer.printOverallStats();
    }
    
    void runAllDemos() {
        cout << "Advanced Memoization Patterns and Techniques" << endl;
        cout << "=============================================" << endl;
        cout << endl;
        
        demonstrateStateCompression();
        demonstrateMultiDimMemoization();
        demonstrateCustomHash();
        demonstrateMemoryOptimization();
        demonstrateTemplateMemoization();
        demonstratePerformanceAnalysis();
        
        cout << "=== Demo Complete ===" << endl;
        cout << "\nKey Insights:" << endl;
        cout << "1. State compression reduces memory usage for complex states" << endl;
        cout << "2. Multi-dimensional memoization handles complex parameter spaces" << endl;
        cout << "3. Custom hash functions optimize performance for specific data types" << endl;
        cout << "4. Memory optimization prevents cache overflow in long-running programs" << endl;
        cout << "5. Template-based memoization provides reusable solutions" << endl;
        cout << "6. Performance analysis helps optimize memoization strategies" << endl;
    }
};

int main() {
    MemoizationPatternsDemo demo;
    demo.runAllDemos();
    return 0;
}
