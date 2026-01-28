import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EmailAuthScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const inputRef = useRef<TextInput>(null);

  const isValidEmail = email.length > 0 && email.includes("@") && email.includes(".");

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    contentTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleNext = () => {
    if (isValidEmail) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Keyboard.dismiss();
      navigation.navigate("EmailConfirmation", { email });
    }
  };

  const handleClear = () => {
    setEmail("");
    inputRef.current?.focus();
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View style={[styles.content, contentStyle]}>
        <ThemedText style={styles.title}>
          Where can we send your{"\n"}confirmation link?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter a real email address. Don't worry — no one else will see it.
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={ObimoColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            testID="input-email"
          />
          {email.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <Feather name="x" size={18} color={ObimoColors.textSecondary} />
            </Pressable>
          )}
        </View>
        <View style={styles.inputDivider} />
      </Animated.View>

      <View style={styles.buttonContainer}>
        <NextButton onPress={handleNext} disabled={!isValidEmail} />
      </View>
    </KeyboardAwareScrollView>
  );
}

function NextButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
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
      style={[styles.nextButton, animatedStyle]}
      testID="button-next"
    >
      <ThemedText style={styles.nextButtonText}>Next</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginBottom: Spacing["3xl"],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: ObimoColors.textPrimary,
    paddingVertical: Spacing.md,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  inputDivider: {
    height: 1,
    backgroundColor: ObimoColors.textPrimary,
  },
  buttonContainer: {
    marginTop: Spacing["4xl"],
  },
  nextButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.textPrimary,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
