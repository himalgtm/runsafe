// server/src/services/pdf.service.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import dayjs from 'dayjs';

const REPL = { '→':'->','–':'-','—':'-','•':'*','·':'*','’':"'",'‘':"'",'“':'"','”':'"','≥':'>=','≤':'<=','×':'x','©':'(c)','™':'(TM)','\u00A0':' ' };
const sanitize = s => String(s ?? '').replace(/[^\x20-\x7E]/g, ch => REPL[ch] ?? '?');

export async function weeklyPdf(summary = {}) {
  const r = summary.range ?? {};
  const start = r.start ?? r.from ?? dayjs().subtract(7,'day').format('YYYY-MM-DD');
  const end   = r.end   ?? r.to   ?? dayjs().format('YYYY-MM-DD');

  const totals  = summary.totals ?? { cough: 0, wheeze: 0, breath: 0 };
  const entries = Array.isArray(summary.entries) ? summary.entries : [];

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = 760;

  const draw = (text, size = 12) => { page.drawText(sanitize(text), { x: 50, y, size, font, color: rgb(0,0,0) }); y -= size + 8; };

  draw('RunSafe: Weekly Provider Summary', 18);
  draw(`${start} - ${end}`);
  draw(`Totals: cough ${totals.cough}  wheeze ${totals.wheeze}  breath ${totals.breath}`);
  draw('Recent entries:');
  entries.slice(-8).forEach(e => {
    const ts = e?.ts ? String(e.ts).slice(0,19) : '';
    draw(`- ${ts}  c:${e.cough} w:${e.wheeze} b:${e.breath}${e.note ? ' - ' + e.note : ''}`);
  });
  draw('Prototype only; not medical advice.', 10);

  return pdf.save();
}
