import { type CalculationInput, type CalculationResult } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for profit calculations
export interface IStorage {
  saveCalculation(calculation: CalculationInput): Promise<{ id: string; result: CalculationResult }>;
  getCalculation(id: string): Promise<{ input: CalculationInput; result: CalculationResult } | undefined>;
  getRecentCalculations(): Promise<Array<{ id: string; timestamp: Date; result: CalculationResult }>>;
}

export class MemStorage implements IStorage {
  private calculations: Map<string, { input: CalculationInput; result: CalculationResult; timestamp: Date }>;

  constructor() {
    this.calculations = new Map();
  }

  async saveCalculation(calculation: CalculationInput): Promise<{ id: string; result: CalculationResult }> {
    const id = randomUUID();
    
    // Calculate the result
    const result = this.calculateProfit(calculation);
    
    this.calculations.set(id, {
      input: calculation,
      result,
      timestamp: new Date()
    });
    
    return { id, result };
  }

  async getCalculation(id: string): Promise<{ input: CalculationInput; result: CalculationResult } | undefined> {
    const calc = this.calculations.get(id);
    if (!calc) return undefined;
    
    return {
      input: calc.input,
      result: calc.result
    };
  }

  async getRecentCalculations(): Promise<Array<{ id: string; timestamp: Date; result: CalculationResult }>> {
    return Array.from(this.calculations.entries())
      .map(([id, calc]) => ({
        id,
        timestamp: calc.timestamp,
        result: calc.result
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }

  private calculateProfit(input: CalculationInput): CalculationResult {
    // Calculate total monthly expenses
    const totalMonthlyExpenses = input.monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate total non-monthly expenses
    const totalNonMonthlyExpenses = input.nonMonthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate net profit following the flowchart logic
    // Note: Non-monthly expenses are ADDED back (they were already paid from revenue)
    const netProfit = input.totalRevenue - totalMonthlyExpenses + totalNonMonthlyExpenses - input.framesCost;
    
    // Calculate company profit share (percentage of net profit)
    const companyProfitShare = (netProfit * input.companyPercentage) / 100;
    
    // Company gets tax and frames cost refunded
    const taxExpense = input.monthlyExpenses.find(e => e.name.toLowerCase().includes('tax'))?.amount || 0;
    const companyTaxRefund = taxExpense;
    const companyFramesRefund = input.framesCost;
    const companyTotalShare = companyProfitShare + companyTaxRefund + companyFramesRefund;
    
    // Calculate member shares
    const memberShares = input.members.map(member => ({
      id: member.id,
      name: member.name,
      percentage: member.percentage,
      share: (netProfit * member.percentage) / 100
    }));
    
    // Calculate total distributed
    const totalDistributed = companyTotalShare + memberShares.reduce((sum, member) => sum + member.share, 0);
    
    return {
      netProfit,
      totalMonthlyExpenses,
      totalNonMonthlyExpenses,
      companyShare: {
        profitShare: companyProfitShare,
        taxRefund: companyTaxRefund,
        framesRefund: companyFramesRefund,
        total: companyTotalShare
      },
      memberShares,
      totalDistributed
    };
  }
}

export const storage = new MemStorage();
