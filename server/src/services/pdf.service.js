import { PDFDocument, StandardFonts } from 'pdf-lib';
import dayjs from 'dayjs';

export async function weeklyPdf(entries) {
  const to = dayjs();
  const from = to.subtract(7, 'day');

  const week = entries.filter(e => dayjs(e.ts).isAfter(from));
  const totals = week.reduce(
    (a, e) => ({ c: a.c + (e.cough || 0), w: a.w + (e.wheeze || 0), b: a.b + (e.breath || 0) }),
    { c: 0, w: 0, b: 0 }
  );

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const draw = (text, y) => page.drawText(text, { x: 50, y, size: 12, font });

  let y = 740;
  draw('RunSafe Weekly Provider Summary', y);        y -= 24;
  draw(`Range: ${from.toISOString()} → ${to.toISOString()}`, y); y -= 18;
  draw(`Totals — Cough:${totals.c}  Wheeze:${totals.w}  Breath:${totals.b}`, y); y -= 24;

  week.slice(-28).forEach(e => {
    draw(`${e.ts}  c:${e.cough} w:${e.wheeze} b:${e.breath}${e.note ? ` - ${e.note}` : ''}`, y);
    y -= 16;
  });

  return pdf.save(); // Uint8Array
}
