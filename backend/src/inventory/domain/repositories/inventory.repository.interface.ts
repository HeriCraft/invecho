import { Product } from '../entities/product.entity';

export interface IInventoryRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
}
