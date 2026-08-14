import { Controller, Post, Param, Get, Inject, Body } from '@nestjs/common';
import { CheckStockUseCase } from '../../application/use-cases/check-stock.use-case';
import { SyncErpStockUseCase } from '../../application/use-cases/sync-erp-stock.use-case';
import type { IInventoryRepository } from '../../domain/repositories/inventory.repository.interface';
import { IsString, IsNumber, Min } from 'class-validator';

export class SyncStockDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  restockAmount: number;
}

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly checkStockUseCase: CheckStockUseCase,
    private readonly syncErpStockUseCase: SyncErpStockUseCase,
    @Inject('INVENTORY_REPOSITORY')
    private readonly repository: IInventoryRepository,
  ) {}

  @Get()
  async getInventory() {
    const products = await this.repository.findAll();
    return products.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock.current,
      threshold: p.stock.threshold,
    }));
  }

  @Post(':id/check')
  async checkStock(@Param('id') id: string) {
    await this.checkStockUseCase.execute(id);
    return { status: 'check initiated' };
  }

  @Post('sync')
  async syncStock(@Body() dto: SyncStockDto) {
    await this.syncErpStockUseCase.execute(dto.productId, dto.restockAmount);
    return { status: 'stock synced' };
  }
}
