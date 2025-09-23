/**
 * Backtracking Practice Problems Solutions
 * 
 * This file contains solutions to the practice problems from Chapter 12.
 * Covers easy, medium, and hard level backtracking problems.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_practice_solutions backtracking_practice_solutions.cpp
 * Run with: ./backtracking_practice_solutions
 */

#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <algorithm>
#include <chrono>
using namespace std;

// ============================================================================
// EASY LEVEL PROBLEMS
// ============================================================================

class EasyBacktrackingProblems {
public:
    // Problem 1: Generate Parentheses
    vector<string> generateParentheses(int n) {
        vector<string> result;
        string current = "";
        generateParenthesesHelper(n, n, current, result);
        return result;
    }
    
private:
    void generateParenthesesHelper(int open, int close, string& current, vector<string>& result) {
        // Base case: all parentheses used
        if (open == 0 && close == 0) {
            result.push_back(current);
            return;
        }
        
        // Add opening parenthesis if available
        if (open > 0) {
            current.push_back('(');
            generateParenthesesHelper(open - 1, close, current, result);
            current.pop_back(); // Backtrack
        }
        
        // Add closing parenthesis if valid (more opens than closes)
        if (close > open) {
            current.push_back(')');
            generateParenthesesHelper(open, close - 1, current, result);
            current.pop_back(); // Backtrack
        }
    }
    
public:
    // Problem 2: Letter Combinations of a Phone Number
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        vector<string> result;
        string current = "";
        vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        
        letterCombinationsHelper(digits, 0, current, result, mapping);
        return result;
    }
    
private:
    void letterCombinationsHelper(const string& digits, int index, string& current, 
                                 vector<string>& result, const vector<string>& mapping) {
        // Base case: all digits processed
        if (index == static_cast<int>(digits.length())) {
            result.push_back(current);
            return;
        }
        
        // Get letters for current digit
        string letters = mapping[digits[index] - '0'];
        
        // Try each letter
        for (char letter : letters) {
            current.push_back(letter);
            letterCombinationsHelper(digits, index + 1, current, result, mapping);
            current.pop_back(); // Backtrack
        }
    }
    
public:
    // Problem 3: Subsets
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        subsetsHelper(nums, 0, current, result);
        return result;
    }
    
private:
    void subsetsHelper(const vector<int>& nums, int index, vector<int>& current, 
                      vector<vector<int>>& result) {
        // Add current subset to result
        result.push_back(current);
        
        // Try adding each remaining element
        for (int i = index; i < static_cast<int>(nums.size()); i++) {
            current.push_back(nums[i]);
            subsetsHelper(nums, i + 1, current, result);
            current.pop_back(); // Backtrack
        }
    }
};

// ============================================================================
// MEDIUM LEVEL PROBLEMS
// ============================================================================

class MediumBacktrackingProblems {
public:
    // Problem 4: Permutations
    vector<vector<int>> permutations(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        permutationsHelper(nums, current, used, result);
        return result;
    }
    
private:
    void permutationsHelper(const vector<int>& nums, vector<int>& current, 
                           vector<bool>& used, vector<vector<int>>& result) {
        // Base case: all elements used
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Try each unused element
        for (size_t i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                used[i] = true;
                current.push_back(nums[i]);
                permutationsHelper(nums, current, used, result);
                current.pop_back(); // Backtrack
                used[i] = false; // Backtrack
            }
        }
    }
    
public:
    // Problem 5: Combination Sum
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        sort(candidates.begin(), candidates.end()); // Sort for pruning
        combinationSumHelper(candidates, target, 0, current, result);
        return result;
    }
    
private:
    void combinationSumHelper(const vector<int>& candidates, int target, int index,
                             vector<int>& current, vector<vector<int>>& result) {
        // Base case: target reached
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        // Try each candidate starting from index
        for (int i = index; i < static_cast<int>(candidates.size()); i++) {
            // Pruning: if candidate is larger than target, stop
            if (candidates[i] > target) break;
            
            current.push_back(candidates[i]);
            combinationSumHelper(candidates, target - candidates[i], i, current, result);
            current.pop_back(); // Backtrack
        }
    }
    
public:
    // Problem 6: Word Search
    bool wordSearch(vector<vector<char>>& board, string word) {
        int m = board.size();
        int n = board[0].size();
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (wordSearchHelper(board, word, 0, i, j)) {
                    return true;
                }
            }
        }
        return false;
    }
    
private:
    bool wordSearchHelper(vector<vector<char>>& board, const string& word, 
                         int index, int row, int col) {
        // Base case: word found
        if (index == static_cast<int>(word.length())) return true;
        
        // Check bounds and character match
        if (row < 0 || row >= static_cast<int>(board.size()) || col < 0 || col >= static_cast<int>(board[0].size()) ||
            board[row][col] != word[index]) {
            return false;
        }
        
        // Mark cell as visited
        char temp = board[row][col];
        board[row][col] = '#';
        
        // Try all four directions
        bool found = wordSearchHelper(board, word, index + 1, row + 1, col) ||
                    wordSearchHelper(board, word, index + 1, row - 1, col) ||
                    wordSearchHelper(board, word, index + 1, row, col + 1) ||
                    wordSearchHelper(board, word, index + 1, row, col - 1);
        
        // Restore cell
        board[row][col] = temp;
        
        return found;
    }
    
public:
    // Problem 7: Palindrome Partitioning
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        partitionHelper(s, 0, current, result);
        return result;
    }
    
private:
    void partitionHelper(const string& s, int start, vector<string>& current, 
                        vector<vector<string>>& result) {
        // Base case: entire string processed
        if (start == static_cast<int>(s.length())) {
            result.push_back(current);
            return;
        }
        
        // Try each possible partition
        for (int i = start; i < static_cast<int>(s.length()); i++) {
            string substring = s.substr(start, i - start + 1);
            if (isPalindrome(substring)) {
                current.push_back(substring);
                partitionHelper(s, i + 1, current, result);
                current.pop_back(); // Backtrack
            }
        }
    }
    
    bool isPalindrome(const string& s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s[left] != s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
};

// ============================================================================
// HARD LEVEL PROBLEMS
// ============================================================================

class HardBacktrackingProblems {
public:
    // Problem 8: N-Queens
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        solveNQueensHelper(board, 0, result);
        return result;
    }
    
private:
    void solveNQueensHelper(vector<string>& board, int row, vector<vector<string>>& result) {
        // Base case: all queens placed
        if (row == static_cast<int>(board.size())) {
            result.push_back(board);
            return;
        }
        
        // Try placing queen in each column
        for (int col = 0; col < static_cast<int>(board.size()); col++) {
            if (isValidQueen(board, row, col)) {
                board[row][col] = 'Q';
                solveNQueensHelper(board, row + 1, result);
                board[row][col] = '.'; // Backtrack
            }
        }
    }
    
    bool isValidQueen(const vector<string>& board, int row, int col) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        
        // Check diagonal
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        
        // Check anti-diagonal
        for (int i = row, j = col; i >= 0 && j < static_cast<int>(board.size()); i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        
        return true;
    }
    
public:
    // Problem 9: Sudoku Solver
    void solveSudoku(vector<vector<char>>& board) {
        solveSudokuHelper(board);
    }
    
private:
    bool solveSudokuHelper(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char c = '1'; c <= '9'; c++) {
                        if (isValidSudoku(board, i, j, c)) {
                            board[i][j] = c;
                            if (solveSudokuHelper(board)) {
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
    
    bool isValidSudoku(const vector<vector<char>>& board, int row, int col, char c) {
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
    // Problem 10: Word Ladder II
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) return {};
        
        vector<vector<string>> result;
        vector<string> current = {beginWord};
        findLaddersHelper(beginWord, endWord, wordSet, current, result);
        return result;
    }
    
private:
    void findLaddersHelper(const string& currentWord, const string& endWord,
                          unordered_set<string>& wordSet, vector<string>& current,
                          vector<vector<string>>& result) {
        if (currentWord == endWord) {
            result.push_back(current);
            return;
        }
        
        // Try changing each character
        for (int i = 0; i < static_cast<int>(currentWord.length()); i++) {
            char original = currentWord[i];
            for (char c = 'a'; c <= 'z'; c++) {
                if (c == original) continue;
                
                string newWord = currentWord;
                newWord[i] = c;
                
                if (wordSet.find(newWord) != wordSet.end()) {
                    wordSet.erase(newWord); // Avoid cycles
                    current.push_back(newWord);
                    findLaddersHelper(newWord, endWord, wordSet, current, result);
                    current.pop_back(); // Backtrack
                    wordSet.insert(newWord); // Backtrack
                }
            }
        }
    }
    
public:
    // Problem 11: Expression Add Operators
    vector<string> addOperators(string num, int target) {
        vector<string> result;
        addOperatorsHelper(num, target, 0, "", 0, 0, result);
        return result;
    }
    
private:
    void addOperatorsHelper(const string& num, int target, int index, string current,
                           long prev, long curr, vector<string>& result) {
        if (index == static_cast<int>(num.length())) {
            if (curr == target) {
                result.push_back(current);
            }
            return;
        }
        
        for (int i = index; i < static_cast<int>(num.length()); i++) {
            if (i != index && num[index] == '0') break; // Avoid leading zeros
            
            string numStr = num.substr(index, i - index + 1);
            long numVal = stol(numStr);
            
            if (index == 0) {
                addOperatorsHelper(num, target, i + 1, numStr, numVal, numVal, result);
            } else {
                addOperatorsHelper(num, target, i + 1, current + "+" + numStr, numVal, curr + numVal, result);
                addOperatorsHelper(num, target, i + 1, current + "-" + numStr, -numVal, curr - numVal, result);
                addOperatorsHelper(num, target, i + 1, current + "*" + numStr, prev * numVal, curr - prev + prev * numVal, result);
            }
        }
    }
    
public:
    // Problem 12: Restore IP Addresses
    vector<string> restoreIpAddresses(string s) {
        vector<string> result;
        vector<string> current;
        restoreIpAddressesHelper(s, 0, current, result);
        return result;
    }
    
private:
    void restoreIpAddressesHelper(const string& s, int index, vector<string>& current,
                                 vector<string>& result) {
        if (current.size() == 4) {
            if (index == static_cast<int>(s.length())) {
                string ip = current[0] + "." + current[1] + "." + current[2] + "." + current[3];
                result.push_back(ip);
            }
            return;
        }
        
        for (int i = 1; i <= 3 && index + i <= static_cast<int>(s.length()); i++) {
            string segment = s.substr(index, i);
            if (isValidIpSegment(segment)) {
                current.push_back(segment);
                restoreIpAddressesHelper(s, index + i, current, result);
                current.pop_back(); // Backtrack
            }
        }
    }
    
    bool isValidIpSegment(const string& segment) {
        if (segment.length() > 3 || segment.empty()) return false;
        if (segment.length() > 1 && segment[0] == '0') return false;
        int num = stoi(segment);
        return num >= 0 && num <= 255;
    }
};

// ============================================================================
// DEMO CLASS
// ============================================================================

class BacktrackingPracticeDemo {
public:
    void runEasyProblems() {
        cout << "=== EASY LEVEL PROBLEMS ===" << endl;
        
        EasyBacktrackingProblems easy;
        
        // Problem 1: Generate Parentheses
        cout << "\n1. Generate Parentheses (n=3):" << endl;
        auto parentheses = easy.generateParentheses(3);
        for (const string& p : parentheses) {
            cout << "  \"" << p << "\"" << endl;
        }
        
        // Problem 2: Letter Combinations
        cout << "\n2. Letter Combinations of Phone Number (\"23\"):" << endl;
        auto combinations = easy.letterCombinations("23");
        for (const string& combo : combinations) {
            cout << "  \"" << combo << "\"" << endl;
        }
        
        // Problem 3: Subsets
        cout << "\n3. Subsets of [1,2,3]:" << endl;
        vector<int> nums = {1, 2, 3};
        auto subsets = easy.subsets(nums);
        for (const auto& subset : subsets) {
            cout << "  [";
            for (size_t i = 0; i < subset.size(); i++) {
                if (i > 0) cout << ",";
                cout << subset[i];
            }
            cout << "]" << endl;
        }
    }
    
    void runMediumProblems() {
        cout << "\n=== MEDIUM LEVEL PROBLEMS ===" << endl;
        
        MediumBacktrackingProblems medium;
        
        // Problem 4: Permutations
        cout << "\n4. Permutations of [1,2,3]:" << endl;
        vector<int> nums = {1, 2, 3};
        auto permutations = medium.permutations(nums);
        for (const auto& perm : permutations) {
            cout << "  [";
            for (size_t i = 0; i < perm.size(); i++) {
                if (i > 0) cout << ",";
                cout << perm[i];
            }
            cout << "]" << endl;
        }
        
        // Problem 5: Combination Sum
        cout << "\n5. Combination Sum ([2,3,6,7], target=7):" << endl;
        vector<int> candidates = {2, 3, 6, 7};
        auto combinations = medium.combinationSum(candidates, 7);
        for (const auto& combo : combinations) {
            cout << "  [";
            for (size_t i = 0; i < combo.size(); i++) {
                if (i > 0) cout << ",";
                cout << combo[i];
            }
            cout << "]" << endl;
        }
        
        // Problem 6: Word Search
        cout << "\n6. Word Search:" << endl;
        vector<vector<char>> board = {
            {'A','B','C','E'},
            {'S','F','C','S'},
            {'A','D','E','E'}
        };
        string word = "ABCCED";
        bool found = medium.wordSearch(board, word);
        cout << "  Word \"" << word << "\" found: " << (found ? "Yes" : "No") << endl;
        
        // Problem 7: Palindrome Partitioning
        cout << "\n7. Palindrome Partitioning of \"aab\":" << endl;
        auto partitions = medium.partition("aab");
        for (const auto& partition : partitions) {
            cout << "  [";
            for (size_t i = 0; i < partition.size(); i++) {
                if (i > 0) cout << ",";
                cout << "\"" << partition[i] << "\"";
            }
            cout << "]" << endl;
        }
    }
    
    void runHardProblems() {
        cout << "\n=== HARD LEVEL PROBLEMS ===" << endl;
        
        HardBacktrackingProblems hard;
        
        // Problem 8: N-Queens
        cout << "\n8. N-Queens (n=4):" << endl;
        auto queens = hard.solveNQueens(4);
        cout << "  Found " << queens.size() << " solutions:" << endl;
        for (size_t i = 0; i < min(queens.size(), size_t(2)); i++) {
            cout << "  Solution " << (i + 1) << ":" << endl;
            for (const string& row : queens[i]) {
                cout << "    " << row << endl;
            }
        }
        
        // Problem 9: Sudoku Solver
        cout << "\n9. Sudoku Solver:" << endl;
        vector<vector<char>> sudoku = {
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
        hard.solveSudoku(sudoku);
        cout << "  Solved Sudoku:" << endl;
        for (const auto& row : sudoku) {
            cout << "    ";
            for (char c : row) {
                cout << c << " ";
            }
            cout << endl;
        }
        
        // Problem 11: Expression Add Operators
        cout << "\n11. Expression Add Operators (\"123\", target=6):" << endl;
        auto expressions = hard.addOperators("123", 6);
        for (const string& expr : expressions) {
            cout << "  \"" << expr << "\"" << endl;
        }
        
        // Problem 12: Restore IP Addresses
        cout << "\n12. Restore IP Addresses (\"25525511135\"):" << endl;
        auto ips = hard.restoreIpAddresses("25525511135");
        for (const string& ip : ips) {
            cout << "  \"" << ip << "\"" << endl;
        }
    }
    
    void runAllProblems() {
        cout << "Backtracking Practice Problems Solutions" << endl;
        cout << "=========================================" << endl;
        
        runEasyProblems();
        runMediumProblems();
        runHardProblems();
        
        cout << "\n=== SUMMARY ===" << endl;
        cout << "✓ Easy Problems: Generate Parentheses, Letter Combinations, Subsets" << endl;
        cout << "✓ Medium Problems: Permutations, Combination Sum, Word Search, Palindrome Partitioning" << endl;
        cout << "✓ Hard Problems: N-Queens, Sudoku, Expression Add Operators, Restore IP Addresses" << endl;
        cout << "\nKey Techniques Demonstrated:" << endl;
        cout << "• Systematic exploration of solution space" << endl;
        cout << "• Backtracking with state restoration" << endl;
        cout << "• Pruning to eliminate impossible paths" << endl;
        cout << "• Constraint satisfaction and validation" << endl;
        cout << "• String manipulation and parsing" << endl;
    }
};

int main() {
    BacktrackingPracticeDemo demo;
    demo.runAllProblems();
    return 0;
}
