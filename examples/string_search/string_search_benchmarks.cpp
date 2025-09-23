/**
 * String Search Algorithm Benchmarks
 * 
 * This file provides comprehensive performance testing for various string search algorithms.
 * It complements Chapter 7 with detailed benchmarking and analysis.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -o string_search_benchmarks string_search_benchmarks.cpp
 * Run with: ./string_search_benchmarks
 */

#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <random>
#include <iomanip>
#include <algorithm>
#include <unordered_map>
using namespace std;

// Include algorithm implementations
#include "string_search_algorithms.hpp"

class StringSearchBenchmark {
private:
    mt19937 rng;
    
    // Generate random text
    string generateRandomText(int length, const string& alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        string text;
        uniform_int_distribution<int> dist(0, alphabet.length() - 1);
        
        for (int i = 0; i < length; i++) {
            text += alphabet[dist(rng)];
        }
        
        return text;
    }
    
    // Generate text with patterns (to ensure matches exist)
    string generateTextWithPatterns(int length, const vector<string>& patterns) {
        string text = generateRandomText(length);
        
        // Insert patterns at random positions
        uniform_int_distribution<int> posDist(0, length - patterns[0].length());
        uniform_int_distribution<int> patternDist(0, patterns.size() - 1);
        
        for (int i = 0; i < 10; i++) {  // Insert 10 patterns
            int pos = posDist(rng);
            string pattern = patterns[patternDist(rng)];
            
            for (int j = 0; j < pattern.length() && pos + j < text.length(); j++) {
                text[pos + j] = pattern[j];
            }
        }
        
        return text;
    }
    
    // Measure execution time
    template<typename Func>
    long long measureTime(Func func) {
        auto start = chrono::high_resolution_clock::now();
        func();
        auto end = chrono::high_resolution_clock::now();
        return chrono::duration_cast<chrono::microseconds>(end - start).count();
    }
    
public:
    StringSearchBenchmark() : rng(chrono::steady_clock::now().time_since_epoch().count()) {}
    
    // Benchmark single pattern search algorithms
    void benchmarkSinglePattern() {
        cout << "=== Single Pattern Search Benchmark ===" << endl;
        
        vector<int> textSizes = {1000, 10000, 100000, 1000000};
        vector<int> patternSizes = {5, 10, 20, 50};
        
        for (int textSize : textSizes) {
            cout << "\nText Size: " << textSize << endl;
            cout << "Pattern Size\tNaive\t\tRabin-Karp\tKMP\t\tBoyer-Moore\tZ-Algorithm" << endl;
            cout << "------------\t-----\t\t----------\t---\t\t------------\t----------" << endl;
            
            for (int patternSize : patternSizes) {
                string text = generateRandomText(textSize);
                string pattern = generateRandomText(patternSize);
                
                // Ensure pattern exists in text
                text = pattern + text;
                
                long long naiveTime = measureTime([&]() {
                    naiveSearch(text, pattern);
                });
                
                long long rabinKarpTime = measureTime([&]() {
                    RabinKarp rk;
                    rk.search(text, pattern);
                });
                
                long long kmpTime = measureTime([&]() {
                    KMPAlgorithm kmp;
                    kmp.search(text, pattern);
                });
                
                long long boyerMooreTime = measureTime([&]() {
                    BoyerMoore bm;
                    bm.search(text, pattern);
                });
                
                long long zTime = measureTime([&]() {
                    ZAlgorithm z;
                    z.search(text, pattern);
                });
                
                cout << patternSize << "\t\t" << naiveTime << "\t\t" << rabinKarpTime 
                     << "\t\t" << kmpTime << "\t\t" << boyerMooreTime << "\t\t" << zTime << endl;
            }
        }
    }
    
    // Benchmark worst-case scenarios
    void benchmarkWorstCase() {
        cout << "\n=== Worst Case Scenario Benchmark ===" << endl;
        
        // Create worst-case text and pattern
        string text = string(100000, 'A') + "B";
        string pattern = string(100, 'A') + "B";
        
        cout << "Text: " << text.length() << " characters" << endl;
        cout << "Pattern: " << pattern.length() << " characters" << endl;
        cout << "Algorithm\t\tTime (microseconds)" << endl;
        cout << "--------\t\t------------------" << endl;
        
        long long naiveTime = measureTime([&]() {
            naiveSearch(text, pattern);
        });
        cout << "Naive\t\t\t" << naiveTime << endl;
        
        long long rabinKarpTime = measureTime([&]() {
            RabinKarp rk;
            rk.search(text, pattern);
        });
        cout << "Rabin-Karp\t\t" << rabinKarpTime << endl;
        
        long long kmpTime = measureTime([&]() {
            KMPAlgorithm kmp;
            kmp.search(text, pattern);
        });
        cout << "KMP\t\t\t" << kmpTime << endl;
        
        long long boyerMooreTime = measureTime([&]() {
            BoyerMoore bm;
            bm.search(text, pattern);
        });
        cout << "Boyer-Moore\t\t" << boyerMooreTime << endl;
        
        long long zTime = measureTime([&]() {
            ZAlgorithm z;
            z.search(text, pattern);
        });
        cout << "Z-Algorithm\t\t" << zTime << endl;
    }
    
    // Benchmark multiple pattern search
    void benchmarkMultiplePatterns() {
        cout << "\n=== Multiple Pattern Search Benchmark ===" << endl;
        
        vector<string> patterns = {"ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX"};
        string text = generateTextWithPatterns(100000, patterns);
        
        cout << "Text Size: " << text.length() << endl;
        cout << "Number of Patterns: " << patterns.size() << endl;
        cout << "Algorithm\t\tTime (microseconds)" << endl;
        cout << "--------\t\t------------------" << endl;
        
        // Test individual pattern searches
        long long individualTime = measureTime([&]() {
            KMPAlgorithm kmp;
            for (const string& pattern : patterns) {
                kmp.search(text, pattern);
            }
        });
        cout << "Individual KMP\t\t" << individualTime << endl;
        
        // Test Aho-Corasick
        long long ahoCorasickTime = measureTime([&]() {
            AhoCorasick ac(patterns);
            ac.search(text);
        });
        cout << "Aho-Corasick\t\t" << ahoCorasickTime << endl;
    }
    
    // Benchmark memory usage
    void benchmarkMemoryUsage() {
        cout << "\n=== Memory Usage Analysis ===" << endl;
        
        string text = generateRandomText(100000);
        string pattern = generateRandomText(100);
        
        cout << "Text Size: " << text.length() << " characters" << endl;
        cout << "Pattern Size: " << pattern.length() << " characters" << endl;
        cout << "Algorithm\t\tSpace Complexity\tNotes" << endl;
        cout << "--------\t\t----------------\t-----" << endl;
        cout << "Naive\t\t\tO(1)\t\t\tNo extra space" << endl;
        cout << "Rabin-Karp\t\tO(1)\t\t\tNo extra space" << endl;
        cout << "KMP\t\t\tO(m)\t\t\tLPS array" << endl;
        cout << "Boyer-Moore\t\tO(m)\t\t\tBad char table" << endl;
        cout << "Z-Algorithm\t\tO(n+m)\t\t\tZ array" << endl;
        cout << "Aho-Corasick\t\tO(m)\t\t\tTrie structure" << endl;
    }
    
    // Benchmark with different character sets
    void benchmarkCharacterSets() {
        cout << "\n=== Character Set Impact Benchmark ===" << endl;
        
        vector<string> characterSets = {
            "AB",           // Binary
            "ABCD",         // 4 characters
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",  // Alphabet
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"  // Alphanumeric
        };
        
        vector<string> setNames = {"Binary", "4-char", "Alphabet", "Alphanumeric"};
        
        cout << "Character Set\t\tKMP Time\tBoyer-Moore Time" << endl;
        cout << "--------------\t\t--------\t----------------" << endl;
        
        for (int i = 0; i < characterSets.size(); i++) {
            string text = generateRandomText(50000, characterSets[i]);
            string pattern = generateRandomText(10, characterSets[i]);
            
            long long kmpTime = measureTime([&]() {
                KMPAlgorithm kmp;
                kmp.search(text, pattern);
            });
            
            long long boyerMooreTime = measureTime([&]() {
                BoyerMoore bm;
                bm.search(text, pattern);
            });
            
            cout << setNames[i] << "\t\t" << kmpTime << "\t\t" << boyerMooreTime << endl;
        }
    }
    
    // Run all benchmarks
    void runAllBenchmarks() {
        cout << "String Search Algorithm Benchmarks" << endl;
        cout << "===================================" << endl;
        
        benchmarkSinglePattern();
        benchmarkWorstCase();
        benchmarkMultiplePatterns();
        benchmarkMemoryUsage();
        benchmarkCharacterSets();
        
        cout << "\n=== Benchmark Complete ===" << endl;
        cout << "\nKey Insights:" << endl;
        cout << "1. KMP provides consistent O(n+m) performance" << endl;
        cout << "2. Boyer-Moore is often fastest for large texts" << endl;
        cout << "3. Aho-Corasick excels at multiple pattern search" << endl;
        cout << "4. Character set size affects Boyer-Moore performance" << endl;
        cout << "5. Memory usage varies significantly between algorithms" << endl;
    }
};

int main() {
    StringSearchBenchmark benchmark;
    benchmark.runAllBenchmarks();
    return 0;
}
