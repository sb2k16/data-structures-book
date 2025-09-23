/**
 * Backtracking Practice Problems Test Suite
 * 
 * This file contains comprehensive tests for all backtracking practice problems
 * from Chapter 12, including edge cases and performance validation.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o backtracking_tests backtracking_tests.cpp
 * Run with: ./backtracking_tests
 */

#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <chrono>
#include <cassert>
#include <numeric>
using namespace std;

// Include the solutions (in a real project, this would be a separate header)
// For this demo, we'll include the key functions inline

// Test framework
class TestFramework {
private:
    int testsRun = 0;
    int testsPassed = 0;
    
public:
    void assertTrue(bool condition, const string& testName) {
        testsRun++;
        if (condition) {
            testsPassed++;
            cout << "✓ " << testName << endl;
        } else {
            cout << "✗ " << testName << " FAILED" << endl;
        }
    }
    
    void assertEquals(const vector<string>& expected, const vector<string>& actual, const string& testName) {
        testsRun++;
        if (expected.size() != actual.size()) {
            cout << "✗ " << testName << " FAILED - Size mismatch" << endl;
            return;
        }
        
        unordered_set<string> expectedSet(expected.begin(), expected.end());
        unordered_set<string> actualSet(actual.begin(), actual.end());
        
        if (expectedSet == actualSet) {
            testsPassed++;
            cout << "✓ " << testName << endl;
        } else {
            cout << "✗ " << testName << " FAILED - Content mismatch" << endl;
        }
    }
    
    void assertEquals(const vector<vector<int>>& expected, const vector<vector<int>>& actual, const string& testName) {
        testsRun++;
        if (expected.size() != actual.size()) {
            cout << "✗ " << testName << " FAILED - Size mismatch" << endl;
            return;
        }
        
        // Convert to sets for comparison
        unordered_set<string> expectedSet;
        unordered_set<string> actualSet;
        
        for (const auto& vec : expected) {
            string key = "";
            for (int val : vec) {
                key += to_string(val) + ",";
            }
            expectedSet.insert(key);
        }
        
        for (const auto& vec : actual) {
            string key = "";
            for (int val : vec) {
                key += to_string(val) + ",";
            }
            actualSet.insert(key);
        }
        
        if (expectedSet == actualSet) {
            testsPassed++;
            cout << "✓ " << testName << endl;
        } else {
            cout << "✗ " << testName << " FAILED - Content mismatch" << endl;
        }
    }
    
    void printResults() {
        cout << "\n=== TEST RESULTS ===" << endl;
        cout << "Tests Run: " << testsRun << endl;
        cout << "Tests Passed: " << testsPassed << endl;
        cout << "Tests Failed: " << (testsRun - testsPassed) << endl;
        cout << "Success Rate: " << (testsPassed * 100.0 / testsRun) << "%" << endl;
    }
};

// Simplified versions of the backtracking functions for testing
class BacktrackingSolutions {
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
        if (open == 0 && close == 0) {
            result.push_back(current);
            return;
        }
        if (open > 0) {
            current.push_back('(');
            generateParenthesesHelper(open - 1, close, current, result);
            current.pop_back();
        }
        if (close > open) {
            current.push_back(')');
            generateParenthesesHelper(open, close - 1, current, result);
            current.pop_back();
        }
    }
    
public:
    // Problem 2: Letter Combinations
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
        if (index == static_cast<int>(digits.length())) {
            result.push_back(current);
            return;
        }
        string letters = mapping[digits[index] - '0'];
        for (char letter : letters) {
            current.push_back(letter);
            letterCombinationsHelper(digits, index + 1, current, result, mapping);
            current.pop_back();
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
        result.push_back(current);
        for (int i = index; i < static_cast<int>(nums.size()); i++) {
            current.push_back(nums[i]);
            subsetsHelper(nums, i + 1, current, result);
            current.pop_back();
        }
    }
    
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
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        for (size_t i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                used[i] = true;
                current.push_back(nums[i]);
                permutationsHelper(nums, current, used, result);
                current.pop_back();
                used[i] = false;
            }
        }
    }
    
public:
    // Problem 5: Combination Sum
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        sort(candidates.begin(), candidates.end());
        combinationSumHelper(candidates, target, 0, current, result);
        return result;
    }
    
private:
    void combinationSumHelper(const vector<int>& candidates, int target, int index,
                             vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        for (int i = index; i < static_cast<int>(candidates.size()); i++) {
            if (candidates[i] > target) break;
            current.push_back(candidates[i]);
            combinationSumHelper(candidates, target - candidates[i], i, current, result);
            current.pop_back();
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
        if (index == static_cast<int>(word.length())) return true;
        if (row < 0 || row >= static_cast<int>(board.size()) || col < 0 || col >= static_cast<int>(board[0].size()) ||
            board[row][col] != word[index]) {
            return false;
        }
        char temp = board[row][col];
        board[row][col] = '#';
        bool found = wordSearchHelper(board, word, index + 1, row + 1, col) ||
                    wordSearchHelper(board, word, index + 1, row - 1, col) ||
                    wordSearchHelper(board, word, index + 1, row, col + 1) ||
                    wordSearchHelper(board, word, index + 1, row, col - 1);
        board[row][col] = temp;
        return found;
    }
};

// Test cases
class BacktrackingTests {
private:
    TestFramework framework;
    BacktrackingSolutions solutions;
    
public:
    void testGenerateParentheses() {
        cout << "=== Testing Generate Parentheses ===" << endl;
        
        // Test case 1: n = 1
        vector<string> result1 = solutions.generateParentheses(1);
        vector<string> expected1 = {"()"};
        framework.assertEquals(expected1, result1, "Generate Parentheses n=1");
        
        // Test case 2: n = 2
        vector<string> result2 = solutions.generateParentheses(2);
        vector<string> expected2 = {"(())", "()()"};
        framework.assertEquals(expected2, result2, "Generate Parentheses n=2");
        
        // Test case 3: n = 3
        vector<string> result3 = solutions.generateParentheses(3);
        vector<string> expected3 = {"((()))", "(()())", "(())()", "()(())", "()()()"};
        framework.assertEquals(expected3, result3, "Generate Parentheses n=3");
        
        // Test edge case: n = 0
        vector<string> result0 = solutions.generateParentheses(0);
        vector<string> expected0 = {""};
        framework.assertEquals(expected0, result0, "Generate Parentheses n=0");
    }
    
    void testLetterCombinations() {
        cout << "\n=== Testing Letter Combinations ===" << endl;
        
        // Test case 1: "2"
        vector<string> result1 = solutions.letterCombinations("2");
        vector<string> expected1 = {"a", "b", "c"};
        framework.assertEquals(expected1, result1, "Letter Combinations \"2\"");
        
        // Test case 2: "23"
        vector<string> result2 = solutions.letterCombinations("23");
        vector<string> expected2 = {"ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"};
        framework.assertEquals(expected2, result2, "Letter Combinations \"23\"");
        
        // Test edge case: empty string
        vector<string> result0 = solutions.letterCombinations("");
        vector<string> expected0 = {};
        framework.assertEquals(expected0, result0, "Letter Combinations empty string");
    }
    
    void testSubsets() {
        cout << "\n=== Testing Subsets ===" << endl;
        
        // Test case 1: [1,2,3]
        vector<int> nums1 = {1, 2, 3};
        vector<vector<int>> result1 = solutions.subsets(nums1);
        vector<vector<int>> expected1 = {{}, {1}, {2}, {1,2}, {3}, {1,3}, {2,3}, {1,2,3}};
        framework.assertEquals(expected1, result1, "Subsets [1,2,3]");
        
        // Test case 2: [0]
        vector<int> nums2 = {0};
        vector<vector<int>> result2 = solutions.subsets(nums2);
        vector<vector<int>> expected2 = {{}, {0}};
        framework.assertEquals(expected2, result2, "Subsets [0]");
        
        // Test case 3: empty array
        vector<int> nums3 = {};
        vector<vector<int>> result3 = solutions.subsets(nums3);
        vector<vector<int>> expected3 = {{}};
        framework.assertEquals(expected3, result3, "Subsets empty array");
    }
    
    void testPermutations() {
        cout << "\n=== Testing Permutations ===" << endl;
        
        // Test case 1: [1,2,3]
        vector<int> nums1 = {1, 2, 3};
        vector<vector<int>> result1 = solutions.permutations(nums1);
        vector<vector<int>> expected1 = {{1,2,3}, {1,3,2}, {2,1,3}, {2,3,1}, {3,1,2}, {3,2,1}};
        framework.assertEquals(expected1, result1, "Permutations [1,2,3]");
        
        // Test case 2: [0,1]
        vector<int> nums2 = {0, 1};
        vector<vector<int>> result2 = solutions.permutations(nums2);
        vector<vector<int>> expected2 = {{0,1}, {1,0}};
        framework.assertEquals(expected2, result2, "Permutations [0,1]");
        
        // Test case 3: [1]
        vector<int> nums3 = {1};
        vector<vector<int>> result3 = solutions.permutations(nums3);
        vector<vector<int>> expected3 = {{1}};
        framework.assertEquals(expected3, result3, "Permutations [1]");
    }
    
    void testCombinationSum() {
        cout << "\n=== Testing Combination Sum ===" << endl;
        
        // Test case 1: [2,3,6,7], target = 7
        vector<int> candidates1 = {2, 3, 6, 7};
        vector<vector<int>> result1 = solutions.combinationSum(candidates1, 7);
        vector<vector<int>> expected1 = {{2,2,3}, {7}};
        framework.assertEquals(expected1, result1, "Combination Sum [2,3,6,7] target=7");
        
        // Test case 2: [2,3,5], target = 8
        vector<int> candidates2 = {2, 3, 5};
        vector<vector<int>> result2 = solutions.combinationSum(candidates2, 8);
        vector<vector<int>> expected2 = {{2,2,2,2}, {2,3,3}, {3,5}};
        framework.assertEquals(expected2, result2, "Combination Sum [2,3,5] target=8");
        
        // Test case 3: [2], target = 1
        vector<int> candidates3 = {2};
        vector<vector<int>> result3 = solutions.combinationSum(candidates3, 1);
        vector<vector<int>> expected3 = {};
        framework.assertEquals(expected3, result3, "Combination Sum [2] target=1");
    }
    
    void testWordSearch() {
        cout << "\n=== Testing Word Search ===" << endl;
        
        // Test case 1: Valid word
        vector<vector<char>> board1 = {
            {'A','B','C','E'},
            {'S','F','C','S'},
            {'A','D','E','E'}
        };
        string word1 = "ABCCED";
        bool result1 = solutions.wordSearch(board1, word1);
        framework.assertTrue(result1, "Word Search \"ABCCED\" - should find");
        
        // Test case 2: Invalid word
        vector<vector<char>> board2 = {
            {'A','B','C','E'},
            {'S','F','C','S'},
            {'A','D','E','E'}
        };
        string word2 = "ABCB";
        bool result2 = solutions.wordSearch(board2, word2);
        framework.assertTrue(!result2, "Word Search \"ABCB\" - should not find");
        
        // Test case 3: Single character
        vector<vector<char>> board3 = {{'A'}};
        string word3 = "A";
        bool result3 = solutions.wordSearch(board3, word3);
        framework.assertTrue(result3, "Word Search single character");
    }
    
    void testPerformance() {
        cout << "\n=== Performance Tests ===" << endl;
        
        // Test Generate Parentheses performance
        auto start = chrono::high_resolution_clock::now();
        vector<string> result = solutions.generateParentheses(8);
        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);
        
        framework.assertTrue(result.size() == 1430, "Generate Parentheses n=8 size check");
        cout << "✓ Generate Parentheses n=8 completed in " << duration.count() << "ms" << endl;
        
        // Test Subsets performance
        vector<int> largeNums(10);
        iota(largeNums.begin(), largeNums.end(), 1); // [1,2,3,...,10]
        
        start = chrono::high_resolution_clock::now();
        vector<vector<int>> subsets = solutions.subsets(largeNums);
        end = chrono::high_resolution_clock::now();
        duration = chrono::duration_cast<chrono::milliseconds>(end - start);
        
        framework.assertTrue(subsets.size() == 1024, "Subsets size check (2^10)");
        cout << "✓ Subsets of 10 elements completed in " << duration.count() << "ms" << endl;
    }
    
    void runAllTests() {
        cout << "Backtracking Practice Problems Test Suite" << endl;
        cout << "=========================================" << endl;
        
        testGenerateParentheses();
        testLetterCombinations();
        testSubsets();
        testPermutations();
        testCombinationSum();
        testWordSearch();
        testPerformance();
        
        framework.printResults();
        
        cout << "\n=== Test Coverage ===" << endl;
        cout << "✓ Easy Problems: Generate Parentheses, Letter Combinations, Subsets" << endl;
        cout << "✓ Medium Problems: Permutations, Combination Sum, Word Search" << endl;
        cout << "✓ Performance Tests: Large input validation" << endl;
        cout << "✓ Edge Cases: Empty inputs, single elements, invalid cases" << endl;
    }
};

int main() {
    BacktrackingTests tests;
    tests.runAllTests();
    return 0;
}
