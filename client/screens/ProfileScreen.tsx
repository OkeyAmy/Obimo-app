import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Feather name="user" size={48} color={ObimoColors.primary} />
        </View>
        <ThemedText style={styles.userName}>Nomad User</ThemedText>
        <ThemedText style={styles.userStatus}>Ready to explore</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        
        <MenuItem icon="edit-2" label="Edit Profile" />
        <MenuItem icon="settings" label="Settings" />
        <MenuItem icon="bell" label="Notifications" />
        <MenuItem icon="shield" label="Privacy" />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        
        <MenuItem icon="help-circle" label="Help & Support" />
        <MenuItem icon="file-text" label="Terms of Service" />
        <MenuItem icon="lock" label="Privacy Policy" />
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color={ObimoColors.error} />
        <ThemedText style={styles.logoutText}>Log out</ThemedText>
      </Pressable>

      <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <Pressable style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Feather name={icon as any} size={20} color={ObimoColors.textPrimary} />
        </View>
        <ThemedText style={styles.menuItemLabel}>{label}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={ObimoColors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.background,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ObimoColors.accent + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  userName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userStatus: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ObimoColors.textSecondary + "30",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ObimoColors.accent + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuItemLabel: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.body,
    color: ObimoColors.error,
    fontWeight: "600",
  },
  versionText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
