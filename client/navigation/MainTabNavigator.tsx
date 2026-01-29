import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";

import ChatsScreen from "@/screens/ChatsScreen";
import NearbyScreen from "@/screens/NearbyScreen";
import LikesScreen from "@/screens/LikesScreen";
import EncountersScreen from "@/screens/EncountersScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { ObimoColors } from "@/constants/theme";

export type MainTabParamList = {
  ChatsTab: undefined;
  NearbyTab: undefined;
  LikesTab: undefined;
  EncountersTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="EncountersTab"
      screenOptions={{
        tabBarActiveTintColor: ObimoColors.textPrimary,
        tabBarInactiveTintColor: ObimoColors.textSecondary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: "#FFFFFF",
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.select({ ios: 90, android: 65 }),
          paddingBottom: Platform.select({ ios: 30, android: 10 }),
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="ChatsTab"
        component={ChatsScreen}
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <MaterialCommunityIcons 
                name={focused ? "chat" : "chat-outline"} 
                size={size} 
                color={color} 
              />
              {focused ? null : (
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NearbyTab"
        component={NearbyScreen}
        options={{
          title: "Nearby",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "map-marker" : "map-marker-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="LikesTab"
        component={LikesScreen}
        options={{
          title: "Likes",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <MaterialCommunityIcons 
                name={focused ? "heart" : "heart-outline"} 
                size={size} 
                color={color} 
              />
              {focused ? null : (
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="EncountersTab"
        component={EncountersScreen}
        options={{
          title: "Encounters",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "cards" : "cards-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "account" : "account-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
});
