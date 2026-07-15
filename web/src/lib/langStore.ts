/**
 * A tiny cross-island store for the reader's chosen programming language.
 *
 * Astro renders each `client:` component as its own React root, so React
 * context can't span them. This shares one preference across every island on
 * the page (and across tabs) via localStorage + a window event, and exposes it
 * to React through useSyncExternalStore. SSR and first paint always use
 * DEFAULT_LANG, so there's no hydration mismatch; the stored choice applies on
 * hydration.
 */
import { useSyncExternalStore } from 'react';
import { DEFAULT_LANG, isLang, type Lang } from './languages';

const KEY = 'dsos-lang';
const EVENT = 'dsos-lang-change';

function read(): Lang {
  if (typeof localStorage === 'undefined') return DEFAULT_LANG;
  try {
    const v = localStorage.getItem(KEY);
    return isLang(v) ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

let current: Lang = read();

export function getLang(): Lang {
  return current;
}

export function setLang(l: Lang): void {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* private mode / disabled storage — in-memory only */
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENT));
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    current = read();
    cb();
  };
  window.addEventListener(EVENT, handler); // same-tab, other islands
  window.addEventListener('storage', handler); // other tabs
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** React hook: current language, reactive across all islands on the page. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => DEFAULT_LANG);
}
