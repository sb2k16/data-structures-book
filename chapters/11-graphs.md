# Chapter 11: Graphs

## 11.1 Introduction to Graphs

A **graph** is a collection of vertices (nodes) connected by edges. Unlike trees (Chapter 6), graphs can have cycles and multiple paths between vertices, making them ideal for modeling complex relationships.

### Key Characteristics

- **Vertices (Nodes)**: The fundamental units
- **Edges**: Connections between vertices (can be directed/undirected, weighted/unweighted)
- **Cyclic/Acyclic**: Can contain cycles (unlike trees from Chapter 6)

### Why Graphs Matter

Graphs model real-world relationships (networks, dependencies, maps) and are fundamental to many algorithms. They're essential for system design (routing, scheduling) and frequently appear in technical interviews.

### Graph vs. Trees

| Feature | Tree | Graph |
|---------|------|-------|
| Connectivity | Connected | Can be disconnected |
| Cycles | No cycles | Can have cycles |
| Root | Has a root | No root |
| Parent-Child | Hierarchical | No hierarchy |
| Edges | n-1 edges (n nodes) | Can have any number |

### 11.1.1 Core Invariants

Understanding graph invariants helps reason about graph algorithms and representations.

#### Core Invariants of a Graph

1. **Edge Consistency Invariant**:
   - If edge (u, v) exists in undirected graph, then (v, u) must be represented
   - If edge (u, v) exists in directed graph, (v, u) may or may not exist
   - Edge representation matches graph type (directed/undirected)

2. **Vertex-Edge Relationship Invariant**:
   - Every edge connects exactly two vertices (or one vertex to itself for self-loops)
   - Vertices referenced by edges must exist in the graph
   - No dangling edges (edges pointing to non-existent vertices)

3. **Representation Consistency Invariant**:
   - Adjacency list/matrix accurately reflects all edges
   - No duplicate edges (unless multigraph)
   - Graph representation matches graph structure

4. **Weight Invariant** (for weighted graphs):
   - All edges have valid weights
   - Weight values are consistent with graph semantics (distances, costs, etc.)

#### What Breaks Invariants

- **Inconsistent edge representation**: Undirected graph with only one direction stored → breaks edge consistency
- **Dangling references**: Edge points to deleted vertex → breaks vertex-edge relationship
- **Stale adjacency data**: Vertex deleted but edges remain → breaks representation consistency
- **Invalid weights**: Negative weights in distance graph → breaks weight invariant

#### How Operations Restore Invariants

- **Add edge**: Update both vertices' adjacency lists/matrix → preserves edge consistency
- **Remove vertex**: Remove all incident edges first → preserves vertex-edge relationship
- **Update representation**: Rebuild adjacency structure → restores representation consistency

**Example**: When adding an edge (u, v) to an undirected graph:
1. Add v to u's adjacency list (preserves edge consistency)
2. Add u to v's adjacency list (preserves edge consistency for undirected graph)
3. Update adjacency matrix if used (preserves representation consistency)

Note: This builds on the **connectivity invariant** we established in Chapter 6 (Trees), but graphs relax the acyclicity constraint. Unlike trees, graphs can have cycles and multiple paths between vertices, which requires different representation strategies (adjacency matrix vs. list) as we'll see next.

## 11.2 Graph Terminology

### Basic Terms

- **Vertex (Node)**: A point in the graph
- **Edge**: A connection between two vertices
- **Adjacent Vertices**: Vertices connected by an edge
- **Degree**: Number of edges incident to a vertex
  - **In-degree**: Number of incoming edges (directed graphs)
  - **Out-degree**: Number of outgoing edges (directed graphs)
- **Path**: Sequence of vertices connected by edges
- **Cycle**: Path that starts and ends at the same vertex
- **Connected Graph**: Every vertex is reachable from every other vertex
- **Subgraph**: A graph formed by a subset of vertices and edges

### Graph Types

#### 1. Undirected Graph
Edges have no direction - connection is bidirectional.

```
A --- B
|     |
C --- D
```

#### 2. Directed Graph (Digraph)
Edges have direction - connection is one-way.

```
A --> B
^     |
|     v
D <-- C
```

#### 3. Weighted Graph
Edges have associated weights (costs, distances, etc.).

```
A --5-- B
|       |
3       2
|       |
C --1-- D
```

#### 4. Unweighted Graph
All edges have equal weight (or no weight).

#### 5. Complete Graph
Every pair of vertices is connected by an edge.

#### 6. Bipartite Graph
Vertices can be divided into two sets such that no edges exist within the same set.

## 11.3 Graph Representations

### 11.3.1 Adjacency Matrix

An **adjacency matrix** is a 2D array where `matrix[i][j]` indicates if there's an edge between vertex `i` and vertex `j`.

#### Implementation
```cpp
#include <iostream>
#include <vector>
#include <limits>
using namespace std;

class GraphMatrix {
private:
    vector<vector<int>> adjMatrix;
    int numVertices;
    bool directed;
    
public:
    GraphMatrix(int vertices, bool isDirected = false) 
        : numVertices(vertices), directed(isDirected) {
        adjMatrix.resize(vertices, vector<int>(vertices, 0));
    }
    
    void addEdge(int from, int to, int weight = 1) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjMatrix[from][to] = weight;
            if (!directed) {
                adjMatrix[to][from] = weight;
            }
        }
    }
    
    void removeEdge(int from, int to) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjMatrix[from][to] = 0;
            if (!directed) {
                adjMatrix[to][from] = 0;
            }
        }
    }
    
    bool hasEdge(int from, int to) const {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            return adjMatrix[from][to] != 0;
        }
        return false;
    }
    
    int getWeight(int from, int to) const {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            return adjMatrix[from][to];
        }
        return 0;
    }
    
    void print() const {
        cout << "Adjacency Matrix:" << endl;
        cout << "  ";
        for (int i = 0; i < numVertices; i++) {
            cout << i << " ";
        }
        cout << endl;
        
        for (int i = 0; i < numVertices; i++) {
            cout << i << " ";
            for (int j = 0; j < numVertices; j++) {
                cout << adjMatrix[i][j] << " ";
            }
            cout << endl;
        }
    }
    
    int getNumVertices() const { return numVertices; }
};
```

#### Advantages and Disadvantages

**Advantages:**
- O(1) edge lookup
- Simple to implement
- Easy to check if edge exists
- Good for dense graphs

**Disadvantages:**
- O(V²) space complexity
- Inefficient for sparse graphs
- Adding/removing vertices is expensive

### 11.3.1.1 Systems Perspective: Memory Layout and Cache Behavior

Understanding graph representation at the system level reveals critical performance trade-offs.

#### Memory Layout Comparison

**Adjacency Matrix:**
- **Memory Layout**: Contiguous 2D array (like 2D arrays from Chapter 3)
- **Cache Performance**: Excellent for dense graphs - sequential access patterns
- **Memory Overhead**: O(V²) - significant for large graphs
- **Access Pattern**: Random access for edge queries, but matrix is cache-friendly

**Adjacency List:**
- **Memory Layout**: Array of linked lists (combines arrays from Chapter 3 with linked lists from Chapter 4)
- **Cache Performance**: Poor - pointer chasing causes cache misses
- **Memory Overhead**: O(V + E) - efficient for sparse graphs
- **Access Pattern**: Sequential within each list, but jumping between lists hurts cache

**Performance Comparison (Real-World):**
```
Operation          | Adjacency Matrix | Adjacency List
-------------------|------------------|---------------
Edge Query         | ~5 cycles        | ~50-100 cycles
Iterate Neighbors  | O(V) scans       | O(degree) - cache-friendly
Memory (sparse)    | O(V²)            | O(V + E) - much better
Cache Misses       | 0-1 per query    | 2-5 per neighbor
```

#### When Each Representation Wins

**Use Adjacency Matrix When:**
- Graph is dense (E ≈ V²)
- Need frequent edge existence checks
- Cache performance matters more than memory
- Graph is small enough to fit in memory

**Use Adjacency List When:**
- Graph is sparse (E << V²)
- Memory is constrained
- Need to iterate neighbors frequently
- Graph is large (memory savings significant)

**Real-World Example:**
- **Social Networks**: Sparse (each person has ~100-1000 friends) → Adjacency List
- **Complete Graphs**: Dense (all pairs connected) → Adjacency Matrix
- **Road Networks**: Sparse (each intersection connects to ~4 roads) → Adjacency List

### 11.3.2 Adjacency List

An **adjacency list** stores each vertex's neighbors in a list or array.

#### Implementation
```cpp
#include <iostream>
#include <vector>
#include <list>
#include <unordered_map>
using namespace std;

struct Edge {
    int to;
    int weight;
    
    Edge(int t, int w = 1) : to(t), weight(w) {}
};

class GraphList {
private:
    vector<list<Edge>> adjList;
    int numVertices;
    bool directed;
    
public:
    GraphList(int vertices, bool isDirected = false) 
        : numVertices(vertices), directed(isDirected) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight = 1) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjList[from].push_back(Edge(to, weight));
            if (!directed) {
                adjList[to].push_back(Edge(from, weight));
            }
        }
    }
    
    void removeEdge(int from, int to) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjList[from].remove_if([to](const Edge& e) { return e.to == to; });
            if (!directed) {
                adjList[to].remove_if([from](const Edge& e) { return e.to == from; });
            }
        }
    }
    
    bool hasEdge(int from, int to) const {
        if (from >= 0 && from < numVertices) {
            for (const Edge& edge : adjList[from]) {
                if (edge.to == to) {
                    return true;
                }
            }
        }
        return false;
    }
    
    const list<Edge>& getNeighbors(int vertex) const {
        if (vertex >= 0 && vertex < numVertices) {
            return adjList[vertex];
        }
        static list<Edge> empty;
        return empty;
    }
    
    void print() const {
        cout << "Adjacency List:" << endl;
        for (int i = 0; i < numVertices; i++) {
            cout << i << ": ";
            for (const Edge& edge : adjList[i]) {
                cout << "(" << edge.to << ", " << edge.weight << ") ";
            }
            cout << endl;
        }
    }
    
    int getNumVertices() const { return numVertices; }
};
```

#### Advantages and Disadvantages

**Advantages:**
- O(V + E) space complexity (efficient for sparse graphs)
- Easy to iterate over neighbors
- Easy to add/remove edges
- Memory efficient

**Disadvantages:**
- O(degree) edge lookup
- Slightly more complex implementation
- Less cache-friendly than matrix

### 11.3.3 Comparison

| Operation | Adjacency Matrix | Adjacency List |
|-----------|-----------------|----------------|
| Space | O(V²) | O(V + E) |
| Check Edge | O(1) | O(degree) |
| Add Edge | O(1) | O(1) |
| Remove Edge | O(1) | O(degree) |
| Iterate Neighbors | O(V) | O(degree) |
| Best For | Dense graphs | Sparse graphs |

## 11.4 Graph Traversal

### 11.4.1 Depth-First Search (DFS)

**Depth-First Search** explores as far as possible along each branch before backtracking.

#### Recursive Implementation
```cpp
#include <vector>
#include <stack>
#include <iostream>
using namespace std;

class GraphDFS {
private:
    vector<list<Edge>> adjList;
    int numVertices;
    
    void dfsRecursive(int vertex, vector<bool>& visited, vector<int>& result) {
        visited[vertex] = true;
        result.push_back(vertex);
        
        for (const Edge& edge : adjList[vertex]) {
            if (!visited[edge.to]) {
                dfsRecursive(edge.to, visited, result);
            }
        }
    }
    
public:
    GraphDFS(int vertices) : numVertices(vertices) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight = 1) {
        adjList[from].push_back(Edge(to, weight));
        adjList[to].push_back(Edge(from, weight));
    }
    
    vector<int> dfs(int start) {
        vector<bool> visited(numVertices, false);
        vector<int> result;
        
        dfsRecursive(start, visited, result);
        return result;
    }
    
    vector<int> dfsAll() {
        vector<bool> visited(numVertices, false);
        vector<int> result;
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfsRecursive(i, visited, result);
            }
        }
        
        return result;
    }
};
```

#### Iterative Implementation
```cpp
vector<int> dfsIterative(int start) {
    vector<bool> visited(numVertices, false);
    vector<int> result;
    stack<int> stk;
    
    stk.push(start);
    
    while (!stk.empty()) {
        int vertex = stk.top();
        stk.pop();
        
        if (!visited[vertex]) {
            visited[vertex] = true;
            result.push_back(vertex);
            
            // Push neighbors in reverse order to maintain same traversal
            for (auto it = adjList[vertex].rbegin(); it != adjList[vertex].rend(); ++it) {
                if (!visited[it->to]) {
                    stk.push(it->to);
                }
            }
        }
    }
    
    return result;
}
```

#### Applications of DFS
- Finding connected components
- Detecting cycles
- Topological sorting
- Finding strongly connected components
- Solving mazes
- Path finding

### 11.4.2 Breadth-First Search (BFS)

**Breadth-First Search** explores all neighbors at the current depth before moving to the next level.

#### Implementation
```cpp
#include <queue>

class GraphBFS {
private:
    vector<list<Edge>> adjList;
    int numVertices;
    
public:
    GraphBFS(int vertices) : numVertices(vertices) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight = 1) {
        adjList[from].push_back(Edge(to, weight));
        adjList[to].push_back(Edge(from, weight));
    }
    
    vector<int> bfs(int start) {
        vector<bool> visited(numVertices, false);
        vector<int> result;
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        while (!q.empty()) {
            int vertex = q.front();
            q.pop();
            result.push_back(vertex);
            
            for (const Edge& edge : adjList[vertex]) {
                if (!visited[edge.to]) {
                    visited[edge.to] = true;
                    q.push(edge.to);
                }
            }
        }
        
        return result;
    }
    
    vector<int> shortestPathUnweighted(int start, int end) {
        vector<bool> visited(numVertices, false);
        vector<int> parent(numVertices, -1);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        while (!q.empty()) {
            int vertex = q.front();
            q.pop();
            
            if (vertex == end) {
                // Reconstruct path
                vector<int> path;
                int current = end;
                while (current != -1) {
                    path.push_back(current);
                    current = parent[current];
                }
                reverse(path.begin(), path.end());
                return path;
            }
            
            for (const Edge& edge : adjList[vertex]) {
                if (!visited[edge.to]) {
                    visited[edge.to] = true;
                    parent[edge.to] = vertex;
                    q.push(edge.to);
                }
            }
        }
        
        return {}; // No path found
    }
};
```

#### Applications of BFS
- Shortest path in unweighted graphs
- Level-order traversal
- Finding minimum spanning tree (unweighted)
- Social network analysis (degrees of separation)
- Web crawling
- Broadcasting in networks

### 11.4.3 DFS vs BFS

| Aspect | DFS | BFS |
|--------|-----|-----|
| Data Structure | Stack | Queue |
| Memory | O(h) where h is height | O(w) where w is width |
| Path Finding | May not find shortest | Finds shortest (unweighted) |
| Use Case | Deep exploration | Level-by-level exploration |
| Implementation | Recursive/Iterative | Iterative |

## 11.5 Shortest Path Algorithms

### 11.5.1 Dijkstra's Algorithm

**Dijkstra's algorithm** finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.

#### Implementation
```cpp
#include <queue>
#include <vector>
#include <limits>
#include <algorithm>

class Dijkstra {
private:
    vector<list<Edge>> adjList;
    int numVertices;
    
public:
    Dijkstra(int vertices) : numVertices(vertices) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight) {
        adjList[from].push_back(Edge(to, weight));
    }
    
    vector<int> shortestPath(int start) {
        vector<int> dist(numVertices, numeric_limits<int>::max());
        vector<bool> visited(numVertices, false);
        priority_queue<pair<int, int>, vector<pair<int, int>>, 
                      greater<pair<int, int>>> pq;
        
        dist[start] = 0;
        pq.push({0, start});
        
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            
            if (visited[u]) continue;
            visited[u] = true;
            
            for (const Edge& edge : adjList[u]) {
                int v = edge.to;
                int weight = edge.weight;
                
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.push({dist[v], v});
                }
            }
        }
        
        return dist;
    }
    
    vector<int> shortestPathTo(int start, int end) {
        vector<int> dist(numVertices, numeric_limits<int>::max());
        vector<int> parent(numVertices, -1);
        vector<bool> visited(numVertices, false);
        priority_queue<pair<int, int>, vector<pair<int, int>>, 
                      greater<pair<int, int>>> pq;
        
        dist[start] = 0;
        pq.push({0, start});
        
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            
            if (u == end) break;
            if (visited[u]) continue;
            visited[u] = true;
            
            for (const Edge& edge : adjList[u]) {
                int v = edge.to;
                int weight = edge.weight;
                
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    parent[v] = u;
                    pq.push({dist[v], v});
                }
            }
        }
        
        // Reconstruct path
        if (dist[end] == numeric_limits<int>::max()) {
            return {}; // No path
        }
        
        vector<int> path;
        int current = end;
        while (current != -1) {
            path.push_back(current);
            current = parent[current];
        }
        reverse(path.begin(), path.end());
        return path;
    }
};
```

#### Time Complexity
- **Time**: O((V + E) log V) with binary heap
- **Space**: O(V)

#### Limitations
- Only works with non-negative edge weights
- Does not work with negative cycles

### 11.5.2 Bellman-Ford Algorithm

**Bellman-Ford algorithm** finds shortest paths even with negative edge weights (but not negative cycles).

#### Implementation
```cpp
class BellmanFord {
private:
    struct Edge {
        int from, to, weight;
        Edge(int f, int t, int w) : from(f), to(t), weight(w) {}
    };
    
    vector<Edge> edges;
    int numVertices;
    
public:
    BellmanFord(int vertices) : numVertices(vertices) {}
    
    void addEdge(int from, int to, int weight) {
        edges.push_back(Edge(from, to, weight));
    }
    
    vector<int> shortestPath(int start) {
        vector<int> dist(numVertices, numeric_limits<int>::max());
        dist[start] = 0;
        
        // Relax edges V-1 times
        for (int i = 0; i < numVertices - 1; i++) {
            for (const Edge& edge : edges) {
                if (dist[edge.from] != numeric_limits<int>::max() &&
                    dist[edge.from] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[edge.from] + edge.weight;
                }
            }
        }
        
        // Check for negative cycles
        for (const Edge& edge : edges) {
            if (dist[edge.from] != numeric_limits<int>::max() &&
                dist[edge.from] + edge.weight < dist[edge.to]) {
                // Negative cycle detected
                return {};
            }
        }
        
        return dist;
    }
    
    bool hasNegativeCycle() {
        vector<int> dist(numVertices, 0);
        
        // Relax edges V times
        for (int i = 0; i < numVertices; i++) {
            for (const Edge& edge : edges) {
                if (dist[edge.from] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[edge.from] + edge.weight;
                    if (i == numVertices - 1) {
                        return true; // Negative cycle detected
                    }
                }
            }
        }
        
        return false;
    }
};
```

#### Time Complexity
- **Time**: O(V × E)
- **Space**: O(V)

#### Advantages
- Works with negative edge weights
- Can detect negative cycles
- Simpler than Dijkstra for some cases

### 11.5.3 Floyd-Warshall Algorithm

**Floyd-Warshall algorithm** finds shortest paths between all pairs of vertices.

#### Implementation
```cpp
class FloydWarshall {
private:
    vector<vector<int>> dist;
    int numVertices;
    
public:
    FloydWarshall(int vertices) : numVertices(vertices) {
        dist.resize(vertices, vector<int>(vertices, numeric_limits<int>::max()));
        
        for (int i = 0; i < vertices; i++) {
            dist[i][i] = 0;
        }
    }
    
    void addEdge(int from, int to, int weight) {
        dist[from][to] = weight;
    }
    
    void computeShortestPaths() {
        for (int k = 0; k < numVertices; k++) {
            for (int i = 0; i < numVertices; i++) {
                for (int j = 0; j < numVertices; j++) {
                    if (dist[i][k] != numeric_limits<int>::max() &&
                        dist[k][j] != numeric_limits<int>::max() &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
    
    int getDistance(int from, int to) const {
        return dist[from][to];
    }
    
    bool hasNegativeCycle() const {
        for (int i = 0; i < numVertices; i++) {
            if (dist[i][i] < 0) {
                return true;
            }
        }
        return false;
    }
};
```

#### Time Complexity
- **Time**: O(V³)
- **Space**: O(V²)

#### Use Cases
- All-pairs shortest paths
- Transitive closure
- Detecting negative cycles

## 11.6 Disjoint Sets (Union-Find Data Structure)

A **Disjoint Set** (also called Union-Find) is a data structure that tracks a set of elements partitioned into disjoint (non-overlapping) subsets. It provides efficient operations to:
- **Find**: Determine which subset an element belongs to
- **Union**: Merge two subsets into one

### Why Disjoint Sets Matter

Disjoint sets are essential for many graph algorithms:
- **Kruskal's Algorithm**: Detecting cycles when building MST
- **Connected Components**: Finding all connected components in a graph
- **Cycle Detection**: Determining if adding an edge creates a cycle
- **Network Connectivity**: Checking if nodes are in the same network

### Basic Operations

1. **MakeSet(x)**: Creates a new set containing element x
2. **Find(x)**: Returns the representative (root) of the set containing x
3. **Union(x, y)**: Merges the sets containing x and y

### Naive Implementation

```cpp
class UnionFindNaive {
private:
    vector<int> parent;
    int n;
    
public:
    UnionFindNaive(int size) : n(size) {
        parent.resize(n);
        // Initially, each element is its own parent
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    // Find the root of x
    int find(int x) {
        if (parent[x] != x) {
            return find(parent[x]); // Recursive find
        }
        return x;
    }
    
    // Union two sets
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX != rootY) {
            parent[rootX] = rootY;
        }
    }
    
    // Check if two elements are in the same set
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

**Time Complexity**: 
- Find: O(n) worst case (can form a chain)
- Union: O(n) worst case

### Optimized Implementation with Path Compression

**Path Compression** flattens the tree structure during find operations, making future finds faster.

```cpp
class UnionFindPathCompression {
private:
    vector<int> parent;
    int n;
    
public:
    UnionFindPathCompression(int size) : n(size) {
        parent.resize(n);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    // Find with path compression
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }
    
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX != rootY) {
            parent[rootX] = rootY;
        }
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

**Time Complexity**: 
- Find: O(α(n)) amortized, where α is the inverse Ackermann function (practically constant)
- Union: O(α(n)) amortized

### Union by Rank (or Union by Size)

**Union by Rank** keeps trees balanced by always attaching the smaller tree under the root of the larger tree.

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank; // Height of tree (or use size for union by size)
    int n;
    
public:
    UnionFind(int size) : n(size) {
        parent.resize(n);
        rank.resize(n, 0);
        
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    // Find with path compression
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }
    
    // Union by rank
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return; // Already in same set
        }
        
        // Attach smaller rank tree under root of higher rank tree
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            // Ranks are same, make one root and increment its rank
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    // Get number of disjoint sets
    int countSets() {
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) {
                count++;
            }
        }
        return count;
    }
};
```

**Time Complexity**: 
- Find: O(α(n)) amortized
- Union: O(α(n)) amortized
- Space: O(n)

### Union by Size (Alternative)

```cpp
class UnionFindBySize {
private:
    vector<int> parent;
    vector<int> size; // Size of each set
    int n;
    
public:
    UnionFindBySize(int size) : n(size) {
        parent.resize(n);
        this->size.resize(n, 1);
        
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return;
        
        // Attach smaller set to larger set
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    int getSize(int x) {
        return size[find(x)];
    }
};
```

### Applications in Graph Algorithms

#### 1. Kruskal's Algorithm for MST
Disjoint sets are used to detect cycles when building the minimum spanning tree.

#### 2. Finding Connected Components
```cpp
int countConnectedComponents(const vector<vector<int>>& graph) {
    int n = graph.size();
    UnionFind uf(n);
    
    // Union all connected vertices
    for (int i = 0; i < n; i++) {
        for (int neighbor : graph[i]) {
            uf.unite(i, neighbor);
        }
    }
    
    return uf.countSets();
}
```

#### 3. Cycle Detection in Undirected Graph
```cpp
bool hasCycle(const vector<pair<int, int>>& edges, int numVertices) {
    UnionFind uf(numVertices);
    
    for (const auto& edge : edges) {
        int u = edge.first;
        int v = edge.second;
        
        if (uf.connected(u, v)) {
            return true; // Cycle detected
        }
        uf.unite(u, v);
    }
    
    return false;
}
```

#### 4. Network Connectivity
```cpp
class NetworkConnectivity {
private:
    UnionFind uf;
    
public:
    NetworkConnectivity(int n) : uf(n) {}
    
    void connect(int a, int b) {
        uf.unite(a, b);
    }
    
    bool isConnected(int a, int b) {
        return uf.connected(a, b);
    }
    
    int getComponentCount() {
        return uf.countSets();
    }
};
```

### Time Complexity Analysis

| Operation | Naive | Path Compression | Path Compression + Union by Rank |
|-----------|-------|------------------|----------------------------------|
| Find | O(n) | O(log n) amortized | O(α(n)) amortized |
| Union | O(n) | O(log n) amortized | O(α(n)) amortized |
| Space | O(n) | O(n) | O(n) |

Where α(n) is the inverse Ackermann function, which grows extremely slowly and is practically constant (≤ 4 for any reasonable n).

### Key Takeaways

1. **Disjoint Sets** efficiently track partitions of elements
2. **Path Compression** flattens trees during find operations
3. **Union by Rank/Size** keeps trees balanced
4. **Amortized Complexity** is nearly constant with optimizations
5. **Essential for** Kruskal's algorithm, cycle detection, and connected components

## 11.7 Minimum Spanning Tree (MST)

A **Minimum Spanning Tree** is a subset of edges that connects all vertices with minimum total weight.

### 11.7.1 Kruskal's Algorithm

**Kruskal's algorithm** builds MST by adding edges in increasing order of weight.

#### Implementation
```cpp
#include <algorithm>

class Kruskal {
private:
    struct Edge {
        int from, to, weight;
        Edge(int f, int t, int w) : from(f), to(t), weight(w) {}
        bool operator<(const Edge& other) const {
            return weight < other.weight;
        }
    };
    
    vector<Edge> edges;
    int numVertices;
    
    class UnionFind {
    private:
        vector<int> parent, rank;
        
    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }
        
        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX == rootY) return false;
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            
            return true;
        }
    };
    
public:
    Kruskal(int vertices) : numVertices(vertices) {}
    
    void addEdge(int from, int to, int weight) {
        edges.push_back(Edge(from, to, weight));
    }
    
    vector<Edge> findMST() {
        sort(edges.begin(), edges.end());
        UnionFind uf(numVertices);
        vector<Edge> mst;
        
        for (const Edge& edge : edges) {
            if (uf.unite(edge.from, edge.to)) {
                mst.push_back(edge);
                if (mst.size() == numVertices - 1) {
                    break;
                }
            }
        }
        
        return mst;
    }
    
    int mstWeight() {
        vector<Edge> mst = findMST();
        int totalWeight = 0;
        for (const Edge& edge : mst) {
            totalWeight += edge.weight;
        }
        return totalWeight;
    }
};
```

#### Time Complexity
- **Time**: O(E log E) = O(E log V)
- **Space**: O(V)

### 11.7.2 Prim's Algorithm

**Prim's algorithm** builds MST by starting from a vertex and growing the tree.

#### Implementation
```cpp
class Prim {
private:
    vector<list<Edge>> adjList;
    int numVertices;
    
public:
    Prim(int vertices) : numVertices(vertices) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight) {
        adjList[from].push_back(Edge(to, weight));
        adjList[to].push_back(Edge(from, weight));
    }
    
    vector<Edge> findMST(int start = 0) {
        vector<bool> inMST(numVertices, false);
        vector<int> key(numVertices, numeric_limits<int>::max());
        vector<int> parent(numVertices, -1);
        priority_queue<pair<int, int>, vector<pair<int, int>>, 
                      greater<pair<int, int>>> pq;
        
        key[start] = 0;
        pq.push({0, start});
        
        vector<Edge> mst;
        
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            
            if (inMST[u]) continue;
            inMST[u] = true;
            
            if (parent[u] != -1) {
                // Find weight of edge from parent[u] to u
                int weight = 0;
                for (const Edge& edge : adjList[parent[u]]) {
                    if (edge.to == u) {
                        weight = edge.weight;
                        break;
                    }
                }
                mst.push_back(Edge(parent[u], u, weight));
            }
            
            for (const Edge& edge : adjList[u]) {
                int v = edge.to;
                int weight = edge.weight;
                
                if (!inMST[v] && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;
                    pq.push({key[v], v});
                }
            }
        }
        
        return mst;
    }
};
```

#### Time Complexity
- **Time**: O((V + E) log V) with binary heap
- **Space**: O(V)

## 11.8 Topological Sorting

**Topological sorting** is a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge (u, v), u comes before v.

### Implementation
```cpp
class TopologicalSort {
private:
    vector<list<int>> adjList;
    int numVertices;
    
    void dfs(int vertex, vector<bool>& visited, vector<bool>& recStack, 
             vector<int>& result, bool& hasCycle) {
        visited[vertex] = true;
        recStack[vertex] = true;
        
        for (int neighbor : adjList[vertex]) {
            if (!visited[neighbor]) {
                dfs(neighbor, visited, recStack, result, hasCycle);
            } else if (recStack[neighbor]) {
                hasCycle = true;
            }
        }
        
        recStack[vertex] = false;
        result.push_back(vertex);
    }
    
public:
    TopologicalSort(int vertices) : numVertices(vertices) {
        adjList.resize(vertices);
    }
    
    void addEdge(int from, int to) {
        adjList[from].push_back(to);
    }
    
    vector<int> topologicalSort() {
        vector<bool> visited(numVertices, false);
        vector<bool> recStack(numVertices, false);
        vector<int> result;
        bool hasCycle = false;
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs(i, visited, recStack, result, hasCycle);
            }
        }
        
        if (hasCycle) {
            return {}; // Cycle detected, no topological order
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
    
    vector<int> topologicalSortKahn() {
        vector<int> inDegree(numVertices, 0);
        queue<int> q;
        vector<int> result;
        
        // Calculate in-degrees
        for (int i = 0; i < numVertices; i++) {
            for (int neighbor : adjList[i]) {
                inDegree[neighbor]++;
            }
        }
        
        // Add vertices with in-degree 0
        for (int i = 0; i < numVertices; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            result.push_back(u);
            
            for (int neighbor : adjList[u]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        if (result.size() != numVertices) {
            return {}; // Cycle detected
        }
        
        return result;
    }
};
```

### Applications
- Task scheduling
- Build systems (make, gradle)
- Course prerequisites
- Event ordering

## 11.9 Finding Bridges in a Graph

A **bridge** (also called a cut edge) is an edge whose removal increases the number of connected components in the graph. Bridges are critical edges that, if removed, disconnect the graph.

### Algorithm Overview

We use DFS with the concept of **discovery time** and **low link value**:
- **Discovery time (disc)**: When a vertex is first visited
- **Low link (low)**: The earliest discovery time reachable from a vertex

An edge (u, v) is a bridge if `low[v] > disc[u]`, meaning v cannot reach any ancestor of u.

### Implementation
```cpp
#include <vector>
#include <list>
#include <algorithm>

class BridgeFinder {
private:
    vector<list<int>> graph;
    int numVertices;
    vector<int> disc;  // Discovery time
    vector<int> low;   // Low link value
    vector<bool> visited;
    int time;
    vector<pair<int, int>> bridges;
    
    void dfs(int u, int parent) {
        visited[u] = true;
        disc[u] = low[u] = ++time;
        
        for (int v : graph[u]) {
            if (v == parent) continue; // Skip parent edge
            
            if (!visited[v]) {
                dfs(v, u);
                low[u] = min(low[u], low[v]);
                
                // If low[v] > disc[u], then (u, v) is a bridge
                if (low[v] > disc[u]) {
                    bridges.push_back({u, v});
                }
            } else {
                // Back edge - update low[u]
                low[u] = min(low[u], disc[v]);
            }
        }
    }
    
public:
    BridgeFinder(int vertices) : numVertices(vertices) {
        graph.resize(vertices);
        disc.resize(vertices, 0);
        low.resize(vertices, 0);
        visited.resize(vertices, false);
        time = 0;
    }
    
    void addEdge(int from, int to) {
        graph[from].push_back(to);
        graph[to].push_back(from);
    }
    
    vector<pair<int, int>> findBridges() {
        bridges.clear();
        fill(visited.begin(), visited.end(), false);
        fill(disc.begin(), disc.end(), 0);
        fill(low.begin(), low.end(), 0);
        time = 0;
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs(i, -1);
            }
        }
        
        return bridges;
    }
};
```

### Time Complexity
- **Time**: O(V + E)
- **Space**: O(V)

### Applications
- Network reliability analysis
- Finding critical connections
- Graph connectivity analysis

## 11.10 Finding Articulation Points

An **articulation point** (also called a cut vertex) is a vertex whose removal increases the number of connected components in the graph.

### Algorithm Overview

Similar to bridge finding, we use DFS with discovery time and low link value. A vertex u is an articulation point if:
1. u is root and has at least 2 children, OR
2. u is not root and has a child v such that `low[v] >= disc[u]`

### Implementation
```cpp
class ArticulationPointFinder {
private:
    vector<list<int>> graph;
    int numVertices;
    vector<int> disc;
    vector<int> low;
    vector<bool> visited;
    vector<bool> isArticulation;
    int time;
    
    void dfs(int u, int parent, bool isRoot) {
        visited[u] = true;
        disc[u] = low[u] = ++time;
        int children = 0;
        
        for (int v : graph[u]) {
            if (v == parent) continue;
            
            if (!visited[v]) {
                children++;
                dfs(v, u, false);
                low[u] = min(low[u], low[v]);
                
                // Check if u is an articulation point
                if (!isRoot && low[v] >= disc[u]) {
                    isArticulation[u] = true;
                }
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }
        
        // Root is articulation point if it has 2+ children
        if (isRoot && children >= 2) {
            isArticulation[u] = true;
        }
    }
    
public:
    ArticulationPointFinder(int vertices) : numVertices(vertices) {
        graph.resize(vertices);
        disc.resize(vertices, 0);
        low.resize(vertices, 0);
        visited.resize(vertices, false);
        isArticulation.resize(vertices, false);
        time = 0;
    }
    
    void addEdge(int from, int to) {
        graph[from].push_back(to);
        graph[to].push_back(from);
    }
    
    vector<int> findArticulationPoints() {
        fill(visited.begin(), visited.end(), false);
        fill(isArticulation.begin(), isArticulation.end(), false);
        fill(disc.begin(), disc.end(), 0);
        fill(low.begin(), low.end(), 0);
        time = 0;
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs(i, -1, true);
            }
        }
        
        vector<int> result;
        for (int i = 0; i < numVertices; i++) {
            if (isArticulation[i]) {
                result.push_back(i);
            }
        }
        
        return result;
    }
};
```

### Time Complexity
- **Time**: O(V + E)
- **Space**: O(V)

### Applications
- Network vulnerability analysis
- Finding critical nodes
- Social network analysis

## 11.11 Strongly Connected Components

A **Strongly Connected Component (SCC)** in a directed graph is a maximal set of vertices where every vertex is reachable from every other vertex.

### Kosaraju's Algorithm

Kosaraju's algorithm finds all SCCs in O(V + E) time using two DFS passes.

#### Implementation
```cpp
class StronglyConnectedComponents {
private:
    vector<vector<int>> graph;
    vector<vector<int>> reverseGraph;
    int numVertices;
    vector<bool> visited;
    vector<int> order;
    vector<int> component;
    
    void dfs1(int v) {
        visited[v] = true;
        for (int u : graph[v]) {
            if (!visited[u]) {
                dfs1(u);
            }
        }
        order.push_back(v); // Add to order after processing
    }
    
    void dfs2(int v, int compId) {
        visited[v] = true;
        component[v] = compId;
        for (int u : reverseGraph[v]) {
            if (!visited[u]) {
                dfs2(u, compId);
            }
        }
    }
    
public:
    StronglyConnectedComponents(int vertices) : numVertices(vertices) {
        graph.resize(vertices);
        reverseGraph.resize(vertices);
        visited.resize(vertices, false);
        component.resize(vertices, -1);
    }
    
    void addEdge(int from, int to) {
        graph[from].push_back(to);
        reverseGraph[to].push_back(from);
    }
    
    vector<vector<int>> findSCCs() {
        // Step 1: First DFS on original graph
        fill(visited.begin(), visited.end(), false);
        order.clear();
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs1(i);
            }
        }
        
        // Step 2: Second DFS on reverse graph in reverse order
        fill(visited.begin(), visited.end(), false);
        reverse(order.begin(), order.end());
        
        int compId = 0;
        for (int v : order) {
            if (!visited[v]) {
                dfs2(v, compId++);
            }
        }
        
        // Step 3: Group vertices by component
        vector<vector<int>> components(compId);
        for (int i = 0; i < numVertices; i++) {
            components[component[i]].push_back(i);
        }
        
        return components;
    }
    
    int getComponentCount() {
        findSCCs();
        return *max_element(component.begin(), component.end()) + 1;
    }
};
```

### Tarjan's Algorithm (Alternative)

Tarjan's algorithm finds SCCs in a single DFS pass using a stack.

```cpp
class TarjanSCC {
private:
    vector<vector<int>> graph;
    int numVertices;
    vector<int> disc;
    vector<int> low;
    vector<bool> onStack;
    vector<int> stack;
    int time;
    vector<vector<int>> components;
    
    void dfs(int u) {
        disc[u] = low[u] = ++time;
        stack.push_back(u);
        onStack[u] = true;
        
        for (int v : graph[u]) {
            if (disc[v] == 0) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = min(low[u], disc[v]);
            }
        }
        
        // If u is root of SCC
        if (low[u] == disc[u]) {
            vector<int> component;
            while (true) {
                int v = stack.back();
                stack.pop_back();
                onStack[v] = false;
                component.push_back(v);
                if (v == u) break;
            }
            components.push_back(component);
        }
    }
    
public:
    TarjanSCC(int vertices) : numVertices(vertices) {
        graph.resize(vertices);
        disc.resize(vertices, 0);
        low.resize(vertices, 0);
        onStack.resize(vertices, false);
        time = 0;
    }
    
    void addEdge(int from, int to) {
        graph[from].push_back(to);
    }
    
    vector<vector<int>> findSCCs() {
        components.clear();
        fill(disc.begin(), disc.end(), 0);
        fill(low.begin(), low.end(), 0);
        fill(onStack.begin(), onStack.end(), false);
        stack.clear();
        time = 0;
        
        for (int i = 0; i < numVertices; i++) {
            if (disc[i] == 0) {
                dfs(i);
            }
        }
        
        return components;
    }
};
```

### Time Complexity
- **Time**: O(V + E) for both algorithms
- **Space**: O(V)

### Applications
- Compiler design (control flow analysis)
- Social network analysis
- Web page ranking
- Dependency resolution

## 11.12 0-1 BFS

**0-1 BFS** is a special case of BFS for graphs where edge weights are either 0 or 1. It's more efficient than Dijkstra's algorithm for this case.

### Algorithm Overview

Instead of a priority queue, we use a deque (double-ended queue):
- Edges with weight 0 are added to the front
- Edges with weight 1 are added to the back

This ensures vertices are processed in order of distance.

### Implementation
```cpp
#include <deque>
#include <vector>
#include <list>
#include <limits>

struct Edge01 {
    int to;
    int weight; // 0 or 1
};

class BFS01 {
private:
    vector<list<Edge01>> graph;
    int numVertices;
    
public:
    BFS01(int vertices) : numVertices(vertices) {
        graph.resize(vertices);
    }
    
    void addEdge(int from, int to, int weight) {
        graph[from].push_back({to, weight});
    }
    
    vector<int> shortestPath(int start) {
        vector<int> dist(numVertices, numeric_limits<int>::max());
        deque<int> dq;
        
        dist[start] = 0;
        dq.push_back(start);
        
        while (!dq.empty()) {
            int u = dq.front();
            dq.pop_front();
            
            for (const Edge01& edge : graph[u]) {
                int v = edge.to;
                int w = edge.weight;
                
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    
                    if (w == 0) {
                        dq.push_front(v); // Weight 0 - add to front
                    } else {
                        dq.push_back(v);  // Weight 1 - add to back
                    }
                }
            }
        }
        
        return dist;
    }
    
    vector<int> shortestPathTo(int start, int end) {
        vector<int> dist(numVertices, numeric_limits<int>::max());
        vector<int> parent(numVertices, -1);
        deque<int> dq;
        
        dist[start] = 0;
        dq.push_back(start);
        
        while (!dq.empty()) {
            int u = dq.front();
            dq.pop_front();
            
            if (u == end) break;
            
            for (const Edge01& edge : graph[u]) {
                int v = edge.to;
                int w = edge.weight;
                
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                    
                    if (w == 0) {
                        dq.push_front(v);
                    } else {
                        dq.push_back(v);
                    }
                }
            }
        }
        
        // Reconstruct path
        if (dist[end] == numeric_limits<int>::max()) {
            return {};
        }
        
        vector<int> path;
        int current = end;
        while (current != -1) {
            path.push_back(current);
            current = parent[current];
        }
        reverse(path.begin(), path.end());
        return path;
    }
};
```

### Time Complexity
- **Time**: O(V + E) - more efficient than Dijkstra's O((V + E) log V)
- **Space**: O(V)

### When to Use
- Graph has only 0 and 1 edge weights
- Need shortest paths in unweighted graph with some "free" edges
- More efficient than Dijkstra for 0-1 weighted graphs

### Applications
- Grid problems with free moves and cost moves
- Problems with "teleportation" edges (weight 0)
- Network routing with binary costs

## 11.13 Graph Applications

### 11.13.1 Finding Connected Components
```cpp
vector<vector<int>> findConnectedComponents(const vector<list<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<vector<int>> components;
    
    function<void(int, vector<int>&)> dfs = [&](int v, vector<int>& comp) {
        visited[v] = true;
        comp.push_back(v);
        for (int neighbor : graph[v]) {
            if (!visited[neighbor]) {
                dfs(neighbor, comp);
            }
        }
    };
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            vector<int> component;
            dfs(i, component);
            components.push_back(component);
        }
    }
    
    return components;
}
```

### 11.13.2 Cycle Detection
```cpp
bool hasCycle(const vector<list<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<bool> recStack(n, false);
    
    function<bool(int)> dfs = [&](int v) {
        visited[v] = true;
        recStack[v] = true;
        
        for (int neighbor : graph[v]) {
            if (!visited[neighbor]) {
                if (dfs(neighbor)) return true;
            } else if (recStack[neighbor]) {
                return true;
            }
        }
        
        recStack[v] = false;
        return false;
    };
    
    for (int i = 0; i < n; i++) {
        if (!visited[i] && dfs(i)) {
            return true;
        }
    }
    
    return false;
}
```

### 11.13.3 Bipartite Graph Check
```cpp
bool isBipartite(const vector<list<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1);
    queue<int> q;
    
    for (int i = 0; i < n; i++) {
        if (color[i] == -1) {
            color[i] = 0;
            q.push(i);
            
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                
                for (int v : graph[u]) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.push(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
    }
    
    return true;
}
```

## 11.14 Key Takeaways

1. **Graphs** represent relationships and connections between entities
2. **Adjacency matrix** is good for dense graphs, **adjacency list** for sparse graphs
3. **DFS** explores deeply, **BFS** explores level-by-level
4. **Dijkstra's** finds shortest paths with non-negative weights
5. **Bellman-Ford** handles negative weights but not negative cycles
6. **Floyd-Warshall** finds all-pairs shortest paths
7. **Kruskal** and **Prim** find minimum spanning trees
8. **Topological sort** orders vertices in a DAG
9. **Bridges and articulation points** identify critical edges and vertices
10. **Strongly Connected Components** find maximal strongly connected subgraphs
11. **0-1 BFS** efficiently handles graphs with binary edge weights
12. Graphs have many real-world applications

## 11.15 Exercises

1. Implement a graph class that supports both adjacency matrix and adjacency list representations.

2. Implement DFS and BFS iteratively and recursively, and compare their performance.

3. Modify Dijkstra's algorithm to reconstruct the actual shortest path, not just the distance.

4. Implement a function to detect if a graph is strongly connected.

5. Implement an algorithm to find all cycles in a directed graph.

6. Create a function to find the longest path in a DAG.

7. Implement Tarjan's algorithm for finding strongly connected components.

8. Compare the performance of Kosaraju's and Tarjan's algorithms for SCC.

9. Implement a function to check if a graph is Eulerian (has Eulerian path/cycle).

10. Create a graph visualization tool that can display small graphs.

## 11.16 Summary

Graphs are fundamental data structures that model relationships and connections. Understanding graph representations, traversal algorithms, shortest path algorithms, and minimum spanning tree algorithms is essential for solving many computational problems. The choice of representation and algorithm depends on the specific problem requirements, graph characteristics, and performance constraints.

In the next chapters, we'll explore more advanced topics including searching algorithms and advanced data structures that build upon these graph concepts.

