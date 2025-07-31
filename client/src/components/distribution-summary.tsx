
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Building, User, Calculator, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";
import { CalculationResults } from "@/types/calculator";

interface DistributionSummaryProps {
  results: CalculationResults;
}

export function DistributionSummary({ results }: DistributionSummaryProps) {
  // Calculate Balance Rest: Company Total - Paid Non Monthly Expenses
  const balanceRest = results.companyShare.total - results.totalNonMonthlyExpenses;

  return (
    <div className="space-y-6">
      {/* Main Distribution Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 mr-4 shadow-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Distribution Summary</h2>
          </div>
          
          {/* Net Profit Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-lg font-semibold text-gray-700">Net Profit</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(results.netProfit)}
              </span>
            </div>
          </div>

          {/* Company Distribution */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-2 mr-3">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-green-900">Company Share</span>
              </div>
              <span className="text-2xl font-bold text-green-900">
                {formatCurrency(results.companyShare.total)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Profit Share:</span>
                  <span className="font-semibold">{formatCurrency(results.companyShare.profitShare)}</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Tax Refund:</span>
                  <span className="font-semibold">{formatCurrency(results.companyShare.taxRefund)}</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Frames Refund:</span>
                  <span className="font-semibold">{formatCurrency(results.companyShare.framesRefund)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Rest Calculation */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-amber-500 rounded-full p-2 mr-3">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-amber-900">Balance Rest</span>
                <span className="ml-2 text-sm text-amber-700">(Company Total - Non-Monthly Expenses)</span>
              </div>
              <span className="text-2xl font-bold text-amber-900">
                {formatCurrency(balanceRest)}
              </span>
            </div>
            <div className="mt-3 text-sm text-amber-700 bg-white/60 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span>Company Total:</span>
                <span className="font-semibold">{formatCurrency(results.companyShare.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Non-Monthly Expenses:</span>
                <span className="font-semibold">-{formatCurrency(results.totalNonMonthlyExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Members Distribution */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Member Shares</h3>
            {results.memberShares.map((member) => (
              <div key={member.id} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-lg">{member.name}</span>
                      <span className="ml-3 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {member.percentage}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(member.share)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Verification */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Total Distributed:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(results.totalDistributed)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
