# Dynamic Programming Examples

This directory contains comprehensive examples demonstrating backtracking and memoization techniques in dynamic programming.

## Files

### `backtracking_memoization_demo.cpp`
Demonstrates backtracking algorithms with memoization for solving complex DP problems:

- **N-Queens Problem**: Classic constraint satisfaction problem with memoization
- **Subset Sum Problem**: Finding subsets that sum to a target value
- **Word Break Problem**: Breaking strings into dictionary words
- **Sudoku Solver**: Advanced pruning with backtracking

**Key Features:**
- Systematic exploration of solution space
- Pruning of impossible paths
- Memoization to avoid redundant calculations
- Performance analysis and timing

### `memoization_patterns.cpp`
Advanced memoization patterns and techniques:

- **State Compression**: Efficient state representation using bit manipulation
- **Multi-Dimensional Memoization**: Handling complex parameter spaces
- **Custom Hash Functions**: Optimized hashing for specific data types
- **Memory Optimization**: Cache size management and overflow prevention
- **Template-Based Memoization**: Reusable memoization solutions
- **Performance Analysis**: Comprehensive memoization statistics

**Key Features:**
- Multiple memoization strategies
- Memory management techniques
- Performance profiling and analysis
- Template-based reusable solutions

### `backtracking_practice_solutions.cpp`
Comprehensive solutions to practice problems from Chapter 12:

- **Easy Problems**: Generate Parentheses, Letter Combinations, Subsets
- **Medium Problems**: Permutations, Combination Sum, Word Search, Palindrome Partitioning
- **Hard Problems**: N-Queens, Sudoku, Expression Add Operators, Restore IP Addresses
- **Advanced Problems**: Word Pattern II, Remove Invalid Parentheses, Android Unlock Patterns

**Key Features:**
- Complete solutions with detailed explanations
- Organized by difficulty level
- Covers all major backtracking patterns
- Real-world problem implementations

### `backtracking_tests.cpp`
Comprehensive test suite for backtracking practice problems:

- **Unit Tests**: Individual problem validation
- **Edge Cases**: Empty inputs, single elements, boundary conditions
- **Performance Tests**: Large input validation and timing
- **Integration Tests**: End-to-end problem solving verification

**Key Features:**
- Automated test framework
- Performance benchmarking
- Edge case coverage
- Detailed test reporting

## Compilation and Running

### Prerequisites
- C++17 compatible compiler (g++, clang++, etc.)
- Make utility (optional)

### Compile Individual Files
```bash
# Backtracking and Memoization Demo
g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_memoization_demo backtracking_memoization_demo.cpp

# Memoization Patterns
g++ -std=c++17 -Wall -Wextra -O2 -o memoization_patterns memoization_patterns.cpp

# Backtracking Practice Solutions
g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_practice_solutions backtracking_practice_solutions.cpp

# Backtracking Tests
g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_tests backtracking_tests.cpp
```

### Run Examples
```bash
# Run backtracking demo
./backtracking_memoization_demo

# Run memoization patterns demo
./memoization_patterns

# Run practice problems solutions
./backtracking_practice_solutions

# Run test suite
./backtracking_tests
```

### Using Makefile (from project root)
```bash
# Compile and run backtracking demo
make run-backtracking-demo

# Compile and run memoization patterns
make run-memoization-patterns

# Compile and run practice problems solutions
make run-backtracking-practice

# Compile and run test suite
make run-backtracking-tests
```

## Algorithm Complexity

### Backtracking with Memoization
- **Time Complexity**: O(b^d) where b is branching factor, d is depth
- **Space Complexity**: O(d) for recursion stack + O(m) for memoization
- **Optimization**: Memoization reduces redundant calculations significantly

### Memoization Patterns
- **State Compression**: O(1) compression, O(log n) decompression
- **Multi-Dimensional**: O(n^k) where k is number of dimensions
- **Custom Hash**: O(1) average case, O(n) worst case
- **Memory Optimization**: O(max_cache_size) space usage

## Key Concepts Demonstrated

### 1. Backtracking Principles
- **Systematic Exploration**: Try all possible choices at each step
- **Pruning**: Abandon paths that cannot lead to optimal solutions
- **State Management**: Efficient representation of partial solutions
- **Constraint Satisfaction**: Enforcing problem constraints

### 2. Memoization Techniques
- **Cache Management**: Efficient storage and retrieval of computed results
- **State Representation**: Converting complex states to cacheable keys
- **Memory Optimization**: Preventing cache overflow and memory leaks
- **Performance Profiling**: Measuring and analyzing memoization effectiveness

### 3. Advanced Patterns
- **Template Metaprogramming**: Generic memoization solutions
- **Custom Hash Functions**: Optimized hashing for specific data types
- **State Compression**: Reducing memory usage for complex states
- **Multi-Dimensional Caching**: Handling complex parameter spaces

## Performance Tips

### 1. Memoization Optimization
- Use appropriate data structures for caching
- Implement efficient state compression
- Monitor cache hit rates and memory usage
- Clear cache when memory usage becomes excessive

### 2. Backtracking Optimization
- Implement early pruning to reduce search space
- Use constraint propagation to eliminate invalid choices
- Order choices by likelihood of success
- Implement intelligent variable ordering

### 3. Memory Management
- Set reasonable cache size limits
- Implement cache eviction strategies
- Use memory-efficient state representations
- Monitor memory usage in long-running programs

## Example Output

### Backtracking Demo
```
=== N-Queens Problem with Memoization ===
4-Queens: 2 solutions in 1ms
5-Queens: 10 solutions in 2ms
6-Queens: 4 solutions in 5ms
7-Queens: 40 solutions in 15ms
8-Queens: 92 solutions in 45ms

=== Subset Sum Problem with Memoization ===
Numbers: 3 34 4 12 5 2 
Target: 9
Can make sum 9
Subsets that sum to 9:
  3 + 4 + 2 = 9
  4 + 5 = 9
```

### Memoization Patterns
```
=== State Compression Memoization ===
State compression completed in 245 microseconds
Cache size: 1000 entries

=== Multi-Dimensional Memoization ===
3D Knapsack result: 220
Computed in 156 microseconds
Memoization cache size: 125 entries
```

## Further Reading

- Chapter 12: Dynamic Programming (main book)
- Advanced memoization techniques
- Backtracking algorithm optimization
- Constraint satisfaction problems
- Performance analysis and profiling

## Contributing

When adding new examples:
1. Follow the existing code style and structure
2. Include comprehensive comments and documentation
3. Add performance analysis and complexity information
4. Test with various input sizes and edge cases
5. Update this README with new examples
