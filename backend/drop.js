const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgres://postgres.lwqaoytnyuqocmjmxbin:Mylife@2k597@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database!");
    
    console.log("Reading V1 schema...");
    const sql = fs.readFileSync(path.join(__dirname, 'src', 'main', 'resources', 'db', 'migration', 'V1__init_schema.sql'), 'utf8');

    console.log("Executing V1 schema manually...");
    await client.query(sql);
    console.log("V1 schema executed successfully! Tables created.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
