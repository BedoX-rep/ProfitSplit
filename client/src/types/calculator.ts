export interface CalculatorState {
  totalRevenue: number;
  utilities: number;
  tax: number;
  mortgage: number;
  otherMonthly: number;
  merchandise: number;
  labor: number;
  loans: number;
  otherNonMonthly: number;
  framesCost: number;
  companyPercentage: number;
  members: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
}

export interface CalculationResults {
  netProfit: number;
  totalMonthlyExpenses: number;
  totalNonMonthlyExpenses: number;
  companyShare: {
    profitShare: number;
    taxRefund: number;
    framesRefund: number;
    total: number;
  };
  memberShares: Array<{
    id: string;
    name: string;
    percentage: number;
    share: number;
  }>;
  totalDistributed: number;
}
