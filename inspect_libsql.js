const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function main() {
  const dbPath = path.join(__dirname, 'data', 'schoolspedia.db');
  console.log("DB Path:", dbPath);
  console.log("Exists:", fs.existsSync(dbPath));
  
  const client = createClient({
    url: `file:${dbPath.replace(/\\/g, '/')}`,
  });
  
  try {
    const res = await client.execute('PRAGMA table_info(schools)');
    const columns = res.rows.map(row => {
      // row contains values matching columns from table_info: cid, name, type, notnull, dflt_value, pk
      // let's map it to an object
      const colObj = {};
      res.columns.forEach((colName, idx) => {
        colObj[colName] = row[idx];
      });
      return colObj;
    });
    
    fs.writeFileSync('db_columns.json', JSON.stringify(columns, null, 2));
    console.log("Written columns to db_columns.json successfully!");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    client.close();
  }
}

main().catch(console.error);
