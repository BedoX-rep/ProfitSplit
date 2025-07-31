import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Download, Printer, Loader2 } from "lucide-react";
import { CalculationInput, CalculationResult } from "@shared/schema";

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  isCalculationReady: boolean;
  calculationInput: CalculationInput;
  result: CalculationResult;
}

export function ActionButtons({ 
  onSave, 
  onReset, 
  isSaving, 
  isCalculationReady, 
  calculationInput, 
  result 
}: ActionButtonsProps) {
  
  const handleExportCSV = () => {
    // Create CSV content
    const csvHeaders = ['Item', 'Amount', 'Type'];
    const csvRows = [
      csvHeaders.join(','),
      `"Total Revenue","${calculationInput.totalRevenue}","Revenue"`,
    ];

    // Add monthly expenses
    calculationInput.monthlyExpenses.forEach(expense => {
      csvRows.push(`"${expense.name}","-${expense.amount}","Monthly Expense"`);
    });

    // Add non-monthly expenses
    calculationInput.nonMonthlyExpenses.forEach(expense => {
      csvRows.push(`"${expense.name}","-${expense.amount}","Non-Monthly Expense"`);
    });

    // Add frames cost
    if (calculationInput.framesCost > 0) {
      csvRows.push(`"Frames Cost","-${calculationInput.framesCost}","Frames"`);
    }

    csvRows.push(`"Net Profit","${result.netProfit}","Profit"`);

    // Add distributions
    result.memberShares.forEach(share => {
      csvRows.push(`"${share.name} - Profit Share","${share.share}","Distribution"`);
    });

    if (result.companyShare.total > 0) {
      csvRows.push(`"Company Share","${result.companyShare.total}","Distribution"`);
      if (result.companyShare.taxRefund > 0) {
        csvRows.push(`"Company Tax Refund","${result.companyShare.taxRefund}","Refund"`);
      }
      if (result.companyShare.framesRefund > 0) {
        csvRows.push(`"Company Frames Refund","${result.companyShare.framesRefund}","Refund"`);
      }
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `profit-calculation-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-secondary/10 p-3">
          <Save className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Actions</h2>
          <p className="text-body-sm text-muted-foreground">Save, export, or reset calculation</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="space-y-3">
          <Button
            data-testid="button-save-calculation"
            onClick={onSave}
            disabled={!isCalculationReady || isSaving}
            className="btn-primary w-full h-12"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Calculation
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              data-testid="button-export-csv"
              variant="outline"
              onClick={handleExportCSV}
              disabled={!isCalculationReady}
              className="btn-outline h-12"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Button
              data-testid="button-print"
              variant="outline"
              onClick={handlePrint}
              disabled={!isCalculationReady}
              className="btn-outline h-12"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Reset Action */}
        <div className="pt-4 border-t border-border">
          <Button
            data-testid="button-reset-calculation"
            variant="ghost"
            onClick={onReset}
            className="btn-ghost w-full h-12 text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Fields
          </Button>
        </div>

        {/* Status Information */}
        {!isCalculationReady && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-caption text-warning font-medium text-center">
              Add revenue and team members to enable actions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}