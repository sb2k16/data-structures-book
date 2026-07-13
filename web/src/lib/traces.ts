// Auto-generated from AlgoTutor engine: --algorithm two_sum --input {array:[2,7,11,15],target:9}
// The engine (algo-tutor/engine) emits one event per step; we ship the trace as static data
// and animate it client-side. Regenerate by re-running the engine.
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
