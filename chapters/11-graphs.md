# Chapter 11: Graphs

## 11.1 When the Relationships Are the Data

Most structures in this book impose a shape on your data — a sequence, a hierarchy, a key-value mapping. A graph imposes none. It is what you reach for when the *relationships between things* are the data: who follows whom, which road connects which cities, what task blocks what other task. A graph is nothing but a set of vertices and a set of edges joining them, and that minimalism is exactly why it models everything from social networks to build dependencies to internet routing. GPS navigation, web crawlers, `make`, package managers, and recommendation engines are all graph algorithms wearing an application's clothes.

The flexibility isn't free. Trees (Chapter 6) guarantee one parent, no cycles, and exactly `n−1` edges — constraints that make them cheap to reason about. Graphs relax all of it: any vertex may connect to any other, cycles are allowed, and there may be no root and no single connected piece at all. That freedom is what buys you the more elaborate algorithms in the rest of this chapter. If your data is genuinely a sequence, a lookup table, or a hierarchy, use the structure built for it; reach for a graph only when connectivity itself is the problem.

Formally a graph is `G = (V, E)`: a set of vertices `V` and a set of edges `E`, each edge joining two of them. A little vocabulary, fixed once, carries the whole chapter:

- An edge is **directed** (`u→v`, one-way, like a Twitter follow) or **undirected** (`u–v`, mutual, like a Facebook friendship). A graph of directed edges is a **digraph**.
- An edge may carry a **weight** — a distance, cost, or capacity. Dijkstra and the MST algorithms below live on weighted graphs; BFS and DFS ignore weights entirely.
- The **degree** of a vertex is how many edges touch it; in a digraph that splits into **in-degree** and **out-degree**.
- A **path** is a sequence of vertices joined by edges, a **cycle** a path back to its start. A graph with no cycles is **acyclic** — a **DAG** if it is also directed. A graph is **connected** if every vertex is reachable from every other; otherwise it breaks into **components**.

The one structural invariant that bites in practice: the stored representation must exactly match the edge set. For an undirected graph that means every edge is recorded at *both* endpoints — the single most common graph bug is storing `u→v` but forgetting `v→u`, silently making half your edges one-way. And deleting a vertex means deleting all its incident edges first, or you leave dangling references to a vertex that no longer exists.

The type combinations show up as small pictures throughout the chapter. Undirected edges are mutual; directed edges point one way and can form directed cycles; weighted edges label each connection with a number the algorithms optimize over:

```mermaid
graph LR
    subgraph Undirected
        A --- B
        A --- C
        B --- D
        C --- D
    end
    subgraph Directed
        E --> F
        F --> G
        G --> H
        H --> E
    end
    subgraph Weighted
        I -->|5| J
        I -->|3| K
        J -->|2| L
        K -->|1| L
    end
```

Two more types are worth naming because algorithms below depend on them: a **complete** graph connects every pair of vertices (the dense extreme), and a **bipartite** graph splits its vertices into two sides with no edge inside a side — the structure behind matching and two-coloring problems.

## 11.2 Representations: The Memory Decision That Governs Everything

Before any algorithm runs, you have to decide how the graph lives in memory, and the two choices — adjacency matrix and adjacency list — are a genuine memory-versus-cache trade-off, not a formality. Everything downstream inherits it: the matrix makes "is there an edge `u→v`?" a single array access but costs `O(V²)` memory whether the graph has a million edges or three; the list costs only `O(V + E)` but answers the same question by scanning a vertex's neighbors. Almost every real graph — road networks, social graphs, web graphs — is *sparse* (`E ≪ V²`), so the adjacency list is the default. The matrix earns its keep only when the graph is dense or you need constant-time edge tests on a small graph.

### 11.2.1 Adjacency Matrix

An **adjacency matrix** is a `V × V` array where `matrix[i][j]` holds the weight of edge `i→j` (or 0/1 for its presence). Edge lookup, insert, and delete are all `O(1)`, and the code is trivial:

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

```python
class GraphMatrix:
    def __init__(self, vertices, directed=False):
        self.num_vertices = vertices
        self.directed = directed
        self.adj_matrix = [[0] * vertices for _ in range(vertices)]

    def add_edge(self, frm, to, weight=1):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            self.adj_matrix[frm][to] = weight
            if not self.directed:
                self.adj_matrix[to][frm] = weight

    def remove_edge(self, frm, to):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            self.adj_matrix[frm][to] = 0
            if not self.directed:
                self.adj_matrix[to][frm] = 0

    def has_edge(self, frm, to):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            return self.adj_matrix[frm][to] != 0
        return False

    def get_weight(self, frm, to):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            return self.adj_matrix[frm][to]
        return 0

    def print(self):
        print("Adjacency Matrix:")
        print("  " + " ".join(str(i) for i in range(self.num_vertices)))
        for i in range(self.num_vertices):
            row = " ".join(str(self.adj_matrix[i][j]) for j in range(self.num_vertices))
            print(f"{i} {row}")

    def get_num_vertices(self):
        return self.num_vertices
```

```java
class GraphMatrix {
    private int[][] adjMatrix;
    private int numVertices;
    private boolean directed;

    GraphMatrix(int vertices, boolean directed) {
        this.numVertices = vertices;
        this.directed = directed;
        this.adjMatrix = new int[vertices][vertices];
    }

    void addEdge(int from, int to, int weight) {
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

    boolean hasEdge(int from, int to) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            return adjMatrix[from][to] != 0;
        }
        return false;
    }

    int getWeight(int from, int to) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            return adjMatrix[from][to];
        }
        return 0;
    }

    void print() {
        System.out.println("Adjacency Matrix:");
        StringBuilder header = new StringBuilder("  ");
        for (int i = 0; i < numVertices; i++) header.append(i).append(" ");
        System.out.println(header.toString());
        for (int i = 0; i < numVertices; i++) {
            StringBuilder row = new StringBuilder();
            row.append(i).append(" ");
            for (int j = 0; j < numVertices; j++) row.append(adjMatrix[i][j]).append(" ");
            System.out.println(row.toString());
        }
    }

    int getNumVertices() { return numVertices; }
}
```

```go
import "fmt"

type GraphMatrix struct {
    adjMatrix   [][]int
    numVertices int
    directed    bool
}

func NewGraphMatrix(vertices int, directed bool) *GraphMatrix {
    m := make([][]int, vertices)
    for i := range m {
        m[i] = make([]int, vertices)
    }
    return &GraphMatrix{adjMatrix: m, numVertices: vertices, directed: directed}
}

func (g *GraphMatrix) AddEdge(from, to, weight int) {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        g.adjMatrix[from][to] = weight
        if !g.directed {
            g.adjMatrix[to][from] = weight
        }
    }
}

func (g *GraphMatrix) RemoveEdge(from, to int) {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        g.adjMatrix[from][to] = 0
        if !g.directed {
            g.adjMatrix[to][from] = 0
        }
    }
}

func (g *GraphMatrix) HasEdge(from, to int) bool {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        return g.adjMatrix[from][to] != 0
    }
    return false
}

func (g *GraphMatrix) Weight(from, to int) int {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        return g.adjMatrix[from][to]
    }
    return 0
}

func (g *GraphMatrix) Print() {
    fmt.Println("Adjacency Matrix:")
    fmt.Print("  ")
    for i := 0; i < g.numVertices; i++ {
        fmt.Printf("%d ", i)
    }
    fmt.Println()
    for i := 0; i < g.numVertices; i++ {
        fmt.Printf("%d ", i)
        for j := 0; j < g.numVertices; j++ {
            fmt.Printf("%d ", g.adjMatrix[i][j])
        }
        fmt.Println()
    }
}

func (g *GraphMatrix) NumVertices() int { return g.numVertices }
```

The catch is the `O(V²)` memory, paid whether the graph is full or nearly empty, plus expensive vertex insertion and removal. A million-vertex sparse graph would need a trillion-entry matrix — hopeless. The matrix wins only when the graph is dense enough that you'd store most of those entries anyway.

There is a subtler reason the matrix can outrun a list even when it "shouldn't," and it comes straight from the memory hierarchy of [Chapter 3.6](03.6-memory-hierarchy-and-performance.md): the matrix is one contiguous block, so an edge query is a single cache-friendly load (~5–10 cycles), whereas an adjacency list is an array of separately allocated node chains, and walking one means pointer-chasing across scattered addresses — every hop risks a cache miss of 50–200 cycles. On a dense graph that fits in cache, the matrix's sequential layout can beat the list's asymptotically-better bounds outright. This is the same constant-factor story as binary versus linear search in [Chapter 13](13-searching-algorithms.md): Big-O picks the representation, but memory layout picks the winner.

### 11.2.2 Adjacency List

An **adjacency list** stores, for each vertex, a list of its neighbors — `O(V + E)` memory, which for a sparse graph is dramatically smaller. It is the representation every algorithm in this chapter assumes unless noted, because those algorithms iterate a vertex's neighbors far more often than they test a specific edge, and neighbor iteration is exactly what the list does well (`O(degree)`, not `O(V)`).

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

```python
class Edge:
    def __init__(self, to, weight=1):
        self.to = to
        self.weight = weight

class GraphList:
    def __init__(self, vertices, directed=False):
        self.num_vertices = vertices
        self.directed = directed
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to, weight=1):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            self.adj_list[frm].append(Edge(to, weight))
            if not self.directed:
                self.adj_list[to].append(Edge(frm, weight))

    def remove_edge(self, frm, to):
        if 0 <= frm < self.num_vertices and 0 <= to < self.num_vertices:
            self.adj_list[frm] = [e for e in self.adj_list[frm] if e.to != to]
            if not self.directed:
                self.adj_list[to] = [e for e in self.adj_list[to] if e.to != frm]

    def has_edge(self, frm, to):
        if 0 <= frm < self.num_vertices:
            return any(e.to == to for e in self.adj_list[frm])
        return False

    def get_neighbors(self, vertex):
        if 0 <= vertex < self.num_vertices:
            return self.adj_list[vertex]
        return []

    def print(self):
        print("Adjacency List:")
        for i in range(self.num_vertices):
            neighbors = " ".join(f"({e.to}, {e.weight})" for e in self.adj_list[i])
            print(f"{i}: {neighbors} ")

    def get_num_vertices(self):
        return self.num_vertices
```

```java
class Edge {
    int to, weight;
    Edge(int to) { this(to, 1); }
    Edge(int to, int weight) { this.to = to; this.weight = weight; }
}

class GraphList {
    private List<List<Edge>> adjList;
    private int numVertices;
    private boolean directed;

    GraphList(int vertices, boolean directed) {
        this.numVertices = vertices;
        this.directed = directed;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjList.get(from).add(new Edge(to, weight));
            if (!directed) adjList.get(to).add(new Edge(from, weight));
        }
    }

    void removeEdge(int from, int to) {
        if (from >= 0 && from < numVertices && to >= 0 && to < numVertices) {
            adjList.get(from).removeIf(e -> e.to == to);
            if (!directed) adjList.get(to).removeIf(e -> e.to == from);
        }
    }

    boolean hasEdge(int from, int to) {
        if (from >= 0 && from < numVertices) {
            for (Edge edge : adjList.get(from)) {
                if (edge.to == to) return true;
            }
        }
        return false;
    }

    List<Edge> getNeighbors(int vertex) {
        if (vertex >= 0 && vertex < numVertices) return adjList.get(vertex);
        return new LinkedList<>();
    }

    void print() {
        System.out.println("Adjacency List:");
        for (int i = 0; i < numVertices; i++) {
            StringBuilder sb = new StringBuilder();
            sb.append(i).append(": ");
            for (Edge edge : adjList.get(i)) {
                sb.append("(").append(edge.to).append(", ").append(edge.weight).append(") ");
            }
            System.out.println(sb.toString());
        }
    }

    int getNumVertices() { return numVertices; }
}
```

```go
type Edge struct {
    to     int
    weight int
}

type GraphList struct {
    adjList     [][]Edge
    numVertices int
    directed    bool
}

func NewGraphList(vertices int, directed bool) *GraphList {
    return &GraphList{adjList: make([][]Edge, vertices), numVertices: vertices, directed: directed}
}

func (g *GraphList) AddEdge(from, to, weight int) {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        g.adjList[from] = append(g.adjList[from], Edge{to, weight})
        if !g.directed {
            g.adjList[to] = append(g.adjList[to], Edge{from, weight})
        }
    }
}

func removeNeighbor(edges []Edge, to int) []Edge {
    result := edges[:0]
    for _, e := range edges {
        if e.to != to {
            result = append(result, e)
        }
    }
    return result
}

func (g *GraphList) RemoveEdge(from, to int) {
    if from >= 0 && from < g.numVertices && to >= 0 && to < g.numVertices {
        g.adjList[from] = removeNeighbor(g.adjList[from], to)
        if !g.directed {
            g.adjList[to] = removeNeighbor(g.adjList[to], from)
        }
    }
}

func (g *GraphList) HasEdge(from, to int) bool {
    if from >= 0 && from < g.numVertices {
        for _, e := range g.adjList[from] {
            if e.to == to {
                return true
            }
        }
    }
    return false
}

func (g *GraphList) Neighbors(vertex int) []Edge {
    if vertex >= 0 && vertex < g.numVertices {
        return g.adjList[vertex]
    }
    return nil
}

func (g *GraphList) Print() {
    fmt.Println("Adjacency List:")
    for i := 0; i < g.numVertices; i++ {
        fmt.Printf("%d: ", i)
        for _, e := range g.adjList[i] {
            fmt.Printf("(%d, %d) ", e.to, e.weight)
        }
        fmt.Println()
    }
}

func (g *GraphList) NumVertices() int { return g.numVertices }
```

Its one real weakness is the edge test: checking whether `u→v` exists means scanning `u`'s neighbors, `O(degree)`. If your workload is dominated by edge existence queries on a small graph, that's the case for the matrix; otherwise the list wins on every axis that matters at scale.

| | Adjacency Matrix | Adjacency List |
|--|-----------------|----------------|
| Space | `O(V²)` | `O(V + E)` |
| Edge exists `u→v`? | `O(1)` | `O(degree)` |
| Add / remove edge | `O(1)` / `O(1)` | `O(1)` / `O(degree)` |
| Iterate neighbors | `O(V)` | `O(degree)` |
| Cache behavior | contiguous, friendly | pointer-chasing |
| Best for | dense / small graphs | sparse / large graphs |

## 11.3 Graph Traversal

### 11.3.1 Depth-First Search (DFS)

**Depth-First Search** explores as far as possible along each branch before backtracking. Think of it like exploring a maze: you go as deep as possible down one path, and only when you hit a dead end do you backtrack to try another path.

#### How DFS Works: Step-by-Step Example

Trace DFS from vertex A on this graph:

```mermaid
graph TD
    A --> B
    A --> C
    B --> D
    B --> E
    C --> F
```

Using an explicit stack, we push a vertex's unvisited neighbors and always pop the most recently pushed one, so exploration dives deep before fanning out:

| Step | Pop | Visited so far | Stack after |
|------|-----|----------------|-------------|
| 1 | A | A | C, B |
| 2 | B | A, B | C, E, D |
| 3 | D | A, B, D | C, E |
| 4 | E | A, B, D, E | C |
| 5 | C | A, B, D, E, C | F |
| 6 | F | A, B, D, E, C, F | (empty) |

**Traversal order:** A → B → D → E → C → F. The stack is implicit in the recursive form, explicit in the iterative one; either way DFS visits every vertex in the connected component.

#### DFS vs BFS on the Same Graph

The contrast is the whole point — DFS plunges down one branch and backtracks; BFS expands level by level:

```mermaid
graph LR
    A[Start: A] --> B[Visit B]
    B --> D[Visit D]
    D -.->|backtrack| B
    B --> E[Visit E]
    E -.->|backtrack| B
    B -.->|backtrack| A
    A --> C[Visit C]
    C --> F[Visit F]

    style A fill:#90EE90
    style B fill:#FFB6C1
    style C fill:#87CEEB
    style D fill:#DDA0DD
    style E fill:#DDA0DD
    style F fill:#DDA0DD
```

```mermaid
graph TD
    A[Level 0: A] --> B[Level 1: B]
    A --> C[Level 1: C]
    B --> D[Level 2: D]
    B --> E[Level 2: E]
    C --> F[Level 2: F]

    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style B fill:#FFB6C1,stroke:#333,stroke-width:2px
    style C fill:#FFB6C1,stroke:#333,stroke-width:2px
    style D fill:#87CEEB,stroke:#333,stroke-width:2px
    style E fill:#87CEEB,stroke:#333,stroke-width:2px
    style F fill:#87CEEB,stroke:#333,stroke-width:2px
```

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

```python
class GraphDFS:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to, weight=1):
        self.adj_list[frm].append(Edge(to, weight))
        self.adj_list[to].append(Edge(frm, weight))

    def _dfs_recursive(self, vertex, visited, result):
        visited[vertex] = True
        result.append(vertex)
        for edge in self.adj_list[vertex]:
            if not visited[edge.to]:
                self._dfs_recursive(edge.to, visited, result)

    def dfs(self, start):
        visited = [False] * self.num_vertices
        result = []
        self._dfs_recursive(start, visited, result)
        return result

    def dfs_all(self):
        visited = [False] * self.num_vertices
        result = []
        for i in range(self.num_vertices):
            if not visited[i]:
                self._dfs_recursive(i, visited, result)
        return result
```

```java
class GraphDFS {
    private List<List<Edge>> adjList;
    private int numVertices;

    GraphDFS(int vertices) {
        numVertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        adjList.get(from).add(new Edge(to, weight));
        adjList.get(to).add(new Edge(from, weight));
    }

    private void dfsRecursive(int vertex, boolean[] visited, List<Integer> result) {
        visited[vertex] = true;
        result.add(vertex);
        for (Edge edge : adjList.get(vertex)) {
            if (!visited[edge.to]) dfsRecursive(edge.to, visited, result);
        }
    }

    List<Integer> dfs(int start) {
        boolean[] visited = new boolean[numVertices];
        List<Integer> result = new ArrayList<>();
        dfsRecursive(start, visited, result);
        return result;
    }

    List<Integer> dfsAll() {
        boolean[] visited = new boolean[numVertices];
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) dfsRecursive(i, visited, result);
        }
        return result;
    }
}
```

```go
type GraphDFS struct {
    adjList     [][]Edge
    numVertices int
}

func NewGraphDFS(vertices int) *GraphDFS {
    return &GraphDFS{adjList: make([][]Edge, vertices), numVertices: vertices}
}

func (g *GraphDFS) AddEdge(from, to, weight int) {
    g.adjList[from] = append(g.adjList[from], Edge{to, weight})
    g.adjList[to] = append(g.adjList[to], Edge{from, weight})
}

func (g *GraphDFS) dfsRecursive(vertex int, visited []bool, result *[]int) {
    visited[vertex] = true
    *result = append(*result, vertex)
    for _, e := range g.adjList[vertex] {
        if !visited[e.to] {
            g.dfsRecursive(e.to, visited, result)
        }
    }
}

func (g *GraphDFS) DFS(start int) []int {
    visited := make([]bool, g.numVertices)
    var result []int
    g.dfsRecursive(start, visited, &result)
    return result
}

func (g *GraphDFS) DFSAll() []int {
    visited := make([]bool, g.numVertices)
    var result []int
    for i := 0; i < g.numVertices; i++ {
        if !visited[i] {
            g.dfsRecursive(i, visited, &result)
        }
    }
    return result
}
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

```python
def dfs_iterative(self, start):
    visited = [False] * self.num_vertices
    result = []
    stack = [start]

    while stack:
        vertex = stack.pop()

        if not visited[vertex]:
            visited[vertex] = True
            result.append(vertex)

            # Push neighbors in reverse order to maintain same traversal
            for edge in reversed(self.adj_list[vertex]):
                if not visited[edge.to]:
                    stack.append(edge.to)

    return result
```

```java
List<Integer> dfsIterative(int start) {
    boolean[] visited = new boolean[numVertices];
    List<Integer> result = new ArrayList<>();
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int vertex = stack.pop();
        if (!visited[vertex]) {
            visited[vertex] = true;
            result.add(vertex);

            // Push neighbors in reverse order to maintain same traversal
            List<Edge> neighbors = adjList.get(vertex);
            ListIterator<Edge> it = neighbors.listIterator(neighbors.size());
            while (it.hasPrevious()) {
                Edge edge = it.previous();
                if (!visited[edge.to]) stack.push(edge.to);
            }
        }
    }
    return result;
}
```

```go
func (g *GraphDFS) DFSIterative(start int) []int {
    visited := make([]bool, g.numVertices)
    var result []int
    stack := []int{start}

    for len(stack) > 0 {
        vertex := stack[len(stack)-1]
        stack = stack[:len(stack)-1]

        if !visited[vertex] {
            visited[vertex] = true
            result = append(result, vertex)

            // Push neighbors in reverse order to maintain same traversal
            neighbors := g.adjList[vertex]
            for i := len(neighbors) - 1; i >= 0; i-- {
                if !visited[neighbors[i].to] {
                    stack = append(stack, neighbors[i].to)
                }
            }
        }
    }
    return result
}
```

DFS is the engine under a surprising number of later algorithms in this chapter: cycle detection, topological sort, bridges and articulation points, and strongly connected components are all DFS with extra bookkeeping. Anywhere you need to fully explore one region before moving on — maze solving, connected components, reachability — it is the natural traversal.

### 11.3.2 Breadth-First Search (BFS)

**Breadth-First Search** explores all neighbors at the current depth before moving to the next level. Think of it like ripples in water: it expands outward level by level, exploring all vertices at distance 1, then all at distance 2, and so on.

#### How BFS Works: Step-by-Step Example

Trace BFS from vertex A on the same graph. BFS marks a vertex visited when it is *enqueued*, then processes the queue in FIFO order, so every vertex at distance k is visited before any at distance k+1:

| Step | Dequeue | Enqueue | Queue after |
|------|---------|---------|-------------|
| 1 | A | B, C | B, C |
| 2 | B | D, E | C, D, E |
| 3 | C | F | D, E, F |
| 4 | D | — | E, F |
| 5 | E | — | F |
| 6 | F | — | (empty) |

**Traversal order:** A → B → C → D → E → F — Level 0: A; Level 1: B, C; Level 2: D, E, F.

Because BFS visits vertices in order of distance from the source, the first time it reaches a vertex it has already found a shortest path (in edges) to it. Reaching F at level 2 yields the shortest path A → C → F of length 2. DFS could reach F through a longer exploration order, so it offers no such guarantee.

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

```python
from collections import deque

class GraphBFS:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to, weight=1):
        self.adj_list[frm].append(Edge(to, weight))
        self.adj_list[to].append(Edge(frm, weight))

    def bfs(self, start):
        visited = [False] * self.num_vertices
        result = []
        q = deque([start])
        visited[start] = True

        while q:
            vertex = q.popleft()
            result.append(vertex)
            for edge in self.adj_list[vertex]:
                if not visited[edge.to]:
                    visited[edge.to] = True
                    q.append(edge.to)

        return result

    def shortest_path_unweighted(self, start, end):
        visited = [False] * self.num_vertices
        parent = [-1] * self.num_vertices
        q = deque([start])
        visited[start] = True

        while q:
            vertex = q.popleft()

            if vertex == end:
                # Reconstruct path
                path = []
                current = end
                while current != -1:
                    path.append(current)
                    current = parent[current]
                path.reverse()
                return path

            for edge in self.adj_list[vertex]:
                if not visited[edge.to]:
                    visited[edge.to] = True
                    parent[edge.to] = vertex
                    q.append(edge.to)

        return []  # No path found
```

```java
class GraphBFS {
    private List<List<Edge>> adjList;
    private int numVertices;

    GraphBFS(int vertices) {
        numVertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        adjList.get(from).add(new Edge(to, weight));
        adjList.get(to).add(new Edge(from, weight));
    }

    List<Integer> bfs(int start) {
        boolean[] visited = new boolean[numVertices];
        List<Integer> result = new ArrayList<>();
        Queue<Integer> q = new ArrayDeque<>();

        visited[start] = true;
        q.add(start);

        while (!q.isEmpty()) {
            int vertex = q.poll();
            result.add(vertex);
            for (Edge edge : adjList.get(vertex)) {
                if (!visited[edge.to]) {
                    visited[edge.to] = true;
                    q.add(edge.to);
                }
            }
        }
        return result;
    }

    List<Integer> shortestPathUnweighted(int start, int end) {
        boolean[] visited = new boolean[numVertices];
        int[] parent = new int[numVertices];
        Arrays.fill(parent, -1);
        Queue<Integer> q = new ArrayDeque<>();

        visited[start] = true;
        q.add(start);

        while (!q.isEmpty()) {
            int vertex = q.poll();
            if (vertex == end) {
                // Reconstruct path
                List<Integer> path = new ArrayList<>();
                int current = end;
                while (current != -1) {
                    path.add(current);
                    current = parent[current];
                }
                Collections.reverse(path);
                return path;
            }
            for (Edge edge : adjList.get(vertex)) {
                if (!visited[edge.to]) {
                    visited[edge.to] = true;
                    parent[edge.to] = vertex;
                    q.add(edge.to);
                }
            }
        }
        return new ArrayList<>(); // No path found
    }
}
```

```go
import "slices"

type GraphBFS struct {
    adjList     [][]Edge
    numVertices int
}

func NewGraphBFS(vertices int) *GraphBFS {
    return &GraphBFS{adjList: make([][]Edge, vertices), numVertices: vertices}
}

func (g *GraphBFS) AddEdge(from, to, weight int) {
    g.adjList[from] = append(g.adjList[from], Edge{to, weight})
    g.adjList[to] = append(g.adjList[to], Edge{from, weight})
}

func (g *GraphBFS) BFS(start int) []int {
    visited := make([]bool, g.numVertices)
    var result []int
    queue := []int{start}
    visited[start] = true

    for len(queue) > 0 {
        vertex := queue[0]
        queue = queue[1:]
        result = append(result, vertex)
        for _, e := range g.adjList[vertex] {
            if !visited[e.to] {
                visited[e.to] = true
                queue = append(queue, e.to)
            }
        }
    }
    return result
}

func (g *GraphBFS) ShortestPathUnweighted(start, end int) []int {
    visited := make([]bool, g.numVertices)
    parent := make([]int, g.numVertices)
    for i := range parent {
        parent[i] = -1
    }
    queue := []int{start}
    visited[start] = true

    for len(queue) > 0 {
        vertex := queue[0]
        queue = queue[1:]

        if vertex == end {
            // Reconstruct path
            var path []int
            for current := end; current != -1; current = parent[current] {
                path = append(path, current)
            }
            slices.Reverse(path)
            return path
        }

        for _, e := range g.adjList[vertex] {
            if !visited[e.to] {
                visited[e.to] = true
                parent[e.to] = vertex
                queue = append(queue, e.to)
            }
        }
    }
    return nil // No path found
}
```

That shortest-path guarantee is why BFS, not DFS, powers "degrees of separation" in social networks, shortest-hop routing, web crawling by link distance, and network broadcast. The two traversals differ only in the container that holds pending vertices — a stack (or recursion) for DFS, a FIFO queue for BFS — but that one swap changes everything: DFS goes deep and uses memory proportional to the longest path, BFS goes wide and uses memory proportional to the widest level, and only BFS finds shortest paths in an unweighted graph.

## 11.4 Shortest Path Algorithms

### 11.4.1 Dijkstra's Algorithm

**Dijkstra's algorithm** finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It uses a greedy approach: at each step, it selects the unvisited vertex with the smallest known distance and updates distances to its neighbors.

#### How Dijkstra's Works: Step-by-Step Example

Trace Dijkstra from A on this weighted graph:

```mermaid
graph TD
    A[Start: A] -->|6| B
    A -->|1| C
    A -->|5| D
    B -->|3| E
    B -->|2| F
    C -->|2| F
    C -->|4| G
    D -->|2| G

    style A fill:#90EE90,stroke:#333,stroke-width:3px
```

At each step we extract the unvisited vertex with the smallest tentative distance and relax its outgoing edges:

| Processed | Distances updated |
|-----------|-------------------|
| A (0) | B=6, C=1, D=5 |
| C (1) | F=3 (via C) |
| F (3) | B=5 (via C→F) |
| B (5) | E=8 |
| D (5) | G=7 |
| G (7) | — |
| E (8) | — |

**Final distances from A:** A=0, C=1, F=3, B=5, D=5, G=7, E=8.

Three properties drive the algorithm: the greedy choice always processes the smallest-distance unvisited vertex; relaxation lowers a neighbor's distance whenever a shorter path is found; and once a vertex is processed its distance is final — which is exactly why non-negative weights are required.

#### Why Dijkstra's Requires Non-Negative Weights

```mermaid
graph TD
    A[Start: A] -->|1| B
    A -->|-5| C
    B -->|1| D[Target: D]
    C -->|1| D

    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style D fill:#FFB6C1,stroke:#333,stroke-width:3px
```

Here Dijkstra processes C first (distance −5) and finalizes D = −4, committing to D before it can discover that another route is cheaper. With negative weights, finalizing a vertex the moment it is extracted is no longer safe — use Bellman-Ford instead.

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

```python
import heapq

class Dijkstra:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to, weight):
        self.adj_list[frm].append(Edge(to, weight))

    def shortest_path(self, start):
        dist = [float('inf')] * self.num_vertices
        visited = [False] * self.num_vertices
        dist[start] = 0
        pq = [(0, start)]

        while pq:
            _, u = heapq.heappop(pq)
            if visited[u]:
                continue
            visited[u] = True

            for edge in self.adj_list[u]:
                v, weight = edge.to, edge.weight
                if not visited[v] and dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
                    heapq.heappush(pq, (dist[v], v))

        return dist

    def shortest_path_to(self, start, end):
        dist = [float('inf')] * self.num_vertices
        parent = [-1] * self.num_vertices
        visited = [False] * self.num_vertices
        dist[start] = 0
        pq = [(0, start)]

        while pq:
            _, u = heapq.heappop(pq)
            if u == end:
                break
            if visited[u]:
                continue
            visited[u] = True

            for edge in self.adj_list[u]:
                v, weight = edge.to, edge.weight
                if not visited[v] and dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
                    parent[v] = u
                    heapq.heappush(pq, (dist[v], v))

        # Reconstruct path
        if dist[end] == float('inf'):
            return []  # No path

        path = []
        current = end
        while current != -1:
            path.append(current)
            current = parent[current]
        path.reverse()
        return path
```

```java
class Dijkstra {
    private List<List<Edge>> adjList;
    private int numVertices;

    Dijkstra(int vertices) {
        numVertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        adjList.get(from).add(new Edge(to, weight));
    }

    int[] shortestPath(int start) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        boolean[] visited = new boolean[numVertices];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        dist[start] = 0;
        pq.add(new int[]{0, start});

        while (!pq.isEmpty()) {
            int u = pq.poll()[1];
            if (visited[u]) continue;
            visited[u] = true;

            for (Edge edge : adjList.get(u)) {
                int v = edge.to, weight = edge.weight;
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.add(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }

    List<Integer> shortestPathTo(int start, int end) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        int[] parent = new int[numVertices];
        Arrays.fill(parent, -1);
        boolean[] visited = new boolean[numVertices];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        dist[start] = 0;
        pq.add(new int[]{0, start});

        while (!pq.isEmpty()) {
            int u = pq.poll()[1];
            if (u == end) break;
            if (visited[u]) continue;
            visited[u] = true;

            for (Edge edge : adjList.get(u)) {
                int v = edge.to, weight = edge.weight;
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    parent[v] = u;
                    pq.add(new int[]{dist[v], v});
                }
            }
        }

        // Reconstruct path
        if (dist[end] == Integer.MAX_VALUE) return new ArrayList<>(); // No path
        List<Integer> path = new ArrayList<>();
        int current = end;
        while (current != -1) {
            path.add(current);
            current = parent[current];
        }
        Collections.reverse(path);
        return path;
    }
}
```

```go
import (
    "container/heap"
    "math"
    "slices"
)

type distItem struct {
    dist, node int
}
type distPQ []distItem

func (pq distPQ) Len() int           { return len(pq) }
func (pq distPQ) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq distPQ) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *distPQ) Push(x any)        { *pq = append(*pq, x.(distItem)) }
func (pq *distPQ) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    *pq = old[:n-1]
    return item
}

type Dijkstra struct {
    adjList     [][]Edge
    numVertices int
}

func NewDijkstra(vertices int) *Dijkstra {
    return &Dijkstra{adjList: make([][]Edge, vertices), numVertices: vertices}
}

func (g *Dijkstra) AddEdge(from, to, weight int) {
    g.adjList[from] = append(g.adjList[from], Edge{to, weight})
}

func (g *Dijkstra) ShortestPath(start int) []int {
    dist := make([]int, g.numVertices)
    for i := range dist {
        dist[i] = math.MaxInt
    }
    visited := make([]bool, g.numVertices)
    dist[start] = 0
    pq := &distPQ{{0, start}}

    for pq.Len() > 0 {
        u := heap.Pop(pq).(distItem).node
        if visited[u] {
            continue
        }
        visited[u] = true

        for _, e := range g.adjList[u] {
            v, w := e.to, e.weight
            if !visited[v] && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                heap.Push(pq, distItem{dist[v], v})
            }
        }
    }
    return dist
}

func (g *Dijkstra) ShortestPathTo(start, end int) []int {
    dist := make([]int, g.numVertices)
    for i := range dist {
        dist[i] = math.MaxInt
    }
    parent := make([]int, g.numVertices)
    for i := range parent {
        parent[i] = -1
    }
    visited := make([]bool, g.numVertices)
    dist[start] = 0
    pq := &distPQ{{0, start}}

    for pq.Len() > 0 {
        u := heap.Pop(pq).(distItem).node
        if u == end {
            break
        }
        if visited[u] {
            continue
        }
        visited[u] = true

        for _, e := range g.adjList[u] {
            v, w := e.to, e.weight
            if !visited[v] && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                parent[v] = u
                heap.Push(pq, distItem{dist[v], v})
            }
        }
    }

    // Reconstruct path
    if dist[end] == math.MaxInt {
        return nil // No path
    }
    var path []int
    for current := end; current != -1; current = parent[current] {
        path = append(path, current)
    }
    slices.Reverse(path)
    return path
}
```

With a binary-heap priority queue this runs in `O((V + E) log V)` time and `O(V)` space. The non-negative-weight requirement isn't a limitation to route around — it is the exact condition under which "finalize a vertex the moment it's extracted" is correct. When weights can go negative, you need the next algorithm.

### 11.4.2 Bellman-Ford Algorithm

**Bellman-Ford** trades speed for generality: it handles negative edge weights and, as a bonus, *detects* negative cycles (where "shortest path" stops being well-defined). Instead of Dijkstra's greedy finalization, it simply relaxes every edge `V−1` times — enough for any shortest path, which can span at most `V−1` edges, to settle — then one more pass to check whether anything still improves, which would mean a negative cycle.

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

```python
class BellmanFord:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.edges = []  # each edge is a (from, to, weight) tuple

    def add_edge(self, frm, to, weight):
        self.edges.append((frm, to, weight))

    def shortest_path(self, start):
        dist = [float('inf')] * self.num_vertices
        dist[start] = 0

        # Relax edges V-1 times
        for _ in range(self.num_vertices - 1):
            for frm, to, weight in self.edges:
                if dist[frm] != float('inf') and dist[frm] + weight < dist[to]:
                    dist[to] = dist[frm] + weight

        # Check for negative cycles
        for frm, to, weight in self.edges:
            if dist[frm] != float('inf') and dist[frm] + weight < dist[to]:
                return []  # Negative cycle detected

        return dist

    def has_negative_cycle(self):
        dist = [0] * self.num_vertices

        # Relax edges V times
        for i in range(self.num_vertices):
            for frm, to, weight in self.edges:
                if dist[frm] + weight < dist[to]:
                    dist[to] = dist[frm] + weight
                    if i == self.num_vertices - 1:
                        return True  # Negative cycle detected

        return False
```

```java
class BellmanFord {
    private static class Edge {
        int from, to, weight;
        Edge(int from, int to, int weight) { this.from = from; this.to = to; this.weight = weight; }
    }

    private List<Edge> edges = new ArrayList<>();
    private int numVertices;

    BellmanFord(int vertices) { numVertices = vertices; }

    void addEdge(int from, int to, int weight) {
        edges.add(new Edge(from, to, weight));
    }

    int[] shortestPath(int start) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;

        // Relax edges V-1 times
        for (int i = 0; i < numVertices - 1; i++) {
            for (Edge edge : edges) {
                if (dist[edge.from] != Integer.MAX_VALUE &&
                        dist[edge.from] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[edge.from] + edge.weight;
                }
            }
        }

        // Check for negative cycles
        for (Edge edge : edges) {
            if (dist[edge.from] != Integer.MAX_VALUE &&
                    dist[edge.from] + edge.weight < dist[edge.to]) {
                return new int[0]; // Negative cycle detected
            }
        }
        return dist;
    }

    boolean hasNegativeCycle() {
        int[] dist = new int[numVertices]; // all zeros

        // Relax edges V times
        for (int i = 0; i < numVertices; i++) {
            for (Edge edge : edges) {
                if (dist[edge.from] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[edge.from] + edge.weight;
                    if (i == numVertices - 1) return true; // Negative cycle detected
                }
            }
        }
        return false;
    }
}
```

```go
import "math"

type bfEdge struct {
    from, to, weight int
}

type BellmanFord struct {
    edges       []bfEdge
    numVertices int
}

func NewBellmanFord(vertices int) *BellmanFord {
    return &BellmanFord{numVertices: vertices}
}

func (g *BellmanFord) AddEdge(from, to, weight int) {
    g.edges = append(g.edges, bfEdge{from, to, weight})
}

func (g *BellmanFord) ShortestPath(start int) []int {
    dist := make([]int, g.numVertices)
    for i := range dist {
        dist[i] = math.MaxInt
    }
    dist[start] = 0

    // Relax edges V-1 times
    for i := 0; i < g.numVertices-1; i++ {
        for _, e := range g.edges {
            if dist[e.from] != math.MaxInt && dist[e.from]+e.weight < dist[e.to] {
                dist[e.to] = dist[e.from] + e.weight
            }
        }
    }

    // Check for negative cycles
    for _, e := range g.edges {
        if dist[e.from] != math.MaxInt && dist[e.from]+e.weight < dist[e.to] {
            return nil // Negative cycle detected
        }
    }
    return dist
}

func (g *BellmanFord) HasNegativeCycle() bool {
    dist := make([]int, g.numVertices) // all zeros

    // Relax edges V times
    for i := 0; i < g.numVertices; i++ {
        for _, e := range g.edges {
            if dist[e.from]+e.weight < dist[e.to] {
                dist[e.to] = dist[e.from] + e.weight
                if i == g.numVertices-1 {
                    return true // Negative cycle detected
                }
            }
        }
    }
    return false
}
```

The cost of that generality is `O(V × E)` time — a full order slower than Dijkstra — so use Bellman-Ford only when negative weights actually appear.

### 11.4.3 Floyd-Warshall Algorithm

Dijkstra and Bellman-Ford give shortest paths from *one* source. When you need the distance between *every* pair of vertices, **Floyd-Warshall** does it in three nested loops and `O(V³)` time. The idea is deceptively simple: for each intermediate vertex `k`, ask whether routing through `k` shortens any pair `i→j`, and if so, take it. After considering every `k`, `dist[i][j]` holds the true shortest distance. It's compact, cache-friendly (dense arrays), and the natural choice on small dense graphs where `V³` beats running Dijkstra `V` times.

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

```python
class FloydWarshall:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.dist = [[float('inf')] * vertices for _ in range(vertices)]
        for i in range(vertices):
            self.dist[i][i] = 0

    def add_edge(self, frm, to, weight):
        self.dist[frm][to] = weight

    def compute_shortest_paths(self):
        for k in range(self.num_vertices):
            for i in range(self.num_vertices):
                for j in range(self.num_vertices):
                    if (self.dist[i][k] != float('inf') and
                            self.dist[k][j] != float('inf') and
                            self.dist[i][k] + self.dist[k][j] < self.dist[i][j]):
                        self.dist[i][j] = self.dist[i][k] + self.dist[k][j]

    def get_distance(self, frm, to):
        return self.dist[frm][to]

    def has_negative_cycle(self):
        return any(self.dist[i][i] < 0 for i in range(self.num_vertices))
```

```java
class FloydWarshall {
    private int[][] dist;
    private int numVertices;
    private static final int INF = Integer.MAX_VALUE;

    FloydWarshall(int vertices) {
        numVertices = vertices;
        dist = new int[vertices][vertices];
        for (int[] row : dist) Arrays.fill(row, INF);
        for (int i = 0; i < vertices; i++) dist[i][i] = 0;
    }

    void addEdge(int from, int to, int weight) {
        dist[from][to] = weight;
    }

    void computeShortestPaths() {
        for (int k = 0; k < numVertices; k++)
            for (int i = 0; i < numVertices; i++)
                for (int j = 0; j < numVertices; j++)
                    if (dist[i][k] != INF && dist[k][j] != INF &&
                            dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
    }

    int getDistance(int from, int to) { return dist[from][to]; }

    boolean hasNegativeCycle() {
        for (int i = 0; i < numVertices; i++) {
            if (dist[i][i] < 0) return true;
        }
        return false;
    }
}
```

```go
import "math"

type FloydWarshall struct {
    dist        [][]int
    numVertices int
}

func NewFloydWarshall(vertices int) *FloydWarshall {
    dist := make([][]int, vertices)
    for i := range dist {
        dist[i] = make([]int, vertices)
        for j := range dist[i] {
            dist[i][j] = math.MaxInt
        }
        dist[i][i] = 0
    }
    return &FloydWarshall{dist: dist, numVertices: vertices}
}

func (g *FloydWarshall) AddEdge(from, to, weight int) {
    g.dist[from][to] = weight
}

func (g *FloydWarshall) ComputeShortestPaths() {
    for k := 0; k < g.numVertices; k++ {
        for i := 0; i < g.numVertices; i++ {
            for j := 0; j < g.numVertices; j++ {
                if g.dist[i][k] != math.MaxInt && g.dist[k][j] != math.MaxInt &&
                    g.dist[i][k]+g.dist[k][j] < g.dist[i][j] {
                    g.dist[i][j] = g.dist[i][k] + g.dist[k][j]
                }
            }
        }
    }
}

func (g *FloydWarshall) Distance(from, to int) int {
    return g.dist[from][to]
}

func (g *FloydWarshall) HasNegativeCycle() bool {
    for i := 0; i < g.numVertices; i++ {
        if g.dist[i][i] < 0 {
            return true
        }
    }
    return false
}
```

Beyond all-pairs distances, the same `O(V²)` space and `O(V³)` time also compute transitive closure (reachability) and detect negative cycles — a negative value on the diagonal means a vertex can reach itself at negative cost.

## 11.5 Union-Find (Disjoint Sets)

Union-Find is not a graph structure at all — it's the little data structure that makes several graph algorithms fast, so it earns its place here. It maintains a partition of elements into disjoint sets under two operations: **find**, which returns a set's representative, and **union**, which merges two sets. That's exactly what you need to answer "are these two vertices already connected?" in near-constant time — the question at the heart of Kruskal's MST, connected-component labeling, and cycle detection in an undirected graph.

The naive version stores each element's parent and walks parent pointers to the root. It's correct but degenerates: unions can build a linked chain, making `find` `O(n)`.

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

```python
class UnionFindNaive:
    def __init__(self, size):
        self.n = size
        # Initially, each element is its own parent
        self.parent = list(range(size))

    def find(self, x):
        if self.parent[x] != x:
            return self.find(self.parent[x])  # Recursive find
        return x

    def unite(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            self.parent[root_x] = root_y

    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

```java
class UnionFindNaive {
    private int[] parent;
    private int n;

    UnionFindNaive(int size) {
        n = size;
        parent = new int[n];
        // Initially, each element is its own parent
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Find the root of x
    int find(int x) {
        if (parent[x] != x) return find(parent[x]); // Recursive find
        return x;
    }

    // Union two sets
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) parent[rootX] = rootY;
    }

    // Check if two elements are in the same set
    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

```go
type UnionFindNaive struct {
    parent []int
}

func NewUnionFindNaive(size int) *UnionFindNaive {
    // Initially, each element is its own parent
    parent := make([]int, size)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFindNaive{parent: parent}
}

// Find the root of x
func (uf *UnionFindNaive) Find(x int) int {
    if uf.parent[x] != x {
        return uf.Find(uf.parent[x]) // Recursive find
    }
    return x
}

// Unite two sets
func (uf *UnionFindNaive) Unite(x, y int) {
    rootX := uf.Find(x)
    rootY := uf.Find(y)
    if rootX != rootY {
        uf.parent[rootX] = rootY
    }
}

// Connected checks if two elements are in the same set
func (uf *UnionFindNaive) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}
```

Two optimizations fix that, and together they are what make Union-Find famous. **Path compression** flattens the tree during every `find` — after finding the root, it points each node visited straight at it, so the next query is `O(1)`:

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

```python
class UnionFindPathCompression:
    def __init__(self, size):
        self.n = size
        self.parent = list(range(size))

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def unite(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            self.parent[root_x] = root_y

    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

```java
class UnionFindPathCompression {
    private int[] parent;
    private int n;

    UnionFindPathCompression(int size) {
        n = size;
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Find with path compression
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // Path compression
        return parent[x];
    }

    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) parent[rootX] = rootY;
    }

    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

```go
type UnionFindPathCompression struct {
    parent []int
}

func NewUnionFindPathCompression(size int) *UnionFindPathCompression {
    parent := make([]int, size)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFindPathCompression{parent: parent}
}

// Find with path compression
func (uf *UnionFindPathCompression) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x]) // Path compression
    }
    return uf.parent[x]
}

func (uf *UnionFindPathCompression) Unite(x, y int) {
    rootX := uf.Find(x)
    rootY := uf.Find(y)
    if rootX != rootY {
        uf.parent[rootX] = rootY
    }
}

func (uf *UnionFindPathCompression) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}
```

**Union by rank** (or by size) is the second half: when merging, always hang the shorter tree under the taller one's root, so the tree never gets needlessly deep. Combine the two and every operation is `O(α(n))` amortized, where α is the inverse Ackermann function — below 5 for any input that fits in the universe, so effectively constant.

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

```python
class UnionFind:
    def __init__(self, size):
        self.n = size
        self.parent = list(range(size))
        self.rank = [0] * size  # Height of tree (or use size for union by size)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def unite(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return  # Already in same set

        # Attach smaller rank tree under root of higher rank tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            # Ranks are same, make one root and increment its rank
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

    def connected(self, x, y):
        return self.find(x) == self.find(y)

    def count_sets(self):
        return sum(1 for i in range(self.n) if self.parent[i] == i)
```

```java
class UnionFind {
    private int[] parent;
    private int[] rank; // Height of tree (or use size for union by size)
    private int n;

    UnionFind(int size) {
        n = size;
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Find with path compression
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // Path compression
        return parent[x];
    }

    // Union by rank
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return; // Already in same set

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

    boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    // Get number of disjoint sets
    int countSets() {
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) count++;
        }
        return count;
    }
}
```

```go
type UnionFind struct {
    parent []int
    rank   []int // Height of tree (or use size for union by size)
}

func NewUnionFind(size int) *UnionFind {
    parent := make([]int, size)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFind{parent: parent, rank: make([]int, size)}
}

// Find with path compression
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x]) // Path compression
    }
    return uf.parent[x]
}

// Unite by rank
func (uf *UnionFind) Unite(x, y int) {
    rootX := uf.Find(x)
    rootY := uf.Find(y)
    if rootX == rootY {
        return // Already in same set
    }
    // Attach smaller rank tree under root of higher rank tree
    if uf.rank[rootX] < uf.rank[rootY] {
        uf.parent[rootX] = rootY
    } else if uf.rank[rootX] > uf.rank[rootY] {
        uf.parent[rootY] = rootX
    } else {
        // Ranks are same, make one root and increment its rank
        uf.parent[rootY] = rootX
        uf.rank[rootX]++
    }
}

func (uf *UnionFind) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}

// CountSets returns the number of disjoint sets
func (uf *UnionFind) CountSets() int {
    count := 0
    for i := range uf.parent {
        if uf.parent[i] == i {
            count++
        }
    }
    return count
}
```

Union by size is the same idea with element counts instead of heights: attach the smaller set under the larger, add the counts. Identical `O(α(n))` bound, and it makes `getSize(x)` trivial (`size[find(x)]`).

Two applications show the pattern. Counting **connected components** is just: union every edge, then count distinct roots.

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

```python
def count_connected_components(graph):
    n = len(graph)
    uf = UnionFind(n)

    # Union all connected vertices
    for i in range(n):
        for neighbor in graph[i]:
            uf.unite(i, neighbor)

    return uf.count_sets()
```

```java
int countConnectedComponents(List<List<Integer>> graph) {
    int n = graph.size();
    UnionFind uf = new UnionFind(n);

    // Union all connected vertices
    for (int i = 0; i < n; i++) {
        for (int neighbor : graph.get(i)) uf.unite(i, neighbor);
    }

    return uf.countSets();
}
```

```go
func countConnectedComponents(graph [][]int) int {
    n := len(graph)
    uf := NewUnionFind(n)

    // Union all connected vertices
    for i := 0; i < n; i++ {
        for _, neighbor := range graph[i] {
            uf.Unite(i, neighbor)
        }
    }

    return uf.CountSets()
}
```

And **cycle detection** in an undirected graph is the same trick from the other side: if an edge's two endpoints are *already* in the same set, adding it closes a cycle.

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

```python
def has_cycle(edges, num_vertices):
    uf = UnionFind(num_vertices)

    for u, v in edges:
        if uf.connected(u, v):
            return True  # Cycle detected
        uf.unite(u, v)

    return False
```

```java
boolean hasCycle(int[][] edges, int numVertices) {
    UnionFind uf = new UnionFind(numVertices);

    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        if (uf.connected(u, v)) return true; // Cycle detected
        uf.unite(u, v);
    }

    return false;
}
```

```go
func hasCycle(edges [][2]int, numVertices int) bool {
    uf := NewUnionFind(numVertices)

    for _, e := range edges {
        u, v := e[0], e[1]
        if uf.Connected(u, v) {
            return true // Cycle detected
        }
        uf.Unite(u, v)
    }

    return false
}
```

| Operation | Naive | + Path Compression | + Union by Rank |
|-----------|-------|--------------------|-----------------|
| Find / Union | `O(n)` | `O(log n)` amortized | `O(α(n))` amortized |

That last column is the one to remember: path compression flattens trees during `find`, union by rank keeps them shallow, and together they buy effectively constant-time connectivity — the foundation Kruskal's MST is about to stand on.

## 11.6 Minimum Spanning Trees

A **minimum spanning tree (MST)** is the cheapest set of edges that keeps every vertex connected — think of laying cable to wire up every building for the least total length. Both classic algorithms are greedy (Chapter 16), and both are correct for the same reason: the *cut property* guarantees the lightest edge crossing any partition of the vertices is safe to include.

### 11.6.1 Kruskal's Algorithm

**Kruskal's algorithm** builds MST by adding edges in increasing order of weight, skipping edges that would create cycles. It uses Union-Find (Disjoint Set) to efficiently check for cycles.

#### How Kruskal's Works: Step-by-Step Example

Trace Kruskal on this weighted graph:

```mermaid
graph TD
    A -->|2| B
    A -->|3| C
    A -->|4| D
    B -->|1| D
    B -->|5| C
    C -->|6| D
    C -->|7| E
    D -->|2| F
    E -->|3| F
```

Sort every edge by weight, then add each edge whose endpoints lie in different components (checked with Union-Find), skipping any edge that would close a cycle:

| Edge | Weight | Endpoints joined? | Action |
|------|--------|-------------------|--------|
| B-D | 1 | different | add |
| A-B | 2 | different | add |
| D-F | 2 | different | add |
| E-F | 3 | different | add |
| A-C | 3 | different | add (V−1 edges reached) |
| A-D | 4 | same | skip (cycle) |
| B-C, C-D, C-E | 5, 6, 7 | same | skip |

**MST edges:** B-D, A-B, D-F, E-F, A-C — total weight 1+2+2+3+3 = 11.

Kruskal is greedy: it adds the smallest edge that does not create a cycle. `find(u) == find(v)` detects a would-be cycle (the endpoints already share a component), and the tree is complete once it holds V−1 edges.

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

```python
class Kruskal:
    class _Edge:
        def __init__(self, frm, to, weight):
            self.frm = frm
            self.to = to
            self.weight = weight

    class _UnionFind:
        def __init__(self, n):
            self.parent = list(range(n))
            self.rank = [0] * n

        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])  # Path compression
            return self.parent[x]

        def unite(self, x, y):
            root_x = self.find(x)
            root_y = self.find(y)
            if root_x == root_y:
                return False
            if self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            elif self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
            return True

    def __init__(self, vertices):
        self.num_vertices = vertices
        self.edges = []

    def add_edge(self, frm, to, weight):
        self.edges.append(Kruskal._Edge(frm, to, weight))

    def find_mst(self):
        self.edges.sort(key=lambda e: e.weight)
        uf = Kruskal._UnionFind(self.num_vertices)
        mst = []

        for edge in self.edges:
            if uf.unite(edge.frm, edge.to):
                mst.append(edge)
                if len(mst) == self.num_vertices - 1:
                    break

        return mst

    def mst_weight(self):
        return sum(edge.weight for edge in self.find_mst())
```

```java
class Kruskal {
    private static class Edge implements Comparable<Edge> {
        int from, to, weight;
        Edge(int from, int to, int weight) { this.from = from; this.to = to; this.weight = weight; }
        public int compareTo(Edge other) { return Integer.compare(weight, other.weight); }
    }

    private static class UnionFind {
        int[] parent, rank;
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]); // Path compression
            return parent[x];
        }
        boolean unite(int x, int y) {
            int rootX = find(x), rootY = find(y);
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
    }

    private List<Edge> edges = new ArrayList<>();
    private int numVertices;

    Kruskal(int vertices) { numVertices = vertices; }

    void addEdge(int from, int to, int weight) {
        edges.add(new Edge(from, to, weight));
    }

    List<Edge> findMST() {
        Collections.sort(edges);
        UnionFind uf = new UnionFind(numVertices);
        List<Edge> mst = new ArrayList<>();
        for (Edge edge : edges) {
            if (uf.unite(edge.from, edge.to)) {
                mst.add(edge);
                if (mst.size() == numVertices - 1) break;
            }
        }
        return mst;
    }

    int mstWeight() {
        int total = 0;
        for (Edge edge : findMST()) total += edge.weight;
        return total;
    }
}
```

```go
import "sort"

type kruskalEdge struct {
    from, to, weight int
}

type kruskalUF struct {
    parent, rank []int
}

func newKruskalUF(n int) *kruskalUF {
    parent := make([]int, n)
    for i := range parent {
        parent[i] = i
    }
    return &kruskalUF{parent: parent, rank: make([]int, n)}
}

func (uf *kruskalUF) find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.find(uf.parent[x]) // Path compression
    }
    return uf.parent[x]
}

func (uf *kruskalUF) unite(x, y int) bool {
    rootX, rootY := uf.find(x), uf.find(y)
    if rootX == rootY {
        return false
    }
    if uf.rank[rootX] < uf.rank[rootY] {
        uf.parent[rootX] = rootY
    } else if uf.rank[rootX] > uf.rank[rootY] {
        uf.parent[rootY] = rootX
    } else {
        uf.parent[rootY] = rootX
        uf.rank[rootX]++
    }
    return true
}

type Kruskal struct {
    edges       []kruskalEdge
    numVertices int
}

func NewKruskal(vertices int) *Kruskal {
    return &Kruskal{numVertices: vertices}
}

func (g *Kruskal) AddEdge(from, to, weight int) {
    g.edges = append(g.edges, kruskalEdge{from, to, weight})
}

func (g *Kruskal) FindMST() []kruskalEdge {
    sort.Slice(g.edges, func(i, j int) bool {
        return g.edges[i].weight < g.edges[j].weight
    })
    uf := newKruskalUF(g.numVertices)
    var mst []kruskalEdge
    for _, e := range g.edges {
        if uf.unite(e.from, e.to) {
            mst = append(mst, e)
            if len(mst) == g.numVertices-1 {
                break
            }
        }
    }
    return mst
}

func (g *Kruskal) MSTWeight() int {
    total := 0
    for _, e := range g.FindMST() {
        total += e.weight
    }
    return total
}
```

Sorting the edges dominates, so Kruskal runs in `O(E log E) = O(E log V)` — a clean fit for sparse graphs, where you already have an edge list in hand.

### 11.6.2 Prim's Algorithm

Prim grows the tree from a single vertex instead of sorting all edges up front. At each step it adds the cheapest edge leaving the current tree, using a priority queue to find it fast.

#### How Prim's Works: Step-by-Step Example

Trace Prim on the same graph, starting from A. Prim grows a single tree, at each step taking the minimum-weight edge that crosses from the tree to a vertex outside it (via a priority queue):

| Step | Edge added | Tree vertices |
|------|-----------|---------------|
| 1 | A-B (2) | A, B |
| 2 | B-D (1) | A, B, D |
| 3 | D-F (2) | A, B, D, F |
| 4 | A-C (3) | A, B, D, F, C |
| 5 | E-F (3) | A, B, D, F, C, E |

**MST edges:** A-B, B-D, D-F, A-C, E-F — total weight 11, the same tree Kruskal found.

#### Kruskal vs Prim: When to Use Which?

| Aspect | Kruskal's | Prim's |
|--------|-----------|--------|
| **Approach** | Sort edges, add in order | Grow from one vertex |
| **Data Structure** | Union-Find | Priority Queue |
| **Best For** | Sparse graphs | Dense graphs |
| **Time Complexity** | O(E log E) | O(E log V) with binary heap |
| **Implementation** | Simpler | Slightly more complex |

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

```python
class Prim:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to, weight):
        self.adj_list[frm].append(Edge(to, weight))
        self.adj_list[to].append(Edge(frm, weight))

    def find_mst(self, start=0):
        in_mst = [False] * self.num_vertices
        key = [float('inf')] * self.num_vertices
        parent = [-1] * self.num_vertices
        key[start] = 0
        pq = [(0, start)]
        mst = []  # each MST edge is a (from, to, weight) tuple

        while pq:
            _, u = heapq.heappop(pq)
            if in_mst[u]:
                continue
            in_mst[u] = True

            if parent[u] != -1:
                # Find weight of edge from parent[u] to u
                weight = 0
                for edge in self.adj_list[parent[u]]:
                    if edge.to == u:
                        weight = edge.weight
                        break
                mst.append((parent[u], u, weight))

            for edge in self.adj_list[u]:
                v, weight = edge.to, edge.weight
                if not in_mst[v] and weight < key[v]:
                    key[v] = weight
                    parent[v] = u
                    heapq.heappush(pq, (key[v], v))

        return mst
```

```java
class Prim {
    private List<List<Edge>> adjList;
    private int numVertices;

    Prim(int vertices) {
        numVertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        adjList.get(from).add(new Edge(to, weight));
        adjList.get(to).add(new Edge(from, weight));
    }

    List<int[]> findMST(int start) {
        boolean[] inMST = new boolean[numVertices];
        int[] key = new int[numVertices];
        Arrays.fill(key, Integer.MAX_VALUE);
        int[] parent = new int[numVertices];
        Arrays.fill(parent, -1);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        key[start] = 0;
        pq.add(new int[]{0, start});
        List<int[]> mst = new ArrayList<>(); // each MST edge is {from, to, weight}

        while (!pq.isEmpty()) {
            int u = pq.poll()[1];
            if (inMST[u]) continue;
            inMST[u] = true;

            if (parent[u] != -1) {
                // Find weight of edge from parent[u] to u
                int weight = 0;
                for (Edge edge : adjList.get(parent[u])) {
                    if (edge.to == u) { weight = edge.weight; break; }
                }
                mst.add(new int[]{parent[u], u, weight});
            }

            for (Edge edge : adjList.get(u)) {
                int v = edge.to, weight = edge.weight;
                if (!inMST[v] && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;
                    pq.add(new int[]{key[v], v});
                }
            }
        }
        return mst;
    }
}
```

```go
import (
    "container/heap"
    "math"
)

type keyItem struct {
    key, node int
}
type keyPQ []keyItem

func (pq keyPQ) Len() int           { return len(pq) }
func (pq keyPQ) Less(i, j int) bool { return pq[i].key < pq[j].key }
func (pq keyPQ) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *keyPQ) Push(x any)        { *pq = append(*pq, x.(keyItem)) }
func (pq *keyPQ) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    *pq = old[:n-1]
    return item
}

// MSTEdge is a single (from, to, weight) edge of the resulting tree.
type MSTEdge struct {
    from, to, weight int
}

type Prim struct {
    adjList     [][]Edge
    numVertices int
}

func NewPrim(vertices int) *Prim {
    return &Prim{adjList: make([][]Edge, vertices), numVertices: vertices}
}

func (g *Prim) AddEdge(from, to, weight int) {
    g.adjList[from] = append(g.adjList[from], Edge{to, weight})
    g.adjList[to] = append(g.adjList[to], Edge{from, weight})
}

func (g *Prim) FindMST(start int) []MSTEdge {
    inMST := make([]bool, g.numVertices)
    key := make([]int, g.numVertices)
    for i := range key {
        key[i] = math.MaxInt
    }
    parent := make([]int, g.numVertices)
    for i := range parent {
        parent[i] = -1
    }
    key[start] = 0
    pq := &keyPQ{{0, start}}
    var mst []MSTEdge

    for pq.Len() > 0 {
        u := heap.Pop(pq).(keyItem).node
        if inMST[u] {
            continue
        }
        inMST[u] = true

        if parent[u] != -1 {
            // Find weight of edge from parent[u] to u
            weight := 0
            for _, e := range g.adjList[parent[u]] {
                if e.to == u {
                    weight = e.weight
                    break
                }
            }
            mst = append(mst, MSTEdge{parent[u], u, weight})
        }

        for _, e := range g.adjList[u] {
            v, w := e.to, e.weight
            if !inMST[v] && w < key[v] {
                key[v] = w
                parent[v] = u
                heap.Push(pq, keyItem{key[v], v})
            }
        }
    }
    return mst
}
```

With a binary heap Prim runs in `O((V + E) log V)`. Its inner loop is Dijkstra's almost exactly — same priority queue, same relaxation — differing only in the key: Prim keys on the single edge weight into the tree, Dijkstra on the accumulated distance from the source. Kruskal tends to win on sparse graphs (you already have the edge list), Prim on dense ones.

## 11.7 Topological Sorting

**Topological sort** linearizes a DAG so that every edge `u→v` points forward: if task A depends on task B, B comes first. It is the algorithm behind build systems, package managers, and course-prerequisite planners — anywhere dependencies must be resolved into an order.

#### How Topological Sort Works: Step-by-Step Example

Consider these task dependencies (an edge u → v means u must finish before v):

```
    A → B → D
    ↓   ↓   ↓
    C → E → F
```

**Kahn's algorithm (BFS-based)** repeatedly emits a vertex with in-degree 0, then decrements the in-degree of its successors:

| Step | Emit | In-degree drops to 0 | Queue after |
|------|------|----------------------|-------------|
| start | — | A | A |
| 1 | A | B, C | B, C |
| 2 | B | D | C, D |
| 3 | C | E | D, E |
| 4 | D | — | E |
| 5 | E | F | F |
| 6 | F | — | (empty) |

**One valid ordering:** A → B → C → D → E → F. A DAG generally has several valid orderings (e.g. A → C → B → E → D → F): sources appear first, sinks last. If any vertices remain unemitted when the queue empties, the graph has a cycle and no ordering exists.

**DFS-based alternative:** run DFS and push each vertex onto a list when it *finishes* (all its successors are done), then reverse the list. DFS finishes sinks first, so reversing yields sources first.

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

```python
class TopologicalSort:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.adj_list = [[] for _ in range(vertices)]

    def add_edge(self, frm, to):
        self.adj_list[frm].append(to)

    def _dfs(self, vertex, visited, rec_stack, result, state):
        visited[vertex] = True
        rec_stack[vertex] = True

        for neighbor in self.adj_list[vertex]:
            if not visited[neighbor]:
                self._dfs(neighbor, visited, rec_stack, result, state)
            elif rec_stack[neighbor]:
                state['has_cycle'] = True

        rec_stack[vertex] = False
        result.append(vertex)

    def topological_sort(self):
        visited = [False] * self.num_vertices
        rec_stack = [False] * self.num_vertices
        result = []
        state = {'has_cycle': False}

        for i in range(self.num_vertices):
            if not visited[i]:
                self._dfs(i, visited, rec_stack, result, state)

        if state['has_cycle']:
            return []  # Cycle detected, no topological order

        result.reverse()
        return result

    def topological_sort_kahn(self):
        in_degree = [0] * self.num_vertices
        result = []

        # Calculate in-degrees
        for i in range(self.num_vertices):
            for neighbor in self.adj_list[i]:
                in_degree[neighbor] += 1

        # Add vertices with in-degree 0
        q = deque(i for i in range(self.num_vertices) if in_degree[i] == 0)

        while q:
            u = q.popleft()
            result.append(u)
            for neighbor in self.adj_list[u]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    q.append(neighbor)

        if len(result) != self.num_vertices:
            return []  # Cycle detected

        return result
```

```java
class TopologicalSort {
    private List<List<Integer>> adjList;
    private int numVertices;
    private boolean hasCycle;

    TopologicalSort(int vertices) {
        numVertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new ArrayList<>());
    }

    void addEdge(int from, int to) {
        adjList.get(from).add(to);
    }

    private void dfs(int vertex, boolean[] visited, boolean[] recStack, List<Integer> result) {
        visited[vertex] = true;
        recStack[vertex] = true;

        for (int neighbor : adjList.get(vertex)) {
            if (!visited[neighbor]) {
                dfs(neighbor, visited, recStack, result);
            } else if (recStack[neighbor]) {
                hasCycle = true;
            }
        }

        recStack[vertex] = false;
        result.add(vertex);
    }

    List<Integer> topologicalSort() {
        boolean[] visited = new boolean[numVertices];
        boolean[] recStack = new boolean[numVertices];
        List<Integer> result = new ArrayList<>();
        hasCycle = false;

        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) dfs(i, visited, recStack, result);
        }

        if (hasCycle) return new ArrayList<>(); // Cycle detected, no topological order

        Collections.reverse(result);
        return result;
    }

    List<Integer> topologicalSortKahn() {
        int[] inDegree = new int[numVertices];
        List<Integer> result = new ArrayList<>();

        // Calculate in-degrees
        for (int i = 0; i < numVertices; i++) {
            for (int neighbor : adjList.get(i)) inDegree[neighbor]++;
        }

        // Add vertices with in-degree 0
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numVertices; i++) {
            if (inDegree[i] == 0) q.add(i);
        }

        while (!q.isEmpty()) {
            int u = q.poll();
            result.add(u);
            for (int neighbor : adjList.get(u)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) q.add(neighbor);
            }
        }

        if (result.size() != numVertices) return new ArrayList<>(); // Cycle detected
        return result;
    }
}
```

```go
import "slices"

type TopologicalSort struct {
    adjList     [][]int
    numVertices int
    hasCycle    bool
}

func NewTopologicalSort(vertices int) *TopologicalSort {
    return &TopologicalSort{adjList: make([][]int, vertices), numVertices: vertices}
}

func (g *TopologicalSort) AddEdge(from, to int) {
    g.adjList[from] = append(g.adjList[from], to)
}

func (g *TopologicalSort) dfs(vertex int, visited, recStack []bool, result *[]int) {
    visited[vertex] = true
    recStack[vertex] = true

    for _, neighbor := range g.adjList[vertex] {
        if !visited[neighbor] {
            g.dfs(neighbor, visited, recStack, result)
        } else if recStack[neighbor] {
            g.hasCycle = true
        }
    }

    recStack[vertex] = false
    *result = append(*result, vertex)
}

func (g *TopologicalSort) TopologicalSort() []int {
    visited := make([]bool, g.numVertices)
    recStack := make([]bool, g.numVertices)
    var result []int
    g.hasCycle = false

    for i := 0; i < g.numVertices; i++ {
        if !visited[i] {
            g.dfs(i, visited, recStack, &result)
        }
    }

    if g.hasCycle {
        return nil // Cycle detected, no topological order
    }

    slices.Reverse(result)
    return result
}

func (g *TopologicalSort) TopologicalSortKahn() []int {
    inDegree := make([]int, g.numVertices)
    var result []int

    // Calculate in-degrees
    for i := 0; i < g.numVertices; i++ {
        for _, neighbor := range g.adjList[i] {
            inDegree[neighbor]++
        }
    }

    // Add vertices with in-degree 0
    var queue []int
    for i := 0; i < g.numVertices; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }

    for len(queue) > 0 {
        u := queue[0]
        queue = queue[1:]
        result = append(result, u)
        for _, neighbor := range g.adjList[u] {
            inDegree[neighbor]--
            if inDegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }

    if len(result) != g.numVertices {
        return nil // Cycle detected
    }
    return result
}
```

## 11.8 Bridges and Articulation Points

Some connections are load-bearing: remove them and the graph falls apart. A **bridge** is such an edge and an **articulation point** such a vertex — a critical link whose removal increases the number of connected components. Both answer the same production question (which single failure partitions the network?), and remarkably both fall out of one DFS carrying two timestamps per vertex:

- `disc[u]` — when DFS first reached `u`, its discovery time.
- `low[u]` — the earliest `disc` reachable from `u`'s subtree via tree edges plus at most one back edge; intuitively, the highest ancestor that subtree can escape back to.

A tree edge `(u, v)` is a **bridge** exactly when `low[v] > disc[u]`: everything below `v` can reach nothing discovered before `u`, so that edge is its only link to the rest of the graph. If instead `low[v] ≤ disc[u]`, some back edge climbs above `u` and gives an alternate route — not a bridge. In a plain path `0–1–2` every edge is a bridge (cutting any one strands a tail); add one back edge to form a cycle and the edges it spans stop being bridges, because now each has a detour.

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
                
                // Bridge condition: low[v] > disc[u]
                // This means v cannot reach any ancestor of u.
                // If we remove (u, v), v's subtree becomes disconnected.
                // See detailed explanation above for intuition.
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

```python
class BridgeFinder:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.graph = [[] for _ in range(vertices)]
        self.disc = [0] * vertices   # Discovery time
        self.low = [0] * vertices    # Low link value
        self.visited = [False] * vertices
        self.timer = 0
        self.bridges = []

    def add_edge(self, frm, to):
        self.graph[frm].append(to)
        self.graph[to].append(frm)

    def _dfs(self, u, parent):
        self.visited[u] = True
        self.timer += 1
        self.disc[u] = self.low[u] = self.timer

        for v in self.graph[u]:
            if v == parent:
                continue  # Skip parent edge

            if not self.visited[v]:
                self._dfs(v, u)
                self.low[u] = min(self.low[u], self.low[v])
                # Bridge condition: low[v] > disc[u] means v cannot reach any
                # ancestor of u, so removing (u, v) disconnects v's subtree.
                if self.low[v] > self.disc[u]:
                    self.bridges.append((u, v))
            else:
                # Back edge - update low[u]
                self.low[u] = min(self.low[u], self.disc[v])

    def find_bridges(self):
        self.bridges = []
        self.visited = [False] * self.num_vertices
        self.disc = [0] * self.num_vertices
        self.low = [0] * self.num_vertices
        self.timer = 0

        for i in range(self.num_vertices):
            if not self.visited[i]:
                self._dfs(i, -1)

        return self.bridges
```

```java
class BridgeFinder {
    private List<List<Integer>> graph;
    private int numVertices;
    private int[] disc;  // Discovery time
    private int[] low;   // Low link value
    private boolean[] visited;
    private int timer;
    private List<int[]> bridges;

    BridgeFinder(int vertices) {
        numVertices = vertices;
        graph = new ArrayList<>();
        for (int i = 0; i < vertices; i++) graph.add(new LinkedList<>());
        disc = new int[vertices];
        low = new int[vertices];
        visited = new boolean[vertices];
        bridges = new ArrayList<>();
    }

    void addEdge(int from, int to) {
        graph.get(from).add(to);
        graph.get(to).add(from);
    }

    private void dfs(int u, int parent) {
        visited[u] = true;
        disc[u] = low[u] = ++timer;

        for (int v : graph.get(u)) {
            if (v == parent) continue; // Skip parent edge

            if (!visited[v]) {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);

                // Bridge condition: low[v] > disc[u] means v cannot reach any
                // ancestor of u, so removing (u, v) disconnects v's subtree.
                if (low[v] > disc[u]) bridges.add(new int[]{u, v});
            } else {
                // Back edge - update low[u]
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }

    List<int[]> findBridges() {
        bridges.clear();
        Arrays.fill(visited, false);
        Arrays.fill(disc, 0);
        Arrays.fill(low, 0);
        timer = 0;

        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) dfs(i, -1);
        }
        return bridges;
    }
}
```

```go
type BridgeFinder struct {
    graph       [][]int
    numVertices int
    disc        []int // Discovery time
    low         []int // Low link value
    visited     []bool
    timer       int
    bridges     [][2]int
}

func NewBridgeFinder(vertices int) *BridgeFinder {
    return &BridgeFinder{
        graph:       make([][]int, vertices),
        numVertices: vertices,
        disc:        make([]int, vertices),
        low:         make([]int, vertices),
        visited:     make([]bool, vertices),
    }
}

func (b *BridgeFinder) AddEdge(from, to int) {
    b.graph[from] = append(b.graph[from], to)
    b.graph[to] = append(b.graph[to], from)
}

func (b *BridgeFinder) dfs(u, parent int) {
    b.visited[u] = true
    b.timer++
    b.disc[u], b.low[u] = b.timer, b.timer

    for _, v := range b.graph[u] {
        if v == parent {
            continue // Skip parent edge
        }
        if !b.visited[v] {
            b.dfs(v, u)
            b.low[u] = min(b.low[u], b.low[v])
            // Bridge condition: low[v] > disc[u] means v cannot reach any
            // ancestor of u, so removing (u, v) disconnects v's subtree.
            if b.low[v] > b.disc[u] {
                b.bridges = append(b.bridges, [2]int{u, v})
            }
        } else {
            // Back edge - update low[u]
            b.low[u] = min(b.low[u], b.disc[v])
        }
    }
}

func (b *BridgeFinder) FindBridges() [][2]int {
    b.bridges = nil
    for i := range b.visited {
        b.visited[i] = false
        b.disc[i] = 0
        b.low[i] = 0
    }
    b.timer = 0

    for i := 0; i < b.numVertices; i++ {
        if !b.visited[i] {
            b.dfs(i, -1)
        }
    }
    return b.bridges
}
```

Bridge-finding is a single DFS, `O(V + E)`, and is the standard tool for network-reliability and critical-connection analysis.

An **articulation point** is the vertex analogue, found by the same DFS with two adjustments. The condition softens from `>` to `>=`: a non-root vertex `u` is an articulation point when some child `v` has `low[v] >= disc[u]`. The equality case is the whole difference. If `v`'s subtree can climb back to `u` *itself* but no higher, cutting the *edge* `(u, v)` disconnects nothing — which is exactly why it wasn't a bridge — yet deleting the *vertex* `u` still severs that subtree. Removing a vertex is strictly more destructive than removing an edge, so the bar is lower.

The root needs its own rule, because it has no ancestor to escape to and the low-link test is meaningless there. Instead, the root is an articulation point precisely when it has two or more DFS children: two independent subtrees joined only through it. (Every bridge forces an articulation point at one of its ends, but not the reverse — a vertex can be critical without any single edge being.)

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
                
                // Articulation point condition: low[v] >= disc[u]
                // This means v cannot reach any ancestor of u (or can only reach u itself).
                // If we remove u, v's subtree becomes disconnected.
                // Note: We use >= (not >) because even if v can reach u, removing u disconnects.
                // See detailed explanation above for intuition.
                if (!isRoot && low[v] >= disc[u]) {
                    isArticulation[u] = true;
                }
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }
        
        // Root is articulation point if it has 2+ children
        // If root has only 1 child, removing root doesn't disconnect.
        // If root has 2+ children, removing root disconnects the subtrees.
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

```python
class ArticulationPointFinder:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.graph = [[] for _ in range(vertices)]
        self.disc = [0] * vertices
        self.low = [0] * vertices
        self.visited = [False] * vertices
        self.is_articulation = [False] * vertices
        self.timer = 0

    def add_edge(self, frm, to):
        self.graph[frm].append(to)
        self.graph[to].append(frm)

    def _dfs(self, u, parent, is_root):
        self.visited[u] = True
        self.timer += 1
        self.disc[u] = self.low[u] = self.timer
        children = 0

        for v in self.graph[u]:
            if v == parent:
                continue

            if not self.visited[v]:
                children += 1
                self._dfs(v, u, False)
                self.low[u] = min(self.low[u], self.low[v])
                # Articulation condition: low[v] >= disc[u] (uses >= not > because
                # even if v can reach u itself, removing u still disconnects v).
                if not is_root and self.low[v] >= self.disc[u]:
                    self.is_articulation[u] = True
            else:
                self.low[u] = min(self.low[u], self.disc[v])

        # Root is articulation point if it has 2+ children
        if is_root and children >= 2:
            self.is_articulation[u] = True

    def find_articulation_points(self):
        self.visited = [False] * self.num_vertices
        self.is_articulation = [False] * self.num_vertices
        self.disc = [0] * self.num_vertices
        self.low = [0] * self.num_vertices
        self.timer = 0

        for i in range(self.num_vertices):
            if not self.visited[i]:
                self._dfs(i, -1, True)

        return [i for i in range(self.num_vertices) if self.is_articulation[i]]
```

```java
class ArticulationPointFinder {
    private List<List<Integer>> graph;
    private int numVertices;
    private int[] disc;
    private int[] low;
    private boolean[] visited;
    private boolean[] isArticulation;
    private int timer;

    ArticulationPointFinder(int vertices) {
        numVertices = vertices;
        graph = new ArrayList<>();
        for (int i = 0; i < vertices; i++) graph.add(new LinkedList<>());
        disc = new int[vertices];
        low = new int[vertices];
        visited = new boolean[vertices];
        isArticulation = new boolean[vertices];
    }

    void addEdge(int from, int to) {
        graph.get(from).add(to);
        graph.get(to).add(from);
    }

    private void dfs(int u, int parent, boolean isRoot) {
        visited[u] = true;
        disc[u] = low[u] = ++timer;
        int children = 0;

        for (int v : graph.get(u)) {
            if (v == parent) continue;

            if (!visited[v]) {
                children++;
                dfs(v, u, false);
                low[u] = Math.min(low[u], low[v]);

                // Articulation condition: low[v] >= disc[u] (uses >= not > because
                // even if v can reach u itself, removing u still disconnects v).
                if (!isRoot && low[v] >= disc[u]) isArticulation[u] = true;
            } else {
                low[u] = Math.min(low[u], disc[v]);
            }
        }

        // Root is articulation point if it has 2+ children
        if (isRoot && children >= 2) isArticulation[u] = true;
    }

    List<Integer> findArticulationPoints() {
        Arrays.fill(visited, false);
        Arrays.fill(isArticulation, false);
        Arrays.fill(disc, 0);
        Arrays.fill(low, 0);
        timer = 0;

        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) dfs(i, -1, true);
        }

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            if (isArticulation[i]) result.add(i);
        }
        return result;
    }
}
```

```go
type ArticulationPointFinder struct {
    graph          [][]int
    numVertices    int
    disc           []int
    low            []int
    visited        []bool
    isArticulation []bool
    timer          int
}

func NewArticulationPointFinder(vertices int) *ArticulationPointFinder {
    return &ArticulationPointFinder{
        graph:          make([][]int, vertices),
        numVertices:    vertices,
        disc:           make([]int, vertices),
        low:            make([]int, vertices),
        visited:        make([]bool, vertices),
        isArticulation: make([]bool, vertices),
    }
}

func (a *ArticulationPointFinder) AddEdge(from, to int) {
    a.graph[from] = append(a.graph[from], to)
    a.graph[to] = append(a.graph[to], from)
}

func (a *ArticulationPointFinder) dfs(u, parent int, isRoot bool) {
    a.visited[u] = true
    a.timer++
    a.disc[u], a.low[u] = a.timer, a.timer
    children := 0

    for _, v := range a.graph[u] {
        if v == parent {
            continue
        }
        if !a.visited[v] {
            children++
            a.dfs(v, u, false)
            a.low[u] = min(a.low[u], a.low[v])
            // Articulation condition: low[v] >= disc[u] (uses >= not > because
            // even if v can reach u itself, removing u still disconnects v).
            if !isRoot && a.low[v] >= a.disc[u] {
                a.isArticulation[u] = true
            }
        } else {
            a.low[u] = min(a.low[u], a.disc[v])
        }
    }

    // Root is articulation point if it has 2+ children
    if isRoot && children >= 2 {
        a.isArticulation[u] = true
    }
}

func (a *ArticulationPointFinder) FindArticulationPoints() []int {
    for i := range a.visited {
        a.visited[i] = false
        a.isArticulation[i] = false
        a.disc[i] = 0
        a.low[i] = 0
    }
    a.timer = 0

    for i := 0; i < a.numVertices; i++ {
        if !a.visited[i] {
            a.dfs(i, -1, true)
        }
    }

    var result []int
    for i := 0; i < a.numVertices; i++ {
        if a.isArticulation[i] {
            result = append(result, i)
        }
    }
    return result
}
```

Also `O(V + E)`. Together, bridges and articulation points are the standard vocabulary for network-vulnerability analysis: the single edges and nodes whose failure fragments the system.

## 11.9 Strongly Connected Components

In a directed graph, a **strongly connected component (SCC)** is a maximal set of vertices where every one can reach every other — mutual reachability, not just connectivity. SCCs matter in compiler control-flow analysis, dependency resolution (a cycle of mutually-dependent modules is an SCC), and web-graph structure. Two `O(V + E)` algorithms find them.

**Kosaraju's algorithm** is the more intuitive: run DFS on the graph recording finish order, then run DFS on the *transpose* (all edges reversed) in reverse-finish order — each DFS tree in the second pass is one SCC. Two passes, both linear.

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

```python
class StronglyConnectedComponents:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.graph = [[] for _ in range(vertices)]
        self.reverse_graph = [[] for _ in range(vertices)]
        self.visited = [False] * vertices
        self.order = []
        self.component = [-1] * vertices

    def add_edge(self, frm, to):
        self.graph[frm].append(to)
        self.reverse_graph[to].append(frm)

    def _dfs1(self, v):
        self.visited[v] = True
        for u in self.graph[v]:
            if not self.visited[u]:
                self._dfs1(u)
        self.order.append(v)  # Add to order after processing

    def _dfs2(self, v, comp_id):
        self.visited[v] = True
        self.component[v] = comp_id
        for u in self.reverse_graph[v]:
            if not self.visited[u]:
                self._dfs2(u, comp_id)

    def find_sccs(self):
        # Step 1: First DFS on original graph
        self.visited = [False] * self.num_vertices
        self.order = []
        for i in range(self.num_vertices):
            if not self.visited[i]:
                self._dfs1(i)

        # Step 2: Second DFS on reverse graph in reverse order
        self.visited = [False] * self.num_vertices
        self.order.reverse()

        comp_id = 0
        for v in self.order:
            if not self.visited[v]:
                self._dfs2(v, comp_id)
                comp_id += 1

        # Step 3: Group vertices by component
        components = [[] for _ in range(comp_id)]
        for i in range(self.num_vertices):
            components[self.component[i]].append(i)

        return components

    def get_component_count(self):
        self.find_sccs()
        return max(self.component) + 1
```

```java
class StronglyConnectedComponents {
    private List<List<Integer>> graph;
    private List<List<Integer>> reverseGraph;
    private int numVertices;
    private boolean[] visited;
    private List<Integer> order;
    private int[] component;

    StronglyConnectedComponents(int vertices) {
        numVertices = vertices;
        graph = new ArrayList<>();
        reverseGraph = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            graph.add(new ArrayList<>());
            reverseGraph.add(new ArrayList<>());
        }
        visited = new boolean[vertices];
        order = new ArrayList<>();
        component = new int[vertices];
        Arrays.fill(component, -1);
    }

    void addEdge(int from, int to) {
        graph.get(from).add(to);
        reverseGraph.get(to).add(from);
    }

    private void dfs1(int v) {
        visited[v] = true;
        for (int u : graph.get(v)) {
            if (!visited[u]) dfs1(u);
        }
        order.add(v); // Add to order after processing
    }

    private void dfs2(int v, int compId) {
        visited[v] = true;
        component[v] = compId;
        for (int u : reverseGraph.get(v)) {
            if (!visited[u]) dfs2(u, compId);
        }
    }

    List<List<Integer>> findSCCs() {
        // Step 1: First DFS on original graph
        Arrays.fill(visited, false);
        order.clear();
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) dfs1(i);
        }

        // Step 2: Second DFS on reverse graph in reverse order
        Arrays.fill(visited, false);
        Collections.reverse(order);

        int compId = 0;
        for (int v : order) {
            if (!visited[v]) dfs2(v, compId++);
        }

        // Step 3: Group vertices by component
        List<List<Integer>> components = new ArrayList<>();
        for (int i = 0; i < compId; i++) components.add(new ArrayList<>());
        for (int i = 0; i < numVertices; i++) components.get(component[i]).add(i);
        return components;
    }

    int getComponentCount() {
        findSCCs();
        int max = 0;
        for (int c : component) max = Math.max(max, c);
        return max + 1;
    }
}
```

```go
import "slices"

type StronglyConnectedComponents struct {
    graph        [][]int
    reverseGraph [][]int
    numVertices  int
    visited      []bool
    order        []int
    component    []int
}

func NewStronglyConnectedComponents(vertices int) *StronglyConnectedComponents {
    component := make([]int, vertices)
    for i := range component {
        component[i] = -1
    }
    return &StronglyConnectedComponents{
        graph:        make([][]int, vertices),
        reverseGraph: make([][]int, vertices),
        numVertices:  vertices,
        visited:      make([]bool, vertices),
        component:    component,
    }
}

func (s *StronglyConnectedComponents) AddEdge(from, to int) {
    s.graph[from] = append(s.graph[from], to)
    s.reverseGraph[to] = append(s.reverseGraph[to], from)
}

func (s *StronglyConnectedComponents) dfs1(v int) {
    s.visited[v] = true
    for _, u := range s.graph[v] {
        if !s.visited[u] {
            s.dfs1(u)
        }
    }
    s.order = append(s.order, v) // Add to order after processing
}

func (s *StronglyConnectedComponents) dfs2(v, compID int) {
    s.visited[v] = true
    s.component[v] = compID
    for _, u := range s.reverseGraph[v] {
        if !s.visited[u] {
            s.dfs2(u, compID)
        }
    }
}

func (s *StronglyConnectedComponents) FindSCCs() [][]int {
    // Step 1: First DFS on original graph
    for i := range s.visited {
        s.visited[i] = false
    }
    s.order = nil
    for i := 0; i < s.numVertices; i++ {
        if !s.visited[i] {
            s.dfs1(i)
        }
    }

    // Step 2: Second DFS on reverse graph in reverse order
    for i := range s.visited {
        s.visited[i] = false
    }
    slices.Reverse(s.order)

    compID := 0
    for _, v := range s.order {
        if !s.visited[v] {
            s.dfs2(v, compID)
            compID++
        }
    }

    // Step 3: Group vertices by component
    components := make([][]int, compID)
    for i := 0; i < s.numVertices; i++ {
        components[s.component[i]] = append(components[s.component[i]], i)
    }
    return components
}

func (s *StronglyConnectedComponents) ComponentCount() int {
    s.FindSCCs()
    maxC := 0
    for _, c := range s.component {
        maxC = max(maxC, c)
    }
    return maxC + 1
}
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

```python
class TarjanSCC:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.graph = [[] for _ in range(vertices)]
        self.disc = [0] * vertices
        self.low = [0] * vertices
        self.on_stack = [False] * vertices
        self.stack = []
        self.timer = 0
        self.components = []

    def add_edge(self, frm, to):
        self.graph[frm].append(to)

    def _dfs(self, u):
        self.timer += 1
        self.disc[u] = self.low[u] = self.timer
        self.stack.append(u)
        self.on_stack[u] = True

        for v in self.graph[u]:
            if self.disc[v] == 0:
                self._dfs(v)
                self.low[u] = min(self.low[u], self.low[v])
            elif self.on_stack[v]:
                self.low[u] = min(self.low[u], self.disc[v])

        # If u is root of SCC
        if self.low[u] == self.disc[u]:
            component = []
            while True:
                v = self.stack.pop()
                self.on_stack[v] = False
                component.append(v)
                if v == u:
                    break
            self.components.append(component)

    def find_sccs(self):
        self.components = []
        self.disc = [0] * self.num_vertices
        self.low = [0] * self.num_vertices
        self.on_stack = [False] * self.num_vertices
        self.stack = []
        self.timer = 0

        for i in range(self.num_vertices):
            if self.disc[i] == 0:
                self._dfs(i)

        return self.components
```

```java
class TarjanSCC {
    private List<List<Integer>> graph;
    private int numVertices;
    private int[] disc;
    private int[] low;
    private boolean[] onStack;
    private Deque<Integer> stack;
    private int timer;
    private List<List<Integer>> components;

    TarjanSCC(int vertices) {
        numVertices = vertices;
        graph = new ArrayList<>();
        for (int i = 0; i < vertices; i++) graph.add(new ArrayList<>());
        disc = new int[vertices];
        low = new int[vertices];
        onStack = new boolean[vertices];
        stack = new ArrayDeque<>();
        components = new ArrayList<>();
    }

    void addEdge(int from, int to) {
        graph.get(from).add(to);
    }

    private void dfs(int u) {
        disc[u] = low[u] = ++timer;
        stack.push(u);
        onStack[u] = true;

        for (int v : graph.get(u)) {
            if (disc[v] == 0) {
                dfs(v);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }

        // If u is root of SCC
        if (low[u] == disc[u]) {
            List<Integer> component = new ArrayList<>();
            while (true) {
                int v = stack.pop();
                onStack[v] = false;
                component.add(v);
                if (v == u) break;
            }
            components.add(component);
        }
    }

    List<List<Integer>> findSCCs() {
        components.clear();
        Arrays.fill(disc, 0);
        Arrays.fill(low, 0);
        Arrays.fill(onStack, false);
        stack.clear();
        timer = 0;

        for (int i = 0; i < numVertices; i++) {
            if (disc[i] == 0) dfs(i);
        }
        return components;
    }
}
```

```go
type TarjanSCC struct {
    graph       [][]int
    numVertices int
    disc        []int
    low         []int
    onStack     []bool
    stack       []int
    timer       int
    components  [][]int
}

func NewTarjanSCC(vertices int) *TarjanSCC {
    return &TarjanSCC{
        graph:       make([][]int, vertices),
        numVertices: vertices,
        disc:        make([]int, vertices),
        low:         make([]int, vertices),
        onStack:     make([]bool, vertices),
    }
}

func (t *TarjanSCC) AddEdge(from, to int) {
    t.graph[from] = append(t.graph[from], to)
}

func (t *TarjanSCC) dfs(u int) {
    t.timer++
    t.disc[u], t.low[u] = t.timer, t.timer
    t.stack = append(t.stack, u)
    t.onStack[u] = true

    for _, v := range t.graph[u] {
        if t.disc[v] == 0 {
            t.dfs(v)
            t.low[u] = min(t.low[u], t.low[v])
        } else if t.onStack[v] {
            t.low[u] = min(t.low[u], t.disc[v])
        }
    }

    // If u is root of SCC
    if t.low[u] == t.disc[u] {
        var component []int
        for {
            v := t.stack[len(t.stack)-1]
            t.stack = t.stack[:len(t.stack)-1]
            t.onStack[v] = false
            component = append(component, v)
            if v == u {
                break
            }
        }
        t.components = append(t.components, component)
    }
}

func (t *TarjanSCC) FindSCCs() [][]int {
    t.components = nil
    for i := range t.disc {
        t.disc[i] = 0
        t.low[i] = 0
        t.onStack[i] = false
    }
    t.stack = nil
    t.timer = 0

    for i := 0; i < t.numVertices; i++ {
        if t.disc[i] == 0 {
            t.dfs(i)
        }
    }
    return t.components
}
```

**Tarjan's algorithm** does the same job in a *single* DFS by keeping vertices on a stack and using the same `disc`/`low` timestamps as bridge-finding: when a vertex's `low` equals its own `disc`, it's the root of an SCC, and everything above it on the stack is that component. One pass instead of two, at the cost of trickier bookkeeping.

## 11.10 0-1 BFS

When every edge weight is 0 or 1, you don't need Dijkstra's `log` factor. **0-1 BFS** replaces the priority queue with a double-ended queue: relax an edge of weight 0 and push the neighbor to the *front* (same distance layer), weight 1 and push to the *back* (next layer). The deque stays sorted by distance for free, so the whole thing runs in `O(V + E)` — Dijkstra's answer at BFS's cost. It's the right tool for grid problems mixing free and unit moves, or "teleport" edges of weight 0.

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

```python
from collections import deque

class BFS01:
    def __init__(self, vertices):
        self.num_vertices = vertices
        self.graph = [[] for _ in range(vertices)]  # entries: (to, weight) with weight 0 or 1

    def add_edge(self, frm, to, weight):
        self.graph[frm].append((to, weight))

    def shortest_path(self, start):
        dist = [float('inf')] * self.num_vertices
        dist[start] = 0
        dq = deque([start])

        while dq:
            u = dq.popleft()
            for v, w in self.graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    if w == 0:
                        dq.appendleft(v)  # Weight 0 - add to front
                    else:
                        dq.append(v)      # Weight 1 - add to back

        return dist

    def shortest_path_to(self, start, end):
        dist = [float('inf')] * self.num_vertices
        parent = [-1] * self.num_vertices
        dist[start] = 0
        dq = deque([start])

        while dq:
            u = dq.popleft()
            if u == end:
                break
            for v, w in self.graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    parent[v] = u
                    if w == 0:
                        dq.appendleft(v)
                    else:
                        dq.append(v)

        # Reconstruct path
        if dist[end] == float('inf'):
            return []

        path = []
        current = end
        while current != -1:
            path.append(current)
            current = parent[current]
        path.reverse()
        return path
```

```java
class BFS01 {
    private static class Edge01 {
        int to, weight; // 0 or 1
        Edge01(int to, int weight) { this.to = to; this.weight = weight; }
    }

    private List<List<Edge01>> graph;
    private int numVertices;

    BFS01(int vertices) {
        numVertices = vertices;
        graph = new ArrayList<>();
        for (int i = 0; i < vertices; i++) graph.add(new LinkedList<>());
    }

    void addEdge(int from, int to, int weight) {
        graph.get(from).add(new Edge01(to, weight));
    }

    int[] shortestPath(int start) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        Deque<Integer> dq = new ArrayDeque<>();

        dist[start] = 0;
        dq.addLast(start);

        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            for (Edge01 edge : graph.get(u)) {
                int v = edge.to, w = edge.weight;
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (w == 0) dq.addFirst(v); // Weight 0 - add to front
                    else dq.addLast(v);         // Weight 1 - add to back
                }
            }
        }
        return dist;
    }

    List<Integer> shortestPathTo(int start, int end) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        int[] parent = new int[numVertices];
        Arrays.fill(parent, -1);
        Deque<Integer> dq = new ArrayDeque<>();

        dist[start] = 0;
        dq.addLast(start);

        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            if (u == end) break;
            for (Edge01 edge : graph.get(u)) {
                int v = edge.to, w = edge.weight;
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                    if (w == 0) dq.addFirst(v);
                    else dq.addLast(v);
                }
            }
        }

        // Reconstruct path
        if (dist[end] == Integer.MAX_VALUE) return new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        int current = end;
        while (current != -1) {
            path.add(current);
            current = parent[current];
        }
        Collections.reverse(path);
        return path;
    }
}
```

```go
import (
    "container/list"
    "math"
    "slices"
)

type edge01 struct {
    to     int
    weight int // 0 or 1
}

type BFS01 struct {
    graph       [][]edge01
    numVertices int
}

func NewBFS01(vertices int) *BFS01 {
    return &BFS01{graph: make([][]edge01, vertices), numVertices: vertices}
}

func (g *BFS01) AddEdge(from, to, weight int) {
    g.graph[from] = append(g.graph[from], edge01{to, weight})
}

func (g *BFS01) ShortestPath(start int) []int {
    dist := make([]int, g.numVertices)
    for i := range dist {
        dist[i] = math.MaxInt
    }
    dist[start] = 0
    dq := list.New()
    dq.PushBack(start)

    for dq.Len() > 0 {
        u := dq.Remove(dq.Front()).(int)
        for _, e := range g.graph[u] {
            v, w := e.to, e.weight
            if dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                if w == 0 {
                    dq.PushFront(v) // Weight 0 - add to front
                } else {
                    dq.PushBack(v) // Weight 1 - add to back
                }
            }
        }
    }
    return dist
}

func (g *BFS01) ShortestPathTo(start, end int) []int {
    dist := make([]int, g.numVertices)
    for i := range dist {
        dist[i] = math.MaxInt
    }
    parent := make([]int, g.numVertices)
    for i := range parent {
        parent[i] = -1
    }
    dist[start] = 0
    dq := list.New()
    dq.PushBack(start)

    for dq.Len() > 0 {
        u := dq.Remove(dq.Front()).(int)
        if u == end {
            break
        }
        for _, e := range g.graph[u] {
            v, w := e.to, e.weight
            if dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                parent[v] = u
                if w == 0 {
                    dq.PushFront(v)
                } else {
                    dq.PushBack(v)
                }
            }
        }
    }

    // Reconstruct path
    if dist[end] == math.MaxInt {
        return nil
    }
    var path []int
    for current := end; current != -1; current = parent[current] {
        path = append(path, current)
    }
    slices.Reverse(path)
    return path
}
```

## 11.11 A Few Everyday Graph Routines

Three short functions come up constantly and are worth seeing because each is a two-line variation on a traversal you already know. **Connected components** is DFS restarted from every unvisited vertex, one component per restart:

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

```python
def find_connected_components(graph):
    n = len(graph)
    visited = [False] * n
    components = []

    def dfs(v, comp):
        visited[v] = True
        comp.append(v)
        for neighbor in graph[v]:
            if not visited[neighbor]:
                dfs(neighbor, comp)

    for i in range(n):
        if not visited[i]:
            component = []
            dfs(i, component)
            components.append(component)

    return components
```

```java
List<List<Integer>> findConnectedComponents(List<List<Integer>> graph) {
    int n = graph.size();
    boolean[] visited = new boolean[n];
    List<List<Integer>> components = new ArrayList<>();

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            List<Integer> component = new ArrayList<>();
            dfsComponent(graph, visited, i, component);
            components.add(component);
        }
    }
    return components;
}

private void dfsComponent(List<List<Integer>> graph, boolean[] visited, int v, List<Integer> comp) {
    visited[v] = true;
    comp.add(v);
    for (int neighbor : graph.get(v)) {
        if (!visited[neighbor]) dfsComponent(graph, visited, neighbor, comp);
    }
}
```

```go
func findConnectedComponents(graph [][]int) [][]int {
    n := len(graph)
    visited := make([]bool, n)
    var components [][]int

    var dfs func(v int, comp *[]int)
    dfs = func(v int, comp *[]int) {
        visited[v] = true
        *comp = append(*comp, v)
        for _, neighbor := range graph[v] {
            if !visited[neighbor] {
                dfs(neighbor, comp)
            }
        }
    }

    for i := 0; i < n; i++ {
        if !visited[i] {
            var component []int
            dfs(i, &component)
            components = append(components, component)
        }
    }
    return components
}
```

**Cycle detection** in a directed graph is DFS tracking the current recursion stack — an edge back to a vertex still on the stack is a cycle (the same `recStack` idea that made topological sort detect impossible orderings):

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

```python
def has_cycle(graph):
    n = len(graph)
    visited = [False] * n
    rec_stack = [False] * n

    def dfs(v):
        visited[v] = True
        rec_stack[v] = True

        for neighbor in graph[v]:
            if not visited[neighbor]:
                if dfs(neighbor):
                    return True
            elif rec_stack[neighbor]:
                return True

        rec_stack[v] = False
        return False

    for i in range(n):
        if not visited[i] and dfs(i):
            return True

    return False
```

```java
boolean hasCycle(List<List<Integer>> graph) {
    int n = graph.size();
    boolean[] visited = new boolean[n];
    boolean[] recStack = new boolean[n];

    for (int i = 0; i < n; i++) {
        if (!visited[i] && dfsCycle(graph, visited, recStack, i)) return true;
    }
    return false;
}

private boolean dfsCycle(List<List<Integer>> graph, boolean[] visited, boolean[] recStack, int v) {
    visited[v] = true;
    recStack[v] = true;

    for (int neighbor : graph.get(v)) {
        if (!visited[neighbor]) {
            if (dfsCycle(graph, visited, recStack, neighbor)) return true;
        } else if (recStack[neighbor]) {
            return true;
        }
    }

    recStack[v] = false;
    return false;
}
```

```go
func hasCycleDirected(graph [][]int) bool {
    n := len(graph)
    visited := make([]bool, n)
    recStack := make([]bool, n)

    var dfs func(v int) bool
    dfs = func(v int) bool {
        visited[v] = true
        recStack[v] = true

        for _, neighbor := range graph[v] {
            if !visited[neighbor] {
                if dfs(neighbor) {
                    return true
                }
            } else if recStack[neighbor] {
                return true
            }
        }

        recStack[v] = false
        return false
    }

    for i := 0; i < n; i++ {
        if !visited[i] && dfs(i) {
            return true
        }
    }
    return false
}
```

And a **bipartite check** is BFS two-coloring: give each vertex the opposite color of its neighbor, and if you ever need a vertex to hold both colors, the graph isn't bipartite:

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

```python
def is_bipartite(graph):
    n = len(graph)
    color = [-1] * n

    for i in range(n):
        if color[i] == -1:
            color[i] = 0
            q = deque([i])

            while q:
                u = q.popleft()
                for v in graph[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return False

    return True
```

```java
boolean isBipartite(List<List<Integer>> graph) {
    int n = graph.size();
    int[] color = new int[n];
    Arrays.fill(color, -1);

    for (int i = 0; i < n; i++) {
        if (color[i] == -1) {
            color[i] = 0;
            Queue<Integer> q = new ArrayDeque<>();
            q.add(i);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : graph.get(u)) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.add(v);
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

```go
func isBipartite(graph [][]int) bool {
    n := len(graph)
    color := make([]int, n)
    for i := range color {
        color[i] = -1
    }

    for i := 0; i < n; i++ {
        if color[i] == -1 {
            color[i] = 0
            queue := []int{i}
            for len(queue) > 0 {
                u := queue[0]
                queue = queue[1:]
                for _, v := range graph[u] {
                    if color[v] == -1 {
                        color[v] = 1 - color[u]
                        queue = append(queue, v)
                    } else if color[v] == color[u] {
                        return false
                    }
                }
            }
        }
    }
    return true
}
```

## 11.12 A* Search

A* is Dijkstra with a sense of direction. Dijkstra expands outward blindly, equally in all directions; A* adds a **heuristic** `h(n)` estimating the remaining distance to the goal and prioritizes nodes by `f(n) = g(n) + h(n)` — cost-so-far plus estimated cost-to-go. That nudges the search toward the target instead of exploring the whole graph, which is why games and robotics pathfinders use it. The one rule that keeps it correct: the heuristic must be **admissible** — never *over*estimate the true remaining cost. Straight-line (or Manhattan, on a grid) distance is the classic admissible choice. Set `h(n) = 0` and A* degenerates back into Dijkstra.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <cmath>
#include <climits>
using namespace std;

struct Node {
    int x, y;
    int g, h, f;
    Node* parent;
    
    Node(int x, int y) : x(x), y(y), g(0), h(0), f(0), parent(nullptr) {}
    
    bool operator>(const Node& other) const {
        return f > other.f;
    }
};

// Order by the pointed-to node's f, not by pointer address
struct CompareNode {
    bool operator()(const Node* a, const Node* b) const { return a->f > b->f; }
};

class AStar {
private:
    vector<vector<int>> grid;
    int rows, cols;
    
    // Manhattan distance heuristic (admissible for grid)
    int heuristic(int x1, int y1, int x2, int y2) {
        return abs(x1 - x2) + abs(y1 - y2);
    }
    
    // Get neighbors (4-directional)
    vector<pair<int, int>> getNeighbors(int x, int y) {
        vector<pair<int, int>> neighbors;
        int dx[] = {-1, 1, 0, 0};
        int dy[] = {0, 0, -1, 1};
        
        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];
            
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && 
                grid[nx][ny] != 1) {  // 1 = obstacle
                neighbors.push_back({nx, ny});
            }
        }
        
        return neighbors;
    }
    
public:
    AStar(vector<vector<int>> g) : grid(g) {
        rows = grid.size();
        cols = grid[0].size();
    }
    
    vector<pair<int, int>> findPath(pair<int, int> start, pair<int, int> goal) {
        priority_queue<Node*, vector<Node*>, CompareNode> openSet;
        unordered_map<string, Node*> allNodes;
        unordered_map<string, bool> closedSet;
        
        Node* startNode = new Node(start.first, start.second);
        startNode->h = heuristic(start.first, start.second, goal.first, goal.second);
        startNode->f = startNode->g + startNode->h;
        
        string startKey = to_string(start.first) + "," + to_string(start.second);
        allNodes[startKey] = startNode;
        openSet.push(startNode);
        
        while (!openSet.empty()) {
            Node* current = openSet.top();
            openSet.pop();
            
            string currentKey = to_string(current->x) + "," + to_string(current->y);
            
            if (closedSet[currentKey]) continue;
            closedSet[currentKey] = true;
            
            // Goal reached
            if (current->x == goal.first && current->y == goal.second) {
                // Reconstruct path
                vector<pair<int, int>> path;
                Node* node = current;
                while (node) {
                    path.push_back({node->x, node->y});
                    node = node->parent;
                }
                reverse(path.begin(), path.end());
                return path;
            }
            
            // Explore neighbors
            for (auto [nx, ny] : getNeighbors(current->x, current->y)) {
                string neighborKey = to_string(nx) + "," + to_string(ny);
                
                if (closedSet[neighborKey]) continue;
                
                int tentativeG = current->g + 1;  // Assuming unit cost
                
                Node* neighbor;
                if (allNodes.find(neighborKey) == allNodes.end()) {
                    neighbor = new Node(nx, ny);
                    allNodes[neighborKey] = neighbor;
                } else {
                    neighbor = allNodes[neighborKey];
                    if (tentativeG >= neighbor->g) continue;
                }
                
                neighbor->parent = current;
                neighbor->g = tentativeG;
                neighbor->h = heuristic(nx, ny, goal.first, goal.second);
                neighbor->f = neighbor->g + neighbor->h;
                
                openSet.push(neighbor);
            }
        }
        
        return {};  // No path found
    }
};
```

```python
import heapq

class AStar:
    def __init__(self, grid):
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0])

    # Manhattan distance heuristic (admissible for grid)
    def _heuristic(self, x1, y1, x2, y2):
        return abs(x1 - x2) + abs(y1 - y2)

    # Get neighbors (4-directional)
    def _get_neighbors(self, x, y):
        neighbors = []
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.rows and 0 <= ny < self.cols and self.grid[nx][ny] != 1:
                neighbors.append((nx, ny))  # 1 = obstacle
        return neighbors

    def find_path(self, start, goal):
        g_score = {start: 0}
        parent = {start: None}
        closed = set()

        h = self._heuristic(start[0], start[1], goal[0], goal[1])
        # entries: (f, g, node)
        open_set = [(h, 0, start)]

        while open_set:
            _, _, current = heapq.heappop(open_set)

            if current in closed:
                continue
            closed.add(current)

            # Goal reached
            if current == goal:
                path = []
                node = current
                while node is not None:
                    path.append(node)
                    node = parent[node]
                path.reverse()
                return path

            # Explore neighbors
            for neighbor in self._get_neighbors(*current):
                if neighbor in closed:
                    continue

                tentative_g = g_score[current] + 1  # Assuming unit cost

                if neighbor in g_score and tentative_g >= g_score[neighbor]:
                    continue

                parent[neighbor] = current
                g_score[neighbor] = tentative_g
                nh = self._heuristic(neighbor[0], neighbor[1], goal[0], goal[1])
                heapq.heappush(open_set, (tentative_g + nh, tentative_g, neighbor))

        return []  # No path found
```

```java
class AStar {
    private int[][] grid;
    private int rows, cols;

    AStar(int[][] grid) {
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    // Manhattan distance heuristic (admissible for grid)
    private int heuristic(int x1, int y1, int x2, int y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    // Get neighbors (4-directional)
    private List<int[]> getNeighbors(int x, int y) {
        List<int[]> neighbors = new ArrayList<>();
        int[] dx = {-1, 1, 0, 0};
        int[] dy = {0, 0, -1, 1};
        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] != 1) {
                neighbors.add(new int[]{nx, ny}); // 1 = obstacle
            }
        }
        return neighbors;
    }

    private long key(int x, int y) { return (long) x * cols + y; }

    List<int[]> findPath(int[] start, int[] goal) {
        Map<Long, Integer> gScore = new HashMap<>();
        Map<Long, long[]> parent = new HashMap<>();
        Set<Long> closed = new HashSet<>();

        long startKey = key(start[0], start[1]);
        gScore.put(startKey, 0);
        parent.put(startKey, null);

        int h = heuristic(start[0], start[1], goal[0], goal[1]);
        // entries: {f, g, x, y}
        PriorityQueue<int[]> open = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        open.add(new int[]{h, 0, start[0], start[1]});

        while (!open.isEmpty()) {
            int[] cur = open.poll();
            int cx = cur[2], cy = cur[3];
            long curKey = key(cx, cy);

            if (closed.contains(curKey)) continue;
            closed.add(curKey);

            // Goal reached
            if (cx == goal[0] && cy == goal[1]) {
                List<int[]> path = new ArrayList<>();
                long[] node = {cx, cy};
                while (node != null) {
                    path.add(new int[]{(int) node[0], (int) node[1]});
                    node = parent.get(key((int) node[0], (int) node[1]));
                }
                Collections.reverse(path);
                return path;
            }

            // Explore neighbors
            for (int[] nb : getNeighbors(cx, cy)) {
                long nbKey = key(nb[0], nb[1]);
                if (closed.contains(nbKey)) continue;

                int tentativeG = gScore.get(curKey) + 1; // Assuming unit cost
                if (gScore.containsKey(nbKey) && tentativeG >= gScore.get(nbKey)) continue;

                parent.put(nbKey, new long[]{cx, cy});
                gScore.put(nbKey, tentativeG);
                int nh = heuristic(nb[0], nb[1], goal[0], goal[1]);
                open.add(new int[]{tentativeG + nh, tentativeG, nb[0], nb[1]});
            }
        }

        return new ArrayList<>(); // No path found
    }
}
```

```go
import (
    "container/heap"
    "slices"
)

type aStarItem struct {
    f, g, x, y int
}
type aStarPQ []aStarItem

func (pq aStarPQ) Len() int           { return len(pq) }
func (pq aStarPQ) Less(i, j int) bool { return pq[i].f < pq[j].f }
func (pq aStarPQ) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *aStarPQ) Push(x any)        { *pq = append(*pq, x.(aStarItem)) }
func (pq *aStarPQ) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    *pq = old[:n-1]
    return item
}

func abs(x int) int {
    if x < 0 {
        return -x
    }
    return x
}

type AStar struct {
    grid       [][]int
    rows, cols int
}

func NewAStar(grid [][]int) *AStar {
    return &AStar{grid: grid, rows: len(grid), cols: len(grid[0])}
}

// Manhattan distance heuristic (admissible for grid)
func (a *AStar) heuristic(x1, y1, x2, y2 int) int {
    return abs(x1-x2) + abs(y1-y2)
}

// Get neighbors (4-directional)
func (a *AStar) neighbors(x, y int) [][2]int {
    var result [][2]int
    dirs := [4][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
    for _, d := range dirs {
        nx, ny := x+d[0], y+d[1]
        if nx >= 0 && nx < a.rows && ny >= 0 && ny < a.cols && a.grid[nx][ny] != 1 {
            result = append(result, [2]int{nx, ny}) // 1 = obstacle
        }
    }
    return result
}

func (a *AStar) FindPath(start, goal [2]int) [][2]int {
    gScore := map[[2]int]int{start: 0}
    parent := map[[2]int][2]int{}
    hasParent := map[[2]int]bool{}
    closed := map[[2]int]bool{}

    h := a.heuristic(start[0], start[1], goal[0], goal[1])
    open := &aStarPQ{{h, 0, start[0], start[1]}}

    for open.Len() > 0 {
        cur := heap.Pop(open).(aStarItem)
        node := [2]int{cur.x, cur.y}

        if closed[node] {
            continue
        }
        closed[node] = true

        // Goal reached
        if node == goal {
            var path [][2]int
            for {
                path = append(path, node)
                if !hasParent[node] {
                    break
                }
                node = parent[node]
            }
            slices.Reverse(path)
            return path
        }

        // Explore neighbors
        for _, nb := range a.neighbors(cur.x, cur.y) {
            if closed[nb] {
                continue
            }
            tentativeG := gScore[node] + 1 // Assuming unit cost
            if g, ok := gScore[nb]; ok && tentativeG >= g {
                continue
            }
            parent[nb] = node
            hasParent[nb] = true
            gScore[nb] = tentativeG
            nh := a.heuristic(nb[0], nb[1], goal[0], goal[1])
            heap.Push(open, aStarItem{tentativeG + nh, tentativeG, nb[0], nb[1]})
        }
    }
    return nil // No path found
}
```

The three shortest-path tools now form a ladder: BFS for unweighted graphs, Dijkstra when weights matter but you have no heuristic, A* when you do. Use the most informed one your problem allows.

## 11.13 Network Flow

A different question about weighted graphs: given a network of pipes with capacities, a **source**, and a **sink**, how much can flow from source to sink at once? The **Ford-Fulkerson** method answers it by repeatedly finding an *augmenting path* — any source-to-sink route with spare capacity — and pushing as much flow as its tightest edge allows, updating a *residual graph* that tracks remaining capacity (and lets flow be "pushed back" to reroute). When no augmenting path remains, the flow is maximal. Finding each path with BFS (the Edmonds-Karp refinement below) bounds the work at `O(V·E²)`.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <algorithm>
using namespace std;

class FordFulkerson {
private:
    int n;
    vector<vector<int>> capacity;
    vector<vector<int>> flow;
    vector<vector<int>> graph;
    
    // BFS to find augmenting path
    bool bfs(int source, int sink, vector<int>& parent) {
        vector<bool> visited(n, false);
        queue<int> q;
        
        q.push(source);
        visited[source] = true;
        parent[source] = -1;
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (int v : graph[u]) {
                if (!visited[v] && capacity[u][v] - flow[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    q.push(v);
                    
                    if (v == sink) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
public:
    FordFulkerson(int numNodes) : n(numNodes) {
        capacity.assign(n, vector<int>(n, 0));
        flow.assign(n, vector<int>(n, 0));
        graph.assign(n, vector<int>());
    }
    
    void addEdge(int u, int v, int cap) {
        graph[u].push_back(v);
        graph[v].push_back(u);  // For residual graph
        capacity[u][v] = cap;
    }
    
    int maxFlow(int source, int sink) {
        int maxFlow = 0;
        vector<int> parent(n);
        
        // Find augmenting paths and update flow
        while (bfs(source, sink, parent)) {
            int pathFlow = INT_MAX;
            
            // Find minimum capacity in path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = min(pathFlow, capacity[u][v] - flow[u][v]);
            }
            
            // Update flow along path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow;  // Residual capacity
            }
            
            maxFlow += pathFlow;
        }
        
        return maxFlow;
    }
};
```

```python
from collections import deque

class FordFulkerson:
    def __init__(self, num_nodes):
        self.n = num_nodes
        self.capacity = [[0] * num_nodes for _ in range(num_nodes)]
        self.flow = [[0] * num_nodes for _ in range(num_nodes)]
        self.graph = [[] for _ in range(num_nodes)]

    def add_edge(self, u, v, cap):
        self.graph[u].append(v)
        self.graph[v].append(u)  # For residual graph
        self.capacity[u][v] = cap

    # BFS to find augmenting path
    def _bfs(self, source, sink, parent):
        visited = [False] * self.n
        q = deque([source])
        visited[source] = True
        parent[source] = -1

        while q:
            u = q.popleft()
            for v in self.graph[u]:
                if not visited[v] and self.capacity[u][v] - self.flow[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    q.append(v)
                    if v == sink:
                        return True
        return False

    def max_flow(self, source, sink):
        max_flow = 0
        parent = [0] * self.n

        # Find augmenting paths and update flow
        while self._bfs(source, sink, parent):
            path_flow = float('inf')

            # Find minimum capacity in path
            v = sink
            while v != source:
                u = parent[v]
                path_flow = min(path_flow, self.capacity[u][v] - self.flow[u][v])
                v = u

            # Update flow along path
            v = sink
            while v != source:
                u = parent[v]
                self.flow[u][v] += path_flow
                self.flow[v][u] -= path_flow  # Residual capacity
                v = u

            max_flow += path_flow

        return max_flow
```

```java
class FordFulkerson {
    private int n;
    private int[][] capacity;
    private int[][] flow;
    private List<List<Integer>> graph;

    FordFulkerson(int numNodes) {
        n = numNodes;
        capacity = new int[n][n];
        flow = new int[n][n];
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    }

    void addEdge(int u, int v, int cap) {
        graph.get(u).add(v);
        graph.get(v).add(u); // For residual graph
        capacity[u][v] = cap;
    }

    // BFS to find augmenting path
    private boolean bfs(int source, int sink, int[] parent) {
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();

        q.add(source);
        visited[source] = true;
        parent[source] = -1;

        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph.get(u)) {
                if (!visited[v] && capacity[u][v] - flow[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    q.add(v);
                    if (v == sink) return true;
                }
            }
        }
        return false;
    }

    int maxFlow(int source, int sink) {
        int maxFlow = 0;
        int[] parent = new int[n];

        // Find augmenting paths and update flow
        while (bfs(source, sink, parent)) {
            int pathFlow = Integer.MAX_VALUE;

            // Find minimum capacity in path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, capacity[u][v] - flow[u][v]);
            }

            // Update flow along path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow; // Residual capacity
            }

            maxFlow += pathFlow;
        }
        return maxFlow;
    }
}
```

```go
import "math"

type FordFulkerson struct {
    n        int
    capacity [][]int
    flow     [][]int
    graph    [][]int
}

func NewFordFulkerson(numNodes int) *FordFulkerson {
    capacity := make([][]int, numNodes)
    flow := make([][]int, numNodes)
    for i := 0; i < numNodes; i++ {
        capacity[i] = make([]int, numNodes)
        flow[i] = make([]int, numNodes)
    }
    return &FordFulkerson{n: numNodes, capacity: capacity, flow: flow, graph: make([][]int, numNodes)}
}

func (f *FordFulkerson) AddEdge(u, v, cap int) {
    f.graph[u] = append(f.graph[u], v)
    f.graph[v] = append(f.graph[v], u) // For residual graph
    f.capacity[u][v] = cap
}

// bfs finds an augmenting path
func (f *FordFulkerson) bfs(source, sink int, parent []int) bool {
    visited := make([]bool, f.n)
    queue := []int{source}
    visited[source] = true
    parent[source] = -1

    for len(queue) > 0 {
        u := queue[0]
        queue = queue[1:]
        for _, v := range f.graph[u] {
            if !visited[v] && f.capacity[u][v]-f.flow[u][v] > 0 {
                visited[v] = true
                parent[v] = u
                queue = append(queue, v)
                if v == sink {
                    return true
                }
            }
        }
    }
    return false
}

func (f *FordFulkerson) MaxFlow(source, sink int) int {
    maxFlow := 0
    parent := make([]int, f.n)

    // Find augmenting paths and update flow
    for f.bfs(source, sink, parent) {
        pathFlow := math.MaxInt

        // Find minimum capacity in path
        for v := sink; v != source; v = parent[v] {
            u := parent[v]
            pathFlow = min(pathFlow, f.capacity[u][v]-f.flow[u][v])
        }

        // Update flow along path
        for v := sink; v != source; v = parent[v] {
            u := parent[v]
            f.flow[u][v] += pathFlow
            f.flow[v][u] -= pathFlow // Residual capacity
        }

        maxFlow += pathFlow
    }
    return maxFlow
}
```

Max flow is more useful than it looks: by the max-flow/min-cut theorem the maximum flow equals the *minimum cut* — the cheapest set of edges whose removal severs source from sink — so the same code solves bipartite matching, network reliability, and resource-allocation problems that don't look like flow at all. Faster variants trade complexity for speed: Edmonds-Karp is `O(V·E²)`, Dinic's `O(V²·E)`.

## 11.14 Graph Coloring

**Graph coloring** assigns a color to each vertex so that no edge joins two of the same color; the fewest colors that suffice is the graph's **chromatic number**. It's the abstract form of conflict-free scheduling: exam timetabling, register allocation in compilers (variables that are live at once conflict), and map coloring are all colorings. The catch is that finding the chromatic number is NP-hard, so in practice you either settle for a fast greedy approximation or brute-force small instances with backtracking.

The greedy version scans vertices in order, giving each the lowest color not used by an already-colored neighbor. Fast (`O(V + E)`) but not optimal — its color count depends on vertex order:

```cpp
#include <iostream>
#include <vector>
#include <set>
#include <queue>
#include <algorithm>
using namespace std;

class GraphColoring {
private:
    vector<vector<int>> graph;
    int n;
    
public:
    GraphColoring(vector<vector<int>> g) : graph(g), n(g.size()) {}
    
    // Greedy coloring - O(V + E)
    vector<int> greedyColoring() {
        vector<int> color(n, -1);
        color[0] = 0;  // First vertex gets color 0
        
        // Available colors for each vertex
        vector<bool> available(n, true);
        
        for (int u = 1; u < n; u++) {
            // Mark colors of adjacent vertices as unavailable
            for (int v : graph[u]) {
                if (color[v] != -1) {
                    available[color[v]] = false;
                }
            }
            
            // Find first available color
            int cr;
            for (cr = 0; cr < n; cr++) {
                if (available[cr]) {
                    break;
                }
            }
            
            color[u] = cr;
            
            // Reset available colors for next vertex
            fill(available.begin(), available.end(), true);
        }
        
        return color;
    }
    
    // Check if graph is bipartite (2-colorable)
    bool isBipartite() {
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
                            return false;  // Not bipartite
                        }
                    }
                }
            }
        }
        
        return true;
    }
    
    // Find chromatic number (minimum colors needed)
    int chromaticNumber() {
        // This is NP-hard, so we use greedy as approximation
        vector<int> colors = greedyColoring();
        return *max_element(colors.begin(), colors.end()) + 1;
    }
};
```

```python
from collections import deque

class GraphColoring:
    def __init__(self, graph):
        self.graph = graph
        self.n = len(graph)

    # Greedy coloring - O(V + E)
    def greedy_coloring(self):
        color = [-1] * self.n
        color[0] = 0  # First vertex gets color 0
        available = [True] * self.n

        for u in range(1, self.n):
            # Mark colors of adjacent vertices as unavailable
            for v in self.graph[u]:
                if color[v] != -1:
                    available[color[v]] = False

            # Find first available color
            cr = 0
            while cr < self.n:
                if available[cr]:
                    break
                cr += 1

            color[u] = cr

            # Reset available colors for next vertex
            available = [True] * self.n

        return color

    # Check if graph is bipartite (2-colorable)
    def is_bipartite(self):
        color = [-1] * self.n

        for i in range(self.n):
            if color[i] == -1:
                color[i] = 0
                q = deque([i])

                while q:
                    u = q.popleft()
                    for v in self.graph[u]:
                        if color[v] == -1:
                            color[v] = 1 - color[u]
                            q.append(v)
                        elif color[v] == color[u]:
                            return False  # Not bipartite

        return True

    # Find chromatic number (minimum colors needed)
    def chromatic_number(self):
        # This is NP-hard, so we use greedy as approximation
        colors = self.greedy_coloring()
        return max(colors) + 1
```

```java
class GraphColoring {
    private List<List<Integer>> graph;
    private int n;

    GraphColoring(List<List<Integer>> graph) {
        this.graph = graph;
        this.n = graph.size();
    }

    // Greedy coloring - O(V + E)
    int[] greedyColoring() {
        int[] color = new int[n];
        Arrays.fill(color, -1);
        color[0] = 0; // First vertex gets color 0
        boolean[] available = new boolean[n];
        Arrays.fill(available, true);

        for (int u = 1; u < n; u++) {
            // Mark colors of adjacent vertices as unavailable
            for (int v : graph.get(u)) {
                if (color[v] != -1) available[color[v]] = false;
            }

            // Find first available color
            int cr;
            for (cr = 0; cr < n; cr++) {
                if (available[cr]) break;
            }
            color[u] = cr;

            // Reset available colors for next vertex
            Arrays.fill(available, true);
        }
        return color;
    }

    // Check if graph is bipartite (2-colorable)
    boolean isBipartite() {
        int[] color = new int[n];
        Arrays.fill(color, -1);
        Queue<Integer> q = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            if (color[i] == -1) {
                color[i] = 0;
                q.add(i);
                while (!q.isEmpty()) {
                    int u = q.poll();
                    for (int v : graph.get(u)) {
                        if (color[v] == -1) {
                            color[v] = 1 - color[u];
                            q.add(v);
                        } else if (color[v] == color[u]) {
                            return false; // Not bipartite
                        }
                    }
                }
            }
        }
        return true;
    }

    // Find chromatic number (minimum colors needed)
    int chromaticNumber() {
        // This is NP-hard, so we use greedy as approximation
        int[] colors = greedyColoring();
        int max = 0;
        for (int c : colors) max = Math.max(max, c);
        return max + 1;
    }
}
```

```go
type GraphColoring struct {
    graph [][]int
    n     int
}

func NewGraphColoring(graph [][]int) *GraphColoring {
    return &GraphColoring{graph: graph, n: len(graph)}
}

// GreedyColoring - O(V + E)
func (gc *GraphColoring) GreedyColoring() []int {
    color := make([]int, gc.n)
    for i := range color {
        color[i] = -1
    }
    color[0] = 0 // First vertex gets color 0
    available := make([]bool, gc.n)
    for i := range available {
        available[i] = true
    }

    for u := 1; u < gc.n; u++ {
        // Mark colors of adjacent vertices as unavailable
        for _, v := range gc.graph[u] {
            if color[v] != -1 {
                available[color[v]] = false
            }
        }

        // Find first available color
        cr := 0
        for cr < gc.n {
            if available[cr] {
                break
            }
            cr++
        }
        color[u] = cr

        // Reset available colors for next vertex
        for i := range available {
            available[i] = true
        }
    }
    return color
}

// IsBipartite checks if the graph is 2-colorable
func (gc *GraphColoring) IsBipartite() bool {
    color := make([]int, gc.n)
    for i := range color {
        color[i] = -1
    }

    for i := 0; i < gc.n; i++ {
        if color[i] == -1 {
            color[i] = 0
            queue := []int{i}
            for len(queue) > 0 {
                u := queue[0]
                queue = queue[1:]
                for _, v := range gc.graph[u] {
                    if color[v] == -1 {
                        color[v] = 1 - color[u]
                        queue = append(queue, v)
                    } else if color[v] == color[u] {
                        return false // Not bipartite
                    }
                }
            }
        }
    }
    return true
}

// ChromaticNumber returns the minimum colors needed (greedy approximation)
func (gc *GraphColoring) ChromaticNumber() int {
    // This is NP-hard, so we use greedy as approximation
    colors := gc.GreedyColoring()
    maxC := 0
    for _, c := range colors {
        maxC = max(maxC, c)
    }
    return maxC + 1
}
```

Backtracking gives the exact answer for small graphs by trying colors and undoing choices that lead to a dead end — optimal, but exponential, so reserve it for when the exact chromatic number genuinely matters and the graph is small:

```cpp
// Backtracking to find minimum colors (optimal but slow)
bool isSafe(vector<vector<int>>& graph, vector<int>& color, int v, int c) {
    for (int u : graph[v]) {
        if (color[u] == c) {
            return false;
        }
    }
    return true;
}

bool graphColoringUtil(vector<vector<int>>& graph, int m, vector<int>& color, int v) {
    int n = graph.size();
    if (v == n) {
        return true;  // All vertices colored
    }
    
    for (int c = 0; c < m; c++) {
        if (isSafe(graph, color, v, c)) {
            color[v] = c;
            
            if (graphColoringUtil(graph, m, color, v + 1)) {
                return true;
            }
            
            color[v] = -1;  // Backtrack
        }
    }
    
    return false;
}

vector<int> graphColoringBacktracking(vector<vector<int>>& graph, int maxColors) {
    int n = graph.size();
    vector<int> color(n, -1);
    
    if (graphColoringUtil(graph, maxColors, color, 0)) {
        return color;
    }
    
    return {};  // No valid coloring with maxColors
}
```

```python
# Backtracking to find minimum colors (optimal but slow)
def is_safe(graph, color, v, c):
    for u in graph[v]:
        if color[u] == c:
            return False
    return True

def graph_coloring_util(graph, m, color, v):
    n = len(graph)
    if v == n:
        return True  # All vertices colored

    for c in range(m):
        if is_safe(graph, color, v, c):
            color[v] = c

            if graph_coloring_util(graph, m, color, v + 1):
                return True

            color[v] = -1  # Backtrack

    return False

def graph_coloring_backtracking(graph, max_colors):
    n = len(graph)
    color = [-1] * n

    if graph_coloring_util(graph, max_colors, color, 0):
        return color

    return []  # No valid coloring with max_colors
```

```java
// Backtracking to find minimum colors (optimal but slow)
boolean isSafe(List<List<Integer>> graph, int[] color, int v, int c) {
    for (int u : graph.get(v)) {
        if (color[u] == c) return false;
    }
    return true;
}

boolean graphColoringUtil(List<List<Integer>> graph, int m, int[] color, int v) {
    int n = graph.size();
    if (v == n) return true; // All vertices colored

    for (int c = 0; c < m; c++) {
        if (isSafe(graph, color, v, c)) {
            color[v] = c;
            if (graphColoringUtil(graph, m, color, v + 1)) return true;
            color[v] = -1; // Backtrack
        }
    }
    return false;
}

int[] graphColoringBacktracking(List<List<Integer>> graph, int maxColors) {
    int n = graph.size();
    int[] color = new int[n];
    Arrays.fill(color, -1);
    if (graphColoringUtil(graph, maxColors, color, 0)) return color;
    return new int[0]; // No valid coloring with maxColors
}
```

```go
// Backtracking to find minimum colors (optimal but slow)
func isSafe(graph [][]int, color []int, v, c int) bool {
    for _, u := range graph[v] {
        if color[u] == c {
            return false
        }
    }
    return true
}

func graphColoringUtil(graph [][]int, m int, color []int, v int) bool {
    n := len(graph)
    if v == n {
        return true // All vertices colored
    }

    for c := 0; c < m; c++ {
        if isSafe(graph, color, v, c) {
            color[v] = c
            if graphColoringUtil(graph, m, color, v+1) {
                return true
            }
            color[v] = -1 // Backtrack
        }
    }
    return false
}

func graphColoringBacktracking(graph [][]int, maxColors int) []int {
    n := len(graph)
    color := make([]int, n)
    for i := range color {
        color[i] = -1
    }
    if graphColoringUtil(graph, maxColors, color, 0) {
        return color
    }
    return nil // No valid coloring with maxColors
}
```

Greedy coloring is the default; reach for backtracking only when you need the true minimum on a small graph.

## 11.15 Concurrency: Traversing a Shared Graph

Parallelizing graph work runs straight into the concurrency fundamentals of [Chapter 3.5](03.5-concurrency-fundamentals.md), and the sharpest hazard is the `visited` array. Two threads that both read `visited[v] == false` will both process `v` — the classic check-then-act race — corrupting results or looping forever. The fix is to make the check-and-set a single atomic step:

```cpp
std::vector<std::atomic<bool>> visited(numVertices);
if (!visited[v].exchange(true)) {   // atomic: only one thread sees false
    q.push(v);
}
```

One `exchange` both tests and claims the vertex, so exactly one thread ever enters. That lock-free pattern is what makes parallel BFS practical: process each level's vertices in parallel, each claimed by an atomic exchange.

Mutating the graph *during* traversal is the other trap — an edge added mid-iteration can invalidate the adjacency list a thread is walking. If you must allow concurrent structure changes, a coarse-grained lock around the whole graph is simple and correct but serializes everything; per-vertex locks buy parallelism at the cost of deadlock risk (always acquire in a fixed order). The honest production advice is to avoid the problem: keep the graph **immutable** during read-heavy traversal so no synchronization is needed, or use a graph-processing framework (Pregel, GraphX) built to handle the concurrency. Don't hand-roll fine-grained graph locking unless profiling proves you need it.

## 11.16 Summary

Graphs are the structure for data whose essence is *relationships*, and the through-line of this chapter is that two upfront choices govern everything after: the representation (adjacency list for the sparse graphs that dominate reality, matrix for dense or small ones — a real memory-and-cache decision) and the traversal (DFS to go deep, BFS to find shortest unweighted paths). Almost every named algorithm here is one of those two with extra bookkeeping.

| Algorithm | Time | Notes |
|-----------|------|-------|
| DFS / BFS | `O(V + E)` | traversal; BFS = shortest unweighted path |
| Dijkstra | `O((V + E) log V)` | shortest path, non-negative weights |
| Bellman-Ford | `O(V·E)` | negative weights; detects negative cycles |
| Floyd-Warshall | `O(V³)` | all-pairs shortest paths |
| Kruskal / Prim | `O(E log V)` | minimum spanning tree |
| Topological sort | `O(V + E)` | DAG ordering (Kahn's or DFS) |
| Bridges / articulation pts | `O(V + E)` | critical edges / vertices, one DFS |
| SCC (Kosaraju / Tarjan) | `O(V + E)` | mutual reachability in a digraph |
| 0-1 BFS | `O(V + E)` | shortest path with 0/1 weights |
| A* | heuristic-dependent | Dijkstra with a goal-directed heuristic |

### Exercises

1. Implement a graph class supporting both adjacency-matrix and adjacency-list representations, and measure the crossover density where the matrix's edge test beats the list's.
2. Implement DFS and BFS both recursively and iteratively, and compare their performance and memory on deep versus wide graphs.
3. Extend Dijkstra to reconstruct the actual shortest path, not just the distance.
4. Write a function that decides whether a directed graph is strongly connected.
5. Find all cycles in a directed graph.
6. Find the longest path in a DAG (hint: topological order makes this linear).
7. Implement Tarjan's SCC algorithm and compare it against Kosaraju's on the same inputs.
8. Detect whether an undirected graph has an Eulerian path or circuit.
9. Implement 0-1 BFS on a grid with free and unit-cost moves, and verify it against Dijkstra.
10. Build a small graph visualizer that renders a graph and highlights its bridges and articulation points.

The next chapters build on this foundation, moving into searching algorithms and more advanced structures.

