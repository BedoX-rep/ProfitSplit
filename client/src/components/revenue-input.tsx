import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RevenueInput({ value, onChange }: RevenueInputProps) {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-primary/10 p-3">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Step 1: Total Revenue</h2>
          <p className="text-body-sm text-muted-foreground">Enter your total business revenue</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="totalRevenue" className="text-body-sm font-medium text-foreground mb-2 block">
            Total Revenue Left from Monthly Operations
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-muted-foreground font-medium">$</span>
            </div>
            <Input
              id="totalRevenue"
              data-testid="input-total-revenue"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="input-field pl-8 text-lg font-semibold"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-caption text-muted-foreground">
              Enter the revenue remaining after monthly operations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
