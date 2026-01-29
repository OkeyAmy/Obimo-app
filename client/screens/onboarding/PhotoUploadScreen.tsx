import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { apiRequest } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingPhotos">;
type PhotoRouteProp = RouteProp<RootStackParamList, "OnboardingPhotos">;

export default function PhotoUploadScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PhotoRouteProp>();
  const { email, firstName, dateOfBirth, gender } = route.params;

  const [photos, setPhotos] = useState<string[]>([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    setShowSourceModal(false);

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (photos.length === 0) return;
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/profile/complete-onboarding", {
        email,
        firstName,
        dateOfBirth,
        gender,
        photos,
        onboardingCompleted: true,
      });
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPhotos = photos.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Choose your photos</ThemedText>
        <ThemedText style={styles.subtitle}>
          {hasPhotos
            ? "Quick tip: People with at least 4 photos get more matches"
            : "Upload at least 2 photos to get started"}
        </ThemedText>

        <View style={styles.photoGrid}>
          {[0, 1].map((index) => (
            <Pressable
              key={index}
              style={styles.photoSlot}
              onPress={() => {
                if (photos[index]) {
                  removePhoto(index);
                } else {
                  setShowSourceModal(true);
                }
              }}
              testID={`photo-slot-${index}`}
            >
              {photos[index] ? (
                <Image source={{ uri: photos[index] }} style={styles.photo} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={32}
                    color={ObimoColors.textSecondary}
                  />
                  <View style={styles.addIcon}>
                    <MaterialCommunityIcons name="plus" size={16} color={ObimoColors.textSecondary} />
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={hasPhotos ? handleContinue : () => setShowSourceModal(true)}
          disabled={isLoading}
          testID="button-upload-photos"
        >
          <ThemedText style={styles.continueButtonText}>
            {hasPhotos ? "Continue" : "Upload photos"}
          </ThemedText>
        </Pressable>
      </View>

      <Modal
        visible={showSourceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={() => setShowSourceModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color={ObimoColors.textPrimary} />
            </Pressable>

            <ThemedText style={styles.modalTitle}>Upload photos from:</ThemedText>

            <View style={styles.sourceOptions}>
              <Pressable
                style={styles.sourceOption}
                onPress={() => pickImage(false)}
                testID="button-gallery"
              >
                <View style={styles.sourceIconContainer}>
                  <MaterialCommunityIcons name="image-multiple" size={40} color={ObimoColors.primary} />
                </View>
                <ThemedText style={styles.sourceLabel}>Your photos</ThemedText>
              </Pressable>

              <Pressable
                style={styles.sourceOption}
                onPress={() => pickImage(true)}
                testID="button-camera"
              >
                <View style={styles.sourceIconContainer}>
                  <MaterialCommunityIcons name="camera" size={40} color={ObimoColors.primary} />
                </View>
                <ThemedText style={styles.sourceLabel}>Camera</ThemedText>
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
  content: {
    flex: 1,
    paddingTop: Spacing["3xl"],
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing["3xl"],
  },
  photoGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  photoSlot: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addIcon: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: ObimoColors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  closeButton: {
    position: "absolute",
    top: Spacing.lg,
    left: Spacing.lg,
    zIndex: 1,
  },
  modalTitle: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing["3xl"],
  },
  sourceOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing["4xl"],
  },
  sourceOption: {
    alignItems: "center",
  },
  sourceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  sourceLabel: {
    ...Typography.body,
    fontWeight: "500",
    color: ObimoColors.textPrimary,
  },
});
