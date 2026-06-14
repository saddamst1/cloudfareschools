"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthorBox() {
  const pathname = usePathname();

  // Hide AuthorBox on About page, Blog detail pages, and Author profile pages to prevent duplicate bios
  if (pathname === '/about' || pathname?.startsWith('/blog/author/') || (pathname?.startsWith('/blog/') && pathname !== '/blog')) {
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
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#1E293B', fontFamily: 'Outfit, sans-serif' }}>
            Sahajul
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
            Living in Tezpur, Assam, India, Sahajul is a passionate blogger who has been writing content online for more than 14 years. He started SchoolsPedia to make it easy for parents to search and read about schools without getting confused by complicated government lists.
          </p>
          <div style={{ marginTop: '12px' }}>
            <Link href="/about" style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
              Learn more about our team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
