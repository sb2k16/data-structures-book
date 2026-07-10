import { useCallback, useEffect, useRef, useState } from 'react';
import type { BenchId, CacheLevel, WorkerOut } from '../../bench/memory.worker';

export interface BenchState<P> {
  points: P[];
  running: boolean;
  finished: boolean;
  progress: number;
  levels: CacheLevel[];
  error: string | null;
}

export function useBench<P>(bench: BenchId) {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<BenchState<P>>({
    points: [],
    running: false,
    finished: false,
    progress: 0,
    levels: [],
    error: null,
  });

  useEffect(() => () => workerRef.current?.terminate(), []);

  const run = useCallback(() => {
    workerRef.current?.terminate();
    setState({ points: [], running: true, finished: false, progress: 0, levels: [], error: null });

    const worker = new Worker(new URL('../../bench/memory.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerOut>) => {
      const msg = e.data;
      if (msg.bench !== bench) return;
      setState((s) => {
        switch (msg.type) {
          case 'point':
            return { ...s, points: [...s.points, msg.point as P] };
          case 'progress':
            return { ...s, progress: msg.done / msg.total };
          case 'done':
            return { ...s, running: false, finished: true, progress: 1, levels: msg.levels ?? [] };
          case 'error':
            return { ...s, running: false, error: msg.message };
        }
      });
      if (msg.type === 'done' || msg.type === 'error') worker.terminate();
    };

    worker.onerror = () => {
      setState((s) => ({ ...s, running: false, error: 'The benchmark worker failed to start.' }));
    };

    worker.postMessage({ bench });
  }, [bench]);

  return { ...state, run };
}
