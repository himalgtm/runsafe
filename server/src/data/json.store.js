import fs from 'fs';
const FILE = '/tmp/symptoms.json';

const ensureFile = () => {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ entries: [] }, null, 2));
  }
};

const read = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
};

const write = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

export function jsonStore() {
  return {
    async insertEntry(e) {
      const d = read();
      d.entries.push(e);
      write(d);
    },
    async listEntries() {
      return read().entries.sort((a, b) => new Date(a.ts) - new Date(b.ts));
    },
  };
}
