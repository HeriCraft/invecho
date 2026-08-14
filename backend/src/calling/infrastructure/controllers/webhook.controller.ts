import { Controller, Post, Body } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICallCompletedEvent } from '../../../common/events/call-completed.event';
import { IsString, IsNumber, IsIn } from 'class-validator';

export class WebhookPayloadDto {
  @IsString()
  callId: string;

  @IsString()
  productId: string;

  @IsIn(['success', 'failed'])
  status: 'success' | 'failed';

  @IsNumber()
  restockAmount: number;
}

@Controller('webhook')
export class WebhookController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('calle')
  handleCallePostback(@Body() payload: WebhookPayloadDto) {
    const event: ICallCompletedEvent = {
      callId: payload.callId,
      productId: payload.productId,
      status: payload.status,
      restockAmount: payload.restockAmount,
    };
    this.eventEmitter.emit('calling.call-completed', event);
    return { status: 'received' };
  }
}
