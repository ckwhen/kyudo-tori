import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as shinsaSchema from '@/features/shinsa/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const schema = {
  ...shinsaSchema,
};

const sql = postgres(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
