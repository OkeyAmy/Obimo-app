import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SplashScreen from "@/screens/SplashScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import EmailAuthScreen from "@/screens/EmailAuthScreen";
import EmailConfirmationScreen from "@/screens/EmailConfirmationScreen";
import ReplitAuthScreen from "@/screens/ReplitAuthScreen";
import ModalScreen from "@/screens/ModalScreen";
import LocationPermissionScreen from "@/screens/onboarding/LocationPermissionScreen";
import NotificationPermissionScreen from "@/screens/onboarding/NotificationPermissionScreen";
import ProfileInfoScreen from "@/screens/onboarding/ProfileInfoScreen";
import GenderScreen from "@/screens/onboarding/GenderScreen";
import PhotoUploadScreen from "@/screens/onboarding/PhotoUploadScreen";
import { ObimoColors } from "@/constants/theme";

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  ReplitAuth: undefined;
  OnboardingLocation: undefined;
  OnboardingNotification: undefined;
  OnboardingProfile: undefined;
  OnboardingGender: { firstName: string; dateOfBirth: string };
  OnboardingPhotos: { firstName: string; dateOfBirth: string; gender: string };
  Main: undefined;
  Modal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: ObimoColors.background,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="EmailAuth"
        component={EmailAuthScreen}
      />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="ReplitAuth"
        component={ReplitAuthScreen}
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="OnboardingLocation"
        component={LocationPermissionScreen}
      />
      <Stack.Screen
        name="OnboardingNotification"
        component={NotificationPermissionScreen}
      />
      <Stack.Screen
        name="OnboardingProfile"
        component={ProfileInfoScreen}
      />
      <Stack.Screen
        name="OnboardingGender"
        component={GenderScreen}
      />
      <Stack.Screen
        name="OnboardingPhotos"
        component={PhotoUploadScreen}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
      />
      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
