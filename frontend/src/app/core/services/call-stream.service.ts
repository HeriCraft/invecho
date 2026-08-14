import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { CallState, TranscriptEntry, StockVariance } from '../models/call.model';

@Injectable({
  providedIn: 'root'
})
export class CallStreamService implements OnDestroy {
  // State signal initialized with defaults
  private state = signal<CallState>({
    callId: null,
    status: null,
    transcripts: [],
    variances: [],
    isStreaming: false
  });

  // Public computed signals for precise granular reactivity
  public readonly callId = computed(() => this.state().callId);
  public readonly status = computed(() => this.state().status);
  public readonly transcripts = computed(() => this.state().transcripts);
  public readonly variances = computed(() => this.state().variances);
  public readonly isStreaming = computed(() => this.state().isStreaming);

  private mockIntervalId: any = null;
  
  private readonly mockTranscripts = [
    { speaker: 'SYSTEM', text: 'Initializing call to Supplier #402...' },
    { speaker: 'SYSTEM', text: 'Ringing...' },
    { speaker: 'CUSTOMER', text: 'Hello, this is Acme Logistics. How can I help?' },
    { speaker: 'AGENT', text: 'Hi, I am the automated agent for Invecho calling to verify the stock for SKU-9921.' },
    { speaker: 'CUSTOMER', text: 'Ah yes, let me check that for you. Give me a second.' },
    { speaker: 'AGENT', text: 'No problem, I will wait.' },
    { speaker: 'CUSTOMER', text: 'Alright, we have 450 units available instead of the expected 500. There was a shipping delay.' },
    { speaker: 'AGENT', text: 'Understood. Updating the variance log with a deficit of 50 units. Thank you for your time.' },
    { speaker: 'CUSTOMER', text: "You're welcome. Goodbye." },
    { speaker: 'SYSTEM', text: 'Call ended by remote party.' }
  ];

  constructor() {}

  startCall(supplierId: string) {
    if (this.isStreaming()) return;

    this.state.update(s => ({
      ...s,
      callId: `CALL-${Math.floor(Math.random() * 10000)}`,
      status: 'INITIATED',
      transcripts: [],
      variances: [],
      isStreaming: true
    }));

    let step = 0;
    
    // Simulate changing to IN_PROGRESS
    setTimeout(() => {
      this.state.update(s => ({ ...s, status: 'IN_PROGRESS' }));
    }, 1500);

    // Mock SSE Stream via interval
    this.mockIntervalId = setInterval(() => {
      if (step < this.mockTranscripts.length) {
        const item = this.mockTranscripts[step];
        
        this.state.update(s => ({
          ...s,
          transcripts: [...s.transcripts, {
            id: Date.now().toString(),
            timestamp: new Date(),
            speaker: item.speaker as any,
            text: item.text
          }]
        }));

        // Trigger a variance around step 7
        if (step === 7) {
          this.state.update(s => ({
            ...s,
            variances: [{
              id: Date.now().toString(),
              productName: 'Widget Alpha',
              sku: 'SKU-9921',
              expectedQuantity: 500,
              actualQuantity: 450,
              variance: -50,
              status: 'CRITICAL'
            }]
          }));
        }

        step++;
      } else {
        this.endCall();
      }
    }, 2000);
  }

  endCall() {
    if (this.mockIntervalId) {
      clearInterval(this.mockIntervalId);
      this.mockIntervalId = null;
    }
    
    this.state.update(s => ({
      ...s,
      status: 'COMPLETED',
      isStreaming: false
    }));
  }

  ngOnDestroy() {
    if (this.mockIntervalId) {
      clearInterval(this.mockIntervalId);
    }
  }
}
