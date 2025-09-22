/**
 * Custom Vector Implementation
 * 
 * This file demonstrates how to implement a simplified version of std::vector
 * with dynamic growth capabilities. It shows the internal mechanics of vector
 * reallocation and memory management.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -g -o custom_vector custom_vector_implementation.cpp
 * Run with: ./custom_vector
 */

#include <iostream>
#include <memory>
#include <algorithm>
#include <stdexcept>
using namespace std;

template<typename T>
class CustomVector {
private:
    T* data;
    size_t size_;
    size_t capacity_;
    static constexpr double GROWTH_FACTOR = 2.0;
    
    void reallocate(size_t newCapacity) {
        cout << "Reallocating from capacity " << capacity_ 
             << " to " << newCapacity << " (elements moved: " << size_ << ")" << endl;
        
        T* newData = new T[newCapacity];
        
        // Move existing elements
        for (size_t i = 0; i < size_; i++) {
            newData[i] = move(data[i]);
        }
        
        delete[] data;
        data = newData;
        capacity_ = newCapacity;
    }
    
public:
    // Constructors
    CustomVector() : data(nullptr), size_(0), capacity_(0) {
        cout << "CustomVector default constructor" << endl;
    }
    
    CustomVector(size_t initialCapacity) : data(nullptr), size_(0), capacity_(0) {
        cout << "CustomVector constructor with capacity " << initialCapacity << endl;
        if (initialCapacity > 0) {
            data = new T[initialCapacity];
            capacity_ = initialCapacity;
        }
    }
    
    // Destructor
    ~CustomVector() {
        cout << "CustomVector destructor (cleaning up " << capacity_ << " elements)" << endl;
        delete[] data;
    }
    
    // Copy constructor
    CustomVector(const CustomVector& other) : data(nullptr), size_(0), capacity_(0) {
        cout << "CustomVector copy constructor" << endl;
        reserve(other.capacity_);
        size_ = other.size_;
        for (size_t i = 0; i < size_; i++) {
            data[i] = other.data[i];
        }
    }
    
    // Move constructor
    CustomVector(CustomVector&& other) noexcept 
        : data(other.data), size_(other.size_), capacity_(other.capacity_) {
        cout << "CustomVector move constructor" << endl;
        other.data = nullptr;
        other.size_ = 0;
        other.capacity_ = 0;
    }
    
    // Assignment operators
    CustomVector& operator=(const CustomVector& other) {
        cout << "CustomVector copy assignment" << endl;
        if (this != &other) {
            delete[] data;
            data = nullptr;
            size_ = 0;
            capacity_ = 0;
            
            reserve(other.capacity_);
            size_ = other.size_;
            for (size_t i = 0; i < size_; i++) {
                data[i] = other.data[i];
            }
        }
        return *this;
    }
    
    CustomVector& operator=(CustomVector&& other) noexcept {
        cout << "CustomVector move assignment" << endl;
        if (this != &other) {
            delete[] data;
            data = other.data;
            size_ = other.size_;
            capacity_ = other.capacity_;
            
            other.data = nullptr;
            other.size_ = 0;
            other.capacity_ = 0;
        }
        return *this;
    }
    
    // Element access
    T& operator[](size_t index) {
        if (index >= size_) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }
    
    const T& operator[](size_t index) const {
        if (index >= size_) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }
    
    T& at(size_t index) {
        if (index >= size_) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }
    
    const T& at(size_t index) const {
        if (index >= size_) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }
    
    T& front() {
        if (size_ == 0) {
            throw out_of_range("Vector is empty");
        }
        return data[0];
    }
    
    const T& front() const {
        if (size_ == 0) {
            throw out_of_range("Vector is empty");
        }
        return data[0];
    }
    
    T& back() {
        if (size_ == 0) {
            throw out_of_range("Vector is empty");
        }
        return data[size_ - 1];
    }
    
    const T& back() const {
        if (size_ == 0) {
            throw out_of_range("Vector is empty");
        }
        return data[size_ - 1];
    }
    
    // Modifiers
    void push_back(const T& value) {
        if (size_ >= capacity_) {
            size_t newCapacity = (capacity_ == 0) ? 1 : static_cast<size_t>(capacity_ * GROWTH_FACTOR);
            reallocate(newCapacity);
        }
        data[size_] = value;
        size_++;
    }
    
    void push_back(T&& value) {
        if (size_ >= capacity_) {
            size_t newCapacity = (capacity_ == 0) ? 1 : static_cast<size_t>(capacity_ * GROWTH_FACTOR);
            reallocate(newCapacity);
        }
        data[size_] = move(value);
        size_++;
    }
    
    template<typename... Args>
    void emplace_back(Args&&... args) {
        if (size_ >= capacity_) {
            size_t newCapacity = (capacity_ == 0) ? 1 : static_cast<size_t>(capacity_ * GROWTH_FACTOR);
            reallocate(newCapacity);
        }
        new(data + size_) T(forward<Args>(args)...);
        size_++;
    }
    
    void pop_back() {
        if (size_ > 0) {
            size_--;
            data[size_].~T();  // Call destructor
        }
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
    
    void resize(size_t newSize, const T& value = T{}) {
        if (newSize > capacity_) {
            reserve(newSize);
        }
        
        if (newSize > size_) {
            // Fill new elements
            for (size_t i = size_; i < newSize; i++) {
                data[i] = value;
            }
        }
        
        size_ = newSize;
    }
    
    void clear() {
        for (size_t i = 0; i < size_; i++) {
            data[i].~T();
        }
        size_ = 0;
    }
    
    // Capacity
    bool empty() const { return size_ == 0; }
    size_t size() const { return size_; }
    size_t capacity() const { return capacity_; }
    
    // Iterators (simplified)
    T* begin() { return data; }
    const T* begin() const { return data; }
    T* end() { return data + size_; }
    const T* end() const { return data + size_; }
    
    // Utility methods
    void printStats() const {
        cout << "Vector Stats - Size: " << size_ 
             << ", Capacity: " << capacity_
             << ", Memory Efficiency: " << fixed << setprecision(2)
             << (capacity_ > 0 ? (double)size_ / capacity_ * 100 : 0) << "%" << endl;
    }
    
    void printElements() const {
        cout << "Elements: [";
        for (size_t i = 0; i < size_; i++) {
            cout << data[i];
            if (i < size_ - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
};

// Demonstration class to show constructor calls
class DemoObject {
private:
    int value;
    
public:
    DemoObject(int v) : value(v) {
        cout << "DemoObject(" << value << ") constructed" << endl;
    }
    
    DemoObject(const DemoObject& other) : value(other.value) {
        cout << "DemoObject(" << value << ") copy constructed" << endl;
    }
    
    DemoObject(DemoObject&& other) noexcept : value(other.value) {
        cout << "DemoObject(" << value << ") move constructed" << endl;
        other.value = 0;
    }
    
    ~DemoObject() {
        if (value != 0) {
            cout << "DemoObject(" << value << ") destroyed" << endl;
        }
    }
    
    DemoObject& operator=(const DemoObject& other) {
        cout << "DemoObject assignment operator" << endl;
        value = other.value;
        return *this;
    }
    
    friend ostream& operator<<(ostream& os, const DemoObject& obj) {
        os << obj.value;
        return os;
    }
};

void demonstrateBasicOperations() {
    cout << "\n=== Basic Operations Demo ===" << endl;
    
    CustomVector<int> vec;
    
    cout << "\nAdding elements:" << endl;
    for (int i = 1; i <= 10; i++) {
        vec.push_back(i);
        vec.printStats();
    }
    
    cout << "\nVector contents:" << endl;
    vec.printElements();
    
    cout << "\nAccessing elements:" << endl;
    cout << "First element: " << vec.front() << endl;
    cout << "Last element: " << vec.back() << endl;
    cout << "Element at index 5: " << vec[5] << endl;
    
    cout << "\nRemoving last element:" << endl;
    vec.pop_back();
    vec.printStats();
    vec.printElements();
}

void demonstrateReserveAndShrink() {
    cout << "\n=== Reserve and Shrink Demo ===" << endl;
    
    CustomVector<int> vec;
    
    cout << "\nReserving capacity for 1000 elements:" << endl;
    vec.reserve(1000);
    vec.printStats();
    
    cout << "\nAdding 500 elements:" << endl;
    for (int i = 0; i < 500; i++) {
        vec.push_back(i);
    }
    vec.printStats();
    
    cout << "\nRemoving 400 elements:" << endl;
    for (int i = 0; i < 400; i++) {
        vec.pop_back();
    }
    vec.printStats();
    
    cout << "\nShrinking to fit:" << endl;
    vec.shrink_to_fit();
    vec.printStats();
}

void demonstrateMoveSemantics() {
    cout << "\n=== Move Semantics Demo ===" << endl;
    
    cout << "\nCreating source vector:" << endl;
    CustomVector<int> source;
    for (int i = 1; i <= 5; i++) {
        source.push_back(i);
    }
    source.printStats();
    
    cout << "\nMoving to destination vector:" << endl;
    CustomVector<int> destination = move(source);
    
    cout << "Source after move:" << endl;
    source.printStats();
    
    cout << "Destination after move:" << endl;
    destination.printStats();
    destination.printElements();
}

void demonstrateComplexObjects() {
    cout << "\n=== Complex Objects Demo ===" << endl;
    
    CustomVector<DemoObject> vec;
    
    cout << "\nAdding objects with emplace_back:" << endl;
    for (int i = 1; i <= 3; i++) {
        vec.emplace_back(i * 10);
    }
    
    cout << "\nVector contents:" << endl;
    vec.printElements();
    
    cout << "\nAdding object with push_back:" << endl;
    DemoObject obj(40);
    vec.push_back(obj);
    
    cout << "\nFinal vector contents:" << endl;
    vec.printElements();
    
    cout << "\nClearing vector:" << endl;
    vec.clear();
    vec.printStats();
}

void demonstrateErrorHandling() {
    cout << "\n=== Error Handling Demo ===" << endl;
    
    CustomVector<int> vec;
    vec.push_back(10);
    vec.push_back(20);
    
    cout << "\nAccessing valid index:" << endl;
    cout << "vec[1] = " << vec[1] << endl;
    
    cout << "\nTrying to access invalid index:" << endl;
    try {
        cout << "vec[5] = " << vec[5] << endl;
    } catch (const out_of_range& e) {
        cout << "Caught exception: " << e.what() << endl;
    }
    
    cout << "\nTrying to access empty vector:" << endl;
    CustomVector<int> emptyVec;
    try {
        cout << "emptyVec.front() = " << emptyVec.front() << endl;
    } catch (const out_of_range& e) {
        cout << "Caught exception: " << e.what() << endl;
    }
}

int main() {
    cout << "Custom Vector Implementation Demo" << endl;
    cout << "=================================" << endl;
    
    demonstrateBasicOperations();
    demonstrateReserveAndShrink();
    demonstrateMoveSemantics();
    demonstrateComplexObjects();
    demonstrateErrorHandling();
    
    cout << "\n=== Demo Complete ===" << endl;
    cout << "\nKey Features Demonstrated:" << endl;
    cout << "1. Dynamic memory allocation and reallocation" << endl;
    cout << "2. Copy and move semantics" << endl;
    cout << "3. Exception handling for bounds checking" << endl;
    cout << "4. Reserve and shrink_to_fit operations" << endl;
    cout << "5. Emplace_back for efficient object construction" << endl;
    cout << "6. Proper resource management with RAII" << endl;
    
    return 0;
}
