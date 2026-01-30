# Obimo - Van-Life Nomad Connection App

## Overview

Obimo is a React Native/Expo mobile application designed to connect van-life nomads for spontaneous meetups and travel companion tracking. The app targets iOS, Android, and web platforms using Expo's cross-platform capabilities. The core value proposition is reducing the emotional toll of constant goodbyes in nomadic lifestyles by facilitating micro-connections and helping users reconnect when their paths cross again.

The project follows a monorepo structure with a React Native client, Express.js backend server, and shared code between them. It uses a stack-only navigation architecture for the onboarding/auth flow, with a minimal, elegant design aesthetic inspired by apps like Feeld.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54 (new architecture enabled)
- **Navigation**: React Navigation v7 with native stack navigators and bottom tabs
- **State Management**: TanStack React Query for server state, React's built-in state for local UI state
- **Animations**: React Native Reanimated for performant, gesture-driven animations
- **Styling**: StyleSheet API with a centralized theme system in `client/constants/theme.ts`
- **Path Aliases**: `@/` maps to `./client`, `@shared/` maps to `./shared`

### Backend Architecture
- **Runtime**: Node.js with Express.js v5
- **Language**: TypeScript with tsx for development
- **API Structure**: Routes registered in `server/routes.ts`, prefixed with `/api`
- **Storage**: Abstracted via `IStorage` interface in `server/storage.ts`, currently using in-memory storage with PostgreSQL schema ready

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Output to `./migrations` directory via Drizzle Kit

### Design System
- **Brand Font**: Fascinate (Google Fonts) for logo/branding
- **Body Font**: System fonts (platform defaults)
- **Color Palette**: Neutral grays with dark text (#2D3142 primary)
- **Components**: Themed components (`ThemedText`, `ThemedView`, `Button`, `Card`) support light/dark modes

### Navigation Structure
1. **Root Stack**: Splash → Welcome → EmailAuth → EmailConfirmation → Location → Notifications → ProfileInfo → Photos → Main
2. **Main Tabs**: Discover (swipe cards), Map (journey tracking), Connects (connections), Profile
3. **Modals**: Full-screen modal presentation for overlays

### AI Recommendation System
- **Provider**: Google Gemini AI (gemini-2.5-flash model)
- **Engine**: `server/recommendation-engine.ts` - singleton class that generates personalized recommendations
- **Scoring Factors**: Proximity (location-based), interaction patterns, past connections (reunions)
- **AI Enhancement**: Gemini analyzes user behavior to re-rank and enhance recommendations
- **Training Signals**: All user interactions are logged to `ai_training_signals` table for learning
- **Fallback**: Graceful degradation when API is rate-limited or unavailable

## External Dependencies

### Third-Party Services
- **Video Hosting**: Currently using Google's sample video CDN for welcome screen background
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **AI/ML**: Google Gemini API for personalized recommendations and explanations
- **Email**: SendGrid for email verification codes
- **Maps**: react-native-maps (Google Maps on native, web fallback with location list)

### Key NPM Packages
- **expo**: Core framework for cross-platform mobile development
- **expo-video**: Video playback for immersive welcome screen
- **expo-haptics**: Tactile feedback for button interactions
- **react-native-reanimated**: High-performance animations
- **react-native-gesture-handler**: Touch gesture handling
- **react-native-maps**: Native map display with markers and clustering
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management and caching
- **@google/genai**: Google Gemini AI SDK for recommendations
- **express**: Backend HTTP server

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)
- `EXPO_PUBLIC_DOMAIN`: API server domain for client requests
- `REPLIT_DEV_DOMAIN`: Development domain for Replit environment
- `GEMINI_API_KEY`: Google Gemini API key for AI-powered recommendations
- `SENDGRID_API_KEY`: SendGrid API key for email verification
- `SESSION_SECRET`: Secret for session management

### API Endpoints

#### Recommendations
- `GET /api/recommendations/:userId` - Get existing recommendations for a user
- `POST /api/recommendations/:userId/generate` - Generate fresh AI-powered recommendations
- `GET /api/recommendations/:userId/explain/:targetUserId` - Get AI explanation for why two users might connect
- `PATCH /api/recommendations/:id` - Update recommendation after user action

#### Interactions
- `POST /api/interactions` - Log user interaction (like, pass, view, etc.)
- `GET /api/interactions/:userId` - Get user's interaction history

#### Discovery
- `GET /api/discover?userId=...` - Get users for discovery swipe cards

#### Connections
- `GET /api/connections/:userId` - Get user's connections
- `POST /api/connections` - Create new connection request
- `PATCH /api/connections/:id` - Update connection status