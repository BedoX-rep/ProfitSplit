// Serverless function types (works with Vercel, Netlify, etc.)
interface APIRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface APIResponse {
  status: (code: number) => APIResponse;
  json: (data: any) => APIResponse;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}
import { calculationInputSchema, type CalculationInput, type CalculationResult } from '../shared/schema';

// Serverless function for profit calculation
export default function handler(req: APIRequest, res: APIResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input data
    const validatedInput = calculationInputSchema.parse(req.body);
    
    // Calculate profit distribution
    const result = calculateProfit(validatedInput);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Invalid input data'
    });
  }
}

function calculateProfit(input: CalculationInput): CalculationResult {
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