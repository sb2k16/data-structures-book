# Chapter 12: Dynamic Programming

## 12.1 Introduction to Dynamic Programming

**Dynamic Programming (DP)** is a powerful algorithmic technique for solving complex problems by breaking them down into simpler subproblems. It's particularly effective for optimization problems where we need to find the best solution among many possible solutions.

### Key Principles of Dynamic Programming

1. **Optimal Substructure**: The optimal solution to a problem contains optimal solutions to its subproblems
2. **Overlapping Subproblems**: The same subproblems are solved multiple times in a recursive approach
3. **Memoization**: Store results of subproblems to avoid redundant calculations

### When to Use Dynamic Programming

- **Optimization Problems**: Finding minimum/maximum values
- **Counting Problems**: Counting the number of ways to do something
- **Decision Problems**: Making optimal choices at each step
- **Overlapping Subproblems**: Same subproblems appear multiple times

### DP vs. Other Approaches

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|----------------|------------------|-------------|
| Brute Force | Exponential | O(n) | Small input sizes |
| Recursion | Exponential | O(n) | Clear recursive structure |
| Memoization | Reduced | O(n) | Top-down approach |
| Tabulation | Reduced | O(n) | Bottom-up approach |

## 12.2 Fibonacci Sequence - The Classic Example

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

### Memoization Approach (Top-Down)
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
```cpp
void compareFibonacciApproaches() {
    int n = 40;
    
    cout << "Computing Fibonacci(" << n << "):" << endl;
    
    // Memoization
    auto start = chrono::high_resolution_clock::now();
    long long result1 = fibonacciMemo(n);
    auto end = chrono::high_resolution_clock::now();
    auto duration1 = chrono::duration_cast<chrono::microseconds>(end - start);
    
    // Tabulation
    start = chrono::high_resolution_clock::now();
    long long result2 = fibonacciTab(n);
    end = chrono::high_resolution_clock::now();
    auto duration2 = chrono::duration_cast<chrono::microseconds>(end - start);
    
    // Space-optimized
    start = chrono::high_resolution_clock::now();
    long long result3 = fibonacciOptimized(n);
    end = chrono::high_resolution_clock::now();
    auto duration3 = chrono::duration_cast<chrono::microseconds>(end - start);
    
    cout << "Memoization: " << result1 << " (" << duration1.count() << " μs)" << endl;
    cout << "Tabulation: " << result2 << " (" << duration2.count() << " μs)" << endl;
    cout << "Space-optimized: " << result3 << " (" << duration3.count() << " μs)" << endl;
}
```

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

## 12.5 Backtracking and Memoization Solutions

### 12.5.1 Understanding Backtracking in DP Context

Backtracking is a systematic way to explore all possible solutions to a problem by building solutions incrementally and abandoning partial solutions that cannot lead to a complete solution. When combined with memoization, backtracking becomes a powerful tool for solving complex DP problems.

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

## 12.6 DP Patterns and Techniques

### Pattern 1: 0/1 Knapsack

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

## 12.7 Key Takeaways

1. **Dynamic Programming** solves complex problems by breaking them into simpler subproblems
2. **Memoization** stores results to avoid redundant calculations
3. **Tabulation** builds solutions bottom-up from base cases
4. **Optimal substructure** and **overlapping subproblems** are key characteristics
5. **Space optimization** can significantly reduce memory usage
6. **Pattern recognition** helps identify DP problems quickly

## 12.8 Exercises

1. Implement a DP solution for the "Maximum Subarray" problem (Kadane's algorithm).
2. Solve the "Word Break" problem using DP.
3. Implement DP for "Longest Palindromic Subsequence".
4. Create a DP solution for "Matrix Chain Multiplication".
5. Solve the "Target Sum" problem using DP.

## 12.9 Summary

Dynamic Programming is a powerful technique that transforms exponential-time recursive solutions into polynomial-time algorithms. By identifying overlapping subproblems and storing their solutions, DP provides efficient solutions to many optimization problems. Understanding the core principles, recognizing DP patterns, and mastering optimization techniques are essential skills for solving complex algorithmic challenges.

The key to mastering DP is practice and pattern recognition. Start with simple problems like Fibonacci and gradually work your way up to more complex problems involving 2D DP and advanced patterns. Remember that DP is not just about memorizing solutions but understanding the underlying principles that make it work.
