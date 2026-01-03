#include <iostream>
#include <vector>
#include <list>
#include <functional>
#include <stdexcept>
#include <algorithm>
#include <chrono>
#include <unordered_map>
#include <unordered_set>
#include <string>
using namespace std;

// ============================================================================
// Hash Table with Separate Chaining
// ============================================================================

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
        cout << "Rehashed: " << oldSize << " -> " << tableSize << endl;
    }
    
public:
    HashTableChaining(size_t initialSize = 16) 
        : tableSize(initialSize), numElements(0) {
        buckets.resize(tableSize);
    }
    
    void insert(const K& key, const V& value) {
        size_t index = hashFunction(key);
        
        auto it = find_if(buckets[index].begin(), buckets[index].end(),
            [&key](const KeyValue& kv) { return kv.key == key; });
        
        if (it != buckets[index].end()) {
            it->value = value;
        } else {
            buckets[index].push_back(KeyValue(key, value));
            numElements++;
        }
        
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
    
    size_t size() const { return numElements; }
    bool empty() const { return numElements == 0; }
    double loadFactor() const { return static_cast<double>(numElements) / tableSize; }
    
    void printStats() const {
        cout << "\n=== Hash Table Statistics ===" << endl;
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
        cout << "============================\n" << endl;
    }
};

// ============================================================================
// Hash Table with Linear Probing
// ============================================================================

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
        
        return tableSize;
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
        
        cout << "Rehashed: " << oldSize << " -> " << tableSize << endl;
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
    
    size_t size() const { return numElements; }
    bool empty() const { return numElements == 0; }
    double loadFactor() const { return static_cast<double>(numElements) / tableSize; }
};

// ============================================================================
// Hash Functions Demonstration
// ============================================================================

size_t hashStringDivision(const string& key, size_t tableSize) {
    size_t hash = 0;
    for (char c : key) {
        hash = (hash * 31 + c) % tableSize;
    }
    return hash;
}

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

size_t hashDJB2(const string& key, size_t tableSize) {
    size_t hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + c;
    }
    return hash % tableSize;
}

// ============================================================================
// Demonstration Functions
// ============================================================================

void demonstrateChaining() {
    cout << "\n=== Hash Table with Separate Chaining ===" << endl;
    
    HashTableChaining<string, int> table(8);
    
    // Insert some values
    table.insert("apple", 5);
    table.insert("banana", 3);
    table.insert("cherry", 8);
    table.insert("date", 2);
    table.insert("elderberry", 6);
    
    // Find values
    int value;
    if (table.find("apple", value)) {
        cout << "Found apple: " << value << endl;
    }
    
    if (table.find("banana", value)) {
        cout << "Found banana: " << value << endl;
    }
    
    // Print statistics
    table.printStats();
    
    // Remove an element
    table.remove("banana");
    cout << "After removing banana:" << endl;
    table.printStats();
}

void demonstrateLinearProbing() {
    cout << "\n=== Hash Table with Linear Probing ===" << endl;
    
    HashTableLinearProbing<string, int> table(8);
    
    table.insert("apple", 5);
    table.insert("banana", 3);
    table.insert("cherry", 8);
    table.insert("date", 2);
    
    int value;
    if (table.find("apple", value)) {
        cout << "Found apple: " << value << endl;
    }
    
    cout << "Load factor: " << table.loadFactor() << endl;
    cout << "Size: " << table.size() << endl;
}

void demonstrateHashFunctions() {
    cout << "\n=== Hash Function Comparison ===" << endl;
    
    vector<string> keys = {"apple", "banana", "cherry", "date", "elderberry"};
    size_t tableSize = 16;
    
    cout << "Key\t\tDivision\tFNV-1a\t\tDJB2" << endl;
    cout << "------------------------------------------------" << endl;
    
    for (const string& key : keys) {
        cout << key << "\t\t"
             << hashStringDivision(key, tableSize) << "\t\t"
             << hashFNV1a(key, tableSize) << "\t\t"
             << hashDJB2(key, tableSize) << endl;
    }
}

void demonstrateSTLHashTables() {
    cout << "\n=== C++ STL Hash Tables ===" << endl;
    
    // unordered_map
    unordered_map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 35;
    
    cout << "Ages:" << endl;
    for (const auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    cout << "\nBucket count: " << ages.bucket_count() << endl;
    cout << "Load factor: " << ages.load_factor() << endl;
    
    // unordered_set
    unordered_set<int> numbers;
    numbers.insert(5);
    numbers.insert(10);
    numbers.insert(15);
    numbers.insert(5); // Duplicate
    
    cout << "\nNumbers in set: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
}

void benchmarkHashTable() {
    cout << "\n=== Hash Table Benchmark ===" << endl;
    
    HashTableChaining<int, int> table;
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
    
    cout << "Operations: " << NUM_OPERATIONS << endl;
    cout << "Insert time: " << insertTime.count() << " microseconds" << endl;
    cout << "Search time: " << searchTime.count() << " microseconds" << endl;
    cout << "Average insert: " << (double)insertTime.count() / NUM_OPERATIONS 
         << " microseconds" << endl;
    cout << "Average search: " << (double)searchTime.count() / NUM_OPERATIONS 
         << " microseconds" << endl;
}

// ============================================================================
// Application Examples
// ============================================================================

void countFrequencies() {
    cout << "\n=== Frequency Counting ===" << endl;
    
    vector<string> words = {"apple", "banana", "apple", "cherry", 
                           "banana", "apple", "date"};
    
    unordered_map<string, int> frequency;
    for (const string& word : words) {
        frequency[word]++;
    }
    
    cout << "Word frequencies:" << endl;
    for (const auto& pair : frequency) {
        cout << pair.first << ": " << pair.second << endl;
    }
}

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> numToIndex;
    
    for (size_t i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (numToIndex.find(complement) != numToIndex.end()) {
            return {numToIndex[complement], static_cast<int>(i)};
        }
        
        numToIndex[nums[i]] = i;
    }
    
    return {};
}

void demonstrateTwoSum() {
    cout << "\n=== Two Sum Problem ===" << endl;
    
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = twoSum(nums, target);
    
    if (!result.empty()) {
        cout << "Indices: [" << result[0] << ", " << result[1] << "]" << endl;
        cout << "Values: [" << nums[result[0]] << ", " << nums[result[1]] << "]" << endl;
    } else {
        cout << "No solution found" << endl;
    }
}

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

void demonstrateDuplicateCheck() {
    cout << "\n=== Duplicate Detection ===" << endl;
    
    vector<int> nums1 = {1, 2, 3, 4, 5};
    vector<int> nums2 = {1, 2, 3, 2, 4};
    
    cout << "Array [1,2,3,4,5] has duplicates: " 
         << (hasDuplicate(nums1) ? "Yes" : "No") << endl;
    cout << "Array [1,2,3,2,4] has duplicates: " 
         << (hasDuplicate(nums2) ? "Yes" : "No") << endl;
}

// ============================================================================
// Main Function
// ============================================================================

int main() {
    cout << "Hash Table Implementations and Demonstrations\n" << endl;
    
    demonstrateChaining();
    demonstrateLinearProbing();
    demonstrateHashFunctions();
    demonstrateSTLHashTables();
    countFrequencies();
    demonstrateTwoSum();
    demonstrateDuplicateCheck();
    benchmarkHashTable();
    
    return 0;
}

