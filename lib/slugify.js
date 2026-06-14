/**
 * SchoolsPedia — Slugify Utility
 * JS port of pipeline.py slugify() — must produce identical output
 */

export function slugify(text) {
  if (!text || typeof text !== 'string') return '';

  let s = text.trim();

  // Lowercase
  s = s.toLowerCase();

  // Strip leading numeric codes like "1-", "35-"
  s = s.replace(/^\d+-/, '');

  // Replace & → and
  s = s.replace(/&/g, 'and');

  // Replace non-alphanumeric with hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Strip leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');

  // Collapse multiple hyphens
  s = s.replace(/-{2,}/g, '-');

  return s;
}

export function makeSchoolSlug(udiseCode, schoolName) {
  return `${slugify(schoolName)}-${udiseCode}`;
}

export function makeSchoolUrl(state, district, block, village, udiseCode, schoolName) {
  const parts = [
    'schools',
    slugify(state),
    slugify(district),
    slugify(block),
    slugify(village),
    makeSchoolSlug(udiseCode, schoolName),
  ].filter(Boolean);
  return '/' + parts.join('/');
}
