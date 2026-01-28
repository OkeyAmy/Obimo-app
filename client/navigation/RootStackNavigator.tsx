import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SplashScreen from "@/screens/SplashScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import EmailAuthScreen from "@/screens/EmailAuthScreen";
import EmailConfirmationScreen from "@/screens/EmailConfirmationScreen";
import ReplitAuthScreen from "@/screens/ReplitAuthScreen";
import ModalScreen from "@/screens/ModalScreen";
import { ObimoColors } from "@/constants/theme";

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  ReplitAuth: undefined;
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
