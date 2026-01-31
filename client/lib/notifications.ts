import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.log("Error getting push token:", error);
    return null;
  }
}

export async function sendNewConnectionNotification(companionName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Connection Request",
      body: `${companionName} wants to connect with you!`,
      data: { type: "connection_request" },
    },
    trigger: null,
  });
}

export async function sendMatchNotification(companionName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "It's a Match!",
      body: `You and ${companionName} are both interested in connecting!`,
      data: { type: "match" },
    },
    trigger: null,
  });
}

export async function sendNearbyCompanionNotification(companionName: string, distance: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Companion Nearby!",
      body: `${companionName} is ${distance} away. Time for a reunion?`,
      data: { type: "nearby_companion" },
    },
    trigger: null,
  });
}

export async function sendMessageNotification(senderName: string, preview: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: senderName,
      body: preview,
      data: { type: "message" },
    },
    trigger: null,
  });
}

export async function sendReunionSuggestionNotification(companionName: string, location: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reunion Opportunity",
      body: `Your paths with ${companionName} might cross near ${location}!`,
      data: { type: "reunion_suggestion" },
    },
    trigger: null,
  });
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
