import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Info } from "lucide-react";

interface FramesCostProps {
  value: number;
  onChange: (value: number) => void;
}

export function FramesCost({ value, onChange }: FramesCostProps) {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-primary/10 p-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Step 4: Frames Cost</h2>
          <p className="text-body-sm text-muted-foreground">Enter frames cost for refund calculation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="framesCost" className="text-body-sm font-medium text-foreground mb-2 block">
            Total Frames Cost
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-muted-foreground font-medium">$</span>
            </div>
            <Input
              id="framesCost"
              data-testid="input-frames-cost"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="input-field pl-8 text-lg font-semibold"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-muted/20 border border-primary/20">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-body-sm text-foreground">
            <p className="font-medium mb-1">About Frames Cost Refund</p>
            <p className="text-muted-foreground">
              The company member receives a refund for frames cost in addition to their profit share percentage.
              This amount is refunded in full to the company.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}