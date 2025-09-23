# String Search Algorithms Examples

This directory contains comprehensive examples and demonstrations of various string search algorithms, complementing Chapter 7 of the Data Structures and Algorithms book.

## 📁 Files Overview

### Core Implementation
- **`string_search_algorithms.hpp`** - Header file containing all string search algorithm implementations
  - Naive String Search
  - Rabin-Karp Algorithm
  - Knuth-Morris-Pratt (KMP) Algorithm
  - Boyer-Moore Algorithm
  - Z-Algorithm
  - Aho-Corasick Algorithm

### Demonstration Programs
- **`string_search_demo.cpp`** - Interactive demonstration of all algorithms
  - Visual representations of search processes
  - Step-by-step algorithm execution
  - Performance comparisons
  - Practical examples

### Performance Analysis
- **`string_search_benchmarks.cpp`** - Comprehensive performance testing
  - Single pattern search benchmarks
  - Worst-case scenario analysis
  - Multiple pattern search comparison
  - Memory usage analysis
  - Character set impact studies

## 🚀 Quick Start

### Compile and Run Examples

```bash
# Build all string search examples
make string_search

# Run the interactive demo
make run-string-demo

# Run performance benchmarks
make run-string-benchmarks
```

### Individual Compilation

```bash
# Demo program
g++ -std=c++17 -Wall -Wextra -O2 -o string_search_demo string_search_demo.cpp

# Benchmark program
g++ -std=c++17 -Wall -Wextra -O2 -o string_search_benchmarks string_search_benchmarks.cpp
```

## 📊 Algorithm Comparison

| Algorithm | Time Complexity | Space Complexity | Best Use Case |
|-----------|----------------|------------------|---------------|
| Naive | O(n*m) | O(1) | Simple cases, small patterns |
| Rabin-Karp | O(n+m) avg | O(1) | Multiple pattern search |
| KMP | O(n+m) | O(m) | Single pattern, general purpose |
| Boyer-Moore | O(n/m) best | O(m) | Large texts, single pattern |
| Z-Algorithm | O(n+m) | O(n+m) | Pattern preprocessing |
| Aho-Corasick | O(n+m+z) | O(m) | Multiple patterns |

## 🎯 Key Features

### Interactive Demonstrations
- Visual step-by-step algorithm execution
- Pattern matching visualization
- Real-time performance metrics
- Educational examples with explanations

### Comprehensive Benchmarks
- Performance testing across different text sizes
- Pattern length impact analysis
- Character set diversity studies
- Memory usage profiling
- Worst-case scenario testing

### Practical Applications
- Text processing examples
- DNA sequence analysis
- Multiple pattern search
- Case-insensitive search
- Wildcard pattern matching

## 🔧 Usage Examples

### Basic String Search
```cpp
#include "string_search_algorithms.hpp"

string text = "ABABCABABDABABCABAB";
string pattern = "ABABCABAB";

// Using KMP algorithm
KMPAlgorithm kmp;
vector<int> matches = kmp.search(text, pattern);

// Using Boyer-Moore algorithm
BoyerMoore bm;
vector<int> matches = bm.search(text, pattern);
```

### Multiple Pattern Search
```cpp
vector<string> patterns = {"she", "seashells", "shore", "the"};
string text = "she sells seashells by the seashore";

AhoCorasick ac(patterns);
unordered_map<string, vector<int>> results = ac.search(text);
```

### Performance Benchmarking
```cpp
StringSearchBenchmark benchmark;
benchmark.runAllBenchmarks();
```

## 📈 Performance Insights

### Algorithm Selection Guidelines

1. **Small patterns (< 10 characters)**: Naive or KMP
2. **Large texts with single pattern**: Boyer-Moore
3. **Multiple patterns**: Aho-Corasick
4. **General purpose**: KMP
5. **Rolling hash applications**: Rabin-Karp

### Optimization Tips

- Use `reserve()` for known pattern sizes
- Preprocess patterns when searching multiple times
- Choose algorithms based on text characteristics
- Consider memory constraints for large datasets
- Profile your specific use case

## 🧪 Testing

The examples include comprehensive testing scenarios:

- **Unit Tests**: Individual algorithm correctness
- **Integration Tests**: Cross-algorithm consistency
- **Performance Tests**: Speed and memory benchmarks
- **Edge Cases**: Empty strings, single characters, repeated patterns
- **Stress Tests**: Large datasets and worst-case scenarios

## 📚 Educational Value

These examples are designed to help you:

- Understand algorithm internals through step-by-step execution
- Compare performance characteristics across different algorithms
- Learn when to use each algorithm in practice
- Develop intuition for algorithm selection
- Prepare for technical interviews and competitive programming

## 🔍 Advanced Topics

- Rolling hash optimization
- Suffix array construction
- Pattern preprocessing techniques
- Memory-efficient implementations
- Parallel string search algorithms

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional algorithm implementations
- More comprehensive test cases
- Performance optimizations
- Visual algorithm demonstrations
- Interactive learning tools

## 📖 Related Chapters

- [Chapter 3: Basic Data Structures](../../chapters/03-basic-data-structures.md) - String fundamentals
- [Chapter 7: String Search Algorithms](../../chapters/07-string-search-algorithms.md) - Complete theory and implementation
- [Chapter 13: Dynamic Programming](../../chapters/13-dynamic-programming.md) - Advanced pattern matching techniques

---

**Happy Learning!** 🎉

These examples provide hands-on experience with string search algorithms, helping you master one of the most fundamental areas of computer science.
