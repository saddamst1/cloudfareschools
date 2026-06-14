'use client';
import { useEffect, useRef } from 'react';

/**
 * AdSense Ad Slot
 * sizes: 'leaderboard' (728x90) | 'responsive' | 'sidebar' (300x250) | 'mobile-banner' (320x50)
 */
export default function AdSlot({ size = 'responsive', className = '' }) {
  const adRef = useRef(null);
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  const isDev = process.env.NODE_ENV === 'development';

  const sizeMap = {
    leaderboard:   { width: '728px', height: '90px',  label: '728×90 Leaderboard' },
    responsive:    { width: '100%',  height: '90px',  label: 'Responsive' },
    sidebar:       { width: '300px', height: '250px', label: '300×250 Sidebar' },
    'mobile-banner': { width: '320px', height: '50px', label: '320×50 Mobile' },
  };
  const s = sizeMap[size] || sizeMap.responsive;

  useEffect(() => {
    if (!isDev && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [isDev]);

  if (isDev) {
    return (
      <div
        className={`ad-slot ${className}`}
        style={{ width: s.width, height: s.height, maxWidth: '100%' }}
        aria-hidden="true"
      >
        AD — {s.label}
      </div>
    );
  }

  return (
    <div className={className} style={{ textAlign: 'center', maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: s.width, height: s.height }}
        data-ad-client={pubId}
        data-ad-slot="AUTO"
        data-ad-format={size === 'responsive' ? 'auto' : 'fixed'}
        data-full-width-responsive={size === 'responsive' ? 'true' : 'false'}
      />
    </div>
  );
}
