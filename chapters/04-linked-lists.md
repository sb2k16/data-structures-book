# Chapter 4: Linked Lists

## Table of Contents

- [4.1 Problem Statement & Motivation](#problem-statement-motivation)
  - [What Problem Do Linked Lists Solve?](#what-problem-do-linked-lists-solve)
  - [When to Use Linked Lists](#when-to-use-linked-lists)
  - [When NOT to Use Linked Lists](#when-not-to-use-linked-lists)
- [4.2 Conceptual Overview](#conceptual-overview)
  - [Intuitive Explanation](#intuitive-explanation)
  - [Key Characteristics of Linked Lists](#key-characteristics-of-linked-lists)
  - [Comparison with Arrays](#comparison-with-arrays)
- [4.3 Abstract Model & Invariants ⭐](#abstract-model-invariants)
  - [Abstract Model](#abstract-model)
  - [Core Invariants](#core-invariants)
- [4.4 Operations & Interface](#operations-interface)
  - [Behavioral Guarantees](#behavioral-guarantees)
- [4.5 Time & Space Complexity](#time-space-complexity)
  - [Time Complexity](#time-complexity)
  - [Space Complexity](#space-complexity)
  - [Detailed Analysis](#detailed-analysis)
  - [Comparison with Arrays](#comparison-with-arrays)
- [4.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)](#pseudocode-language-neutral-mandatory)
  - [Node Structure (Abstract)](#node-structure-abstract)
  - [Singly Linked List Operations](#singly-linked-list-operations)
  - [Doubly Linked List Operations](#doubly-linked-list-operations)
- [4.7 Implementation (Reference Language: C++) ⭐](#implementation-reference-language-c)
  - [4.7.1 Basic Singly Linked List Implementation](#1-basic-singly-linked-list-implementation)
  - [Node Structure](#node-structure)
  - [Singly Linked List Implementation](#singly-linked-list-implementation)
  - [Example Usage](#example-usage)
  - [4.3 Basic Doubly Linked List Implementation](#basic-doubly-linked-list-implementation)
  - [Node Structure](#node-structure)
  - [Doubly Linked List Implementation](#doubly-linked-list-implementation)
  - [4.7.3 Basic Circular Linked List Implementation](#3-basic-circular-linked-list-implementation)
  - [Circular Singly Linked List](#circular-singly-linked-list)
  - [4.5 Skip Lists](#skip-lists)
  - [Key Characteristics of Skip Lists](#key-characteristics-of-skip-lists)
  - [Advantages of Skip Lists](#advantages-of-skip-lists)
  - [Skip List Structure](#skip-list-structure)
  - [Skip List Implementation](#skip-list-implementation)
  - [How Skip Lists Work](#how-skip-lists-work)
  - [Time and Space Complexity](#time-and-space-complexity)
  - [When to Use Skip Lists](#when-to-use-skip-lists)
  - [Skip Lists vs Other Data Structures](#skip-lists-vs-other-data-structures)
  - [4.6 Implementation Trade-offs and Analysis](#implementation-trade-offs-and-analysis)
  - [4.7 Common Linked List Algorithms](#common-linked-list-algorithms)
  - [Detect Cycle in Linked List (Floyd's Cycle Detection)](#detect-cycle-in-linked-list-floyds-cycle-detection)
  - [Merge Two Sorted Linked Lists](#merge-two-sorted-linked-lists)
  - [Remove Nth Node from End](#remove-nth-node-from-end)
  - [Palindrome Check for Linked List](#palindrome-check-for-linked-list)
  - [Intersection of Two Linked Lists](#intersection-of-two-linked-lists)
  - [4.8 Advanced Linked List Operations](#advanced-linked-list-operations)
  - [Sort Linked List (Merge Sort)](#sort-linked-list-merge-sort)
  - [Rotate Linked List](#rotate-linked-list)
  - [4.9 Common Interview Problems](#common-interview-problems)
- [4.8 Correctness Argument](#correctness-argument)
  - [Invariant Preservation](#invariant-preservation)
  - [Edge Case Handling](#edge-case-handling)
  - [Termination Guarantee](#termination-guarantee)
  - [Informal Proof Sketch](#informal-proof-sketch)
- [4.9 Edge Cases & Failure Modes](#edge-cases-failure-modes)
  - [Empty List Cases](#empty-list-cases)
  - [Position Out of Bounds](#position-out-of-bounds)
  - [Memory Issues](#memory-issues)
  - [Cycle Detection](#cycle-detection)
  - [Integer Overflow](#integer-overflow)
  - [Common Failure Patterns](#common-failure-patterns)
- [4.10 Performance & System Considerations ⭐ (Differentiator)](#performance-system-considerations-differentiator)
  - [Cache Locality](#cache-locality)
  - [Memory Allocation](#memory-allocation)
  - [Branch Prediction](#branch-prediction)
  - [Pointer Chasing](#pointer-chasing)
  - [Concurrency Implications](#concurrency-implications)
  - [NUMA Considerations (Advanced)](#numa-considerations-advanced)
  - [Practical Recommendations](#practical-recommendations)
  - [4.11 Performance Analysis](#performance-analysis)
  - [Space Complexity](#space-complexity)
  - [4.12 Failure Modes and Common Pitfalls](#failure-modes-and-common-pitfalls)
  - [4.13 Key Takeaways](#key-takeaways)
  - [4.14 Practice Exercises](#practice-exercises)
- [4.15 Concurrency Considerations](#concurrency-considerations)
  - [4.15.1 Shared-State Invariants](#1-shared-state-invariants)
  - [4.15.2 Operations That Must Be Atomic](#2-operations-that-must-be-atomic)
  - [4.15.3 Naïve Approaches and Why They Fail](#3-naïve-approaches-and-why-they-fail)
  - [4.15.4 Locking Strategies](#4-locking-strategies)
  - [4.15.5 Performance and Scalability Implications](#5-performance-and-scalability-implications)
  - [4.15.6 When Not to Do This Yourself](#6-when-not-to-do-this-yourself)
- [4.16 Practical Applications](#practical-applications)
  - [4.16.1 LRU Cache Implementation (Preview)](#1-lru-cache-implementation-preview)
  - [4.16.2 Undo/Redo Systems](#2-undoredo-systems)
  - [4.16.3 Browser History](#3-browser-history)
  - [4.16.4 Other Applications](#4-other-applications)
- [4.11 Variants & Extensions](#variants-extensions)
  - [Linked List Variants](#linked-list-variants)
  - [When to Choose Which Variant](#when-to-choose-which-variant)
  - [Extensions](#extensions)
- [4.12 Real-World Implementations](#real-world-implementations)
  - [Standard Library Equivalents](#standard-library-equivalents)
  - [Notable Trade-offs in Real Systems](#notable-trade-offs-in-real-systems)
  - [When Real Systems Use Linked Lists](#when-real-systems-use-linked-lists)
  - [4.17 Summary](#summary)



## 4.1 Problem Statement & Motivation

### What Problem Do Linked Lists Solve?

Arrays have limitations when dealing with dynamic data:

- **Fixed Size**: Static arrays have fixed size, vectors require resizing (expensive)
- **Expensive Insertion/Deletion**: Inserting/deleting in middle requires shifting elements (O(n))
- **Memory Waste**: Pre-allocating space for growth wastes memory
- **Contiguous Memory Requirement**: Large arrays may not find contiguous memory blocks

**Naive Approaches and Their Limitations**:

- **Static Arrays**: Fixed size, no flexibility
- **Vectors with Resizing**: O(n) cost for resizing, memory copying
- **Multiple Small Arrays**: Hard to manage, inefficient

**The Linked List Solution**: Linked lists provide dynamic size with O(1) insertion/deletion at known positions, using non-contiguous memory allocation. Each element points to the next, eliminating the need for shifting.

### When to Use Linked Lists

✅ **Use linked lists when**:
- Size is unknown at compile time
- Frequent insertions/deletions at beginning or middle
- Don't need random access
- Memory allocation is dynamic
- Implementing stacks, queues, or other dynamic structures

✅ **Real-world applications**:
- Dynamic memory allocation
- Undo/Redo systems
- Browser history (back/forward)
- LRU Cache implementation
- Polynomial representation
- Sparse matrices
- Symbol tables in compilers

### When NOT to Use Linked Lists

❌ **Avoid linked lists when**:
- Random access needed frequently (use arrays)
- Cache performance is critical (arrays are cache-friendly)
- Memory overhead is a concern (pointers add overhead)
- Size is known and fixed (arrays are simpler)
- Sequential access patterns (arrays are faster)

**Key Trade-off**: Linked lists trade random access and cache performance for dynamic size and efficient insertion/deletion.

## 4.2 Conceptual Overview

A **linked list** is a linear data structure where elements (nodes) are stored in sequence, but unlike arrays, the elements are not stored in contiguous memory locations. Instead, each node contains data and a reference (pointer) to the next node in the sequence.

### Intuitive Explanation

Think of a linked list like a treasure hunt:
- **Nodes** are locations with clues
- **Pointers** are directions to the next location
- **Head** is the starting point
- **Traversal** follows the chain of clues
- **Insertion** adds a new location in the chain
- **Deletion** removes a location and updates directions

### Key Characteristics of Linked Lists
- **Dynamic size** - can grow and shrink during runtime
- **Non-contiguous memory** - nodes can be scattered in memory
- **Sequential access** - cannot access elements by index directly
- **Memory efficient** - only uses memory for actual data and pointers
- **Easy insertion/deletion** - no need to shift elements

### Comparison with Arrays

| Feature | Array | Linked List |
|---------|-------|-------------|
| **Access Time** | O(1) - Direct indexing | O(n) - Sequential traversal |
| **Insertion at Beginning** | O(n) - Shift all elements | O(1) - Update head pointer |
| **Insertion at End** | O(1) - If space available | O(n) - Without tail pointer<br/>O(1) - With tail pointer |
| **Insertion at Middle** | O(n) - Shift elements | O(n) - Traverse to position<br/>O(1) - If node pointer known |
| **Deletion at Beginning** | O(n) - Shift all elements | O(1) - Update head pointer |
| **Deletion at End** | O(1) - Remove last element | O(n) - Without tail pointer<br/>O(1) - With tail pointer |
| **Deletion at Middle** | O(n) - Shift elements | O(n) - Traverse to position<br/>O(1) - If node pointer known |
| **Memory Usage** | Fixed size (static arrays)<br/>Dynamic size (vectors) | Dynamic - grows/shrinks as needed |
| **Memory Layout** | Contiguous memory | Non-contiguous (scattered) |
| **Cache Performance** | Excellent - Sequential access | Poor - Random memory access |
| **Memory Overhead** | None (arrays)<br/>Small (vectors) | Pointer overhead per node<br/>8 bytes (64-bit) per pointer |
| **Memory Efficiency** | High - No pointer overhead | Lower - Extra memory for pointers |
| **Random Access** | Yes - Direct indexing | No - Must traverse |
| **Size Flexibility** | Fixed (arrays)<br/>Dynamic (vectors) | Fully dynamic |
| **Memory Allocation** | Single block | Multiple allocations |
| **Use Cases** | Fixed size data<br/>Random access needed<br/>Cache performance critical | Dynamic size<br/>Frequent insertions/deletions<br/>Unknown size at compile time |

## 4.3 Abstract Model & Invariants ⭐

Understanding invariants is crucial for reasoning about linked lists correctly. This section defines correctness **independent of any implementation**.

### Abstract Model

A linked list consists of:
- **Sequence of nodes**: Each node contains data and a reference to the next node
- **Head pointer**: Points to the first node (or null if empty)
- **Tail pointer** (optional): Points to the last node
- **Termination**: Last node's next pointer is null (unless circular)

### Core Invariants

These invariants must **always** hold for a linked list to be correct:

#### Core Invariants of a Singly Linked List

1. **Head Pointer Invariant**: 
   - If the list is empty, `head == nullptr`
   - If the list is non-empty, `head` points to the first node
   - The first node has no predecessor
   - `head` must never point to a deleted or invalid node

2. **Tail Pointer Invariant** (if maintained):
   - If the list is empty, `tail == nullptr`
   - If the list is non-empty, `tail` points to the last node
   - The last node's `next` must be `nullptr` (unless circular)
   - `tail->next == nullptr` (for non-circular lists)
   - `tail` must never point to a deleted or invalid node

3. **Linkage Invariant**:
   - Each node (except the last) has exactly one successor via `next`
   - The last node has `next == nullptr` (unless circular)
   - No cycles exist (unless explicitly a circular list)
   - All `next` pointers form a valid chain from `head` to `tail`

4. **Size Consistency Invariant**:
   - `size` equals the number of nodes in the list
   - `size == 0` if and only if `head == nullptr`
   - `size` must be updated atomically with list modifications
   - `size` must never be negative

5. **Acyclicity Invariant** (for non-circular lists):
   - No cycles exist in the list
   - Traversing from `head` must eventually reach `nullptr`
   - No node's `next` pointer points back to an earlier node

6. **Memory Invariant**:
   - All nodes are reachable from `head` (no orphaned nodes)
   - No dangling pointers (all `next` pointers are either `nullptr` or valid)
   - All allocated nodes are either in the list or properly deleted

#### Why Invariants Matter

- **Correctness**: Operations must preserve invariants
- **Debugging**: Violated invariants indicate bugs
- **Reasoning**: Invariants help prove algorithm correctness
- **Design**: Clear invariants guide implementation decisions

**Example**: When inserting at head, we must:
1. Create new node with `next = current head` (preserves linkage)
2. Update `head` to new node (preserves head invariant)
3. Increment `size` (preserves size invariant)

If any step fails, invariants are violated and the list becomes invalid.

## 4.4 Operations & Interface

**Purpose**: Define what operations are supported.

Linked lists support the following core operations:

| Operation | Description | Precondition | Postcondition |
|-----------|-------------|--------------|---------------|
| `insertAtHead(value)` | Insert element at beginning | Value is valid | New node is first, size increases by 1 |
| `insertAtTail(value)` | Insert element at end | Value is valid | New node is last, size increases by 1 |
| `insertAtPosition(value, pos)` | Insert element at position | `0 ≤ pos ≤ size` | New node at position, size increases by 1 |
| `deleteAtHead()` | Remove first element | List is non-empty | First node removed, size decreases by 1 |
| `deleteAtTail()` | Remove last element | List is non-empty | Last node removed, size decreases by 1 |
| `deleteAtPosition(pos)` | Remove element at position | `0 ≤ pos < size` | Node at position removed, size decreases by 1 |
| `search(value)` | Find element in list | Value is valid | Returns position if found, -1 otherwise |
| `getValueAt(pos)` | Get value at position | `0 ≤ pos < size` | Returns value at position |
| `isEmpty()` | Check if list is empty | None | Returns true if size == 0 |
| `getSize()` | Get number of elements | None | Returns current size |
| `traverse()` | Visit all elements | None | Processes each element in order |

### Behavioral Guarantees

1. **Insertion Guarantees**:
   - Insertion preserves list order
   - All existing nodes remain accessible
   - Size is updated atomically with insertion

2. **Deletion Guarantees**:
   - Deletion doesn't affect other nodes
   - Memory is properly deallocated
   - Size is updated atomically with deletion

3. **Traversal Guarantees**:
   - Traversal visits nodes in order from head to tail
   - Each node is visited exactly once
   - Traversal terminates at tail (nullptr)

4. **Search Guarantees**:
   - Search returns first occurrence if duplicates exist
   - Search is complete (checks all nodes)
   - Returns -1 if element not found

## 4.5 Time & Space Complexity

**Purpose**: Make trade-offs explicit.

### Time Complexity

| Operation | Singly Linked List | Doubly Linked List | Notes |
|-----------|-------------------|-------------------|-------|
| **Access by Index** | O(n) | O(n) | Must traverse from head |
| **Search** | O(n) | O(n) | Linear search required |
| **Insert at Head** | O(1) | O(1) | Direct head update |
| **Insert at Tail** | O(n) | O(1) | With tail pointer: O(1) |
| **Insert at Position** | O(n) | O(n) | Must traverse to position |
| **Delete at Head** | O(1) | O(1) | Direct head update |
| **Delete at Tail** | O(n) | O(1) | With tail pointer: O(1) |
| **Delete at Position** | O(n) | O(n) | Must traverse to position |
| **Delete by Value** | O(n) | O(n) | Search + delete |

### Space Complexity

| Aspect | Space Complexity | Notes |
|--------|------------------|-------|
| **Storage per Node** | O(1) | Fixed size per node |
| **Total Space** | O(n) | n nodes for n elements |
| **Overhead per Node** | O(1) | One pointer (singly) or two (doubly) |
| **Auxiliary Space** | O(1) | Operations use constant extra space |

### Detailed Analysis

#### Singly Linked List

**Memory per Node**:
- Data: sizeof(T) bytes
- Next pointer: 8 bytes (64-bit system)
- **Total**: sizeof(T) + 8 bytes per node

**Example**: For `int` (4 bytes):
- Per node: 4 + 8 = 12 bytes
- For 1000 nodes: 12,000 bytes ≈ 12 KB

#### Doubly Linked List

**Memory per Node**:
- Data: sizeof(T) bytes
- Next pointer: 8 bytes
- Previous pointer: 8 bytes
- **Total**: sizeof(T) + 16 bytes per node

**Example**: For `int` (4 bytes):
- Per node: 4 + 16 = 20 bytes
- For 1000 nodes: 20,000 bytes ≈ 20 KB

### Comparison with Arrays

| Operation | Array | Linked List | Winner |
|-----------|-------|-------------|--------|
| Random Access | O(1) | O(n) | Array |
| Insert at Beginning | O(n) | O(1) | Linked List |
| Insert at End | O(1) amortized | O(1) with tail | Tie |
| Delete at Beginning | O(n) | O(1) | Linked List |
| Memory Overhead | O(1) | O(n) pointers | Array |

## 4.6 Pseudocode (Language-Neutral) ⭐ (Mandatory)

**Purpose**: Bridge theory → implementation.

**Rules**: No language syntax, no pointers/templates, focus on logic only.

### Node Structure (Abstract)

```
NODE:
  data: value of type T
  next: reference to next node (or null)
```

### Singly Linked List Operations

#### Insert at Head

```
FUNCTION insertAtHead(list, value):
  new_node ← create node with value
  new_node.next ← list.head
  list.head ← new_node
  list.size ← list.size + 1
END FUNCTION
```

#### Insert at Tail

```
FUNCTION insertAtTail(list, value):
  new_node ← create node with value
  new_node.next ← null
  
  IF list.head is null:
    list.head ← new_node
  ELSE:
    current ← list.head
    WHILE current.next is not null:
      current ← current.next
    current.next ← new_node
  END IF
  
  list.size ← list.size + 1
END FUNCTION
```

#### Insert at Position

```
FUNCTION insertAtPosition(list, value, position):
  IF position > list.size:
    ERROR "Position out of bounds"
  END IF
  
  IF position = 0:
    insertAtHead(list, value)
    RETURN
  END IF
  
  new_node ← create node with value
  current ← list.head
  
  FOR i FROM 0 TO position - 2:
    current ← current.next
  END FOR
  
  new_node.next ← current.next
  current.next ← new_node
  list.size ← list.size + 1
END FUNCTION
```

#### Delete at Head

```
FUNCTION deleteAtHead(list):
  IF list.head is null:
    RETURN false
  END IF
  
  old_head ← list.head
  list.head ← list.head.next
  delete old_head
  list.size ← list.size - 1
  RETURN true
END FUNCTION
```

#### Delete at Tail

```
FUNCTION deleteAtTail(list):
  IF list.head is null:
    RETURN false
  END IF
  
  IF list.head.next is null:
    delete list.head
    list.head ← null
  ELSE:
    current ← list.head
    WHILE current.next.next is not null:
      current ← current.next
    delete current.next
    current.next ← null
  END IF
  
  list.size ← list.size - 1
  RETURN true
END FUNCTION
```

#### Search

```
FUNCTION search(list, value):
  current ← list.head
  position ← 0
  
  WHILE current is not null:
    IF current.data = value:
      RETURN position
    END IF
    current ← current.next
    position ← position + 1
  END WHILE
  
  RETURN -1
END FUNCTION
```

#### Traverse

```
FUNCTION traverse(list, process_function):
  current ← list.head
  
  WHILE current is not null:
    process_function(current.data)
    current ← current.next
  END WHILE
END FUNCTION
```

#### Get Value at Position

```
FUNCTION getValueAt(list, position):
  IF position < 0 OR position >= list.size:
    ERROR "Position out of bounds"
  END IF
  
  current ← list.head
  FOR i FROM 0 TO position - 1:
    current ← current.next
  END FOR
  
  RETURN current.data
END FUNCTION
```

### Doubly Linked List Operations

#### Insert at Head (Doubly Linked)

```
FUNCTION insertAtHeadDoubly(list, value):
  new_node ← create node with value
  new_node.next ← list.head
  new_node.prev ← null
  
  IF list.head is not null:
    list.head.prev ← new_node
  ELSE:
    list.tail ← new_node
  END IF
  
  list.head ← new_node
  list.size ← list.size + 1
END FUNCTION
```

#### Delete at Position (Doubly Linked)

```
FUNCTION deleteAtPositionDoubly(list, position):
  IF position < 0 OR position >= list.size:
    ERROR "Position out of bounds"
  END IF
  
  current ← list.head
  FOR i FROM 0 TO position - 1:
    current ← current.next
  END FOR
  
  IF current.prev is not null:
    current.prev.next ← current.next
  ELSE:
    list.head ← current.next
  END IF
  
  IF current.next is not null:
    current.next.prev ← current.prev
  ELSE:
    list.tail ← current.prev
  END IF
  
  delete current
  list.size ← list.size - 1
END FUNCTION
```

This pseudocode should be readable by any engineer, regardless of their programming language background.

## 4.7 Implementation (Reference Language: C++) ⭐

**Note to Reader**: This section provides concrete C++ implementations. The correctness relies on the invariants defined in Section 4.3 and the pseudocode in Section 4.6.

### 4.7.1 Basic Singly Linked List Implementation

### Node Structure
```cpp
#include <iostream>
#include <memory>
using namespace std;

template<typename T>
struct ListNode {
    T data;
    unique_ptr<ListNode<T>> next;
    
    ListNode(T value) : data(value), next(nullptr) {}
};

// Alternative implementation with raw pointers
template<typename T>
struct ListNodeRaw {
    T data;
    ListNodeRaw<T>* next;
    
    ListNodeRaw(T value) : data(value), next(nullptr) {}
};
```

### Singly Linked List Implementation
```cpp
template<typename T>
class SinglyLinkedList {
private:
    unique_ptr<ListNode<T>> head;
    size_t size;
    
public:
    SinglyLinkedList() : head(nullptr), size(0) {}
    
    // Destructor - automatically handles memory cleanup
    ~SinglyLinkedList() = default;
    
    // Insert at the beginning
    void insertAtHead(T value) {
        auto newNode = make_unique<ListNode<T>>(value);
        newNode->next = move(head);
        head = move(newNode);
        size++;
    }
    
    // Insert at the end
    void insertAtTail(T value) {
        auto newNode = make_unique<ListNode<T>>(value);
        
        if (!head) {
            head = move(newNode);
        } else {
            ListNode<T>* current = head.get();
            while (current->next) {
                current = current->next.get();
            }
            current->next = move(newNode);
        }
        size++;
    }
    
    // Insert at specific position
    void insertAtPosition(T value, size_t position) {
        if (position > size) {
            throw out_of_range("Position out of bounds");
        }
        
        if (position == 0) {
            insertAtHead(value);
            return;
        }
        
        auto newNode = make_unique<ListNode<T>>(value);
        ListNode<T>* current = head.get();
        
        for (size_t i = 0; i < position - 1; i++) {
            current = current->next.get();
        }
        
        newNode->next = move(current->next);
        current->next = move(newNode);
        size++;
    }
    
    // Delete from the beginning
    bool deleteAtHead() {
        if (!head) {
            return false;
        }
        
        head = move(head->next);
        size--;
        return true;
    }
    
    // Delete from the end
    bool deleteAtTail() {
        if (!head) {
            return false;
        }
        
        if (!head->next) {
            head.reset();
            size--;
            return true;
        }
        
        ListNode<T>* current = head.get();
        while (current->next->next) {
            current = current->next.get();
        }
        
        current->next.reset();
        size--;
        return true;
    }
    
    // Delete by value
    bool deleteByValue(T value) {
        if (!head) {
            return false;
        }
        
        if (head->data == value) {
            return deleteAtHead();
        }
        
        ListNode<T>* current = head.get();
        while (current->next && current->next->data != value) {
            current = current->next.get();
        }
        
        if (current->next) {
            current->next = move(current->next->next);
            size--;
            return true;
        }
        
        return false;
    }
    
    // Search for a value
    bool search(T value) const {
        ListNode<T>* current = head.get();
        while (current) {
            if (current->data == value) {
                return true;
            }
            current = current->next.get();
        }
        return false;
    }
    
    // Get element at specific position
    T getAtPosition(size_t position) const {
        if (position >= size) {
            throw out_of_range("Position out of bounds");
        }
        
        ListNode<T>* current = head.get();
        for (size_t i = 0; i < position; i++) {
            current = current->next.get();
        }
        return current->data;
    }
    
    // Get size
    size_t getSize() const {
        return size;
    }
    
    // Check if empty
    bool isEmpty() const {
        return size == 0;
    }
    
    // Display the list
    void display() const {
        ListNode<T>* current = head.get();
        cout << "List: ";
        while (current) {
            cout << current->data << " -> ";
            current = current->next.get();
        }
        cout << "null" << endl;
    }
    
    // Reverse the list
    void reverse() {
        ListNode<T>* prev = nullptr;
        ListNode<T>* current = head.release();
        
        while (current) {
            ListNode<T>* next = current->next.release();
            current->next.reset(prev);
            prev = current;
            current = next;
        }
        
        head.reset(prev);
    }
};
```

### Example Usage
```cpp
void demonstrateSinglyLinkedList() {
    SinglyLinkedList<int> list;
    
    // Insert elements
    list.insertAtHead(3);
    list.insertAtHead(2);
    list.insertAtHead(1);
    list.insertAtTail(4);
    list.insertAtTail(5);
    list.insertAtPosition(10, 2);
    
    list.display();  // List: 1 -> 2 -> 10 -> 3 -> 4 -> 5 -> null
    
    // Search
    cout << "Search 10: " << list.search(10) << endl;
    cout << "Search 6: " << list.search(6) << endl;
    
    // Delete
    list.deleteByValue(10);
    list.deleteAtHead();
    list.deleteAtTail();
    
    list.display();  // List: 2 -> 3 -> 4 -> null
    
    // Reverse
    list.reverse();
    list.display();  // List: 4 -> 3 -> 2 -> null
    
    cout << "Size: " << list.getSize() << endl;
}
```

### 4.3 Basic Doubly Linked List Implementation

A doubly linked list has nodes with pointers to both the next and previous nodes, enabling traversal in both directions.

### Node Structure
```cpp
template<typename T>
struct DoublyListNode {
    T data;
    unique_ptr<DoublyListNode<T>> next;
    DoublyListNode<T>* prev;
    
    DoublyListNode(T value) : data(value), next(nullptr), prev(nullptr) {}
};
```

### Doubly Linked List Implementation
```cpp
template<typename T>
class DoublyLinkedList {
private:
    unique_ptr<DoublyListNode<T>> head;
    DoublyListNode<T>* tail;
    size_t size;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    // Insert at the beginning
    void insertAtHead(T value) {
        auto newNode = make_unique<DoublyListNode<T>>(value);
        
        if (!head) {
            head = move(newNode);
            tail = head.get();
        } else {
            newNode->next = move(head);
            head->prev = newNode.get();
            head = move(newNode);
        }
        size++;
    }
    
    // Insert at the end
    void insertAtTail(T value) {
        auto newNode = make_unique<DoublyListNode<T>>(value);
        
        if (!tail) {
            head = move(newNode);
            tail = head.get();
        } else {
            tail->next = move(newNode);
            newNode->prev = tail;
            tail = tail->next.get();
        }
        size++;
    }
    
    // Delete from the beginning
    bool deleteAtHead() {
        if (!head) {
            return false;
        }
        
        if (head == tail) {
            head.reset();
            tail = nullptr;
        } else {
            head = move(head->next);
            head->prev = nullptr;
        }
        size--;
        return true;
    }
    
    // Delete from the end
    bool deleteAtTail() {
        if (!tail) {
            return false;
        }
        
        if (head.get() == tail) {
            head.reset();
            tail = nullptr;
        } else {
            tail = tail->prev;
            tail->next.reset();
        }
        size--;
        return true;
    }
    
    // Display forward
    void displayForward() const {
        DoublyListNode<T>* current = head.get();
        cout << "Forward: ";
        while (current) {
            cout << current->data << " <-> ";
            current = current->next.get();
        }
        cout << "null" << endl;
    }
    
    // Display backward
    void displayBackward() const {
        DoublyListNode<T>* current = tail;
        cout << "Backward: ";
        while (current) {
            cout << current->data << " <-> ";
            current = current->prev;
        }
        cout << "null" << endl;
    }
    
    // Get size
    size_t getSize() const {
        return size;
    }
    
    // Check if empty
    bool isEmpty() const {
        return size == 0;
    }
};
```

### 4.7.3 Basic Circular Linked List Implementation

A circular linked list is a variation where the last node points back to the first node, forming a circle.

### Circular Singly Linked List
```cpp
template<typename T>
class CircularLinkedList {
private:
    ListNode<T>* head;
    ListNode<T>* tail;
    size_t size;
    
public:
    CircularLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    // Insert at the beginning
    void insertAtHead(T value) {
        auto newNode = make_unique<ListNode<T>>(value);
        
        if (!head) {
            head = newNode.release();
            tail = head;
            tail->next = head;
        } else {
            newNode->next.reset(head);
            head = newNode.release();
            tail->next = head;
        }
        size++;
    }
    
    // Insert at the end
    void insertAtTail(T value) {
        auto newNode = make_unique<ListNode<T>>(value);
        
        if (!tail) {
            head = newNode.release();
            tail = head;
            tail->next = head;
        } else {
            newNode->next.reset(head);
            tail->next = newNode.release();
            tail = tail->next.get();
        }
        size++;
    }
    
    // Display the list
    void display() const {
        if (!head) {
            cout << "Empty list" << endl;
            return;
        }
        
        ListNode<T>* current = head;
        cout << "Circular List: ";
        do {
            cout << current->data << " -> ";
            current = current->next.get();
        } while (current != head);
        cout << "..." << endl;
    }
    
    // Get size
    size_t getSize() const {
        return size;
    }
};
```

## Part II: Advanced Implementations

### 4.5 Skip Lists

A **Skip List** is a probabilistic data structure that allows for fast search, insertion, and deletion operations. It was invented by William Pugh in 1989 as an alternative to balanced trees. Skip lists provide O(log n) average-case performance for search, insertion, and deletion operations, making them comparable to balanced binary search trees but with simpler implementation.

### Key Characteristics of Skip Lists

- **Probabilistic structure** - uses randomization to maintain balance
- **Multiple levels** - each node can have multiple forward pointers at different levels
- **Sorted order** - elements are maintained in sorted order
- **Fast operations** - O(log n) average time complexity for search, insert, and delete
- **Simple implementation** - easier to implement than balanced trees
- **Space efficient** - uses O(n) space on average

### Advantages of Skip Lists

1. **Simplicity**: Much easier to implement than balanced trees (AVL, Red-Black)
2. **Probabilistic balance**: No complex rebalancing operations needed
3. **Concurrent operations**: Easier to make thread-safe compared to balanced trees
4. **Cache friendly**: Better memory locality than some tree structures
5. **Dynamic**: Supports efficient insertion and deletion
6. **Range queries**: Can efficiently find elements in a range
7. **Maintenance**: No complex rotation or rebalancing operations

### Skip List Structure

A skip list consists of multiple levels, where:
- **Level 0**: Contains all elements in sorted order (like a regular linked list)
- **Higher levels**: Contain fewer elements, acting as "express lanes"
- **Head node**: Special node that points to the first element at each level
- **Forward pointers**: Each node has an array of forward pointers for different levels

### Skip List Implementation

```cpp
#include <memory>
#include <vector>
#include <random>
using namespace std;

class Skiplist {
    struct Node {
        int val;
        vector<shared_ptr<Node>> forward;

        Node(int v, int level): val(v), forward(level, nullptr) {}
    };
private:
    int max_level{16};
    int level{0};
    shared_ptr<Node> head;
    mt19937 rng{random_device{}()};

private:

    int random_level() {
        int lvl = 0;
        uniform_int_distribution<int> dist(0, 1);
        while (dist(rng) && lvl < max_level - 1) {
            lvl++;
        }
        return lvl;
    }

public:
    Skiplist() {
        head = make_shared<Node>(-1, max_level);
    }
    
    bool search(int target) {
        shared_ptr<Node> curr = head;
        for (int i=level; i>=0; i--) {
            while (curr->forward[i] && curr->forward[i]->val < target) {
                curr = curr->forward[i];
            }
        }
        if (!curr) return false;
        shared_ptr<Node> target_node = curr->forward[0];
        if (!target_node || target_node->val != target) return false;
        return true;
    }
    
    void add(int num) {
        vector<shared_ptr<Node>> update(max_level, nullptr);
        shared_ptr<Node> curr = head;
        for (int i=level; i>=0; i--) {
            while (curr->forward[i] && curr->forward[i]->val < num) {
                curr = curr->forward[i];
            }
            update[i] = curr;
        }

        int new_level = random_level();
        if (new_level > level) {
            for (int i=level+1; i<=new_level; i++) {
                update[i] = head;
            }
            level = new_level;
        }

        auto newNode = make_shared<Node>(num, new_level+1);
        for (int i=0; i<=new_level; i++) {
            newNode->forward[i] = update[i]->forward[i];
            update[i]->forward[i] = newNode;
        }
    }
    
    bool erase(int num) {
        vector<shared_ptr<Node>> update(max_level, nullptr);
        shared_ptr<Node> curr = head;
        for (int i=level; i>=0; i--) {
            while (curr->forward[i] && curr->forward[i]->val < num) {
                curr = curr->forward[i];
            }
            update[i] = curr;
        }
        if (!curr || !curr->forward[0]) return false;
        curr = curr->forward[0];
        if (curr->val != num) return false;

        for (int i=0; i<=level; i++) {
            if (update[i]->forward[i] != curr) break;
            update[i]->forward[i] = curr->forward[i];
        }

        while (level > 0 && !head->forward[level]) {
            level--;
        }

        return true;
    }
};

/**
 * Example usage with smart pointers:
 * Skiplist skiplist;
 * bool param_1 = skiplist.search(target);
 * skiplist.add(num);
 * bool param_3 = skiplist.erase(num);
 */
```

### How Skip Lists Work

1. **Search Operation**:
   - Start at the highest level of the head node
   - Move right as long as the next node's value is less than the target
   - When we can't move right, move down one level
   - Continue until we reach level 0
   - Check if the target node exists

2. **Insert Operation**:
   - Find the position where the new node should be inserted (similar to search)
   - Determine the level of the new node using randomization
   - Create the new node with the determined level
   - Update all forward pointers at each level

3. **Delete Operation**:
   - Find the node to be deleted (similar to search)
   - Update all forward pointers to bypass the deleted node
   - Adjust the skip list level if necessary
   - Delete the node

### Time and Space Complexity

| Operation | Average Case | Worst Case | Space |
|-----------|-------------|------------|-------|
| Search | O(log n) | O(n) | O(n) |
| Insert | O(log n) | O(n) | O(n) |
| Delete | O(log n) | O(n) | O(n) |

### When to Use Skip Lists

- **Database indexing**: Used in some database systems for indexing
- **Concurrent data structures**: Easier to make thread-safe than balanced trees
- **Range queries**: Efficient for finding elements in a range
- **When simplicity matters**: Easier to implement and maintain than balanced trees
- **Memory-constrained environments**: Better cache performance than some tree structures

### Skip Lists vs Other Data Structures

| Feature | Skip List | Balanced BST | Hash Table |
|---------|-----------|--------------|------------|
| Search | O(log n) | O(log n) | O(1) average |
| Insert | O(log n) | O(log n) | O(1) average |
| Delete | O(log n) | O(log n) | O(1) average |
| Range Queries | O(log n + k) | O(log n + k) | O(n) |
| Implementation | Simple | Complex | Medium |
| Memory | O(n) | O(n) | O(n) |
| Ordering | Sorted | Sorted | No |

### 4.6 Implementation Trade-offs and Analysis

#### Time Complexity Comparison

| Operation | Singly Linked List | Doubly Linked List | Skip List |
|-----------|-------------------|-------------------|-----------|
| Access | O(n) | O(n) | O(log n) average |
| Search | O(n) | O(n) | O(log n) average |
| Insertion at Head | O(1) | O(1) | O(log n) average |
| Insertion at Tail | O(n) | O(1) | O(log n) average |
| Insertion at Position | O(n) | O(n) | O(log n) average |
| Deletion at Head | O(1) | O(1) | O(log n) average |
| Deletion at Tail | O(n) | O(1) | O(log n) average |
| Deletion at Position | O(n) | O(n) | O(log n) average |

#### Space Complexity
- **Singly Linked List**: O(1) extra space per operation, O(n) total space
- **Doubly Linked List**: O(1) extra space per operation, O(n) total space  
- **Skip List**: O(n) average space for multiple levels

#### When to Use Each Implementation

**Singly Linked List:**
- ✅ Memory efficient (single pointer per node)
- ✅ Simple implementation
- ✅ Good for forward-only traversal
- ❌ No backward traversal
- ❌ O(n) for tail operations

**Doubly Linked List:**
- ✅ Bidirectional traversal
- ✅ O(1) tail operations
- ✅ Easy to implement deque
- ❌ More memory overhead (two pointers per node)
- ❌ More complex implementation

**Skip List:**
- ✅ O(log n) average performance
- ✅ Simpler than balanced trees
- ✅ Good for range queries
- ❌ Probabilistic performance
- ❌ More complex implementation

## Part III: Applications

### 4.7 Common Linked List Algorithms

### Detect Cycle in Linked List (Floyd's Cycle Detection)
```cpp
bool hasCycle(ListNode<int>* head) {
    if (!head || !head->next) {
        return false;
    }
    
    ListNode<int>* slow = head;
    ListNode<int>* fast = head->next.get();
    
    while (fast && fast->next) {
        if (slow == fast) {
            return true;
        }
        slow = slow->next.get();
        fast = fast->next->next.get();
    }
    
    return false;
}

// Find the starting point of the cycle
ListNode<int>* detectCycleStart(ListNode<int>* head) {
    if (!head || !head->next) {
        return nullptr;
    }
    
    ListNode<int>* slow = head;
    ListNode<int>* fast = head;
    
    // First phase: detect if cycle exists
    while (fast && fast->next) {
        slow = slow->next.get();
        fast = fast->next->next.get();
        
        if (slow == fast) {
            break;
        }
    }
    
    if (slow != fast) {
        return nullptr;  // No cycle
    }
    
    // Second phase: find the start of cycle
    slow = head;
    while (slow != fast) {
        slow = slow->next.get();
        fast = fast->next.get();
    }
    
    return slow;
}
```

### Merge Two Sorted Linked Lists
```cpp
unique_ptr<ListNode<int>> mergeTwoLists(unique_ptr<ListNode<int>> list1,
                                       unique_ptr<ListNode<int>> list2) {
    auto dummy = make_unique<ListNode<int>>(0);
    ListNode<int>* current = dummy.get();
    
    ListNode<int>* l1 = list1.get();
    ListNode<int>* l2 = list2.get();
    
    while (l1 && l2) {
        if (l1->data <= l2->data) {
            current->next.reset(l1);
            l1 = l1->next.release();
        } else {
            current->next.reset(l2);
            l2 = l2->next.release();
        }
        current = current->next.get();
    }
    
    // Attach remaining nodes
    if (l1) {
        current->next.reset(l1);
    }
    if (l2) {
        current->next.reset(l2);
    }
    
    return move(dummy->next);
}
```

### Remove Nth Node from End
```cpp
unique_ptr<ListNode<int>> removeNthFromEnd(unique_ptr<ListNode<int>> head, int n) {
    auto dummy = make_unique<ListNode<int>>(0);
    dummy->next = move(head);
    
    ListNode<int>* first = dummy.get();
    ListNode<int>* second = dummy.get();
    
    // Move first pointer n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        first = first->next.get();
    }
    
    // Move both pointers until first reaches end
    while (first) {
        first = first->next.get();
        second = second->next.get();
    }
    
    // Remove the nth node
    second->next = move(second->next->next);
    
    return move(dummy->next);
}
```

### Palindrome Check for Linked List
```cpp
bool isPalindrome(ListNode<int>* head) {
    if (!head || !head->next) {
        return true;
    }
    
    // Find the middle
    ListNode<int>* slow = head;
    ListNode<int>* fast = head;
    
    while (fast->next && fast->next->next) {
        slow = slow->next.get();
        fast = fast->next->next.get();
    }
    
    // Reverse the second half
    ListNode<int>* secondHalf = slow->next.release();
    ListNode<int>* prev = nullptr;
    ListNode<int>* current = secondHalf;
    
    while (current) {
        ListNode<int>* next = current->next.release();
        current->next.reset(prev);
        prev = current;
        current = next;
    }
    
    // Compare both halves
    ListNode<int>* firstHalf = head;
    ListNode<int>* reversedSecondHalf = prev;
    
    bool isPalin = true;
    while (reversedSecondHalf) {
        if (firstHalf->data != reversedSecondHalf->data) {
            isPalin = false;
            break;
        }
        firstHalf = firstHalf->next.get();
        reversedSecondHalf = reversedSecondHalf->next.get();
    }
    
    // Restore the second half (optional)
    current = prev;
    prev = nullptr;
    while (current) {
        ListNode<int>* next = current->next.release();
        current->next.reset(prev);
        prev = current;
        current = next;
    }
    slow->next.reset(prev);
    
    return isPalin;
}
```

### Intersection of Two Linked Lists
```cpp
ListNode<int>* getIntersectionNode(ListNode<int>* headA, ListNode<int>* headB) {
    if (!headA || !headB) {
        return nullptr;
    }
    
    ListNode<int>* a = headA;
    ListNode<int>* b = headB;
    
    // When one pointer reaches the end, redirect it to the other list
    while (a != b) {
        a = (a == nullptr) ? headB : a->next.get();
        b = (b == nullptr) ? headA : b->next.get();
    }
    
    return a;
}
```

### 4.8 Advanced Linked List Operations

### Sort Linked List (Merge Sort)
```cpp
// Split the list into two halves
pair<ListNode<int>*, ListNode<int>*> splitList(ListNode<int>* head) {
    if (!head || !head->next) {
        return {head, nullptr};
    }
    
    ListNode<int>* slow = head;
    ListNode<int>* fast = head->next.get();
    
    while (fast && fast->next) {
        slow = slow->next.get();
        fast = fast->next->next.get();
    }
    
    ListNode<int>* secondHalf = slow->next.release();
    slow->next.reset(nullptr);
    
    return {head, secondHalf};
}

// Merge sort for linked list
unique_ptr<ListNode<int>> mergeSort(unique_ptr<ListNode<int>> head) {
    if (!head || !head->next) {
        return head;
    }
    
    auto [first, second] = splitList(head.release());
    
    auto sortedFirst = mergeSort(unique_ptr<ListNode<int>>(first));
    auto sortedSecond = mergeSort(unique_ptr<ListNode<int>>(second));
    
    return mergeTwoLists(move(sortedFirst), move(sortedSecond));
}
```

### Rotate Linked List
```cpp
unique_ptr<ListNode<int>> rotateRight(unique_ptr<ListNode<int>> head, int k) {
    if (!head || !head->next || k == 0) {
        return head;
    }
    
    // Calculate length
    int length = 1;
    ListNode<int>* tail = head.get();
    while (tail->next) {
        tail = tail->next.get();
        length++;
    }
    
    // Adjust k
    k = k % length;
    if (k == 0) {
        return head;
    }
    
    // Find the new tail
    ListNode<int>* newTail = head.get();
    for (int i = 0; i < length - k - 1; i++) {
        newTail = newTail->next.get();
    }
    
    // Perform rotation
    auto newHead = move(newTail->next);
    newTail->next.reset(nullptr);
    tail->next = move(head);
    
    return newHead;
}
```

## Part IV: Problem Solving

### 4.9 Common Interview Problems

#### Problem 1: Reverse Linked List
**Problem**: Given the head of a singly linked list, reverse the list and return the reversed list.

**Solution Approach**: Use iterative approach with three pointers to reverse links.

```cpp
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}
```

#### Problem 2: Merge Two Sorted Lists
**Problem**: Merge two sorted linked lists and return it as a sorted list.

**Solution Approach**: Use a dummy node and compare elements from both lists.

```cpp
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(0);
    ListNode* current = &dummy;
    
    while (list1 && list2) {
        if (list1->val <= list2->val) {
            current->next = list1;
            list1 = list1->next;
        } else {
            current->next = list2;
            list2 = list2->next;
        }
        current = current->next;
    }
    
    current->next = list1 ? list1 : list2;
    return dummy.next;
}
```

#### Problem 3: Find Middle of Linked List
**Problem**: Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.

**Solution Approach**: Use slow and fast pointers (Floyd's cycle detection technique).

```cpp
ListNode* findMiddle(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}
```

#### Problem 4: Remove Duplicates from Sorted List
**Problem**: Given the head of a sorted linked list, delete all duplicates such that each element appears only once.

**Solution Approach**: Compare current node with next node and skip duplicates.

```cpp
ListNode* deleteDuplicates(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* current = head;
    
    while (current->next) {
        if (current->val == current->next->val) {
            ListNode* temp = current->next;
            current->next = current->next->next;
            delete temp;
        } else {
            current = current->next;
        }
    }
    
    return head;
}
```

#### Problem 5: Add Two Numbers
**Problem**: You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

**Solution Approach**: Simulate addition with carry handling.

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* current = &dummy;
    int carry = 0;
    
    while (l1 || l2 || carry) {
        int sum = carry;
        if (l1) {
            sum += l1->val;
            l1 = l1->next;
        }
        if (l2) {
            sum += l2->val;
            l2 = l2->next;
        }
        
        carry = sum / 10;
        current->next = new ListNode(sum % 10);
        current = current->next;
    }
    
    return dummy.next;
}
```

## 4.8 Correctness Argument

**Purpose**: Explain why the implementation works.

### Invariant Preservation

The linked list implementations preserve the core invariants defined in Section 4.3:

#### 1. Head Pointer Invariant

**For Insertion at Head**:
- New node is created with `next = current head`
- Head is updated to point to new node
- If list was empty, new node becomes both head and tail
- **Preserves**: Head always points to first node (or null if empty)

**For Deletion at Head**:
- Head is updated to `head->next`
- Old head is deleted
- If list becomes empty, head becomes null
- **Preserves**: Head is null if and only if list is empty

#### 2. Linkage Invariant

**For Insertion**:
- New node's `next` is set before updating previous node's `next`
- Chain remains unbroken: `... → prev → new → next → ...`
- **Preserves**: All nodes form valid chain from head to tail

**For Deletion**:
- Previous node's `next` is updated to skip deleted node
- Deleted node is removed from chain
- **Preserves**: Chain remains valid, no broken links

#### 3. Size Consistency Invariant

**For All Operations**:
- Size is incremented atomically with insertion
- Size is decremented atomically with deletion
- Size is checked before operations that require non-empty list
- **Preserves**: Size always equals number of nodes

#### 4. Acyclicity Invariant

**For Non-Circular Lists**:
- Last node's `next` is always null
- No node's `next` points back to earlier node
- Traversal from head eventually reaches null
- **Preserves**: No cycles exist (unless circular list)

### Edge Case Handling

#### Empty List

**Insertion**:
- `insertAtHead`: Creates first node, head and tail point to it
- `insertAtTail`: Same as insertAtHead for empty list
- **Correct**: Empty list becomes non-empty correctly

**Deletion**:
- All delete operations check `if (head == nullptr)` first
- Return false or throw exception if empty
- **Correct**: No operations on empty list

#### Single Element List

**Deletion**:
- `deleteAtHead`: Sets head to null, list becomes empty
- `deleteAtTail`: Same as deleteAtHead for single element
- **Correct**: Single element list handled correctly

#### Boundary Conditions

**Position Validation**:
- `insertAtPosition`: Checks `position > size` before insertion
- `deleteAtPosition`: Checks `position >= size` before deletion
- **Correct**: Out-of-bounds positions are caught

### Termination Guarantee

**Why operations terminate**:

1. **Traversal Operations**: 
   - Loop condition: `current != nullptr`
   - Progress: `current = current->next` moves forward
   - Termination: Eventually reaches null (last node)

2. **Search Operations**:
   - Same as traversal, terminates when element found or list exhausted

3. **Position-based Operations**:
   - Loop bounded by position index
   - Terminates when position reached

### Informal Proof Sketch

**For Insertion**:
1. **Precondition**: Valid position and value
2. **Create Node**: New node created with correct data
3. **Link Node**: New node linked into chain correctly
4. **Update Pointers**: Head/tail updated if necessary
5. **Update Size**: Size incremented
6. **Postcondition**: List contains new node, all invariants preserved

**For Deletion**:
1. **Precondition**: List non-empty, valid position
2. **Find Node**: Traverse to node to delete
3. **Unlink Node**: Remove from chain
4. **Update Pointers**: Head/tail updated if necessary
5. **Delete Node**: Free memory
6. **Update Size**: Size decremented
7. **Postcondition**: Node removed, all invariants preserved

This correctness argument provides engineers with confidence that their linked list implementations work correctly.

## 4.9 Edge Cases & Failure Modes

**Purpose**: Build defensive thinking.

### Empty List Cases

#### Operations on Empty List

**Problem**: Many operations assume non-empty list.

**Edge Cases**:
- `deleteAtHead()` on empty list
- `deleteAtTail()` on empty list
- `getValueAt(0)` on empty list
- `search(value)` on empty list

**Handling**:
```cpp
// Check before operations
if (head == nullptr) {
    throw runtime_error("List is empty");
    // or return false/error code
}
```

**Failure Mode**: Accessing `head->next` when `head` is null causes null pointer dereference.

#### Single Element List

**Problem**: Special case where head == tail.

**Edge Cases**:
- Deleting from single-element list
- Inserting into single-element list
- Operations that assume multiple elements

**Handling**:
```cpp
// Special case for single element
if (head == tail) {
    // Handle single element case
    delete head;
    head = tail = nullptr;
}
```

**Failure Mode**: Not handling single element case can leave dangling pointers.

### Position Out of Bounds

#### Invalid Position Values

**Problem**: Position may be negative or exceed list size.

**Edge Cases**:
- `insertAtPosition(value, -1)` - negative position
- `insertAtPosition(value, size + 1)` - beyond end
- `deleteAtPosition(size)` - beyond last element

**Handling**:
```cpp
if (position < 0 || position > size) {
    throw out_of_range("Position out of bounds");
}
```

**Failure Mode**: Accessing beyond list bounds causes undefined behavior or crash.

### Memory Issues

#### Memory Leaks

**Problem**: Nodes not properly deleted.

**Edge Cases**:
- Deleting node without freeing memory
- Losing reference to node before deletion
- Exception thrown during operation

**Handling**:
```cpp
// Use smart pointers (unique_ptr)
// Or ensure manual deletion
ListNode* toDelete = current->next;
current->next = current->next->next;
delete toDelete;  // Must delete before losing reference
```

**Failure Mode**: Memory leak causes program to consume increasing memory.

#### Dangling Pointers

**Problem**: Pointer points to deleted memory.

**Edge Cases**:
- Accessing node after deletion
- Using pointer after list is destroyed
- Concurrent access (see Section 4.13)

**Handling**:
```cpp
// Set pointers to null after deletion
delete node;
node = nullptr;  // Prevents reuse

// Or use smart pointers that handle this automatically
```

**Failure Mode**: Dangling pointer access causes undefined behavior or crash.

### Cycle Detection

#### Accidental Cycles

**Problem**: Creating cycles in non-circular list.

**Edge Cases**:
- Setting `node->next` to earlier node
- Circular reference during insertion
- Broken invariant: cycle exists

**Handling**:
```cpp
// Validate no cycles (for non-circular lists)
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
```

**Failure Mode**: Infinite loop during traversal, stack overflow.

### Integer Overflow

**Problem**: Size counter may overflow.

**Edge Cases**:
- Very large number of insertions
- Size exceeds `size_t` maximum
- Size becomes negative (if using signed type)

**Handling**:
```cpp
// Check before incrementing
if (size == SIZE_MAX) {
    throw overflow_error("List size limit reached");
}
size++;  // Safe increment
```

**Failure Mode**: Size overflow causes incorrect size tracking.

### Common Failure Patterns

1. **Off-by-One Errors**: Accessing `position + 1` instead of `position`
2. **Null Pointer Dereference**: Not checking `head == nullptr`
3. **Lost Nodes**: Not updating pointers correctly during deletion
4. **Memory Leaks**: Forgetting to delete nodes
5. **Double Deletion**: Deleting same node twice
6. **Broken Chain**: Not updating `next` pointer correctly

This section maps directly to production bugs and helps engineers write robust linked list code.

## 4.10 Performance & System Considerations ⭐ (Differentiator)

**Purpose**: Connect algorithms to real machines.

### Cache Locality

#### Linked Lists vs Arrays

**Arrays**:
- **Excellent Cache Locality**: Contiguous memory, sequential access
- **Prefetching Friendly**: CPU can prefetch next elements
- **Cache Hits**: Sequential access → many cache hits

**Linked Lists**:
- **Poor Cache Locality**: Nodes scattered in memory
- **Random Memory Access**: Each node access likely cache miss
- **Cache Misses**: Traversing list → many cache misses

**Performance Impact**:
- Array traversal: ~1-2 cycles per element (cache hit)
- Linked list traversal: ~100-300 cycles per element (cache miss)
- **10-100x slower** for sequential access patterns

#### When Cache Matters Most

**High Impact**:
- Frequent traversals
- Large lists (many cache misses)
- Sequential access patterns
- Performance-critical code paths

**Low Impact**:
- Infrequent access
- Small lists (fit in cache)
- Random access patterns
- Non-performance-critical code

### Memory Allocation

#### Heap Fragmentation

**Problem**: Many small allocations fragment heap.

**Linked Lists**:
- Each node allocated separately
- Nodes scattered across heap
- Fragmentation increases over time

**Impact**:
- Slower allocation (must find free block)
- Increased memory usage (fragmentation overhead)
- Potential allocation failures

**Mitigation**:
- Use memory pools for frequent allocations
- Pre-allocate nodes in batches
- Consider array-based alternatives for performance-critical code

#### Allocation Overhead

**Per Node Allocation**:
- System call overhead
- Heap management overhead
- Alignment requirements

**Example**: For `int` (4 bytes):
- Actual data: 4 bytes
- Pointer: 8 bytes
- Allocation overhead: ~16-32 bytes
- **Total**: ~28-44 bytes per node (7-11x data size!)

### Branch Prediction

#### Conditional Branches in Loops

**Problem**: `while (current != nullptr)` creates branch.

**Impact**:
- Well-predicted branch: ~1 cycle
- Mispredicted branch: ~10-20 cycles
- Traversal has many branches

**Optimization**:
- Use sentinel nodes to eliminate null checks
- Unroll loops for small, fixed-size lists
- Use array-based structure when possible

### Pointer Chasing

#### Memory Access Pattern

**Linked Lists**:
- Each access requires following pointer
- Cannot prefetch next node (address unknown)
- Memory latency dominates performance

**Arrays**:
- Sequential access pattern
- Prefetching works well
- CPU can pipeline accesses

**Performance**:
- Pointer chasing: ~100-300 cycles per node
- Array access: ~1-2 cycles per element
- **50-300x difference** in access time

### Concurrency Implications

#### Thread Safety

**Problem**: Linked lists are not thread-safe by default.

**Issues**:
- Concurrent insertions can corrupt structure
- Race conditions on head/tail pointers
- Lost updates during concurrent modifications

**Solutions**:
- Use locks (see Section 4.13)
- Lock-free data structures (complex)
- Thread-local lists, merge periodically

**Performance Trade-off**:
- Locking adds overhead
- Lock contention reduces parallelism
- Lock-free requires careful design

### NUMA Considerations (Advanced)

**Problem**: On NUMA systems, memory access time depends on location.

**Impact**:
- Local memory: ~100 ns
- Remote memory: ~200-300 ns

**Linked Lists**:
- Nodes may be allocated on different NUMA nodes
- Traversal crosses NUMA boundaries
- Performance degrades on multi-socket systems

**Mitigation**:
- Allocate nodes on local NUMA node
- Use NUMA-aware allocators
- Consider array-based alternatives for NUMA systems

### Practical Recommendations

1. **Use Arrays When Possible**: Better cache performance, simpler code
2. **Use Linked Lists for Dynamic Size**: When size changes frequently
3. **Consider Memory Pools**: For frequent allocations
4. **Profile Before Optimizing**: Measure actual performance
5. **Use Smart Pointers**: Prevent memory leaks
6. **Consider Hybrid Approaches**: Array of linked lists for some use cases

This section connects linked list algorithms to real system performance, making the book valuable for engineers working on production systems.

## Part V: Summary

### 4.11 Performance Analysis

#### Time Complexity Comparison

| Operation | Singly Linked List | Doubly Linked List |
|-----------|-------------------|-------------------|
| Access | O(n) | O(n) |
| Search | O(n) | O(n) |
| Insertion at Head | O(1) | O(1) |
| Insertion at Tail | O(n) | O(1) |
| Insertion at Position | O(n) | O(n) |
| Deletion at Head | O(1) | O(1) |
| Deletion at Tail | O(n) | O(1) |
| Deletion at Position | O(n) | O(n) |

### Space Complexity
- **Singly Linked List**: O(1) extra space per operation
- **Doubly Linked List**: O(1) extra space per operation
- **Overall Space**: O(n) where n is the number of elements

### 4.12 Failure Modes and Common Pitfalls

Understanding common failure modes helps avoid bugs and performance issues.

#### 1. Memory Leaks (Forgetting to Delete)

Memory leaks occur when nodes are allocated but never freed, causing memory consumption to grow over time.

```cpp
// WRONG: Memory leak - forgetting to delete
void insertAtHead(int value) {
    ListNode* newNode = new ListNode(value);
    newNode->next = head;
    head = newNode;
    // If list is destroyed, newNode is never deleted!
}

// WRONG: Memory leak - losing reference
void removeNode(int value) {
    ListNode* current = head;
    while (current && current->data != value) {
        current = current->next;
    }
    if (current) {
        // Lost reference to current - can't delete it!
        // Previous node's next pointer not updated
    }
}

// CORRECT: Use smart pointers
void insertAtHead(int value) {
    auto newNode = make_unique<ListNode>(value);
    newNode->next = move(head);
    head = move(newNode);
    // Automatically deleted when list is destroyed
}

// CORRECT: Proper deletion with raw pointers
void removeNode(int value) {
    if (!head) return;
    
    if (head->data == value) {
        ListNode* toDelete = head;
        head = head->next;
        delete toDelete;  // Explicitly delete
        return;
    }
    
    ListNode* current = head;
    while (current->next && current->next->data != value) {
        current = current->next;
    }
    
    if (current->next) {
        ListNode* toDelete = current->next;
        current->next = current->next->next;
        delete toDelete;  // Explicitly delete
    }
}
```

**Why it happens**: 
- Manual memory management is error-prone
- Forgetting to delete nodes when removing them
- Losing references to nodes before deletion
- Exception safety issues (exceptions before delete)

**Impact**: 
- Memory leaks accumulate over time
- Eventual program crash due to out-of-memory
- Performance degradation
- System instability

**Prevention**:
- Use smart pointers (`unique_ptr`, `shared_ptr`)
- Always pair `new` with `delete`
- Use RAII (Resource Acquisition Is Initialization)
- Consider using containers from standard library

#### 2. Dangling Pointers

Dangling pointers occur when a pointer references memory that has been freed or is no longer valid.

```cpp
// WRONG: Dangling pointer - using deleted memory
ListNode* node = new ListNode(5);
delete node;
cout << node->data;  // Undefined behavior! Accessing freed memory

// WRONG: Dangling pointer - pointer to local variable
ListNode* getLocalNode() {
    ListNode local(5);
    return &local;  // Returns pointer to local variable
    // local is destroyed when function returns - dangling pointer!
}

// WRONG: Dangling pointer - iterator invalidation
ListNode* current = head;
while (current) {
    if (current->data == target) {
        delete current;  // current is now dangling
        // Next iteration: current = current->next (undefined behavior!)
    }
    current = current->next;
}

// CORRECT: Set to nullptr after deletion
ListNode* node = new ListNode(5);
delete node;
node = nullptr;  // Safe to check, but won't access invalid memory

// CORRECT: Save next pointer before deletion
ListNode* current = head;
while (current) {
    ListNode* next = current->next;  // Save next before deletion
    if (current->data == target) {
        delete current;
    }
    current = next;  // Use saved pointer
}

// CORRECT: Use smart pointers (automatic cleanup)
unique_ptr<ListNode> node = make_unique<ListNode>(5);
// No dangling pointer - automatically managed
```

**Why it happens**: 
- Using memory after it's been freed
- Returning pointers to local variables
- Modifying list while iterating
- Not updating pointers after deletion

**Impact**: 
- Undefined behavior
- Program crashes
- Security vulnerabilities (use-after-free)
- Data corruption
- Hard-to-debug issues

**Prevention**:
- Set pointers to `nullptr` after deletion
- Use smart pointers
- Save necessary pointers before deletion
- Avoid returning pointers to local variables
- Use RAII principles

#### 3. Breaking Invariants
```cpp
// WRONG: Creating cycles accidentally
node1->next = node2;
node2->next = node1;  // Cycle! Violates acyclicity invariant

// CORRECT: Ensure no cycles
// Use cycle detection algorithms to verify
```

**Why it happens**: Incorrect pointer manipulation
**Impact**: Infinite loops, broken traversal, memory leaks

#### 4. Off-by-One Errors in Traversal

Off-by-one errors occur when loop bounds or pointer advances are incorrect, causing access beyond the list or missing elements.

```cpp
// WRONG: Accessing beyond list - using <= instead of <
ListNode* current = head;
for (int i = 0; i <= size; i++) {  // Should be < size
    current = current->next;  // Last iteration: current becomes nullptr
    // Next access: nullptr->next (crash!)
}

// WRONG: Missing last element - stopping too early
ListNode* current = head;
for (int i = 0; i < size - 1; i++) {  // Stops one before end
    process(current);
    current = current->next;
}
// Last element never processed!

// WRONG: Accessing before checking
ListNode* current = head;
while (current->next != nullptr) {  // Doesn't process last node
    process(current);
    current = current->next;
}

// WRONG: Incorrect position calculation
void insertAtPosition(int value, int pos) {
    ListNode* current = head;
    for (int i = 0; i < pos; i++) {  // Should be i < pos - 1
        current = current->next;
    }
    // Inserting at wrong position!
}

// CORRECT: Check for nullptr before access
ListNode* current = head;
while (current != nullptr) {
    process(current);
    current = current->next;
}

// CORRECT: Process all elements including last
ListNode* current = head;
while (current) {
    process(current);
    current = current->next;
}

// CORRECT: Proper position calculation
void insertAtPosition(int value, int pos) {
    if (pos == 0) {
        insertAtHead(value);
        return;
    }
    
    ListNode* current = head;
    for (int i = 0; i < pos - 1 && current; i++) {
        current = current->next;
    }
    
    if (current) {
        // Insert after current
        auto newNode = make_unique<ListNode>(value);
        newNode->next = move(current->next);
        current->next = move(newNode);
    }
}
```

**Why it happens**: 
- Confusion between 0-based and 1-based indexing
- Confusion between size and last index (size-1)
- Not accounting for sentinel nodes
- Incorrect loop termination conditions

**Impact**: 
- Null pointer dereference
- Program crashes
- Missing data processing
- Incorrect insertions/deletions
- Buffer overflows (in some implementations)

**Prevention**:
- Always check for `nullptr` before dereferencing
- Use `while (current != nullptr)` instead of index-based loops
- Be careful with boundary conditions
- Test edge cases (empty list, single element, first/last positions)
- Use defensive programming (check bounds)

#### 5. Iterator Invalidation
```cpp
// WRONG: Modifying list while iterating
for (auto it = list.begin(); it != list.end(); ++it) {
    if (*it == target) {
        list.erase(it);  // May invalidate iterator
    }
}

// CORRECT: Use erase-remove idiom or careful iteration
```

**Why it happens**: List modification during iteration
**Impact**: Undefined behavior, crashes

#### 6. Performance Pitfalls
```cpp
// WRONG: O(n) insertion at tail without tail pointer
void insertAtTail(int value) {
    ListNode* current = head;
    while (current->next) {  // O(n) traversal
        current = current->next;
    }
    current->next = new ListNode(value);
}

// CORRECT: Maintain tail pointer for O(1) insertion
```

**Why it happens**: Not maintaining auxiliary pointers
**Impact**: Degraded performance, O(n) instead of O(1)

### 4.13 Key Takeaways

1. **Linked lists** provide dynamic sizing and efficient insertion/deletion
2. **Singly linked lists** are memory efficient but only support forward traversal
3. **Doubly linked lists** support bidirectional traversal but use more memory
4. **Circular linked lists** are useful for round-robin algorithms
5. **Skip lists** provide O(log n) performance with simpler implementation than balanced trees
6. **Common algorithms** include cycle detection, merging, and palindrome checking
7. **Trade-offs** exist between arrays and linked lists for different use cases

### 4.14 Practice Exercises

1. Implement a function to find the middle element of a linked list in one pass.
2. Write a function to remove all duplicate elements from a sorted linked list.
3. Create a function to reverse a linked list in groups of k nodes.
4. Implement a function to add two numbers represented as linked lists.
5. Write a function to clone a linked list with random pointers.

## 4.15 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to linked lists. See Section 3.5.3 for invariant-based reasoning and Section 3.5.4 for race conditions.

### 4.15.1 Shared-State Invariants

**Core Linked List Invariants** (see Section 3.5.3):
1. **Linkage Invariant**: "Each node's `next` pointer correctly points to the next node"
2. **Head Invariant**: "`head` points to the first node (or is `nullptr` if empty)"
3. **Acyclicity Invariant**: "No cycles exist in the list"

**What Must Not Be Observed Half-Updated**:
- Pointer updates during insertion (new node linked but not yet in chain)
- Node deletion while another thread is traversing through it
- Head pointer updates during insertion/deletion

### 4.15.2 Operations That Must Be Atomic

**Insertion Operation** (see Section 3.5.4):
```cpp
void insertAfter(Node* prev, Node* new_node) {
    new_node->next = prev->next;  // Step 1: Link new node
    prev->next = new_node;        // Step 2: Update previous node
}
```

**Tie to Invariants**: Between Step 1 and Step 2, the **Linkage Invariant** is violated. Another thread traversing may miss the new node or see inconsistent state.

**Deletion Operation**:
```cpp
void deleteNode(Node* prev, Node* to_delete) {
    prev->next = to_delete->next;  // Step 1: Bypass node
    delete to_delete;               // Step 2: Free memory
}
```

**Tie to Invariants**: Between Step 1 and Step 2, another thread traversing through `to_delete` may access freed memory, breaking the **Linkage Invariant**.

**Operations Requiring Atomicity**:
- **Insert**: Entire insertion (both pointer updates) must be atomic
- **Delete**: Bypass and memory deallocation must be atomic
- **Traverse**: Must not observe nodes in inconsistent states

### 4.15.3 Naïve Approaches and Why They Fail

**1. Partial Updates**:
```cpp
// Thread 1: Inserting node B after A
new_node->next = A->next;  // Done
// Thread 2: Deletes A here!
A->next = new_node;        // Writing to deleted memory!
```
**Why It Fails**: Insertion is not atomic. Invariant violation: **Linkage Invariant** broken.

**2. Check-Then-Act Bugs**:
```cpp
// Thread 1: Checking if node exists
if (node != nullptr) {     // Check
    // Thread 2: Deletes node here!
    process(node->data);    // Use-after-free!
}
```
**Why It Fails**: Check and access are not atomic. Invariant violation: **Linkage Invariant** broken.

**3. Locking Only Part of the Structure**:
```cpp
// Locking only the node being modified, not the list
void insertAfter(Node* prev, Node* new_node) {
    std::lock_guard<std::mutex> lock(prev->mtx);
    // But another thread may be traversing!
    new_node->next = prev->next;
    prev->next = new_node;
}
```
**Why It Fails**: Traversing threads are unprotected. Invariant violation: **Linkage Invariant** broken.

### 4.15.4 Locking Strategies

**Coarse-Grained Lock** (see Section 3.5.8):
```cpp
class ThreadSafeList {
    Node* head;
    std::mutex mtx;
    
public:
    void insert(int value) {
        std::lock_guard<std::mutex> lock(mtx);
        Node* new_node = new Node(value);
        new_node->next = head;
        head = new_node;
    }
};
```
- ✅ Simple, prevents all race conditions
- ❌ Very low parallelism (only one operation at a time)

**Fine-Grained Lock (Hand-over-Hand)**:
```cpp
void insertAfter(Node* prev, Node* new_node) {
    std::lock_guard<std::mutex> lock1(prev->mtx);
    if (prev->next) {
        std::lock_guard<std::mutex> lock2(prev->next->mtx);
        new_node->next = prev->next;
        prev->next = new_node;
    }
}
```
- ✅ Allows concurrent operations on different parts of list
- ❌ Complex, risk of deadlock if lock order violated (see Section 3.5.7)
- ❌ High overhead (multiple lock acquisitions)

**Read-Write Locks** (see Section 3.5.8):
- Less useful for linked lists (traversal modifies pointers in some implementations)
- Consider for read-heavy workloads with immutable traversal

### 4.15.5 Performance and Scalability Implications

**Contention** (see Section 3.5.8):
- Coarse-grained locking: Very high contention, throughput collapses
- Fine-grained locking: Lower contention, but deadlock risk and complexity

**False Sharing**: Less relevant for linked lists (nodes scattered in memory)

**Throughput Collapse Under Load**:
- With many threads, coarse-grained locking becomes severe bottleneck
- Fine-grained locking helps but adds significant complexity

### 4.15.6 When Not to Do This Yourself

**Use Library Implementations**:
- Thread-safe linked lists from well-tested libraries
- Consider lock-free implementations from proven libraries (see Section 3.5.9 for lock-free concepts)

**Avoid Premature Optimization**:
- Start with coarse-grained locking
- Only consider fine-grained or lock-free if profiling shows it's necessary
- Lock-free linked lists are extremely complex (see Section 3.5.9)

**For Production**: Prefer thread-safe containers from standard libraries or well-tested libraries. Lock-free linked lists require deep expertise (see Section 3.5.9 warning). See Section 3.5.10 for guidance on using libraries.

## 4.16 Practical Applications

Linked lists are fundamental building blocks for many real-world applications. Understanding these applications helps see why linked lists matter beyond academic exercises.

### 4.16.1 LRU Cache Implementation (Preview)

A **Least Recently Used (LRU) Cache** uses a doubly linked list to maintain access order efficiently.

**Core Idea**:
- Use a hash map for O(1) lookup
- Use a doubly linked list to maintain access order
- When an item is accessed, move it to the front
- When cache is full, remove the least recently used (tail)

**Why Linked List?**:
- O(1) insertion at head (most recently used)
- O(1) deletion from any position (with node pointer)
- O(1) movement of nodes (remove + insert at head)
- Maintains order efficiently

```cpp
#include <unordered_map>
#include <memory>

template<typename Key, typename Value>
class LRUCache {
private:
    struct Node {
        Key key;
        Value value;
        Node* prev;
        Node* next;
        
        Node(Key k, Value v) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };
    
    int capacity;
    Node* head;  // Most recently used
    Node* tail;  // Least recently used
    std::unordered_map<Key, Node*> cache;
    
    void moveToHead(Node* node) {
        // Remove from current position
        if (node->prev) node->prev->next = node->next;
        if (node->next) node->next->prev = node->prev;
        if (node == tail) tail = node->prev;
        
        // Move to head
        node->next = head;
        node->prev = nullptr;
        if (head) head->prev = node;
        head = node;
        if (!tail) tail = head;
    }
    
    void removeTail() {
        if (!tail) return;
        
        cache.erase(tail->key);
        Node* toRemove = tail;
        tail = tail->prev;
        if (tail) tail->next = nullptr;
        else head = nullptr;
        
        delete toRemove;
    }
    
public:
    LRUCache(int cap) : capacity(cap), head(nullptr), tail(nullptr) {}
    
    Value get(Key key) {
        if (cache.find(key) == cache.end()) {
            return Value{};  // Not found
        }
        
        Node* node = cache[key];
        moveToHead(node);  // Mark as recently used
        return node->value;
    }
    
    void put(Key key, Value value) {
        if (cache.find(key) != cache.end()) {
            // Update existing
            cache[key]->value = value;
            moveToHead(cache[key]);
            return;
        }
        
        // Add new
        if (cache.size() >= capacity) {
            removeTail();  // Remove least recently used
        }
        
        Node* newNode = new Node(key, value);
        cache[key] = newNode;
        
        newNode->next = head;
        if (head) head->prev = newNode;
        head = newNode;
        if (!tail) tail = head;
    }
};
```

**Key Points**:
- Doubly linked list enables O(1) node movement
- Hash map provides O(1) lookup
- Combination gives O(1) get/put operations
- Linked list maintains temporal ordering

**Real-World Use**: Web browser caches, database query caches, operating system page replacement

### 4.16.2 Undo/Redo Systems

Text editors, graphics applications, and many software use linked lists to implement undo/redo functionality.

**Core Idea**:
- Maintain a list of operations (commands)
- Current position in history
- Undo: move backward, redo: move forward
- New operation clears redo history

**Why Linked List?**:
- Dynamic history size
- Easy insertion at current position
- Efficient traversal forward/backward
- Can implement with doubly linked list

```cpp
#include <string>
#include <memory>

class Command {
public:
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
};

class TextEditor {
private:
    struct HistoryNode {
        std::unique_ptr<Command> command;
        HistoryNode* prev;
        HistoryNode* next;
        
        HistoryNode(std::unique_ptr<Command> cmd) 
            : command(std::move(cmd)), prev(nullptr), next(nullptr) {}
    };
    
    std::string text;
    HistoryNode* current;  // Current position in history
    HistoryNode* historyHead;
    
    void clearRedoHistory() {
        // Clear all nodes after current
        while (current && current->next) {
            HistoryNode* toDelete = current->next;
            current->next = toDelete->next;
            if (toDelete->next) toDelete->next->prev = current;
            delete toDelete;
        }
    }
    
public:
    TextEditor() : text(""), current(nullptr), historyHead(nullptr) {}
    
    void executeCommand(std::unique_ptr<Command> cmd) {
        cmd->execute();
        
        // Clear redo history
        clearRedoHistory();
        
        // Add to history
        HistoryNode* newNode = new HistoryNode(std::move(cmd));
        if (!historyHead) {
            historyHead = newNode;
            current = newNode;
        } else {
            newNode->prev = current;
            if (current) current->next = newNode;
            current = newNode;
        }
    }
    
    void undo() {
        if (current && current->command) {
            current->command->undo();
            if (current->prev) {
                current = current->prev;
            }
        }
    }
    
    void redo() {
        if (current && current->next && current->next->command) {
            current = current->next;
            current->command->execute();
        }
    }
};
```

**Key Points**:
- Doubly linked list for bidirectional traversal
- Current pointer marks position in history
- New operations clear future (redo) history
- Each node stores a command object

**Real-World Use**: Text editors (Vim, Emacs), graphics software (Photoshop), IDEs, word processors

### 4.16.3 Browser History

Web browsers maintain a history of visited pages using a linked list structure.

**Core Idea**:
- Maintain forward and backward history
- Current page in the middle
- Back button: move to previous
- Forward button: move to next
- New navigation: clear forward history

**Why Linked List?**:
- Dynamic history size
- Efficient forward/backward navigation
- Easy insertion and deletion
- Can implement with doubly linked list

```cpp
#include <string>
#include <memory>

class BrowserHistory {
private:
    struct HistoryNode {
        std::string url;
        std::string title;
        HistoryNode* prev;
        HistoryNode* next;
        
        HistoryNode(const std::string& u, const std::string& t) 
            : url(u), title(t), prev(nullptr), next(nullptr) {}
    };
    
    HistoryNode* current;
    HistoryNode* head;
    HistoryNode* tail;
    
    void clearForwardHistory() {
        // Clear all nodes after current
        while (current && current->next) {
            HistoryNode* toDelete = current->next;
            current->next = toDelete->next;
            if (toDelete->next) {
                toDelete->next->prev = current;
            } else {
                tail = current;
            }
            delete toDelete;
        }
    }
    
public:
    BrowserHistory() : current(nullptr), head(nullptr), tail(nullptr) {}
    
    void navigate(const std::string& url, const std::string& title) {
        // Clear forward history
        clearForwardHistory();
        
        // Create new node
        HistoryNode* newNode = new HistoryNode(url, title);
        
        if (!head) {
            head = tail = current = newNode;
        } else {
            newNode->prev = current;
            if (current) current->next = newNode;
            current = newNode;
            tail = newNode;
        }
    }
    
    bool canGoBack() const {
        return current && current->prev != nullptr;
    }
    
    bool canGoForward() const {
        return current && current->next != nullptr;
    }
    
    std::string goBack() {
        if (canGoBack()) {
            current = current->prev;
            return current->url;
        }
        return "";
    }
    
    std::string goForward() {
        if (canGoForward()) {
            current = current->next;
            return current->url;
        }
        return "";
    }
    
    std::string getCurrentUrl() const {
        return current ? current->url : "";
    }
};
```

**Key Points**:
- Doubly linked list for bidirectional navigation
- Current pointer marks current page
- New navigation clears forward history
- Efficient O(1) back/forward operations

**Real-World Use**: All web browsers (Chrome, Firefox, Safari), mobile browsers, web view components

### 4.16.4 Other Applications

**1. Polynomial Representation**:
- Each node stores coefficient and exponent
- Efficient addition, multiplication of polynomials
- Sparse polynomials (many zero coefficients) are memory efficient

**2. Sparse Matrix Representation**:
- Each node represents a non-zero element
- Saves memory for matrices with many zeros
- Efficient matrix operations

**3. Music Playlist**:
- Each node is a song
- Easy insertion/deletion
- Can implement shuffle, repeat modes

**4. Symbol Table in Compilers**:
- Maintain identifiers and their attributes
- Dynamic insertion as code is parsed
- Efficient lookup and scope management

**5. Graph Representation (Adjacency List)**:
- Each node's list contains connected vertices
- Efficient for sparse graphs
- Used in graph algorithms (see Chapter 11)

## 4.11 Variants & Extensions

**Purpose**: Show evolution and alternatives.

### Linked List Variants

#### Singly Linked List
- **Characteristics**: Each node has one pointer (next)
- **Memory**: sizeof(T) + 8 bytes per node
- **Use Case**: Simple dynamic lists, stacks
- **Limitation**: Only forward traversal

#### Doubly Linked List
- **Characteristics**: Each node has two pointers (next, prev)
- **Memory**: sizeof(T) + 16 bytes per node
- **Use Case**: Need bidirectional traversal, efficient tail operations
- **Advantage**: Can traverse backwards, O(1) deletion at tail

#### Circular Linked List
- **Characteristics**: Last node points back to first
- **Use Case**: Round-robin algorithms, circular buffers
- **Advantage**: No null termination, continuous traversal

#### Skip List
- **Characteristics**: Multi-level linked list with shortcuts
- **Performance**: O(log n) search, insert, delete
- **Use Case**: Alternative to balanced trees, simpler implementation
- **Trade-off**: Probabilistic structure, uses more memory

### When to Choose Which Variant

| Requirement | Recommended Variant | Why |
|-------------|-------------------|-----|
| Simple dynamic list | Singly Linked List | Minimal memory, simple implementation |
| Need backward traversal | Doubly Linked List | Bidirectional access |
| Frequent tail operations | Doubly Linked List | O(1) tail operations |
| Round-robin algorithms | Circular Linked List | Natural circular structure |
| Need O(log n) operations | Skip List | Better than O(n) search |
| Memory constrained | Singly Linked List | Least overhead |
| Need to maintain order | Any (all preserve order) | All variants maintain insertion order |

### Extensions

#### Sorted Linked List
- Maintains elements in sorted order
- Insertion: O(n) to find position
- Use case: When order matters and insertions are infrequent

#### Self-Organizing List
- Moves accessed elements toward front
- Use case: When access patterns are non-uniform
- Variants: Move-to-front, transpose, frequency count

#### Unrolled Linked List
- Each node contains multiple elements (array)
- Reduces pointer overhead
- Use case: Balance between arrays and linked lists

## 4.12 Real-World Implementations

**Purpose**: Ground theory in practice.

### Standard Library Equivalents

#### C++ Standard Library

**`std::list`**:
- Doubly linked list implementation
- Bidirectional iterators
- O(1) insertion/deletion at any position
- **Design Choice**: Uses doubly linked structure for flexibility

**`std::forward_list`**:
- Singly linked list implementation
- Forward-only iterators
- O(1) insertion/deletion (if iterator available)
- **Design Choice**: Minimal memory overhead, forward-only access

**Trade-offs**:
- `std::list`: More memory, bidirectional access
- `std::forward_list`: Less memory, forward-only access

#### Java Collections

**`java.util.LinkedList`**:
- Doubly linked list
- Implements both List and Deque interfaces
- **Design Choice**: Flexibility over memory efficiency

**`java.util.ArrayList`**:
- Array-based (not linked list, but alternative)
- Better performance for random access
- **Design Choice**: Performance over flexibility

#### Python

**`collections.deque`**:
- Double-ended queue (can use linked list internally)
- O(1) operations at both ends
- **Design Choice**: Optimized for queue operations

### Notable Trade-offs in Real Systems

1. **Memory vs Performance**: Singly linked uses less memory but slower tail operations
2. **Simplicity vs Features**: Doubly linked more complex but more flexible
3. **Cache Performance**: All linked lists suffer from poor cache locality
4. **Thread Safety**: Standard library implementations are not thread-safe by default
5. **Iterator Invalidation**: Insertions/deletions can invalidate iterators

### When Real Systems Use Linked Lists

**Use Linked Lists**:
- Undo/Redo systems (browser history, text editors)
- LRU Cache implementation
- Symbol tables in compilers
- Polynomial representation
- Sparse matrix representation

**Avoid Linked Lists**:
- High-performance code (use arrays)
- Cache-critical applications
- Random access needed frequently
- Memory-constrained systems

This section shows how linked list concepts appear in production systems, making the theory immediately applicable.

### 4.17 Summary

Linked lists are fundamental data structures that offer flexibility in memory management and efficient insertion/deletion operations. While they don't provide random access like arrays, they excel in scenarios where the size is unknown beforehand or frequent insertions/deletions are required. Understanding the different types of linked lists and their associated algorithms is crucial for solving many programming problems and designing efficient data structures.

**What We Learned:**
- Linked lists use pointers to connect nodes, enabling dynamic sizing
- Core invariants: head pointer, acyclicity, and linkage must be preserved
- Common pitfalls: memory leaks, dangling pointers, and broken invariants
- Trade-offs: flexibility vs. cache performance compared to arrays

**Why the Next Chapter Follows:**
Now that we understand both arrays and linked lists, we'll explore **stacks and queues** in Chapter 5. These abstract data types can be implemented using either arrays or linked lists, demonstrating how the same interface can be built on different foundations. This illustrates the principle of abstraction: separating what a data structure does from how it's implemented.
