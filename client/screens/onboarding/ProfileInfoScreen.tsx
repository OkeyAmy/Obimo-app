import React, { useState } from "react";
import { View, StyleSheet, TextInput, Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingProfile">;
type ProfileRouteProp = RouteProp<RootStackParamList, "OnboardingProfile">;

export default function ProfileInfoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProfileRouteProp>();

  const userEmail = route.params?.email;
  
  const [firstName, setFirstName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(0);

  const calculateAge = (): number => {
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isFormValid = (): boolean => {
    if (!firstName.trim()) return false;
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;
    const age = calculateAge();
    if (age < 18 || age > 120) return false;
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      const age = calculateAge();
      setCalculatedAge(age);
      setShowAgeModal(true);
    }
  };

  const handleConfirmAge = () => {
    setShowAgeModal(false);
    const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    navigation.navigate("OnboardingGender", { email: userEmail, firstName, dateOfBirth });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom }]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "60%" }]} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Oh hey! Let's start{"\n"}with an intro.</ThemedText>

        <View style={styles.inputSection}>
          <ThemedText style={styles.label}>Your first name</ThemedText>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder=""
            placeholderTextColor={ObimoColors.textSecondary}
            testID="input-firstname"
          />
        </View>

        <View style={styles.inputSection}>
          <ThemedText style={styles.label}>Your birthday</ThemedText>
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputContainer}>
              <ThemedText style={styles.dateLabel}>Day</ThemedText>
              <TextInput
                style={styles.dateInput}
                value={day}
                onChangeText={(text) => setDay(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
                testID="input-day"
              />
            </View>
            <View style={styles.dateInputContainer}>
              <ThemedText style={styles.dateLabel}>Month</ThemedText>
              <TextInput
                style={styles.dateInput}
                value={month}
                onChangeText={(text) => setMonth(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
                testID="input-month"
              />
            </View>
            <View style={[styles.dateInputContainer, styles.yearInput]}>
              <ThemedText style={styles.dateLabel}>Year</ThemedText>
              <TextInput
                style={styles.dateInput}
                value={year}
                onChangeText={(text) => setYear(text.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
                testID="input-year"
              />
            </View>
          </View>
          <ThemedText style={styles.hint}>It's never too early to count down</ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid()}
          testID="button-next"
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <Modal
        visible={showAgeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>You're {calculatedAge}</ThemedText>
            <ThemedText style={styles.modalDescription}>
              Make sure this is your correct age as you can't change this later.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowAgeModal(false)}>
                <ThemedText style={styles.modalButtonCancel}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleConfirmAge}>
                <ThemedText style={styles.modalButtonConfirm}>Confirm</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    ...Typography.h1,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing["4xl"],
  },
  inputSection: {
    marginBottom: Spacing["3xl"],
  },
  label: {
    ...Typography.body,
    fontWeight: "500",
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: ObimoColors.textSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    color: ObimoColors.textPrimary,
  },
  dateInputRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateInputContainer: {
    flex: 1,
  },
  yearInput: {
    flex: 1.5,
  },
  dateLabel: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateInput: {
    height: 56,
    borderWidth: 1,
    borderColor: ObimoColors.textSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    color: ObimoColors.textPrimary,
    textAlign: "center",
  },
  hint: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: "flex-end",
    paddingBottom: Spacing["2xl"],
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ObimoColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: ObimoColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing["2xl"],
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  modalDescription: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing["3xl"],
  },
  modalButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  modalButtonCancel: {
    ...Typography.body,
    fontWeight: "600",
    color: "#0066CC",
  },
  modalButtonConfirm: {
    ...Typography.body,
    fontWeight: "600",
    color: "#0066CC",
  },
});
