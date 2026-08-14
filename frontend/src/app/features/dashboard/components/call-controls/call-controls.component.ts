import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';
import { CallStatus } from '../../../../core/models/call.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-call-controls',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, BadgeComponent],
  template: `
    <app-card>
      <app-card-header>
        <app-card-title class="text-base flex justify-between items-center">
          <span>Call Controls</span>
          <app-badge *ngIf="status" [variant]="getBadgeVariant(status)">
            {{ status }}
          </app-badge>
        </app-card-title>
      </app-card-header>
      <app-card-content>
        <div class="flex flex-col gap-4">
          <div class="text-sm text-[var(--muted-foreground)]">
            Trigger an automated voice agent call to verify stock levels with Supplier #402.
          </div>
          <div class="flex gap-3">
            <app-button 
              variant="primary" 
              class="w-full flex-1" 
              [disabled]="isStreaming || status === 'INITIATED' || status === 'IN_PROGRESS'"
              (click)="onStartCall.emit('SUPPLIER_402')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Initiate Call
            </app-button>
            <app-button 
              variant="destructive" 
              [disabled]="!isStreaming"
              (click)="onEndCall.emit()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>
            </app-button>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `
})
export class CallControlsComponent {
  @Input() isStreaming: boolean = false;
  @Input() status: CallStatus | null = null;
  
  @Output() onStartCall = new EventEmitter<string>();
  @Output() onEndCall = new EventEmitter<void>();

  getBadgeVariant(status: CallStatus): 'default' | 'success' | 'warning' | 'destructive' {
    switch(status) {
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'success';
      case 'FAILED': return 'destructive';
      case 'INITIATED': return 'warning';
      default: return 'default';
    }
  }
}
