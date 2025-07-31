import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { CalculationInput, CalculationResult } from '@shared/schema';

// Hook for calculating profit distribution
export function useCalculateProfit() {
  return useMutation({
    mutationFn: async (input: CalculationInput): Promise<{ id: string; data: CalculationResult }> => {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to calculate profit');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate recent calculations when new calculation is made
      queryClient.invalidateQueries({ queryKey: ['/api/calculations'] });
    },
  });
}

// Hook for saving calculations (alias for backwards compatibility)
export function useCalculation() {
  const mutation = useCalculateProfit();
  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

// Hook for fetching a saved calculation
export function useCalculationData(id: string | null) {
  return useQuery({
    queryKey: ['/api/calculations', id],
    queryFn: async (): Promise<{ input: CalculationInput; result: CalculationResult }> => {
      if (!id) throw new Error('No calculation ID provided');
      
      const response = await fetch(`/api/calculations/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch calculation');
      }

      const result = await response.json();
      return result.data;
    },
    enabled: !!id,
  });
}

// Hook for fetching recent calculations
export function useRecentCalculations() {
  return useQuery({
    queryKey: ['/api/calculations'],
    queryFn: async (): Promise<Array<{ id: string; timestamp: Date; result: CalculationResult }>> => {
      const response = await fetch('/api/calculations');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch recent calculations');
      }

      const result = await response.json();
      return result.data.map((calc: any) => ({
        ...calc,
        timestamp: new Date(calc.timestamp)
      }));
    },
  });
}