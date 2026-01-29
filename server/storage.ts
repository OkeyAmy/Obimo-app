import { type User, type UpdateProfile } from "@shared/schema";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(email: string): Promise<User>;
  updateUserProfile(email: string, profile: UpdateProfile): Promise<User | undefined>;
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
}

export const storage = new DatabaseStorage();
