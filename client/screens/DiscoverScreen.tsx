import React, { useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  currentLocation: string | null;
  currentLatitude: string | null;
  currentLongitude: string | null;
  travelStyle: string | null;
  interests: string[] | null;
  isOnline: boolean | null;
  createdAt: string;
}

interface ProfileCardProps {
  user: UserProfile;
  isFirst: boolean;
  onSwipe: (direction: "left" | "right", userId: string) => void;
}

function ProfileCard({ user, isFirst, onSwipe }: ProfileCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleSwipe = (direction: "left" | "right") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipe(direction, user.id);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isFirst) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5;
      rotation.value = event.translationX / 20;
    })
    .onEnd((event) => {
      if (!isFirst) return;

      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { damping: 15 });
        runOnJS(handleSwipe)("right");
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 15 });
        runOnJS(handleSwipe)("left");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH],
      [1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: isFirst ? 1 : scale },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolation.CLAMP),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-100, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const defaultPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop";
  const isNew = new Date(user.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: user.avatarUrl || defaultPhoto }} style={styles.cardImage} />
        
        <Animated.View style={[styles.likeStamp, likeOpacity]}>
          <ThemedText style={styles.stampText}>CONNECT</ThemedText>
        </Animated.View>
        
        <Animated.View style={[styles.nopeStamp, nopeOpacity]}>
          <ThemedText style={styles.stampTextNope}>PASS</ThemedText>
        </Animated.View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.cardOverlay}
        >
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              {isNew ? (
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={18} color="#8B5CF6" />
                </View>
              ) : null}
              <ThemedText style={styles.userName}>{user.displayName || "Nomad"}</ThemedText>
              {user.isOnline ? <View style={styles.onlineDot} /> : null}
            </View>
            
            {isNew ? (
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <MaterialCommunityIcons name="star" size={12} color={ObimoColors.textPrimary} />
                  <ThemedText style={styles.tagText}>Just joined</ThemedText>
                </View>
              </View>
            ) : null}
            
            {user.travelStyle ? (
              <View style={styles.tagRow}>
                <View style={[styles.tag, styles.travelStyleTag]}>
                  <MaterialCommunityIcons name="van-utility" size={12} color="#FFFFFF" />
                  <ThemedText style={styles.travelStyleText}>{user.travelStyle}</ThemedText>
                </View>
              </View>
            ) : null}
            
            {user.currentLocation ? (
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#FFFFFF" />
                <ThemedText style={styles.locationText}>{user.currentLocation}</ThemedText>
              </View>
            ) : null}

            {user.bio ? (
              <ThemedText style={styles.bioText} numberOfLines={2}>{user.bio}</ThemedText>
            ) : null}
          </View>

          <View style={styles.moreButton}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const queryClient = useQueryClient();
  const [showTooltip, setShowTooltip] = useState(true);
  const [swipedUserIds, setSwipedUserIds] = useState<string[]>([]);
  
  const currentUserId = "user-1";

  const { data: users = [], isLoading, refetch } = useQuery<UserProfile[]>({
    queryKey: ["/api/discover", currentUserId],
  });

  const connectionMutation = useMutation({
    mutationFn: async ({ userId, connectedUserId, connectionType }: { userId: string; connectedUserId: string; connectionType: string }) => {
      return apiRequest("POST", "/api/connections", { userId, connectedUserId, connectionType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
  });

  const interactionMutation = useMutation({
    mutationFn: async (data: { userId: string; targetUserId: string; interactionType: string; context: string }) => {
      return apiRequest("POST", "/api/interactions", data);
    },
  });

  const visibleUsers = users.filter(u => !swipedUserIds.includes(u.id));

  const handleSwipe = useCallback((direction: "left" | "right", userId: string) => {
    setSwipedUserIds(prev => [...prev, userId]);
    setShowTooltip(false);

    if (direction === "right") {
      connectionMutation.mutate({
        userId: currentUserId,
        connectedUserId: userId,
        connectionType: "standard",
      });
    }

    interactionMutation.mutate({
      userId: currentUserId,
      targetUserId: userId,
      interactionType: direction === "right" ? "like" : "pass",
      context: "discover",
    });
  }, [connectionMutation, interactionMutation, currentUserId]);

  const handleDislike = () => {
    if (visibleUsers.length === 0) return;
    handleSwipe("left", visibleUsers[0].id);
  };

  const handleLike = () => {
    if (visibleUsers.length === 0) return;
    handleSwipe("right", visibleUsers[0].id);
  };

  const handleSuperLike = () => {
    if (visibleUsers.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const userId = visibleUsers[0].id;
    setSwipedUserIds(prev => [...prev, userId]);
    setShowTooltip(false);

    connectionMutation.mutate({
      userId: currentUserId,
      connectedUserId: userId,
      connectionType: "super",
    });

    interactionMutation.mutate({
      userId: currentUserId,
      targetUserId: userId,
      interactionType: "super_like",
      context: "discover",
    });
  };

  const cardHeight = SCREEN_HEIGHT - insets.top - tabBarHeight - 180;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={ObimoColors.textPrimary} />
        <ThemedText style={styles.loadingText}>Finding fellow nomads...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Discover</ThemedText>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <MaterialCommunityIcons name="filter-variant" size={24} color={ObimoColors.textPrimary} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <MaterialCommunityIcons name="tune-variant" size={24} color={ObimoColors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.cardContainer, { height: cardHeight }]}>
        {visibleUsers.length > 0 ? (
          visibleUsers
            .slice(0, 2)
            .reverse()
            .map((user, index) => (
              <ProfileCard
                key={user.id}
                user={user}
                isFirst={index === Math.min(visibleUsers.length, 2) - 1}
                onSwipe={handleSwipe}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="compass-outline" size={64} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.emptyText}>No more nomads nearby</ThemedText>
            <ThemedText style={styles.emptySubtext}>Check back later or expand your search</ThemedText>
            <Pressable style={styles.refreshButton} onPress={() => { setSwipedUserIds([]); refetch(); }}>
              <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
            </Pressable>
          </View>
        )}

        {showTooltip && visibleUsers.length > 0 ? (
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <ThemedText style={styles.tooltipText}>Swipe right to connect</ThemedText>
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.actionButtons, { marginBottom: tabBarHeight + Spacing.xl }]}>
        <Pressable
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={handleDislike}
          testID="button-pass"
        >
          <MaterialCommunityIcons name="close" size={28} color="#EF4444" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}
          testID="button-superlike"
        >
          <MaterialCommunityIcons name="star" size={24} color="#3B82F6" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          testID="button-connect"
        >
          <MaterialCommunityIcons name="heart" size={28} color="#22C55E" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.surface,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: "100%",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    backgroundColor: ObimoColors.background,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing["4xl"],
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedBadge: {
    marginRight: Spacing.xs,
  },
  userName: {
    ...Typography.h2,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    marginLeft: Spacing.sm,
  },
  tagRow: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  travelStyleTag: {
    backgroundColor: "rgba(139, 92, 246, 0.8)",
  },
  tagText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  travelStyleText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  locationText: {
    ...Typography.body,
    color: "#FFFFFF",
  },
  bioText: {
    ...Typography.body,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: Spacing.sm,
  },
  moreButton: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
  },
  likeStamp: {
    position: "absolute",
    top: 50,
    left: 20,
    borderWidth: 4,
    borderColor: "#22C55E",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: "-15deg" }],
  },
  nopeStamp: {
    position: "absolute",
    top: 50,
    right: 20,
    borderWidth: 4,
    borderColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: "15deg" }],
  },
  stampText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22C55E",
  },
  stampTextNope: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EF4444",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: "#FEE2E2",
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#DBEAFE",
  },
  likeButton: {
    borderWidth: 2,
    borderColor: "#DCFCE7",
  },
  tooltipContainer: {
    position: "absolute",
    bottom: -20,
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#1F2937",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  tooltipText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  emptySubtext: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  refreshButton: {
    marginTop: Spacing.xl,
    backgroundColor: ObimoColors.textPrimary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  refreshButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
