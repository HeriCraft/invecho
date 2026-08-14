import { Module } from '@nestjs/common';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { CheckStockUseCase } from './application/use-cases/check-stock.use-case';
import { SyncErpStockUseCase } from './application/use-cases/sync-erp-stock.use-case';
import { CallCompletedHandler } from './application/handlers/call-completed.handler';

@Module({
  controllers: [InventoryController],
  providers: [
    CheckStockUseCase,
    SyncErpStockUseCase,
    CallCompletedHandler,
  ],
})
export class InventoryModule {}
