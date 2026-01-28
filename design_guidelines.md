# Obimo Design Guidelines

## Brand Identity

**Purpose**: Obimo connects van-life nomads for spontaneous meetups and travel companion tracking. The app embodies the warmth of adventure and the trust needed to connect with fellow travelers.

**Aesthetic Direction**: Warm, adventurous, and welcoming - inspired by Bumble and Couchsurfing's friendly onboarding flows. The design features smooth bottom sheet interactions, card-based layouts, generous white space, and a travel-focused mobile experience with warm tones that evoke sunsets and open roads.

**Memorable Element**: The Fascinate font branding paired with warm orange (#FF6B35) creates an instantly recognizable, adventure-ready identity that stands apart from typical blue social apps.

## Navigation Architecture

**Root Navigation**: Stack-Only (Onboarding/Auth Flow)

This initial phase focuses on the onboarding experience. Future phases will likely introduce tab navigation for core features.

### Screen List:
1. **Splash Screen** - Brand introduction with Fascinate logo
2. **Welcome Screen** - Entry point with "Join Obimo" and "Log in" options
3. **Auth Method Bottom Sheet** - Modal for selecting sign-in method (Apple, Google, Email)
4. **Email Confirmation Screen** - Waiting state after email link sent
5. **Video Onboarding Screen** - Second onboarding step with MP4 placeholder

## Screen-by-Screen Specifications

### 1. Splash Screen
**Purpose**: Brand introduction and app loading

**Layout**:
- No header
- Centered content area with "Obimo" text in Fascinate font
- Background: #FFFBF5 (warm white)
- Top inset: insets.top
- Bottom inset: insets.bottom

**Components**:
- "Obimo" text (Fascinate font, large display size, color #FF6B35)
- Subtle fade-in animation on load

---

### 2. Welcome Screen
**Purpose**: First decision point - join or log in

**Layout**:
- No header
- Scrollable content area
- Two primary action buttons at bottom
- Top inset: insets.top + Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl

**Components**:
- Hero section with welcoming illustration/imagery
- Headline text: "Connect with Fellow Nomads"
- Subheadline: Brief value proposition
- "Join Obimo" button (primary style, #FF6B35)
- "Log in" button (secondary style, outlined)

---

### 3. Auth Method Bottom Sheet (Modal)
**Purpose**: Select authentication method

**Layout**:
- Native modal bottom sheet with rounded top corners
- Handle bar at top
- White background with subtle shadow
- Dismissible by swipe down or tap outside

**Components**:
- "Sign in to Obimo" heading
- Apple Sign-In button (system standard, black with white Apple icon)
- Google Sign-In button (white with Google logo, border)
- "Continue with Email" button (outlined, #004E89)
- Terms and privacy links at bottom (small text, #2D3142)

**Visual Feedback**: Each button scales slightly (0.95) when pressed

---

### 4. Email Confirmation Screen
**Purpose**: Waiting state while user checks email

**Layout**:
- Custom header with back button (left), no right button
- Centered content area (not scrollable)
- Top inset: headerHeight + Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl

**Components**:
- Illustration of email/mailbox (empty-state style)
- "Check Your Email" heading
- Instruction text explaining to tap the link sent
- Email address display (user's entered email, editable)
- "Resend Email" text button (#0066C4 from attached branding)
- "Open Email App" primary button

---

### 5. Video Onboarding Screen
**Purpose**: Introduce app features/community via video

**Layout**:
- No header (swipeable/dismissible)
- Full-screen video player with MP4 placeholder
- Overlay controls at bottom
- Safe area insets: all edges

**Components**:
- Video player component (MP4 source)
- Play/pause control
- Progress indicator dots (if multiple onboarding slides)
- "Skip" button (top right, subtle)
- "Next" or "Get Started" button (bottom, over video)

---

## Color Palette

```
Primary: #FF6B35 (warm orange - adventure, primary CTAs)
Secondary: #004E89 (deep blue - trust, secondary actions)
Background: #FFFBF5 (warm white - main background)
Surface: #FFFFFF (white - cards, sheets)
Text Primary: #2D3142 (charcoal - main text)
Text Secondary: #6B7280 (gray - supporting text)
Accent: #F4A261 (sunset orange - highlights, active states)
Success: #06A77D (teal - confirmations)
Link: #0066C4 (blue - from branding.json)
Error: #DC2626 (red - validation errors)
```

## Typography

**Branding**: Fascinate (Google Font) - logo and app name only
**UI Text**: SF Pro (iOS) / System fonts (Android) - all other text

**Type Scale**:
- Display: 32px, Bold (Fascinate for "Obimo", SF Pro for others)
- H1: 24px, Bold
- H2: 20px, Semibold
- Body: 16px, Regular
- Caption: 14px, Regular
- Small: 12px, Regular

**Line Height**: 1.5 for body text, 1.2 for headings

## Visual Design

**Icons**: Import from https://icon-sets.iconify.design/ (use lucide or feather icon sets for consistency)

**Buttons**:
- Primary: #FF6B35 background, white text, 12px border radius, height 48px
  - Press state: opacity 0.8
- Secondary: Transparent background, #004E89 border (2px), #004E89 text
  - Press state: #004E89 background at 0.1 opacity
- Text buttons: No background, #0066C4 text, underline on press

**Bottom Sheets**:
- White background (#FFFFFF)
- Top border radius: 20px
- Handle bar: 40px wide, 4px height, #E5E7EB, centered 12px from top
- Shadow: shadowOffset (0, -2), shadowOpacity 0.1, shadowRadius 8
- Backdrop: black at 0.4 opacity

**Cards**: 12px border radius, white background, subtle shadow (offset 0,1, opacity 0.05, radius 2)

**Forms**: Bottom-aligned submit/cancel if in modal, header-aligned if full screen

## Assets to Generate

1. **icon.png** - App icon featuring "O" lettermark in Fascinate font with #FF6B35 on warm gradient background
   - WHERE USED: Device home screen

2. **splash-icon.png** - Simplified version of app icon for splash screen
   - WHERE USED: Splash screen center

3. **welcome-hero.png** - Illustration of van with mountains/sunset, warm colors matching palette
   - WHERE USED: Welcome screen hero section

4. **email-sent.png** - Simple mailbox/envelope illustration in #F4A261 accent color
   - WHERE USED: Email confirmation screen

5. **placeholder-video.mp4** - 15-second loop of travel/van-life footage (placeholder)
   - WHERE USED: Video onboarding screen

6. **avatar-placeholder-1.png** - Default user avatar (warm orange circle with initials)
   - WHERE USED: Future profile screens