// Audio Buffer using Circular Buffer (Ring Buffer)
// Example from Chapter 5: Stacks and Queues

#include <iostream>
#include <vector>
#include <mutex>
using namespace std;

class AudioBuffer {
private:
    vector<int16_t> buffer;  // 16-bit audio samples
    int front, rear, size, capacity;
    mutable mutex mtx;  // mutable so const observers (getBufferLevel) can lock
    
public:
    AudioBuffer(int cap) : capacity(cap), front(0), rear(-1), size(0) {
        buffer.resize(capacity);
    }
    
    bool addSample(int16_t sample) {
        lock_guard<mutex> lock(mtx);
        if (size >= capacity) {
            // Buffer full - overwrite oldest (ring buffer behavior)
            front = (front + 1) % capacity;
            size--;
        }
        
        rear = (rear + 1) % capacity;
        buffer[rear] = sample;
        size++;
        return true;
    }
    
    bool getSample(int16_t& sample) {
        lock_guard<mutex> lock(mtx);
        if (size == 0) return false;
        
        sample = buffer[front];
        front = (front + 1) % capacity;
        size--;
        return true;
    }
    
    int getBufferLevel() const {
        lock_guard<mutex> lock(mtx);
        return size;
    }
};

// Example usage
int main() {
    AudioBuffer audioBuffer(1000);  // Buffer for 1000 samples
    
    // Producer: Add audio samples
    for (int i = 0; i < 1500; i++) {
        audioBuffer.addSample(static_cast<int16_t>(i % 32767));
    }
    
    cout << "Buffer level: " << audioBuffer.getBufferLevel() << endl;
    
    // Consumer: Get audio samples
    int16_t sample;
    int count = 0;
    while (audioBuffer.getSample(sample)) {
        count++;
    }
    
    cout << "Processed " << count << " samples" << endl;
    
    return 0;
}

