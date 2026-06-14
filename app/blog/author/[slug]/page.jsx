import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AUTHORS } from '../../../../data/authors';
import { ARTICLE_DATA } from '../../../../data/articles-data';
import { getFeaturedImage } from '../../[slug]/page';
import AdSlot from '../../../../components/AdSlot';
import AuthorBox from '../../../../components/AuthorBox';

// Pre-render the author routes at build time
export async function generateStaticParams() {
  return [
    { slug: 'sahajul' },
    { slug: 'schoolspedia-editorial' },
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) return { title: 'Author Not Found | SchoolsPedia' };
  
  return {
    title: `${author.name} — Author Profile | SchoolsPedia`,
    description: `Read articles and research guides published by ${author.name}, ${author.role} at SchoolsPedia.`,
    alternates: { canonical: `https://www.schoolspedia.in/blog/author/${slug}` },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = AUTHORS[slug];

  if (!author) notFound();

  // Simple mock association of articles to show on author page
  const authorPosts = [
    { slug: 'what-is-udise-code', title: 'What is a UDISE Code? A Complete Guide to India\'s School Tracking System', tag: 'UDISE Guide', date: 'Updated: June 5, 2026' },
    { slug: 'rte-admission-guide', title: 'RTE Admission Guide: How to Get 25% Free Seats in Private Schools', tag: 'Admissions', date: 'Updated: June 5, 2026' },
    { slug: 'school-board-systems-india', title: 'Understanding the School Board Systems in India: CBSE, ICSE, State Boards, and NIOS', tag: 'Education', date: 'Updated: June 5, 2026' },
    { slug: 'nsp-scholarship-guide', title: 'NSP Scholarship Portal: How to Use School UDISE Codes to Apply for Scholarships', tag: 'Scholarships', date: 'Updated: June 5, 2026' },
  ];

  return (
    <>
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">{author.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Main profile details column */}
          <div>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px', marginBottom: 24 }}>
              
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '1px solid #F1F5F9', paddingBottom: 24, marginBottom: 24 }}>
                {/* Author Avatar Image box */}
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', flexShrink: 0 }}>
                  {author.image ? (
                    <img src={author.image} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>{slug === 'harsh-agrawal' ? '👨‍🏫' : '✍️'}</span>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {author.name}
                  </h1>
                  <p style={{ fontSize: '0.875rem', color: '#0D9488', fontWeight: 700, marginTop: 4 }}>
                    {author.role}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2, fontFamily: 'monospace' }}>
                    🎓 {author.credentials}
                  </p>
                  
                  {/* Social links */}
                  {Object.keys(author.social).length > 0 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      {author.social.linkedin && (
                        <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#1E40AF', textDecoration: 'none', fontWeight: 600 }}>
                          🔗 LinkedIn Profile
                        </a>
                      )}
                      {author.social.twitter && (
                        <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#1E40AF', textDecoration: 'none', fontWeight: 600 }}>
                          🐦 Twitter
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>Biography</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 0 }}>
                {author.bio}
              </p>

            </div>

            {/* Posts by this author list */}
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                Articles Published by {author.name}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {authorPosts.map(post => (
                  <div key={post.slug} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1E40AF', background: '#EFF6FF', padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {post.tag}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginTop: 10, marginBottom: 8 }}>
                      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{post.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <AdSlot size="responsive" style={{ marginTop: 24 }} />
          </div>

          {/* Right Sidebar */}
          <div>
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

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 32px' }}>
        <AuthorBox />
      </div>
    </>
  );
}
