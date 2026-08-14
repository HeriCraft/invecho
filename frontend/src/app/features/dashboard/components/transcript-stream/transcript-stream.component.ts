import { Component, Input, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranscriptEntry } from '../../../../core/models/call.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-transcript-stream',
  standalone: true,
  imports: [CommonModule, BadgeComponent, DatePipe],
  template: `
    <div class="flex flex-col h-full bg-[var(--background)] rounded-lg border border-[var(--border)] overflow-hidden">
      <div class="bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)] flex justify-between items-center">
        <h3 class="font-semibold text-sm text-[var(--foreground)]">Live Call Transcript</h3>
        <app-badge *ngIf="isStreaming" variant="success" class="animate-pulse">Live</app-badge>
      </div>
      
      <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-4">
        <div *ngIf="transcripts.length === 0" class="text-center text-[var(--muted-foreground)] text-sm py-8">
          No transcripts available yet.
        </div>
        
        <div *ngFor="let msg of transcripts" 
             class="flex flex-col max-w-[85%]"
             [ngClass]="{
               'self-end': msg.speaker === 'AGENT',
               'self-start': msg.speaker === 'CUSTOMER',
               'mx-auto text-center': msg.speaker === 'SYSTEM'
             }">
             
          <div *ngIf="msg.speaker === 'SYSTEM'" class="text-xs text-[var(--muted-foreground)] my-2 bg-[var(--muted)] px-3 py-1 rounded-full">
            {{ msg.text }}
          </div>
          
          <div *ngIf="msg.speaker !== 'SYSTEM'" class="flex flex-col">
            <span class="text-[10px] text-[var(--muted-foreground)] mb-1 px-1 font-medium"
                  [ngClass]="{'text-right': msg.speaker === 'AGENT'}">
              {{ msg.speaker === 'AGENT' ? 'Invecho AI' : 'Supplier' }} • {{ msg.timestamp | date:'HH:mm:ss' }}
            </span>
            <div class="px-4 py-2.5 rounded-2xl text-sm shadow-sm"
                 [ngClass]="{
                   'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-sm': msg.speaker === 'AGENT',
                   'bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-tl-sm': msg.speaker === 'CUSTOMER'
                 }">
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TranscriptStreamComponent {
  @Input() transcripts: TranscriptEntry[] = [];
  @Input() isStreaming: boolean = false;
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {}
  
  ngOnChanges() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
