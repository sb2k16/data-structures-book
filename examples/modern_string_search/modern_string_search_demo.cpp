/**
 * Modern String Search Algorithms Demo
 * 
 * This file demonstrates modern string search optimization algorithms
 * including optimal hash matching, elongated q-gram shifting, and
 * hardware-aware optimizations.
 * 
 * Compile with: g++ -std=c++17 -Wall -Wextra -O2 -pthread -o modern_string_search_demo modern_string_search_demo.cpp
 * Run with: ./modern_string_search_demo
 */

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <chrono>
#include <random>
#include <thread>
#include <iomanip>
using namespace std;

// Optimal Hash Matcher
class OptimalHashMatcher {
private:
    int q;
    unordered_map<string, int> patternHashes;
    string pattern;
    
    int findOptimalQ(const string& pattern) {
        int m = pattern.length();
        for (int q = 1; q <= m; q++) {
            unordered_map<string, int> qgramCount;
            bool unique = true;
            
            for (int i = 0; i <= m - q; i++) {
                string qgram = pattern.substr(i, q);
                if (qgramCount[qgram]++ > 0) {
                    unique = false;
                    break;
                }
            }
            
            if (unique) {
                return q;
            }
        }
        return m;
    }
    
    void buildPatternHashes() {
        for (int i = 0; i <= pattern.length() - q; i++) {
            string qgram = pattern.substr(i, q);
            patternHashes[qgram] = i;
        }
    }
    
public:
    OptimalHashMatcher(const string& pattern) : pattern(pattern) {
        q = findOptimalQ(pattern);
        buildPatternHashes();
        cout << "Optimal q-gram size: " << q << endl;
    }
    
    vector<int> search(const string& text) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0 || n < m) {
            return matches;
        }
        
        for (int i = 0; i <= n - m; i++) {
            bool found = true;
            
            for (int j = 0; j <= m - q; j++) {
                string textQgram = text.substr(i + j, q);
                if (patternHashes.find(textQgram) == patternHashes.end() ||
                    patternHashes[textQgram] != j) {
                    found = false;
                    break;
                }
            }
            
            if (found) {
                bool verified = true;
                for (int k = 0; k < m; k++) {
                    if (text[i + k] != pattern[k]) {
                        verified = false;
                        break;
                    }
                }
                
                if (verified) {
                    matches.push_back(i);
                }
            }
        }
        
        return matches;
    }
};

// Elongated Q-Gram Matcher
class ElongatedQGramMatcher {
private:
    int q;
    string pattern;
    unordered_map<string, vector<int>> patternPositions;
    
    int findElongatedQ(const string& pattern, int maxQ = 10) {
        int m = pattern.length();
        for (int q = maxQ; q >= 1; q--) {
            unordered_map<string, int> qgramCount;
            bool suitable = true;
            
            for (int i = 0; i <= m - q; i++) {
                string qgram = pattern.substr(i, q);
                if (qgramCount[qgram]++ > 1) {
                    suitable = false;
                    break;
                }
            }
            
            if (suitable) {
                return q;
            }
        }
        return 1;
    }
    
public:
    ElongatedQGramMatcher(const string& pattern) : pattern(pattern) {
        q = findElongatedQ(pattern);
        cout << "Elongated q-gram size: " << q << endl;
        
        for (int i = 0; i <= pattern.length() - q; i++) {
            string qgram = pattern.substr(i, q);
            patternPositions[qgram].push_back(i);
        }
    }
    
    vector<int> search(const string& text) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m == 0 || n < m) {
            return matches;
        }
        
        int i = 0;
        while (i <= n - m) {
            string textQgram = text.substr(i, q);
            
            if (patternPositions.find(textQgram) != patternPositions.end()) {
                for (int pos : patternPositions[textQgram]) {
                    if (i + pos + m <= n) {
                        bool match = true;
                        for (int k = 0; k < m; k++) {
                            if (text[i + pos + k] != pattern[k]) {
                                match = false;
                                break;
                            }
                        }
                        
                        if (match) {
                            matches.push_back(i + pos);
                        }
                    }
                }
                
                i += q;
            } else {
                i += q;
            }
        }
        
        return matches;
    }
};

// Reverse Colussi Matcher
class ReverseColussiMatcher {
private:
    string pattern;
    int m;
    vector<int> shift;
    vector<int> next;
    vector<int> h;
    
    void buildTables() {
        shift.resize(m + 1);
        next.resize(m + 1);
        h.resize(m + 1);
        
        for (int i = 0; i <= m; i++) {
            shift[i] = 1;
            next[i] = i;
            h[i] = i;
        }
        
        for (int i = 1; i <= m; i++) {
            if (pattern[i - 1] == pattern[0]) {
                shift[i] = 0;
            }
        }
        
        for (int i = 2; i <= m; i++) {
            if (pattern[i - 1] == pattern[1]) {
                shift[i] = 1;
            }
        }
    }
    
public:
    ReverseColussiMatcher(const string& pattern) : pattern(pattern), m(pattern.length()) {
        buildTables();
    }
    
    vector<int> search(const string& text) {
        vector<int> matches;
        int n = text.length();
        
        if (m == 0 || n < m) {
            return matches;
        }
        
        int i = 0;
        while (i <= n - m) {
            int j = m - 1;
            
            while (j >= 0 && pattern[j] == text[i + j]) {
                j--;
            }
            
            if (j < 0) {
                matches.push_back(i);
                i += shift[0];
            } else {
                i += shift[j + 1];
            }
        }
        
        return matches;
    }
};

// Cache-Friendly Matcher
class CacheFriendlyMatcher {
private:
    string pattern;
    int m;
    vector<int> lps;
    
    void buildLPS() {
        lps.resize(m);
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
    }
    
public:
    CacheFriendlyMatcher(const string& pattern) : pattern(pattern), m(pattern.length()) {
        buildLPS();
    }
    
    vector<int> search(const string& text) {
        vector<int> matches;
        int n = text.length();
        
        if (m == 0 || n < m) {
            return matches;
        }
        
        const int CHUNK_SIZE = 1024;
        int i = 0;
        
        while (i <= n - m) {
            int chunkEnd = min(i + CHUNK_SIZE, n - m + 1);
            
            for (int j = i; j < chunkEnd; j++) {
                bool match = true;
                for (int k = 0; k < m; k++) {
                    if (text[j + k] != pattern[k]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    matches.push_back(j);
                }
            }
            
            i = chunkEnd;
        }
        
        return matches;
    }
};

// Parallel Matcher
class ParallelMatcher {
private:
    string pattern;
    int m;
    
public:
    ParallelMatcher(const string& pattern) : pattern(pattern), m(pattern.length()) {}
    
    vector<int> parallelSearch(const string& text, int numThreads = 4) {
        vector<int> matches;
        int n = text.length();
        
        if (m == 0 || n < m) {
            return matches;
        }
        
        vector<thread> threads;
        vector<vector<int>> threadResults(numThreads);
        
        int chunkSize = n / numThreads;
        
        for (int t = 0; t < numThreads; t++) {
            int start = t * chunkSize;
            int end = (t == numThreads - 1) ? n : (t + 1) * chunkSize;
            
            threads.emplace_back([&, start, end, t]() {
                for (int i = start; i < end; i++) {
                    if (i + m <= n) {
                        bool match = true;
                        for (int j = 0; j < m; j++) {
                            if (text[i + j] != pattern[j]) {
                                match = false;
                                break;
                            }
                        }
                        
                        if (match) {
                            threadResults[t].push_back(i);
                        }
                    }
                }
            });
        }
        
        for (auto& thread : threads) {
            thread.join();
        }
        
        for (const auto& result : threadResults) {
            matches.insert(matches.end(), result.begin(), result.end());
        }
        
        return matches;
    }
};

// Benchmarking class
class ModernStringSearchBenchmark {
private:
    mt19937 rng;
    
    string generateRandomText(int length, const string& alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        string text;
        uniform_int_distribution<int> dist(0, alphabet.length() - 1);
        
        for (int i = 0; i < length; i++) {
            text += alphabet[dist(rng)];
        }
        
        return text;
    }
    
    template<typename Func>
    long long measureTime(Func func) {
        auto start = chrono::high_resolution_clock::now();
        func();
        auto end = chrono::high_resolution_clock::now();
        return chrono::duration_cast<chrono::microseconds>(end - start).count();
    }
    
public:
    ModernStringSearchBenchmark() : rng(chrono::steady_clock::now().time_since_epoch().count()) {}
    
    void demonstrateAlgorithms() {
        cout << "=== Modern String Search Algorithms Demo ===" << endl;
        
        string text = "ABABCABABDABABCABAB";
        string pattern = "ABABCABAB";
        
        cout << "Text: " << text << endl;
        cout << "Pattern: " << pattern << endl;
        cout << endl;
        
        // Optimal Hash Matcher
        cout << "1. Optimal Hash Matcher:" << endl;
        OptimalHashMatcher optimalMatcher(pattern);
        vector<int> optimalMatches = optimalMatcher.search(text);
        cout << "Matches: ";
        for (int pos : optimalMatches) cout << pos << " ";
        cout << endl << endl;
        
        // Elongated Q-Gram Matcher
        cout << "2. Elongated Q-Gram Matcher:" << endl;
        ElongatedQGramMatcher elongatedMatcher(pattern);
        vector<int> elongatedMatches = elongatedMatcher.search(text);
        cout << "Matches: ";
        for (int pos : elongatedMatches) cout << pos << " ";
        cout << endl << endl;
        
        // Reverse Colussi Matcher
        cout << "3. Reverse Colussi Matcher:" << endl;
        ReverseColussiMatcher reverseMatcher(pattern);
        vector<int> reverseMatches = reverseMatcher.search(text);
        cout << "Matches: ";
        for (int pos : reverseMatches) cout << pos << " ";
        cout << endl << endl;
        
        // Cache-Friendly Matcher
        cout << "4. Cache-Friendly Matcher:" << endl;
        CacheFriendlyMatcher cacheMatcher(pattern);
        vector<int> cacheMatches = cacheMatcher.search(text);
        cout << "Matches: ";
        for (int pos : cacheMatches) cout << pos << " ";
        cout << endl << endl;
        
        // Parallel Matcher
        cout << "5. Parallel Matcher (4 threads):" << endl;
        ParallelMatcher parallelMatcher(pattern);
        vector<int> parallelMatches = parallelMatcher.parallelSearch(text, 4);
        cout << "Matches: ";
        for (int pos : parallelMatches) cout << pos << " ";
        cout << endl << endl;
    }
    
    void benchmarkPerformance() {
        cout << "=== Performance Benchmark ===" << endl;
        
        vector<int> textSizes = {10000, 100000, 1000000};
        vector<int> patternSizes = {5, 10, 20};
        
        for (int textSize : textSizes) {
            cout << "\nText Size: " << textSize << endl;
            cout << "Pattern Size\tOptimal-Hash\tElongated-Q\tReverse-Colussi\tCache-Friendly\tParallel" << endl;
            cout << "------------\t------------\t------------\t---------------\t------------- \t-------" << endl;
            
            for (int patternSize : patternSizes) {
                string text = generateRandomText(textSize);
                string pattern = generateRandomText(patternSize);
                
                // Ensure pattern exists
                text = pattern + text;
                
                long long optimalTime = measureTime([&]() {
                    OptimalHashMatcher matcher(pattern);
                    matcher.search(text);
                });
                
                long long elongatedTime = measureTime([&]() {
                    ElongatedQGramMatcher matcher(pattern);
                    matcher.search(text);
                });
                
                long long reverseTime = measureTime([&]() {
                    ReverseColussiMatcher matcher(pattern);
                    matcher.search(text);
                });
                
                long long cacheTime = measureTime([&]() {
                    CacheFriendlyMatcher matcher(pattern);
                    matcher.search(text);
                });
                
                long long parallelTime = measureTime([&]() {
                    ParallelMatcher matcher(pattern);
                    matcher.parallelSearch(text, 4);
                });
                
                cout << patternSize << "\t\t" << optimalTime << "\t\t" << elongatedTime 
                     << "\t\t" << reverseTime << "\t\t" << cacheTime << "\t\t" << parallelTime << endl;
            }
        }
    }
    
    void analyzeQGramSizes() {
        cout << "\n=== Q-Gram Size Analysis ===" << endl;
        
        vector<string> patterns = {"ABC", "ABCDEF", "ABCDEFGHIJ", "ABCDEFGHIJKLMNOP"};
        
        cout << "Pattern\t\tOptimal Q\tElongated Q" << endl;
        cout << "-------\t\t----------\t------------" << endl;
        
        for (const string& pattern : patterns) {
            OptimalHashMatcher optimalMatcher(pattern);
            ElongatedQGramMatcher elongatedMatcher(pattern);
            
            cout << pattern << "\t\t" << "N/A" << "\t\t" << "N/A" << endl;
        }
    }
    
    void runAllDemos() {
        cout << "Modern String Search Optimization Algorithms" << endl;
        cout << "===========================================" << endl;
        cout << endl;
        
        demonstrateAlgorithms();
        benchmarkPerformance();
        analyzeQGramSizes();
        
        cout << "\n=== Demo Complete ===" << endl;
        cout << "\nKey Insights:" << endl;
        cout << "1. Optimal hash matching reduces false positives" << endl;
        cout << "2. Elongated q-grams enable larger skips" << endl;
        cout << "3. Reverse Colussi optimizes scan order" << endl;
        cout << "4. Cache-friendly algorithms improve memory performance" << endl;
        cout << "5. Parallel processing scales with available cores" << endl;
    }
};

int main() {
    ModernStringSearchBenchmark benchmark;
    benchmark.runAllDemos();
    return 0;
}
