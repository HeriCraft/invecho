import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallStreamService } from '../../core/services/call-stream.service';
import { TranscriptStreamComponent } from './components/transcript-stream/transcript-stream.component';
import { StockVarianceTableComponent } from './components/stock-variance-table/stock-variance-table.component';
import { CallControlsComponent } from './components/call-controls/call-controls.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranscriptStreamComponent,
    StockVarianceTableComponent,
    CallControlsComponent
  ],
  template: `
    <div class="h-full flex flex-col space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-[var(--foreground)]">Supply Chain Voice Agents</h2>
          <p class="text-[var(--muted-foreground)]">Monitor and control autonomous PSTN stock verification calls.</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <!-- Transcript Column (Takes up 1/3) -->
        <div class="md:col-span-1 h-full">
          <app-transcript-stream 
            [transcripts]="callStream.transcripts()" 
            [isStreaming]="callStream.isStreaming()">
          </app-transcript-stream>
        </div>
        
        <!-- Dashboard Content Column (Takes up 2/3) -->
        <div class="md:col-span-2 flex flex-col space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <app-call-controls
              [isStreaming]="callStream.isStreaming()"
              [status]="callStream.status()"
              (onStartCall)="startCall($event)"
              (onEndCall)="endCall()">
            </app-call-controls>
            
            <!-- Summary Stats (Optional placeholder for now) -->
            <div class="rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm p-6 flex flex-col justify-center">
              <h3 class="text-sm font-medium text-[var(--muted-foreground)] mb-2">Total Active Calls</h3>
              <div class="text-4xl font-bold">{{ callStream.isStreaming() ? '1' : '0' }}</div>
            </div>
          </div>
          
          <div class="flex-1">
            <app-stock-variance-table
              [variances]="callStream.variances()">
            </app-stock-variance-table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  public callStream = inject(CallStreamService);

  startCall(supplierId: string) {
    this.callStream.startCall(supplierId);
  }

  endCall() {
    this.callStream.endCall();
  }
}
