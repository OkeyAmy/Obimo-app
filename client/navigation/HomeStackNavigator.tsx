import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { ObimoColors } from "@/constants/theme";

export type HomeStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

function ObimoHeaderTitle() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Obimo</Text>
    </View>
  );
}

export default function HomeStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <ObimoHeaderTitle />,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Fascinate_400Regular",
    fontSize: 24,
    color: ObimoColors.textPrimary,
  },
});
