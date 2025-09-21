/**
 * Vector Growth Analysis Example
 * 
 * This example demonstrates:
 * - How vectors grow dynamically
 * - Performance impact of reserve() vs no reserve
 * - Memory reallocation patterns
 * - Best practices for vector optimization
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o vector_growth_analysis vector_growth_analysis.cpp
 * Run with: ./vector_growth_analysis
 */

#include <iostream>
#include <vector>
#include <chrono>
#include <iomanip>
using namespace std;

class VectorGrowthAnalyzer {
private:
    vector<int> vec;
    vector<size_t> capacityHistory;
    vector<size_t> reallocationPoints;
    
public:
    void analyzeGrowthPattern() {
        cout << "=== Vector Growth Pattern Analysis ===" << endl;
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
    
    void compareReservePerformance() {
        cout << "\n=== Reserve Performance Comparison ===" << endl;
        
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
        
        // Test with oversized reserve
        {
            vector<int> vec;
            vec.reserve(numElements * 2);  // Reserve twice as much
            
            auto start = chrono::high_resolution_clock::now();
            
            for (int i = 0; i < numElements; i++) {
                vec.push_back(i);
            }
            
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
            
            cout << "\nWith oversized reserve (2x):" << endl;
            cout << "  Time: " << duration.count() << " microseconds" << endl;
            cout << "  Final capacity: " << vec.capacity() << endl;
            cout << "  Memory efficiency: " << fixed << setprecision(2) 
                 << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
        }
    }
    
    void demonstrateShrinkToFit() {
        cout << "\n=== Shrink to Fit Demonstration ===" << endl;
        
        vector<int> vec;
        
        // Add many elements
        for (int i = 0; i < 10000; i++) {
            vec.push_back(i);
        }
        
        cout << "After adding 10000 elements:" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        
        // Remove most elements
        vec.erase(vec.begin() + 100, vec.end());
        
        cout << "After removing 9900 elements:" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        
        // Shrink to fit
        vec.shrink_to_fit();
        
        cout << "After shrink_to_fit():" << endl;
        cout << "  Size: " << vec.size() << ", Capacity: " << vec.capacity() << endl;
        
        // Show memory efficiency
        cout << "  Memory efficiency: " << fixed << setprecision(2) 
             << (double)vec.size() / vec.capacity() * 100 << "%" << endl;
    }
    
    void analyzeEmplaceVsPushBack() {
        cout << "\n=== Emplace vs Push Back Analysis ===" << endl;
        
        // Test with simple types
        {
            vector<int> vec1, vec2;
            
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < 100000; i++) {
                vec1.push_back(i);
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            start = chrono::high_resolution_clock::now();
            for (int i = 0; i < 100000; i++) {
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
            vector<string> vec1, vec2;
            
            auto start = chrono::high_resolution_clock::now();
            for (int i = 0; i < 10000; i++) {
                vec1.push_back("String " + to_string(i));
            }
            auto end = chrono::high_resolution_clock::now();
            auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
            
            start = chrono::high_resolution_clock::now();
            for (int i = 0; i < 10000; i++) {
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
    
    void memoryFragmentationAnalysis() {
        cout << "\n=== Memory Fragmentation Analysis ===" << endl;
        
        vector<vector<int>> vectors;
        size_t totalMemoryAllocated = 0;
        
        // Create many vectors of different sizes
        for (int i = 0; i < 1000; i++) {
            vector<int> temp;
            size_t capacity = rand() % 1000 + 100;  // Random capacity between 100-1099
            temp.reserve(capacity);
            
            for (size_t j = 0; j < capacity; j++) {
                temp.push_back(j);
            }
            
            vectors.push_back(move(temp));
            totalMemoryAllocated += capacity;
        }
        
        cout << "Created " << vectors.size() << " vectors" << endl;
        cout << "Total elements stored: " << totalMemoryAllocated << endl;
        cout << "Average elements per vector: " << totalMemoryAllocated / vectors.size() << endl;
        cout << "Total memory allocated (estimated): " << totalMemoryAllocated * sizeof(int) << " bytes" << endl;
    }
};

// Custom vector implementation for demonstration
template<typename T>
class CustomVector {
private:
    T* data;
    size_t size_;
    size_t capacity_;
    static constexpr double GROWTH_FACTOR = 2.0;
    
public:
    CustomVector() : data(nullptr), size_(0), capacity_(0) {}
    
    ~CustomVector() {
        delete[] data;
    }
    
    // Copy constructor
    CustomVector(const CustomVector& other) : data(nullptr), size_(0), capacity_(0) {
        reserve(other.capacity_);
        size_ = other.size_;
        for (size_t i = 0; i < size_; i++) {
            data[i] = other.data[i];
        }
    }
    
    // Move constructor
    CustomVector(CustomVector&& other) noexcept 
        : data(other.data), size_(other.size_), capacity_(other.capacity_) {
        other.data = nullptr;
        other.size_ = 0;
        other.capacity_ = 0;
    }
    
    void push_back(const T& value) {
        if (size_ >= capacity_) {
            reallocate();
        }
        data[size_] = value;
        size_++;
    }
    
    void reserve(size_t newCapacity) {
        if (newCapacity > capacity_) {
            reallocate(newCapacity);
        }
    }
    
    void shrink_to_fit() {
        if (size_ < capacity_) {
            reallocate(size_);
        }
    }
    
    size_t size() const { return size_; }
    size_t capacity() const { return capacity_; }
    
    T& operator[](size_t index) { return data[index]; }
    const T& operator[](size_t index) const { return data[index]; }
    
private:
    void reallocate(size_t newCapacity = 0) {
        if (newCapacity == 0) {
            newCapacity = (capacity_ == 0) ? 1 : static_cast<size_t>(capacity_ * GROWTH_FACTOR);
        }
        
        T* newData = new T[newCapacity];
        
        for (size_t i = 0; i < size_; i++) {
            newData[i] = move(data[i]);
        }
        
        delete[] data;
        data = newData;
        capacity_ = newCapacity;
    }
};

void demonstrateCustomVector() {
    cout << "\n=== Custom Vector Implementation ===" << endl;
    
    CustomVector<int> vec;
    
    cout << "Custom vector growth pattern:" << endl;
    cout << "Elements\tSize\tCapacity" << endl;
    cout << "--------\t----\t--------" << endl;
    
    for (int i = 0; i < 20; i++) {
        vec.push_back(i);
        cout << i + 1 << "\t\t" << vec.size() << "\t" << vec.capacity() << endl;
    }
    
    // Test shrink to fit
    cout << "\nBefore shrink_to_fit: Size=" << vec.size() 
         << ", Capacity=" << vec.capacity() << endl;
    
    vec.shrink_to_fit();
    
    cout << "After shrink_to_fit: Size=" << vec.size() 
         << ", Capacity=" << vec.capacity() << endl;
}

int main() {
    cout << "Vector Growth Analysis Tool" << endl;
    cout << "===========================" << endl;
    
    VectorGrowthAnalyzer analyzer;
    
    // Run all analyses
    analyzer.analyzeGrowthPattern();
    analyzer.compareReservePerformance();
    analyzer.demonstrateShrinkToFit();
    analyzer.analyzeEmplaceVsPushBack();
    analyzer.memoryFragmentationAnalysis();
    
    // Demonstrate custom vector
    demonstrateCustomVector();
    
    cout << "\n=== Analysis Complete ===" << endl;
    cout << "\nKey Takeaways:" << endl;
    cout << "1. Vectors grow by doubling capacity (typically)" << endl;
    cout << "2. reserve() can significantly improve performance" << endl;
    cout << "3. shrink_to_fit() can reduce memory usage" << endl;
    cout << "4. emplace_back() is generally more efficient for complex types" << endl;
    cout << "5. Memory fragmentation can be a concern with many small vectors" << endl;
    
    return 0;
}
