import { Injectable } from '@nestjs/common';
import { IInventoryRepository } from '../../inventory/domain/repositories/inventory.repository.interface';
import { Product } from '../../inventory/domain/entities/product.entity';
import { StockLevel } from '../../inventory/domain/value-objects/stock-level.vo';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaInventoryRepository implements IInventoryRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const productModel = await this.prisma.product.findUnique({ where: { id } });
    if (!productModel) return null;
    return new Product(
      productModel.id,
      productModel.name,
      new StockLevel(productModel.stock, productModel.threshold)
    );
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        stock: product.stock.current,
        threshold: product.stock.threshold,
      },
      create: {
        id: product.id,
        name: product.name,
        stock: product.stock.current,
        threshold: product.stock.threshold,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    const models = await this.prisma.product.findMany();
    return models.map(m => new Product(m.id, m.name, new StockLevel(m.stock, m.threshold)));
  }
}
