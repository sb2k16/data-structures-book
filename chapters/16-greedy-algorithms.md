# Chapter 16: Greedy Algorithms

## 16.1 Problem Statement & Motivation

### What Problem Do Greedy Algorithms Solve?

Many optimization problems can be solved by making locally optimal choices:

- **Activity Selection**: Choose maximum non-overlapping activities
- **Coin Change**: Make change with minimum coins (for some systems)
- **Scheduling**: Optimize task/job scheduling
- **Minimum Spanning Tree**: Find minimum cost tree connecting all vertices
- **Huffman Coding**: Optimal prefix-free encoding

**Naive Approaches and Their Limitations**:

- **Brute Force**: Try all possibilities → exponential time
- **Dynamic Programming**: Consider all choices → may be overkill
- **No Structure**: Can't leverage problem properties

**The Greedy Solution**: Greedy algorithms make locally optimal choices at each step, often leading to globally optimal solutions when the greedy choice property holds. They're simpler and faster than DP when applicable.

### When to Use Greedy Algorithms

✅ **Use greedy when**:
- Problem has greedy choice property (local optimal → global optimal)
- Problem has optimal substructure
- Greedy choice is clear and obvious
- Need fast, simple solution
- Can prove greedy correctness

✅ **Real-world applications**:
- Activity selection and scheduling
- Minimum spanning tree (Kruskal's, Prim's)
- Shortest path (Dijkstra's with non-negative weights)
- Huffman coding (data compression)
- Interval scheduling
- Fractional knapsack

### When NOT to Use Greedy Algorithms

❌ **Avoid greedy when**:
- Greedy choice property doesn't hold
- Local optimal doesn't lead to global optimal
- Need to consider all possibilities
- Problem requires backtracking
- Cannot prove greedy correctness

**Key Trade-off**: Greedy algorithms trade correctness guarantees (must prove) for simplicity and efficiency.

## 16.2 Conceptual Overview

A **greedy algorithm** makes the locally optimal choice at each step with the hope that these local choices will lead to a globally optimal solution.

### Intuitive Explanation

Think of greedy algorithms like making change:
- **Greedy Choice**: Always use largest coin that fits
- **Local Optimal**: Best choice at current step
- **Global Optimal**: Final solution is optimal (if greedy property holds)

Think of greedy like a hiker:
- **Greedy Choice**: Always go to highest nearby point
- **Local Optimal**: Best immediate choice
- **Risk**: Might get stuck on local peak, miss global peak

### Key Characteristics

- **Greedy Choice Property**: A global optimum can be reached by making locally optimal choices
- **Optimal Substructure**: The problem can be broken down into subproblems
- **No Backtracking**: Once a choice is made, it's never reconsidered
- **Efficiency**: Often faster than dynamic programming

### Greedy vs. Dynamic Programming

| Aspect | Greedy | Dynamic Programming |
|--------|--------|---------------------|
| Choices | Makes best choice now | Considers all choices |
| Subproblems | Solves once | May solve multiple times |
| Backtracking | No | Yes (implicitly) |
| Efficiency | Usually faster | May be slower |
| Correctness | Not always optimal | Always optimal |
| Proof Required | Yes (must prove) | No (always optimal) |

## 16.3 Abstract Model & Invariants ⭐ (Mandatory)

**Purpose**: Define correctness independent of implementation.

### Abstract Model

A greedy algorithm consists of:
- **Problem Space**: Set of all possible solutions
- **Greedy Choice Function**: Selects locally optimal choice at each step
- **Feasible Set**: Set of choices available at current step
- **Solution Set**: Accumulated choices (partial solution)
- **Objective Function**: What we're optimizing (minimize/maximize)

### Core Invariants

These invariants must **always** hold for greedy algorithms to be correct:

#### 1. Greedy Choice Property Invariant

```
For any problem instance:
  There exists an optimal solution that includes the greedy choice
```

**Meaning**: The greedy choice is part of some optimal solution.

#### 2. Optimal Substructure Invariant

```
After making greedy choice:
  Remaining problem is a smaller instance of the same problem
  Optimal solution to subproblem + greedy choice = optimal solution
```

**Meaning**: Problem can be decomposed optimally.

#### 3. Feasibility Invariant

```
At each step:
  Greedy choice is from feasible set
  Partial solution remains feasible
  All constraints are satisfied
```

**Meaning**: All choices maintain feasibility.

#### 4. Progress Invariant

```
At each step:
  Problem size decreases
  Solution set grows
  Eventually reaches complete solution
```

**Meaning**: Algorithm makes progress and terminates.

### Algorithm-Specific Invariants

#### Activity Selection Invariant

1. **Non-Overlapping Invariant**: Selected activities don't overlap
2. **Earliest Finish Invariant**: Always select activity with earliest finish time
3. **Maximal Invariant**: Maximum number of activities selected

#### Minimum Spanning Tree Invariant

1. **Tree Invariant**: Selected edges form a tree (or forest)
2. **Minimal Cost Invariant**: Total edge weight is minimized
3. **Spanning Invariant**: All vertices are connected

### Assumptions

1. **Greedy Choice Property Holds**: Local optimal → global optimal
2. **Optimal Substructure**: Problem decomposes optimally
3. **Feasible Choices**: Greedy choice is always feasible
4. **Deterministic**: Same input produces same greedy choices
5. **Finite Problem**: Problem has finite solution space

This abstract model provides the intellectual backbone for understanding greedy algorithm correctness.

## 16.4 Operations & Interface

**Purpose**: Define what operations are supported.

Greedy algorithms support the following conceptual operations:

| Operation | Description | Precondition | Postcondition |
|-----------|-------------|--------------|---------------|
| `makeGreedyChoice(feasibleSet)` | Select best choice from feasible set | Feasible set is non-empty | Returns locally optimal choice |
| `updateFeasibleSet(choice)` | Update feasible set after choice | Choice is valid | Feasible set updated |
| `addToSolution(choice)` | Add choice to solution | Choice is valid | Solution updated |
| `isComplete(solution)` | Check if solution is complete | Solution is valid | Returns true if complete |
| `evaluate(solution)` | Evaluate solution quality | Solution is complete | Returns objective value |
| `isFeasible(partialSolution)` | Check if partial solution is feasible | Partial solution is valid | Returns true if feasible |

### Behavioral Guarantees

1. **Greedy Choice**: Always selects locally optimal choice
2. **Feasibility**: All partial solutions are feasible
3. **Termination**: Algorithm eventually terminates
4. **Optimality**: Solution is optimal if greedy property holds

## 16.5 Time & Space Complexity

**Purpose**: Make trade-offs explicit.

### Time Complexity

| Algorithm | Time Complexity | Notes |
|-----------|----------------|-------|
| **Activity Selection** | O(n log n) | Sorting dominates |
| **Fractional Knapsack** | O(n log n) | Sorting by ratio |
| **Huffman Coding** | O(n log n) | Priority queue operations |
| **Kruskal's MST** | O(E log E) | Sorting edges |
| **Prim's MST** | O(E log V) | Priority queue |
| **Dijkstra's** | O((V + E) log V) | Priority queue |
| **Interval Scheduling** | O(n log n) | Sorting |

### Space Complexity

| Algorithm | Space Complexity | Notes |
|-----------|------------------|-------|
| **Activity Selection** | O(1) | No extra space |
| **Fractional Knapsack** | O(1) | No extra space |
| **Huffman Coding** | O(n) | Tree structure |
| **Kruskal's MST** | O(V) | Union-Find structure |
| **Prim's MST** | O(V) | Priority queue, visited array |
| **Dijkstra's** | O(V) | Distance array, priority queue |

### Comparison with Other Approaches

| Approach | Time | Space | When Better |
|----------|------|-------|-------------|
| **Greedy** | O(n log n) typical | O(1) to O(n) | When greedy property holds |
| **Dynamic Programming** | O(n²) to O(n³) | O(n) to O(n²) | When greedy fails |
| **Brute Force** | O(2ⁿ) | O(n) | Never (too slow) |

## 16.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)

**Purpose**: Bridge theory → implementation.

**Rules**: No language syntax, no pointers/templates, focus on logic only.

### Generic Greedy Pattern

```
FUNCTION greedySolve(problem):
  solution ← empty set
  feasible_set ← getInitialFeasibleSet(problem)
  
  WHILE feasible_set is not empty AND NOT isComplete(solution):
    choice ← makeGreedyChoice(feasible_set)
    solution ← addToSolution(solution, choice)
    feasible_set ← updateFeasibleSet(feasible_set, choice)
  END WHILE
  
  RETURN solution
END FUNCTION
```

### Activity Selection

```
FUNCTION activitySelection(activities):
  sort activities by finish time
  
  solution ← empty list
  last_finish ← -infinity
  
  FOR EACH activity IN activities:
    IF activity.start ≥ last_finish:
      solution.add(activity)
      last_finish ← activity.finish
    END IF
  END FOR
  
  RETURN solution
END FUNCTION
```

### Fractional Knapsack

```
FUNCTION fractionalKnapsack(items, capacity):
  sort items by value/weight ratio (descending)
  
  total_value ← 0
  remaining_capacity ← capacity
  
  FOR EACH item IN items:
    IF remaining_capacity ≥ item.weight:
      total_value ← total_value + item.value
      remaining_capacity ← remaining_capacity - item.weight
    ELSE:
      fraction ← remaining_capacity / item.weight
      total_value ← total_value + fraction × item.value
      BREAK
    END IF
  END FOR
  
  RETURN total_value
END FUNCTION
```

### Huffman Coding

```
FUNCTION buildHuffmanTree(frequencies):
  priority_queue ← empty min-heap
  
  FOR EACH character, frequency IN frequencies:
    node ← create leaf node(character, frequency)
    priority_queue.insert(node)
  END FOR
  
  WHILE priority_queue.size() > 1:
    left ← priority_queue.extractMin()
    right ← priority_queue.extractMin()
    
    merged ← create internal node(left, right)
    merged.frequency ← left.frequency + right.frequency
    priority_queue.insert(merged)
  END WHILE
  
  RETURN priority_queue.extractMin()  // Root of Huffman tree
END FUNCTION
```

### Kruskal's MST

```
FUNCTION kruskalMST(graph):
  sort edges by weight (ascending)
  mst ← empty set
  union_find ← initialize with all vertices
  
  FOR EACH edge IN sorted_edges:
    IF union_find.find(edge.u) ≠ union_find.find(edge.v):
      mst.add(edge)
      union_find.union(edge.u, edge.v)
    END IF
  END FOR
  
  RETURN mst
END FUNCTION
```

This pseudocode should be readable by any engineer, regardless of their programming language background.

## 16.7 Implementation (Reference Language: C++) ⭐

**Note to Reader**: This section provides concrete C++ implementations. The correctness relies on the invariants defined in Section 16.3 and the pseudocode in Section 16.6.

Detailed C++ implementations for each greedy algorithm are provided in the following sections:
- Section 16.9: Activity Selection Implementation
- Section 16.10: Fractional Knapsack Implementation
- Section 16.11: Huffman Coding Implementation
- And other algorithms in subsequent sections

## 16.8 Correctness Argument

**Purpose**: Explain why the implementations work.

### Invariant Preservation

Greedy algorithms preserve the core invariants defined in Section 16.3:

#### 1. Greedy Choice Property

**For Activity Selection**:
- Greedy choice: Select activity with earliest finish time
- **Proof**: Any optimal solution can be modified to include greedy choice without making it worse
- **Preserves**: Greedy choice is part of optimal solution

**For Fractional Knapsack**:
- Greedy choice: Select item with highest value/weight ratio
- **Proof**: Any solution can be improved by replacing items with higher ratio items
- **Preserves**: Greedy choice leads to optimal solution

#### 2. Optimal Substructure

**For All Greedy Algorithms**:
- After making greedy choice, remaining problem is smaller instance
- Optimal solution to subproblem + greedy choice = optimal solution
- **Preserves**: Problem decomposes optimally

### Algorithm-Specific Correctness

#### Activity Selection Correctness

**Why it works**:
1. Sort by finish time ensures earliest finish is considered first
2. Selecting earliest finish leaves maximum room for remaining activities
3. Greedy choice property: Can replace any activity in optimal solution with earliest finish
4. **Correct**: Produces maximum number of activities

#### Fractional Knapsack Correctness

**Why it works**:
1. Value/weight ratio represents "bang for buck"
2. Selecting highest ratio items maximizes value per unit weight
3. Can take fractions, so greedy choice is always optimal
4. **Correct**: Produces maximum value

### Informal Proof Sketch

**For Greedy Algorithms**:
1. **Greedy Choice Property**: Show greedy choice is in some optimal solution
2. **Optimal Substructure**: Show remaining problem is smaller instance
3. **Induction**: Base case + inductive step → greedy produces optimal solution
4. **Conclusion**: Greedy algorithm is correct

**Note**: Unlike DP (which is always optimal), greedy algorithms require proof. If you can't prove correctness, the algorithm might not work!

This correctness argument provides engineers with confidence that greedy implementations work correctly (when proven).

## 16.9 Edge Cases & Failure Modes

**Purpose**: Build defensive thinking.

### When Greedy Fails

#### Greedy Choice Property Doesn't Hold

**Problem**: Local optimal doesn't lead to global optimal.

**Example**: Coin change with coins [1, 3, 4] and target 6:
- Greedy: 4 + 1 + 1 = 3 coins
- Optimal: 3 + 3 = 2 coins
- **Failure**: Greedy produces suboptimal solution

**Handling**: Verify greedy choice property before using greedy algorithm.

#### No Optimal Substructure

**Problem**: Problem doesn't decompose optimally.

**Example**: Longest path in graph (not shortest path):
- Greedy doesn't work
- Need dynamic programming or other approach

**Handling**: Verify optimal substructure property.

### Common Failure Patterns

1. **Assuming Greedy Works**: Not all problems have greedy solutions
2. **Wrong Greedy Choice**: Choosing wrong local optimal
3. **Not Proving Correctness**: Greedy might fail on some inputs
4. **Edge Cases**: Empty input, single element, all same values

This section maps directly to production bugs and helps engineers avoid greedy pitfalls.

## 16.10 Performance & System Considerations ⭐ (Differentiator)

**Purpose**: Connect algorithms to real machines.

### Sorting Overhead

#### Most Greedy Algorithms Require Sorting

**Impact**:
- Sorting: O(n log n) time
- Often dominates algorithm complexity
- Cache-friendly (sequential access)

**Optimization**: Use counting sort or radix sort when applicable.

### Priority Queue Operations

#### Heap-Based Structures

**Operations**:
- Insert: O(log n)
- Extract: O(log n)
- Used in: Huffman coding, Prim's MST, Dijkstra's

**Performance**: Heap operations are cache-friendly (array-based).

### Practical Recommendations

1. **Verify Greedy Property**: Don't assume greedy works
2. **Profile Sorting**: Often the bottleneck
3. **Use Appropriate Data Structures**: Heaps for priority, arrays for sorting
4. **Consider Alternatives**: DP if greedy doesn't work

This section connects greedy algorithms to real system performance.

## 16.11 Activity Selection Problem

**Problem**: Select maximum number of non-overlapping activities from a set of activities.

### Implementation
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity {
    int start;
    int finish;
    
    Activity(int s, int f) : start(s), finish(f) {}
};

bool compareFinish(const Activity& a, const Activity& b) {
    return a.finish < b.finish;
}

vector<Activity> activitySelection(vector<Activity>& activities) {
    // Sort by finish time
    sort(activities.begin(), activities.end(), compareFinish);
    
    vector<Activity> selected;
    selected.push_back(activities[0]);
    
    int lastFinish = activities[0].finish;
    
    for (size_t i = 1; i < activities.size(); i++) {
        if (activities[i].start >= lastFinish) {
            selected.push_back(activities[i]);
            lastFinish = activities[i].finish;
        }
    }
    
    return selected;
}
```

### Time Complexity
- **Time**: O(n log n) due to sorting
- **Space**: O(n)

## 16.12 Fractional Knapsack Problem

**Problem**: Given items with weights and values, fill a knapsack of capacity W to maximize value. Items can be broken (fractional).

### Implementation
```cpp
struct Item {
    int weight;
    int value;
    double ratio; // value per unit weight
    
    Item(int w, int v) : weight(w), value(v) {
        ratio = static_cast<double>(value) / weight;
    }
};

bool compareRatio(const Item& a, const Item& b) {
    return a.ratio > b.ratio;
}

double fractionalKnapsack(vector<Item>& items, int capacity) {
    // Sort by value-to-weight ratio (descending)
    sort(items.begin(), items.end(), compareRatio);
    
    double totalValue = 0.0;
    int remainingCapacity = capacity;
    
    for (const Item& item : items) {
        if (remainingCapacity >= item.weight) {
            // Take whole item
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Take fraction of item
            totalValue += item.ratio * remainingCapacity;
            break;
        }
    }
    
    return totalValue;
}
```

### Time Complexity
- **Time**: O(n log n)
- **Space**: O(1)

## 16.13 Huffman Coding

**Huffman Coding** is a lossless data compression algorithm that assigns variable-length codes to characters based on their frequencies.

### Implementation
```cpp
#include <queue>
#include <unordered_map>
#include <string>

struct HuffmanNode {
    char character;
    int frequency;
    HuffmanNode* left;
    HuffmanNode* right;
    
    HuffmanNode(char c, int freq) 
        : character(c), frequency(freq), left(nullptr), right(nullptr) {}
    
    HuffmanNode(int freq, HuffmanNode* l, HuffmanNode* r)
        : character('\0'), frequency(freq), left(l), right(r) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->frequency > b->frequency;
    }
};

class HuffmanCoding {
private:
    HuffmanNode* root;
    
    void buildCodes(HuffmanNode* node, string code, 
                    unordered_map<char, string>& codes) {
        if (!node) return;
        
        if (!node->left && !node->right) {
            codes[node->character] = code;
            return;
        }
        
        buildCodes(node->left, code + "0", codes);
        buildCodes(node->right, code + "1", codes);
    }
    
    void deleteTree(HuffmanNode* node) {
        if (!node) return;
        deleteTree(node->left);
        deleteTree(node->right);
        delete node;
    }
    
public:
    HuffmanCoding(const unordered_map<char, int>& frequencies) {
        priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> pq;
        
        // Create leaf nodes
        for (const auto& pair : frequencies) {
            pq.push(new HuffmanNode(pair.first, pair.second));
        }
        
        // Build tree
        while (pq.size() > 1) {
            HuffmanNode* left = pq.top();
            pq.pop();
            
            HuffmanNode* right = pq.top();
            pq.pop();
            
            HuffmanNode* merged = new HuffmanNode(
                left->frequency + right->frequency, left, right);
            pq.push(merged);
        }
        
        root = pq.top();
    }
    
    unordered_map<char, string> getCodes() {
        unordered_map<char, string> codes;
        buildCodes(root, "", codes);
        return codes;
    }
    
    string encode(const string& text) {
        unordered_map<char, string> codes = getCodes();
        string encoded = "";
        
        for (char c : text) {
            encoded += codes[c];
        }
        
        return encoded;
    }
    
    ~HuffmanCoding() {
        deleteTree(root);
    }
};
```

### Time Complexity
- **Time**: O(n log n) where n is number of unique characters
- **Space**: O(n)

## 16.14 Minimum Spanning Tree (Greedy Approach)

### Kruskal's Algorithm (Greedy)
```cpp
// Already covered in Chapter 11, but here's the greedy perspective
// Kruskal's algorithm is greedy because it always picks the smallest edge
// that doesn't form a cycle
```

### Prim's Algorithm (Greedy)
```cpp
// Already covered in Chapter 11
// Prim's algorithm is greedy because it always picks the minimum weight edge
// connecting the current MST to a new vertex
```

## 16.15 Interval Scheduling

**Problem**: Schedule maximum number of non-overlapping intervals.

### Implementation
```cpp
struct Interval {
    int start;
    int end;
    
    Interval(int s, int e) : start(s), end(e) {}
};

bool compareEnd(const Interval& a, const Interval& b) {
    return a.end < b.end;
}

vector<Interval> intervalScheduling(vector<Interval>& intervals) {
    sort(intervals.begin(), intervals.end(), compareEnd);
    
    vector<Interval> scheduled;
    int lastEnd = -1;
    
    for (const Interval& interval : intervals) {
        if (interval.start >= lastEnd) {
            scheduled.push_back(interval);
            lastEnd = interval.end;
        }
    }
    
    return scheduled;
}
```

## 16.16 Coin Change (Greedy)

**Problem**: Make change using minimum number of coins (when greedy works).

### Implementation
```cpp
vector<int> coinChangeGreedy(vector<int>& coins, int amount) {
    // Sort coins in descending order
    sort(coins.rbegin(), coins.rend());
    
    vector<int> result;
    
    for (int coin : coins) {
        while (amount >= coin) {
            result.push_back(coin);
            amount -= coin;
        }
    }
    
    if (amount != 0) {
        return {}; // Cannot make change
    }
    
    return result;
}
```

### When Greedy Works
- Coin system is "canonical" (e.g., US coins: 1, 5, 10, 25)
- Each coin is a multiple of smaller coins

### When Greedy Fails
- Non-canonical systems (e.g., coins: 1, 3, 4, amount: 6)
- Need dynamic programming instead

## 16.17 Job Scheduling

### Job Sequencing with Deadlines
```cpp
struct Job {
    int id;
    int deadline;
    int profit;
    
    Job(int i, int d, int p) : id(i), deadline(d), profit(p) {}
};

bool compareProfit(const Job& a, const Job& b) {
    return a.profit > b.profit;
}

vector<int> jobSequencing(vector<Job>& jobs) {
    sort(jobs.begin(), jobs.end(), compareProfit);
    
    int maxDeadline = 0;
    for (const Job& job : jobs) {
        maxDeadline = max(maxDeadline, job.deadline);
    }
    
    vector<int> schedule(maxDeadline + 1, -1);
    vector<int> result;
    
    for (const Job& job : jobs) {
        for (int j = job.deadline; j > 0; j--) {
            if (schedule[j] == -1) {
                schedule[j] = job.id;
                result.push_back(job.id);
                break;
            }
        }
    }
    
    return result;
}
```

## 16.18 Dijkstra's Algorithm (Greedy)

Dijkstra's algorithm for shortest paths is greedy because it always picks the unvisited vertex with the smallest distance. This is covered in detail in Chapter 11 (Graphs), but here we emphasize the greedy nature.

**Greedy Choice**: At each step, select the unvisited vertex with minimum distance from source.

**Why It's Greedy**: The algorithm makes locally optimal choices (closest unvisited vertex) without considering future implications, yet produces globally optimal shortest paths.

**Key Insight**: Once a vertex is processed, its shortest distance is finalized. This is the greedy choice property - we commit to the locally best option.

## 16.19 When Greedy Fails: Counterexamples and Analysis

Understanding when greedy algorithms fail is crucial for choosing the right approach. Greedy algorithms fail when the **greedy choice property** doesn't hold - when locally optimal choices don't lead to globally optimal solutions.

### Why Greedy Fails: The Core Issue

**Greedy algorithms assume**: Making the best local choice will lead to the best global solution.

**When this breaks**: Future choices depend on past choices in ways the greedy algorithm doesn't consider. The greedy choice might prevent access to better future options.

### Example 1: 0-1 Knapsack (Greedy Fails)

The fractional knapsack (Section 16.3) works with greedy, but 0-1 knapsack doesn't:

```cpp
// Greedy approach for 0-1 Knapsack (WRONG)
struct Item {
    int value;
    int weight;
    double ratio;
    
    Item(int v, int w) : value(v), weight(w), ratio((double)v / w) {}
};

int knapsackGreedy(vector<Item>& items, int capacity) {
    // Sort by value/weight ratio (greedy choice)
    sort(items.begin(), items.end(), 
         [](const Item& a, const Item& b) { return a.ratio > b.ratio; });
    
    int totalValue = 0;
    for (const auto& item : items) {
        if (capacity >= item.weight) {
            totalValue += item.value;
            capacity -= item.weight;
        }
    }
    return totalValue; // May not be optimal!
}

// Example where greedy fails:
// Items: (value=60, weight=10, ratio=6.0), 
//        (value=100, weight=20, ratio=5.0), 
//        (value=120, weight=30, ratio=4.0)
// Capacity: 50
// 
// Greedy approach:
//   1. Take item 1 (60, weight=10) → remaining capacity: 40
//   2. Take item 2 (100, weight=20) → remaining capacity: 20
//   3. Can't take item 3 (needs 30)
//   Total value: 60 + 100 = 160
//
// Optimal solution:
//   1. Take item 2 (100, weight=20) → remaining capacity: 30
//   2. Take item 3 (120, weight=30) → remaining capacity: 0
//   Total value: 100 + 120 = 220
//
// Greedy fails because taking the best ratio item (item 1) 
// prevents us from taking a better combination (items 2 and 3)
```

**Why Greedy Fails**: 
- Once we take an item, we can't take a fraction of it (unlike fractional knapsack)
- The greedy choice (best ratio) might prevent us from taking better combinations
- We need to consider all possible combinations, not just locally optimal choices

**Solution**: Use Dynamic Programming (Chapter 12) for 0-1 Knapsack - consider all subsets.

### Example 2: Coin Change (Greedy Fails for Non-Canonical Systems)

Greedy works for standard US coins (1, 5, 10, 25) but fails for arbitrary denominations:

```cpp
// Greedy coin change (works for some systems, fails for others)
int coinChangeGreedy(vector<int>& coins, int amount) {
    sort(coins.rbegin(), coins.rend()); // Descending order
    
    int count = 0;
    for (int coin : coins) {
        count += amount / coin;
        amount %= coin;
    }
    return amount == 0 ? count : -1; // May not find solution even if one exists
}

// Example 1: Canonical system (greedy works)
// Coins: [1, 5, 10, 25], Amount: 67
// Greedy: 25 + 25 + 10 + 5 + 1 + 1 = 6 coins
// Optimal: Same (greedy is optimal)

// Example 2: Non-canonical system (greedy fails)
// Coins: [1, 3, 4], Amount: 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3 = 2 coins
//
// Why greedy fails:
// - Greedy takes largest coin (4) first
// - This leaves 2, which requires two 1s
// - But optimal solution uses two 3s instead
```

**Why Greedy Fails**:
- For non-canonical systems, using a larger coin doesn't always lead to fewer total coins
- The greedy choice (largest coin) might force us to use many small coins later
- Optimal solution might use multiple medium coins instead

**Solution**: Use Dynamic Programming for arbitrary coin systems.

### Example 3: Shortest Path with Negative Edges (Greedy Fails)

Dijkstra's algorithm (greedy) fails when edges have negative weights:

```cpp
// Graph with negative edge:
//    A --3--> B
//    |        |
//    2        -5
//    |        |
//    v        v
//    C --1--> D
//
// Shortest path from A to D:
// Greedy (Dijkstra): A -> B -> D = 3 + (-5) = -2
// But wait! A -> C -> D = 2 + 1 = 3
// Actually, A -> B -> C -> D = 3 + (-5) + 1 = -1 (even better!)
//
// Problem: Dijkstra's greedy choice (closest unvisited vertex) 
// doesn't work with negative edges because it assumes all future 
// edges are non-negative
```

**Why Greedy Fails**:
- Dijkstra assumes all edges are non-negative
- With negative edges, a longer path might be cheaper
- Greedy choice (closest vertex) might lock in a suboptimal path

**Solution**: Use Bellman-Ford algorithm (Chapter 11) for graphs with negative edges.

### Common Patterns When Greedy Fails

1. **Interdependent Choices**: When choices affect future options in complex ways
2. **Non-Canonical Systems**: When local optimal doesn't imply global optimal
3. **Negative Weights/Costs**: When assumptions about costs break down
4. **Combinatorial Constraints**: When you need to consider all combinations
5. **NP-Hard Problems**: When the problem itself is computationally hard

### When to Use Greedy vs Dynamic Programming

| Situation | Use Greedy | Use Dynamic Programming |
|-----------|------------|------------------------|
| **Fractional choices allowed** | ✅ Yes (fractional knapsack) | ❌ No |
| **Choices are independent** | ✅ Yes (activity selection) | ❌ No |
| **Canonical system** | ✅ Yes (standard coin change) | ❌ No |
| **Need all combinations** | ❌ No | ✅ Yes (0-1 knapsack) |
| **Non-canonical system** | ❌ No | ✅ Yes (arbitrary coin change) |
| **Negative weights** | ❌ No | ✅ Yes (Bellman-Ford) |
| **Optimal substructure** | ✅ If greedy choice property holds | ✅ Always |

### Key Takeaway

**Greedy fails when**:
- The greedy choice property doesn't hold
- Local optimal choices don't lead to global optimal
- Future choices depend on past choices in non-obvious ways
- The problem requires considering all possible combinations

**Always verify** that your greedy algorithm produces optimal results before using it in production!

## 16.20 Greedy Algorithm Patterns

### Pattern 1: Interval Problems
- Sort by end time
- Greedily select non-overlapping intervals

### Pattern 2: Scheduling Problems
- Sort by some criteria (deadline, profit, etc.)
- Greedily assign resources

### Pattern 3: Optimization Problems
- Sort by ratio or value
- Greedily select items

### Pattern 4: Graph Problems
- Use priority queue
- Greedily process minimum cost edges/vertices

## 16.21 Proving Greedy Correctness

Proving that a greedy algorithm produces optimal results is crucial. Unlike dynamic programming (which always produces optimal results), greedy algorithms require careful proof.

### Two Key Properties for Greedy Correctness

1. **Greedy Choice Property**: A global optimum can be reached by making locally optimal choices
2. **Optimal Substructure**: The problem can be broken down into subproblems, and optimal solutions to subproblems contribute to the global optimum

### Method 1: Greedy Choice Property

**Goal**: Show that a greedy choice is part of some optimal solution.

**Approach**: 
1. Assume there exists an optimal solution that doesn't include the greedy choice
2. Show that we can modify this solution to include the greedy choice without making it worse
3. Conclude that the greedy choice is part of some optimal solution

**Example: Activity Selection**

**Greedy Choice**: Select the activity with the earliest finish time.

**Proof**:
1. Let `S` be an optimal solution
2. Let `a` be the activity with earliest finish time
3. If `a` is in `S`, we're done
4. If `a` is not in `S`, let `a'` be the first activity in `S`
5. Since `a` finishes before `a'`, we can replace `a'` with `a` in `S`
6. The new solution is still optimal (same number of activities)
7. Therefore, the greedy choice is part of some optimal solution

### Method 2: Exchange Argument

**Goal**: Show that any solution can be transformed to include the greedy choice without making it worse.

**Approach**:
1. Start with any solution (optimal or not)
2. Show that if it doesn't include the greedy choice, we can exchange elements to include it
3. Prove that the exchange doesn't make the solution worse
4. Repeat until the solution matches the greedy solution

**Example: Fractional Knapsack**

**Greedy Choice**: Take items in order of value/weight ratio (descending).

**Proof**:
1. Let `S` be any solution (optimal or not)
2. If `S` doesn't match the greedy order, find the first position where it differs
3. Exchange the items to match greedy order
4. Show that this exchange doesn't decrease total value (because greedy has better ratio)
5. Continue until `S` matches greedy solution
6. Therefore, greedy solution is at least as good as any other solution

### Method 3: Induction

**Goal**: Prove that making greedy choices leads to optimal solution.

**Approach**:
1. **Base Case**: Show greedy works for the smallest problem
2. **Inductive Step**: Assume greedy works for problems of size `k`
3. **Prove**: Show that adding the greedy choice for size `k+1` maintains optimality
4. **Conclusion**: By induction, greedy works for all problem sizes

**Example: Minimum Spanning Tree (Kruskal's Algorithm)**

**Greedy Choice**: Add the edge with minimum weight that doesn't form a cycle.

**Proof by Induction**:
1. **Base Case**: For 1 vertex, no edges needed - optimal
2. **Inductive Hypothesis**: Assume Kruskal's produces MST for `k` vertices
3. **Inductive Step**: 
   - Consider adding edge `e` with minimum weight
   - If `e` doesn't form a cycle, it must be in some MST (cut property)
   - Adding `e` maintains optimality
4. **Conclusion**: Kruskal's produces MST for all sizes

### Method 4: Cut Property / Matroid Theory

**Advanced Method**: For certain problems (like MST), use structural properties.

**Cut Property** (for MST):
- For any cut in the graph, the minimum weight edge crossing the cut is in some MST
- Greedy algorithms that always choose minimum crossing edges produce MSTs

**Matroid Theory**:
- Many greedy problems can be modeled as matroids
- Greedy algorithm is optimal for matroid problems
- Examples: Minimum Spanning Tree, Activity Selection

### Step-by-Step Proof Template

**Template for Proving Greedy Correctness**:

1. **Define the Greedy Choice**: Clearly state what choice the algorithm makes at each step

2. **State the Claim**: "The greedy algorithm produces an optimal solution"

3. **Prove Greedy Choice Property**:
   - Show that the greedy choice is part of some optimal solution
   - Use exchange argument or direct proof

4. **Prove Optimal Substructure**:
   - Show that after making the greedy choice, the remaining problem is a smaller instance of the same problem
   - Show that optimal solution to subproblem + greedy choice = optimal solution

5. **Combine**: Use induction or direct argument to show greedy produces optimal solution

### Example: Complete Proof for Activity Selection

**Problem**: Select maximum number of non-overlapping activities.

**Greedy Algorithm**: 
1. Sort activities by finish time
2. Select first activity
3. For each remaining activity, if it starts after last selected finishes, select it

**Proof**:

**Step 1: Greedy Choice Property**
- Let `a` be the activity with earliest finish time
- Let `S` be an optimal solution
- If `a` is in `S`, done
- If `a` is not in `S`, let `a'` be the first activity in `S`
- Since `a` finishes before `a'`, we can replace `a'` with `a`
- New solution has same size, so still optimal
- Therefore, greedy choice is part of some optimal solution

**Step 2: Optimal Substructure**
- After selecting `a`, remaining problem: select maximum activities from those starting after `a` finishes
- This is the same problem (activity selection) on a smaller set
- If we have optimal solution `S'` to subproblem, then `{a} ∪ S'` is optimal for original problem

**Step 3: Conclusion**
- By induction: greedy choice + optimal subproblem = optimal solution
- Therefore, greedy algorithm produces optimal solution

### Common Proof Techniques Summary

| Technique | When to Use | Example |
|-----------|-------------|---------|
| **Exchange Argument** | Can swap elements | Activity Selection, Fractional Knapsack |
| **Induction** | Problem has optimal substructure | MST, Activity Selection |
| **Cut Property** | Graph problems | Minimum Spanning Tree |
| **Contradiction** | Assume greedy is wrong, derive contradiction | Many problems |
| **Matroid Theory** | Problem is a matroid | Greedy is always optimal for matroids |

### Practice: Proving Your Own Greedy Algorithms

**Checklist for Proving Greedy Correctness**:

- [ ] Clearly define the greedy choice
- [ ] Prove greedy choice property (greedy choice is in some optimal solution)
- [ ] Prove optimal substructure (subproblem + greedy choice = optimal)
- [ ] Use appropriate proof technique (exchange, induction, etc.)
- [ ] Handle edge cases and boundary conditions
- [ ] Verify with counterexamples (make sure greedy doesn't fail)

### Key Takeaway

**Proving greedy correctness is essential** because:
- Greedy algorithms don't always produce optimal results
- Proof gives confidence that the algorithm works
- Understanding the proof helps identify when greedy fails
- Proof techniques are valuable for algorithm design

**Remember**: If you can't prove your greedy algorithm is correct, it might not be! Always verify with test cases and consider using dynamic programming if proof is difficult.

## 16.22 Key Takeaways

1. **Greedy algorithms** make locally optimal choices
2. **Greedy choice property** must hold for correctness
3. **Optimal substructure** is required
4. **Not always optimal** - verify correctness
5. **Often efficient** - simpler than DP
6. **Common patterns** - intervals, scheduling, optimization

## 16.23 Exercises

1. Implement a greedy algorithm for the "Meeting Rooms" problem.

2. Create a greedy solution for "Non-overlapping Intervals" (remove minimum intervals).

3. Implement a greedy algorithm for "Partition Labels" problem.

4. Create a greedy solution for "Gas Station" problem (circular route).

5. Implement a greedy algorithm for "Jump Game" problems.

6. Create a greedy solution for "Assign Cookies" problem.

7. Implement a greedy algorithm for "Queue Reconstruction by Height".

8. Create a greedy solution for "Remove K Digits" to form smallest number.

9. Implement a greedy algorithm for "Task Scheduler" problem.

10. Create a greedy solution for "Reorganize String" problem.

## 16.24 Summary

Greedy algorithms are powerful tools for optimization problems. They work by making locally optimal choices, which often lead to globally optimal solutions. However, it's crucial to verify that the greedy choice property holds, as greedy algorithms don't always produce optimal results. Understanding when to use greedy algorithms and how to prove their correctness is essential for solving many algorithmic problems efficiently.

