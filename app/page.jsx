import Link from 'next/link';
import { getAllStates, getHomepageStats } from '../lib/queries';
import { getHomepageMeta, faqSchema, organizationSchema } from '../lib/seo';
import SearchBox from '../components/SearchBox';
import AdSlot from '../components/AdSlot';
import StateCard from '../components/StateCard';


export const revalidate = 86400; // Revalidate once a day

export async function generateMetadata() {
  return getHomepageMeta();
}

const SCHOOL_CATEGORIES = [
  { name: 'Primary Schools',       sub: 'Class 1–5',   color: '#EFF6FF', textColor: '#1E3A8A',  accent: '#1E40AF', icon: '📚', count: '5,20,000+' },
  { name: 'Upper Primary',         sub: 'Class 6–8',   color: '#F0FDFA', textColor: '#134E4A',  accent: '#0D9488', icon: '🏫', count: '3,80,000+' },
  { name: 'Secondary Schools',     sub: 'Class 9–10',  color: '#FFF7ED', textColor: '#7C2D12',  accent: '#F97316', icon: '🎓', count: '2,10,000+' },
  { name: 'Senior Secondary',      sub: 'Class 11–12', color: '#F5F3FF', textColor: '#4C1D95',  accent: '#7C3AED', icon: '🏆', count: '1,40,000+' },
  { name: 'Government Schools',    sub: 'Sarkari',     color: '#F0FDF4', textColor: '#14532D',  accent: '#16A34A', icon: '🏛️', count: '10,50,000+' },
  { name: 'Private Schools',       sub: 'Private',     color: '#FFF1F2', textColor: '#881337',  accent: '#E11D48', icon: '⭐', count: '5,50,000+' },
];

const WHY_CARDS = [
  {
    icon: '🪪', title: 'Get Official UDISE Codes', bg: '#EFF6FF', color: '#1E40AF',
    body: 'Need that 11-digit UDISE code for scholarship forms, NSP, or board exams? Skip the government portals. Type the school name here and copy the verified code in one click.',
  },
  {
    icon: '🗺️', title: 'Every State Covered', bg: '#F0FDFA', color: '#0D9488',
    body: 'From popular urban schools in Delhi to tiny primary schools in remote villages of Assam, we have mapped them all. 36 states and UTs, all in one place.',
  },
  {
    icon: '🏘️', title: 'Search Down to the Village', bg: '#F0FDF4', color: '#166534',
    body: 'Looking for a school nearby? You don\'t have to search only by city. We let you search by village or ward, so you can find a school within walking distance.',
  },
  {
    icon: '🏛️', title: 'Who Runs the School?', bg: '#F5F3FF', color: '#6D28D9',
    body: 'Is it a government school, a private academy, or a central school like KV/Navodaya? We show you the exact management so you know what to expect.',
  },
  {
    icon: '📊', title: 'Local Area Insights', bg: '#FFF1F2', color: '#BE123C',
    body: 'We\'ve combined school data with real Census numbers. Check the literacy rates and gender ratios of any district to understand its educational background.',
  },
  {
    icon: '📜', title: 'RTE 25% Free Admission Guide', bg: '#FFF7ED', color: '#C2410C',
    body: 'Private schools have to reserve 25% of their seats for kids from lower-income families under the RTE Act. We\'ll show you if a school offers this.',
  },
  {
    icon: '🔧', title: 'Check Real Facilities', bg: '#E6F4EA', color: '#137333',
    body: 'Does the school have clean toilets for girls and boys? Is there drinking water, electricity, or a playground? Check these basic details before visiting.',
  },
  {
    icon: '🎓', title: 'Find the School Board', bg: '#FFFBEB', color: '#B06000',
    body: 'Easily check whether a school is affiliated with CBSE, ICSE, NIOS, or the local State Board. Choose the right board without guessing.',
  },
];

const HOME_FAQS = [
  { q: 'How many schools are there in India?', a: 'India has 16,53,159 schools in the UDISE+ database maintained by the Ministry of Education. They range from tiny one-room schools in Himalayan villages to large private schools in cities. We\'ve indexed all of them.' },
  { q: 'How do I find a school\'s UDISE code?', a: 'Type the school name or village name in the search box. Pick the school from the results. The 11-digit UDISE code is the first thing you\'ll see on the school\'s page. Copy it from there.' },
  { q: 'Is the school data on SchoolsPedia accurate?', a: 'All records come directly from the official UDISE+ database managed by the Ministry of Education. We don\'t change or add anything. For admission dates, fee details, or contact numbers, call the school directly — that information changes and we don\'t update it in real-time.' },
  { q: 'Can I search by village name?', a: 'Yes. Our directory goes down to the village level. Type your village name in the search bar and it will show all schools registered under that village in UDISE+. If your village is very small, try the block name instead.' },
  { q: 'What is the difference between school category and school type?', a: 'Category tells you which classes the school teaches. Primary means Class 1 to 5. Upper Primary is 6 to 8. Secondary is up to Class 10. Higher Secondary goes up to Class 12. Type tells you who studies there — co-ed, girls only, or boys only.' },
];

export default async function HomePage() {
  const [stats, states] = await Promise.all([getHomepageStats(), getAllStates()]);
  const faqJsonLd = faqSchema(HOME_FAQS);

  const fmtNum = (n) => n ? Number(n).toLocaleString('en-IN') : '0';

  return (
    <>
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ═══ HERO ═══ */}
      <section className="hero-pattern" style={{ position: 'relative', padding: '64px 24px 72px', textAlign: 'center', overflow: 'visible' }}>
        <div className="hero-grid-overlay" />
        <div style={{ position: 'relative', zIndex: 20 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#2DD4BF', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2.5, padding: '6px 18px', borderRadius: 99, marginBottom: 20, border: '1px solid rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>
            India&apos;s Largest School Directory — {fmtNum(stats?.total_schools)} Verified Schools
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 16, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', letterSpacing: '-1px' }}>
            Find Any School in India by Name, <br />
            <span className="gradient-text-teal">UDISE Code, Village or District</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', marginBottom: 36, lineHeight: 1.6, maxWidth: 700, margin: '0 auto 36px' }}>
            Every school in India has an 11-digit UDISE code — a government registration number that tells you if the school is real. We’ve collected records for 16.5 lakh schools so you can look up any school in seconds, without wading through government portals.
          </p>

          <SearchBox />

          {/* Quick search chips */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['UP Schools', 'Delhi Schools', 'Primary Schools', 'Govt Schools', 'Bihar Schools', 'KVS Schools'].map(chip => (
              <Link key={chip} href={`/search?q=${chip.replace(' ', '+')}`} className="chip-glass" style={{ color: '#E2E8F0', fontSize: '0.8rem', padding: '6px 16px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none' }}>
                🔍 {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: -36, padding: '0 24px' }}>
        <div className="stats-grid animate-float" style={{ maxWidth: 1200, margin: '0 auto', background: 'white', borderRadius: 16, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {[
            { num: `${fmtNum(stats?.total_schools)}+`, label: 'Verified Schools', color: '#1E40AF', desc: 'Direct from official Ministry of Education UDISE+' },
            { num: '36',                                label: 'States & UTs',  color: '#0D9488', desc: '100% geographic coverage across India' },
            { num: `${fmtNum(stats?.total_districts)}+`,label: 'Mapped Districts',     color: '#1E40AF', desc: 'Enriched with Census demographic statistics' },
            { num: `${fmtNum(stats?.total_villages)}+`, label: 'Indexed Villages',      color: '#F97316', desc: 'Granular rural primary directories' },
          ].map(({ num, label, color, desc }) => (
            <div key={label} style={{ padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="stats-card-border">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1.1 }}>{num}</div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E293B', marginTop: 6 }}>{label}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 3, lineHeight: 1.35 }}>{desc}</div>
            </div>
          ))}
        </div>
        <style>{`
          .stats-card-border { border-right: 1px solid #F1F5F9; }
          .stats-card-border:last-child { border-right: none; }
          @media (max-width: 768px) {
            .stats-card-border { border-right: none; border-bottom: 1px solid #F1F5F9; }
            .stats-card-border:last-child { border-bottom: none; }
          }
        `}</style>
      </div>

      {/* ═══ AD LEADERBOARD ═══ */}
      <div style={{ background: 'white', padding: '8px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdSlot size="leaderboard" />
        </div>
      </div>

      {/* ═══ STATES GRID ═══ */}
      <section style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#1E293B' }}>Browse schools by state</h2>
            <Link href="/schools" style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 600 }}>View all 36 states →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {states.slice(0, 14).map((state, i) => (
              <div key={state.state_slug} className={`animate-fade-up stagger-${(i % 8) + 1}`}>
                <StateCard state={state} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED DISTRICTS ═══ */}
      <section style={{ background: '#F8FAFC', padding: '32px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#1E293B' }}>
                Featured Districts & Cities
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 2 }}>
                Explore local schools, regional demographics, and literacy indicators in major districts
              </p>
            </div>
            <Link href="/schools/districts" style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 650 }}>
              All Districts →
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { name: 'Pune', state: 'Maharashtra', schools: '7,860+', literacy: '86.1%', slug: 'maharashtra/pune', bg: '#EFF6FF', accent: '#1E40AF', icon: '🏛️' },
              { name: 'Jaipur', state: 'Rajasthan', schools: '6,520+', literacy: '75.5%', slug: 'rajasthan/jaipur', bg: '#FFF7ED', accent: '#F97316', icon: '🏰' },
              { name: 'Lucknow', state: 'Uttar Pradesh', schools: '5,940+', literacy: '77.3%', slug: 'uttar-pradesh/lucknow', bg: '#F0FDF4', accent: '#16A34A', icon: '📜' },
              { name: 'Patna', state: 'Bihar', schools: '5,260+', literacy: '70.7%', slug: 'bihar/patna', bg: '#F5F3FF', accent: '#7C3AED', icon: '📚' },
              { name: 'Bengaluru U South', state: 'Karnataka', schools: '4,080+', literacy: '88.6%', slug: 'karnataka/bengaluru-u-south', bg: '#F0FDFA', accent: '#0D9488', icon: '💻' },
              { name: 'Mumbai (Suburban)', state: 'Maharashtra', schools: '2,750+', literacy: '89.9%', slug: 'maharashtra/mumbai-suburban', bg: '#FFF1F2', accent: '#E11D48', icon: '🏙️' },
              { name: 'Kolkata', state: 'West Bengal', schools: '3,920+', literacy: '87.1%', slug: 'west-bengal/kolkata', bg: '#FFFBEB', accent: '#D97706', icon: '🌉' },
              { name: 'Ahmedabad', state: 'Gujarat', schools: '4,340+', literacy: '85.3%', slug: 'gujarat/ahmedabad', bg: '#F0FDFA', accent: '#0891B2', icon: '🏗️' },
            ].map((dist, i) => (
              <div key={dist.name} className={`animate-fade-up stagger-${(i % 6) + 1}`}>
                <Link href={`/schools/${dist.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card glow-card" style={{ padding: '16px 18px', cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: 14, height: '100%' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: dist.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                      {dist.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>{dist.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: 2 }}>{dist.state}</div>
                      <div style={{ display: 'flex', gap: 10, fontSize: '0.725rem', color: dist.accent, fontWeight: 600, marginTop: 6 }}>
                        <span>🏫 {dist.schools} schools</span>
                        <span>📈 {dist.literacy} literacy</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section style={{ background: '#F8FAFC', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.15rem', fontWeight: 700 }}>Explore by school category</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {SCHOOL_CATEGORIES.map((cat, i) => (
              <div key={cat.name} className={`animate-fade-up stagger-${(i % 6) + 1}`}>
                <Link href={`/search?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                  <div className="category-card" style={{ background: cat.color, border: `1px solid ${cat.accent}22`, borderRadius: 10, padding: '18px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: cat.textColor }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: cat.accent, marginTop: 4 }}>{cat.count} schools</div>
                    {cat.sub && <div style={{ fontSize: '0.7rem', color: cat.textColor, opacity: 0.7, marginTop: 2 }}>{cat.sub}</div>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW TO FIND ═══ */}
      <section style={{ background: 'white', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>How to Find Your School in 4 Simple Clicks</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Follow our structured geographic hierarchy down to the school level</p>
          </div>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '36px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { num: 1, label: 'Select State',  sub: 'Pick from any of the 36 states & UTs', bg: '#1E40AF', icon: '🗺️' },
                { num: 2, label: 'Pick District', sub: 'Find the correct district in that state', bg: '#1E40AF', icon: '📍' },
                { num: 3, label: 'Choose Block',  sub: 'Narrow down to the local block or town', bg: '#0D9488', icon: '🏘️' },
                { num: 4, label: 'Get School Details',   sub: 'See UDISE codes, facilities, and board info instantly', bg: '#F97316', icon: '🏫' },
              ].map(step => (
                <div key={step.num} className="step-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: step.bg, color: 'white', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 10px rgba(30,64,175,0.15)' }}>{step.num}</div>
                  <div style={{ fontSize: 24, marginBottom: 8, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>{step.icon}</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.45 }}>{step.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, textAlign: 'center' }}>
              <Link href="/schools" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: 10, textDecoration: 'none' }}>
                Start exploring directory →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AD RESPONSIVE ═══ */}
      <div style={{ padding: '8px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdSlot size="responsive" />
        </div>
      </div>

      {/* ═══ WHY SCHOOLSPEDIA ═══ */}
      <section style={{ background: '#F8FAFC', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Why use SchoolsPedia.in?</h2>
            <p style={{ fontSize: '0.925rem', color: '#64748B', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
              We list verified school records directly from UDISE+ and Census of India. No guesswork or outdated estimates.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
            {WHY_CARDS.map((card, i) => (
              <div key={card.title} className={`card animate-fade-up stagger-${(i % 8) + 1}`} style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>

          {/* Content Block */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 12, borderBottom: '2px solid #EFF6FF' }}>
              📚 How the Indian School System Works: A Simple Guide for Parents
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
              If you are a parent trying to plan your child&apos;s education, the Indian school system can feel like a maze. Let me break down the different school levels and management styles in very simple terms so you can make the best decision.
            </p>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E40AF', margin: '18px 0 6px' }}>1. Primary Schools (Class 1 to 5)</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
              This is where your child&apos;s schooling journey starts. Primary schools focus on basic reading, writing, and math. Here is a useful tip: Under the landmark <strong>Right to Education (RTE) Act</strong>, every child in India aged 6 to 14 has the right to free education. Currently, India has over <strong>5.2 Lakh primary schools</strong>, mostly run by local governments.
            </p>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0D9488', margin: '18px 0 6px' }}>2. Upper Primary / Middle Schools (Class 6 to 8)</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
              Upper Primary (or middle) schools cover Class 6 to 8. They act as a bridge between basic primary learning and high school. In rural areas, middle schools are usually built close to primary schools so children don&apos;t have to travel far. There are about <strong>3.8 Lakh middle schools</strong> operating in India.
            </p>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F97316', margin: '18px 0 6px' }}>3. Secondary & Senior Secondary Schools (Class 9 to 12)</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
              These are the crucial board exam years. Secondary schools cover Class 9 and 10, ending with the Class 10 board exams. Senior Secondary schools cover Class 11 and 12, where students prepare for college. This is when you need to pay close attention to the school&apos;s board affiliation (like <strong>CBSE</strong>, <strong>ICSE</strong>, or the local <strong>State Board</strong>).
            </p>

            <div style={{ background: '#EFF6FF', borderLeft: '3px solid #1E40AF', borderRadius: '0 8px 8px 0', padding: '12px 18px', margin: '16px 0' }}>
              <p style={{ fontSize: '0.825rem', color: '#1E3A8A', margin: 0, lineHeight: 1.6 }}>
                <strong>Quick Stat:</strong> India has more government-run schools (<strong>10.5 Lakh</strong>) than private schools (<strong>5.5 Lakh</strong>). However, private school enrollment has been rising rapidly in urban areas over the last decade.
              </p>
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#7C3AED', margin: '18px 0 6px' }}>Who Manages These Schools? (The 4 Main Categories)</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
              Not all schools are run the same way. In India, you will find four main types of schools:
            </p>
            <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Government Schools (Sarkari)</strong>: Run by the state government or local municipal corporations. They offer free education, uniforms, books, and mid-day meals.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Private Aided Schools</strong>: These are managed by private trusts but get financial funding from the government. They follow government rules and charge very low fees.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Private Unaided Schools</strong>: Fully private schools that run entirely on the fees they charge. They usually have better facilities but cost more.
              </li>
              <li style={{ marginBottom: 0 }}>
                <strong>KV & NVS (Central Government)</strong>: Kendriya Vidyalayas (KVS) are mainly for central government employees who transfer often. Jawahar Navodaya Vidyalayas (NVS) are special free boarding schools for bright kids in rural areas.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: 'white', borderTop: '1px solid #E2E8F0', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>FAQs</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {HOME_FAQS.map(({ q, a }) => (
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
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Latest insights from our blog</h2>
            <Link href="/blog" style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 600 }}>View all articles →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { tag: 'UDISE Guide', tagColor: '#1E40AF', bg: '#EFF6FF', icon: '🪪', title: 'What is UDISE Code? Complete guide for parents & students', meta: '8 min read · Jan 2026', href: '/blog/what-is-udise-code' },
              { tag: 'Education', tagColor: '#0D9488', bg: '#F0FDFA', icon: '🏫', title: 'Government vs Private schools in India — an honest comparison', meta: '10 min read · Feb 2026', href: '/blog/govt-vs-private-schools' },
              { tag: 'Rural India', tagColor: '#F97316', bg: '#FFF7ED', icon: '📍', title: 'Rural education in India — the real picture, challenges and progress', meta: '12 min read · Mar 2026', href: '/blog/rural-education-india' },
              { tag: 'Admissions', tagColor: '#7C3AED', bg: '#F5F3FF', icon: '📝', title: 'RTE Admission 2026-27: How to apply for 25% free seats', meta: '6 min read · Apr 2026', href: '/blog/rte-admission-guide' },
            ].map((post, i) => (
              <Link key={post.title} href={post.href} style={{ textDecoration: 'none' }} className={`animate-fade-up stagger-${i + 1}`}>
                <div className="card glow-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 14, background: 'white', overflow: 'hidden' }}>
                  <div style={{ height: 100, width: '100%', background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, filter: 'saturate(0.9)' }}>{post.icon}</div>
                  <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 750, color: post.tagColor, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>{post.tag}</div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.45, marginBottom: 10, flex: 1 }}>{post.title}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: 8, marginTop: 'auto' }}>{post.meta}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AD RESPONSIVE ═══ */}
      <div style={{ padding: '8px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdSlot size="responsive" />
        </div>
      </div>



      <style>{`
        @media (max-width: 640px) {
          /* Stats bar — 2x2 on mobile */
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          /* Steps — 2x2 on mobile */
        }
      `}</style>
    </>
  );
}
