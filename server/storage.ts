import { type User, type UpdateProfile } from "@shared/schema";
import { users, verificationCodes, rateLimits } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, lt } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
