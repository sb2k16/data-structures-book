// Command History using Ring Buffer
// Example from Chapter 5: Stacks and Queues

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class CommandHistory {
private:
    vector<string> history;
    int front, rear, size, capacity;
    int current;  // Current position in history
    
public:
    CommandHistory(int maxCommands) 
        : capacity(maxCommands), front(0), rear(-1), size(0), current(-1) {
        history.resize(capacity);
    }
    
    void addCommand(const string& cmd) {
        rear = (rear + 1) % capacity;
        history[rear] = cmd;
        
        if (size < capacity) {
            size++;
        } else {
            // Overwrite oldest command
            front = (front + 1) % capacity;
        }
        
        current = rear;  // Reset to most recent
    }
    
    string getPrevious() {
        if (size == 0 || current == -1) return "";
        
        string cmd = history[current];
        current = (current - 1 + capacity) % capacity;
        
        // Wrap around if needed
        if (current == rear && size == capacity) {
            current = front;
        }
        
        return cmd;
    }
    
    string getNext() {
        if (size == 0 || current == -1) return "";
        
        current = (current + 1) % capacity;
        if (current > rear) {
            current = rear;
        }
        
        return history[current];
    }
    
    void displayHistory() {
        cout << "Command History:" << endl;
        int idx = front;
        for (int i = 0; i < size; i++) {
            cout << "  " << (i + 1) << ": " << history[idx] << endl;
            idx = (idx + 1) % capacity;
        }
    }
};

// Example usage
int main() {
    CommandHistory history(5);  // Store last 5 commands
    
    // Add commands
    history.addCommand("ls -la");
    history.addCommand("cd /home/user");
    history.addCommand("mkdir project");
    history.addCommand("cd project");
    history.addCommand("git init");
    
    cout << "Initial history:" << endl;
    history.displayHistory();
    
    // Add more commands (will overwrite oldest)
    history.addCommand("git add .");
    history.addCommand("git commit -m 'Initial commit'");
    
    cout << "\nAfter adding more commands:" << endl;
    history.displayHistory();
    
    // Navigate history
    cout << "\nNavigating history (previous):" << endl;
    for (int i = 0; i < 3; i++) {
        cout << "Previous: " << history.getPrevious() << endl;
    }
    
    return 0;
}

