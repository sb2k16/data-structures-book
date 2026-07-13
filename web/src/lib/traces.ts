// Auto-generated from the AlgoTutor engine (algo-tutor/engine). One event per step;
// shipped as static data and animated client-side. Regenerate by re-running the engine.
export interface Step { step:number; type:string; message:string; state:Record<string,any>; highlight?:Record<string,any>; }
export const twoSumTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Find two numbers that sum to 9",
  "state": {
   "array": [
    2,
    7,
    11,
    15
   ],
   "map": {},
   "target": 9
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "At index 0, val=2, looking for complement=7 in map",
  "state": {
   "array": [
    2,
    7,
    11,
    15
   ],
   "complement": 7,
   "current_idx": 0,
   "current_val": 2,
   "map": {},
   "target": 9
  },
  "step": 2,
  "type": "check"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Complement not found. Store 2→0 in map",
  "state": {
   "array": [
    2,
    7,
    11,
    15
   ],
   "current_idx": 0,
   "current_val": 2,
   "map": {
    "2": 0
   },
   "target": 9
  },
  "step": 3,
  "type": "map_miss"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "At index 1, val=7, looking for complement=2 in map",
  "state": {
   "array": [
    2,
    7,
    11,
    15
   ],
   "complement": 2,
   "current_idx": 1,
   "current_val": 7,
   "map": {
    "2": 0
   },
   "target": 9
  },
  "step": 4,
  "type": "check"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Found! indices [0, 1] sum to 9",
  "state": {
   "array": [
    2,
    7,
    11,
    15
   ],
   "current_idx": 1,
   "map": {
    "2": 0
   },
   "result_indices": [
    0,
    1
   ],
   "target": 9
  },
  "step": 5,
  "type": "found"
 }
];
export const kadaneTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Kadane's: init with arr[0]=-2",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 0,
   "best_start": 0,
   "cur_start": 0,
   "current_index": 0,
   "current_sum": -2,
   "max_sum": -2
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "current_sum went negative; reset to arr[1]=1",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 0,
   "best_start": 0,
   "cur_start": 1,
   "current_index": 1,
   "current_sum": 1,
   "max_sum": -2
  },
  "step": 2,
  "type": "reset"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "New max_sum=1 [1..1]",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 1,
   "best_start": 1,
   "cur_start": 1,
   "current_index": 1,
   "current_sum": 1,
   "max_sum": 1
  },
  "step": 3,
  "type": "update_max"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[2]=-3 => -2",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 1,
   "best_start": 1,
   "cur_start": 1,
   "current_index": 2,
   "current_sum": -2,
   "max_sum": 1
  },
  "step": 4,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "current_sum went negative; reset to arr[3]=4",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 1,
   "best_start": 1,
   "cur_start": 3,
   "current_index": 3,
   "current_sum": 4,
   "max_sum": 1
  },
  "step": 5,
  "type": "reset"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "New max_sum=4 [3..3]",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 3,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 3,
   "current_sum": 4,
   "max_sum": 4
  },
  "step": 6,
  "type": "update_max"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[4]=-1 => 3",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 3,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 4,
   "current_sum": 3,
   "max_sum": 4
  },
  "step": 7,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[5]=2 => 5",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 3,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 5,
   "current_sum": 5,
   "max_sum": 4
  },
  "step": 8,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "New max_sum=5 [3..5]",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 5,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 5,
   "current_sum": 5,
   "max_sum": 5
  },
  "step": 9,
  "type": "update_max"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[6]=1 => 6",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 5,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 6,
   "current_sum": 6,
   "max_sum": 5
  },
  "step": 10,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "New max_sum=6 [3..6]",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 6,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 6,
   "current_sum": 6,
   "max_sum": 6
  },
  "step": 11,
  "type": "update_max"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[7]=-5 => 1",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 6,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 7,
   "current_sum": 1,
   "max_sum": 6
  },
  "step": 12,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Extend subarray: current_sum += arr[8]=4 => 5",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 6,
   "best_start": 3,
   "cur_start": 3,
   "current_index": 8,
   "current_sum": 5,
   "max_sum": 6
  },
  "step": 13,
  "type": "extend"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Maximum subarray sum = 6",
  "state": {
   "array": [
    -2,
    1,
    -3,
    4,
    -1,
    2,
    1,
    -5,
    4
   ],
   "best_end": 6,
   "best_start": 3,
   "current_sum": 5,
   "max_sum": 6
  },
  "step": 14,
  "type": "complete"
 }
];
export const parensTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Valid Parentheses: checking string '([{}])'",
  "state": {
   "current_index": -1,
   "s": "([{}])",
   "stack": [],
   "valid": true
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push '(' onto stack",
  "state": {
   "current_char": "(",
   "current_index": 0,
   "s": "([{}])",
   "stack": [
    "("
   ]
  },
  "step": 2,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push '[' onto stack",
  "state": {
   "current_char": "[",
   "current_index": 1,
   "s": "([{}])",
   "stack": [
    "(",
    "["
   ]
  },
  "step": 3,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push '{' onto stack",
  "state": {
   "current_char": "{",
   "current_index": 2,
   "s": "([{}])",
   "stack": [
    "(",
    "[",
    "{"
   ]
  },
  "step": 4,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop '{' matched '}'",
  "state": {
   "current_char": "}",
   "current_index": 3,
   "matched": "{",
   "s": "([{}])",
   "stack": [
    "(",
    "["
   ]
  },
  "step": 5,
  "type": "pop_match"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop '[' matched ']'",
  "state": {
   "current_char": "]",
   "current_index": 4,
   "matched": "[",
   "s": "([{}])",
   "stack": [
    "("
   ]
  },
  "step": 6,
  "type": "pop_match"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop '(' matched ')'",
  "state": {
   "current_char": ")",
   "current_index": 5,
   "matched": "(",
   "s": "([{}])",
   "stack": []
  },
  "step": 7,
  "type": "pop_match"
 },
 {
  "highlight": {
   "code_line": 6
  },
  "message": "String is VALID",
  "state": {
   "s": "([{}])",
   "stack": [],
   "valid": true
  },
  "step": 8,
  "type": "complete_valid"
 }
];
export const reverseTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Reversing linked list of length 4",
  "state": {
   "current_id": 0,
   "next_map": {
    "0": 1,
    "1": 2,
    "2": 3,
    "3": -1
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ],
   "prev_id": -1
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "prev->null current->0 next->1",
  "state": {
   "current_id": 0,
   "next_id": 1,
   "next_map": {
    "0": -1,
    "1": 2,
    "2": 3,
    "3": -1
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ],
   "prev_id": -1
  },
  "step": 2,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "prev->0 current->1 next->2",
  "state": {
   "current_id": 1,
   "next_id": 2,
   "next_map": {
    "0": -1,
    "1": 0,
    "2": 3,
    "3": -1
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ],
   "prev_id": 0
  },
  "step": 3,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "prev->1 current->2 next->3",
  "state": {
   "current_id": 2,
   "next_id": 3,
   "next_map": {
    "0": -1,
    "1": 0,
    "2": 1,
    "3": -1
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ],
   "prev_id": 1
  },
  "step": 4,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "prev->2 current->3 next->null",
  "state": {
   "current_id": 3,
   "next_id": -1,
   "next_map": {
    "0": -1,
    "1": 0,
    "2": 1,
    "3": 2
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ],
   "prev_id": 2
  },
  "step": 5,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "List reversed! New head: 3",
  "state": {
   "head_id": 3,
   "next_map": {
    "0": -1,
    "1": 0,
    "2": 1,
    "3": 2
   },
   "nodes": [
    {
     "id": 0,
     "val": 1
    },
    {
     "id": 1,
     "val": 2
    },
    {
     "id": 2,
     "val": 3
    },
    {
     "id": 3,
     "val": 4
    }
   ]
  },
  "step": 6,
  "type": "done"
 }
];
