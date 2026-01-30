import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Pressable, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

interface MapMarkerData {
  id: string;
  locationId: string | null;
  userId: string | null;
  markerType: string;
  title: string;
  description: string | null;
  latitude: string;
  longitude: string;
  iconUrl: string | null;
  color: string | null;
  priority: number | null;
}

const INITIAL_REGION: Region = {
  latitude: 37.0902,
  longitude: -111.0,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

const markerColors: Record<string, string> = {
  location: "#8B5CF6",
  user: "#22C55E",
  meetup: "#F59E0B",
  campsite: "#3B82F6",
  event: "#EF4444",
};

const markerIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  location: "map-marker",
  user: "account-circle",
  meetup: "account-group",
  campsite: "tent",
  event: "calendar-star",
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard");

  const { data: locations = [], isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: markers = [], isLoading: markersLoading } = useQuery<MapMarkerData[]>({
    queryKey: ["/api/markers"],
  });

  const { data: mapProvider } = useQuery({
    queryKey: ["/api/map/provider"],
  });

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 500);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(INITIAL_REGION, 500);
    }
    setSelectedLocation(null);
  };

  const cycleMapType = () => {
    setMapType(current => {
      if (current === "standard") return "satellite";
      if (current === "satellite") return "terrain";
      return "standard";
    });
  };

  const isLoading = locationsLoading || markersLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={ObimoColors.textPrimary} />
        <ThemedText style={styles.loadingText}>Loading map...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled
        pitchEnabled
      >
        {locations.map((location) => (
          <Marker
            key={`loc-${location.id}`}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            onPress={() => handleMarkerPress(location)}
          >
            <View style={[styles.markerContainer, { backgroundColor: markerColors.location }]}>
              <MaterialCommunityIcons 
                name={location.locationType === "campsite" ? "tent" : "map-marker"} 
                size={20} 
                color="#FFFFFF" 
              />
              {location.activeNomadsCount && location.activeNomadsCount > 0 ? (
                <View style={styles.markerBadge}>
                  <ThemedText style={styles.markerBadgeText}>{location.activeNomadsCount}</ThemedText>
                </View>
              ) : null}
            </View>
          </Marker>
        ))}

        {markers.map((marker) => (
          <Marker
            key={`marker-${marker.id}`}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
            title={marker.title}
            description={marker.description || undefined}
          >
            <View style={[styles.smallMarker, { backgroundColor: marker.color || markerColors[marker.markerType] || "#6B7280" }]}>
              <MaterialCommunityIcons 
                name={markerIcons[marker.markerType] || "map-marker"} 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <ThemedText style={styles.headerTitle}>Journey Map</ThemedText>
      </View>

      <View style={[styles.controls, { top: insets.top + 60 }]}>
        <Pressable style={styles.controlButton} onPress={handleRecenter}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color={ObimoColors.textPrimary} />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={cycleMapType}>
          <MaterialCommunityIcons 
            name={mapType === "satellite" ? "satellite-variant" : mapType === "terrain" ? "terrain" : "map"} 
            size={24} 
            color={ObimoColors.textPrimary} 
          />
        </Pressable>
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

      {selectedLocation ? (
        <View style={[styles.locationCard, { bottom: tabBarHeight + Spacing.lg }]}>
          <Pressable style={styles.closeCardButton} onPress={() => setSelectedLocation(null)}>
            <MaterialCommunityIcons name="close" size={20} color={ObimoColors.textSecondary} />
          </Pressable>
          
          {selectedLocation.imageUrl ? (
            <Image
              source={{ uri: selectedLocation.imageUrl }}
              style={styles.locationImage}
              contentFit="cover"
            />
          ) : null}
          
          <View style={styles.locationInfo}>
            <View style={styles.locationHeader}>
              <ThemedText style={styles.locationName}>{selectedLocation.name}</ThemedText>
              {selectedLocation.rating ? (
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                  <ThemedText style={styles.ratingText}>{selectedLocation.rating}</ThemedText>
                </View>
              ) : null}
            </View>
            
            <View style={styles.locationMeta}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="tag" size={14} color={ObimoColors.textSecondary} />
                <ThemedText style={styles.metaText}>{selectedLocation.locationType}</ThemedText>
              </View>
              {selectedLocation.activeNomadsCount && selectedLocation.activeNomadsCount > 0 ? (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="account-group" size={14} color={ObimoColors.textSecondary} />
                  <ThemedText style={styles.metaText}>{selectedLocation.activeNomadsCount} nomads here</ThemedText>
                </View>
              ) : null}
            </View>

            {selectedLocation.description ? (
              <ThemedText style={styles.locationDescription} numberOfLines={2}>
                {selectedLocation.description}
              </ThemedText>
            ) : null}

            {selectedLocation.amenities && selectedLocation.amenities.length > 0 ? (
              <View style={styles.amenitiesContainer}>
                {selectedLocation.amenities.slice(0, 4).map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <ThemedText style={styles.amenityText}>{amenity}</ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.locationActions}>
              <Pressable style={styles.primaryButton}>
                <MaterialCommunityIcons name="directions" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText}>Get Directions</ThemedText>
              </Pressable>
              <Pressable style={styles.secondaryButton}>
                <MaterialCommunityIcons name="bookmark-outline" size={18} color={ObimoColors.textPrimary} />
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
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
    marginTop: Spacing.lg,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
  },
  controls: {
    position: "absolute",
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
  },
  legendContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  markerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  smallMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  locationCard: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeCardButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationImage: {
    width: "100%",
    height: 120,
  },
  locationInfo: {
    padding: Spacing.lg,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
    flex: 1,
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
  locationMeta: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.xs,
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
  locationDescription: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  amenityTag: {
    backgroundColor: ObimoColors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  amenityText: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  locationActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ObimoColors.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: ObimoColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
