import { Module } from '@nestjs/common';
import { AgentDispatchedHandler } from './application/handlers/agent-dispatched.handler';

@Module({
  providers: [
    AgentDispatchedHandler,
  ],
})
export class SuppliersModule {}
