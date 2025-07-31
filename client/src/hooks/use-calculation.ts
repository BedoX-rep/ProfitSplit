import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { CalculationInput, CalculationResult } from '@shared/schema';
import { clientStorage, SavedCalculation } from '@/lib/storage';

// Hook for calculating profit distribution
export function useCalculateProfit() {
  return useMutation({
    mutationFn: async (input: CalculationInput): Promise<{ id: string; data: CalculationResult }> => {
      try {
        const result = clientStorage.saveCalculation(input);
        return { 
          id: result.id, 
          data: result.result 
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to save calculation');
      }
    },
    onSuccess: () => {
      // Invalidate recent calculations when new calculation is made
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
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
    queryKey: ['calculations', id],
    queryFn: (): { input: CalculationInput; result: CalculationResult } => {
      if (!id) throw new Error('No calculation ID provided');
      
      const calculation = clientStorage.getCalculation(id);
      if (!calculation) {
        throw new Error('Calculation not found');
      }

      return {
        input: calculation.input,
        result: calculation.result
      };
    },
    enabled: !!id,
  });
}

// Hook for fetching recent calculations
export function useRecentCalculations() {
  return useQuery({
    queryKey: ['calculations'],
    queryFn: (): Array<{ id: string; timestamp: Date; result: CalculationResult }> => {
      const calculations = clientStorage.getRecentCalculations();
      return calculations.map(calc => ({
        id: calc.id,
        timestamp: calc.timestamp,
        result: calc.result
      }));
    },
  });
}