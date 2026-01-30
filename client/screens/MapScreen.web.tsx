import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

interface Location {
  id: string;
  name: string;
  locationType: string;
  latitude: string;
  longitude: string;
  description: string | null;
  amenities: string[] | null;
  rating: string | null;
  imageUrl: string | null;
  isPopular: boolean | null;
  activeNomadsCount: number | null;
}

const markerColors: Record<string, string> = {
  location: "#8B5CF6",
  user: "#22C55E",
  meetup: "#F59E0B",
  campsite: "#3B82F6",
  event: "#EF4444",
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const renderLocationCard = ({ item }: { item: Location }) => (
    <Pressable style={styles.locationListCard} onPress={() => setSelectedLocation(item)}>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.locationListImage}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.locationListImage, styles.locationListImagePlaceholder]}>
          <MaterialCommunityIcons name="image-off" size={32} color={ObimoColors.textSecondary} />
        </View>
      )}
      
      <View style={styles.locationListInfo}>
        <View style={styles.locationListHeader}>
          <ThemedText style={styles.locationListName}>{item.name}</ThemedText>
          {item.rating ? (
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
            </View>
          ) : null}
        </View>
        
        <View style={styles.locationListMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="tag" size={12} color={ObimoColors.textSecondary} />
            <ThemedText style={styles.metaText}>{item.locationType}</ThemedText>
          </View>
          {item.activeNomadsCount && item.activeNomadsCount > 0 ? (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="account-group" size={12} color={ObimoColors.textSecondary} />
              <ThemedText style={styles.metaText}>{item.activeNomadsCount} nomads</ThemedText>
            </View>
          ) : null}
        </View>

        {item.description ? (
          <ThemedText style={styles.locationListDescription} numberOfLines={2}>
            {item.description}
          </ThemedText>
        ) : null}

        {item.amenities && item.amenities.length > 0 ? (
          <View style={styles.amenitiesRow}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <ThemedText style={styles.amenityChipText}>{amenity}</ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ThemedText style={styles.loadingText}>Loading locations...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Journey Map</ThemedText>
      </View>

      <View style={styles.webNotice}>
        <MaterialCommunityIcons name="cellphone" size={24} color="#3B82F6" />
        <ThemedText style={styles.webNoticeText}>
          For the full interactive map experience, open this app in Expo Go on your phone
        </ThemedText>
      </View>

      <View style={styles.legendContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendContent}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.location }]} />
            <ThemedText style={styles.legendText}>Hotspots</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.user }]} />
            <ThemedText style={styles.legendText}>Nomads</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.meetup }]} />
            <ThemedText style={styles.legendText}>Meetups</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.campsite }]} />
            <ThemedText style={styles.legendText}>Campsites</ThemedText>
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.locationList, { paddingBottom: tabBarHeight + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ObimoColors.surface,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: ObimoColors.surface,
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  webNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  webNoticeText: {
    ...Typography.body,
    color: "#1E40AF",
    flex: 1,
  },
  legendContainer: {
    marginBottom: Spacing.lg,
  },
  legendContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "600",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  locationList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  locationListCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: Spacing.lg,
  },
  locationListImage: {
    width: "100%",
    height: 150,
  },
  locationListImagePlaceholder: {
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  locationListInfo: {
    padding: Spacing.lg,
  },
  locationListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationListName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    flex: 1,
  },
  locationListMeta: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  locationListDescription: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  amenityChip: {
    backgroundColor: ObimoColors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  amenityChipText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
});
