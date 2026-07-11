/**
 * String Search Algorithms Header
 * 
 * This header file contains all the string search algorithm implementations
 * used in the examples and benchmarks.
 */

#ifndef STRING_SEARCH_ALGORITHMS_HPP
#define STRING_SEARCH_ALGORITHMS_HPP

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <cmath>
#include <algorithm>
using namespace std;

// Naive String Search
vector<int> naiveSearch(const string& text, const string& pattern) {
    vector<int> matches;
    int n = text.length();
    int m = pattern.length();
    
    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        
        if (j == m) {
            matches.push_back(i);
        }
    }
    
    return matches;
}

// Rabin-Karp Algorithm
class RabinKarp {
private:
    static const int BASE = 256;
    static const int MOD = 1000000007;

    long long recalculateHash(long long oldHash, char oldChar, char newChar, long long power) {
        long long newHash = (oldHash - oldChar * power) % MOD;
        newHash = (newHash * BASE + newChar) % MOD;
        return (newHash + MOD) % MOD;
    }

public:
    // Public so demos can display window hashes; it computes, it doesn't mutate.
    long long calculateHash(const string& str, int length) {
        long long hash = 0;
        for (int i = 0; i < length; i++) {
            hash = (hash * BASE + str[i]) % MOD;
        }
        return hash;
    }

    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0 || m > n) {
            return matches;
        }
        
        long long power = 1;
        for (int i = 0; i < m - 1; i++) {
            power = (power * BASE) % MOD;
        }
        
        long long patternHash = calculateHash(pattern, m);
        long long textHash = calculateHash(text, m);
        
        if (patternHash == textHash && text.substr(0, m) == pattern) {
            matches.push_back(0);
        }
        
        for (int i = 1; i <= n - m; i++) {
            textHash = recalculateHash(textHash, text[i - 1], text[i + m - 1], power);
            
            if (patternHash == textHash && text.substr(i, m) == pattern) {
                matches.push_back(i);
            }
        }
        
        return matches;
    }
};

// KMP Algorithm
class KMPAlgorithm {
private:
    vector<int> buildLPS(const string& pattern) {
        int m = pattern.length();
        vector<int> lps(m, 0);
        int len = 0;
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
        
        vector<int> lps = buildLPS(pattern);
        int i = 0, j = 0;
        
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
};

// Boyer-Moore Algorithm
class BoyerMoore {
private:
    vector<int> buildBadCharTable(const string& pattern) {
        vector<int> badChar(256, -1);
        int m = pattern.length();
        
        for (int i = 0; i < m; i++) {
            badChar[pattern[i]] = i;
        }
        
        return badChar;
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

// Z-Algorithm
class ZAlgorithm {
private:
    vector<int> buildZArray(const string& str) {
        int n = str.length();
        vector<int> z(n, 0);
        int l = 0, r = 0;
        
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
        
        string combined = pattern + '$' + text;
        vector<int> z = buildZArray(combined);
        
        for (int i = m + 1; i < combined.length(); i++) {
            if (z[i] == m) {
                matches.push_back(i - m - 1);
            }
        }
        
        return matches;
    }
};

// Aho-Corasick Algorithm
class AhoCorasick {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        TrieNode* failure;
        vector<int> output;
        bool isEnd;
        
        TrieNode() : failure(nullptr), isEnd(false) {}
    };
    
    TrieNode* root;
    vector<string> patterns;
    
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
    
    void buildFailureLinks() {
        queue<TrieNode*> q;
        
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
            
            for (int patternIndex : current->output) {
                string pattern = patterns[patternIndex];
                int startPos = i - pattern.length() + 1;
                results[pattern].push_back(startPos);
            }
        }
        
        return results;
    }
    
    ~AhoCorasick() {
        // Simplified cleanup
        delete root;
    }
};

#endif // STRING_SEARCH_ALGORITHMS_HPP
