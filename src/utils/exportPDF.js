export function exportTableToPDF(title, headers, rows) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; color: #1a2035; }
  h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #6a6d73; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f5f6f7; text-align: left; padding: 8px 12px; font-weight: 600; font-size: 10px;
       text-transform: uppercase; letter-spacing: 0.5px; color: #6a6d73; border-bottom: 2px solid #e5e5e5; }
  td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; color: #1a2035; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .badge-red { background: #ffeded; color: #b00; }
  .badge-green { background: #f1fdf6; color: #107e3e; }
  .badge-blue { background: #e5f0fb; color: #0a6ed1; }
  .footer { margin-top: 24px; font-size: 10px; color: #8a94a6; border-top: 1px solid #e5e5e5; padding-top: 12px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="subtitle">Bright Motors — SAP MM | Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>
  <div class="footer">This document was generated from Bright Motors SAP MM Reorder Planning system.</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
  }
}
