interface Props {
  running: boolean;
  finished: boolean;
  progress: number;
  onRun: () => void;
  label?: string;
  seconds?: number;
}

export default function RunButton({ running, finished, progress, onRun, label = 'Run it on your machine', seconds }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onRun}
        disabled={running}
        className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {running ? 'Measuring…' : finished ? 'Run again' : label}
      </button>

      {running && (
        <div className="flex items-center gap-2.5">
          <div className="h-1 w-32 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${Math.round(progress * 100)}%`, background: 'var(--accent)' }}
            />
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {!running && !finished && seconds && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          takes about {seconds}s · nothing leaves your browser
        </span>
      )}
    </div>
  );
}
