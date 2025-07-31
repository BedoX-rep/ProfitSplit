import { Button } from "@/components/ui/button";
import { Save, Check, AlertCircle } from "lucide-react";
import { useCalculateProfit } from "@/hooks/use-calculation";
import { useToast } from "@/hooks/use-toast";
import { CalculatorState } from "@/types/calculator";

interface SaveCalculationProps {
  state: CalculatorState;
  disabled?: boolean;
}

export function SaveCalculation({ state, disabled }: SaveCalculationProps) {
  const { mutate: saveCalculation, isPending, isSuccess, error } = useCalculateProfit();
  const { toast } = useToast();

  const handleSave = () => {
    // Convert CalculatorState to CalculationInput format
    const calculationInput = {
      totalRevenue: state.totalRevenue,
      utilities: state.utilities,
      tax: state.tax,
      mortgage: state.mortgage,
      otherMonthly: state.otherMonthly,
      merchandise: state.merchandise,
      labor: state.labor,
      loans: state.loans,
      otherNonMonthly: state.otherNonMonthly,
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
  };

  const getButtonContent = () => {
    if (isPending) {
      return (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          Saving...
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved!
        </>
      );
    }

    if (error) {
      return (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          Try Again
        </>
      );
    }

    return (
      <>
        <Save className="h-4 w-4 mr-2" />
        Save Calculation
      </>
    );
  };

  const getButtonVariant = () => {
    if (error) return "destructive";
    if (isSuccess) return "secondary";
    return "default";
  };

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || isPending}
      variant={getButtonVariant()}
      className="w-full py-3 font-medium"
    >
      {getButtonContent()}
    </Button>
  );
}