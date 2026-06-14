'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [details, setDetails] = useState('');
  const [trap, setTrap] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    // Bot honeypot check
    if (trap) {
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, school, details }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit report. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#065F46', marginBottom: 8 }}>
          Report Submitted Successfully!
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#047857', lineHeight: 1.6, margin: 0 }}>
          Thank you for helping us keep SchoolsPedia accurate. Our team will verify these updates against UDISE+ source registries in our next sync cycle.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Honeypot Spam Trap (Hidden from users, autocomplete off, tabIndex -1) */}
      <input
        type="text"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        style={{ display: 'none' }}
        tabIndex="-1"
        autoComplete="off"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Your Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.875rem', background: 'white', color: '#1E293B' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.875rem', background: 'white', color: '#1E293B' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
          School Name & UDISE Code
        </label>
        <input
          type="text"
          required
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="e.g. Govt Primary School Atrawa (09340100101)"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.875rem', background: 'white', color: '#1E293B' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
          Discrepancy Details
        </label>
        <textarea
          required
          rows="4"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe what is incorrect (e.g. wrong category, school has closed down, incorrect GPS coordinates...)"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.875rem', fontFamily: 'inherit', background: 'white', color: '#1E293B' }}
        />
      </div>

      {errorMsg && (
        <div style={{ background: '#FEF2F2', borderLeft: '3px solid #EF4444', color: '#B91C1C', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '0.825rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ alignSelf: 'flex-start', padding: '12px 28px', borderRadius: 8, opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Submitting...' : 'Submit Error Report'}
      </button>
    </form>
  );
}
