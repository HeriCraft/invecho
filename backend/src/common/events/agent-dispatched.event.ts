export class IAgentDispatchedEvent {
  agentId: string;
  targetId: string; // Could be productId or supplierId
  reason: string;
}
