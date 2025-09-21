const BASE = import.meta.env.VITE_API_BASE;

async function request(path, { method = 'GET', headers = {}, body, responseType = 'json' } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // safe for future auth/cookies
  });

  // PDF or other binary
  if (responseType === 'blob') {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.blob();
  }

  // JSON
  let data;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const msg = data?.message || res.statusText || 'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export const http = {
  get: (p, opts) => request(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => request(p, { ...opts, method: 'POST', body }),
};
