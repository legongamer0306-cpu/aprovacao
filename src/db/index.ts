import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Connection pooling configuration for PostgreSQL 17
const connectionString = process.env.DATABASE_URL;

// Singleton Pool Pattern
const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

export const pool = globalForDb.pgPool ?? new Pool({
  connectionString: connectionString || undefined,
  max: 20, // Max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' && !connectionString?.includes('localhost') 
    ? { rejectUnauthorized: false } 
    : false,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgPool = pool;
}

// Drizzle Client Instance with full typed schema
export const db = drizzle(pool, { schema });

// Health check utility for PostgreSQL 17
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  version?: string;
  error?: string;
}> {
  if (!connectionString) {
    return {
      connected: false,
      error: 'DATABASE_URL não configurada no ambiente.',
    };
  }

  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT version();');
      return {
        connected: true,
        version: res.rows[0]?.version,
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Falha ao conectar com o PostgreSQL.',
    };
  }
}

export * from './schema';
