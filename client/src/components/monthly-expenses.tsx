import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";

interface MonthlyExpensesProps {
  utilities: number;
  tax: number;
  mortgage: number;
  otherMonthly: number;
  onChange: (field: string, value: number) => void;
}

export function MonthlyExpenses({ utilities, tax, mortgage, otherMonthly, onChange }: MonthlyExpensesProps) {
  const total = utilities + tax + mortgage + otherMonthly;

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-amber-100 rounded-full p-2 mr-3">
            <Receipt className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 2: Unpaid Monthly Expenses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-2">
              Plant/Utilities
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="utilities"
                type="number"
                placeholder="200.00"
                step="0.01"
                value={utilities || ''}
                onChange={(e) => onChange('utilities', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-2">
              Tax
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="tax"
                type="number"
                placeholder="150.00"
                step="0.01"
                value={tax || ''}
                onChange={(e) => onChange('tax', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mortgage" className="block text-sm font-medium text-gray-700 mb-2">
              Mortgage Costs
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="mortgage"
                type="number"
                placeholder="250.00"
                step="0.01"
                value={mortgage || ''}
                onChange={(e) => onChange('mortgage', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="otherMonthly" className="block text-sm font-medium text-gray-700 mb-2">
              Other Monthly Costs
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="otherMonthly"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={otherMonthly || ''}
                onChange={(e) => onChange('otherMonthly', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Monthly Expenses:</span>
            <span className="text-lg font-semibold text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
