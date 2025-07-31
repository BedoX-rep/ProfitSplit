
import { CalculationInput, CalculationResult } from "@shared/schema";
import { calculateProfit } from "./profit-calculator";

export interface SavedCalculation {
  id: string;
  input: CalculationInput;
  result: CalculationResult;
  timestamp: Date;
}

export class ClientStorage {
  private storageKey = 'profit-calculator-data';

  private getStorageData(): Map<string, SavedCalculation> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return new Map();
      
      const parsed = JSON.parse(data);
      const map = new Map();
      
      for (const [key, value] of Object.entries(parsed)) {
        map.set(key, {
          ...value as any,
          timestamp: new Date((value as any).timestamp)
        });
      }
      
      return map;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return new Map();
    }
  }

  private saveStorageData(data: Map<string, SavedCalculation>) {
    try {
      const obj = Object.fromEntries(data);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  saveCalculation(input: CalculationInput): { id: string; result: CalculationResult } {
    const id = crypto.randomUUID();
    const result = calculateProfit(input);
    
    const calculations = this.getStorageData();
    calculations.set(id, {
      id,
      input,
      result,
      timestamp: new Date()
    });
    
    this.saveStorageData(calculations);
    
    return { id, result };
  }

  getCalculation(id: string): SavedCalculation | undefined {
    const calculations = this.getStorageData();
    return calculations.get(id);
  }

  getRecentCalculations(): SavedCalculation[] {
    const calculations = this.getStorageData();
    return Array.from(calculations.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }

  deleteCalculation(id: string): boolean {
    const calculations = this.getStorageData();
    const deleted = calculations.delete(id);
    if (deleted) {
      this.saveStorageData(calculations);
    }
    return deleted;
  }

  clearAllCalculations(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const clientStorage = new ClientStorage();
