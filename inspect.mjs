import { query, queryOne } from './lib/db.js';

async function main() {
  try {
    const tableInfo = await query("PRAGMA table_info(districts)");
    console.log("Districts table info:", tableInfo);

    const sampleState = await queryOne("SELECT * FROM states LIMIT 1");
    console.log("Sample State:", sampleState);

    const sampleDistrict = await queryOne("SELECT * FROM districts LIMIT 1");
    console.log("Sample District:", sampleDistrict);

    const countDistricts = await queryOne("SELECT COUNT(*) AS c FROM districts");
    console.log("Total districts count:", countDistricts);
  } catch (err) {
    console.error("Error running query:", err);
  }
}

main();
