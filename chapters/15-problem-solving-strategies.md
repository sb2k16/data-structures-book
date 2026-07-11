# Chapter 15: Problem Solving Strategies

Every chapter before this one taught you a structure. This one teaches you the harder skill: looking at a problem you have never seen and knowing, within a minute or two, which structure and which technique will crack it. That skill is not talent. It is pattern recognition, and patterns are learnable — a handful of them cover the overwhelming majority of algorithmic problems you will meet in interviews, contests, and the occasional real system.

The trap is memorizing solutions. There are thousands of problems and you cannot memorize your way out. What you *can* do is learn the dozen recurring shapes — the signals in a problem statement that say "this is a two-pointer problem" or "this is binary search wearing a disguise" — and the transformation each shape implies. Get good at the recognition step and the code writes itself, because you have written that code before under a different name.

This chapter gives you a framework for attacking any problem, the patterns that actually recur with the signals that trigger them, and the interview mechanics that decide whether your good idea survives contact with a whiteboard.

## The framework

Most people, handed a problem, start typing. That is the reliable way to waste twenty minutes writing the wrong thing. A better loop:

1. **Understand before you solve.** Nail down input and output types, the size of `n` (this alone often dictates the target complexity), the value ranges, and the edge cases: empty input, one element, duplicates, negatives, already-sorted. Restate the problem back in your own words. Half of all "hard" problems are easy once you actually know what is being asked.

2. **Read the constraints — they leak the answer.** Constraints are not fine print; they are a hint about the intended complexity. `n ≤ 20` invites exponential backtracking. `n ≤ 2000` tolerates O(n²). `n ≤ 10⁶` demands O(n) or O(n log n), which immediately rules out nested loops and points you at hashing, sorting, or a sliding window. A range like `1 ≤ x ≤ 10⁹` on the *answer* rather than the input often means binary search on the answer.

3. **Match to a pattern.** This is the core move, and the rest of the chapter is about it. Sorted array? Two pointers or binary search. Contiguous subarray or substring? Sliding window. Need O(1) lookups or complement search? A hash map. Tree or graph? BFS or DFS. Optimization with overlapping subproblems? Dynamic programming.

4. **Start with brute force, then attack the bottleneck.** State the naive O(n²) solution out loud — it proves you understand the problem and gives you a correctness baseline. Then find the single expensive step and replace it: a linear scan becomes a hash lookup, a re-summed window becomes an incremental one.

5. **Estimate complexity before coding.** If your plan is O(n²) and the constraint is 10⁶, stop — you already know it will time out. Cheaper to discover that in your head than after forty lines.

6. **Code it, then test the edges.** Walk your own example through the finished code by hand. Then throw the boundary cases at it: empty, single element, all-equal, min/max integers. This is where off-by-one and overflow bugs surface.

The loop is not sacred; experienced engineers collapse steps. But when you are stuck, returning to it — *what exactly is being asked, what does the constraint imply, what pattern fits* — is how you get unstuck.

## The patterns that actually recur

A pattern is a reusable transformation plus the signal that tells you to reach for it. What follows is the working set. Learn to recognize each on sight.

### Two pointers

**Signal:** a *sorted* array (or one you can sort), and you are looking for a pair, triplet, or a partition — anything where you can make progress by moving from both ends inward, or by advancing a slow and fast index in tandem.

The insight is that sorting imposes an order you can exploit: if the sum of the two ends is too big, the only way to shrink it is to pull in the right pointer; too small, advance the left. Each element is visited once, turning an O(n²) pair search into O(n).

```cpp
// Container With Most Water: widest × shortest wall wins.
int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int best = 0;
    while (left < right) {
        int area = min(height[left], height[right]) * (right - left);
        best = max(best, area);
        // Move the shorter wall inward — it's the limiting factor.
        if (height[left] < height[right]) left++;
        else right--;
    }
    return best;
}
```

The same two-index idea drives 3Sum (fix one element, two-pointer the rest), palindrome checks (converge from both ends), and cycle detection in a linked list (slow and fast pointers). See [Chapter 3](03-basic-data-structures.md) for the array mechanics this rides on.

### Sliding window

**Signal:** a *contiguous* subarray or substring, and a question about its sum, length, or contents. The window is a two-pointer variant specialized for "best contiguous run."

The whole point is to avoid recomputing. When the window slides right, you add the entering element and subtract the leaving one — O(1) per step instead of re-scanning the window. Fixed-size windows are the easy case; variable-size windows grow the right edge greedily and shrink the left edge only when a constraint breaks.

```cpp
// Longest substring with no repeated character. Grow right; when a
// duplicate enters, shrink left until it's gone.
int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        while (window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        window.insert(s[right]);
        best = max(best, right - left + 1);
    }
    return best;
}
```

Each character enters and leaves the window at most once, so despite the inner `while`, the whole thing is O(n) — the classic amortized-analysis payoff. Maximum-sum-of-size-k, minimum window substring, and longest-repeating-character-replacement are all the same skeleton with a different "is the window valid?" test.

### Hashing for O(n)

**Signal:** you catch yourself about to write a nested loop to *find* something — a complement, a duplicate, a previously-seen value, a group. A hash map turns that inner O(n) search into an O(1) lookup, collapsing O(n²) to O(n). This is the single highest-leverage pattern in interviews.

```cpp
// Two Sum: for each number, ask the map if its complement came before.
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;  // value -> index
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        auto it = seen.find(need);
        if (it != seen.end()) return {it->second, i};
        seen[nums[i]] = i;
    }
    return {};
}
```

The trick generalizes. Group anagrams by keying on the sorted string. Count subarrays summing to `k` by hashing prefix sums. Detect duplicates in one pass. Any time the brute force is "compare everything to everything," ask whether a map of what-you've-seen kills the inner loop. Just remember what [Chapter 10](10-hash-tables-and-hashing.md) drilled in: `unordered_map` is O(1) *average* but scatters memory, and it gives you no ordering — if you need sorted keys or range queries, that job belongs to a tree.

### Binary search on the answer

**Signal:** you are asked for the minimum or maximum value that satisfies some condition, the value range is large, and — the crucial part — the condition is *monotonic*: if value `v` works, every value above it works too (or every value below). You are not searching an array; you are searching the space of possible answers.

This is the pattern people miss most, because there is no sorted array in sight. The sorted thing is the answer axis itself. If you can write a `feasible(x)` predicate that flips from false to true exactly once as `x` increases, you can binary-search for the flip point in O(log(range)) predicate evaluations.

```cpp
// Ship packages within `days`: find the minimum daily capacity.
// feasible(cap) is monotonic — more capacity never needs more days.
int shipWithinDays(vector<int>& weights, int days) {
    int lo = *max_element(weights.begin(), weights.end());  // must fit heaviest
    int hi = accumulate(weights.begin(), weights.end(), 0); // ship everything in one day
    while (lo < hi) {
        int cap = lo + (hi - lo) / 2;
        int needed = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { needed++; load = 0; }
            load += w;
        }
        if (needed <= days) hi = cap;   // feasible — try smaller
        else lo = cap + 1;              // infeasible — need more
    }
    return lo;
}
```

"Minimize the largest ...", "maximize the smallest ...", "smallest capacity/speed/time such that ..." — these phrasings are the tell. Plain binary search on a sorted array (Chapter [13](13-searching-algorithms.md)) is just the special case where the predicate is `nums[mid] >= target`.

### BFS and DFS

**Signal:** anything with a tree or graph structure — explicit (nodes and edges) or implicit (grid cells, board states, word transformations). The two traversals answer different questions, and picking the right one is the recognition step.

**BFS** explores level by level using a queue, which is exactly why it finds the *shortest path in an unweighted graph*: the first time you reach a node, you reached it by the fewest edges. Reach for it whenever the question is "minimum steps" or "fewest moves."

```cpp
// Level-order traversal — the canonical BFS skeleton.
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> levels;
    if (!root) return levels;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int n = q.size();               // freeze this level's width
        vector<int> level;
        for (int i = 0; i < n; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        levels.push_back(level);
    }
    return levels;
}
```

**DFS** goes deep before wide, using recursion (an implicit stack) or an explicit one. It is the natural fit for path problems, connected components, cycle detection, and anything tree-shaped. "Number of islands" is a DFS flood-fill; validating a BST is a DFS with bounds. Both traversals are O(V + E). See [Chapter 11](11-graphs.md) for the full treatment, including when the graph is weighted and you need Dijkstra instead.

### Dynamic programming

**Signal:** the problem asks for an optimum (max/min) or a count over choices, the answer to a big instance is built from answers to smaller instances (*optimal substructure*), and those smaller instances *recur* (*overlapping subproblems*). The moment you notice your recursion recomputing the same call, that repetition is the thing DP eliminates.

The mechanical recipe: define the state (what parameters uniquely identify a subproblem), write the recurrence, then either memoize the recursion top-down or fill a table bottom-up. Once the recurrence only looks back a constant number of steps, you can often drop the table to a few variables.

```cpp
// House Robber: at each house, take it plus best-two-back, or skip it.
// State collapses to two rolling values — O(n) time, O(1) space.
int rob(vector<int>& nums) {
    int skip = 0;   // best if we skip current
    int take = 0;   // best if we consider current
    for (int x : nums) {
        int newTake = skip + x;         // rob this house
        skip = max(skip, take);         // don't rob it
        take = newTake;
    }
    return max(skip, take);
}
```

Climbing stairs, coin change, longest common subsequence, edit distance — same three moves every time: find the state, write the recurrence, decide top-down or bottom-up. [Chapter 12](12-dynamic-programming.md) is the deep dive.

### Greedy and backtracking, in one breath

Two patterns round out the set, and both have dedicated chapters.

**Greedy** (Chapter [16](16-greedy-algorithms.md)) makes the locally optimal choice and never reconsiders — sort activities by finish time, always take the earliest-ending one. It is faster and simpler than DP but only correct when a *greedy-choice property* holds, which you must justify, not assume. When you cannot prove greedy is safe, fall back to DP.

**Backtracking** (Chapter [8](08-recursion-and-backtracking.md)) is exhaustive search with pruning: try a choice, recurse, and *undo it* on the way back. The undo is the whole pattern, and forgetting it is the classic bug.

```cpp
// Generate all valid parenthesis combinations. Helper declared first
// so it's in scope where it's called.
void build(string cur, int open, int close, int n, vector<string>& out) {
    if ((int)cur.size() == 2 * n) { out.push_back(cur); return; }
    if (open < n)      build(cur + '(', open + 1, close, n, out);
    if (close < open)  build(cur + ')', open, close + 1, n, out);
}

vector<string> generateParenthesis(int n) {
    vector<string> out;
    build("", 0, 0, n, out);
    return out;
}
```

The `n ≤ 20`-ish constraint is your cue: exponential search is on the table because the input is tiny.

## Recognizing which pattern applies

The patterns are only useful if the right one fires when you read the statement. This is the lookup table to run in your head:

| Signal in the problem | Reach for |
|---|---|
| Sorted array, find a pair/triplet/partition | Two pointers |
| Contiguous subarray/substring, best run | Sliding window |
| "Have I seen X?", complement, frequency, grouping | Hash map/set |
| "Min/max value such that condition holds", monotonic | Binary search on the answer |
| Tree/graph, "fewest steps / shortest unweighted path" | BFS |
| Tree/graph, paths, components, cycles | DFS |
| Optimize or count over choices, subproblems overlap | Dynamic programming |
| Locally optimal choice provably global | Greedy |
| Enumerate all solutions, tiny `n` | Backtracking |

Two habits sharpen this. First, **let the constraint pick the complexity, then the complexity picks the pattern.** `n ≤ 10⁶` and you need every-element-once thinking: sliding window, hashing, a single sort. `n ≤ 20` and exponential is fine: backtracking. Second, **name the brute force, then name its bottleneck.** The bottleneck is almost always a search inside a loop, and the pattern is almost always the thing that eliminates it — a hash lookup, a sorted-order two-pointer sweep, a memo.

Many problems layer two patterns. 3Sum is sort-then-two-pointer. "Subarray sum equals k" is sliding-window intuition rescued by prefix-sum hashing when negatives break the window. Longest-increasing-subsequence is DP that a binary search speeds from O(n²) to O(n log n). Recognizing the primary shape gets you most of the way; the second pattern is usually the optimization on top.

## The interview, specifically

Technical interviews reward a narrow, learnable set of behaviors, and most rejections are process failures, not knowledge gaps. The specifics that matter:

**Spend the first two minutes clarifying, not coding.** Ask the questions that change your solution: return indices or values? Is the array sorted? Can inputs be empty or negative? Are there duplicates? Is one solution guaranteed? Every answer either eliminates a pattern or an edge case, and asking them signals exactly the care senior engineers are screening for.

**Think out loud, because the interviewer is grading your reasoning, not your final string of characters.** "The brute force is O(n²) — check every pair. The bottleneck is the inner search, so I'll trade space for time with a hash map and get O(n)." That sentence is worth more than silently writing the optimal answer, because it shows the process that will let you solve the problem they *didn't* ask.

**State the brute force, then optimize — out loud, in that order.** It gives you a correctness anchor, buys thinking time, and demonstrates you can improve a solution rather than only recall one. Jumping straight to the clever answer sometimes reads as memorization.

**Budget the clock.** In a 45-minute slot: ~5 minutes understanding and clarifying, ~10 designing and confirming the approach with the interviewer *before* coding, ~20 implementing, ~10 testing and discussing complexity and trade-offs. The most common time sink is coding before the approach is agreed — you write twenty lines, realize the idea was wrong, and now have no time. Confirm the plan first.

**Test your own code without being asked.** Trace the given example by hand, then hit the edges: empty, single element, duplicates, overflow-sized values. Finding your own bug is a strong positive signal; having the interviewer find it is not.

Write for a reader: `left`/`right` beat `i`/`j`, a helper named for what it does beats `solve2`. Clean code under time pressure is itself the signal.

## The bugs that actually bite

A short list, because these five account for most wrong-answer verdicts:

**Off-by-one.** Loop bounds and inclusive-vs-exclusive ranges. `i <= size` walks off the end; `i < size` is the safe form. Test with arrays of length 1 and 2, where off-by-ones always surface.

**Integer overflow.** A sum or product of `int`s can exceed `2³¹−1` and wrap to garbage. When the constraints let the total grow large, accumulate in `long long`. This is the bug most likely to pass small tests and fail big ones.

**Empty and null input.** `arr[0]` on an empty vector is undefined behavior. Guard the empty case explicitly before you touch the first element — and decide with the interviewer whether empty means return 0, return empty, or throw.

**Broken backtracking.** Every choice you make must be undone after the recursive call returns. A missing `path.pop_back()` (or its equivalent) silently corrupts every subsequent branch.

**Wrong container for the access pattern.** A linear `std::find` in a hot loop is O(n) when an `unordered_set` would be O(1). Chapter [2](02-complexity-analysis.md) is the reflex to build: before you pick a structure, ask what operation you do most, and pick the container that makes *that* one cheap.

None of this is glamorous, but the difference between a candidate who ships correct code and one who doesn't is usually not the algorithm — it is whether they remembered the empty array and the `long long`.

---

The catalog of structures in this book exists to be *reached for*. Problem-solving is the reach: reading a statement, hearing which structure it is quietly asking for, and knowing what that structure costs on the machine you will run it on. The patterns here are the vocabulary. The only way to make them automatic is to use them — enough times, on enough problems, that recognition stops being a step you perform and becomes something you simply see.
