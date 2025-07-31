import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculationInputSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/calculate - Calculate profit distribution
  app.post("/api/calculate", async (req, res) => {
    try {
      // Validate input data
      const validatedInput = calculationInputSchema.parse(req.body);
      
      // Save calculation and get result
      const { id, result } = await storage.saveCalculation(validatedInput);
      
      res.json({
        success: true,
        id,
        data: result
      });
    } catch (error) {
      console.error('Calculation error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Invalid input data'
      });
    }
  });

  // GET /api/calculations/:id - Get saved calculation
  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const calculation = await storage.getCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({
          success: false,
          error: 'Calculation not found'
        });
      }
      
      res.json({
        success: true,
        data: calculation
      });
    } catch (error) {
      console.error('Error fetching calculation:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /api/calculations - Get recent calculations
  app.get("/api/calculations", async (req, res) => {
    try {
      const recent = await storage.getRecentCalculations();
      
      res.json({
        success: true,
        data: recent
      });
    } catch (error) {
      console.error('Error fetching recent calculations:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
