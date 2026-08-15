import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICallCompletedEvent } from '../../../common/events/call-completed.event';
import { IsString, IsNumber, IsIn } from 'class-validator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

export class WebhookPayloadDto {
  @ApiProperty({ description: "L'identifiant de l'appel", example: 'call_abc123' })
  @IsString()
  callId: string;

  @ApiProperty({ description: "L'identifiant du produit concerné", example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  productId: string;

  @ApiProperty({ description: "Le statut final de l'appel (success/failed)", example: 'success' })
  @IsIn(['success', 'failed'])
  status: 'success' | 'failed';

  @ApiProperty({ description: "La quantité négociée ou ajoutée au stock", example: 100 })
  @IsNumber()
  restockAmount: number;
}

@ApiTags('Webhooks (Fournisseurs/Appels)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhook')
export class WebhookController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('calle')
  @ApiOperation({ summary: 'Webhook de retour d\'appel', description: 'Reçoit le statut post-appel du service de Calling IA (ex: Retell, Vapi) pour traiter le réassort.' })
  @ApiResponse({ status: 201, description: 'Webhook reçu et événement émis avec succès.', schema: { example: { status: 'received' } } })
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
