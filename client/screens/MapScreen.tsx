import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Polyline } from "react-native-maps";
import { Image } from "expo-image";
import * as Location from "expo-location";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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
    photos: ["https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400"],
    notes: "Breathtaking views",
    companionsMet: [],
  },
  {
    id: "4",
    name: "Joshua Tree, California",
    latitude: 33.8734,
    longitude: -115.9010,
    visitedAt: "2025-08-10",
    duration: 4,
    photos: ["https://images.unsplash.com/photo-1545243424-0ce743321e11?w=400"],
    notes: "Star gazing paradise",
    companionsMet: ["Luna"],
  },
];

const BOTTOM_SHEET_MIN = 100;
const BOTTOM_SHEET_MAX = SCREEN_HEIGHT * 0.55;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<"places" | "companions" | "wishlist">("places");
  const [selectedPlace, setSelectedPlace] = useState<VisitedPlace | null>(null);

  const bottomSheetY = useSharedValue(BOTTOM_SHEET_MIN);
  const isExpanded = useSharedValue(false);

  const visitedPlaces = SAMPLE_VISITED_PLACES;
  
  const travelStats = {
    placesVisited: 47,
    milesTraveled: 8.4,
    elevGain: 12500,
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log("Error getting location:", error);
      }
    };

    getLocation();
  }, []);

  const handleMarkerPress = (place: VisitedPlace) => {
    setSelectedPlace(place);
    bottomSheetY.value = withSpring(BOTTOM_SHEET_MAX, { damping: 20, stiffness: 150 });
    isExpanded.value = true;
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 500);
    }
  };

  const toggleBottomSheet = () => {
    if (isExpanded.value) {
      bottomSheetY.value = withSpring(BOTTOM_SHEET_MIN, { damping: 20, stiffness: 150 });
      isExpanded.value = false;
    } else {
      bottomSheetY.value = withSpring(BOTTOM_SHEET_MAX, { damping: 20, stiffness: 150 });
      isExpanded.value = true;
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = isExpanded.value 
        ? BOTTOM_SHEET_MAX - event.translationY
        : BOTTOM_SHEET_MIN - event.translationY;
      bottomSheetY.value = Math.max(BOTTOM_SHEET_MIN, Math.min(BOTTOM_SHEET_MAX, newY));
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const shouldExpand = velocity < -500 || (velocity > -500 && velocity < 500 && bottomSheetY.value > (BOTTOM_SHEET_MIN + BOTTOM_SHEET_MAX) / 2);
      
      if (shouldExpand) {
        bottomSheetY.value = withSpring(BOTTOM_SHEET_MAX, { damping: 20, stiffness: 150 });
        isExpanded.value = true;
      } else {
        bottomSheetY.value = withSpring(BOTTOM_SHEET_MIN, { damping: 20, stiffness: 150 });
        isExpanded.value = false;
      }
    });

  const bottomSheetStyle = useAnimatedStyle(() => ({
    height: bottomSheetY.value + tabBarHeight,
  }));

  const contentOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      bottomSheetY.value,
      [BOTTOM_SHEET_MIN, BOTTOM_SHEET_MIN + 100],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

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

  const currentPlace = selectedPlace || visitedPlaces[0];

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
        mapType="satellite"
      >
        {visitedPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => handleMarkerPress(place)}
          >
            <View style={[
              styles.marker,
              selectedPlace?.id === place.id ? styles.markerSelected : null
            ]}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        ))}

        {routeCoordinates.length > 1 ? (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#22C55E"
            strokeWidth={3}
          />
        ) : null}
      </MapView>

      <Pressable style={[styles.closeButton, { top: insets.top + Spacing.md }]}>
        <Feather name="x" size={20} color="#1F2937" />
      </Pressable>

      <View style={[styles.statsOverlay, { top: insets.top + Spacing.md }]}>
        <View style={styles.statPill}>
          <ThemedText style={styles.statLabel}>Length</ThemedText>
          <ThemedText style={styles.statValue}>{travelStats.milesTraveled}k mi</ThemedText>
        </View>
        <View style={styles.statPill}>
          <ThemedText style={styles.statLabel}>Places</ThemedText>
          <ThemedText style={styles.statValue}>{travelStats.placesVisited}</ThemedText>
        </View>
      </View>

      <View style={[styles.filterBar, { top: insets.top + 70 }]}>
        <Pressable 
          style={[styles.filterChip, activeFilter === "places" ? styles.filterChipActive : null]}
          onPress={() => setActiveFilter("places")}
        >
          <ThemedText style={[styles.filterChipText, activeFilter === "places" ? styles.filterChipTextActive : null]}>
            My Places
          </ThemedText>
        </Pressable>
        
        <Pressable 
          style={[styles.filterChip, activeFilter === "companions" ? styles.filterChipActive : null]}
          onPress={() => setActiveFilter("companions")}
        >
          <ThemedText style={[styles.filterChipText, activeFilter === "companions" ? styles.filterChipTextActive : null]}>
            Companions
          </ThemedText>
        </Pressable>
        
        <Pressable 
          style={[styles.filterChip, activeFilter === "wishlist" ? styles.filterChipActive : null]}
          onPress={() => setActiveFilter("wishlist")}
        >
          <ThemedText style={[styles.filterChipText, activeFilter === "wishlist" ? styles.filterChipTextActive : null]}>
            Wishlist
          </ThemedText>
        </Pressable>
      </View>

      <Pressable 
        style={[styles.recenterButton, { bottom: tabBarHeight + BOTTOM_SHEET_MIN + Spacing.md }]} 
        onPress={handleRecenter}
      >
        <Feather name="navigation" size={18} color="#1F2937" />
      </Pressable>

      <Pressable 
        style={[styles.editRouteButton, { bottom: tabBarHeight + BOTTOM_SHEET_MIN + Spacing.md }]} 
      >
        <Feather name="edit-2" size={14} color="#1F2937" />
        <ThemedText style={styles.editRouteText}>Edit route</ThemedText>
      </Pressable>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
          <Pressable style={styles.sheetHandle} onPress={toggleBottomSheet}>
            <View style={styles.handleBar} />
          </Pressable>

          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <ThemedText style={styles.sheetTitle} numberOfLines={1}>
                {currentPlace?.name || "My Journey"}
              </ThemedText>
              <Pressable style={styles.moreButton}>
                <Feather name="more-horizontal" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <ThemedText style={styles.sheetSubtitle}>
              {currentPlace?.duration || 0} days {currentPlace?.notes ? `\u2022 ${currentPlace.notes}` : ""}
            </ThemedText>
          </View>

          <Animated.View style={[styles.sheetContent, contentOpacity]}>
            {currentPlace?.photos && currentPlace.photos.length > 0 ? (
              <View style={styles.photoSection}>
                <Image
                  source={{ uri: currentPlace.photos[0] }}
                  style={styles.placePhoto}
                  contentFit="cover"
                />
              </View>
            ) : null}

            {currentPlace?.companionsMet && currentPlace.companionsMet.length > 0 ? (
              <View style={styles.companionsSection}>
                <ThemedText style={styles.companionsLabel}>Companions met here</ThemedText>
                <View style={styles.companionsList}>
                  {currentPlace.companionsMet.map((name, index) => (
                    <View key={index} style={styles.companionChip}>
                      <Feather name="user" size={12} color="#7C3AED" />
                      <ThemedText style={styles.companionName}>{name}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.elevationChart}>
              <View style={styles.chartLine}>
                <View style={[styles.chartBar, { height: 30 }]} />
                <View style={[styles.chartBar, { height: 20 }]} />
                <View style={[styles.chartBar, { height: 45, backgroundColor: "#FED7AA" }]} />
                <View style={[styles.chartBar, { height: 35 }]} />
                <View style={[styles.chartBar, { height: 25, backgroundColor: "#FED7AA" }]} />
                <View style={[styles.chartBar, { height: 40 }]} />
                <View style={[styles.chartBar, { height: 50, backgroundColor: "#FED7AA" }]} />
                <View style={[styles.chartBar, { height: 30 }]} />
              </View>
              <View style={styles.chartLabels}>
                <ThemedText style={styles.chartLabel}>Start</ThemedText>
                <ThemedText style={styles.chartLabel}>Midpoint</ThemedText>
                <ThemedText style={styles.chartLabel}>End</ThemedText>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={styles.downloadButton}>
                <Feather name="download" size={16} color="#22C55E" />
                <ThemedText style={styles.downloadText}>Download</ThemedText>
              </Pressable>
              <Pressable style={styles.startButton}>
                <Feather name="navigation" size={16} color="#1F2937" />
                <ThemedText style={styles.startText}>Start</ThemedText>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
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
  closeButton: {
    position: "absolute",
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsOverlay: {
    position: "absolute",
    right: Spacing.lg,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    ...Typography.small,
    color: "#6B7280",
    fontSize: 10,
  },
  statValue: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 14,
  },
  filterBar: {
    position: "absolute",
    left: Spacing.lg,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterChip: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterChipActive: {
    backgroundColor: "#1F2937",
  },
  filterChipText: {
    ...Typography.small,
    color: "#1F2937",
    fontWeight: "500",
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  recenterButton: {
    position: "absolute",
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editRouteButton: {
    position: "absolute",
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editRouteText: {
    ...Typography.small,
    color: "#1F2937",
    fontWeight: "500",
    fontSize: 12,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(34, 197, 94, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  markerSelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(34, 197, 94, 0.4)",
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  sheetHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sheetTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sheetTitle: {
    ...Typography.h3,
    color: "#1F2937",
    flex: 1,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  sheetSubtitle: {
    ...Typography.small,
    color: "#6B7280",
    marginTop: 2,
  },
  sheetContent: {
    paddingHorizontal: Spacing.xl,
    flex: 1,
  },
  photoSection: {
    marginBottom: Spacing.lg,
  },
  placePhoto: {
    width: "100%",
    height: 120,
    borderRadius: BorderRadius.lg,
  },
  companionsSection: {
    marginBottom: Spacing.lg,
  },
  companionsLabel: {
    ...Typography.small,
    color: "#6B7280",
    marginBottom: Spacing.sm,
  },
  companionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  companionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3E8FF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  companionName: {
    ...Typography.small,
    color: "#7C3AED",
    fontWeight: "500",
  },
  elevationChart: {
    marginBottom: Spacing.lg,
  },
  chartLine: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  chartBar: {
    width: 28,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  chartLabel: {
    ...Typography.small,
    color: "#9CA3AF",
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: "#DCFCE7",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  downloadText: {
    ...Typography.body,
    color: "#22C55E",
    fontWeight: "600",
  },
  startButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: "#F3F4F6",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  startText: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "600",
  },
});
