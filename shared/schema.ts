import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Verification codes table for email authentication
export const verificationCodes = pgTable("verification_codes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rate limiting table for security
export const rateLimits = pgTable("rate_limits", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  identifier: text("identifier").notNull(), // email or IP
  action: text("action").notNull(), // 'send_code', 'verify_code', etc.
  count: integer("count").default(1),
  windowStart: timestamp("window_start").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  photos: jsonb("photos").$type<string[]>().default([]),
  locationPermission: boolean("location_permission").default(false),
  notificationPermission: boolean("notification_permission").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  dateOfBirth: true,
  gender: true,
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  photos: z.array(z.string()).optional(),
  locationPermission: z.boolean().optional(),
  notificationPermission: z.boolean().optional(),
  onboardingCompleted: z.boolean().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
