export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
}

export interface CalculatorState {
  totalRevenue: number;
  monthlyExpenses: CustomExpense[];
  nonMonthlyExpenses: CustomExpense[];
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
