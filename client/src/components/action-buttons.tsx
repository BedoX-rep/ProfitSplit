
import { Button } from "@/components/ui/button";
import { Download, FileText, RotateCcw } from "lucide-react";
import { CalculatorState, CalculationResults } from "@/types/calculator";
import { formatCurrency } from "@/lib/profit-calculator";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ActionButtonsProps {
  state: CalculatorState;
  results: CalculationResults;
  onReset: () => void;
  onSave: () => void;
}

export function ActionButtons({ state, results, onReset, onSave }: ActionButtonsProps) {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const balanceRest = results.companyShare.total - results.totalNonMonthlyExpenses;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(75, 85, 99);
    doc.text('Profit Sharing Calculator', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 20, 30);
    
    // Revenue Section
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Revenue & Expenses', 20, 50);
    
    doc.autoTable({
      startY: 55,
      head: [['Item', 'Amount']],
      body: [
        ['Total Revenue', formatCurrency(state.totalRevenue)],
        ['Frames Cost', formatCurrency(state.framesCost)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
    });
    
    // Monthly Expenses
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(245, 158, 11);
    doc.text('Monthly Expenses (Unpaid)', 20, currentY);
    
    const monthlyExpensesData = state.monthlyExpenses.map(expense => [
      expense.name,
      formatCurrency(expense.amount)
    ]);
    monthlyExpensesData.push(['Total Monthly Expenses', formatCurrency(results.totalMonthlyExpenses)]);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Expense', 'Amount']],
      body: monthlyExpensesData,
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11] },
      margin: { left: 20, right: 20 },
    });
    
    // Non-Monthly Expenses
    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(147, 51, 234);
    doc.text('Non-Monthly Expenses (Paid)', 20, currentY);
    
    const nonMonthlyExpensesData = state.nonMonthlyExpenses.map(expense => [
      expense.name,
      formatCurrency(expense.amount)
    ]);
    nonMonthlyExpensesData.push(['Total Non-Monthly Expenses', formatCurrency(results.totalNonMonthlyExpenses)]);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Expense', 'Amount']],
      body: nonMonthlyExpensesData,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234] },
      margin: { left: 20, right: 20 },
    });
    
    // Net Profit
    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text('Calculation Results', 20, currentY);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Metric', 'Amount']],
      body: [
        ['Net Profit', formatCurrency(results.netProfit)],
        ['Total Distributed', formatCurrency(results.totalDistributed)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 20, right: 20 },
    });
    
    // Company Distribution
    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('Company Distribution', 20, currentY);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Component', 'Amount']],
      body: [
        ['Profit Share', formatCurrency(results.companyShare.profitShare)],
        ['Tax Refund', formatCurrency(results.companyShare.taxRefund)],
        ['Frames Refund', formatCurrency(results.companyShare.framesRefund)],
        ['Company Total', formatCurrency(results.companyShare.total)],
        ['Balance Rest (Total - Non-Monthly)', formatCurrency(balanceRest)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 20, right: 20 },
    });
    
    // Member Shares
    if (results.memberShares.length > 0) {
      currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('Member Shares', 20, currentY);
      
      const memberData = results.memberShares.map(member => [
        member.name,
        `${member.percentage}%`,
        formatCurrency(member.share)
      ]);
      
      doc.autoTable({
        startY: currentY + 5,
        head: [['Member', 'Percentage', 'Share Amount']],
        body: memberData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        margin: { left: 20, right: 20 },
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`profit-sharing-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const balanceRest = results.companyShare.total - results.totalNonMonthlyExpenses;
    
    const rows = [
      ['Profit Sharing Calculator Results'],
      ['Generated on:', new Date().toLocaleDateString('en-GB')],
      [''],
      ['Revenue & Expenses'],
      ['Total Revenue', formatCurrency(state.totalRevenue)],
      ['Frames Cost', formatCurrency(state.framesCost)],
      [''],
      ['Monthly Expenses (Unpaid)'],
      ...state.monthlyExpenses.map(expense => [expense.name, formatCurrency(expense.amount)]),
      ['Total Monthly Expenses', formatCurrency(results.totalMonthlyExpenses)],
      [''],
      ['Non-Monthly Expenses (Paid)'],
      ...state.nonMonthlyExpenses.map(expense => [expense.name, formatCurrency(expense.amount)]),
      ['Total Non-Monthly Expenses', formatCurrency(results.totalNonMonthlyExpenses)],
      [''],
      ['Results'],
      ['Net Profit', formatCurrency(results.netProfit)],
      [''],
      ['Company Distribution'],
      ['Profit Share', formatCurrency(results.companyShare.profitShare)],
      ['Tax Refund', formatCurrency(results.companyShare.taxRefund)],
      ['Frames Refund', formatCurrency(results.companyShare.framesRefund)],
      ['Company Total', formatCurrency(results.companyShare.total)],
      ['Balance Rest (Total - Non-Monthly)', formatCurrency(balanceRest)],
      [''],
      ['Member Shares'],
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
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button 
        onClick={exportToPDF}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
      
      <Button 
        onClick={exportToCSV}
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      
      <Button 
        onClick={onSave}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Download className="w-4 h-4 mr-2" />
        Save Calculation
      </Button>
      
      <Button 
        onClick={onReset}
        variant="outline"
        className="border-red-500 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset All
      </Button>
    </div>
  );
}
