"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthorBox() {
  const pathname = usePathname();

  // Hide duplicate author box on the about page
  if (pathname === '/about') {
    return null;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto 20px auto', padding: '0 24px' }}>
      <div style={{
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid #E2E8F0'
        }}>
          <Image 
            src="/authors/sahajul.jpg" 
            alt="Sahajul - Founder of SchoolsPedia" 
            width={76} 
            height={76} 
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 250 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0D9488', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
            Founder & Chief Editor
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#1E293B', fontFamily: 'var(--font-heading), sans-serif' }}>
            Sahajul
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
            Living in Tezpur, Assam, India, Sahajul is a passionate blogger who has been writing content online for more than 14 years. He started SchoolsPedia to make it easy for parents to search and read about schools without getting confused by complicated government lists.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
              Learn more about our team →
            </Link>
            <span style={{ color: '#CBD5E1', userSelect: 'none' }}>|</span>
            <a href="https://x.com/saddamh58509953" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Follow on X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
