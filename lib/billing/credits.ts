import { getPlan } from "./plans";

export type CreditLedgerEntry = {
  customerId: string;
  planId: string;
  delta: number;
  reason: "purchase" | "file_cleaned" | "manual_adjustment" | "refund";
  createdAt: string;
};

export type CreditBalance = {
  customerId: string;
  planId: string;
  creditsRemaining: number;
  rowLimit: number;
  fileLimit: number;
};

export function createInitialCreditBalance(customerId: string, planId: string): CreditBalance {
  const plan = getPlan(planId);
  return {
    customerId,
    planId: plan.id,
    creditsRemaining: plan.credits,
    rowLimit: plan.rowLimit,
    fileLimit: plan.fileLimit
  };
}

export function applyCreditEntry(balance: CreditBalance, entry: CreditLedgerEntry): CreditBalance {
  return {
    ...balance,
    creditsRemaining: Math.max(0, balance.creditsRemaining + entry.delta)
  };
}
