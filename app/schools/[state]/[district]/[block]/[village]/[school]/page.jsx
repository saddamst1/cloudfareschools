import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSchoolBySlug, getNearbySchools, getDistrictStatsForSchool } from '@/lib/queries';
import { getSchoolMeta, schoolSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import DistrictStats from '@/components/DistrictStats';
import SchoolReviews from '@/components/SchoolReviews';

export const revalidate = 86400;
export const dynamicParams = true;

// Pre-build top schools at build time (rest will ISR on-demand)
export async function generateStaticParams() {
  return [
    // Pre-generate a real demo school
    { state: 'uttar-pradesh', district: 'lucknow', block: 'chinhat', village: 'ali-nager', school: 'p-s-ali-nagar-9270100101' },
  ];
}

export async function generateMetadata({ params }) {
  const { school: schoolSlug } = await params;
  const school = await getSchoolBySlug(schoolSlug);
  if (!school) return { title: 'School Not Found | SchoolsPedia' };
  return getSchoolMeta(school);
}

function getSchoolDescription(school, districtStats, stateSlug, districtSlug, blockSlug, villageSlug) {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const isKV   = school.national_mgmt === 'KVS';
  const isNVS  = school.national_mgmt === 'NVS';

  const villageLink   = `<a href="/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.village}</a>`;
  const blockLink     = `<a href="/schools/${stateSlug}/${districtSlug}/${blockSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.block}</a>`;
  const districtLink  = `<a href="/schools/${stateSlug}/${districtSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.district}</a>`;
  const stateLink     = `<a href="/schools/${stateSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.state}</a>`;

  const classRange = { 'Primary': '1 to 5', 'Upper Primary': '6 to 8', 'Secondary': '9 to 10', 'Higher Secondary': '9 to 12' }[school.school_category] || '1 to 8';
  const admitsText = school.school_type === 'Boys' ? 'boys only' : school.school_type === 'Girls' ? 'girls only' : 'both boys and girls';

  // Line 1: What is this school, plainly
  let para1 = `**${school.school_name}** is in ${villageLink} village, ${blockLink} block, ${districtLink} district, ${stateLink}.`;
  para1 += ` It teaches **Class ${classRange}** and admits ${admitsText}.`;
  if (isKV)  para1 += ` This is a Kendriya Vidyalaya — run by the central government, mainly for children of government employees.`;
  if (isNVS) para1 += ` This is a Jawahar Navodaya Vidyalaya — a fully residential school for rural students selected through the JNVST entrance exam.`;

  // Line 2: Cost / fees reality
  let para2 = '';
  if (isGovt) {
    para2 = `This is a government school. **Education here is free.** The state provides textbooks and a cooked meal every school day under the PM POSHAN scheme. No tuition fee is charged.`;
  } else if (school.national_mgmt === 'Private Aided') {
    para2 = `This is a private-aided school — it receives some funding from the government but is managed privately. Fees are usually lower than fully private schools, but you should confirm the current fee structure directly with the school.`;
  } else {
    para2 = `This is a private unaided school. It charges tuition fees set by its own management. Under the RTE Act, **25% of seats in Class 1** must be given free to children from low-income families in the neighbourhood. Ask the school about the current admission process for RTE seats.`;
  }

  // Line 3: Status + district context
  let para3 = '';
  if (school.school_status !== 'Operational') {
    para3 = `⚠️ **Note:** According to UDISE+ records, this school is listed as **${school.school_status}**. Verify with the Block Education Officer (BEO) in ${school.block} before visiting.`;
  } else if (districtStats?.dist_literacy_pct) {
    const lit = districtStats.dist_literacy_pct.toFixed(1);
    const totalSch = districtStats.total_schools ? districtStats.total_schools.toLocaleString('en-IN') : null;
    para3 = `${school.district} district has a literacy rate of **${lit}%**${totalSch ? ` and ${totalSch} registered schools` : ''}.`;
  }

  return [para1, para2, para3].filter(Boolean).join('\n\n');
}

function getRTEContent(school) {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const stateName = school.state;

  const stateRTEPortals = {
    'Uttar Pradesh': 'rte25.upsdc.gov.in',
    'Maharashtra': 'student.maharashtra.gov.in',
    'Rajasthan': 'rajpsp.nic.in',
    'Gujarat': 'rte.orpgujarat.com',
    'Bihar': 'state.bihar.gov.in/educationbihar',
    'Madhya Pradesh': 'rteportal.mp.gov.in',
  };

  const stateRTESchedules = {
    'Uttar Pradesh': 'UP RTE Section 12(1)(c) admissions are conducted in 3 distinct phases. Online applications normally start in mid-February and conclude in April. Registered schools verify and admit students by June.',
    'Maharashtra': 'Maharashtra RTE 25% admission process online registration typically begins in March and closes by April.',
    'Rajasthan': 'Rajasthan RTE admission portals usually invite applications in April. The official lottery selection occurs in May, and document verification runs through June.',
    'Gujarat': 'Gujarat RTE admission online portals start registering candidates in early March. Verification of parents\' documents occurs at local help centers in April.',
    'Madhya Pradesh': 'MP RTE portal registration starts in March. Document verification at public service centers (Jila Shiksha Kendra) occurs in early April, followed by online lottery seats distribution.',
    'Delhi': 'Delhi EWS/DG admission portal runs under the DoE. Registrations open in February and conclude in March, followed by computerized lottery draws.',
    'Karnataka': 'Karnataka RTE applications under the 25% quota are normally invited online from April to May, with the selection list published by the Department of School Education in June.',
    'Tamil Nadu': 'Tamil Nadu RTE admissions registration begins in April and concludes in late May. The seat allotment is decided by local schools in June.',
  };

  const portal = stateRTEPortals[stateName] || `${stateName.toLowerCase().replace(/ /g, '')}.gov.in`;
  const schedule = stateRTESchedules[stateName] || `Timeline for RTE admissions in ${stateName} generally runs from March to June. Please check the official state education website for active deadlines and verification schedules.`;

  return {
    isGovt,
    portal,
    schedule,
    stepsGovt: [
      `Find your nearest government school — Use SchoolsPedia to search by your village or PIN code in ${school.district}.`,
      `Prepare your documents — Birth certificate of the child, Aadhaar card of child and parent, residence proof (ration card / Aadhaar), 2 passport-size photographs.`,
      `Apply online — Visit ${portal} or apply directly at the school during April–June admission season.`,
      `Contact Block Education Officer (BEO) — For disputes, RTE violations, or seat issues, contact BEO ${school.block}.`,
    ],
    rteQuota: `Private schools within 1 km of ${school.village} are required under RTE Section 12(1)(c) to reserve 25% seats for children from Economically Weaker Sections (EWS).`,
  };
}

function getUDISEBreakdown(udise) {
  const code = String(udise).padStart(11, '0');
  return [
    { digits: code.slice(0, 2), label: 'State code', sub: '' },
    { digits: code.slice(2, 4), label: 'District code', sub: '' },
    { digits: code.slice(4, 6), label: 'Block code', sub: '' },
    { digits: code.slice(6, 9), label: 'Cluster code', sub: '' },
    { digits: code.slice(9),    label: 'School serial', sub: '' },
  ];
}

function getSchoolFAQs(school, districtStats) {
  const n   = school.school_name;
  const v   = school.village;
  const d   = school.district;
  const b   = school.block;
  const st  = school.state;
  const u   = school.udise_code;
  const cat = school.school_category;
  const classRange = { 'Primary': '1 to 5', 'Upper Primary': '6 to 8', 'Secondary': '9 to 10', 'Higher Secondary': '11 to 12' }[cat] || '1 to 8';
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS' || school.national_mgmt?.includes('Local Body');
  const isClosed = school.school_status !== 'Operational';

  return [
    {
      q: `What is the UDISE code of ${n}?`,
      a: `The UDISE code is **${String(u).padStart(11, '0')}**. You'll need this number for NSP scholarship forms, school transfer certificates, and board exam registrations.`
    },
    {
      q: `Is ${n} a government school or private?`,
      a: isGovt
        ? `It's a government school. Education is free — no tuition fee. The state provides textbooks and a cooked mid-day meal every school day.`
        : `It's a private school. Fees are set by its own management. Under the RTE Act, 25% of entry-class seats must be given free to children from low-income families in the neighbourhood.`
    },
    {
      q: `Which classes does ${n} teach?`,
      a: `It's a **${cat}** school — it teaches Class **${classRange}**. ${cat === 'Primary' ? `For middle school or high school, students from ${v} usually go to a school in the ${b} area.` : ''}`
    },
    {
      q: `Where is ${n} located?`,
      a: `${v} village, ${b} block, ${d} district, ${st}.`
    },
    {
      q: `Is ${n} open and taking admissions?`,
      a: isClosed
        ? `UDISE+ records show this school as **${school.school_status}**. Check with the Block Education Officer (BEO) in ${b} to confirm the current situation.`
        : `The school is listed as **Operational** in UDISE+ records. For admissions, visit the school directly or contact the BEO office in **${b} block**.`
    },
    {
      q: `How do I check the facilities at ${n}?`,
      a: `We don't have detailed facility data for this school in our current dataset. For toilets, drinking water, electricity, and other infrastructure details, download the school's free Report Card from **udiseplus.gov.in** using UDISE code **${String(u).padStart(11, '0')}**. You can also visit the school to check in person.`
    }
  ];
}

const FACILITIES = [
  { icon: '🚪', label: 'Classrooms',   key: 'classrooms' },
  { icon: '💧', label: 'Drinking Water', key: 'water' },
  { icon: '🚻', label: 'Boys Toilet',  key: 'boys_toilet' },
  { icon: '🚺', label: 'Girls Toilet', key: 'girls_toilet' },
  { icon: '⚡', label: 'Electricity',  key: 'electricity' },
  { icon: '📚', label: 'Library',      key: 'library' },
  { icon: '🏃', label: 'Playground',   key: 'playground' },
  { icon: '🍲', label: 'Mid-Day Meal', key: 'mdm' },
  { icon: '💻', label: 'Computer Lab', key: 'computer' },
];

function getFacilityStatus(school, key) {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const hasDbColumns = school.has_library !== undefined;

  // If actual DB columns exist, use them
  if (hasDbColumns) {
    if (key === 'mdm')        return isGovt ? { status: 'available', label: 'Provided' } : { status: 'not_available', label: 'Not Provided' };
    if (key === 'electricity') return school.has_electricity === 1 ? { status: 'available', label: 'Available' } : { status: 'not_available', label: 'Not Available' };
    if (key === 'library')     return school.has_library === 1 ? { status: 'available', label: 'Available' } : { status: 'not_available', label: 'Not Available' };
    if (key === 'computer')    return school.has_computers === 1 ? { status: 'available', label: 'Available' } : { status: 'not_available', label: 'Not Available' };
    if (key === 'boys_toilet') { const c = school.boys_toilets_count || 0; return c > 0 ? { status: 'available', label: `${c} Functional` } : { status: 'not_available', label: 'Not Available' }; }
    if (key === 'girls_toilet') { const c = school.girls_toilets_count || 0; return c > 0 ? { status: 'available', label: `${c} Functional` } : { status: 'not_available', label: 'Not Available' }; }
    // classrooms and playground assumed present if school is operational
    return { status: 'verify', label: 'Check UDISE+' };
  }

  // No facility columns in DB — do NOT fabricate. Only assert mid-day meal for govt schools.
  if (key === 'mdm') return isGovt ? { status: 'available', label: 'Provided (Govt)' } : { status: 'not_available', label: 'Not Provided' };
  return { status: 'verify', label: 'Check UDISE+' };
}

const udiseColors = ['#EFF6FF', '#F0FDFA', '#FFF7ED', '#F5F3FF', '#FFF1F2'];
const udiseTextColors = ['#1E40AF', '#0D9488', '#F97316', '#7C3AED', '#BE123C'];

export default async function SchoolPage({ params }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug, school: schoolSlug } = await params;

  const school = await getSchoolBySlug(schoolSlug);
  if (!school) notFound();

  const [nearby, districtStats] = await Promise.all([
    getNearbySchools(stateSlug, districtSlug, blockSlug, villageSlug, school.udise_code, 6),
    getDistrictStatsForSchool(stateSlug, districtSlug),
  ]);

  const faqs = getSchoolFAQs(school, districtStats);
  const rte  = getRTEContent(school);
  const udiseBreakdown = getUDISEBreakdown(school.udise_code);

  const schoolJsonLd = schoolSchema(school, districtStats);
  const crumbJsonLd  = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: school.state, url: `/schools/${stateSlug}` },
    { name: school.district, url: `/schools/${stateSlug}/${districtSlug}` },
    { name: school.block, url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
    { name: school.village, url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
    { name: school.school_name, url: school.url },
  ]);
  const faqJsonLd = faqSchema(faqs);

  const isOperational = school.school_status === 'Operational';
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';
  const fmtPop = (n) => {
    if (!n) return '—';
    if (n >= 10000000) return `${(n/10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `${(n/100000).toFixed(1)} Lakh`;
    return n.toLocaleString('en-IN');
  };

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Breadcrumb */}
      <BreadcrumbNav items={[
        { label: 'Home', href: '/' },
        { label: school.state, href: `/schools/${stateSlug}` },
        { label: school.district, href: `/schools/${stateSlug}/${districtSlug}` },
        { label: school.block, href: `/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
        { label: school.village, href: `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
        { label: school.school_name },
      ]} />

      {/* Page Header */}
      <div style={{ background: '#1E40AF', padding: '24px 24px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isOperational ? '#10B981' : '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>
            {isOperational ? '✅ OPERATIONAL' : '⚠️ CLOSED'}
          </div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 10 }}>
            {school.school_name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: '0.8rem', color: '#93C5FD' }}>
            <span>UDISE: <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#BAE6FD' }}>{String(school.udise_code).padStart(11, '0')}</strong></span>
            <span style={{ color: '#475569' }}>·</span>
            <span>📍 {school.village}, {school.block}, {school.district}, {school.state}</span>
            <span style={{ color: '#475569' }}>·</span>
            <span>🏫 {school.school_category} · {school.school_type} · {school.national_mgmt?.replace('Department of Education', 'Government')}</span>
          </div>
        </div>
      </div>

      {/* Jump Navigation Bar */}
      <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 60, zIndex: 10 }}>
        <div 
          className="scroll-container-hide"
          style={{ 
            maxWidth: 1200, 
            margin: '0 auto', 
            padding: '0 24px', 
            display: 'flex', 
            gap: 20, 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch', 
            whiteSpace: 'nowrap' 
          }}
        >
          {[
            { label: 'Overview', id: 'overview' },
            { label: 'About', id: 'about' },
            { label: 'UDISE Code', id: 'udise' },
            { label: 'Infrastructure', id: 'infrastructure' },
            { label: 'Admissions', id: 'admissions' },
            { label: 'Reviews', id: 'reviews' },
            { label: 'FAQs', id: 'faqs' }
          ].map(link => (
            <a key={link.id} href={`#${link.id}`} className="jump-link" style={{ display: 'inline-block', flexShrink: 0, padding: '14px 0', fontSize: '0.85rem', fontWeight: 650, color: '#475569', textDecoration: 'none', borderBottom: '2px solid transparent', transition: 'all 0.15s ease' }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems: 'start' }}>

          {/* ── MAIN COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* School Info Summary Paragraph */}
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, margin: '0 0 4px 0' }}>
              <strong>{school.school_name}</strong> is a {school.school_category} school in {school.village}, {school.district}, {school.state}.
              UDISE: <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>{String(school.udise_code).padStart(11, '0')}</strong> · {school.school_type} · {school.national_mgmt} · {school.school_status}
            </p>

            {/* School Info Table */}
            <div id="overview" className="card">
              <div className="card-header">
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <span>School Information</span>
              </div>
              <div className="card-body">
                <table className="info-table">
                  <tbody>
                    <tr><td>UDISE Code</td><td><span className="udise-pill">{String(school.udise_code).padStart(11, '0')}</span></td></tr>
                    <tr><td>School Name</td><td>{school.school_name}</td></tr>
                    <tr><td>State</td><td>{school.state}</td></tr>
                    <tr><td>District</td><td>{school.district}</td></tr>
                    <tr><td>Block</td><td>{school.block}</td></tr>
                    <tr><td>Village</td><td>{school.village}</td></tr>
                    {school.cluster && <tr><td>Cluster</td><td>{school.cluster}</td></tr>}
                    <tr><td>Location</td><td><span className={`badge ${school.location === 'Rural' ? 'badge-green' : 'badge-blue'}`}>{school.location === 'Rural' ? '🌿 Rural' : '🏙️ Urban'}</span></td></tr>
                    <tr><td>Management</td><td>{school.national_mgmt}</td></tr>
                    <tr><td>Category</td><td><span className="badge badge-blue">{school.school_category}</span></td></tr>
                    <tr><td>School Type</td><td><span className="badge badge-teal">{school.school_type}</span></td></tr>
                    <tr><td>Status</td><td><span className={`badge ${isOperational ? 'badge-green' : 'badge-red'}`}>{isOperational ? '✅ Operational' : '⚠️ Closed'}</span></td></tr>
                    {districtStats?.dist_sample_pin && <tr><td>PIN Code</td><td>{districtStats.dist_sample_pin}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad */}
            <AdSlot size="responsive" />

            {/* About Section */}
            <div id="about" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                📖 About {school.school_name}
              </h2>
              {getSchoolDescription(school, districtStats, stateSlug, districtSlug, blockSlug, villageSlug).split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.8, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
              {(school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body')) && (
                <div className="highlight-box">
                  <p><strong>Mid-Day Meal (PM POSHAN):</strong> Government schools provide a cooked meal to students every school day. This is free and does not require any application.</p>
                </div>
              )}
            </div>

            {/* UDISE Code Breakdown */}
            <div id="udise" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                🔢 UDISE Code — {String(school.udise_code).padStart(11, '0')}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 14 }}>
                The UDISE code of {school.school_name} is <strong>{String(school.udise_code).padStart(11, '0')}</strong>. UDISE stands for Unified District Information System for Education — a unique 11-digit code assigned to every school in India by the Ministry of Education, Government of India.
              </p>
              <h3 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E40AF', marginBottom: 10 }}>How to read this UDISE code</h3>
              <div className="udise-breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
                {udiseBreakdown.map((part, i) => (
                  <div key={i} style={{ background: udiseColors[i], borderRadius: 8, padding: '10px 6px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700, color: udiseTextColors[i] }}>{part.digits}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: 4, lineHeight: 1.3 }}>{part.label}</div>
                  </div>
                ))}
              </div>
              <div className="highlight-box teal">
                <p>Your child needs this UDISE code for scholarship applications, college admission forms, and verifying school credentials with government portals like Scholarships.gov.in and NSP.</p>
              </div>
            </div>

            {/* Facilities */}
            <div id="infrastructure" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 8, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                🔧 School Facilities
              </h2>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                <p style={{ fontSize: '0.8rem', color: '#78350F', margin: 0 }}>
                  <strong>⚠️ Data not available in current dataset.</strong> We don't have facility records (toilets, electricity, library etc.) for this school. For accurate infrastructure details, download the free School Report Card from <strong>udiseplus.gov.in</strong> using UDISE code <strong>{String(school.udise_code).padStart(11, '0')}</strong>.
                </p>
              </div>
              <div className="facilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                {FACILITIES.map(f => {
                  const { status, label } = getFacilityStatus(school, f.key);
                  const statusColor = status === 'available' ? '#10B981' : status === 'verify' ? '#94A3B8' : '#EF4444';
                  return (
                    <div key={f.key} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 500 }}>{f.label}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor, marginTop: 1 }}>{label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.6, marginTop: 4 }}>
                Before visiting any school, check if separate toilets for boys and girls are working, and whether drinking water is available. You can also ask the Block Education Officer (BEO) in {school.block} for an inspection report.
              </p>
            </div>

            {/* Nearby Schools */}
            {nearby.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  🏫 Nearby Schools in {school.village}
                </h2>
                <div className="nearby-schools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {nearby.map(nb => (
                    <Link key={nb.udise_code} href={nb.url || '#'} style={{ textDecoration: 'none' }}>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', background: '#F8FAFC', transition: 'border-color 0.15s' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E293B', marginBottom: 4, lineHeight: 1.3 }}>{nb.school_name}</div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>{nb.school_category}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{nb.village}</span>
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#94A3B8' }}>UDISE: {nb.udise_code}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* RTE Section */}
            <div id="admissions" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                📜 RTE Admission — Enrolling Your Child
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 14 }}>
                Under the RTE Act (2009), every child aged 6 to 14 has the right to free education. {rte.isGovt ? 'This is already a government school — admission here is free.' : `This is a private school. Under RTE, it must give 25% of Class 1 seats free to children from low-income families in ${school.village} and nearby areas.`}
              </p>

              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: '0.825rem', color: '#1E40AF', margin: 0, fontWeight: 700, marginBottom: 4 }}>📅 Admission Timeline Alert</p>
                <p style={{ fontSize: '0.825rem', color: '#1E3A8A', margin: 0, lineHeight: 1.6 }}>{rte.schedule}</p>
              </div>

              {rte.stepsGovt.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1E40AF', color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: step.replace(/^([^—]+)/, '<strong>$1</strong>') }} />
                </div>
              ))}
              <div className="highlight-box orange">
                <p><strong>RTE 25% Quota:</strong> {rte.rteQuota}</p>
              </div>
            </div>

            {/* Ad */}
            <AdSlot size="responsive" />

            {/* Reviews Section */}
            <div id="reviews">
              <SchoolReviews udiseCode={school.udise_code} schoolName={school.school_name} />
            </div>

            {/* FAQ */}
            <div id="faqs" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>FAQs</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {faqs.map(({ q, a }) => (
                  <details key={q} className="faq-item">
                    <summary>
                      <span className="faq-q">
                        <span style={{ color: '#1E40AF', flexShrink: 0 }}>✅</span>
                        {q}
                      </span>
                    </summary>
                    <p className="faq-a" dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </details>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚠️ Disclaimer</div>
              <p style={{ fontSize: '0.775rem', color: '#78350F', lineHeight: 1.75 }}>
                The information on this page is sourced from UDISE+, published by the Ministry of Education, Government of India, and from Census of India demographic data. SchoolsPedia.in is an independent information platform and is not affiliated with, endorsed by, or officially connected to the Ministry of Education or any state education department. All data is for informational purposes only. Always verify with the school directly or your Block Education Officer (BEO) before making enrollment decisions.
              </p>
            </div>

            {/* Breadcrumb trail */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>🗺 You are here</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Home', href: '/' },
                  { label: school.state, href: `/schools/${stateSlug}` },
                  { label: school.district, href: `/schools/${stateSlug}/${districtSlug}` },
                  { label: school.block, href: `/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
                  { label: school.village, href: `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
                  { label: school.school_name, href: null },
                ].map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>›</span>}
                    {item.href
                      ? <Link href={item.href} style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 500 }}>{item.label}</Link>
                      : <span style={{ fontSize: '0.8rem', color: '#1E293B', fontWeight: 700 }}>{item.label}</span>
                    }
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* At a Glance */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>School at a glance</div>
              {[
                ['Category', school.school_category, '#1E40AF'],
                ['Type', school.school_type, '#0D9488'],
                ['Management', school.national_mgmt?.replace('Department of Education', 'Dept. of Education'), '#1E293B'],
                ['Location', school.location, '#16A34A'],
                ['Status', school.school_status, isOperational ? '#10B981' : '#EF4444'],
                ['UDISE Code', String(school.udise_code).padStart(11, '0'), '#1E40AF'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: '0.78rem', textAlign: 'right', maxWidth: 140 }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {['📱 Share', '📋 Copy', '🖨️ Print'].map(btn => (
                  <button key={btn} style={{ flex: 1, border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: 7, padding: '7px 4px', fontSize: '0.7rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>{btn}</button>
                ))}
              </div>
            </div>

            {/* Location */}
            {districtStats?.dist_avg_lat && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>📍 Location</div>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 24 }}>📍</span>
                  <div style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600 }}>{school.village}, {school.block}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>{Number(districtStats.dist_avg_lat).toFixed(4)}°N, {Number(districtStats.dist_avg_long).toFixed(4)}°E</div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>🔗 Quick Links</div>
              {[
                [`Schools in ${school.village}`, `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}`],
                [`${school.block} block schools`, `/schools/${stateSlug}/${districtSlug}/${blockSlug}`],
                [`${school.district} district schools`, `/schools/${stateSlug}/${districtSlug}`],
                [`${school.school_category} schools in ${school.state}`, `/search?state=${stateSlug}&category=${school.school_category}`],
                [`${school.state} schools`, `/schools/${stateSlug}`],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 500, textDecoration: 'none' }}>
                  {label} <span>→</span>
                </Link>
              ))}
            </div>

            {/* Ad */}
            <AdSlot size="sidebar" />

            {/* District Stats */}
            <DistrictStats stats={districtStats} districtName={school.district} />

            {/* Error Report */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400E', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>⚠️ Found an error?</div>
              <p style={{ fontSize: '0.775rem', color: '#78350F', lineHeight: 1.6, marginBottom: 10 }}>If any detail on this page is incorrect, please report it. We review and update within 7 working days.</p>
              <Link href="/contact" style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '9px', borderRadius: 7, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                🚩 Report incorrect data
              </Link>
            </div>

            {/* Ad */}
            <AdSlot size="sidebar" />

            {/* Search */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>🔍 Search schools</div>
              <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                <input type="text" placeholder="School name, UDISE..." style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 10px', fontSize: '0.8rem', background: '#F8FAFC' }} />
                <Link href="/search" style={{ background: '#1E40AF', color: 'white', border: 'none', padding: '9px 12px', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>🔍</Link>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 6 }}>Search from 16.5 lakh+ schools across India</div>
            </div>

            {/* CTA */}
            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: 6 }}>Can&apos;t find your school?</div>
              <div style={{ fontSize: '0.8rem', color: '#BAE6FD', lineHeight: 1.5, marginBottom: 14 }}>Search from 16.5 lakh+ schools across all 36 states</div>
              <Link href="/search" style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🔍 Search all schools
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .jump-link:hover {
          color: #1E40AF !important;
          border-bottom-color: #1E40AF !important;
        }
      `}</style>
    </>
  );
}
