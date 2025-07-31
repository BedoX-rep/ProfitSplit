import { Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaxInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function TaxInput({ value, onChange }: TaxInputProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-warning/10 p-3">
          <Receipt className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Step 4b: Tax Amount</h2>
          <p className="text-body-sm text-muted-foreground">Business tax that will be refunded to company</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="taxAmount" className="text-body-sm font-medium text-foreground mb-2 block">
            Tax Amount
          </Label>
          <Input
            id="taxAmount"
            data-testid="input-tax-amount"
            type="number"
            min="0"
            step="0.01"
            value={value || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="input-field text-body"
          />
        </div>

        {value > 0 && (
          <div className="p-4 rounded-xl bg-info/5 border border-info/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-semibold text-foreground">Tax to be Refunded</p>
                <p className="text-caption text-muted-foreground">
                  This amount will be subtracted from net profit and refunded to the company
                </p>
              </div>
              <span className="text-body-lg font-bold text-info">
                {formatCurrency(value)}
              </span>
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-caption text-muted-foreground">
            <strong>Note:</strong> Tax amount is subtracted from net profit calculation and then refunded to the company as part of their total share.
          </p>
        </div>
      </div>
    </div>
  );
}