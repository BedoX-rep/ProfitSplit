import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CalculationResult } from "@shared/schema";
import { TrendingUp, Users, Building, DollarSign } from "lucide-react";

interface DistributionSummaryProps {
  result: CalculationResult;
}

export function DistributionSummary({ result }: DistributionSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Prepare data for pie chart
  const chartData = result.memberShares.map((share, index) => ({
    name: share.name,
    value: share.share,
    percentage: share.percentage,
    color: [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#06b6d4', // cyan
    ][index % 6],
  }));

  // Add company share to chart data if it exists
  if (result.companyShare.total > 0) {
    chartData.push({
      name: 'Company',
      value: result.companyShare.total,
      percentage: result.netProfit > 0 ? (result.companyShare.profitShare / result.netProfit) * 100 : 0,
      color: '#6366f1', // indigo
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-body-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-body-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-primary/10 p-3">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Distribution Summary</h2>
          <p className="text-body-sm text-muted-foreground">Profit sharing breakdown</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Visual Chart */}
        {chartData.length > 0 && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Company Share */}
        {result.companyShare.total > 0 && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-body font-semibold text-foreground">Company Share</p>
                  <span className="text-body-lg font-bold text-primary">
                    {formatCurrency(result.companyShare.total)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Breakdown of company share */}
            <div className="space-y-2 pl-8 border-l-2 border-primary/20">
              {/* Profit Distribution */}
              <div className="flex justify-between items-center">
                <span className="text-caption text-muted-foreground">
                  Profit Distribution ({result.netProfit > 0 ? ((result.companyShare.profitShare / result.netProfit) * 100).toFixed(1) : 0}%)
                </span>
                <span className="text-caption font-semibold text-foreground">
                  {formatCurrency(result.companyShare.profitShare)}
                </span>
              </div>
              
              {/* Tax Refund */}
              {result.companyShare.taxRefund > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-caption text-muted-foreground">Tax Refund</span>
                  <span className="text-caption font-semibold text-success">
                    +{formatCurrency(result.companyShare.taxRefund)}
                  </span>
                </div>
              )}
              
              {/* Frames Refund */}
              {result.companyShare.framesRefund > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-caption text-muted-foreground">Frames Refund</span>
                  <span className="text-caption font-semibold text-success">
                    +{formatCurrency(result.companyShare.framesRefund)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Member Distributions */}
        <div className="space-y-3">
          <h3 className="text-body-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Distributions
          </h3>
          
          {result.memberShares.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-body-sm">No member distributions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {result.memberShares.map((share, index) => (
                <div key={share.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/30">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: chartData[index]?.color }}
                    />
                    <div>
                      <p className="text-body font-medium text-foreground">{share.name}</p>
                      <p className="text-caption text-muted-foreground">{share.percentage}% share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body font-semibold text-foreground">
                      {formatCurrency(share.share)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-secondary/10 border border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-body-lg font-bold text-foreground">Total Distributed</p>
                <p className="text-caption text-muted-foreground">
                  All profit shares and refunds
                </p>
              </div>
            </div>
            <span className="text-display-sm font-bold text-success">
              {formatCurrency(result.totalDistributed)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}