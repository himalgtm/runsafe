// src/services/api.js
const base = import.meta.env.VITE_SERVER ?? "";

function isPlain(obj) {
  return obj && typeof obj === "object" &&
    !(obj instanceof FormData) &&
    !(obj instanceof Blob) &&
    !(obj instanceof ArrayBuffer);
}

export async function api(path, opts = {}) {
  const {
    token,
    headers = {},
    method = "GET",
    body,
    ...rest
  } = opts;

  const url = base ? `${base}${path}` : path;

  const h = { ...headers };
  let payload = body;

  // Only stringify *plain objects*. If the caller already passed a string,
  // leave it alone. (Prevents the \"Unexpected token '\\'\" error.)
  if (isPlain(body)) {
    h["Content-Type"] = h["Content-Type"] ?? "application/json";
    payload = JSON.stringify(body);
  }

  if (token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    body: payload,
    headers: h,
    credentials: "include",
    ...rest,
  });

  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json()).error?.message || msg; } catch { /* ignore */ }
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
