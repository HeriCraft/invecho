import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IInventoryRepository } from '../../domain/repositories/inventory.repository.interface';
import { IStockReplenishedEvent } from '../../../common/events/stock-replenished.event';

@Injectable()
export class SyncErpStockUseCase {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private readonly repository: IInventoryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(productId: string, restockAmount: number): Promise<void> {
    const product = await this.repository.findById(productId);
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    
    product.updateStock(product.stock.current + restockAmount);
    await this.repository.save(product);

    const event: IStockReplenishedEvent = {
      productId: product.id,
      newStockLevel: product.stock.current,
      amountAdded: restockAmount,
    };
    this.eventEmitter.emit('inventory.stock-replenished', event);
  }
}
