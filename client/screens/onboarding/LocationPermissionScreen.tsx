import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingLocation">;

export default function LocationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = Location.useForegroundPermissions();

  const handleContinue = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      navigation.navigate("OnboardingNotification");
    } else {
      navigation.navigate("OnboardingNotification");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="map-marker" size={32} color={ObimoColors.primary} />
        </View>

        <ThemedText style={styles.title}>Share your location</ThemedText>
        <ThemedText style={styles.description}>
          We use this to show you people in your area. We never share your exact location.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
          testID="button-location-continue"
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
