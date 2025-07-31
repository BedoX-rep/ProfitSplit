import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface NonMonthlyExpensesProps {
  merchandise: number;
  labor: number;
  loans: number;
  otherNonMonthly: number;
  onChange: (field: string, value: number) => void;
}

export function NonMonthlyExpenses({ merchandise, labor, loans, otherNonMonthly, onChange }: NonMonthlyExpensesProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 3: Paid Non-Monthly Expenses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="merchandise" className="block text-sm font-medium text-gray-700 mb-2">
              Merchandise
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="merchandise"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={merchandise || ''}
                onChange={(e) => onChange('merchandise', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="labor" className="block text-sm font-medium text-gray-700 mb-2">
              Labor Costs
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="labor"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={labor || ''}
                onChange={(e) => onChange('labor', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="loans" className="block text-sm font-medium text-gray-700 mb-2">
              Loans
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="loans"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={loans || ''}
                onChange={(e) => onChange('loans', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="otherNonMonthly" className="block text-sm font-medium text-gray-700 mb-2">
              Other Non-Monthly
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="otherNonMonthly"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={otherNonMonthly || ''}
                onChange={(e) => onChange('otherNonMonthly', parseFloat(e.target.value) || 0)}
                className="pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
