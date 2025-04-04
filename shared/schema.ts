import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Wheel Segments (prizes on the wheel)
export const wheelSegments = pgTable("wheel_segments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(), // Prize text
  color: text("color").notNull().default("#F59E0B"), // Background color
  position: integer("position").notNull().default(0), // Position on the wheel
  weight: integer("weight").notNull().default(1), // Weight for probability (higher = more likely)
});

export const insertWheelSegmentSchema = createInsertSchema(wheelSegments).pick({
  text: true,
  color: true,
  position: true,
  weight: true,
});

// Tickets (generated codes linked to prizes)
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Unique ticket code
  segmentId: integer("segment_id").notNull(), // Which prize this ticket will win
  used: boolean("used").notNull().default(false), // Whether ticket has been used
  ipAddress: text("ip_address"), // IP address of user who redeemed ticket
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  code: true,
  segmentId: true,
  expiresAt: true,
  used: true,
  usedAt: true,
  ipAddress: true,
});

// Settings (for wheel background, meta tags, etc.)
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
});

export const insertSettingSchema = createInsertSchema(settings).pick({
  key: true,
  value: true,
});

// Types for frontend and backend use
export type WheelSegment = typeof wheelSegments.$inferSelect;
export type InsertWheelSegment = z.infer<typeof insertWheelSegmentSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// Type for the user auth (admin login)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
