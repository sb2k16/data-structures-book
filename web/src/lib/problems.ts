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
