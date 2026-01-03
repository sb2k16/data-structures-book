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

### 5.13 Summary

Stacks and queues are fundamental abstract data types that provide specific access patterns essential for many algorithms and system operations. Understanding their implementations, trade-offs, and applications is crucial for solving problems that require LIFO or FIFO behavior. These data structures serve as building blocks for more complex algorithms and are widely used in computer science and software engineering.

In the next chapter, we'll explore trees and binary trees, which introduce hierarchical data organization and provide the foundation for many advanced data structures and algorithms.
