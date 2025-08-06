export interface WalletActivity {
  timestamp: number;
  programId: string;
  actionType: string;
  txSignature: string;
  amount?: number;
}

export interface BehaviorPattern {
  type: string;
  confidence: number;
  tags: string[];
  summary: string;
}
