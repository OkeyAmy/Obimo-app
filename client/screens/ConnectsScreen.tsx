import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
    displayName: string | null;
    avatarUrl: string | null;
    currentLocation: string | null;
    isOnline: boolean | null;
  };
}

interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

type TabType = "active" | "pending" | "past";

const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop";

export default function ConnectsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  
  const currentUserId = "user-1";

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections", currentUserId],
  });

  const activeConnections = connections.filter(c => c.status === "active");
  const pendingConnections = connections.filter(c => c.status === "pending");
  const pastConnections = connections.filter(c => c.status === "inactive" || c.status === "blocked");

  const getDisplayConnections = () => {
    switch (activeTab) {
      case "active":
        return activeConnections;
      case "pending":
        return pendingConnections;
      case "past":
        return pastConnections;
      default:
        return activeConnections;
    }
  };

  const displayConnections = getDisplayConnections();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const renderConnectionItem = ({ item }: { item: Connection }) => {
    const user = item.connectedUser;
    const isSuper = item.connectionType === "super";
    
    return (
      <Pressable style={styles.connectionCard} testID={`connection-${item.id}`}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatarUrl || defaultAvatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          {user?.isOnline ? (
            <View style={styles.onlineIndicator} />
          ) : null}
          {isSuper ? (
            <View style={styles.superBadge}>
              <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
            </View>
          ) : null}
        </View>
        
        <View style={styles.connectionInfo}>
          <View style={styles.connectionHeader}>
            <ThemedText style={styles.connectionName}>
              {user?.displayName || "Nomad"}
            </ThemedText>
            <ThemedText style={styles.connectionTime}>
              {formatDate(item.matchedAt || item.createdAt)}
            </ThemedText>
          </View>
          
          {user?.currentLocation ? (
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={ObimoColors.textSecondary} />
              <ThemedText style={styles.locationText}>{user.currentLocation}</ThemedText>
            </View>
          ) : null}
          
          {item.status === "pending" ? (
            <View style={styles.pendingActions}>
              <Pressable style={styles.acceptButton}>
                <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                <ThemedText style={styles.acceptButtonText}>Accept</ThemedText>
              </Pressable>
              <Pressable style={styles.declineButton}>
                <MaterialCommunityIcons name="close" size={18} color={ObimoColors.textSecondary} />
              </Pressable>
            </View>
          ) : item.status === "active" ? (
            <View style={styles.messagePreview}>
              <ThemedText style={styles.messagePreviewText} numberOfLines={1}>
                Tap to start a conversation
              </ThemedText>
            </View>
          ) : null}
        </View>
        
        {item.status === "active" ? (
          <View style={styles.actionButton}>
            <MaterialCommunityIcons name="message-outline" size={20} color={ObimoColors.textPrimary} />
          </View>
        ) : null}
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    const messages = {
      active: {
        icon: "account-group-outline" as const,
        title: "No active connections yet",
        subtitle: "Start swiping in Discover to find fellow nomads",
      },
      pending: {
        icon: "clock-outline" as const,
        title: "No pending connections",
        subtitle: "When someone wants to connect, they'll appear here",
      },
      past: {
        icon: "history" as const,
        title: "No past connections",
        subtitle: "Your connection history will appear here",
      },
    };

    const { icon, title, subtitle } = messages[activeTab];

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name={icon} size={64} color={ObimoColors.textSecondary} />
        <ThemedText style={styles.emptyTitle}>{title}</ThemedText>
        <ThemedText style={styles.emptySubtitle}>{subtitle}</ThemedText>
      </View>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Connects</ThemedText>
        <Pressable style={styles.headerButton}>
          <MaterialCommunityIcons name="magnify" size={24} color={ObimoColors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "active" ? styles.tabActive : null]}
          onPress={() => setActiveTab("active")}
        >
          <ThemedText style={[styles.tabText, activeTab === "active" ? styles.tabTextActive : null]}>
            Active
          </ThemedText>
          {activeConnections.length > 0 ? (
            <View style={styles.tabBadge}>
              <ThemedText style={styles.tabBadgeText}>{activeConnections.length}</ThemedText>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "pending" ? styles.tabActive : null]}
          onPress={() => setActiveTab("pending")}
        >
          <ThemedText style={[styles.tabText, activeTab === "pending" ? styles.tabTextActive : null]}>
            Pending
          </ThemedText>
          {pendingConnections.length > 0 ? (
            <View style={[styles.tabBadge, styles.pendingBadge]}>
              <ThemedText style={styles.tabBadgeText}>{pendingConnections.length}</ThemedText>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "past" ? styles.tabActive : null]}
          onPress={() => setActiveTab("past")}
        >
          <ThemedText style={[styles.tabText, activeTab === "past" ? styles.tabTextActive : null]}>
            Past
          </ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={displayConnections}
        renderItem={renderConnectionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
          displayConnections.length === 0 ? styles.emptyListContent : null,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: ObimoColors.background,
    gap: Spacing.xs,
  },
  tabActive: {
    backgroundColor: ObimoColors.textPrimary,
  },
  tabText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  pendingBadge: {
    backgroundColor: "#F59E0B",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyListContent: {
    flex: 1,
  },
  connectionCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  superBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  connectionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  connectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  connectionName: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
  },
  connectionTime: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 2,
  },
  locationText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  messagePreview: {
    marginTop: Spacing.xs,
  },
  messagePreviewText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  pendingActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  acceptButtonText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  declineButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ObimoColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
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
  },
});
