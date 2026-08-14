export class StockLevel {
  constructor(
    public readonly current: number,
    public readonly threshold: number,
  ) {}

  isLow(): boolean {
    return this.current <= this.threshold;
  }
}
