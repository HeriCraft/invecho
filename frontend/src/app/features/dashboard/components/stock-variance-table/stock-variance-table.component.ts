import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockVariance } from '../../../../core/models/call.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-stock-variance-table',
  standalone: true,
  imports: [CommonModule, BadgeComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
  template: `
    <app-card class="h-full">
      <app-card-header class="border-b border-[var(--border)] bg-[var(--muted)]/30">
        <app-card-title class="text-sm">Real-time Stock Variances</app-card-title>
      </app-card-header>
      <app-card-content class="p-0 overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-[var(--muted-foreground)] uppercase bg-[var(--muted)]/50 border-b border-[var(--border)]">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium">SKU</th>
              <th scope="col" class="px-4 py-3 font-medium">Product</th>
              <th scope="col" class="px-4 py-3 font-medium text-right">Expected</th>
              <th scope="col" class="px-4 py-3 font-medium text-right">Actual</th>
              <th scope="col" class="px-4 py-3 font-medium text-right">Variance</th>
              <th scope="col" class="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="variances.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-[var(--muted-foreground)]">
                No stock variances detected.
              </td>
            </tr>
            <tr *ngFor="let v of variances" class="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors">
              <td class="px-4 py-3 font-medium text-[var(--foreground)]">{{ v.sku }}</td>
              <td class="px-4 py-3">{{ v.productName }}</td>
              <td class="px-4 py-3 text-right">{{ v.expectedQuantity }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ v.actualQuantity }}</td>
              <td class="px-4 py-3 text-right font-semibold" 
                  [ngClass]="{'text-[var(--destructive)]': v.variance < 0, 'text-[var(--success)]': v.variance > 0}">
                {{ v.variance > 0 ? '+' : '' }}{{ v.variance }}
              </td>
              <td class="px-4 py-3 text-center">
                <app-badge [variant]="v.status === 'CRITICAL' ? 'destructive' : (v.status === 'RESOLVED' ? 'success' : 'warning')">
                  {{ v.status }}
                </app-badge>
              </td>
            </tr>
          </tbody>
        </table>
      </app-card-content>
    </app-card>
  `
})
export class StockVarianceTableComponent {
  @Input() variances: StockVariance[] = [];
}
