import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingGender">;
type GenderRouteProp = RouteProp<RootStackParamList, "OnboardingGender">;

const GENDERS = [
  { id: "man", label: "I'm a man" },
  { id: "woman", label: "I'm a woman" },
  { id: "other", label: "Another gender" },
];

export default function GenderScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GenderRouteProp>();
  const { email, firstName, dateOfBirth } = route.params;
  
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleSelectGender = (genderId: string) => {
    setSelectedGender(genderId);
    navigation.navigate("OnboardingPhotos", { email, firstName, dateOfBirth, gender: genderId });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom }]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "80%" }]} />
      </View>
      
      <View style={styles.content}>
        <ThemedText style={styles.title}>Which gender best describes you?</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pick the gender that best describes you. You can pick another gender to see more.
        </ThemedText>

        <View style={styles.options}>
          {GENDERS.map((gender) => (
            <Pressable
              key={gender.id}
              style={[
                styles.optionButton,
                selectedGender === gender.id && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelectGender(gender.id)}
              testID={`button-gender-${gender.id}`}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedGender === gender.id && styles.optionTextSelected,
                ]}
              >
                {gender.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.lockRow}>
          <MaterialCommunityIcons name="lock" size={16} color={ObimoColors.textSecondary} />
          <ThemedText style={styles.lockText}>
            You can always update this later. We got you.
          </ThemedText>
        </View>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDot} />
          <View style={styles.progressDotActive} />
          <View style={styles.progressDot} />
        </View>
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
    paddingTop: Spacing["4xl"],
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing["4xl"],
  },
  options: {
    gap: Spacing.lg,
  },
  optionButton: {
    height: 56,
    borderWidth: 1,
    borderColor: ObimoColors.textSecondary,
    borderRadius: BorderRadius["2xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonSelected: {
    borderColor: ObimoColors.primary,
    borderWidth: 2,
  },
  optionText: {
    ...Typography.body,
    fontWeight: "500",
    color: ObimoColors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  footer: {
    paddingBottom: Spacing["2xl"],
    alignItems: "center",
    gap: Spacing.xl,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  lockText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  progressIndicator: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ObimoColors.background,
  },
  progressDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: ObimoColors.primary,
  },
});
