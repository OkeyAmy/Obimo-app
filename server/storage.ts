import { 
  type User, type UpdateProfile, 
  type Location, type InsertLocation,
  type MapMarker, type InsertMapMarker,
  type UserInteraction, type InsertUserInteraction,
  type Recommendation, type InsertRecommendation,
  type AITrainingSignal, type InsertAITrainingSignal,
  type MapProviderStatusType, type InsertMapProviderStatus,
  type Session, type InsertSession,
  type Connection, type InsertConnection,
  type UserLocationHistory, type InsertUserLocationHistory,
  type Message, type InsertMessage
} from "@shared/schema";
import { 
  users, verificationCodes, rateLimits,
  locations, mapMarkers, userInteractions, recommendations,
  aiTrainingSignals, mapProviderStatus, sessions,
  connections, userLocationsHistory, messages
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, lt, desc, asc, or, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(email: string): Promise<User>;
  updateUserProfile(email: string, profile: UpdateProfile): Promise<User | undefined>;
  
  // Verification codes
  saveVerificationCode(email: string, code: string, expiresAt: Date): Promise<void>;
  getVerificationCode(email: string): Promise<{ code: string; expiresAt: Date; attempts: number } | undefined>;
  incrementVerificationAttempts(email: string): Promise<void>;
  deleteVerificationCode(email: string): Promise<void>;
  cleanExpiredCodes(): Promise<void>;
  
  // Rate limiting
  checkRateLimit(identifier: string, action: string, maxCount: number, windowMinutes: number): Promise<boolean>;
  incrementRateLimit(identifier: string, action: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async createUser(email: string): Promise<User> {
    const [user] = await db.insert(users).values({
      email: email.toLowerCase(),
    }).returning();
    return user;
  }

  async updateUserProfile(email: string, profile: UpdateProfile): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...profile,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email.toLowerCase()))
      .returning();
    return user;
  }

  // Verification code methods
  async saveVerificationCode(email: string, code: string, expiresAt: Date): Promise<void> {
    // Delete any existing codes for this email first
    await db.delete(verificationCodes).where(eq(verificationCodes.email, email.toLowerCase()));
    
    // Insert new code
    await db.insert(verificationCodes).values({
      email: email.toLowerCase(),
      code,
      expiresAt,
      attempts: 0,
    });
  }

  async getVerificationCode(email: string): Promise<{ code: string; expiresAt: Date; attempts: number } | undefined> {
    const [record] = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, email.toLowerCase()));
    
    if (!record) return undefined;
    
    return {
      code: record.code,
      expiresAt: record.expiresAt,
      attempts: record.attempts ?? 0,
    };
  }

  async incrementVerificationAttempts(email: string): Promise<void> {
    const existing = await this.getVerificationCode(email);
    if (existing) {
      await db
        .update(verificationCodes)
        .set({ attempts: existing.attempts + 1 })
        .where(eq(verificationCodes.email, email.toLowerCase()));
    }
  }

  async deleteVerificationCode(email: string): Promise<void> {
    await db.delete(verificationCodes).where(eq(verificationCodes.email, email.toLowerCase()));
  }

  async cleanExpiredCodes(): Promise<void> {
    await db.delete(verificationCodes).where(lt(verificationCodes.expiresAt, new Date()));
  }

  // Rate limiting methods
  async checkRateLimit(identifier: string, action: string, maxCount: number, windowMinutes: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    const [record] = await db
      .select()
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier.toLowerCase()),
          eq(rateLimits.action, action),
          gt(rateLimits.windowStart, windowStart)
        )
      );
    
    if (!record) return true; // No record means within limit
    
    return (record.count ?? 0) < maxCount;
  }

  async incrementRateLimit(identifier: string, action: string): Promise<void> {
    const windowMinutes = 60; // 1 hour window
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    const [existing] = await db
      .select()
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier.toLowerCase()),
          eq(rateLimits.action, action),
          gt(rateLimits.windowStart, windowStart)
        )
      );
    
    if (existing) {
      await db
        .update(rateLimits)
        .set({ count: (existing.count ?? 0) + 1 })
        .where(eq(rateLimits.id, existing.id));
    } else {
      // Clean old records for this identifier/action and create new
      await db.delete(rateLimits).where(
        and(
          eq(rateLimits.identifier, identifier.toLowerCase()),
          eq(rateLimits.action, action)
        )
      );
      await db.insert(rateLimits).values({
        identifier: identifier.toLowerCase(),
        action,
        count: 1,
        windowStart: new Date(),
      });
    }
  }

  // Location methods
  async getLocations(limit = 100): Promise<Location[]> {
    return db.select().from(locations).limit(limit);
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async getLocationsByType(type: string): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.locationType, type));
  }

  async createLocation(data: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(data).returning();
    return location;
  }

  async getNearbyLocations(lat: number, lng: number, radiusMiles: number): Promise<Location[]> {
    const radiusKm = radiusMiles * 1.60934;
    const allLocations = await db.select().from(locations);
    return allLocations.filter(loc => {
      const distance = this.calculateDistance(lat, lng, parseFloat(loc.latitude), parseFloat(loc.longitude));
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Map marker methods
  async getMapMarkers(): Promise<MapMarker[]> {
    return db.select().from(mapMarkers).where(eq(mapMarkers.isVisible, true));
  }

  async getMapMarkersByLocation(locationId: string): Promise<MapMarker[]> {
    return db.select().from(mapMarkers).where(eq(mapMarkers.locationId, locationId));
  }

  async createMapMarker(data: InsertMapMarker): Promise<MapMarker> {
    const [marker] = await db.insert(mapMarkers).values(data).returning();
    return marker;
  }

  // User interaction methods
  async logInteraction(data: InsertUserInteraction): Promise<UserInteraction> {
    const [interaction] = await db.insert(userInteractions).values(data).returning();
    return interaction;
  }

  async getUserInteractions(userId: string, limit = 50): Promise<UserInteraction[]> {
    return db.select()
      .from(userInteractions)
      .where(eq(userInteractions.userId, userId))
      .orderBy(desc(userInteractions.createdAt))
      .limit(limit);
  }

  // Recommendation methods
  async getRecommendationsForUser(userId: string): Promise<Recommendation[]> {
    return db.select()
      .from(recommendations)
      .where(and(
        eq(recommendations.userId, userId),
        eq(recommendations.isActive, true)
      ))
      .orderBy(desc(recommendations.confidenceScore));
  }

  async createRecommendation(data: InsertRecommendation): Promise<Recommendation> {
    const [rec] = await db.insert(recommendations).values(data).returning();
    return rec;
  }

  async updateRecommendation(id: string, updates: Partial<Recommendation>): Promise<Recommendation | undefined> {
    const [rec] = await db.update(recommendations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(recommendations.id, id))
      .returning();
    return rec;
  }

  // AI training signals
  async logTrainingSignal(data: InsertAITrainingSignal): Promise<AITrainingSignal> {
    const [signal] = await db.insert(aiTrainingSignals).values(data).returning();
    return signal;
  }

  async getUnprocessedSignals(limit = 100): Promise<AITrainingSignal[]> {
    return db.select()
      .from(aiTrainingSignals)
      .where(eq(aiTrainingSignals.processed, false))
      .limit(limit);
  }

  // Map provider status methods
  async getMapProviderStatus(provider: string): Promise<MapProviderStatusType | undefined> {
    const [status] = await db.select().from(mapProviderStatus).where(eq(mapProviderStatus.provider, provider));
    return status;
  }

  async getActiveMapProvider(): Promise<MapProviderStatusType | undefined> {
    const [status] = await db.select()
      .from(mapProviderStatus)
      .where(and(
        eq(mapProviderStatus.isAvailable, true),
        eq(mapProviderStatus.isPrimary, true)
      ));
    if (status) return status;
    
    const [fallback] = await db.select()
      .from(mapProviderStatus)
      .where(eq(mapProviderStatus.isAvailable, true));
    return fallback;
  }

  async updateMapProviderStatus(provider: string, updates: Partial<MapProviderStatusType>): Promise<void> {
    await db.update(mapProviderStatus)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mapProviderStatus.provider, provider));
  }

  async initializeMapProviders(): Promise<void> {
    const existing = await db.select().from(mapProviderStatus);
    if (existing.length === 0) {
      await db.insert(mapProviderStatus).values([
        { provider: 'google', isAvailable: true, isPrimary: true, dailyUsageLimit: 28000, monthlyUsageLimit: 200000 },
        { provider: 'mapbox', isAvailable: true, isPrimary: false, dailyUsageLimit: 100000, monthlyUsageLimit: 500000 }
      ]);
    }
  }

  // Connection methods
  async getConnections(userId: string): Promise<Connection[]> {
    return db.select()
      .from(connections)
      .where(or(
        eq(connections.userId, userId),
        eq(connections.connectedUserId, userId)
      ));
  }

  async createConnection(data: InsertConnection): Promise<Connection> {
    const [conn] = await db.insert(connections).values(data).returning();
    return conn;
  }

  async updateConnectionStatus(id: string, status: string): Promise<Connection | undefined> {
    const [conn] = await db.update(connections)
      .set({ status, updatedAt: new Date() })
      .where(eq(connections.id, id))
      .returning();
    return conn;
  }

  // User location history
  async getUserLocationHistory(userId: string): Promise<UserLocationHistory[]> {
    return db.select()
      .from(userLocationsHistory)
      .where(eq(userLocationsHistory.userId, userId))
      .orderBy(desc(userLocationsHistory.visitedAt));
  }

  async logUserLocationVisit(data: InsertUserLocationHistory): Promise<UserLocationHistory> {
    const [visit] = await db.insert(userLocationsHistory).values(data).returning();
    return visit;
  }

  // Message methods
  async getMessages(connectionId: string, limit = 50): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(eq(messages.connectionId, connectionId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async sendMessage(data: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(data).returning();
    return msg;
  }

  async markMessagesAsRead(connectionId: string, userId: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(and(
        eq(messages.connectionId, connectionId),
        sql`${messages.senderId} != ${userId}`
      ));
  }

  // Get all users for discover feature
  async getDiscoverUsers(currentUserId: string, limit = 20): Promise<User[]> {
    return db.select()
      .from(users)
      .where(and(
        sql`${users.id} != ${currentUserId}`,
        eq(users.onboardingCompleted, true)
      ))
      .limit(limit);
  }

  // Get nearby users
  async getNearbyUsers(lat: number, lng: number, radiusMiles: number, excludeUserId: string): Promise<User[]> {
    const allUsers = await db.select()
      .from(users)
      .where(and(
        sql`${users.id} != ${excludeUserId}`,
        eq(users.onboardingCompleted, true)
      ));
    
    const radiusKm = radiusMiles * 1.60934;
    return allUsers.filter(user => {
      if (!user.latitude || !user.longitude) return false;
      const distance = this.calculateDistance(lat, lng, parseFloat(user.latitude), parseFloat(user.longitude));
      return distance <= radiusKm;
    });
  }
}

export const storage = new DatabaseStorage();
