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

**Quadratic probing** is an open addressing collision resolution technique that uses a quadratic function to determine the probe sequence. Instead of checking consecutive slots like linear probing, it checks slots at positions that increase quadratically: h(k), h(k) + 1², h(k) + 2², h(k) + 3², ...

##### How Quadratic Probing Works

The probe sequence for a key `k` with initial hash `h(k)` is:

```
h(k), h(k) + 1², h(k) + 2², h(k) + 3², ..., h(k) + i² (mod m)
```

Where:
- `h(k)` is the initial hash value
- `i` is the probe number (0, 1, 2, 3, ...)
- `m` is the table size

**Example**: If a key hashes to index 5 in a table of size 11, the probe sequence is:
- Probe 0: (5 + 0²) mod 11 = 5
- Probe 1: (5 + 1²) mod 11 = 6
- Probe 2: (5 + 2²) mod 11 = 9
- Probe 3: (5 + 3²) mod 11 = 3
- Probe 4: (5 + 4²) mod 11 = 10
- Probe 5: (5 + 5²) mod 11 = 8
- Probe 6: (5 + 6²) mod 11 = 8 (collision with probe 5)
- ...

##### Advantages of Quadratic Probing

1. **Reduces Primary Clustering**: Unlike linear probing, quadratic probing spreads out collisions more evenly, reducing the formation of long clusters of occupied slots.

2. **Better Distribution**: The quadratic sequence provides better distribution than linear probing, especially when the table is not too full.

3. **Cache-Friendly**: Still maintains good cache locality since it accesses nearby memory locations (though not as sequential as linear probing).

##### Disadvantages and Limitations

1. **Secondary Clustering**: Keys that hash to the same initial position will follow the same probe sequence, creating "secondary clusters." However, this is less severe than primary clustering in linear probing.

2. **Table Size Requirements**: For quadratic probing to work correctly and probe all slots, the table size must be:
   - A prime number, OR
   - A power of 2 (with certain constraints)
   
   If the table size doesn't meet these requirements, the probe sequence may not visit all slots, leading to failed insertions even when empty slots exist.

3. **Complex Deletion**: Like all open addressing methods, deletion requires marking slots as "DELETED" rather than truly empty, which can affect search performance.

4. **No Guarantee of Finding Empty Slot**: Unlike linear probing (which guarantees finding an empty slot if one exists, given enough probes), quadratic probing may cycle through the same indices without finding an empty slot if the table size is not prime.

##### Mathematical Properties

For quadratic probing to probe all slots in the table:
- The table size `m` should be a **prime number**
- The probe sequence `(h(k) + i²) mod m` will visit all slots if `m` is prime

**Why prime numbers?** When `m` is prime, the quadratic residues (i² mod m) form a complete set, ensuring the probe sequence can reach all table positions.

##### When to Use Quadratic Probing

- **Moderate load factors**: Works well when load factor stays below 0.7
- **When primary clustering is a concern**: Better than linear probing for avoiding long chains
- **When you can control table size**: You need the ability to resize to prime numbers
- **Memory-constrained environments**: Like all open addressing, uses less memory than chaining

##### Performance Characteristics

- **Average case**: O(1) for insert, search, and delete
- **Worst case**: O(n) if the table becomes full or if clustering occurs
- **Load factor threshold**: Typically kept below 0.7 to maintain good performance

##### Implementation Considerations

1. **Table Size**: Always use prime numbers for table size, or implement a prime-finding function during rehashing.

2. **Probe Sequence**: The formula `(startIndex + probeCount * probeCount) % tableSize` can cause integer overflow for large tables. Consider using:
   ```cpp
   currentIndex = (startIndex + (probeCount * probeCount) % tableSize) % tableSize;
   ```

3. **Rehashing**: When rehashing, ensure the new table size is prime. Common approach:
   - Double the current size
   - Find the next prime number ≥ 2×current_size

##### Comparison with Other Methods

| Aspect | Linear Probing | Quadratic Probing | Double Hashing |
|--------|---------------|-------------------|----------------|
| Clustering | Primary clustering | Secondary clustering | Minimal clustering |
| Probe sequence | Sequential | Quadratic | Hash-dependent |
| Cache performance | Best | Good | Moderate |
| Table size requirement | Any | Prime preferred | Prime preferred |
| Implementation complexity | Simplest | Moderate | Most complex |

```cpp
template<typename K, typename V>
class HashTableQuadraticProbing {
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
        
        return tableSize; // Table full
    }
    
    void rehash() {
        size_t oldSize = tableSize;
        vector<Slot> oldTable = move(table);
        
        // Important: For quadratic probing, table size must be prime
        // to ensure all slots can be probed. Here we double and find next prime.
        tableSize *= 2;
        // In practice, you'd find the next prime number >= tableSize
        // For simplicity, we'll use the doubled size
        
        table.clear();
        table.resize(tableSize);
        numElements = 0;
        
        // Reinsert all occupied slots
        for (const auto& slot : oldTable) {
            if (slot.status == SlotStatus::OCCUPIED) {
                insert(slot.key, slot.value);
            }
        }
    }
    
public:
    HashTableQuadraticProbing(size_t initialSize = 16) 
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
            size_t currentIndex = (index + probeCount * probeCount) % tableSize;
            
            if (table[currentIndex].status == SlotStatus::EMPTY) {
                return false;
            }
            
            if (table[currentIndex].status == SlotStatus::OCCUPIED && 
                table[currentIndex].key == key) {
                value = table[currentIndex].value;
                return true;
            }
            
            probeCount++;
        }
        
        return false;
    }
    
    bool remove(const K& key) {
        size_t index = hashFunction(key);
        size_t probeCount = 0;
        
        while (probeCount < tableSize) {
            size_t currentIndex = (index + probeCount * probeCount) % tableSize;
            
            if (table[currentIndex].status == SlotStatus::EMPTY) {
                return false;
            }
            
            if (table[currentIndex].status == SlotStatus::OCCUPIED && 
                table[currentIndex].key == key) {
                table[currentIndex].status = SlotStatus::DELETED;
                numElements--;
                return true;
            }
            
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

#### Double Hashing

**Double hashing** is an open addressing collision resolution technique that uses two independent hash functions to determine the probe sequence. It is considered one of the best open addressing methods because it provides excellent distribution and minimizes clustering.

##### How Double Hashing Works

Double hashing uses two hash functions:
1. **Primary hash function** `h₁(k)`: Determines the initial probe position
2. **Secondary hash function** `h₂(k)`: Determines the step size for subsequent probes

The probe sequence for a key `k` is:

```
h₁(k), h₁(k) + h₂(k), h₁(k) + 2·h₂(k), h₁(k) + 3·h₂(k), ..., h₁(k) + i·h₂(k) (mod m)
```

Where:
- `h₁(k)` is the primary hash value (initial position)
- `h₂(k)` is the secondary hash value (step size)
- `i` is the probe number (0, 1, 2, 3, ...)
- `m` is the table size

**Example**: If a key hashes to:
- `h₁(k) = 5` (initial position)
- `h₂(k) = 3` (step size)
- Table size `m = 11`

The probe sequence is:
- Probe 0: (5 + 0·3) mod 11 = 5
- Probe 1: (5 + 1·3) mod 11 = 8
- Probe 2: (5 + 2·3) mod 11 = 0
- Probe 3: (5 + 3·3) mod 11 = 3
- Probe 4: (5 + 4·3) mod 11 = 6
- Probe 5: (5 + 5·3) mod 11 = 9
- Probe 6: (5 + 6·3) mod 11 = 1
- ...

Notice how different keys will have different step sizes, creating unique probe sequences.

##### Key Requirements for h₂(k)

The secondary hash function `h₂(k)` must satisfy critical properties:

1. **Non-zero step size**: `h₂(k) ≠ 0` (mod m)
   - If `h₂(k) = 0`, the probe sequence would never advance, causing infinite loops
   - This is why we use: `h₂(k) = 1 + (hash(k) % (m - 1))`
   - This guarantees `h₂(k) ∈ [1, m-1]`

2. **Relatively prime to table size**: `gcd(h₂(k), m) = 1`
   - Ensures the probe sequence visits all slots in the table
   - If `gcd(h₂(k), m) = d > 1`, the sequence will only visit `m/d` slots
   - **Solution**: Use prime table sizes, or ensure `h₂(k)` is always odd when `m` is a power of 2

3. **Independent of h₁(k)**: The two hash functions should be independent to avoid correlation

##### Advantages of Double Hashing

1. **Minimal Clustering**: Unlike linear and quadratic probing, double hashing creates probe sequences that are unique for each key (based on the key's value), virtually eliminating clustering.

2. **Excellent Distribution**: The use of two independent hash functions provides superior distribution of keys across the table.

3. **Predictable Performance**: Performance remains consistent even as the table fills up, unlike methods that suffer from clustering.

4. **Theoretical Guarantees**: When implemented correctly (prime table size, proper h₂), double hashing guarantees that all slots will be probed.

5. **No Secondary Clustering**: Unlike quadratic probing, keys with the same initial hash position will have different probe sequences (due to different h₂ values).

##### Disadvantages and Limitations

1. **More Computation**: Requires computing two hash functions instead of one, adding slight overhead.

2. **Complex Implementation**: More complex than linear or quadratic probing, requiring careful attention to:
   - Ensuring `h₂(k) ≠ 0`
   - Maintaining relative primality with table size
   - Handling table resizing correctly

3. **Cache Performance**: Slightly worse cache locality than linear probing since probes can jump around more.

4. **Table Size Constraints**: For optimal performance, table size should be prime to ensure `gcd(h₂(k), m) = 1` for all keys.

##### Mathematical Properties

For double hashing to probe all slots:

1. **Table size must be prime**: When `m` is prime, any `h₂(k) ∈ [1, m-1]` is relatively prime to `m`, ensuring the probe sequence visits all slots.

2. **Probe sequence length**: The maximum number of probes needed is at most `m` (the table size).

3. **Uniform distribution**: With good hash functions, double hashing provides near-uniform distribution of keys.

**Why prime table sizes?**
- If `m` is prime and `h₂(k) ∈ [1, m-1]`, then `gcd(h₂(k), m) = 1`
- This means the step size and table size are coprime
- The sequence `h₁(k) + i·h₂(k) (mod m)` will cycle through all `m` values before repeating

##### When to Use Double Hashing

- **High-performance requirements**: When you need the best possible distribution and minimal clustering
- **Large datasets**: Works well with large hash tables where clustering becomes a significant issue
- **Variable key distributions**: Excellent when key distribution is unknown or non-uniform
- **When you can control table size**: You need the ability to resize to prime numbers
- **Production systems**: Often used in high-performance systems where predictable O(1) performance is critical

##### Performance Characteristics

- **Average case**: O(1) for insert, search, and delete
- **Worst case**: O(n) only if the table becomes completely full
- **Load factor threshold**: Can handle higher load factors (up to 0.8-0.9) than linear probing while maintaining good performance
- **Expected probes**: Approximately `1/(1-α)` probes for successful search, where `α` is the load factor

##### Implementation Considerations

1. **Hash Function Design**:
   ```cpp
   h₁(k) = hash(k) % m
   h₂(k) = 1 + (hash(k) % (m - 1))
   ```
   - The `+ 1` ensures `h₂(k) ≥ 1`
   - The `% (m - 1)` ensures `h₂(k) ≤ m - 1`

2. **Table Size**: Always use prime numbers. Common approach:
   - Start with a prime initial size
   - When rehashing, find the next prime ≥ 2×current_size

3. **Overflow Prevention**: For large tables, be careful with integer overflow:
   ```cpp
   index = (index + step) % tableSize;
   ```
   This is safe because `step < tableSize`, so `index + step < 2*tableSize`.

4. **Rehashing**: When rehashing, all keys get new `h₂` values (since `h₂` depends on table size), which redistributes them effectively.

##### Comparison with Other Methods

| Aspect | Linear Probing | Quadratic Probing | Double Hashing |
|--------|---------------|-------------------|----------------|
| Clustering | Primary clustering | Secondary clustering | Minimal clustering |
| Probe sequence | Fixed (+1) | Fixed (quadratic) | Key-dependent |
| Hash functions | 1 | 1 | 2 |
| Computation cost | Lowest | Low | Moderate |
| Distribution | Good | Better | Best |
| Cache performance | Best | Good | Moderate |
| Table size requirement | Any | Prime preferred | Prime required |
| Implementation complexity | Simplest | Moderate | Most complex |
| Worst-case performance | Degrades with clustering | Degrades with clustering | Most consistent |

##### Real-World Applications

Double hashing is used in:
- **Database systems**: For hash indexes and hash joins
- **Compiler implementations**: Symbol tables and identifier lookups
- **High-performance libraries**: C++ `std::unordered_map` implementations often use double hashing variants
- **Distributed systems**: Consistent hashing and sharding strategies

##### Common Pitfalls to Avoid

1. **Zero step size**: Always ensure `h₂(k) ≠ 0`
2. **Non-prime table sizes**: Can cause incomplete probe sequences
3. **Correlated hash functions**: `h₁` and `h₂` should be independent
4. **Forgetting to update h₂ on rehash**: `h₂` depends on table size, so it changes after rehashing

```cpp
template<typename K, typename V>
class HashTableDoubleHashing {
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
    
    // First hash function: primary hash
    size_t hashFunction1(const K& key) const {
        return hash<K>{}(key) % tableSize;
    }
    
    // Second hash function: step size for probing
    // Must be relatively prime to tableSize to ensure all slots are probed
    // Returns a value in [1, tableSize-1] to avoid step size of 0
    size_t hashFunction2(const K& key) const {
        // Ensure step size is at least 1 and less than tableSize
        // Using (tableSize - 1) ensures step is in [1, tableSize-1]
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
            // Double hashing: use second hash as step size
            index = (index + step) % tableSize;
            probeCount++;
        }
        
        return tableSize; // Table full
    }
    
    void rehash() {
        size_t oldSize = tableSize;
        vector<Slot> oldTable = move(table);
        
        // For double hashing, table size should be prime for best distribution
        // Here we double the size; in practice, find next prime >= 2*tableSize
        tableSize *= 2;
        
        table.clear();
        table.resize(tableSize);
        numElements = 0;
        
        // Reinsert all occupied slots
        // Note: hashFunction2 will be recalculated with new tableSize
        for (const auto& slot : oldTable) {
            if (slot.status == SlotStatus::OCCUPIED) {
                insert(slot.key, slot.value);
            }
        }
    }
    
public:
    HashTableDoubleHashing(size_t initialSize = 16) 
        : tableSize(initialSize), numElements(0) {
        // Ensure tableSize is at least 2 for hashFunction2 to work correctly
        if (tableSize < 2) {
            tableSize = 2;
        }
        table.resize(tableSize);
    }
    
    void insert(const K& key, const V& value) {
        if (static_cast<double>(numElements) / tableSize > LOAD_FACTOR_THRESHOLD) {
            rehash();
        }
        
        size_t index = hashFunction1(key);
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
        size_t index = hashFunction1(key);
        size_t step = hashFunction2(key);
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
            
            index = (index + step) % tableSize;
            probeCount++;
        }
        
        return false;
    }
    
    bool remove(const K& key) {
        size_t index = hashFunction1(key);
        size_t step = hashFunction2(key);
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
            
            index = (index + step) % tableSize;
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
    
    double loadFactor() const {
        return static_cast<double>(numElements) / tableSize;
    }
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

### 10.6.1 Systems Perspective: Memory Hierarchy and Performance

Understanding hash table behavior at the system level reveals critical performance considerations. This section applies the memory hierarchy concepts from [Chapter 3.6](03.6-memory-hierarchy-and-performance.md) to hash tables.

For comprehensive coverage of memory hierarchy, cache behavior, CPU cycles, and performance optimization, see Chapter 3.6. Here we focus on hash table-specific implications.

#### Memory Hierarchy Impact on Hash Tables

The memory hierarchy (registers → L1 → L2 → L3 → RAM → disk) dramatically affects hash table performance. See Section 3.6.2 for details on the memory pyramid.

```
┌─────────────────────────────────────────────────────────┐
│ CPU Registers                                            │
│ • Access time: ~1 CPU cycle (0.3-0.5 ns)                │
│ • Size: ~100-200 bytes                                   │
│ • Managed by: Compiler/CPU                               │
└─────────────────────────────────────────────────────────┘
                    ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│ L1 Cache (Level 1)                                      │
│ • Access time: ~3-5 CPU cycles (1-2 ns)                  │
│ • Size: 32-64 KB per core (data + instruction)          │
│ • Bandwidth: ~500-1000 GB/s                              │
│ • Managed by: Hardware (automatic)                       │
└─────────────────────────────────────────────────────────┘
                    ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│ L2 Cache (Level 2)                                      │
│ • Access time: ~10-20 CPU cycles (3-7 ns)               │
│ • Size: 256 KB - 1 MB per core                           │
│ • Bandwidth: ~200-400 GB/s                               │
│ • Managed by: Hardware (automatic)                       │
└─────────────────────────────────────────────────────────┘
                    ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│ L3 Cache (Level 3, Shared)                              │
│ • Access time: ~40-75 CPU cycles (10-20 ns)              │
│ • Size: 8-32 MB (shared across cores)                    │
│ • Bandwidth: ~100-200 GB/s                               │
│ • Managed by: Hardware (automatic)                       │
└─────────────────────────────────────────────────────────┘
                    ↓ (miss)
┌─────────────────────────────────────────────────────────┐
│ Main Memory (RAM)                                        │
│ • Access time: ~100-300 CPU cycles (50-100 ns)          │
│ • Size: 8-128 GB typical                                 │
│ • Bandwidth: ~20-50 GB/s                                 │
│ • Managed by: Operating System                            │
└─────────────────────────────────────────────────────────┘
                    ↓ (page fault)
┌─────────────────────────────────────────────────────────┐
│ Disk Storage (SSD/HDD)                                   │
│ • Access time: ~100,000-10,000,000 cycles (10 μs-10 ms) │
│ • Size: 256 GB - 4 TB typical                            │
│ • Bandwidth: ~0.5-3 GB/s (SSD), ~0.1 GB/s (HDD)         │
│ • Managed by: Operating System                            │
└─────────────────────────────────────────────────────────┘
```

**Key Insight**: Each level is 10-100x slower than the previous level, but also 10-100x larger. The goal is to keep frequently accessed data in faster levels. See Section 3.6.2 for the complete memory hierarchy.

#### Cache Behavior in Hash Tables

Cache lines (64 bytes) and cache misses significantly impact hash table performance. See Section 3.6.3 for details on cache hits, misses, and miss types.

**Key Points for Hash Tables**:
- Cache hit: ~5-20 cycles
- Cache miss: ~100-300 cycles (10-30x slower!)
- Hash table operations are dominated by memory access patterns

#### Sequential vs. Random Access in Hash Tables

Sequential access (see Section 3.6.4) provides 10-40x better performance than random access:

#### Memory Layout and Cache Behavior

**Separate Chaining:**
```
Memory Layout:
┌─────┬─────┬─────┬─────┐
│ B0  │ B1  │ B2  │ B3  │  ← Contiguous bucket array
└──┬──┴──┬──┴──┬──┴──┬──┘
   │     │     │     │
   ▼     ▼     ▼     ▼
  [A]   [X]   [M]   [P]  ← Non-contiguous linked lists
   │     │     │     │
   ▼     ▼     ▼     ▼
  [B]   [Y]   [N]   [Q]
   │     │     │     │
   ▼     ▼     ▼     ▼
  [C]   [Z]   [O]   [R]
```

- **Memory Layout**: Buckets are contiguous, but chains are linked lists (non-contiguous)
- **Cache Performance**: Poor - pointer chasing causes cache misses
- **Memory Overhead**: ~16-24 bytes per node (data + 2 pointers for doubly-linked)
- **Cache Behavior**:
  - Bucket array access: L1/L2 hit (contiguous)
  - First node access: L2/L3 hit (likely)
  - Subsequent nodes: Random access, 50-70% miss rate
  - **Real Impact**: Each chain traversal may cause 1-3 cache misses per node
  - **Example**: Traversing 5 nodes = ~5-15 cache misses = ~500-3000 cycles

**Open Addressing (Linear Probing):**
```
Memory Layout:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ [A] │ [B] │ [X] │ [C] │ [Y] │ [M] │ [N] │ [P] │  ← Contiguous array
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
   ↑     ↑     ↑     ↑     ↑     ↑     ↑     ↑
  All in same cache line (64 bytes = 8 slots of 8 bytes each)
```

- **Memory Layout**: All data in contiguous array (like arrays from Chapter 3)
- **Cache Performance**: Excellent - sequential access benefits from prefetching
- **Memory Overhead**: Minimal - only data + status flags
- **Cache Behavior**:
  - Initial hash: L1 hit (bucket array)
  - Probing: Sequential access, 90-95% hit rate
  - **Real Impact**: Clustering hurts cache locality; good distribution = cache-friendly
  - **Example**: Probing 3 slots = ~0-1 cache misses = ~5-20 cycles

**Performance Comparison (Real-World):**
```
Operation          | Separate Chaining | Linear Probing
-------------------|-------------------|---------------
Cache misses/op    | 2-5               | 0-1
Memory per element | ~32 bytes         | ~8 bytes
Best case latency  | ~50-100 cycles    | ~5-10 cycles
Worst case latency  | ~200-500 cycles   | ~100-200 cycles
L1 cache hit rate  | ~60-70%           | ~90-95%
Effective bandwidth| ~5-10 GB/s        | ~20-40 GB/s
```

#### CPU Cycles and Performance

Understanding CPU cycles is crucial for performance analysis. See Section 3.6.5 for details on CPU cycles and operation breakdowns.

**Hash Table Operation Breakdown** (Linear Probing, cache hit):
```
1. Compute hash:           ~10-20 cycles (L1 cache for hash function)
2. Modulo operation:      ~5-10 cycles
3. Access bucket:         ~3-5 cycles (L1 cache hit)
4. Compare key:           ~5-10 cycles
5. Return value:          ~3-5 cycles
─────────────────────────────────────
Total (cache hit):        ~26-50 cycles ≈ 7-15 ns
```

**Hash Table Operation Breakdown** (Separate Chaining, cache miss):
```
1. Compute hash:           ~10-20 cycles
2. Access bucket array:    ~3-5 cycles (L1 cache hit)
3. Follow pointer:         ~10-20 cycles (L2 cache hit)
4. Access node:            ~100-300 cycles (L3/RAM miss!)
5. Compare key:           ~5-10 cycles
6. Follow next pointer:    ~100-300 cycles (another miss!)
7. Access node:           ~100-300 cycles
─────────────────────────────────────
Total (2 cache misses):   ~328-955 cycles ≈ 80-240 ns
```

**Key Insight**: A single cache miss can cost 100-300 cycles, making it 10-30x slower than a cache hit! See Section 3.6.5 for detailed CPU cycle analysis.

#### False Sharing in Hash Tables

False sharing (see Section 3.6.7) can severely impact concurrent hash table performance. When multiple threads access different hash tables on the same cache line, cache coherency protocols cause performance degradation.

**Solution**: Use cache line alignment for thread-local hash tables:
```cpp
alignas(64) HashTable threadLocalTable;  // 64-byte alignment
```

#### Memory Access Patterns in Hash Tables

**Best Case - Linear Probing with Good Distribution**:
```
Hash(key) = 5
Probe sequence: 5 → 6 → 7 → 8 (sequential, same cache line)
Cache behavior: L1 hits, prefetcher active
Performance: ~5-10 cycles per probe
```

**Worst Case - Separate Chaining with Long Chains**:
```
Hash(key) = 3
Chain: bucket[3] → node1 → node2 → node3 → node4
Memory: [scattered across heap, different cache lines]
Cache behavior: 1-2 misses per node
Performance: ~100-300 cycles per node access
```

**Moderate Case - Quadratic/Double Hashing**:
```
Hash(key) = 5, step = 3
Probe sequence: 5 → 8 → 0 → 3 → 6 (modulo table)
Memory: [within same cache line if table fits]
Cache behavior: Mostly L1/L2 hits if table < L3 size
Performance: ~10-50 cycles per probe
```

#### Practical Implications

The size of your hash table relative to cache sizes determines performance characteristics. See Section 3.6.9 for general guidelines on data structure sizes:

1. **Small Hash Tables (< 1 MB)**: Fit in L3 cache
   - Open addressing: Excellent performance (~5-20 cycles/op)
   - Chaining: Moderate performance (~50-200 cycles/op)

2. **Medium Hash Tables (1-32 MB)**: Fit in RAM, not cache
   - Open addressing: Good performance (~20-100 cycles/op)
   - Chaining: Poor performance (~200-500 cycles/op)

3. **Large Hash Tables (> 32 MB)**: May cause page faults
   - Both methods: Degraded performance
   - Consider: Sharding, distributed hash tables, or disk-based structures

For optimization strategies applicable to hash tables, see Section 3.6.8.

#### Rehashing: The Hidden Cost

Rehashing is expensive and can cause latency spikes. Understanding the memory hierarchy impact is crucial.

**What Happens During Rehash (Memory Hierarchy View):**

1. **Allocate new table (2x size)**:
   - **Memory allocation**: May trigger OS system call if heap is exhausted
   - **Cache impact**: New memory is "cold" (not in cache)
   - **Time cost**: 
     - If in heap: ~100-1000 cycles (L3/RAM access)
     - If OS allocation needed: ~10,000-100,000 cycles (system call + page allocation)
   - **Memory access**: Random access pattern, poor cache utilization

2. **Recompute all hashes**:
   - **CPU-bound**: Hash computation is fast (~10-50 cycles per key)
   - **Cache behavior**: Hash function code in L1 instruction cache (good)
   - **Memory access**: Sequential read of old table
   - **Time cost**: O(n) hash computations = ~10-50 cycles × n elements

3. **Redistribute all elements**:
   - **Memory access pattern**: 
     - Read from old table: Sequential (cache-friendly)
     - Write to new table: Random (based on new hash, cache-unfriendly)
   - **Cache behavior**:
     - Old table reads: 90-95% L1/L2 hits (sequential)
     - New table writes: 50-70% L1/L2 hits (random)
   - **Time cost**: 
     - Cache hits: ~5-20 cycles per element
     - Cache misses: ~100-300 cycles per element
     - **Total**: O(n) but with significant cache miss penalties

4. **Deallocate old table**:
   - **Memory management**: Returns memory to heap/OS
   - **Fragmentation**: May create memory holes
   - **Time cost**: ~100-1000 cycles (depends on allocator)

**Real-World Impact (Example: 1 million elements):**

```
Operation                    | Cycles      | Time (3 GHz CPU)
-----------------------------|-------------|------------------
Allocate 16 MB table         | ~100,000    | ~33 μs
Recompute 1M hashes          | ~20,000,000 | ~6.7 ms
Redistribute (50% cache hit) | ~75,000,000 | ~25 ms
Deallocate old table         | ~10,000     | ~3.3 μs
─────────────────────────────|─────────────|──────────────────
Total                        | ~95,110,000 | ~32 ms
```

**Memory Hierarchy Breakdown:**
- **L1/L2 cache**: Hash function code, some table data
- **L3 cache**: Portions of old table (sequential reads benefit)
- **RAM**: New table allocation, random writes
- **Disk**: Possible if table > RAM (page faults = disaster!)

**Latency Spikes:**
- **Normal insert**: ~5-50 cycles (cache hit)
- **Insert during rehash**: ~95,000,000 cycles for 1M elements
- **Spike factor**: 1,900,000x slower!

**Memory Footprint:**
- **Before rehash**: 8 MB (1M elements × 8 bytes)
- **During rehash**: 24 MB (old 8 MB + new 16 MB + overhead)
- **After rehash**: 16 MB
- **Peak memory**: 3x normal usage

**Mitigation Strategies:**

1. **Pre-allocate capacity**:
   ```cpp
   HashTable table;
   table.reserve(expected_size);  // Allocate once, avoid rehashing
   ```
   - **Benefit**: Eliminates rehashing entirely if size is known
   - **Cache impact**: Single allocation, better memory layout

2. **Incremental rehashing**:
   - Rehash 1% of elements per operation
   - Spreads cost over 100 operations
   - **Trade-off**: Slightly slower normal operations, but no spikes

3. **Load factor tuning**:
   - Lower threshold (0.5) = more frequent, smaller rehashes
   - Higher threshold (0.9) = fewer, larger rehashes
   - **Optimal**: 0.7-0.75 balances space and rehash frequency

4. **Memory pools**:
   - Pre-allocate large blocks of memory
   - Reduces allocation overhead
   - **Cache benefit**: Better memory locality

5. **Cache-conscious rehashing**:
   - Process elements in cache-line-sized chunks (64 bytes = 8 elements)
   - Improves cache hit rate during redistribution
   - **Performance gain**: 20-30% faster rehashing

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

## 10.13 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to hash tables. See Section 3.5.3 for invariant-based reasoning and Section 3.5.8 for lock granularity tradeoffs.

### 10.13.1 Shared-State Invariants

**Core Hash Table Invariants** (see Section 3.5.3):
1. **Bucket Invariant**: "Each key maps to exactly one bucket"
2. **Collision Chain Invariant**: "Keys in same bucket form valid chain (chaining) or valid probe sequence (open addressing)"
3. **Load Factor Invariant**: "Load factor = size/capacity (used for rehashing decisions)"

**What Must Not Be Observed Half-Updated**:
- Bucket chain modifications during insertion
- Table pointer updates during rehashing
- Size changes while elements are being inserted/removed

### 10.13.2 Operations That Must Be Atomic

**Insert Operation** (see Section 3.5.4):
```cpp
void insert(int key, int value) {
    int bucket = hash(key) % capacity;
    Node* new_node = new Node(key, value);
    new_node->next = table[bucket];  // Step 1
    table[bucket] = new_node;         // Step 2
    size++;                            // Step 3
}
```

**Tie to Invariants**: Between steps, the **Collision Chain Invariant** is violated. Another thread may see inconsistent bucket state.

**Rehashing Operation**:
```cpp
void rehash() {
    // Create new table
    // Migrate all elements  // Step 1: Copying
    // Update table pointer  // Step 2: Switching
    // Delete old table      // Step 3: Cleanup
}
```

**Tie to Invariants**: During rehashing, threads may access old table (partially migrated) or new table (not fully populated), breaking the **Bucket Invariant**.

**Operations Requiring Atomicity**:
- **Insert**: Entire operation (bucket chain update and size change)
- **Delete**: Entire operation (bucket chain update and size change)
- **Rehash**: Entire rehashing operation (or use read-copy-update pattern)

### 10.13.3 Naïve Approaches and Why They Fail

**1. Partial Updates**:
```cpp
// Thread 1: Insert (key=5, value=10)
// Thread 2: Insert (key=5, value=20)
// Both read "key not found", both insert
// One value overwrites the other
```
**Why It Fails**: Insert is not atomic. Invariant violation: **Bucket Invariant** broken (duplicate keys).

**2. Check-Then-Act Bugs**:
```cpp
// Thread 1: Rehashing (migrating elements)
// Thread 2: Reading key
// Thread 2 may access old table (partially migrated)
// or new table (not fully populated)
```
**Why It Fails**: Rehashing and access are not synchronized. Invariant violation: **Bucket Invariant** broken.

**3. Locking Only Part of the Structure**:
```cpp
// Locking only the bucket, not the table pointer
void insert(int key, int value) {
    int bucket = hash(key) % capacity;
    std::lock_guard<std::mutex> lock(bucket_locks[bucket]);
    // But rehashing may change table pointer!
    table[bucket] = new_node;
}
```
**Why It Fails**: Rehashing can change table pointer while bucket is locked. Invariant violation: **Bucket Invariant** broken.

### 10.13.4 Locking Strategies

**Coarse-Grained Lock** (see Section 3.5.8):
```cpp
class ThreadSafeHashTable {
    std::vector<Bucket> table;
    std::mutex mtx;
    
public:
    void insert(int key, int value) {
        std::lock_guard<std::mutex> lock(mtx);
        // Entire operation atomic
    }
};
```
- ✅ Simple, prevents all race conditions
- ❌ Very low parallelism (only one operation at a time)

**Fine-Grained Lock (Per-Bucket)**:
```cpp
class FineGrainedHashTable {
    std::vector<Bucket> table;
    std::vector<std::mutex> bucket_locks;
    
public:
    void insert(int key, int value) {
        int bucket = hash(key) % capacity;
        std::lock_guard<std::mutex> lock(bucket_locks[bucket]);
        // Only this bucket is locked
    }
};
```
- ✅ High parallelism (different buckets can be accessed concurrently)
- ❌ Rehashing becomes complex (need to lock all buckets)
- ❌ Memory overhead (one mutex per bucket)

**Striped Locking (Compromise)**:
```cpp
// Fewer locks than buckets, hash to lock index
std::vector<std::mutex> stripe_locks(16);  // 16 locks for many buckets
int lock_index = hash(key) % 16;
```
- ✅ Good parallelism with lower overhead
- ✅ Easier rehashing than fine-grained
- ⚠️ Some false contention (different buckets may share lock)

**Read-Write Locks** (see Section 3.5.8):
- Use `std::shared_mutex` for read-heavy workloads
- Multiple readers, single writer

### 10.13.5 Performance and Scalability Implications

**Contention** (see Section 3.5.8):
- Coarse-grained locking: Very high contention, throughput collapses
- Fine-grained locking: Lower contention, but rehashing complexity
- Striped locking: Good balance

**False Sharing**: Less relevant (buckets scattered in memory)

**Throughput Collapse Under Load**:
- With many threads, coarse-grained locking becomes severe bottleneck
- Fine-grained or striped locking helps significantly

### 10.13.6 When Not to Do This Yourself

**Use Library Implementations**:
- `std::unordered_map` with external synchronization
- Thread-safe hash tables from well-tested libraries
- Lock-free implementations from proven libraries (see Section 3.5.9)

**Avoid Premature Optimization**:
- Start with coarse-grained locking
- Only optimize to fine-grained/striped if profiling shows it's necessary
- Lock-free hash tables are research-level (see Section 3.5.9 warning)

**For Production**: Prefer `std::unordered_map` with external synchronization or thread-safe hash tables from proven libraries. See Section 3.5.10 for guidance on using libraries.

## 10.14 Advanced Hashing Techniques

### 10.14.1 Consistent Hashing

**Consistent Hashing** is a special hashing technique used in distributed systems to minimize the number of keys that need to be remapped when hash table slots (servers/nodes) are added or removed.

#### The Problem with Standard Hashing

In a distributed system with multiple servers, standard hashing has a critical flaw:

```cpp
// Standard hashing: server_index = hash(key) % num_servers
int server_index = hash(key) % 3;  // 3 servers

// Problem: If we add a 4th server, most keys need remapping!
// Before: key "user123" → server 1
// After:  key "user123" → server 2 (different server!)
```

**Impact**: When servers are added or removed, **most keys** (approximately `(n-1)/n` where n is the number of servers) need to be remapped to different servers. This causes:
- Massive data migration
- Cache invalidation
- Service disruption

#### How Consistent Hashing Works

**Key Idea**: Map both keys and servers to a **circular hash space** (often visualized as a circle or ring).

```cpp
#include <map>
#include <string>
#include <vector>
#include <functional>

class ConsistentHash {
private:
    // Hash ring: maps hash values to server names
    map<uint32_t, string> hashRing;
    hash<string> hasher;
    int numReplicas;  // Virtual nodes per server
    
public:
    ConsistentHash(int replicas = 3) : numReplicas(replicas) {}
    
    // Add a server to the hash ring
    void addServer(const string& serverName) {
        for (int i = 0; i < numReplicas; i++) {
            // Create virtual nodes
            string virtualNode = serverName + "#" + to_string(i);
            uint32_t hashValue = hashString(virtualNode);
            hashRing[hashValue] = serverName;
        }
    }
    
    // Remove a server from the hash ring
    void removeServer(const string& serverName) {
        for (int i = 0; i < numReplicas; i++) {
            string virtualNode = serverName + "#" + to_string(i);
            uint32_t hashValue = hashString(virtualNode);
            hashRing.erase(hashValue);
        }
    }
    
    // Get the server for a given key
    string getServer(const string& key) {
        if (hashRing.empty()) {
            return "";
        }
        
        uint32_t keyHash = hashString(key);
        
        // Find the first server with hash >= keyHash
        auto it = hashRing.lower_bound(keyHash);
        
        // If no server found, wrap around to the first server
        if (it == hashRing.end()) {
            it = hashRing.begin();
        }
        
        return it->second;
    }
    
private:
    uint32_t hashString(const string& str) {
        // Simple hash function (in practice, use better hash like MD5, SHA-1)
        size_t hash = hasher(str);
        return static_cast<uint32_t>(hash);
    }
};
```

#### Visual Representation

```
Hash Ring (0 to 2^32-1):

        Server A
           |
           v
     [Key1]---[Key2]---[Key3]
        |       |       |
        v       v       v
     Server B  Server C  Server A
     
When Server B is removed:
- Only keys between Server A and Server C need remapping
- Keys on Server A and Server C remain unchanged
```

#### Virtual Nodes (Replicas)

**Problem**: Without virtual nodes, servers may be unevenly distributed on the ring.

**Solution**: Create multiple **virtual nodes** (replicas) for each physical server.

```cpp
// Physical server: "server1"
// Virtual nodes: "server1#0", "server1#1", "server1#2"
// Each virtual node maps to the same physical server
```

**Benefits**:
- More even distribution of keys
- Better load balancing
- Smoother redistribution when servers are added/removed

#### Properties of Consistent Hashing

1. **Minimal Remapping**: Only `k/n` keys need remapping when a server is added/removed (where k is the number of keys, n is the number of servers)
2. **Load Balancing**: Keys are distributed evenly across servers
3. **Scalability**: Easy to add or remove servers
4. **Fault Tolerance**: When a server fails, only its keys are remapped

#### Real-World Applications

**Distributed Caching**:
- **Memcached**: Distributed in-memory cache
- **Redis Cluster**: Distributed key-value store
- **CDN (Content Delivery Networks)**: Routing requests to nearest edge server

**Load Balancing**:
- **Request Routing**: Route requests to backend servers
- **Database Sharding**: Distribute data across database shards
- **Microservices**: Route requests to service instances

**Example: Distributed Cache**
```cpp
ConsistentHash cacheHash(100);  // 100 virtual nodes per server

// Add cache servers
cacheHash.addServer("cache-server-1");
cacheHash.addServer("cache-server-2");
cacheHash.addServer("cache-server-3");

// Route key to appropriate server
string key = "user:12345";
string server = cacheHash.getServer(key);
// Store in: cache-server-2

// Add new server (minimal remapping)
cacheHash.addServer("cache-server-4");
// Only ~25% of keys need remapping (1/4 servers)
```

#### Complexity Analysis

- **Add Server**: O(v) where v is the number of virtual nodes
- **Remove Server**: O(v)
- **Get Server**: O(log n) where n is the total number of virtual nodes
- **Space**: O(n*v) where n is the number of servers, v is virtual nodes per server

#### Advantages

- ✅ Minimal key remapping when servers change
- ✅ Good load distribution
- ✅ Scalable and fault-tolerant
- ✅ Simple to understand and implement

#### Disadvantages

- ❌ Not perfectly uniform (depends on hash function quality)
- ❌ Requires virtual nodes for good distribution
- ❌ More complex than standard hashing

### 10.14.2 Perfect Hashing

**Perfect Hashing** is a hashing technique that guarantees **O(1) worst-case lookup time** with **no collisions** when the set of keys is known in advance and static.

#### When Perfect Hashing is Possible

Perfect hashing works when:
1. **Keys are known in advance** (static key set)
2. **Keys don't change** (or change infrequently)
3. **O(1) worst-case lookup** is required
4. **Space is available** for a larger hash table

#### Two-Level Perfect Hashing

The most common approach uses **two levels of hashing**:

```cpp
class PerfectHash {
private:
    vector<vector<pair<string, int>>> table;  // Two-level table
    hash<string> hasher;
    int primarySize;
    vector<int> secondarySizes;
    vector<int> hashParams;  // Hash function parameters
    
public:
    PerfectHash(const vector<string>& keys, const vector<int>& values) {
        // Level 1: Hash to primary bucket
        primarySize = keys.size();
        table.resize(primarySize);
        secondarySizes.resize(primarySize, 0);
        
        // Group keys by primary hash
        vector<vector<string>> buckets(primarySize);
        for (const string& key : keys) {
            int bucket = hasher(key) % primarySize;
            buckets[bucket].push_back(key);
        }
        
        // Level 2: Perfect hash for each bucket
        for (int i = 0; i < primarySize; i++) {
            if (buckets[i].empty()) continue;
            
            // Find perfect hash function for this bucket
            int size = buckets[i].size();
            secondarySizes[i] = size * size;  // Square the size for perfect hashing
            
            table[i].resize(secondarySizes[i]);
            
            // Simple perfect hash: use a different hash parameter
            for (const string& key : buckets[i]) {
                int idx = findValue(keys, key);
                int hash2 = (hasher(key) * 17 + 31) % secondarySizes[i];
                table[i][hash2] = {key, values[idx]};
            }
        }
    }
    
    int get(const string& key) {
        int bucket = hasher(key) % primarySize;
        if (table[bucket].empty()) return -1;
        
        int hash2 = (hasher(key) * 17 + 31) % secondarySizes[bucket];
        if (table[bucket][hash2].first == key) {
            return table[bucket][hash2].second;
        }
        return -1;
    }
    
private:
    int findValue(const vector<string>& keys, const string& key) {
        for (int i = 0; i < keys.size(); i++) {
            if (keys[i] == key) return i;
        }
        return -1;
    }
};
```

#### How It Works

1. **Level 1 (Primary Hash)**: Hash keys to primary buckets
2. **Level 2 (Secondary Hash)**: For each bucket with `k` keys, use a hash table of size `k²` to guarantee no collisions

**Why k² works**: With `k` keys and a table of size `k²`, the probability of no collisions is high. If collisions occur, try different hash function parameters.

#### Complexity Analysis

- **Construction**: O(n) average case, O(n²) worst case (finding perfect hash)
- **Lookup**: O(1) worst-case guaranteed
- **Space**: O(n²) worst case (but often much better in practice)

#### Real-World Applications

**Compilers**:
- **Symbol Tables**: Reserved keywords, built-in functions
- **Static Analysis**: Known function names, variable names

**Databases**:
- **Static Lookup Tables**: Country codes, currency codes
- **Enumeration Values**: Predefined sets of values

**Network Protocols**:
- **HTTP Status Codes**: Known set of status codes
- **Protocol Headers**: Fixed set of header names

**Example: Compiler Symbol Table**
```cpp
// Known keywords in a programming language
vector<string> keywords = {"if", "else", "for", "while", "return", "int", "string"};
vector<int> tokenIds = {1, 2, 3, 4, 5, 6, 7};

PerfectHash keywordHash(keywords, tokenIds);

// O(1) lookup for keywords
int tokenId = keywordHash.get("if");  // Returns 1
```

#### Advantages

- ✅ **O(1) worst-case lookup** (no collisions)
- ✅ **Predictable performance** (no worst-case degradation)
- ✅ **No collision resolution needed**

#### Disadvantages

- ❌ **Keys must be known in advance** (static set)
- ❌ **Higher space complexity** (O(n²) worst case)
- ❌ **Complex construction** (finding perfect hash function)
- ❌ **Not suitable for dynamic key sets**

#### When to Use Perfect Hashing

**Use When**:
- Key set is static and known at compile time
- O(1) worst-case lookup is critical
- Space is not a major constraint
- Keys are frequently accessed

**Don't Use When**:
- Keys are dynamic (added/removed frequently)
- Space is severely constrained
- Key set is very large (construction becomes expensive)

#### Comparison with Standard Hashing

| Aspect | Standard Hashing | Perfect Hashing |
|--------|------------------|-----------------|
| **Worst-case lookup** | O(n) with collisions | O(1) guaranteed |
| **Average-case lookup** | O(1) | O(1) |
| **Space** | O(n) | O(n²) worst case |
| **Construction** | O(n) | O(n²) worst case |
| **Dynamic keys** | Yes | No |
| **Use case** | General purpose | Static key sets |

### 10.14.3 Summary of Advanced Techniques

**Consistent Hashing**:
- Use for distributed systems with dynamic server sets
- Minimizes key remapping when servers are added/removed
- Essential for distributed caches, load balancers, CDNs

**Perfect Hashing**:
- Use for static key sets requiring O(1) worst-case lookup
- Common in compilers, symbol tables, static lookup tables
- Trade space for guaranteed performance

Both techniques extend standard hashing for specialized use cases where standard hashing is insufficient.

## 10.15 Summary

Hash tables are one of the most important and widely used data structures in computer science. They provide excellent average-case performance for key-value operations, making them ideal for many applications including databases, caches, symbol tables, and more.

Understanding hash functions, collision resolution strategies, and performance characteristics is crucial for effective use of hash tables. The C++ Standard Library provides excellent implementations in `std::unordered_map` and `std::unordered_set`, but understanding the underlying principles helps in choosing the right data structure and optimizing performance.

In the next chapter, we'll explore graphs, another fundamental data structure that represents relationships and connections between entities.

