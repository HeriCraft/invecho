import * as dotenv from 'dotenv';
import * as path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Load backend .env
dotenv.config();

const user = process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres';
const password = encodeURIComponent(process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '');
const db = process.env.DB_DATABASE || process.env.POSTGRES_DB || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';

const dbUrl = process.env.DATABASE_URL || `postgres://${user}:${password}@${host}:${port}/${db}`;

// Ensure the environment variable is set for the Prisma Client at runtime when used locally
process.env.DATABASE_URL = dbUrl;

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
};
