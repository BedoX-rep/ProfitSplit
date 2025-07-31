import { z } from "zod";

export const memberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Member name is required"),
  percentage: z.number().min(0).max(100),
});

export const calculationInputSchema = z.object({
  totalRevenue: z.number().min(0),
  utilities: z.number().min(0),
  tax: z.number().min(0),
  mortgage: z.number().min(0),
  otherMonthly: z.number().min(0),
  merchandise: z.number().min(0),
  labor: z.number().min(0),
  loans: z.number().min(0),
  otherNonMonthly: z.number().min(0),
  framesCost: z.number().min(0),
  companyPercentage: z.number().min(0).max(100),
  members: z.array(memberSchema),
});

export type Member = z.infer<typeof memberSchema>;
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
