import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Check } from "lucide-react";
import { useCalculation } from "@/hooks/use-calculation";
import { CalculationInput, CalculationResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface SaveCalculationProps {
  calculationInput: CalculationInput;
  result: CalculationResult;
  isCalculationReady: boolean;
}

export function SaveCalculation({ calculationInput, result, isCalculationReady }: SaveCalculationProps) {
  const [calculationName, setCalculationName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const { mutateAsync: saveCalculation, isPending } = useCalculation();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!isCalculationReady) return;
    
    try {
      const savedCalculation = await saveCalculation(calculationInput);
      
      toast({
        title: "Calculation Saved",
        description: `Your profit calculation has been saved successfully.`,
      });
      
      setIsSaved(true);
      setCalculationName("");
      
      // Reset saved status after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
      
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save calculation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-primary/10 p-3">
          <Save className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Save Calculation</h2>
          <p className="text-body-sm text-muted-foreground">Save for future reference</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="calculationName" className="text-body-sm font-medium text-foreground mb-2 block">
            Calculation Name (Optional)
          </Label>
          <Input
            id="calculationName"
            data-testid="input-calculation-name"
            value={calculationName}
            onChange={(e) => setCalculationName(e.target.value)}
            placeholder="e.g., Q4 2024 Profit Analysis"
            className="input-field"
            disabled={isPending}
          />
        </div>

        <Button
          data-testid="button-save-calculation"
          onClick={handleSave}
          disabled={!isCalculationReady || isPending}
          className={`w-full h-12 ${isSaved ? 'btn-success' : 'btn-primary'}`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Calculation
            </>
          )}
        </Button>

        {!isCalculationReady && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-caption text-warning font-medium text-center">
              Complete all required fields to save calculation
            </p>
          </div>
        )}

        {result && (
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="space-y-1 text-caption">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Profit:</span>
                <span className="font-medium text-foreground">
                  ${result.netProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Distributed:</span>
                <span className="font-medium text-foreground">
                  ${result.totalDistributed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Members:</span>
                <span className="font-medium text-foreground">
                  {result.memberShares.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}