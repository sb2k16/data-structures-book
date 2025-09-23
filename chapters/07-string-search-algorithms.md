# Chapter 7: String Search Algorithms

## 7.1 Introduction to String Search

String search algorithms are fundamental tools in computer science for finding patterns within text. These algorithms are essential for text processing, data mining, bioinformatics, and many other applications where pattern matching is required.

### Key Concepts

- **Text (T)**: The string in which we search for patterns
- **Pattern (P)**: The string we want to find
- **Match**: An occurrence of the pattern in the text
- **Prefix**: A substring starting from the beginning of a string
- **Suffix**: A substring ending at the end of a string

### Problem Statement

Given a text string `T` of length `n` and a pattern string `P` of length `m`, find all occurrences of `P` in `T`.

## 7.2 Naive String Search Algorithm

The naive approach checks every possible position in the text for the pattern.

### Algorithm Description
1. Slide the pattern over the text one position at a time
2. At each position, compare the pattern with the corresponding substring
3. If all characters match, record the position as a match

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Naive string search - O(n*m) time complexity
vector<int> naiveSearch(const string& text, const string& pattern) {
    vector<int> matches;
    int n = text.length();
    int m = pattern.length();
    
    // Check every possible starting position
    for (int i = 0; i <= n - m; i++) {
        int j;
        // Check if pattern matches at position i
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        
        // If we reached the end of pattern, it's a match
        if (j == m) {
            matches.push_back(i);
        }
    }
    
    return matches;
}

// Optimized naive search with early termination
vector<int> naiveSearchOptimized(const string& text, const string& pattern) {
    vector<int> matches;
    int n = text.length();
    int m = pattern.length();
    
    for (int i = 0; i <= n - m; i++) {
        bool found = true;
        
        for (int j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                found = false;
                break;
            }
        }
        
        if (found) {
            matches.push_back(i);
        }
    }
    
    return matches;
}

// Example usage
void demonstrateNaiveSearch() {
    string text = "ABABCABABDABABCABAB";
    string pattern = "ABABCABAB";
    
    vector<int> matches = naiveSearch(text, pattern);
    
    cout << "Text: " << text << endl;
    cout << "Pattern: " << pattern << endl;
    cout << "Matches found at positions: ";
    for (int pos : matches) {
        cout << pos << " ";
    }
    cout << endl;
}
```

### Time and Space Complexity
- **Time Complexity**: O(n*m) in the worst case
- **Space Complexity**: O(1) excluding the result array
- **Best Case**: O(n) when no matches are found
- **Worst Case**: O(n*m) when pattern appears at every position

## 7.3 Rabin-Karp Algorithm

The Rabin-Karp algorithm uses hashing to find the pattern. It's based on the idea that if two strings are equal, their hash values must also be equal.

### Algorithm Description
1. Calculate hash value of the pattern
2. Calculate hash value of the first window of text
3. Slide the window one position at a time and update the hash
4. Compare hash values; if they match, verify character by character

```cpp
#include <string>
#include <vector>
#include <cmath>
using namespace std;

class RabinKarp {
private:
    static const int BASE = 256;  // Base for hash calculation
    static const int MOD = 101;   // Modulo to prevent overflow
    
    // Calculate hash value for a string
    long long calculateHash(const string& str, int length) {
        long long hash = 0;
        for (int i = 0; i < length; i++) {
            hash = (hash * BASE + str[i]) % MOD;
        }
        return hash;
    }
    
    // Calculate hash for next window using rolling hash
    long long recalculateHash(long long oldHash, char oldChar, char newChar, int patternLength) {
        long long newHash = (oldHash - oldChar * pow(BASE, patternLength - 1)) % MOD;
        newHash = (newHash * BASE + newChar) % MOD;
        return (newHash + MOD) % MOD;  // Ensure positive
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0 || m > n) {
            return matches;
        }
        
        // Calculate hash of pattern and first window
        long long patternHash = calculateHash(pattern, m);
        long long textHash = calculateHash(text, m);
        
        // Check first window
        if (patternHash == textHash && text.substr(0, m) == pattern) {
            matches.push_back(0);
        }
        
        // Slide the window
        for (int i = 1; i <= n - m; i++) {
            // Calculate hash for current window
            textHash = recalculateHash(textHash, text[i - 1], text[i + m - 1], m);
            
            // If hashes match, verify character by character
            if (patternHash == textHash && text.substr(i, m) == pattern) {
                matches.push_back(i);
            }
        }
        
        return matches;
    }
};

// Optimized Rabin-Karp with better hash function
class OptimizedRabinKarp {
private:
    static const int BASE = 256;
    static const int MOD = 1000000007;  // Large prime number
    
    long long power;
    
    long long calculateHash(const string& str, int length) {
        long long hash = 0;
        for (int i = 0; i < length; i++) {
            hash = (hash * BASE + str[i]) % MOD;
        }
        return hash;
    }
    
    long long recalculateHash(long long oldHash, char oldChar, char newChar) {
        long long newHash = (oldHash - oldChar * power) % MOD;
        newHash = (newHash * BASE + newChar) % MOD;
        return (newHash + MOD) % MOD;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0 || m > n) {
            return matches;
        }
        
        // Precompute power for rolling hash
        power = 1;
        for (int i = 0; i < m - 1; i++) {
            power = (power * BASE) % MOD;
        }
        
        long long patternHash = calculateHash(pattern, m);
        long long textHash = calculateHash(text, m);
        
        if (patternHash == textHash && text.substr(0, m) == pattern) {
            matches.push_back(0);
        }
        
        for (int i = 1; i <= n - m; i++) {
            textHash = recalculateHash(textHash, text[i - 1], text[i + m - 1]);
            
            if (patternHash == textHash && text.substr(i, m) == pattern) {
                matches.push_back(i);
            }
        }
        
        return matches;
    }
};
```

### Time and Space Complexity
- **Average Time Complexity**: O(n + m)
- **Worst Time Complexity**: O(n*m) due to hash collisions
- **Space Complexity**: O(1)
- **Best Case**: O(n + m) when no hash collisions occur

## 7.4 Knuth-Morris-Pratt (KMP) Algorithm

The KMP algorithm uses information from previous matches to avoid unnecessary comparisons. It preprocesses the pattern to create a failure function (LPS array).

### Algorithm Description
1. Preprocess the pattern to create the Longest Proper Prefix which is also Suffix (LPS) array
2. Use the LPS array to skip characters that are guaranteed to match
3. When a mismatch occurs, use the LPS array to determine the next position to check

```cpp
class KMPAlgorithm {
private:
    // Build the Longest Proper Prefix which is also Suffix array
    vector<int> buildLPS(const string& pattern) {
        int m = pattern.length();
        vector<int> lps(m, 0);
        int len = 0;  // Length of the previous longest prefix suffix
        int i = 1;
        
        while (i < m) {
            if (pattern[i] == pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        return lps;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) {
            return matches;
        }
        
        // Build LPS array
        vector<int> lps = buildLPS(pattern);
        
        int i = 0;  // Index for text
        int j = 0;  // Index for pattern
        
        while (i < n) {
            if (pattern[j] == text[i]) {
                i++;
                j++;
            }
            
            if (j == m) {
                matches.push_back(i - j);
                j = lps[j - 1];
            } else if (i < n && pattern[j] != text[i]) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
    
    // Count occurrences of pattern in text
    int countOccurrences(const string& text, const string& pattern) {
        vector<int> matches = search(text, pattern);
        return matches.size();
    }
    
    // Find all overlapping occurrences
    vector<int> findAllOccurrences(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) {
            return matches;
        }
        
        vector<int> lps = buildLPS(pattern);
        int i = 0, j = 0;
        
        while (i < n) {
            if (pattern[j] == text[i]) {
                i++;
                j++;
            }
            
            if (j == m) {
                matches.push_back(i - j);
                j = lps[j - 1];  // Continue searching for overlapping matches
            } else if (i < n && pattern[j] != text[i]) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
};
```

### Time and Space Complexity
- **Time Complexity**: O(n + m)
- **Space Complexity**: O(m) for the LPS array
- **Preprocessing Time**: O(m)
- **Searching Time**: O(n)

## 7.5 Boyer-Moore Algorithm

The Boyer-Moore algorithm is often the fastest in practice for large texts. It uses two heuristics: the Bad Character Rule and the Good Suffix Rule.

### Algorithm Description
1. Compare pattern with text from right to left
2. When a mismatch occurs, use the Bad Character Rule to shift the pattern
3. Use the Good Suffix Rule for additional optimization

```cpp
class BoyerMoore {
private:
    // Bad Character Rule: create a table of the rightmost occurrence of each character
    vector<int> buildBadCharTable(const string& pattern) {
        vector<int> badChar(256, -1);
        int m = pattern.length();
        
        for (int i = 0; i < m; i++) {
            badChar[pattern[i]] = i;
        }
        
        return badChar;
    }
    
    // Good Suffix Rule: create suffix array
    vector<int> buildSuffixArray(const string& pattern) {
        int m = pattern.length();
        vector<int> suffix(m, 0);
        vector<int> border(m, 0);
        
        // Find borders
        int i = m, j = m + 1;
        border[i] = j;
        
        while (i > 0) {
            while (j <= m && pattern[i - 1] != pattern[j - 1]) {
                if (suffix[j] == 0) {
                    suffix[j] = j - i;
                }
                j = border[j];
            }
            i--;
            j--;
            border[i] = j;
        }
        
        // Fill remaining entries
        j = border[0];
        for (i = 0; i <= m; i++) {
            if (suffix[i] == 0) {
                suffix[i] = j;
            }
            if (i == j) {
                j = border[j];
            }
        }
        
        return suffix;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) {
            return matches;
        }
        
        vector<int> badChar = buildBadCharTable(pattern);
        vector<int> suffix = buildSuffixArray(pattern);
        
        int s = 0;  // Shift of pattern with respect to text
        
        while (s <= n - m) {
            int j = m - 1;
            
            // Keep reducing index j while characters match
            while (j >= 0 && pattern[j] == text[s + j]) {
                j--;
            }
            
            if (j < 0) {
                matches.push_back(s);
                s += (s + m < n) ? m - badChar[text[s + m]] : 1;
            } else {
                s += max(1, j - badChar[text[s + j]]);
            }
        }
        
        return matches;
    }
    
    // Simplified Boyer-Moore with only Bad Character Rule
    vector<int> searchSimple(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0) {
            return matches;
        }
        
        vector<int> badChar = buildBadCharTable(pattern);
        int s = 0;
        
        while (s <= n - m) {
            int j = m - 1;
            
            while (j >= 0 && pattern[j] == text[s + j]) {
                j--;
            }
            
            if (j < 0) {
                matches.push_back(s);
                s += (s + m < n) ? m - badChar[text[s + m]] : 1;
            } else {
                s += max(1, j - badChar[text[s + j]]);
            }
        }
        
        return matches;
    }
};
```

### Time and Space Complexity
- **Best Case Time Complexity**: O(n/m)
- **Worst Case Time Complexity**: O(n*m)
- **Average Time Complexity**: O(n)
- **Space Complexity**: O(m)

## 7.6 Z-Algorithm

The Z-Algorithm finds all occurrences of a pattern in a text by constructing a Z-array that contains the length of the longest substring starting from each position that is also a prefix.

### Algorithm Description
1. Create a combined string: pattern + '$' + text
2. Build Z-array for the combined string
3. Find positions where Z-value equals pattern length

```cpp
class ZAlgorithm {
private:
    // Build Z-array for a given string
    vector<int> buildZArray(const string& str) {
        int n = str.length();
        vector<int> z(n, 0);
        int l = 0, r = 0;  // Left and right boundaries of the Z-box
        
        for (int i = 1; i < n; i++) {
            if (i <= r) {
                z[i] = min(r - i + 1, z[i - l]);
            }
            
            while (i + z[i] < n && str[z[i]] == str[i + z[i]]) {
                z[i]++;
            }
            
            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }
        }
        
        return z;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int m = pattern.length();
        int n = text.length();
        
        if (m == 0) {
            return matches;
        }
        
        // Create combined string: pattern + '$' + text
        string combined = pattern + '$' + text;
        vector<int> z = buildZArray(combined);
        
        // Find positions where Z-value equals pattern length
        for (int i = m + 1; i < combined.length(); i++) {
            if (z[i] == m) {
                matches.push_back(i - m - 1);
            }
        }
        
        return matches;
    }
    
    // Find all occurrences of pattern in text (including overlapping)
    vector<int> findAllOccurrences(const string& text, const string& pattern) {
        return search(text, pattern);
    }
    
    // Count occurrences
    int countOccurrences(const string& text, const string& pattern) {
        vector<int> matches = search(text, pattern);
        return matches.size();
    }
};
```

### Time and Space Complexity
- **Time Complexity**: O(n + m)
- **Space Complexity**: O(n + m)
- **Preprocessing Time**: O(n + m)
- **Searching Time**: O(n + m)

## 7.7 Aho-Corasick Algorithm

The Aho-Corasick algorithm efficiently searches for multiple patterns simultaneously using a finite automaton.

### Algorithm Description
1. Build a trie from all patterns
2. Add failure links to create an automaton
3. Traverse the automaton while reading the text

```cpp
#include <queue>
#include <unordered_map>
using namespace std;

class AhoCorasick {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        TrieNode* failure;
        vector<int> output;  // Pattern indices ending at this node
        bool isEnd;
        
        TrieNode() : failure(nullptr), isEnd(false) {}
    };
    
    TrieNode* root;
    vector<string> patterns;
    
    // Build the trie
    void buildTrie() {
        root = new TrieNode();
        
        for (int i = 0; i < patterns.size(); i++) {
            TrieNode* current = root;
            
            for (char c : patterns[i]) {
                if (current->children.find(c) == current->children.end()) {
                    current->children[c] = new TrieNode();
                }
                current = current->children[c];
            }
            
            current->isEnd = true;
            current->output.push_back(i);
        }
    }
    
    // Build failure links using BFS
    void buildFailureLinks() {
        queue<TrieNode*> q;
        
        // Initialize failure links for first level
        for (auto& pair : root->children) {
            pair.second->failure = root;
            q.push(pair.second);
        }
        
        while (!q.empty()) {
            TrieNode* current = q.front();
            q.pop();
            
            for (auto& pair : current->children) {
                char c = pair.first;
                TrieNode* child = pair.second;
                q.push(child);
                
                TrieNode* failure = current->failure;
                
                while (failure != nullptr && failure->children.find(c) == failure->children.end()) {
                    failure = failure->failure;
                }
                
                if (failure != nullptr) {
                    child->failure = failure->children[c];
                } else {
                    child->failure = root;
                }
                
                // Merge output
                child->output.insert(child->output.end(), 
                                   child->failure->output.begin(), 
                                   child->failure->output.end());
            }
        }
    }
    
public:
    AhoCorasick(const vector<string>& patterns) : patterns(patterns) {
        buildTrie();
        buildFailureLinks();
    }
    
    // Search for all patterns in text
    unordered_map<string, vector<int>> search(const string& text) {
        unordered_map<string, vector<int>> results;
        TrieNode* current = root;
        
        for (int i = 0; i < text.length(); i++) {
            char c = text[i];
            
            while (current != nullptr && current->children.find(c) == current->children.end()) {
                current = current->failure;
            }
            
            if (current != nullptr) {
                current = current->children[c];
            } else {
                current = root;
            }
            
            // Check for matches
            for (int patternIndex : current->output) {
                string pattern = patterns[patternIndex];
                int startPos = i - pattern.length() + 1;
                results[pattern].push_back(startPos);
            }
        }
        
        return results;
    }
    
    ~AhoCorasick() {
        // Clean up memory (simplified)
        delete root;
    }
};
```

### Time and Space Complexity
- **Time Complexity**: O(n + m + z) where z is the number of matches
- **Space Complexity**: O(m) where m is the total length of all patterns
- **Preprocessing Time**: O(m)

## 7.8 Performance Comparison

### Algorithm Comparison Table

| Algorithm | Time Complexity | Space Complexity | Best Use Case |
|-----------|----------------|------------------|---------------|
| Naive | O(n*m) | O(1) | Simple cases, small patterns |
| Rabin-Karp | O(n+m) avg, O(n*m) worst | O(1) | Multiple pattern search |
| KMP | O(n+m) | O(m) | Single pattern, general purpose |
| Boyer-Moore | O(n/m) best, O(n*m) worst | O(m) | Large texts, single pattern |
| Z-Algorithm | O(n+m) | O(n+m) | Pattern preprocessing |
| Aho-Corasick | O(n+m+z) | O(m) | Multiple patterns |

### When to Use Which Algorithm

1. **Naive**: Simple implementations, small datasets
2. **Rabin-Karp**: Multiple pattern search, rolling hash applications
3. **KMP**: General-purpose single pattern search
4. **Boyer-Moore**: Large texts, single pattern search
5. **Z-Algorithm**: Pattern preprocessing, string analysis
6. **Aho-Corasick**: Multiple pattern search, text mining

## 7.9 Practical Applications

### Text Processing
```cpp
// Find all occurrences of a word in a document
vector<int> findWordInDocument(const string& document, const string& word) {
    KMPAlgorithm kmp;
    return kmp.search(document, word);
}

// Replace all occurrences of a pattern
string replaceAll(const string& text, const string& pattern, const string& replacement) {
    KMPAlgorithm kmp;
    vector<int> matches = kmp.search(text, pattern);
    
    string result = text;
    int offset = 0;
    
    for (int pos : matches) {
        result.replace(pos + offset, pattern.length(), replacement);
        offset += replacement.length() - pattern.length();
    }
    
    return result;
}
```

### DNA Sequence Analysis
```cpp
// Find patterns in DNA sequences
vector<int> findDNASequence(const string& dna, const string& pattern) {
    // DNA sequences are typically large, so Boyer-Moore is often best
    BoyerMoore bm;
    return bm.search(dna, pattern);
}

// Find multiple patterns in DNA
unordered_map<string, vector<int>> findMultiplePatterns(
    const string& dna, 
    const vector<string>& patterns) {
    AhoCorasick ac(patterns);
    return ac.search(dna);
}
```

## 7.10 Key Takeaways

1. **String search algorithms** vary significantly in performance characteristics
2. **KMP algorithm** provides consistent O(n+m) performance for single patterns
3. **Boyer-Moore** is often fastest in practice for large texts
4. **Rabin-Karp** is useful for multiple pattern search with rolling hash
5. **Aho-Corasick** efficiently handles multiple pattern search
6. **Algorithm choice** depends on text size, pattern characteristics, and use case

## 7.11 Exercises

1. Implement a case-insensitive string search algorithm.
2. Modify the KMP algorithm to find non-overlapping occurrences only.
3. Create a function that finds the longest common substring between two strings.
4. Implement a string search algorithm that handles wildcard characters.
5. Write a program to find all anagrams of a pattern in a text.

## 7.12 Summary

String search algorithms are essential tools for pattern matching in text processing. From the simple naive approach to sophisticated algorithms like KMP and Boyer-Moore, each algorithm has its strengths and optimal use cases. Understanding these algorithms provides a solid foundation for text processing, data mining, and many other applications that require efficient pattern matching.

The choice of algorithm depends on factors such as text size, pattern characteristics, and whether single or multiple patterns need to be searched. Mastery of these algorithms is crucial for anyone working with text processing or string manipulation tasks.
