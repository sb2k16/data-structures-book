/**
 * Programming languages the in-page runner and (later) prose snippets can show.
 * Compiler IDs are Wandbox's (https://wandbox.org/api/list.json) — the same
 * public, CORS-open service the C++ judge already uses. Pin exact IDs here;
 * they drift over time.
 */
export type Lang = 'cpp' | 'py' | 'java' | 'go';

export interface LangMeta {
  id: Lang;
  label: string;
  /** Wandbox compiler id. */
  compiler: string;
  /** Wandbox compiler options string (empty when none). */
  options: string;
}

export const LANGUAGES: Record<Lang, LangMeta> = {
  cpp: { id: 'cpp', label: 'C++', compiler: 'gcc-head', options: 'c++17' },
  py: { id: 'py', label: 'Python', compiler: 'cpython-3.13.8', options: '' },
  // Wired in Phase 3 — registered here so the type and UI are ready.
  java: { id: 'java', label: 'Java', compiler: 'openjdk-jdk-22+36', options: '' },
  go: { id: 'go', label: 'Go', compiler: 'go-1.23.2', options: '' },
};

/** Preference order for tab display. */
export const LANG_ORDER: Lang[] = ['cpp', 'py', 'java', 'go'];

/** The book's identity is C++; that's the default until the reader chooses. */
export const DEFAULT_LANG: Lang = 'cpp';

export function isLang(v: unknown): v is Lang {
  return v === 'cpp' || v === 'py' || v === 'java' || v === 'go';
}
