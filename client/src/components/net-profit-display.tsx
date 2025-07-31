import { CalculationResult } from "@shared/schema";
import { TrendingUp, DollarSign, Calculator, ArrowUp, ArrowDown } from "lucide-react";

interface NetProfitDisplayProps {
  result: CalculationResult;
}

export function NetProfitDisplay({ result }: NetProfitDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Safety check for result object
  if (!result) {
    return (
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl p-3 bg-muted/30">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-display-sm font-bold text-foreground">Net Profit</h2>
            <p className="text-body-sm text-muted-foreground">Enter calculation data to see results</p>
          </div>
        </div>
      </div>
    );
  }

  const isProfitable = result.netProfit > 0;

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`rounded-xl p-3 ${isProfitable ? 'bg-success/10' : 'bg-warning/10'}`}>
          <TrendingUp className={`h-6 w-6 ${isProfitable ? 'text-success' : 'text-warning'}`} />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Net Profit</h2>
          <p className="text-body-sm text-muted-foreground">Calculated business profit</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Profit Display */}
        <div className={`p-6 rounded-xl border-2 ${
          isProfitable 
            ? 'bg-gradient-to-r from-success/5 to-success/10 border-success/20' 
            : 'bg-gradient-to-r from-warning/5 to-warning/10 border-warning/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${isProfitable ? 'bg-success/20' : 'bg-warning/20'}`}>
                <DollarSign className={`h-8 w-8 ${isProfitable ? 'text-success' : 'text-warning'}`} />
              </div>
              <div>
                <h3 className="text-display-lg font-bold text-foreground">
                  {formatCurrency(result.netProfit)}
                </h3>
                <p className={`text-body-sm font-medium ${isProfitable ? 'text-success' : 'text-warning'}`}>
                  {isProfitable ? 'Profitable' : 'Loss'}
                  {isProfitable ? <ArrowUp className="inline h-4 w-4 ml-1" /> : <ArrowDown className="inline h-4 w-4 ml-1" />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <h4 className="text-body-lg font-semibold text-foreground flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculation Breakdown
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
              <span className="text-body text-muted-foreground">Monthly Expenses</span>
              <span className="text-body font-semibold text-destructive">
                -{formatCurrency(result.totalMonthlyExpenses)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
              <span className="text-body text-muted-foreground">Non-Monthly Expenses</span>
              <span className="text-body font-semibold text-success">
                +{formatCurrency(result.totalNonMonthlyExpenses)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
              <span className="text-body text-muted-foreground">Frames Cost</span>
              <span className="text-body font-semibold text-destructive">
                -{formatCurrency(result.companyShare.framesRefund)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
              <span className="text-body text-muted-foreground">Tax Amount</span>
              <span className="text-body font-semibold text-destructive">
                -{formatCurrency(result.companyShare.taxRefund)}
              </span>
            </div>
          </div>
        </div>

        {/* Profitability Status */}
        <div className={`p-4 rounded-lg ${
          isProfitable 
            ? 'bg-success/10 border border-success/20' 
            : 'bg-warning/10 border border-warning/20'
        }`}>
          <p className={`text-body-sm font-medium text-center ${isProfitable ? 'text-success' : 'text-warning'}`}>
            {isProfitable 
              ? 'Your business is profitable! Ready for distribution.' 
              : 'Business shows a loss. Consider reviewing expenses.'}
          </p>
        </div>
      </div>
    </div>
  );
}