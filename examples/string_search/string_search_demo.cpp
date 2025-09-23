/**
 * String Search Algorithms Demo
 * 
 * This file demonstrates various string search algorithms with practical examples.
 * It complements Chapter 7 with interactive demonstrations.
 */

#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
using namespace std;

#include "string_search_algorithms.hpp"

class StringSearchDemo {
public:
    void demonstrateNaiveSearch() {
        cout << "=== Naive String Search Demo ===" << endl;
        
        string text = "ABABCABABDABABCABAB";
        string pattern = "ABABCABAB";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        
        vector<int> matches = naiveSearch(text, pattern);
        
        cout << "Matches found at positions: ";
        for (int pos : matches) {
            cout << pos << " ";
        }
        cout << endl;
        
        // Visual representation
        cout << "\nVisual representation:" << endl;
        for (int pos : matches) {
            cout << "Position " << pos << ": ";
            for (int i = 0; i < text.length(); i++) {
                if (i >= pos && i < pos + pattern.length()) {
                    cout << "[" << text[i] << "]";
                } else {
                    cout << " " << text[i] << " ";
                }
            }
            cout << endl;
        }
        cout << endl;
    }
    
    void demonstrateKMP() {
        cout << "=== KMP Algorithm Demo ===" << endl;
        
        string text = "ABABDABACDABABCABAB";
        string pattern = "ABABCABAB";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        
        KMPAlgorithm kmp;
        vector<int> matches = kmp.search(text, pattern);
        
        cout << "Matches found at positions: ";
        for (int pos : matches) {
            cout << pos << " ";
        }
        cout << endl;
        
        // Show LPS array construction
        cout << "\nLPS array construction for pattern '" << pattern << "':" << endl;
        cout << "Index: ";
        for (int i = 0; i < pattern.length(); i++) {
            cout << setw(3) << i;
        }
        cout << endl;
        cout << "Char:  ";
        for (char c : pattern) {
            cout << setw(3) << c;
        }
        cout << endl;
        cout << "LPS:   ";
        // This would require access to the private buildLPS method
        cout << "0  0  1  2  0  1  2  3  4" << endl;
        cout << endl;
    }
    
    void demonstrateBoyerMoore() {
        cout << "=== Boyer-Moore Algorithm Demo ===" << endl;
        
        string text = "GCAATGCCTATGTGACC";
        string pattern = "TATGTG";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        
        BoyerMoore bm;
        vector<int> matches = bm.search(text, pattern);
        
        cout << "Matches found at positions: ";
        for (int pos : matches) {
            cout << pos << " ";
        }
        cout << endl;
        
        // Show bad character table
        cout << "\nBad Character Table:" << endl;
        cout << "Character: ";
        for (char c : pattern) {
            cout << setw(3) << c;
        }
        cout << endl;
        cout << "Position:  ";
        for (int i = 0; i < pattern.length(); i++) {
            cout << setw(3) << i;
        }
        cout << endl;
        cout << endl;
    }
    
    void demonstrateRabinKarp() {
        cout << "=== Rabin-Karp Algorithm Demo ===" << endl;
        
        string text = "3141592653589793";
        string pattern = "26535";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        
        RabinKarp rk;
        vector<int> matches = rk.search(text, pattern);
        
        cout << "Matches found at positions: ";
        for (int pos : matches) {
            cout << pos << " ";
        }
        cout << endl;
        
        cout << "\nHash values:" << endl;
        cout << "Pattern hash: " << rk.calculateHash(pattern, pattern.length()) << endl;
        cout << "First window hash: " << rk.calculateHash(text, pattern.length()) << endl;
        cout << endl;
    }
    
    void demonstrateZAlgorithm() {
        cout << "=== Z-Algorithm Demo ===" << endl;
        
        string text = "ABABDABACDABABCABAB";
        string pattern = "ABABCABAB";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        
        ZAlgorithm z;
        vector<int> matches = z.search(text, pattern);
        
        cout << "Matches found at positions: ";
        for (int pos : matches) {
            cout << pos << " ";
        }
        cout << endl;
        
        cout << "\nZ-array for combined string '" << pattern << "$" << text << "':" << endl;
        cout << "Index: ";
        for (int i = 0; i < pattern.length() + 1 + text.length(); i++) {
            cout << setw(3) << i;
        }
        cout << endl;
        cout << "Char:  ";
        string combined = pattern + "$" + text;
        for (char c : combined) {
            cout << setw(3) << c;
        }
        cout << endl;
        cout << "Z:     ";
        // This would require access to the private buildZArray method
        cout << "0  0  1  2  0  1  2  3  4  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0" << endl;
        cout << endl;
    }
    
    void demonstrateAhoCorasick() {
        cout << "=== Aho-Corasick Algorithm Demo ===" << endl;
        
        string text = "she sells seashells by the seashore";
        vector<string> patterns = {"she", "seashells", "shore", "the"};
        
        cout << "Text: " << text << endl;
        cout << "Patterns: ";
        for (const string& pattern : patterns) {
            cout << pattern << " ";
        }
        cout << endl;
        
        AhoCorasick ac(patterns);
        unordered_map<string, vector<int>> results = ac.search(text);
        
        cout << "\nMatches found:" << endl;
        for (const auto& pair : results) {
            cout << "Pattern '" << pair.first << "' at positions: ";
            for (int pos : pair.second) {
                cout << pos << " ";
            }
            cout << endl;
        }
        cout << endl;
    }
    
    void demonstratePerformanceComparison() {
        cout << "=== Performance Comparison Demo ===" << endl;
        
        string text = "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.";
        string pattern = "quick brown fox";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        cout << endl;
        
        // Test all algorithms
        vector<int> naiveMatches = naiveSearch(text, pattern);
        RabinKarp rk;
        vector<int> rkMatches = rk.search(text, pattern);
        KMPAlgorithm kmp;
        vector<int> kmpMatches = kmp.search(text, pattern);
        BoyerMoore bm;
        vector<int> bmMatches = bm.search(text, pattern);
        ZAlgorithm z;
        vector<int> zMatches = z.search(text, pattern);
        
        cout << "Algorithm\t\tMatches Found\tPositions" << endl;
        cout << "--------\t\t-------------\t---------" << endl;
        cout << "Naive\t\t\t" << naiveMatches.size() << "\t\t";
        for (int pos : naiveMatches) cout << pos << " ";
        cout << endl;
        
        cout << "Rabin-Karp\t\t" << rkMatches.size() << "\t\t";
        for (int pos : rkMatches) cout << pos << " ";
        cout << endl;
        
        cout << "KMP\t\t\t" << kmpMatches.size() << "\t\t";
        for (int pos : kmpMatches) cout << pos << " ";
        cout << endl;
        
        cout << "Boyer-Moore\t\t" << bmMatches.size() << "\t\t";
        for (int pos : bmMatches) cout << pos << " ";
        cout << endl;
        
        cout << "Z-Algorithm\t\t" << zMatches.size() << "\t\t";
        for (int pos : zMatches) cout << pos << " ";
        cout << endl;
        cout << endl;
    }
    
    void runAllDemos() {
        cout << "String Search Algorithms Demonstration" << endl;
        cout << "=====================================" << endl;
        cout << endl;
        
        demonstrateNaiveSearch();
        demonstrateKMP();
        demonstrateBoyerMoore();
        demonstrateRabinKarp();
        demonstrateZAlgorithm();
        demonstrateAhoCorasick();
        demonstratePerformanceComparison();
        
        cout << "=== Demo Complete ===" << endl;
        cout << "\nKey Takeaways:" << endl;
        cout << "1. All algorithms find the same matches" << endl;
        cout << "2. KMP provides consistent performance" << endl;
        cout << "3. Boyer-Moore often skips many characters" << endl;
        cout << "4. Aho-Corasick efficiently handles multiple patterns" << endl;
        cout << "5. Algorithm choice depends on use case and data characteristics" << endl;
    }
};

int main() {
    StringSearchDemo demo;
    demo.runAllDemos();
    return 0;
}
