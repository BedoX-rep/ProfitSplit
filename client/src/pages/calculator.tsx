import { useState, useCallback } from "react";
import { ModernCalculatorLayout } from "@/components/modern-calculator-layout";
import { calculateProfit, exportToCSV } from "@/lib/profit-calculator";
import { useCalculateProfit } from "@/hooks/use-calculation";
import { useToast } from "@/hooks/use-toast";
import { CalculatorState } from "@/types/calculator";
import { Member } from "@shared/schema";

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    totalRevenue: 0,
    monthlyExpenses: [
      { id: 'utilities', name: 'Plant/Utilities', amount: 0 },
      { id: 'tax', name: 'Tax', amount: 0 },
      { id: 'mortgage', name: 'Mortgage Costs', amount: 0 }
    ],
    nonMonthlyExpenses: [
      { id: 'merchandise', name: 'Merchandise', amount: 0 },
      { id: 'labor', name: 'Labor Costs', amount: 0 },
      { id: 'loans', name: 'Loans', amount: 0 }
    ],
    framesCost: 0,
    companyPercentage: 0,
    members: []
  });

  const { mutate: saveCalculation } = useCalculateProfit();
  const { toast } = useToast();
  const results = calculateProfit(state);

  const resetCalculator = useCallback(() => {
    setState({
      totalRevenue: 0,
      monthlyExpenses: [
        { id: 'utilities', name: 'Plant/Utilities', amount: 0 },
        { id: 'tax', name: 'Tax', amount: 0 },
        { id: 'mortgage', name: 'Mortgage Costs', amount: 0 }
      ],
      nonMonthlyExpenses: [
        { id: 'merchandise', name: 'Merchandise', amount: 0 },
        { id: 'labor', name: 'Labor Costs', amount: 0 },
        { id: 'loans', name: 'Loans', amount: 0 }
      ],
      framesCost: 0,
      companyPercentage: 0,
      members: []
    });
  }, []);

  const handleExport = useCallback(() => {
    exportToCSV(state, results);
  }, [state, results]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSave = useCallback(() => {
    const calculationInput = {
      totalRevenue: state.totalRevenue,
      monthlyExpenses: state.monthlyExpenses,
      nonMonthlyExpenses: state.nonMonthlyExpenses,
      framesCost: state.framesCost,
      companyPercentage: state.companyPercentage,
      members: state.members,
    };

    saveCalculation(calculationInput, {
      onSuccess: (response) => {
        toast({
          title: "Calculation Saved",
          description: `Your profit calculation has been saved with ID: ${response.id}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save calculation",
          variant: "destructive",
        });
      },
    });
  }, [state, saveCalculation, toast]);

  return (
    <ModernCalculatorLayout
      state={state}
      results={results}
      onStateChange={setState}
      onReset={resetCalculator}
      onExport={handleExport}
      onPrint={handlePrint}
      onSave={handleSave}
    />
  );
}
