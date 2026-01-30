import { db } from "./db";
import { 
  users, 
  userInteractions, 
  recommendations,
  connections,
  aiTrainingSignals
} from "@shared/schema";
import { eq, and, desc, sql, ne } from "drizzle-orm";
import type { User, Recommendation } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    
    // Use AI to enhance and re-rank recommendations
    const aiEnhancedScores = await this.enhanceWithAI(userId, user, aggregatedScores);
    
    const sortedScores = aiEnhancedScores.sort((a, b) => b.score - a.score).slice(0, 20);

    const savedRecommendations: Recommendation[] = [];
    for (const score of sortedScores) {
      try {
        const rec = await this.saveRecommendation(userId, score);
        if (rec) savedRecommendations.push(rec);
      } catch (error) {
        console.error("Failed to save recommendation:", error);
      }
    }

    await this.logTrainingSignal('recommendations_generated', {
      userId,
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
    if (!user.latitude || !user.longitude) return [];

    const userLat = parseFloat(user.latitude);
    const userLon = parseFloat(user.longitude);
    
    if (isNaN(userLat) || isNaN(userLon)) return [];

    const nearbyRadius = 100; // km
    const nearbyUsers = await db.select()
      .from(users)
      .where(and(
        ne(users.id, userId),
        eq(users.onboardingCompleted, true)
      ))
      .limit(50);

    const scores: RecommendationScore[] = [];

    for (const nearbyUser of nearbyUsers) {
      if (!nearbyUser.latitude || !nearbyUser.longitude) continue;

      const nearbyLat = parseFloat(nearbyUser.latitude);
      const nearbyLon = parseFloat(nearbyUser.longitude);
      
      if (isNaN(nearbyLat) || isNaN(nearbyLon)) continue;

      const distance = this.calculateDistance(userLat, userLon, nearbyLat, nearbyLon);

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
      .filter(i => i.targetUserId)
      .map(i => i.targetUserId as string);

    if (likedTargetIds.length === 0) return [];

    // Get users similar to those liked
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

      // Basic similarity scoring based on profile completeness
      let similarityScore = 0;
      if (potentialMatch.firstName) similarityScore += 5;
      if (potentialMatch.photos && (potentialMatch.photos as string[]).length > 0) similarityScore += 10;
      if (potentialMatch.latitude && potentialMatch.longitude) similarityScore += 5;

      if (similarityScore > 0) {
        scores.push({
          userId,
          targetUserId: potentialMatch.id,
          score: similarityScore,
          reasons: ['Based on your preferences'],
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
    if (!user?.latitude || !user?.longitude) return [];

    const userLat = parseFloat(user.latitude);
    const userLon = parseFloat(user.longitude);
    
    if (isNaN(userLat) || isNaN(userLon)) return [];

    const scores: RecommendationScore[] = [];
    const nearbyRadius = 50; // km

    for (const connection of pastConnections) {
      const pastPartnerId = connection.userId === userId 
        ? connection.connectedUserId 
        : connection.userId;

      const [pastPartner] = await db.select()
        .from(users)
        .where(eq(users.id, pastPartnerId));

      if (!pastPartner?.latitude || !pastPartner?.longitude) continue;

      const partnerLat = parseFloat(pastPartner.latitude);
      const partnerLon = parseFloat(pastPartner.longitude);
      
      if (isNaN(partnerLat) || isNaN(partnerLon)) continue;

      const distance = this.calculateDistance(userLat, userLon, partnerLat, partnerLon);

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

  private async enhanceWithAI(userId: string, user: User, scores: RecommendationScore[]): Promise<RecommendationScore[]> {
    if (scores.length === 0 || !process.env.GEMINI_API_KEY) return scores;

    try {
      // Get interaction history for context
      const recentInteractions = await db.select()
        .from(userInteractions)
        .where(eq(userInteractions.userId, userId))
        .orderBy(desc(userInteractions.createdAt))
        .limit(20);

      const likeCount = recentInteractions.filter(i => i.interactionType === 'like').length;
      const passCount = recentInteractions.filter(i => i.interactionType === 'pass').length;
      const superLikeCount = recentInteractions.filter(i => i.interactionType === 'super_like').length;

      // Build context for AI
      const prompt = `You are a recommendation engine for a van-life nomad connection app called Obimo.
Based on the user's interaction patterns, help optimize recommendation scores.

User Profile:
- Name: ${user.firstName || 'Anonymous'}
- Has location: ${user.latitude && user.longitude ? 'Yes' : 'No'}

Recent Behavior:
- Likes: ${likeCount}
- Super Likes: ${superLikeCount}
- Passes: ${passCount}

Current recommendation candidates (${scores.length} users):
${scores.slice(0, 10).map((s, i) => `${i + 1}. Score: ${s.score}, Type: ${s.type}, Reasons: ${s.reasons.join(', ')}`).join('\n')}

Based on this data, provide a JSON response with score adjustments.
Format: {"adjustments": [{"index": 0, "multiplier": 1.2, "additionalReason": "High engagement pattern"}]}
Only adjust scores that warrant it. Multiplier should be between 0.5 and 2.0.
Respond ONLY with valid JSON, no explanation.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text || '';
      
      // Try to parse AI response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiSuggestions = JSON.parse(jsonMatch[0]);
          
          if (aiSuggestions.adjustments && Array.isArray(aiSuggestions.adjustments)) {
            for (const adj of aiSuggestions.adjustments) {
              if (adj.index >= 0 && adj.index < scores.length && adj.multiplier) {
                const multiplier = Math.max(0.5, Math.min(2.0, adj.multiplier));
                scores[adj.index].score *= multiplier;
                if (adj.additionalReason) {
                  scores[adj.index].reasons.push(adj.additionalReason);
                }
              }
            }
          }
        }
      } catch (parseError) {
        console.warn("Could not parse AI response, using original scores:", parseError);
      }

      await this.logTrainingSignal('ai_enhancement_applied', {
        userId,
        candidateCount: scores.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("AI enhancement failed, using original scores:", error);
    }

    return scores;
  }

  async getAIRecommendationExplanation(userId: string, targetUserId: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return "Recommended based on your location and preferences.";
    }

    try {
      const [user, targetUser] = await Promise.all([
        this.getUser(userId),
        this.getUser(targetUserId)
      ]);

      if (!user || !targetUser) {
        return "Recommended for you.";
      }

      const prompt = `You are writing a brief, friendly explanation for why two van-life nomads might connect.

User 1: ${user.firstName || 'A nomad'}
User 2: ${targetUser.firstName || 'Another nomad'}

Write a single sentence (max 15 words) explaining why they might enjoy connecting.
Be warm, casual, and focus on the van-life/travel lifestyle.
Don't use emojis. Be genuine.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text?.trim() || "You might enjoy traveling together.";
    } catch (error) {
      console.error("Failed to generate AI explanation:", error);
      return "Recommended based on your journey.";
    }
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
        eq(recommendations.recommendedUserId, score.targetUserId),
        eq(recommendations.isActive, true)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db.update(recommendations)
        .set({
          confidenceScore: Math.round(score.score),
          reasonCodes: score.reasons,
          updatedAt: new Date()
        })
        .where(eq(recommendations.id, existing[0].id))
        .returning();
      return updated;
    }

    const [rec] = await db.insert(recommendations)
      .values({
        userId,
        recommendedUserId: score.targetUserId,
        confidenceScore: Math.round(score.score),
        reasonCodes: score.reasons,
        isActive: true
      })
      .returning();

    return rec;
  }

  private async logTrainingSignal(signalType: string, data: Record<string, unknown>): Promise<void> {
    try {
      await db.insert(aiTrainingSignals).values({
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

    await this.logTrainingSignal('user_interaction', {
      userId,
      interactionType,
      targetId,
      weight,
      timestamp: new Date().toISOString()
    });

    // Check for mutual match
    if (interactionType === 'like' || interactionType === 'super_like') {
      const [mutualInteraction] = await db.select()
        .from(userInteractions)
        .where(and(
          eq(userInteractions.userId, targetId),
          eq(userInteractions.targetUserId, userId),
          sql`${userInteractions.interactionType} IN ('like', 'super_like')`
        ))
        .limit(1);

      if (mutualInteraction) {
        await this.logTrainingSignal('mutual_match', {
          userId,
          matchedUserId: targetId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
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
