import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertWheelSegmentSchema, insertTicketSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Auth middleware for admin routes
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  // Wheel Segments API
  app.get("/api/wheel/segments", async (req: Request, res: Response) => {
    const segments = await storage.getWheelSegments();
    res.json(segments);
  });
  
  app.post("/api/wheel/segments", requireAuth, async (req: Request, res: Response) => {
    try {
      const segmentData = insertWheelSegmentSchema.parse(req.body);
      const segment = await storage.createWheelSegment(segmentData);
      res.status(201).json(segment);
    } catch (error) {
      res.status(400).json({ message: "Invalid segment data" });
    }
  });
  
  app.put("/api/wheel/segments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const segmentData = insertWheelSegmentSchema.partial().parse(req.body);
      const segment = await storage.updateWheelSegment(id, segmentData);
      
      if (!segment) {
        return res.status(404).json({ message: "Segment not found" });
      }
      
      res.json(segment);
    } catch (error) {
      res.status(400).json({ message: "Invalid segment data" });
    }
  });
  
  app.delete("/api/wheel/segments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWheelSegment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Segment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete segment" });
    }
  });
  
  // Tickets API
  app.get("/api/tickets", requireAuth, async (req: Request, res: Response) => {
    const tickets = await storage.getTickets();
    res.json(tickets);
  });
  
  app.post("/api/tickets", requireAuth, async (req: Request, res: Response) => {
    try {
      const ticketData = insertTicketSchema.partial().parse(req.body);
      
      // Validate that segment exists
      const segment = await storage.getWheelSegment(ticketData.segmentId!);
      if (!segment) {
        return res.status(400).json({ message: "Invalid segment ID" });
      }
      
      const ticket = await storage.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });
  
  app.post("/api/tickets/batch", requireAuth, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        segmentId: z.number(),
        count: z.number().min(1).max(100),
        expiresAt: z.string().optional()
      });
      
      const { segmentId, count, expiresAt } = schema.parse(req.body);
      
      // Validate that segment exists
      const segment = await storage.getWheelSegment(segmentId);
      if (!segment) {
        return res.status(400).json({ message: "Invalid segment ID" });
      }
      
      const tickets = [];
      for (let i = 0; i < count; i++) {
        const ticket = await storage.createTicket({
          segmentId,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined
        });
        tickets.push(ticket);
      }
      
      res.status(201).json(tickets);
    } catch (error) {
      res.status(400).json({ message: "Invalid batch ticket data" });
    }
  });
  
  app.get("/api/tickets/winners", requireAuth, async (req: Request, res: Response) => {
    const winners = await storage.getWinnersListWithPrizes();
    res.json(winners);
  });
  
  // Verify ticket and spin wheel
  app.post("/api/spin", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        code: z.string()
      });
      
      const { code } = schema.parse(req.body);
      const ticket = await storage.getTicketByCode(code);
      
      if (!ticket) {
        return res.status(404).json({ message: "Invalid ticket code" });
      }
      
      if (ticket.used) {
        return res.status(400).json({ message: "Ticket already used" });
      }
      
      // Check if ticket is expired
      if (ticket.expiresAt && new Date(ticket.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Ticket has expired" });
      }
      
      const segment = await storage.getWheelSegment(ticket.segmentId);
      if (!segment) {
        return res.status(500).json({ message: "Prize not found" });
      }
      
      // Mark ticket as used (typescript error workaround by casting)
      await storage.updateTicket(ticket.id, {
        used: true,
        usedAt: new Date(),
        ipAddress: req.ip || req.socket.remoteAddress || "unknown"
      } as any);
      
      // Return the winning segment and its position in the wheel
      res.json({
        ticket,
        segment,
        segments: await storage.getWheelSegments() // All segments for correct positioning
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid spin request" });
    }
  });
  
  // Settings API
  app.get("/api/settings", async (req: Request, res: Response) => {
    const settings = await storage.getSettings();
    
    // Convert array to object for easier consumption
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value ?? '';
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsObj);
  });
  
  app.put("/api/settings/:key", requireAuth, async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const schema = z.object({
        value: z.string()
      });
      
      const { value } = schema.parse(req.body);
      const setting = await storage.updateSetting(key, value);
      
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid setting data" });
    }
  });
  
  // Authentication routes are now handled by setupAuth
  
  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
