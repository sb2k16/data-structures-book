# Data Structures on Real Hardware

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![C++](https://img.shields.io/badge/C%2B%2B-17-blue.svg)](https://en.cppreference.com/)
[![Read online](https://img.shields.io/badge/read-online-2a78d6.svg)](https://sb2k16.github.io)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sb2k16/data-structures-book/issues)

**A free book about data structures as the machine actually runs them.**

Here are two loops. They perform the same number of operations on the same number of elements. Every complexity analysis you have ever been taught calls them both `O(n)`.

```cpp
for (int i = 0; i < n; ++i) sum += data[i];         // Loop A
for (int i = 0; i < n; ++i) sum += data[index[i]];  // Loop B — index is a random permutation
```

Loop B takes **thirty to sixty times longer**. Not thirty percent — thirty times. Nothing is hidden: the two loops issue the same instructions and differ only in the *order* in which they touch memory, and that order matters more than almost any algorithmic choice you will make this year.

Most data structures books stop at Big-O. This one keeps going: into cache lines, prefetchers, memory layout, false sharing, and concurrency, because that is where the performance of real systems is decided. Every structure gets its invariants, its failure modes, and its behavior on hardware — not just its interface and its complexity class.

### [→ Read it online](https://sb2k16.github.io), where the benchmarks run on your own CPU

The [memory hierarchy chapter](https://sb2k16.github.io/chapters/memory-hierarchy) measures *your* machine while you read it: the latency of every level of your cache, the cost of a cache miss, and what array-of-structures really charges you. No screenshots of someone else's laptop.

## 📚 Table of Contents

### Part I: Foundations
- [Chapter 1: Introduction to Data Structures and Algorithms](chapters/01-introduction.md)
- [Chapter 2: Time and Space Complexity Analysis](chapters/02-complexity-analysis.md)

### Part II: Linear Data Structures
- [Chapter 3: Basic Data Structures (Arrays and Strings)](chapters/03-basic-data-structures.md)
- [Chapter 3.5: Concurrency Fundamentals for Data Structures](chapters/03.5-concurrency-fundamentals.md)
- [Chapter 3.6: Memory Hierarchy and Performance](chapters/03.6-memory-hierarchy-and-performance.md) — [read the interactive version](https://sb2k16.github.io/chapters/memory-hierarchy)
- [Chapter 4: Linked Lists](chapters/04-linked-lists.md)
- [Chapter 5: Stacks and Queues](chapters/05-stacks-and-queues.md)

### Part III: Non-Linear Data Structures
- [Chapter 6: Trees and Binary Trees](chapters/06-trees-and-binary-trees.md)
- [Chapter 7: String Search Algorithms](chapters/07-string-search-algorithms.md)
- [Chapter 8: Recursion and Backtracking](chapters/08-recursion-and-backtracking.md)
- [Chapter 9: Sorting Algorithms](chapters/09-sorting-algorithms.md)
- [Chapter 10: Hash Tables and Hashing](chapters/10-hash-tables-and-hashing.md)
- [Chapter 11: Graphs](chapters/11-graphs.md)

### Part IV: Algorithm Design Paradigms
- [Chapter 12: Dynamic Programming](chapters/12-dynamic-programming.md)
- [Chapter 13: Searching Algorithms](chapters/13-searching-algorithms.md)
- [Chapter 14: Advanced Data Structures (Heaps, Tries)](chapters/14-advanced-data-structures.md)
- [Chapter 15: Problem Solving Strategies and Practice](chapters/15-problem-solving-strategies.md)
- [Chapter 16: Greedy Algorithms](chapters/16-greedy-algorithms.md)
- [Chapter 17: Divide and Conquer](chapters/17-divide-and-conquer.md)

### Part V: Advanced Topics
- [Chapter 18: Advanced Topics and Modern Optimizations](chapters/18-advanced-topics.md)
- [Chapter 19: Benchmarking and Load Testing](chapters/19-benchmarking-and-load-testing.md)

## 🚀 Quick Start

### Prerequisites
- Basic knowledge of C++ programming
- Understanding of basic programming concepts (variables, loops, functions)
- Familiarity with basic mathematics (algebra, logarithms)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/sb2k16/data-structures-book.git
cd data-structures-book
```

2. Follow the [Compilation Guide](docs/compilation-guide.md) to set up your C++ environment.

3. Start with [Chapter 1](chapters/01-introduction.md) for a gentle introduction.

### Running the website locally

The site in [`web/`](web/) publishes these chapters and adds the live benchmarks. It reads
`chapters/*.md` directly, so the markdown here stays the single source of truth.

```bash
cd web
npm install
npm run dev     # http://localhost:4321
```

See [`web/README.md`](web/README.md) for how the benchmarks avoid measuring the wrong thing —
JIT elimination, prefetcher interference, and the accumulator dependency chain that made an early
version report two very different memory layouts as identical.

## 🏗️ Repository Structure

```
data-structures-book/
├── README.md                           # This file
├── LICENSE                             # MIT License
├── chapters/                          # All book chapters
│   ├── 01-introduction.md
│   ├── 02-complexity-analysis.md
│   ├── 03-basic-data-structures.md
│   ├── 03.5-concurrency-fundamentals.md
│   ├── 03.6-memory-hierarchy-and-performance.md
│   ├── 04-linked-lists.md
│   ├── 05-stacks-and-queues.md
│   ├── 06-trees-and-binary-trees.md
│   ├── 07-string-search-algorithms.md
│   ├── 08-recursion-and-backtracking.md
│   ├── 09-sorting-algorithms.md
│   ├── 10-hash-tables-and-hashing.md
│   ├── 11-graphs.md
│   ├── 12-dynamic-programming.md
│   ├── 13-searching-algorithms.md
│   ├── 14-advanced-data-structures.md
│   ├── 15-problem-solving-strategies.md
│   ├── 16-greedy-algorithms.md
│   ├── 17-divide-and-conquer.md
│   └── 18-advanced-topics.md
├── examples/                          # Runnable code examples
│   ├── arrays/
│   ├── string_search/
│   ├── modern_string_search/
│   ├── linked_lists/
│   ├── trees/
│   ├── sorting/
│   ├── hash_tables/
│   ├── graphs/
│   ├── searching/
│   ├── advanced_data_structures/
│   ├── greedy_algorithms/
│   └── divide_and_conquer/
├── docs/                              # Documentation
│   ├── readme.md                      # Detailed book overview
│   ├── compilation-guide.md           # C++ setup and compilation guide
│   ├── diagram-templates.md           # Reusable Mermaid diagram templates
│   └── diagram-tooling-setup.md       # Tools and setup for diagram generation
└── tests/                             # Unit tests and validation
    ├── unit_tests/
    └── integration_tests/
```

## 🎯 Key Features

- **Comprehensive Coverage**: From basic concepts to advanced topics
- **C++ Implementation**: All code examples in modern C++ (C++17/C++20)
- **Visual Diagrams**: Clear Mermaid diagrams for data structures and algorithms (see [Diagram Templates](docs/diagram-templates.md))
- **Practice Problems**: Exercises and coding challenges
- **Performance Analysis**: Detailed complexity analysis for each algorithm
- **Real-world Applications**: Practical examples and use cases
- **Interview Preparation**: Common patterns and problem-solving strategies

## 🌟 What Makes This Book Different?

Unlike traditional algorithm textbooks, this book uniquely combines:

### 1. **Systems-Level Understanding** 🖥️
- **Memory Hierarchy** (Chapter 3.6): Learn how data structures perform on real hardware
- **Concurrency** (Chapter 3.5): Understand thread-safe data structures
- **Cache-Aware Algorithms**: Optimize for modern CPU architectures
- **Real Performance**: Not just Big-O, but actual running time

### 2. **Modern C++ (C++17/20)** 💻
- Smart pointers and RAII
- Move semantics for efficiency
- STL best practices
- Production-quality code examples

### 3. **Pedagogical Innovation** 📚
- **Core Invariants**: Understand WHY algorithms work
- **Failure Modes**: Learn from common mistakes
- **Decision Frameworks**: Know WHEN to use each approach
- **Cross-Chapter Connections**: Build coherent mental models

### 4. **Interview Success** 💼
- Pattern recognition (Chapter 15)
- Problem-solving strategies
- LeetCode-style problems
- Common interview questions

### 5. **Open Source & Free** 🌍
- Always free and accessible
- Community-driven improvements
- Contributions welcome
- Continuously updated

## 📚 Learning Paths

Choose your path based on your goals:

### 🎯 Path 1: Interview Preparation (8-12 weeks)
**Best for**: Preparing for FAANG/tech company interviews  
**Focus**: Chapters 3-6, 9-15  
**Time**: 10-15 hours/week  
**Outcome**: Ready for technical interviews

### 🎓 Path 2: CS Student (16 weeks)
**Best for**: University students or bootcamp graduates  
**Focus**: All chapters in order  
**Time**: 6-8 hours/week  
**Outcome**: Deep understanding of DSA fundamentals

### 👨‍💻 Path 3: Working Professional (Self-paced)
**Best for**: Engineers filling knowledge gaps  
**Focus**: Pick chapters based on needs  
**Time**: 5-10 hours/week  
**Outcome**: Targeted skill improvement

## 📖 Sample Chapter

**New to the book?** Check out a complete chapter to see our teaching style:

**🔗 [Chapter 10: Hash Tables and Hashing](chapters/10-hash-tables-and-hashing.md)**

This chapter showcases all our unique features:
- Core Invariants explained
- Systems perspective on memory layout
- Practical applications
- Interview problems

## 📊 Diagram Resources

This book uses **Mermaid** diagrams for enhanced visualizations:
- 📐 [Diagram Templates](docs/diagram-templates.md) - Reusable templates for trees, graphs, flowcharts, and more
- 🛠️ [Diagram Tooling Setup](docs/diagram-tooling-setup.md) - Tools and setup instructions
- 🔄 [Diagram Migration Guide](docs/diagram-migration-guide.md) - Converting ASCII to Mermaid

## 📖 Learning Objectives

After completing this book, readers will be able to:
- Understand and implement fundamental data structures
- Analyze algorithm complexity using Big O notation
- Apply appropriate data structures and algorithms to solve problems
- Design efficient solutions to computational problems
- Prepare for technical interviews and competitive programming

## 🎓 Target Audience

- Computer science students
- Software engineers preparing for technical interviews
- Competitive programmers
- Anyone interested in algorithmic thinking

## 🛠️ Development Status

### ✅ Completed Chapters
- [x] Chapter 1: Introduction to Data Structures and Algorithms
- [x] Chapter 2: Time and Space Complexity Analysis
- [x] Chapter 3: Basic Data Structures (Arrays, Strings)
- [x] Chapter 4: Linked Lists
- [x] Chapter 5: Stacks and Queues
- [x] Chapter 6: Trees and Binary Trees
- [x] Chapter 7: String Search Algorithms
- [x] Chapter 8: Recursion and Backtracking
- [x] Chapter 9: Sorting Algorithms
- [x] Chapter 10: Hash Tables and Hashing
- [x] Chapter 11: Graphs
- [x] Chapter 12: Dynamic Programming
- [x] Chapter 13: Searching Algorithms
- [x] Chapter 14: Advanced Data Structures (Heaps, Tries)
- [x] Chapter 15: Problem Solving Strategies and Practice
- [x] Chapter 16: Greedy Algorithms
- [x] Chapter 17: Divide and Conquer
- [x] Chapter 18: Advanced Topics and Modern Optimizations

### 🚧 In Progress
- All chapters completed! 🎉

### 📋 Planned Features
- [ ] Interactive code examples
- [ ] Visual algorithm demonstrations
- [ ] Practice problem sets
- [ ] Video explanations
- [ ] Mobile-friendly format

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution
- Additional chapters and topics
- Code examples and implementations
- Exercises and practice problems
- Documentation improvements
- Bug fixes and optimizations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The computer science community for foundational research
- Contributors and reviewers who help improve this resource
- Open source projects that inspired this work

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sb2k16/data-structures-book/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sb2k16/data-structures-book/discussions)
- **Email**: [Contact Information]

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sb2k16/data-structures-book&type=Date)](https://star-history.com/#sb2k16/data-structures-book&Date)

---

**Happy Learning!** 🎉

If you find this resource helpful, please consider giving it a ⭐ star on GitHub!
