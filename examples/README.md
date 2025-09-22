# Code Examples

This directory contains runnable code examples that complement the book chapters. Each example is designed to demonstrate specific concepts with practical, executable code.

## Directory Structure

```
examples/
├── arrays/                          # Array and vector examples
│   ├── basic_array_operations.cpp   # Fundamental array operations
│   ├── vector_growth_analysis.cpp   # Vector growth patterns and analysis
│   ├── vector_optimization_tests.cpp # Performance tests and benchmarks
│   └── custom_vector_implementation.cpp # Custom vector implementation
├── linked_lists/                    # Linked list implementations
├── trees/                          # Tree data structure examples
├── sorting/                        # Sorting algorithm implementations
└── stacks_queues/                  # Stack and queue examples
```

## Quick Start

### Compile and Run Examples

```bash
# Build all examples
make all

# Build specific category
make arrays

# Run specific examples
make run-arrays
make run-vector-analysis
make run-vector-tests
make run-custom-vector
```

### Manual Compilation

```bash
# Compile individual examples
g++ -std=c++17 -Wall -Wextra -O2 -o example_name source.cpp

# Run the compiled example
./example_name
```

## Array Examples

### 1. Basic Array Operations (`basic_array_operations.cpp`)
- **Purpose**: Demonstrates fundamental array operations
- **Topics**: Array declaration, initialization, searching, manipulation
- **Run**: `make run-arrays`

### 2. Vector Growth Analysis (`vector_growth_analysis.cpp`)
- **Purpose**: Comprehensive analysis of vector growth mechanisms
- **Topics**: Growth patterns, performance benchmarking, memory analysis
- **Run**: `make run-vector-analysis`
- **Features**:
  - Growth pattern visualization
  - Performance comparison with/without reserve()
  - Memory efficiency calculations
  - Reallocation cost analysis

### 3. Vector Optimization Tests (`vector_optimization_tests.cpp`)
- **Purpose**: Performance tests for vector optimization techniques
- **Topics**: Reserve vs no-reserve, emplace vs push_back, move semantics
- **Run**: `make run-vector-tests`
- **Features**:
  - Reserve performance comparison
  - Emplace vs push_back benchmarks
  - Shrink to fit analysis
  - Move semantics performance tests

### 4. Custom Vector Implementation (`custom_vector_implementation.cpp`)
- **Purpose**: Educational implementation of a simplified vector
- **Topics**: Dynamic memory management, reallocation, RAII
- **Run**: `make run-custom-vector`
- **Features**:
  - Complete vector implementation
  - Move and copy semantics
  - Exception handling
  - Resource management

## Learning Path

### For Beginners
1. Start with `basic_array_operations.cpp`
2. Understand fundamental concepts from Chapter 3
3. Experiment with the code examples

### For Intermediate Learners
1. Study `vector_growth_analysis.cpp` to understand internals
2. Run performance tests with `vector_optimization_tests.cpp`
3. Analyze the custom vector implementation

### For Advanced Learners
1. Modify the custom vector implementation
2. Add new features or optimizations
3. Compare performance with different growth strategies

## Performance Testing

### Benchmarking Guidelines
- Use release builds (`-O2`) for performance tests
- Run tests multiple times for consistent results
- Consider system load when interpreting results
- Use profiling tools for detailed analysis

### Example Benchmark Commands
```bash
# Compile with optimization
g++ -std=c++17 -Wall -Wextra -O2 -o benchmark source.cpp

# Run with time measurement
time ./benchmark

# Profile with valgrind (Linux)
valgrind --tool=callgrind ./benchmark
```

## Code Style

All examples follow consistent coding standards:
- Modern C++17 features
- Clear variable and function names
- Comprehensive comments
- Exception handling where appropriate
- RAII principles

## Contributing

When adding new examples:
1. Follow the existing naming convention
2. Include comprehensive documentation
3. Add appropriate error handling
4. Update this README
5. Add Makefile targets if needed

## Troubleshooting

### Common Issues

**Compilation Errors**
- Ensure C++17 support: `g++ --version`
- Check all required headers are included
- Verify compiler flags

**Runtime Errors**
- Check for out-of-bounds access
- Verify proper initialization
- Use debug builds for debugging

**Performance Issues**
- Use release builds for benchmarks
- Consider system resources
- Profile with appropriate tools

## Resources

- [C++ Reference](https://en.cppreference.com/)
- [Compiler Explorer](https://godbolt.org/) for online testing
- [Valgrind](https://valgrind.org/) for memory debugging
- [Google Benchmark](https://github.com/google/benchmark) for advanced benchmarking
