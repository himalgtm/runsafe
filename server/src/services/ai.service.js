// server/src/services/ai.service.js
import { cfChat } from './ai.providers.cloudflare.js';

export async function advice({ lat, lon, sensitivity } = {}) {
  const sens = sensitivity ? JSON.stringify(sensitivity) : 'none';
  const messages = [
    { role: 'system', content: 'You are RunSafe, a respiratory health coach. Be concise (≤120 words), actionable, calm. No medical diagnosis.' },
    { role: 'user', content: `Context: lat=${lat ?? 'n/a'}, lon=${lon ?? 'n/a'}, sensitivity=${sens}. Give today’s outdoor activity tips and mask/indoor alternatives if AQI is elevated.` },
  ];
  const text = await cfChat(messages);
  return { text };
}

export async function coach({ entries } = {}) {
  const last3 = Array.isArray(entries) ? entries.slice(-3) : [];
  const messages = [
    { role: 'system', content: 'You coach patients on managing symptoms around air quality. Focus on patterns and small habits. ≤120 words.' },
    { role: 'user', content: `Last entries (most recent last): ${JSON.stringify(last3)}. Offer 3 short suggestions tailored to these logs.` },
  ];
  const text = await cfChat(messages);
  return { text };
}

export async function weekly({ summary } = {}) {
  const messages = [
    { role: 'system', content: 'Summarize weekly exposure/symptoms for provider handoff. Use bullets. ≤130 words. No diagnosis.' },
    { role: 'user', content: `Weekly summary data: ${JSON.stringify(summary || {})}. Provide a short clinical-style note.` },
  ];
  const text = await cfChat(messages);
  return { text };
}

export default { advice, coach, weekly };
