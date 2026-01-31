import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable, Platform, ScrollView, Modal } from "react-native";
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

interface Companion {
  id: string;
  name: string;
  distance: string;
  isNearby: boolean;
}

interface VisitedPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visitedAt: string;
  endDate?: string;
  duration: number;
  photos: string[];
  notes: string;
  companionsMet: Companion[];
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
    visitedAt: "Oct 15, 2025",
    endDate: "Oct 20, 2025",
    duration: 5,
    photos: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400"],
    notes: "Best sunrise spot! Met amazing people.",
    companionsMet: [
      { id: "c1", name: "Chris", distance: "84 miles away", isNearby: false },
      { id: "c2", name: "Jamie", distance: "84 miles away", isNearby: false },
    ],
  },
  {
    id: "2",
    name: "Sedona, Arizona",
    latitude: 34.8697,
    longitude: -111.7610,
    visitedAt: "Nov 2, 2025",
    endDate: "Nov 7, 2025",
    duration: 5,
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    notes: "Campfire under the stars. The red rocks were incredible!",
    companionsMet: [
      { id: "c3", name: "Alex", distance: "12 miles away", isNearby: true },
    ],
  },
  {
    id: "3",
    name: "Grand Canyon, Arizona",
    latitude: 36.0544,
    longitude: -112.1401,
    visitedAt: "Sep 20, 2025",
    endDate: "Sep 22, 2025",
    duration: 2,
    photos: ["https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400"],
    notes: "Breathtaking views at sunrise",
    companionsMet: [],
  },
  {
    id: "4",
    name: "Joshua Tree, California",
    latitude: 33.8734,
    longitude: -115.9010,
    visitedAt: "Aug 10, 2025",
    endDate: "Aug 14, 2025",
    duration: 4,
    photos: ["https://images.unsplash.com/photo-1545243424-0ce743321e11?w=400"],
    notes: "Star gazing paradise. Best night sky ever!",
    companionsMet: [
      { id: "c4", name: "Luna", distance: "256 miles away", isNearby: false },
    ],
  },
];

const BOTTOM_SHEET_MIN = 100;
const BOTTOM_SHEET_MAX = SCREEN_HEIGHT * 0.6;

const travelStats = {
  placesVisited: 47,
  milesTraveled: 8432,
  companionsMade: 24,
  memoriesCaptured: 127,
  statesExplored: 12,
  mostVisited: "Utah",
  mostVisitedCount: 8,
  longestStay: "Sedona",
  longestStayDays: 14,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<"places" | "companions" | "hidden">("places");
  const [selectedPlace, setSelectedPlace] = useState<VisitedPlace | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2025);

  const bottomSheetY = useSharedValue(BOTTOM_SHEET_MIN);
  const isExpanded = useSharedValue(false);

  const visitedPlaces = SAMPLE_VISITED_PLACES;

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
    setShowPlaceDetail(true);
    
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
      [BOTTOM_SHEET_MIN, BOTTOM_SHEET_MIN + 80],
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

      <View style={[styles.topBar, { top: insets.top + Spacing.sm }]}>
        <ThemedText style={styles.topBarTitle}>My Journey</ThemedText>
        <View style={styles.topBarActions}>
          <Pressable style={styles.topBarButton} onPress={() => setShowAddPlace(true)}>
            <Feather name="plus" size={18} color="#1F2937" />
            <ThemedText style={styles.topBarButtonText}>Add Place</ThemedText>
          </Pressable>
          <Pressable style={styles.settingsButton}>
            <Feather name="settings" size={18} color="#1F2937" />
          </Pressable>
        </View>
      </View>

      <View style={[styles.filterBar, { top: insets.top + 60 }]}>
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
          style={[styles.filterChip, activeFilter === "hidden" ? styles.filterChipActive : null]}
          onPress={() => setActiveFilter("hidden")}
        >
          <ThemedText style={[styles.filterChipText, activeFilter === "hidden" ? styles.filterChipTextActive : null]}>
            Hidden Places
          </ThemedText>
        </Pressable>
      </View>

      <Pressable 
        style={[styles.recenterButton, { bottom: tabBarHeight + BOTTOM_SHEET_MIN + Spacing.md }]} 
        onPress={handleRecenter}
      >
        <Feather name="navigation" size={18} color="#1F2937" />
      </Pressable>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
          <Pressable style={styles.sheetHandle} onPress={toggleBottomSheet}>
            <View style={styles.handleBar} />
          </Pressable>

          <View style={styles.sheetHeader}>
            <ThemedText style={styles.sheetTitle}>Your Travel Stats</ThemedText>
          </View>

          <Animated.View style={[styles.sheetContent, contentOpacity]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Feather name="map-pin" size={20} color="#22C55E" />
                  <ThemedText style={styles.statNumber}>{travelStats.placesVisited}</ThemedText>
                  <ThemedText style={styles.statLabel}>Places Visited</ThemedText>
                </View>
                
                <View style={styles.statCard}>
                  <Feather name="truck" size={20} color="#3B82F6" />
                  <ThemedText style={styles.statNumber}>{travelStats.milesTraveled.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.statLabel}>Miles Traveled</ThemedText>
                </View>
                
                <View style={styles.statCard}>
                  <Feather name="users" size={20} color="#8B5CF6" />
                  <ThemedText style={styles.statNumber}>{travelStats.companionsMade}</ThemedText>
                  <ThemedText style={styles.statLabel}>Companions Made</ThemedText>
                </View>
                
                <View style={styles.statCard}>
                  <Feather name="camera" size={20} color="#F59E0B" />
                  <ThemedText style={styles.statNumber}>{travelStats.memoriesCaptured}</ThemedText>
                  <ThemedText style={styles.statLabel}>Memories Captured</ThemedText>
                </View>
                
                <View style={styles.statCard}>
                  <Feather name="flag" size={20} color="#EF4444" />
                  <ThemedText style={styles.statNumber}>{travelStats.statesExplored}</ThemedText>
                  <ThemedText style={styles.statLabel}>States Explored</ThemedText>
                </View>
              </View>

              <View style={styles.highlightsSection}>
                <View style={styles.highlightRow}>
                  <ThemedText style={styles.highlightLabel}>Most Visited</ThemedText>
                  <ThemedText style={styles.highlightValue}>{travelStats.mostVisited} ({travelStats.mostVisitedCount} times)</ThemedText>
                </View>
                <View style={styles.highlightRow}>
                  <ThemedText style={styles.highlightLabel}>Longest Stay</ThemedText>
                  <ThemedText style={styles.highlightValue}>{travelStats.longestStay} ({travelStats.longestStayDays} days)</ThemedText>
                </View>
              </View>

              <View style={styles.timelineSection}>
                <ThemedText style={styles.timelineTitle}>Journey Timeline</ThemedText>
                <View style={styles.timelineSlider}>
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <Pressable 
                      key={year}
                      style={[styles.timelineYear, timelineYear === year ? styles.timelineYearActive : null]}
                      onPress={() => setTimelineYear(year)}
                    >
                      <ThemedText style={[styles.timelineYearText, timelineYear === year ? styles.timelineYearTextActive : null]}>
                        {year}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.recentPlaces}>
                <ThemedText style={styles.recentTitle}>Recent Places</ThemedText>
                {visitedPlaces.slice(0, 3).map((place) => (
                  <Pressable 
                    key={place.id} 
                    style={styles.recentPlaceCard}
                    onPress={() => {
                      setSelectedPlace(place);
                      setShowPlaceDetail(true);
                    }}
                  >
                    <Image source={{ uri: place.photos[0] }} style={styles.recentPlaceImage} contentFit="cover" />
                    <View style={styles.recentPlaceInfo}>
                      <ThemedText style={styles.recentPlaceName}>{place.name}</ThemedText>
                      <ThemedText style={styles.recentPlaceDate}>{place.visitedAt} - {place.duration} days</ThemedText>
                      {place.companionsMet.length > 0 ? (
                        <ThemedText style={styles.recentPlaceCompanions}>
                          Met {place.companionsMet.map(c => c.name).join(", ")}
                        </ThemedText>
                      ) : null}
                    </View>
                    <Feather name="chevron-right" size={18} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={showPlaceDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPlaceDetail(false)}
      >
        <PlaceDetailView 
          place={selectedPlace} 
          onClose={() => setShowPlaceDetail(false)}
          insets={insets}
        />
      </Modal>

      <Modal
        visible={showAddPlace}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddPlace(false)}
      >
        <AddPlaceView 
          onClose={() => setShowAddPlace(false)}
          insets={insets}
        />
      </Modal>
    </View>
  );
}

function PlaceDetailView({ 
  place, 
  onClose,
  insets 
}: { 
  place: VisitedPlace | null; 
  onClose: () => void;
  insets: { top: number; bottom: number };
}) {
  if (!place) return null;

  return (
    <View style={[detailStyles.container, { paddingTop: insets.top }]}>
      <View style={detailStyles.header}>
        <Pressable style={detailStyles.backButton} onPress={onClose}>
          <Feather name="arrow-left" size={20} color="#1F2937" />
          <ThemedText style={detailStyles.backText}>Map</ThemedText>
        </Pressable>
        <ThemedText style={detailStyles.headerTitle}>{place.name}</ThemedText>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={detailStyles.content} showsVerticalScrollIndicator={false}>
        {place.photos.length > 0 ? (
          <View style={detailStyles.photoCarousel}>
            <Image source={{ uri: place.photos[0] }} style={detailStyles.photo} contentFit="cover" />
          </View>
        ) : null}

        <View style={detailStyles.infoSection}>
          <View style={detailStyles.dateRow}>
            <Feather name="calendar" size={16} color="#6B7280" />
            <ThemedText style={detailStyles.dateText}>
              {place.visitedAt} - {place.endDate} ({place.duration} days)
            </ThemedText>
          </View>
          
          {place.notes ? (
            <View style={detailStyles.notesRow}>
              <Feather name="edit-3" size={16} color="#6B7280" />
              <ThemedText style={detailStyles.notesText}>{place.notes}</ThemedText>
            </View>
          ) : null}
        </View>

        {place.companionsMet.length > 0 ? (
          <View style={detailStyles.companionsSection}>
            <ThemedText style={detailStyles.sectionTitle}>Companions met here:</ThemedText>
            {place.companionsMet.map((companion) => (
              <View key={companion.id} style={[
                detailStyles.companionCard,
                companion.isNearby ? detailStyles.companionCardNearby : null
              ]}>
                <View style={detailStyles.companionAvatar}>
                  <Feather name="user" size={20} color="#8B5CF6" />
                </View>
                <View style={detailStyles.companionInfo}>
                  <View style={detailStyles.companionNameRow}>
                    <ThemedText style={detailStyles.companionName}>{companion.name}</ThemedText>
                    {companion.isNearby ? (
                      <View style={detailStyles.nearbyBadge}>
                        <Feather name="bell" size={12} color="#22C55E" />
                      </View>
                    ) : null}
                  </View>
                  <ThemedText style={detailStyles.companionDistance}>
                    Last seen: {companion.distance}
                  </ThemedText>
                </View>
                <View style={detailStyles.companionActions}>
                  {companion.isNearby ? (
                    <Pressable style={detailStyles.reconnectNowButton}>
                      <ThemedText style={detailStyles.reconnectNowText}>Reconnect Now!</ThemedText>
                    </Pressable>
                  ) : (
                    <>
                      <Pressable style={detailStyles.reconnectButton}>
                        <ThemedText style={detailStyles.reconnectText}>Reconnect</ThemedText>
                      </Pressable>
                      <Pressable style={detailStyles.messageButton}>
                        <ThemedText style={detailStyles.messageText}>Message</ThemedText>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={[detailStyles.actionButtons, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable style={detailStyles.actionButton}>
            <Feather name="edit-2" size={16} color="#3B82F6" />
            <ThemedText style={detailStyles.actionButtonText}>Edit Place</ThemedText>
          </Pressable>
          <Pressable style={detailStyles.actionButton}>
            <Feather name="trash-2" size={16} color="#EF4444" />
            <ThemedText style={[detailStyles.actionButtonText, { color: "#EF4444" }]}>Delete</ThemedText>
          </Pressable>
          <Pressable style={detailStyles.actionButton}>
            <Feather name="share" size={16} color="#8B5CF6" />
            <ThemedText style={[detailStyles.actionButtonText, { color: "#8B5CF6" }]}>Share Story</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function AddPlaceView({ 
  onClose,
  insets 
}: { 
  onClose: () => void;
  insets: { top: number; bottom: number };
}) {
  const [privacy, setPrivacy] = useState<"all" | "tagged" | "hidden">("hidden");

  return (
    <View style={[addStyles.container, { paddingTop: insets.top }]}>
      <View style={addStyles.header}>
        <Pressable onPress={onClose}>
          <ThemedText style={addStyles.cancelText}>Cancel</ThemedText>
        </Pressable>
        <ThemedText style={addStyles.headerTitle}>Add a Place</ThemedText>
        <Pressable>
          <ThemedText style={addStyles.saveText}>Save</ThemedText>
        </Pressable>
      </View>

      <ScrollView style={addStyles.content} showsVerticalScrollIndicator={false}>
        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="map-pin" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Location</ThemedText>
          </View>
          <Pressable style={addStyles.fieldInput}>
            <ThemedText style={addStyles.fieldPlaceholder}>Search or pin on map...</ThemedText>
          </Pressable>
        </View>

        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="calendar" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Dates</ThemedText>
          </View>
          <View style={addStyles.dateRow}>
            <View style={addStyles.dateField}>
              <ThemedText style={addStyles.dateLabel}>From:</ThemedText>
              <Pressable style={addStyles.dateInput}>
                <ThemedText style={addStyles.dateValue}>Select date</ThemedText>
              </Pressable>
            </View>
            <View style={addStyles.dateField}>
              <ThemedText style={addStyles.dateLabel}>To:</ThemedText>
              <Pressable style={addStyles.dateInput}>
                <ThemedText style={addStyles.dateValue}>Select date</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="edit-3" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Notes (optional)</ThemedText>
          </View>
          <Pressable style={[addStyles.fieldInput, addStyles.textArea]}>
            <ThemedText style={addStyles.fieldPlaceholder}>What made this place special?...</ThemedText>
          </Pressable>
        </View>

        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="camera" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Add Photos (optional)</ThemedText>
          </View>
          <Pressable style={addStyles.uploadButton}>
            <Feather name="plus" size={20} color="#6B7280" />
            <ThemedText style={addStyles.uploadText}>Upload photos</ThemedText>
          </Pressable>
        </View>

        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="users" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Tag Companions (optional)</ThemedText>
          </View>
          <Pressable style={addStyles.fieldInput}>
            <ThemedText style={addStyles.fieldPlaceholder}>Select companions you met here...</ThemedText>
          </Pressable>
        </View>

        <View style={addStyles.field}>
          <View style={addStyles.fieldLabel}>
            <Feather name="lock" size={16} color="#6B7280" />
            <ThemedText style={addStyles.fieldLabelText}>Privacy</ThemedText>
          </View>
          <View style={addStyles.privacyOptions}>
            <Pressable 
              style={addStyles.privacyOption}
              onPress={() => setPrivacy("all")}
            >
              <View style={[addStyles.radio, privacy === "all" ? addStyles.radioSelected : null]}>
                {privacy === "all" ? <View style={addStyles.radioDot} /> : null}
              </View>
              <ThemedText style={addStyles.privacyText}>Visible to all connections</ThemedText>
            </Pressable>
            <Pressable 
              style={addStyles.privacyOption}
              onPress={() => setPrivacy("tagged")}
            >
              <View style={[addStyles.radio, privacy === "tagged" ? addStyles.radioSelected : null]}>
                {privacy === "tagged" ? <View style={addStyles.radioDot} /> : null}
              </View>
              <ThemedText style={addStyles.privacyText}>Visible to tagged companions only</ThemedText>
            </Pressable>
            <Pressable 
              style={addStyles.privacyOption}
              onPress={() => setPrivacy("hidden")}
            >
              <View style={[addStyles.radio, privacy === "hidden" ? addStyles.radioSelected : null]}>
                {privacy === "hidden" ? <View style={addStyles.radioDot} /> : null}
              </View>
              <ThemedText style={addStyles.privacyText}>Hidden (private to me)</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
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
  topBar: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topBarTitle: {
    ...Typography.h3,
    color: "#1F2937",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  topBarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  topBarButtonText: {
    ...Typography.small,
    color: "#1F2937",
    fontWeight: "500",
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
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
  sheetTitle: {
    ...Typography.h3,
    color: "#1F2937",
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: (SCREEN_WIDTH - 48 - 16) / 3,
    backgroundColor: "#F9FAFB",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  statNumber: {
    ...Typography.h2,
    color: "#1F2937",
    marginTop: Spacing.xs,
  },
  statLabel: {
    ...Typography.small,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 10,
  },
  highlightsSection: {
    backgroundColor: "#F9FAFB",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  highlightLabel: {
    ...Typography.body,
    color: "#6B7280",
  },
  highlightValue: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "600",
  },
  timelineSection: {
    marginBottom: Spacing.lg,
  },
  timelineTitle: {
    ...Typography.body,
    color: "#6B7280",
    marginBottom: Spacing.sm,
  },
  timelineSlider: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  timelineYear: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.full,
  },
  timelineYearActive: {
    backgroundColor: "#1F2937",
  },
  timelineYearText: {
    ...Typography.small,
    color: "#6B7280",
    fontWeight: "500",
  },
  timelineYearTextActive: {
    color: "#FFFFFF",
  },
  recentPlaces: {
    marginBottom: Spacing.xl,
  },
  recentTitle: {
    ...Typography.body,
    color: "#6B7280",
    marginBottom: Spacing.md,
  },
  recentPlaceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  recentPlaceImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
  },
  recentPlaceInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  recentPlaceName: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "600",
  },
  recentPlaceDate: {
    ...Typography.small,
    color: "#6B7280",
  },
  recentPlaceCompanions: {
    ...Typography.small,
    color: "#8B5CF6",
    marginTop: 2,
  },
});

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  backText: {
    ...Typography.body,
    color: "#1F2937",
  },
  headerTitle: {
    ...Typography.h3,
    color: "#1F2937",
  },
  content: {
    flex: 1,
  },
  photoCarousel: {
    height: 200,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  infoSection: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dateText: {
    ...Typography.body,
    color: "#1F2937",
  },
  notesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  notesText: {
    ...Typography.body,
    color: "#6B7280",
    flex: 1,
  },
  companionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.body,
    color: "#6B7280",
    marginBottom: Spacing.md,
  },
  companionCard: {
    backgroundColor: "#F9FAFB",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  companionCardNearby: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  companionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  companionInfo: {
    marginBottom: Spacing.sm,
  },
  companionNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  companionName: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "600",
  },
  nearbyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  companionDistance: {
    ...Typography.small,
    color: "#6B7280",
  },
  companionActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  reconnectButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  reconnectText: {
    ...Typography.small,
    color: "#1F2937",
    fontWeight: "500",
  },
  messageButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  messageText: {
    ...Typography.small,
    color: "#1F2937",
    fontWeight: "500",
  },
  reconnectNowButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  reconnectNowText: {
    ...Typography.small,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.body,
    color: "#3B82F6",
    fontWeight: "500",
  },
});

const addStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cancelText: {
    ...Typography.body,
    color: "#6B7280",
  },
  headerTitle: {
    ...Typography.h3,
    color: "#1F2937",
  },
  saveText: {
    ...Typography.body,
    color: "#22C55E",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  fieldLabelText: {
    ...Typography.body,
    color: "#1F2937",
    fontWeight: "500",
  },
  fieldInput: {
    backgroundColor: "#F9FAFB",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: {
    minHeight: 100,
    alignItems: "flex-start",
  },
  fieldPlaceholder: {
    ...Typography.body,
    color: "#9CA3AF",
  },
  dateRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    ...Typography.small,
    color: "#6B7280",
    marginBottom: Spacing.xs,
  },
  dateInput: {
    backgroundColor: "#F9FAFB",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateValue: {
    ...Typography.body,
    color: "#9CA3AF",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: "#F9FAFB",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  uploadText: {
    ...Typography.body,
    color: "#6B7280",
  },
  privacyOptions: {
    gap: Spacing.md,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#22C55E",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  privacyText: {
    ...Typography.body,
    color: "#1F2937",
  },
});
