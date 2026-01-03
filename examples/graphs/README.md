# Graphs Examples

This directory contains comprehensive examples demonstrating graph data structures and algorithms.

## Files

- `graph_implementations.cpp` - Complete implementations of graph algorithms including DFS, BFS, Dijkstra, Kruskal, and more
- `disjoint_sets.cpp` - Comprehensive examples of Union-Find (Disjoint Sets) data structure with optimizations and applications

## Compilation

```bash
# Compile the main example
g++ -std=c++17 -O2 -o graph_demo graph_implementations.cpp

# Compile disjoint sets example
g++ -std=c++17 -O2 -o disjoint_sets disjoint_sets.cpp

# Run
./graph_demo
./disjoint_sets
```

## What's Included

### 1. Graph Representations
- **Adjacency Matrix**: 2D array representation for dense graphs
- **Adjacency List**: List-based representation for sparse graphs
- Comparison and use cases

### 2. Graph Traversal
- **Depth-First Search (DFS)**: Recursive and iterative implementations
- **Breadth-First Search (BFS)**: Level-order traversal
- Shortest path in unweighted graphs

### 3. Shortest Path Algorithms
- **Dijkstra's Algorithm**: Shortest paths with non-negative weights
- Path reconstruction
- Distance calculation

### 4. Minimum Spanning Tree
- **Kruskal's Algorithm**: MST using union-find data structure
- Edge sorting and cycle detection

### 5. Disjoint Sets (Union-Find)
- **Naive Implementation**: Basic union-find without optimizations
- **Path Compression**: Optimized find operation
- **Union by Rank**: Balanced tree structure
- **Union by Size**: Alternative optimization strategy
- **Applications**: Connected components, cycle detection, Kruskal's MST

### 6. Advanced Algorithms
- **Topological Sort**: Ordering vertices in a DAG
- **Cycle Detection**: Detecting cycles in directed graphs
- **Connected Components**: Finding all connected components

## Key Features Demonstrated

- **Graph Representations**: Matrix vs. List trade-offs
- **Traversal Algorithms**: DFS and BFS with applications
- **Shortest Path**: Dijkstra's algorithm implementation
- **MST Algorithms**: Kruskal's algorithm with union-find
- **Graph Analysis**: Cycle detection and connectivity

## Learning Objectives

After studying these examples, you should understand:
1. How to represent graphs (matrix and list)
2. How to traverse graphs (DFS and BFS)
3. How to find shortest paths (Dijkstra)
4. How to find minimum spanning trees (Kruskal)
5. How to implement and optimize disjoint sets (Union-Find)
6. How to perform topological sorting
7. How to detect cycles and find connected components

## Graph Algorithms Complexity

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| DFS | O(V + E) | O(V) |
| BFS | O(V + E) | O(V) |
| Dijkstra | O((V + E) log V) | O(V) |
| Kruskal | O(E log E) | O(V) |
| Union-Find (optimized) | O(α(V)) amortized | O(V) |
| Topological Sort | O(V + E) | O(V) |

## Exercises

1. Implement Prim's algorithm for MST
2. Implement Bellman-Ford algorithm for shortest paths
3. Implement Floyd-Warshall for all-pairs shortest paths
4. Add support for weighted graphs in all algorithms
5. Implement strongly connected components algorithm
6. Create a function to find articulation points
7. Implement graph coloring algorithms
8. Create a function to check if a graph is bipartite
9. Implement Eulerian path/cycle detection
10. Add graph visualization capabilities

