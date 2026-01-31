import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

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
  const [editBio, setEditBio] = useState("");

  const currentUserEmail = "test@example.com";

  const { data: user } = useQuery<UserProfile>({
    queryKey: [`/api/users/email/${currentUserEmail}`],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) return;
      return apiRequest("PATCH", `/api/users/${user.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/email"] });
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

  const handleOpenEdit = () => {
    setEditFirstName(user?.firstName || "");
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    updateMutation.mutate({ firstName: editFirstName });
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

  const displayName = user?.firstName || "Nomad User";
  const age = calculateAge(user?.dateOfBirth || null);
  const userPhoto = user?.photos && user.photos.length > 0 ? user.photos[0] : defaultAvatar;

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
        <Image
          source={{ uri: userPhoto }}
          style={styles.avatar}
          contentFit="cover"
        />
        <ThemedText style={styles.userName}>
          {displayName}{age ? `, ${age}` : ""}
        </ThemedText>
        <ThemedText style={styles.userEmail}>{user?.email || ""}</ThemedText>
        
        <Pressable style={styles.editProfileButton} onPress={handleOpenEdit}>
          <Feather name="edit-2" size={16} color="#FFFFFF" />
          <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        
        <MenuItem 
          icon="user" 
          label="Edit Profile" 
          onPress={handleOpenEdit}
        />
        <MenuItem 
          icon="settings" 
          label="Settings" 
          onPress={() => setShowSettingsModal(true)}
        />
        <MenuItem 
          icon="bell" 
          label="Notifications" 
          onPress={() => setShowNotificationsModal(true)}
        />
        <MenuItem icon="shield" label="Privacy" />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        
        <MenuItem icon="help-circle" label="Help & Support" />
        <MenuItem icon="file-text" label="Terms of Service" />
        <MenuItem icon="lock" label="Privacy Policy" />
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#EF4444" />
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
              <Feather name="x" size={24} color={ObimoColors.textPrimary} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
            <Pressable onPress={handleSaveProfile}>
              <ThemedText style={styles.saveText}>Save</ThemedText>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.editSection}>
              <ThemedText style={styles.editLabel}>Bio</ThemedText>
              <ThemedText style={styles.editHint}>Write a fun and punchy intro.</ThemedText>
              <TextInput
                style={styles.bioInput}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Hi there!"
                placeholderTextColor={ObimoColors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.editSection}>
              <ThemedText style={styles.editSectionTitle}>About you</ThemedText>
              
              <EditRow icon="briefcase" label="Work" value="Add" />
              <EditRow icon="book" label="Education" value="Add" />
              <EditRow icon="user" label="Gender" value={user?.gender || "Add"} />
              <EditRow icon="map-pin" label="Location" value="Nearby" />
              <EditRow icon="home" label="Hometown" value="Add" />
            </View>

            <View style={styles.editSection}>
              <ThemedText style={styles.editSectionTitle}>More about you</ThemedText>
              <ThemedText style={styles.editHint}>Cover the things most people are curious about.</ThemedText>
              
              <EditRow icon="ruler" label="Height" value="Add" />
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
              <Feather name="x" size={24} color={ObimoColors.textPrimary} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>Settings</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Account</ThemedText>
              <SettingsRow label="Email" value={user?.email || ""} />
              <SettingsRow label="Phone Number" value="Not set" />
              <SettingsRow label="Change Password" />
            </View>

            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Discovery</ThemedText>
              <SettingsRow label="Location" value="Enabled" />
              <SettingsRow label="Maximum Distance" value="50 mi" />
              <SettingsRow label="Age Range" value="18-45" />
            </View>

            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Data & Privacy</ThemedText>
              <SettingsRow label="Manage Data" />
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
              <Feather name="x" size={24} color={ObimoColors.textPrimary} />
            </Pressable>
            <ThemedText style={styles.modalTitle}>Notifications</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Push Notifications</ThemedText>
              <SettingsRow label="New Matches" toggle defaultValue={true} />
              <SettingsRow label="Messages" toggle defaultValue={true} />
              <SettingsRow label="Likes" toggle defaultValue={true} />
              <SettingsRow label="Super Likes" toggle defaultValue={true} />
            </View>

            <View style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>Email Notifications</ThemedText>
              <SettingsRow label="Weekly Digest" toggle defaultValue={false} />
              <SettingsRow label="Promotions" toggle defaultValue={false} />
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
  onPress 
}: { 
  icon: string; 
  label: string; 
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Feather name={icon as any} size={18} color={ObimoColors.textPrimary} />
        </View>
        <ThemedText style={styles.menuItemLabel}>{label}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={ObimoColors.textSecondary} />
    </Pressable>
  );
}

function EditRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: string; 
  label: string; 
  value?: string;
}) {
  return (
    <Pressable style={styles.editRow}>
      <View style={styles.editRowLeft}>
        <Feather name={icon as any} size={18} color={ObimoColors.textSecondary} />
        <ThemedText style={styles.editRowLabel}>{label}</ThemedText>
      </View>
      <View style={styles.editRowRight}>
        <ThemedText style={styles.editRowValue}>{value}</ThemedText>
        <Feather name="chevron-right" size={18} color={ObimoColors.textSecondary} />
      </View>
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
          <Feather name="chevron-right" size={18} color={ObimoColors.textSecondary} />
        </View>
      ) : (
        <Feather name="chevron-right" size={18} color={ObimoColors.textSecondary} />
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
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
  },
  userName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ObimoColors.textPrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  editProfileText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
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
    backgroundColor: ObimoColors.background,
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
    color: "#EF4444",
    fontWeight: "600",
  },
  versionText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.lg,
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
    ...Typography.h3,
    color: ObimoColors.textPrimary,
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
    ...Typography.h4,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  editHint: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing.md,
  },
  editSectionTitle: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  bioInput: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    backgroundColor: ObimoColors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 100,
    textAlignVertical: "top",
  },
  editRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ObimoColors.background,
  },
  editRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  editRowLabel: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  editRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  editRowValue: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  settingsSection: {
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ObimoColors.background,
  },
  settingsSectionTitle: {
    ...Typography.h4,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.lg,
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
    gap: Spacing.xs,
  },
  settingsRowValue: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: ObimoColors.background,
    padding: 2,
  },
  toggleOn: {
    backgroundColor: "#22C55E",
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobOn: {
    transform: [{ translateX: 20 }],
  },
});
