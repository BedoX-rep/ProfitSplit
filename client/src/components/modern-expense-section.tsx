import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/profit-calculator";
import { CustomExpense } from "@/types/calculator";

interface ModernExpenseSectionProps {
  title: string;
  subtitle: string;
  expenses: CustomExpense[];
  onChange: (expenses: CustomExpense[]) => void;
  color: "blue" | "amber" | "purple";
  icon: React.ReactNode;
}

export function ModernExpenseSection({ 
  title, 
  subtitle, 
  expenses, 
  onChange, 
  color,
  icon 
}: ModernExpenseSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    amber: {
      gradient: "from-amber-500 to-orange-500", 
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      button: "bg-amber-600 hover:bg-amber-700"
    },
    purple: {
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50", 
      border: "border-purple-200",
      text: "text-purple-900",
      button: "bg-purple-600 hover:bg-purple-700"
    }
  };

  const classes = colorClasses[color];
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const updateExpense = (id: string, field: keyof CustomExpense, value: string | number) => {
    onChange(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const addExpense = () => {
    const newExpense: CustomExpense = {
      id: `expense-${Date.now()}`,
      name: 'New Expense',
      amount: 0
    };
    onChange([...expenses, newExpense]);
    setEditingId(newExpense.id);
    setEditingName(newExpense.name);
  };

  const removeExpense = (id: string) => {
    onChange(expenses.filter(expense => expense.id !== id));
  };

  const startEditing = (expense: CustomExpense) => {
    setEditingId(expense.id);
    setEditingName(expense.name);
  };

  const saveEdit = () => {
    if (editingId) {
      updateExpense(editingId, 'name', editingName);
      setEditingId(null);
      setEditingName("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Card className={`${classes.border} ${classes.bg} backdrop-blur-sm shadow-xl`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${classes.gradient} text-white shadow-lg`}>
              {icon}
            </div>
            <div>
              <CardTitle className={`text-xl font-bold ${classes.text}`}>{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
            {formatCurrency(total)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {editingId === expense.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">{expense.name}</Label>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => startEditing(expense)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={expense.amount || ''}
                  onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="pl-6 text-right font-medium"
                />
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => removeExpense(expense.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={addExpense} 
          variant="outline"
          className={`w-full ${classes.button} text-white border-0 shadow-md hover:shadow-lg transition-all`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title.includes('Monthly') ? 'Monthly' : 'Non-Monthly'} Expense
        </Button>
      </CardContent>
    </Card>
  );
}