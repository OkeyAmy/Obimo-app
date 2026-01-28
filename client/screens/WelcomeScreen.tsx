import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { Asset } from "expo-asset";
import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { AuthBottomSheet } from "@/components/AuthBottomSheet";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [authMode, setAuthMode] = useState<"join" | "login">("join");
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const asset = Asset.fromModule(require("../../assets/videos/onboarding.mp4"));
        await asset.downloadAsync();
        setVideoUri(asset.localUri || asset.uri);
      } catch (error) {
        console.log("Video load error:", error);
      }
    }
    loadVideo();
  }, []);

  const player = useVideoPlayer(videoUri || "", (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const handleJoin = () => {
    setAuthMode("join");
    setShowAuthSheet(true);
  };

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthSheet(true);
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
          <View style={styles.videoOverlay} />
        </View>
      ) : (
        <View style={[styles.videoContainer, styles.fallbackBackground]} />
      )}

      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing["3xl"] }]}>
        <View style={styles.logoSection}>
          <Text style={styles.logo}>Obimo</Text>
        </View>

        <View style={styles.bottomSection}>
          <ThemedText style={styles.tagline}>
            A travel app for the curious
          </ThemedText>

          <View style={styles.buttonsContainer}>
            <PrimaryButton onPress={handleJoin} label="Join Obimo" />
            <SecondaryButton onPress={handleLogin} label="Log in" />
          </View>
        </View>
      </View>

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
    backgroundColor: "#000000",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fallbackBackground: {
    backgroundColor: "#1a1a1a",
  },
  video: {
    flex: 1,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing["2xl"],
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: "Fascinate_400Regular",
    fontSize: 56,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bottomSection: {
    alignItems: "center",
  },
  tagline: {
    ...Typography.body,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  buttonsContainer: {
    width: "100%",
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
