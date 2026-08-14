import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IAgentDispatchedEvent } from '../../../common/events/agent-dispatched.event';

@Injectable()
export class AgentDispatchedHandler {
  private readonly logger = new Logger(AgentDispatchedHandler.name);

  @OnEvent('agent.dispatched')
  async handle(event: IAgentDispatchedEvent) {
    this.logger.log(`Agent ${event.agentId} dispatched for target ${event.targetId}. Reason: ${event.reason}`);
    // Future: notify supplier logic
  }
}
