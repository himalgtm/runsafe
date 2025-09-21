// server/src/services/pdf.service.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import dayjs from 'dayjs';

const REPL = { '→':'->','–':'-','—':'-','•':'*','·':'*','’':"'",'‘':"'",'“':'"','”':'"','≥':'>=','≤':'<=','×':'x','©':'(c)','™':'(TM)','\u00A0':' ' };
const sanitize = s => String(s ?? '').replace(/[^\x20-\x7E]/g, ch => REPL[ch] ?? '?');

export async function weeklyPdf(summary = {}) {
  const r = summary.range ?? {};

  // Use provided dates or fallback to last 7 days
  const startDate = r.start ? new Date(r.start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const endDate   = r.end   ? new Date(r.end)   : new Date();

  const totals  = summary.totals ?? { cough: 0, wheeze: 0, breath: 0 };
  const entries = Array.isArray(summary.entries) ? summary.entries : [];

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // US Letter size
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 720; // start content below letterhead

  const safe = (t) => (t == null ? '' : String(t));

  const draw = (text, size = 12, options = {}) => {
    const { color = rgb(0, 0, 0), fontFace = font, indent = 0 } = options;
    page.drawText(safe(text), {
      x: 50 + indent,
      y,
      size,
      font: fontFace,
      color,
    });
    y -= size + 8;
  };

  // === Letterhead banner ===
  const { width, height } = page.getSize();
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: rgb(0.2, 0.4, 0.8),
  });

  // Medical "+" icon (top-right corner)
  const iconX = 550;
  const iconY = height - 55;
  const size = 20;
  const thickness = 6;

  page.drawRectangle({
    x: iconX - thickness / 2,
    y: iconY - size / 2,
    width: thickness,
    height: size,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: iconX - size / 2,
    y: iconY - thickness / 2,
    width: size,
    height: thickness,
    color: rgb(1, 1, 1),
  });

  // Heading text
  page.drawText('RunSafe Health Monitoring - Weekly Report', {
    x: 50,
    y: height - 50,
    size: 24,
    font: bold,
    color: rgb(1, 1, 1),
  });

  // page.drawText('Weekly Provider Summary Report', {
  //   x: 50,
  //   y: height - 70,
  //   size: 14,
  //   font,
  //   color: rgb(0.9, 0.9, 0.9),
  // });

  // === Report content ===
  draw(`${formatDateShort(startDate)} – ${formatDateShort(endDate)}`, 14, { color: rgb(0.3, 0.3, 0.3) });
  y -= 10;

  draw('Overall Totals', 16, { fontFace: bold, color: rgb(0, 0.4, 0.4) });
  draw(`Cough:   ${totals.cough}`, 12, { indent: 20 });
  draw(`Wheeze:  ${totals.wheeze}`, 12, { indent: 20 });
  draw(`Breath:  ${totals.breath}`, 12, { indent: 20 });
  y -= 10;

  draw('Recent Entries', 16, { fontFace: bold, color: rgb(0.4, 0.2, 0.4) });
  if (entries.length === 0) {
    draw('No entries recorded this week.', 12, { indent: 20, color: rgb(0.5, 0.5, 0.5) });
  } else {
    entries.slice(-8).forEach(e => {
      const ts = e?.ts ? formatDateTime(new Date(e.ts)) : '';
      const line = `- ${ts}   C:${e.cough}  W:${e.wheeze}  B:${e.breath}${e.note ? ' – ' + e.note : ''}`;
      draw(line, 12, { indent: 20, color: rgb(0.1, 0.1, 0.1) });
    });
  }

  y -= 20;
  draw('Prototype only; not medical advice.', 10, { color: rgb(0.6, 0, 0) });

  return pdf.save();
}

// === Helpers for clean date formatting ===
function formatDateShort(date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}