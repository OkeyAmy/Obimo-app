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

// Locations table - stores physical locations displayed on the map
export const locations = pgTable("locations", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  locationType: text("location_type").notNull(), // 'campsite', 'city', 'national_park', 'landmark', etc.
  country: text("country"),
  state: text("state"),
  googleMapsCompatible: boolean("google_maps_compatible").default(true),
  mapboxCompatible: boolean("mapbox_compatible").default(true),
  elevation: integer("elevation"), // meters
  photos: jsonb("photos").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MapMarkers table - controls marker appearance and behavior on the map
export const mapMarkers = pgTable("map_markers", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  locationId: varchar("location_id").references(() => locations.id),
  userId: varchar("user_id").references(() => users.id),
  markerType: text("marker_type").notNull(), // 'user_location', 'visited_place', 'campsite', 'meetup', 'poi'
  iconType: text("icon_type").default("default"), // 'pin', 'van', 'tent', 'star', 'heart', etc.
  color: text("color").default("#2D3142"),
  size: text("size").default("medium"), // 'small', 'medium', 'large'
  isVisible: boolean("is_visible").default(true),
  isClickable: boolean("is_clickable").default(true),
  clusterGroup: text("cluster_group"), // for grouping markers in clusters
  zoomLevel: integer("zoom_level").default(1), // minimum zoom level to show marker
  priority: integer("priority").default(0), // higher priority markers show first
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UserInteractions table - tracks all user actions for AI learning
export const userInteractions = pgTable("user_interactions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  targetUserId: varchar("target_user_id").references(() => users.id),
  locationId: varchar("location_id").references(() => locations.id),
  markerId: varchar("marker_id").references(() => mapMarkers.id),
  interactionType: text("interaction_type").notNull(), // 'view', 'click', 'like', 'pass', 'super_like', 'share', 'visit', 'message'
  duration: integer("duration"), // seconds spent on interaction
  context: text("context"), // 'discover', 'map', 'profile', 'search'
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Recommendations table - stores AI-generated user recommendations
export const recommendations = pgTable("recommendations", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  recommendedUserId: varchar("recommended_user_id").references(() => users.id).notNull(),
  confidenceScore: integer("confidence_score").default(50), // 0-100
  reasonCodes: jsonb("reason_codes").$type<string[]>().default([]), // ['proximity', 'shared_interests', 'similar_route']
  isActive: boolean("is_active").default(true),
  wasViewed: boolean("was_viewed").default(false),
  wasActedOn: boolean("was_acted_on").default(false),
  action: text("action"), // 'liked', 'passed', 'super_liked', null if no action
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AITrainingSignals table - anonymized signals for improving recommendations
export const aiTrainingSignals = pgTable("ai_training_signals", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  signalType: text("signal_type").notNull(), // 'match_success', 'location_preference', 'timing_pattern', 'interest_correlation'
  signalData: jsonb("signal_data").$type<Record<string, unknown>>().notNull(),
  weight: integer("weight").default(1), // importance weight for learning
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MapProviderStatus table - tracks map provider usage and fallback logic
export const mapProviderStatus = pgTable("map_provider_status", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  provider: text("provider").notNull().unique(), // 'google', 'mapbox'
  isAvailable: boolean("is_available").default(true),
  isPrimary: boolean("is_primary").default(false),
  dailyUsageCount: integer("daily_usage_count").default(0),
  dailyUsageLimit: integer("daily_usage_limit"),
  monthlyUsageCount: integer("monthly_usage_count").default(0),
  monthlyUsageLimit: integer("monthly_usage_limit"),
  lastHealthCheck: timestamp("last_health_check"),
  errorCount: integer("error_count").default(0),
  lastError: text("last_error"),
  lastErrorAt: timestamp("last_error_at"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table - tracks active user sessions and location context
export const sessions = pgTable("sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  deviceType: text("device_type"), // 'ios', 'android', 'web'
  deviceInfo: jsonb("device_info").$type<Record<string, unknown>>().default({}),
  lastLatitude: text("last_latitude"),
  lastLongitude: text("last_longitude"),
  lastLocationUpdate: timestamp("last_location_update"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Connections table - tracks travel companion relationships
export const connections = pgTable("connections", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  connectedUserId: varchar("connected_user_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'connected', 'blocked'
  connectionType: text("connection_type").default("standard"), // 'standard', 'super'
  metAtLocationId: varchar("met_at_location_id").references(() => locations.id),
  lastInteractionAt: timestamp("last_interaction_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UserLocationsHistory table - tracks places users have visited
export const userLocationsHistory = pgTable("user_locations_history", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  locationId: varchar("location_id").references(() => locations.id).notNull(),
  visitedAt: timestamp("visited_at").defaultNow(),
  departedAt: timestamp("departed_at"),
  durationDays: integer("duration_days"),
  photos: jsonb("photos").$type<string[]>().default([]),
  notes: text("notes"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table - for chat functionality
export const messages = pgTable("messages", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id").references(() => connections.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'image', 'location', 'gif'
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types for all new tables
export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;
export type MapMarker = typeof mapMarkers.$inferSelect;
export type InsertMapMarker = typeof mapMarkers.$inferInsert;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = typeof userInteractions.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;
export type AITrainingSignal = typeof aiTrainingSignals.$inferSelect;
export type InsertAITrainingSignal = typeof aiTrainingSignals.$inferInsert;
export type MapProviderStatusType = typeof mapProviderStatus.$inferSelect;
export type InsertMapProviderStatus = typeof mapProviderStatus.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = typeof connections.$inferInsert;
export type UserLocationHistory = typeof userLocationsHistory.$inferSelect;
export type InsertUserLocationHistory = typeof userLocationsHistory.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
