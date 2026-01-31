import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Polyline } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { ObimoColors, Spacing, Typography, BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface LocationData {
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

const INITIAL_REGION: Region = {
  latitude: 37.0902,
  longitude: -111.0,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">("standard");
  const [is3DMode, setIs3DMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [heading, setHeading] = useState(0);

  const { data: locations = [], isLoading } = useQuery<LocationData[]>({
    queryKey: ["/api/locations"],
  });

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      headingSubscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading);
      });
    };

    startTracking();

    return () => {
      locationSubscription?.remove();
      headingSubscription?.remove();
    };
  }, []);

  const handleMarkerPress = (location: LocationData) => {
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
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: userLocation,
        heading: heading,
        pitch: is3DMode ? 60 : 0,
        zoom: 15,
      }, { duration: 500 });
    }
  };

  const toggle3DMode = () => {
    setIs3DMode(prev => !prev);
    if (mapRef.current) {
      mapRef.current.animateCamera({
        pitch: is3DMode ? 0 : 60,
      }, { duration: 300 });
    }
  };

  const cycleMapType = () => {
    setMapType(current => {
      if (current === "standard") return "satellite";
      if (current === "satellite") return "hybrid";
      return "standard";
    });
  };

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
        camera={{
          center: userLocation || INITIAL_REGION,
          pitch: is3DMode ? 60 : 0,
          heading: heading,
          zoom: 12,
          altitude: 1000,
        }}
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
            <View style={styles.markerContainer}>
              {location.imageUrl ? (
                <Image
                  source={{ uri: location.imageUrl }}
                  style={styles.markerImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.markerPlaceholder}>
                  <Feather name="map-pin" size={16} color="#FFFFFF" />
                </View>
              )}
              {location.activeNomadsCount && location.activeNomadsCount > 0 ? (
                <View style={styles.markerBadge}>
                  <ThemedText style={styles.markerBadgeText}>{location.activeNomadsCount}</ThemedText>
                </View>
              ) : null}
            </View>
          </Marker>
        ))}

        {userLocation ? (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userMarker}>
              <View style={[styles.userMarkerInner, { transform: [{ rotate: `${heading}deg` }] }]}>
                <View style={styles.userMarkerArrow} />
              </View>
            </View>
          </Marker>
        ) : null}
      </MapView>

      <View style={[styles.controlsRight, { top: insets.top + Spacing.lg }]}>
        <Pressable style={styles.controlButton} onPress={cycleMapType}>
          <Feather name="layers" size={22} color={ObimoColors.textPrimary} />
        </Pressable>
        <Pressable 
          style={[styles.controlButton, is3DMode ? styles.controlButtonActive : null]} 
          onPress={toggle3DMode}
        >
          <ThemedText style={[styles.controlButtonText, is3DMode ? styles.controlButtonTextActive : null]}>
            {is3DMode ? "2D" : "3D"}
          </ThemedText>
        </Pressable>
      </View>

      <Pressable 
        style={[styles.recenterButton, { bottom: tabBarHeight + (selectedLocation ? 240 : 100) }]} 
        onPress={handleRecenter}
      >
        <Feather name="navigation" size={22} color={ObimoColors.textPrimary} />
      </Pressable>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContent}
        >
          <Pressable style={[styles.filterChip, styles.filterChipActive]}>
            <ThemedText style={[styles.filterChipText, styles.filterChipTextActive]}>All</ThemedText>
          </Pressable>
          <Pressable style={styles.filterChip}>
            <Feather name="sun" size={14} color={ObimoColors.textPrimary} />
            <ThemedText style={styles.filterChipText}>Parks</ThemedText>
          </Pressable>
          <Pressable style={styles.filterChip}>
            <Feather name="home" size={14} color={ObimoColors.textPrimary} />
            <ThemedText style={styles.filterChipText}>Campsites</ThemedText>
          </Pressable>
          <Pressable style={styles.filterChip}>
            <Feather name="users" size={14} color={ObimoColors.textPrimary} />
            <ThemedText style={styles.filterChipText}>Nomads</ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {selectedLocation ? (
        <View style={[styles.locationCard, { bottom: tabBarHeight + Spacing.lg }]}>
          <Pressable style={styles.closeCardButton} onPress={() => setSelectedLocation(null)}>
            <Feather name="x" size={20} color={ObimoColors.textSecondary} />
          </Pressable>
          
          <ThemedText style={styles.locationName}>{selectedLocation.name}</ThemedText>
          <ThemedText style={styles.locationType}>{selectedLocation.locationType}</ThemedText>
          
          {selectedLocation.imageUrl ? (
            <Image
              source={{ uri: selectedLocation.imageUrl }}
              style={styles.locationImage}
              contentFit="cover"
            />
          ) : null}
          
          {selectedLocation.description ? (
            <ThemedText style={styles.locationDescription} numberOfLines={2}>
              {selectedLocation.description}
            </ThemedText>
          ) : null}

          <Pressable style={styles.addToRouteButton}>
            <Feather name="plus-circle" size={18} color="#FFFFFF" />
            <ThemedText style={styles.addToRouteText}>Add to route</ThemedText>
          </Pressable>
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
  controlsRight: {
    position: "absolute",
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonActive: {
    backgroundColor: ObimoColors.textPrimary,
  },
  controlButtonText: {
    ...Typography.body,
    fontWeight: "700",
    color: ObimoColors.textPrimary,
  },
  controlButtonTextActive: {
    color: "#FFFFFF",
  },
  recenterButton: {
    position: "absolute",
    left: Spacing.lg,
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
  filtersContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: ObimoColors.textPrimary,
  },
  filterChipText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  markerContainer: {
    position: "relative",
  },
  markerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#22C55E",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  markerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userMarker: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#3B82F6",
    transform: [{ rotate: "180deg" }],
  },
  locationCard: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeCardButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ObimoColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  locationName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  locationType: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
    marginTop: 2,
  },
  locationImage: {
    width: "100%",
    height: 120,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  locationDescription: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
  },
  addToRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22C55E",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  addToRouteText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
