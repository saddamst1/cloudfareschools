import { execSync } from 'child_process';

const TURSO_URL = 'libsql://schoolv6-schoolsv5.aws-ap-south-1.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ3Njk3MDEsImlkIjoiMDE5ZjhjOTAtMDcwMS03NDdiLTlhYzItNDlhMDBlMTY1ZGVlIiwia2lkIjoiM1RXZGd6MVhQZ1M1MW5hWHA0Qlk5aF9uazAwVF9qNGZxWHN5azB1SW1qbyIsInJpZCI6IjA0Mjk0MzEyLTc0YTktNGY5Ny04Yjc2LTdlNzgzZGE1N2YzZCJ9.eJQP2Bd8aF47BSAPcO_H8LsWi7yZo0TFanqrWJgBsdmqirQm7U4d6s9pgJv5StorYxU8Qx-nYFuHD1CnFDMZAQ';

console.log('🔄 Updating Vercel Environment Variables...');

try {
  console.log('Removing old TURSO_URL...');
  execSync('npx vercel env rm TURSO_URL production --yes', { stdio: 'inherit' });
} catch (e) {}

try {
  console.log('Removing old TURSO_AUTH_TOKEN...');
  execSync('npx vercel env rm TURSO_AUTH_TOKEN production --yes', { stdio: 'inherit' });
} catch (e) {}

console.log('Adding fresh TURSO_URL to Vercel production...');
execSync('npx vercel env add TURSO_URL production', { input: TURSO_URL + '\n', stdio: ['pipe', 'inherit', 'inherit'] });

console.log('Adding fresh TURSO_AUTH_TOKEN to Vercel production...');
execSync('npx vercel env add TURSO_AUTH_TOKEN production', { input: TURSO_AUTH_TOKEN + '\n', stdio: ['pipe', 'inherit', 'inherit'] });

console.log('✅ Vercel Production Environment Variables Updated Successfully!');
