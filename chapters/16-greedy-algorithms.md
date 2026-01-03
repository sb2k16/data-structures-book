# Chapter 16: Greedy Algorithms

## 16.1 Introduction to Greedy Algorithms

A **greedy algorithm** makes the locally optimal choice at each step with the hope that these local choices will lead to a globally optimal solution. Greedy algorithms are simple, intuitive, and often very efficient.

### Key Characteristics

- **Greedy Choice Property**: A global optimum can be reached by making locally optimal choices
- **Optimal Substructure**: The problem can be broken down into subproblems
- **No Backtracking**: Once a choice is made, it's never reconsidered
- **Efficiency**: Often faster than dynamic programming

### When to Use Greedy Algorithms

1. **Optimization Problems**: Finding minimum/maximum values
2. **Clear Greedy Choice**: Obvious best choice at each step
3. **Optimal Substructure**: Problem can be divided into subproblems
4. **No Need for All Solutions**: Only need one optimal solution

### Greedy vs. Dynamic Programming

| Aspect | Greedy | Dynamic Programming |
|--------|--------|---------------------|
| Choices | Makes best choice now | Considers all choices |
| Subproblems | Solves once | May solve multiple times |
| Backtracking | No | Yes (implicitly) |
| Efficiency | Usually faster | May be slower |
| Correctness | Not always optimal | Always optimal |

## 16.2 Activity Selection Problem

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

## 16.3 Fractional Knapsack Problem

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

## 16.4 Huffman Coding

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

## 16.5 Minimum Spanning Tree (Greedy Approach)

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

## 16.6 Interval Scheduling

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

## 16.7 Coin Change (Greedy)

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

## 16.8 Job Scheduling

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

## 16.9 Dijkstra's Algorithm (Greedy)

Dijkstra's algorithm for shortest paths is greedy because it always picks the unvisited vertex with the smallest distance.

```cpp
// Already covered in Chapter 11
// Greedy choice: Always process the vertex with minimum distance
```

## 16.10 Greedy Algorithm Patterns

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

## 16.11 Proving Greedy Correctness

### Method 1: Greedy Choice Property
Show that a greedy choice is part of some optimal solution.

### Method 2: Exchange Argument
Show that any solution can be transformed to include the greedy choice without making it worse.

### Method 3: Induction
Prove that making greedy choices leads to optimal solution.

## 16.12 Key Takeaways

1. **Greedy algorithms** make locally optimal choices
2. **Greedy choice property** must hold for correctness
3. **Optimal substructure** is required
4. **Not always optimal** - verify correctness
5. **Often efficient** - simpler than DP
6. **Common patterns** - intervals, scheduling, optimization

## 16.13 Exercises

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

## 16.14 Summary

Greedy algorithms are powerful tools for optimization problems. They work by making locally optimal choices, which often lead to globally optimal solutions. However, it's crucial to verify that the greedy choice property holds, as greedy algorithms don't always produce optimal results. Understanding when to use greedy algorithms and how to prove their correctness is essential for solving many algorithmic problems efficiently.

