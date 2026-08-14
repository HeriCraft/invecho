import { Injectable } from '@nestjs/common';
import { ISuppliersRepository } from '../../suppliers/domain/repositories/suppliers.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaSuppliersRepository implements ISuppliersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<any> {
    return this.prisma.supplier.findUnique({ where: { id } });
  }
}
