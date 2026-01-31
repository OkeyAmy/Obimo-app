import React from "react";
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  connectionType: string;
  status: string;
  lastInteraction: string | null;
  matchedAt: string | null;
  createdAt: string;
  connectedUser?: {
    id: string;
    firstName: string | null;
    photos: string[] | null;
    latitude: string | null;
    longitude: string | null;
  };
}

const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop";

export default function ConnectsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  
  const currentUserId = "user-1";

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections", currentUserId],
  });

  const activeConnections = connections.filter(c => c.status === "active" || c.status === "connected");

  const calculateDistance = (lat: string | null, lng: string | null) => {
    if (!lat || !lng) return null;
    return Math.floor(Math.random() * 100) + 5;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const nearbyConnections = activeConnections.filter(c => {
    const distance = calculateDistance(c.connectedUser?.latitude || null, c.connectedUser?.longitude || null);
    return distance && distance < 50;
  });

  const recentConnections = activeConnections.slice(0, 8);

  const renderConnectionCard = (connection: Connection, isNearby: boolean = false) => {
    const user = connection.connectedUser;
    const photoUrl = user?.photos && user.photos.length > 0 ? user.photos[0] : defaultAvatar;
    const distance = calculateDistance(user?.latitude || null, user?.longitude || null);
    
    return (
      <Pressable style={styles.connectionCard} testID={`connection-${connection.id}`}>
        <Image source={{ uri: photoUrl }} style={styles.connectionPhoto} contentFit="cover" />
        
        <View style={styles.connectionInfo}>
          <View style={styles.connectionHeader}>
            <ThemedText style={styles.connectionName}>
              {user?.firstName || "Traveler"}
            </ThemedText>
            {isNearby ? <View style={styles.onlineDot} /> : null}
          </View>
          
          <View style={styles.connectionMeta}>
            <Feather name="navigation" size={11} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.connectionDistance}>
              {distance ? `${distance} miles away` : "Location unknown"}
            </ThemedText>
          </View>
          
          <ThemedText style={styles.connectionLastMet}>
            Last met: Moab, {formatDate(connection.matchedAt || connection.createdAt)}
          </ThemedText>
        </View>
        
        <View style={styles.connectionActions}>
          {isNearby ? (
            <Pressable style={styles.reconnectButton}>
              <ThemedText style={styles.reconnectButtonText}>Reconnect</ThemedText>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.actionIconButton}>
                <Feather name="map" size={16} color={ObimoColors.textSecondary} />
              </Pressable>
              <Pressable style={styles.actionIconButton}>
                <Feather name="message-circle" size={16} color={ObimoColors.textSecondary} />
              </Pressable>
            </>
          )}
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={ObimoColors.textPrimary} />
        <ThemedText style={styles.loadingText}>Loading connections...</ThemedText>
      </View>
    );
  }

  const hasAnyConnections = activeConnections.length > 0;

  if (!hasAnyConnections) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Feather name="message-circle" size={22} color={ObimoColors.textPrimary} />
          <ThemedText style={styles.headerTitle}>Connects</ThemedText>
        </View>
        
        <View style={styles.emptyContainer}>
          <Feather name="users" size={56} color={ObimoColors.textSecondary} />
          <ThemedText style={styles.emptyTitle}>No connections yet</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Start swiping in Discover to find travel companions. When you match with someone, they'll appear here.
          </ThemedText>
          <Pressable style={styles.discoverButton}>
            <ThemedText style={styles.discoverButtonText}>Go to Discover</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="message-circle" size={22} color={ObimoColors.textPrimary} />
          <ThemedText style={styles.headerTitle}>Connects</ThemedText>
        </View>
        <Pressable style={styles.searchButton}>
          <Feather name="search" size={18} color={ObimoColors.textSecondary} />
        </Pressable>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.sectionsContainer}>
            {nearbyConnections.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <ThemedText style={styles.sectionTitle}>NEARBY NOW</ThemedText>
                  <View style={styles.sectionBadge}>
                    <ThemedText style={styles.sectionBadgeText}>{nearbyConnections.length}</ThemedText>
                  </View>
                </View>
                {nearbyConnections.map(connection => (
                  <View key={connection.id}>
                    {renderConnectionCard(connection, true)}
                  </View>
                ))}
              </View>
            ) : null}

            {recentConnections.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="clock" size={14} color={ObimoColors.textSecondary} />
                  <ThemedText style={styles.sectionTitle}>RECENT CONNECTIONS</ThemedText>
                  <View style={styles.sectionBadge}>
                    <ThemedText style={styles.sectionBadgeText}>{recentConnections.length}</ThemedText>
                  </View>
                </View>
                {recentConnections.map(connection => (
                  <View key={connection.id}>
                    {renderConnectionCard(connection, false)}
                  </View>
                ))}
                
                {activeConnections.length > 8 ? (
                  <Pressable style={styles.seeAllButton}>
                    <ThemedText style={styles.seeAllText}>
                      See all companions ({activeConnections.length})
                    </ThemedText>
                    <Feather name="arrow-right" size={14} color={ObimoColors.textPrimary} />
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            {activeConnections.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="zap" size={14} color="#F59E0B" />
                  <ThemedText style={styles.sectionTitle}>REUNION SUGGESTIONS</ThemedText>
                </View>
                
                <View style={styles.suggestionCard}>
                  <ThemedText style={styles.suggestionText}>
                    Keep traveling to get personalized reunion suggestions based on shared locations!
                  </ThemedText>
                  <Pressable style={styles.suggestionDismiss}>
                    <ThemedText style={styles.suggestionDismissText}>Got it</ThemedText>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  searchButton: {
    padding: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  sectionsContainer: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  sectionTitle: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontSize: 11,
  },
  sectionBadge: {
    backgroundColor: ObimoColors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  sectionBadgeText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  connectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  connectionPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  connectionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  connectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  connectionName: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "600",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  connectionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  connectionDistance: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    fontSize: 12,
  },
  connectionLastMet: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  connectionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  reconnectButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  reconnectButtonText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  actionIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  seeAllText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  suggestionCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  suggestionText: {
    ...Typography.body,
    color: "#92400E",
    fontSize: 14,
  },
  suggestionDismiss: {
    alignSelf: "flex-end",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(146, 64, 14, 0.1)",
    borderRadius: BorderRadius.lg,
  },
  suggestionDismissText: {
    ...Typography.small,
    color: "#92400E",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  emptyTitle: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  emptySubtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: "center",
    lineHeight: 22,
  },
  discoverButton: {
    marginTop: Spacing["2xl"],
    backgroundColor: ObimoColors.textPrimary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  discoverButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
