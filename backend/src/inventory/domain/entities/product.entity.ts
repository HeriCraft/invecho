import { StockLevel } from '../value-objects/stock-level.vo';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public stock: StockLevel,
  ) {}

  updateStock(newCurrent: number): void {
    this.stock = new StockLevel(newCurrent, this.stock.threshold);
  }
}
