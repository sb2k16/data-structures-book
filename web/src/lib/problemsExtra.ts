import type { ProblemVariant } from './problems';
// Java + Go variants (Wandbox-verified). Merged into the ProblemSets in problems.ts.

export const twoSumJava: ProblemVariant = {
  compiler: 'openjdk-jdk-22+36',
  options: '',
  prelude: `import java.util.*;
class Solution {`,
  starter: `  // Return the indices of the two numbers that add up to target.
  public int[] twoSum(int[] nums, int target){
    // your code here
    return new int[]{0, 1};
  }`,
  harness: `}
class Main {
  static boolean check(int[] got, int[] exp){
    if(got==null||got.length!=2) return false;
    int[] g = got.clone(); Arrays.sort(g);
    int[] e = exp.clone(); Arrays.sort(e);
    return Arrays.equals(g,e);
  }
  public static void main(String[] a){
    Solution sol = new Solution();
    int[][] nums = {{2,7,11,15},{3,2,4},{3,3},{-3,4,3,90},{1,5,8,3,9,2}};
    int[] targets = {9,6,6,0,5};
    int[][] exp = {{0,1},{1,2},{0,1},{0,2},{3,5}};
    int pass=0;
    for(int i=0;i<nums.length;i++){
      int[] got = sol.twoSum(nums[i], targets[i]);
      if(check(got, exp[i])){ pass++; System.out.println("[PASS] indices sum to target"); }
      else System.out.println("[FAIL] got "+Arrays.toString(got));
    }
    System.out.println("[SUMMARY] "+pass+"/"+nums.length);
  }
}`,
};

export const twoSumGo: ProblemVariant = {
  compiler: 'go-1.23.2',
  options: '',
  prelude: `package main
import "fmt"`,
  starter: `// twoSum returns the indices of the two numbers in nums that add up to target.
func twoSum(nums []int, target int) []int {
  // your code here
  return []int{0, 1}
}`,
  harness: `func main(){
  nums := [][]int{{2,7,11,15},{3,2,4},{3,3},{-3,4,3,90},{1,5,8,3,9,2}}
  targets := []int{9,6,6,0,5}
  exp := [][]int{{0,1},{1,2},{0,1},{0,2},{3,5}}
  pass := 0
  for i := range nums {
    got := twoSum(nums[i], targets[i])
    ok := len(got)==2 && ((got[0]==exp[i][0]&&got[1]==exp[i][1])||(got[0]==exp[i][1]&&got[1]==exp[i][0]))
    if ok { pass++; fmt.Println("[PASS] indices sum to target") } else { fmt.Println("[FAIL] got", got) }
  }
  fmt.Printf("[SUMMARY] %d/%d\\n", pass, len(nums))
}`,
};

export const maxSubArrayJava: ProblemVariant = {
  compiler: 'openjdk-jdk-22+36',
  options: '',
  prelude: `import java.util.*;
class Solution {`,
  starter: `  // Return the largest sum of any contiguous subarray of nums.
  public int maxSubArray(int[] nums){
    // your code here
    return 0;
  }`,
  harness: `}
class Main {
  public static void main(String[] a){
    Solution sol = new Solution();
    int[][] nums = {{-2,1,-3,4,-1,2,1,-5,4},{1},{5,4,-1,7,8},{-1,-2,-3}};
    int[] exp = {6,1,23,-1};
    int pass=0;
    for(int i=0;i<nums.length;i++){
      int got = sol.maxSubArray(nums[i]);
      if(got==exp[i]){ pass++; System.out.println("[PASS] max sum "+got); }
      else System.out.println("[FAIL] got "+got+" expected "+exp[i]);
    }
    System.out.println("[SUMMARY] "+pass+"/"+nums.length);
  }
}`,
};

export const maxSubArrayGo: ProblemVariant = {
  compiler: 'go-1.23.2',
  options: '',
  prelude: `package main
import "fmt"`,
  starter: `// maxSubArray returns the largest sum of any contiguous subarray of nums.
func maxSubArray(nums []int) int {
  // your code here
  return 0
}`,
  harness: `func main(){
  nums := [][]int{{-2,1,-3,4,-1,2,1,-5,4},{1},{5,4,-1,7,8},{-1,-2,-3}}
  exp := []int{6,1,23,-1}
  pass := 0
  for i := range nums {
    got := maxSubArray(nums[i])
    if got==exp[i] { pass++; fmt.Println("[PASS] max sum", got) } else { fmt.Println("[FAIL] got", got, "expected", exp[i]) }
  }
  fmt.Printf("[SUMMARY] %d/%d\\n", pass, len(nums))
}`,
};

export const isValidJava: ProblemVariant = {
  compiler: 'openjdk-jdk-22+36',
  options: '',
  prelude: `import java.util.*;
class Solution {`,
  starter: `  // Return true if every bracket in s is correctly matched and nested.
  public boolean isValid(String s){
    // your code here
    return true;
  }`,
  harness: `}
class Main {
  public static void main(String[] a){
    Solution sol = new Solution();
    String[] tests = {"()","()[]{}","(]","([)]","{[]}","","("};
    boolean[] exp = {true,true,false,false,true,true,false};
    int pass=0;
    for(int i=0;i<tests.length;i++){
      boolean got = sol.isValid(tests[i]);
      if(got==exp[i]){ pass++; System.out.println("[PASS] \\""+tests[i]+"\\" -> "+got); }
      else System.out.println("[FAIL] \\""+tests[i]+"\\" got "+got+" expected "+exp[i]);
    }
    System.out.println("[SUMMARY] "+pass+"/"+tests.length);
  }
}`,
};

export const isValidGo: ProblemVariant = {
  compiler: 'go-1.23.2',
  options: '',
  prelude: `package main
import "fmt"`,
  starter: `// isValid returns true if every bracket in s is correctly matched and nested.
func isValid(s string) bool {
  // your code here
  return true
}`,
  harness: `func main(){
  tests := []string{"()","()[]{}","(]","([)]","{[]}","","("}
  exp := []bool{true,true,false,false,true,true,false}
  pass := 0
  for i := range tests {
    got := isValid(tests[i])
    if got==exp[i] { pass++; fmt.Printf("[PASS] %q -> %v\\n", tests[i], got) } else { fmt.Printf("[FAIL] %q got %v expected %v\\n", tests[i], got, exp[i]) }
  }
  fmt.Printf("[SUMMARY] %d/%d\\n", pass, len(tests))
}`,
};

export const reverseListJava: ProblemVariant = {
  compiler: 'openjdk-jdk-22+36',
  options: '',
  prelude: `import java.util.*;
class ListNode { int val; ListNode next; ListNode(int v){ val=v; } }
class Solution {`,
  starter: `  // Reverse the singly linked list and return the new head.
  public ListNode reverseList(ListNode head){
    // your code here
    return head;
  }`,
  harness: `}
class Main {
  static ListNode build(int[] arr){
    ListNode dummy = new ListNode(0); ListNode cur = dummy;
    for(int v : arr){ cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
  }
  static List<Integer> collect(ListNode h){
    List<Integer> r = new ArrayList<>();
    while(h!=null){ r.add(h.val); h = h.next; }
    return r;
  }
  public static void main(String[] a){
    Solution sol = new Solution();
    int[][] in = {{1,2,3,4,5},{1,2},{},{7}};
    int[][] out = {{5,4,3,2,1},{2,1},{},{7}};
    int pass=0;
    for(int i=0;i<in.length;i++){
      List<Integer> got = collect(sol.reverseList(build(in[i])));
      List<Integer> exp = new ArrayList<>(); for(int v : out[i]) exp.add(v);
      if(got.equals(exp)){ pass++; System.out.println("[PASS] reversed "+got); }
      else System.out.println("[FAIL] got "+got+" expected "+exp);
    }
    System.out.println("[SUMMARY] "+pass+"/"+in.length);
  }
}`,
};

export const reverseListGo: ProblemVariant = {
  compiler: 'go-1.23.2',
  options: '',
  prelude: `package main
import "fmt"
type ListNode struct {
  Val  int
  Next *ListNode
}`,
  starter: `// reverseList reverses the singly linked list and returns the new head.
func reverseList(head *ListNode) *ListNode {
  // your code here
  return head
}`,
  harness: `func build(arr []int) *ListNode {
  dummy := &ListNode{}
  cur := dummy
  for _, v := range arr {
    cur.Next = &ListNode{Val: v}
    cur = cur.Next
  }
  return dummy.Next
}
func collect(h *ListNode) []int {
  r := []int{}
  for h != nil {
    r = append(r, h.Val)
    h = h.Next
  }
  return r
}
func main(){
  in := [][]int{{1,2,3,4,5},{1,2},{},{7}}
  out := [][]int{{5,4,3,2,1},{2,1},{},{7}}
  pass := 0
  for i := range in {
    got := collect(reverseList(build(in[i])))
    ok := len(got)==len(out[i])
    if ok {
      for j := range got {
        if got[j]!=out[i][j] { ok = false }
      }
    }
    if ok { pass++; fmt.Println("[PASS] reversed", got) } else { fmt.Println("[FAIL] got", got, "expected", out[i]) }
  }
  fmt.Printf("[SUMMARY] %d/%d\\n", pass, len(in))
}`,
};
