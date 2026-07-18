# Dynamic Programming

Dynamic programming is what you reach for when a recursive solution is *correct but hopelessly slow* because it keeps re-solving the same subproblems. Naive Fibonacci is `O(2ⁿ)`; brute-force longest common subsequence, coin change, and knapsack are all exponential — not because the problems are hard, but because the recursion recomputes the same answers exponentially many times. DP fixes exactly that: solve each distinct subproblem once, store the result, reuse it. The exponential collapses to polynomial — usually `O(n²)` or `O(n³)` — paid for in memory.

Two properties have to hold for the trick to work, and together they are the whole test for whether something is a DP problem:

- **Optimal substructure** — the optimal answer is built from optimal answers to subproblems. Fibonacci: `F(n) = F(n-1) + F(n-2)`. LCS, edit distance, and knapsack each have a one-line recurrence of the same shape.
- **Overlapping subproblems** — the naive recursion solves the same subproblem many times. `F(3)` appears again and again in the call tree for `F(5)`; that repetition is what memoization erases.

Both must be present. Without overlap, you want plain divide and conquer ([Chapter 17](17-divide-and-conquer.md)) — nothing to cache. When a locally optimal choice is provably globally optimal, you want a cheaper greedy algorithm ([Chapter 16](16-greedy-algorithms.md)). DP is the middle case — optimization or counting over sequences, grids, and subsets: sequence alignment, resource allocation, constrained shortest paths, edit distance, optimal game play.

The mechanism comes in exactly two forms, and every algorithm in this chapter is one of them. **Memoization** (top-down) keeps the natural recursion but caches each result the first time it is computed, so it only ever touches the states it actually needs. **Tabulation** (bottom-up) drops the recursion and fills a table in dependency order, from the base cases toward the answer. They compute the same values with the same asymptotics; tabulation just has no call-stack overhead, is easier to space-optimize, and walks memory in a cache-friendly order — which, as [Performance and system considerations](#performance-and-system-considerations) shows, usually makes it the faster of the two.

Correctness of either form rests on three facts worth checking every time: base cases are correct by definition; every other state is computed from strictly *smaller* states, so its value is final before anything reads it; and the state space is finite with acyclic dependencies, so the process terminates. Get the base cases, the recurrence, and the dependency order right and the algorithm is right.

## The two faces of DP: Fibonacci

Fibonacci is the smallest problem that shows the whole idea. The naive recursion transcribes the definition directly:

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// Naive recursive Fibonacci - O(2^n) time
long long fibonacciNaive(int n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}
```

```python
# Naive recursive Fibonacci - O(2^n) time
def fibonacci_naive(n):
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)
```

```java
// Naive recursive Fibonacci - O(2^n) time
static long fibonacciNaive(int n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}
```

```go
// Naive recursive Fibonacci - O(2^n) time
func fibonacciNaive(n int) int64 {
    if n <= 1 {
        return int64(n)
    }
    return fibonacciNaive(n-1) + fibonacciNaive(n-2)
}
```

Draw its call tree and the waste is obvious:

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

`fibonacci(3)` is computed twice, `fibonacci(2)` three times, `fibonacci(1)` five times — and the redundancy compounds: `fibonacci(40)` makes about a trillion calls. Each does `O(1)` work, but there are `O(2ⁿ)` of them, at recursion depth `O(n)`.

**Memoization** caches each result the first time it is needed, so every distinct `n` is computed once. That one change collapses `O(2ⁿ)` to `O(n)` while keeping the recursive shape:

```cpp
// Memoized Fibonacci - O(n) time
long long fibonacciMemo(int n, unordered_map<int, long long>& memo) {
    if (n <= 1) return n;
    if (memo.find(n) != memo.end()) return memo[n];
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

long long fibonacciMemo(int n) {
    unordered_map<int, long long> memo;
    return fibonacciMemo(n, memo);
}
```

```python
# Memoized Fibonacci - O(n) time
def fibonacci_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]
```

```java
// Memoized Fibonacci - O(n) time
static long fibonacciMemo(int n, Map<Integer, Long> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    memo.put(n, result);
    return result;
}

static long fibonacciMemo(int n) {
    return fibonacciMemo(n, new HashMap<>());
}
```

```go
// Memoized Fibonacci - O(n) time
func fibonacciMemo(n int) int64 {
    return fibMemo(n, make(map[int]int64))
}

func fibMemo(n int, memo map[int]int64) int64 {
    if n <= 1 {
        return int64(n)
    }
    if v, ok := memo[n]; ok {
        return v
    }
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo)
    return memo[n]
}
```

**Tabulation** builds the same answers iteratively from the base cases, with no recursion (and no stack-overflow risk) and a predictable, sequential access pattern:

```cpp
// Tabulated Fibonacci - O(n) time, O(n) space
long long fibonacciTab(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}

// Space-optimized - O(n) time, O(1) space
long long fibonacciOptimized(int n) {
    if (n <= 1) return n;
    long long prev2 = 0, prev1 = 1, current = 0;
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}
```

```python
# Tabulated Fibonacci - O(n) time, O(n) space
def fibonacci_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# Space-optimized - O(n) time, O(1) space
def fibonacci_optimized(n):
    if n <= 1:
        return n
    prev2, prev1, current = 0, 1, 0
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    return current
```

```java
// Tabulated Fibonacci - O(n) time, O(n) space
static long fibonacciTab(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}

// Space-optimized - O(n) time, O(1) space
static long fibonacciOptimized(int n) {
    if (n <= 1) return n;
    long prev2 = 0, prev1 = 1, current = 0;
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}
```

```go
// Tabulated Fibonacci - O(n) time, O(n) space
func fibonacciTab(n int) int64 {
    if n <= 1 {
        return int64(n)
    }
    dp := make([]int64, n+1)
    dp[0] = 0
    dp[1] = 1
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}

// Space-optimized - O(n) time, O(1) space
func fibonacciOptimized(n int) int64 {
    if n <= 1 {
        return int64(n)
    }
    var prev2, prev1, current int64 = 0, 1, 0
    for i := 2; i <= n; i++ {
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    }
    return current
}
```

That last version is the endgame of most 1D DP: once `dp[i]` depends only on the two values before it, the table collapses to two scalars. *Keep only the state the recurrence actually reads* — a move that recurs throughout the chapter.

Stripped of the problem, both faces reduce to one of two language-neutral shapes — the template every algorithm below fills in:

```
FUNCTION solve(state):                    # memoization (top-down)
    IF state is base case: RETURN base_value
    IF memo[state] exists:  RETURN memo[state]
    result ← identity
    FOR EACH subproblem S that state depends on:
        result ← combine(result, solve(S))
    memo[state] ← result
    RETURN result

FUNCTION solve():                         # tabulation (bottom-up)
    INITIALIZE dp with base cases
    FOR EACH state in dependency order:
        result ← identity
        FOR EACH subproblem S that state depends on:
            result ← combine(result, dp[S])
        dp[state] ← result
    RETURN dp[target]
```

## Edge cases and failure modes

**Empty and tiny inputs.** Guard array and string DP before indexing:

```cpp
// House Robber
if (nums.empty()) return 0;
if (nums.size() == 1) return nums[0];
// LCS
if (text1.empty() || text2.empty()) return 0;
```

Reading `nums[1]` when `size() == 1`, or `text1[0]` on an empty string, is undefined behavior.

**Zero and negative values.** For Coin Change, `amount == 0` is the base case and `amount < 0` means impossible; drop the negative check and you recurse forever. Knapsack assumes non-negative weights — a negative weight makes `dp[capacity - weight]` index past `capacity` and corrupt the table, so validate inputs.

**Integer overflow.** DP accumulates: large Fibonacci numbers, combinatorial path counts, big knapsack sums. Use `long long`, and check against the type's limits when a result may exceed them.

**Memory.** Deep recursion can overflow the call stack (1–8 MB), so prefer tabulation for large `n`; conversely a large 2D table (`dp[10000][10000]`) can exhaust the heap — use a rolling array or memoize only the reachable subset.

The recurring bugs are off-by-one indexing (`dp[n]` vs `dp[n-1]`), missing base-case initialization, an uninitialized first row or column in 2D DP, and negative-index access. Bounds-check before reading a predecessor: `if (i > 0) result = max(result, dp[i-1][j] + value);`.

## Performance and system considerations

DP performance on real hardware is dominated by memory behavior, not by the abstract operation count — the constant-factor lesson of [Chapter 2](02-complexity-analysis.md) applied to a table.

**Cache locality — tabulation vs memoization.** Tabulation walks the table sequentially (row-major), which the prefetcher loves; memoization jumps around the recursion tree and, with a hash-map memo, pays unpredictable cache misses. A miss costs ~100–300 cycles and sequential access is roughly 10× faster than random, so tabulation is often 2–3× faster despite identical Big-O. When you do memoize, prefer a flat array over a hash map and store 2D tables row-major. Shrinking the footprint helps twice: a rolling array (`O(m×n) → O(n)`) saves memory *and* keeps the working set in cache.

**Stack vs heap.** Recursion uses the small (~1–8 MB) call stack and risks overflow at depth; iteration puts the table on the heap with no overflow risk. Pre-allocate it once rather than growing it.

**Branch prediction.** The `if (s1[i-1] == s2[j-1])` test in tight LCS/edit-distance loops is a branch: predicted well it costs ~1 cycle, mispredicted ~10–20. Where the alphabet is small, branchless code or a lookup table can help; otherwise order conditions to favor the common case.

**Concurrency and scale.** Tabulation can sometimes be parallelized across rows when a cell depends only on earlier rows, but you must respect the dependency structure; memoization resists it, since a shared memo needs synchronization and lock contention dominates. On NUMA machines, allocate the table on the node that processes it (first-touch or `numa_alloc_local()`); tables too large for RAM force chunked or distributed processing, which — with disk ~1000× slower than memory — changes the algorithm's design, not just its constants.

The practical rules: prefer tabulation for large problems, keep the layout row-major, pre-allocate, apply space optimization, choose `int` vs `long long` deliberately, and profile before optimizing.

## Classic DP problems

### Climbing Stairs

Climb 1 or 2 steps at a time; count the ways to reach step `n`. The recurrence is Fibonacci-shaped — `dp[i] = dp[i-1] + dp[i-2]` — so O(1) space suffices:

```cpp
int climbStairsOptimized(int n) {
    if (n <= 2) return n;
    int prev2 = 1;  // ways to reach step 1
    int prev1 = 2;  // ways to reach step 2
    int current = 0;
    for (int i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}
```

```python
def climb_stairs_optimized(n):
    if n <= 2:
        return n
    prev2 = 1  # ways to reach step 1
    prev1 = 2  # ways to reach step 2
    current = 0
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    return current
```

```java
static int climbStairsOptimized(int n) {
    if (n <= 2) return n;
    int prev2 = 1;  // ways to reach step 1
    int prev1 = 2;  // ways to reach step 2
    int current = 0;
    for (int i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}
```

```go
func climbStairsOptimized(n int) int {
    if n <= 2 {
        return n
    }
    prev2 := 1 // ways to reach step 1
    prev1 := 2 // ways to reach step 2
    current := 0
    for i := 3; i <= n; i++ {
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    }
    return current
}
```

### House Robber

Maximize the loot without robbing two adjacent houses: at each house, either skip it (`dp[i-1]`) or rob it (`dp[i-2] + nums[i]`).

```cpp
// Tabulation
int rob(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    vector<int> dp(nums.size());
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < nums.size(); i++)
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]);
    return dp[nums.size() - 1];
}

// Space-optimized O(1)
int robOptimized(vector<int>& nums) {
    if (nums.empty()) return 0;
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        int current = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

```python
# Tabulation
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, len(nums)):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
    return dp[len(nums) - 1]

# Space-optimized O(1)
def rob_optimized(nums):
    if not nums:
        return 0
    prev2, prev1 = 0, nums[0]
    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    return prev1
```

```java
// Tabulation
static int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    int[] dp = new int[nums.length];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < nums.length; i++)
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    return dp[nums.length - 1];
}

// Space-optimized O(1)
static int robOptimized(int[] nums) {
    if (nums.length == 0) return 0;
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

```go
// Tabulation
func rob(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    if len(nums) == 1 {
        return nums[0]
    }
    dp := make([]int, len(nums))
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i := 2; i < len(nums); i++ {
        dp[i] = max(dp[i-1], dp[i-2]+nums[i])
    }
    return dp[len(nums)-1]
}

// Space-optimized O(1)
func robOptimized(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    prev2, prev1 := 0, nums[0]
    for i := 1; i < len(nums); i++ {
        current := max(prev1, prev2+nums[i])
        prev2 = prev1
        prev1 = current
    }
    return prev1
}
```

### Longest Common Subsequence (LCS)

Length of the longest subsequence common to two strings. If the current characters match, extend the diagonal; otherwise take the better of dropping one character from either string.

```cpp
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length(), n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (text1[i - 1] == text2[j - 1])
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}
```

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
```

```java
static int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (text1.charAt(i - 1) == text2.charAt(j - 1))
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}
```

```go
func longestCommonSubsequence(text1, text2 string) int {
    m, n := len(text1), len(text2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if text1[i-1] == text2[j-1] {
                dp[i][j] = 1 + dp[i-1][j-1]
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }
    return dp[m][n]
}
```

To recover the subsequence itself, keep the full table and backtrack from `(m, n)`:

```cpp
string getLCS(string text1, string text2) {
    int m = text1.length(), n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (text1[i - 1] == text2[j - 1])
                ? 1 + dp[i - 1][j - 1]
                : max(dp[i - 1][j], dp[i][j - 1]);

    string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] == text2[j - 1]) { lcs = text1[i - 1] + lcs; i--; j--; }
        else if (dp[i - 1][j] > dp[i][j - 1]) i--;
        else j--;
    }
    return lcs;
}
```

```python
def get_lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = (1 + dp[i - 1][j - 1]
                        if text1[i - 1] == text2[j - 1]
                        else max(dp[i - 1][j], dp[i][j - 1]))

    lcs = ""
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs = text1[i - 1] + lcs
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return lcs
```

```java
static String getLCS(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (text1.charAt(i - 1) == text2.charAt(j - 1))
                ? 1 + dp[i - 1][j - 1]
                : Math.max(dp[i - 1][j], dp[i][j - 1]);

    StringBuilder lcs = new StringBuilder();
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
            lcs.insert(0, text1.charAt(i - 1)); i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) i--;
        else j--;
    }
    return lcs.toString();
}
```

```go
func getLCS(text1, text2 string) string {
    m, n := len(text1), len(text2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if text1[i-1] == text2[j-1] {
                dp[i][j] = 1 + dp[i-1][j-1]
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }

    var lcs []byte
    i, j := m, n
    for i > 0 && j > 0 {
        if text1[i-1] == text2[j-1] {
            lcs = append(lcs, text1[i-1])
            i--
            j--
        } else if dp[i-1][j] > dp[i][j-1] {
            i--
        } else {
            j--
        }
    }
    for l, r := 0, len(lcs)-1; l < r; l, r = l+1, r-1 { // built back-to-front; reverse
        lcs[l], lcs[r] = lcs[r], lcs[l]
    }
    return string(lcs)
}
```

### Edit Distance (Levenshtein)

Minimum insert/delete/replace operations to turn `word1` into `word2`. Converting to or from the empty string costs the string's length; on a mismatch, take the cheapest of delete, insert, or replace.

```cpp
int minDistance(string word1, string word2) {
    int m = word1.length(), n = word2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // i deletions
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // j insertions
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1[i - 1] == word2[j - 1])
                dp[i][j] = dp[i - 1][j - 1];
            else
                dp[i][j] = 1 + min({dp[i - 1][j],      // delete
                                    dp[i][j - 1],      // insert
                                    dp[i - 1][j - 1]}); // replace
    return dp[m][n];
}
```

```python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i  # i deletions
    for j in range(n + 1):
        dp[0][j] = j  # j insertions
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],       # delete
                                   dp[i][j - 1],        # insert
                                   dp[i - 1][j - 1])    # replace
    return dp[m][n]
```

```java
static int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // i deletions
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // j insertions
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1.charAt(i - 1) == word2.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1];
            else
                dp[i][j] = 1 + Math.min(dp[i - 1][j],           // delete
                               Math.min(dp[i][j - 1],           // insert
                                        dp[i - 1][j - 1]));      // replace
    return dp[m][n];
}
```

```go
func minDistance(word1, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }
    for i := 0; i <= m; i++ {
        dp[i][0] = i // i deletions
    }
    for j := 0; j <= n; j++ {
        dp[0][j] = j // j insertions
    }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if word1[i-1] == word2[j-1] {
                dp[i][j] = dp[i-1][j-1]
            } else {
                dp[i][j] = 1 + min(dp[i-1][j], // delete
                    dp[i][j-1],   // insert
                    dp[i-1][j-1]) // replace
            }
        }
    }
    return dp[m][n]
}
```

Each row depends only on the previous one, so a rolling array cuts space to O(min(m,n)):

```cpp
int minDistanceOptimized(string word1, string word2) {
    if (word1.length() < word2.length()) swap(word1, word2);
    int m = word1.length(), n = word2.length();
    vector<int> prev(n + 1), curr(n + 1);
    for (int j = 0; j <= n; j++) prev[j] = j;
    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        for (int j = 1; j <= n; j++)
            curr[j] = (word1[i - 1] == word2[j - 1])
                ? prev[j - 1]
                : 1 + min({prev[j], curr[j - 1], prev[j - 1]});
        prev = curr;
    }
    return prev[n];
}
```

```python
def min_distance_optimized(word1, word2):
    if len(word1) < len(word2):
        word1, word2 = word2, word1
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))
    curr = [0] * (n + 1)
    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            curr[j] = (prev[j - 1]
                       if word1[i - 1] == word2[j - 1]
                       else 1 + min(prev[j], curr[j - 1], prev[j - 1]))
        prev = curr[:]
    return prev[n]
```

```java
static int minDistanceOptimized(String word1, String word2) {
    if (word1.length() < word2.length()) {
        String tmp = word1; word1 = word2; word2 = tmp;
    }
    int m = word1.length(), n = word2.length();
    int[] prev = new int[n + 1], curr = new int[n + 1];
    for (int j = 0; j <= n; j++) prev[j] = j;
    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        for (int j = 1; j <= n; j++)
            curr[j] = (word1.charAt(i - 1) == word2.charAt(j - 1))
                ? prev[j - 1]
                : 1 + Math.min(prev[j], Math.min(curr[j - 1], prev[j - 1]));
        int[] tmp = prev; prev = curr; curr = tmp;
    }
    return prev[n];
}
```

```go
func minDistanceOptimized(word1, word2 string) int {
    if len(word1) < len(word2) {
        word1, word2 = word2, word1
    }
    m, n := len(word1), len(word2)
    prev := make([]int, n+1)
    curr := make([]int, n+1)
    for j := 0; j <= n; j++ {
        prev[j] = j
    }
    for i := 1; i <= m; i++ {
        curr[0] = i
        for j := 1; j <= n; j++ {
            if word1[i-1] == word2[j-1] {
                curr[j] = prev[j-1]
            } else {
                curr[j] = 1 + min(prev[j], curr[j-1], prev[j-1])
            }
        }
        prev, curr = curr, prev
    }
    return prev[n]
}
```

### Coin Change

Fewest coins to form `amount`; `dp[i]` is the minimum for sub-amount `i`, seeded to an impossible sentinel.

```cpp
// Minimum coins
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);  // sentinel > any real answer
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i)
                dp[i] = min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}

// Count the number of ways to make change
int coinChangeWays(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    for (int coin : coins)          // coins outer loop → combinations, not permutations
        for (int i = coin; i <= amount; i++)
            dp[i] += dp[i - coin];
    return dp[amount];
}
```

```python
# Minimum coins
def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)  # sentinel > any real answer
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return -1 if dp[amount] > amount else dp[amount]

# Count the number of ways to make change
def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:          # coins outer loop -> combinations, not permutations
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]
```

```java
// Minimum coins
static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // sentinel > any real answer
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i)
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}

// Count the number of ways to make change
static int coinChangeWays(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins)          // coins outer loop -> combinations, not permutations
        for (int i = coin; i <= amount; i++)
            dp[i] += dp[i - coin];
    return dp[amount];
}
```

```go
// Minimum coins
func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1 // sentinel > any real answer
    }
    dp[0] = 0
    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if coin <= i {
                dp[i] = min(dp[i], dp[i-coin]+1)
            }
        }
    }
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}

// Count the number of ways to make change
func coinChangeWays(coins []int, amount int) int {
    dp := make([]int, amount+1)
    dp[0] = 1
    for _, coin := range coins { // coins outer loop -> combinations, not permutations
        for i := coin; i <= amount; i++ {
            dp[i] += dp[i-coin]
        }
    }
    return dp[amount]
}
```

### Longest Increasing Subsequence (LIS)

`dp[i]` is the LIS length ending at `i`. The O(n²) DP is direct; a patience-sorting variant with binary search reaches O(n log n).

```cpp
// O(n^2)
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
    return *max_element(dp.begin(), dp.end());
}

// O(n log n): tails[k] = smallest possible tail of an increasing subsequence of length k+1
int lengthOfLISOptimized(vector<int>& nums) {
    vector<int> tails;
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) tails.push_back(num);
        else *it = num;
    }
    return tails.size();
}
```

```python
# O(n^2)
def length_of_lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# O(n log n): tails[k] = smallest possible tail of an increasing subsequence of length k+1
def length_of_lis_optimized(nums):
    import bisect
    tails = []
    for num in nums:
        i = bisect.bisect_left(tails, num)
        if i == len(tails):
            tails.append(num)
        else:
            tails[i] = num
    return len(tails)
```

```java
// O(n^2)
static int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
    int best = 0;
    for (int v : dp) best = Math.max(best, v);
    return best;
}

// O(n log n): tails[k] = smallest possible tail of an increasing subsequence of length k+1
static int lengthOfLISOptimized(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int lo = 0, hi = tails.size();       // lower_bound for num
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails.get(mid) < num) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(num);
        else tails.set(lo, num);
    }
    return tails.size();
}
```

```go
// O(n^2)
func lengthOfLIS(nums []int) int {
    n := len(nums)
    dp := make([]int, n)
    for i := range dp {
        dp[i] = 1
    }
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] {
                dp[i] = max(dp[i], dp[j]+1)
            }
        }
    }
    best := 0
    for _, v := range dp {
        best = max(best, v)
    }
    return best
}

// O(n log n): tails[k] = smallest possible tail of an increasing subsequence of length k+1
func lengthOfLISOptimized(nums []int) int {
    tails := []int{}
    for _, num := range nums {
        i := sort.SearchInts(tails, num) // lower_bound for num
        if i == len(tails) {
            tails = append(tails, num)
        } else {
            tails[i] = num
        }
    }
    return len(tails)
}
```

To reconstruct the subsequence, record a parent index whenever `dp[i]` is extended, then follow parents back from the best endpoint:

```cpp
vector<int> getLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1), parent(n, -1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
    int maxIndex = max_element(dp.begin(), dp.end()) - dp.begin();
    vector<int> lis;
    for (int cur = maxIndex; cur != -1; cur = parent[cur])
        lis.push_back(nums[cur]);
    reverse(lis.begin(), lis.end());
    return lis;
}
```

```python
def get_lis(nums):
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    max_index = max(range(n), key=lambda k: dp[k])
    lis = []
    cur = max_index
    while cur != -1:
        lis.append(nums[cur])
        cur = parent[cur]
    lis.reverse()
    return lis
```

```java
static List<Integer> getLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n], parent = new int[n];
    Arrays.fill(dp, 1);
    Arrays.fill(parent, -1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
    int maxIndex = 0;
    for (int i = 1; i < n; i++)
        if (dp[i] > dp[maxIndex]) maxIndex = i;
    List<Integer> lis = new ArrayList<>();
    for (int cur = maxIndex; cur != -1; cur = parent[cur])
        lis.add(nums[cur]);
    Collections.reverse(lis);
    return lis;
}
```

```go
func getLIS(nums []int) []int {
    n := len(nums)
    dp := make([]int, n)
    parent := make([]int, n)
    for i := range dp {
        dp[i] = 1
        parent[i] = -1
    }
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
                parent[i] = j
            }
        }
    }
    maxIndex := 0
    for i := 1; i < n; i++ {
        if dp[i] > dp[maxIndex] {
            maxIndex = i
        }
    }
    var lis []int
    for cur := maxIndex; cur != -1; cur = parent[cur] {
        lis = append(lis, nums[cur])
    }
    for l, r := 0, len(lis)-1; l < r; l, r = l+1, r-1 {
        lis[l], lis[r] = lis[r], lis[l]
    }
    return lis
}
```

## Two-dimensional DP

### Unique Paths

Count paths from top-left to bottom-right of an `m×n` grid, moving only right or down: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. A rolling row gives O(n) space:

```cpp
int uniquePathsOptimized(int m, int n) {
    vector<int> prev(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            prev[j] += prev[j - 1];   // prev[j] (above) + prev[j-1] (left, already updated)
    return prev[n - 1];
}
```

```python
def unique_paths_optimized(m, n):
    prev = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            prev[j] += prev[j - 1]   # prev[j] (above) + prev[j-1] (left, already updated)
    return prev[n - 1]
```

```java
static int uniquePathsOptimized(int m, int n) {
    int[] prev = new int[n];
    Arrays.fill(prev, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            prev[j] += prev[j - 1];   // prev[j] (above) + prev[j-1] (left, already updated)
    return prev[n - 1];
}
```

```go
func uniquePathsOptimized(m, n int) int {
    prev := make([]int, n)
    for i := range prev {
        prev[i] = 1
    }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            prev[j] += prev[j-1] // prev[j] (above) + prev[j-1] (left, already updated)
        }
    }
    return prev[n-1]
}
```

With obstacles, a blocked cell contributes zero paths:

```cpp
int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
    int m = obstacleGrid.size(), n = obstacleGrid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;
    for (int i = 1; i < m; i++)
        dp[i][0] = (obstacleGrid[i][0] == 0 && dp[i - 1][0] == 1) ? 1 : 0;
    for (int j = 1; j < n; j++)
        dp[0][j] = (obstacleGrid[0][j] == 0 && dp[0][j - 1] == 1) ? 1 : 0;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (obstacleGrid[i][j] == 0)
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    return dp[m - 1][n - 1];
}
```

```python
def unique_paths_with_obstacles(obstacle_grid):
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1 if obstacle_grid[0][0] == 0 else 0
    for i in range(1, m):
        dp[i][0] = 1 if (obstacle_grid[i][0] == 0 and dp[i - 1][0] == 1) else 0
    for j in range(1, n):
        dp[0][j] = 1 if (obstacle_grid[0][j] == 0 and dp[0][j - 1] == 1) else 0
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[m - 1][n - 1]
```

```java
static int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length, n = obstacleGrid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;
    for (int i = 1; i < m; i++)
        dp[i][0] = (obstacleGrid[i][0] == 0 && dp[i - 1][0] == 1) ? 1 : 0;
    for (int j = 1; j < n; j++)
        dp[0][j] = (obstacleGrid[0][j] == 0 && dp[0][j - 1] == 1) ? 1 : 0;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (obstacleGrid[i][j] == 0)
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    return dp[m - 1][n - 1];
}
```

```go
func uniquePathsWithObstacles(obstacleGrid [][]int) int {
    m, n := len(obstacleGrid), len(obstacleGrid[0])
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    if obstacleGrid[0][0] == 0 {
        dp[0][0] = 1
    }
    for i := 1; i < m; i++ {
        if obstacleGrid[i][0] == 0 && dp[i-1][0] == 1 {
            dp[i][0] = 1
        }
    }
    for j := 1; j < n; j++ {
        if obstacleGrid[0][j] == 0 && dp[0][j-1] == 1 {
            dp[0][j] = 1
        }
    }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            if obstacleGrid[i][j] == 0 {
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
            }
        }
    }
    return dp[m-1][n-1]
}
```

### Minimum Path Sum in a Triangle

Minimum root-to-bottom path sum, filled from the bottom row up. The rolling-array version reuses the last row in place:

```cpp
int minimumTotalOptimized(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp(triangle[n - 1]);           // start from the bottom row
    for (int i = n - 2; i >= 0; i--)
        for (int j = 0; j <= i; j++)
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);
    return dp[0];
}
```

```python
def minimum_total_optimized(triangle):
    n = len(triangle)
    dp = list(triangle[n - 1])           # start from the bottom row
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    return dp[0]
```

```java
static int minimumTotalOptimized(List<List<Integer>> triangle) {
    int n = triangle.size();
    int[] dp = new int[n];
    for (int j = 0; j < n; j++) dp[j] = triangle.get(n - 1).get(j);  // start from the bottom row
    for (int i = n - 2; i >= 0; i--)
        for (int j = 0; j <= i; j++)
            dp[j] = triangle.get(i).get(j) + Math.min(dp[j], dp[j + 1]);
    return dp[0];
}
```

```go
func minimumTotalOptimized(triangle [][]int) int {
    n := len(triangle)
    dp := make([]int, n)
    copy(dp, triangle[n-1]) // start from the bottom row
    for i := n - 2; i >= 0; i-- {
        for j := 0; j <= i; j++ {
            dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
        }
    }
    return dp[0]
}
```

## Two more classics: palindromes and word break

**Longest Palindromic Subsequence.** `dp[i][j]` is the longest palindromic subsequence of `s[i..j]`, filled by increasing length; matching ends add 2 to the inner range. The rolling-array form uses O(n) space:

```cpp
int longestPalindromeSubseqOptimized(string s) {
    int n = s.length();
    vector<int> prev(n, 0), curr(n, 0);
    for (int i = n - 1; i >= 0; i--) {
        curr[i] = 1;                                // single character
        for (int j = i + 1; j < n; j++)
            curr[j] = (s[i] == s[j]) ? 2 + prev[j - 1]
                                     : max(prev[j], curr[j - 1]);
        prev = curr;
    }
    return curr[n - 1];
}
```

```python
def longest_palindrome_subseq_optimized(s):
    n = len(s)
    prev = [0] * n
    curr = [0] * n
    for i in range(n - 1, -1, -1):
        curr[i] = 1                                 # single character
        for j in range(i + 1, n):
            curr[j] = (2 + prev[j - 1] if s[i] == s[j]
                       else max(prev[j], curr[j - 1]))
        prev = curr[:]
    return curr[n - 1]
```

```java
static int longestPalindromeSubseqOptimized(String s) {
    int n = s.length();
    int[] prev = new int[n], curr = new int[n];
    for (int i = n - 1; i >= 0; i--) {
        curr[i] = 1;                                // single character
        for (int j = i + 1; j < n; j++)
            curr[j] = (s.charAt(i) == s.charAt(j)) ? 2 + prev[j - 1]
                                                   : Math.max(prev[j], curr[j - 1]);
        prev = curr.clone();
    }
    return curr[n - 1];
}
```

```go
func longestPalindromeSubseqOptimized(s string) int {
    n := len(s)
    prev := make([]int, n)
    curr := make([]int, n)
    for i := n - 1; i >= 0; i-- {
        curr[i] = 1 // single character
        for j := i + 1; j < n; j++ {
            if s[i] == s[j] {
                curr[j] = 2 + prev[j-1]
            } else {
                curr[j] = max(prev[j], curr[j-1])
            }
        }
        copy(prev, curr)
    }
    return curr[n-1]
}
```

**Word Break.** Can `s` be segmented into dictionary words? `dp[i]` is true if `s[0..i-1]` is segmentable:

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    int n = s.length();
    unordered_set<string> words(wordDict.begin(), wordDict.end());
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && words.count(s.substr(j, i - j))) { dp[i] = true; break; }
    return dp[n];
}
```

```python
def word_break(s, word_dict):
    n = len(s)
    words = set(word_dict)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]
```

```java
static boolean wordBreak(String s, List<String> wordDict) {
    int n = s.length();
    Set<String> words = new HashSet<>(wordDict);
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && words.contains(s.substring(j, i))) { dp[i] = true; break; }
    return dp[n];
}
```

```go
func wordBreak(s string, wordDict []string) bool {
    n := len(s)
    words := make(map[string]bool)
    for _, w := range wordDict {
        words[w] = true
    }
    dp := make([]bool, n+1)
    dp[0] = true
    for i := 1; i <= n; i++ {
        for j := 0; j < i; j++ {
            if dp[j] && words[s[j:i]] {
                dp[i] = true
                break
            }
        }
    }
    return dp[n]
}
```

## Knapsack variants

The 0/1 knapsack — each item used at most once — is the mental model for most DP: at each item, take it or skip it. Its 1D optimization iterates capacity **backwards** so an item can't be reused within its own pass:

```cpp
// 0/1 Knapsack, O(capacity) space
int knapsackOptimized(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    for (int i = 0; i < (int)weights.size(); i++)
        for (int w = capacity; w >= weights[i]; w--)   // backwards → 0/1 semantics
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}
```

```python
# 0/1 Knapsack, O(capacity) space
def knapsack_optimized(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for i in range(len(weights)):
        for w in range(capacity, weights[i] - 1, -1):   # backwards -> 0/1 semantics
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
```

```java
// 0/1 Knapsack, O(capacity) space
static int knapsackOptimized(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++)
        for (int w = capacity; w >= weights[i]; w--)   // backwards -> 0/1 semantics
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}
```

```go
// 0/1 Knapsack, O(capacity) space
func knapsackOptimized(weights, values []int, capacity int) int {
    dp := make([]int, capacity+1)
    for i := 0; i < len(weights); i++ {
        for w := capacity; w >= weights[i]; w-- { // backwards -> 0/1 semantics
            dp[w] = max(dp[w], dp[w-weights[i]]+values[i])
        }
    }
    return dp[capacity]
}
```

**Unbounded knapsack** allows unlimited copies; the capacity loop runs **forward**, so an item's own updated value can be reused:

```cpp
int unboundedKnapsack(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    for (int w = 1; w <= capacity; w++)
        for (int i = 0; i < (int)weights.size(); i++)
            if (weights[i] <= w)
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}
```

```python
def unbounded_knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
```

```java
static int unboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int w = 1; w <= capacity; w++)
        for (int i = 0; i < weights.length; i++)
            if (weights[i] <= w)
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}
```

```go
func unboundedKnapsack(weights, values []int, capacity int) int {
    dp := make([]int, capacity+1)
    for w := 1; w <= capacity; w++ {
        for i := 0; i < len(weights); i++ {
            if weights[i] <= w {
                dp[w] = max(dp[w], dp[w-weights[i]]+values[i])
            }
        }
    }
    return dp[capacity]
}
```

**Subset Sum** — is there a subset summing to `target`? — is the boolean specialization of 0/1 knapsack:

```cpp
bool subsetSum(vector<int>& nums, int target) {
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums)
        for (int j = target; j >= num; j--)   // backwards → each item once
            dp[j] = dp[j] || dp[j - num];
    return dp[target];
}
```

```python
def subset_sum(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):   # backwards -> each item once
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
```

```java
static boolean subsetSum(int[] nums, int target) {
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums)
        for (int j = target; j >= num; j--)   // backwards -> each item once
            dp[j] = dp[j] || dp[j - num];
    return dp[target];
}
```

```go
func subsetSum(nums []int, target int) bool {
    dp := make([]bool, target+1)
    dp[0] = true
    for _, num := range nums {
        for j := target; j >= num; j-- { // backwards -> each item once
            dp[j] = dp[j] || dp[j-num]
        }
    }
    return dp[target]
}
```

That single forward-vs-backward line is the entire difference between unbounded and 0/1 semantics. (Fractional knapsack, by contrast, is solved greedily, not by DP — [Chapter 16](16-greedy-algorithms.md).)

## Backtracking with memoization

Backtracking ([Chapter 8](08-recursion-and-backtracking.md)) explores solutions incrementally and abandons partial ones that can't be completed. When the same *state* — not the same path — recurs, memoization turns its exponential search into polynomial DP. The whole art is a state key that captures everything relevant to the remaining decisions and nothing more, so distinct paths reaching the same state share a cached result. Subset Sum is the clean example: the state is `(index, target)`, and both the include and exclude branches recurse into strictly smaller states.

```cpp
class SubsetSumSolver {
    vector<int> numbers;
    unordered_map<string, bool> memo;   // key = "index,target"

    bool canMakeSumMemo(int index, int target) {
        if (target == 0) return true;
        if (index >= (int)numbers.size() || target < 0) return false;

        string key = to_string(index) + "," + to_string(target);
        auto it = memo.find(key);
        if (it != memo.end()) return it->second;

        bool result = canMakeSumMemo(index + 1, target - numbers[index]) // include
                   || canMakeSumMemo(index + 1, target);                 // exclude
        memo[key] = result;
        return result;
    }
public:
    SubsetSumSolver(const vector<int>& nums) : numbers(nums) {}
    bool canMakeSum(int target) { return canMakeSumMemo(0, target); }
};
```

```python
class SubsetSumSolver:
    def __init__(self, nums):
        self.numbers = nums
        self.memo = {}                       # key = (index, target)

    def _can_make_sum_memo(self, index, target):
        if target == 0:
            return True
        if index >= len(self.numbers) or target < 0:
            return False

        key = (index, target)
        if key in self.memo:
            return self.memo[key]

        result = (self._can_make_sum_memo(index + 1, target - self.numbers[index])  # include
                  or self._can_make_sum_memo(index + 1, target))                    # exclude
        self.memo[key] = result
        return result

    def can_make_sum(self, target):
        return self._can_make_sum_memo(0, target)
```

```java
class SubsetSumSolver {
    private final int[] numbers;
    private final Map<String, Boolean> memo = new HashMap<>();   // key = "index,target"

    SubsetSumSolver(int[] nums) { numbers = nums; }

    private boolean canMakeSumMemo(int index, int target) {
        if (target == 0) return true;
        if (index >= numbers.length || target < 0) return false;

        String key = index + "," + target;
        Boolean cached = memo.get(key);
        if (cached != null) return cached;

        boolean result = canMakeSumMemo(index + 1, target - numbers[index]) // include
                      || canMakeSumMemo(index + 1, target);                 // exclude
        memo.put(key, result);
        return result;
    }

    boolean canMakeSum(int target) { return canMakeSumMemo(0, target); }
}
```

```go
type SubsetSumSolver struct {
    numbers []int
    memo    map[[2]int]bool // key = {index, target}
}

func NewSubsetSumSolver(nums []int) *SubsetSumSolver {
    return &SubsetSumSolver{numbers: nums, memo: make(map[[2]int]bool)}
}

func (s *SubsetSumSolver) canMakeSumMemo(index, target int) bool {
    if target == 0 {
        return true
    }
    if index >= len(s.numbers) || target < 0 {
        return false
    }
    key := [2]int{index, target}
    if v, ok := s.memo[key]; ok {
        return v
    }
    result := s.canMakeSumMemo(index+1, target-s.numbers[index]) || // include
        s.canMakeSumMemo(index+1, target) // exclude
    s.memo[key] = result
    return result
}

func (s *SubsetSumSolver) CanMakeSum(target int) bool {
    return s.canMakeSumMemo(0, target)
}
```

The same shape extends to multiple constraints — a 3D knapsack keys its memo on `(index, remainingWeight, remainingVolume)`:

```cpp
class Knapsack3D {
    unordered_map<string, int> memo;
    string key(int i, int w, int v) {
        return to_string(i) + "," + to_string(w) + "," + to_string(v);
    }
    int solve(int index, int w, int v, const vector<int>& wt,
              const vector<int>& val, const vector<int>& vol) {
        if (index >= (int)wt.size() || w < 0 || v < 0) return 0;
        string k = key(index, w, v);
        auto it = memo.find(k);
        if (it != memo.end()) return it->second;

        int notTake = solve(index + 1, w, v, wt, val, vol);
        int take = 0;
        if (wt[index] <= w && vol[index] <= v)
            take = val[index] + solve(index + 1, w - wt[index], v - vol[index], wt, val, vol);

        return memo[k] = max(notTake, take);
    }
public:
    int knapsack(vector<int>& wt, vector<int>& val, vector<int>& vol, int maxW, int maxV) {
        return solve(0, maxW, maxV, wt, val, vol);
    }
};
```

```python
class Knapsack3D:
    def __init__(self):
        self.memo = {}

    def _solve(self, index, w, v, wt, val, vol):
        if index >= len(wt) or w < 0 or v < 0:
            return 0
        key = (index, w, v)
        if key in self.memo:
            return self.memo[key]

        not_take = self._solve(index + 1, w, v, wt, val, vol)
        take = 0
        if wt[index] <= w and vol[index] <= v:
            take = val[index] + self._solve(index + 1, w - wt[index], v - vol[index],
                                            wt, val, vol)

        self.memo[key] = max(not_take, take)
        return self.memo[key]

    def knapsack(self, wt, val, vol, max_w, max_v):
        return self._solve(0, max_w, max_v, wt, val, vol)
```

```java
class Knapsack3D {
    private final Map<String, Integer> memo = new HashMap<>();

    private int solve(int index, int w, int v, int[] wt, int[] val, int[] vol) {
        if (index >= wt.length || w < 0 || v < 0) return 0;
        String key = index + "," + w + "," + v;
        Integer cached = memo.get(key);
        if (cached != null) return cached;

        int notTake = solve(index + 1, w, v, wt, val, vol);
        int take = 0;
        if (wt[index] <= w && vol[index] <= v)
            take = val[index] + solve(index + 1, w - wt[index], v - vol[index], wt, val, vol);

        int result = Math.max(notTake, take);
        memo.put(key, result);
        return result;
    }

    int knapsack(int[] wt, int[] val, int[] vol, int maxW, int maxV) {
        return solve(0, maxW, maxV, wt, val, vol);
    }
}
```

```go
type Knapsack3D struct {
    memo map[[3]int]int
}

func NewKnapsack3D() *Knapsack3D {
    return &Knapsack3D{memo: make(map[[3]int]int)}
}

func (k *Knapsack3D) solve(index, w, v int, wt, val, vol []int) int {
    if index >= len(wt) || w < 0 || v < 0 {
        return 0
    }
    key := [3]int{index, w, v}
    if cached, ok := k.memo[key]; ok {
        return cached
    }
    notTake := k.solve(index+1, w, v, wt, val, vol)
    take := 0
    if wt[index] <= w && vol[index] <= v {
        take = val[index] + k.solve(index+1, w-wt[index], v-vol[index], wt, val, vol)
    }
    k.memo[key] = max(notTake, take)
    return k.memo[key]
}

func (k *Knapsack3D) Knapsack(wt, val, vol []int, maxW, maxV int) int {
    return k.solve(0, maxW, maxV, wt, val, vol)
}
```

The lesson is state design, not backtracking mechanics: a good key collapses the search space, while a key that encodes an entire path (a full board layout, say) never repeats and so memoizes nothing.

## Ten must-know DP patterns

Most DP interview problems are variations on a handful of patterns. Recognize the pattern and you have the recurrence; the recurrence hands you the code. Each below gives its signal words and a representative implementation.

### Pattern 1: 1D DP (Linear)

The answer at position `i` depends on a constant number of earlier positions. Signal words: "ways to reach", "max/min up to `i`". Time O(n), space O(n) or O(1). Climbing Stairs (`dp[i]=dp[i-1]+dp[i-2]`) and House Robber (`dp[i]=max(dp[i-1], dp[i-2]+nums[i])`), both in [Classic DP problems](#classic-dp-problems), are the canonical cases.

### Pattern 2: 2D Grid DP

`dp[i][j]` depends on adjacent cells, usually top and left. Signal words: "grid", "matrix", "path". Time O(m×n), space O(m×n) or O(min(m,n)).

```cpp
// LeetCode 64: Minimum Path Sum
int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n));
    dp[0][0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1]);
    return dp[m - 1][n - 1];
}
```

```python
# LeetCode 64: Minimum Path Sum
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
    return dp[m - 1][n - 1]
```

```java
// LeetCode 64: Minimum Path Sum
static int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
    return dp[m - 1][n - 1];
}
```

```go
// LeetCode 64: Minimum Path Sum
func minPathSum(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    dp[0][0] = grid[0][0]
    for j := 1; j < n; j++ {
        dp[0][j] = dp[0][j-1] + grid[0][j]
    }
    for i := 1; i < m; i++ {
        dp[i][0] = dp[i-1][0] + grid[i][0]
    }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
        }
    }
    return dp[m-1][n-1]
}
```

### Pattern 3: Knapsack (Pick or Skip)

At each item, decide take or skip. Signal words: "subset", "partition", "can you make sum X". The 1D optimization iterates capacity **backwards** for 0/1 semantics ([Knapsack variants](#knapsack-variants)).

```cpp
// LeetCode 416: Partition Equal Subset Sum (subset sum to totalSum/2)
bool canPartition(vector<int>& nums) {
    int totalSum = accumulate(nums.begin(), nums.end(), 0);
    if (totalSum % 2 != 0) return false;
    int target = totalSum / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums)
        for (int sum = target; sum >= num; sum--)
            dp[sum] = dp[sum] || dp[sum - num];
    return dp[target];
}
```

```python
# LeetCode 416: Partition Equal Subset Sum (subset sum to total_sum/2)
def can_partition(nums):
    total_sum = sum(nums)
    if total_sum % 2 != 0:
        return False
    target = total_sum // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    return dp[target]
```

```java
// LeetCode 416: Partition Equal Subset Sum (subset sum to totalSum/2)
static boolean canPartition(int[] nums) {
    int totalSum = 0;
    for (int num : nums) totalSum += num;
    if (totalSum % 2 != 0) return false;
    int target = totalSum / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums)
        for (int sum = target; sum >= num; sum--)
            dp[sum] = dp[sum] || dp[sum - num];
    return dp[target];
}
```

```go
// LeetCode 416: Partition Equal Subset Sum (subset sum to totalSum/2)
func canPartition(nums []int) bool {
    totalSum := 0
    for _, num := range nums {
        totalSum += num
    }
    if totalSum%2 != 0 {
        return false
    }
    target := totalSum / 2
    dp := make([]bool, target+1)
    dp[0] = true
    for _, num := range nums {
        for sum := target; sum >= num; sum-- {
            dp[sum] = dp[sum] || dp[sum-num]
        }
    }
    return dp[target]
}
```

### Pattern 4: Longest Subsequence / Subarray

Compare the current element against earlier ones to extend a run. Signal words: "longest", "increasing", "common". One sequence → 1D (LIS, O(n²) or O(n log n)); two sequences → 2D (LCS, O(m×n)). Both are in [Classic DP problems](#classic-dp-problems).

### Pattern 5: Interval DP

Solve small ranges and combine them into larger ones, iterating by interval **length**. Signal words: "range", "split", "parenthesize". Usually O(n³).

```cpp
// LeetCode 312: Burst Balloons — dp[i][j] over balloon k burst LAST in [i,j]
int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> balloons(n + 2, 1);
    for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];
    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
    for (int len = 1; len <= n; len++)
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            for (int k = i; k <= j; k++) {
                int coins = balloons[i - 1] * balloons[k] * balloons[j + 1]
                          + dp[i][k - 1] + dp[k + 1][j];
                dp[i][j] = max(dp[i][j], coins);
            }
        }
    return dp[1][n];
}
```

```python
# LeetCode 312: Burst Balloons -- dp[i][j] over balloon k burst LAST in [i,j]
def max_coins(nums):
    n = len(nums)
    balloons = [1] * (n + 2)
    for i in range(n):
        balloons[i + 1] = nums[i]
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    for length in range(1, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            for k in range(i, j + 1):
                coins = (balloons[i - 1] * balloons[k] * balloons[j + 1]
                         + dp[i][k - 1] + dp[k + 1][j])
                dp[i][j] = max(dp[i][j], coins)
    return dp[1][n]
```

```java
// LeetCode 312: Burst Balloons -- dp[i][j] over balloon k burst LAST in [i,j]
static int maxCoins(int[] nums) {
    int n = nums.length;
    int[] balloons = new int[n + 2];
    Arrays.fill(balloons, 1);
    for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];
    int[][] dp = new int[n + 2][n + 2];
    for (int len = 1; len <= n; len++)
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            for (int k = i; k <= j; k++) {
                int coins = balloons[i - 1] * balloons[k] * balloons[j + 1]
                          + dp[i][k - 1] + dp[k + 1][j];
                dp[i][j] = Math.max(dp[i][j], coins);
            }
        }
    return dp[1][n];
}
```

```go
// LeetCode 312: Burst Balloons -- dp[i][j] over balloon k burst LAST in [i,j]
func maxCoins(nums []int) int {
    n := len(nums)
    balloons := make([]int, n+2)
    for i := range balloons {
        balloons[i] = 1
    }
    for i := 0; i < n; i++ {
        balloons[i+1] = nums[i]
    }
    dp := make([][]int, n+2)
    for i := range dp {
        dp[i] = make([]int, n+2)
    }
    for length := 1; length <= n; length++ {
        for i := 1; i <= n-length+1; i++ {
            j := i + length - 1
            for k := i; k <= j; k++ {
                coins := balloons[i-1]*balloons[k]*balloons[j+1] +
                    dp[i][k-1] + dp[k+1][j]
                dp[i][j] = max(dp[i][j], coins)
            }
        }
    }
    return dp[1][n]
}
```

Matrix Chain Multiplication shares the structure — `dp[i][j]` is the minimum scalar multiplications to multiply matrices `i..j`:

```cpp
int matrixChainOrder(vector<int>& p) {   // p.size() == numMatrices + 1
    int n = p.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++)
                dp[i][j] = min(dp[i][j],
                               dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
        }
    return dp[0][n - 1];
}
```

```python
def matrix_chain_order(p):   # len(p) == num_matrices + 1
    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                dp[i][j] = min(dp[i][j],
                               dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1])
    return dp[0][n - 1]
```

```java
static int matrixChainOrder(int[] p) {   // p.length == numMatrices + 1
    int n = p.length - 1;
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++)
                dp[i][j] = Math.min(dp[i][j],
                                    dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
        }
    return dp[0][n - 1];
}
```

```go
func matrixChainOrder(p []int) int { // len(p) == numMatrices + 1
    n := len(p) - 1
    dp := make([][]int, n)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    for length := 2; length <= n; length++ {
        for i := 0; i+length-1 < n; i++ {
            j := i + length - 1
            dp[i][j] = math.MaxInt
            for k := i; k < j; k++ {
                dp[i][j] = min(dp[i][j],
                    dp[i][k]+dp[k+1][j]+p[i]*p[k+1]*p[j+1])
            }
        }
    }
    return dp[0][n-1]
}
```

### Pattern 6: DP on Strings

Two indices `dp[i][j]` compare two strings, deciding to match or apply an edit. Signal words: "edit", "match", "transform". Time O(m×n). Edit Distance is in [Classic DP problems](#classic-dp-problems); regular-expression matching is the same idea with `.`/`*` transitions:

```cpp
// LeetCode 10: Regular Expression Matching
bool isMatch(string s, string p) {
    int m = s.length(), n = p.length();
    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)                 // patterns like a*, a*b* matching ""
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (p[j - 1] == '*') {
                dp[i][j] = dp[i][j - 2];         // '*' matches zero of preceding
                if (p[j - 2] == '.' || p[j - 2] == s[i - 1])
                    dp[i][j] = dp[i][j] || dp[i - 1][j];  // or one/more
            } else if (p[j - 1] == '.' || p[j - 1] == s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    return dp[m][n];
}
```

```python
# LeetCode 10: Regular Expression Matching
def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):                 # patterns like a*, a*b* matching ""
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]        # '*' matches zero of preceding
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]  # or one/more
            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]
```

```java
// LeetCode 10: Regular Expression Matching
static boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)                 // patterns like a*, a*b* matching ""
        if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[i][j] = dp[i][j - 2];         // '*' matches zero of preceding
                if (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1))
                    dp[i][j] = dp[i][j] || dp[i - 1][j];  // or one/more
            } else if (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    return dp[m][n];
}
```

```go
// LeetCode 10: Regular Expression Matching
func isMatch(s, p string) bool {
    m, n := len(s), len(p)
    dp := make([][]bool, m+1)
    for i := range dp {
        dp[i] = make([]bool, n+1)
    }
    dp[0][0] = true
    for j := 2; j <= n; j++ { // patterns like a*, a*b* matching ""
        if p[j-1] == '*' {
            dp[0][j] = dp[0][j-2]
        }
    }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if p[j-1] == '*' {
                dp[i][j] = dp[i][j-2] // '*' matches zero of preceding
                if p[j-2] == '.' || p[j-2] == s[i-1] {
                    dp[i][j] = dp[i][j] || dp[i-1][j] // or one/more
                }
            } else if p[j-1] == '.' || p[j-1] == s[i-1] {
                dp[i][j] = dp[i-1][j-1]
            }
        }
    }
    return dp[m][n]
}
```

### Pattern 7: DP on Trees

Post-order DFS returns DP values from children that the parent combines. Signal words: "tree", "subtree". Time O(n), space O(h). House Robber III returns `{rob, notRob}` per node:

```cpp
struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x): val(x), left(nullptr), right(nullptr) {} };

pair<int,int> robHelper(TreeNode* root) {          // {rob this node, don't rob this node}
    if (!root) return {0, 0};
    auto l = robHelper(root->left);
    auto r = robHelper(root->right);
    int rob = root->val + l.second + r.second;      // rob node → children must be skipped
    int notRob = max(l.first, l.second) + max(r.first, r.second);
    return {rob, notRob};
}
int rob(TreeNode* root) {
    auto res = robHelper(root);
    return max(res.first, res.second);
}
```

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

def rob_helper(root):                              # (rob this node, don't rob this node)
    if not root:
        return (0, 0)
    l = rob_helper(root.left)
    r = rob_helper(root.right)
    rob = root.val + l[1] + r[1]                   # rob node -> children must be skipped
    not_rob = max(l[0], l[1]) + max(r[0], r[1])
    return (rob, not_rob)

def rob(root):
    res = rob_helper(root)
    return max(res[0], res[1])
```

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

static int[] robHelper(TreeNode root) {          // {rob this node, don't rob this node}
    if (root == null) return new int[]{0, 0};
    int[] l = robHelper(root.left);
    int[] r = robHelper(root.right);
    int rob = root.val + l[1] + r[1];             // rob node -> children must be skipped
    int notRob = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
    return new int[]{rob, notRob};
}

static int rob(TreeNode root) {
    int[] res = robHelper(root);
    return Math.max(res[0], res[1]);
}
```

```go
type TreeNode struct {
    Val         int
    Left, Right *TreeNode
}

func robHelper(root *TreeNode) (int, int) { // (rob this node, don't rob this node)
    if root == nil {
        return 0, 0
    }
    lRob, lNot := robHelper(root.Left)
    rRob, rNot := robHelper(root.Right)
    rob := root.Val + lNot + rNot // rob node -> children must be skipped
    notRob := max(lRob, lNot) + max(rRob, rNot)
    return rob, notRob
}

func rob(root *TreeNode) int {
    r, notR := robHelper(root)
    return max(r, notR)
}
```

### Pattern 8: DP on Graphs (DAG)

On a directed acyclic graph, process nodes in topological order and relax edges. Signal words: "DAG", "topological", "prerequisites". Time O(V+E).

```cpp
// Longest path from a source in a weighted DAG
vector<int> longestPathDAG(int n, vector<vector<pair<int,int>>>& graph, int source) {
    vector<int> inDeg(n, 0);
    for (int u = 0; u < n; u++)
        for (auto [v, w] : graph[u]) inDeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (inDeg[i] == 0) q.push(i);
    vector<int> topo;
    while (!q.empty()) {
        int u = q.front(); q.pop(); topo.push_back(u);
        for (auto [v, w] : graph[u]) if (--inDeg[v] == 0) q.push(v);
    }
    vector<int> dp(n, INT_MIN);
    dp[source] = 0;
    for (int u : topo)
        if (dp[u] != INT_MIN)
            for (auto [v, w] : graph[u])
                dp[v] = max(dp[v], dp[u] + w);
    return dp;
}
```

```python
# Longest path from a source in a weighted DAG
from collections import deque

def longest_path_dag(n, graph, source):
    in_deg = [0] * n
    for u in range(n):
        for v, w in graph[u]:
            in_deg[v] += 1
    q = deque(i for i in range(n) if in_deg[i] == 0)
    topo = []
    while q:
        u = q.popleft()
        topo.append(u)
        for v, w in graph[u]:
            in_deg[v] -= 1
            if in_deg[v] == 0:
                q.append(v)
    dp = [float('-inf')] * n
    dp[source] = 0
    for u in topo:
        if dp[u] != float('-inf'):
            for v, w in graph[u]:
                dp[v] = max(dp[v], dp[u] + w)
    return dp
```

```java
// Longest path from a source in a weighted DAG
static int[] longestPathDAG(int n, List<List<int[]>> graph, int source) {
    int[] inDeg = new int[n];
    for (int u = 0; u < n; u++)
        for (int[] e : graph.get(u)) inDeg[e[0]]++;    // e = {v, w}
    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (inDeg[i] == 0) queue.add(i);
    List<Integer> topo = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        topo.add(u);
        for (int[] e : graph.get(u)) if (--inDeg[e[0]] == 0) queue.add(e[0]);
    }
    int[] dp = new int[n];
    Arrays.fill(dp, Integer.MIN_VALUE);
    dp[source] = 0;
    for (int u : topo)
        if (dp[u] != Integer.MIN_VALUE)
            for (int[] e : graph.get(u))
                dp[e[0]] = Math.max(dp[e[0]], dp[u] + e[1]);
    return dp;
}
```

```go
// Longest path from a source in a weighted DAG
func longestPathDAG(n int, graph [][][2]int, source int) []int {
    inDeg := make([]int, n)
    for u := 0; u < n; u++ {
        for _, e := range graph[u] { // e = {v, w}
            inDeg[e[0]]++
        }
    }
    var queue []int
    for i := 0; i < n; i++ {
        if inDeg[i] == 0 {
            queue = append(queue, i)
        }
    }
    var topo []int
    for len(queue) > 0 {
        u := queue[0]
        queue = queue[1:]
        topo = append(topo, u)
        for _, e := range graph[u] {
            inDeg[e[0]]--
            if inDeg[e[0]] == 0 {
                queue = append(queue, e[0])
            }
        }
    }
    dp := make([]int, n)
    for i := range dp {
        dp[i] = math.MinInt
    }
    dp[source] = 0
    for _, u := range topo {
        if dp[u] != math.MinInt {
            for _, e := range graph[u] {
                dp[e[0]] = max(dp[e[0]], dp[u]+e[1])
            }
        }
    }
    return dp
}
```

### Pattern 9: Bitmask DP

Encode a set of elements as the bits of an integer. Signal words: "subset", "visited", "all cities". Time typically O(2ⁿ·n), space O(2ⁿ). The Traveling Salesman Problem keys on `dp[mask][last]` = min cost to have visited `mask`, ending at `last`:

```cpp
int tsp(vector<vector<int>>& dist) {
    int n = dist.size(), maskLimit = 1 << n;
    vector<vector<int>> dp(maskLimit, vector<int>(n, INT_MAX));
    dp[1][0] = 0;                                   // start at city 0
    for (int mask = 1; mask < maskLimit; mask++)
        for (int last = 0; last < n; last++) {
            if (!(mask & (1 << last)) || dp[mask][last] == INT_MAX) continue;
            for (int next = 0; next < n; next++) {
                if (mask & (1 << next)) continue;
                int nm = mask | (1 << next);
                dp[nm][next] = min(dp[nm][next], dp[mask][last] + dist[last][next]);
            }
        }
    int result = INT_MAX, full = maskLimit - 1;
    for (int last = 1; last < n; last++)
        if (dp[full][last] != INT_MAX)
            result = min(result, dp[full][last] + dist[last][0]);
    return result;
}
```

```python
def tsp(dist):
    n = len(dist)
    mask_limit = 1 << n
    INF = float('inf')
    dp = [[INF] * n for _ in range(mask_limit)]
    dp[1][0] = 0                                    # start at city 0
    for mask in range(1, mask_limit):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == INF:
                continue
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                nm = mask | (1 << nxt)
                dp[nm][nxt] = min(dp[nm][nxt], dp[mask][last] + dist[last][nxt])
    result = INF
    full = mask_limit - 1
    for last in range(1, n):
        if dp[full][last] != INF:
            result = min(result, dp[full][last] + dist[last][0])
    return result
```

```java
static int tsp(int[][] dist) {
    int n = dist.length, maskLimit = 1 << n;
    int[][] dp = new int[maskLimit][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0;                                   // start at city 0
    for (int mask = 1; mask < maskLimit; mask++)
        for (int last = 0; last < n; last++) {
            if ((mask & (1 << last)) == 0 || dp[mask][last] == Integer.MAX_VALUE) continue;
            for (int next = 0; next < n; next++) {
                if ((mask & (1 << next)) != 0) continue;
                int nm = mask | (1 << next);
                dp[nm][next] = Math.min(dp[nm][next], dp[mask][last] + dist[last][next]);
            }
        }
    int result = Integer.MAX_VALUE, full = maskLimit - 1;
    for (int last = 1; last < n; last++)
        if (dp[full][last] != Integer.MAX_VALUE)
            result = Math.min(result, dp[full][last] + dist[last][0]);
    return result;
}
```

```go
func tsp(dist [][]int) int {
    n := len(dist)
    maskLimit := 1 << n
    dp := make([][]int, maskLimit)
    for i := range dp {
        dp[i] = make([]int, n)
        for j := range dp[i] {
            dp[i][j] = math.MaxInt
        }
    }
    dp[1][0] = 0 // start at city 0
    for mask := 1; mask < maskLimit; mask++ {
        for last := 0; last < n; last++ {
            if mask&(1<<last) == 0 || dp[mask][last] == math.MaxInt {
                continue
            }
            for next := 0; next < n; next++ {
                if mask&(1<<next) != 0 {
                    continue
                }
                nm := mask | (1 << next)
                dp[nm][next] = min(dp[nm][next], dp[mask][last]+dist[last][next])
            }
        }
    }
    result, full := math.MaxInt, maskLimit-1
    for last := 1; last < n; last++ {
        if dp[full][last] != math.MaxInt {
            result = min(result, dp[full][last]+dist[last][0])
        }
    }
    return result
}
```

### Pattern 10: State Machine DP

Track discrete states (holding/not holding, transactions used) and their transitions. Signal words: "buy/sell", "hold", "cooldown". The stock-with-cooldown problem cycles through hold → sold → rest:

```cpp
// LeetCode 309: Buy/Sell with Cooldown, O(1) space
int maxProfit(vector<int>& prices) {
    int hold = INT_MIN, sold = 0, rest = 0;
    for (int price : prices) {
        int prevHold = hold, prevSold = sold, prevRest = rest;
        hold = max(prevHold, prevRest - price);   // keep holding, or buy from rest
        sold = prevHold + price;                  // sell today
        rest = max(prevRest, prevSold);           // stay resting, or exit cooldown
    }
    return max(sold, rest);
}
```

```python
# LeetCode 309: Buy/Sell with Cooldown, O(1) space
def max_profit(prices):
    hold, sold, rest = float('-inf'), 0, 0
    for price in prices:
        prev_hold, prev_sold, prev_rest = hold, sold, rest
        hold = max(prev_hold, prev_rest - price)   # keep holding, or buy from rest
        sold = prev_hold + price                   # sell today
        rest = max(prev_rest, prev_sold)           # stay resting, or exit cooldown
    return max(sold, rest)
```

```java
// LeetCode 309: Buy/Sell with Cooldown, O(1) space
static int maxProfit(int[] prices) {
    int hold = Integer.MIN_VALUE, sold = 0, rest = 0;
    for (int price : prices) {
        int prevHold = hold, prevSold = sold, prevRest = rest;
        hold = Math.max(prevHold, prevRest - price);   // keep holding, or buy from rest
        sold = prevHold + price;                        // sell today
        rest = Math.max(prevRest, prevSold);            // stay resting, or exit cooldown
    }
    return Math.max(sold, rest);
}
```

```go
// LeetCode 309: Buy/Sell with Cooldown, O(1) space
func maxProfit(prices []int) int {
    hold, sold, rest := math.MinInt, 0, 0
    for _, price := range prices {
        prevHold, prevSold, prevRest := hold, sold, rest
        hold = max(prevHold, prevRest-price) // keep holding, or buy from rest
        sold = prevHold + price              // sell today
        rest = max(prevRest, prevSold)       // stay resting, or exit cooldown
    }
    return max(sold, rest)
}
```

At-most-k transactions generalizes this by tracking a buy/sell pair per transaction (for k=2: `buy1, sell1, buy2, sell2`). *Digit DP* — processing a number digit by digit to count values with a property — and *interval DP* (Pattern 5) round out the family.

### Pattern recognition guide

| Pattern | Key indicator | State | Time | Examples |
|---------|--------------|-------|------|----------|
| 1D | "ways to reach", "max up to i" | 1D | O(n) | Climbing Stairs, House Robber |
| 2D Grid | "grid", "path" | 2D | O(m×n) | Unique Paths, Min Path Sum |
| Knapsack | "subset", "take or skip" | 2D/1D | O(n×W) | 0/1 Knapsack, Subset Sum |
| Subsequence | "longest", "common" | 1D/2D | O(n²)/O(m×n) | LIS, LCS |
| Interval | "range", "split" | 2D | O(n³) | Burst Balloons, Matrix Chain |
| String | "edit", "match" | 2D | O(m×n) | Edit Distance, Regex |
| Tree | "tree", "subtree" | return values | O(n) | House Robber III |
| DAG | "topological", "prerequisite" | 1D | O(V+E) | Longest Path |
| Bitmask | "visited", "all cities" | bitmask | O(2ⁿ·n) | TSP |
| State Machine | "buy/sell", "hold" | pos × state | O(n×k) | Stock problems |

The workflow: match keywords to a pattern, write the recurrence, implement it with memoization or tabulation, then space-optimize if asked.

## Space optimization techniques

Cutting a DP's footprint saves memory and, with a smaller working set, improves cache behavior ([Performance and system considerations](#performance-and-system-considerations)). Four moves cover most cases:

- **Rolling array.** When the current row depends only on the previous one, collapse a 2D table to one or two rows — Unique Paths and Edit Distance ([Classic DP problems](#classic-dp-problems)–[Two-dimensional DP](#two-dimensional-dp)) reach O(n) this way, at the cost of easy path reconstruction.
- **Variable reduction.** When only the last few values matter, drop the array entirely: Fibonacci and Climbing Stairs keep two scalars for O(1) space.
- **State compression.** Encode a set as a bitmask integer so an exponential set of states fits in an array indexed by the mask — the TSP `dp[mask][last]` in Pattern 9 ([Ten must-know DP patterns](#ten-must-know-dp-patterns)), bounded by ~32–64 bits.
- **Interval reuse.** In interval DP, process by increasing length so only the current length's results stay live.

## DP vs recursion vs greedy

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

Plain recursion solves subproblems independently and may recompute them; DP stores results. Greedy commits to a locally optimal choice and never reconsiders; DP explores all possibilities to guarantee a global optimum. Coin Change is the sharpest illustration: greedy works for some coin systems (US denominations) but fails for others, whereas DP is always optimal.

| Approach | When | Time | Space | Examples |
|----------|------|------|-------|----------|
| Recursion | Recursive structure, no overlap | Exponential | O(n) stack | Tree traversal |
| Memoization | Overlap, top-down | Polynomial | O(n)+O(n) memo | Fibonacci, LCS |
| Tabulation | Overlap, bottom-up | Polynomial | O(n)–O(n²) | Fibonacci, LCS |
| Greedy | Local → global optimal | Polynomial | O(1)–O(n) | Activity Selection, Dijkstra |
| DP | Overlap + optimal substructure | Polynomial | O(n)–O(n²) | Coin Change, LIS, Knapsack |

## Real-world implementations

DP is problem-specific, so standard libraries rarely ship a generic DP, but the technique underlies a lot of production code:

- **Strings and sequences.** Edit distance and LCS power Python's `difflib`/`Levenshtein` and Java's Apache Commons `StringUtils`; bioinformatics alignment (Needleman–Wunsch, Smith–Waterman, both in Biopython's `Bio.pairwise2`) is 2D DP over a scoring matrix.
- **Compilers.** Common-subexpression elimination is DP-style caching; instruction scheduling and register allocation use DP over dependency structures.
- **Databases.** Join-order optimization in PostgreSQL and MySQL is DP over subsets of tables (state = the set joined so far); query-plan caching is memoization keyed by normalized query structure.
- **Game AI and RL.** Chess and Go engines memoize positions in transposition tables (Stockfish, AlphaZero); value iteration is tabulation over states via the Bellman equation.
- **Text processing.** Unix `diff` and Git use LCS-based diffing; spell checkers rank candidates by edit distance, often over a trie.

Real systems weigh space against time (often space-optimized DP to fit memory), sometimes accept an approximate DP for very large inputs, and must decide how to update a table when the input changes incrementally.

## Common pitfalls and interview traps

**"DP is just memoization."** DP requires *optimal substructure*, not merely overlapping subproblems, and tabulation is equally DP. Tree traversal has no overlap and is plain recursion, not DP.

**"All optimization problems are DP."** Greedy solves Activity Selection; divide and conquer solves Merge Sort. DP is needed only when both optimal substructure and overlapping subproblems are present (general Coin Change).

**"Memoization always speeds things up."** It adds lookup overhead; without real overlap it only slows the code, and tabulation may win on cache locality regardless.

**Recurring bugs.** Off-by-one loop bounds, out-of-range predecessor access, and — most often — forgetting to initialize base cases:

```cpp
vector<int> dp(n + 1);
// BUG: dp[0], dp[1] left uninitialized before the loop reads them
for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
```

**Interview gotchas.** *"Optimize the space?"* — name the rolling-array/variable reductions and their trade-off (losing easy reconstruction). *"Time complexity?"* — for 2D DP it is O(m×n), not O(n²); count unique states × work per state. *"Reconstruct the solution?"* — store parent pointers or backtrack through the table rather than returning only the value. *"Reuse items unlimited times?"* — that flips 0/1 knapsack (`dp[i-1][w-wt]`) to unbounded (`dp[w-wt]`, same row). To debug, print the table, verify base cases, hand-trace a small example, and test empty, single-element, and all-equal inputs.

## Summary and practice

Dynamic programming turns exponential-time recursion into polynomial time by identifying overlapping subproblems and storing their solutions. The core is small: DP applies exactly when a problem has both **optimal substructure** and **overlapping subproblems**; **memoization** (top-down) caches recursive results while **tabulation** (bottom-up) fills a table in dependency order; and space optimizations — rolling arrays, variable reduction, bitmasks — often cut memory by an order of magnitude while improving cache behavior. Mastery comes from recognizing patterns rather than memorizing solutions: start from Fibonacci and work up through the 2D, knapsack, interval, string, tree, graph, bitmask, and state-machine patterns. On real hardware, cache locality and footprint decide the winner — which is why bottom-up tabulation with space optimization usually beats an equivalent top-down memoization despite identical asymptotics.

For practice, group problems by the pattern they exercise ([Ten must-know DP patterns](#ten-must-know-dp-patterns)); implement each with both memoization and tabulation, then space-optimize:

- **1D / linear:** Maximum Subarray (Kadane), Decode Ways, Jump Game II.
- **Knapsack family:** Target Sum, Coin Change II (count ways), Partition to K Equal Sum Subsets.
- **Subsequence / string:** Longest Palindromic Subsequence, Distinct Subsequences, Interleaving String.
- **Grid / interval:** Dungeon Game, Palindrome Partitioning II, Matrix Chain Multiplication.
- **State machine / bitmask:** Best Time to Buy/Sell Stock IV, Traveling Salesman, Shortest Path Visiting All Nodes.

For each, identify the pattern first, then write the recurrence before any code.
