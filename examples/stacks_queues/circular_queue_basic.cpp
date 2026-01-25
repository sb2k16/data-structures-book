// Circular Queue Basic Implementation
// Example from Chapter 5: Stacks and Queues

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

// Example usage
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

int main() {
    demonstrateCircularQueue();
    return 0;
}

