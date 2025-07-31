import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Building, User } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";
import { CalculationResults } from "@/types/calculator";

interface DistributionSummaryProps {
  results: CalculationResults;
}

export function DistributionSummary({ results }: DistributionSummaryProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Distribution Summary</h2>
        </div>
        
        {/* Company Distribution */}
        <div className="border border-green-200 rounded-lg p-4 mb-4 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Building className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Company</span>
            </div>
            <span className="text-lg font-semibold text-green-900">
              {formatCurrency(results.companyShare.total)}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-green-700">Profit Share:</span>
              <span>{formatCurrency(results.companyShare.profitShare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Tax Refund:</span>
              <span>{formatCurrency(results.companyShare.taxRefund)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Frames Refund:</span>
              <span>{formatCurrency(results.companyShare.framesRefund)}</span>
            </div>
          </div>
        </div>

        {/* Other Members Distribution */}
        {results.memberShares.map((member) => (
          <div key={member.id} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">{member.name}</span>
                <span className="ml-2 text-sm text-gray-500">({member.percentage}%)</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(member.share)}
              </span>
            </div>
          </div>
        ))}

        {/* Total Verification */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Distributed:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(results.totalDistributed)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
