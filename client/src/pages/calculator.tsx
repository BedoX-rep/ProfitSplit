
import { useState } from "react";
import { ModernCalculatorLayout } from "@/components/modern-calculator-layout";
import { useCalculation } from "@/hooks/use-calculation";
import { CalculatorState } from "@/types/calculator";
import { exportToCSV } from "@/lib/profit-calculator";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from "@/lib/profit-calculator";

const initialState: CalculatorState = {
  totalRevenue: 0,
  framesCost: 0,
  monthlyExpenses: [],
  nonMonthlyExpenses: [],
  companyPercentage: 0,
  members: []
};

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const { data: results } = useCalculation(state);

  const handleReset = () => {
    setState(initialState);
  };

  const handleExport = () => {
    if (results) {
      exportToCSV(state, results);
    }
  };

  const handlePrint = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Calculate Balance Rest
    const balanceRest = results.companyShare.total - results.totalNonMonthlyExpenses;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Profit Distribution Report', 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    let currentY = 45;
    
    // Revenue & Expenses Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Revenue & Expenses Summary', 20, currentY);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Description', 'Amount']],
      body: [
        ['Total Revenue', formatCurrency(state.totalRevenue)],
        ['Monthly Expenses', formatCurrency(results.totalMonthlyExpenses)],
        ['Non-Monthly Expenses', formatCurrency(results.totalNonMonthlyExpenses)],
        ['Frames Cost', formatCurrency(state.framesCost)],
        ['Net Profit', formatCurrency(results.netProfit)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
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
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`profit-distribution-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSave = () => {
    const calculationData = {
      state,
      results,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`calculation-${Date.now()}`, JSON.stringify(calculationData));
    alert('Calculation saved successfully!');
  };

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <ModernCalculatorLayout
      state={state}
      results={results}
      onStateChange={setState}
      onReset={handleReset}
      onExport={handleExport}
      onPrint={handlePrint}
      onSave={handleSave}
    />
  );
}
