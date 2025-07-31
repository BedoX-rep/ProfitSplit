import { Button } from "@/components/ui/button";
import { Download, Printer, RotateCcw } from "lucide-react";
import { exportToCSV } from "@/lib/profit-calculator";
import { CalculatorState, CalculationResults } from "@/types/calculator";

interface ActionButtonsProps {
  state: CalculatorState;
  results: CalculationResults;
  onReset: () => void;
}

export function ActionButtons({ state, results, onReset }: ActionButtonsProps) {
  const handleExport = () => {
    exportToCSV(state, results);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleExport} 
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-medium"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Results
      </Button>
      <Button 
        onClick={handlePrint} 
        variant="secondary"
        className="w-full py-3 font-medium"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Summary
      </Button>
      <Button 
        onClick={onReset} 
        variant="destructive"
        className="w-full py-2 font-medium"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset Calculator
      </Button>
    </div>
  );
}
