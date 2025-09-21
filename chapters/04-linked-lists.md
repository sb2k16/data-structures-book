# Chapter 4: Linked Lists

## 4.1 Introduction to Linked Lists

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

## 4.2 Singly Linked List

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

## 4.3 Doubly Linked List

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

## 4.4 Circular Linked List

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

## 4.5 Common Linked List Algorithms

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

## 4.6 Advanced Linked List Operations

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

## 4.7 Performance Analysis

### Time Complexity Comparison

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

## 4.8 Key Takeaways

1. **Linked lists** provide dynamic sizing and efficient insertion/deletion
2. **Singly linked lists** are memory efficient but only support forward traversal
3. **Doubly linked lists** support bidirectional traversal but use more memory
4. **Circular linked lists** are useful for round-robin algorithms
5. **Common algorithms** include cycle detection, merging, and palindrome checking
6. **Trade-offs** exist between arrays and linked lists for different use cases

## 4.9 Exercises

1. Implement a function to find the middle element of a linked list in one pass.
2. Write a function to remove all duplicate elements from a sorted linked list.
3. Create a function to reverse a linked list in groups of k nodes.
4. Implement a function to add two numbers represented as linked lists.
5. Write a function to clone a linked list with random pointers.

## 4.10 Summary

Linked lists are fundamental data structures that offer flexibility in memory management and efficient insertion/deletion operations. While they don't provide random access like arrays, they excel in scenarios where the size is unknown beforehand or frequent insertions/deletions are required. Understanding the different types of linked lists and their associated algorithms is crucial for solving many programming problems and designing efficient data structures.

In the next chapter, we'll explore stacks and queues, which are linear data structures that follow specific access patterns and are often implemented using linked lists or arrays.
