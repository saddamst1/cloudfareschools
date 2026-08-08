'use client';

import { useState } from 'react';

export default function SchoolActions({ schoolName, lang = 'en' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: schoolName || 'School Information',
      text: `Check out ${schoolName} details on SchoolsPedia`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isHi = lang === 'hi';

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
      <button
        onClick={handleShare}
        style={{
          flex: 1,
          border: '1px solid #E2E8F0',
          background: '#F8FAFC',
          borderRadius: 7,
          padding: '7px 4px',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        📱 {isHi ? 'साझा करें' : 'Share'}
      </button>

      <button
        onClick={handleCopy}
        style={{
          flex: 1,
          border: copied ? '1px solid #10B981' : '1px solid #E2E8F0',
          background: copied ? '#ECFDF5' : '#F8FAFC',
          borderRadius: 7,
          padding: '7px 4px',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: copied ? '#059669' : '#475569',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {copied ? '✅ ' + (isHi ? 'कॉपी हो गया' : 'Copied!') : '📋 ' + (isHi ? 'कॉपी करें' : 'Copy')}
      </button>

      <button
        onClick={handlePrint}
        style={{
          flex: 1,
          border: '1px solid #E2E8F0',
          background: '#F8FAFC',
          borderRadius: 7,
          padding: '7px 4px',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        🖨️ {isHi ? 'प्रिंट करें' : 'Print'}
      </button>
    </div>
  );
}
