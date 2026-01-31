import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Modal, TextInput, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
// @ts-ignore - DateTimePicker is part of Expo Go compatible libraries
import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  photos: string[] | null;
  latitude: string | null;
  longitude: string | null;
  locationPermission: boolean | null;
  notificationPermission: boolean | null;
  onboardingCompleted: boolean | null;
  createdAt: string;
}

const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  
  const [editFirstName, setEditFirstName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const currentUserEmail = "test@example.com";

  const { data: user } = useQuery<UserProfile>({
    queryKey: [`/api/users/email/${currentUserEmail}`],
  });

  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName || "");
      setEditGender(user.gender || "");
      if (user.dateOfBirth) {
        setEditDateOfBirth(new Date(user.dateOfBirth));
      }
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) return;
      return apiRequest("PATCH", `/api/users/${user.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/email/${currentUserEmail}`] });
      setShowEditModal(false);
    },
  });

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );
  };

  const handleSaveProfile = () => {
    const updates: Partial<UserProfile> = {
      firstName: editFirstName,
      gender: editGender,
    };
    if (editDateOfBirth) {
      updates.dateOfBirth = editDateOfBirth.toISOString().split("T")[0];
    }
    updateMutation.mutate(updates);
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const displayName = user?.firstName || "New User";
  const age = calculateAge(user?.dateOfBirth || null);
  const userPhoto = user?.photos && user.photos.length > 0 ? user.photos[0] : defaultAvatar;

  const stats = {
    places: 47,
    connects: 24,
    miles: "8.4K",
    photos: 127,
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.xl,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userPhoto }}
          style={styles.avatar}
          contentFit="cover"
        />
        <ThemedText style={styles.userName}>
          {displayName}{age ? `, ${age}` : ""}
        </ThemedText>
        {user?.gender ? (
          <ThemedText style={styles.userMeta}>{user.gender}</ThemedText>
        ) : null}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statValue}>{stats.places}</ThemedText>
          <ThemedText style={styles.statLabel}>Places</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statValue}>{stats.connects}</ThemedText>
          <ThemedText style={styles.statLabel}>Connects</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statValue}>{stats.miles}</ThemedText>
          <ThemedText style={styles.statLabel}>Miles</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText style={styles.statValue}>{stats.photos}</ThemedText>
          <ThemedText style={styles.statLabel}>Photos</ThemedText>
        </View>
      </View>

      <Pressable style={styles.mapButton}>
        <Feather name="compass" size={18} color={ObimoColors.textPrimary} />
        <ThemedText style={styles.mapButtonText}>View My Journey Map</ThemedText>
        <Feather name="arrow-right" size={16} color={ObimoColors.textSecondary} />
      </Pressable>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <MenuItem 
          icon="user" 
          label="Edit Profile" 
          onPress={() => setShowEditModal(true)}
        />
        <MenuItem 
          icon="target" 
          label="Discovery Preferences" 
          onPress={() => setShowSettingsModal(true)}
        />
        <MenuItem 
          icon="shield" 
          label="Privacy & Location" 
        />
        <MenuItem 
          icon="star" 
          label="Upgrade to Nomad Plus" 
          highlight
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        <MenuItem 
          icon="bell" 
          label="Notifications" 
          onPress={() => setShowNotificationsModal(true)}
        />
        <MenuItem icon="help-circle" label="Help & Support" />
        <MenuItem icon="file-text" label="Privacy Policy" />
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#EF4444" />
        <ThemedText style={styles.logoutText}>Log out</ThemedText>
      </Pressable>

      <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowEditModal(false)}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>
            <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
            <Pressable onPress={handleSaveProfile}>
              <ThemedText style={styles.saveText}>Save</ThemedText>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.editSection}>
              <ThemedText style={styles.editLabel}>Photos</ThemedText>
              <View style={styles.photosGrid}>
                <Pressable style={styles.photoSlot}>
                  {userPhoto ? (
                    <Image source={{ uri: userPhoto }} style={styles.photoImage} contentFit="cover" />
                  ) : (
                    <Feather name="plus" size={24} color={ObimoColors.textSecondary} />
                  )}
                </Pressable>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Pressable key={index} style={styles.photoSlotEmpty}>
                    <Feather name="plus" size={20} color={ObimoColors.textSecondary} />
                  </Pressable>
                ))}
              </View>
              <ThemedText style={styles.photoHint}>Up to 6 photos</ThemedText>
            </View>

            <View style={styles.editSection}>
              <ThemedText style={styles.editLabel}>First Name</ThemedText>
              <TextInput
                style={styles.textInput}
                value={editFirstName}
                onChangeText={setEditFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={ObimoColors.textSecondary}
              />
            </View>

            <View style={styles.editSection}>
              <ThemedText style={styles.editLabel}>Date of Birth</ThemedText>
              <Pressable 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateButtonText}>
                  {editDateOfBirth 
                    ? editDateOfBirth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "Select your birthday"
                  }
                </ThemedText>
                <Feather name="calendar" size={16} color={ObimoColors.textSecondary} />
              </Pressable>
              {showDatePicker ? (
                <DateTimePicker
                  value={editDateOfBirth || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_event: any, date?: Date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (date) setEditDateOfBirth(date);
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                />
              ) : null}
            </View>

            <View style={styles.editSection}>
              <ThemedText style={styles.editLabel}>Gender</ThemedText>
              <View style={styles.genderOptions}>
                {["Man", "Woman", "Non-binary", "Other"].map((option) => (
                  <Pressable 
                    key={option}
                    style={[
                      styles.genderOption,
                      editGender === option ? styles.genderOptionSelected : null,
                    ]}
                    onPress={() => setEditGender(option)}
                  >
                    <ThemedText style={[
                      styles.genderOptionText,
                      editGender === option ? styles.genderOptionTextSelected : null,
                    ]}>
                      {option}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.editSection}>
              <View style={styles.locationInfo}>
                <Feather name="navigation" size={16} color="#22C55E" />
                <ThemedText style={styles.locationText}>
                  Location is automatically tracked
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowSettingsModal(false)}>
              <Feather name="x" size={22} color={ObimoColors.textPrimary} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>Discovery</ThemedText>
            <View style={{ width: 22 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Preferences</ThemedText>
              <SettingsRow label="Maximum Distance" value="50 mi" />
              <SettingsRow label="Age Range" value="18-45" />
              <SettingsRow label="Show Me" value="Everyone" />
            </View>

            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Account</ThemedText>
              <SettingsRow label="Delete Account" textColor="#EF4444" />
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowNotificationsModal(false)}>
              <Feather name="x" size={22} color={ObimoColors.textPrimary} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>Notifications</ThemedText>
            <View style={{ width: 22 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Push Notifications</ThemedText>
              <SettingsRow label="New Matches" toggle defaultValue={user?.notificationPermission || false} />
              <SettingsRow label="Messages" toggle defaultValue={user?.notificationPermission || false} />
              <SettingsRow label="Nearby Companions" toggle defaultValue={user?.notificationPermission || false} />
            </View>

            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Email</ThemedText>
              <SettingsRow label="Weekly Digest" toggle defaultValue={false} />
              <SettingsRow label="Reunion Suggestions" toggle defaultValue={true} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAwareScrollViewCompat>
  );
}

function MenuItem({ 
  icon, 
  label, 
  onPress,
  highlight,
}: { 
  icon: string; 
  label: string; 
  onPress?: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, highlight ? styles.menuIconHighlight : null]}>
          <Feather name={icon as any} size={16} color={highlight ? "#F59E0B" : ObimoColors.textPrimary} />
        </View>
        <ThemedText style={[styles.menuItemLabel, highlight ? styles.menuItemLabelHighlight : null]}>
          {label}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={18} color={ObimoColors.textSecondary} />
    </Pressable>
  );
}

function SettingsRow({ 
  label, 
  value, 
  toggle,
  defaultValue,
  textColor,
}: { 
  label: string; 
  value?: string;
  toggle?: boolean;
  defaultValue?: boolean;
  textColor?: string;
}) {
  const [isOn, setIsOn] = useState(defaultValue || false);

  return (
    <Pressable style={styles.settingsRow}>
      <ThemedText style={[styles.settingsRowLabel, textColor ? { color: textColor } : null]}>
        {label}
      </ThemedText>
      {toggle ? (
        <Pressable 
          style={[styles.toggle, isOn ? styles.toggleOn : null]}
          onPress={() => setIsOn(!isOn)}
        >
          <View style={[styles.toggleKnob, isOn ? styles.toggleKnobOn : null]} />
        </Pressable>
      ) : value ? (
        <View style={styles.settingsRowRight}>
          <ThemedText style={styles.settingsRowValue}>{value}</ThemedText>
          <Feather name="chevron-right" size={16} color={ObimoColors.textSecondary} />
        </View>
      ) : (
        <Feather name="chevron-right" size={16} color={ObimoColors.textSecondary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: Spacing.md,
  },
  userName: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  userMeta: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  statLabel: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  mapButtonText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
    flex: 1,
    marginLeft: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    fontSize: 11,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuIconHighlight: {
    backgroundColor: "#FEF3C7",
  },
  menuItemLabel: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  menuItemLabelHighlight: {
    color: "#B45309",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.body,
    color: "#EF4444",
    fontWeight: "500",
  },
  versionText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  modalTitle: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
  },
  cancelText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  saveText: {
    ...Typography.body,
    color: "#3B82F6",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  editSection: {
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  editLabel: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  photoSlot: {
    width: 100,
    height: 130,
    borderRadius: BorderRadius.lg,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoSlotEmpty: {
    width: 100,
    height: 130,
    borderRadius: BorderRadius.lg,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ObimoColors.textSecondary + "30",
    borderStyle: "dashed",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoHint: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
  },
  textInput: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateButtonText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  genderOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  genderOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: ObimoColors.background,
  },
  genderOptionSelected: {
    backgroundColor: ObimoColors.textPrimary,
  },
  genderOptionText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  genderOptionTextSelected: {
    color: "#FFFFFF",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  locationText: {
    ...Typography.body,
    color: "#166534",
    fontSize: 13,
  },
  settingsSection: {
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  settingsSectionTitle: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  settingsRowLabel: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  settingsRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settingsRowValue: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: ObimoColors.background,
    padding: 2,
  },
  toggleOn: {
    backgroundColor: "#22C55E",
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobOn: {
    transform: [{ translateX: 20 }],
  },
});
