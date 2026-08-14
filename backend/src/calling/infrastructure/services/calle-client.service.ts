import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CalleClientService {
  private readonly logger = new Logger(CalleClientService.name);

  async dispatchAgent(productId: string): Promise<string> {
    this.logger.log(`Dispatching CALL-E agent for product ${productId}...`);
    // Mocking API call to CALL-E
    return new Promise((resolve) => {
      setTimeout(() => {
        const callId = `call_${Math.random().toString(36).substr(2, 9)}`;
        this.logger.log(`Agent dispatched successfully. Call ID: ${callId}`);
        resolve(callId);
      }, 500);
    });
  }
}
