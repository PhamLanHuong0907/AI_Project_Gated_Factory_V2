const { Client } = require('pg');

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
    
    const result = await client.query("SELECT version, description, type, success FROM flyway_schema_history ORDER BY installed_rank");
    console.table(result.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
