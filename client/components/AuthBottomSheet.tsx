import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import {
  ObimoColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const SHEET_HEIGHT = 420;

interface AuthBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  mode: "join" | "login";
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AuthBottomSheet({ visible, onClose, mode }: AuthBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const close = useCallback(() => {
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 300, easing: Easing.inOut(Easing.cubic) });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(onClose, 300);
  }, [onClose, translateY, backdropOpacity]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
    }
  }, [visible, translateY, backdropOpacity]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, context.value.y + event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > SHEET_HEIGHT * 0.3 || event.velocityY > 500) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleEmailPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    close();
    setTimeout(() => {
      navigation.navigate("EmailAuth");
    }, 350);
  };

  const handleApplePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    close();
    setTimeout(() => {
      navigation.navigate("ReplitAuth");
    }, 350);
  };

  const handleGooglePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    close();
    setTimeout(() => {
      navigation.navigate("ReplitAuth");
    }, 350);
  };

  const handleCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    close();
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Spacing.lg },
              sheetStyle,
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <ThemedText style={styles.title}>
              {mode === "join" ? "Join Obimo" : "Log in"}
            </ThemedText>

            <ThemedText style={styles.termsText}>
              By continuing, you accept our{" "}
              <ThemedText style={styles.linkText}>Terms of Use</ThemedText>. Please also
              see our{" "}
              <ThemedText style={styles.linkText}>Privacy Policy</ThemedText>.
            </ThemedText>

            <View style={styles.buttonsContainer}>
              <AuthButton
                icon="email-outline"
                label="Email"
                onPress={handleEmailPress}
                variant="primary"
              />
              <AuthButton
                icon="apple"
                label="Apple"
                onPress={handleApplePress}
                variant="secondary"
              />
              <AuthButton
                icon="google"
                label="Google"
                onPress={handleGooglePress}
                variant="secondary"
              />
              <AuthButton
                label="Cancel"
                onPress={handleCancelPress}
                variant="cancel"
              />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

interface AuthButtonProps {
  icon?: string;
  label: string;
  onPress: () => void;
  variant: "primary" | "secondary" | "cancel";
}

function AuthButton({ icon, label, onPress, variant }: AuthButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryAuthButton;
      case "secondary":
        return styles.secondaryAuthButton;
      case "cancel":
        return styles.cancelAuthButton;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return ObimoColors.textPrimary;
      case "cancel":
        return ObimoColors.textSecondary;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return ObimoColors.textPrimary;
      case "cancel":
        return ObimoColors.textSecondary;
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[getButtonStyle(), animatedStyle]}
      testID={`button-auth-${label.toLowerCase()}`}
    >
      <View style={styles.authButtonContent}>
        {icon ? (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon as any} size={22} color={getIconColor()} />
          </View>
        ) : null}
        <ThemedText style={[styles.authButtonText, { color: getTextColor() }]}>
          {label}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  sheet: {
    backgroundColor: ObimoColors.surface,
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    paddingHorizontal: Spacing["2xl"],
    ...Shadows.bottomSheet,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  title: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  termsText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: 20,
  },
  linkText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
    textDecorationLine: "underline",
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  primaryAuthButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.buttonDark,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryAuthButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelAuthButton: {
    height: Spacing.buttonHeight,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  authButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    left: -60,
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
