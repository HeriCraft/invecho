import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const user = process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres';
    const password = encodeURIComponent(process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '');
    const db = process.env.DB_DATABASE || process.env.POSTGRES_DB || 'postgres';
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const url = process.env.DATABASE_URL || `postgres://${user}:${password}@${host}:${port}/${db}`;
    process.env.DATABASE_URL = url;
    
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
