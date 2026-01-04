# Chapter 4: Linked Lists

## Part I: Fundamentals

### 4.1 Introduction to Linked Lists

A **linked list** is a linear data structure where elements (nodes) are stored in sequence, but unlike arrays, the elements are not stored in contiguous memory locations. Instead, each node contains data and a reference (pointer) to the next node in the sequence.

### Key Characteristics of Linked Lists
- **Dynamic size** - can grow and shrink during runtime
- **Non-contiguous memory** - nodes can be scattered in memory
- **Sequential access** - cannot access elements by index directly
- **Memory efficient** - only uses memory for actual data and pointers
- **Easy insertion/deletion** - no need to shift elements

### Comparison with Arrays

| Feature | Array | Linked List |
|---------|-------|-------------|
| Access Time | O(1) | O(n) |
| Insertion at Beginning | O(n) | O(1) |
| Insertion at End | O(1) | O(n) |
| Deletion at Beginning | O(n) | O(1) |
| Deletion at End | O(1) | O(n) |
| Memory Usage | Fixed | Dynamic |
| Cache Performance | Better | Worse |
| Memory Overhead | None | Pointer overhead |

### 4.2 Core Invariants

Understanding invariants is crucial for reasoning about linked lists correctly. An **invariant** is a property that must always be true for the data structure to be valid.

#### Core Invariants of a Singly Linked List

1. **Head Invariant**: 
   - If the list is empty, `head == nullptr`
   - If the list is non-empty, `head` points to the first node
   - The first node has no predecessor

2. **Linkage Invariant**:
   - Each node (except the last) has exactly one successor via `next`
   - The last node has `next == nullptr`
   - No cycles exist (unless explicitly a circular list)

3. **Size Invariant**:
   - `size` equals the number of nodes in the list
   - `size == 0` if and only if `head == nullptr`

4. **Memory Invariant**:
   - All nodes are reachable from `head` (no orphaned nodes)
   - No dangling pointers (all `next` pointers are either `nullptr` or valid)

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

### 4.3 Basic Singly Linked List Implementation

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

### 4.4 Basic Circular Linked List Implementation

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

## Part V: Summary

### 4.10 Performance Analysis

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

### 4.11 Failure Modes and Common Pitfalls

Understanding common failure modes helps avoid bugs and performance issues.

#### 1. Memory Leaks (Raw Pointers)
```cpp
// WRONG: Memory leak
ListNode* node = new ListNode(5);
// ... use node ...
// Forgot to delete node;

// CORRECT: Use smart pointers
unique_ptr<ListNode> node = make_unique<ListNode>(5);
// Automatically deleted
```

**Why it happens**: Manual memory management is error-prone
**Impact**: Memory leaks, eventual program crash

#### 2. Dangling Pointers
```cpp
// WRONG: Dangling pointer
ListNode* node = new ListNode(5);
delete node;
cout << node->data;  // Undefined behavior!

// CORRECT: Set to nullptr after deletion
delete node;
node = nullptr;
```

**Why it happens**: Using deleted memory
**Impact**: Undefined behavior, crashes, security vulnerabilities

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
```cpp
// WRONG: Accessing beyond list
ListNode* current = head;
for (int i = 0; i <= size; i++) {  // Should be <
    current = current->next;  // May be nullptr
}

// CORRECT: Check for nullptr
ListNode* current = head;
while (current != nullptr) {
    // process current
    current = current->next;
}
```

**Why it happens**: Confusion between size and indices
**Impact**: Null pointer dereference, crashes

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

### 4.12 Key Takeaways

1. **Linked lists** provide dynamic sizing and efficient insertion/deletion
2. **Singly linked lists** are memory efficient but only support forward traversal
3. **Doubly linked lists** support bidirectional traversal but use more memory
4. **Circular linked lists** are useful for round-robin algorithms
5. **Skip lists** provide O(log n) performance with simpler implementation than balanced trees
6. **Common algorithms** include cycle detection, merging, and palindrome checking
7. **Trade-offs** exist between arrays and linked lists for different use cases

### 4.13 Practice Exercises

1. Implement a function to find the middle element of a linked list in one pass.
2. Write a function to remove all duplicate elements from a sorted linked list.
3. Create a function to reverse a linked list in groups of k nodes.
4. Implement a function to add two numbers represented as linked lists.
5. Write a function to clone a linked list with random pointers.

## 4.13 Concurrency Considerations

Linked lists are particularly challenging for concurrent access because operations modify pointer structures, creating many opportunities for race conditions.

### Invariants Threatened by Concurrent Access

**Core Linked List Invariants:**
1. **Linkage Invariant**: "Each node's `next` pointer correctly points to the next node"
2. **Head Invariant**: "`head` points to the first node (or is `nullptr` if empty)"
3. **Acyclicity Invariant**: "No cycles exist in the list"

### What Operations Need Atomicity

**Insertion Operation:**
```cpp
void insertAfter(Node* prev, Node* new_node) {
    new_node->next = prev->next;  // Step 1: Link new node
    prev->next = new_node;        // Step 2: Update previous node
}
```

**Problem**: Between Step 1 and Step 2, the invariant "next pointers form a valid chain" is violated. Another thread traversing the list may:
- Miss the new node (if it reads `prev->next` before Step 2)
- See an inconsistent state (new node points to next, but prev doesn't point to new node)

**Deletion Operation:**
```cpp
void deleteNode(Node* prev, Node* to_delete) {
    prev->next = to_delete->next;  // Step 1: Bypass node
    delete to_delete;               // Step 2: Free memory
}
```

**Problem**: Another thread may be traversing through `to_delete` when it's deleted, causing:
- **Use-after-free**: Accessing freed memory
- **Broken chain**: Traversing thread may follow invalid pointer

### Coarse vs Fine-Grained Locking

**Coarse-Grained (Single Lock):**
```cpp
class ThreadSafeList {
    Node* head;
    std::mutex mtx;
    
public:
    void insert(int value) {
        std::lock_guard<std::mutex> lock(mtx);
        // Entire insertion is atomic
        Node* new_node = new Node(value);
        new_node->next = head;
        head = new_node;
    }
};
```
- ✅ Simple, prevents all race conditions
- ❌ Very low parallelism (only one operation at a time)

**Fine-Grained (Hand-over-Hand Locking):**
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
- ❌ Complex, risk of deadlock if lock order violated
- ❌ High overhead (multiple lock acquisitions)

### Common Bugs

1. **Lost Nodes**: Insertion interrupted, node becomes unreachable
   ```cpp
   // Thread 1: Inserting node B after A
   new_node->next = A->next;  // Done
   // Thread 2: Deletes A here!
   A->next = new_node;        // Writing to deleted memory!
   ```

2. **Broken Chain**: Deletion leaves dangling pointers
   ```cpp
   // Thread 1: Deleting node B
   A->next = B->next;  // Done
   // Thread 2: Traversing, currently at B
   current = current->next;  // May follow invalid pointer!
   delete B;  // Thread 1 frees B
   ```

3. **Double Deletion**: Two threads delete same node
   ```cpp
   // Both threads think they should delete node B
   // Both call delete B → undefined behavior
   ```

### Lock-Free Considerations

Lock-free linked lists are possible but extremely complex:
- **Compare-And-Swap (CAS)** for atomic pointer updates
- **ABA Problem**: Pointer value A→B→A, CAS thinks nothing changed
- **Memory Reclamation**: When to safely free deleted nodes (hazard pointers, RCU)

**Recommendation**: Use lock-based approach or proven libraries. Lock-free linked lists are rarely worth the complexity.

### Practical Recommendations

- **For most cases**: Use coarse-grained locking (single mutex)
- **For high contention**: Consider lock-free alternatives from libraries
- **For read-heavy**: Use `std::shared_mutex` (multiple readers)
- **For production**: Prefer thread-safe containers from standard libraries or well-tested libraries

### 4.14 Summary

Linked lists are fundamental data structures that offer flexibility in memory management and efficient insertion/deletion operations. While they don't provide random access like arrays, they excel in scenarios where the size is unknown beforehand or frequent insertions/deletions are required. Understanding the different types of linked lists and their associated algorithms is crucial for solving many programming problems and designing efficient data structures.

**What We Learned:**
- Linked lists use pointers to connect nodes, enabling dynamic sizing
- Core invariants: head pointer, acyclicity, and linkage must be preserved
- Common pitfalls: memory leaks, dangling pointers, and broken invariants
- Trade-offs: flexibility vs. cache performance compared to arrays

**Why the Next Chapter Follows:**
Now that we understand both arrays and linked lists, we'll explore **stacks and queues** in Chapter 5. These abstract data types can be implemented using either arrays or linked lists, demonstrating how the same interface can be built on different foundations. This illustrates the principle of abstraction: separating what a data structure does from how it's implemented.
