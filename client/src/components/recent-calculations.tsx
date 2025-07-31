import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calculator, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";
import { useRecentCalculations } from "@/hooks/use-calculation";
import { CalculationResult } from "@shared/schema";

interface RecentCalculationsProps {
  onLoadCalculation?: (id: string) => void;
}

export function RecentCalculations({ onLoadCalculation }: RecentCalculationsProps) {
  const { data: recent, isLoading, error } = useRecentCalculations();

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !recent?.length) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Calculator className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No calculations saved yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Calculations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.map((calc) => (
            <div key={calc.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                  {calc.timestamp.toLocaleDateString()} at {calc.timestamp.toLocaleTimeString()}
                </div>
                {onLoadCalculation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadCalculation(calc.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Profit:</span>
                  <span className="font-medium">{formatCurrency(calc.result.netProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Share:</span>
                  <span className="font-medium">{formatCurrency(calc.result.companyShare.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="text-gray-500">{calc.result.memberShares.length} people</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}