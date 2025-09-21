// server/src/services/ai.providers.cloudflare.js
import { ENV } from '../config/env.js';

// Node 18+ has global fetch. If you need node-fetch, add import here.
// import fetch from 'node-fetch';

const CF_ACCOUNT_ID = ENV.CF_ACCOUNT_ID;
const CF_API_TOKEN  = ENV.CF_API_TOKEN;
const CF_MODEL_DEFAULT = ENV.CF_MODEL || '@cf/meta/llama-3.1-8b-instruct';

function must(v, name) {
  if (!v) throw new Error(`Missing ${name} in environment (.env)`);
  return v;
}

/**
 * Call Cloudflare Workers AI with a chat-like payload.
 * Falls back to a helpful message instead of crashing.
 */
export async function cfChat(messages, { model = CF_MODEL_DEFAULT } = {}) {
  const accountId = must(CF_ACCOUNT_ID, 'CF_ACCOUNT_ID');
  const token     = must(CF_API_TOKEN,  'CF_API_TOKEN');

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${encodeURIComponent(model)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || res.statusText || 'Workers AI error';
    // Don’t blow up the whole API during demo—surface a controlled error
    throw Object.assign(new Error(msg), { status: 502, code: 'AI_UPSTREAM' });
  }

  // Support the shapes CF models return
  const out = data?.result?.response
           ?? data?.result?.output_text
           ?? data?.result;

  return typeof out === 'string' ? out : JSON.stringify(out ?? {});
}