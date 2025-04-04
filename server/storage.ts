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
}

// Import the memory store
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wheelSegments: Map<number, WheelSegment>;
  private tickets: Map<number, Ticket>;
  private settings: Map<string, Setting>;
  
  sessionStore: SessionStore;
  
  private currentUserId: number;
  private currentWheelSegmentId: number;
  private currentTicketId: number;
  private currentSettingId: number;
  
  constructor() {
    this.users = new Map();
    this.wheelSegments = new Map();
    this.tickets = new Map();
    this.settings = new Map();
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    this.currentUserId = 1;
    this.currentWheelSegmentId = 1;
    this.currentTicketId = 1;
    this.currentSettingId = 1;
    
    // Initialize with default data
    this.initDefaultData();
  }
  
  // Initialize with default data for a new system
  private async initDefaultData() {
    // Add default admin user
    await this.createUser({
      username: 'admin',
      password: 'admin123' // In a real system, this would be hashed
    });
    
    // Add default wheel segments (12 segments)
    const colors = [
      '#F59E0B', '#10B981', '#4F46E5', '#F43F5E', '#8B5CF6', '#EC4899', 
      '#06B6D4', '#84CC16', '#6366F1', '#F97316', '#14B8A6', '#D946EF'
    ];
    const prizes = [
      '$50 Gift Card',
      'Free Ticket',
      '20% Off',
      '$10 Cashback',
      'Free Product',
      '2x Points',
      'Mystery Box',
      'Try Again',
      '$25 Gift Card',
      'Free Coffee',
      '$5 Discount',
      'Free Shipping'
    ];
    
    for (let i = 0; i < prizes.length; i++) {
      await this.createWheelSegment({
        text: prizes[i],
        color: colors[i % colors.length],
        position: i
      });
    }
    
    // Add default settings
    await this.updateSetting('background_color', 'linear-gradient(to bottom, #4338CA, #3730A3)');
    await this.updateSetting('site_title', 'Prize Wheel Game');
    await this.updateSetting('meta_description', 'Spin the wheel and win exciting prizes!');
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Wheel segment operations
  async getWheelSegments(): Promise<WheelSegment[]> {
    return Array.from(this.wheelSegments.values())
      .sort((a, b) => a.position - b.position);
  }
  
  async getWheelSegment(id: number): Promise<WheelSegment | undefined> {
    return this.wheelSegments.get(id);
  }
  
  async createWheelSegment(segment: InsertWheelSegment): Promise<WheelSegment> {
    const id = this.currentWheelSegmentId++;
    // Ensure all required properties are set
    const newSegment: WheelSegment = { 
      id, 
      text: segment.text,
      color: segment.color || "#F59E0B", // Provide a default if not supplied 
      position: segment.position || 0     // Provide a default if not supplied
    };
    this.wheelSegments.set(id, newSegment);
    return newSegment;
  }
  
  async updateWheelSegment(id: number, segmentUpdate: Partial<InsertWheelSegment>): Promise<WheelSegment | undefined> {
    const segment = this.wheelSegments.get(id);
    if (!segment) return undefined;
    
    const updatedSegment = { ...segment, ...segmentUpdate };
    this.wheelSegments.set(id, updatedSegment);
    return updatedSegment;
  }
  
  async deleteWheelSegment(id: number): Promise<boolean> {
    return this.wheelSegments.delete(id);
  }
  
  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .sort((a, b) => {
        const aDate = a.createdAt as Date;
        const bDate = b.createdAt as Date;
        return bDate.getTime() - aDate.getTime();
      });
  }
  
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  async getTicketByCode(code: string): Promise<Ticket | undefined> {
    return Array.from(this.tickets.values()).find(
      (ticket) => ticket.code === code
    );
  }
  
  async createTicket(ticketData: Partial<InsertTicket>): Promise<Ticket> {
    const id = this.currentTicketId++;
    // Generate a ticket code if not provided
    const code = ticketData.code || `PRIZE-${new Date().getFullYear()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    
    const ticket: Ticket = {
      id,
      code,
      segmentId: ticketData.segmentId!,
      used: false,
      createdAt: new Date(),
      ipAddress: null,
      usedAt: null,
      expiresAt: ticketData.expiresAt || null
    };
    
    this.tickets.set(id, ticket);
    return ticket;
  }
  
  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...ticketUpdate };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }
  
  async getWinnersListWithPrizes(): Promise<any[]> {
    const usedTickets = Array.from(this.tickets.values())
      .filter(ticket => ticket.used)
      .sort((a, b) => {
        const aDate = a.usedAt as Date;
        const bDate = b.usedAt as Date;
        return bDate.getTime() - aDate.getTime();
      });
    
    return Promise.all(usedTickets.map(async (ticket) => {
      const segment = await this.getWheelSegment(ticket.segmentId);
      return {
        ...ticket,
        prize: segment ? segment.text : 'Unknown Prize'
      };
    }));
  }
  
  // Settings operations
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }
  
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }
  
  async updateSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = this.settings.get(key);
    
    if (existingSetting) {
      const updatedSetting = { ...existingSetting, value };
      this.settings.set(key, updatedSetting);
      return updatedSetting;
    } else {
      const id = this.currentSettingId++;
      const newSetting: Setting = { id, key, value };
      this.settings.set(key, newSetting);
      return newSetting;
    }
  }
}

export const storage = new MemStorage();
