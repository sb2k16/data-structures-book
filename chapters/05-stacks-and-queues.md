# Chapter 5: Stacks and Queues

## Part I: Fundamentals

### 5.1 Introduction to Stacks and Queues

**Stacks** and **Queues** are fundamental linear data structures that follow specific access patterns. They are abstract data types that define how elements are added, removed, and accessed.

### Stack
A **stack** follows the **Last-In-First-Out (LIFO)** principle:
- Elements are added and removed from the same end (called the "top")
- The most recently added element is the first to be removed
- Operations: `push()` (add), `pop()` (remove), `top()`/`peek()` (view top element), `isEmpty()`

### Queue
A **queue** follows the **First-In-First-Out (FIFO)** principle:
- Elements are added at one end (rear) and removed from the other end (front)
- The first element added is the first to be removed
- Operations: `enqueue()` (add), `dequeue()` (remove), `front()` (view front element), `isEmpty()`

### 5.1.1 Core Invariants

Understanding invariants ensures correct stack and queue implementations.

#### Core Invariants of a Stack

1. **LIFO Invariant**:
   - Last element pushed is first element popped
   - Elements maintain insertion order in reverse
   - `top()` always returns most recently pushed element

2. **Size Consistency Invariant**:
   - `size == 0` if and only if stack is empty
   - Size equals the number of elements in stack
   - Size increases by 1 on push, decreases by 1 on pop
   - Size must never be negative
   - Size must be updated atomically with push/pop operations

3. **Access Invariant**:
   - Only top element is accessible
   - No random access to middle elements
   - Operations only affect top of stack

#### Core Invariants of a Queue

1. **FIFO Invariant**:
   - First element enqueued is first element dequeued
   - Elements maintain insertion order
   - `front()` always returns oldest element

2. **Size Consistency Invariant**:
   - `size == 0` if and only if queue is empty
   - Size equals the number of elements in queue
   - Size increases by 1 on enqueue, decreases by 1 on dequeue
   - Size must never be negative
   - Size must be updated atomically with enqueue/dequeue operations
   - For circular queues: `size <= capacity` (size cannot exceed capacity)

3. **Access Invariant**:
   - Only front and rear elements are directly accessible
   - No random access to middle elements
   - Enqueue affects rear, dequeue affects front

#### What Breaks Invariants

- **Stack**: Popping from middle → breaks LIFO invariant
- **Queue**: Dequeuing from wrong end → breaks FIFO invariant
- **Both**: Size mismatch → breaks size invariant

#### How Operations Restore Invariants

- **Stack push**: Add to top → preserves LIFO, increments size
- **Stack pop**: Remove from top → preserves LIFO, decrements size
- **Queue enqueue**: Add to rear → preserves FIFO, increments size
- **Queue dequeue**: Remove from front → preserves FIFO, decrements size

### 5.2 Basic Stack Implementation

### Array-Based Stack
```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

template<typename T>
class ArrayStack {
private:
    vector<T> data;
    size_t capacity;
    
public:
    ArrayStack(size_t initialCapacity = 10) : capacity(initialCapacity) {
        data.reserve(capacity);
    }
    
    // Push element onto stack
    void push(const T& element) {
        if (data.size() >= capacity) {
            capacity *= 2;  // Double capacity when full
            data.reserve(capacity);
        }
        data.push_back(element);
    }
    
    // Pop element from stack
    T pop() {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        T element = data.back();
        data.pop_back();
        return element;
    }
    
    // Get top element without removing
    T& top() {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        return data.back();
    }
    
    const T& top() const {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        return data.back();
    }
    
    // Check if stack is empty
    bool isEmpty() const {
        return data.empty();
    }
    
    // Get size
    size_t size() const {
        return data.size();
    }
    
    // Display stack
    void display() const {
        cout << "Stack (top to bottom): ";
        for (int i = data.size() - 1; i >= 0; i--) {
            cout << data[i] << " ";
        }
        cout << endl;
    }
};
```

### Linked List-Based Stack
```cpp
template<typename T>
class LinkedListStack {
private:
    struct Node {
        T data;
        unique_ptr<Node> next;
        Node(const T& value) : data(value), next(nullptr) {}
    };
    
    unique_ptr<Node> topNode;
    size_t stackSize;
    
public:
    LinkedListStack() : topNode(nullptr), stackSize(0) {}
    
    // Push element onto stack
    void push(const T& element) {
        auto newNode = make_unique<Node>(element);
        newNode->next = move(topNode);
        topNode = move(newNode);
        stackSize++;
    }
    
    // Pop element from stack
    T pop() {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        
        T element = topNode->data;
        topNode = move(topNode->next);
        stackSize--;
        return element;
    }
    
    // Get top element without removing
    T& top() {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        return topNode->data;
    }
    
    const T& top() const {
        if (isEmpty()) {
            throw runtime_error("Stack is empty");
        }
        return topNode->data;
    }
    
    // Check if stack is empty
    bool isEmpty() const {
        return topNode == nullptr;
    }
    
    // Get size
    size_t size() const {
        return stackSize;
    }
    
    // Display stack
    void display() const {
        cout << "Stack (top to bottom): ";
        Node* current = topNode.get();
        while (current) {
            cout << current->data << " ";
            current = current->next.get();
        }
        cout << endl;
    }
};
```

### Stack Applications and Examples
```cpp
void demonstrateStack() {
    ArrayStack<int> stack;
    
    // Push elements
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();  // Stack (top to bottom): 30 20 10
    
    // Access top element
    cout << "Top element: " << stack.top() << endl;  // 30
    
    // Pop elements
    cout << "Popped: " << stack.pop() << endl;  // 30
    cout << "Popped: " << stack.pop() << endl;  // 20
    stack.display();  // Stack (top to bottom): 10
    
    cout << "Size: " << stack.size() << endl;  // 1
}
```

### 5.3 Basic Queue Implementation

### Array-Based Queue
```cpp
template<typename T>
class ArrayQueue {
private:
    vector<T> data;
    size_t frontIndex;
    size_t rearIndex;
    size_t queueSize;
    size_t capacity;
    
public:
    ArrayQueue(size_t initialCapacity = 10) 
        : frontIndex(0), rearIndex(0), queueSize(0), capacity(initialCapacity) {
        data.resize(capacity);
    }
    
    // Enqueue element
    void enqueue(const T& element) {
        if (queueSize >= capacity) {
            resize();
        }
        
        data[rearIndex] = element;
        rearIndex = (rearIndex + 1) % capacity;
        queueSize++;
    }
    
    // Dequeue element
    T dequeue() {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        
        T element = data[frontIndex];
        frontIndex = (frontIndex + 1) % capacity;
        queueSize--;
        return element;
    }
    
    // Get front element without removing
    T& front() {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        return data[frontIndex];
    }
    
    const T& front() const {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        return data[frontIndex];
    }
    
    // Check if queue is empty
    bool isEmpty() const {
        return queueSize == 0;
    }
    
    // Get size
    size_t size() const {
        return queueSize;
    }
    
    // Resize queue when full
    void resize() {
        vector<T> newData(capacity * 2);
        
        for (size_t i = 0; i < queueSize; i++) {
            newData[i] = data[(frontIndex + i) % capacity];
        }
        
        data = move(newData);
        frontIndex = 0;
        rearIndex = queueSize;
        capacity *= 2;
    }
    
    // Display queue
    void display() const {
        cout << "Queue (front to rear): ";
        for (size_t i = 0; i < queueSize; i++) {
            size_t index = (frontIndex + i) % capacity;
            cout << data[index] << " ";
        }
        cout << endl;
    }
};
```

### Linked List-Based Queue
```cpp
template<typename T>
class LinkedListQueue {
private:
    struct Node {
        T data;
        unique_ptr<Node> next;
        Node(const T& value) : data(value), next(nullptr) {}
    };
    
    unique_ptr<Node> frontNode;
    Node* rearNode;
    size_t queueSize;
    
public:
    LinkedListQueue() : frontNode(nullptr), rearNode(nullptr), queueSize(0) {}
    
    // Enqueue element
    void enqueue(const T& element) {
        auto newNode = make_unique<Node>(element);
        
        if (isEmpty()) {
            frontNode = move(newNode);
            rearNode = frontNode.get();
        } else {
            rearNode->next = move(newNode);
            rearNode = rearNode->next.get();
        }
        queueSize++;
    }
    
    // Dequeue element
    T dequeue() {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        
        T element = frontNode->data;
        frontNode = move(frontNode->next);
        
        if (frontNode == nullptr) {
            rearNode = nullptr;
        }
        queueSize--;
        return element;
    }
    
    // Get front element without removing
    T& front() {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        return frontNode->data;
    }
    
    const T& front() const {
        if (isEmpty()) {
            throw runtime_error("Queue is empty");
        }
        return frontNode->data;
    }
    
    // Check if queue is empty
    bool isEmpty() const {
        return frontNode == nullptr;
    }
    
    // Get size
    size_t size() const {
        return queueSize;
    }
    
    // Display queue
    void display() const {
        cout << "Queue (front to rear): ";
        Node* current = frontNode.get();
        while (current) {
            cout << current->data << " ";
            current = current->next.get();
        }
        cout << endl;
    }
};
```

### Queue Applications and Examples
```cpp
void demonstrateQueue() {
    ArrayQueue<string> queue;
    
    // Enqueue elements
    queue.enqueue("First");
    queue.enqueue("Second");
    queue.enqueue("Third");
    queue.display();  // Queue (front to rear): First Second Third
    
    // Access front element
    cout << "Front element: " << queue.front() << endl;  // First
    
    // Dequeue elements
    cout << "Dequeued: " << queue.dequeue() << endl;  // First
    cout << "Dequeued: " << queue.dequeue() << endl;  // Second
    queue.display();  // Queue (front to rear): Third
    
    cout << "Size: " << queue.size() << endl;  // 1
}
```

## Part II: Advanced Implementations

### 5.4 Specialized Data Structures

### Deque (Double-Ended Queue)
```cpp
template<typename T>
class Deque {
private:
    vector<T> data;
    size_t frontIndex;
    size_t rearIndex;
    size_t dequeSize;
    size_t capacity;
    
public:
    Deque(size_t initialCapacity = 10) 
        : frontIndex(0), rearIndex(0), dequeSize(0), capacity(initialCapacity) {
        data.resize(capacity);
    }
    
    // Add element at front
    void pushFront(const T& element) {
        if (dequeSize >= capacity) {
            resize();
        }
        
        frontIndex = (frontIndex - 1 + capacity) % capacity;
        data[frontIndex] = element;
        dequeSize++;
    }
    
    // Add element at rear
    void pushRear(const T& element) {
        if (dequeSize >= capacity) {
            resize();
        }
        
        data[rearIndex] = element;
        rearIndex = (rearIndex + 1) % capacity;
        dequeSize++;
    }
    
    // Remove element from front
    T popFront() {
        if (isEmpty()) {
            throw runtime_error("Deque is empty");
        }
        
        T element = data[frontIndex];
        frontIndex = (frontIndex + 1) % capacity;
        dequeSize--;
        return element;
    }
    
    // Remove element from rear
    T popRear() {
        if (isEmpty()) {
            throw runtime_error("Deque is empty");
        }
        
        rearIndex = (rearIndex - 1 + capacity) % capacity;
        T element = data[rearIndex];
        dequeSize--;
        return element;
    }
    
    // Get front element
    T& front() {
        if (isEmpty()) {
            throw runtime_error("Deque is empty");
        }
        return data[frontIndex];
    }
    
    // Get rear element
    T& rear() {
        if (isEmpty()) {
            throw runtime_error("Deque is empty");
        }
        size_t index = (rearIndex - 1 + capacity) % capacity;
        return data[index];
    }
    
    bool isEmpty() const {
        return dequeSize == 0;
    }
    
    size_t size() const {
        return dequeSize;
    }
    
    void resize() {
        vector<T> newData(capacity * 2);
        
        for (size_t i = 0; i < dequeSize; i++) {
            newData[i] = data[(frontIndex + i) % capacity];
        }
        
        data = move(newData);
        frontIndex = 0;
        rearIndex = dequeSize;
        capacity *= 2;
    }
};
```

### Circular Queue

A **circular queue** (also called a ring buffer) is a queue implementation that uses a fixed-size array and treats it as if it were connected end-to-end. This allows efficient use of space by reusing array positions.

#### Key Characteristics

1. **Fixed Size**: Array has a fixed capacity
2. **Circular Wrapping**: When rear reaches the end, it wraps to the beginning
3. **Efficient Space Usage**: Reuses array positions after dequeue
4. **O(1) Operations**: All operations are O(1) time

#### Implementation

```cpp
#include <iostream>
#include <vector>
using namespace std;

template<typename T>
class CircularQueue {
private:
    vector<T> data;
    int front;
    int rear;
    int size;
    int capacity;
    
public:
    CircularQueue(int cap) : capacity(cap), front(0), rear(-1), size(0) {
        data.resize(capacity);
    }
    
    // Check if queue is full
    bool isFull() const {
        return size == capacity;
    }
    
    // Check if queue is empty
    bool isEmpty() const {
        return size == 0;
    }
    
    // Enqueue: Add element to rear
    bool enqueue(T value) {
        if (isFull()) {
            cout << "Queue is full!" << endl;
            return false;
        }
        
        // Circular increment of rear
        rear = (rear + 1) % capacity;
        data[rear] = value;
        size++;
        return true;
    }
    
    // Dequeue: Remove element from front
    bool dequeue() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return false;
        }
        
        // Circular increment of front
        front = (front + 1) % capacity;
        size--;
        return true;
    }
    
    // Get front element
    T getFront() const {
        if (isEmpty()) {
            throw runtime_error("Queue is empty!");
        }
        return data[front];
    }
    
    // Get rear element
    T getRear() const {
        if (isEmpty()) {
            throw runtime_error("Queue is empty!");
        }
        return data[rear];
    }
    
    // Get current size
    int getSize() const {
        return size;
    }
    
    // Display queue
    void display() const {
        if (isEmpty()) {
            cout << "Queue is empty" << endl;
            return;
        }
        
        cout << "Queue (front to rear): ";
        int count = 0;
        int index = front;
        
        while (count < size) {
            cout << data[index] << " ";
            index = (index + 1) % capacity;
            count++;
        }
        cout << endl;
    }
};
```

#### Example Usage

```cpp
void demonstrateCircularQueue() {
    CircularQueue<int> cq(5);
    
    // Enqueue elements
    cq.enqueue(10);
    cq.enqueue(20);
    cq.enqueue(30);
    cq.enqueue(40);
    cq.enqueue(50);
    cq.display();  // Queue (front to rear): 10 20 30 40 50
    
    // Try to enqueue when full
    cq.enqueue(60);  // Queue is full!
    
    // Dequeue elements
    cq.dequeue();
    cq.dequeue();
    cq.display();  // Queue (front to rear): 30 40 50
    
    // Enqueue after dequeue (wraps around)
    cq.enqueue(60);
    cq.enqueue(70);
    cq.display();  // Queue (front to rear): 30 40 50 60 70
    
    cout << "Front: " << cq.getFront() << endl;  // 30
    cout << "Rear: " << cq.getRear() << endl;    // 70
    cout << "Size: " << cq.getSize() << endl;    // 5
}
```

#### Visual Representation

```
Initial state (capacity = 5):
[ ][ ][ ][ ][ ]
 ↑
front = 0, rear = -1, size = 0

After enqueue(10), enqueue(20), enqueue(30):
[10][20][30][ ][ ]
 ↑           ↑
front=0    rear=2, size=3

After dequeue() twice:
[10][20][30][ ][ ]
         ↑
    front=2, rear=2, size=1

After enqueue(40), enqueue(50), enqueue(60):
[60][20][30][40][50]
 ↑   ↑
rear=0 front=2, size=5 (full, wraps around)
```

#### Advantages

1. **Efficient Memory Usage**: Reuses array positions, no need for dynamic resizing
2. **O(1) Operations**: All operations are constant time
3. **Fixed Memory Footprint**: Predictable memory usage
4. **Cache-Friendly**: Contiguous memory layout (when not wrapping)

#### Disadvantages

1. **Fixed Size**: Cannot grow beyond initial capacity
2. **Wasted Space**: One slot is typically left empty to distinguish full from empty
3. **Complex Indexing**: Requires modulo arithmetic for circular wrapping

#### When to Use

- **Bounded Buffers**: When you know the maximum size in advance
- **Producer-Consumer Problems**: Fixed-size buffers for data streaming
- **Embedded Systems**: Where memory is constrained and fixed-size is acceptable
- **Real-time Systems**: Where predictable memory usage is critical
- **Ring Buffers**: Logging systems, audio processing, network packet buffers

#### Alternative: Distinguishing Full from Empty

There are two common approaches to distinguish a full queue from an empty one:

**Method 1: Leave one slot empty** (shown above)
- Full when: `(rear + 1) % capacity == front`
- Empty when: `size == 0` or `front == (rear + 1) % capacity`

**Method 2: Use a size counter** (shown in implementation)
- Full when: `size == capacity`
- Empty when: `size == 0`

The size counter method is simpler and more intuitive.

#### Comparison with Regular Queue

| Aspect | Regular Queue | Circular Queue |
|--------|---------------|----------------|
| Memory | Dynamic allocation | Fixed-size array |
| Resizing | Can grow/shrink | Fixed capacity |
| Space Efficiency | May waste space | Reuses positions |
| Complexity | O(1) amortized | O(1) worst-case |
| Use Case | Unknown size | Known max size |

### Priority Queue
```cpp
template<typename T>
class PriorityQueue {
private:
    vector<T> heap;
    
    void heapifyUp(size_t index) {
        if (index == 0) return;
        
        size_t parent = (index - 1) / 2;
        if (heap[index] > heap[parent]) {
            swap(heap[index], heap[parent]);
            heapifyUp(parent);
        }
    }
    
    void heapifyDown(size_t index) {
        size_t leftChild = 2 * index + 1;
        size_t rightChild = 2 * index + 2;
        size_t largest = index;
        
        if (leftChild < heap.size() && heap[leftChild] > heap[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < heap.size() && heap[rightChild] > heap[largest]) {
            largest = rightChild;
        }
        
        if (largest != index) {
            swap(heap[index], heap[largest]);
            heapifyDown(largest);
        }
    }
    
public:
    // Insert element
    void enqueue(const T& element) {
        heap.push_back(element);
        heapifyUp(heap.size() - 1);
    }
    
    // Remove highest priority element
    T dequeue() {
        if (isEmpty()) {
            throw runtime_error("Priority queue is empty");
        }
        
        T maxElement = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!isEmpty()) {
            heapifyDown(0);
        }
        
        return maxElement;
    }
    
    // Get highest priority element
    const T& front() const {
        if (isEmpty()) {
            throw runtime_error("Priority queue is empty");
        }
        return heap[0];
    }
    
    bool isEmpty() const {
        return heap.empty();
    }
    
    size_t size() const {
        return heap.size();
    }
};
```

### 5.5 Implementation Trade-offs and Analysis

#### Time Complexity Comparison

| Operation | Array Stack | Linked Stack | Array Queue | Linked Queue |
|-----------|-------------|--------------|-------------|--------------|
| Push/Enqueue | O(1) amortized | O(1) | O(1) amortized | O(1) |
| Pop/Dequeue | O(1) | O(1) | O(1) | O(1) |
| Top/Front | O(1) | O(1) | O(1) | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) |

#### Space Complexity
- **Array-based**: O(n) where n is the maximum number of elements
- **Linked list-based**: O(n) where n is the current number of elements

#### When to Use Each Implementation

**Array-based Stack/Queue:**
- ✅ Better cache locality
- ✅ Lower memory overhead per element
- ✅ Simpler implementation
- ❌ Fixed size (unless resized)
- ❌ Memory waste if not full

**Linked List-based Stack/Queue:**
- ✅ Dynamic size
- ✅ No memory waste
- ✅ Easy to grow/shrink
- ❌ Extra memory for pointers
- ❌ Poor cache locality

## Part III: Applications

### 5.6 Stack Applications

### Expression Evaluation
```cpp
class ExpressionEvaluator {
private:
    bool isOperator(char c) {
        return c == '+' || c == '-' || c == '*' || c == '/';
    }
    
    int getPrecedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return 0;
    }
    
    int performOperation(int a, int b, char op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return 0;
        }
    }
    
public:
    // Convert infix to postfix
    string infixToPostfix(const string& infix) {
        stack<char> operators;
        string postfix;
        
        for (char c : infix) {
            if (isdigit(c)) {
                postfix += c;
            } else if (c == '(') {
                operators.push(c);
            } else if (c == ')') {
                while (!operators.empty() && operators.top() != '(') {
                    postfix += operators.top();
                    operators.pop();
                }
                operators.pop(); // Remove '('
            } else if (isOperator(c)) {
                while (!operators.empty() && 
                       operators.top() != '(' &&
                       getPrecedence(operators.top()) >= getPrecedence(c)) {
                    postfix += operators.top();
                    operators.pop();
                }
                operators.push(c);
            }
        }
        
        while (!operators.empty()) {
            postfix += operators.top();
            operators.pop();
        }
        
        return postfix;
    }
    
    // Evaluate postfix expression
    int evaluatePostfix(const string& postfix) {
        stack<int> operands;
        
        for (char c : postfix) {
            if (isdigit(c)) {
                operands.push(c - '0');
            } else if (isOperator(c)) {
                int b = operands.top(); operands.pop();
                int a = operands.top(); operands.pop();
                operands.push(performOperation(a, b, c));
            }
        }
        
        return operands.top();
    }
};
```

### Balanced Parentheses Check
```cpp
bool isBalanced(const string& expression) {
    stack<char> stack;
    
    for (char c : expression) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (stack.empty()) {
                return false;
            }
            
            char top = stack.top();
            stack.pop();
            
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    
    return stack.empty();
}
```

### Function Call Stack Simulation
```cpp
class CallStack {
private:
    struct FunctionCall {
        string functionName;
        int lineNumber;
        
        FunctionCall(const string& name, int line) 
            : functionName(name), lineNumber(line) {}
    };
    
    stack<FunctionCall> callStack;
    
public:
    void enterFunction(const string& functionName, int lineNumber) {
        callStack.push(FunctionCall(functionName, lineNumber));
        cout << "Entering function: " << functionName << " at line " << lineNumber << endl;
    }
    
    void exitFunction() {
        if (!callStack.empty()) {
            FunctionCall call = callStack.top();
            callStack.pop();
            cout << "Exiting function: " << call.functionName << endl;
        }
    }
    
    void printStackTrace() {
        cout << "Call stack:" << endl;
        stack<FunctionCall> temp = callStack;
        
        while (!temp.empty()) {
            FunctionCall call = temp.top();
            temp.pop();
            cout << "  " << call.functionName << " (line " << call.lineNumber << ")" << endl;
        }
    }
};
```

### 5.7 Queue Applications

### BFS (Breadth-First Search) Implementation
```cpp
class Graph {
private:
    vector<vector<int>> adjacencyList;
    int vertices;
    
public:
    Graph(int v) : vertices(v) {
        adjacencyList.resize(v);
    }
    
    void addEdge(int u, int v) {
        adjacencyList[u].push_back(v);
        adjacencyList[v].push_back(u); // For undirected graph
    }
    
    vector<int> bfs(int startVertex) {
        vector<bool> visited(vertices, false);
        vector<int> result;
        queue<int> q;
        
        visited[startVertex] = true;
        q.push(startVertex);
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            result.push_back(current);
            
            for (int neighbor : adjacencyList[current]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        
        return result;
    }
};
```

### Task Scheduling Simulation
```cpp
class TaskScheduler {
private:
    struct Task {
        string name;
        int priority;
        int duration;
        
        Task(const string& n, int p, int d) 
            : name(n), priority(p), duration(d) {}
    };
    
    queue<Task> taskQueue;
    
public:
    void addTask(const string& name, int priority, int duration) {
        taskQueue.push(Task(name, priority, duration));
    }
    
    void processTasks() {
        cout << "Processing tasks..." << endl;
        
        while (!taskQueue.empty()) {
            Task currentTask = taskQueue.front();
            taskQueue.pop();
            
            cout << "Processing: " << currentTask.name 
                 << " (Priority: " << currentTask.priority 
                 << ", Duration: " << currentTask.duration << ")" << endl;
            
            // Simulate task processing
            // In real implementation, you would sleep or perform actual work
        }
        
        cout << "All tasks completed!" << endl;
    }
};
```

### Print Level Order (Binary Tree)
```cpp
struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int value) : data(value), left(nullptr), right(nullptr) {}
};

void printLevelOrder(TreeNode* root) {
    if (!root) return;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* current = q.front();
            q.pop();
            
            cout << current->data << " ";
            
            if (current->left) {
                q.push(current->left);
            }
            if (current->right) {
                q.push(current->right);
            }
        }
        cout << endl; // New line for each level
    }
}
```

## Part IV: Problem Solving

### 5.8 Advanced Stack Problems

### Min Stack Implementation

A **Min Stack** is a stack that supports all regular stack operations plus an additional operation `getMin()` that returns the minimum element in O(1) time.

**Problem Statement**: Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

**Solution Approach**: Use an auxiliary stack to keep track of minimum values.

```cpp
class MinStack {
private:
    stack<int> mainStack;
    stack<int> minStack;
    
public:
    MinStack() {}
    
    void push(int val) {
        mainStack.push(val);
        
        // Push to min stack if it's empty or val is <= current minimum
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        }
    }
    
    void pop() {
        if (mainStack.empty()) return;
        
        // If we're popping the minimum element, remove it from min stack too
        if (mainStack.top() == minStack.top()) {
            minStack.pop();
        }
        
        mainStack.pop();
    }
    
    int top() {
        if (mainStack.empty()) {
            throw runtime_error("Stack is empty");
        }
        return mainStack.top();
    }
    
    int getMin() {
        if (minStack.empty()) {
            throw runtime_error("Stack is empty");
        }
        return minStack.top();
    }
    
    bool empty() {
        return mainStack.empty();
    }
    
    size_t size() {
        return mainStack.size();
    }
};

// Alternative implementation using a single stack with pairs
class MinStackOptimized {
private:
    stack<pair<int, int>> st; // {value, current_min}
    
public:
    MinStackOptimized() {}
    
    void push(int val) {
        if (st.empty()) {
            st.push({val, val});
        } else {
            int currentMin = min(val, st.top().second);
            st.push({val, currentMin});
        }
    }
    
    void pop() {
        if (st.empty()) return;
        st.pop();
    }
    
    int top() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().first;
    }
    
    int getMin() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().second;
    }
    
    bool empty() {
        return st.empty();
    }
};
```

**Example Usage**:
```cpp
void demonstrateMinStack() {
    MinStack minStack;
    
    minStack.push(-2);
    minStack.push(0);
    minStack.push(-3);
    
    cout << "Current minimum: " << minStack.getMin() << endl; // -3
    minStack.pop();
    cout << "Top element: " << minStack.top() << endl; // 0
    cout << "Current minimum: " << minStack.getMin() << endl; // -2
    
    minStack.push(-5);
    cout << "Current minimum: " << minStack.getMin() << endl; // -5
}
```

**Time Complexity**:
- `push()`: O(1)
- `pop()`: O(1)
- `top()`: O(1)
- `getMin()`: O(1)

**Space Complexity**: O(n) for storing elements and minimum values

### Max Stack Implementation

A **Max Stack** is similar to a Min Stack but tracks the maximum element instead.

**Problem Statement**: Design a stack that supports push, pop, top, and retrieving the maximum element in constant time.

**Advanced Problem Statement**: Design a stack that supports push, pop, top, peekMax, and popMax operations.

```cpp
class MaxStack {
private:
    stack<int> mainStack;
    stack<int> maxStack;
    
public:
    MaxStack() {}
    
    void push(int val) {
        mainStack.push(val);
        
        // Push to max stack if it's empty or val is >= current maximum
        if (maxStack.empty() || val >= maxStack.top()) {
            maxStack.push(val);
        }
    }
    
    void pop() {
        if (mainStack.empty()) return;
        
        // If we're popping the maximum element, remove it from max stack too
        if (mainStack.top() == maxStack.top()) {
            maxStack.pop();
        }
        
        mainStack.pop();
    }
    
    int top() {
        if (mainStack.empty()) {
            throw runtime_error("Stack is empty");
        }
        return mainStack.top();
    }
    
    int getMax() {
        if (maxStack.empty()) {
            throw runtime_error("Stack is empty");
        }
        return maxStack.top();
    }
    
    bool empty() {
        return mainStack.empty();
    }
    
    size_t size() {
        return mainStack.size();
    }
};

// Alternative implementation using a single stack with pairs
class MaxStackOptimized {
private:
    stack<pair<int, int>> st; // {value, current_max}
    
public:
    MaxStackOptimized() {}
    
    void push(int val) {
        if (st.empty()) {
            st.push({val, val});
        } else {
            int currentMax = max(val, st.top().second);
            st.push({val, currentMax});
        }
    }
    
    void pop() {
        if (st.empty()) return;
        st.pop();
    }
    
    int top() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().first;
    }
    
    int getMax() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().second;
    }
    
    bool empty() {
        return st.empty();
    }
};
```

**Example Usage**:
```cpp
void demonstrateMaxStack() {
    MaxStack maxStack;
    
    maxStack.push(5);
    maxStack.push(1);
    maxStack.push(10);
    maxStack.push(7);
    
    cout << "Current maximum: " << maxStack.getMax() << endl; // 10
    maxStack.pop();
    cout << "Top element: " << maxStack.top() << endl; // 10
    cout << "Current maximum: " << maxStack.getMax() << endl; // 10
    
    maxStack.push(15);
    cout << "Current maximum: " << maxStack.getMax() << endl; // 15
}
```

### Advanced Max Stack with popMax() Operation

For scenarios where you need to remove the maximum element from anywhere in the stack, here's a more sophisticated implementation using `set`:

```cpp
class AdvancedMaxStack {
public:
    AdvancedMaxStack() {}
    
    void push(int x) {
        stk.insert({++counter, x});
        max_stk.insert({x, counter});
    }
    
    int pop() {
        if (stk.empty()) {
            return -1;
        }
        auto it = prev(stk.end());
        int v = it->second; 
        int count = it->first;
        stk.erase(it);
        max_stk.erase({v, count});
        return v;
    }
    
    int top() {
        if (stk.empty()) {
            return -1;
        }
        auto it = prev(stk.end());
        return it->second;
    }
    
    int peekMax() {
        if (max_stk.empty()) {
            return -1;
        }
        auto it = prev(max_stk.end());
        return it->first;
    }
    
    int popMax() {
        if (max_stk.empty()) {
            return -1;
        }
        auto it = prev(max_stk.end());
        int v = it->first; 
        int count = it->second;
        stk.erase({count, v});
        max_stk.erase(it);
        return v;
    }
    
    bool empty() {
        return stk.empty();
    }
    
    size_t size() {
        return stk.size();
    }

private:
    set<pair<int, int>> stk, max_stk;  // {counter, value} and {value, counter}
    int counter{0};
};
```

**Example Usage**:
```cpp
void demonstrateAdvancedMaxStack() {
    AdvancedMaxStack maxStack;
    
    maxStack.push(5);
    maxStack.push(1);
    maxStack.push(10);
    maxStack.push(7);
    
    cout << "Current maximum: " << maxStack.peekMax() << endl; // 10
    cout << "Top element: " << maxStack.top() << endl; // 7
    
    cout << "Popping maximum: " << maxStack.popMax() << endl; // 10
    cout << "Current maximum: " << maxStack.peekMax() << endl; // 7
    cout << "Top element: " << maxStack.top() << endl; // 7
    
    cout << "Popping top: " << maxStack.pop() << endl; // 7
    cout << "Current maximum: " << maxStack.peekMax() << endl; // 5
}
```

**Time Complexity Analysis**:
- `push()`: O(log n) - inserting into set
- `pop()`: O(log n) - erasing from set  
- `top()`: O(log n) - accessing last element in set
- `peekMax()`: O(log n) - accessing last element in max set
- `popMax()`: O(log n) - erasing from both sets

**Space Complexity**: O(n) for storing elements and counters

**Trade-offs**:
- **Advantage**: Supports `popMax()` operation - can remove maximum from anywhere
- **Disadvantage**: Slower than O(1) solutions for basic operations
- **Use Case**: When you need to remove maximum elements frequently

### Advanced Min/Max Stack with Additional Operations

For more complex scenarios, here's an implementation that supports both min and max operations:

```cpp
class MinMaxStack {
private:
    struct Element {
        int value;
        int min;
        int max;
        
        Element(int val, int minVal, int maxVal) 
            : value(val), min(minVal), max(maxVal) {}
    };
    
    stack<Element> st;
    
public:
    MinMaxStack() {}
    
    void push(int val) {
        if (st.empty()) {
            st.push(Element(val, val, val));
        } else {
            int currentMin = min(val, st.top().min);
            int currentMax = max(val, st.top().max);
            st.push(Element(val, currentMin, currentMax));
        }
    }
    
    void pop() {
        if (st.empty()) return;
        st.pop();
    }
    
    int top() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().value;
    }
    
    int getMin() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().min;
    }
    
    int getMax() {
        if (st.empty()) {
            throw runtime_error("Stack is empty");
        }
        return st.top().max;
    }
    
    bool empty() {
        return st.empty();
    }
    
    size_t size() {
        return st.size();
    }
};
```

### Key Insights and Trade-offs

1. **Two Stack Approach**: Uses O(n) extra space but provides O(1) time complexity for all operations
2. **Single Stack with Pairs**: More memory efficient but still O(n) space complexity
3. **Set-based Approach**: O(log n) operations but supports `popMax()` functionality
4. **When to use each approach**:
   - **O(1) solutions**: When you only need peekMin/peekMax operations
   - **Set-based solution**: When you need to remove min/max elements from anywhere
   - **Range queries on stack elements**
   - **Sliding window problems**
   - **Monotonic stack applications**
   - **Dynamic programming with stack-based solutions**

5. **Real-world Applications**:
   - Undo operations with minimum/maximum tracking
   - Expression evaluation with bounds checking
   - Game engines for tracking high/low scores
   - Financial applications for tracking price ranges
   - Priority-based task management systems

### 5.9 Common Interview Problems

#### Problem 1: Valid Parentheses
**Problem**: Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

**Solution Approach**: Use a stack to track opening brackets and match them with closing brackets.

```cpp
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    return st.empty();
}
```

#### Problem 2: Daily Temperatures
**Problem**: Given an array of temperatures, return an array such that for each day in the input, tells you how many days you would have to wait until a warmer temperature.

**Solution Approach**: Use a stack to keep track of indices of temperatures that haven't found a warmer day yet.

```cpp
vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> result(n, 0);
    stack<int> st; // Store indices
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevIndex = st.top();
            st.pop();
            result[prevIndex] = i - prevIndex;
        }
        st.push(i);
    }
    
    return result;
}
```

#### Problem 3: Largest Rectangle in Histogram
**Problem**: Given an array of heights representing a histogram, find the area of the largest rectangle.

**Solution Approach**: Use a stack to maintain increasing heights and calculate areas when a smaller height is encountered.

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    int n = heights.size();
    
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        
        while (!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()];
            st.pop();
            int width = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    
    return maxArea;
}
```

#### Problem 4: Next Greater Element
**Problem**: Given an array, find the next greater element for each element. The next greater element is the first element to the right that is greater than the current element.

**Solution Approach**: Use a monotonic decreasing stack to track elements waiting for their next greater element.

```cpp
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);  // -1 means no greater element found
    stack<int> st;  // Store indices, maintaining decreasing order
    
    for (int i = 0; i < n; i++) {
        // While current element is greater than stack top
        while (!st.empty() && nums[i] > nums[st.top()]) {
            result[st.top()] = nums[i];  // Found next greater for stack top
            st.pop();
        }
        st.push(i);  // Current element waits for its next greater
    }
    
    return result;
}
```

**Example**:
```
Input:  [4, 5, 2, 10, 8]
Output: [5, 10, 10, -1, -1]

Explanation:
- 4 → next greater is 5
- 5 → next greater is 10
- 2 → next greater is 10
- 10 → no greater element
- 8 → no greater element
```

#### Problem 5: Sliding Window Maximum (Monotonic Queue)
**Problem**: Given an array and a window size k, find the maximum element in every window of size k.

**Solution Approach**: Use a deque to maintain a monotonic decreasing sequence of indices.

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;  // Store indices, maintaining decreasing values
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside current window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Remove indices with values smaller than current
        // (they can never be maximum in any window containing current)
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // Window of size k is complete
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}
```

**Time Complexity**: O(n) - each element is added and removed at most once
**Space Complexity**: O(k) - deque stores at most k elements

### 5.9.4 Monotonic Stack and Queue Patterns ⭐ (Important for Interviews)

Monotonic stacks and queues are **essential interview patterns** that solve many problems efficiently. They maintain elements in sorted order while processing, enabling O(n) solutions to problems that might seem O(n²) or O(n log n).

**Common Interview Problems**:
- Next/Previous Greater/Smaller Element
- Sliding Window Maximum/Minimum
- Largest Rectangle in Histogram
- Trapping Rain Water
- Stock Span Problem
- Daily Temperatures
- Maximum Width Ramp

#### What is a Monotonic Stack/Queue?

A **monotonic stack** maintains elements in either:
- **Monotonically increasing order** (smallest at bottom)
- **Monotonically decreasing order** (largest at bottom)

A **monotonic queue** (typically implemented with deque) maintains:
- **Monotonically decreasing order** for maximum queries
- **Monotonically increasing order** for minimum queries

#### Key Insight

The monotonic property allows us to:
1. **Efficiently find next/previous greater/smaller elements** in O(n) time
2. **Maintain sliding window maximum/minimum** in O(n) time
3. **Process elements in order** while maintaining useful information

#### Monotonic Stack Pattern

**Key Insight**: Maintain a stack where elements are in monotonic order. When processing a new element, pop all elements that violate the monotonic property.

**Template for "Next Greater Element"**:
```cpp
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // Monotonic decreasing stack (stores indices)
    
    for (int i = 0; i < n; i++) {
        // Process elements smaller than current
        // Their "next greater" is nums[i]
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
```

**Example: Daily Temperatures (LeetCode 739)**

```cpp
vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> result(n, 0);
    stack<int> st;  // Monotonic decreasing stack
    
    for (int i = 0; i < n; i++) {
        // Pop all days with lower temperature
        // Their answer is (i - their index)
        while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
            int prevDay = st.top();
            st.pop();
            result[prevDay] = i - prevDay;
        }
        st.push(i);
    }
    return result;
}
```

**Example: Largest Rectangle in Histogram (LeetCode 84)**

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;  // Monotonic increasing stack
    int maxArea = 0;
    int n = heights.size();
    
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        
        // Pop while current height is less than stack top
        // Calculate area for each popped bar
        while (!st.empty() && heights[st.top()] > h) {
            int height = heights[st.top()];
            st.pop();
            int width = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    
    return maxArea;
}
```

**When to Use Monotonic Stack**:
- Finding next/previous greater/smaller element
- Largest rectangle in histogram
- Trapping rain water
- Stock span problem
- Daily temperatures
- Maximum width ramp
- Problems requiring "next/previous element" queries

#### Monotonic Queue Pattern

**Key Insight**: Use a deque to maintain elements in monotonic order. Front element is always the optimal value for the current window.

**Template for "Sliding Window Maximum"**:
```cpp
vector<int> slidingWindowMax(vector<int>& nums, int k) {
    deque<int> dq;  // Monotonic decreasing queue (stores indices)
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove out-of-window elements from front
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Maintain decreasing order from back
        // Remove elements smaller than current (they can't be max)
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // Window is complete, add maximum to result
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    return result;
}
```

**Example: Sliding Window Minimum**

```cpp
vector<int> slidingWindowMin(vector<int>& nums, int k) {
    deque<int> dq;  // Monotonic increasing queue
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove out-of-window elements
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Maintain increasing order (for minimum)
        while (!dq.empty() && nums[dq.back()] > nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    return result;
}
```

**Example: Maximum of All Subarrays of Size K**

```cpp
vector<int> maxOfSubarrays(vector<int>& arr, int k) {
    deque<int> dq;  // Stores indices
    vector<int> result;
    
    for (int i = 0; i < arr.size(); i++) {
        // Remove elements outside current window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Remove elements smaller than current
        while (!dq.empty() && arr[dq.back()] <= arr[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(arr[dq.front()]);
        }
    }
    return result;
}
```

**When to Use Monotonic Queue**:
- Sliding window maximum/minimum
- Range maximum/minimum queries
- Problems requiring efficient window operations
- Fixed-size window problems
- Problems where you need to track optimal element in a window

#### Common Variations

1. **Next Smaller Element**: Change `<` to `>` in comparison
2. **Previous Greater Element**: Iterate from right to left
3. **Circular Array**: Process array twice or use modulo indexing
4. **Index-based vs Value-based**: Store indices for range queries, values for simple lookups

#### Complexity Analysis

- **Time**: O(n) - each element is pushed and popped at most once
- **Space**: O(n) - stack/queue stores at most n elements

#### Practice Problems

1. **Next Greater Element I** (LeetCode 496)
2. **Next Greater Element II** (Circular array, LeetCode 503)
3. **Daily Temperatures** (LeetCode 739)
4. **Largest Rectangle in Histogram** (LeetCode 84)
5. **Trapping Rain Water** (LeetCode 42)
6. **Sliding Window Maximum** (LeetCode 239)
7. **Stock Span Problem** (GeeksforGeeks)
8. **Sum of Subarray Minimums** (LeetCode 907)

## Part V: Summary

### 5.10 Performance Analysis

#### Time Complexity

| Operation | Array Stack | Linked Stack | Array Queue | Linked Queue |
|-----------|-------------|--------------|-------------|--------------|
| Push/Enqueue | O(1) amortized | O(1) | O(1) amortized | O(1) |
| Pop/Dequeue | O(1) | O(1) | O(1) | O(1) |
| Top/Front | O(1) | O(1) | O(1) | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) |

### Space Complexity
- **Array-based**: O(n) where n is the maximum number of elements
- **Linked list-based**: O(n) where n is the current number of elements

### 5.11 Key Takeaways

1. **Stacks** follow LIFO principle and are useful for function calls, expression evaluation, and undo operations
2. **Queues** follow FIFO principle and are essential for BFS, task scheduling, and buffering
3. **Min/Max stacks** extend basic stack functionality to provide O(1) minimum/maximum retrieval
4. **Implementation choices** affect performance: arrays provide better cache locality, linked lists avoid memory waste
5. **Specialized variants** like deque and priority queue extend basic functionality
6. **Applications** are numerous in system programming, algorithms, and user interfaces

### 5.12 Practice Exercises

1. Implement a stack that can return the minimum element in O(1) time.
2. Design a queue using two stacks.
3. Implement a circular queue with a fixed size.
4. Create a function to check if a string is a palindrome using a stack.
5. Implement a sliding window maximum using a deque.

## 5.12 Concurrency Considerations

This section applies the concurrency fundamentals from [Chapter 3.5](03.5-concurrency-fundamentals.md) to stacks and queues. See Section 3.5.9 for the producer-consumer problem (bounded queue).

### 5.12.1 Shared-State Invariants

**Stack Invariants** (see Section 3.5.3):
1. **LIFO Invariant**: "Last element pushed is first element popped"
2. **Top Pointer Invariant**: "`top` points to most recently pushed element"
3. **Size Invariant**: "`size` equals number of elements"

**Queue Invariants**:
1. **FIFO Invariant**: "First element enqueued is first element dequeued"
2. **Front/Rear Invariant**: "`front` and `rear` pointers correctly track queue boundaries"
3. **Size Invariant**: "`size` equals number of elements"

**What Must Not Be Observed Half-Updated**:
- Top pointer updates during push/pop
- Front/rear pointer updates during enqueue/dequeue
- Size changes while operations are in progress

### 5.12.2 Operations That Must Be Atomic

**Stack Push** (see Section 3.5.4):
```cpp
void push(int value) {
    Node* new_node = new Node(value);
    new_node->next = top;  // Step 1
    top = new_node;         // Step 2
    size++;                 // Step 3
}
```

**Tie to Invariants**: Between steps, the **Top Pointer Invariant** and **Size Invariant** are violated.

**Queue Enqueue**:
```cpp
void enqueue(int value) {
    Node* new_node = new Node(value);
    rear->next = new_node;  // Step 1
    rear = new_node;        // Step 2
    size++;                 // Step 3
}
```

**Tie to Invariants**: Similar to stack, plus **Empty Queue Race** (check-then-act bug).

**Operations Requiring Atomicity**:
- **Push/Enqueue**: Entire operation (pointer updates and size change)
- **Pop/Dequeue**: Entire operation (pointer updates, size change, element removal)
- **Empty Check + Pop**: Must be atomic (see Section 3.5.4 for check-then-act)

### 5.12.3 Naïve Approaches and Why They Fail

**1. Partial Updates**:
```cpp
// Thread 1: Pushing
new_node->next = top;  // Done
// Thread 2: Pops here, gets old top
top = new_node;        // New node never becomes top
```
**Why It Fails**: Push is not atomic. Invariant violation: **Top Pointer Invariant** broken.

**2. Check-Then-Act Bugs**:
```cpp
if (!isEmpty()) {     // Check
    return pop();      // May pop from empty structure
}
```
**Why It Fails**: Check and pop are not atomic. Invariant violation: **Size Invariant** broken.

**3. Locking Only Part of the Structure**:
```cpp
// Locking only during push, not during pop
void push(int value) {
    std::lock_guard<std::mutex> lock(mtx);
    // push operation
}
// But pop is unprotected!
int pop() {
    return top->data;  // Race condition!
}
```
**Why It Fails**: Operations are not mutually exclusive. Invariant violation: **LIFO Invariant** broken.

### 5.12.4 Locking Strategies

**Coarse-Grained Lock** (see Section 3.5.8):
```cpp
class ThreadSafeStack {
    std::stack<int> data;
    std::mutex mtx;
    
public:
    void push(int value) {
        std::lock_guard<std::mutex> lock(mtx);
        data.push(value);
    }
};
```
- ✅ Simple, correct
- ❌ Low parallelism (only one operation at a time)

**Fine-Grained Lock**:
- Not applicable for stacks (single access point)
- Possible for queues (separate locks for front/rear) but complex and error-prone
- **Recommendation**: Coarse-grained is sufficient for most cases

**Read-Write Locks**: Not applicable (stacks/queues are write-heavy)

**Lock-Free** (see Section 3.5.9):
- Lock-free stacks are relatively straightforward using CAS
- Lock-free queues are much more complex (Michael & Scott algorithm)
- See Section 3.5.9 for lock-free concepts and warnings

### 5.12.5 Performance and Scalability Implications

**Contention** (see Section 3.5.8):
- Coarse-grained locking: High contention, throughput collapses
- Lock-free: Lower contention, but complexity increases significantly

**Throughput Collapse Under Load**:
- With many threads, coarse-grained locking becomes bottleneck
- Lock-free helps but requires careful implementation

**Producer-Consumer Pattern** (see Section 3.5.9):
- Use `std::condition_variable` for bounded queues
- Allows efficient blocking when queue is full/empty

### 5.12.6 When Not to Do This Yourself

**Use Library Implementations**:
- `std::queue`/`std::stack` with external synchronization
- Thread-safe containers from well-tested libraries
- Lock-free implementations from proven libraries (see Section 3.5.9)

**Avoid Premature Optimization**:
- Start with coarse-grained locking
- Only consider lock-free if profiling shows it's necessary
- Lock-free queues are complex (see Section 3.5.9 warning)

**For Production**: Prefer `std::queue`/`std::stack` with external synchronization or thread-safe containers. See Section 3.5.10 for guidance on using libraries.

## 5.13 Failure Modes and Common Pitfalls

Understanding common failure modes helps avoid bugs and performance issues when working with stacks and queues.

### 5.13.1 Common Pitfalls

#### Pitfall 1: Accessing Empty Stack/Queue

**Problem**: Attempting to access top/front of empty stack/queue causes undefined behavior.

```cpp
// WRONG: No check for empty
stack<int> st;
int top = st.top();  // Undefined behavior if stack is empty!

// CORRECT: Always check
stack<int> st;
if (!st.empty()) {
    int top = st.top();
}
```

**How to Avoid**:
- Always check `empty()` before accessing `top()` or `front()`
- Use exception-safe wrappers
- Initialize with sentinel values if appropriate

#### Pitfall 2: Stack Overflow (Array-Based Implementation)

**Problem**: Pushing to full stack without checking capacity.

```cpp
// WRONG: No capacity check
class Stack {
    int arr[100];
    int top = -1;
public:
    void push(int val) {
        arr[++top] = val;  // Overflow if top >= 99!
    }
};

// CORRECT: Check capacity
void push(int val) {
    if (top >= 99) {
        throw overflow_error("Stack is full");
    }
    arr[++top] = val;
}
```

**How to Avoid**:
- Check capacity before push
- Use dynamic arrays (vector) for automatic resizing
- Implement proper error handling

#### Pitfall 3: Memory Leaks (Pointer-Based Implementation)

**Problem**: Not deallocating memory when popping from stack.

```cpp
// WRONG: Memory leak
class Stack {
    Node* top;
public:
    int pop() {
        int val = top->data;
        top = top->next;  // Memory leak! Old node not deleted
        return val;
    }
};

// CORRECT: Delete node
int pop() {
    if (!top) throw underflow_error("Stack is empty");
    int val = top->data;
    Node* temp = top;
    top = top->next;
    delete temp;  // Free memory
    return val;
}
```

**How to Avoid**:
- Always delete/free memory when removing nodes
- Use smart pointers (`unique_ptr`, `shared_ptr`)
- Use RAII principles

#### Pitfall 4: Iterator Invalidation

**Problem**: Modifying stack/queue while iterating.

```cpp
// WRONG: Iterator invalidation
stack<int> st = {1, 2, 3, 4, 5};
// Can't iterate stack directly, but if using vector-based:
vector<int> vec = {1, 2, 3};
for (auto it = vec.begin(); it != vec.end(); ++it) {
    vec.push_back(*it);  // Iterator may be invalidated!
}
```

**How to Avoid**:
- Don't modify container during iteration
- Use indices instead of iterators if modification needed
- Complete iteration before modifications

#### Pitfall 5: Incorrect Order (Queue Implementation)

**Problem**: Implementing queue incorrectly, breaking FIFO order.

```cpp
// WRONG: Using stack operations for queue
queue<int> q;
q.push(1);
q.push(2);
q.push(3);
// If implemented incorrectly, might get LIFO instead of FIFO

// CORRECT: Ensure proper FIFO implementation
// Front points to oldest element
// Rear points to newest element
```

**How to Avoid**:
- Verify FIFO order with test cases
- Use standard library implementations
- Test with multiple enqueue/dequeue operations

#### Pitfall 6: Race Conditions in Concurrent Access

**Problem**: Multiple threads accessing stack/queue without synchronization.

```cpp
// WRONG: No synchronization
stack<int> st;
// Thread 1:
st.push(1);
// Thread 2:
st.push(2);  // Race condition!

// CORRECT: Use mutex
mutex mtx;
stack<int> st;
// Thread 1:
{
    lock_guard<mutex> lock(mtx);
    st.push(1);
}
```

**How to Avoid**:
- Use mutexes for thread-safe access
- Consider lock-free implementations for high contention
- Use thread-safe containers from libraries

#### Pitfall 7: Off-by-One Errors in Circular Queue

**Problem**: Incorrect index calculation in circular queue.

```cpp
// WRONG: Off-by-one in circular queue
class CircularQueue {
    int arr[100];
    int front = 0, rear = 0;
public:
    void enqueue(int val) {
        arr[rear] = val;
        rear = (rear + 1) % 100;  // Might overflow if not checking full
    }
};

// CORRECT: Proper full/empty checks
bool isFull() {
    return (rear + 1) % capacity == front;
}
```

**How to Avoid**:
- Carefully handle circular index arithmetic
- Use separate size counter to distinguish full from empty
- Test edge cases (full, empty, single element)

### 5.13.2 What Breaks Invariants

**Stack Invariants** (see Section 5.1.1):
- **LIFO Violation**: If elements are accessed in wrong order
- **Size Inconsistency**: If size doesn't match actual elements
- **Top Pointer Error**: If top doesn't point to most recent element

**Queue Invariants** (see Section 5.1.1):
- **FIFO Violation**: If elements are dequeued in wrong order
- **Size Inconsistency**: If size doesn't match actual elements
- **Front/Rear Error**: If pointers don't correctly track queue boundaries

### 5.13.3 How Operations Restore Invariants

**Stack Operations**:
- **Push**: Increments size, updates top pointer, preserves LIFO
- **Pop**: Decrements size, updates top pointer, removes top element
- **Top**: Returns top without modifying structure

**Queue Operations**:
- **Enqueue**: Increments size, updates rear pointer, preserves FIFO
- **Dequeue**: Decrements size, updates front pointer, removes front element
- **Front**: Returns front without modifying structure

### 5.13.4 Best Practices

1. **Always Check Empty**: Before accessing top/front
2. **Handle Capacity**: Check bounds for array-based implementations
3. **Memory Management**: Properly deallocate in pointer-based implementations
4. **Thread Safety**: Use synchronization for concurrent access
5. **Test Edge Cases**: Empty, single element, full capacity
6. **Use Standard Library**: Prefer `std::stack` and `std::queue` when possible

### 5.14 Summary

Stacks and queues are fundamental abstract data types that provide specific access patterns essential for many algorithms and system operations. Understanding their implementations, trade-offs, and applications is crucial for solving problems that require LIFO or FIFO behavior. These data structures serve as building blocks for more complex algorithms and are widely used in computer science and software engineering.

In the next chapter, we'll explore trees and binary trees, which introduce hierarchical data organization and provide the foundation for many advanced data structures and algorithms.
