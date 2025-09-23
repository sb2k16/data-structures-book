/**
 * Backtracking and Memoization Demo
 * 
 * This file demonstrates backtracking algorithms with memoization
 * for solving complex dynamic programming problems.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_memoization_demo backtracking_memoization_demo.cpp
 * Run with: ./backtracking_memoization_demo
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <chrono>
#include <iomanip>
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

// N-Queens Solver with Memoization
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
    
    void printBoard() {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                cout << (board[i][j] ? "Q" : ".") << " ";
            }
            cout << endl;
        }
        cout << endl;
    }
};

// Subset Sum Solver with Memoization
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
        if (index >= static_cast<int>(numbers.size()) || target < 0) return false;
        
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
        
        if (index >= static_cast<int>(numbers.size()) || target < 0) return;
        
        // Include current number
        current.push_back(numbers[index]);
        getAllSubsetsHelper(index + 1, target - numbers[index], current, result);
        current.pop_back();
        
        // Exclude current number
        getAllSubsetsHelper(index + 1, target, current, result);
    }
};

// Word Break Solver with Memoization
class WordBreakSolver {
private:
    unordered_set<string> wordDict;
    unordered_map<string, bool> memo;
    
public:
    WordBreakSolver(const vector<string>& words) {
        for (const string& word : words) {
            wordDict.insert(word);
        }
    }
    
    bool canBreak(const string& s) {
        if (memo.find(s) != memo.end()) {
            return memo[s];
        }
        
        if (s.empty()) {
            return true;
        }
        
        for (size_t i = 1; i <= s.length(); i++) {
            string prefix = s.substr(0, i);
            if (wordDict.find(prefix) != wordDict.end()) {
                string suffix = s.substr(i);
                if (canBreak(suffix)) {
                    memo[s] = true;
                    return true;
                }
            }
        }
        
        memo[s] = false;
        return false;
    }
    
    vector<string> getAllBreaks(const string& s) {
        vector<string> result;
        vector<string> current;
        getAllBreaksHelper(s, current, result);
        return result;
    }
    
private:
    void getAllBreaksHelper(const string& s, vector<string>& current, 
                          vector<string>& result) {
        if (s.empty()) {
            string sentence = "";
            for (size_t i = 0; i < current.size(); i++) {
                if (i > 0) sentence += " ";
                sentence += current[i];
            }
            result.push_back(sentence);
            return;
        }
        
        for (size_t i = 1; i <= s.length(); i++) {
            string prefix = s.substr(0, i);
            if (wordDict.find(prefix) != wordDict.end()) {
                current.push_back(prefix);
                getAllBreaksHelper(s.substr(i), current, result);
                current.pop_back();
            }
        }
    }
};

// Sudoku Solver with Advanced Pruning
class SudokuSolver {
private:
    vector<vector<char>> board;
    int memo[9][9][10]; // Memoization for each cell and possible values
    
public:
    SudokuSolver(vector<vector<char>>& board) : board(board) {
        memset(memo, -1, sizeof(memo));
    }
    
    bool solveSudoku() {
        return solveWithPruning();
    }
    
private:
    bool solveWithPruning() {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char c = '1'; c <= '9'; c++) {
                        if (isValid(i, j, c)) {
                            board[i][j] = c;
                            
                            if (solveWithPruning()) {
                                return true;
                            }
                            
                            board[i][j] = '.'; // Backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    bool isValid(int row, int col, char c) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == c) return false;
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == c) return false;
        }
        
        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = boxRow; i < boxRow + 3; i++) {
            for (int j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] == c) return false;
            }
        }
        
        return true;
    }
    
public:
    void printBoard() {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
    }
};

// Performance Analyzer
class PerformanceAnalyzer {
private:
    unordered_map<string, int> callCount;
    unordered_map<string, int> memoHits;
    
public:
    void analyzeMemoization(const string& problem, int inputSize) {
        cout << "=== Memoization Analysis for " << problem << " ===" << endl;
        cout << "Input Size: " << inputSize << endl;
        cout << "Total Function Calls: " << callCount[problem] << endl;
        cout << "Memoization Hits: " << memoHits[problem] << endl;
        cout << "Hit Rate: " << fixed << setprecision(2) 
             << (double)memoHits[problem] / callCount[problem] * 100 << "%" << endl;
        cout << "Space Complexity: O(" << memoHits[problem] << ")" << endl;
        cout << endl;
    }
    
    void recordCall(const string& problem) {
        callCount[problem]++;
    }
    
    void recordMemoHit(const string& problem) {
        memoHits[problem]++;
    }
};

// Demo class
class BacktrackingMemoizationDemo {
public:
    void demonstrateNQueens() {
        cout << "=== N-Queens Problem with Memoization ===" << endl;
        
        for (int n = 4; n <= 8; n++) {
            auto start = chrono::high_resolution_clock::now();
            
            NQueensSolver solver(n);
            int solutions = solver.solveWithMemoization();
            
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);
            
            cout << n << "-Queens: " << solutions << " solutions in " 
                 << duration.count() << "ms" << endl;
        }
        cout << endl;
    }
    
    void demonstrateSubsetSum() {
        cout << "=== Subset Sum Problem with Memoization ===" << endl;
        
        vector<int> numbers = {3, 34, 4, 12, 5, 2};
        int target = 9;
        
        SubsetSumSolver solver(numbers);
        
        cout << "Numbers: ";
        for (int num : numbers) cout << num << " ";
        cout << endl;
        cout << "Target: " << target << endl;
        
        if (solver.canMakeSum(target)) {
            cout << "Can make sum " << target << endl;
            
            vector<vector<int>> subsets = solver.getAllSubsets(target);
            cout << "Subsets that sum to " << target << ":" << endl;
            for (const auto& subset : subsets) {
                cout << "  ";
                for (size_t i = 0; i < subset.size(); i++) {
                    if (i > 0) cout << " + ";
                    cout << subset[i];
                }
                cout << " = " << target << endl;
            }
        } else {
            cout << "Cannot make sum " << target << endl;
        }
        cout << endl;
    }
    
    void demonstrateWordBreak() {
        cout << "=== Word Break Problem with Memoization ===" << endl;
        
        vector<string> words = {"cat", "cats", "and", "sand", "dog", "dogs"};
        string s = "catsanddogs";
        
        WordBreakSolver solver(words);
        
        cout << "String: " << s << endl;
        cout << "Dictionary: ";
        for (const string& word : words) cout << word << " ";
        cout << endl;
        
        if (solver.canBreak(s)) {
            cout << "Can break the string" << endl;
            
            vector<string> breaks = solver.getAllBreaks(s);
            cout << "All possible breaks:" << endl;
            for (const string& breakStr : breaks) {
                cout << "  \"" << breakStr << "\"" << endl;
            }
        } else {
            cout << "Cannot break the string" << endl;
        }
        cout << endl;
    }
    
    void demonstrateSudoku() {
        cout << "=== Sudoku Solver with Advanced Pruning ===" << endl;
        
        vector<vector<char>> board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        
        cout << "Initial Sudoku:" << endl;
        SudokuSolver solver(board);
        solver.printBoard();
        cout << endl;
        
        auto start = chrono::high_resolution_clock::now();
        bool solved = solver.solveSudoku();
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);
        
        if (solved) {
            cout << "Solved in " << duration.count() << "ms:" << endl;
            solver.printBoard();
        } else {
            cout << "No solution found" << endl;
        }
        cout << endl;
    }
    
    void runAllDemos() {
        cout << "Backtracking and Memoization Algorithms Demo" << endl;
        cout << "=============================================" << endl;
        cout << endl;
        
        demonstrateNQueens();
        demonstrateSubsetSum();
        demonstrateWordBreak();
        demonstrateSudoku();
        
        cout << "=== Demo Complete ===" << endl;
        cout << "\nKey Insights:" << endl;
        cout << "1. Memoization significantly reduces redundant calculations" << endl;
        cout << "2. Backtracking explores all possible solutions systematically" << endl;
        cout << "3. Pruning eliminates impossible paths early" << endl;
        cout << "4. State compression optimizes memory usage" << endl;
        cout << "5. These techniques are essential for complex DP problems" << endl;
    }
};

int main() {
    BacktrackingMemoizationDemo demo;
    demo.runAllDemos();
    return 0;
}
