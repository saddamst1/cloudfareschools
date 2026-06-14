const fs = require('fs');
const { ARTICLE_DATA } = require('./data/articles-data.js');

const slug = 'what-is-udise-code';
const article = ARTICLE_DATA[slug];

const wrapText = (text, maxChars = 32) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  return lines;
};

const titleLines = wrapText(article.title, 34);

const svgContent = `
  <!-- Background & Grid -->
  <rect width="1200" height="630" fill="#0F172A" />
  <pattern id="udiseGrid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.3)" stroke-width="1"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#udiseGrid)" />
  
  <!-- Decorative Tech Circles -->
  <circle cx="1100" cy="150" r="180" fill="none" stroke="#3B82F6" stroke-dasharray="8 8" stroke-width="2" opacity="0.3" />
  <circle cx="100" cy="500" r="220" fill="none" stroke="#0D9488" stroke-width="1" opacity="0.2" />

  <!-- ID Card Base -->
  <rect x="150" y="80" width="900" height="470" rx="28" fill="#1E293B" stroke="#334155" stroke-width="4" />
  <rect x="150" y="80" width="900" height="90" rx="0" fill="#1E40AF" style="clip-path: inset(0 0 380px 0 round 28px);" />
  
  <!-- ID Card Header -->
  <text x="190" y="135" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="white" letter-spacing="1.5">NATIONAL SCHOOL REGISTRY</text>
  <text x="910" y="135" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#38BDF8" text-anchor="end">UDISE+ STATUS</text>
  
  <!-- ID Card Content -->
  <g transform="translate(190, 210)">
    <!-- Photo Placeholder -->
    <rect x="0" y="0" width="160" height="200" rx="12" fill="#334155" stroke="#475569" stroke-width="2" />
    <circle cx="80" cy="85" r="40" fill="#475569" />
    <path d="M 30 180 Q 80 130 130 180" fill="#475569" />
    
    <!-- Barcode -->
    <rect x="0" y="225" width="160" height="45" fill="white" />
    <path d="M 10 230 L 10 265 M 15 230 L 15 265 M 25 230 L 25 265 M 30 230 L 30 265 M 45 230 L 45 265 M 50 230 L 50 265 M 65 230 L 65 265 M 70 230 L 70 265 M 75 230 L 75 265 M 85 230 L 85 265 M 95 230 L 95 265 M 105 230 L 105 265 M 110 230 L 110 265 M 120 230 L 120 265 M 135 230 L 135 265 M 140 230 L 140 265 M 150 230 L 150 265" stroke="#0F172A" stroke-width="2" />
    <text x="80" y="290" font-family="monospace" font-size="14" fill="#94A3B8" text-anchor="middle">CODE: 27211000104</text>
  </g>

  <!-- Details List -->
  <g transform="translate(400, 225)" font-family="system-ui, sans-serif" fill="white">
    <text x="0" y="30" font-size="28" font-weight="800">${article.title.split(': ')[0]}</text>
    <text x="0" y="80" font-size="18" font-weight="700" fill="#94A3B8">SYSTEM TYPE:</text>
    <text x="150" y="80" font-size="18" font-weight="700" fill="#38BDF8">Unified School Tracker</text>
    
    <text x="0" y="120" font-size="18" font-weight="700" fill="#94A3B8">REGISTRY ID:</text>
    <text x="150" y="120" font-size="18" font-weight="700" fill="#38BDF8">11-Digit Code</text>
    
    <text x="0" y="160" font-size="18" font-weight="700" fill="#94A3B8">VERIFICATION:</text>
    <text x="150" y="160" font-size="18" font-weight="700" fill="#34D399">Fully Active Database</text>
  </g>

  <!-- Badge Stamp -->
  <g transform="translate(870, 360)">
    <circle cx="50" cy="50" r="50" fill="none" stroke="#34D399" stroke-width="4" stroke-dasharray="5 3" />
    <text x="50" y="45" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#34D399" text-anchor="middle">UDISE+</text>
    <text x="50" y="65" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#34D399" text-anchor="middle">VERIFIED</text>
  </g>
`;

const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
    ${svgContent}
    <g transform="translate(100, 580)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Outfit', 'Segoe UI', sans-serif" font-size="16" font-weight="900">
        <tspan fill="#F8FAFC" opacity="0.6">Powered by </tspan>
        <tspan fill="#38BDF8" font-weight="900">Schools</tspan>
        <tspan fill="#34D399" font-weight="900">Pedia</tspan>
        <tspan fill="#FBBF24" font-weight="900">.in</tspan>
      </text>
    </g>
  </svg>
`.trim();

fs.writeFileSync('output_udise.svg', svg);
console.log('Saved output_udise.svg');
