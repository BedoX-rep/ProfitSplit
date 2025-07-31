import { useState, useCallback } from "react";
import { useCalculation } from "@/hooks/use-calculation";
import { Member, CustomExpense } from "@shared/schema";
import { calculateProfit } from "@/lib/profit-calculator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calculator as CalculatorIcon, TrendingUp, Users, DollarSign, Receipt, Zap } from "lucide-react";
import { RevenueInput } from "@/components/revenue-input";
import { MonthlyExpenses } from "@/components/monthly-expenses";
import { NonMonthlyExpenses } from "@/components/non-monthly-expenses";
import { FramesCost } from "@/components/frames-cost";
import { ProfitSharingMembers } from "@/components/profit-sharing-members";
import { NetProfitDisplay } from "@/components/net-profit-display";
import { DistributionSummary } from "@/components/distribution-summary";
import { ActionButtons } from "@/components/action-buttons";
import { RecentCalculations } from "@/components/recent-calculations";

export default function Calculator() {
  const { mutateAsync: saveCalculation, isPending: isSaving } = useCalculation();

  // Form state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<CustomExpense[]>([]);
  const [nonMonthlyExpenses, setNonMonthlyExpenses] = useState<CustomExpense[]>([]);
  const [framesCost, setFramesCost] = useState(0);
  const [companyPercentage, setCompanyPercentage] = useState(50);
  const [members, setMembers] = useState<Member[]>([]);

  // Calculate results in real-time
  const calculationInput = {
    totalRevenue,
    monthlyExpenses,
    nonMonthlyExpenses,
    framesCost,
    companyPercentage,
    members,
  };

  const result = calculateProfit(calculationInput);

  const handleSave = useCallback(async () => {
    try {
      await saveCalculation(calculationInput);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  }, [saveCalculation, calculationInput]);

  const handleReset = useCallback(() => {
    setTotalRevenue(0);
    setMonthlyExpenses([]);
    setNonMonthlyExpenses([]);
    setFramesCost(0);
    setCompanyPercentage(50);
    setMembers([]);
  }, []);

  const isCalculationReady = totalRevenue > 0 && members.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-primary-muted/10">
      {/* Header */}
      <header className="relative border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-lg">
                <CalculatorIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-display-sm font-bold text-foreground">
                  Business Profit Calculator
                </h1>
                <p className="text-body-sm text-muted-foreground">
                  Professional profit distribution and analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-4 text-body-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  Live calculations
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card-elevated p-4 group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Total Revenue</p>
                    <p className="text-body font-semibold text-foreground">
                      ${totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-elevated p-4 group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/10 p-2 group-hover:bg-secondary/20 transition-colors">
                    <Receipt className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Total Expenses</p>
                    <p className="text-body font-semibold text-foreground">
                      ${(result.totalMonthlyExpenses + result.totalNonMonthlyExpenses).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-elevated p-4 group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2 group-hover:bg-success/20 transition-colors">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Net Profit</p>
                    <p className="text-body font-semibold text-foreground">
                      ${result.netProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-elevated p-4 group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2 group-hover:bg-warning/20 transition-colors">
                    <Users className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Team Members</p>
                    <p className="text-body font-semibold text-foreground">
                      {members.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Sections */}
            <div className="space-y-6">
              <div className="animate-slide-up">
                <RevenueInput 
                  value={totalRevenue} 
                  onChange={setTotalRevenue} 
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <MonthlyExpenses
                  expenses={monthlyExpenses}
                  onChange={setMonthlyExpenses}
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <NonMonthlyExpenses
                  expenses={nonMonthlyExpenses}
                  onChange={setNonMonthlyExpenses}
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <FramesCost
                  value={framesCost}
                  onChange={setFramesCost}
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <ProfitSharingMembers
                  members={members}
                  onChange={setMembers}
                  companyPercentage={companyPercentage}
                  onCompanyPercentageChange={setCompanyPercentage}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Results & Actions */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <NetProfitDisplay result={result} />
            </div>
            
            {isCalculationReady && (
              <>
                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <DistributionSummary result={result} />
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  <ActionButtons
                    onSave={handleSave}
                    onReset={handleReset}
                    isSaving={isSaving}
                    isCalculationReady={isCalculationReady}
                    calculationInput={calculationInput}
                    result={result}
                  />
                </div>
              </>
            )}
            
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <RecentCalculations />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}