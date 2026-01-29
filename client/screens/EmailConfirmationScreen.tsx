import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Linking,
  Platform,
  Modal,
  Alert,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import {
  ObimoColors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type EmailConfirmationRouteProp = RouteProp<RootStackParamList, "EmailConfirmation">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EmailConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EmailConfirmationRouteProp>();
  const { email } = route.params;
  
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEmailPicker, setShowEmailPicker] = useState(false);
  const [error, setError] = useState("");
  const [isSendingInitial, setIsSendingInitial] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const contentOpacity = useSharedValue(0);

  // Send verification code on mount
  useEffect(() => {
    const sendInitialCode = async () => {
      try {
        const response = await fetch(`${getApiUrl()}api/auth/email/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Failed to send verification code");
        }
      } catch (err) {
        setError("Failed to send verification code. Please try again.");
      } finally {
        setIsSendingInitial(false);
      }
    };
    
    sendInitialCode();
  }, [email]);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (code.length === 6) {
      verifyCode();
    }
  }, [code]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleChangeEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const verifyCode = async () => {
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    setError("");
    
    try {
      const response = await fetch(`${getApiUrl()}api/auth/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Check if user has already completed onboarding (returning user)
        if (data.user?.onboardingCompleted) {
          // Returning user - go straight to main app
          navigation.reset({
            index: 0,
            routes: [{ name: "Main", params: { email } }],
          });
        } else {
          // New user - start onboarding flow
          navigation.reset({
            index: 0,
            routes: [{ name: "OnboardingLocation", params: { email } }],
          });
        }
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError(data.error || "Invalid code. Please try again.");
        setCode("");
        inputRef.current?.focus();
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Something went wrong. Please try again.");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    setError("");
    
    try {
      const response = await fetch(`${getApiUrl()}api/auth/email/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCountdown(30);
        setCanResend(false);
        if (Platform.OS === "web") {
          alert("A new verification code has been sent to your email.");
        } else {
          Alert.alert("Code sent", "A new verification code has been sent to your email.");
        }
      } else {
        setError(data.error || "Failed to resend code");
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "web") {
      Linking.openURL("https://mail.google.com");
    } else {
      setShowEmailPicker(true);
    }
  };

  const openMailApp = async (scheme: string) => {
    setShowEmailPicker(false);
    try {
      await Linking.openURL(scheme);
    } catch (err) {
      console.log("Could not open email app:", err);
    }
  };

  const handleCodeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
    setError("");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={ObimoColors.textPrimary} />
        </Pressable>
      </View>

      <Animated.View style={[styles.content, contentStyle]}>
        <ThemedText style={styles.title}>
          We just need to verify{"\n"}it's you
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          We sent your code to {email}.{" "}
          <ThemedText style={styles.changeLink} onPress={handleChangeEmail}>
            Change email address.
          </ThemedText>
        </ThemedText>

        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>Code</ThemedText>
          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            placeholder=""
            placeholderTextColor={ObimoColors.textSecondary}
            testID="input-code"
            editable={!isVerifying}
          />
          <View style={styles.inputDivider} />
          
          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : countdown > 0 ? (
            <ThemedText style={styles.countdownText}>
              The code should arrive within {countdown} sec. You might need to check your junk folder.
            </ThemedText>
          ) : (
            <Pressable onPress={handleResend} disabled={isResending}>
              <ThemedText style={styles.resendLink}>
                {isResending ? "Sending..." : "Didn't get the message?"}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <View style={styles.spacer} />

        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <ContinueButton 
            onPress={verifyCode} 
            disabled={code.length !== 6 || isVerifying}
            loading={isVerifying}
          />
          
          <Pressable style={styles.openEmailButton} onPress={handleOpenEmailApp}>
            <ThemedText style={styles.openEmailText}>Open email app</ThemedText>
          </Pressable>
        </View>
      </Animated.View>

      <Modal
        visible={showEmailPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmailPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowEmailPicker(false)}>
          <View style={[styles.emailPickerSheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <View style={styles.sheetHeader}>
              <ThemedText style={styles.sheetTitle}>Open email app</ThemedText>
              <Pressable onPress={() => setShowEmailPicker(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={20} color={ObimoColors.textSecondary} />
              </Pressable>
            </View>
            <ThemedText style={styles.sheetSubtitle}>Which app would you like to open?</ThemedText>
            
            <Pressable style={styles.emailOption} onPress={() => openMailApp("message://")}>
              <MaterialCommunityIcons name="email-outline" size={24} color={ObimoColors.textPrimary} />
              <ThemedText style={styles.emailOptionText}>Mail</ThemedText>
            </Pressable>
            
            <Pressable style={styles.emailOption} onPress={() => openMailApp("googlegmail://")}>
              <MaterialCommunityIcons name="gmail" size={24} color="#EA4335" />
              <ThemedText style={styles.emailOptionText}>Gmail</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function ContinueButton({ onPress, disabled, loading }: { onPress: () => void; disabled: boolean; loading: boolean }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.4 : 1,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.continueButton, animatedStyle]}
      testID="button-continue"
    >
      <ThemedText style={styles.continueButtonText}>
        {loading ? "Verifying..." : "Continue"}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing["3xl"],
  },
  changeLink: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    textDecorationLine: "underline",
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  codeInput: {
    fontSize: 24,
    fontWeight: "500",
    color: ObimoColors.textPrimary,
    paddingVertical: Spacing.md,
    letterSpacing: 8,
  },
  inputDivider: {
    height: 1,
    backgroundColor: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  countdownText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    ...Typography.small,
    color: "#DC2626",
    lineHeight: 20,
  },
  resendLink: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    textDecorationLine: "underline",
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    gap: Spacing.md,
  },
  continueButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.buttonDark,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  openEmailButton: {
    height: Spacing.buttonHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  openEmailText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  emailPickerSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.xl,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  sheetTitle: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSubtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing.xl,
  },
  emailOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  emailOptionText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
  },
});
