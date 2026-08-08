'use client';
import { useState } from 'react';

export default function TableOfContents({ jumpLinks, lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleJump = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 110; // offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elem.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping abruptly
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.06)',
        transition: 'all 0.2s ease',
        margin: '6px 0 16px 0',
      }}
    >
      {/* Premium Top Accent Gradient Bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #1E40AF 0%, #0D9488 50%, #F97316 100%)' }} />

      {/* Header Container */}
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
          borderBottom: isOpen ? '1px solid #F1F5F9' : 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#EFF6FF',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            📋
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.2px' }}>
                {lang === 'hi' ? 'विषय-सूची (Table of Contents)' : 'Table of Contents'}
              </span>
              <span
                style={{
                  background: '#EFF6FF',
                  color: '#1E40AF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 99,
                  border: '1px solid #BFDBFE',
                }}
              >
                {jumpLinks.length} {lang === 'hi' ? 'भाग' : 'Topics'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, marginTop: 1 }}>
              {lang === 'hi' ? 'किसी भी अनुभाग पर जाने के लिए क्लिक करें' : 'Click any section to jump directly'}
            </p>
          </div>
        </div>

        {/* Hide / Show Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Hide Table of Contents' : 'Show Table of Contents'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: isOpen ? '#FFFFFF' : '#EFF6FF',
            border: isOpen ? '1px solid #CBD5E1' : '1px solid #BFDBFE',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: '0.775rem',
            fontWeight: 700,
            color: isOpen ? '#475569' : '#1E40AF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <span>{isOpen ? '👁️' : '👁️‍🗨️'}</span>
          <span>{isOpen ? (lang === 'hi' ? 'छिपाएं (Hide)' : 'Hide') : (lang === 'hi' ? 'दिखाएं (Show)' : 'Show')}</span>
          <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
      </div>

      {/* Expandable Grid Body */}
      {isOpen && (
        <div style={{ padding: '16px 18px', background: '#FFFFFF' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 10,
            }}
          >
            {jumpLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleJump(e, link.id)}
                className="toc-jump-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  color: '#1E293B',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{link.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.label}</span>
                <span className="toc-arrow" style={{ color: '#94A3B8', fontSize: '0.75rem', transition: 'transform 0.15s ease' }}>↓</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .toc-jump-link:hover {
          background: #EFF6FF !important;
          border-color: #3B82F6 !important;
          color: #1E40AF !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(30, 64, 175, 0.08) !important;
        }
        .toc-jump-link:hover .toc-arrow {
          color: #1E40AF !important;
          transform: translateY(2px);
        }
        @media (max-width: 480px) {
          .toc-jump-link {
            padding: 8px 10px !important;
            font-size: 0.775rem !important;
          }
        }
      `}</style>
    </div>
  );
}
