const sqlite3 = require('sql.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const dbPath = path.join(__dirname, 'data', 'schoolspedia.db');
  console.log("DB Path:", dbPath);
  console.log("Exists:", fs.existsSync(dbPath));
  
  // Wait, let's check lib/db.js to see if it uses @libsql/client or sql.js
  // Let's see what is inside the database by importing lib/db.js!
}
main().catch(console.error);
