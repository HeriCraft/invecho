import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ICallCompletedEvent } from '../../../common/events/call-completed.event';
import { SyncErpStockUseCase } from '../use-cases/sync-erp-stock.use-case';

@Injectable()
export class CallCompletedHandler {
  constructor(private readonly syncErpStockUseCase: SyncErpStockUseCase) {}

  @OnEvent('calling.call-completed')
  async handle(event: ICallCompletedEvent) {
    if (event.status === 'success') {
      await this.syncErpStockUseCase.execute(event.productId, event.restockAmount);
    }
  }
}
