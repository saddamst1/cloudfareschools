'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="32" height="28" viewBox="0 0 80 72" aria-hidden="true">
              <path d="M2 52 Q2 4 12 4 L40 10 L40 66 L12 62 Q2 62 2 52Z" fill="#1E40AF"/>
              <path d="M42 10 L68 4 Q78 4 78 12 L78 56 Q78 64 68 64 L42 66Z" fill="#0D9488"/>
              <line x1="41" y1="9" x2="41" y2="67" stroke="white" strokeWidth="3"/>
              <circle cx="68" cy="18" r="13" fill="#F97316"/>
              <circle cx="68" cy="18" r="5.5" fill="white"/>
              <path d="M63 27 L68 42 L73 27" fill="#F97316"/>
            </svg>
            <span className="logo-text">Schools<span className="teal">Pedia</span><span style={{ color: '#F97316' }}>.in</span></span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hidden-mobile">
          <Link href="/schools" style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>States</Link>
          <Link href="/schools/districts" style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>Districts</Link>
          <Link href="/blog" style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>Blog</Link>
          <Link href="/about" style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>About</Link>
          <Link href="/search" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.8rem', borderRadius: 8, textDecoration: 'none' }}>Find My School</Link>
        </div>

        {/* Mobile menu button — always at far right corner */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', marginLeft: 'auto', flexShrink: 0 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <span style={{ fontSize: 18 }}>{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{ 
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          zIndex: 99,
          display: 'flex', 
          flexDirection: 'column', 
          gap: 12, 
          padding: '16px 20px', 
          background: 'white', 
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }} className="visible-mobile">
          <Link href="/schools" onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none' }}>States</Link>
          <Link href="/schools/districts" onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none' }}>Districts</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none' }}>Blog</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none' }}>About</Link>
          <Link href="/search" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', borderRadius: 8, textDecoration: 'none', textAlign: 'center' }}>Find My School</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .visible-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
