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

The naive approach checks every possible position in the text for the pattern. While simple to understand and implement, it's not the most efficient algorithm for large texts.

### Algorithm Description
1. Slide the pattern over the text one position at a time
2. At each position, compare the pattern with the corresponding substring
3. If all characters match, record the position as a match

### Detailed Example Walkthrough

Let's trace through the naive algorithm with a concrete example:

**Text**: `"ABABCABABDABABCABAB"`
**Pattern**: `"ABABCABAB"`

#### Step-by-Step Execution:

**Step 1: Position 0**
```
Text:    ABABCABABDABABCABAB
Pattern: ABABCABAB
         ↑
         Match: A=A ✓, B=B ✓, A=A ✓, B=B ✓, C=C ✓, A=A ✓, B=B ✓, A=A ✓, B=B ✓
Result: MATCH at position 0
```

**Step 2: Position 1**
```
Text:    ABABCABABDABABCABAB
Pattern:  ABABCABAB
          ↑
          Match: B≠A ✗
Result: No match
```

**Step 3: Position 2**
```
Text:    ABABCABABDABABCABAB
Pattern:   ABABCABAB
           ↑
           Match: A=A ✓, B=B ✓, A=A ✓, B=B ✓, C≠A ✗
Result: No match
```

**Step 4: Position 3**
```
Text:    ABABCABABDABABCABAB
Pattern:    ABABCABAB
            ↑
            Match: B≠A ✗
Result: No match
```

**Step 5: Position 4**
```
Text:    ABABCABABDABABCABAB
Pattern:     ABABCABAB
             ↑
             Match: C≠A ✗
Result: No match
```

**Step 6: Position 5**
```
Text:    ABABCABABDABABCABAB
Pattern:      ABABCABAB
              ↑
              Match: A=A ✓, B=B ✓, A=A ✓, B=B ✓, C=C ✓, A=A ✓, B=B ✓, A=A ✓, B=B ✓
Result: MATCH at position 5
```

**Step 7: Position 6**
```
Text:    ABABCABABDABABCABAB
Pattern:       ABABCABAB
               ↑
               Match: B≠A ✗
Result: No match
```

**Step 8: Position 7**
```
Text:    ABABCABABDABABCABAB
Pattern:        ABABCABAB
                ↑
                Match: A=A ✓, B=B ✓, A=A ✓, B=B ✓, C≠A ✗
Result: No match
```

**Step 9: Position 8**
```
Text:    ABABCABABDABABCABAB
Pattern:         ABABCABAB
                 ↑
                 Match: B≠A ✗
Result: No match
```

**Step 10: Position 9**
```
Text:    ABABCABABDABABCABAB
Pattern:          ABABCABAB
                  ↑
                  Match: D≠A ✗
Result: No match
```

**Step 11: Position 10**
```
Text:    ABABCABABDABABCABAB
Pattern:           ABABCABAB
                   ↑
                   Match: A=A ✓, B=B ✓, A=A ✓, B=B ✓, C=C ✓, A=A ✓, B=B ✓, A=A ✓, B=B ✓
Result: MATCH at position 10
```

**Final Result**: Matches found at positions 0, 5, and 10.

### Visual Representation

```
Text:    A B A B C A B A B D A B A B C A B A B
Pattern: A B A B C A B A B
         ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  ← Match at position 0

Text:    A B A B C A B A B D A B A B C A B A B
Pattern:   A B A B C A B A B
           ✗                 ← No match at position 1

Text:    A B A B C A B A B D A B A B C A B A B
Pattern:     A B A B C A B A B
             ✓ ✓ ✓ ✓ ✗         ← No match at position 2

... (continuing for all positions)

Text:    A B A B C A B A B D A B A B C A B A B
Pattern:           A B A B C A B A B
                   ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  ← Match at position 5

Text:    A B A B C A B A B D A B A B C A B A B
Pattern:               A B A B C A B A B
                       ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  ← Match at position 10
```

### Key Observations

1. **Systematic Approach**: The algorithm checks every possible starting position
2. **Character-by-Character Comparison**: At each position, it compares characters from left to right
3. **Early Termination**: As soon as a mismatch is found, it moves to the next position
4. **No Memory of Previous Matches**: Each position is checked independently
5. **Guaranteed Correctness**: If a pattern exists, the algorithm will find it

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

The Rabin-Karp algorithm uses hashing to find the pattern. It's based on the idea that if two strings are equal, their hash values must also be equal. This algorithm is particularly useful for multiple pattern search and when dealing with rolling hash applications.

### Algorithm Description
1. Calculate hash value of the pattern
2. Calculate hash value of the first window of text
3. Slide the window one position at a time and update the hash
4. Compare hash values; if they match, verify character by character

### Detailed Example Walkthrough

Let's trace through the Rabin-Karp algorithm with a concrete example:

**Text**: `"3141592653589793"`
**Pattern**: `"26535"`

#### Hash Function
We'll use a simple hash function: `hash = (c₁ × 10^(m-1) + c₂ × 10^(m-2) + ... + cₘ) mod 101`

#### Step-by-Step Execution:

**Step 1: Calculate Pattern Hash**
```
Pattern: "26535"
Hash = (2×10⁴ + 6×10³ + 5×10² + 3×10¹ + 5×10⁰) mod 101
     = (20000 + 6000 + 500 + 30 + 5) mod 101
     = 26535 mod 101
     = 88
```

**Step 2: Calculate First Window Hash**
```
Text: "3141592653589793"
First window: "31415"
Hash = (3×10⁴ + 1×10³ + 4×10² + 1×10¹ + 5×10⁰) mod 101
     = (30000 + 1000 + 400 + 10 + 5) mod 101
     = 31415 mod 101
     = 12
```

**Step 3: Compare Hashes**
```
Pattern hash: 88
First window hash: 12
88 ≠ 12 → No match
```

**Step 4: Slide Window and Update Hash**
```
Old window: "31415"
New window: "14159"

Rolling hash update:
- Remove leftmost digit: 3 × 10⁴ = 30000
- Add new rightmost digit: 9
- New hash = (31415 - 30000 + 9) mod 101
           = 1424 mod 101
           = 8

Text: "3141592653589793"
Window:  "14159"
Hash: 8 ≠ 88 → No match
```

**Step 5: Continue Sliding**
```
Window: "41592"
Hash = (8 - 1×10⁴ + 2) mod 101
     = (8 - 10000 + 2) mod 101
     = -9990 mod 101
     = 88

Text: "3141592653589793"
Window:  "41592"
Hash: 88 = 88 → Potential match!

Verify character by character:
"41592" vs "26535"
4≠2, 1≠6, 5≠5, 9≠3, 2≠5 → No match
```

**Step 6: Continue Sliding**
```
Window: "15926"
Hash = (88 - 4×10⁴ + 6) mod 101
     = (88 - 40000 + 6) mod 101
     = -39906 mod 101
     = 88

Text: "3141592653589793"
Window:  "15926"
Hash: 88 = 88 → Potential match!

Verify character by character:
"15926" vs "26535"
1≠2, 5≠6, 9≠5, 2≠3, 6≠5 → No match
```

**Step 7: Continue Sliding**
```
Window: "59265"
Hash = (88 - 1×10⁴ + 5) mod 101
     = (88 - 10000 + 5) mod 101
     = -9907 mod 101
     = 88

Text: "3141592653589793"
Window:  "59265"
Hash: 88 = 88 → Potential match!

Verify character by character:
"59265" vs "26535"
5≠2, 9≠6, 2≠5, 6≠3, 5≠5 → No match
```

**Step 8: Continue Sliding**
```
Window: "92653"
Hash = (88 - 5×10⁴ + 3) mod 101
     = (88 - 50000 + 3) mod 101
     = -49909 mod 101
     = 88

Text: "3141592653589793"
Window:  "92653"
Hash: 88 = 88 → Potential match!

Verify character by character:
"92653" vs "26535"
9≠2, 2≠6, 6≠5, 5≠3, 3≠5 → No match
```

**Step 9: Continue Sliding**
```
Window: "26535"
Hash = (88 - 9×10⁴ + 5) mod 101
     = (88 - 90000 + 5) mod 101
     = -89907 mod 101
     = 88

Text: "3141592653589793"
Window:  "26535"
Hash: 88 = 88 → Potential match!

Verify character by character:
"26535" vs "26535"
2=2, 6=6, 5=5, 3=3, 5=5 → MATCH!
```

**Final Result**: Match found at position 5.

### Visual Representation

```
Text:    3 1 4 1 5 9 2 6 5 3 5 8 9 7 9 3
Pattern: 2 6 5 3 5

Step 1:  [3 1 4 1 5] 9 2 6 5 3 5 8 9 7 9 3
         Hash: 12 ≠ 88 → No match

Step 2:  3 [1 4 1 5 9] 2 6 5 3 5 8 9 7 9 3
         Hash: 8 ≠ 88 → No match

Step 3:  3 1 [4 1 5 9 2] 6 5 3 5 8 9 7 9 3
         Hash: 88 = 88 → Verify: 4≠2 → No match

Step 4:  3 1 4 [1 5 9 2 6] 5 3 5 8 9 7 9 3
         Hash: 88 = 88 → Verify: 1≠2 → No match

Step 5:  3 1 4 1 [5 9 2 6 5] 3 5 8 9 7 9 3
         Hash: 88 = 88 → Verify: 5≠2 → No match

Step 6:  3 1 4 1 5 [9 2 6 5 3] 5 8 9 7 9 3
         Hash: 88 = 88 → Verify: 9≠2 → No match

Step 7:  3 1 4 1 5 9 [2 6 5 3 5] 8 9 7 9 3
         Hash: 88 = 88 → Verify: 2=2, 6=6, 5=5, 3=3, 5=5 → MATCH!
```

### Key Observations

1. **Hash Collisions**: Different strings can have the same hash value, requiring verification
2. **Rolling Hash**: Efficient hash update by removing leftmost character and adding rightmost
3. **False Positives**: Hash matches don't guarantee string matches
4. **Verification Step**: Always verify character-by-character when hashes match
5. **Efficiency**: Reduces comparisons from O(n×m) to O(n+m) on average

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

The KMP algorithm uses information from previous matches to avoid unnecessary comparisons. It preprocesses the pattern to create a failure function (LPS array) that helps skip characters that are guaranteed to match.

### Algorithm Description
1. Preprocess the pattern to create the Longest Proper Prefix which is also Suffix (LPS) array
2. Use the LPS array to skip characters that are guaranteed to match
3. When a mismatch occurs, use the LPS array to determine the next position to check

### Understanding the LPS Array

The LPS (Longest Proper Prefix which is also Suffix) array stores the length of the longest proper prefix that is also a suffix for each position in the pattern.

**Example**: Pattern `"ABABCABAB"`

Let's build the LPS array step by step:

```
Pattern: A B A B C A B A B
Index:   0 1 2 3 4 5 6 7 8
LPS:     0 0 1 2 0 1 2 3 4
```

#### LPS Array Construction:

**Position 0**: `"A"`
- No proper prefix (prefix must be shorter than the string)
- LPS[0] = 0

**Position 1**: `"AB"`
- Proper prefixes: `"A"`
- Proper suffixes: `"B"`
- No common prefix and suffix
- LPS[1] = 0

**Position 2**: `"ABA"`
- Proper prefixes: `"A"`, `"AB"`
- Proper suffixes: `"A"`, `"BA"`
- Longest common: `"A"` (length 1)
- LPS[2] = 1

**Position 3**: `"ABAB"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`
- Proper suffixes: `"B"`, `"AB"`, `"BAB"`
- Longest common: `"AB"` (length 2)
- LPS[3] = 2

**Position 4**: `"ABABC"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`, `"ABAB"`
- Proper suffixes: `"C"`, `"BC"`, `"ABC"`, `"BABC"`
- No common prefix and suffix
- LPS[4] = 0

**Position 5**: `"ABABCA"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`, `"ABAB"`, `"ABABC"`
- Proper suffixes: `"A"`, `"CA"`, `"BCA"`, `"ABCA"`, `"BABCA"`
- Longest common: `"A"` (length 1)
- LPS[5] = 1

**Position 6**: `"ABABCAB"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`, `"ABAB"`, `"ABABC"`, `"ABABCA"`
- Proper suffixes: `"B"`, `"AB"`, `"CAB"`, `"BCAB"`, `"ABCAB"`, `"BABCAB"`
- Longest common: `"AB"` (length 2)
- LPS[6] = 2

**Position 7**: `"ABABCABA"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`, `"ABAB"`, `"ABABC"`, `"ABABCA"`, `"ABABCAB"`
- Proper suffixes: `"A"`, `"BA"`, `"ABA"`, `"CABA"`, `"BCABA"`, `"ABCABA"`, `"BABCABA"`
- Longest common: `"ABA"` (length 3)
- LPS[7] = 3

**Position 8**: `"ABABCABAB"`
- Proper prefixes: `"A"`, `"AB"`, `"ABA"`, `"ABAB"`, `"ABABC"`, `"ABABCA"`, `"ABABCAB"`, `"ABABCABA"`
- Proper suffixes: `"B"`, `"AB"`, `"BAB"`, `"ABAB"`, `"CABAB"`, `"BCABAB"`, `"ABCABAB"`, `"BABCABAB"`
- Longest common: `"ABAB"` (length 4)
- LPS[8] = 4

### Detailed Example Walkthrough

Let's trace through the KMP algorithm with a concrete example:

**Text**: `"ABABDABACDABABCABAB"`
**Pattern**: `"ABABCABAB"`

#### Step-by-Step Execution:

**Step 1: Initialize**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
LPS:     0 0 1 2 0 1 2 3 4
i=0, j=0
```

**Step 2: First Character Match**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
         ↑
i=0, j=0: A=A ✓
i=1, j=1
```

**Step 3: Second Character Match**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
           ↑
i=1, j=1: B=B ✓
i=2, j=2
```

**Step 4: Third Character Match**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
             ↑
i=2, j=2: A=A ✓
i=3, j=3
```

**Step 5: Fourth Character Match**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
               ↑
i=3, j=3: B=B ✓
i=4, j=4
```

**Step 6: Mismatch - Use LPS Array**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
                 ↑
i=4, j=4: D≠C ✗

Mismatch at j=4, LPS[4-1] = LPS[3] = 2
Move pattern to align with the longest proper prefix that is also a suffix
j = LPS[3] = 2
```

**Step 7: Continue from j=2**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:     A B A B C A B A B
               ↑
i=4, j=2: D≠A ✗

Mismatch at j=2, LPS[2-1] = LPS[1] = 0
j = LPS[1] = 0
```

**Step 8: Continue from j=0**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:       A B A B C A B A B
               ↑
i=4, j=0: D≠A ✗

j=0, so move to next character in text
i=5, j=0
```

**Step 9: New Starting Position**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                 ↑
i=5, j=0: A=A ✓
i=6, j=1
```

**Step 10: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                   ↑
i=6, j=1: B=B ✓
i=7, j=2
```

**Step 11: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                     ↑
i=7, j=2: A=A ✓
i=8, j=3
```

**Step 12: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                       ↑
i=8, j=3: C≠B ✗

Mismatch at j=3, LPS[3-1] = LPS[2] = 1
j = LPS[2] = 1
```

**Step 13: Continue from j=1**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                     ↑
i=8, j=1: C≠B ✗

Mismatch at j=1, LPS[1-1] = LPS[0] = 0
j = LPS[0] = 0
```

**Step 14: Continue from j=0**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                       ↑
i=8, j=0: C≠A ✗

j=0, so move to next character in text
i=9, j=0
```

**Step 15: New Starting Position**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:           A B A B C A B A B
                   ↑
i=9, j=0: D≠A ✗

j=0, so move to next character in text
i=10, j=0
```

**Step 16: New Starting Position**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                     ↑
i=10, j=0: A=A ✓
i=11, j=1
```

**Step 17: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                       ↑
i=11, j=1: B=B ✓
i=12, j=2
```

**Step 18: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                         ↑
i=12, j=2: A=A ✓
i=13, j=3
```

**Step 19: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                           ↑
i=13, j=3: B=B ✓
i=14, j=4
```

**Step 20: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                             ↑
i=14, j=4: C=C ✓
i=15, j=5
```

**Step 21: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                               ↑
i=15, j=5: A=A ✓
i=16, j=6
```

**Step 22: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                                 ↑
i=16, j=6: B=B ✓
i=17, j=7
```

**Step 23: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                                   ↑
i=17, j=7: A=A ✓
i=18, j=8
```

**Step 24: Continue Matching**
```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern:             A B A B C A B A B
                                     ↑
i=18, j=8: B=B ✓
j=8 (pattern length), so we found a match!
```

**Final Result**: Match found at position 10.

### Visual Representation

```
Text:    A B A B D A B A C D A B A B C A B A B
Pattern: A B A B C A B A B
         ✓ ✓ ✓ ✓ ✗
         ↑ Mismatch at position 4, use LPS[3]=2

Text:    A B A B D A B A C D A B A B C A B A B
Pattern:     A B A B C A B A B
               ✗
               ↑ Mismatch at position 2, use LPS[1]=0

Text:    A B A B D A B A C D A B A B C A B A B
Pattern:       A B A B C A B A B
               ✗
               ↑ Mismatch at position 0, move to next text position

Text:    A B A B D A B A C D A B A B C A B A B
Pattern:         A B A B C A B A B
                 ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓
                 ↑ Match found at position 10
```

### Key Observations

1. **LPS Array**: Precomputed to avoid redundant comparisons
2. **Smart Skipping**: Uses pattern structure to skip characters that are guaranteed to match
3. **No Backtracking**: Text pointer never moves backward
4. **Efficient**: O(n+m) time complexity with O(m) space
5. **Pattern Preprocessing**: One-time cost that pays off for multiple searches

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

The Boyer-Moore algorithm is often the fastest in practice for large texts. It uses two heuristics: the Bad Character Rule and the Good Suffix Rule. The algorithm compares the pattern with the text from right to left, which allows it to skip many characters when mismatches occur.

### Algorithm Description
1. Compare pattern with text from right to left
2. When a mismatch occurs, use the Bad Character Rule to shift the pattern
3. Use the Good Suffix Rule for additional optimization

### Understanding the Bad Character Rule

The Bad Character Rule states that when a mismatch occurs, we can shift the pattern to align the last occurrence of the mismatched character in the pattern with the mismatched character in the text.

**Example**: Pattern `"TATGTG"`

Let's build the bad character table:

```
Pattern: T A T G T G
Index:   0 1 2 3 4 5
Bad Char Table:
T: 4 (last occurrence at index 4)
A: 1 (last occurrence at index 1)
G: 5 (last occurrence at index 5)
```

### Understanding the Good Suffix Rule

The Good Suffix Rule states that when a mismatch occurs, we can shift the pattern to align the longest suffix of the pattern that matches a prefix of the pattern.

**Example**: Pattern `"TATGTG"`

Let's build the good suffix table:

```
Pattern: T A T G T G
Index:   0 1 2 3 4 5
Good Suffix Table:
Position 5: "G" → No good suffix
Position 4: "TG" → No good suffix
Position 3: "GTG" → No good suffix
Position 2: "TGTG" → No good suffix
Position 1: "ATGTG" → No good suffix
Position 0: "TATGTG" → No good suffix
```

### Detailed Example Walkthrough

Let's trace through the Boyer-Moore algorithm with a concrete example:

**Text**: `"GCAATGCCTATGTGACC"`
**Pattern**: `"TATGTG"`

#### Step-by-Step Execution:

**Step 1: Initialize**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern: T A T G T G
Bad Char Table: T=4, A=1, G=5
i=0, j=5
```

**Step 2: Compare from Right to Left**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern: T A T G T G
         ↑
i=0, j=5: G≠G ✗

Mismatch at j=5, character 'G' in text
Bad Character Rule: Shift by max(1, j - badChar['G'])
Shift = max(1, 5 - 5) = max(1, 0) = 1
i = i + 1 = 1
```

**Step 3: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:   T A T G T G
           ↑
i=1, j=5: C≠G ✗

Mismatch at j=5, character 'C' in text
Bad Character Rule: 'C' not in pattern, shift by j+1 = 6
i = i + 6 = 7
```

**Step 4: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:         T A T G T G
                 ↑
i=7, j=5: T≠G ✗

Mismatch at j=5, character 'T' in text
Bad Character Rule: Shift by max(1, j - badChar['T'])
Shift = max(1, 5 - 4) = max(1, 1) = 1
i = i + 1 = 8
```

**Step 5: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:           T A T G T G
                   ↑
i=8, j=5: A≠G ✗

Mismatch at j=5, character 'A' in text
Bad Character Rule: Shift by max(1, j - badChar['A'])
Shift = max(1, 5 - 1) = max(1, 4) = 4
i = i + 4 = 12
```

**Step 6: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                   T A T G T G
                           ↑
i=12, j=5: G≠G ✗

Mismatch at j=5, character 'G' in text
Bad Character Rule: Shift by max(1, j - badChar['G'])
Shift = max(1, 5 - 5) = max(1, 0) = 1
i = i + 1 = 13
```

**Step 7: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                     T A T G T G
                             ↑
i=13, j=5: A≠G ✗

Mismatch at j=5, character 'A' in text
Bad Character Rule: Shift by max(1, j - badChar['A'])
Shift = max(1, 5 - 1) = max(1, 4) = 4
i = i + 4 = 17
```

**Step 8: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                         T A T G T G
                                 ↑
i=17, j=5: C≠G ✗

Mismatch at j=5, character 'C' in text
Bad Character Rule: 'C' not in pattern, shift by j+1 = 6
i = i + 6 = 23
```

**Step 9: Beyond Text Length**
```
i=23 > text.length() - pattern.length()
Search complete, no match found
```

**Final Result**: No match found.

### Visual Representation

```
Text:    G C A A T G C C T A T G T G A C C
Pattern: T A T G T G
         ↑
         Mismatch: G≠G, shift by 1

Text:    G C A A T G C C T A T G T G A C C
Pattern:   T A T G T G
           ↑
           Mismatch: C≠G, shift by 6

Text:    G C A A T G C C T A T G T G A C C
Pattern:         T A T G T G
                 ↑
                 Mismatch: T≠G, shift by 1

Text:    G C A A T G C C T A T G T G A C C
Pattern:           T A T G T G
                   ↑
                   Mismatch: A≠G, shift by 4

Text:    G C A A T G C C T A T G T G A C C
Pattern:                   T A T G T G
                           ↑
                           Mismatch: G≠G, shift by 1

Text:    G C A A T G C C T A T G T G A C C
Pattern:                     T A T G T G
                             ↑
                             Mismatch: A≠G, shift by 4

Text:    G C A A T G C C T A T G T G A C C
Pattern:                         T A T G T G
                                 ↑
                                 Mismatch: C≠G, shift by 6

Search complete - no match found
```

### Example with Match Found

Let's try with a different example where a match exists:

**Text**: `"GCAATGCCTATGTGACC"`
**Pattern**: `"TATGTG"`

#### Step-by-Step Execution:

**Step 1: Initialize**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern: T A T G T G
Bad Char Table: T=4, A=1, G=5
i=0, j=5
```

**Step 2: Compare from Right to Left**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern: T A T G T G
         ↑
i=0, j=5: G≠G ✗

Mismatch at j=5, character 'G' in text
Bad Character Rule: Shift by max(1, j - badChar['G'])
Shift = max(1, 5 - 5) = max(1, 0) = 1
i = i + 1 = 1
```

**Step 3: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:   T A T G T G
           ↑
i=1, j=5: C≠G ✗

Mismatch at j=5, character 'C' in text
Bad Character Rule: 'C' not in pattern, shift by j+1 = 6
i = i + 6 = 7
```

**Step 4: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:         T A T G T G
                 ↑
i=7, j=5: T≠G ✗

Mismatch at j=5, character 'T' in text
Bad Character Rule: Shift by max(1, j - badChar['T'])
Shift = max(1, 5 - 4) = max(1, 1) = 1
i = i + 1 = 8
```

**Step 5: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:           T A T G T G
                   ↑
i=8, j=5: A≠G ✗

Mismatch at j=5, character 'A' in text
Bad Character Rule: Shift by max(1, j - badChar['A'])
Shift = max(1, 5 - 1) = max(1, 4) = 4
i = i + 4 = 12
```

**Step 6: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                   T A T G T G
                           ↑
i=12, j=5: G≠G ✗

Mismatch at j=5, character 'G' in text
Bad Character Rule: Shift by max(1, j - badChar['G'])
Shift = max(1, 5 - 5) = max(1, 0) = 1
i = i + 1 = 13
```

**Step 7: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                     T A T G T G
                             ↑
i=13, j=5: A≠G ✗

Mismatch at j=5, character 'A' in text
Bad Character Rule: Shift by max(1, j - badChar['A'])
Shift = max(1, 5 - 1) = max(1, 4) = 4
i = i + 4 = 17
```

**Step 8: New Position**
```
Text:    G C A A T G C C T A T G T G A C C
Pattern:                         T A T G T G
                                 ↑
i=17, j=5: C≠G ✗

Mismatch at j=5, character 'C' in text
Bad Character Rule: 'C' not in pattern, shift by j+1 = 6
i = i + 6 = 23
```

**Step 9: Beyond Text Length**
```
i=23 > text.length() - pattern.length()
Search complete, no match found
```

**Final Result**: No match found.

### Key Observations

1. **Right-to-Left Comparison**: Allows for larger shifts when mismatches occur
2. **Bad Character Rule**: Shifts pattern based on the last occurrence of the mismatched character
3. **Good Suffix Rule**: Additional optimization using pattern structure
4. **Efficiency**: Often skips many characters, making it very fast in practice
5. **Worst Case**: Can still be O(n×m) in pathological cases

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
