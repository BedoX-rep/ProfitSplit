import { useState, useCallback } from "react";
import { RevenueInput } from "@/components/revenue-input";
import { MonthlyExpenses } from "@/components/monthly-expenses";
import { NonMonthlyExpenses } from "@/components/non-monthly-expenses";
import { FramesCost } from "@/components/frames-cost";
import { ProfitSharingMembers } from "@/components/profit-sharing-members";
import { NetProfitDisplay } from "@/components/net-profit-display";
import { DistributionSummary } from "@/components/distribution-summary";
import { ActionButtons } from "@/components/action-buttons";
import { calculateProfit } from "@/lib/profit-calculator";
import { CalculatorState } from "@/types/calculator";

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    totalRevenue: 0,
    utilities: 0,
    tax: 0,
    mortgage: 0,
    otherMonthly: 0,
    merchandise: 0,
    labor: 0,
    loans: 0,
    otherNonMonthly: 0,
    framesCost: 0,
    companyPercentage: 0,
    members: []
  });

  const results = calculateProfit(state);

  const updateField = useCallback((field: keyof CalculatorState, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateExpense = useCallback((field: string, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const addMember = useCallback(() => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: '',
      percentage: 0
    };
    setState(prev => ({ ...prev, members: [...prev.members, newMember] }));
  }, []);

  const removeMember = useCallback((id: string) => {
    setState(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
  }, []);

  const updateMember = useCallback((id: string, field: 'name' | 'percentage', value: string | number) => {
    setState(prev => ({
      ...prev,
      members: prev.members.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  }, []);

  const resetCalculator = useCallback(() => {
    setState({
      totalRevenue: 0,
      utilities: 0,
      tax: 0,
      mortgage: 0,
      otherMonthly: 0,
      merchandise: 0,
      labor: 0,
      loans: 0,
      otherNonMonthly: 0,
      framesCost: 0,
      companyPercentage: 0,
      members: []
    });
  }, []);

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profit Sharing Calculator</h1>
          <p className="text-gray-600">Calculate net profit and distribute shares among members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <RevenueInput 
              value={state.totalRevenue}
              onChange={(value) => updateField('totalRevenue', value)}
            />

            <MonthlyExpenses
              utilities={state.utilities}
              tax={state.tax}
              mortgage={state.mortgage}
              otherMonthly={state.otherMonthly}
              onChange={updateExpense}
            />

            <NonMonthlyExpenses
              merchandise={state.merchandise}
              labor={state.labor}
              loans={state.loans}
              otherNonMonthly={state.otherNonMonthly}
              onChange={updateExpense}
            />

            <FramesCost
              value={state.framesCost}
              onChange={(value) => updateField('framesCost', value)}
            />

            <ProfitSharingMembers
              companyPercentage={state.companyPercentage}
              members={state.members}
              onCompanyPercentageChange={(percentage) => updateField('companyPercentage', percentage)}
              onMemberChange={updateMember}
              onAddMember={addMember}
              onRemoveMember={removeMember}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <NetProfitDisplay
              totalRevenue={state.totalRevenue}
              framesCost={state.framesCost}
              results={results}
            />

            <DistributionSummary results={results} />

            <ActionButtons
              state={state}
              results={results}
              onReset={resetCalculator}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
