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
    
    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("Tables in public schema:");
    result.rows.forEach(row => console.log(" - " + row.table_name));

    console.log("Dropping flyway_schema_history...");
    await client.query("DROP TABLE IF EXISTS flyway_schema_history CASCADE");
    console.log("flyway_schema_history dropped successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
