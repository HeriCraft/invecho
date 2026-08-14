import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  products = signal<Product[]>([]);
  agentStatus = signal<string>('Idle');

  private sseSource: EventSource | null = null;

  constructor(private http: HttpClient) {
    this.loadInitialData();
    this.setupSse();
  }

  private loadInitialData() {
    this.http.get<Product[]>('/api/inventory').subscribe(data => {
      this.products.set(data);
    });
  }

  private setupSse() {
    this.sseSource = new EventSource('/api/notifications/sse');
    
    this.sseSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'LOW_STOCK':
          this.agentStatus.set(`Low stock for ${data.payload.productName}. Waiting for dispatch...`);
          break;
        case 'AGENT_DISPATCHED':
          this.agentStatus.set(`CALL-E Agent Dispatched for product ${data.payload.productId} (Call ID: ${data.payload.callId})`);
          break;
        case 'STOCK_REPLENISHED':
          this.agentStatus.set(`Stock replenished for ${data.payload.productId}! New stock: ${data.payload.newStock}`);
          this.updateProductStock(data.payload.productId, data.payload.newStock);
          setTimeout(() => this.agentStatus.set('Idle'), 5000);
          break;
      }
    };
  }

  triggerStockCheck(productId: string) {
    this.http.post(`/api/inventory/${productId}/check`, {}).subscribe();
  }

  simulateWebhook(productId: string, callId: string) {
    this.http.post(`/api/webhook/calle`, {
      callId,
      productId,
      status: 'success',
      restockAmount: 20
    }).subscribe();
  }

  private updateProductStock(productId: string, newStock: number) {
    this.products.update(prods => prods.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  }
}
