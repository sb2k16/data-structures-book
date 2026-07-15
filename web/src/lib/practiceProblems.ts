// Auto-generated end-of-book practice problems for "Data Structures on Systems".
// Each problem is verified on Wandbox in cpp / py / java / go.
// Judge protocol: fullProgram = prelude + "\n" + solutionCode + "\n" + harness + "\n"
// The reader edits ONLY `starter` (the solutionCode); a correct edit passes every case.

export interface LangSpec {
  compiler: string;
  options: string;
  prelude: string;
  starter: string;
  harness: string;
}

export interface ProblemSet {
  cpp: LangSpec;
  py: LangSpec;
  java: LangSpec;
  go: LangSpec;
}

export interface Problem {
  id: string;
  title: string;
  blurb: string;
  concept: string;
  languages: ProblemSet;
}

export const practiceProblems: Problem[] = [
  // ====================================================================
  {
    id: "sumArray",
    title: "Sum an Array",
    blurb: "Return the sum of all integers in the array (an empty array sums to 0).",
    concept: "Arrays - a single linear pass over a contiguous sequence (Chapter: Arrays)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\n",
        starter: "int sumArray(vector<int>& a) {\n    // Hint: keep a running total as you walk the array.\n    return 0; // your code here\n}",
        harness: "void check(const string& n,int got,int want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;vector<int>a1={1,2,3};check(\"t1\",sumArray(a1),6,p,t);vector<int>a2={};check(\"t2\",sumArray(a2),0,p,t);vector<int>a3={-1,1};check(\"t3\",sumArray(a3),0,p,t);vector<int>a4={5};check(\"t4\",sumArray(a4),5,p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "",
        starter: "def sum_array(a):\n    # Hint: keep a running total as you walk the array.\n    return 0  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',sum_array([1,2,3]),6)\ncheck('t2',sum_array([]),0)\ncheck('t3',sum_array([-1,1]),0)\ncheck('t4',sum_array([5]),5)\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass Solution {",
        starter: "    int sumArray(int[] a) {\n        // Hint: keep a running total as you walk the array.\n        return 0; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static void check(String n,int got,int want){t++;if(got==want){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.sumArray(new int[]{1,2,3}),6);\n        check(\"t2\",sol.sumArray(new int[]{}),0);\n        check(\"t3\",sol.sumArray(new int[]{-1,1}),0);\n        check(\"t4\",sol.sumArray(new int[]{5}),5);\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"",
        starter: "func sumArray(a []int) int {\n    // Hint: keep a running total as you walk the array.\n    return 0 // your code here\n}",
        harness: "var p, t int\nfunc check(n string, got, want int) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%d want=%d\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", sumArray([]int{1,2,3}), 6)\n    check(\"t2\", sumArray([]int{}), 0)\n    check(\"t3\", sumArray([]int{-1,1}), 0)\n    check(\"t4\", sumArray([]int{5}), 5)\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "reverseString",
    title: "Reverse a String",
    blurb: "Return a new string with the characters of the input in reverse order.",
    concept: "Strings - a string is an indexable sequence of characters (Chapter: Strings)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\n",
        starter: "string reverseString(string s) {\n    // Hint: build the result from the last character back to the first.\n    return s; // your code here\n}",
        harness: "void check(const string& n,const string& got,const string& want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;check(\"t1\",reverseString(\"abc\"),\"cba\",p,t);check(\"t2\",reverseString(\"\"),\"\",p,t);check(\"t3\",reverseString(\"a\"),\"a\",p,t);check(\"t4\",reverseString(\"hello\"),\"olleh\",p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "",
        starter: "def reverse_string(s):\n    # Hint: Python can slice a sequence in reverse.\n    return s  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',reverse_string('abc'),'cba')\ncheck('t2',reverse_string(''),'')\ncheck('t3',reverse_string('a'),'a')\ncheck('t4',reverse_string('hello'),'olleh')\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass Solution {",
        starter: "    String reverseString(String s) {\n        // Hint: build the result from the last character back to the first.\n        return s; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static void check(String n,String got,String want){t++;if(got.equals(want)){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.reverseString(\"abc\"),\"cba\");\n        check(\"t2\",sol.reverseString(\"\"),\"\");\n        check(\"t3\",sol.reverseString(\"a\"),\"a\");\n        check(\"t4\",sol.reverseString(\"hello\"),\"olleh\");\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"",
        starter: "func reverseString(s string) string {\n    // Hint: swap characters from the two ends toward the middle.\n    return s // your code here\n}",
        harness: "var p, t int\nfunc check(n, got, want string) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%q want=%q\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", reverseString(\"abc\"), \"cba\")\n    check(\"t2\", reverseString(\"\"), \"\")\n    check(\"t3\", reverseString(\"a\"), \"a\")\n    check(\"t4\", reverseString(\"hello\"), \"olleh\")\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "hasDuplicate",
    title: "Contains a Duplicate",
    blurb: "Return true if any value appears more than once in the array, otherwise false.",
    concept: "Hash sets - O(1) membership testing to spot a repeat in one pass (Chapter: Hash Tables & Sets)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\n",
        starter: "bool hasDuplicate(vector<int>& a) {\n    // Hint: remember values you have already seen in a set.\n    return false; // your code here\n}",
        harness: "void check(const string& n,bool got,bool want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;vector<int>a1={1,2,3};check(\"t1\",hasDuplicate(a1),false,p,t);vector<int>a2={1,2,2};check(\"t2\",hasDuplicate(a2),true,p,t);vector<int>a3={};check(\"t3\",hasDuplicate(a3),false,p,t);vector<int>a4={7,7};check(\"t4\",hasDuplicate(a4),true,p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "",
        starter: "def has_duplicate(a):\n    # Hint: a set stores each value only once.\n    return False  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',has_duplicate([1,2,3]),False)\ncheck('t2',has_duplicate([1,2,2]),True)\ncheck('t3',has_duplicate([]),False)\ncheck('t4',has_duplicate([7,7]),True)\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass Solution {",
        starter: "    boolean hasDuplicate(int[] a) {\n        // Hint: remember values you have already seen in a set.\n        return false; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static void check(String n,boolean got,boolean want){t++;if(got==want){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.hasDuplicate(new int[]{1,2,3}),false);\n        check(\"t2\",sol.hasDuplicate(new int[]{1,2,2}),true);\n        check(\"t3\",sol.hasDuplicate(new int[]{}),false);\n        check(\"t4\",sol.hasDuplicate(new int[]{7,7}),true);\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"",
        starter: "func hasDuplicate(a []int) bool {\n    // Hint: a map can remember values you have already seen.\n    return false // your code here\n}",
        harness: "var p, t int\nfunc check(n string, got, want bool) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%v want=%v\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", hasDuplicate([]int{1,2,3}), false)\n    check(\"t2\", hasDuplicate([]int{1,2,2}), true)\n    check(\"t3\", hasDuplicate([]int{}), false)\n    check(\"t4\", hasDuplicate([]int{7,7}), true)\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "binarySearch",
    title: "Binary Search",
    blurb: "Given an ascending-sorted array, return the index of target, or -1 if it is absent.",
    concept: "Searching & complexity - halve the range each step for O(log n) lookup (Chapter: Complexity & Searching)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\n",
        starter: "int binarySearch(vector<int>& a, int target) {\n    // Hint: compare target to the middle and discard half each step.\n    return -1; // your code here\n}",
        harness: "void check(const string& n,int got,int want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;vector<int>a1={1,3,5,7};check(\"t1\",binarySearch(a1,5),2,p,t);vector<int>a2={1,3,5,7};check(\"t2\",binarySearch(a2,4),-1,p,t);vector<int>a3={};check(\"t3\",binarySearch(a3,1),-1,p,t);vector<int>a4={2};check(\"t4\",binarySearch(a4,2),0,p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "",
        starter: "def binary_search(a, target):\n    # Hint: compare target to the middle and discard half each step.\n    return -1  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',binary_search([1,3,5,7],5),2)\ncheck('t2',binary_search([1,3,5,7],4),-1)\ncheck('t3',binary_search([],1),-1)\ncheck('t4',binary_search([2],2),0)\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass Solution {",
        starter: "    int binarySearch(int[] a, int target) {\n        // Hint: compare target to the middle and discard half each step.\n        return -1; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static void check(String n,int got,int want){t++;if(got==want){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.binarySearch(new int[]{1,3,5,7},5),2);\n        check(\"t2\",sol.binarySearch(new int[]{1,3,5,7},4),-1);\n        check(\"t3\",sol.binarySearch(new int[]{},1),-1);\n        check(\"t4\",sol.binarySearch(new int[]{2},2),0);\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"",
        starter: "func binarySearch(a []int, target int) int {\n    // Hint: compare target to the middle and discard half each step.\n    return -1 // your code here\n}",
        harness: "var p, t int\nfunc check(n string, got, want int) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%d want=%d\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", binarySearch([]int{1,3,5,7}, 5), 2)\n    check(\"t2\", binarySearch([]int{1,3,5,7}, 4), -1)\n    check(\"t3\", binarySearch([]int{}, 1), -1)\n    check(\"t4\", binarySearch([]int{2}, 2), 0)\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "listLength",
    title: "Length of a Linked List",
    blurb: "Count the number of nodes in a singly linked list (an empty list has length 0).",
    concept: "Linked lists - follow next pointers until you reach the end (Chapter: Linked Lists)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\nstruct ListNode { int val; ListNode* next; ListNode(int v): val(v), next(nullptr) {} };\n",
        starter: "int listLength(ListNode* head) {\n    // Hint: walk head->next until it is null, counting nodes.\n    return 0; // your code here\n}",
        harness: "ListNode* build(vector<int> v){ListNode* h=nullptr;ListNode* t=nullptr;for(int x:v){ListNode* nd=new ListNode(x);if(!h){h=t=nd;}else{t->next=nd;t=nd;}}return h;}\nvoid check(const string& n,int got,int want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;check(\"t1\",listLength(build({1,2,3})),3,p,t);check(\"t2\",listLength(build({})),0,p,t);check(\"t3\",listLength(build({9})),1,p,t);check(\"t4\",listLength(build({4,5,6,7})),4,p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n",
        starter: "def list_length(head):\n    # Hint: follow head.next until it is None, counting nodes.\n    return 0  # your code here",
        harness: "def build(vals):\n    head = None\n    for x in reversed(vals):\n        head = ListNode(x, head)\n    return head\nS={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',list_length(build([1,2,3])),3)\ncheck('t2',list_length(build([])),0)\ncheck('t3',list_length(build([9])),1)\ncheck('t4',list_length(build([4,5,6,7])),4)\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass ListNode { int val; ListNode next; ListNode(int v){ val = v; } }\nclass Solution {",
        starter: "    int listLength(ListNode head) {\n        // Hint: follow head.next until it is null, counting nodes.\n        return 0; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static ListNode build(int[] v){ListNode h=null;for(int i=v.length-1;i>=0;i--){ListNode nd=new ListNode(v[i]);nd.next=h;h=nd;}return h;}\n    static void check(String n,int got,int want){t++;if(got==want){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.listLength(build(new int[]{1,2,3})),3);\n        check(\"t2\",sol.listLength(build(new int[]{})),0);\n        check(\"t3\",sol.listLength(build(new int[]{9})),1);\n        check(\"t4\",sol.listLength(build(new int[]{4,5,6,7})),4);\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"\ntype ListNode struct { val int; next *ListNode }",
        starter: "func listLength(head *ListNode) int {\n    // Hint: follow head.next until it is nil, counting nodes.\n    return 0 // your code here\n}",
        harness: "func build(vals []int) *ListNode {\n    var head *ListNode\n    for i := len(vals) - 1; i >= 0; i-- {\n        head = &ListNode{val: vals[i], next: head}\n    }\n    return head\n}\nvar p, t int\nfunc check(n string, got, want int) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%d want=%d\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", listLength(build([]int{1,2,3})), 3)\n    check(\"t2\", listLength(build([]int{})), 0)\n    check(\"t3\", listLength(build([]int{9})), 1)\n    check(\"t4\", listLength(build([]int{4,5,6,7})), 4)\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "treeSum",
    title: "Sum of a Binary Tree",
    blurb: "Return the sum of every node's value in a binary tree (an empty tree sums to 0).",
    concept: "Trees - recursion over value + left subtree + right subtree (Chapter: Trees)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\nstruct TreeNode { int val; TreeNode* left; TreeNode* right; TreeNode(int v): val(v), left(nullptr), right(nullptr) {} };\n",
        starter: "int treeSum(TreeNode* root) {\n    // Hint: a node's total is its value plus the totals of both subtrees.\n    return 0; // your code here\n}",
        harness: "void check(const string& n,int got,int want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else cout<<\"[FAIL] \"<<n<<\" got=\"<<got<<\" want=\"<<want<<\"\\n\";}\nint main(){int p=0,t=0;check(\"t1\",treeSum(nullptr),0,p,t);TreeNode* a=new TreeNode(5);check(\"t2\",treeSum(a),5,p,t);TreeNode* b=new TreeNode(1);b->left=new TreeNode(2);b->right=new TreeNode(3);check(\"t3\",treeSum(b),6,p,t);TreeNode* c=new TreeNode(10);c->left=new TreeNode(5);c->left->left=new TreeNode(1);c->left->right=new TreeNode(2);c->right=new TreeNode(20);check(\"t4\",treeSum(c),38,p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n",
        starter: "def tree_sum(root):\n    # Hint: a node's total is its value plus the totals of both subtrees.\n    return 0  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if got==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',tree_sum(None),0)\ncheck('t2',tree_sum(TreeNode(5)),5)\ncheck('t3',tree_sum(TreeNode(1,TreeNode(2),TreeNode(3))),6)\ncheck('t4',tree_sum(TreeNode(10,TreeNode(5,TreeNode(1),TreeNode(2)),TreeNode(20))),38)\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }\nclass Solution {",
        starter: "    int treeSum(TreeNode root) {\n        // Hint: a node's total is its value plus the totals of both subtrees.\n        return 0; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static TreeNode node(int v,TreeNode l,TreeNode r){TreeNode n=new TreeNode(v);n.left=l;n.right=r;return n;}\n    static void check(String n,int got,int want){t++;if(got==want){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+got+\" want=\"+want);}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.treeSum(null),0);\n        check(\"t2\",sol.treeSum(node(5,null,null)),5);\n        check(\"t3\",sol.treeSum(node(1,node(2,null,null),node(3,null,null))),6);\n        check(\"t4\",sol.treeSum(node(10,node(5,node(1,null,null),node(2,null,null)),node(20,null,null))),38);\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"\ntype TreeNode struct { val int; left, right *TreeNode }",
        starter: "func treeSum(root *TreeNode) int {\n    // Hint: a node's total is its value plus the totals of both subtrees.\n    return 0 // your code here\n}",
        harness: "func node(v int, l, r *TreeNode) *TreeNode { return &TreeNode{val: v, left: l, right: r} }\nvar p, t int\nfunc check(n string, got, want int) {\n    t++\n    if got == want {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%d want=%d\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", treeSum(nil), 0)\n    check(\"t2\", treeSum(node(5, nil, nil)), 5)\n    check(\"t3\", treeSum(node(1, node(2, nil, nil), node(3, nil, nil))), 6)\n    check(\"t4\", treeSum(node(10, node(5, node(1, nil, nil), node(2, nil, nil)), node(20, nil, nil))), 38)\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
  // ====================================================================
  {
    id: "sortAscending",
    title: "Sort Ascending",
    blurb: "Return a new array holding the same integers ordered from smallest to largest.",
    concept: "Sorting - produce a non-decreasing ordering of the elements (Chapter: Sorting)",
    languages: {
      cpp: {
        compiler: "gcc-head",
        options: "c++17",
        prelude: "#include <bits/stdc++.h>\nusing namespace std;\n",
        starter: "vector<int> sortAscending(vector<int> a) {\n    // Hint: repeatedly place the smallest remaining element next.\n    return a; // your code here\n}",
        harness: "void check(const string& n,vector<int> got,vector<int> want,int& p,int& t){t++;if(got==want){p++;cout<<\"[PASS]\\n\";}else{cout<<\"[FAIL] \"<<n<<\" got=[\";for(size_t i=0;i<got.size();i++)cout<<got[i]<<(i+1<got.size()?\",\":\"\");cout<<\"]\\n\";}}\nint main(){int p=0,t=0;check(\"t1\",sortAscending({3,1,2}),{1,2,3},p,t);check(\"t2\",sortAscending({}),{},p,t);check(\"t3\",sortAscending({1}),{1},p,t);check(\"t4\",sortAscending({5,4,4}),{4,4,5},p,t);cout<<\"[SUMMARY] \"<<p<<\"/\"<<t<<\"\\n\";}",
      },
      py: {
        compiler: "cpython-3.13.8",
        options: "",
        prelude: "",
        starter: "def sort_ascending(a):\n    # Hint: Python has a built-in that returns a sorted list.\n    return a  # your code here",
        harness: "S={'p':0,'t':0}\ndef check(n,got,want):\n    S['t']+=1\n    if list(got)==want:\n        S['p']+=1; print('[PASS]')\n    else:\n        print('[FAIL] %s got=%r want=%r'%(n,got,want))\ncheck('t1',sort_ascending([3,1,2]),[1,2,3])\ncheck('t2',sort_ascending([]),[])\ncheck('t3',sort_ascending([1]),[1])\ncheck('t4',sort_ascending([5,4,4]),[4,4,5])\nprint('[SUMMARY] %d/%d'%(S['p'],S['t']))",
      },
      java: {
        compiler: "openjdk-jdk-22+36",
        options: "",
        prelude: "import java.util.*;\nclass Solution {",
        starter: "    int[] sortAscending(int[] a) {\n        // Hint: repeatedly place the smallest remaining element next.\n        return a; // your code here\n    }",
        harness: "}\nclass Main {\n    static int p=0,t=0;\n    static void check(String n,int[] got,int[] want){t++;if(Arrays.equals(got,want)){p++;System.out.println(\"[PASS]\");}else System.out.println(\"[FAIL] \"+n+\" got=\"+Arrays.toString(got));}\n    public static void main(String[] a){\n        Solution sol=new Solution();\n        check(\"t1\",sol.sortAscending(new int[]{3,1,2}),new int[]{1,2,3});\n        check(\"t2\",sol.sortAscending(new int[]{}),new int[]{});\n        check(\"t3\",sol.sortAscending(new int[]{1}),new int[]{1});\n        check(\"t4\",sol.sortAscending(new int[]{5,4,4}),new int[]{4,4,5});\n        System.out.println(\"[SUMMARY] \"+p+\"/\"+t);\n    }\n}",
      },
      go: {
        compiler: "go-1.23.2",
        options: "",
        prelude: "package main\nimport \"fmt\"",
        starter: "func sortAscending(a []int) []int {\n    // Hint: repeatedly place the smallest remaining element next.\n    return a // your code here\n}",
        harness: "func eq(x, y []int) bool {\n    if len(x) != len(y) {\n        return false\n    }\n    for i := range x {\n        if x[i] != y[i] {\n            return false\n        }\n    }\n    return true\n}\nvar p, t int\nfunc check(n string, got, want []int) {\n    t++\n    if eq(got, want) {\n        p++\n        fmt.Println(\"[PASS]\")\n    } else {\n        fmt.Printf(\"[FAIL] %s got=%v want=%v\\n\", n, got, want)\n    }\n}\nfunc main() {\n    check(\"t1\", sortAscending([]int{3,1,2}), []int{1,2,3})\n    check(\"t2\", sortAscending([]int{}), []int{})\n    check(\"t3\", sortAscending([]int{1}), []int{1})\n    check(\"t4\", sortAscending([]int{5,4,4}), []int{4,4,5})\n    fmt.Printf(\"[SUMMARY] %d/%d\\n\", p, t)\n}",
      },
    },
  },
];
