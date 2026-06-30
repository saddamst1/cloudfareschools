import Link from 'next/link';
import AdSlot from '../../components/AdSlot';


export const metadata = {
  title: 'SchoolsPedia Blog — Indian Education Insights & Guides',
  description: 'Read the latest guides and analyses on UDISE codes, RTE admissions, rural education, and schooling infrastructure across India.',
  alternates: { canonical: 'https://www.schoolspedia.in/blog' },
};

const BLOG_POSTS = [
  {
    slug: 'what-is-udise-code',
    tag: 'UDISE Guide',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'What is a UDISE Code? A Complete Guide to India\'s School Tracking System',
    excerpt: 'Ever wondered what the 11-digit UDISE code on your school form actually means? Let me break down how to decode it and why you need it for scholarships.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'rte-admission-guide',
    tag: 'Admissions',
    tagColor: '#7C3AED',
    bg: '#F5F3FF',
    title: 'RTE Admission Guide: How to Get 25% Free Seats in Private Schools',
    excerpt: 'Under the RTE Act, private schools reserve 25% of their seats for children from low-income families. Let\'s see how you can apply step-by-step.',
    meta: '9 min read · Updated: June 5, 2026',
  },
  {
    slug: 'govt-vs-private-schools',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'Government vs Private Schools in India: An Honest Comparison for Parents',
    excerpt: 'Comparing government-run schools and private schools in India is not easy. Let\'s look at teacher ratios, facilities, and costs to help you decide.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'rural-education-india',
    tag: 'Rural India',
    tagColor: '#F97316',
    bg: '#FFF7ED',
    title: 'Rural Education in India: Key Demographic Trends and Infrastructure Progress',
    excerpt: 'With most of India living in villages, our overall literacy rate depends on rural schools. Let\'s see how village education is changing.',
    meta: '7 min read · Updated: June 5, 2026',
  },
  {
    slug: 'school-board-systems-india',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'Understanding the School Board Systems in India: CBSE, ICSE, State Boards, and NIOS',
    excerpt: 'Confused between CBSE, ICSE, NIOS, or State Board? Learn the core differences in syllabus, exams, and future scope to make the right choice.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'check-school-facilities',
    tag: 'Infrastructure',
    tagColor: '#F97316',
    bg: '#FFF7ED',
    title: 'How to Check School Facilities and Swachh Vidyalaya Standards Using UDISE',
    excerpt: 'Learn how to inspect clean drinking water, separate toilets, playgrounds, and safety setups of any school online using official database parameters.',
    meta: '6 min read · Updated: June 5, 2026',
  },
  {
    slug: 'nsp-scholarship-guide',
    tag: 'Scholarships',
    tagColor: '#BE123C',
    bg: '#FFF1F2',
    title: 'NSP Scholarship Portal: How to Use School UDISE Codes to Apply for Scholarships',
    excerpt: 'Step-by-step guide to applying for central and state scholarships on the National Scholarship Portal (NSP) using your school\'s UDISE code.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'pm-poshan-scheme',
    tag: 'Government Schemes',
    tagColor: '#166534',
    bg: '#F0FDF4',
    title: 'Understanding the PM POSHAN Scheme: Mid-Day Meals in Indian Government Schools',
    excerpt: 'How the mid-day meal scheme operates, its nutritional guidelines, benefits for student retention, and how community members monitor food quality.',
    meta: '7 min read · Updated: June 5, 2026',
  },
  {
    slug: 'school-infrastructure-checklist',
    tag: 'Infrastructure',
    tagColor: '#F97316',
    bg: '#FFF7ED',
    title: 'School Infrastructure Checklist: 10 Things to Verify Before Enrolling Your Child',
    excerpt: 'Before paying admission fees, use our 10-point checklist to physically verify classroom space, laboratory safety, toilets, and drinking water facilities.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'kvs-admissions-guide',
    tag: 'Admissions',
    tagColor: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Kendriya Vidyalaya (KVS) Admissions Guide: Eligibility, Quotas, and How to Apply',
    excerpt: 'Learn the admission categories, age criteria, reservation quotas (like Single Girl Child), and online application steps for KVS schools.',
    meta: '9 min read · Updated: June 5, 2026',
  },
  {
    slug: 'nvs-admissions-guide',
    tag: 'Admissions',
    tagColor: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Jawahar Navodaya Vidyalaya (NVS) Admissions: Residential Quality Schooling for Rural Talents',
    excerpt: 'How rural students can secure fully-funded quality education, entrance exam details (JNVST), eligibility rules, and boarding facilities.',
    meta: '9 min read · Updated: June 5, 2026',
  },
  {
    slug: 'school-categories-india',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'A Guide to School Categories in India: Primary, Upper Primary, Secondary, and Higher Secondary',
    excerpt: 'Understand class divisions (1-5, 6-8, 9-10, 11-12), age limits, administrative structures, and how NEP 2020 affects these categories.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'coed-vs-single-sex-schools',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'Co-educational vs Single-Sex Schools in India: Which is Better for Your Child?',
    excerpt: 'An objective look at social skills, confidence levels, stereotypes, academic performance, and practical pros and cons of both school environments.',
    meta: '7 min read · Updated: June 5, 2026',
  },
  {
    slug: 'pupil-teacher-ratio-ptr',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'Teacher-Student Ratio (PTR) in Indian Schools: Why It Matters for Your Child\'s Learning',
    excerpt: 'Learn the legal PTR limits under the RTE Act and understand how smaller class sizes impact individual attention and student performance.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'municipal-corporation-schools',
    tag: 'Education',
    tagColor: '#0D9488',
    bg: '#F0FDFA',
    title: 'Navigating Admissions in Municipal Corporation Schools: Delhi, Mumbai, and Bangalore',
    excerpt: 'How to enroll in MCD, BMC, or BBMP municipal schools. We cover registration steps, free materials, scholarship benefits, and facilities.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-uttar-pradesh',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Complete Guide to Schools in Uttar Pradesh: UDISE, Boards, and RTE Admissions',
    excerpt: 'Navigate the massive school education system of UP. Learn about the UP Board, CBSE options, and step-by-step RTE admission portals.',
    meta: '9 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-madhya-pradesh',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Education in Madhya Pradesh: Exploring Govt vs Private Schools and Literacy',
    excerpt: 'An overview of MP\'s school directory, literacy rates, KVS/NVS presence, and the flagship CM Rise government schools initiative.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-maharashtra',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Schools in Maharashtra: A Parent\'s Guide to School Boards & Admissions',
    excerpt: 'Comparing State Board (SSC) vs CBSE/ICSE in Maharashtra, compulsory Marathi syllabus rules, and the online RTE 25% admission process.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-bihar',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Bihar School Education System: Quality, Facilities, and RTE Quota Seats',
    excerpt: 'A review of primary and secondary schooling in Bihar, school infrastructure data, literacy growth, and details on RTE admission seats.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-rajasthan',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Rajasthan School System: Literacy, UDISE Tracking, and Navodaya Vidyalayas',
    excerpt: 'Explore boarding school formats like KGBV and Navodaya Vidyalayas, literacy stats, and how to verify UDISE codes of schools in Rajasthan.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-west-bengal',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'West Bengal Schools Directory: Understanding School Categories & Board Choices',
    excerpt: 'Detailed insight into schools in West Bengal, West Bengal State Board vs Central Boards, and checking registration codes.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-karnataka',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Schools in Karnataka: Finding Verified Institutions, CBSE, and State Boards',
    excerpt: 'Navigating KSEAB SSLC/PUC and CBSE schools in Karnataka, school directories in Bangalore/Mysore, and RTE admission portals.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-gujarat',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Gujarat School System: A Complete Guide to UDISE Codes and Admissions',
    excerpt: 'A parent-focused guide comparing GSEB and CBSE in Gujarat, along with the online RTE Gujarat admission portal details.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-delhi',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Delhi School Education: Government vs Private Schools & KVS Directory',
    excerpt: 'Compare Delhi Government schools (RPVVs/SOSEs) and private schools. Learn about the point-based nursery admissions system.',
    meta: '8 min read · Updated: June 5, 2026',
  },
  {
    slug: 'schools-in-tamil-nadu',
    tag: 'State Guides',
    tagColor: '#1E40AF',
    bg: '#EFF6FF',
    title: 'Schools in Tamil Nadu: Choosing the Right Board and Verifying Facilities',
    excerpt: 'Understand Samacheer Kalvi vs CBSE, search for school UDISE codes in Chennai/Coimbatore, and navigate the RTE online registration.',
    meta: '8 min read · Updated: June 5, 2026',
  },
];

export default function BlogIndexPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Blog</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '48px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 0 }}>
            Blog
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', marginTop: 10, lineHeight: 1.5 }}>Guides on UDISE codes, RTE admissions, school boards, and how Indian school data works.</p>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Left Column - Articles Grid (No Thumbnails, Premium Cards) */}
          <div>
            <div className="blog-grid">
              {BLOG_POSTS.map((post, index) => (
                <div 
                  key={post.slug} 
                  className="blog-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="blog-card-link-wrapper">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: post.tagColor, background: post.bg, padding: '3px 10px', borderRadius: 99, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                        {post.tag}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{post.meta.split(' · ')[0]}</span>
                    </div>
                    <h2 className="blog-title-link">
                      {post.title}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                      {post.excerpt}
                    </p>
                    <span className="blog-read-link">
                      Read article <span className="arrow">→</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <AdSlot size="responsive" />
          </div>

          {/* Right Sidebar */}
          <div style={{ position: 'sticky', top: 76 }}>
            {/* Nav Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                🧭 Navigation Index
              </div>
              {[
                ['/', 'Homepage'],
                ['/schools', 'All States Directory'],
                ['/about', 'About Us & Mission'],
                ['/sitemap-page', 'Full Sitemap'],
                ['/contact', 'Report Database Error'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color: '#475569', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>

            <AdSlot size="sidebar" />
          </div>

        </div>
      </div>



      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .blog-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .blog-card:hover {
          transform: translateY(-6px);
          border-color: #3B82F6;
          box-shadow: 0 16px 32px rgba(30, 64, 175, 0.06);
        }
        .blog-card-link-wrapper {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .blog-title-link {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 10px;
          line-height: 1.4;
          transition: color 0.2s ease;
        }
        .blog-card:hover .blog-title-link {
          color: #1E40AF;
        }
        .blog-read-link {
          font-size: 0.825rem;
          color: #1E40AF;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: auto;
        }
        .blog-read-link .arrow {
          transition: transform 0.2s ease;
        }
        .blog-card:hover .blog-read-link .arrow {
          transform: translateX(4px);
        }
        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
