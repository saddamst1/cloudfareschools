import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdSlot from '../../../components/AdSlot';
import { breadcrumbSchema } from '../../../lib/seo';
import { AUTHORS } from '../../../data/authors';


export const revalidate = 86400; // Revalidate daily

// Dynamic components map for 25 articles
const ArticleComponents = {
  'what-is-udise-code': dynamic(() => import('../../../data/articles/what-is-udise-code')),
  'rte-admission-guide': dynamic(() => import('../../../data/articles/rte-admission-guide')),
  'govt-vs-private-schools': dynamic(() => import('../../../data/articles/govt-vs-private-schools')),
  'rural-education-india': dynamic(() => import('../../../data/articles/rural-education-india')),
  'school-board-systems-india': dynamic(() => import('../../../data/articles/school-board-systems-india')),
  'check-school-facilities': dynamic(() => import('../../../data/articles/check-school-facilities')),
  'nsp-scholarship-guide': dynamic(() => import('../../../data/articles/nsp-scholarship-guide')),
  'pm-poshan-scheme': dynamic(() => import('../../../data/articles/pm-poshan-scheme')),
  'school-infrastructure-checklist': dynamic(() => import('../../../data/articles/school-infrastructure-checklist')),
  'kvs-admissions-guide': dynamic(() => import('../../../data/articles/kvs-admissions-guide')),
  'nvs-admissions-guide': dynamic(() => import('../../../data/articles/nvs-admissions-guide')),
  'school-categories-india': dynamic(() => import('../../../data/articles/school-categories-india')),
  'coed-vs-single-sex-schools': dynamic(() => import('../../../data/articles/coed-vs-single-sex-schools')),
  'pupil-teacher-ratio-ptr': dynamic(() => import('../../../data/articles/pupil-teacher-ratio-ptr')),
  'municipal-corporation-schools': dynamic(() => import('../../../data/articles/municipal-corporation-schools')),
  'schools-in-uttar-pradesh': dynamic(() => import('../../../data/articles/schools-in-uttar-pradesh')),
  'schools-in-madhya-pradesh': dynamic(() => import('../../../data/articles/schools-in-madhya-pradesh')),
  'schools-in-maharashtra': dynamic(() => import('../../../data/articles/schools-in-maharashtra')),
  'schools-in-bihar': dynamic(() => import('../../../data/articles/schools-in-bihar')),
  'schools-in-rajasthan': dynamic(() => import('../../../data/articles/schools-in-rajasthan')),
  'schools-in-west-bengal': dynamic(() => import('../../../data/articles/schools-in-west-bengal')),
  'schools-in-karnataka': dynamic(() => import('../../../data/articles/schools-in-karnataka')),
  'schools-in-gujarat': dynamic(() => import('../../../data/articles/schools-in-gujarat')),
  'schools-in-delhi': dynamic(() => import('../../../data/articles/schools-in-delhi')),
  'schools-in-tamil-nadu': dynamic(() => import('../../../data/articles/schools-in-tamil-nadu')),
};

import { ARTICLE_DATA } from '../../../data/articles-data';

export async function generateStaticParams() {
  return Object.keys(ARTICLE_DATA).map(slug => ({ slug }));
}

export function getFeaturedImage(slug) {
  return `/blog-images/${slug}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLE_DATA[slug];
  if (!article) return { title: 'Article Not Found | SchoolsPedia' };

  const imageUrl = `https://www.schoolspedia.in${getFeaturedImage(slug)}`;

  return {
    title: `${article.title} | SchoolsPedia Blog`,
    description: article.description,
    alternates: { canonical: `https://www.schoolspedia.in/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://www.schoolspedia.in/blog/${slug}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: article.altText || article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = ARTICLE_DATA[slug];

  if (!article) notFound();

  // Dynamically map author based on post slug
  const isStateGuide = slug.startsWith('schools-in-');
  const authorSlug = isStateGuide ? 'schoolspedia-editorial' : 'sahajul';
  const authorObj = AUTHORS[authorSlug] || AUTHORS['schoolspedia-editorial'];

  // Recommendations (all other articles, capped at 10 to keep sidebar clean)
  const recommendations = Object.entries(ARTICLE_DATA)
    .filter(([k]) => k !== slug)
    .slice(0, 10)
    .map(([k, v]) => ({ slug: k, ...v }));

  const ArticleComponent = ArticleComponents[slug];

  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: article.title, url: `/blog/${slug}` },
  ]);

  const imageUrl = `https://www.schoolspedia.in${getFeaturedImage(slug)}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: imageUrl,
    datePublished: '2026-06-05T00:00:00.000Z',
    dateModified: '2026-06-06T00:00:00.000Z',
    author: {
      '@type': 'Person',
      name: authorObj.name,
      url: `https://www.schoolspedia.in/blog/author/${authorSlug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SchoolsPedia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.schoolspedia.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.schoolspedia.in/blog/${slug}`,
    },
  };

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />

      {/* Breadcrumbs */}
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Read Article</span>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '48px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2DD4BF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            {article.icon} {article.tag}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: 14, maxWidth: 900 }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: '0.825rem' }}>
            <span style={{ color: '#BAE6FD' }}>
              Written by: <Link href={`/blog/author/${authorSlug}`} style={{ color: 'white', fontWeight: 700, textDecoration: 'none' }}>{authorObj.name}</Link>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ color: '#BAE6FD' }}>{article.meta}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Left Main Article Column */}
          <article>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px 40px', marginBottom: 24 }}>
              
              {/* Introduction Card */}
              <p style={{ fontSize: '1.05rem', color: '#1E293B', fontWeight: 500, lineHeight: 1.75, borderBottom: '1px dashed #E2E8F0', paddingBottom: 20, marginBottom: 24 }}>
                {article.description}
              </p>

              {/* Featured Image */}
              <div style={{ position: 'relative', width: '100%', height: 'auto', maxHeight: 400, overflow: 'hidden', borderRadius: 8, marginBottom: 24 }}>
                <img 
                  src={getFeaturedImage(slug)} 
                  alt={article.altText || article.title} 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                />
              </div>

              {/* Main Content Body */}
              <div className="article-body">
                {ArticleComponent ? <ArticleComponent /> : null}
              </div>

            </div>

            <AdSlot size="responsive" />
          </article>

          {/* Right Sidebar */}
          <div style={{ position: 'sticky', top: 76 }}>
            {/* Table of Contents Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                📌 Other Blog Guides
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recommendations.map(rec => (
                  <Link key={rec.slug} href={`/blog/${rec.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: rec.tagColor, textTransform: 'uppercase', marginBottom: 2 }}>{rec.tag}</div>
                      <div className="sidebar-rec-title">
                        {rec.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                🔗 Navigation
              </div>
              {[
                ['/', 'Homepage'],
                ['/schools', 'State Directories'],
                ['/sitemap-page', 'Full Sitemap'],
                ['/about', 'About Us'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '6px 0', fontSize: '0.825rem', color: '#1E40AF', textDecoration: 'none' }}>
                  {label} →
                </Link>
              ))}
            </div>

            <AdSlot size="sidebar" />
          </div>

        </div>
      </div>



      <style>{`
        .sidebar-rec-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.35;
          transition: color 0.15s ease;
        }
        .sidebar-rec-title:hover {
          color: #1E40AF !important;
        }
        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          article > div {
            padding: 20px !important;
          }
        }
        .article-body h1, .article-body h2, .article-body h3 {
          font-family: 'Outfit', sans-serif;
          color: #1E293B;
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .article-body h1 { font-size: 1.6rem; }
        .article-body h2 { font-size: 1.35rem; }
        .article-body h3 { font-size: 1.15rem; }
        .article-body p {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.8;
          margin-bottom: 18px;
        }
        .article-body ul, .article-body ol {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.8;
          padding-left: 24px;
          margin-bottom: 18px;
        }
        .article-body li {
          margin-bottom: 8px;
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          margin: 20px 0;
        }
        .article-body th {
          background: #F8FAFC;
          border-bottom: 2px solid #E2E8F0;
          color: #1E293B;
          font-weight: 700;
          padding: 10px 12px;
          text-align: left;
        }
        .article-body td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #475569;
        }
        .article-body tr:hover td {
          background: #F8FAFC;
        }
      `}</style>
    </>
  );
}
