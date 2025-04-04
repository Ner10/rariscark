import { 
  users, wheelSegments, tickets, settings,
  type User, type InsertUser,
  type WheelSegment, type InsertWheelSegment,
  type Ticket, type InsertTicket,
  type Setting, type InsertSetting
} from "@shared/schema";

import { v4 as uuidv4 } from 'uuid';

// Interface for all storage operations
// Import the required modules
import session from "express-session";
import type { Store as SessionStore } from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from './db';
import { eq, desc, asc } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Wheel segment operations
  getWheelSegments(): Promise<WheelSegment[]>;
  getWheelSegment(id: number): Promise<WheelSegment | undefined>;
  createWheelSegment(segment: InsertWheelSegment): Promise<WheelSegment>;
  updateWheelSegment(id: number, segment: Partial<InsertWheelSegment>): Promise<WheelSegment | undefined>;
  deleteWheelSegment(id: number): Promise<boolean>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketByCode(code: string): Promise<Ticket | undefined>;
  createTicket(ticket: Partial<InsertTicket>): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  getWinnersListWithPrizes(): Promise<any[]>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  updateSetting(key: string, value: string): Promise<Setting>;
  
  // Session storage
  sessionStore: SessionStore;
  
  // Database initialization
  initializeDatabase?(): Promise<void>;
}

// Configure PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }
  
  // Initialize database with default data if empty
  async initializeDatabase(): Promise<void> {
    console.log("Initializing database...");
    
    // Check if we have any users
    const userResult = await db.select().from(users);
    const userCount = userResult.length;
    
    if (userCount === 0) {
      console.log("Creating default admin user and data...");
      
      // Create admin user - password is 'admin123'
      await this.createUser({
        username: 'admin',
        password: '$2a$10$D/IX/AtaOxLSZ1sHxz9xSu6apCx1r4MxN/7YnX/qDO9BjDt.RQYpG',
        isAdmin: true
      });
      
      // Add default wheel segments (12 segments alternating red/white)
      const colors = [
        '#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF',
        '#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF'
      ];
      
      const prizes = [
        '$50 Gift Card',
        '10% Discount',
        '$100 Gift Card',
        'Free Shipping',
        '$25 Gift Card',
        'Buy 1 Get 1 Free',
        '$75 Gift Card',
        '15% Discount',
        '$30 Gift Card',
        'Free Product',
        '$10 Gift Card',
        '5% Discount'
      ];
      
      let segments: WheelSegment[] = [];
      
      for (let i = 0; i < prizes.length; i++) {
        const segment = await this.createWheelSegment({
          text: prizes[i],
          color: colors[i],
          position: i,
          weight: 1
        });
        segments.push(segment);
      }
      
      // Create sample tickets for demonstration
      const sampleTickets = [
        { code: 'RARIS-2025-ABC123', segmentId: segments[0].id },
        { code: 'RARIS-2025-DEF456', segmentId: segments[1].id },
        { code: 'RARIS-2025-GHI789', segmentId: segments[2].id },
        { code: 'TEST-TICKET', segmentId: segments[3].id }
      ];
      
      for (const ticket of sampleTickets) {
        await this.createTicket(ticket);
      }
      
      // Add default settings
      await this.updateSetting('background_color', 'linear-gradient(to bottom, #1a0000 0%, #3a0000 100%)');
      await this.updateSetting('wheel_title', 'Raris Çark');
      await this.updateSetting('meta_description', 'Çarkı çevir ve ödülünü kazan!');
      
      console.log("Database initialization complete!");
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Wheel segment operations
  async getWheelSegments(): Promise<WheelSegment[]> {
    return await db.select().from(wheelSegments).orderBy(asc(wheelSegments.position));
  }
  
  async getWheelSegment(id: number): Promise<WheelSegment | undefined> {
    const [segment] = await db.select().from(wheelSegments).where(eq(wheelSegments.id, id));
    return segment;
  }
  
  async createWheelSegment(segment: InsertWheelSegment): Promise<WheelSegment> {
    if (segment.position === undefined) {
      const result = await db.select().from(wheelSegments);
      segment.position = result.length;
    }
    
    const [newSegment] = await db.insert(wheelSegments).values({
      text: segment.text,
      color: segment.color || "#FF0000",
      position: segment.position,
      weight: segment.weight || 1
    }).returning();
    
    return newSegment;
  }
  
  async updateWheelSegment(id: number, segmentUpdate: Partial<InsertWheelSegment>): Promise<WheelSegment | undefined> {
    const [updatedSegment] = await db
      .update(wheelSegments)
      .set(segmentUpdate)
      .where(eq(wheelSegments.id, id))
      .returning();
    return updatedSegment;
  }
  
  async deleteWheelSegment(id: number): Promise<boolean> {
    try {
      const result = await db.delete(wheelSegments).where(eq(wheelSegments.id, id));
      return true;
    } catch (err) {
      console.error("Error deleting wheel segment:", err);
      return false;
    }
  }
  
  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }
  
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }
  
  async getTicketByCode(code: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.code, code));
    return ticket;
  }
  
  async createTicket(ticketData: Partial<InsertTicket>): Promise<Ticket> {
    // Generate a ticket code if not provided
    const code = ticketData.code || `RARIS-${new Date().getFullYear()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    
    const [ticket] = await db.insert(tickets).values({
      code,
      segmentId: ticketData.segmentId!,
      used: false,
      createdAt: new Date(),
      ipAddress: null,
      usedAt: null,
      expiresAt: ticketData.expiresAt || null
    }).returning();
    
    return ticket;
  }
  
  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const [updatedTicket] = await db
      .update(tickets)
      .set(ticketUpdate)
      .where(eq(tickets.id, id))
      .returning();
    return updatedTicket;
  }
  
  async getWinnersListWithPrizes(): Promise<any[]> {
    const winners = await db
      .select({
        id: tickets.id,
        code: tickets.code,
        segmentId: tickets.segmentId,
        createdAt: tickets.createdAt,
        used: tickets.used,
        usedAt: tickets.usedAt,
        ipAddress: tickets.ipAddress,
        prize: wheelSegments.text
      })
      .from(tickets)
      .innerJoin(wheelSegments, eq(tickets.segmentId, wheelSegments.id))
      .where(eq(tickets.used, true))
      .orderBy(desc(tickets.usedAt));
    
    return winners;
  }
  
  // Settings operations
  async getSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }
  
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }
  
  async updateSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      const [updatedSetting] = await db
        .update(settings)
        .set({ value })
        .where(eq(settings.key, key))
        .returning();
      return updatedSetting;
    } else {
      const [newSetting] = await db
        .insert(settings)
        .values({ key, value })
        .returning();
      return newSetting;
    }
  }
}

// Export DatabaseStorage instance
export const storage = new DatabaseStorage();
