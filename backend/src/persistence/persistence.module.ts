import { Global, Module } from '@nestjs/common';
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
export class PersistenceModule {}
