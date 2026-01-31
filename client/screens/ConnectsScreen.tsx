import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator, ScrollView } from "react-native";
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

interface Message {
  id: string;
  senderName: string;
  preview: string;
  time: string;
  unread: boolean;
  avatarUrl: string;
}

const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop";

const demoMessages: Message[] = [
  {
    id: "1",
    senderName: "Joe",
    preview: "Are you exploring DC beca...",
    time: "7m",
    unread: true,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
];

export default function ConnectsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  
  const currentUserId = "test-user-1";

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: [`/api/connections/${currentUserId}`],
  });

  const pendingConnections = connections.filter(c => c.status === "pending");
  const activeConnections = connections.filter(c => c.status === "active");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const renderLikesRow = () => {
    const likes = pendingConnections.slice(0, 5);
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.likesRow}
      >
        {likes.map((connection) => {
          const connUser = connection.connectedUser;
          const photoUrl = connUser?.photos && connUser.photos.length > 0 
            ? connUser.photos[0] 
            : defaultAvatar;
          
          return (
            <Pressable key={connection.id} style={styles.likeItem}>
              <View style={styles.likeAvatarContainer}>
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.likeAvatar}
                  contentFit="cover"
                />
                <View style={styles.likeNotificationBadge} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Pressable style={styles.messageItem} testID={`message-${item.id}`}>
      <View style={styles.messageAvatarContainer}>
        <Image
          source={{ uri: item.avatarUrl }}
          style={styles.messageAvatar}
          contentFit="cover"
        />
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <ThemedText style={styles.messageSender}>{item.senderName}</ThemedText>
          <ThemedText style={styles.messageTime}>{item.time}</ThemedText>
        </View>
        <ThemedText style={styles.messagePreview} numberOfLines={1}>
          {item.preview}
        </ThemedText>
      </View>
      
      {item.unread ? (
        <View style={styles.unreadDot} />
      ) : null}
    </Pressable>
  );

  const renderConnectionItem = ({ item }: { item: Connection }) => {
    const user = item.connectedUser;
    const photoUrl = user?.photos && user.photos.length > 0 
      ? user.photos[0] 
      : defaultAvatar;
    
    return (
      <Pressable style={styles.messageItem} testID={`connection-${item.id}`}>
        <View style={styles.messageAvatarContainer}>
          <Image
            source={{ uri: photoUrl }}
            style={styles.messageAvatar}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <ThemedText style={styles.messageSender}>
              {user?.firstName || "Nomad"}
            </ThemedText>
            <ThemedText style={styles.messageTime}>
              {formatDate(item.matchedAt || item.createdAt)}
            </ThemedText>
          </View>
          <ThemedText style={styles.messagePreview} numberOfLines={1}>
            Tap to start a conversation
          </ThemedText>
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

  const hasLikes = pendingConnections.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {hasLikes ? (
        <>
          {renderLikesRow()}
          <View style={styles.divider} />
        </>
      ) : null}
      
      <FlatList
        data={activeConnections.length > 0 ? activeConnections : undefined}
        renderItem={renderConnectionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
          activeConnections.length === 0 ? styles.emptyListContent : null,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={48} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.emptyTitle}>No messages yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              When you match with someone, your conversations will appear here
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      
      <Pressable style={[styles.fab, { bottom: tabBarHeight + Spacing.xl }]}>
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
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
  likesRow: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  likeItem: {
    alignItems: "center",
  },
  likeAvatarContainer: {
    position: "relative",
  },
  likeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  likeNotificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: ObimoColors.background,
    marginHorizontal: Spacing.xl,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  messageAvatarContainer: {
    position: "relative",
  },
  messageAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  messageContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageSender: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
  },
  messageTime: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  messagePreview: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    marginLeft: Spacing.sm,
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
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ObimoColors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
