#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

// ============================================================================
// Activity Selection
// ============================================================================

struct Activity {
    int start, finish;
    Activity(int s, int f) : start(s), finish(f) {}
};

bool compareFinish(const Activity& a, const Activity& b) {
    return a.finish < b.finish;
}

vector<Activity> activitySelection(vector<Activity>& activities) {
    sort(activities.begin(), activities.end(), compareFinish);
    vector<Activity> selected;
    selected.push_back(activities[0]);
    int lastFinish = activities[0].finish;
    
    for (size_t i = 1; i < activities.size(); i++) {
        if (activities[i].start >= lastFinish) {
            selected.push_back(activities[i]);
            lastFinish = activities[i].finish;
        }
    }
    return selected;
}

// ============================================================================
// Fractional Knapsack
// ============================================================================

struct Item {
    int weight, value;
    double ratio;
    Item(int w, int v) : weight(w), value(v) {
        ratio = static_cast<double>(value) / weight;
    }
};

bool compareRatio(const Item& a, const Item& b) {
    return a.ratio > b.ratio;
}

double fractionalKnapsack(vector<Item>& items, int capacity) {
    sort(items.begin(), items.end(), compareRatio);
    double totalValue = 0.0;
    int remaining = capacity;
    
    for (const Item& item : items) {
        if (remaining >= item.weight) {
            totalValue += item.value;
            remaining -= item.weight;
        } else {
            totalValue += item.ratio * remaining;
            break;
        }
    }
    return totalValue;
}

// ============================================================================
// Demonstration
// ============================================================================

void demonstrateActivitySelection() {
    cout << "\n=== Activity Selection ===" << endl;
    vector<Activity> activities = {
        {1, 4}, {3, 5}, {0, 6}, {5, 7}, {8, 9}, {5, 9}
    };
    
    vector<Activity> selected = activitySelection(activities);
    cout << "Selected activities: ";
    for (const Activity& a : selected) {
        cout << "(" << a.start << "," << a.finish << ") ";
    }
    cout << endl;
}

void demonstrateKnapsack() {
    cout << "\n=== Fractional Knapsack ===" << endl;
    vector<Item> items = {
        {10, 60}, {20, 100}, {30, 120}
    };
    int capacity = 50;
    
    double maxValue = fractionalKnapsack(items, capacity);
    cout << "Maximum value: " << maxValue << endl;
}

int main() {
    demonstrateActivitySelection();
    demonstrateKnapsack();
    return 0;
}

