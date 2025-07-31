import { Clock, Eye, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentCalculations } from "@/hooks/use-calculation";
import { formatDistanceToNow } from "date-fns";

export function RecentCalculations() {
  const { data: calculations, isLoading, error, refetch, isRefetching } = useRecentCalculations();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleLoadCalculation = (calculationId: string) => {
    // This would typically be handled by the parent component
    // For now, we'll just log it
    console.log('Load calculation:', calculationId);
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-3">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-display-sm font-bold text-foreground">Recent Calculations</h2>
            <p className="text-body-sm text-muted-foreground">Load previous calculations</p>
          </div>
        </div>
        <Button
          data-testid="button-refresh-calculations"
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="btn-ghost h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-body-sm text-muted-foreground">Loading calculations...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-body-sm text-destructive mb-3">Failed to load calculations</p>
            <Button
              data-testid="button-retry-calculations"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="btn-outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : !calculations || calculations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-body-sm">No recent calculations</p>
            <p className="text-caption">Your saved calculations will appear here</p>
          </div>
        ) : (
          calculations.slice(0, 5).map((calc) => (
            <div
              key={calc.id}
              className="flex items-center justify-between p-4 rounded-xl bg-surface/30 border border-border/50 hover:bg-surface/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body font-medium text-foreground truncate">
                    Net Profit: {formatCurrency(calc.result.netProfit)}
                  </p>
                  <span className="text-caption text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(calc.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-caption text-muted-foreground">
                  <span>{calc.result.memberShares.length} members</span>
                  <span>Company: {formatCurrency(calc.result.companyShare.total)}</span>
                  <span>Distributed: {formatCurrency(calc.result.totalDistributed)}</span>
                </div>
              </div>
              <Button
                data-testid={`button-load-calculation-${calc.id}`}
                variant="ghost"
                size="sm"
                onClick={() => handleLoadCalculation(calc.id)}
                className="btn-ghost h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-3"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}

        {calculations && calculations.length > 5 && (
          <div className="text-center pt-3">
            <Button
              data-testid="button-view-all-calculations"
              variant="ghost"
              size="sm"
              className="btn-ghost"
            >
              View all calculations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}