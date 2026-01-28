import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

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

export default function EmailConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationProp>();
  const { email } = route.params;

  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    contentScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    
    iconRotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withRepeat(
        withSequence(
          withTiming(5, { duration: 200 }),
          withTiming(-5, { duration: 200 })
        ),
        2,
        true
      ),
      withTiming(0, { duration: 100 })
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleOpenEmailApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === "ios") {
      try {
        await Linking.openURL("message://");
      } catch {
        try {
          await Linking.openURL("googlegmail://");
        } catch {
          console.log("Could not open email app");
        }
      }
    } else if (Platform.OS === "android") {
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
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
    >
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Feather name="x" size={24} color={ObimoColors.textSecondary} />
      </Pressable>

      <Animated.View style={[styles.content, contentStyle]}>
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Image
            source={require("../../assets/images/email-sent.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </Animated.View>

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
    backgroundColor: ObimoColors.backgroundSecondary,
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
  illustration: {
    width: 180,
    height: 180,
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
    fontWeight: "600",
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.textPrimary,
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
