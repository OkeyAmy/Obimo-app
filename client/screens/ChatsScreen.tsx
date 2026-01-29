import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography } from "@/constants/theme";

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: tabBarHeight }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Chats</ThemedText>
      </View>
      
      <View style={styles.emptyState}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={64} color={ObimoColors.textSecondary} />
        </View>
        <ThemedText style={styles.emptyTitle}>No conversations yet</ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Start swiping to match with fellow nomads and begin chatting!
        </ThemedText>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
  },
  emptyTitle: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
});
