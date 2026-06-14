import { ARTICLE_DATA } from '@/data/articles-data';

export async function GET(request, { params }) {
  const { slug } = await params;
  const article = ARTICLE_DATA[slug];

  if (!article) {
    return new Response('Not Found', { status: 404 });
  }

  // Text wrapping utility
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

  // Setup Custom Visual Assets based on Category/Slug
  let svgContent = '';

  if (slug === 'what-is-udise-code') {
    // 1. Digital ID Card Theme (Dark Tech Mode)
    svgContent = `
      <!-- Background and Grid -->
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
      
      <!-- Header bar path with top-left and top-right rounded corners (radius 28) and sharp bottom corners -->
      <path d="M 178 80 L 1022 80 A 28 28 0 0 1 1050 108 L 1050 170 L 150 170 L 150 108 A 28 28 0 0 1 178 80 Z" fill="#1E40AF" />
      
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
        <!-- Wrapped Title -->
        <text x="0" y="20" font-size="22" font-weight="900" fill="white">
          ${wrapText(article.title, 42).map((line, idx) => `<tspan x="0" dy="${idx === 0 ? 0 : 30}">${line}</tspan>`).join('')}
        </text>
        <text x="0" y="105" font-size="18" font-weight="700" fill="#94A3B8">SYSTEM TYPE:</text>
        <text x="150" y="105" font-size="18" font-weight="700" fill="#38BDF8">Unified School Tracker</text>
        
        <text x="0" y="145" font-size="18" font-weight="700" fill="#94A3B8">REGISTRY ID:</text>
        <text x="150" y="145" font-size="18" font-weight="700" fill="#38BDF8">11-Digit Code</text>
        
        <text x="0" y="185" font-size="18" font-weight="700" fill="#94A3B8">VERIFICATION:</text>
        <text x="150" y="185" font-size="18" font-weight="700" fill="#34D399">Fully Active Database</text>
      </g>

      <!-- Badge Stamp -->
      <g transform="translate(870, 360)">
        <circle cx="50" cy="50" r="50" fill="none" stroke="#34D399" stroke-width="4" stroke-dasharray="5 3" />
        <text x="50" y="45" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#34D399" text-anchor="middle">UDISE+</text>
        <text x="50" y="65" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#34D399" text-anchor="middle">VERIFIED</text>
      </g>
    `;
  } 
  else if (slug === 'rte-admission-guide') {
    // 2. Official Form Mockup with '25% Free Seat Reserved' Stamp
    svgContent = `
      <rect width="1200" height="630" fill="#F5F3FF" />
      <circle cx="1000" cy="100" r="300" fill="#EDE9FE" opacity="0.6" />
      <circle cx="100" cy="550" r="250" fill="#DDD6FE" opacity="0.4" />
      
      <!-- Clipboard Document -->
      <rect x="250" y="60" width="700" height="510" rx="16" fill="white" stroke="#D8B4FE" stroke-width="4" />
      <rect x="450" y="40" width="300" height="30" rx="8" fill="#7C3AED" />
      
      <!-- Document Content -->
      <g transform="translate(320, 120)" font-family="system-ui, sans-serif">
        <text x="0" y="30" font-size="28" font-weight="800" fill="#4C1D95">RTE Admission Form</text>
        <line x1="0" y1="50" x2="560" y2="50" stroke="#DDD6FE" stroke-width="2" />
        
        <!-- Form Fields -->
        <text x="0" y="100" font-size="16" font-weight="700" fill="#7C3AED">Section 1: Applicant Details</text>
        <rect x="0" y="115" width="260" height="32" rx="4" fill="#F9F5FF" stroke="#E9D5FF" stroke-width="1" />
        <rect x="280" y="115" width="280" height="32" rx="4" fill="#F9F5FF" stroke="#E9D5FF" stroke-width="1" />
        
        <text x="0" y="180" font-size="16" font-weight="700" fill="#7C3AED">Section 2: Quota &amp; Eligibility</text>
        <rect x="0" y="195" width="560" height="32" rx="4" fill="#F9F5FF" stroke="#E9D5FF" stroke-width="1" />
        
        <!-- Checklist items -->
        <g transform="translate(0, 260)">
          <!-- Item 1 -->
          <circle cx="15" cy="15" r="10" fill="#10B981" />
          <path d="M 10 15 L 14 19 L 20 11" fill="none" stroke="white" stroke-width="2" />
          <text x="40" y="20" font-size="16" font-weight="600" fill="#4B5563">25% Seats Reserved in Private Schools</text>
          
          <!-- Item 2 -->
          <circle cx="15" cy="55" r="10" fill="#10B981" />
          <path d="M 10 55 L 14 59 L 20 51" fill="none" stroke="white" stroke-width="2" />
          <text x="40" y="60" font-size="16" font-weight="600" fill="#4B5563">Free Education from Class 1 to 8</text>
        </g>
      </g>

      <!-- Large Circular Stamp in bottom right -->
      <g transform="translate(740, 370)">
        <circle cx="80" cy="80" r="75" fill="none" stroke="#EF4444" stroke-width="5" stroke-dasharray="6 3" />
        <circle cx="80" cy="80" r="65" fill="none" stroke="#EF4444" stroke-width="2" />
        <text x="80" y="65" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#EF4444" text-anchor="middle" letter-spacing="1">RTE ACT SEC 12(1)(C)</text>
        <text x="80" y="90" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#EF4444" text-anchor="middle" letter-spacing="1">25% FREE</text>
        <text x="80" y="115" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#EF4444" text-anchor="middle" letter-spacing="0.5">RESERVED SEAT</text>
      </g>
    `;
  }
  else if (slug === 'govt-vs-private-schools') {
    // 3. Split Screen Versus comparison Layout
    svgContent = `
      <defs>
        <linearGradient id="govtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EA580C" />
          <stop offset="100%" stop-color="#F97316" />
        </linearGradient>
        <linearGradient id="pvtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E40AF" />
          <stop offset="100%" stop-color="#0D9488" />
        </linearGradient>
      </defs>

      <!-- Split Screen Background -->
      <rect width="600" height="630" fill="url(#govtGrad)" />
      <rect x="600" width="600" height="630" fill="url(#pvtGrad)" />
      
      <!-- Text/Content on Left Side (Govt) -->
      <g transform="translate(80, 120)" font-family="system-ui, sans-serif" fill="white">
        <rect width="440" height="420" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <text x="220" y="60" font-size="36" font-weight="900" text-anchor="middle" letter-spacing="1">GOVERNMENT</text>
        <text x="220" y="100" font-size="18" font-weight="700" fill="#FFEDD5" text-anchor="middle">Affordable &amp; State-Backed</text>
        
        <!-- Checklist parameters -->
        <g transform="translate(50, 160)" font-size="18" font-weight="700">
          <text x="0" y="30">✔ Low or Zero Tuition Fees</text>
          <text x="0" y="80">✔ Free Mid-Day Meals</text>
          <text x="0" y="130">✔ Qualified B.Ed. Teachers</text>
          <text x="0" y="180">✔ RTE Reserved Quotas</text>
        </g>
      </g>

      <!-- Text/Content on Right Side (Private) -->
      <g transform="translate(680, 120)" font-family="system-ui, sans-serif" fill="white">
        <rect width="440" height="420" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <text x="220" y="60" font-size="36" font-weight="900" text-anchor="middle" letter-spacing="1">PRIVATE</text>
        <text x="220" y="100" font-size="18" font-weight="700" fill="#CCFBF1" text-anchor="middle">Facility &amp; Infrastructure Rich</text>
        
        <!-- Checklist parameters -->
        <g transform="translate(50, 160)" font-size="18" font-weight="700">
          <text x="0" y="30">✔ Modern Lab &amp; Tech Facilities</text>
          <text x="0" y="80">✔ Better Pupil-Teacher Ratio</text>
          <text x="0" y="130">✔ Smart Classrooms &amp; Sports</text>
          <text x="0" y="180">✔ English Medium Options</text>
        </g>
      </g>

      <!-- Center Versus Badge -->
      <g transform="translate(600, 315)">
        <circle cx="0" cy="0" r="70" fill="#1E293B" stroke="white" stroke-width="6" />
        <text x="0" y="14" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="white" text-anchor="middle" font-style="italic">VS</text>
      </g>
    `;
  }
  else if (slug === 'rural-education-india') {
    // 4. Earthy/Nature Village School Layout
    svgContent = `
      <defs>
        <linearGradient id="ruralGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#022C22" />
          <stop offset="100%" stop-color="#064E3B" />
        </linearGradient>
      </defs>
      
      <!-- Rural Landscape Green Background -->
      <rect width="1200" height="630" fill="url(#ruralGrad)" />
      
      <!-- Stylized Hills (bezier curves) -->
      <path d="M -100 630 Q 300 450 700 630 Z" fill="#047857" opacity="0.6" />
      <path d="M 400 630 Q 800 400 1300 630 Z" fill="#065F46" opacity="0.8" />
      <path d="M -50 630 Q 500 500 1250 630 Z" fill="#059669" />

      <!-- Glowing Sun -->
      <circle cx="600" cy="400" r="90" fill="#FBBF24" opacity="0.9" />
      
      <!-- Minimal School Path -->
      <path d="M 600 500 L 520 630 L 680 630 Z" fill="#D97706" />

      <!-- Main Box Container -->
      <rect x="150" y="60" width="900" height="280" rx="20" fill="rgba(15, 23, 42, 0.75)" stroke="#059669" stroke-width="3" />
      
      <!-- Content -->
      <g transform="translate(200, 110)" font-family="system-ui, sans-serif" fill="white">
        <text x="0" y="30" font-size="14" font-weight="800" fill="#10B981" letter-spacing="3" text-transform="uppercase">RURAL SCHOOL INFRASTRUCTURE</text>
        <text x="0" y="80" font-size="38" font-weight="900" fill="white">Rural Education Development</text>
        <text x="0" y="130" font-size="20" font-weight="600" fill="#D1FAE5" width="700">Demographic Trends &amp; Literacy Progress in Village Districts</text>
        
        <!-- Stat badges -->
        <g transform="translate(0, 160)">
          <!-- Badge 1 -->
          <rect x="0" y="10" width="220" height="40" rx="8" fill="#047857" />
          <text x="110" y="35" font-size="15" font-weight="700" text-anchor="middle">98% Village Reach</text>

          <!-- Badge 2 -->
          <rect x="240" y="10" width="220" height="40" rx="8" fill="#D97706" />
          <text x="350" y="35" font-size="15" font-weight="700" text-anchor="middle">Clean Facility Focus</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'school-board-systems-india') {
    // 5. Bento Grid Layout of School Boards
    svgContent = `
      <rect width="1200" height="630" fill="#F1F5F9" />
      <pattern id="bentoDots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1" fill="#CBD5E1" />
      </pattern>
      <rect width="1200" height="630" fill="url(#bentoDots)" />

      <!-- Title Header -->
      <g transform="translate(100, 70)" font-family="system-ui, sans-serif">
        <text x="0" y="20" font-size="13" font-weight="800" fill="#0284C7" letter-spacing="2">CURRICULUM ANALYSIS</text>
        <text x="0" y="60" font-size="36" font-weight="900" fill="#0F172A">School Board Systems in India</text>
      </g>

      <!-- Bento Grid Blocks -->
      <!-- CBSE Block -->
      <g transform="translate(100, 160)">
        <rect width="480" height="180" rx="18" fill="#1E3A8A" />
        <text x="40" y="60" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="white">CBSE</text>
        <text x="40" y="100" font-family="system-ui, sans-serif" font-size="16" fill="#93C5FD" font-weight="600">Central Board of Secondary Education</text>
        <text x="40" y="135" font-family="system-ui, sans-serif" font-size="14" fill="white" font-weight="700">📌 Focus: Science, Math &amp; National Level Exams</text>
      </g>

      <!-- ICSE Block -->
      <g transform="translate(620, 160)">
        <rect width="480" height="180" rx="18" fill="#7C2D12" />
        <text x="40" y="60" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="white">ICSE/ISC</text>
        <text x="40" y="100" font-family="system-ui, sans-serif" font-size="16" fill="#FDBA74" font-weight="600">Council for the Indian School Certificate</text>
        <text x="40" y="135" font-family="system-ui, sans-serif" font-size="14" fill="white" font-weight="700">📌 Focus: English Language &amp; Practical Studies</text>
      </g>

      <!-- State Boards Block -->
      <g transform="translate(100, 370)">
        <rect width="480" height="180" rx="18" fill="#064E3B" />
        <text x="40" y="60" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="white">State Boards</text>
        <text x="40" y="100" font-family="system-ui, sans-serif" font-size="16" fill="#A7F3D0" font-weight="600">Individual State Education Boards</text>
        <text x="40" y="135" font-family="system-ui, sans-serif" font-size="14" fill="white" font-weight="700">📌 Focus: Local Language &amp; Regional Syllabus</text>
      </g>

      <!-- NIOS Block -->
      <g transform="translate(620, 370)">
        <rect width="480" height="180" rx="18" fill="#701A75" />
        <text x="40" y="60" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="white">NIOS</text>
        <text x="40" y="100" font-family="system-ui, sans-serif" font-size="16" fill="#F5D0FE" font-weight="600">National Institute of Open Schooling</text>
        <text x="40" y="135" font-family="system-ui, sans-serif" font-size="14" fill="white" font-weight="700">📌 Focus: Flexible Distance Learning &amp; Open Exams</text>
      </g>
    `;
  }
  else if (slug === 'check-school-facilities' || slug === 'school-infrastructure-checklist') {
    // 6 & 9. Blueprint / Grid Infrastructure Checklist
    const isBlueprint = slug === 'school-infrastructure-checklist';
    const bgColor = isBlueprint ? '#1E3A8A' : '#0F766E';
    const strokeColor = isBlueprint ? '#3B82F6' : '#2DD4BF';
    const badgeText = isBlueprint ? '10-POINT INFRASTRUCTURE CHECKLIST' : 'SWACHH VIDYALAYA PARAMETERS';
    const titleText = isBlueprint ? 'School Infrastructure Checklist' : 'Check School Facilities via UDISE';
    
    svgContent = `
      <defs>
        <!-- Standard Drop Shadow Filter -->
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.15" />
        </filter>
        
        <!-- Grid Pattern representing Blueprint draft -->
        <pattern id="infraGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${strokeColor}" stroke-width="0.7" opacity="0.3" />
        </pattern>
      </defs>

      <rect width="1200" height="630" fill="${bgColor}" />
      <rect width="1200" height="630" fill="url(#infraGrid)" />
      
      <!-- Architectural decorative drawings -->
      <g stroke="white" stroke-width="1" opacity="0.2" fill="none">
        <rect x="700" y="100" width="400" height="400" rx="12" />
        <line x1="700" y1="300" x2="1100" y2="300" />
        <line x1="900" y1="100" x2="900" y2="500" />
        <circle cx="900" cy="300" r="80" />
        <!-- Ruler outline -->
        <rect x="700" y="470" width="350" height="20" />
        <line x1="720" y1="470" x2="720" y2="480" />
        <line x1="740" y1="470" x2="740" y2="485" />
        <line x1="760" y1="470" x2="760" y2="480" />
        <line x1="780" y1="470" x2="780" y2="485" />
        <line x1="800" y1="470" x2="800" y2="480" />
        <line x1="820" y1="470" x2="820" y2="485" />
        <line x1="840" y1="470" x2="840" y2="480" />
      </g>

      <!-- Checklist Card -->
      <rect x="100" y="80" width="550" height="470" rx="20" fill="white" filter="url(#cardShadow)" />
      
      <g transform="translate(140, 130)" font-family="system-ui, sans-serif">
        <text x="0" y="10" font-size="12" font-weight="800" fill="#64748B" letter-spacing="1.5">${badgeText}</text>
        <text x="0" y="50" font-size="28" font-weight="900" fill="#0F172A">${titleText}</text>
        
        <g transform="translate(0, 100)">
          <!-- Check 1 -->
          <circle cx="15" cy="15" r="12" fill="#10B981" />
          <path d="M 10 15 L 14 19 L 20 11" fill="none" stroke="white" stroke-width="2.5" />
          <text x="40" y="21" font-size="16" font-weight="700" fill="#334155">🚰 Functional Drinking Water System</text>
          
          <!-- Check 2 -->
          <circle cx="15" cy="65" r="12" fill="#10B981" />
          <path d="M 10 65 L 14 69 L 20 61" fill="none" stroke="white" stroke-width="2.5" />
          <text x="40" y="71" font-size="16" font-weight="700" fill="#334155">🚻 Separate Boys &amp; Girls Toilets</text>

          <!-- Check 3 -->
          <circle cx="15" cy="115" r="12" fill="#10B981" />
          <path d="M 10 115 L 14 119 L 20 111" fill="none" stroke="white" stroke-width="2.5" />
          <text x="40" y="121" font-size="16" font-weight="700" fill="#334155">🔬 Safety Standards in Labs &amp; Classroom</text>

          <!-- Check 4 -->
          <circle cx="15" cy="165" r="12" fill="#10B981" />
          <path d="M 10 165 L 14 169 L 20 161" fill="none" stroke="white" stroke-width="2.5" />
          <text x="40" y="171" font-size="16" font-weight="700" fill="#334155">⚽ Boundary Wall, Playground &amp; Safety</text>

          <!-- Check 5 -->
          <circle cx="15" cy="215" r="12" fill="#10B981" />
          <path d="M 10 215 L 14 219 L 20 211" fill="none" stroke="white" stroke-width="2.5" />
          <text x="40" y="221" font-size="16" font-weight="700" fill="#334155">💻 Verified UDISE+ Infrastructure Data</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'nsp-scholarship-guide') {
    // 7. National Scholarship Portal (Degree/Gold Theme)
    svgContent = `
      <rect width="1200" height="630" fill="#1E3A8A" />
      <circle cx="600" cy="315" r="400" fill="none" stroke="#3B82F6" stroke-dasharray="10 5" stroke-width="2" opacity="0.3" />
      
      <!-- Glowing Background Radial Light -->
      <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0" />
      </radialGradient>
      <rect width="1200" height="630" fill="url(#goldGlow)" />

      <!-- Left Column - Scholarship Cap and Certificate Outline -->
      <g transform="translate(150, 160)">
        <!-- Graduation Cap -->
        <path d="M 150 50 L 250 90 L 150 130 L 50 90 Z" fill="#FBBF24" />
        <polygon points="120,105 120,150 180,150 180,105" fill="#D97706" />
        <path d="M 150 100 C 150 115 150 115 150 125" stroke="#FBBF24" stroke-width="4" />
        <!-- Tassel -->
        <path d="M 200 110 L 210 160" stroke="#FBBF24" stroke-width="3" fill="none" />
        <circle cx="210" cy="165" r="6" fill="#FBBF24" />

        <!-- Certificate scroll mockup -->
        <rect x="70" y="200" width="160" height="100" rx="8" fill="white" stroke="#FBBF24" stroke-width="3" />
        <line x1="90" y1="225" x2="210" y2="225" stroke="#CBD5E1" stroke-width="3" />
        <line x1="90" y1="250" x2="210" y2="250" stroke="#CBD5E1" stroke-width="3" />
        <line x1="90" y1="275" x2="210" y2="275" stroke="#CBD5E1" stroke-width="3" />
        
        <!-- Red Stamp Ribbon -->
        <path d="M 180 270 L 190 310 L 195 295 L 205 310 L 195 270 Z" fill="#EF4444" />
        <circle cx="187" cy="275" r="10" fill="#EF4444" />
      </g>

      <!-- Right Column: Text Information -->
      <g transform="translate(500, 160)" font-family="system-ui, sans-serif" fill="white">
        <rect width="550" height="340" rx="16" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />
        
        <g transform="translate(40, 40)">
          <text x="0" y="10" font-size="13" font-weight="800" fill="#FBBF24" letter-spacing="2">NATIONAL SCHOLARSHIP PORTAL</text>
          <text x="0" y="55" font-size="34" font-weight="900">NSP Scholarship Guide</text>
          
          <line x1="0" y1="90" x2="470" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
          
          <text x="0" y="130" font-size="16" font-weight="600" fill="#93C5FD">How to use UDISE school codes to register and apply online.</text>
          
          <!-- Key Points list -->
          <g transform="translate(0, 160)" font-size="15" font-weight="700">
            <text x="0" y="20" fill="#FBBF24">★ Pre-Matric &amp; Post-Matric Scholarships</text>
            <text x="0" y="60" fill="#FBBF24">★ Single Girl Child Merit Scholarships</text>
            <text x="0" y="100" fill="#FBBF24">★ Ministry of Education Portal Verification</text>
          </g>
        </g>
      </g>
    `;
  }
  else if (slug === 'pm-poshan-scheme') {
    // 8. Food/Meal Plate Theme
    svgContent = `
      <defs>
        <filter id="plateShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#F59E0B" flood-opacity="0.15" />
        </filter>
      </defs>

      <rect width="1200" height="630" fill="#FFFBEB" />
      
      <!-- Sunburst background rays -->
      <g stroke="#FEF3C7" stroke-width="15" opacity="0.5">
        <line x1="600" y1="315" x2="-200" y2="-200" />
        <line x1="600" y1="315" x2="1400" y2="-200" />
        <line x1="600" y1="315" x2="1400" y2="830" />
        <line x1="600" y1="315" x2="-200" y2="830" />
      </g>

      <!-- Left Column: Plate and Food Graphics -->
      <g transform="translate(250, 315)">
        <!-- Outer Plate Ring -->
        <circle cx="0" cy="0" r="160" fill="white" stroke="#F59E0B" stroke-width="4" filter="url(#plateShadow)" />
        <circle cx="0" cy="0" r="130" fill="none" stroke="#FEF3C7" stroke-width="2" />

        <!-- Food bowls -->
        <!-- Rice bowl -->
        <circle cx="-45" cy="-35" r="40" fill="#E2E8F0" />
        <text x="-45" y="-30" font-family="system-ui" font-size="12" font-weight="900" fill="#475569" text-anchor="middle">RICE 🍚</text>
        
        <!-- Dal/Lentil bowl -->
        <circle cx="45" cy="-35" r="40" fill="#F59E0B" opacity="0.8" />
        <text x="45" y="-30" font-family="system-ui" font-size="12" font-weight="900" fill="white" text-anchor="middle">DAL 🍛</text>
        
        <!-- Veg bowl -->
        <circle cx="0" cy="45" r="40" fill="#10B981" opacity="0.8" />
        <text x="0" y="50" font-family="system-ui" font-size="12" font-weight="900" fill="white" text-anchor="middle">VEGGIE 🥦</text>

        <!-- Nutrition Tag -->
        <rect x="-90" y="115" width="180" height="35" rx="8" fill="#156534" />
        <text x="0" y="137" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="white" text-anchor="middle">MID-DAY MEAL STANDARD</text>
      </g>

      <!-- Right Column: Text content -->
      <g transform="translate(560, 160)" font-family="system-ui, sans-serif">
        <text x="0" y="20" font-size="13" font-weight="800" fill="#166534" letter-spacing="2">MID-DAY MEAL SCHEME</text>
        <text x="0" y="65" font-size="36" font-weight="950" fill="#1E293B">PM POSHAN Scheme</text>
        
        <text x="0" y="115" font-size="16" font-weight="600" fill="#475569">Understanding mid-day meals, calorie norms, nutrition lists,</text>
        <text x="0" y="140" font-size="16" font-weight="600" fill="#475569">and monitoring systems in Indian government schools.</text>
        
        <!-- Guidelines box -->
        <rect x="0" y="175" width="480" height="150" rx="12" fill="white" stroke="#E2E8F0" stroke-width="2" />
        <g transform="translate(25, 205)" font-size="15" font-weight="700" fill="#1E293B">
          <text x="0" y="10" fill="#156534">🥗 Primary: 450 Calories &amp; 12g Protein</text>
          <text x="0" y="50" fill="#156534">🥗 Upper Primary: 700 Calories &amp; 20g Protein</text>
          <text x="0" y="90" fill="#156534">🥗 Quality Control &amp; Community Monitoring</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'kvs-admissions-guide' || slug === 'nvs-admissions-guide') {
    // 10 & 11. KVS (Tricolor National) / NVS (Residential Forest Green) Admissions
    const isKvs = slug === 'kvs-admissions-guide';
    const bg = isKvs ? '#F8FAFC' : '#064E3B';
    const mainColor = isKvs ? '#1E40AF' : '#10B981';
    const tagText = isKvs ? 'KENDRIYA VIDYALAYA ADMISSIONS' : 'JAWAHAR NAVODAYA VIDYALAYA';
    const titleText = isKvs ? 'KVS Admission Guide' : 'JNV Admission Guide';
    const subText = isKvs ? 'Central government schooling for kids of employees &amp; public.' : 'Fully funded residential schools for rural student talents.';
    const sideBanner = isKvs 
      ? `<rect width="50" height="630" fill="#EA580C" /><rect x="1150" width="50" height="630" fill="#16A34A" />`
      : `<path d="M 0 0 L 1200 0 L 1200 50 L 0 120 Z" fill="#047857" />`;

    svgContent = `
      <defs>
        <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.1" />
        </filter>
      </defs>

      <rect width="1200" height="630" fill="${bg}" />
      ${sideBanner}

      <!-- Shield/Emblem Center Logo -->
      <g transform="translate(260, 315)">
        <polygon points="0,-130 100,-70 100,50 0,130 -100,50 -100,-70" fill="white" stroke="${mainColor}" stroke-width="6" filter="url(#shieldShadow)" />
        
        <!-- Rising sun emblem representing school education -->
        <circle cx="0" cy="-10" r="40" fill="#EAB308" />
        <path d="M -50 -10 L 50 -10 M -35 -35 L 35 15 M -35 15 L 35 -35 M 0 -50 L 0 30" stroke="#EAB308" stroke-width="4" />
        
        <!-- Embellishment text -->
        <text x="0" y="80" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="${mainColor}" text-anchor="middle">
          ${isKvs ? 'KVS SCHEME' : 'NVS TALENT'}
        </text>
      </g>

      <!-- Details Column -->
      <g transform="translate(480, 160)" font-family="system-ui, sans-serif" fill="${isKvs ? '#0F172A' : 'white'}">
        <text x="0" y="20" font-size="13" font-weight="800" fill="${mainColor}" letter-spacing="2" text-transform="uppercase">${tagText}</text>
        <text x="0" y="70" font-size="40" font-weight="950">${titleText}</text>
        <text x="0" y="115" font-size="16" font-weight="600" fill="${isKvs ? '#475569' : '#A7F3D0'}">${subText}</text>
        
        <!-- Information block -->
        <rect x="0" y="150" width="550" height="180" rx="14" fill="${isKvs ? 'white' : 'rgba(255, 255, 255, 0.08)'}" stroke="${isKvs ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)'}" stroke-width="2" />
        
        <g transform="translate(30, 185)" font-size="15" font-weight="700">
          <text x="0" y="10" fill="${mainColor}">${isKvs ? '⭐ Online Registration Steps' : '⭐ JNVST Selection Test Guide'}</text>
          <text x="0" y="50" fill="${mainColor}">${isKvs ? '⭐ Priority Category Quotas' : '⭐ 75% Seats Reserved for Rural Kids'}</text>
          <text x="0" y="90" fill="${mainColor}">${isKvs ? '⭐ Single Girl Child Reservation' : '⭐ Boarding, Lodging &amp; Uniforms Free'}</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'school-categories-india') {
    // 12. Ascending staircase graph of school levels
    svgContent = `
      <rect width="1200" height="630" fill="#F8FAFC" />
      
      <!-- Stairs Graph -->
      <g transform="translate(100, 130)">
        <!-- Step 1: Primary -->
        <rect x="0" y="260" width="130" height="120" rx="8" fill="#3B82F6" />
        <text x="65" y="320" font-family="system-ui" font-size="16" font-weight="900" fill="white" text-anchor="middle">PRIMARY</text>
        <text x="65" y="345" font-family="system-ui" font-size="13" fill="#BFDBFE" text-anchor="middle">Class 1-5</text>
        
        <!-- Step 2: Upper Primary -->
        <rect x="150" y="180" width="130" height="200" rx="8" fill="#0D9488" />
        <text x="215" y="260" font-family="system-ui" font-size="16" font-weight="900" fill="white" text-anchor="middle">UP. PRIM</text>
        <text x="215" y="285" font-family="system-ui" font-size="13" fill="#CCFBF1" text-anchor="middle">Class 6-8</text>

        <!-- Step 3: Secondary -->
        <rect x="300" y="100" width="130" height="280" rx="8" fill="#F59E0B" />
        <text x="365" y="200" font-family="system-ui" font-size="16" font-weight="900" fill="white" text-anchor="middle">SEC</text>
        <text x="365" y="225" font-family="system-ui" font-size="13" fill="#FEF3C7" text-anchor="middle">Class 9-10</text>

        <!-- Step 4: Higher Secondary -->
        <rect x="450" y="20" width="130" height="360" rx="8" fill="#EF4444" />
        <text x="515" y="140" font-family="system-ui" font-size="15" font-weight="900" fill="white" text-anchor="middle">HI. SEC</text>
        <text x="515" y="165" font-family="system-ui" font-size="13" fill="#FEE2E2" text-anchor="middle">Class 11-12</text>
      </g>

      <!-- Details Column -->
      <g transform="translate(720, 160)" font-family="system-ui, sans-serif">
        <text x="0" y="20" font-size="13" font-weight="800" fill="#0D9488" letter-spacing="2">NEP 2020 STRUCTURES</text>
        <text x="0" y="65" font-size="34" font-weight="900" fill="#0F172A">School Categories</text>
        <text x="0" y="110" font-size="16" font-weight="600" fill="#475569">Understanding age limits, class division stages,</text>
        <text x="0" y="135" font-size="16" font-weight="600" fill="#475569">and school management systems in India.</text>
        
        <!-- Info card -->
        <rect x="0" y="180" width="380" height="150" rx="12" fill="white" stroke="#E2E8F0" stroke-width="2" />
        <g transform="translate(25, 210)" font-size="14" font-weight="700" fill="#334155">
          <text x="0" y="10">🔵 Foundation: Primary (5 years)</text>
          <text x="0" y="45">🟢 Preparatory &amp; Middle school</text>
          <text x="0" y="80">🔴 Secondary &amp; Senior Secondary</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'coed-vs-single-sex-schools') {
    // 13. Split pink/blue gender balance theme
    svgContent = `
      <defs>
        <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.05" />
        </filter>
      </defs>

      <!-- Split pink & blue backgrounds -->
      <rect width="600" height="630" fill="#FFF1F2" />
      <rect x="600" width="600" height="630" fill="#EFF6FF" />
      
      <!-- Wave-like separation down center -->
      <path d="M 600 0 Q 640 315 600 630 L 0 630 L 0 0 Z" fill="#FFF1F2" opacity="0.3" />

      <!-- Central Balance Scale -->
      <g transform="translate(600, 240)">
        <!-- Scale Stand -->
        <line x1="0" y1="-50" x2="0" y2="150" stroke="#B45309" stroke-width="8" />
        <line x1="-80" y1="150" x2="80" y2="150" stroke="#B45309" stroke-width="10" />
        
        <!-- Scale Beam (Balanced) -->
        <line x1="-120" y1="-40" x2="120" y2="-40" stroke="#F59E0B" stroke-width="8" />
        
        <!-- Left Pan (Pink Side / Girls) -->
        <line x1="-120" y1="-40" x2="-150" y2="60" stroke="#D97706" stroke-width="3" />
        <line x1="-120" y1="-40" x2="-90" y2="60" stroke="#D97706" stroke-width="3" />
        <path d="M -160 60 Q -120 90 -80 60 Z" fill="#D97706" />
        <!-- Female Symbol -->
        <circle cx="-120" cy="20" r="16" fill="none" stroke="#E11D48" stroke-width="4" />
        <line x1="-120" y1="36" x2="-120" y2="48" stroke="#E11D48" stroke-width="4" />
        <line x1="-128" y1="42" x2="-112" y2="42" stroke="#E11D48" stroke-width="4" />

        <!-- Right Pan (Blue Side / Boys) -->
        <line x1="120" y1="-40" x2="90" y2="60" stroke="#D97706" stroke-width="3" />
        <line x1="120" y1="-40" x2="150" y2="60" stroke="#D97706" stroke-width="3" />
        <path d="M 80 60 Q 120 90 160 60 Z" fill="#D97706" />
        <!-- Male Symbol -->
        <circle cx="120" cy="20" r="16" fill="none" stroke="#2563EB" stroke-width="4" />
        <line x1="131" y1="9" x2="145" y2="-5" stroke="#2563EB" stroke-width="4" />
        <line x1="135" y1="-5" x2="145" y2="-5" stroke="#2563EB" stroke-width="4" />
        <line x1="145" y1="5" x2="145" y2="-5" stroke="#2563EB" stroke-width="4" />
      </g>

      <!-- Details / Comparison Info Box -->
      <g transform="translate(150, 440)" font-family="system-ui, sans-serif">
        <rect width="900" height="120" rx="16" fill="white" stroke="#E2E8F0" stroke-width="2" filter="url(#boxShadow)" />
        
        <text x="450" y="45" font-size="28" font-weight="900" fill="#0F172A" text-anchor="middle">Co-Ed vs Single-Sex Schools in India</text>
        <text x="450" y="80" font-size="16" font-weight="600" fill="#475569" text-anchor="middle">Analyzing social development, academic results, and practical school choices.</text>
      </g>
    `;
  }
  else if (slug === 'pupil-teacher-ratio-ptr') {
    // 14. Teacher and Student Silhouette Ratio Theme
    svgContent = `
      <rect width="1200" height="630" fill="#FDF8F6" />
      <pattern id="ptrGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="#F1F5F9" />
      </pattern>
      
      <!-- Left side: 1 Teacher symbol -->
      <g transform="translate(150, 180)">
        <rect width="180" height="280" rx="16" fill="#EFF6FF" stroke="#3B82F6" stroke-width="3" />
        <!-- Head -->
        <circle cx="90" cy="80" r="40" fill="#2563EB" />
        <!-- Body -->
        <path d="M 40 180 C 40 140 140 140 140 180 L 140 240 L 40 240 Z" fill="#2563EB" />
        
        <text x="90" y="270" font-family="system-ui" font-size="16" font-weight="900" fill="#1E40AF" text-anchor="middle">1 TEACHER</text>
      </g>

      <!-- Right side: Student Crowd symbol representing Ratio -->
      <g transform="translate(420, 180)">
        <rect width="220" height="280" rx="16" fill="#F0FDF4" stroke="#10B981" stroke-width="3" />
        
        <!-- Head crowd silhouettes -->
        <circle cx="70" cy="70" r="22" fill="#059669" />
        <path d="M 40 120 C 40 100 100 100 100 120 L 100 170 L 40 170 Z" fill="#059669" />
        
        <circle cx="150" cy="70" r="22" fill="#059669" />
        <path d="M 120 120 C 120 100 180 100 180 120 L 180 170 L 120 170 Z" fill="#059669" />
        
        <circle cx="110" cy="110" r="22" fill="#059669" opacity="0.8" />
        <path d="M 80 160 C 80 140 140 140 140 160 L 140 200 L 80 200 Z" fill="#059669" opacity="0.8" />
        
        <text x="110" y="240" font-family="system-ui" font-size="16" font-weight="900" fill="#156534" text-anchor="middle">30 STUDENTS</text>
        <text x="110" y="262" font-family="system-ui" font-size="13" fill="#156534" text-anchor="middle">(RTE legal standard)</text>
      </g>

      <!-- Text Details -->
      <g transform="translate(710, 180)" font-family="system-ui, sans-serif">
        <text x="0" y="20" font-size="13" font-weight="800" fill="#059669" letter-spacing="2">CLASSROOM STATISTICS</text>
        <text x="0" y="70" font-size="34" font-weight="950" fill="#0F172A">Pupil-Teacher Ratio</text>
        <text x="0" y="115" font-size="16" font-weight="600" fill="#475569">Why class ratios matter for learning quality.</text>
        
        <!-- Statutory rules -->
        <rect x="0" y="150" width="380" height="110" rx="12" fill="white" stroke="#E2E8F0" stroke-width="2" />
        <g transform="translate(20, 180)" font-size="14" font-weight="700" fill="#334155">
          <text x="0" y="10">📌 Primary limit: 30 students to 1 teacher</text>
          <text x="0" y="45">📌 Upper primary limit: 35 students to 1 teacher</text>
        </g>
      </g>
    `;
  }
  else if (slug === 'municipal-corporation-schools') {
    // 15. Urban municipal building skyline theme
    svgContent = `
      <defs>
        <filter id="muniShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.08" />
        </filter>
      </defs>

      <rect width="1200" height="630" fill="#F0FDF4" />
      
      <!-- City skyline building silhouettes -->
      <g fill="#DCFCE7" opacity="0.8">
        <rect x="100" y="400" width="100" height="230" />
        <rect x="180" y="300" width="120" height="330" />
        <rect x="280" y="380" width="80" height="250" />
        <rect x="340" y="450" width="130" height="180" />
        <rect x="750" y="350" width="120" height="280" />
        <rect x="850" y="250" width="150" height="380" />
        <rect x="980" y="420" width="120" height="210" />
      </g>

      <!-- School Bus outline -->
      <g transform="translate(480, 480)" fill="#EAB308">
        <rect width="240" height="90" rx="12" />
        <!-- Wheels -->
        <circle cx="50" cy="90" r="22" fill="#1E293B" />
        <circle cx="50" cy="90" r="10" fill="#CBD5E1" />
        <circle cx="190" cy="90" r="22" fill="#1E293B" />
        <circle cx="190" cy="90" r="10" fill="#CBD5E1" />
        <!-- Windows -->
        <rect x="20" y="15" width="40" height="30" rx="4" fill="#E2E8F0" />
        <rect x="80" y="15" width="40" height="30" rx="4" fill="#E2E8F0" />
        <rect x="140" y="15" width="40" height="30" rx="4" fill="#E2E8F0" />
        <!-- Stripe -->
        <rect y="55" width="240" height="10" fill="#1E293B" />
      </g>

      <!-- Center Logo Box -->
      <g transform="translate(200, 110)" font-family="system-ui, sans-serif">
        <rect width="800" height="280" rx="20" fill="white" stroke="#10B981" stroke-width="4" filter="url(#muniShadow)" />
        
        <g transform="translate(50, 50)">
          <text x="0" y="10" font-size="12" font-weight="800" fill="#059669" letter-spacing="2">MUNICIPAL ADMISSION PORTALS</text>
          <text x="0" y="60" font-size="36" font-weight="900" fill="#1E293B">Municipal Corporation Schools</text>
          
          <text x="0" y="110" font-size="16" font-weight="600" fill="#64748B">How to enroll in MCD (Delhi), BMC (Mumbai), BBMP (Bangalore) systems.</text>
          
          <!-- Key benefits list -->
          <g transform="translate(0, 140)" font-size="15" font-weight="700" fill="#334155">
            <text x="0" y="20">✔ Free uniform &amp; school textbooks</text>
            <text x="280" y="20">✔ Municipal scholarships criteria</text>
            <text x="0" y="55">✔ Modern computerized facilities</text>
            <text x="280" y="55">✔ Local municipal application portal</text>
          </g>
        </g>
      </g>
    `;
  }
  else if (slug.startsWith('schools-in-')) {
    // 16-25. STATE GUIDES - Custom localized silhouettes & unique colors
    const stateName = slug.replace('schools-in-', '');
    
    // Map states to color palettes & abbreviations & landmark outlines
    const stateMeta = {
      'uttar-pradesh': {
        name: 'Uttar Pradesh',
        abbr: 'UP',
        bg1: '#EA580C',
        bg2: '#F97316',
        textColor: '#FFEDD5',
        landmarkSvg: `
          <!-- Taj Mahal Dome Outline -->
          <path d="M 0 0 C -20 -30 -30 -60 0 -90 C 30 -60 20 -30 0 0" fill="none" stroke="white" stroke-width="4" />
          <path d="M -50 0 L 50 0 L 50 40 L -50 40 Z" fill="none" stroke="white" stroke-width="4" />
          <line x1="-50" y1="0" x2="-50" y2="-80" stroke="white" stroke-width="3" />
          <line x1="50" y1="0" x2="50" y2="-80" stroke="white" stroke-width="3" />
        `
      },
      'madhya-pradesh': {
        name: 'Madhya Pradesh',
        abbr: 'MP',
        bg1: '#047857',
        bg2: '#10B981',
        textColor: '#D1FAE5',
        landmarkSvg: `
          <!-- Sanchi Stupa Dome Outline -->
          <path d="M -80 30 C -80 -40 80 -40 80 30" fill="none" stroke="white" stroke-width="4" />
          <line x1="-90" y1="30" x2="90" y2="30" stroke="white" stroke-width="4" />
          <!-- Stupa Pillar -->
          <line x1="0" y1="-30" x2="0" y2="-60" stroke="white" stroke-width="4" />
          <line x1="-15" y1="-50" x2="15" y2="-50" stroke="white" stroke-width="3" />
        `
      },
      'maharashtra': {
        name: 'Maharashtra',
        abbr: 'MH',
        bg1: '#1D4ED8',
        bg2: '#3B82F6',
        textColor: '#DBEAFE',
        landmarkSvg: `
          <!-- Gateway of India Arch -->
          <rect x="-60" y="-70" width="120" height="110" rx="8" fill="none" stroke="white" stroke-width="4" />
          <path d="M -30 40 L -30 -20 Q 0 -45 30 -20 L 30 40" fill="none" stroke="white" stroke-width="4" />
          <!-- Pillars -->
          <line x1="-45" y1="-70" x2="-45" y2="-100" stroke="white" stroke-width="3" />
          <line x1="45" y1="-70" x2="45" y2="-100" stroke="white" stroke-width="3" />
        `
      },
      'bihar': {
        name: 'Bihar',
        abbr: 'BR',
        bg1: '#B45309',
        bg2: '#F59E0B',
        textColor: '#FEF3C7',
        landmarkSvg: `
          <!-- Bodhi Tree Leaf Silhouette -->
          <path d="M 0 -80 C 30 -60 50 -20 0 40 C -50 -20 -30 -60 0 -80 Z" fill="none" stroke="white" stroke-width="4" />
          <path d="M 0 -80 L 0 40 M 0 -50 L 25 -30 M 0 -30 L 32 -10 M 0 -10 L 30 15 M 0 -50 L -25 -30 M 0 -30 L -32 -10 M 0 -10 L -30 15" stroke="white" stroke-width="2" />
        `
      },
      'rajasthan': {
        name: 'Rajasthan',
        abbr: 'RJ',
        bg1: '#D97706',
        bg2: '#FBBF24',
        textColor: '#FEF3C7',
        landmarkSvg: `
          <!-- Camel and Palace Dome Silhouette -->
          <!-- Camel Hump and Head -->
          <path d="M -60 40 Q -40 0 0 20 Q 30 -30 50 -40 Q 60 -50 55 -30 L 40 40" fill="none" stroke="white" stroke-width="4" />
          <path d="M -10 -20 C -20 -40 -30 -40 -40 -20 C -50 -40 -60 -40 -70 -20" fill="none" stroke="white" stroke-width="3" />
        `
      },
      'west-bengal': {
        name: 'West Bengal',
        abbr: 'WB',
        bg1: '#BE123C',
        bg2: '#F43F5E',
        textColor: '#FFE4E6',
        landmarkSvg: `
          <!-- Howrah Bridge outline -->
          <path d="M -120 40 L -90 -30 L 90 -30 L 120 40" stroke="white" stroke-width="4" fill="none" />
          <!-- Bridge arch cables -->
          <path d="M -120 40 Q 0 -5 120 40" stroke="white" stroke-width="2" fill="none" />
          <path d="M -90 -30 Q 0 15 90 -30" stroke="white" stroke-width="3" fill="none" />
          <!-- Hangers -->
          <line x1="-60" y1="40" x2="-60" y2="5" stroke="white" stroke-width="1.5" />
          <line x1="-30" y1="40" x2="-30" y2="10" stroke="white" stroke-width="1.5" />
          <line x1="0" y1="40" x2="0" y2="12" stroke="white" stroke-width="1.5" />
          <line x1="30" y1="40" x2="30" y2="10" stroke="white" stroke-width="1.5" />
          <line x1="60" y1="40" x2="60" y2="5" stroke="white" stroke-width="1.5" />
        `
      },
      'karnataka': {
        name: 'Karnataka',
        abbr: 'KA',
        bg1: '#701A75',
        bg2: '#D946EF',
        textColor: '#FDF4FF',
        landmarkSvg: `
          <!-- Vidhana Soudha Temple Pillars -->
          <rect x="-70" y="-50" width="140" height="90" fill="none" stroke="white" stroke-width="4" />
          <line x1="-50" y1="-50" x2="-50" y2="40" stroke="white" stroke-width="3" />
          <line x1="-20" y1="-50" x2="-20" y2="40" stroke="white" stroke-width="3" />
          <line x1="20" y1="-50" x2="20" y2="40" stroke="white" stroke-width="3" />
          <line x1="50" y1="-50" x2="50" y2="40" stroke="white" stroke-width="3" />
          <!-- Central Dome -->
          <path d="M -30 -50 C -30 -80 30 -80 30 -50 Z" fill="none" stroke="white" stroke-width="4" />
        `
      },
      'gujarat': {
        name: 'Gujarat',
        abbr: 'GJ',
        bg1: '#0F766E',
        bg2: '#0D9488',
        textColor: '#CCFBF1',
        landmarkSvg: `
          <!-- Gir Lion Outline -->
          <circle cx="-20" cy="-30" r="35" fill="none" stroke="white" stroke-width="4" />
          <path d="M -35 0 C -45 20 -40 40 -20 40 L 40 40 L 50 10 C 60 0 50 -30 20 -20" fill="none" stroke="white" stroke-width="4" />
        `
      },
      'delhi': {
        name: 'Delhi',
        abbr: 'DL',
        bg1: '#991B1B',
        bg2: '#EF4444',
        textColor: '#FEE2E2',
        landmarkSvg: `
          <!-- India Gate Arch outline -->
          <rect x="-60" y="-70" width="120" height="110" rx="4" fill="none" stroke="white" stroke-width="4" />
          <path d="M -30 40 L -30 -10 Q 0 -35 30 -10 L 30 40" fill="none" stroke="white" stroke-width="4" />
          <!-- Top layers -->
          <rect x="-70" y="-80" width="140" height="10" fill="none" stroke="white" stroke-width="4" />
          <rect x="-50" y="-95" width="100" height="15" fill="none" stroke="white" stroke-width="3" />
        `
      },
      'tamil-nadu': {
        name: 'Tamil Nadu',
        abbr: 'TN',
        bg1: '#854D0E',
        bg2: '#EAB308',
        textColor: '#FEF9C3',
        landmarkSvg: `
          <!-- Temple Gopuram Tower outline -->
          <polygon points="0,-100 -50,40 50,40" fill="none" stroke="white" stroke-width="4" />
          <!-- Gopuram horizontal subdivisions -->
          <line x1="-35" y1="0" x2="35" y2="0" stroke="white" stroke-width="3" />
          <line x1="-22" y1="-35" x2="22" y2="-35" stroke="white" stroke-width="3" />
          <line x1="-10" y1="-70" x2="10" y2="-70" stroke="white" stroke-width="3" />
          <!-- Kalasas on top -->
          <circle cx="0" cy="-108" r="8" fill="none" stroke="white" stroke-width="3" />
        `
      }
    };

    const currentMeta = stateMeta[stateName] || stateMeta['delhi'];

    svgContent = `
      <defs>
        <linearGradient id="stateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${currentMeta.bg1}" />
          <stop offset="100%" stop-color="${currentMeta.bg2}" />
        </linearGradient>
        <filter id="stateCardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.15" />
        </filter>
      </defs>

      <!-- Gradient Background -->
      <rect width="1200" height="630" fill="url(#stateGrad)" />
      
      <!-- Huge State Abbreviation Watermark -->
      <text x="600" y="420" font-family="system-ui, sans-serif" font-size="360" font-weight="950" fill="white" opacity="0.08" text-anchor="middle">
        ${currentMeta.abbr}
      </text>

      <!-- State Landmark Graphic on the Right -->
      <g transform="translate(900, 315)">
        ${currentMeta.landmarkSvg}
      </g>

      <!-- State Card Container -->
      <g transform="translate(100, 100)" font-family="system-ui, sans-serif">
        <rect width="650" height="430" rx="20" fill="white" stroke="rgba(255,255,255,0.2)" stroke-width="3" filter="url(#stateCardShadow)" />
        
        <g transform="translate(45, 50)">
          <text x="0" y="10" font-size="12" font-weight="800" fill="${currentMeta.bg1}" letter-spacing="3" text-transform="uppercase">STATE EDUCATION DIRECTORY</text>
          
          <!-- State Title -->
          <text x="0" y="60" font-size="38" font-weight="950" fill="#0F172A">${currentMeta.name} School Guide</text>
          <text x="0" y="105" font-size="16" font-weight="600" fill="#475569">Exploring state board registration, UDISE listings, and school locations.</text>
          
          <line x1="0" y1="140" x2="560" y2="140" stroke="#F1F5F9" stroke-width="2" />
          
          <!-- Details list -->
          <g transform="translate(0, 180)" font-size="15" font-weight="700" fill="#1E293B">
            <!-- Icon Checklist -->
            <circle cx="15" cy="15" r="10" fill="${currentMeta.bg1}" />
            <path d="M 10 15 L 14 19 L 20 11" fill="none" stroke="white" stroke-width="2" />
            <text x="40" y="21">State Board (SSC/HSC) &amp; CBSE Affiliations</text>

            <circle cx="15" cy="65" r="10" fill="${currentMeta.bg1}" />
            <path d="M 10 65 L 14 69 L 20 61" fill="none" stroke="white" stroke-width="2" />
            <text x="40" y="71">RTE 25% Seat Admission Portal Guidelines</text>

            <circle cx="15" cy="115" r="10" fill="${currentMeta.bg1}" />
            <path d="M 10 115 L 14 119 L 20 111" fill="none" stroke="white" stroke-width="2" />
            <text x="40" y="121">Verified School Directories &amp; UDISE+ Catalog</text>
          </g>
        </g>
      </g>
    `;
  }

  // Generate SVG String Wrapper
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      ${svgContent}

      <!-- Shared Branding Bottom Label across all banners -->
      <g transform="translate(100, 580)">
        <!-- Small brand signature -->
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Outfit', 'Segoe UI', sans-serif" font-size="16" font-weight="900">
          <tspan fill="#F8FAFC" opacity="0.6">Powered by </tspan>
          <tspan fill="#38BDF8" font-weight="900">Schools</tspan>
          <tspan fill="#34D399" font-weight="900">Pedia</tspan>
          <tspan fill="#FBBF24" font-weight="900">.in</tspan>
        </text>
      </g>
    </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
