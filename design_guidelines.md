# Obimo Design Guidelines

## Brand Identity

**Purpose**: Obimo connects van-life nomads for spontaneous meetups and travel companion tracking.

**Aesthetic Direction**: Minimal, clean, and emotionally connected - inspired by Feeld's elegant onboarding. The design features neutral colors, full-screen video backgrounds, smooth bottom sheet interactions, and short, emotionally resonant text.

**Memorable Element**: The Fascinate font branding paired with full-screen video creates an immersive, sophisticated experience.

## Icon System

**IMPORTANT**: All icons MUST come from MaterialCommunityIcons (from @expo/vector-icons), which matches Iconify's Material Design Icons collection.

**Usage**:
```typescript
import { MaterialCommunityIcons } from "@expo/vector-icons";

<MaterialCommunityIcons name="email-outline" size={22} color="#2D3142" />
```

**Common Icons Used**:
- `email-outline` - Email authentication
- `apple` - Apple sign in
- `google` - Google sign in
- `close` - Close/dismiss buttons
- `arrow-left` - Back navigation
- `shield-account` - Authentication/security
- `compass-outline` - Explore/home
- `account-outline` - Profile
- `chevron-right` - Menu item arrows
- `cog-outline` - Settings
- `bell-outline` - Notifications
- `lock-outline` - Privacy
- `help-circle-outline` - Help
- `file-document-outline` - Terms
- `logout` - Log out

## Navigation Architecture

**Root Navigation**: Stack-Only (Onboarding/Auth Flow)

### Screen List:
1. **Splash Screen** - Brand introduction with Fascinate logo on gray background
2. **Welcome Screen** - Full-screen video with "Obimo" overlay, "Join Obimo" and "Log in" buttons
3. **Auth Method Bottom Sheet** - Modal for selecting sign-in method (Apple, Google, Email)
4. **Email Input Screen** - White background, email input with underline
5. **Email Confirmation Screen** - Gray background with link icon, waiting state, resend functionality
6. **Replit Auth Screen** - WebView-based authentication with Replit

## Authentication

### Supported Methods:
1. **Email** - Enter email, receive confirmation link
2. **Apple/Google** - Redirects to Replit Auth (WebView on native, browser on web)
3. **Replit Auth** - OAuth-based authentication using Replit's auth system

### Resend Email Functionality:
- "I didn't get it" button triggers email resend
- Shows "Sending..." loading state
- Displays success alert confirming resend

## Color Palette

```
Primary/Text: #2D3142 (charcoal - main text, buttons)
Secondary: #4A4A4A (gray)
Background: #E8E8E8 (neutral gray - main background)
Surface: #FFFFFF (white - cards, sheets, screens)
Text Primary: #2D3142 (charcoal)
Text Secondary: #6B7280 (gray)
Button Dark: #2D3142 (dark buttons)
Button Light: rgba(0,0,0,0.08) (light buttons)
Overlay: rgba(0,0,0,0.25) (video overlay)
Link: #0066C4 (blue - action sheets)
Error: #DC2626 (red - logout, errors)
```

## Typography

**Branding**: Fascinate (Google Font) - logo and app name only
**UI Text**: SF Pro (iOS) / System fonts (Android) - all other text

**Type Scale**:
- Logo: 72px (Splash), 56px (Welcome), 24px (Header)
- H2: 28px, Bold
- H3: 24px, Semibold
- Body: 16px, Regular
- Small: 14px, Regular

## Visual Design

**Icons**: MaterialCommunityIcons from @expo/vector-icons (NO generated images, NO Feather icons)

**Buttons**:
- Primary: #2D3142 background, white text, full-width rounded pill
- Secondary: rgba(255,255,255,0.85) or rgba(0,0,0,0.08) background, dark text
- Height: 52px, Border radius: full (9999px)
- Press state: scale 0.96

**Bottom Sheets**:
- White background (#FFFFFF)
- Top border radius: 20px
- Handle bar: 40px wide, 4px height, #D1D5DB
- Shadow on top edge

**Text Inputs**:
- Underline style (not boxed)
- Dark underline when focused
- Clear button when text present

## Key Principles

1. **Minimal text** - Keep copy short and emotionally resonant
2. **Full-screen video** - Content overlays on video, not split screen
3. **Neutral palette** - No bright colors, sophisticated grays
4. **Material icons** - Use MaterialCommunityIcons from @expo/vector-icons
5. **Native feel** - Use iOS-style action sheets for email picker
6. **Feedback states** - Loading states on buttons, success haptics
