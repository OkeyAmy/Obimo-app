import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
    >
      <View style={styles.emptyState}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/welcome-hero.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <ThemedText style={styles.emptyTitle}>
          Welcome to Obimo
        </ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Start exploring to find fellow nomads nearby and discover new adventures.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.background,
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: 200,
    height: 150,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing["2xl"],
  },
  illustration: {
    width: "100%",
    height: "100%",
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
