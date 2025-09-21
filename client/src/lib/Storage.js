const KEY = "runsafe_diary";

export function loadDiary() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveDiary(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertEntry(entry) {
  const all = loadDiary();
  const i = all.findIndex(e => e.id === entry.id);
  if (i >= 0) all[i] = entry; else all.push(entry);
  saveDiary(all);
  return all;
}

export function deleteEntry(id) {
  const all = loadDiary().filter(e => e.id !== id);
  saveDiary(all);
  return all;
}
