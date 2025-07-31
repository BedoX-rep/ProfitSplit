import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";
import { CalculationResults } from "@/types/calculator";

interface NetProfitDisplayProps {
  totalRevenue: number;
  framesCost: number;
  results: CalculationResults;
}

export function NetProfitDisplay({ totalRevenue, framesCost, results }: NetProfitDisplayProps) {
  return (
    <Card className="border-gray-200 sticky top-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-emerald-100 rounded-full p-2 mr-3">
            <Calculator className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Net Profit Calculation</h2>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Revenue:</span>
            <span className="font-medium">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Expenses:</span>
            <span className="font-medium text-red-600">-{formatCurrency(results.totalMonthlyExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Non-Monthly Expenses:</span>
            <span className="font-medium text-red-600">-{formatCurrency(results.totalNonMonthlyExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frames Cost:</span>
            <span className="font-medium text-red-600">-{formatCurrency(framesCost)}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Net Profit:</span>
            <span className="text-2xl font-bold text-emerald-600">{formatCurrency(results.netProfit)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
