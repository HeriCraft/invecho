import { Module } from '@nestjs/common';
import { WebhookController } from './infrastructure/controllers/webhook.controller';
import { CalleClientService } from './infrastructure/services/calle-client.service';
import { DispatchAgentUseCase } from './application/use-cases/dispatch-agent.use-case';
import { LowStockDetectedHandler } from './application/handlers/low-stock-detected.handler';

@Module({
  controllers: [WebhookController],
  providers: [
    CalleClientService,
    DispatchAgentUseCase,
    LowStockDetectedHandler,
  ],
})
export class CallingModule {}
