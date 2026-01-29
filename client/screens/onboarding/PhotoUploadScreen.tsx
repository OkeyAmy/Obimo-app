import React, { useState, useRef } from "react";
import { View, StyleSheet, Pressable, Modal, Image, ScrollView, Dimensions, ActivityIndicator } from "react-native";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PHOTO_WIDTH = (SCREEN_WIDTH - Spacing.xl * 2 - Spacing.md) / 2;
const PHOTO_HEIGHT = PHOTO_WIDTH * (4 / 3);

export default function PhotoUploadScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PhotoRouteProp>();
  const { email, firstName, dateOfBirth, gender } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

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
        const newPhotos = [...photos, result.assets[0].uri];
        setPhotos(newPhotos);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
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
        const newPhotos = [...photos, result.assets[0].uri];
        setPhotos(newPhotos);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
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
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "100%" }]} />
      </View>
      
      <View style={styles.content}>
        <ThemedText style={styles.title}>Choose your photos</ThemedText>
        <ThemedText style={styles.subtitle}>
          Quick tip: People with at least 4 photos get more matches
        </ThemedText>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScrollContainer}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoSlotWrapper}>
              <Pressable
                style={styles.photoSlot}
                onPress={() => removePhoto(index)}
                testID={`photo-slot-${index}`}
              >
                <Image source={{ uri: photo }} style={styles.photo} />
                <View style={styles.removeButton}>
                  <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          ))}
          
          <View style={styles.photoSlotWrapper}>
            <Pressable
              style={styles.photoSlot}
              onPress={() => setShowSourceModal(true)}
              testID="photo-slot-add"
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={32}
                color={ObimoColors.textSecondary}
              />
              <View style={styles.addIcon}>
                <MaterialCommunityIcons name="plus" size={16} color={ObimoColors.textSecondary} />
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, (!hasPhotos || isLoading) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!hasPhotos || isLoading}
          testID="button-upload-photos"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          )}
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
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing["3xl"],
  },
  photoScrollContainer: {
    paddingRight: Spacing.xl,
    gap: Spacing.md,
  },
  photoSlotWrapper: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
  },
  photoSlot: {
    width: "100%",
    height: "100%",
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
  removeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
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
