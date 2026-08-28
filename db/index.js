import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Auto-create table on first import
const initPromise = pool.query(`
  CREATE TABLE IF NOT EXISTS folder_structures (
    id TEXT PRIMARY KEY DEFAULT 'default',
    structure JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`).then(() => {
  console.log('Database table ready');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

export { pool, initPromise };
