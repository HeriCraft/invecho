export type CallStatus = 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: 'AGENT' | 'CUSTOMER' | 'SYSTEM';
  text: string;
}

export interface StockVariance {
  id: string;
  productName: string;
  sku: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  status: 'RESOLVED' | 'PENDING' | 'CRITICAL';
}

export interface CallState {
  callId: string | null;
  status: CallStatus | null;
  transcripts: TranscriptEntry[];
  variances: StockVariance[];
  isStreaming: boolean;
}
