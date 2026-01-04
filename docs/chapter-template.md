# Global Chapter Template

This template defines the canonical structure for all chapters in this book. Every chapter should follow this structure unless there is a very good reason not to.

## Chapter Structure

### 1. Problem Statement & Motivation

**Purpose**: Explain why this topic exists.

**Include**:
- The problem(s) this structure/algorithm solves
- Why naive approaches fail
- Where this is used in real systems

**Exclude**:
- Code
- Language-specific details
- Performance tricks

**Rule**: A reader should understand why they care after this section alone.

---

### 2. Conceptual Overview

**Purpose**: Introduce the idea at a high level.

**Include**:
- Intuitive explanation
- Simple examples
- Analogies (if helpful)

**Exclude**:
- Implementation details
- Big-O notation (unless trivial)

**Think**: "Whiteboard explanation."

---

### 3. Abstract Model & Invariants ⭐ (Mandatory)

**Purpose**: Define correctness independent of implementation.

**Include**:
- Abstract representation
- Core invariants that must always hold
- Assumptions (ordering, uniqueness, constraints)

**Example**:
```
Invariant: Every node in the left subtree is < root
```

**Exclude**:
- Code
- Language constructs

**This section is the intellectual backbone of the chapter.**

---

### 4. Operations & Interface

**Purpose**: Define what operations are supported.

**Include**:
- Supported operations
- Preconditions / postconditions
- Behavioral guarantees

**Example**:
| Operation | Description |
|-----------|-------------|
| insert(k) | Adds key k if not present |
| delete(k) | Removes key k if present |

**Exclude**:
- Implementation details

---

### 5. Time & Space Complexity

**Purpose**: Make trade-offs explicit.

**Include**:
- Average / worst-case complexity
- Amortized analysis (if applicable)
- Space overhead

**Use tables whenever possible.**

---

### 6. Pseudocode (Language-Neutral) ⭐ (Mandatory)

**Purpose**: Bridge theory → implementation.

**Rules**:
- No language syntax
- No pointers / templates
- Focus on logic only

**Example**:
```
INSERT(x):
  if root is null:
    root ← new node(x)
```

**This section should be readable by any engineer.**

---

### 7. Implementation (Reference Language: C++) ⭐

**Purpose**: Show a concrete realization.

**Include**:
- Clean, readable C++
- Minimal STL magic
- Comments mapping to pseudocode

**Exclude**:
- Performance hacks unless explained
- Excessive template metaprogramming

**Label clearly as one possible implementation.**

---

### 8. Correctness Argument

**Purpose**: Explain why the implementation works.

**Include**:
- How invariants are preserved
- Why edge cases are handled
- Short proofs or informal reasoning

**Exclude**:
- Formal theorem-level proofs (unless advanced chapter)

**This is where engineers learn to trust their code.**

---

### 9. Edge Cases & Failure Modes

**Purpose**: Build defensive thinking.

**Include**:
- Empty / null cases
- Degenerate inputs
- Overflow / underflow
- Memory issues

**This section maps directly to production bugs.**

---

### 10. Performance & System Considerations ⭐ (Differentiator)

**Purpose**: Connect algorithms to real machines.

**Include** (as applicable):
- Cache locality
- Memory allocation
- Branch prediction
- Concurrency implications
- NUMA / disk / network effects (advanced)

**This is where your book stands out from CLRS-style texts.**

---

### 11. Variants & Extensions

**Purpose**: Show evolution and alternatives.

**Include**:
- Common variants
- What problem each variant solves
- When to choose which

**Example**:
- BST → AVL → Red-Black
- Hash table → Concurrent hash map

---

### 12. Real-World Implementations

**Purpose**: Ground theory in practice.

**Include**:
- Standard library equivalents
- High-level design choices
- Notable trade-offs

**Example**:
- `std::unordered_map`
- Java `HashMap`
- Python `dict`

**No deep dives — just design intuition.**

---

### 13. Common Pitfalls & Interview Traps

**Purpose**: Prevent common mistakes.

**Include**:
- Misconceptions
- Bad assumptions
- Interview gotchas

**Short, high-value section.**

---

### 14. Exercises & Thought Questions (Optional but Recommended)

**Purpose**: Reinforce learning.

**Include**:
- Conceptual questions
- Small implementation tasks
- Performance reasoning problems

---

## Tiered Enforcement

Not all chapters need all sections.

### Tier 1 (Mandatory for ALL core chapters)
- Sections 1-7
- Section 8
- Section 10

### Tier 2 (Strongly recommended)
- Section 9
- Section 11
- Section 12

### Tier 3 (Optional)
- Section 13
- Section 14

---

## Template Usage Guidelines

1. **Consistency**: Use the same section headings across chapters
2. **Flexibility**: Skip sections only if they truly don't apply
3. **Cross-references**: Link to related chapters (e.g., "See Chapter 3.6 for memory hierarchy")
4. **Progressive disclosure**: Start simple, add complexity
5. **Visual aids**: Use diagrams, tables, and code examples appropriately

---

## Why This Template Works

✅ **Scales from Basics → Advanced Systems**
- Works for arrays and LSM trees
- Works for recursion and concurrency

✅ **Language-Agnostic Core**
- Pseudocode + invariants first
- Implementation becomes secondary

✅ **Matches How Senior Engineers Think**
- Contract → invariants → performance → trade-offs

✅ **Makes the Book Maintainable**
- Easy to add chapters later
- Easy to refactor without rewriting everything

---

## Example: How to Apply This Template

When refactoring an existing chapter:

1. **Extract** conceptual content from code-heavy sections
2. **Create** Abstract Model & Invariants section (often missing)
3. **Add** Pseudocode section (extract logic from C++)
4. **Reorganize** code into Implementation section
5. **Enhance** Performance & System Considerations
6. **Add** Correctness Argument and Edge Cases

---

## Notes for Authors

- **Don't skip the abstract model**: This is what makes the book educational, not just tutorial
- **Pseudocode is mandatory**: It's the bridge between theory and practice
- **Systems considerations are your differentiator**: Leverage your systems background
- **Keep code minimal**: Show the idea, not every edge case in code

