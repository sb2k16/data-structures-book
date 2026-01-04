# Chapter 12: Dynamic Programming

## 12.1 Problem Statement & Motivation

### What Problem Does Dynamic Programming Solve?

Many problems have **exponential time complexity** when solved naively:

- **Fibonacci Sequence**: Naive recursion is O(2^n)
- **Longest Common Subsequence**: Brute force is exponential
- **Coin Change**: Trying all combinations is exponential
- **Knapsack Problem**: Checking all subsets is exponential

**Naive Approaches and Their Limitations**:

- **Brute Force**: Try all possibilities → exponential time
- **Recursion**: Natural but recalculates same subproblems → exponential time
- **Greedy**: Fast but doesn't always work → incorrect results

**The Dynamic Programming Solution**: DP optimizes recursive solutions by storing results of subproblems, transforming exponential time to polynomial time (often O(n²) or O(n³)).

### When to Use Dynamic Programming

✅ **Use DP when**:
- Problem has optimal substructure (optimal solution contains optimal subproblem solutions)
- Problem has overlapping subproblems (same subproblems solved multiple times)
- Need to optimize (minimize/maximize) or count possibilities
- Brute force would be exponential

✅ **Real-world applications**:
- Sequence alignment (bioinformatics)
- Resource allocation (knapsack variants)
- Path finding (shortest paths with constraints)
- Text processing (edit distance, longest common subsequence)
- Game theory (optimal strategies)
- Compiler optimization (code generation)

### When NOT to Use Dynamic Programming

❌ **Avoid DP when**:
- No overlapping subproblems (use divide & conquer)
- Greedy algorithm works (simpler and faster)
- Problem doesn't have optimal substructure
- Space constraints are severe (DP often uses O(n) or O(n²) space)

**Key Trade-off**: DP trades space for time, storing subproblem results to avoid recalculation.

## 12.2 Conceptual Overview

**Dynamic Programming (DP)** is a powerful algorithmic technique for solving complex problems by breaking them down into simpler subproblems. It's particularly effective for optimization problems where we need to find the best solution among many possible solutions.

### Intuitive Explanation

Think of DP like solving a jigsaw puzzle:
- **Subproblems**: Individual puzzle pieces
- **Optimal Substructure**: Each piece fits optimally with adjacent pieces
- **Memoization**: Remember where each piece goes (don't try same placement twice)
- **Tabulation**: Build solution systematically from bottom up

### Key Principles of Dynamic Programming

1. **Optimal Substructure**: The optimal solution to a problem contains optimal solutions to its subproblems
2. **Overlapping Subproblems**: The same subproblems are solved multiple times in a recursive approach
3. **Memoization/Tabulation**: Store results of subproblems to avoid redundant calculations

### DP vs. Other Approaches

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|----------------|------------------|-------------|
| Brute Force | Exponential | O(n) | Small input sizes |
| Recursion | Exponential | O(n) | Clear recursive structure |
| Memoization | Reduced | O(n) | Top-down approach |
| Tabulation | Reduced | O(n) | Bottom-up approach |

## 12.7 Implementation (Reference Language: C++) ⭐

**Note to Reader**: This section provides concrete C++ implementations. The correctness relies on the invariants defined in Section 12.3 and the pseudocode in Section 12.6.

### 12.7.1 Fibonacci Sequence - The Classic Example

### Naive Recursive Approach
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <chrono>
using namespace std;

// Naive recursive Fibonacci - O(2^n) time complexity
long long fibonacciNaive(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// Example: fibonacciNaive(40) takes several seconds
```

#### Understanding the Problem: Recursion Tree Analysis

The naive recursive approach suffers from **exponential time complexity** because it recalculates the same subproblems repeatedly. Let's visualize this with a recursion tree for `fibonacci(5)`:

```
                    fibonacci(5)
                   /            \
          fibonacci(4)          fibonacci(3)
         /          \           /          \
  fibonacci(3)  fibonacci(2)  fibonacci(2)  fibonacci(1)
   /      \      /      \      /      \
fib(2)  fib(1) fib(1) fib(0) fib(1) fib(0)
 /   \
fib(1) fib(0)
```

**Observations from the recursion tree:**

1. **Redundant Calculations**: Notice that `fibonacci(3)` is calculated **2 times**, `fibonacci(2)` is calculated **3 times**, and `fibonacci(1)` is calculated **5 times**. This redundancy grows exponentially with larger inputs.

2. **Exponential Growth**: For `fibonacci(n)`, the number of function calls is approximately O(2^n). This means:
   - `fibonacci(20)` makes ~1 million calls
   - `fibonacci(30)` makes ~1 billion calls
   - `fibonacci(40)` makes ~1 trillion calls

3. **Time Complexity**: Each function call does O(1) work, but there are exponentially many calls, resulting in O(2^n) total time complexity.

4. **Space Complexity**: The maximum depth of recursion is O(n), so space complexity is O(n) for the call stack.

**The Solution**: Memoization eliminates this redundancy by storing results of subproblems. With memoization, each subproblem (like `fibonacci(3)`) is calculated only **once**, and subsequent calls simply retrieve the cached result. This reduces time complexity from O(2^n) to O(n).

### Memoization Approach (Top-Down)

**Why Memoization?** The naive recursive approach recalculates the same subproblems multiple times. For example, when computing `fibonacci(5)`, we calculate `fibonacci(3)` multiple times. Memoization stores the results of subproblems in a cache (memo table) so that when we encounter the same subproblem again, we can simply look up the result instead of recalculating it. This transforms the exponential time complexity O(2^n) to linear O(n) time complexity.

**Key Benefits:**
- **Eliminates Redundant Calculations**: Each subproblem is solved only once
- **Top-Down Approach**: Starts from the problem and breaks it down (natural recursive thinking)
- **Lazy Evaluation**: Only computes subproblems that are actually needed
- **Easy to Implement**: Minimal changes to recursive code (just add memoization check)

```cpp
// Memoized Fibonacci - O(n) time complexity
long long fibonacciMemo(int n, unordered_map<int, long long>& memo) {
    if (n <= 1) {
        return n;
    }
    
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

long long fibonacciMemo(int n) {
    unordered_map<int, long long> memo;
    return fibonacciMemo(n, memo);
}

// Alternative with vector
long long fibonacciMemoVector(int n, vector<long long>& memo) {
    if (n <= 1) {
        return n;
    }
    
    if (memo[n] != -1) {
        return memo[n];
    }
    
    memo[n] = fibonacciMemoVector(n - 1, memo) + fibonacciMemoVector(n - 2, memo);
    return memo[n];
}

long long fibonacciMemoVector(int n) {
    vector<long long> memo(n + 1, -1);
    return fibonacciMemoVector(n, memo);
}
```

### Tabulation Approach (Bottom-Up)

**Why Tabulation?** While memoization solves the redundancy problem, it still uses recursion which can lead to stack overflow for very large inputs. Tabulation (bottom-up approach) builds the solution iteratively from the base cases upward, eliminating the need for recursion entirely.

**Key Advantages of Tabulation:**

1. **No Recursion Overhead**: Iterative approach avoids function call overhead and potential stack overflow
2. **Better Space Optimization**: Can often optimize space by only keeping necessary values (e.g., only last two values for Fibonacci)
3. **Predictable Memory Access**: Iterative access patterns are more cache-friendly than recursive calls
4. **Easier to Understand**: Some find iterative bottom-up approach more intuitive
5. **No Function Call Stack**: Eliminates risk of stack overflow for deep recursions

**Comparison: Memoization vs Tabulation**

| Aspect | Memoization (Top-Down) | Tabulation (Bottom-Up) |
|--------|----------------------|----------------------|
| Approach | Recursive | Iterative |
| Direction | Problem → Base Cases | Base Cases → Problem |
| Stack Usage | Uses call stack | No call stack |
| Space | O(n) for memo + O(n) stack | O(n) for table (can optimize) |
| Computation | Only computes needed subproblems | Computes all subproblems |
| Implementation | Easier to convert from recursion | Requires understanding of dependencies |

**When to Use Tabulation:**
- When recursion depth might cause stack overflow
- When you need to optimize space further
- When all subproblems need to be computed anyway
- When iterative approach is more natural for the problem

```cpp
// Tabulated Fibonacci - O(n) time, O(n) space
long long fibonacciTab(int n) {
    if (n <= 1) {
        return n;
    }
    
    vector<long long> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Space-optimized Fibonacci - O(n) time, O(1) space
long long fibonacciOptimized(int n) {
    if (n <= 1) {
        return n;
    }
    
    long long prev2 = 0;  // F(n-2)
    long long prev1 = 1;  // F(n-1)
    long long current;    // F(n)
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}
```

### Performance Comparison

To see a practical comparison of all Fibonacci approaches (Naive Recursive, Memoization, Tabulation, and Space-Optimized), run the performance comparison example:

```bash
cd examples/dynamic_programming
g++ -std=c++17 -O2 -o fibonacci_comparison fibonacci_performance_comparison.cpp
./fibonacci_comparison
```

This example demonstrates:
- **Exponential time complexity** of the naive recursive approach
- **Linear time complexity** of memoization and tabulation
- **Space optimization** benefits
- **Actual performance measurements** for different input sizes

The code is available in `examples/dynamic_programming/fibonacci_performance_comparison.cpp`.

## 12.3 Classic DP Problems

### 1. Climbing Stairs

**Problem**: You can climb 1 or 2 steps at a time. How many ways can you climb n steps?

```cpp
// Recursive approach
int climbStairsRecursive(int n) {
    if (n <= 2) {
        return n;
    }
    return climbStairsRecursive(n - 1) + climbStairsRecursive(n - 2);
}

// DP approach
int climbStairs(int n) {
    if (n <= 2) {
        return n;
    }
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Space-optimized
int climbStairsOptimized(int n) {
    if (n <= 2) {
        return n;
    }
    
    int prev2 = 1;  // ways to reach step 1
    int prev1 = 2;  // ways to reach step 2
    int current;
    
    for (int i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}
```

### 2. House Robber

**Problem**: Rob houses to maximize money, but can't rob adjacent houses.

```cpp
// Recursive approach
int robRecursive(vector<int>& nums, int index) {
    if (index >= nums.size()) {
        return 0;
    }
    
    // Two choices: rob current house or skip it
    return max(nums[index] + robRecursive(nums, index + 2),
               robRecursive(nums, index + 1));
}

// Memoization approach
int robMemo(vector<int>& nums, int index, vector<int>& memo) {
    if (index >= nums.size()) {
        return 0;
    }
    
    if (memo[index] != -1) {
        return memo[index];
    }
    
    memo[index] = max(nums[index] + robMemo(nums, index + 2, memo),
                      robMemo(nums, index + 1, memo));
    return memo[index];
}

int robMemo(vector<int>& nums) {
    vector<int> memo(nums.size(), -1);
    return robMemo(nums, 0, memo);
}

// Tabulation approach
int rob(vector<int>& nums) {
    if (nums.empty()) {
        return 0;
    }
    if (nums.size() == 1) {
        return nums[0];
    }
    
    vector<int> dp(nums.size());
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    
    for (int i = 2; i < nums.size(); i++) {
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    
    return dp[nums.size() - 1];
}

// Space-optimized
int robOptimized(vector<int>& nums) {
    if (nums.empty()) {
        return 0;
    }
    
    int prev2 = 0;  // max money from houses 0 to i-2
    int prev1 = nums[0];  // max money from houses 0 to i-1
    
    for (int i = 1; i < nums.size(); i++) {
        int current = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

### 3. Longest Common Subsequence (LCS)

**Problem**: Find the length of the longest subsequence common to two strings.

```cpp
// Recursive approach
int lcsRecursive(string& s1, string& s2, int i, int j) {
    if (i == 0 || j == 0) {
        return 0;
    }
    
    if (s1[i - 1] == s2[j - 1]) {
        return 1 + lcsRecursive(s1, s2, i - 1, j - 1);
    } else {
        return max(lcsRecursive(s1, s2, i - 1, j),
                   lcsRecursive(s1, s2, i, j - 1));
    }
}

// DP approach
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// Function to get the actual LCS string
string getLCS(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // Fill DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtrack to find LCS
    string lcs = "";
    int i = m, j = n;
    
    while (i > 0 && j > 0) {
        if (text1[i - 1] == text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}
```

### 4. Edit Distance (Levenshtein Distance)

**Problem**: Find minimum operations to convert string1 to string2.

```cpp
int minDistance(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // Initialize base cases
    for (int i = 0; i <= m; i++) {
        dp[i][0] = i;  // i deletions
    }
    for (int j = 0; j <= n; j++) {
        dp[0][j] = j;  // j insertions
    }
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];  // No operation needed
            } else {
                dp[i][j] = 1 + min({
                    dp[i - 1][j],      // Delete from word1
                    dp[i][j - 1],      // Insert into word1
                    dp[i - 1][j - 1]   // Replace in word1
                });
            }
        }
    }
    
    return dp[m][n];
}

// Space-optimized version
int minDistanceOptimized(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    if (m < n) {
        swap(word1, word2);
        swap(m, n);
    }
    
    vector<int> prev(n + 1), curr(n + 1);
    
    // Initialize first row
    for (int j = 0; j <= n; j++) {
        prev[j] = j;
    }
    
    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + min({prev[j], curr[j - 1], prev[j - 1]});
            }
        }
        
        prev = curr;
    }
    
    return prev[n];
}
```

### 5. Coin Change

**Problem**: Find minimum number of coins needed to make a given amount.

```cpp
// Recursive approach
int coinChangeRecursive(vector<int>& coins, int amount) {
    if (amount == 0) return 0;
    if (amount < 0) return -1;
    
    int minCoins = INT_MAX;
    for (int coin : coins) {
        int result = coinChangeRecursive(coins, amount - coin);
        if (result != -1) {
            minCoins = min(minCoins, result + 1);
        }
    }
    
    return (minCoins == INT_MAX) ? -1 : minCoins;
}

// DP approach
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);  // Initialize with impossible value
    dp[0] = 0;  // Base case: 0 coins needed for amount 0
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}

// Count number of ways to make change
int coinChangeWays(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;  // One way to make amount 0
    
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    
    return dp[amount];
}
```

### 6. Longest Increasing Subsequence (LIS)

**Problem**: Find the length of the longest increasing subsequence.

```cpp
// O(n²) DP approach
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);  // Each element is a subsequence of length 1
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return *max_element(dp.begin(), dp.end());
}

// O(n log n) approach using binary search
int lengthOfLISOptimized(vector<int>& nums) {
    vector<int> tails;
    
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        
        if (it == tails.end()) {
            tails.push_back(num);
        } else {
            *it = num;
        }
    }
    
    return tails.size();
}

// Function to get the actual LIS
vector<int> getLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    vector<int> parent(n, -1);
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
        }
    }
    
    // Find the end of longest subsequence
    int maxLength = 0;
    int maxIndex = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] > maxLength) {
            maxLength = dp[i];
            maxIndex = i;
        }
    }
    
    // Reconstruct the subsequence
    vector<int> lis;
    int current = maxIndex;
    while (current != -1) {
        lis.push_back(nums[current]);
        current = parent[current];
    }
    
    reverse(lis.begin(), lis.end());
    return lis;
}
```

## 12.4 2D Dynamic Programming

### Unique Paths

**Problem**: Find number of unique paths from top-left to bottom-right of a grid.

```cpp
int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}

// Space-optimized version
int uniquePathsOptimized(int m, int n) {
    vector<int> prev(n, 1);
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            prev[j] += prev[j - 1];
        }
    }
    
    return prev[n - 1];
}

// With obstacles
int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
    int m = obstacleGrid.size();
    int n = obstacleGrid[0].size();
    
    vector<vector<int>> dp(m, vector<int>(n, 0));
    
    // Initialize first row and column
    dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;
    
    for (int i = 1; i < m; i++) {
        dp[i][0] = (obstacleGrid[i][0] == 0 && dp[i - 1][0] == 1) ? 1 : 0;
    }
    
    for (int j = 1; j < n; j++) {
        dp[0][j] = (obstacleGrid[0][j] == 0 && dp[0][j - 1] == 1) ? 1 : 0;
    }
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (obstacleGrid[i][j] == 0) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
    }
    
    return dp[m - 1][n - 1];
}
```

### Maximum Path Sum

**Problem**: Find maximum path sum in a triangle.

```cpp
int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<vector<int>> dp(n, vector<int>(n));
    
    // Initialize bottom row
    for (int j = 0; j < n; j++) {
        dp[n - 1][j] = triangle[n - 1][j];
    }
    
    // Fill from bottom to top
    for (int i = n - 2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            dp[i][j] = triangle[i][j] + min(dp[i + 1][j], dp[i + 1][j + 1]);
        }
    }
    
    return dp[0][0];
}

// Space-optimized
int minimumTotalOptimized(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp(triangle[n - 1]);
    
    for (int i = n - 2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);
        }
    }
    
    return dp[0];
}
```

## 12.5 Backtracking with Memoization

**Note**: While backtracking is a distinct algorithmic technique, it often benefits from memoization to avoid redundant state exploration. This section shows how backtracking problems can be optimized using DP techniques.

### 12.5.1 Understanding Backtracking in DP Context

Backtracking systematically explores all possible solutions by building solutions incrementally and abandoning partial solutions that cannot lead to a complete solution. When combined with memoization, backtracking becomes a powerful tool for solving complex DP problems.

#### Core Concept

Backtracking with memoization combines:
- **Systematic Exploration**: Try all possible choices at each step
- **Pruning**: Abandon paths that cannot lead to optimal solutions
- **Memoization**: Cache results to avoid redundant calculations
- **State Space Reduction**: Use constraints to limit the search space

#### When to Use Backtracking with Memoization

- **Combinatorial Problems**: Finding all possible combinations or permutations
- **Constraint Satisfaction**: Problems with multiple constraints
- **Decision Trees**: Problems that can be represented as decision trees
- **Optimization with Constraints**: Finding optimal solutions under constraints

### 12.5.2 Memoization Techniques and Implementation

#### Basic Memoization Pattern

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
using namespace std;

// Basic memoization template
template<typename Func>
class Memoizer {
private:
    unordered_map<string, int> cache;
    Func func;
    
public:
    Memoizer(Func f) : func(f) {}
    
    int operator()(const vector<int>& params) {
        string key = createKey(params);
        
        if (cache.find(key) != cache.end()) {
            return cache[key];
        }
        
        int result = func(params);
        cache[key] = result;
        return result;
    }
    
private:
    string createKey(const vector<int>& params) {
        string key = "";
        for (int param : params) {
            key += to_string(param) + ",";
        }
        return key;
    }
};
```

#### Advanced Memoization with State Compression

```cpp
// State compression for efficient memoization
class StateCompressor {
private:
    unordered_map<long long, int> cache;
    
public:
    long long compressState(const vector<int>& state) {
        long long compressed = 0;
        for (int i = 0; i < state.size(); i++) {
            compressed = compressed * 1000 + state[i];
        }
        return compressed;
    }
    
    int getMemoized(long long state) {
        return cache.find(state) != cache.end() ? cache[state] : -1;
    }
    
    void setMemoized(long long state, int value) {
        cache[state] = value;
    }
};
```

### 12.5.3 Classic Backtracking Problems with Memoization

#### N-Queens Problem with Memoization

```cpp
class NQueensSolver {
private:
    int n;
    vector<vector<int>> board;
    unordered_map<string, int> memo;
    
    string createBoardKey() {
        string key = "";
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                key += to_string(board[i][j]);
            }
        }
        return key;
    }
    
    bool isSafe(int row, int col) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 1) return false;
        }
        
        // Check diagonal
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1) return false;
        }
        
        // Check anti-diagonal
        for (int i = row, j = col; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 1) return false;
        }
        
        return true;
    }
    
public:
    NQueensSolver(int n) : n(n), board(n, vector<int>(n, 0)) {}
    
    int solveWithMemoization(int row = 0) {
        if (row == n) {
            return 1; // Found a valid solution
        }
        
        string key = createBoardKey() + "," + to_string(row);
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        int solutions = 0;
        for (int col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board[row][col] = 1;
                solutions += solveWithMemoization(row + 1);
                board[row][col] = 0; // Backtrack
            }
        }
        
        memo[key] = solutions;
        return solutions;
    }
    
    void printSolutions() {
        cout << "Total solutions for " << n << "-Queens: " 
             << solveWithMemoization() << endl;
    }
};
```

#### Subset Sum with Memoization

```cpp
class SubsetSumSolver {
private:
    vector<int> numbers;
    unordered_map<string, bool> memo;
    
    string createKey(int index, int target) {
        return to_string(index) + "," + to_string(target);
    }
    
public:
    SubsetSumSolver(const vector<int>& nums) : numbers(nums) {}
    
    bool canMakeSum(int target) {
        return canMakeSumMemo(0, target);
    }
    
private:
    bool canMakeSumMemo(int index, int target) {
        if (target == 0) return true;
        if (index >= numbers.size() || target < 0) return false;
        
        string key = createKey(index, target);
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        // Try including current number
        bool include = canMakeSumMemo(index + 1, target - numbers[index]);
        
        // Try excluding current number
        bool exclude = canMakeSumMemo(index + 1, target);
        
        bool result = include || exclude;
        memo[key] = result;
        return result;
    }
    
public:
    vector<vector<int>> getAllSubsets(int target) {
        vector<vector<int>> result;
        vector<int> current;
        getAllSubsetsHelper(0, target, current, result);
        return result;
    }
    
private:
    void getAllSubsetsHelper(int index, int target, vector<int>& current, 
                           vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (index >= numbers.size() || target < 0) return;
        
        // Include current number
        current.push_back(numbers[index]);
        getAllSubsetsHelper(index + 1, target - numbers[index], current, result);
        current.pop_back();
        
        // Exclude current number
        getAllSubsetsHelper(index + 1, target, current, result);
    }
};
```

### 12.5.4 Advanced Memoization Patterns

#### Multi-Dimensional Memoization

```cpp
class MultiDimMemoization {
private:
    unordered_map<string, int> memo;
    
    string createKey(const vector<int>& dimensions) {
        string key = "";
        for (int dim : dimensions) {
            key += to_string(dim) + ",";
        }
        return key;
    }
    
public:
    int knapsack3D(vector<int>& weights, vector<int>& values, 
                   vector<int>& volumes, int maxWeight, int maxVolume) {
        return knapsack3DMemo(0, maxWeight, maxVolume, weights, values, volumes);
    }
    
private:
    int knapsack3DMemo(int index, int remainingWeight, int remainingVolume,
                      const vector<int>& weights, const vector<int>& values,
                      const vector<int>& volumes) {
        if (index >= weights.size() || remainingWeight < 0 || remainingVolume < 0) {
            return 0;
        }
        
        vector<int> state = {index, remainingWeight, remainingVolume};
        string key = createKey(state);
        
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        // Don't take current item
        int notTake = knapsack3DMemo(index + 1, remainingWeight, remainingVolume,
                                   weights, values, volumes);
        
        // Take current item
        int take = 0;
        if (weights[index] <= remainingWeight && volumes[index] <= remainingVolume) {
            take = values[index] + knapsack3DMemo(index + 1, 
                                                remainingWeight - weights[index],
                                                remainingVolume - volumes[index],
                                                weights, values, volumes);
        }
        
        int result = max(notTake, take);
        memo[key] = result;
        return result;
    }
};
```

## 12.6 Comprehensive DP Patterns Taxonomy

Understanding DP patterns helps recognize when to apply dynamic programming and which approach to use.

### DP Patterns Overview

```mermaid
graph TD
    DP["Dynamic Programming Patterns"]
    DP --> Linear["1. Linear DP<br/>- 1D state<br/>- Sequential processing<br/>- Examples: Fibonacci, Climbing Stairs"]
    DP --> Grid2D["2. 2D Grid DP<br/>- 2D state space<br/>- Grid traversal<br/>- Examples: Unique Paths, Min Path Sum"]
    DP --> Subseq["3. Subsequence DP<br/>- String/Array subsequences<br/>- Matching problems<br/>- Examples: LCS, LIS, Edit Distance"]
    DP --> Partition["4. Partition DP<br/>- Split into subproblems<br/>- Optimization over partitions<br/>- Examples: Coin Change, Palindrome Partitioning"]
    DP --> Interval["5. Interval DP<br/>- Process intervals<br/>- Combine subintervals<br/>- Examples: Matrix Chain, Burst Balloons"]
    DP --> StateMachine["6. State Machine DP<br/>- Multiple states<br/>- State transitions<br/>- Examples: Buy/Sell Stock, String Matching"]
    
    style DP fill:#FFE5B4,stroke:#333,stroke-width:3px
    style Linear fill:#E6F3FF,stroke:#333,stroke-width:2px
    style Grid2D fill:#E6F3FF,stroke:#333,stroke-width:2px
    style Subseq fill:#E6F3FF,stroke:#333,stroke-width:2px
    style Partition fill:#E6F3FF,stroke:#333,stroke-width:2px
    style Interval fill:#E6F3FF,stroke:#333,stroke-width:2px
    style StateMachine fill:#E6F3FF,stroke:#333,stroke-width:2px
```

### Pattern 1: Linear DP

**Characteristics**:
- 1D state space: `dp[i]` represents solution up to position `i`
- Sequential processing: Process elements one by one
- Simple recurrence: Usually depends on previous 1-2 states

**Examples**: Fibonacci, Climbing Stairs, House Robber

```cpp
// Example: Climbing Stairs
int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1;  // dp[0]
    int prev1 = 2;  // dp[1]
    
    for (int i = 3; i <= n; i++) {
        int current = prev1 + prev2;  // dp[i] = dp[i-1] + dp[i-2]
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

### Pattern 2: 2D Grid DP

**Characteristics**:
- 2D state space: `dp[i][j]` represents solution at grid position `(i, j)`
- Grid traversal: Fill grid row by row or column by column
- Adjacent dependencies: Usually depends on top and left cells

**Examples**: Unique Paths, Minimum Path Sum, Maximal Square

```cpp
// Example: Unique Paths (already covered in 12.4)
// dp[i][j] = number of ways to reach (i, j)
// dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

### Pattern 3: Subsequence DP

**Characteristics**:
- String/Array subsequences: Work with subsequences (not necessarily contiguous)
- Matching problems: Compare two sequences
- Two pointers: Usually `dp[i][j]` compares positions `i` and `j`

**Examples**: LCS, LIS, Edit Distance, Longest Palindromic Subsequence

```cpp
// Example: Longest Common Subsequence (already covered)
// dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]
```

### Pattern 4: Partition DP

**Characteristics**:
- Split into subproblems: Divide problem into partitions
- Optimization: Find optimal way to partition
- Multiple choices: Try different partition points

**Examples**: Coin Change, Palindrome Partitioning, Word Break

```cpp
// Example: Coin Change
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}
```

### Pattern 5: Interval DP

**Characteristics**:
- Process intervals: Work with ranges `[i, j]`
- Combine subintervals: Combine solutions from smaller intervals
- Length-based: Usually iterate by interval length

**Examples**: Matrix Chain Multiplication, Burst Balloons, Palindrome Partitioning II

```cpp
// Example: Matrix Chain Multiplication
int matrixChainOrder(vector<int>& p) {
    int n = p.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    // l is chain length
    for (int l = 2; l <= n; l++) {
        for (int i = 0; i < n - l + 1; i++) {
            int j = i + l - 1;
            dp[i][j] = INT_MAX;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + p[i]*p[k+1]*p[j+1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n-1];
}
```

### Pattern 6: State Machine DP

**Characteristics**:
- Multiple states: Problem has distinct states (e.g., holding stock, not holding)
- State transitions: Move between states based on actions
- State tracking: `dp[i][state]` = solution at position `i` in state `state`

**Examples**: Best Time to Buy/Sell Stock, House Robber II, Decode Ways

```cpp
// Example: Best Time to Buy and Sell Stock with Cooldown
int maxProfit(vector<int>& prices) {
    int n = prices.size();
    if (n <= 1) return 0;
    
    // States: 0 = hold, 1 = sold (cooldown), 2 = can buy
    vector<vector<int>> dp(n, vector<int>(3, 0));
    
    dp[0][0] = -prices[0];  // Hold: bought on day 0
    dp[0][1] = 0;            // Sold: can't sell on day 0
    dp[0][2] = 0;            // Can buy: no action on day 0
    
    for (int i = 1; i < n; i++) {
        // Hold: max of (continue holding, buy today)
        dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i]);
        
        // Sold: sold today (was holding)
        dp[i][1] = dp[i-1][0] + prices[i];
        
        // Can buy: max of (continue can buy, end cooldown)
        dp[i][2] = max(dp[i-1][2], dp[i-1][1]);
    }
    
    return max({dp[n-1][0], dp[n-1][1], dp[n-1][2]});
}
```

## 12.7 DP vs Recursion vs Greedy

### When to Use Each Approach

```mermaid
graph TD
    Problem{Problem Type?} --> OptSub{Optimal<br/>Substructure?}
    
    OptSub -->|No| Brute["Brute Force<br/>or<br/>Backtracking"]
    
    OptSub -->|Yes| Overlap{Overlapping<br/>Subproblems?}
    
    Overlap -->|No| Greedy{Local Optimal<br/>→ Global?}
    Greedy -->|Yes| GreedyAlgo["Greedy Algorithm<br/>- Make locally optimal choice<br/>- Examples: Activity Selection,<br/>  Minimum Coins (greedy)"]
    Greedy -->|No| DP["Dynamic Programming<br/>- Store subproblem results<br/>- Examples: Coin Change (DP),<br/>  Longest Path"]
    
    Overlap -->|Yes| DP
    
    style Problem fill:#FFE5B4,stroke:#333,stroke-width:3px
    style Brute fill:#FFB6C1,stroke:#333,stroke-width:2px
    style GreedyAlgo fill:#90EE90,stroke:#333,stroke-width:2px
    style DP fill:#87CEEB,stroke:#333,stroke-width:2px
```

### Comparison Table

| Approach | When to Use | Time Complexity | Space Complexity | Examples |
|----------|-------------|----------------|------------------|----------|
| **Recursion** | Clear recursive structure, no overlapping subproblems | Exponential | O(n) stack | Tree traversal, factorial |
| **Memoization** | Overlapping subproblems, top-down thinking | Polynomial | O(n) + O(n) memo | Fibonacci, LCS (memoized) |
| **Tabulation** | Overlapping subproblems, bottom-up approach | Polynomial | O(n) or O(n²) | Fibonacci, LCS (tabulated) |
| **Greedy** | Local optimal → global optimal, no overlapping | Polynomial | O(1) to O(n) | Activity Selection, Dijkstra |
| **DP** | Overlapping subproblems, optimal substructure | Polynomial | O(n) to O(n²) | Coin Change, LIS, Knapsack |

### Key Differences

**Recursion vs DP**:
- **Recursion**: Solves subproblems independently, may recalculate
- **DP**: Stores results, avoids recalculation

**Greedy vs DP**:
- **Greedy**: Makes locally optimal choice, doesn't reconsider
- **DP**: Explores all possibilities, finds globally optimal

**Example: Coin Change**
- **Greedy**: Works for some coin systems (e.g., US coins), fails for others
- **DP**: Always finds optimal solution for any coin system

## 12.8 Space Optimization Techniques

### Technique 1: Rolling Array

**Concept**: For 2D DP where current row only depends on previous row, use 1D array.

```cpp
// Before: O(m×n) space
vector<vector<int>> dp(m, vector<int>(n));

// After: O(n) space (rolling array)
vector<int> prev(n);
vector<int> curr(n);

for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
        // Calculate curr[j] using prev
    }
    prev = curr;  // Roll over
}
```

**Example: Unique Paths**
```cpp
// Space-optimized from O(m×n) to O(n)
int uniquePathsOptimized(int m, int n) {
    vector<int> prev(n, 1);
    
    for (int i = 1; i < m; i++) {
        vector<int> curr(n, 1);
        for (int j = 1; j < n; j++) {
            curr[j] = prev[j] + curr[j - 1];
        }
        prev = curr;
    }
    
    return prev[n - 1];
}
```

### Technique 2: State Compression

**Concept**: Use bit masks to represent states, reducing space from O(2^n) to O(2^n) but with better constants.

```cpp
// Example: Traveling Salesman Problem (TSP)
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int maskLimit = 1 << n;
    
    // dp[mask][last] = min cost to visit cities in mask, ending at last
    vector<vector<int>> dp(maskLimit, vector<int>(n, INT_MAX));
    
    // Base case: starting from city 0
    dp[1][0] = 0;
    
    for (int mask = 1; mask < maskLimit; mask++) {
        for (int last = 0; last < n; last++) {
            if (!(mask & (1 << last))) continue;  // last not in mask
            if (dp[mask][last] == INT_MAX) continue;
            
            for (int next = 0; next < n; next++) {
                if (mask & (1 << next)) continue;  // already visited
                
                int newMask = mask | (1 << next);
                dp[newMask][next] = min(dp[newMask][next], 
                                       dp[mask][last] + dist[last][next]);
            }
        }
    }
    
    // Return to starting city
    int result = INT_MAX;
    int fullMask = maskLimit - 1;
    for (int last = 1; last < n; last++) {
        result = min(result, dp[fullMask][last] + dist[last][0]);
    }
    
    return result;
}
```

### Technique 3: Variable Optimization

**Concept**: For linear DP, only keep necessary previous states.

```cpp
// Fibonacci: Only need last 2 values
// Before: O(n) space
vector<long long> dp(n + 1);

// After: O(1) space
long long prev2 = 0, prev1 = 1;
for (int i = 2; i <= n; i++) {
    long long curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
}
```

### Technique 4: Sliding Window for Intervals

**Concept**: For interval DP, process by length and reuse arrays.

```cpp
// Matrix Chain: Process by chain length
// Only need current length, can reuse previous
```

## 12.9 Classic DP Problems

### Problem 1: Edit Distance (Levenshtein Distance)

**Already covered in section 12.3.4**

### Problem 2: Longest Palindromic Subsequence

**Problem**: Find the length of the longest palindromic subsequence in a string.

```cpp
int longestPalindromeSubseq(string s) {
    int n = s.length();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    // Base case: single character is palindrome of length 1
    for (int i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    // Fill for lengths 2 to n
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            
            if (s[i] == s[j]) {
                // Characters match: add 2 to inner subsequence
                dp[i][j] = 2 + (len > 2 ? dp[i + 1][j - 1] : 0);
            } else {
                // Characters don't match: take max of excluding either
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
}

// Space-optimized version
int longestPalindromeSubseqOptimized(string s) {
    int n = s.length();
    vector<int> prev(n, 0);
    vector<int> curr(n, 0);
    
    for (int i = n - 1; i >= 0; i--) {
        curr[i] = 1;  // Single character
        for (int j = i + 1; j < n; j++) {
            if (s[i] == s[j]) {
                curr[j] = 2 + prev[j - 1];
            } else {
                curr[j] = max(prev[j], curr[j - 1]);
            }
        }
        prev = curr;
    }
    
    return curr[n - 1];
}
```

### Problem 3: Word Break

**Problem**: Determine if a string can be segmented into space-separated words from a dictionary.

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    int n = s.length();
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    
    // dp[i] = can s[0..i-1] be segmented?
    vector<bool> dp(n + 1, false);
    dp[0] = true;  // Empty string can always be segmented
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            // Check if s[0..j-1] can be segmented (dp[j])
            // and s[j..i-1] is in dictionary
            if (dp[j] && wordSet.find(s.substr(j, i - j)) != wordSet.end()) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}

// Optimized: Check word lengths instead of all positions
bool wordBreakOptimized(string s, vector<string>& wordDict) {
    int n = s.length();
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    
    for (int i = 1; i <= n; i++) {
        for (const string& word : wordDict) {
            int len = word.length();
            if (i >= len && dp[i - len] && 
                s.substr(i - len, len) == word) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}
```

## 12.10 DP Patterns and Techniques (Continued)

### Pattern 7: 0/1 Knapsack

**Problem**: Maximize value with weight constraint.

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w],
                               dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}

// Space-optimized (1D array)
int knapsackOptimized(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    
    for (int i = 0; i < weights.size(); i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```

### Pattern 2: Unbounded Knapsack

**Problem**: Items can be used unlimited times.

```cpp
int unboundedKnapsack(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    
    for (int w = 1; w <= capacity; w++) {
        for (int i = 0; i < weights.size(); i++) {
            if (weights[i] <= w) {
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
    }
    
    return dp[capacity];
}
```

### Pattern 3: Subset Sum

**Problem**: Check if subset with given sum exists.

```cpp
bool subsetSum(vector<int>& nums, int target) {
    int n = nums.size();
    vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
    
    // Base case: sum 0 is always possible
    for (int i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= target; j++) {
            if (nums[i - 1] <= j) {
                dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i - 1]];
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }
    
    return dp[n][target];
}
```

## 12.6 Performance Analysis and Optimization

### Time and Space Complexity

| Problem Type | Time Complexity | Space Complexity | Optimization |
|--------------|----------------|------------------|--------------|
| 1D DP | O(n) | O(n) | O(1) with variables |
| 2D DP | O(m×n) | O(m×n) | O(min(m,n)) with 1D array |
| Knapsack | O(n×W) | O(n×W) | O(W) with 1D array |
| LCS | O(m×n) | O(m×n) | O(min(m,n)) |

### Optimization Techniques

1. **Space Optimization**: Reduce space complexity by reusing arrays
2. **State Optimization**: Reduce number of states needed
3. **Memoization vs Tabulation**: Choose based on problem characteristics
4. **Bottom-up vs Top-down**: Consider recursion depth and memory usage

## 12.12 Key Takeaways

1. **Dynamic Programming** solves complex problems by breaking them into simpler subproblems
2. **Memoization** stores results to avoid redundant calculations
3. **Tabulation** builds solutions bottom-up from base cases
4. **Optimal substructure** and **overlapping subproblems** are key characteristics
5. **Space optimization** can significantly reduce memory usage
6. **Pattern recognition** helps identify DP problems quickly

## 12.13 Practice Problems

### Easy Level Problems

#### Problem 1: Generate Parentheses
**Description**: Given n pairs of parentheses, generate all combinations of well-formed parentheses.

**Example**:
- Input: n = 3
- Output: ["((()))", "(()())", "(())()", "()(())", "()()()"]

**Key Concepts**: Backtracking, constraint satisfaction, string generation

#### Problem 2: Letter Combinations of a Phone Number
**Description**: Given a string containing digits from 2-9, return all possible letter combinations that the number could represent.

**Example**:
- Input: "23"
- Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

**Key Concepts**: Backtracking, string manipulation, mapping

#### Problem 3: Subsets
**Description**: Given an integer array nums, return all possible subsets (the power set).

**Example**:
- Input: nums = [1,2,3]
- Output: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

**Key Concepts**: Backtracking, subset generation, bit manipulation

### Medium Level Problems

#### Problem 4: Permutations
**Description**: Given an array nums of distinct integers, return all possible permutations.

**Example**:
- Input: nums = [1,2,3]
- Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]

**Key Concepts**: Backtracking, permutation generation, state management

#### Problem 5: Combination Sum
**Description**: Given an array of distinct integers and a target, return all unique combinations where the numbers sum to target.

**Example**:
- Input: candidates = [2,3,6,7], target = 7
- Output: [[2,2,3], [7]]

**Key Concepts**: Backtracking, combination generation, pruning

#### Problem 6: Word Search
**Description**: Given a 2D board and a word, find if the word exists in the grid.

**Example**:
- Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
- Output: true

**Key Concepts**: Backtracking, 2D grid traversal, path finding

#### Problem 7: Palindrome Partitioning
**Description**: Given a string s, partition s such that every substring of the partition is a palindrome.

**Example**:
- Input: s = "aab"
- Output: [["a","a","b"], ["aa","b"]]

**Key Concepts**: Backtracking, palindrome checking, string partitioning

### Hard Level Problems

#### Problem 8: N-Queens
**Description**: Place n queens on an n×n chessboard such that no two queens attack each other.

**Example**:
- Input: n = 4
- Output: [[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]

**Key Concepts**: Backtracking, constraint satisfaction, 2D board problems

#### Problem 9: Sudoku Solver
**Description**: Write a program to solve a Sudoku puzzle by filling the empty cells.

**Example**:
- Input: 9×9 grid with some cells filled
- Output: Complete valid Sudoku solution

**Key Concepts**: Backtracking, constraint propagation, 2D grid problems

#### Problem 10: Word Ladder II
**Description**: Given two words and a dictionary, find all shortest transformation sequences from beginWord to endWord.

**Example**:
- Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
- Output: [["hit","hot","dot","dog","cog"], ["hit","hot","lot","log","cog"]]

**Key Concepts**: Backtracking, graph traversal, shortest path, BFS + DFS

#### Problem 11: Expression Add Operators
**Description**: Given a string num and a target, add binary operators (+, -, *) to make the expression evaluate to the target.

**Example**:
- Input: num = "123", target = 6
- Output: ["1+2+3", "1*2*3"]

**Key Concepts**: Backtracking, expression evaluation, operator precedence

#### Problem 12: Restore IP Addresses
**Description**: Given a string containing only digits, restore it by returning all possible valid IP address combinations.

**Example**:
- Input: s = "25525511135"
- Output: ["255.255.11.135", "255.255.111.35"]

**Key Concepts**: Backtracking, string validation, IP address formatting

### Advanced Problems

#### Problem 13: Word Pattern II
**Description**: Given a pattern and a string, determine if the string matches the pattern using backtracking.

**Example**:
- Input: pattern = "abab", str = "redblueredblue"
- Output: true

**Key Concepts**: Backtracking, pattern matching, bijection mapping

#### Problem 14: Remove Invalid Parentheses
**Description**: Remove the minimum number of invalid parentheses to make the input string valid.

**Example**:
- Input: s = "()())()"
- Output: ["()()()", "(())()"]

**Key Concepts**: Backtracking, string manipulation, optimization

#### Problem 15: Android Unlock Patterns
**Description**: Given Android 9-dot lock screen, count the number of valid unlock patterns of length m to n.

**Example**:
- Input: m = 1, n = 1
- Output: 9

**Key Concepts**: Backtracking, constraint satisfaction, counting problems

### Problem-Solving Strategies

#### 1. **Identify the Problem Type**
- **Combinatorial Generation**: Subsets, permutations, combinations
- **Constraint Satisfaction**: N-Queens, Sudoku, word problems
- **Path Finding**: Word search, maze problems
- **Optimization**: Remove invalid parentheses, expression evaluation

#### 2. **Choose the Right Approach**
- **Pure Backtracking**: When you need to explore all possibilities
- **Backtracking + Memoization**: When there are overlapping subproblems
- **Backtracking + Pruning**: When you can eliminate impossible paths early
- **Backtracking + Heuristics**: When you can guide the search intelligently

#### 3. **Implementation Tips**
- **State Management**: Keep track of current state and choices made
- **Pruning**: Eliminate impossible paths as early as possible
- **Base Cases**: Define clear termination conditions
- **Backtracking**: Undo changes when returning from recursive calls

#### 4. **Optimization Techniques**
- **Memoization**: Cache results to avoid redundant calculations
- **Constraint Propagation**: Use constraints to reduce search space
- **Heuristic Ordering**: Try most promising choices first
- **Early Termination**: Stop when solution is found (if only one needed)

## 12.9 Exercises

1. Implement a DP solution for the "Maximum Subarray" problem (Kadane's algorithm).
2. Solve the "Word Break" problem using DP.
3. Implement DP for "Longest Palindromic Subsequence".
4. Create a DP solution for "Matrix Chain Multiplication".
5. Solve the "Target Sum" problem using DP.

## 12.9 Summary

Dynamic Programming is a powerful technique that transforms exponential-time recursive solutions into polynomial-time algorithms. By identifying overlapping subproblems and storing their solutions, DP provides efficient solutions to many optimization problems. Understanding the core principles, recognizing DP patterns, and mastering optimization techniques are essential skills for solving complex algorithmic challenges.

The key to mastering DP is practice and pattern recognition. Start with simple problems like Fibonacci and gradually work your way up to more complex problems involving 2D DP and advanced patterns. Remember that DP is not just about memorizing solutions but understanding the underlying principles that make it work.
