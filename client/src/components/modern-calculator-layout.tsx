import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  DollarSign, 
  Receipt, 
  ShoppingCart, 
  Image, 
  Users,
  TrendingUp,
  PieChart,
  Download,
  Printer,
  RotateCcw,
  Save
} from "lucide-react";
import { ModernExpenseSection } from "./modern-expense-section";
import { ProfitSharingMembers } from "./profit-sharing-members";
import { formatCurrency, validatePercentages } from "@/lib/profit-calculator";
import { CalculatorState, CalculationResults } from "@/types/calculator";

interface ModernCalculatorLayoutProps {
  state: CalculatorState;
  results: CalculationResults;
  onStateChange: (state: CalculatorState) => void;
  onReset: () => void;
  onExport: () => void;
  onPrint: () => void;
  onSave: () => void;
}

export function ModernCalculatorLayout({
  state,
  results,
  onStateChange,
  onReset,
  onExport,
  onPrint,
  onSave
}: ModernCalculatorLayoutProps) {
  const [activeTab, setActiveTab] = useState("input");
  
  const validation = validatePercentages(state.companyPercentage, state.members);

  const updateRevenue = (value: number) => {
    onStateChange({ ...state, totalRevenue: value });
  };

  const updateFramesCost = (value: number) => {
    onStateChange({ ...state, framesCost: value });
  };

  const updateMonthlyExpenses = (expenses: any[]) => {
    onStateChange({ ...state, monthlyExpenses: expenses });
  };

  const updateNonMonthlyExpenses = (expenses: any[]) => {
    onStateChange({ ...state, nonMonthlyExpenses: expenses });
  };

  const updateCompanyPercentage = (percentage: number) => {
    onStateChange({ ...state, companyPercentage: percentage });
  };

  const updateMembers = (members: any[]) => {
    onStateChange({ ...state, members });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white shadow-lg">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profit Calculator</h1>
                <p className="text-sm text-gray-600">Calculate and distribute business profits</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
                Net Profit: {formatCurrency(results.netProfit)}
              </Badge>
              <div className="flex space-x-2">
                <Button onClick={onSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={onExport} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button onClick={onPrint} size="sm" variant="outline">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                <Button onClick={onReset} size="sm" variant="destructive">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl border border-gray-200">
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium py-3"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Input Data
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium py-3"
            >
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium py-3"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Input */}
              <Card className="border-green-200 bg-green-50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">Total Revenue</h3>
                      <p className="text-sm text-gray-600">Revenue left from monthly operations</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">£</span>
                    <Input
                      type="number"
                      placeholder="6000.00"
                      step="0.01"
                      value={state.totalRevenue || ''}
                      onChange={(e) => updateRevenue(parseFloat(e.target.value) || 0)}
                      className="pl-8 pr-4 py-4 text-xl font-semibold text-center border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Frames Cost */}
              <Card className="border-indigo-200 bg-indigo-50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                      <Image className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900">Frames Cost</h3>
                      <p className="text-sm text-gray-600">Total cost of frames</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">£</span>
                    <Input
                      type="number"
                      placeholder="500.00"
                      step="0.01"
                      value={state.framesCost || ''}
                      onChange={(e) => updateFramesCost(parseFloat(e.target.value) || 0)}
                      className="pl-8 pr-4 py-4 text-xl font-semibold text-center border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModernExpenseSection
                title="Monthly Expenses"
                subtitle="Unpaid monthly operational costs"
                expenses={state.monthlyExpenses}
                onChange={updateMonthlyExpenses}
                color="amber"
                icon={<Receipt className="h-5 w-5" />}
              />

              <ModernExpenseSection
                title="Non-Monthly Expenses"
                subtitle="Paid expenses taken from revenue"
                expenses={state.nonMonthlyExpenses}
                onChange={updateNonMonthlyExpenses}
                color="purple"
                icon={<ShoppingCart className="h-5 w-5" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <ProfitSharingMembers
              companyPercentage={state.companyPercentage}
              members={state.members}
              onCompanyPercentageChange={updateCompanyPercentage}
              onMemberChange={(id, field, value) => {
                const updatedMembers = state.members.map(member =>
                  member.id === id ? { ...member, [field]: value } : member
                );
                updateMembers(updatedMembers);
              }}
              onAddMember={() => {
                const newMember = {
                  id: `member-${Date.now()}`,
                  name: '',
                  percentage: 0
                };
                updateMembers([...state.members, newMember]);
              }}
              onRemoveMember={(id) => {
                updateMembers(state.members.filter(m => m.id !== id));
              }}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Net Profit Calculation */}
              <Card className="border-emerald-200 bg-emerald-50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900">Net Profit Calculation</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Total Revenue:</span>
                      <span className="font-semibold text-lg">{formatCurrency(state.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Monthly Expenses:</span>
                      <span className="font-semibold text-lg text-red-600">-{formatCurrency(results.totalMonthlyExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Non-Monthly Expenses:</span>
                      <span className="font-semibold text-lg text-green-600">+{formatCurrency(results.totalNonMonthlyExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Frames Cost:</span>
                      <span className="font-semibold text-lg text-red-600">-{formatCurrency(state.framesCost)}</span>
                    </div>
                    <hr className="my-4 border-emerald-200" />
                    <div className="flex justify-between items-center py-3 bg-emerald-100 rounded-lg px-4">
                      <span className="text-xl font-bold text-emerald-900">Net Profit:</span>
                      <span className="text-2xl font-bold text-emerald-600">{formatCurrency(results.netProfit)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Summary */}
              <Card className="border-purple-200 bg-purple-50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900">Distribution Summary</h3>
                  </div>

                  {/* Company Share */}
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-900">Company Total:</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(results.companyShare.total)}</span>
                    </div>
                    <div className="text-sm space-y-1 text-green-700">
                      <div className="flex justify-between">
                        <span>Profit Share:</span>
                        <span>{formatCurrency(results.companyShare.profitShare)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Refund:</span>
                        <span>{formatCurrency(results.companyShare.taxRefund)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frames Refund:</span>
                        <span>{formatCurrency(results.companyShare.framesRefund)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Member Shares */}
                  <div className="space-y-3">
                    {results.memberShares.map((member) => (
                      <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{member.name}</span>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatCurrency(member.share)}</div>
                            <div className="text-sm text-gray-500">{member.percentage}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-purple-900">Total Distributed:</span>
                      <span className="text-xl font-bold text-purple-600">{formatCurrency(results.totalDistributed)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}