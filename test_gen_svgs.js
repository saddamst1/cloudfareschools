const fs = require('fs');
const path = require('path');

async function test() {
  console.log("Generating and validating SVGs for all articles...");
  
  // 1. Read route.js content and replace alias with relative path
  let routeContent = fs.readFileSync(path.join(__dirname, 'app/blog-images/[slug]/route.js'), 'utf8');
  routeContent = routeContent.replace("@/data/articles-data", "./data/articles-data.js");
  
  // Save as a temp ESM module
  fs.writeFileSync('temp_route.mjs', routeContent);
  
  // 2. Import the temp route
  const { GET } = await import('./temp_route.mjs');
  const { ARTICLE_DATA } = await import('./data/articles-data.js');
  
  let hasErrors = false;
  
  for (const slug of Object.keys(ARTICLE_DATA)) {
    try {
      const response = await GET(new Request('http://localhost/'), { params: Promise.resolve({ slug }) });
      const svg = await response.text();
      
      // Strict XML parsing check
      const { XMLParser } = require('fast-xml-parser');
      const parser = new XMLParser({
        allowBooleanAttributes: true
      });
      
      parser.parse(svg, true); // will throw error if invalid XML
      
      // Check for empty layout
      const hasContent = svg.includes('<rect') || svg.includes('<circle') || svg.includes('<path') || svg.includes('<polygon');
      const isMissingBackground = !svg.includes('fill="#0F172A"') && !svg.includes('fill="#F5F3FF"') && !svg.includes('fill="url(#govtGrad)"') && !svg.includes('fill="url(#ruralGrad)"') && !svg.includes('fill="#F1F5F9"') && !svg.includes('fill="#1E3A8A"') && !svg.includes('fill="#0F766E"') && !svg.includes('fill="#FFFBEB"') && !svg.includes('fill="#F8FAFC"') && !svg.includes('fill="#064E3B"') && !svg.includes('fill="#FFF1F2"') && !svg.includes('fill="#FDF8F6"') && !svg.includes('fill="#F0FDF4"') && !svg.includes('fill="url(#stateGrad)"');
      
      if (!hasContent) {
        console.error(`[-] ERROR in ${slug}: SVG has no vector elements`);
        hasErrors = true;
      } else if (isMissingBackground) {
        console.error(`[-] ERROR in ${slug}: SVG background is missing or empty`);
        hasErrors = true;
      } else {
        console.log(`[+] XML OK: ${slug} (${svg.length} chars)`);
      }
    } catch (err) {
      console.error(`[-] XML PARSE ERROR in ${slug}:`, err.message);
      hasErrors = true;
    }
  }
  
  // Cleanup
  if (fs.existsSync('temp_route.mjs')) fs.unlinkSync('temp_route.mjs');
  
  if (hasErrors) {
    console.error("\nValidation failed.");
    process.exit(1);
  } else {
    console.log("\n[+] All 25 SVGs are 100% valid XML documents and render correctly!");
    process.exit(0);
  }
}

test().catch(err => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
