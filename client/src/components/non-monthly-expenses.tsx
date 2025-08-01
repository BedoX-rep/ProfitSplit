import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Plus, X } from "lucide-react";
import { CustomExpense } from "@shared/schema";
import { nanoid } from "nanoid";

interface NonMonthlyExpensesProps {
  expenses: CustomExpense[];
  onChange: (expenses: CustomExpense[]) => void;
}

export function NonMonthlyExpenses({ expenses, onChange }: NonMonthlyExpensesProps) {
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const updateExpense = (id: string, field: keyof CustomExpense, value: string | number) => {
    const updated = expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    );
    onChange(updated);
  };

  const addExpense = () => {
    if (!newExpenseName.trim()) return;
    
    const newExpense: CustomExpense = {
      id: nanoid(),
      name: newExpenseName.trim(),
      amount: parseFloat(newExpenseAmount) || 0,
    };
    
    onChange([...expenses, newExpense]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const removeExpense = (id: string) => {
    onChange(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-warning/10 p-3">
          <FileText className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Step 3: Non-Monthly Expenses</h2>
          <p className="text-body-sm text-muted-foreground">Add one-time or irregular business expenses</p>
        </div>
      </div>

      <div className="space-y-4">
        {expenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-body-sm">No non-monthly expenses added yet</p>
            <p className="text-caption">Add irregular or one-time expenses</p>
          </div>
        )}

        {expenses.map((expense) => (
          <div key={expense.id} className="flex gap-3 items-end p-4 rounded-xl bg-surface/50 border border-border/50">
            <div className="flex-1">
              <Label className="text-caption text-muted-foreground mb-2 block">
                Expense Name
              </Label>
              <Input
                data-testid={`input-non-monthly-expense-name-${expense.id}`}
                value={expense.name}
                onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                placeholder="e.g., Equipment, Marketing"
                className="input-field"
              />
            </div>
            <div className="w-32">
              <Label className="text-caption text-muted-foreground mb-2 block">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  data-testid={`input-non-monthly-expense-amount-${expense.id}`}
                  type="number"
                  step="0.01"
                  value={expense.amount || ''}
                  onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="input-field pl-8"
                />
              </div>
            </div>
            <Button
              data-testid={`button-remove-non-monthly-expense-${expense.id}`}
              variant="ghost"
              size="sm"
              onClick={() => removeExpense(expense.id)}
              className="btn-ghost h-12 w-12 p-0 text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex gap-3 items-end p-4 rounded-xl bg-warning-muted/50 border border-warning/20">
          <div className="flex-1">
            <Label className="text-caption text-muted-foreground mb-2 block">
              Expense Name
            </Label>
            <Input
              data-testid="input-new-non-monthly-expense"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Enter expense name"
              onKeyPress={(e) => e.key === 'Enter' && addExpense()}
              className="input-field"
            />
          </div>
          <div className="w-32">
            <Label className="text-caption text-muted-foreground mb-2 block">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                data-testid="input-new-non-monthly-expense-amount"
                type="number"
                step="0.01"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                placeholder="0.00"
                onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                className="input-field pl-8"
              />
            </div>
          </div>
          <Button
            data-testid="button-add-non-monthly-expense"
            onClick={addExpense}
            disabled={!newExpenseName.trim()}
            className="btn-primary h-12 px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {expenses.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-body font-semibold text-foreground">Total Non-Monthly Expenses:</span>
            <span className="text-body-lg font-bold text-warning">
              ${expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}