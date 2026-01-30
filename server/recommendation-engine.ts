import { db } from "./db";
import { 
  users, 
  locations, 
  userInteractions, 
  recommendations,
  connections,
  aiTrainingSignals
} from "@shared/schema";
import { eq, and, desc, sql, ne, notInArray, gte } from "drizzle-orm";
import type { User, Location, Recommendation } from "@shared/schema";

interface RecommendationScore {
  userId: string;
  targetUserId: string;
  score: number;
  reasons: string[];
  type: 'user' | 'location' | 'reunion';
}

const INTERACTION_WEIGHTS = {
  like: 5,
  super_like: 10,
  view: 1,
  click: 2,
  pass: -3,
  visit: 3,
  message: 4
};

export class RecommendationEngine {
  private static instance: RecommendationEngine;

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  async generateRecommendationsForUser(userId: string): Promise<Recommendation[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const scores: RecommendationScore[] = [];

    const [proximityScores, interactionScores, reunionScores] = await Promise.all([
      this.calculateProximityScores(userId, user),
      this.calculateInteractionBasedScores(userId),
      this.calculateReunionScores(userId)
    ]);

    scores.push(...proximityScores, ...interactionScores, ...reunionScores);

    const aggregatedScores = this.aggregateScores(scores);
    const sortedScores = aggregatedScores.sort((a, b) => b.score - a.score).slice(0, 20);

    const savedRecommendations: Recommendation[] = [];
    for (const score of sortedScores) {
      try {
        const rec = await this.saveRecommendation(userId, score);
        if (rec) savedRecommendations.push(rec);
      } catch (error) {
        console.error("Failed to save recommendation:", error);
      }
    }

    await this.logTrainingSignal(userId, 'recommendations_generated', {
      count: savedRecommendations.length,
      topScore: sortedScores[0]?.score || 0
    });

    return savedRecommendations;
  }

  private async getUser(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user || null;
  }

  private async calculateProximityScores(userId: string, user: User): Promise<RecommendationScore[]> {
    if (!user.currentLatitude || !user.currentLongitude) return [];

    const nearbyRadius = 100;
    const nearbyUsers = await db.select()
      .from(users)
      .where(and(
        ne(users.id, userId),
        eq(users.onboardingCompleted, true)
      ))
      .limit(50);

    const scores: RecommendationScore[] = [];

    for (const nearbyUser of nearbyUsers) {
      if (!nearbyUser.currentLatitude || !nearbyUser.currentLongitude) continue;

      const distance = this.calculateDistance(
        user.currentLatitude, user.currentLongitude,
        nearbyUser.currentLatitude, nearbyUser.currentLongitude
      );

      if (distance <= nearbyRadius) {
        const proximityScore = Math.max(0, 100 - distance);
        scores.push({
          userId,
          targetUserId: nearbyUser.id,
          score: proximityScore,
          reasons: [`${Math.round(distance)}km away`],
          type: 'user'
        });
      }
    }

    return scores;
  }

  private async calculateInteractionBasedScores(userId: string): Promise<RecommendationScore[]> {
    const likedUsers = await db.select()
      .from(userInteractions)
      .where(and(
        eq(userInteractions.userId, userId),
        eq(userInteractions.interactionType, 'like')
      ))
      .limit(100);

    if (likedUsers.length === 0) return [];

    const likedTargetIds = likedUsers
      .filter(i => i.targetId)
      .map(i => i.targetId as string);

    if (likedTargetIds.length === 0) return [];

    const likedProfiles = await db.select()
      .from(users)
      .where(sql`${users.id} = ANY(${likedTargetIds})`);

    const interestCounts = new Map<string, number>();
    for (const profile of likedProfiles) {
      const interests = profile.interests as string[] || [];
      for (const interest of interests) {
        interestCounts.set(interest, (interestCounts.get(interest) || 0) + 1);
      }
    }

    const topInterests = Array.from(interestCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([interest]) => interest);

    if (topInterests.length === 0) return [];

    const similarUsers = await db.select()
      .from(users)
      .where(and(
        ne(users.id, userId),
        eq(users.onboardingCompleted, true)
      ))
      .limit(100);

    const scores: RecommendationScore[] = [];

    for (const potentialMatch of similarUsers) {
      if (likedTargetIds.includes(potentialMatch.id)) continue;

      const potentialInterests = potentialMatch.interests as string[] || [];
      const matchingInterests = potentialInterests.filter(i => topInterests.includes(i));

      if (matchingInterests.length > 0) {
        const interestScore = matchingInterests.length * 15;
        scores.push({
          userId,
          targetUserId: potentialMatch.id,
          score: interestScore,
          reasons: [`Shared interests: ${matchingInterests.join(', ')}`],
          type: 'user'
        });
      }
    }

    return scores;
  }

  private async calculateReunionScores(userId: string): Promise<RecommendationScore[]> {
    const pastConnections = await db.select()
      .from(connections)
      .where(and(
        sql`(${connections.userId} = ${userId} OR ${connections.connectedUserId} = ${userId})`,
        eq(connections.status, 'ended')
      ))
      .limit(50);

    if (pastConnections.length === 0) return [];

    const user = await this.getUser(userId);
    if (!user?.currentLatitude || !user?.currentLongitude) return [];

    const scores: RecommendationScore[] = [];
    const nearbyRadius = 50;

    for (const connection of pastConnections) {
      const pastPartnerId = connection.userId === userId 
        ? connection.connectedUserId 
        : connection.userId;

      const [pastPartner] = await db.select()
        .from(users)
        .where(eq(users.id, pastPartnerId));

      if (!pastPartner?.currentLatitude || !pastPartner?.currentLongitude) continue;

      const distance = this.calculateDistance(
        user.currentLatitude, user.currentLongitude,
        pastPartner.currentLatitude, pastPartner.currentLongitude
      );

      if (distance <= nearbyRadius) {
        const reunionScore = 80 + Math.max(0, 20 - distance);
        scores.push({
          userId,
          targetUserId: pastPartnerId,
          score: reunionScore,
          reasons: [`Past travel companion nearby (${Math.round(distance)}km)`],
          type: 'reunion'
        });
      }
    }

    return scores;
  }

  private aggregateScores(scores: RecommendationScore[]): RecommendationScore[] {
    const aggregated = new Map<string, RecommendationScore>();

    for (const score of scores) {
      const existing = aggregated.get(score.targetUserId);
      if (existing) {
        existing.score += score.score;
        existing.reasons.push(...score.reasons);
        if (score.type === 'reunion') existing.type = 'reunion';
      } else {
        aggregated.set(score.targetUserId, { ...score });
      }
    }

    return Array.from(aggregated.values());
  }

  private async saveRecommendation(userId: string, score: RecommendationScore): Promise<Recommendation | null> {
    const existing = await db.select()
      .from(recommendations)
      .where(and(
        eq(recommendations.userId, userId),
        eq(recommendations.targetId, score.targetUserId),
        eq(recommendations.isActive, true)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db.update(recommendations)
        .set({
          confidenceScore: score.score,
          reason: score.reasons.join('; '),
          updatedAt: new Date()
        })
        .where(eq(recommendations.id, existing[0].id))
        .returning();
      return updated;
    }

    const [rec] = await db.insert(recommendations)
      .values({
        userId,
        targetId: score.targetUserId,
        type: score.type,
        confidenceScore: score.score,
        reason: score.reasons.join('; '),
        isActive: true
      })
      .returning();

    return rec;
  }

  private async logTrainingSignal(userId: string, signalType: string, data: any): Promise<void> {
    try {
      await db.insert(aiTrainingSignals).values({
        userId,
        signalType,
        signalData: data,
        processed: false
      });
    } catch (error) {
      console.error("Failed to log training signal:", error);
    }
  }

  async processUserInteraction(userId: string, interactionType: string, targetId: string): Promise<void> {
    const weight = INTERACTION_WEIGHTS[interactionType as keyof typeof INTERACTION_WEIGHTS] || 1;

    await this.logTrainingSignal(userId, 'user_interaction', {
      interactionType,
      targetId,
      weight,
      timestamp: new Date().toISOString()
    });

    if (interactionType === 'like' || interactionType === 'super_like') {
      const [mutualInteraction] = await db.select()
        .from(userInteractions)
        .where(and(
          eq(userInteractions.userId, targetId),
          eq(userInteractions.targetId, userId),
          sql`${userInteractions.interactionType} IN ('like', 'super_like')`
        ))
        .limit(1);

      if (mutualInteraction) {
        await this.logTrainingSignal(userId, 'mutual_match', {
          matchedUserId: targetId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const recommendationEngine = RecommendationEngine.getInstance();
