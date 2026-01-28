import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

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

export default function ReplitAuthScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(true);

  const authUrl = `${getApiUrl()}api/login`;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    if (navState.url.includes("/callback") || navState.url.includes("/auth/success")) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }
  };

  const handleOpenInBrowser = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        "obimo://"
      );
      if (result.type === "success") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    } catch (error) {
      console.log("Browser auth error:", error);
    }
  };

  if (Platform.OS === "web") {
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
          <MaterialCommunityIcons name="close" size={20} color={ObimoColors.textSecondary} />
        </Pressable>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shield-account" size={80} color={ObimoColors.textPrimary} />
          </View>

          <ThemedText style={styles.title}>Sign in with Replit</ThemedText>
          <ThemedText style={styles.subtitle}>
            Continue with your Replit account to access Obimo securely.
          </ThemedText>

          <Pressable style={styles.primaryButton} onPress={handleOpenInBrowser}>
            <ThemedText style={styles.primaryButtonText}>Continue with Replit</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.webViewContainer, { paddingTop: insets.top }]}>
      <View style={styles.webViewHeader}>
        <Pressable style={styles.headerCloseButton} onPress={handleClose}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={ObimoColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Sign in with Replit</ThemedText>
        <View style={styles.headerPlaceholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ObimoColors.textPrimary} />
        </View>
      ) : null}

      <WebView
        source={{ uri: authUrl }}
        style={styles.webView}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
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
    marginBottom: Spacing["3xl"],
    maxWidth: 280,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    backgroundColor: ObimoColors.buttonDark,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webViewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerCloseButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.body,
    fontWeight: "600",
    color: ObimoColors.textPrimary,
  },
  headerPlaceholder: {
    width: 32,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  webView: {
    flex: 1,
  },
});
