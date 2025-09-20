export const num = (v, d=undefined) => Number.isFinite(Number(v)) ? Number(v) : d;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
