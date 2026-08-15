import { Global, Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma/prisma.service';
import { PrismaInventoryRepository } from './repositories/prisma-inventory.repository';
import { PrismaCallingRepository } from './repositories/prisma-calling.repository';
import { PrismaSuppliersRepository } from './repositories/prisma-suppliers.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'INVENTORY_REPOSITORY',
      useClass: PrismaInventoryRepository,
    },
    {
      provide: 'CALLING_REPOSITORY',
      useClass: PrismaCallingRepository,
    },
    {
      provide: 'SUPPLIERS_REPOSITORY',
      useClass: PrismaSuppliersRepository,
    }
  ],
  exports: [
    'INVENTORY_REPOSITORY',
    'CALLING_REPOSITORY',
    'SUPPLIERS_REPOSITORY',
  ],
})
export class PersistenceModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(PersistenceModule.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking SUPER_ADMIN user...');
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { OR: [{ email: 'granix@yopmail.com' }, { username: 'GRANIX' }] },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('dPBP&fnCW4ZoG8', 10);
        await this.prisma.user.create({
          data: {
            username: 'GRANIX',
            email: 'granix@yopmail.com',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
          },
        });
        this.logger.log('SUPER_ADMIN user GRANIX seeded successfully.');
      } else {
        this.logger.log('SUPER_ADMIN user already exists, skipping seed.');
      }
    } catch (error) {
      this.logger.error('Failed to seed SUPER_ADMIN user:', error);
    }
  }
}
