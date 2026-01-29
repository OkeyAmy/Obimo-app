import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image } from "react-native";
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

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  isNew: boolean;
}

const MOCK_USERS: UserProfile[] = [
  {
    id: "1",
    name: "Shahpal",
    age: 23,
    location: "Jakarta",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    isNew: true,
  },
  {
    id: "2",
    name: "Maya",
    age: 28,
    location: "Bali",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    isNew: false,
  },
  {
    id: "3",
    name: "Alex",
    age: 31,
    location: "Lisbon",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    isNew: true,
  },
  {
    id: "4",
    name: "Sofia",
    age: 26,
    location: "Barcelona",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    isNew: false,
  },
];

interface ProfileCardProps {
  user: UserProfile;
  isFirst: boolean;
  onSwipe: (direction: "left" | "right") => void;
}

function ProfileCard({ user, isFirst, onSwipe }: ProfileCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleSwipe = (direction: "left" | "right") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipe(direction);
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

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: user.photo }} style={styles.cardImage} />
        
        <Animated.View style={[styles.likeStamp, likeOpacity]}>
          <ThemedText style={styles.stampText}>LIKE</ThemedText>
        </Animated.View>
        
        <Animated.View style={[styles.nopeStamp, nopeOpacity]}>
          <ThemedText style={styles.stampTextNope}>NOPE</ThemedText>
        </Animated.View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.cardOverlay}
        >
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              {user.isNew ? (
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={18} color="#8B5CF6" />
                </View>
              ) : null}
              <ThemedText style={styles.userName}>{user.name}</ThemedText>
              <ThemedText style={styles.userAge}>, {user.age}</ThemedText>
              <View style={styles.onlineDot} />
            </View>
            
            {user.isNew ? (
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <MaterialCommunityIcons name="star" size={12} color={ObimoColors.textPrimary} />
                  <ThemedText style={styles.tagText}>Just joined</ThemedText>
                </View>
              </View>
            ) : null}
            
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#FFFFFF" />
              <ThemedText style={styles.locationText}>{user.location}</ThemedText>
            </View>
          </View>

          <View style={styles.moreButton}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
}

export default function EncountersScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [users, setUsers] = useState(MOCK_USERS);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleSwipe = (direction: "left" | "right") => {
    setTimeout(() => {
      setUsers((prev) => prev.slice(1));
      setShowTooltip(false);
    }, 200);
  };

  const handleDislike = () => {
    if (users.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUsers((prev) => prev.slice(1));
    setShowTooltip(false);
  };

  const handleLike = () => {
    if (users.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUsers((prev) => prev.slice(1));
    setShowTooltip(false);
  };

  const cardHeight = SCREEN_HEIGHT - insets.top - tabBarHeight - 180;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Encounters</ThemedText>
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
        {users.length > 0 ? (
          users
            .slice(0, 2)
            .reverse()
            .map((user, index) => (
              <ProfileCard
                key={user.id}
                user={user}
                isFirst={index === users.slice(0, 2).length - 1}
                onSwipe={handleSwipe}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cards-heart-outline" size={64} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.emptyText}>No more profiles nearby</ThemedText>
            <ThemedText style={styles.emptySubtext}>Check back later for new connections</ThemedText>
          </View>
        )}

        {showTooltip && users.length > 0 ? (
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <ThemedText style={styles.tooltipText}>Tap here to like</ThemedText>
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.actionButtons, { marginBottom: tabBarHeight + Spacing.xl }]}>
        <Pressable
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={handleDislike}
          testID="button-dislike"
        >
          <MaterialCommunityIcons name="close" size={32} color="#000000" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          testID="button-like"
        >
          <MaterialCommunityIcons name="heart" size={32} color="#000000" />
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
  userAge: {
    ...Typography.h2,
    color: "#FFFFFF",
    fontWeight: "400",
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
  tagText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
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
    fontSize: 32,
    fontWeight: "800",
    color: "#22C55E",
  },
  stampTextNope: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EF4444",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing["3xl"],
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dislikeButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: ObimoColors.background,
  },
  likeButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: ObimoColors.background,
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
});
