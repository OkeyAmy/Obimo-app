import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  ActionSheetIOS,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import {
  ObimoColors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteType = RouteProp<RootStackParamList, "EmailConfirmation">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LinkIcon() {
  return (
    <Svg width={180} height={120} viewBox="0 0 180 120">
      <Circle
        cx="55"
        cy="60"
        r="40"
        stroke="#2D3142"
        strokeWidth="4"
        fill="none"
      />
      <Circle
        cx="125"
        cy="60"
        r="40"
        stroke="#2D3142"
        strokeWidth="4"
        fill="none"
      />
    </Svg>
  );
}

export default function EmailConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationProp>();
  const { email } = route.params;

  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    contentScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const handleOpenEmailApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Open mail app",
          message: "Which app would you like to open?",
          options: ["Cancel", "Mail", "Gmail"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            try {
              await Linking.openURL("message://");
            } catch {
              console.log("Could not open Mail app");
            }
          } else if (buttonIndex === 2) {
            try {
              await Linking.openURL("googlegmail://");
            } catch {
              console.log("Could not open Gmail app");
            }
          }
        }
      );
    } else {
      try {
        await Linking.openURL("mailto:");
      } catch {
        console.log("Could not open email app");
      }
    }
  };

  const handleDidntGetIt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClose = () => {
    navigation.navigate("Welcome");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["4xl"],
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
    >
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Feather name="x" size={20} color={ObimoColors.textSecondary} />
      </Pressable>

      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.iconContainer}>
          <LinkIcon />
        </View>

        <ThemedText style={styles.title}>You're almost there</ThemedText>
        <ThemedText style={styles.subtitle}>
          We've sent an email to{"\n"}
          <ThemedText style={styles.emailText}>{email}</ThemedText>. Check your inbox
          and tap the link we sent.
        </ThemedText>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <PrimaryButton onPress={handleOpenEmailApp} label="Open email app" />
        <SecondaryButton onPress={handleDidntGetIt} label="I didn't get it" />
      </View>
    </View>
  );
}

function PrimaryButton({ onPress, label }: { onPress: () => void; label: string }) {
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

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.primaryButton, animatedStyle]}
      testID="button-open-email"
    >
      <ThemedText style={styles.primaryButtonText}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

function SecondaryButton({ onPress, label }: { onPress: () => void; label: string }) {
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

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.secondaryButton, animatedStyle]}
      testID="button-didnt-get-it"
    >
      <ThemedText style={styles.secondaryButtonText}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
    paddingHorizontal: Spacing["2xl"],
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: Spacing.xl,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: Spacing["3xl"],
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  emailText: {
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.buttonDark,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    height: Spacing.buttonHeight,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: ObimoColors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
  },
});
