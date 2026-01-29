import React from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingNotification">;

export default function NotificationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = async () => {
    if (Platform.OS !== "web") {
      try {
        await Notifications.requestPermissionsAsync();
      } catch (e) {
        console.log("Notification permission error:", e);
      }
    }
    navigation.navigate("OnboardingProfile");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="bell" size={32} color={ObimoColors.primary} />
        </View>

        <ThemedText style={styles.title}>Allow notifications</ThemedText>
        <ThemedText style={styles.description}>
          So we can tell you when you get new matches and messages.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
          testID="button-notification-continue"
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.surface,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingBottom: Spacing["2xl"],
  },
  continueButton: {
    height: 56,
    backgroundColor: ObimoColors.primary,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    ...Typography.body,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
