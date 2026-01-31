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

interface VisitedPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visitedAt: string;
  duration: number;
  photos: string[];
  notes: string;
  companionsMet: string[];
}

const INITIAL_REGION: Region = {
  latitude: 37.0902,
  longitude: -111.0,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

const SAMPLE_VISITED_PLACES: VisitedPlace[] = [
  {
    id: "1",
    name: "Moab, Utah",
    latitude: 38.5733,
    longitude: -109.5498,
    visitedAt: "2025-10-15",
    duration: 5,
    photos: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400"],
    notes: "Best sunrise spot! Met amazing people.",
    companionsMet: ["Chris", "Jamie"],
  },
  {
    id: "2",
    name: "Sedona, Arizona",
    latitude: 34.8697,
    longitude: -111.7610,
    visitedAt: "2025-11-02",
    duration: 3,
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    notes: "Campfire under the stars",
    companionsMet: ["Alex"],
  },
  {
    id: "3",
    name: "Grand Canyon, Arizona",
    latitude: 36.0544,
    longitude: -112.1401,
    visitedAt: "2025-09-20",
    duration: 2,
    photos: [],
    notes: "",
    companionsMet: [],
  },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<MapView>(null);
  const [selectedPlace, setSelectedPlace] = useState<VisitedPlace | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "mine" | "companions" | "wishlist">("all");

  const visitedPlaces = SAMPLE_VISITED_PLACES;
  
  const travelStats = {
    placesVisited: 47,
    milesTraveled: 8432,
    companionsMade: 24,
    memoriesCaptured: 127,
    statesExplored: 12,
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getLocation();
  }, []);

  const handleMarkerPress = (place: VisitedPlace) => {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 500);
    }
  };

  const handleRecenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }, 500);
    }
  };

  const routeCoordinates = visitedPlaces.map(place => ({
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {visitedPlaces.map((place, index) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => handleMarkerPress(place)}
          >
            <View style={styles.visitedMarker}>
              <Feather name="map-pin" size={20} color="#FFFFFF" />
            </View>
          </Marker>
        ))}

        {routeCoordinates.length > 1 ? (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#3B82F6"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        ) : null}
      </MapView>

      <View style={[styles.header, { top: insets.top + Spacing.md }]}>
        <ThemedText style={styles.headerTitle}>My Journey</ThemedText>
        <Pressable style={styles.addButton}>
          <Feather name="plus" size={20} color={ObimoColors.textPrimary} />
          <ThemedText style={styles.addButtonText}>Add Place</ThemedText>
        </Pressable>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <Pressable 
            style={[styles.filterChip, activeFilter === "all" ? styles.filterChipActive : null]}
            onPress={() => setActiveFilter("all")}
          >
            <ThemedText style={[styles.filterChipText, activeFilter === "all" ? styles.filterChipTextActive : null]}>
              My Places
            </ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.filterChip, activeFilter === "companions" ? styles.filterChipActive : null]}
            onPress={() => setActiveFilter("companions")}
          >
            <Feather 
              name="users" 
              size={14} 
              color={activeFilter === "companions" ? "#FFFFFF" : ObimoColors.textPrimary} 
            />
            <ThemedText style={[styles.filterChipText, activeFilter === "companions" ? styles.filterChipTextActive : null]}>
              Companions
            </ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.filterChip, activeFilter === "wishlist" ? styles.filterChipActive : null]}
            onPress={() => setActiveFilter("wishlist")}
          >
            <Feather 
              name="heart" 
              size={14} 
              color={activeFilter === "wishlist" ? "#FFFFFF" : ObimoColors.textPrimary} 
            />
            <ThemedText style={[styles.filterChipText, activeFilter === "wishlist" ? styles.filterChipTextActive : null]}>
              Wishlist
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      <Pressable style={[styles.recenterButton, { bottom: tabBarHeight + (selectedPlace ? 280 : 180) }]} onPress={handleRecenter}>
        <Feather name="navigation" size={20} color={ObimoColors.textPrimary} />
      </Pressable>

      <View style={[styles.statsCard, { bottom: tabBarHeight + Spacing.lg }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="star" size={16} color="#F59E0B" />
            <ThemedText style={styles.statValue}>{travelStats.placesVisited}</ThemedText>
            <ThemedText style={styles.statLabel}>Places</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="truck" size={16} color="#3B82F6" />
            <ThemedText style={styles.statValue}>{(travelStats.milesTraveled / 1000).toFixed(1)}k</ThemedText>
            <ThemedText style={styles.statLabel}>Miles</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="users" size={16} color="#22C55E" />
            <ThemedText style={styles.statValue}>{travelStats.companionsMade}</ThemedText>
            <ThemedText style={styles.statLabel}>Friends</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="camera" size={16} color="#EC4899" />
            <ThemedText style={styles.statValue}>{travelStats.memoriesCaptured}</ThemedText>
            <ThemedText style={styles.statLabel}>Photos</ThemedText>
          </View>
        </View>
      </View>

      {selectedPlace ? (
        <View style={[styles.placeCard, { bottom: tabBarHeight + 100 }]}>
          <Pressable style={styles.closePlaceButton} onPress={() => setSelectedPlace(null)}>
            <Feather name="x" size={18} color={ObimoColors.textSecondary} />
          </Pressable>
          
          {selectedPlace.photos.length > 0 ? (
            <Image
              source={{ uri: selectedPlace.photos[0] }}
              style={styles.placeImage}
              contentFit="cover"
            />
          ) : null}
          
          <View style={styles.placeContent}>
            <ThemedText style={styles.placeName}>{selectedPlace.name}</ThemedText>
            <View style={styles.placeMetaRow}>
              <Feather name="calendar" size={14} color={ObimoColors.textSecondary} />
              <ThemedText style={styles.placeMeta}>
                {new Date(selectedPlace.visitedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                {" \u2022 "}{selectedPlace.duration} days
              </ThemedText>
            </View>
            
            {selectedPlace.notes ? (
              <ThemedText style={styles.placeNotes}>{selectedPlace.notes}</ThemedText>
            ) : null}
            
            {selectedPlace.companionsMet.length > 0 ? (
              <View style={styles.companionsRow}>
                <Feather name="users" size={14} color={ObimoColors.textSecondary} />
                <ThemedText style={styles.companionsText}>
                  Met {selectedPlace.companionsMet.join(", ")} here
                </ThemedText>
              </View>
            ) : null}
            
            <View style={styles.placeActions}>
              <Pressable style={styles.placeActionButton}>
                <Feather name="edit-2" size={14} color={ObimoColors.textPrimary} />
                <ThemedText style={styles.placeActionText}>Edit</ThemedText>
              </Pressable>
              <Pressable style={styles.placeActionButton}>
                <Feather name="trash-2" size={14} color="#EF4444" />
                <ThemedText style={[styles.placeActionText, { color: "#EF4444" }]}>Delete</ThemedText>
              </Pressable>
              <Pressable style={styles.placeActionButton}>
                <Feather name="share" size={14} color={ObimoColors.textPrimary} />
                <ThemedText style={styles.placeActionText}>Share</ThemedText>
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    ...Typography.h2,
    color: ObimoColors.textPrimary,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    ...Typography.body,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
  filterBar: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
  },
  filterContent: {
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
  recenterButton: {
    position: "absolute",
    right: Spacing.lg,
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
  visitedMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statsCard: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  statLabel: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  placeCard: {
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
  closePlaceButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeImage: {
    width: "100%",
    height: 120,
  },
  placeContent: {
    padding: Spacing.lg,
  },
  placeName: {
    ...Typography.h3,
    color: ObimoColors.textPrimary,
  },
  placeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  placeMeta: {
    ...Typography.small,
    color: ObimoColors.textSecondary,
  },
  placeNotes: {
    ...Typography.body,
    color: ObimoColors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
  companionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    backgroundColor: ObimoColors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  companionsText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
  },
  placeActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: ObimoColors.background,
  },
  placeActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  placeActionText: {
    ...Typography.small,
    color: ObimoColors.textPrimary,
    fontWeight: "500",
  },
});
