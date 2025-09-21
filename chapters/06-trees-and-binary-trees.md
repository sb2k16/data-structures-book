# Chapter 6: Trees and Binary Trees

## 6.1 Introduction to Trees

A **tree** is a hierarchical data structure consisting of nodes connected by edges. Unlike linear structures like arrays and linked lists, trees provide a way to organize data in a hierarchical manner.

### Tree Terminology

- **Node**: An element in the tree that contains data
- **Root**: The topmost node of the tree (no parent)
- **Parent**: A node that has child nodes
- **Child**: A node that has a parent
- **Leaf**: A node with no children
- **Sibling**: Nodes that have the same parent
- **Ancestor**: Any node on the path from the root to a given node
- **Descendant**: Any node in the subtree rooted at a given node
- **Depth**: The number of edges from the root to a node
- **Height**: The maximum depth of any node in the tree
- **Degree**: The number of children a node has

### Tree Properties

1. **Connected**: Every node is reachable from the root
2. **Acyclic**: No cycles exist in the tree
3. **Unique path**: Exactly one path exists between any two nodes

## 6.2 Binary Trees

A **binary tree** is a tree where each node has at most two children, referred to as the **left child** and **right child**.

### Binary Tree Node Structure
```cpp
#include <iostream>
#include <queue>
#include <stack>
#include <vector>
using namespace std;

template<typename T>
struct TreeNode {
    T data;
    TreeNode<T>* left;
    TreeNode<T>* right;
    
    TreeNode(T value) : data(value), left(nullptr), right(nullptr) {}
    
    // Destructor to clean up memory
    ~TreeNode() {
        delete left;
        delete right;
    }
};
```

### Binary Tree Implementation
```cpp
template<typename T>
class BinaryTree {
private:
    TreeNode<T>* root;
    
    // Helper function to insert recursively
    TreeNode<T>* insertHelper(TreeNode<T>* node, T value) {
        if (!node) {
            return new TreeNode<T>(value);
        }
        
        if (value < node->data) {
            node->left = insertHelper(node->left, value);
        } else {
            node->right = insertHelper(node->right, value);
        }
        
        return node;
    }
    
    // Helper function to find minimum value
    TreeNode<T>* findMin(TreeNode<T>* node) {
        while (node && node->left) {
            node = node->left;
        }
        return node;
    }
    
    // Helper function to delete a node
    TreeNode<T>* deleteHelper(TreeNode<T>* node, T value) {
        if (!node) {
            return nullptr;
        }
        
        if (value < node->data) {
            node->left = deleteHelper(node->left, value);
        } else if (value > node->data) {
            node->right = deleteHelper(node->right, value);
        } else {
            // Node to be deleted found
            if (!node->left) {
                TreeNode<T>* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                TreeNode<T>* temp = node->left;
                delete node;
                return temp;
            }
            
            // Node with two children
            TreeNode<T>* temp = findMin(node->right);
            node->data = temp->data;
            node->right = deleteHelper(node->right, temp->data);
        }
        
        return node;
    }
    
    // Helper function to search
    bool searchHelper(TreeNode<T>* node, T value) {
        if (!node) {
            return false;
        }
        
        if (value == node->data) {
            return true;
        } else if (value < node->data) {
            return searchHelper(node->left, value);
        } else {
            return searchHelper(node->right, value);
        }
    }
    
    // Helper function to get height
    int getHeightHelper(TreeNode<T>* node) {
        if (!node) {
            return -1;  // Height of empty tree is -1
        }
        
        int leftHeight = getHeightHelper(node->left);
        int rightHeight = getHeightHelper(node->right);
        
        return 1 + max(leftHeight, rightHeight);
    }
    
    // Helper function to count nodes
    int countNodesHelper(TreeNode<T>* node) {
        if (!node) {
            return 0;
        }
        
        return 1 + countNodesHelper(node->left) + countNodesHelper(node->right);
    }
    
    // Helper function to count leaves
    int countLeavesHelper(TreeNode<T>* node) {
        if (!node) {
            return 0;
        }
        
        if (!node->left && !node->right) {
            return 1;
        }
        
        return countLeavesHelper(node->left) + countLeavesHelper(node->right);
    }
    
public:
    BinaryTree() : root(nullptr) {}
    
    ~BinaryTree() {
        delete root;
    }
    
    // Insert a value into the tree
    void insert(T value) {
        root = insertHelper(root, value);
    }
    
    // Delete a value from the tree
    void remove(T value) {
        root = deleteHelper(root, value);
    }
    
    // Search for a value
    bool search(T value) {
        return searchHelper(root, value);
    }
    
    // Get height of the tree
    int getHeight() {
        return getHeightHelper(root);
    }
    
    // Count total nodes
    int countNodes() {
        return countNodesHelper(root);
    }
    
    // Count leaf nodes
    int countLeaves() {
        return countLeavesHelper(root);
    }
    
    // Check if tree is empty
    bool isEmpty() {
        return root == nullptr;
    }
    
    // Clear the tree
    void clear() {
        delete root;
        root = nullptr;
    }
};
```

## 6.3 Tree Traversal Algorithms

### Depth-First Traversal (DFS)

#### 1. Preorder Traversal (Root-Left-Right)
```cpp
// Recursive implementation
template<typename T>
void preorderRecursive(TreeNode<T>* node) {
    if (node) {
        cout << node->data << " ";        // Visit root
        preorderRecursive(node->left);    // Traverse left subtree
        preorderRecursive(node->right);   // Traverse right subtree
    }
}

// Iterative implementation using stack
template<typename T>
void preorderIterative(TreeNode<T>* root) {
    if (!root) return;
    
    stack<TreeNode<T>*> stack;
    stack.push(root);
    
    while (!stack.empty()) {
        TreeNode<T>* node = stack.top();
        stack.pop();
        
        cout << node->data << " ";
        
        // Push right child first, then left (stack is LIFO)
        if (node->right) {
            stack.push(node->right);
        }
        if (node->left) {
            stack.push(node->left);
        }
    }
}
```

#### 2. Inorder Traversal (Left-Root-Right)
```cpp
// Recursive implementation
template<typename T>
void inorderRecursive(TreeNode<T>* node) {
    if (node) {
        inorderRecursive(node->left);     // Traverse left subtree
        cout << node->data << " ";        // Visit root
        inorderRecursive(node->right);    // Traverse right subtree
    }
}

// Iterative implementation
template<typename T>
void inorderIterative(TreeNode<T>* root) {
    stack<TreeNode<T>*> stack;
    TreeNode<T>* current = root;
    
    while (current || !stack.empty()) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current->left;
        }
        
        // Process current node
        current = stack.top();
        stack.pop();
        cout << current->data << " ";
        
        // Move to right subtree
        current = current->right;
    }
}
```

#### 3. Postorder Traversal (Left-Right-Root)
```cpp
// Recursive implementation
template<typename T>
void postorderRecursive(TreeNode<T>* node) {
    if (node) {
        postorderRecursive(node->left);   // Traverse left subtree
        postorderRecursive(node->right);  // Traverse right subtree
        cout << node->data << " ";        // Visit root
    }
}

// Iterative implementation using two stacks
template<typename T>
void postorderIterative(TreeNode<T>* root) {
    if (!root) return;
    
    stack<TreeNode<T>*> stack1, stack2;
    stack1.push(root);
    
    while (!stack1.empty()) {
        TreeNode<T>* node = stack1.top();
        stack1.pop();
        stack2.push(node);
        
        if (node->left) {
            stack1.push(node->left);
        }
        if (node->right) {
            stack1.push(node->right);
        }
    }
    
    while (!stack2.empty()) {
        cout << stack2.top()->data << " ";
        stack2.pop();
    }
}
```

### Breadth-First Traversal (BFS)

#### Level Order Traversal
```cpp
template<typename T>
void levelOrderTraversal(TreeNode<T>* root) {
    if (!root) return;
    
    queue<TreeNode<T>*> queue;
    queue.push(root);
    
    while (!queue.empty()) {
        int levelSize = queue.size();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode<T>* node = queue.front();
            queue.pop();
            
            cout << node->data << " ";
            
            if (node->left) {
                queue.push(node->left);
            }
            if (node->right) {
                queue.push(node->right);
            }
        }
        cout << endl;  // New line for each level
    }
}
```

### Adding Traversal Methods to BinaryTree Class
```cpp
// Add these methods to the BinaryTree class
public:
    void preorderTraversal() {
        cout << "Preorder: ";
        preorderRecursive(root);
        cout << endl;
    }
    
    void inorderTraversal() {
        cout << "Inorder: ";
        inorderRecursive(root);
        cout << endl;
    }
    
    void postorderTraversal() {
        cout << "Postorder: ";
        postorderRecursive(root);
        cout << endl;
    }
    
    void levelOrderTraversal() {
        cout << "Level Order:" << endl;
        levelOrderTraversal(root);
    }
```

## 6.4 Binary Search Trees (BST)

A **Binary Search Tree** is a binary tree with the following property:
- For any node, all values in the left subtree are less than the node's value
- For any node, all values in the right subtree are greater than the node's value

### BST Implementation
```cpp
template<typename T>
class BinarySearchTree {
private:
    TreeNode<T>* root;
    
    // Helper function to insert maintaining BST property
    TreeNode<T>* insertHelper(TreeNode<T>* node, T value) {
        if (!node) {
            return new TreeNode<T>(value);
        }
        
        if (value < node->data) {
            node->left = insertHelper(node->left, value);
        } else if (value > node->data) {
            node->right = insertHelper(node->right, value);
        }
        // If value == node->data, do nothing (no duplicates)
        
        return node;
    }
    
    // Helper function to find minimum value
    TreeNode<T>* findMin(TreeNode<T>* node) {
        while (node && node->left) {
            node = node->left;
        }
        return node;
    }
    
    // Helper function to find maximum value
    TreeNode<T>* findMax(TreeNode<T>* node) {
        while (node && node->right) {
            node = node->right;
        }
        return node;
    }
    
    // Helper function to delete a node
    TreeNode<T>* deleteHelper(TreeNode<T>* node, T value) {
        if (!node) {
            return nullptr;
        }
        
        if (value < node->data) {
            node->left = deleteHelper(node->left, value);
        } else if (value > node->data) {
            node->right = deleteHelper(node->right, value);
        } else {
            // Node to be deleted found
            if (!node->left) {
                TreeNode<T>* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                TreeNode<T>* temp = node->left;
                delete node;
                return temp;
            }
            
            // Node with two children: get inorder successor
            TreeNode<T>* temp = findMin(node->right);
            node->data = temp->data;
            node->right = deleteHelper(node->right, temp->data);
        }
        
        return node;
    }
    
    // Helper function to validate BST
    bool isValidBSTHelper(TreeNode<T>* node, T minVal, T maxVal) {
        if (!node) {
            return true;
        }
        
        if (node->data <= minVal || node->data >= maxVal) {
            return false;
        }
        
        return isValidBSTHelper(node->left, minVal, node->data) &&
               isValidBSTHelper(node->right, node->data, maxVal);
    }
    
    // Helper function to find kth smallest element
    void kthSmallestHelper(TreeNode<T>* node, int& count, int k, T& result) {
        if (!node || count >= k) {
            return;
        }
        
        kthSmallestHelper(node->left, count, k, result);
        count++;
        
        if (count == k) {
            result = node->data;
            return;
        }
        
        kthSmallestHelper(node->right, count, k, result);
    }
    
public:
    BinarySearchTree() : root(nullptr) {}
    
    ~BinarySearchTree() {
        delete root;
    }
    
    // Insert a value
    void insert(T value) {
        root = insertHelper(root, value);
    }
    
    // Delete a value
    void remove(T value) {
        root = deleteHelper(root, value);
    }
    
    // Search for a value
    bool search(T value) {
        TreeNode<T>* current = root;
        
        while (current) {
            if (value == current->data) {
                return true;
            } else if (value < current->data) {
                current = current->left;
            } else {
                current = current->right;
            }
        }
        
        return false;
    }
    
    // Find minimum value
    T findMin() {
        if (!root) {
            throw runtime_error("Tree is empty");
        }
        return findMin(root)->data;
    }
    
    // Find maximum value
    T findMax() {
        if (!root) {
            throw runtime_error("Tree is empty");
        }
        return findMax(root)->data;
    }
    
    // Validate if tree is a valid BST
    bool isValidBST() {
        return isValidBSTHelper(root, numeric_limits<T>::min(), 
                               numeric_limits<T>::max());
    }
    
    // Find kth smallest element
    T kthSmallest(int k) {
        int count = 0;
        T result;
        kthSmallestHelper(root, count, k, result);
        return result;
    }
    
    // Get height
    int getHeight() {
        return getHeightHelper(root);
    }
    
    // Count nodes
    int countNodes() {
        return countNodesHelper(root);
    }
    
    // Check if empty
    bool isEmpty() {
        return root == nullptr;
    }
    
    // Inorder traversal (gives sorted order for BST)
    void inorderTraversal() {
        cout << "Inorder (sorted): ";
        inorderRecursive(root);
        cout << endl;
    }
};
```

## 6.5 Advanced Tree Operations

### Lowest Common Ancestor (LCA)
```cpp
template<typename T>
TreeNode<T>* findLCA(TreeNode<T>* root, T value1, T value2) {
    if (!root) {
        return nullptr;
    }
    
    if (root->data == value1 || root->data == value2) {
        return root;
    }
    
    TreeNode<T>* leftLCA = findLCA(root->left, value1, value2);
    TreeNode<T>* rightLCA = findLCA(root->right, value1, value2);
    
    if (leftLCA && rightLCA) {
        return root;
    }
    
    return leftLCA ? leftLCA : rightLCA;
}

// For BST, we can optimize LCA
template<typename T>
TreeNode<T>* findLCABST(TreeNode<T>* root, T value1, T value2) {
    if (!root) {
        return nullptr;
    }
    
    if (root->data > value1 && root->data > value2) {
        return findLCABST(root->left, value1, value2);
    }
    
    if (root->data < value1 && root->data < value2) {
        return findLCABST(root->right, value1, value2);
    }
    
    return root;
}
```

### Path Sum Problems
```cpp
// Check if there exists a root-to-leaf path with given sum
bool hasPathSum(TreeNode<int>* root, int targetSum) {
    if (!root) {
        return false;
    }
    
    if (!root->left && !root->right) {
        return root->data == targetSum;
    }
    
    int remainingSum = targetSum - root->data;
    return hasPathSum(root->left, remainingSum) || 
           hasPathSum(root->right, remainingSum);
}

// Find all root-to-leaf paths with given sum
void findAllPaths(TreeNode<int>* root, int targetSum, 
                  vector<int>& currentPath, vector<vector<int>>& allPaths) {
    if (!root) {
        return;
    }
    
    currentPath.push_back(root->data);
    
    if (!root->left && !root->right && root->data == targetSum) {
        allPaths.push_back(currentPath);
    } else {
        findAllPaths(root->left, targetSum - root->data, currentPath, allPaths);
        findAllPaths(root->right, targetSum - root->data, currentPath, allPaths);
    }
    
    currentPath.pop_back();
}
```

### Tree Serialization and Deserialization
```cpp
// Serialize tree to string (preorder with null markers)
string serialize(TreeNode<int>* root) {
    if (!root) {
        return "null,";
    }
    
    return to_string(root->data) + "," + 
           serialize(root->left) + 
           serialize(root->right);
}

// Deserialize string to tree
TreeNode<int>* deserializeHelper(istringstream& iss) {
    string token;
    getline(iss, token, ',');
    
    if (token == "null") {
        return nullptr;
    }
    
    TreeNode<int>* root = new TreeNode<int>(stoi(token));
    root->left = deserializeHelper(iss);
    root->right = deserializeHelper(iss);
    
    return root;
}

TreeNode<int>* deserialize(string data) {
    istringstream iss(data);
    return deserializeHelper(iss);
}
```

### Tree Validation and Properties
```cpp
// Check if two trees are identical
bool isSameTree(TreeNode<int>* p, TreeNode<int>* q) {
    if (!p && !q) {
        return true;
    }
    
    if (!p || !q) {
        return false;
    }
    
    return (p->data == q->data) &&
           isSameTree(p->left, q->left) &&
           isSameTree(p->right, q->right);
}

// Check if tree is symmetric
bool isSymmetric(TreeNode<int>* root) {
    if (!root) {
        return true;
    }
    
    return isSymmetricHelper(root->left, root->right);
}

bool isSymmetricHelper(TreeNode<int>* left, TreeNode<int>* right) {
    if (!left && !right) {
        return true;
    }
    
    if (!left || !right) {
        return false;
    }
    
    return (left->data == right->data) &&
           isSymmetricHelper(left->left, right->right) &&
           isSymmetricHelper(left->right, right->left);
}

// Check if tree is balanced
bool isBalanced(TreeNode<int>* root) {
    return getHeightAndCheckBalanced(root) != -1;
}

int getHeightAndCheckBalanced(TreeNode<int>* root) {
    if (!root) {
        return 0;
    }
    
    int leftHeight = getHeightAndCheckBalanced(root->left);
    if (leftHeight == -1) {
        return -1;
    }
    
    int rightHeight = getHeightAndCheckBalanced(root->right);
    if (rightHeight == -1) {
        return -1;
    }
    
    if (abs(leftHeight - rightHeight) > 1) {
        return -1;
    }
    
    return 1 + max(leftHeight, rightHeight);
}
```

## 6.6 Example Usage and Testing

```cpp
void demonstrateBinaryTree() {
    BinarySearchTree<int> bst;
    
    // Insert elements
    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    bst.insert(20);
    bst.insert(40);
    bst.insert(60);
    bst.insert(80);
    
    // Display tree properties
    cout << "Tree height: " << bst.getHeight() << endl;
    cout << "Number of nodes: " << bst.countNodes() << endl;
    
    // Traversal methods
    bst.inorderTraversal();  // Should print sorted order
    
    // Search operations
    cout << "Search 40: " << bst.search(40) << endl;
    cout << "Search 45: " << bst.search(45) << endl;
    
    // Min/Max operations
    cout << "Minimum value: " << bst.findMin() << endl;
    cout << "Maximum value: " << bst.findMax() << endl;
    
    // Kth smallest
    cout << "3rd smallest: " << bst.kthSmallest(3) << endl;
    
    // Delete operation
    bst.remove(30);
    cout << "After deleting 30:" << endl;
    bst.inorderTraversal();
    
    // Validation
    cout << "Is valid BST: " << bst.isValidBST() << endl;
}

int main() {
    demonstrateBinaryTree();
    return 0;
}
```

## 6.7 Performance Analysis

### Time Complexity

| Operation | Average Case | Worst Case |
|-----------|--------------|------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Traversal | O(n) | O(n) |
| Height | O(log n) | O(n) |

### Space Complexity
- **Storage**: O(n) for n nodes
- **Recursion stack**: O(h) where h is the height of the tree
- **Worst case**: O(n) for skewed trees

## 6.8 Key Takeaways

1. **Trees** provide hierarchical data organization with efficient search, insert, and delete operations
2. **Binary Search Trees** maintain sorted order and provide O(log n) average-case operations
3. **Traversal algorithms** (preorder, inorder, postorder, level-order) serve different purposes
4. **Tree properties** like height, balance, and symmetry are important for performance
5. **BST operations** are efficient when the tree is balanced
6. **Tree algorithms** often use recursion naturally due to the recursive structure

## 6.9 Exercises

1. Implement a function to find the diameter of a binary tree.
2. Write a function to convert a sorted array to a balanced BST.
3. Implement a function to find the lowest common ancestor of two nodes.
4. Create a function to check if a binary tree is a valid BST.
5. Write a function to serialize and deserialize a binary tree.

## 6.10 Summary

Trees and binary trees are fundamental hierarchical data structures that provide efficient organization and access patterns. Binary Search Trees, in particular, offer excellent average-case performance for search, insertion, and deletion operations. Understanding tree traversal algorithms, tree properties, and common tree problems is essential for solving many algorithmic challenges and designing efficient data structures.

In the next chapter, we'll explore hash tables and hashing techniques, which provide constant-time average-case performance for key-value operations and are widely used in modern software systems.
