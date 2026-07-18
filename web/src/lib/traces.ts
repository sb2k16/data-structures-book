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

export const bstTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Starting insert(65). Current tree has 7 nodes.",
  "state": {
   "current_id": -1,
   "op": "insert",
   "path": [],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 1,
  "type": "start_op"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 65 with node 50 (id=0).",
  "state": {
   "current_id": 0,
   "op": "insert",
   "path": [
    0
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 2,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "65 >= 50 — go right from node 0.",
  "state": {
   "current_id": 0,
   "op": "insert",
   "path": [
    0
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 3,
  "type": "go_right"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 65 with node 70 (id=2).",
  "state": {
   "current_id": 2,
   "op": "insert",
   "path": [
    0,
    2
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 4,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "65 < 70 — go left from node 2.",
  "state": {
   "current_id": 2,
   "op": "insert",
   "path": [
    0,
    2
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 5,
  "type": "go_left"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 65 with node 60 (id=5).",
  "state": {
   "current_id": 5,
   "op": "insert",
   "path": [
    0,
    2,
    5
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 6,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "65 >= 60 — go right from node 5.",
  "state": {
   "current_id": 5,
   "op": "insert",
   "path": [
    0,
    2,
    5
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": -1,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    }
   ]
  },
  "step": 7,
  "type": "go_right"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Inserted 65 as right child of node 60 (id=7).",
  "state": {
   "current_id": 7,
   "op": "insert",
   "path": [
    0,
    2,
    5,
    7
   ],
   "root": 0,
   "target": 65,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 8,
  "type": "inserted"
 },
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Starting search(40). Current tree has 8 nodes.",
  "state": {
   "current_id": -1,
   "op": "search",
   "path": [],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 9,
  "type": "start_op"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 40 with node 50 (id=0).",
  "state": {
   "current_id": 0,
   "op": "search",
   "path": [
    0
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 10,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "40 < 50 — go left from node 0.",
  "state": {
   "current_id": 0,
   "op": "search",
   "path": [
    0
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 11,
  "type": "go_left"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 40 with node 30 (id=1).",
  "state": {
   "current_id": 1,
   "op": "search",
   "path": [
    0,
    1
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 12,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "40 > 30 — go right from node 1.",
  "state": {
   "current_id": 1,
   "op": "search",
   "path": [
    0,
    1
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 13,
  "type": "go_right"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Compare 40 with node 40 (id=4).",
  "state": {
   "current_id": 4,
   "op": "search",
   "path": [
    0,
    1,
    4
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 14,
  "type": "compare"
 },
 {
  "highlight": {
   "code_line": 5
  },
  "message": "Found 40 at node id=4!",
  "state": {
   "current_id": 4,
   "op": "search",
   "path": [
    0,
    1,
    4
   ],
   "root": 0,
   "target": 40,
   "tree": [
    {
     "id": 0,
     "left": 1,
     "right": 2,
     "val": 50
    },
    {
     "id": 1,
     "left": 3,
     "right": 4,
     "val": 30
    },
    {
     "id": 2,
     "left": 5,
     "right": 6,
     "val": 70
    },
    {
     "id": 3,
     "left": -1,
     "right": -1,
     "val": 20
    },
    {
     "id": 4,
     "left": -1,
     "right": -1,
     "val": 40
    },
    {
     "id": 5,
     "left": -1,
     "right": 7,
     "val": 60
    },
    {
     "id": 6,
     "left": -1,
     "right": -1,
     "val": 80
    },
    {
     "id": 7,
     "left": -1,
     "right": -1,
     "val": 65
    }
   ]
  },
  "step": 15,
  "type": "found"
 }
];
export const binarySearchTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Binary search for target=13 in sorted array of size 9. Initialize lo=0, hi=8.",
  "state": {
   "array": [
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17
   ],
   "hi": 8,
   "lo": 0,
   "mid": -1,
   "result": -1,
   "target": 13
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "lo=0 hi=8 mid=4 → arr[mid]=9 vs target=13.",
  "state": {
   "array": [
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17
   ],
   "hi": 8,
   "lo": 0,
   "mid": 4,
   "result": -1,
   "target": 13
  },
  "step": 2,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "lo=5 hi=8 mid=6 → arr[mid]=13 vs target=13.",
  "state": {
   "array": [
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17
   ],
   "hi": 8,
   "lo": 5,
   "mid": 6,
   "result": -1,
   "target": 13
  },
  "step": 3,
  "type": "step"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "arr[6]=13 == target=13. Found at index 6!",
  "state": {
   "array": [
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17
   ],
   "hi": 8,
   "lo": 5,
   "mid": 6,
   "result": 6,
   "target": 13
  },
  "step": 4,
  "type": "found"
 }
];

export const bfsTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Starting BFS from node 0. We explore neighbors level by level using a queue.",
  "state": {
   "distances": {
    "0": -1,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [],
   "source": 0,
   "visited": []
  },
  "step": 1,
  "type": "start"
 },
 {
  "highlight": {
   "code_line": 1,
   "highlight_node": 0
  },
  "message": "Enqueue source node 0 with distance 0.",
  "state": {
   "distances": {
    "0": 0,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 0,
   "parent": {
    "0": -1,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [
    0
   ],
   "visited": [
    0
   ]
  },
  "step": 2,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 0
  },
  "message": "Dequeue and visit node 0 (distance=0).",
  "state": {
   "current": 0,
   "distances": {
    "0": 0,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [],
   "visited": [
    0
   ]
  },
  "step": 3,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 3,
   "highlight_edge": [
    0,
    1
   ],
   "highlight_node": 1
  },
  "message": "Neighbor 1 is unvisited. Enqueue with distance 1.",
  "state": {
   "current": 0,
   "distances": {
    "0": 0,
    "1": 1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 1,
   "parent": {
    "0": -1,
    "1": 0,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [
    1
   ],
   "visited": [
    0,
    1
   ]
  },
  "step": 4,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 3,
   "highlight_edge": [
    0,
    2
   ],
   "highlight_node": 2
  },
  "message": "Neighbor 2 is unvisited. Enqueue with distance 1.",
  "state": {
   "current": 0,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 2,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [
    1,
    2
   ],
   "visited": [
    0,
    1,
    2
   ]
  },
  "step": 5,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 1
  },
  "message": "Dequeue and visit node 1 (distance=1).",
  "state": {
   "current": 1,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [
    2
   ],
   "visited": [
    0,
    1,
    2
   ]
  },
  "step": 6,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    1,
    0
   ],
   "highlight_node": 0
  },
  "message": "Neighbor 0 already visited (distance=0). Skipping.",
  "state": {
   "current": 1,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 0,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": -1,
    "4": -1,
    "5": -1
   },
   "queue": [
    2
   ],
   "visited": [
    0,
    1,
    2
   ]
  },
  "step": 7,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 3,
   "highlight_edge": [
    1,
    3
   ],
   "highlight_node": 3
  },
  "message": "Neighbor 3 is unvisited. Enqueue with distance 2.",
  "state": {
   "current": 1,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 3,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": -1,
    "5": -1
   },
   "queue": [
    2,
    3
   ],
   "visited": [
    0,
    1,
    2,
    3
   ]
  },
  "step": 8,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 2
  },
  "message": "Dequeue and visit node 2 (distance=1).",
  "state": {
   "current": 2,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": -1,
    "5": -1
   },
   "queue": [
    3
   ],
   "visited": [
    0,
    1,
    2,
    3
   ]
  },
  "step": 9,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    2,
    0
   ],
   "highlight_node": 0
  },
  "message": "Neighbor 0 already visited (distance=0). Skipping.",
  "state": {
   "current": 2,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 0,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": -1,
    "5": -1
   },
   "queue": [
    3
   ],
   "visited": [
    0,
    1,
    2,
    3
   ]
  },
  "step": 10,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    2,
    3
   ],
   "highlight_node": 3
  },
  "message": "Neighbor 3 already visited (distance=2). Skipping.",
  "state": {
   "current": 2,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": -1,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 3,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": -1,
    "5": -1
   },
   "queue": [
    3
   ],
   "visited": [
    0,
    1,
    2,
    3
   ]
  },
  "step": 11,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 3,
   "highlight_edge": [
    2,
    4
   ],
   "highlight_node": 4
  },
  "message": "Neighbor 4 is unvisited. Enqueue with distance 2.",
  "state": {
   "current": 2,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 4,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": -1
   },
   "queue": [
    3,
    4
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4
   ]
  },
  "step": 12,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 3
  },
  "message": "Dequeue and visit node 3 (distance=2).",
  "state": {
   "current": 3,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": -1
   },
   "queue": [
    4
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4
   ]
  },
  "step": 13,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    3,
    1
   ],
   "highlight_node": 1
  },
  "message": "Neighbor 1 already visited (distance=1). Skipping.",
  "state": {
   "current": 3,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 1,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": -1
   },
   "queue": [
    4
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4
   ]
  },
  "step": 14,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    3,
    2
   ],
   "highlight_node": 2
  },
  "message": "Neighbor 2 already visited (distance=1). Skipping.",
  "state": {
   "current": 3,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 2,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": -1
   },
   "queue": [
    4
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4
   ]
  },
  "step": 15,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 3,
   "highlight_edge": [
    3,
    5
   ],
   "highlight_node": 5
  },
  "message": "Neighbor 5 is unvisited. Enqueue with distance 3.",
  "state": {
   "current": 3,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "node": 5,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [
    4,
    5
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 16,
  "type": "enqueue"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 4
  },
  "message": "Dequeue and visit node 4 (distance=2).",
  "state": {
   "current": 4,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [
    5
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 17,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    4,
    2
   ],
   "highlight_node": 2
  },
  "message": "Neighbor 2 already visited (distance=1). Skipping.",
  "state": {
   "current": 4,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 2,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [
    5
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 18,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    4,
    5
   ],
   "highlight_node": 5
  },
  "message": "Neighbor 5 already visited (distance=3). Skipping.",
  "state": {
   "current": 4,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 5,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [
    5
   ],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 19,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 2,
   "highlight_node": 5
  },
  "message": "Dequeue and visit node 5 (distance=3).",
  "state": {
   "current": 5,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 20,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    5,
    3
   ],
   "highlight_node": 3
  },
  "message": "Neighbor 3 already visited (distance=2). Skipping.",
  "state": {
   "current": 5,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 3,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 21,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 4,
   "highlight_edge": [
    5,
    4
   ],
   "highlight_node": 4
  },
  "message": "Neighbor 4 already visited (distance=2). Skipping.",
  "state": {
   "current": 5,
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 4,
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 22,
  "type": "skip_visited"
 },
 {
  "highlight": {
   "code_line": 5
  },
  "message": "BFS complete! Visited 6 nodes. All shortest distances from node 0 computed.",
  "state": {
   "distances": {
    "0": 0,
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 3
   },
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "parent": {
    "0": -1,
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3
   },
   "queue": [],
   "visited": [
    0,
    1,
    2,
    3,
    4,
    5
   ]
  },
  "step": 23,
  "type": "complete"
 }
];

export const dfsTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Starting DFS from node 0",
  "state": {
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "source": 0
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 0 onto stack",
  "state": {
   "current": 0,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    0
   ],
   "visited": []
  },
  "step": 2,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 0",
  "state": {
   "current": 0,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [],
   "visited": [
    0
   ]
  },
  "step": 3,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 0→1",
  "state": {
   "current": 0,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 1,
   "stack": [],
   "visited": [
    0
   ]
  },
  "step": 4,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 1 onto stack",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    1
   ],
   "visited": [
    0
   ]
  },
  "step": 5,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 0→2",
  "state": {
   "current": 0,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 2,
   "stack": [
    1
   ],
   "visited": [
    0
   ]
  },
  "step": 6,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 2 onto stack",
  "state": {
   "current": 2,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    2,
    1
   ],
   "visited": [
    0
   ]
  },
  "step": 7,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 2",
  "state": {
   "current": 2,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 8,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 0 already visited, skipping",
  "state": {
   "current": 2,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 0,
   "stack": [
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 9,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 2→3",
  "state": {
   "current": 2,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 3,
   "stack": [
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 10,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 3 onto stack",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 11,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 2→4",
  "state": {
   "current": 2,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 4,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 12,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 4 onto stack",
  "state": {
   "current": 4,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    4,
    3,
    1
   ],
   "visited": [
    0,
    2
   ]
  },
  "step": 13,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 4",
  "state": {
   "current": 4,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4
   ]
  },
  "step": 14,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 2 already visited, skipping",
  "state": {
   "current": 4,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 2,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4
   ]
  },
  "step": 15,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 4→5",
  "state": {
   "current": 4,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 5,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4
   ]
  },
  "step": 16,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 5 onto stack",
  "state": {
   "current": 5,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    5,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4
   ]
  },
  "step": 17,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 5",
  "state": {
   "current": 5,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5
   ]
  },
  "step": 18,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 5→3",
  "state": {
   "current": 5,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 3,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5
   ]
  },
  "step": 19,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 3 onto stack",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5
   ]
  },
  "step": 20,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 4 already visited, skipping",
  "state": {
   "current": 5,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 4,
   "stack": [
    3,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5
   ]
  },
  "step": 21,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 3",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3
   ]
  },
  "step": 22,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Exploring edge 3→1",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 1,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3
   ]
  },
  "step": 23,
  "type": "explore"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Pushing node 1 onto stack",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    1,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3
   ]
  },
  "step": 24,
  "type": "push"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 2 already visited, skipping",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 2,
   "stack": [
    1,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3
   ]
  },
  "step": 25,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 5 already visited, skipping",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 5,
   "stack": [
    1,
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3
   ]
  },
  "step": 26,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Visiting node 1",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 27,
  "type": "visit"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 0 already visited, skipping",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 0,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 28,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 3 already visited, skipping",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "neighbor": 3,
   "stack": [
    3,
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 29,
  "type": "already_visited"
 },
 {
  "highlight": {
   "code_line": 5
  },
  "message": "Backtracking from node 3 (already visited)",
  "state": {
   "current": 3,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [
    1
   ],
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 30,
  "type": "backtrack"
 },
 {
  "highlight": {
   "code_line": 5
  },
  "message": "Backtracking from node 1 (already visited)",
  "state": {
   "current": 1,
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "stack": [],
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 31,
  "type": "backtrack"
 },
 {
  "highlight": {
   "code_line": 6
  },
  "message": "DFS complete. Visited order: [0,2,4,5,3,1]",
  "state": {
   "graph": {
    "edges": [
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      3
     ],
     [
      2,
      3
     ],
     [
      2,
      4
     ],
     [
      3,
      5
     ],
     [
      4,
      5
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4,
     5
    ]
   },
   "visited": [
    0,
    2,
    4,
    5,
    3,
    1
   ]
  },
  "step": 32,
  "type": "complete"
 }
];

export const dijkstraTrace: Step[] = [
 {
  "highlight": {
   "code_line": 0
  },
  "message": "Dijkstra's algorithm from source=0. All distances initialized to infinity (-1).",
  "state": {
   "current": -1,
   "dist": {
    "0": 0,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [],
   "relaxing_edge": null,
   "source": 0,
   "visited": []
  },
  "step": 1,
  "type": "init"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push source node 0 with dist=0 onto priority queue.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 0,
     "node": 0
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": []
  },
  "step": 2,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 0 (dist=0) from priority queue.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [],
   "relaxing_edge": null,
   "source": 0,
   "visited": []
  },
  "step": 3,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 0→1 (weight=4). New dist[1]=4.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": 4,
    "2": -1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [],
   "relaxing_edge": {
    "u": 0,
    "v": 1,
    "w": 4
   },
   "source": 0,
   "visited": [
    0
   ]
  },
  "step": 4,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 1 with dist=4 onto priority queue.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": 4,
    "2": -1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    }
   ],
   "relaxing_edge": {
    "u": 0,
    "v": 1,
    "w": 4
   },
   "source": 0,
   "visited": [
    0
   ]
  },
  "step": 5,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 0→2 (weight=1). New dist[2]=1.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": 4,
    "2": 1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    }
   ],
   "relaxing_edge": {
    "u": 0,
    "v": 2,
    "w": 1
   },
   "source": 0,
   "visited": [
    0
   ]
  },
  "step": 6,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 2 with dist=1 onto priority queue.",
  "state": {
   "current": 0,
   "dist": {
    "0": 0,
    "1": 4,
    "2": 1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 1,
     "node": 2
    }
   ],
   "relaxing_edge": {
    "u": 0,
    "v": 2,
    "w": 1
   },
   "source": 0,
   "visited": [
    0
   ]
  },
  "step": 7,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 2 (dist=1) from priority queue.",
  "state": {
   "current": 2,
   "dist": {
    "0": 0,
    "1": 4,
    "2": 1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0
   ]
  },
  "step": 8,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 2→1 (weight=2). New dist[1]=3.",
  "state": {
   "current": 2,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    }
   ],
   "relaxing_edge": {
    "u": 2,
    "v": 1,
    "w": 2
   },
   "source": 0,
   "visited": [
    0,
    2
   ]
  },
  "step": 9,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 1 with dist=3 onto priority queue.",
  "state": {
   "current": 2,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": -1,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 3,
     "node": 1
    }
   ],
   "relaxing_edge": {
    "u": 2,
    "v": 1,
    "w": 2
   },
   "source": 0,
   "visited": [
    0,
    2
   ]
  },
  "step": 10,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 2→3 (weight=5). New dist[3]=6.",
  "state": {
   "current": 2,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 6,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 3,
     "node": 1
    }
   ],
   "relaxing_edge": {
    "u": 2,
    "v": 3,
    "w": 5
   },
   "source": 0,
   "visited": [
    0,
    2
   ]
  },
  "step": 11,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 3 with dist=6 onto priority queue.",
  "state": {
   "current": 2,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 6,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 3,
     "node": 1
    },
    {
     "dist": 6,
     "node": 3
    }
   ],
   "relaxing_edge": {
    "u": 2,
    "v": 3,
    "w": 5
   },
   "source": 0,
   "visited": [
    0,
    2
   ]
  },
  "step": 12,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 1 (dist=3) from priority queue.",
  "state": {
   "current": 1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 6,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 6,
     "node": 3
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2
   ]
  },
  "step": 13,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 1→3 (weight=1). New dist[3]=4.",
  "state": {
   "current": 1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 6,
     "node": 3
    }
   ],
   "relaxing_edge": {
    "u": 1,
    "v": 3,
    "w": 1
   },
   "source": 0,
   "visited": [
    0,
    2,
    1
   ]
  },
  "step": 14,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 3 with dist=4 onto priority queue.",
  "state": {
   "current": 1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 4,
     "node": 1
    },
    {
     "dist": 6,
     "node": 3
    },
    {
     "dist": 4,
     "node": 3
    }
   ],
   "relaxing_edge": {
    "u": 1,
    "v": 3,
    "w": 1
   },
   "source": 0,
   "visited": [
    0,
    2,
    1
   ]
  },
  "step": 15,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 1 (dist=4) from priority queue.",
  "state": {
   "current": 1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 6,
     "node": 3
    },
    {
     "dist": 4,
     "node": 3
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1
   ]
  },
  "step": 16,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 1 already finalized. Skip stale entry.",
  "state": {
   "current": 1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 6,
     "node": 3
    },
    {
     "dist": 4,
     "node": 3
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1
   ]
  },
  "step": 17,
  "type": "skip"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 3 (dist=4) from priority queue.",
  "state": {
   "current": 3,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": -1
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 6,
     "node": 3
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1
   ]
  },
  "step": 18,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 3
  },
  "message": "Relax edge 3→4 (weight=3). New dist[4]=7.",
  "state": {
   "current": 3,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 6,
     "node": 3
    }
   ],
   "relaxing_edge": {
    "u": 3,
    "v": 4,
    "w": 3
   },
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3
   ]
  },
  "step": 19,
  "type": "relax"
 },
 {
  "highlight": {
   "code_line": 1
  },
  "message": "Push node 4 with dist=7 onto priority queue.",
  "state": {
   "current": 3,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 6,
     "node": 3
    },
    {
     "dist": 7,
     "node": 4
    }
   ],
   "relaxing_edge": {
    "u": 3,
    "v": 4,
    "w": 3
   },
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3
   ]
  },
  "step": 20,
  "type": "push_pq"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 3 (dist=6) from priority queue.",
  "state": {
   "current": 3,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 7,
     "node": 4
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3
   ]
  },
  "step": 21,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 4
  },
  "message": "Node 3 already finalized. Skip stale entry.",
  "state": {
   "current": 3,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [
    {
     "dist": 7,
     "node": 4
    }
   ],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3
   ]
  },
  "step": 22,
  "type": "skip"
 },
 {
  "highlight": {
   "code_line": 2
  },
  "message": "Pop node 4 (dist=7) from priority queue.",
  "state": {
   "current": 4,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3
   ]
  },
  "step": 23,
  "type": "pop_pq"
 },
 {
  "highlight": {
   "code_line": 5
  },
  "message": "Dijkstra complete! All 5 nodes processed. Shortest distances from source=0 computed.",
  "state": {
   "current": -1,
   "dist": {
    "0": 0,
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 7
   },
   "graph": {
    "edges": [
     [
      0,
      1,
      4
     ],
     [
      0,
      2,
      1
     ],
     [
      2,
      1,
      2
     ],
     [
      1,
      3,
      1
     ],
     [
      2,
      3,
      5
     ],
     [
      3,
      4,
      3
     ]
    ],
    "nodes": [
     0,
     1,
     2,
     3,
     4
    ]
   },
   "pq": [],
   "relaxing_edge": null,
   "source": 0,
   "visited": [
    0,
    2,
    1,
    3,
    4
   ]
  },
  "step": 24,
  "type": "complete"
 }
];
