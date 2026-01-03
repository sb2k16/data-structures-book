/**
 * Disjoint Sets (Union-Find) Data Structure Examples
 * 
 * This file demonstrates the Union-Find data structure with various optimizations
 * and its applications in graph algorithms.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o disjoint_sets disjoint_sets.cpp
 * Run with: ./disjoint_sets
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

// ============================================================================
// Naive Union-Find Implementation
// ============================================================================

class UnionFindNaive {
private:
    vector<int> parent;
    int n;
    
public:
    UnionFindNaive(int size) : n(size) {
        parent.resize(n);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            return find(parent[x]); // Recursive find
        }
        return x;
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

// ============================================================================
// Union-Find with Path Compression
// ============================================================================

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

// ============================================================================
// Union-Find with Path Compression and Union by Rank
// ============================================================================

class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    int n;
    
public:
    UnionFind(int size) : n(size) {
        parent.resize(n);
        rank.resize(n, 0);
        
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
    
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return; // Already in same set
        }
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
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

// ============================================================================
// Union-Find with Union by Size
// ============================================================================

class UnionFindBySize {
private:
    vector<int> parent;
    vector<int> size;
    int n;
    
public:
    UnionFindBySize(int n) : n(n) {
        parent.resize(n);
        size.resize(n, 1);
        
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

// ============================================================================
// Application 1: Finding Connected Components
// ============================================================================

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

vector<vector<int>> getConnectedComponents(const vector<vector<int>>& graph) {
    int n = graph.size();
    UnionFind uf(n);
    
    // Union all connected vertices
    for (int i = 0; i < n; i++) {
        for (int neighbor : graph[i]) {
            uf.unite(i, neighbor);
        }
    }
    
    // Group vertices by their root
    unordered_map<int, vector<int>> components;
    for (int i = 0; i < n; i++) {
        components[uf.find(i)].push_back(i);
    }
    
    vector<vector<int>> result;
    for (const auto& pair : components) {
        result.push_back(pair.second);
    }
    
    return result;
}

// ============================================================================
// Application 2: Cycle Detection in Undirected Graph
// ============================================================================

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

// ============================================================================
// Application 3: Network Connectivity
// ============================================================================

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

// ============================================================================
// Application 4: Kruskal's Algorithm for MST (using Union-Find)
// ============================================================================

struct Edge {
    int from, to, weight;
    Edge(int f, int t, int w) : from(f), to(t), weight(w) {}
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

vector<Edge> kruskalMST(vector<Edge>& edges, int numVertices) {
    sort(edges.begin(), edges.end());
    UnionFind uf(numVertices);
    vector<Edge> mst;
    
    for (const Edge& edge : edges) {
        if (!uf.connected(edge.from, edge.to)) {
            uf.unite(edge.from, edge.to);
            mst.push_back(edge);
            
            if (mst.size() == static_cast<size_t>(numVertices - 1)) {
                break;
            }
        }
    }
    
    return mst;
}

// ============================================================================
// Demonstration Functions
// ============================================================================

void demonstrateBasicOperations() {
    cout << "\n=== Basic Union-Find Operations ===" << endl;
    
    UnionFind uf(10);
    
    cout << "Initial state: 10 separate sets" << endl;
    cout << "Number of sets: " << uf.countSets() << endl;
    
    cout << "\nUniting 0 and 1..." << endl;
    uf.unite(0, 1);
    cout << "0 and 1 connected: " << (uf.connected(0, 1) ? "Yes" : "No") << endl;
    cout << "Number of sets: " << uf.countSets() << endl;
    
    cout << "\nUniting 2 and 3..." << endl;
    uf.unite(2, 3);
    cout << "Uniting 3 and 4..." << endl;
    uf.unite(3, 4);
    cout << "2 and 4 connected: " << (uf.connected(2, 4) ? "Yes" : "No") << endl;
    cout << "Number of sets: " << uf.countSets() << endl;
    
    cout << "\nUniting 0 and 4..." << endl;
    uf.unite(0, 4);
    cout << "0 and 4 connected: " << (uf.connected(0, 4) ? "Yes" : "No") << endl;
    cout << "1 and 2 connected: " << (uf.connected(1, 2) ? "Yes" : "No") << endl;
    cout << "Number of sets: " << uf.countSets() << endl;
}

void demonstrateConnectedComponents() {
    cout << "\n=== Finding Connected Components ===" << endl;
    
    // Graph: 0-1-2, 3-4, 5 (isolated)
    vector<vector<int>> graph = {
        {1},        // 0
        {0, 2},     // 1
        {1},        // 2
        {4},        // 3
        {3},        // 4
        {}          // 5 (isolated)
    };
    
    int components = countConnectedComponents(graph);
    cout << "Number of connected components: " << components << endl;
    
    vector<vector<int>> componentList = getConnectedComponents(graph);
    cout << "Components:" << endl;
    for (size_t i = 0; i < componentList.size(); i++) {
        cout << "  Component " << i + 1 << ": ";
        for (int v : componentList[i]) {
            cout << v << " ";
        }
        cout << endl;
    }
}

void demonstrateCycleDetection() {
    cout << "\n=== Cycle Detection ===" << endl;
    
    // Graph without cycle: 0-1-2-3
    vector<pair<int, int>> edges1 = {
        {0, 1}, {1, 2}, {2, 3}
    };
    cout << "Graph 1 (0-1-2-3): " << (hasCycle(edges1, 4) ? "Has cycle" : "No cycle") << endl;
    
    // Graph with cycle: 0-1-2-0
    vector<pair<int, int>> edges2 = {
        {0, 1}, {1, 2}, {2, 0}
    };
    cout << "Graph 2 (0-1-2-0): " << (hasCycle(edges2, 3) ? "Has cycle" : "No cycle") << endl;
}

void demonstrateNetworkConnectivity() {
    cout << "\n=== Network Connectivity ===" << endl;
    
    NetworkConnectivity network(6);
    
    cout << "Initial network: 6 isolated nodes" << endl;
    cout << "Number of components: " << network.getComponentCount() << endl;
    
    network.connect(0, 1);
    network.connect(1, 2);
    cout << "\nConnected 0-1-2" << endl;
    cout << "0 and 2 connected: " << (network.isConnected(0, 2) ? "Yes" : "No") << endl;
    cout << "Number of components: " << network.getComponentCount() << endl;
    
    network.connect(3, 4);
    cout << "\nConnected 3-4" << endl;
    cout << "Number of components: " << network.getComponentCount() << endl;
    
    network.connect(2, 3);
    cout << "\nConnected 2-3 (merging components)" << endl;
    cout << "0 and 4 connected: " << (network.isConnected(0, 4) ? "Yes" : "No") << endl;
    cout << "Number of components: " << network.getComponentCount() << endl;
}

void demonstrateKruskalMST() {
    cout << "\n=== Kruskal's Algorithm for MST ===" << endl;
    
    int numVertices = 4;
    vector<Edge> edges = {
        {0, 1, 10},
        {0, 2, 6},
        {0, 3, 5},
        {1, 3, 15},
        {2, 3, 4}
    };
    
    vector<Edge> mst = kruskalMST(edges, numVertices);
    
    cout << "MST Edges:" << endl;
    int totalWeight = 0;
    for (const Edge& edge : mst) {
        cout << "  (" << edge.from << ", " << edge.to << ") weight: " << edge.weight << endl;
        totalWeight += edge.weight;
    }
    cout << "Total MST weight: " << totalWeight << endl;
}

void demonstrateUnionBySize() {
    cout << "\n=== Union by Size ===" << endl;
    
    UnionFindBySize uf(5);
    
    cout << "Initial sizes:" << endl;
    for (int i = 0; i < 5; i++) {
        cout << "  Set " << i << " size: " << uf.getSize(i) << endl;
    }
    
    uf.unite(0, 1);
    cout << "\nAfter uniting 0 and 1:" << endl;
    cout << "  Set 0 size: " << uf.getSize(0) << endl;
    cout << "  Set 1 size: " << uf.getSize(1) << endl;
    
    uf.unite(2, 3);
    uf.unite(3, 4);
    cout << "\nAfter uniting 2, 3, 4:" << endl;
    cout << "  Set 2 size: " << uf.getSize(2) << endl;
    cout << "  Set 3 size: " << uf.getSize(3) << endl;
    cout << "  Set 4 size: " << uf.getSize(4) << endl;
    
    uf.unite(0, 2);
    cout << "\nAfter uniting sets containing 0 and 2:" << endl;
    cout << "  Set 0 size: " << uf.getSize(0) << endl;
    cout << "  Set 2 size: " << uf.getSize(2) << endl;
    cout << "  Total sets: " << uf.countSets() << endl;
}

// ============================================================================
// Main Function
// ============================================================================

int main() {
    cout << "Disjoint Sets (Union-Find) Data Structure Examples\n" << endl;
    
    demonstrateBasicOperations();
    demonstrateConnectedComponents();
    demonstrateCycleDetection();
    demonstrateNetworkConnectivity();
    demonstrateKruskalMST();
    demonstrateUnionBySize();
    
    return 0;
}

