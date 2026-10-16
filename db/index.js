import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

let initPromise = null;

// Create the table on first use. If it fails (e.g. DB not reachable yet),
// reset so the next request retries instead of failing forever.
function ensureTable() {
  if (!initPromise) {
    initPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS folder_structures (
        id TEXT PRIMARY KEY DEFAULT 'default',
        structure JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `).then(() => {
      console.log('Database table ready');
    }).catch(err => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export { pool, ensureTable };
