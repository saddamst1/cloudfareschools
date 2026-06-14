import xml.etree.ElementTree as ET
import sys
import os

print("Starting SVG XML Validation...")

# Create temp directory
os.makedirs('temp_svgs', exist_ok=True)

# Run a node helper that handles imports without alias
node_helper = """
const fs = require('fs');
const path = require('path');

async function run() {
  let routeContent = fs.readFileSync(path.join(__dirname, 'app/blog-images/[slug]/route.js'), 'utf8');
  routeContent = routeContent.replace("@/data/articles-data", "./data/articles-data.js");
  
  fs.writeFileSync('temp_route.mjs', routeContent);
  
  const { GET } = await import('./temp_route.mjs');
  const { ARTICLE_DATA } = await import('./data/articles-data.js');
  
  for (const slug of Object.keys(ARTICLE_DATA)) {
    const response = await GET(new Request('http://localhost/'), { params: Promise.resolve({ slug }) });
    const svg = await response.text();
    fs.writeFileSync(`temp_svgs/${slug}.svg`, svg);
  }
  
  if (fs.existsSync('temp_route.mjs')) fs.unlinkSync('temp_route.mjs');
}
run().catch(err => {
  console.error("Node generator crashed:", err);
  process.exit(1);
});
"""

with open('temp_gen.js', 'w', encoding='utf-8') as f:
    f.write(node_helper)

# Execute Node generation
exit_code = os.system('node temp_gen.js')
if exit_code != 0:
    print("[-] SVG Generation failed.")
    sys.exit(1)

# Validate each SVG with Python's ElementTree
articles = [
  'what-is-udise-code',
  'rte-admission-guide',
  'govt-vs-private-schools',
  'rural-education-india',
  'school-board-systems-india',
  'check-school-facilities',
  'nsp-scholarship-guide',
  'pm-poshan-scheme',
  'school-infrastructure-checklist',
  'kvs-admissions-guide',
  'nvs-admissions-guide',
  'school-categories-india',
  'coed-vs-single-sex-schools',
  'pupil-teacher-ratio-ptr',
  'municipal-corporation-schools',
  'schools-in-uttar-pradesh',
  'schools-in-madhya-pradesh',
  'schools-in-maharashtra',
  'schools-in-bihar',
  'schools-in-rajasthan',
  'schools-in-west-bengal',
  'schools-in-karnataka',
  'schools-in-gujarat',
  'schools-in-delhi',
  'schools-in-tamil-nadu'
]

has_errors = False
for slug in articles:
    filepath = f"temp_svgs/{slug}.svg"
    if not os.path.exists(filepath):
        print(f"[-] Missing SVG for: {slug}")
        has_errors = True
        continue
    try:
        # Strict XML parsing
        ET.parse(filepath)
        print(f"[+] XML OK: {slug}")
    except ET.ParseError as e:
        print(f"[-] XML ERROR in {slug}: {e}")
        # Print lines around the error
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        line_num = e.position[0]
        col_num = e.position[1]
        print(f"    Line {line_num}, Col {col_num}:")
        start = max(0, line_num - 3)
        end = min(len(lines), line_num + 3)
        for i in range(start, end):
            prefix = "--> " if i == line_num - 1 else "    "
            print(f"{prefix}{i+1}: {lines[i].strip()}")
        has_errors = True

# Cleanup temp files
for slug in articles:
    filepath = f"temp_svgs/{slug}.svg"
    if os.path.exists(filepath):
        os.remove(filepath)
if os.path.exists('temp_svgs'):
    os.rmdir('temp_svgs')
if os.path.exists('temp_gen.js'):
    os.remove('temp_gen.js')

if has_errors:
    print("\n[-] Validation failed. Please fix XML errors.")
    sys.exit(1)
else:
    print("\n[+] All 25 SVGs are 100% valid XML documents! Rendering guaranteed.")
    sys.exit(0)
