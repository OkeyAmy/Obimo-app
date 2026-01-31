import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image, ActivityIndicator, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
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

interface Recommendation {
  id: string;
  userId: string;
  recommendedUserId: string;
  confidenceScore: number;
  reasonCodes: string[];
  isActive: boolean;
  wasViewed: boolean;
  wasActedOn: boolean;
  action: string | null;
  recommendedUser?: UserProfile;
}

interface ProfileCardProps {
  user: UserProfile;
  isFirst: boolean;
  onSwipe: (direction: "left" | "right" | "up", userId: string) => void;
}

function ProfileCard({ user, isFirst, onSwipe }: ProfileCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipe(direction, user.id);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isFirst) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = event.translationX / 20;
    })
    .onEnd((event) => {
      if (!isFirst) return;

      if (event.translationY < -100) {
        translateY.value = withSpring(-SCREEN_HEIGHT, { damping: 15 });
        runOnJS(handleSwipe)("up");
      } else if (event.translationX > SWIPE_THRESHOLD) {
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

  const connectOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolation.CLAMP),
  }));

  const passOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-100, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const superOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-100, 0], [1, 0], Extrapolation.CLAMP),
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
  const displayName = user.firstName || "Traveler";
  const nameWithAge = age ? `${displayName}, ${age}` : displayName;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: userPhoto }} style={styles.cardImage} />
        
        <Animated.View style={[styles.connectStamp, connectOpacity]}>
          <ThemedText style={styles.stampTextConnect}>CONNECT</ThemedText>
        </Animated.View>
        
        <Animated.View style={[styles.passStamp, passOpacity]}>
          <ThemedText style={styles.stampTextPass}>PASS</ThemedText>
        </Animated.View>

        <Animated.View style={[styles.superStamp, superOpacity]}>
          <ThemedText style={styles.stampTextSuper}>SUPER</ThemedText>
        </Animated.View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardOverlay}
        >
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{nameWithAge}</ThemedText>
            
            <View style={styles.infoRow}>
              <Feather name="navigation" size={14} color="#FFFFFF" />
              <ThemedText style={styles.infoText}>5 miles away</ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <Feather name="compass" size={14} color="#FFFFFF" />
              <ThemedText style={styles.infoText}>Sprinter Van</ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <Feather name="map" size={14} color="#FFFFFF" />
              <ThemedText style={styles.infoText}>12 places visited</ThemedText>
            </View>

            <Pressable style={styles.seeMapButton}>
              <ThemedText style={styles.seeMapText}>See travel map</ThemedText>
              <Feather name="arrow-right" size={14} color="#FFFFFF" />
            </Pressable>
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
  const [selectedRadius, setSelectedRadius] = useState("10 mi");
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  
  const [filters, setFilters] = useState({
    vanType: "Any",
    ageRange: "Any",
    gender: "Everyone",
    placesVisited: "Any",
    lastActive: "Any",
  });
  
  const currentUserId = "user-1";

  const { data: recommendationsData, isLoading: isLoadingRecs, refetch: refetchRecs } = useQuery<{ recommendations: Recommendation[] }>({
    queryKey: ["/api/recommendations", currentUserId, "generate"],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/${currentUserId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: fallbackUsers = [], isLoading: isLoadingFallback } = useQuery<UserProfile[]>({
    queryKey: ["/api/discover", currentUserId],
    enabled: !recommendationsData?.recommendations?.length,
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

  const recommendations = recommendationsData?.recommendations || [];
  const usersFromRecs = recommendations.map(r => r.recommendedUser).filter(Boolean) as UserProfile[];
  const allUsers = usersFromRecs.length > 0 ? usersFromRecs : fallbackUsers;
  const visibleUsers = allUsers.filter(u => !swipedUserIds.includes(u.id));

  const handleSwipe = useCallback((direction: "left" | "right" | "up", userId: string) => {
    setSwipedUserIds(prev => [...prev, userId]);

    if (direction === "right" || direction === "up") {
      connectionMutation.mutate({
        userId: currentUserId,
        connectedUserId: userId,
        connectionType: direction === "up" ? "super" : "standard",
      });
    }

    const interactionType = direction === "right" ? "like" : direction === "up" ? "super_like" : "pass";
    interactionMutation.mutate({
      userId: currentUserId,
      targetUserId: userId,
      interactionType,
      context: "discover",
    });
  }, [connectionMutation, interactionMutation, currentUserId]);

  const handlePass = () => {
    if (visibleUsers.length === 0) return;
    handleSwipe("left", visibleUsers[0].id);
  };

  const handleSuperConnect = () => {
    if (visibleUsers.length === 0) return;
    handleSwipe("up", visibleUsers[0].id);
  };

  const handleConnect = () => {
    if (visibleUsers.length === 0) return;
    handleSwipe("right", visibleUsers[0].id);
  };

  const cardHeight = SCREEN_HEIGHT - insets.top - tabBarHeight - 180;
  const isLoading = isLoadingRecs || (isLoadingFallback && !recommendations.length);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={ObimoColors.textPrimary} />
        <ThemedText style={styles.loadingText}>Finding nomads for you...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.settingsButton}>
          <Feather name="sliders" size={18} color={ObimoColors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.radiusSelector}
          onPress={() => setShowRadiusDropdown(!showRadiusDropdown)}
        >
          <ThemedText style={styles.radiusText}>Radius: {selectedRadius}</ThemedText>
          <Feather name="chevron-down" size={16} color={ObimoColors.textPrimary} />
        </Pressable>
        
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          testID="button-filter"
        >
          <ThemedText style={styles.filterText}>Filter</ThemedText>
          <Feather name="target" size={16} color={ObimoColors.textPrimary} />
        </Pressable>
      </View>

      {showRadiusDropdown ? (
        <View style={styles.radiusDropdown}>
          {["5 mi", "10 mi", "20 mi", "50 mi"].map((radius) => (
            <Pressable
              key={radius}
              style={[
                styles.radiusOption,
                selectedRadius === radius ? styles.radiusOptionSelected : null,
              ]}
              onPress={() => {
                setSelectedRadius(radius);
                setShowRadiusDropdown(false);
              }}
            >
              <ThemedText style={[
                styles.radiusOptionText,
                selectedRadius === radius ? styles.radiusOptionTextSelected : null,
              ]}>
                {radius}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      ) : null}

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
            <Feather name="sun" size={64} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.emptyText}>You've seen everyone nearby!</ThemedText>
            <Pressable style={styles.expandButton}>
              <ThemedText style={styles.expandButtonText}>Expand radius to 20 miles</ThemedText>
            </Pressable>
            <Pressable 
              style={styles.refreshLink} 
              onPress={() => { setSwipedUserIds([]); refetchRecs(); }}
            >
              <ThemedText style={styles.refreshLinkText}>Come back later</ThemedText>
            </Pressable>
          </View>
        )}
      </View>

      <View style={[styles.actionButtons, { marginBottom: tabBarHeight + Spacing.md }]}>
        <Pressable
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}
          testID="button-pass"
        >
          <Feather name="x" size={28} color="#EF4444" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.superButton]}
          onPress={handleSuperConnect}
          testID="button-super"
        >
          <Feather name="star" size={24} color="#F59E0B" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.connectButton]}
          onPress={handleConnect}
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
              <ThemedText style={styles.filterLabel}>Van Type</ThemedText>
              <View style={styles.filterOptions}>
                {["Sprinter", "Class B", "School Bus", "Campervan", "Any"].map((option) => (
                  <Pressable 
                    key={option} 
                    style={[
                      styles.filterOption,
                      filters.vanType === option ? styles.filterOptionSelected : null,
                    ]}
                    onPress={() => setFilters({...filters, vanType: option})}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      filters.vanType === option ? styles.filterOptionTextSelected : null,
                    ]}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Age Range</ThemedText>
              <View style={styles.filterOptions}>
                {["18-25", "25-35", "35-45", "45+", "Any"].map((option) => (
                  <Pressable 
                    key={option} 
                    style={[
                      styles.filterOption,
                      filters.ageRange === option ? styles.filterOptionSelected : null,
                    ]}
                    onPress={() => setFilters({...filters, ageRange: option})}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      filters.ageRange === option ? styles.filterOptionTextSelected : null,
                    ]}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Gender</ThemedText>
              <View style={styles.filterOptions}>
                {["Men", "Women", "Non-binary", "Everyone"].map((option) => (
                  <Pressable 
                    key={option} 
                    style={[
                      styles.filterOption,
                      filters.gender === option ? styles.filterOptionSelected : null,
                    ]}
                    onPress={() => setFilters({...filters, gender: option})}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      filters.gender === option ? styles.filterOptionTextSelected : null,
                    ]}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Places Visited (minimum)</ThemedText>
              <View style={styles.filterOptions}>
                {["1+", "5+", "10+", "20+", "Any"].map((option) => (
                  <Pressable 
                    key={option} 
                    style={[
                      styles.filterOption,
                      filters.placesVisited === option ? styles.filterOptionSelected : null,
                    ]}
                    onPress={() => setFilters({...filters, placesVisited: option})}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      filters.placesVisited === option ? styles.filterOptionTextSelected : null,
                    ]}>{option}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Last Active</ThemedText>
              <View style={styles.filterOptions}>
                {["24h", "Week", "Month", "Any"].map((option) => (
                  <Pressable 
                    key={option} 
                    style={[
                      styles.filterOption,
                      filters.lastActive === option ? styles.filterOptionSelected : null,
                    ]}
                    onPress={() => setFilters({...filters, lastActive: option})}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      filters.lastActive === option ? styles.filterOptionTextSelected : null,
                    ]}>{option}</ThemedText>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  radiusSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  radiusText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  radiusDropdown: {
    position: "absolute",
    top: 100,
    left: "50%",
    marginLeft: -60,
    width: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  radiusOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  radiusOptionSelected: {
    backgroundColor: ObimoColors.background,
  },
  radiusOptionText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    textAlign: "center",
  },
  radiusOptionTextSelected: {
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  filterText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
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
    paddingTop: 100,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...Typography.body,
    color: "#FFFFFF",
  },
  seeMapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  seeMapText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  connectStamp: {
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
  passStamp: {
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
  superStamp: {
    position: "absolute",
    top: 50,
    left: "50%",
    marginLeft: -60,
    borderWidth: 4,
    borderColor: "#F59E0B",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stampTextConnect: {
    fontSize: 24,
    fontWeight: "800",
    color: "#22C55E",
  },
  stampTextPass: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EF4444",
  },
  stampTextSuper: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F59E0B",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing["2xl"],
    paddingVertical: Spacing.md,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    borderWidth: 2,
    borderColor: "#FEE2E2",
  },
  superButton: {
    borderWidth: 2,
    borderColor: "#FEF3C7",
  },
  connectButton: {
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
  expandButton: {
    marginTop: Spacing.xl,
    backgroundColor: ObimoColors.textPrimary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  expandButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  refreshLink: {
    marginTop: Spacing.lg,
  },
  refreshLinkText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    textDecorationLine: "underline",
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
  filterOptionSelected: {
    backgroundColor: ObimoColors.textPrimary,
  },
  filterOptionText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  filterOptionTextSelected: {
    color: "#FFFFFF",
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
});
