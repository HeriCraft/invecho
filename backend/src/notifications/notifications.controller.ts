import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { ILowStockDetectedEvent } from '../common/events/low-stock-detected.event';
import { IStockReplenishedEvent } from '../common/events/stock-replenished.event';
import { IAgentDispatchedEvent } from '../common/events/agent-dispatched.event';

@Controller('notifications')
export class NotificationsController {
  private events$ = new Subject<MessageEvent>();

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.events$.asObservable();
  }

  @OnEvent('inventory.low-stock')
  handleLowStock(event: ILowStockDetectedEvent) {
    this.events$.next({ data: { type: 'LOW_STOCK', payload: event } });
  }

  @OnEvent('agent.dispatched')
  handleAgentDispatched(event: IAgentDispatchedEvent) {
    this.events$.next({ data: { type: 'AGENT_DISPATCHED', payload: event } });
  }

  @OnEvent('inventory.stock-replenished')
  handleStockReplenished(event: IStockReplenishedEvent) {
    this.events$.next({ data: { type: 'STOCK_REPLENISHED', payload: event } });
  }
}
