/**
 * Original, systems-flavored practice problems for the in-page runner.
 * Never lifted from another site — the statements are ours.
 *
 * Each problem ships one variant per supported language. A variant is a
 * self-contained judge: prelude + the reader's solution + a harness that prints
 * one [PASS]/[FAIL] line per case plus a [SUMMARY] (the protocol CodeProblem
 * counts). Adding a language = adding a verified variant here; the component
 * and the parser don't change.
 *
 * C++ harnesses use `\\n` on purpose: the template literal must carry a literal
 * backslash-n into the C++ source (a printf format), not a real newline. Python
 * harnesses use real newlines and print(), so they read as ordinary source.
 */
import type { Lang } from './languages';
import {
  twoSumJava, twoSumGo, maxSubArrayJava, maxSubArrayGo,
  isValidJava, isValidGo, reverseListJava, reverseListGo,
} from './problemsExtra';

export interface ProblemVariant {
  compiler: string;
  options: string;
  /** Prepended before the solution (includes, helper types). */
  prelude: string;
  /** Editor starting content — the function stub the reader fills in. */
  starter: string;
  /** Appended after the solution: runs the tests and prints results. */
  harness: string;
}

export type ProblemSet = Partial<Record<Lang, ProblemVariant>>;

const CPP = { compiler: 'gcc-head', options: 'c++17', prelude: '#include <bits/stdc++.h>\nusing namespace std;\n' };
const PY = { compiler: 'cpython-3.13.8', options: '', prelude: '' };

/** Hash tables — two-sum in one pass. */
export const twoSumOnePass: ProblemSet = {
  java: twoSumJava,
  go: twoSumGo,
  cpp: {
    ...CPP,
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
  },
  py: {
    ...PY,
    starter: `def two_sum(nums, target):
    # The O(n^2) way is to check every pair. This chapter is about not doing that.
    # Walk the array once. For each nums[i], ask a dict whether the complement
    # (target - nums[i]) has already been seen. If so, you're done.
    seen = {}   # value -> index

    # your code here

    return []`,
    harness: `
_pass = _tot = 0
def _vs(v): return "{" + ",".join(str(x) for x in sorted(v or [])) + "}"
def _check(got, want):
    global _pass, _tot
    _tot += 1
    if _vs(got) == _vs(want):
        print("[PASS] indices sum to target"); _pass += 1
    else:
        print(f"[FAIL] got={_vs(got)}  want={_vs(want)}")
_check(two_sum([2,7,11,15], 9),  [0,1])
_check(two_sum([3,2,4], 6),      [1,2])
_check(two_sum([3,3], 6),        [0,1])
_check(two_sum([-3,4,3,90], 0),  [0,2])
_check(two_sum([1,5,8,3,9,2], 5),[3,5])
print(f"[SUMMARY] {_pass}/{_tot}")`,
  },
};

/** Arrays — Kadane's maximum subarray (the one-pass scan). */
export const maxSubarray: ProblemSet = {
  java: maxSubArrayJava,
  go: maxSubArrayGo,
  cpp: {
    ...CPP,
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
  },
  py: {
    ...PY,
    starter: `def max_subarray(nums):
    # Kadane: as you scan, track the best sum ending at the current element,
    # and the best you've seen anywhere. One pass, O(n).
    best = here = nums[0]

    # your code here

    return best`,
    harness: `
_p = _t = 0
def _c(got, want):
    global _p, _t
    _t += 1
    if got == want:
        print("[PASS] max subarray sum"); _p += 1
    else:
        print(f"[FAIL] got={got} want={want}")
_c(max_subarray([-2,1,-3,4,-1,2,1,-5,4]), 6)
_c(max_subarray([1]), 1)
_c(max_subarray([5,4,-1,7,8]), 23)
_c(max_subarray([-1,-2,-3]), -1)
print(f"[SUMMARY] {_p}/{_t}")`,
  },
};

/** Stacks & queues — valid parentheses (the canonical stack problem). */
export const validParentheses: ProblemSet = {
  java: isValidJava,
  go: isValidGo,
  cpp: {
    ...CPP,
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
  },
  py: {
    ...PY,
    starter: `def is_valid(s):
    # Push each opening bracket. On a closing one, the top of the stack must be
    # its matching opener — otherwise it's invalid. The stack must end empty.
    stack = []

    # your code here

    return not stack`,
    harness: `
_p = _t = 0
def _c(got, want):
    global _p, _t
    _t += 1
    if bool(got) == want:
        print("[PASS]"); _p += 1
    else:
        print(f"[FAIL] got={bool(got)} want={want}")
_c(is_valid("()"),     True)
_c(is_valid("()[]{}"), True)
_c(is_valid("(]"),     False)
_c(is_valid("([)]"),   False)
_c(is_valid("{[]}"),   True)
_c(is_valid(""),       True)
_c(is_valid("("),      False)
print(f"[SUMMARY] {_p}/{_t}")`,
  },
};

/** Linked lists — reverse a singly linked list (pointer rewiring). */
export const reverseList: ProblemSet = {
  java: reverseListJava,
  go: reverseListGo,
  cpp: {
    compiler: 'gcc-head',
    options: 'c++17',
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
  },
  py: {
    compiler: 'cpython-3.13.8',
    options: '',
    prelude: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
`,
    starter: `def reverse_list(head):
    # Walk the list, flipping each node's next pointer to point at the previous
    # node. Save 'next' before you overwrite it, or you lose the rest of the list.
    prev = None

    # your code here

    return prev`,
    harness: `
_p = _t = 0
def _build(v):
    dummy = ListNode(0); cur = dummy
    for x in v:
        cur.next = ListNode(x); cur = cur.next
    return dummy.next
def _collect(h):
    out = []
    while h:
        out.append(h.val); h = h.next
    return out
def _c(inp, want):
    global _p, _t
    _t += 1
    got = _collect(reverse_list(_build(inp)))
    if got == want:
        print("[PASS]"); _p += 1
    else:
        print(f"[FAIL] got={got} want={want}")
_c([1,2,3,4,5], [5,4,3,2,1])
_c([1,2],       [2,1])
_c([],          [])
_c([7],         [7])
print(f"[SUMMARY] {_p}/{_t}")`,
  },
};
