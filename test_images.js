const fs = require('fs');
const path = require('path');
const { ARTICLE_DATA } = require('./data/articles-data.js');

// Simple mock for GET request params
async function test() {
  const { GET } = require('./app/blog-images/[slug]/route.js');
  
  for (const slug of Object.keys(ARTICLE_DATA)) {
    try {
      const response = await GET(new Request('http://localhost/'), { params: Promise.resolve({ slug }) });
      const text = await response.text();
      const hasContent = text.includes('rect') || text.includes('circle') || text.includes('g');
      const isEmptyContent = !text.includes('rect width="1200" height="630" fill="url(#') && !text.includes('rect width="1200" height="630" fill="#');
      console.log(`Slug: ${slug.padEnd(35)} | Status: ${response.status} | Content Length: ${text.length} | Has Shapes: ${hasContent} | Empty Layout: ${isEmptyContent}`);
    } catch (err) {
      console.error(`Slug: ${slug} failed with error:`, err.message);
    }
  }
}

test();
