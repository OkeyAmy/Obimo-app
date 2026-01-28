import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable, Dimensions, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { AuthBottomSheet } from "@/components/AuthBottomSheet";

const { width, height } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [authMode, setAuthMode] = useState<"join" | "login">("join");

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    heroTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    
    buttonsOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    buttonsTranslateY.value = withDelay(400, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const handleJoin = () => {
    setAuthMode("join");
    setShowAuthSheet(true);
  };

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthSheet(true);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.heroContainer, heroStyle]}>
        <Image
          source={require("../../assets/images/welcome-hero.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={[styles.logoContainer, { paddingTop: insets.top + Spacing.xl }]}>
          <Text style={styles.logo}>Obimo</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, contentStyle]}>
        <ThemedText style={styles.tagline}>
          Connect with fellow nomads
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Find travel companions, share adventures, and explore together.
        </ThemedText>
      </Animated.View>

      <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
        <PrimaryButton onPress={handleJoin} label="Join Obimo" />
        <SecondaryButton onPress={handleLogin} label="Log in" />
      </Animated.View>

      <AuthBottomSheet
        visible={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
        mode={authMode}
      />
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
      testID="button-join"
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
      testID="button-login"
    >
      <ThemedText style={styles.secondaryButtonText}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.background,
  },
  heroContainer: {
    flex: 1,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    fontFamily: "Fascinate_400Regular",
    fontSize: 48,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing.lg,
  },
  tagline: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    textAlign: "center",
  },
  buttonsContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing["3xl"],
    gap: Spacing.md,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.primary,
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
