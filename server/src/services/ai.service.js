// server/src/services/ai.service.js
import { cfChat } from './ai.providers.cloudflare.js';

// ---------- implementations ----------
async function adviceImpl({ lat, lon, sensitivity } = {}) {
  const sens = sensitivity ? JSON.stringify(sensitivity) : 'none';
  const messages = [
    { role: 'system', content: 'You are RunSafe, a respiratory health coach. Be concise (≤120 words), actionable, and non-judgmental. No diagnosis.' },
    { role: 'user', content: `Context: lat=${lat ?? 'n/a'}, lon=${lon ?? 'n/a'}, sensitivity=${sens}. Give today’s outdoor tips; propose mask/indoor alternatives if AQI is elevated.` },
  ];
  const text = await cfChat(messages).catch(e => `AI unavailable: ${e.message || e}`);
  return { text };
}

async function coachImpl({ entries } = {}) {
  const last3 = Array.isArray(entries) ? entries.slice(-3) : [];
  const messages = [
    { role: 'system', content: 'You coach patients on managing respiratory symptoms around air quality. Focus on patterns and small habits. ≤120 words.' },
    { role: 'user', content: `Last entries (most recent last): ${JSON.stringify(last3)}. Offer 3 short, tailored suggestions.` },
  ];
  const text = await cfChat(messages).catch(e => `AI unavailable: ${e.message || e}`);
  return { text };
}

async function weeklyNarrativeImpl({ summary } = {}) {
  const messages = [
    { role: 'system', content: 'Summarize weekly exposure/symptoms for a provider handoff. Use bullets. ≤130 words. No diagnosis.' },
    { role: 'user', content: `Weekly summary data: ${JSON.stringify(summary || {})}. Provide a short clinical-style note with symptom trends and exposure context.` },
  ];
  const text = await cfChat(messages).catch(e => `AI unavailable: ${e.message || e}`);
  return { text };
}

// ---------- exports (match controller imports) ----------
export const advice = adviceImpl;
export const coach = coachImpl;
export const weeklyNarrative = weeklyNarrativeImpl;

// Aliases expected by ai.controller.js:
export const aiAdvice = adviceImpl;
export const aiCoach = coachImpl;
export const aiWeeklyNarrative = weeklyNarrativeImpl;

// Optional default export
export default {
  advice,
  coach,
  weeklyNarrative,
  aiAdvice,
  aiCoach,
  aiWeeklyNarrative,
};
