import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingNotification">;
type NotificationRouteProp = RouteProp<RootStackParamList, "OnboardingNotification">;

export default function NotificationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<NotificationRouteProp>();
  const [isLoading, setIsLoading] = useState(false);

  const userEmail = route.params?.email;

  const handleContinue = async () => {
    setIsLoading(true);
    let notificationGranted = false;

    try {
      if (Platform.OS !== "web") {
        const result = await Notifications.requestPermissionsAsync();
        notificationGranted = result.granted;
      }

      if (userEmail) {
        const apiUrl = getApiUrl();
        await fetch(new URL("/api/profile/update-permissions", apiUrl).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            notificationPermission: notificationGranted,
          }),
        });
      }
    } catch (e) {
      console.log("Notification permission error:", e);
    } finally {
      setIsLoading(false);
      navigation.navigate("OnboardingProfile", { email: userEmail });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom }]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "40%" }]} />
      </View>
      
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
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
          testID="button-notification-continue"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          )}
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
  progressBar: {
    height: 4,
    backgroundColor: ObimoColors.background,
    borderRadius: 2,
    marginBottom: Spacing["3xl"],
  },
  progressFill: {
    height: "100%",
    backgroundColor: ObimoColors.primary,
    borderRadius: 2,
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
  continueButtonDisabled: {
    opacity: 0.7,
  },
});
