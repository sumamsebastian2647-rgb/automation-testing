const fs = require('fs');
const path = require('path');
const { getSteps } = require('./reportCollector');

const reportPath = path.join(__dirname, '../reports/visit-report.html');

function generateHtmlReport() {
  const rows = getSteps().map(s => `
    <tr class="${s.status}">
      <td>${s.time}</td>
      <td>${s.pageName}</td>
      <td>${s.action}</td>
      <td>${s.url}</td>
      <td>${s.responseStatus}</td>
      <td>${s.toast}</td>
      <td>${s.note}</td>
      <td>${s.status}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Playwright Visit Report</title>
  <style>
    body { font-family: Arial; background:#f4f6f8; padding:20px; }
    table { width:100%; border-collapse:collapse; background:#fff; }
    th, td { border:1px solid #ccc; padding:10px; text-align:left; }
    th { background:#2c3e50; color:#fff; }
    .SUCCESS { background:#d4edda; font-weight:bold; }
    .FAIL { background:#f8d7da; font-weight:bold; }
    .UNKNOWN { background:#fff3cd; font-weight:bold; }
  </style>
</head>
<body>

<h2>Automation Page Visit & Toast Report</h2>

<table>
  <tr>
    <th>Time</th>
    <th>Page</th>
    <th>Action</th>
    <th>URL</th>
    <th>HTTP</th>
    <th>Toast Message</th>
    <th>Note</th>
    <th>Status</th>
  </tr>
  ${rows}
</table>

</body>
</html>
`;

  fs.writeFileSync(reportPath, html);
  console.log(`HTML report generated → ${reportPath}`);
}

module.exports = { generateHtmlReport };
