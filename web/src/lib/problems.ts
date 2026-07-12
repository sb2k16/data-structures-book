/**
 * Original, systems-flavored practice problems for the in-page runner.
 * Never lifted from another site — the statements are ours and the harness is
 * plain C++ that prints one [PASS]/[FAIL] per case plus a [SUMMARY].
 *
 * `\\n` inside the harness strings is deliberate: the template literal must
 * carry a literal backslash-n into the C++ source, not a real newline.
 */
export interface Problem {
  starter: string;
  harness: string;
  /** Prepended before the solution; defaults to <bits/stdc++.h> + using namespace std. */
  prelude?: string;
}

export const twoSumOnePass: Problem = {
  starter: `vector<int> twoSum(vector<int>& nums, int target) {
    // The O(n^2) way is to check every pair. This chapter is about not doing that.
    // Walk the array once. For each nums[i], ask a hash table whether the
    // complement (target - nums[i]) has already been seen. If so, you're done.
    unordered_map<int, int> seen;   // value -> index

    // your code here

    return {};
}`,
  harness: `
static int _pass = 0, _tot = 0;
static string _vs(vector<int> v){ sort(v.begin(), v.end()); string s = "{"; for (size_t i = 0; i < v.size(); ++i){ if (i) s += ","; s += to_string(v[i]); } return s + "}"; }
static void _check(vector<int> got, vector<int> want){
  _tot++;
  if (_vs(got) == _vs(want)){ printf("[PASS] indices sum to target\\n"); _pass++; }
  else printf("[FAIL] got=%s  want=%s\\n", _vs(got).c_str(), _vs(want).c_str());
}
int main(){
  { vector<int> n = {2,7,11,15};  _check(twoSum(n, 9),  {0,1}); }
  { vector<int> n = {3,2,4};      _check(twoSum(n, 6),  {1,2}); }
  { vector<int> n = {3,3};        _check(twoSum(n, 6),  {0,1}); }
  { vector<int> n = {-3,4,3,90};  _check(twoSum(n, 0),  {0,2}); }
  { vector<int> n = {1,5,8,3,9,2}; _check(twoSum(n, 5), {3,5}); }
  printf("[SUMMARY] %d/%d\\n", _pass, _tot);
}`,
};

/** Arrays — Kadane's maximum subarray (the one-pass scan). */
export const maxSubarray: Problem = {
  starter: `int maxSubArray(vector<int>& nums) {
    // Kadane: as you scan, track the best sum ending at the current element,
    // and the best you've seen anywhere. One pass, O(n).
    int best = nums[0], here = nums[0];

    // your code here

    return best;
}`,
  harness: `
static int _p=0,_t=0;
static void _c(int got,int want){ _t++; if(got==want){printf("[PASS] max subarray sum\\n");_p++;} else printf("[FAIL] got=%d want=%d\\n",got,want); }
int main(){
  { vector<int> n={-2,1,-3,4,-1,2,1,-5,4}; _c(maxSubArray(n), 6); }
  { vector<int> n={1};                      _c(maxSubArray(n), 1); }
  { vector<int> n={5,4,-1,7,8};             _c(maxSubArray(n), 23); }
  { vector<int> n={-1,-2,-3};               _c(maxSubArray(n), -1); }
  printf("[SUMMARY] %d/%d\\n", _p, _t);
}`,
};

/** Stacks & queues — valid parentheses (the canonical stack problem). */
export const validParentheses: Problem = {
  starter: `bool isValid(string s) {
    // Push each opening bracket. On a closing one, the top of the stack must be
    // its matching opener — otherwise it's invalid. The stack must end empty.
    stack<char> st;

    // your code here

    return st.empty();
}`,
  harness: `
static int _p=0,_t=0;
static void _c(bool got,bool want){ _t++; if(got==want){printf("[PASS]\\n");_p++;} else printf("[FAIL] got=%d want=%d\\n",(int)got,(int)want); }
int main(){
  _c(isValid("()"),      true);
  _c(isValid("()[]{}"),  true);
  _c(isValid("(]"),      false);
  _c(isValid("([)]"),    false);
  _c(isValid("{[]}"),    true);
  _c(isValid(""),        true);
  _c(isValid("("),       false);
  printf("[SUMMARY] %d/%d\\n", _p, _t);
}`,
};

/** Linked lists — reverse a singly linked list (pointer rewiring). */
export const reverseList: Problem = {
  prelude: `#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(nullptr) {} };
`,
  starter: `ListNode* reverseList(ListNode* head) {
    // Walk the list, flipping each node's next pointer to point at the previous
    // node. Save 'next' before you overwrite it, or you lose the rest of the list.
    ListNode* prev = nullptr;

    // your code here

    return prev;
}`,
  harness: `
static int _p=0,_t=0;
static ListNode* _build(vector<int> v){ ListNode d(0); ListNode* c=&d; for(int x:v){ c->next=new ListNode(x); c=c->next; } return d.next; }
static vector<int> _collect(ListNode* h){ vector<int> v; while(h){ v.push_back(h->val); h=h->next; } return v; }
static string _vs(vector<int> v){ string s="["; for(size_t i=0;i<v.size();++i){ if(i)s+=","; s+=to_string(v[i]); } return s+"]"; }
static void _c(vector<int> in, vector<int> want){ _t++; vector<int> got=_collect(reverseList(_build(in))); if(got==want){printf("[PASS]\\n");_p++;} else printf("[FAIL] got=%s want=%s\\n",_vs(got).c_str(),_vs(want).c_str()); }
int main(){
  _c({1,2,3,4,5}, {5,4,3,2,1});
  _c({1,2},       {2,1});
  _c({},          {});
  _c({7},         {7});
  printf("[SUMMARY] %d/%d\\n", _p, _t);
}`,
};
