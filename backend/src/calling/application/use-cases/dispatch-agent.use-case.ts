import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CalleClientService } from '../../infrastructure/services/calle-client.service';
import { IAgentDispatchedEvent } from '../../../common/events/agent-dispatched.event';
import type { ICallingRepository } from '../../domain/repositories/calling.repository.interface';
import { CallLog } from '../../domain/repositories/calling.repository.interface';
import * as crypto from 'crypto';

@Injectable()
export class DispatchAgentUseCase {
  constructor(
    private readonly calleClient: CalleClientService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('CALLING_REPOSITORY')
    private readonly repository: ICallingRepository,
  ) {}

  async execute(productId: string): Promise<void> {
    const callId = await this.calleClient.dispatchAgent(productId);
    
    await this.repository.logCall({
      id: crypto.randomUUID(),
      agentId: callId,
      targetId: productId,
      status: 'DISPATCHED',
      timestamp: new Date(),
    });

    const event: IAgentDispatchedEvent = {
      agentId: callId,
      targetId: productId,
      reason: 'Low stock',
    };
    this.eventEmitter.emit('agent.dispatched', event);
  }
}
