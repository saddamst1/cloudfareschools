'use client';
import { useState, useEffect, useCallback } from 'react';

export default function SchoolReviews({ udiseCode, schoolName }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [trap, setTrap] = useState('');

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?udise_code=${udiseCode}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    } finally {
      setLoading(false);
    }
  }, [udiseCode]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Honeypot spam trap verification
    if (trap) {
      setTimeout(() => {
        setSuccessMsg('Thank you! Your review has been submitted and published.');
        setName('');
        setRating(5);
        setComment('');
        setSubmitting(false);
        setFormOpen(false);
      }, 1000);
      return;
    }

    // Client-side link prevention checklist
    const linkRegex = /https?:\/\/|www\.|\b[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.(com|org|net|in|co|us|info|biz|io|me|net|edu|app|club|xyz)\b/i;
    if (linkRegex.test(comment) || linkRegex.test(name)) {
      setErrorMsg('Links, URLs, or website domains are not allowed in reviews. Please write a text-only comment.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          udise_code: udiseCode,
          reviewer_name: name,
          rating: rating,
          comment: comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Thank you! Your review has been submitted and published.');
        setName('');
        setRating(5);
        setComment('');
        // Reload reviews list
        await fetchReviews();
        // Close form after delay
        setTimeout(() => {
          setFormOpen(false);
          setSuccessMsg('');
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Failed to submit review. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (num, activeColor = '#F59E0B', inactiveColor = '#E2E8F0', size = '1.1rem') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= num ? activeColor : inactiveColor, fontSize: size }}>
          ★
        </span>
      );
    }
    return <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      // Formats e.g. "2026-06-05 17:00:00" or ISO
      const date = new Date(dateStr.replace(' ', 'T'));
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', marginTop: '28px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
            💬 Parent & Alumni Reviews
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>
            Share your experience or ask questions about {schoolName}
          </p>
        </div>
        
        <button 
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '0.825rem', borderRadius: 8 }}
        >
          {formOpen ? 'Cancel' : '📝 Write a Review'}
        </button>
      </div>

      {/* Review Form Drawer */}
      {formOpen && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, marginBottom: 24 }} className="animate-fade-up">
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>
            Share Your Experience
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Honeypot field */}
            <input
              type="text"
              value={trap}
              onChange={e => setTrap(e.target.value)}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: 5 }}>Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: 5 }}>Rating</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span style={{ fontSize: '1.4rem', color: star <= rating ? '#F59E0B' : '#E2E8F0' }}>★</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: 5 }}>Your Review / Comment</label>
              <textarea 
                required 
                rows="4" 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your honest comments about the teachers, infrastructure, facilities, or school environment..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: '0.675rem', color: '#94A3B8', marginTop: 3, display: 'block' }}>
                Note: Links, URLs, or promotional codes are strictly prohibited and will be rejected automatically.
              </span>
            </div>

            {errorMsg && (
              <div style={{ background: '#FEF2F2', borderLeft: '3px solid #EF4444', color: '#B91C1C', padding: '8px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.8rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#ECFDF5', borderLeft: '3px solid #10B981', color: '#047857', padding: '8px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.8rem' }}>
                ✅ {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={submitting}
              className="btn-primary" 
              style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '0.825rem', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Summary & Reviews List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', padding: '20px 0' }}>
          ⏳ Loading reviews...
        </div>
      ) : (
        <div>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', padding: '30px 0', background: '#F8FAFC', borderRadius: 8 }}>
              📢 No reviews submitted yet. Be the first to share your feedback about this school!
            </div>
          ) : (
            <div>
              {/* Ratings Summary Card */}
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, border: '1px solid #F1F5F9' }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0', paddingRight: 24 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
                    {avgRating}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {renderStars(Math.round(avgRating), '#F59E0B', '#E2E8F0', '1rem')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 4 }}>
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>Average User Rating</div>
                  <p style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.4, marginTop: 4 }}>
                    Based on verified feedback from parents, local residents, and alumni of this school. Reviews are text-only and subject to strict anti-spam filters.
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }} className="animate-fade-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Avatar initials placeholder */}
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', color: '#1E40AF', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BFDBFE' }}>
                          {rev.reviewer_name ? rev.reviewer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E293B' }}>{rev.reviewer_name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{formatDate(rev.created_at)}</div>
                        </div>
                      </div>
                      <div>
                        {renderStars(rev.rating, '#F59E0B', '#E2E8F0', '0.9rem')}
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, paddingLeft: 42, whiteSpace: 'pre-line' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
