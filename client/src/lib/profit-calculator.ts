import { CalculatorState, CalculationResults } from "@/types/calculator";

export function calculateProfit(state: CalculatorState): CalculationResults {
  // Calculate total monthly expenses
  const totalMonthlyExpenses = state.monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate total non-monthly expenses
  const totalNonMonthlyExpenses = state.nonMonthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net profit following the flowchart logic
  // Note: Non-monthly expenses are ADDED back (they were already paid from revenue)
  const netProfit = state.totalRevenue - totalMonthlyExpenses + totalNonMonthlyExpenses - state.framesCost;
  
  // Calculate company profit share (percentage of net profit)
  const companyProfitShare = (netProfit * state.companyPercentage) / 100;
  
  // Company gets tax and frames cost refunded
  const taxExpense = state.monthlyExpenses.find(e => e.name.toLowerCase().includes('tax'))?.amount || 0;
  const companyTaxRefund = taxExpense;
  const companyFramesRefund = state.framesCost;
  const companyTotalShare = companyProfitShare + companyTaxRefund + companyFramesRefund;
  
  // Calculate member shares
  const memberShares = state.members.map(member => ({
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
}

export function validatePercentages(companyPercentage: number, members: Array<{ percentage: number }>): {
  total: number;
  isValid: boolean;
} {
  const total = companyPercentage + members.reduce((sum, member) => sum + member.percentage, 0);
  return {
    total,
    isValid: Math.abs(total - 100) < 0.01 // Allow for small floating point errors
  };
}

export function exportToCSV(state: CalculatorState, results: CalculationResults): void {
  const rows = [
    ['Profit Sharing Calculator Results'],
    [''],
    ['Revenue & Expenses'],
    ['Total Revenue', formatCurrency(state.totalRevenue)],
    ['Monthly Expenses'],
    ...state.monthlyExpenses.map(expense => [`  ${expense.name}`, formatCurrency(expense.amount)]),
    ['  Total Monthly', formatCurrency(results.totalMonthlyExpenses)],
    ['Non-Monthly Expenses'],
    ...state.nonMonthlyExpenses.map(expense => [`  ${expense.name}`, formatCurrency(expense.amount)]),
    ['  Total Non-Monthly', formatCurrency(results.totalNonMonthlyExpenses)],
    ['Frames Cost', formatCurrency(state.framesCost)],
    ['Net Profit', formatCurrency(results.netProfit)],
    [''],
    ['Distribution'],
    ['Company'],
    ['  Profit Share', formatCurrency(results.companyShare.profitShare)],
    ['  Tax Refund', formatCurrency(results.companyShare.taxRefund)],
    ['  Frames Refund', formatCurrency(results.companyShare.framesRefund)],
    ['  Total Company Share', formatCurrency(results.companyShare.total)],
    [''],
    ['Members'],
    ...results.memberShares.map(member => [
      member.name,
      `${member.percentage}%`,
      formatCurrency(member.share)
    ]),
    [''],
    ['Total Distributed', formatCurrency(results.totalDistributed)]
  ];

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `profit-sharing-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
