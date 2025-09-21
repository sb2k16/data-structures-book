# Compilation Guide for Data Structures and Algorithms Book

## Overview

This guide provides instructions for compiling and running the C++ code examples found throughout the book chapters.

## Prerequisites

### C++ Compiler Setup

**Option 1: GCC/G++**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install g++

# macOS
brew install gcc

# Verify installation
g++ --version
```

**Option 2: Clang**
```bash
# macOS (comes with Xcode)
xcode-select --install

# Ubuntu/Debian
sudo apt install clang

# Verify installation
clang++ --version
```

## Compilation Commands

### Basic Compilation
```bash
# Basic compilation
g++ -std=c++17 -o program source.cpp

# With debugging information
g++ -std=c++17 -g -o program source.cpp

# With optimization
g++ -std=c++17 -O2 -o program source.cpp

# With warnings
g++ -std=c++17 -Wall -Wextra -o program source.cpp
```

### Recommended Compilation Flags
```bash
# Complete compilation command with all recommended flags
g++ -std=c++17 -Wall -Wextra -Wpedantic -g -O2 -o program source.cpp
```

## Running Code Examples

### From Chapter Files
Most chapter files contain complete, runnable examples. To compile and run:

```bash
# Extract and compile code from a chapter
g++ -std=c++17 -Wall -Wextra -o example ChapterXX_Example.cpp

# Run the example
./example
```

### Individual Code Snippets
For individual code snippets, you may need to add a main function:

```cpp
// Example: Adding main function to a code snippet
#include <iostream>
#include <vector>
using namespace std;

// Your code snippet here
void yourFunction() {
    // Implementation
}

int main() {
    yourFunction();
    return 0;
}
```

## Common Compilation Issues and Solutions

### Issue 1: Missing Headers
**Error**: `'iostream' file not found`
**Solution**: Ensure you have the standard library installed:
```bash
# Ubuntu/Debian
sudo apt install build-essential

# macOS
xcode-select --install
```

### Issue 2: C++17 Features Not Available
**Error**: `'std::make_unique' was not declared`
**Solution**: Use C++17 or later:
```bash
g++ -std=c++17 -o program source.cpp
```

### Issue 3: Template Compilation Issues
**Error**: Template instantiation errors
**Solution**: Include template definitions in header files or use explicit instantiation:
```cpp
// At the end of your file
template class YourTemplateClass<int>;
template class YourTemplateClass<double>;
```

### Issue 4: Memory Management Warnings
**Warning**: `'delete' called on pointer that was not allocated`
**Solution**: Use smart pointers or ensure proper memory management:
```cpp
// Instead of raw pointers
int* ptr = new int(42);
delete ptr;

// Use smart pointers
auto ptr = std::make_unique<int>(42);
// Automatic cleanup
```

## IDE Setup

### Visual Studio Code
1. Install C/C++ extension
2. Create `.vscode/tasks.json`:
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "g++",
            "args": [
                "-std=c++17",
                "-Wall",
                "-Wextra",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

### CLion
1. Open project
2. Configure CMakeLists.txt:
```cmake
cmake_minimum_required(VERSION 3.10)
project(DataStructuresAndAlgorithms)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add your source files
add_executable(example example.cpp)
```

## Testing and Validation

### Unit Testing Framework
Create a simple test framework for validating examples:

```cpp
// test_framework.h
#ifndef TEST_FRAMEWORK_H
#define TEST_FRAMEWORK_H

#include <iostream>
#include <vector>
#include <string>

class TestFramework {
public:
    static int totalTests;
    static int passedTests;
    
    static void assertEqual(int expected, int actual, const std::string& testName) {
        totalTests++;
        if (expected == actual) {
            std::cout << "✓ " << testName << " PASSED" << std::endl;
            passedTests++;
        } else {
            std::cout << "✗ " << testName << " FAILED - Expected: " << expected 
                     << ", Got: " << actual << std::endl;
        }
    }
    
    static void assertTrue(bool condition, const std::string& testName) {
        totalTests++;
        if (condition) {
            std::cout << "✓ " << testName << " PASSED" << std::endl;
            passedTests++;
        } else {
            std::cout << "✗ " << testName << " FAILED" << std::endl;
        }
    }
    
    static void printResults() {
        std::cout << "\nTest Results: " << passedTests << "/" << totalTests << " passed" << std::endl;
    }
};

int TestFramework::totalTests = 0;
int TestFramework::passedTests = 0;

#endif
```

### Running Tests
```bash
# Compile with test framework
g++ -std=c++17 -o test_program source.cpp test_framework.cpp

# Run tests
./test_program
```

## Performance Profiling

### Compile with Profiling Support
```bash
# Debug build with profiling
g++ -std=c++17 -g -pg -o program source.cpp

# Run program to generate profiling data
./program

# Analyze with gprof
gprof program gmon.out > analysis.txt
```

### Memory Leak Detection
```bash
# Compile with address sanitizer
g++ -std=c++17 -fsanitize=address -g -o program source.cpp

# Run with valgrind (Linux)
valgrind --leak-check=full ./program
```

## Project Structure

### Recommended Directory Layout
```
Data Structures/
├── README.md
├── COMPILATION_GUIDE.md
├── Chapter01_Introduction.md
├── Chapter02_Complexity_Analysis.md
├── ...
├── examples/
│   ├── arrays/
│   ├── linked_lists/
│   ├── trees/
│   └── sorting/
├── tests/
│   ├── unit_tests/
│   └── integration_tests/
└── build/
    └── (compiled executables)
```

### Makefile Example
```makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -g -O2
SRCDIR = examples
BUILDDIR = build

SOURCES = $(wildcard $(SRCDIR)/*/*.cpp)
OBJECTS = $(SOURCES:$(SRCDIR)/%.cpp=$(BUILDDIR)/%.o)
EXECUTABLES = $(SOURCES:$(SRCDIR)/%.cpp=$(BUILDDIR)/%)

all: $(EXECUTABLES)

$(BUILDDIR)/%: $(SRCDIR)/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -rf $(BUILDDIR)

.PHONY: all clean
```

## Troubleshooting

### Common Runtime Issues

1. **Segmentation Fault**: Check array bounds and pointer usage
2. **Memory Leaks**: Use smart pointers or ensure proper cleanup
3. **Stack Overflow**: Optimize recursive algorithms or increase stack size
4. **Performance Issues**: Profile code and optimize bottlenecks

### Debugging Tips

1. **Use Debugger**: `gdb ./program` or IDE debugger
2. **Add Print Statements**: Trace execution flow
3. **Check Input Validation**: Ensure inputs are within expected ranges
4. **Test Edge Cases**: Empty inputs, single elements, etc.

## Additional Resources

### Documentation
- [C++ Reference](https://en.cppreference.com/)
- [GCC Manual](https://gcc.gnu.org/onlinedocs/)
- [Clang Documentation](https://clang.llvm.org/docs/)

### Tools
- **Static Analysis**: `cppcheck`, `clang-tidy`
- **Code Formatting**: `clang-format`
- **Documentation**: `doxygen`

### Online Compilers
- [Compiler Explorer](https://godbolt.org/)
- [Repl.it](https://repl.it/)
- [OnlineGDB](https://www.onlinegdb.com/)

## Conclusion

This compilation guide should help you successfully compile and run all the C++ examples in the Data Structures and Algorithms book. Remember to:

1. Use C++17 or later for all examples
2. Enable compiler warnings to catch potential issues
3. Test your code with various inputs
4. Profile performance-critical sections
5. Follow best practices for memory management

Happy coding!
