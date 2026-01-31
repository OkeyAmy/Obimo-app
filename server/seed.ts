import { db } from "./db";
import { 
  users, locations, mapMarkers, mapProviderStatus, 
  userLocationsHistory, connections, recommendations 
} from "@shared/schema";
import { eq } from "drizzle-orm";

const sampleLocations = [
  {
    name: "Joshua Tree National Park",
    description: "Iconic desert park with unique boulder formations and Joshua trees",
    latitude: "33.8734",
    longitude: "-115.9010",
    locationType: "national_park",
    country: "USA",
    state: "California",
    photos: ["https://images.unsplash.com/photo-1545243424-0ce743321e11?w=800"],
    amenities: ["camping", "hiking", "rock_climbing", "stargazing"],
  },
  {
    name: "Sedona Red Rocks",
    description: "Stunning red rock formations and spiritual vortexes",
    latitude: "34.8697",
    longitude: "-111.7610",
    locationType: "landmark",
    country: "USA",
    state: "Arizona",
    photos: ["https://images.unsplash.com/photo-1558645836-e44122a743ee?w=800"],
    amenities: ["hiking", "camping", "photography", "spiritual"],
  },
  {
    name: "Moab Desert",
    description: "Adventure capital with arches and canyonlands",
    latitude: "38.5733",
    longitude: "-109.5498",
    locationType: "city",
    country: "USA",
    state: "Utah",
    photos: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"],
    amenities: ["offroad", "hiking", "camping", "biking"],
  },
  {
    name: "Big Sur Coast",
    description: "Dramatic coastal cliffs along Highway 1",
    latitude: "36.2704",
    longitude: "-121.8081",
    locationType: "campsite",
    country: "USA",
    state: "California",
    photos: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
    amenities: ["camping", "hiking", "beach", "photography"],
  },
  {
    name: "Yellowstone Geysers",
    description: "World's first national park with geothermal wonders",
    latitude: "44.4280",
    longitude: "-110.5885",
    locationType: "national_park",
    country: "USA",
    state: "Wyoming",
    photos: ["https://images.unsplash.com/photo-1533953263177-acfcd565c8d2?w=800"],
    amenities: ["camping", "hiking", "wildlife", "hot_springs"],
  },
  {
    name: "Olympic Rainforest",
    description: "Lush temperate rainforest in the Pacific Northwest",
    latitude: "47.8021",
    longitude: "-123.6044",
    locationType: "national_park",
    country: "USA",
    state: "Washington",
    photos: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
    amenities: ["camping", "hiking", "wildlife", "rainforest"],
  },
  {
    name: "Taos Pueblo",
    description: "Historic Native American community and art hub",
    latitude: "36.4383",
    longitude: "-105.5491",
    locationType: "city",
    country: "USA",
    state: "New Mexico",
    photos: ["https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800"],
    amenities: ["culture", "art", "hot_springs", "skiing"],
  },
  {
    name: "Glacier National Park",
    description: "Crown of the Continent with pristine wilderness",
    latitude: "48.7596",
    longitude: "-113.7870",
    locationType: "national_park",
    country: "USA",
    state: "Montana",
    photos: ["https://images.unsplash.com/photo-1491466424936-e304919aada7?w=800"],
    amenities: ["camping", "hiking", "wildlife", "glaciers"],
  },
];

const sampleUsers = [
  {
    id: "test-user-1",
    email: "test@example.com",
    firstName: "Alex",
    dateOfBirth: "1995-06-15",
    gender: "non-binary",
    photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "34.0522",
    longitude: "-118.2437",
  },
  {
    email: "sarah.wanderer@example.com",
    firstName: "Sarah",
    dateOfBirth: "1996-03-15",
    gender: "woman",
    photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "34.1522",
    longitude: "-118.3437",
  },
  {
    email: "jake.nomad@example.com",
    firstName: "Jake",
    dateOfBirth: "1992-07-22",
    gender: "man",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "36.1699",
    longitude: "-115.1398",
  },
  {
    email: "maya.explorer@example.com",
    firstName: "Maya",
    dateOfBirth: "1994-11-08",
    gender: "woman",
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "35.6762",
    longitude: "-105.9378",
  },
  {
    email: "chris.vanlife@example.com",
    firstName: "Chris",
    dateOfBirth: "1990-05-03",
    gender: "man",
    photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "38.5733",
    longitude: "-109.5498",
  },
  {
    email: "luna.freebird@example.com",
    firstName: "Luna",
    dateOfBirth: "1998-09-20",
    gender: "woman",
    photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"],
    locationPermission: true,
    notificationPermission: true,
    onboardingCompleted: true,
    latitude: "33.8734",
    longitude: "-115.9010",
  },
];

export async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Initialize map providers
    const existingProviders = await db.select().from(mapProviderStatus);
    if (existingProviders.length === 0) {
      await db.insert(mapProviderStatus).values([
        { 
          provider: 'google', 
          isAvailable: true, 
          isPrimary: true, 
          dailyUsageLimit: 28000, 
          monthlyUsageLimit: 200000,
          dailyUsageCount: 0,
          monthlyUsageCount: 0,
        },
        { 
          provider: 'mapbox', 
          isAvailable: true, 
          isPrimary: false, 
          dailyUsageLimit: 100000, 
          monthlyUsageLimit: 500000,
          dailyUsageCount: 0,
          monthlyUsageCount: 0,
        }
      ]);
      console.log("Map providers initialized");
    }

    // Insert locations
    const existingLocations = await db.select().from(locations);
    if (existingLocations.length === 0) {
      for (const loc of sampleLocations) {
        await db.insert(locations).values(loc);
      }
      console.log(`Inserted ${sampleLocations.length} locations`);
    }

    // Insert sample users
    for (const userData of sampleUsers) {
      const existing = await db.select().from(users).where(eq(users.email, userData.email));
      if (existing.length === 0) {
        // Use provided ID if available, otherwise let DB generate
        const insertData = { ...userData };
        await db.insert(users).values(insertData as any);
        console.log(`Created user: ${userData.firstName}`);
      }
    }

    // Get inserted data for relationships
    const allLocations = await db.select().from(locations);
    const allUsers = await db.select().from(users).where(eq(users.onboardingCompleted, true));

    // Create map markers for each location
    const existingMarkers = await db.select().from(mapMarkers);
    if (existingMarkers.length === 0) {
      for (const loc of allLocations) {
        await db.insert(mapMarkers).values({
          locationId: loc.id,
          markerType: loc.locationType === 'campsite' ? 'campsite' : 'poi',
          iconType: loc.locationType === 'campsite' ? 'tent' : 'pin',
          color: loc.locationType === 'national_park' ? '#22C55E' : '#2D3142',
          isVisible: true,
          isClickable: true,
          clusterGroup: loc.locationType,
          priority: loc.locationType === 'national_park' ? 10 : 5,
        });
      }
      console.log(`Created ${allLocations.length} map markers`);
    }

    // Create user location history (visits)
    const existingHistory = await db.select().from(userLocationsHistory);
    if (existingHistory.length === 0 && allUsers.length > 0 && allLocations.length > 0) {
      for (const user of allUsers) {
        const numVisits = Math.floor(Math.random() * 5) + 2;
        const shuffledLocations = [...allLocations].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(numVisits, shuffledLocations.length); i++) {
          const daysAgo = Math.floor(Math.random() * 90) + 1;
          const duration = Math.floor(Math.random() * 7) + 1;
          
          await db.insert(userLocationsHistory).values({
            userId: user.id,
            locationId: shuffledLocations[i].id,
            visitedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            durationDays: duration,
            isPublic: true,
          });
        }
      }
      console.log("Created user location history");
    }

    // Create some sample connections
    const existingConnections = await db.select().from(connections);
    if (existingConnections.length === 0 && allUsers.length >= 2) {
      await db.insert(connections).values({
        userId: allUsers[0].id,
        connectedUserId: allUsers[1].id,
        status: 'connected',
        connectionType: 'standard',
      });
      
      if (allUsers.length >= 3) {
        await db.insert(connections).values({
          userId: allUsers[0].id,
          connectedUserId: allUsers[2].id,
          status: 'pending',
          connectionType: 'standard',
        });
      }
      console.log("Created sample connections");
    }

    // Create sample recommendations
    const existingRecs = await db.select().from(recommendations);
    if (existingRecs.length === 0 && allUsers.length >= 2) {
      for (let i = 0; i < allUsers.length; i++) {
        for (let j = i + 1; j < allUsers.length; j++) {
          const confidence = Math.floor(Math.random() * 40) + 50;
          await db.insert(recommendations).values({
            userId: allUsers[i].id,
            recommendedUserId: allUsers[j].id,
            confidenceScore: confidence,
            reasonCodes: ['proximity', 'shared_interests'],
            isActive: true,
          });
        }
      }
      console.log("Created sample recommendations");
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
