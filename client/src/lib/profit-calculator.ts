import { CalculationInput, CalculationResult } from "@shared/schema";

export function calculateProfit(input: CalculationInput): CalculationResult {
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

export function exportToCSV(input: CalculationInput, results: CalculationResult): void {
  const rows = [
    ['Profit Sharing Calculator Results'],
    [''],
    ['Revenue & Expenses'],
    ['Total Revenue', formatCurrency(input.totalRevenue)],
    ['Monthly Expenses'],
    ...input.monthlyExpenses.map(expense => [`  ${expense.name}`, formatCurrency(expense.amount)]),
    ['  Total Monthly', formatCurrency(results.totalMonthlyExpenses)],
    ['Non-Monthly Expenses'],
    ...input.nonMonthlyExpenses.map(expense => [`  ${expense.name}`, formatCurrency(expense.amount)]),
    ['  Total Non-Monthly', formatCurrency(results.totalNonMonthlyExpenses)],
    ['Frames Cost', formatCurrency(input.framesCost)],
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
