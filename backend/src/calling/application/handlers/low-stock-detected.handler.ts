import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ILowStockDetectedEvent } from '../../../common/events/low-stock-detected.event';
import { DispatchAgentUseCase } from '../use-cases/dispatch-agent.use-case';

@Injectable()
export class LowStockDetectedHandler {
  private readonly logger = new Logger(LowStockDetectedHandler.name);

  constructor(private readonly dispatchAgentUseCase: DispatchAgentUseCase) {}

  @OnEvent('inventory.low-stock')
  async handle(event: ILowStockDetectedEvent) {
    this.logger.log(`Low stock detected for ${event.productName} (ID: ${event.productId}). Dispatching agent...`);
    await this.dispatchAgentUseCase.execute(event.productId);
  }
}
