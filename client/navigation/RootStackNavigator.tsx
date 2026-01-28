import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SplashScreen from "@/screens/SplashScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import EmailAuthScreen from "@/screens/EmailAuthScreen";
import EmailConfirmationScreen from "@/screens/EmailConfirmationScreen";
import ModalScreen from "@/screens/ModalScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { ObimoColors } from "@/constants/theme";

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  Main: undefined;
  Modal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          backgroundColor: ObimoColors.background,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailAuth"
        component={EmailAuthScreen}
        options={{
          headerTitle: "",
          headerBackTitle: "",
          headerTransparent: true,
          headerTintColor: ObimoColors.textPrimary,
        }}
      />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          presentation: "modal",
          headerTitle: "Modal",
        }}
      />
    </Stack.Navigator>
  );
}
