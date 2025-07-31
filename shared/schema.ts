import { z } from "zod";

export const memberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Member name is required"),
  percentage: z.number().min(0).max(100),
});

export const customExpenseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Expense name is required"),
  amount: z.number().min(0),
});

export const calculationInputSchema = z.object({
  totalRevenue: z.number().min(0),
  monthlyExpenses: z.array(customExpenseSchema),
  nonMonthlyExpenses: z.array(customExpenseSchema),
  framesCost: z.number().min(0),
  taxAmount: z.number().min(0),
  companyPercentage: z.number().min(0).max(100),
  members: z.array(memberSchema),
});

export type Member = z.infer<typeof memberSchema>;
export type CustomExpense = z.infer<typeof customExpenseSchema>;
export type CalculationInput = z.infer<typeof calculationInputSchema>;

export type CalculationResult = {
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
};
