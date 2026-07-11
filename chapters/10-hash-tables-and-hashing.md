# Chapter 10: Hash Tables and Hashing

## 10.1 Problem Statement & Motivation

### What Problem Do Hash Tables Solve?

Many applications require fast lookup by key:

- Finding a user by ID in a database
- Checking if an element exists in a set
- Mapping names to values (dictionaries)
- Counting frequencies of items

**Naive Approaches and Their Limitations**:

- **Linear Search**: O(n) time - too slow for large datasets
- **Sorted Array + Binary Search**: O(log n) time - better, but still logarithmic
- **Balanced Trees**: O(log n) time - good, but requires ordering

**The Hash Table Solution**: Hash tables aim for **O(1) average-time** operations by using a hash function to map keys directly to array indices, bypassing the need for ordering or sequential search.

Reach for a hash table when lookups by key dominate, order does not matter, and average-case performance with modest memory overhead is acceptable — database indexing, caches (LRU/LFU), compiler symbol tables, frequency counting, deduplication, and language dictionaries (`std::unordered_map`, Python `dict`, Java `HashMap`). Avoid them when you need ordered traversal, min/max, or range queries (use `std::map` or a BST), when worst-case latency must be tightly bounded (a hash table can degrade to O(n)), or when memory is severely constrained. The core trade-off: hash tables give up **predictability and ordering** for **speed**.

## 10.2 Conceptual Overview

A **hash table** (also called a hash map) is a data structure that implements an associative array, mapping keys to values using a hash function to compute array indices.

### Intuitive Explanation

Think of a hash table like a library catalog system:
- **Keys** are book titles
- **Hash function** determines which shelf (bucket) to check
- **Values** are the actual books
- **Collisions** occur when multiple books map to the same shelf (handled by chaining or probing)

### Key Characteristics

- **Fast average-case performance**: O(1) for insert, delete, and search operations
- **Key-value storage**: Stores data as key-value pairs
- **Hash function**: Maps keys to array indices
- **Collision handling**: Manages cases where multiple keys map to the same index
- **Dynamic resizing**: Grows and shrinks as needed

### Comparison with Other Data Structures

| Operation | Hash Table | Array | Binary Search Tree | Linked List |
|-----------|------------|-------|-------------------|-------------|
| Search | O(1) avg | O(1) | O(log n) | O(n) |
| Insert | O(1) avg | O(n) | O(log n) | O(1) |
| Delete | O(1) avg | O(n) | O(log n) | O(n) |
| Space | O(n) | O(n) | O(n) | O(n) |
| Ordered | No | Yes | Yes | Yes |
| Worst-case | O(n) | O(1) | O(log n) | O(n) |

## 10.3 Abstract Model & Invariants

Understanding hash table invariants is crucial for correct implementation and reasoning. This section defines correctness **independent of any implementation**.

### Abstract Model

A hash table consists of:

1. **A fixed-size array of buckets** (or slots)
2. **A hash function** `h: Key → [0, m-1]` mapping keys to bucket indices
3. **A collision resolution strategy** for handling keys that map to the same bucket

We define the abstract operation:

```
index = hash(key) mod table_size
```

### Core Invariants

These invariants must **always** hold for a hash table to be correct:

#### 1. Hash Function Invariant

- **Determinism**: Same key always maps to same bucket: `hash(k₁) = hash(k₂) ⟹ k₁ = k₂` (for hash equality)
- **Distribution**: Hash function distributes keys uniformly across buckets
- **Efficiency**: Hash computation is O(1) time

**What breaks it**: Non-deterministic hash function, poor distribution causing clustering

#### 2. Key-Value Mapping Invariant

- **Uniqueness**: Each key maps to at most one value
- **Update semantics**: Inserting same key updates existing value (or handles collision correctly)
- **No duplicates**: No duplicate keys exist in the table

**What breaks it**: Incorrect collision handling, keys lost or overwritten

#### 3. Load Factor Invariant

- **Definition**: Load factor `α = n / m` where `n` = number of elements, `m` = table size
- **Threshold**: Must stay below threshold (typically 0.75) to maintain O(1) performance
- **Rehashing**: When exceeded, rehashing must occur to restore performance

**What breaks it**: Load factor too high degrades to O(n) performance

#### 4. Collision Resolution Invariant

- **Correctness**: All keys that hash to same bucket are stored correctly
- **Consistency**: Collision resolution method (chaining/probing) is consistently applied
- **Completeness**: Search/insert/delete operations handle collisions correctly

**What breaks it**: Inconsistent collision handling, keys not found due to incorrect probing

### How Operations Preserve Invariants

- **Insert**: Compute hash (preserves hash function invariant) → handle collision (preserves collision resolution invariant) → update load factor → rehash if needed (restores load factor invariant)
- **Delete**: Compute hash → locate key → remove → update load factor
- **Rehash**: Create larger table → recompute all hashes → redistribute keys → restores load factor invariant

This builds on the **array representation** concepts from Chapter 3, but hash tables add the complexity of hash functions and collision resolution.

## 10.4 Operations & Interface

A hash table supports the following core operations:

| Operation | Description | Precondition | Postcondition |
|-----------|-------------|-------------|---------------|
| `insert(key, value)` | Adds or updates key-value pair | Key is valid | Key maps to value, load factor updated |
| `search(key)` | Finds value for given key | Key is valid | Returns value if found, error/None if not |
| `delete(key)` | Removes key-value pair | Key exists in table | Key removed, load factor updated |
| `size()` | Returns number of elements | - | Returns current count |
| `empty()` | Checks if table is empty | - | Returns true if no elements |
| `loadFactor()` | Returns current load factor | - | Returns α = n/m |

### Behavioral Guarantees

- **Insert**: If key exists, updates value; otherwise adds new entry. May trigger rehashing.
- **Search**: Returns value if key exists; otherwise indicates not found.
- **Delete**: Removes key if present; otherwise no-op. May trigger rehashing.
- **Load Factor**: Always reflects current occupancy. Rehashing occurs when threshold exceeded.

### Interface Contract

**Preconditions**:
- Keys must be hashable (support hash function)
- Keys must support equality comparison
- Table must have sufficient capacity (or support dynamic resizing)

**Postconditions**:
- All invariants preserved after each operation
- Load factor maintained below threshold
- No duplicate keys exist

## 10.5 Time & Space Complexity

### Time Complexity

| Operation | Average Case | Worst Case | Amortized |
|-----------|--------------|------------|-----------|
| Insert | O(1) | O(n) | O(1) |
| Search | O(1) | O(n) | O(1) |
| Delete | O(1) | O(n) | O(1) |
| Rehash | O(n) | O(n) | O(1) per insert |

**Important Notes**:
- **O(1) is expected, not guaranteed**: Worst case occurs with poor hash function or adversarial input
- **Amortized O(1)**: Rehashing cost amortized across all inserts
- **Worst case O(n)**: All keys hash to same bucket (extremely rare with good hash function)

### Space Complexity

- **Space**: O(n) where n is the number of elements
- **Overhead**: 
  - Separate Chaining: O(n) for pointers + O(m) for buckets
  - Open Addressing: O(m) for table slots (m ≥ n)
- **Load Factor Impact**: Higher load factor = less wasted space but more collisions

### Factors Affecting Performance

1. **Hash Function Quality**: Poor hash functions cause clustering → O(n) worst case
2. **Load Factor**: High load factors increase collisions → degraded performance
3. **Collision Resolution**: Different methods have different characteristics
4. **Data Distribution**: Skewed data can degrade performance

## 10.6 Understanding Hash Functions

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

### Hashing Custom Types

To use your own type as a key, specialize `std::hash` (and provide `operator==`). Combine the hashes of the members rather than relying on any single field:

```cpp
#include <functional>
#include <string>

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

## 10.7 Collision Resolution Strategies

When two or more keys hash to the same index, we have a **collision**. The two dominant strategies — separate chaining and open addressing — differ chiefly in their memory layout, which (as the Systems Perspective below makes concrete) is really a cache-locality argument.

### 10.7.1 Separate Chaining

In **separate chaining**, each bucket contains a linked list (or other data structure) of all entries that hash to the same index.

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

Chaining is simple, handles any number of collisions, and makes deletion trivial (just unlink the node). Its cost is systemic: every node is a separate heap allocation reached by pointer chasing, so it wastes memory on pointers and — the point the Systems Perspective develops below — suffers poor cache locality. Worst case still degrades to O(n) when all keys land in one bucket.

### 10.7.2 Open Addressing

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

**Quadratic probing** spreads the probe sequence out quadratically instead of sequentially: for a key with initial hash `h(k)`, it probes `(h(k) + i²) mod m` for `i = 0, 1, 2, …`. This breaks up the long runs of occupied slots (primary clustering) that plague linear probing.

It has two costs. First, **secondary clustering**: keys with the same initial hash follow the same probe sequence, though this is milder than primary clustering. Second, the probe sequence only visits all slots if the **table size is prime** (the quadratic residues then form a complete set); with a non-prime size, inserts can fail even when empty slots exist. Deletion, as with all open addressing, requires tombstones (a `DELETED` status) rather than truly clearing a slot. Average case is O(1); keep the load factor below ~0.7.

One implementation note: `(startIndex + probeCount * probeCount) % tableSize` can overflow for large tables. Reduce the squared term first: `(startIndex + (probeCount * probeCount) % tableSize) % tableSize`.

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

**Double hashing** uses two independent hash functions: `h₁(k)` sets the initial position and `h₂(k)` sets a per-key step size. The probe sequence is `(h₁(k) + i·h₂(k)) mod m`. Because the step size varies by key, two keys that collide at `h₁` diverge immediately — this eliminates both primary and secondary clustering and gives the best distribution of the open-addressing schemes, at the cost of a second hash computation and slightly worse cache locality than linear probing's sequential scan.

The secondary hash `h₂(k)` must satisfy two properties:

1. **Non-zero step**: if `h₂(k) = 0` the sequence never advances. The standard form `h₂(k) = 1 + (hash(k) % (m - 1))` guarantees `h₂(k) ∈ [1, m-1]`.
2. **Coprime with `m`**: `gcd(h₂(k), m) = 1`, so the sequence visits every slot before repeating. If `gcd = d > 1`, only `m/d` slots are reached. Using a **prime table size** makes any `h₂(k) ∈ [1, m-1]` automatically coprime with `m`.

Double hashing tolerates higher load factors (0.8–0.9) than linear probing; expected probes for a successful search are roughly `1/(1-α)`. Because `h₂` depends on `m`, rehashing recomputes every step size, redistributing keys. It is common in database hash indexes/joins, compiler symbol tables, and high-performance map implementations.

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


## 10.8 Real-World Implementations

### C++ Standard Library Hash Tables

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

## 10.9 Load Factor and Rehashing

### Load Factor

The **load factor** is the ratio of the number of elements to the number of buckets:

```
Load Factor = Number of Elements / Number of Buckets
```

### 10.9.1 Systems Perspective: Memory Hierarchy and Performance

Understanding hash table behavior at the system level reveals critical performance considerations. This section applies the memory hierarchy concepts from [Chapter 3.6](03.6-memory-hierarchy-and-performance.md) to hash tables.

For comprehensive coverage of memory hierarchy, cache behavior, CPU cycles, and performance optimization, see Chapter 3.6. Here we focus on hash table-specific implications.

#### Memory Hierarchy Impact on Hash Tables

The memory hierarchy (registers → L1 → L2 → L3 → RAM → disk) dominates hash table performance. Each level is roughly 10–100x slower but 10–100x larger than the one above it: an L1 hit costs ~3–5 cycles, an L3 hit ~40–75, and a main-memory access ~100–300 cycles. A hash lookup that misses to RAM is therefore an order of magnitude slower than one served from cache — which is why the *layout* a collision scheme imposes matters as much as its asymptotic complexity. See Section 3.6.2 for the full memory pyramid.

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

Rehashing is amortized O(1) per insert, but each rehash is a single O(n) event that can stall an operation. It does four things: allocate a new table (2x, cold memory — possibly an OS syscall if the heap is exhausted), recompute all hashes (~10–50 cycles/key, CPU-bound), redistribute every element (sequential reads from the old table, but *random* cache-unfriendly writes into the new one — the dominant cost), and free the old table. The random writes are why redistribution dominates: they miss cache far more often than the sequential reads.

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

That single insert costs ~95M cycles versus ~5–50 for a normal cache-hit insert — a latency spike of roughly six orders of magnitude. Peak memory is also ~3x normal during the rehash, since the old and new tables coexist. This is a classic **failure mode**: a table sized for the average case periodically freezes on the tail.

Mitigations, in order of effectiveness: **pre-allocate** with `reserve(expected_size)` to skip rehashing entirely when the size is known; **incremental rehashing** (migrate a fixed fraction of elements per operation) to trade a little steady-state throughput for no spikes; **load-factor tuning** (0.7–0.75 balances space against rehash frequency); and **memory pools** to cut allocation overhead and fragmentation.

**When hash tables become a bottleneck:** a poor hash function (clustering → O(n) — switch to FNV-1a or MurmurHash); frequent rehashing (pre-allocate or rehash incrementally); a table larger than cache (cache thrashing — shard or use a cache-conscious layout); and many small tables (fragmentation — use pools or fewer, larger tables).

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
    HashTableChaining<string, int> table(4); // Small initial size
    
    // Insert elements until rehashing occurs
    for (int i = 0; i < 10; i++) {
        table.insert("key" + to_string(i), i);
        cout << "After insert " << i << ": Load factor = " 
             << table.loadFactor() << endl;
    }
}
```

## 10.10 Applications of Hash Tables

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

## 10.11 Common Hash Table Problems

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

### Best Practices

- **Hash function**: prefer built-in `std::hash`; for custom types ensure the members are combined for good distribution; use cryptographic hashes only where an adversary could craft collisions.
- **Load factor**: keep it in the 0.5–0.75 range, rehash on exceed, and pre-size the table from the expected element count to avoid mid-workload rehash spikes.
- **Collision strategy**: chaining when the distribution is unknown and deletions are frequent; open addressing (linear probing) when cache performance matters; double hashing for the best distribution at high load.
- **Concurrency**: guard shared tables with synchronization — `std::shared_mutex` for read-heavy workloads — and reach for a proven library rather than a hand-rolled lock-free table.

## 10.12 Exercises & Thought Questions

### Conceptual Questions

1. **Why is the worst-case time complexity of hash tables O(n)?**
   - Explain the scenario that causes worst-case performance
   - How can this be mitigated?

2. **What is the relationship between load factor and performance?**
   - Why does performance degrade as load factor increases?
   - What is an optimal load factor threshold?

3. **Compare separate chaining and open addressing:**
   - When would you choose each?
   - What are the trade-offs?

4. **Explain why rehashing is necessary:**
   - What happens if we never rehash?
   - How does rehashing maintain amortized O(1) performance?

### Implementation Tasks

1. **Implement a hash table with separate chaining**
   - Support insert, search, delete operations
   - Implement automatic rehashing
   - Handle edge cases (empty table, duplicate keys)

2. **Implement a hash table with linear probing**
   - Support insert, search, delete operations
   - Handle deleted slots correctly
   - Implement rehashing

3. **Design a hash function for strings**
   - Use polynomial rolling hash
   - Ensure good distribution
   - Handle edge cases (empty string, very long strings)

### Performance Reasoning

1. **Analyze cache behavior:**
   - Why is open addressing more cache-friendly than separate chaining?
   - How many cache misses occur in a chain of length 10?
   - How does this affect real-world performance?

2. **Amortized analysis:**
   - Prove that insert is amortized O(1) with rehashing
   - What is the amortized cost per operation?

3. **Hash function quality:**
   - Design an adversarial input that causes worst-case performance
   - How can universal hashing prevent this?

### Interview-Style Problems

1. **Design a Hash Set** (LeetCode 705)
2. **First Unique Character** (LeetCode 387)
3. **Group Anagrams** (LeetCode 49)
4. **Longest Consecutive Sequence** (LeetCode 128)
5. **Two Sum** (LeetCode 1)

See Section 10.16 for solutions to these problems.

## 10.13 Key Takeaways

1. **Hash tables** provide average O(1) operations for insert, search, and delete
2. **Hash functions** must be deterministic, fast, and provide uniform distribution
3. **Collision resolution** is essential - choose chaining or open addressing based on use case
4. **Load factor** affects performance - maintain it between 0.5-0.75
5. **Rehashing** is necessary when load factor exceeds threshold
6. **C++ STL** provides `unordered_map` and `unordered_set` for hash table needs
7. **Applications** are vast - caching, indexing, frequency counting, and more

### Extension Exercises

1. Replace each chaining bucket's linked list with a balanced BST (Java 8's `HashMap` treeification).
2. Add a template parameter for a custom hash functor.
3. Make table sizes prime and grow to the next prime on rehash.
4. Maintain insertion order (like Java's `LinkedHashMap`).
5. Add TTL/expiration support and per-table statistics (hit rate, collision count).
6. Build a thread-safe variant with mutexes, then compare against striped locking.

## 10.14 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to hash tables. See Section 3.5.3 for invariant-based reasoning and Section 3.5.8 for lock granularity tradeoffs.

### 10.14.1 Shared-State Invariants

**Core Hash Table Invariants** (see Section 3.5.3):
1. **Bucket Invariant**: "Each key maps to exactly one bucket"
2. **Collision Chain Invariant**: "Keys in same bucket form valid chain (chaining) or valid probe sequence (open addressing)"
3. **Load Factor Invariant**: "Load factor = size/capacity (used for rehashing decisions)"

**What Must Not Be Observed Half-Updated**:
- Bucket chain modifications during insertion
- Table pointer updates during rehashing
- Size changes while elements are being inserted/removed

### 10.14.2 Operations That Must Be Atomic

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

### 10.14.3 Naïve Approaches and Why They Fail

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

### 10.14.4 Locking Strategies

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

### 10.14.5 Performance and Scalability Implications

**Contention** (see Section 3.5.8):
- Coarse-grained locking: Very high contention, throughput collapses
- Fine-grained locking: Lower contention, but rehashing complexity
- Striped locking: Good balance

**False Sharing**: Less relevant (buckets scattered in memory)

**Throughput Collapse Under Load**:
- With many threads, coarse-grained locking becomes severe bottleneck
- Fine-grained or striped locking helps significantly

### 10.14.6 When Not to Do This Yourself

**Use Library Implementations**:
- `std::unordered_map` with external synchronization
- Thread-safe hash tables from well-tested libraries
- Lock-free implementations from proven libraries (see Section 3.5.9)

**Avoid Premature Optimization**:
- Start with coarse-grained locking
- Only optimize to fine-grained/striped if profiling shows it's necessary
- Lock-free hash tables are research-level (see Section 3.5.9 warning)

**For Production**: Prefer `std::unordered_map` with external synchronization or thread-safe hash tables from proven libraries. See Section 3.5.10 for guidance on using libraries.

## 10.15 Advanced Hashing Techniques

### 10.15.1 Consistent Hashing

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

### 10.15.2 Perfect Hashing

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

### 10.15.3 Summary of Advanced Techniques

**Consistent Hashing**:
- Use for distributed systems with dynamic server sets
- Minimizes key remapping when servers are added/removed
- Essential for distributed caches, load balancers, CDNs

**Perfect Hashing**:
- Use for static key sets requiring O(1) worst-case lookup
- Common in compilers, symbol tables, static lookup tables
- Trade space for guaranteed performance

Both techniques extend standard hashing for specialized use cases where standard hashing is insufficient.

## 10.16 Summary

Hash tables are one of the most important and widely used data structures in computer science. They provide excellent average-case performance for key-value operations, making them ideal for many applications including databases, caches, symbol tables, and more.

Understanding hash functions, collision resolution strategies, and performance characteristics is crucial for effective use of hash tables. The C++ Standard Library provides excellent implementations in `std::unordered_map` and `std::unordered_set`, but understanding the underlying principles helps in choosing the right data structure and optimizing performance.

In the next chapter, we'll explore graphs, another fundamental data structure that represents relationships and connections between entities.

