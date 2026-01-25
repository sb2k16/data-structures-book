# Hash Tables Chapter Refactoring Guide

This document maps the existing Hash Tables chapter content to the new template structure.

## Template Structure Mapping

### 1. Problem Statement & Motivation
**Source**: Section 10.1 (Introduction) + "Why Hash Tables Matter"
- Extract: Problem description, why hash tables exist
- Remove: Implementation details, code
- Add: When to use vs. when not to use

### 2. Conceptual Overview
**Source**: Section 10.1 (Key Characteristics) + Comparison table
- Extract: High-level explanation, analogies
- Keep: Comparison with other data structures
- Remove: Code examples

### 3. Abstract Model & Invariants ⭐
**Source**: Section 10.1.1 (Core Invariants)
- ✅ Already well-structured
- Keep as-is, but ensure no code references
- Enhance with more abstract language

### 4. Operations & Interface
**Source**: Extract from implementations
- Create table of operations
- Define preconditions/postconditions
- No implementation details

### 5. Time & Space Complexity
**Source**: Section 10.8 (Performance Analysis)
- Reorganize into clear table
- Add amortized analysis
- Separate from implementation

### 6. Pseudocode (Language-Neutral) ⭐ NEW
**Source**: Extract logic from C++ implementations
- Separate Chaining: INSERT, SEARCH, DELETE
- Open Addressing: INSERT, SEARCH, DELETE (for each method)
- Rehashing algorithm
- **No C++ syntax, no pointers, no templates**

### 7. Implementation (C++) ⭐
**Source**: Sections 10.3.1, 10.3.2, 10.4
- Reorganize all code into this section
- Add comments mapping to pseudocode
- Keep clean, minimal implementations

### 8. Correctness Argument
**Source**: NEW (derive from invariants)
- Why insert preserves invariants
- Why search is correct
- Why rehashing maintains correctness
- Edge case handling

### 9. Edge Cases & Failure Modes
**Source**: Section 10.10 (Best Practices) + implicit in code
- Empty table
- Full table
- Duplicate keys
- Poor hash function
- High load factor
- Memory issues

### 10. Performance & System Considerations ⭐
**Source**: Section 10.6.1 (Systems Perspective)
- Memory hierarchy impact
- Cache behavior
- Sequential vs. random access
- False sharing
- Rehashing costs
- Reference Chapter 3.6

### 11. Variants & Extensions
**Source**: Section 10.3 (Collision Resolution Strategies)
- Separate Chaining
- Linear Probing
- Quadratic Probing
- Double Hashing
- Section 10.14 (Advanced Techniques)
- Consistent Hashing
- Perfect Hashing

### 12. Real-World Implementations
**Source**: Section 10.5 (C++ Standard Library)
- std::unordered_map
- std::unordered_set
- Java HashMap
- Python dict
- Design differences

### 13. Common Pitfalls & Interview Traps
**Source**: Section 10.10 (Best Practices) + Section 10.9 (Problems)
- Assuming worst-case O(1)
- Ignoring load factor
- Poor hash functions
- Using when ordering needed
- Interview gotchas

### 14. Exercises & Thought Questions
**Source**: Section 10.12 (Exercises) + Section 10.9 (Problems)
- Keep existing exercises
- Add conceptual questions
- Add performance reasoning

## Key Refactoring Steps

1. **Extract Pseudocode**: Create language-neutral pseudocode from C++ implementations
2. **Separate Concepts**: Move all conceptual content before code
3. **Reorganize Code**: Group all implementations together
4. **Add Correctness**: Create explicit correctness arguments
5. **Enhance Systems**: Expand performance considerations
6. **Add Pitfalls**: Create explicit pitfalls section

## Pseudocode Examples Needed

### Separate Chaining
```
INSERT(key, value):
  index ← hash(key) mod table_size
  for each entry in bucket[index]:
    if entry.key == key:
      entry.value ← value
      return
  add (key, value) to bucket[index]
  if load_factor > threshold:
    REHASH()
```

### Linear Probing
```
INSERT(key, value):
  index ← hash(key) mod table_size
  probe_count ← 0
  while probe_count < table_size:
    if table[index] is EMPTY or DELETED:
      table[index] ← (key, value, OCCUPIED)
      return
    if table[index].key == key:
      table[index].value ← value
      return
    index ← (index + 1) mod table_size
    probe_count ← probe_count + 1
  error "Table full"
```

## Content to Move/Reorganize

- **Hash Functions** (Section 10.2): Move to Variants & Extensions or keep as separate conceptual section before implementation
- **Load Factor** (Section 10.6): Move to Performance & System Considerations
- **Applications** (Section 10.7): Keep but reorganize
- **Concurrency** (Section 10.13): Move to Performance & System Considerations or Variants






