#include <iostream>
#include <vector>
#include <list>
#include <queue>
#include <stack>
#include <algorithm>
#include <limits>
#include <functional>
#include <unordered_set>
using namespace std;

// ============================================================================
// Edge Structure
// ============================================================================

struct Edge {
    int to;
    int weight;
    
    Edge(int t, int w = 1) : to(t), weight(w) {}
};

// ============================================================================
// Graph with Adjacency Matrix
// ============================================================================

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
    
    bool hasEdge(int from, int to) const {
        return adjMatrix[from][to] != 0;
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

// ============================================================================
// Graph with Adjacency List
// ============================================================================

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
    
    const list<Edge>& getNeighbors(int vertex) const {
        return adjList[vertex];
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
    const vector<list<Edge>>& getAdjList() const { return adjList; }
};

// ============================================================================
// Depth-First Search (DFS)
// ============================================================================

class GraphDFS {
private:
    const vector<list<Edge>>& adjList;
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
    GraphDFS(const GraphList& graph) 
        : adjList(graph.getAdjList()), numVertices(graph.getNumVertices()) {}
    
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
                
                for (auto it = adjList[vertex].rbegin(); it != adjList[vertex].rend(); ++it) {
                    if (!visited[it->to]) {
                        stk.push(it->to);
                    }
                }
            }
        }
        
        return result;
    }
};

// ============================================================================
// Breadth-First Search (BFS)
// ============================================================================

class GraphBFS {
private:
    const vector<list<Edge>>& adjList;
    int numVertices;
    
public:
    GraphBFS(const GraphList& graph) 
        : adjList(graph.getAdjList()), numVertices(graph.getNumVertices()) {}
    
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
        
        return {};
    }
};

// ============================================================================
// Dijkstra's Algorithm
// ============================================================================

class Dijkstra {
private:
    const vector<list<Edge>>& adjList;
    int numVertices;
    
public:
    Dijkstra(const GraphList& graph) 
        : adjList(graph.getAdjList()), numVertices(graph.getNumVertices()) {}
    
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

// ============================================================================
// Kruskal's Algorithm for MST
// ============================================================================

class Kruskal {
public:
    struct Edge {
        int from, to, weight;
        Edge(int f, int t, int w) : from(f), to(t), weight(w) {}
        bool operator<(const Edge& other) const {
            return weight < other.weight;
        }
    };
    
private:
    
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
                parent[x] = find(parent[x]);
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
                if (mst.size() == static_cast<size_t>(numVertices - 1)) {
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

// ============================================================================
// Topological Sort
// ============================================================================

class TopologicalSort {
private:
    const vector<list<Edge>>& adjList;
    int numVertices;
    
    void dfs(int vertex, vector<bool>& visited, vector<bool>& recStack, 
             vector<int>& result, bool& hasCycle) {
        visited[vertex] = true;
        recStack[vertex] = true;
        
        for (const Edge& edge : adjList[vertex]) {
            int neighbor = edge.to;
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
    TopologicalSort(const GraphList& graph) 
        : adjList(graph.getAdjList()), numVertices(graph.getNumVertices()) {}
    
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
            return {};
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};

// ============================================================================
// Cycle Detection
// ============================================================================

bool hasCycle(const GraphList& graph) {
    int n = graph.getNumVertices();
    const vector<list<Edge>>& adjList = graph.getAdjList();
    vector<bool> visited(n, false);
    vector<bool> recStack(n, false);
    
    function<bool(int)> dfs = [&](int v) {
        visited[v] = true;
        recStack[v] = true;
        
        for (const Edge& edge : adjList[v]) {
            if (!visited[edge.to]) {
                if (dfs(edge.to)) return true;
            } else if (recStack[edge.to]) {
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

// ============================================================================
// Connected Components
// ============================================================================

vector<vector<int>> findConnectedComponents(const GraphList& graph) {
    int n = graph.getNumVertices();
    const vector<list<Edge>>& adjList = graph.getAdjList();
    vector<bool> visited(n, false);
    vector<vector<int>> components;
    
    function<void(int, vector<int>&)> dfs = [&](int v, vector<int>& comp) {
        visited[v] = true;
        comp.push_back(v);
        for (const Edge& edge : adjList[v]) {
            if (!visited[edge.to]) {
                dfs(edge.to, comp);
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

// ============================================================================
// Demonstration Functions
// ============================================================================

void demonstrateGraphRepresentations() {
    cout << "\n=== Graph Representations ===" << endl;
    
    // Adjacency Matrix
    GraphMatrix matrixGraph(4, false);
    matrixGraph.addEdge(0, 1, 1);
    matrixGraph.addEdge(0, 2, 1);
    matrixGraph.addEdge(1, 3, 1);
    matrixGraph.addEdge(2, 3, 1);
    matrixGraph.print();
    
    cout << endl;
    
    // Adjacency List
    GraphList listGraph(4, false);
    listGraph.addEdge(0, 1, 1);
    listGraph.addEdge(0, 2, 1);
    listGraph.addEdge(1, 3, 1);
    listGraph.addEdge(2, 3, 1);
    listGraph.print();
}

void demonstrateDFS() {
    cout << "\n=== Depth-First Search ===" << endl;
    
    GraphList graph(5, false);
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);
    
    GraphDFS dfs(graph);
    
    cout << "DFS from 0 (recursive): ";
    vector<int> result = dfs.dfs(0);
    for (int v : result) {
        cout << v << " ";
    }
    cout << endl;
    
    cout << "DFS from 0 (iterative): ";
    result = dfs.dfsIterative(0);
    for (int v : result) {
        cout << v << " ";
    }
    cout << endl;
}

void demonstrateBFS() {
    cout << "\n=== Breadth-First Search ===" << endl;
    
    GraphList graph(6, false);
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);
    graph.addEdge(3, 5);
    
    GraphBFS bfs(graph);
    
    cout << "BFS from 0: ";
    vector<int> result = bfs.bfs(0);
    for (int v : result) {
        cout << v << " ";
    }
    cout << endl;
    
    cout << "Shortest path from 0 to 5: ";
    vector<int> path = bfs.shortestPathUnweighted(0, 5);
    for (int v : path) {
        cout << v << " ";
    }
    cout << endl;
}

void demonstrateDijkstra() {
    cout << "\n=== Dijkstra's Algorithm ===" << endl;
    
    GraphList graph(5, true);
    graph.addEdge(0, 1, 4);
    graph.addEdge(0, 2, 1);
    graph.addEdge(2, 1, 2);
    graph.addEdge(2, 3, 5);
    graph.addEdge(1, 3, 1);
    graph.addEdge(3, 4, 3);
    
    Dijkstra dijkstra(graph);
    
    vector<int> distances = dijkstra.shortestPath(0);
    cout << "Shortest distances from 0:" << endl;
    for (size_t i = 0; i < distances.size(); i++) {
        if (distances[i] != numeric_limits<int>::max()) {
            cout << "  To " << i << ": " << distances[i] << endl;
        } else {
            cout << "  To " << i << ": unreachable" << endl;
        }
    }
    
    cout << "\nShortest path from 0 to 4: ";
    vector<int> path = dijkstra.shortestPathTo(0, 4);
    for (int v : path) {
        cout << v << " ";
    }
    cout << endl;
}

void demonstrateKruskal() {
    cout << "\n=== Kruskal's Algorithm (MST) ===" << endl;
    
    Kruskal kruskal(4);
    kruskal.addEdge(0, 1, 10);
    kruskal.addEdge(0, 2, 6);
    kruskal.addEdge(0, 3, 5);
    kruskal.addEdge(1, 3, 15);
    kruskal.addEdge(2, 3, 4);
    
    vector<Kruskal::Edge> mst = kruskal.findMST();
    cout << "MST Edges:" << endl;
    for (const auto& edge : mst) {
        cout << "  (" << edge.from << ", " << edge.to << ") weight: " << edge.weight << endl;
    }
    cout << "Total MST weight: " << kruskal.mstWeight() << endl;
}

void demonstrateTopologicalSort() {
    cout << "\n=== Topological Sort ===" << endl;
    
    GraphList graph(6, true);
    graph.addEdge(5, 2);
    graph.addEdge(5, 0);
    graph.addEdge(4, 0);
    graph.addEdge(4, 1);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1);
    
    TopologicalSort topo(graph);
    vector<int> result = topo.topologicalSort();
    
    if (!result.empty()) {
        cout << "Topological order: ";
        for (int v : result) {
            cout << v << " ";
        }
        cout << endl;
    } else {
        cout << "Cycle detected - no topological order" << endl;
    }
}

void demonstrateCycleDetection() {
    cout << "\n=== Cycle Detection ===" << endl;
    
    GraphList graph1(4, true);
    graph1.addEdge(0, 1);
    graph1.addEdge(1, 2);
    graph1.addEdge(2, 3);
    graph1.addEdge(3, 0); // Cycle
    
    GraphList graph2(4, true);
    graph2.addEdge(0, 1);
    graph2.addEdge(1, 2);
    graph2.addEdge(2, 3);
    // No cycle
    
    cout << "Graph 1 has cycle: " << (hasCycle(graph1) ? "Yes" : "No") << endl;
    cout << "Graph 2 has cycle: " << (hasCycle(graph2) ? "Yes" : "No") << endl;
}

void demonstrateConnectedComponents() {
    cout << "\n=== Connected Components ===" << endl;
    
    GraphList graph(7, false);
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(3, 4);
    graph.addEdge(5, 6);
    
    vector<vector<int>> components = findConnectedComponents(graph);
    cout << "Number of components: " << components.size() << endl;
    for (size_t i = 0; i < components.size(); i++) {
        cout << "Component " << i << ": ";
        for (int v : components[i]) {
            cout << v << " ";
        }
        cout << endl;
    }
}

// ============================================================================
// Main Function
// ============================================================================

int main() {
    cout << "Graph Algorithms and Implementations\n" << endl;
    
    demonstrateGraphRepresentations();
    demonstrateDFS();
    demonstrateBFS();
    demonstrateDijkstra();
    demonstrateKruskal();
    demonstrateTopologicalSort();
    demonstrateCycleDetection();
    demonstrateConnectedComponents();
    
    return 0;
}

