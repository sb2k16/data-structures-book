import { useMemo, useState } from 'react';

/**
 * An in-page coding problem: the reader writes a C++ function, hits Run, and it
 * is compiled and judged against tests entirely from the browser — no backend.
 *
 * Execution: the editor's code is wrapped (prelude + solution + test harness)
 * into one program and POSTed to Wandbox, a public compiler service that allows
 * cross-origin calls. The harness is plain C++ that prints one [PASS]/[FAIL]
 * line per case plus a [SUMMARY]; this component just counts them.
 *
 * This is the free-tier taste of the practice loop; the full adaptive problem
 * set and AI coaching live behind Codexa. Problems here are original and
 * systems-flavored — never lifted from another site.
 */

interface TestLine {
  ok: boolean;
  detail: string;
}

interface Props {
  /** Editor starting content — the function stub the reader fills in. */
  starter: string;
  /** C++ appended after the solution: a main() that runs tests and prints results. */
  harness: string;
  /** Prepended before the solution (includes etc.). */
  prelude?: string;
  rows?: number;
}

const DEFAULT_PRELUDE = '#include <bits/stdc++.h>\nusing namespace std;\n';

type Status = 'idle' | 'running' | 'done' | 'error';

export default function CppProblem({ starter, harness, prelude = DEFAULT_PRELUDE, rows = 10 }: Props) {
  const [code, setCode] = useState(starter);
  const [status, setStatus] = useState<Status>('idle');
  const [tests, setTests] = useState<TestLine[]>([]);
  const [summary, setSummary] = useState<{ pass: number; total: number } | null>(null);
  const [compileError, setCompileError] = useState('');
  const [runtime, setRuntime] = useState('');

  const passedAll = summary !== null && summary.pass === summary.total && summary.total > 0;

  async function run() {
    setStatus('running');
    setTests([]);
    setSummary(null);
    setCompileError('');
    setRuntime('');

    const program = `${prelude}\n${code}\n${harness}\n`;
    try {
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler: 'gcc-head', options: 'c++17', code: program }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`compiler service returned ${res.status}`);
      const data = (await res.json()) as {
        compiler_error?: string;
        program_output?: string;
        program_error?: string;
      };

      if (data.compiler_error && data.compiler_error.trim()) {
        // Strip the noisy wrapper line numbers; keep it readable.
        setCompileError(data.compiler_error.trim());
        setStatus('error');
        return;
      }

      const out = data.program_output ?? '';
      const parsed: TestLine[] = [];
      let pass = 0;
      let total = 0;
      let sum: { pass: number; total: number } | null = null;
      for (const line of out.split('\n')) {
        const s = line.trim();
        if (s.startsWith('[PASS]')) {
          parsed.push({ ok: true, detail: s.slice(6).trim() });
          pass++;
          total++;
        } else if (s.startsWith('[FAIL]')) {
          parsed.push({ ok: false, detail: s.slice(6).trim() });
          total++;
        } else if (s.startsWith('[SUMMARY]')) {
          const m = s.match(/(\d+)\s*\/\s*(\d+)/);
          if (m) sum = { pass: Number(m[1]), total: Number(m[2]) };
        }
      }
      if (data.program_error && data.program_error.trim() && total === 0) {
        setRuntime(data.program_error.trim());
        setStatus('error');
        return;
      }
      setTests(parsed);
      setSummary(sum ?? { pass, total });
      setStatus('done');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setRuntime(/timeout|abort/i.test(msg) ? 'The run timed out. Try again.' : `Could not reach the compiler: ${msg}`);
      setStatus('error');
    }
  }

  const lineCount = useMemo(() => code.split('\n').length, [code]);

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-xl border"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Try it · C++
        </span>
        <button
          onClick={() => { setCode(starter); setStatus('idle'); setTests([]); setSummary(null); setCompileError(''); setRuntime(''); }}
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Reset
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          // Insert two spaces on Tab instead of leaving the editor.
          if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.currentTarget;
            const s = el.selectionStart;
            const next = code.slice(0, s) + '  ' + code.slice(el.selectionEnd);
            setCode(next);
            requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
          }
        }}
        spellCheck={false}
        rows={Math.max(rows, lineCount + 1)}
        className="block w-full resize-y border-0 px-4 py-3 font-mono text-[13px] leading-relaxed outline-none"
        style={{ background: 'var(--surface-1)', color: 'var(--text-primary)', tabSize: 2 }}
        aria-label="C++ solution editor"
      />

      <div className="flex flex-wrap items-center gap-3 border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={run}
          disabled={status === 'running'}
          className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {status === 'running' ? 'Compiling…' : 'Run tests'}
        </button>
        {status === 'running' && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            compiling your C++ on a public compiler service…
          </span>
        )}
        {summary && status === 'done' && (
          <span
            className="rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums"
            style={{
              color: passedAll ? 'var(--series-2)' : 'var(--series-6, #e34948)',
              background: passedAll
                ? 'color-mix(in srgb, var(--series-2) 14%, transparent)'
                : 'color-mix(in srgb, #e34948 14%, transparent)',
            }}
          >
            {passedAll ? '✓ All tests passed' : `${summary.pass}/${summary.total} passed`}
          </span>
        )}
      </div>

      {(tests.length > 0 || compileError || runtime) && (
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          {compileError && (
            <>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Compile error
              </div>
              <pre className="overflow-x-auto rounded-md p-3 text-xs leading-relaxed" style={{ background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>{compileError}</pre>
            </>
          )}
          {runtime && !compileError && (
            <pre className="overflow-x-auto rounded-md p-3 text-xs leading-relaxed" style={{ background: 'var(--surface-1)', color: 'var(--text-secondary)' }}>{runtime}</pre>
          )}
          {tests.length > 0 && (
            <ul className="space-y-1.5">
              {tests.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: t.ok ? 'var(--series-2)' : '#e34948' }}>{t.ok ? '✓' : '✗'}</span>
                  <span style={{ color: 'var(--text-secondary)' }} className="font-mono text-[12.5px]">
                    {t.detail || `test ${i + 1}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
