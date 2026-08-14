import { Injectable } from '@nestjs/common';
import { ICallingRepository, CallLog } from '../../calling/domain/repositories/calling.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaCallingRepository implements ICallingRepository {
  constructor(private prisma: PrismaService) {}

  async logCall(log: CallLog): Promise<void> {
    await this.prisma.callHistory.create({
      data: {
        id: log.id,
        agentId: log.agentId,
        targetId: log.targetId,
        status: log.status,
        timestamp: log.timestamp,
      },
    });
  }
}
