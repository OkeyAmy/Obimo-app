# Obimo Design Guidelines

## Brand Identity

**Purpose**: Obimo connects van-life nomads for spontaneous meetups and travel companion tracking.

**Aesthetic Direction**: Minimal, clean, and emotionally connected - inspired by Feeld's elegant onboarding. The design features neutral colors, full-screen video backgrounds, smooth bottom sheet interactions, and short, emotionally resonant text.

**Memorable Element**: The Fascinate font branding paired with full-screen video creates an immersive, sophisticated experience.

## Navigation Architecture

**Root Navigation**: Stack-Only (Onboarding/Auth Flow)

### Screen List:
1. **Splash Screen** - Brand introduction with Fascinate logo on gray background
2. **Welcome Screen** - Full-screen video with "Obimo" overlay, "Join Obimo" and "Log in" buttons
3. **Auth Method Bottom Sheet** - Modal for selecting sign-in method (Apple, Google, Email)
4. **Email Input Screen** - White background, email input with underline
5. **Email Confirmation Screen** - Gray background with link icon, waiting state

## Screen-by-Screen Specifications

### 1. Splash Screen
**Purpose**: Brand introduction and app loading

**Layout**:
- No header
- Centered content area with "Obimo" text in Fascinate font
- Background: #E8E8E8 (neutral gray)

**Components**:
- "Obimo" text (Fascinate font, 72px, color #2D3142)
- Subtle fade-in animation on load

---

### 2. Welcome Screen
**Purpose**: First decision point - join or log in

**Layout**:
- Full-screen video background playing continuously
- Dark overlay on video (rgba(0,0,0,0.25))
- Logo centered vertically in top area
- Short tagline and buttons at bottom overlaying video
- No split screen - everything overlays on video

**Components**:
- "Obimo" text (Fascinate font, 56px, white, centered)
- Short tagline: "A travel app for the curious" (16px, white)
- "Join Obimo" button (dark #2D3142 background, white text)
- "Log in" button (white/85% opacity background, dark text)

---

### 3. Auth Method Bottom Sheet (Modal)
**Purpose**: Select authentication method

**Layout**:
- Native modal bottom sheet with rounded top corners (20px)
- Handle bar at top
- White background with subtle shadow

**Components**:
- "Join Obimo" or "Log in" heading
- Terms and privacy text with underlined links
- Apple Sign-In button (dark with Apple icon)
- Google Sign-In button (white with border, Google icon)
- "Email" button (dark background)
- "Cancel" button (gray background)

---

### 4. Email Input Screen
**Purpose**: Collect email address

**Layout**:
- White background
- Back button in header
- Form with underlined text input

**Components**:
- Title: "Where can we send your confirmation link?"
- Subtitle: "Enter a real email address. Don't worry — no one else will see it."
- Email text input with underline (not boxed)
- Clear button (X) when text entered
- "Next" button (dark, disabled until valid email)

---

### 5. Email Confirmation Screen
**Purpose**: Waiting state while user checks email

**Layout**:
- Gray background (#E8E8E8)
- Close button (X) in top right
- Centered content

**Components**:
- Link icon (two overlapping circles/ovals - SVG, not generated image)
- "You're almost there" heading
- "We've sent an email to [email]. Check your inbox and tap the link we sent."
- "Open email app" primary button (opens native email app picker)
- "I didn't get it" secondary button

---

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

**Icons**: Use Feather icons from @expo/vector-icons (NO generated images)

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
4. **Clean icons** - Use Feather icons, no generated images
5. **Native feel** - Use iOS-style action sheets for email picker
