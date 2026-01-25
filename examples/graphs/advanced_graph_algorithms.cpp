/**
 * Advanced Graph Algorithms
 * 
 * This file demonstrates advanced graph algorithms including:
 * - Finding Bridges
 * - Finding Articulation Points
 * - Strongly Connected Components (Kosaraju's and Tarjan's)
 * - 0-1 BFS
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o advanced_graphs advanced_graph_algorithms.cpp
 * Run with: ./advanced_graphs
 */

#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <algorithm>
#include <limits>
#include <stack>
#include <unordered_map>
using namespace std;

// ============================================================================
// Finding Bridges
// ============================================================================

class BridgeFinder {
private:
    vector<list<int>> graph;
    int numVertices;
    vector<int> disc;
    vector<int> low;
    vector<bool> visited;
    int time;
    vector<pair<int, int>> bridges;
    
    void dfs(int u, int parent) {
        visited[u] = true;
        disc[u] = low[u] = ++time;
        
        for (int v : graph[u]) {
            if (v == parent) continue;
            
            if (!visited[v]) {
                dfs(v, u);
                low[u] = min(low[u], low[v]);
                
                if (low[v] > disc[u]) {
                    bridges.push_back({u, v});
                }
            } else {
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

// ============================================================================
// Finding Articulation Points
// ============================================================================

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
                
                if (!isRoot && low[v] >= disc[u]) {
                    isArticulation[u] = true;
                }
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }
        
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

// ============================================================================
// Strongly Connected Components - Kosaraju's Algorithm
// ============================================================================

class KosarajuSCC {
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
        order.push_back(v);
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
    KosarajuSCC(int vertices) : numVertices(vertices) {
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
        fill(visited.begin(), visited.end(), false);
        order.clear();
        
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs1(i);
            }
        }
        
        fill(visited.begin(), visited.end(), false);
        reverse(order.begin(), order.end());
        
        int compId = 0;
        for (int v : order) {
            if (!visited[v]) {
                dfs2(v, compId++);
            }
        }
        
        vector<vector<int>> components(compId);
        for (int i = 0; i < numVertices; i++) {
            components[component[i]].push_back(i);
        }
        
        return components;
    }
};

// ============================================================================
// Strongly Connected Components - Tarjan's Algorithm
// ============================================================================

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

// ============================================================================
// 0-1 BFS
// ============================================================================

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
                        dq.push_front(v);
                    } else {
                        dq.push_back(v);
                    }
                }
            }
        }
        
        return dist;
    }
};

// ============================================================================
// Demonstration Functions
// ============================================================================

void demonstrateBridges() {
    cout << "\n=== Finding Bridges ===" << endl;
    
    BridgeFinder finder(6);
    finder.addEdge(0, 1);
    finder.addEdge(1, 2);
    finder.addEdge(2, 0);
    finder.addEdge(1, 3);
    finder.addEdge(3, 4);
    finder.addEdge(4, 5);
    finder.addEdge(5, 3);
    
    vector<pair<int, int>> bridges = finder.findBridges();
    
    cout << "Bridges found: " << bridges.size() << endl;
    for (const auto& bridge : bridges) {
        cout << "  (" << bridge.first << ", " << bridge.second << ")" << endl;
    }
}

void demonstrateArticulationPoints() {
    cout << "\n=== Finding Articulation Points ===" << endl;
    
    ArticulationPointFinder finder(7);
    finder.addEdge(0, 1);
    finder.addEdge(1, 2);
    finder.addEdge(2, 0);
    finder.addEdge(1, 3);
    finder.addEdge(3, 4);
    finder.addEdge(4, 5);
    finder.addEdge(5, 6);
    finder.addEdge(6, 4);
    
    vector<int> points = finder.findArticulationPoints();
    
    cout << "Articulation points found: " << points.size() << endl;
    for (int point : points) {
        cout << "  " << point << endl;
    }
}

void demonstrateSCC() {
    cout << "\n=== Strongly Connected Components ===" << endl;
    
    KosarajuSCC scc(8);
    scc.addEdge(0, 1);
    scc.addEdge(1, 2);
    scc.addEdge(2, 0);
    scc.addEdge(2, 3);
    scc.addEdge(3, 4);
    scc.addEdge(4, 5);
    scc.addEdge(5, 6);
    scc.addEdge(6, 4);
    scc.addEdge(6, 7);
    
    vector<vector<int>> components = scc.findSCCs();
    
    cout << "Number of SCCs: " << components.size() << endl;
    for (size_t i = 0; i < components.size(); i++) {
        cout << "Component " << i + 1 << ": ";
        for (int v : components[i]) {
            cout << v << " ";
        }
        cout << endl;
    }
}

void demonstrateBFS01() {
    cout << "\n=== 0-1 BFS ===" << endl;
    
    BFS01 bfs(5);
    bfs.addEdge(0, 1, 0);
    bfs.addEdge(0, 2, 1);
    bfs.addEdge(1, 2, 0);
    bfs.addEdge(1, 3, 1);
    bfs.addEdge(2, 3, 0);
    bfs.addEdge(3, 4, 1);
    
    vector<int> distances = bfs.shortestPath(0);
    
    cout << "Shortest distances from 0:" << endl;
    for (size_t i = 0; i < distances.size(); i++) {
        if (distances[i] != numeric_limits<int>::max()) {
            cout << "  To " << i << ": " << distances[i] << endl;
        } else {
            cout << "  To " << i << ": unreachable" << endl;
        }
    }
}

int main() {
    cout << "Advanced Graph Algorithms Examples\n" << endl;
    
    demonstrateBridges();
    demonstrateArticulationPoints();
    demonstrateSCC();
    demonstrateBFS01();
    
    return 0;
}






