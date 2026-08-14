export class ICallCompletedEvent {
  callId: string;
  productId: string;
  status: 'success' | 'failed';
  restockAmount: number;
}
