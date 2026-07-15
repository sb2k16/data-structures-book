/**
 * Multi-language versions of illustrative prose snippets, for <CodeTabs>.
 * These are display-only (not run), so they mirror the C++ in the text
 * idiomatically in each language rather than sharing a judge.
 */
export type Snippet = { lang: 'cpp' | 'py' | 'java' | 'go'; code: string };

/** Trees — iterative BST search (every comparison discards a subtree). */
export const treeSearch: Snippet[] = [
  { lang: 'cpp', code: `Node* search(Node* node, int key) {
    while (node) {
        if (key == node->data) return node;   // found it
        node = key < node->data ? node->left   // answer is left
                                : node->right;  // answer is right
    }
    return nullptr;                             // fell off the tree: absent
}` },
  { lang: 'py', code: `def search(node, key):
    while node:
        if key == node.data:
            return node                      # found it
        node = node.left if key < node.data else node.right
    return None                              # fell off the tree: absent` },
  { lang: 'java', code: `Node search(Node node, int key) {
    while (node != null) {
        if (key == node.data) return node;   // found it
        node = key < node.data ? node.left    // answer is left
                               : node.right;  // answer is right
    }
    return null;                             // fell off the tree: absent
}` },
  { lang: 'go', code: `func search(node *Node, key int) *Node {
    for node != nil {
        if key == node.data {
            return node // found it
        }
        if key < node.data {
            node = node.left
        } else {
            node = node.right
        }
    }
    return nil // fell off the tree: absent
}` },
];

/** Trees — in-order traversal visits keys in sorted order. */
export const treeInorder: Snippet[] = [
  { lang: 'cpp', code: `void inorder(Node* node) {
    if (!node) return;
    inorder(node->left);            // everything smaller, first
    std::cout << node->data << ' '; // then this node
    inorder(node->right);           // then everything larger
}` },
  { lang: 'py', code: `def inorder(node):
    if not node:
        return
    inorder(node.left)          # everything smaller, first
    print(node.data, end=' ')   # then this node
    inorder(node.right)         # then everything larger` },
  { lang: 'java', code: `void inorder(Node node) {
    if (node == null) return;
    inorder(node.left);                // everything smaller, first
    System.out.print(node.data + " "); // then this node
    inorder(node.right);               // then everything larger
}` },
  { lang: 'go', code: `func inorder(node *Node) {
    if node == nil {
        return
    }
    inorder(node.left)        // everything smaller, first
    fmt.Print(node.data, " ") // then this node
    inorder(node.right)       // then everything larger
}` },
];
