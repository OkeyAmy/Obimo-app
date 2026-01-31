import React, { useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image, ActivityIndicator, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
  firstName: string | null;
  photos: string[] | null;
  latitude: string | null;
  longitude: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  onboardingCompleted: boolean | null;
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
  const userPhoto = user.photos && user.photos.length > 0 ? user.photos[0] : defaultPhoto;
  
  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.dateOfBirth);
  const displayName = user.firstName || "Nomad";
  const nameWithAge = age ? `${displayName}, ${age}` : displayName;

  const getLocationName = () => {
    if (!user.latitude || !user.longitude) return null;
    return "Nearby";
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: userPhoto }} style={styles.cardImage} />
        
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
              <ThemedText style={styles.userName}>{nameWithAge}</ThemedText>
              <View style={styles.onlineDot} />
            </View>
            
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Feather name="message-circle" size={12} color="#FFFFFF" />
                <ThemedText style={styles.tagText}>Here to connect</ThemedText>
              </View>
            </View>
            
            {getLocationName() ? (
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#FFFFFF" />
                <ThemedText style={styles.locationText}>{getLocationName()}</ThemedText>
              </View>
            ) : null}
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
  const [swipedUserIds, setSwipedUserIds] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  
  const currentUserId = "test-user-1";

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
        <ThemedText style={styles.headerTitle}>Encounters</ThemedText>
        <View style={styles.headerActions}>
          <Pressable 
            style={styles.headerButton}
            onPress={() => setShowLikesModal(true)}
            testID="button-likes"
          >
            <Feather name="heart" size={22} color={ObimoColors.textPrimary} />
          </Pressable>
          <Pressable 
            style={styles.headerButton}
            onPress={() => setShowFilterModal(true)}
            testID="button-filter"
          >
            <Feather name="sliders" size={22} color={ObimoColors.textPrimary} />
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
      </View>

      <View style={[styles.actionButtons, { marginBottom: tabBarHeight + Spacing.xl }]}>
        <Pressable
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={handleDislike}
          testID="button-pass"
        >
          <Feather name="x" size={28} color="#EF4444" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          testID="button-connect"
        >
          <Feather name="heart" size={28} color="#22C55E" />
        </Pressable>
      </View>

      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Filters</ThemedText>
            <Pressable onPress={() => setShowFilterModal(false)}>
              <Feather name="x" size={24} color={ObimoColors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Distance</ThemedText>
              <View style={styles.filterOptions}>
                {["10 mi", "25 mi", "50 mi", "100 mi"].map((option) => (
                  <Pressable key={option} style={styles.filterOption}>
                    <ThemedText style={styles.filterOptionText}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Looking for</ThemedText>
              <View style={styles.filterOptions}>
                {["Everyone", "Men", "Women", "Non-binary"].map((option) => (
                  <Pressable key={option} style={styles.filterOption}>
                    <ThemedText style={styles.filterOptionText}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Age Range</ThemedText>
              <View style={styles.filterOptions}>
                {["18-25", "25-35", "35-45", "45+"].map((option) => (
                  <Pressable key={option} style={styles.filterOption}>
                    <ThemedText style={styles.filterOptionText}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <Pressable 
            style={styles.applyButton}
            onPress={() => setShowFilterModal(false)}
          >
            <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
          </Pressable>
        </View>
      </Modal>

      <Modal
        visible={showLikesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLikesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Who Liked You</ThemedText>
            <Pressable onPress={() => setShowLikesModal(false)}>
              <Feather name="x" size={24} color={ObimoColors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.emptyLikes}>
            <Feather name="heart" size={48} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.emptyLikesText}>No likes yet</ThemedText>
            <ThemedText style={styles.emptyLikesSubtext}>Keep swiping to get more matches</ThemedText>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  tagText: {
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
    gap: Spacing["3xl"],
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  likeButton: {
    borderWidth: 2,
    borderColor: "#DCFCE7",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  modalTitle: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  filterSection: {
    marginBottom: Spacing["2xl"],
  },
  filterLabel: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  filterOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: ObimoColors.background,
  },
  filterOptionText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  applyButton: {
    margin: Spacing.xl,
    backgroundColor: ObimoColors.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  applyButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyLikes: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyLikesText: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    marginTop: Spacing.lg,
  },
  emptyLikesSubtext: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});
