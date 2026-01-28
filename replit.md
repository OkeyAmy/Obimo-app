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
1. **Root Stack**: Splash → Welcome → EmailAuth → EmailConfirmation → Main
2. **Main Tabs**: Home and Profile tabs with nested stack navigators
3. **Modals**: Full-screen modal presentation for overlays

## External Dependencies

### Third-Party Services
- **Video Hosting**: Currently using Google's sample video CDN for welcome screen background
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)

### Key NPM Packages
- **expo**: Core framework for cross-platform mobile development
- **expo-video**: Video playback for immersive welcome screen
- **expo-haptics**: Tactile feedback for button interactions
- **react-native-reanimated**: High-performance animations
- **react-native-gesture-handler**: Touch gesture handling
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management and caching
- **express**: Backend HTTP server

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)
- `EXPO_PUBLIC_DOMAIN`: API server domain for client requests
- `REPLIT_DEV_DOMAIN`: Development domain for Replit environment