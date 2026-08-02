import { getDownloadSchools } from '@/lib/queries';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const block = searchParams.get('block');

  if (!state || !district) {
    return new Response('Missing state or district parameter', { status: 400 });
  }

  try {
    const schools = await getDownloadSchools(state, district, block);

    const locationName = block
      ? `${block.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Block, ${district.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`
      : `${district.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} District`;

    const stateName = state.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const totalSchools = schools.length;

    const rows = schools.map((s, i) => `
      <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
        <td class="sno">${i + 1}</td>
        <td class="udise">${s.udise_code || ''}</td>
        <td class="name">${s.school_name || ''}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>School List PDF — ${locationName} (${stateName}) | SchoolsPedia</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }

    .header {
      background: linear-gradient(135deg, #1E40AF 0%, #0D9488 100%);
      color: white;
      padding: 18px 24px 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header h1 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .header p  { font-size: 11px; opacity: 0.85; }
    .header-right { text-align: right; font-size: 10px; opacity: 0.85; }
    .header-badge {
      background: rgba(255,255,255,0.2);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      margin-top: 6px;
      display: inline-block;
    }

    .meta {
      background: #F0FDF4;
      border-bottom: 2px solid #86EFAC;
      padding: 8px 24px;
      display: flex;
      gap: 24px;
      font-size: 10.5px;
      color: #166534;
    }
    .meta span { font-weight: 700; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    thead tr {
      background: #1E40AF;
      color: white;
    }
    thead th {
      padding: 7px 8px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    tbody tr.even { background: #F8FAFC; }
    tbody tr.odd  { background: #FFFFFF; }
    tbody tr:hover { background: #EFF6FF; }
    tbody td {
      padding: 5px 8px;
      border-bottom: 1px solid #E2E8F0;
      font-size: 10px;
      vertical-align: middle;
    }
    td.sno   { width: 32px; color: #94A3B8; text-align: center; font-weight: 600; }
    td.udise { width: 120px; font-family: monospace; font-size: 10px; color: #475569; }
    td.name  { font-weight: 600; color: #1E293B; }

    .footer {
      border-top: 2px solid #E2E8F0;
      padding: 8px 24px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94A3B8;
      background: #F8FAFC;
    }

    /* Print styles */
    @media print {
      body { font-size: 10px; }
      .no-print { display: none !important; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr.even { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }
    }

    /* Print trigger button */
    .print-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #FFFBEB;
      border-bottom: 2px solid #FDE68A;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .print-bar p { font-size: 12px; color: #92400E; font-weight: 600; }
    .btn-pdf {
      background: #16A34A;
      color: white;
      border: none;
      padding: 9px 20px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-pdf:hover { background: #15803D; }
    .btn-close {
      background: #EF4444;
      color: white;
      border: none;
      padding: 9px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- Print/Save bar (hidden in print) -->
  <div class="print-bar no-print">
    <p>📄 School List PDF — ${locationName}</p>
    <button class="btn-pdf" onclick="window.print()">🖨️ Save as PDF / Print</button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
  </div>

  <!-- Header -->
  <div class="header">
    <div>
      <h1>Block wise List of Schools in ${locationName} (${stateName})</h1>
      <p style="margin-top:4px">Source: UDISE+ | Ministry of Education, Govt. of India</p>
      <a href="https://www.schoolspedia.in" target="_blank"
         style="display:inline-block; margin-top:8px; color:#BAE6FD; font-size:12px; font-weight:700; text-decoration:underline; letter-spacing:0.3px;">
        🌐 www.schoolspedia.in — India's Largest School Directory
      </a>
    </div>
    <div class="header-right">
      <div>Downloaded: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      <div class="header-badge">📊 ${totalSchools.toLocaleString('en-IN')} Schools</div>
    </div>
  </div>

  <!-- Meta stats -->
  <div class="meta">
    <div>Total Schools: <span>${totalSchools.toLocaleString('en-IN')}</span></div>
    <div>Region: <span>${locationName}</span></div>
    <div>State: <span>${stateName}</span></div>
    <div>Data: <span>UDISE+ Official</span></div>
  </div>

  <!-- Table -->
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>UDISE Code</th>
        <th>School Name</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Footer -->
  <div class="footer">
    <span>
      🌐 <strong>SchoolsPedia.in</strong> — India's Largest School Directory &nbsp;|&nbsp;
      <a href="https://www.schoolspedia.in" target="_blank" style="color:#1E40AF; font-weight:700; text-decoration:underline;">https://www.schoolspedia.in</a>
    </span>
    <span>Data Source: UDISE+ (Ministry of Education, Govt. of India) &nbsp;|&nbsp; Free to use with attribution</span>
  </div>

  <div style="text-align:center; padding: 6px; font-size:9px; color:#94A3B8; background:#F8FAFC;">
    This document was generated from
    <a href="https://www.schoolspedia.in" target="_blank" style="color:#1E40AF; font-weight:700; text-decoration:underline;">www.schoolspedia.in</a>
    — Find schools across all 36 states of India
  </div>

  <script>
    // Auto-trigger print dialog after page loads
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 800);
    });
  </script>

</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error generating school list PDF:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
