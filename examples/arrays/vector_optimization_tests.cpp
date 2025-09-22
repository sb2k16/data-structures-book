/**
 * Vector Optimization Tests and Benchmarks
 * 
 * This file contains comprehensive performance tests for vector optimization techniques.
 * It complements the core implementations in Chapter 3 with detailed benchmarking.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o vector_optimization_tests vector_optimization_tests.cpp
 * Run with: ./vector_optimization_tests
 */

#include <iostream>
#include <vector>
#include <chrono>
#include <iomanip>
#include <string>
#include <utility>
using namespace std;

class VectorOptimizationTests {
public:
    // Test 1: Reserve vs No Reserve Performance
    static void testReservePerformance() {
        cout << "=== Reserve Performance Test ===" << endl;
        
        const int numElements = 1000000;
        
        // Test without reserve
        {
            vector<int> vec;
            auto start = chrono::high_resolution_clock::now();
            
            for (int i = 0; i < numElements; i++) {
                vec.push_back(i);
            }
            
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "Without reserve:" << endl;
            cout << "  Time: " << duration.count() << " microseconds" << endl;
            cout << "  Final capacity: " << vec.capacity() << endl;
            cout << "  Memory efficiency: " << fixed << setprecision(2) 
                 << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
        }
        
        // Test with reserve
        {
            vector<int> vec;
            vec.reserve(numElements);
            
            auto start = chrono::high_resolution_clock::now();
            
            for (int i = 0; i < numElements; i++) {
                vec.push_back(i);
            }
            
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "\nWith reserve:" << endl;
            cout << "  Time: " << duration.count() << " microseconds" << endl;
            cout << "  Final capacity: " << vec.capacity() << endl;
            cout << "  Memory efficiency: " << fixed << setprecision(2) 
                 << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
        }
    }
    
    // Test 2: Emplace vs Push Back
    static void testEmplaceVsPushBack() {
        cout << "\n=== Emplace vs Push Back Test ===" << endl;
        
        // Test with simple types
        {
            const int numElements = 100000;
            vector<int> vec1, vec2;
            
            // Push back test
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numElements; i++) {
                vec1.push_back(i);
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            // Emplace back test
            start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numElements; i++) {
                vec2.emplace_back(i);
            }
            end = chrono::high_resolution_clock::now();
            auto duration2 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "Simple types (int):" << endl;
            cout << "  push_back: " << duration1.count() << " microseconds" << endl;
            cout << "  emplace_back: " << duration2.count() << " microseconds" << endl;
            cout << "  Difference: " << abs((int)duration1.count() - (int)duration2.count()) << " microseconds" << endl;
        }
        
        // Test with complex types
        {
            const int numElements = 10000;
            vector<string> vec1, vec2;
            
            // Push back test
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numElements; i++) {
                vec1.push_back("String " + to_string(i));
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            // Emplace back test
            start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numElements; i++) {
                vec2.emplace_back("String " + to_string(i));
            }
            end = chrono::high_resolution_clock::now();
            auto duration2 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "\nComplex types (string):" << endl;
            cout << "  push_back: " << duration1.count() << " microseconds" << endl;
            cout << "  emplace_back: " << duration2.count() << " microseconds" << endl;
            cout << "  Difference: " << abs((int)duration1.count() - (int)duration2.count()) << " microseconds" << endl;
        }
    }
    
    // Test 3: Shrink to Fit Analysis
    static void testShrinkToFit() {
        cout << "\n=== Shrink to Fit Analysis ===" << endl;
        
        vector<int> vec;
        
        // Add many elements
        for (int i = 0; i < 10000; i++) {
            vec.push_back(i);
        }
        
        cout << "After adding 10000 elements:" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        cout << "  Memory efficiency: " << fixed << setprecision(2) 
             << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
        
        // Remove most elements
        vec.erase(vec.begin() + 100, vec.end());
        
        cout << "\nAfter removing 9900 elements:" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        cout << "  Memory efficiency: " << fixed << setprecision(2) 
             << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
        
        // Shrink to fit
        vec.shrink_to_fit();
        
        cout << "\nAfter shrink_to_fit():" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        cout << "  Memory efficiency: " << fixed << setprecision(2) 
             << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
    }
    
    // Test 4: Move Semantics Performance
    static void testMoveSemantics() {
        cout << "\n=== Move Semantics Performance Test ===" << endl;
        
        const int numStrings = 10000;
        
        // Test with copy
        {
            vector<string> vec;
            vec.reserve(numStrings);
            
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numStrings; i++) {
                string str = "Large string " + to_string(i) + " with lots of content";
                vec.push_back(str);  // Copy
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "Copy semantics: " << duration.count() << " microseconds" << endl;
        }
        
        // Test with move
        {
            vector<string> vec;
            vec.reserve(numStrings);
            
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < numStrings; i++) {
                string str = "Large string " + to_string(i) + " with lots of content";
                vec.push_back(move(str));  // Move
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "Move semantics: " << duration.count() << " microseconds" << endl;
        }
    }
    
    // Test 5: Growth Pattern Analysis
    static void testGrowthPattern() {
        cout << "\n=== Growth Pattern Analysis ===" << endl;
        
        vector<int> vec;
        vector<size_t> reallocationPoints;
        
        cout << "Elements\tSize\tCapacity\tGrowth Factor" << endl;
        cout << "--------\t----\t--------\t-------------" << endl;
        
        for (int i = 0; i < 100; i++) {
            size_t oldCapacity = vec.capacity();
            vec.push_back(i);
            size_t newCapacity = vec.capacity();
            
            if (newCapacity != oldCapacity) {
                double growthFactor = (double)newCapacity / max(oldCapacity, (size_t)1);
                cout << i + 1 << "\t\t" << vec.size() << "\t" 
                     << newCapacity << "\t\t" << fixed << setprecision(2) << growthFactor << endl;
                reallocationPoints.push_back(i + 1);
            }
        }
        
        cout << "\nReallocation occurred at: ";
        for (size_t point : reallocationPoints) {
            cout << point << " ";
        }
        cout << endl;
    }
    
    // Test 6: Memory Fragmentation Analysis
    static void testMemoryFragmentation() {
        cout << "\n=== Memory Fragmentation Analysis ===" << endl;
        
        vector<vector<int>> vectors;
        size_t totalElements = 0;
        
        // Create many vectors of different sizes
        for (int i = 0; i < 1000; i++) {
            vector<int> temp;
            size_t capacity = rand() % 1000 + 100;  // Random capacity between 100-1099
            temp.reserve(capacity);
            
            for (size_t j = 0; j < capacity; j++) {
                temp.push_back(j);
            }
            
            vectors.push_back(move(temp));
            totalElements += capacity;
        }
        
        cout << "Created " << vectors.size() << " vectors" << endl;
        cout << "Total elements stored: " << totalElements << endl;
        cout << "Average elements per vector: " << totalElements / vectors.size() << endl;
        cout << "Estimated memory allocated: " << totalElements * sizeof(int) << " bytes" << endl;
    }
    
    // Run all tests
    static void runAllTests() {
        cout << "Vector Optimization Tests" << endl;
        cout << "=========================" << endl;
        
        testReservePerformance();
        testEmplaceVsPushBack();
        testShrinkToFit();
        testMoveSemantics();
        testGrowthPattern();
        testMemoryFragmentation();
        
        cout << "\n=== All Tests Complete ===" << endl;
        cout << "\nKey Insights:" << endl;
        cout << "1. reserve() can significantly improve performance" << endl;
        cout << "2. emplace_back() is more efficient for complex types" << endl;
        cout << "3. shrink_to_fit() can optimize memory usage" << endl;
        cout << "4. Move semantics reduce copying overhead" << endl;
        cout << "5. Vectors typically grow by doubling capacity" << endl;
        cout << "6. Memory fragmentation can be a concern with many vectors" << endl;
    }
};

int main() {
    VectorOptimizationTests::runAllTests();
    return 0;
}
