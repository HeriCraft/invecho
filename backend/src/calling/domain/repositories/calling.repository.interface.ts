export interface CallLog {
  id: string;
  agentId: string;
  targetId: string;
  status: string;
  timestamp: Date;
}

export interface ICallingRepository {
  logCall(log: CallLog): Promise<void>;
}
