import React, { useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingLocation">;
type LocationRouteProp = RouteProp<RootStackParamList, "OnboardingLocation">;

export default function LocationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LocationRouteProp>();
  const [permission, requestPermission] = Location.useForegroundPermissions();
  const [isLoading, setIsLoading] = useState(false);

  const userEmail = route.params?.email;

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      let locationGranted = permission?.granted ?? false;
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (!locationGranted) {
        const result = await requestPermission();
        locationGranted = result.granted;
      }

      if (locationGranted) {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
          console.log("Got location:", latitude, longitude);
        } catch (locError) {
          console.warn("Could not get current location:", locError);
        }
      }

      if (userEmail) {
        const apiUrl = getApiUrl();
        await fetch(new URL("/api/profile/update-location", apiUrl).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            latitude,
            longitude,
            locationPermission: locationGranted,
          }),
        });
      }
    } catch (error) {
      console.error("Error handling location permission:", error);
    } finally {
      setIsLoading(false);
      navigation.navigate("OnboardingNotification", { email: userEmail });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom }]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "20%" }]} />
      </View>
      
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
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
          testID="button-location-continue"
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
