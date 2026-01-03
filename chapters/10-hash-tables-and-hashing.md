# Chapter 10: Hash Tables and Hashing

## 10.1 Introduction to Hash Tables

A **hash table** (also called a hash map) is a data structure that implements an associative array, a structure that can map keys to values. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.

### Key Characteristics

- **Fast average-case performance**: O(1) for insert, delete, and search operations
- **Key-value storage**: Stores data as key-value pairs
- **Hash function**: Maps keys to array indices
- **Collision handling**: Manages cases where multiple keys map to the same index
- **Dynamic resizing**: Grows and shrinks as needed

### Why Hash Tables Matter

1. **Performance**: Average O(1) operations make them extremely fast
2. **Versatility**: Used in countless applications (databases, caches, symbol tables)
3. **Real-world usage**: Foundation of many programming language features
4. **Interview importance**: Frequently asked in technical interviews

### Comparison with Other Data Structures

| Operation | Hash Table | Array | Binary Search Tree | Linked List |
|-----------|------------|-------|-------------------|-------------|
| Search | O(1) avg | O(1) | O(log n) | O(n) |
| Insert | O(1) avg | O(n) | O(log n) | O(1) |
| Delete | O(1) avg | O(n) | O(log n) | O(n) |
| Space | O(n) | O(n) | O(n) | O(n) |
| Ordered | No | Yes | Yes | Yes |

### 10.1.1 Core Invariants

Understanding hash table invariants is crucial for correct implementation and reasoning.

#### Core Invariants of a Hash Table

1. **Hash Function Invariant**:
   - Same key always maps to same bucket (deterministic)
   - Hash function distributes keys uniformly across buckets
   - Hash computation is O(1) time

2. **Key-Value Mapping Invariant**:
   - Each key maps to at most one value
   - Inserting same key updates existing value (or handles collision)
   - No duplicate keys exist in the table

3. **Load Factor Invariant**:
   - Load factor = number of elements / table size
   - Must stay below threshold (typically 0.75) to maintain O(1) performance
   - When exceeded, rehashing must occur

4. **Collision Resolution Invariant**:
   - All keys that hash to same bucket are stored correctly
   - Collision resolution method (chaining/probing) is consistently applied
   - Search/insert/delete operations handle collisions correctly

#### What Breaks Invariants

- **Non-deterministic hash function**: Same key produces different hashes → breaks mapping
- **Load factor too high**: Degrades to O(n) performance → breaks performance guarantee
- **Incorrect collision handling**: Keys lost or overwritten → breaks key-value mapping
- **Hash function with poor distribution**: Clustering causes performance degradation

#### How Operations Restore Invariants

- **Insert**: Compute hash → handle collision → update load factor → rehash if needed
- **Delete**: Compute hash → locate key → remove → update load factor
- **Rehash**: Create larger table → recompute all hashes → redistribute keys → restores load factor

**Example**: When inserting a key-value pair:
1. Compute hash (preserves hash function invariant)
2. Handle collision if bucket occupied (preserves collision resolution invariant)
3. Check load factor (preserves load factor invariant)
4. Rehash if necessary (restores load factor invariant)

Note: This builds on the **array representation** concepts from Chapter 3, but hash tables add the complexity of hash functions and collision resolution.

## 10.2 Understanding Hash Functions

A **hash function** is any function that can be used to map data of arbitrary size to fixed-size values. The values returned by a hash function are called hash values, hash codes, digests, or simply hashes.

### Properties of Good Hash Functions

1. **Deterministic**: Same input always produces same output
2. **Uniform distribution**: Keys should be evenly distributed across buckets
3. **Fast computation**: Should be O(1) time complexity
4. **Avalanche effect**: Small changes in input should cause large changes in output

### Common Hash Functions

#### 1. Division Method
```cpp
// Simple hash function using modulo
size_t hashDivision(int key, size_t tableSize) {
    return key % tableSize;
}

// For strings
size_t hashStringDivision(const string& key, size_t tableSize) {
    size_t hash = 0;
    for (char c : key) {
        hash = (hash * 31 + c) % tableSize;
    }
    return hash;
}
```

#### 2. Multiplication Method
```cpp
#include <cmath>

size_t hashMultiplication(int key, size_t tableSize) {
    const double A = 0.6180339887; // (sqrt(5) - 1) / 2
    double fractional = (key * A) - floor(key * A);
    return static_cast<size_t>(tableSize * fractional);
}
```

#### 3. FNV-1a Hash (Fowler-Noll-Vo)
```cpp
size_t hashFNV1a(const string& key, size_t tableSize) {
    const size_t FNV_OFFSET_BASIS = 2166136261U;
    const size_t FNV_PRIME = 16777619U;
    
    size_t hash = FNV_OFFSET_BASIS;
    for (char c : key) {
        hash ^= static_cast<size_t>(c);
        hash *= FNV_PRIME;
    }
    return hash % tableSize;
}
```

#### 4. djb2 Hash (Dan Bernstein)
```cpp
size_t hashDJB2(const string& key, size_t tableSize) {
    size_t hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + c; // hash * 33 + c
    }
    return hash % tableSize;
}
```

#### 5. Universal Hashing
```cpp
class UniversalHash {
private:
    size_t a, b, p, m;
    
public:
    UniversalHash(size_t tableSize) : m(tableSize) {
        // Choose random a, b, and large prime p
        p = 2147483647; // Large prime
        a = 1 + (rand() % (p - 1));
        b = rand() % p;
    }
    
    size_t hash(int key) {
        return ((a * key + b) % p) % m;
    }
};
```

### Hash Function for Different Data Types

```cpp
#include <functional>
#include <string>

// Integer hash
size_t hashInt(int key, size_t tableSize) {
    return static_cast<size_t>(key) % tableSize;
}

// String hash (polynomial rolling hash)
size_t hashString(const string& key, size_t tableSize) {
    const size_t PRIME = 31;
    size_t hash = 0;
    size_t power = 1;
    
    for (char c : key) {
        hash = (hash + (c - 'a' + 1) * power) % tableSize;
        power = (power * PRIME) % tableSize;
    }
    return hash;
}

// Custom object hash (using std::hash)
struct Person {
    string name;
    int age;
    
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

namespace std {
    template<>
    struct hash<Person> {
        size_t operator()(const Person& p) const {
            return hash<string>()(p.name) ^ (hash<int>()(p.age) << 1);
        }
    };
}
```

## 10.3 Collision Resolution Strategies

When two or more keys hash to the same index, we have a **collision**. There are several strategies to handle collisions:

### 10.3.1 Separate Chaining

In **separate chaining**, each bucket contains a linked list (or other data structure) of all entries that hash to the same index.

#### Implementation
```cpp
#include <iostream>
#include <vector>
#include <list>
#include <algorithm>
using namespace std;

template<typename K, typename V>
class HashTableChaining {
private:
    struct KeyValue {
        K key;
        V value;
        
        KeyValue(const K& k, const V& v) : key(k), value(v) {}
    };
    
    vector<list<KeyValue>> buckets;
    size_t tableSize;
    size_t numElements;
    const double LOAD_FACTOR_THRESHOLD = 0.75;
    
    size_t hashFunction(const K& key) const {
        return hash<K>{}(key) % tableSize;
    }
    
    void rehash() {
        size_t oldSize = tableSize;
        tableSize *= 2;
        vector<list<KeyValue>> newBuckets(tableSize);
        
        for (const auto& bucket : buckets) {
            for (const auto& kv : bucket) {
                size_t newIndex = hash<K>{}(kv.key) % tableSize;
                newBuckets[newIndex].push_back(kv);
            }
        }
        
        buckets = move(newBuckets);
    }
    
public:
    HashTableChaining(size_t initialSize = 16) 
        : tableSize(initialSize), numElements(0) {
        buckets.resize(tableSize);
    }
    
    void insert(const K& key, const V& value) {
        size_t index = hashFunction(key);
        
        // Check if key already exists
        auto it = find_if(buckets[index].begin(), buckets[index].end(),
            [&key](const KeyValue& kv) { return kv.key == key; });
        
        if (it != buckets[index].end()) {
            it->value = value; // Update existing
        } else {
            buckets[index].push_back(KeyValue(key, value));
            numElements++;
        }
        
        // Rehash if load factor too high
        if (static_cast<double>(numElements) / tableSize > LOAD_FACTOR_THRESHOLD) {
            rehash();
        }
    }
    
    bool find(const K& key, V& value) const {
        size_t index = hashFunction(key);
        
        auto it = find_if(buckets[index].begin(), buckets[index].end(),
            [&key](const KeyValue& kv) { return kv.key == key; });
        
        if (it != buckets[index].end()) {
            value = it->value;
            return true;
        }
        return false;
    }
    
    bool remove(const K& key) {
        size_t index = hashFunction(key);
        
        auto it = find_if(buckets[index].begin(), buckets[index].end(),
            [&key](const KeyValue& kv) { return kv.key == key; });
        
        if (it != buckets[index].end()) {
            buckets[index].erase(it);
            numElements--;
            return true;
        }
        return false;
    }
    
    size_t size() const {
        return numElements;
    }
    
    bool empty() const {
        return numElements == 0;
    }
    
    double loadFactor() const {
        return static_cast<double>(numElements) / tableSize;
    }
    
    void printStats() const {
        cout << "Table Size: " << tableSize << endl;
        cout << "Number of Elements: " << numElements << endl;
        cout << "Load Factor: " << loadFactor() << endl;
        
        size_t maxChainLength = 0;
        size_t emptyBuckets = 0;
        
        for (const auto& bucket : buckets) {
            maxChainLength = max(maxChainLength, bucket.size());
            if (bucket.empty()) emptyBuckets++;
        }
        
        cout << "Max Chain Length: " << maxChainLength << endl;
        cout << "Empty Buckets: " << emptyBuckets << endl;
    }
};
```

#### Advantages and Disadvantages

**Advantages:**
- Simple to implement
- Handles any number of collisions
- No clustering issues
- Easy to delete elements

**Disadvantages:**
- Extra memory for pointers
- Cache performance not as good (non-contiguous memory)
- Worst-case can degrade to O(n) if all keys hash to same bucket

### 10.3.2 Open Addressing

In **open addressing**, all elements are stored directly in the hash table array. When a collision occurs, we probe for the next available slot.

#### Linear Probing
```cpp
#include <iostream>
#include <vector>
#include <optional>
using namespace std;

enum class SlotStatus {
    EMPTY,
    OCCUPIED,
    DELETED
};

template<typename K, typename V>
class HashTableLinearProbing {
private:
    struct Slot {
        K key;
        V value;
        SlotStatus status;
        
        Slot() : status(SlotStatus::EMPTY) {}
    };
    
    vector<Slot> table;
    size_t tableSize;
    size_t numElements;
    const double LOAD_FACTOR_THRESHOLD = 0.7;
    
    size_t hashFunction(const K& key) const {
        return hash<K>{}(key) % tableSize;
    }
    
    size_t probe(const K& key, size_t startIndex) const {
        size_t index = startIndex;
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            if (table[index].status == SlotStatus::EMPTY ||
                (table[index].status == SlotStatus::OCCUPIED && 
                 table[index].key == key)) {
                return index;
            }
            index = (index + 1) % tableSize;
            probeCount++;
        }
        
        return tableSize; // Table full
    }
    
    void rehash() {
        size_t oldSize = tableSize;
        vector<Slot> oldTable = move(table);
        
        tableSize *= 2;
        table.clear();
        table.resize(tableSize);
        numElements = 0;
        
        for (const auto& slot : oldTable) {
            if (slot.status == SlotStatus::OCCUPIED) {
                insert(slot.key, slot.value);
            }
        }
    }
    
public:
    HashTableLinearProbing(size_t initialSize = 16) 
        : tableSize(initialSize), numElements(0) {
        table.resize(tableSize);
    }
    
    void insert(const K& key, const V& value) {
        if (static_cast<double>(numElements) / tableSize > LOAD_FACTOR_THRESHOLD) {
            rehash();
        }
        
        size_t index = hashFunction(key);
        size_t slot = probe(key, index);
        
        if (slot == tableSize) {
            throw runtime_error("Hash table is full");
        }
        
        if (table[slot].status != SlotStatus::OCCUPIED) {
            numElements++;
        }
        
        table[slot].key = key;
        table[slot].value = value;
        table[slot].status = SlotStatus::OCCUPIED;
    }
    
    bool find(const K& key, V& value) const {
        size_t index = hashFunction(key);
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            if (table[index].status == SlotStatus::EMPTY) {
                return false;
            }
            
            if (table[index].status == SlotStatus::OCCUPIED && 
                table[index].key == key) {
                value = table[index].value;
                return true;
            }
            
            index = (index + 1) % tableSize;
            probeCount++;
        }
        
        return false;
    }
    
    bool remove(const K& key) {
        size_t index = hashFunction(key);
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            if (table[index].status == SlotStatus::EMPTY) {
                return false;
            }
            
            if (table[index].status == SlotStatus::OCCUPIED && 
                table[index].key == key) {
                table[index].status = SlotStatus::DELETED;
                numElements--;
                return true;
            }
            
            index = (index + 1) % tableSize;
            probeCount++;
        }
        
        return false;
    }
    
    size_t size() const {
        return numElements;
    }
    
    bool empty() const {
        return numElements == 0;
    }
};
```

#### Quadratic Probing
```cpp
template<typename K, typename V>
class HashTableQuadraticProbing {
private:
    // Similar structure to linear probing
    
    size_t probe(const K& key, size_t startIndex) const {
        size_t index = startIndex;
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            size_t currentIndex = (startIndex + probeCount * probeCount) % tableSize;
            
            if (table[currentIndex].status == SlotStatus::EMPTY ||
                (table[currentIndex].status == SlotStatus::OCCUPIED && 
                 table[currentIndex].key == key)) {
                return currentIndex;
            }
            probeCount++;
        }
        
        return tableSize;
    }
    
    // Rest of implementation similar to linear probing
};
```

#### Double Hashing
```cpp
template<typename K, typename V>
class HashTableDoubleHashing {
private:
    size_t hashFunction1(const K& key) const {
        return hash<K>{}(key) % tableSize;
    }
    
    size_t hashFunction2(const K& key) const {
        // Must be relatively prime to tableSize
        return 1 + (hash<K>{}(key) % (tableSize - 1));
    }
    
    size_t probe(const K& key, size_t startIndex) const {
        size_t index = startIndex;
        size_t step = hashFunction2(key);
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            if (table[index].status == SlotStatus::EMPTY ||
                (table[index].status == SlotStatus::OCCUPIED && 
                 table[index].key == key)) {
                return index;
            }
            index = (index + step) % tableSize;
            probeCount++;
        }
        
        return tableSize;
    }
    
    // Rest of implementation similar
};
```

#### Comparison of Open Addressing Methods

| Method | Advantages | Disadvantages |
|--------|------------|---------------|
| Linear Probing | Simple, cache-friendly | Primary clustering |
| Quadratic Probing | Reduces primary clustering | Secondary clustering, complex deletion |
| Double Hashing | Best distribution, no clustering | More computation, must ensure hash2 ≠ 0 |

## 10.4 Complete Hash Table Implementation

Here's a complete, production-ready hash table implementation:

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <functional>
#include <stdexcept>
#include <algorithm>
using namespace std;

template<typename K, typename V>
class HashTable {
public:
    enum class CollisionResolution {
        CHAINING,
        LINEAR_PROBING,
        QUADRATIC_PROBING,
        DOUBLE_HASHING
    };

private:
    struct KeyValue {
        K key;
        V value;
        
        KeyValue(const K& k, const V& v) : key(k), value(v) {}
    };
    
    // For chaining
    vector<list<KeyValue>> chainingTable;
    
    // For open addressing
    enum class SlotStatus { EMPTY, OCCUPIED, DELETED };
    struct Slot {
        K key;
        V value;
        SlotStatus status;
        Slot() : status(SlotStatus::EMPTY) {}
    };
    vector<Slot> openAddressingTable;
    
    size_t tableSize;
    size_t numElements;
    CollisionResolution resolution;
    const double LOAD_FACTOR_THRESHOLD = 0.75;
    
    size_t hash1(const K& key) const {
        return hash<K>{}(key) % tableSize;
    }
    
    size_t hash2(const K& key) const {
        return 1 + (hash<K>{}(key) % (tableSize - 1));
    }
    
    size_t probe(size_t startIndex, size_t probeNum, const K& key) const {
        switch (resolution) {
            case CollisionResolution::LINEAR_PROBING:
                return (startIndex + probeNum) % tableSize;
                
            case CollisionResolution::QUADRATIC_PROBING:
                return (startIndex + probeNum * probeNum) % tableSize;
                
            case CollisionResolution::DOUBLE_HASHING:
                return (startIndex + probeNum * hash2(key)) % tableSize;
                
            default:
                return startIndex;
        }
    }
    
    void rehash() {
        size_t oldSize = tableSize;
        tableSize *= 2;
        
        if (resolution == CollisionResolution::CHAINING) {
            vector<list<KeyValue>> oldTable = move(chainingTable);
            chainingTable.clear();
            chainingTable.resize(tableSize);
            numElements = 0;
            
            for (const auto& bucket : oldTable) {
                for (const auto& kv : bucket) {
                    insert(kv.key, kv.value);
                }
            }
        } else {
            vector<Slot> oldTable = move(openAddressingTable);
            openAddressingTable.clear();
            openAddressingTable.resize(tableSize);
            numElements = 0;
            
            for (const auto& slot : oldTable) {
                if (slot.status == SlotStatus::OCCUPIED) {
                    insert(slot.key, slot.value);
                }
            }
        }
    }
    
public:
    HashTable(size_t initialSize = 16, 
              CollisionResolution res = CollisionResolution::CHAINING)
        : tableSize(initialSize), numElements(0), resolution(res) {
        
        if (resolution == CollisionResolution::CHAINING) {
            chainingTable.resize(tableSize);
        } else {
            openAddressingTable.resize(tableSize);
        }
    }
    
    void insert(const K& key, const V& value) {
        if (static_cast<double>(numElements) / tableSize > LOAD_FACTOR_THRESHOLD) {
            rehash();
        }
        
        if (resolution == CollisionResolution::CHAINING) {
            size_t index = hash1(key);
            auto& bucket = chainingTable[index];
            
            auto it = find_if(bucket.begin(), bucket.end(),
                [&key](const KeyValue& kv) { return kv.key == key; });
            
            if (it != bucket.end()) {
                it->value = value;
            } else {
                bucket.push_back(KeyValue(key, value));
                numElements++;
            }
        } else {
            size_t index = hash1(key);
            size_t probeNum = 0;
            
            while (probeNum < tableSize) {
                size_t currentIndex = probe(index, probeNum, key);
                Slot& slot = openAddressingTable[currentIndex];
                
                if (slot.status == SlotStatus::EMPTY || 
                    slot.status == SlotStatus::DELETED ||
                    (slot.status == SlotStatus::OCCUPIED && slot.key == key)) {
                    if (slot.status != SlotStatus::OCCUPIED) {
                        numElements++;
                    }
                    slot.key = key;
                    slot.value = value;
                    slot.status = SlotStatus::OCCUPIED;
                    return;
                }
                probeNum++;
            }
            
            throw runtime_error("Hash table is full");
        }
    }
    
    bool find(const K& key, V& value) const {
        if (resolution == CollisionResolution::CHAINING) {
            size_t index = hash1(key);
            const auto& bucket = chainingTable[index];
            
            auto it = find_if(bucket.begin(), bucket.end(),
                [&key](const KeyValue& kv) { return kv.key == key; });
            
            if (it != bucket.end()) {
                value = it->value;
                return true;
            }
            return false;
        } else {
            size_t index = hash1(key);
            size_t probeNum = 0;
            
            while (probeNum < tableSize) {
                size_t currentIndex = probe(index, probeNum, key);
                const Slot& slot = openAddressingTable[currentIndex];
                
                if (slot.status == SlotStatus::EMPTY) {
                    return false;
                }
                
                if (slot.status == SlotStatus::OCCUPIED && slot.key == key) {
                    value = slot.value;
                    return true;
                }
                probeNum++;
            }
            
            return false;
        }
    }
    
    bool remove(const K& key) {
        if (resolution == CollisionResolution::CHAINING) {
            size_t index = hash1(key);
            auto& bucket = chainingTable[index];
            
            auto it = find_if(bucket.begin(), bucket.end(),
                [&key](const KeyValue& kv) { return kv.key == key; });
            
            if (it != bucket.end()) {
                bucket.erase(it);
                numElements--;
                return true;
            }
            return false;
        } else {
            size_t index = hash1(key);
            size_t probeNum = 0;
            
            while (probeNum < tableSize) {
                size_t currentIndex = probe(index, probeNum, key);
                Slot& slot = openAddressingTable[currentIndex];
                
                if (slot.status == SlotStatus::EMPTY) {
                    return false;
                }
                
                if (slot.status == SlotStatus::OCCUPIED && slot.key == key) {
                    slot.status = SlotStatus::DELETED;
                    numElements--;
                    return true;
                }
                probeNum++;
            }
            
            return false;
        }
    }
    
    size_t size() const {
        return numElements;
    }
    
    bool empty() const {
        return numElements == 0;
    }
    
    double loadFactor() const {
        return static_cast<double>(numElements) / tableSize;
    }
    
    void clear() {
        numElements = 0;
        if (resolution == CollisionResolution::CHAINING) {
            for (auto& bucket : chainingTable) {
                bucket.clear();
            }
        } else {
            for (auto& slot : openAddressingTable) {
                slot.status = SlotStatus::EMPTY;
            }
        }
    }
};
```

## 10.5 C++ Standard Library Hash Tables

C++ provides hash table implementations in the Standard Template Library:

### std::unordered_map
```cpp
#include <unordered_map>
#include <string>
#include <iostream>
using namespace std;

void demonstrateUnorderedMap() {
    // Declaration
    unordered_map<string, int> ages;
    
    // Insertion
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages.insert({"Charlie", 35});
    ages.emplace("David", 40);
    
    // Access
    cout << "Alice's age: " << ages["Alice"] << endl;
    cout << "Bob's age: " << ages.at("Bob") << endl;
    
    // Check existence
    if (ages.find("Eve") != ages.end()) {
        cout << "Eve found" << endl;
    } else {
        cout << "Eve not found" << endl;
    }
    
    // Iteration
    for (const auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    // Size and capacity
    cout << "Size: " << ages.size() << endl;
    cout << "Bucket count: " << ages.bucket_count() << endl;
    cout << "Load factor: " << ages.load_factor() << endl;
    
    // Deletion
    ages.erase("Alice");
    ages.clear(); // Remove all
}
```

### std::unordered_set
```cpp
#include <unordered_set>
#include <iostream>
using namespace std;

void demonstrateUnorderedSet() {
    unordered_set<int> numbers;
    
    // Insertion
    numbers.insert(5);
    numbers.insert(10);
    numbers.insert(15);
    numbers.insert(5); // Duplicate, ignored
    
    // Check membership
    if (numbers.find(10) != numbers.end()) {
        cout << "10 is in the set" << endl;
    }
    
    // Size
    cout << "Set size: " << numbers.size() << endl;
    
    // Iteration
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // Deletion
    numbers.erase(10);
}
```

### Custom Hash Function for std::unordered_map
```cpp
#include <unordered_map>
#include <string>

struct Person {
    string name;
    int age;
    
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

// Custom hash function
struct PersonHash {
    size_t operator()(const Person& p) const {
        return hash<string>()(p.name) ^ (hash<int>()(p.age) << 1);
    }
};

void demonstrateCustomHash() {
    unordered_map<Person, string, PersonHash> personToCity;
    
    personToCity[Person{"Alice", 25}] = "New York";
    personToCity[Person{"Bob", 30}] = "London";
    
    for (const auto& pair : personToCity) {
        cout << pair.first.name << " lives in " << pair.second << endl;
    }
}
```

## 10.6 Load Factor and Rehashing

### Load Factor

The **load factor** is the ratio of the number of elements to the number of buckets:

```
Load Factor = Number of Elements / Number of Buckets
```

### 10.6.1 Systems Perspective: Memory Layout and Rehashing Costs

Understanding hash table behavior at the system level reveals critical performance considerations.

#### Memory Layout and Cache Behavior

**Separate Chaining:**
- **Memory Layout**: Buckets are contiguous, but chains are linked lists (non-contiguous)
- **Cache Performance**: Poor - pointer chasing causes cache misses
- **Memory Overhead**: ~16-24 bytes per node (data + 2 pointers for doubly-linked)
- **Real Impact**: Each chain traversal may cause 1-3 cache misses per node

**Open Addressing (Linear Probing):**
- **Memory Layout**: All data in contiguous array (like arrays from Chapter 3)
- **Cache Performance**: Excellent - sequential access benefits from prefetching
- **Memory Overhead**: Minimal - only data + status flags
- **Real Impact**: Clustering hurts cache locality; good distribution = cache-friendly

**Performance Comparison (Real-World):**
```
Operation          | Separate Chaining | Linear Probing
-------------------|-------------------|---------------
Cache misses/op    | 2-5               | 0-1
Memory per element | ~32 bytes         | ~8 bytes
Best case latency  | ~50-100 cycles    | ~5-10 cycles
Worst case latency  | ~200-500 cycles   | ~100-200 cycles
```

#### Rehashing: The Hidden Cost

Rehashing is expensive and can cause latency spikes:

**What Happens During Rehash:**
1. Allocate new table (2x size) - may trigger OS memory allocation
2. Recompute all hashes - O(n) hash computations
3. Redistribute all elements - O(n) memory copies
4. Deallocate old table - may fragment memory

**Real-World Impact:**
- **Time Cost**: O(n) - can take milliseconds for large tables
- **Memory Spike**: Temporarily uses 3x memory (old + new + overhead)
- **Latency Spikes**: Insert operations can suddenly take 100-1000x longer
- **Fragmentation**: Repeated rehashing can fragment heap memory

**Mitigation Strategies:**
1. **Pre-allocate capacity**: Use `reserve()` if size is known (like vectors in Chapter 3)
2. **Incremental rehashing**: Rehash gradually over multiple operations
3. **Load factor tuning**: Lower threshold (0.5) reduces rehash frequency
4. **Memory pools**: Pre-allocate memory to reduce allocation overhead

#### When Hash Tables Become a Bottleneck

1. **High Collision Rate**:
   - Poor hash function → clustering → O(n) performance
   - Solution: Use better hash function (FNV-1a, MurmurHash)

2. **Frequent Rehashing**:
   - Growing table → repeated rehashing → latency spikes
   - Solution: Pre-allocate or use incremental rehashing

3. **Cache Thrashing**:
   - Large table → doesn't fit in cache → constant misses
   - Solution: Use smaller tables or cache-conscious design

4. **Memory Pressure**:
   - Many small hash tables → fragmentation
   - Solution: Use memory pools or fewer, larger tables

### Why Load Factor Matters

- **Low load factor (< 0.5)**: Wasted space, but better performance
- **Optimal load factor (0.7-0.75)**: Good balance between space and performance
- **High load factor (> 0.9)**: More collisions, degraded performance

### Rehashing

When the load factor exceeds a threshold, we **rehash** the table:

1. Create a new table (typically 2x the size)
2. Recompute hash values for all elements
3. Insert all elements into the new table
4. Replace the old table with the new one

```cpp
void rehashExample() {
    HashTable<string, int> table(4); // Small initial size
    
    // Insert elements until rehashing occurs
    for (int i = 0; i < 10; i++) {
        table.insert("key" + to_string(i), i);
        cout << "After insert " << i << ": Load factor = " 
             << table.loadFactor() << endl;
    }
}
```

## 10.7 Applications of Hash Tables

### 1. Database Indexing
Hash tables are used to create indexes for fast lookups in databases.

### 2. Caching
```cpp
#include <unordered_map>
#include <list>
#include <optional>

template<typename K, typename V>
class LRUCache {
private:
    struct Node {
        K key;
        V value;
        Node* prev;
        Node* next;
    };
    
    unordered_map<K, Node*> cache;
    Node* head;
    Node* tail;
    size_t capacity;
    
    void moveToFront(Node* node) {
        removeNode(node);
        addToFront(node);
    }
    
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    void addToFront(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }
    
    void evictLRU() {
        Node* last = tail->prev;
        removeNode(last);
        cache.erase(last->key);
        delete last;
    }
    
public:
    LRUCache(size_t cap) : capacity(cap) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }
    
    optional<V> get(const K& key) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            moveToFront(node);
            return node->value;
        }
        return nullopt;
    }
    
    void put(const K& key, const V& value) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->value = value;
            moveToFront(node);
        } else {
            if (cache.size() >= capacity) {
                evictLRU();
            }
            
            Node* newNode = new Node{key, value, nullptr, nullptr};
            addToFront(newNode);
            cache[key] = newNode;
        }
    }
};
```

### 3. Symbol Tables in Compilers
Hash tables store variable names and their attributes during compilation.

### 4. Counting Frequencies
```cpp
unordered_map<string, int> countFrequencies(const vector<string>& words) {
    unordered_map<string, int> frequency;
    
    for (const string& word : words) {
        frequency[word]++;
    }
    
    return frequency;
}
```

### 5. Grouping and Categorization
```cpp
unordered_map<string, vector<Person>> groupByCity(
    const vector<Person>& people) {
    unordered_map<string, vector<Person>> groups;
    
    for (const Person& person : people) {
        groups[person.city].push_back(person);
    }
    
    return groups;
}
```

### 6. Finding Duplicates
```cpp
bool hasDuplicate(const vector<int>& nums) {
    unordered_set<int> seen;
    
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    
    return false;
}
```

### 7. Two Sum Problem
```cpp
vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> numToIndex;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (numToIndex.find(complement) != numToIndex.end()) {
            return {numToIndex[complement], i};
        }
        
        numToIndex[nums[i]] = i;
    }
    
    return {}; // No solution
}
```

## 10.8 Performance Analysis

### Time Complexity

| Operation | Average Case | Worst Case |
|-----------|--------------|------------|
| Insert | O(1) | O(n) |
| Search | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Rehash | O(n) | O(n) |

### Space Complexity
- **Space**: O(n) where n is the number of elements
- **Overhead**: Additional space for buckets and pointers

### Factors Affecting Performance

1. **Hash Function Quality**: Poor hash functions cause clustering
2. **Load Factor**: High load factors increase collisions
3. **Collision Resolution**: Different methods have different characteristics
4. **Data Distribution**: Skewed data can degrade performance

### Benchmarking Example
```cpp
#include <chrono>
#include <random>

void benchmarkHashTable() {
    HashTable<int, int> table;
    const int NUM_OPERATIONS = 100000;
    
    // Insert benchmark
    auto start = chrono::high_resolution_clock::now();
    for (int i = 0; i < NUM_OPERATIONS; i++) {
        table.insert(i, i * 2);
    }
    auto end = chrono::high_resolution_clock::now();
    auto insertTime = chrono::duration_cast<chrono::microseconds>(end - start);
    
    // Search benchmark
    start = chrono::high_resolution_clock::now();
    for (int i = 0; i < NUM_OPERATIONS; i++) {
        int value;
        table.find(i, value);
    }
    end = chrono::high_resolution_clock::now();
    auto searchTime = chrono::duration_cast<chrono::microseconds>(end - start);
    
    cout << "Insert time: " << insertTime.count() << " microseconds" << endl;
    cout << "Search time: " << searchTime.count() << " microseconds" << endl;
    cout << "Average insert: " << insertTime.count() / NUM_OPERATIONS 
         << " microseconds" << endl;
    cout << "Average search: " << searchTime.count() / NUM_OPERATIONS 
         << " microseconds" << endl;
}
```

## 10.9 Common Hash Table Problems

### Problem 1: Design a Hash Set
```cpp
class MyHashSet {
private:
    vector<bool> buckets;
    size_t tableSize;
    
    size_t hash(int key) const {
        return key % tableSize;
    }
    
public:
    MyHashSet() : tableSize(10000) {
        buckets.resize(tableSize, false);
    }
    
    void add(int key) {
        buckets[hash(key)] = true;
    }
    
    void remove(int key) {
        buckets[hash(key)] = false;
    }
    
    bool contains(int key) const {
        return buckets[hash(key)];
    }
};
```

### Problem 2: First Unique Character
```cpp
int firstUniqChar(const string& s) {
    unordered_map<char, int> frequency;
    
    // Count frequencies
    for (char c : s) {
        frequency[c]++;
    }
    
    // Find first unique
    for (int i = 0; i < s.length(); i++) {
        if (frequency[s[i]] == 1) {
            return i;
        }
    }
    
    return -1;
}
```

### Problem 3: Group Anagrams
```cpp
vector<vector<string>> groupAnagrams(const vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    
    for (const string& str : strs) {
        string key = str;
        sort(key.begin(), key.end());
        groups[key].push_back(str);
    }
    
    vector<vector<string>> result;
    for (const auto& pair : groups) {
        result.push_back(pair.second);
    }
    
    return result;
}
```

### Problem 4: Longest Consecutive Sequence
```cpp
int longestConsecutive(const vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxLength = 0;
    
    for (int num : numSet) {
        // Only start counting from the beginning of a sequence
        if (numSet.find(num - 1) == numSet.end()) {
            int currentNum = num;
            int currentLength = 1;
            
            while (numSet.find(currentNum + 1) != numSet.end()) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = max(maxLength, currentLength);
        }
    }
    
    return maxLength;
}
```

## 10.10 Best Practices and Tips

### 1. Choose the Right Hash Function
- Use built-in `std::hash` when possible
- For custom types, ensure good distribution
- Consider cryptographic hashes for security-sensitive applications

### 2. Monitor Load Factor
- Keep load factor between 0.5 and 0.75
- Rehash when threshold is exceeded
- Consider initial size based on expected elements

### 3. Handle Collisions Appropriately
- Use chaining for unknown data distribution
- Use open addressing for better cache performance
- Consider double hashing for best distribution

### 4. Memory Management
- Be aware of memory overhead
- Consider memory pools for frequent allocations
- Use move semantics when possible

### 5. Thread Safety
- Use synchronization primitives for concurrent access
- Consider lock-free hash tables for high-performance scenarios
- Use `std::shared_mutex` for read-heavy workloads

## 10.11 Key Takeaways

1. **Hash tables** provide average O(1) operations for insert, search, and delete
2. **Hash functions** must be deterministic, fast, and provide uniform distribution
3. **Collision resolution** is essential - choose chaining or open addressing based on use case
4. **Load factor** affects performance - maintain it between 0.5-0.75
5. **Rehashing** is necessary when load factor exceeds threshold
6. **C++ STL** provides `unordered_map` and `unordered_set` for hash table needs
7. **Applications** are vast - caching, indexing, frequency counting, and more

## 10.12 Exercises

1. Implement a hash table with separate chaining using a balanced BST instead of a linked list for each bucket.

2. Create a hash table that supports custom hash functions passed as template parameters.

3. Implement a consistent hash table for distributed systems.

4. Design a hash table that maintains insertion order (like Java's LinkedHashMap).

5. Implement a hash table with automatic resizing that uses prime numbers for table sizes.

6. Create a thread-safe hash table using mutexes.

7. Implement a hash table that supports range queries efficiently.

8. Design a hash table with expiration support (TTL for keys).

9. Implement a hash table that can handle very large keys efficiently.

10. Create a hash table with statistics tracking (hit rate, collision count, etc.).

## 10.13 Summary

Hash tables are one of the most important and widely used data structures in computer science. They provide excellent average-case performance for key-value operations, making them ideal for many applications including databases, caches, symbol tables, and more.

Understanding hash functions, collision resolution strategies, and performance characteristics is crucial for effective use of hash tables. The C++ Standard Library provides excellent implementations in `std::unordered_map` and `std::unordered_set`, but understanding the underlying principles helps in choosing the right data structure and optimizing performance.

In the next chapter, we'll explore graphs, another fundamental data structure that represents relationships and connections between entities.

