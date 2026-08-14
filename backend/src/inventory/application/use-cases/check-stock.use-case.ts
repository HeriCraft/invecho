import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IInventoryRepository } from '../../domain/repositories/inventory.repository.interface';
import { ILowStockDetectedEvent } from '../../../common/events/low-stock-detected.event';

@Injectable()
export class CheckStockUseCase {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private readonly repository: IInventoryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(productId: string): Promise<void> {
    const product = await this.repository.findById(productId);
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    
    if (product.stock.isLow()) {
      const event: ILowStockDetectedEvent = {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock.current,
      };
      this.eventEmitter.emit('inventory.low-stock', event);
    }
  }
}
