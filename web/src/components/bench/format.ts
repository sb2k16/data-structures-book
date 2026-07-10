export function formatBytes(b: number): string {
  if (b >= 1024 * 1024 * 1024) return `${(b / (1024 * 1024 * 1024)).toFixed(b % (1 << 30) ? 1 : 0)} GiB`;
  if (b >= 1024 * 1024) {
    const v = b / (1024 * 1024);
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)} MiB`;
  }
  if (b >= 1024) {
    const v = b / 1024;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)} KiB`;
  }
  return `${b} B`;
}

export function formatNs(ns: number): string {
  if (ns >= 100) return ns.toFixed(0);
  if (ns >= 10) return ns.toFixed(1);
  return ns.toFixed(2);
}

/** "13x slower" — the sentence a reader repeats to a colleague. */
export function ratio(a: number, b: number): string {
  const r = a / b;
  return r >= 10 ? `${Math.round(r)}×` : `${r.toFixed(1)}×`;
}
