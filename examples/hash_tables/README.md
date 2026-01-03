# Hash Tables Examples

This directory contains comprehensive examples demonstrating hash table implementations and applications.

## Files

- `hash_table_implementations.cpp` - Complete implementations of hash tables with different collision resolution strategies

## Compilation

```bash
# Compile the main example
g++ -std=c++17 -O2 -o hash_table_demo hash_table_implementations.cpp

# Run
./hash_table_demo
```

## What's Included

### 1. Hash Table with Separate Chaining
- Implementation using linked lists for collision resolution
- Automatic rehashing when load factor exceeds threshold
- Statistics tracking (load factor, chain lengths, etc.)

### 2. Hash Table with Linear Probing
- Open addressing implementation
- Handles deleted slots for proper collision resolution
- Automatic rehashing

### 3. Hash Function Demonstrations
- Division method
- FNV-1a hash
- DJB2 hash
- Comparison of hash function distributions

### 4. C++ STL Hash Tables
- `std::unordered_map` usage
- `std::unordered_set` usage
- Custom hash functions

### 5. Application Examples
- Frequency counting
- Two sum problem
- Duplicate detection
- Performance benchmarking

## Key Features Demonstrated

- **Collision Resolution**: Separate chaining and linear probing
- **Rehashing**: Automatic table resizing
- **Load Factor Management**: Maintaining optimal performance
- **Hash Functions**: Multiple hash function implementations
- **Real-world Applications**: Practical use cases
- **Performance Analysis**: Benchmarking and statistics

## Learning Objectives

After studying these examples, you should understand:
1. How hash tables work internally
2. Different collision resolution strategies
3. When to use different hash functions
4. How to implement a hash table from scratch
5. How to use C++ STL hash tables effectively
6. Common applications of hash tables

## Exercises

1. Implement quadratic probing
2. Implement double hashing
3. Add a custom hash function for a struct type
4. Implement a thread-safe hash table
5. Create a hash table with expiration (TTL) support
6. Implement a consistent hash table for distributed systems

