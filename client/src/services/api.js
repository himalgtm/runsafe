// Works with either direct base (VITE_SERVER) or Vite proxy (base == "")
const base = import.meta.env.VITE_SERVER ?? "";

export async function api(path, { token, ...opts } = {}) {
  const url = base ? `${base}${path}` : path;
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await get(url, {
    credentials: "include",
    ...opts,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
