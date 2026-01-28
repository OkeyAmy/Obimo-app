# Campfire Circles: Complete Product Requirements Document

**Last Updated:** January 28, 2026  
**Project:** Van-Life Micro-Connections Mobile App  
**Hackathon:** Shipyard Creator Contest (Quin Gable Brief)  
**Target:** iOS & Android MVP in 4 weeks  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [The Problem](#the-problem)
3. [The Solution](#the-solution)
4. [Target Users](#target-users)
5. [Core Features](#core-features)
6. [User Experience (UX) Design](#user-experience-ux-design)
7. [Technical Architecture](#technical-architecture)
8. [Monetization Strategy](#monetization-strategy)
9. [Go-to-Market Strategy](#go-to-market-strategy)
10. [Success Metrics](#success-metrics)
11. [Development Timeline](#development-timeline)
12. [Appendix](#appendix)

---

## 1. Executive Summary

### Product Vision
**Campfire Circles** is a location-based mobile app that reduces the emotional cost of van-life by facilitating spontaneous micro-connections and tracking travel companions, so nomads can reconnect when their paths cross again.

### The Unique Insight
While existing apps focus on finding campsites (Sēkr) or dating (Nomad Soulmates), nobody addresses the #1 reason people quit van-life: **"constant goodbyes and lack of deeper connections."** We're building emotional infrastructure, not logistics.

### Key Differentiators
- **Grief reduction focus:** Stop losing people you care about
- **Hyper-local + spontaneous:** "Coffee in 30 mins?" not "Meetup next month"
- **Travel companion tracking:** Get notified when past friends are nearby
- **Activity-based matching:** Lower social anxiety through shared activities
- **Builder marketplace:** Monetize from day 1 with verified van builders

### Business Model
- **Free tier:** Network effects (create/join activities within 10 miles). Connect and Network with van lifers
- **Nomad Plus ($4.99/mo):** Extended radius, companion tracking
- **Builder Pro ($19.99/mo):** For van builders/mechanics
- **Transaction fees (20%):** Builder marketplace bookings

---

## 2. The Problem

### Primary Pain Point: "The Invisible Loneliness Tax"

**Research Findings:**

From Reddit, blogs, and van-life communities, we discovered:

1. **Constant Goodbyes = #1 Reason People Quit**
   - "The constant goodbyes and lack of deeper connections become a significant downside"
   - "Losing relationships as I struggle to build new ones always brings with it an aching, invisible grief"
   - "I met a lot of couples and groups of friends travelling together, and I started to think that would be nice"

2. **Loneliness vs. Independence Paradox**
   - Van-lifers crave connection but fear dependency
   - "Terrified I would fall into the deathtrap of needing a man in my life again"
   - They want micro-connections, not commitments

3. **Current Solutions Fail at Addressing This**
   - **Sēkr:** Focuses on campsites, not emotional connection. Users complain: "Too expensive for what you get," "requires cell signal," trying to do everything
   - **Driftr:** Failed to launch (didn't reach crowdfunding goal). Tried to solve everything at once
   - **Dating apps:** Wrong problem. Not everyone is looking for romance
   - **Facebook groups:** Large planned events (20+ people), not spontaneous small gatherings
   - **Punta:** Digital nomad app with "difficult to connect" complaints, forces travel dates

### What Van-Lifers Actually Want (From Research)
1. Spontaneous connection (not planned weeks ahead)
2. Small gatherings (2-5 people, not 50-person meetups)
3. Activity-based bonding (not just "let's hang out")
4. Reconnection with past friends when nearby again
5. Safety/trust (invite-only, verification)

### The Market Opportunity
- Van-life is growing exponentially (especially post-pandemic)
- Solo van-lifers are 60% women, 40% men
- Existing solutions are either too broad (Sēkr) or non-existent (Driftr failed)
- Nobody owns the "emotional infrastructure" space

---

## 3. The Solution

### Core Concept
**Campfire Circles is an app that reduces the emotional cost of van-life through hyper-local, ephemeral micro-connections and tracked travel companions.**

### How It Works (User Journey)

#### For New Users:
1. **Download app** → Simple onboarding
2. **Create profile** → Name, photo, van type, interests
3. **Grant location permissions** → Explained as "so you can find people nearby"
4. **Browse activities** → See activities within 5-10 miles (free tier)
5. **Join an activity** → "Coffee at Sunrise Café in 30 mins" (3/5 spots filled)
6. **Show up & connect** → Simple chat before/during activity
7. **Add to Travel Companions** → Remember this person
8. **Get notified later** → "Sarah is within 100 miles! Want to reconnect?"

#### For Returning Users:
1. **Open app** → See nearby activities and travel companions and places visted
2. **Create activity** → "Campfire tonight at 7pm, Moab BLM land" (max 5 people)
3. **Get notifications** → When companions are nearby, when activities fill up
4. **Builder marketplace** → Post "Need help with solar install" or browse verified builders

### What Makes This Different

| Feature | Campfire Circles | Sēkr | Dating Apps | Facebook Groups |
|---------|------------------|------|-------------|-----------------|
| **Focus** | Emotional connection | Campsite discovery | Romance | Event planning |
| **Timing** | Spontaneous (0-48 hours) | Planned events | Varies | Weeks in advance |
| **Group Size** | Micro (2-5 people) | Large gatherings | 1-on-1 | 20+ people |
| **Key Innovation** | Travel companion tracking | Community calendar | Matching algorithm | Group discussions |
| **Emotional Value** | Reduce goodbye grief | Find campsites | Find romance | Community advice |

---

## 4. Target Users

### Primary Persona: "Solo Sarah"
- **Age:** 28-35
- **Occupation:** Remote worker (digital nomad)
- **Van-life experience:** 1-2 years full-time
- **Gender:** Female (60% of solo van-lifers)
- **Pain points:**
  - Loves the freedom but struggles with loneliness
  - Has met amazing people but lost touch with most
  - Wants spontaneous connections, not big planned events
  - Anxious about safety (prefers verified community)
  - Needs help with van repairs but doesn't know who to trust
- **Goals:**
  - Make meaningful connections that don't require commitment
  - Reconnect with people when paths cross again
  - Find trusted builders for van maintenance
  - Feel less lonely without giving up freedom

### Secondary Persona: "Couple Chris & Jamie"
- **Age:** 30-40
- **Occupation:** Mix of remote work and savings
- **Van-life experience:** 6 months - 2 years
- **Gender:** Mixed couples
- **Pain points:**
  - Want to meet other couples (not singles)
  - Struggle to find activity partners (hiking, climbing, surfing)
  - Miss having "couple friends"
- **Goals:**
  - Meet other couples for activities
  - Build a travel family (recurring connections)
  - Share van-life tips and experiences

### Tertiary Persona: "Builder Ben"
- **Age:** 35-50
- **Occupation:** Van builder / Mechanic (full-time or side hustle)
- **Location:** Based in van-life hotspots (Moab, Sedona, PNW, Colorado)
- **Pain points:**
  - Hard to reach traveling van-lifers
  - Inconsistent income
  - No centralized marketplace
- **Goals:**
  - Get discovered by van-lifers needing help
  - Build reputation through reviews
  - Earn steady income from bookings

---

## 5. Core Features

### MVP Features (4-Week Build)

#### Phase 1: Core Social Features (Week 1-2)

**1. User Profiles**
- Name, profile photo, bio (100 chars max)
- Van type (Class B, Sprinter, School Bus, etc.)
- Interests/Activities (hiking, climbing, cooking, photography, etc.)
- "Show-up rate" (visible after 3+ activities)
- Instagram handle (optional, for verification)

**2. Location Sharing**
- Opt-in location services
- Choose radius: 5, 10, 20, 50 miles (free tier limited to 10 miles)
- "Hide my location" toggle (pause visibility)
- Last active timestamp

**3. Activity Creation & Discovery**
- **Create Activity Form:**
  - Title (e.g., "Coffee at sunrise")
  - Category: Coffee/meals, Hiking, Campfire, Van help, Skills share, Other
  - Date/time (today, tomorrow, custom)
  - Location (pin on map or text description)
  - Max participants (2-10, recommended 2-5)
  - Description (200 chars)
  - Public/invite-only toggle

- **Activity Feed:**
  - Sorted by: Distance → Time → Spots available
  - Filter by: Category, Time window, Distance
  - Visual indicators: "Filling up fast!" "Today!" "Last spot!"
  - One-tap "I'm interested" button
  - Shows creator profile + show-up rate

**4. Simple In-App Chat**
- Per-activity group chat (auto-created when 2+ people join)
- Text messages only (images in post-MVP)
- Push notifications for new messages
- Auto-archive 48 hours after activity time

**5. Safety & Trust Features**
- Report/block users
- Activity reporting ("This didn't happen" or "Unsafe person")
- Verified badge (for Builder Pro tier or invite-only users)
- Safety tips on first use: "Meet in public, tell someone where you're going"

#### Phase 2: Travel Companions (Week 2-3)

**6. Travel Companion System**
This is the **killer feature** that creates long-term retention.

**How it Works:**
- After an activity, users can "Add to Travel Companions"
- App requests background location permission (explained clearly)
- System checks every 6 hours: Are any companions within 100 miles?
- If yes: Send push notification: "Sarah is within 100 miles! Last time you met in Moab. Want to reconnect?"
- User can create a reunion activity with one tap

**Companion List View:**
- Shows all travel companions (name, photo, last location, last met date)
- Sorted by: Distance → Last met date
- "Reach out" button (creates pre-filled activity invite)
- Map view showing all companions' approximate locations (city-level, not exact)

**Privacy Controls:**
- Users can remove companions (they won't know)
- Hide location from specific companions
- Disable tracking entirely (lose access to this feature)

**Technical Implementation:**
- Background location updates every 6 hours (battery efficient)
- Geofencing with 100-mile radius per companion
- Push notifications using OneSignal or Firebase Cloud Messaging
- Store last-known location (city/state level) in database

#### Phase 3: Builder Marketplace (Week 3-4)

**7. Post Help Requests**
- **Request Form:**
  - Title (e.g., "Need solar panel installation")
  - Category: Electrical, Plumbing, Carpentry, Mechanical, General
  - Description (500 chars)
  - Photos (3 max)
  - Budget range (slider: $100-$5000+)
  - Urgency: ASAP, This week, Flexible
  - Location (current location or custom)

- **Browse Requests (Builder View):**
  - Filter by: Category, Location, Budget, Urgency
  - "Express interest" button (sends notification to requester)
  - Shows distance from builder's location

**8. Builder Profiles**
- All standard profile features +
- Specialties (electrical, solar, plumbing, etc.)
- Hourly rate or project-based pricing
- Portfolio photos (10 max)
- Verification badge (Builder Pro tier)
- Reviews & ratings (5-star system)
- Response time (average)
- Completed jobs count

**9. Booking & Payment System**
- **Request/Response Flow:**
  1. Van-lifer posts request
  2. Builders express interest
  3. Van-lifer reviews builder profiles
  4. Van-lifer selects builder and confirms booking
  5. Payment held in escrow (Stripe Connect)
  6. Job completed → Payment released
  7. Both parties leave reviews

- **Payment via RevenueCat/Stripe:**
  - 20% platform fee (transparent to both parties)
  - Stripe Connect for escrow
  - Automatic payouts to builders (weekly)

**10. Review System**
- 5-star rating
- Written review (200 chars)
- Categories: Quality, Timeliness, Communication, Value
- Photos of completed work (optional)
- Response from builder (optional)

#### Phase 4: Polish & Onboarding (Week 4)

**11. Onboarding Flow**
- **Screen 1:** "Stop losing people you care about" (emotional hook)
- **Screen 2:** "Find spontaneous activities nearby" (show activity feed example)
- **Screen 3:** "Reconnect when paths cross again" (show companion notification)
- **Screen 4:** Create profile (name, photo, van type)
- **Screen 5:** Grant location permissions (explain why)
- **Screen 6:** Browse activities (first-time user experience)

**12. Premium Subscription Gates**
- Free tier: 10-mile radius, 3 visible nearby users, 1 builder request/month
- Nomad Plus: 50-mile radius, unlimited users visible, unlimited builder requests, companion tracking, activity history
- Paywall appears when:
  - User tries to expand radius beyond 10 miles
  - User tries to add 4th travel companion
  - User views companion notification details

**13. Push Notification System**
- **Activity notifications:**
  - "Your activity is filling up fast!" (when 80% full)
  - "Reminder: Coffee meetup in 1 hour" (1 hour before)
  - "Sarah joined your activity!" (immediate)

- **Companion notifications:**
  - "Chris is within 100 miles! Want to reconnect?" (immediate when detected)
  - "You haven't checked in with Jamie in 3 months. Want to see if you're nearby?" (retention nudge)

- **Builder notifications:**
  - "3 new help requests near you" (daily digest)
  - "Van-lifer accepted your proposal!" (immediate)

### Post-MVP Features (Months 2-6)

**Phase 5: Enhanced Social**
- Photo sharing in activities
- Video profiles
- Shared photo albums (per activity)
- "Van-versary" celebrations (time since you went full-time)

**Phase 6: Advanced Companion Features**
- Companion groups (travel with multiple people)
- Route sharing ("I'm heading to Colorado next month")
- Shared trip planning
- Companion heatmap (where you've met people)

**Phase 7: Gamification**
- "Connection streak" (days in a row meeting people)
- Badges: "Early bird" (5am activities), "Campfire keeper" (10 campfires), "Travel family" (10+ companions)
- Leaderboard (most connections in your area)

**Phase 8: Community Features**
- Regional hubs (PNW, Southwest, East Coast)
- Monthly challenges ("Meet 5 new people this month")
- Nomad stories (user-generated content)
- Van-life events calendar integration

---

## 6. User Experience (UX) Design

### Design Principles

1. **Spontaneity Over Planning**
   - Activities expire quickly (24-48 hours)
   - One-tap actions ("Join," "Create," "Reconnect")
   - No complex scheduling or calendar integrations

2. **Micro-Connections Over Mass Events**
   - Default max participants: 5
   - Intimate, low-stakes activities
   - Activity-based, not profile-based matching

3. **Grief Reduction Over Social Networking**
   - Companion tracking is the hero feature
   - Emotional language: "Don't lose touch" not "Make friends"
   - Notifications framed as reunions, not introductions

4. **Safety Through Simplicity**
   - Clear verification badges
   - Public activities default
   - Report/block always accessible
   - No private messaging (only group activity chats)

5. **Mobile-First, Thumb-Friendly**
   - All actions within thumb reach
   - Minimum text input
   - Large tap targets (48x48px minimum)
   - Works offline (cached activities and companions)

### Information Architecture

```
App Structure:
├── Tab 1: NEARBY (Default view)
│   ├── Activities feed (sorted by distance/time)
│   ├── Filter/sort controls
│   └── "Create Activity" FAB button
│
├── Tab 2: COMPANIONS
│   ├── Companion list (sorted by distance)
│   ├── Map view toggle
│   ├── "Nearby now" section (companions within 50 miles)
│   └── "Add new companion" (manual add by username)
│
├── Tab 3: BUILDER HELP
│   ├── Browse requests (for builders)
│   ├── My requests (for van-lifers)
│   ├── "Post Request" button
│   └── Saved builders
│
├── Tab 4: PROFILE
│   ├── Edit profile
│   ├── Activity history
│   ├── Settings (location, notifications, privacy)
│   ├── Upgrade to Nomad Plus
│   └── Help & Support
│
└── Overlays:
    ├── Activity detail view
    ├── Companion detail view
    ├── Chat view (per activity)
    ├── Create activity flow (3 screens)
    └── Post help request flow (2 screens)
```

### Key UX Flows

#### Flow 1: Join an Activity (First-Time User)
```
1. Open app → Onboarding (3 screens) → Grant location
2. Land on NEARBY tab → See activities feed
3. Tap activity → See details (creator, time, location, description)
4. Tap "I'm interested" → Auto-join (no confirmation needed)
5. Activity creator gets notification
6. Group chat auto-created → Start chatting
7. 1 hour before: Push notification reminder
8. After activity: "Add to Travel Companions?" prompt
```

**Design Notes:**
- No friction to join (one tap, no forms)
- Clear expectations (time, location, who's coming)
- Auto-reminders (reduce no-shows)
- Post-activity prompt (capture companions immediately)

#### Flow 2: Create an Activity
```
1. Tap FAB button (floating action button) on NEARBY tab
2. Screen 1: Select category (Coffee, Hiking, Campfire, etc.) → Visual icons
3. Screen 2: Fill details
   - Title (auto-suggestions based on category)
   - Time (Today, Tomorrow, Custom) → Date/time picker
   - Location (Current location, Pin on map, Text input)
   - Max participants (slider: 2-10, default 5)
   - Description (optional, 200 chars)
4. Screen 3: Review & post
5. Activity appears in feed immediately
6. Creator gets notifications as people join
```

**Design Notes:**
- Progressive disclosure (3 screens, not one long form)
- Smart defaults (current location, max 5, today)
- Visual category selection (icons, not dropdown)
- Immediate visibility (no approval needed)

#### Flow 3: Companion Reconnection
```
1. Background: App checks location every 6 hours
2. Companion within 100 miles detected
3. Push notification: "Sarah is within 100 miles! Last time you met in Moab. Want to reconnect?"
4. User taps notification → Opens companion detail view
5. See: Sarah's profile, last met date/location, shared photo (if any)
6. Tap "Create reunion activity" → Pre-filled activity form
   - Title: "Reconnect with Sarah"
   - Location: Midpoint between you and Sarah
   - Time: Next available (today evening or tomorrow)
7. Edit if needed → Post
8. Sarah gets notification: "Chris wants to reconnect! Join this activity?"
9. Sarah taps → Auto-join → Chat opens
```

**Design Notes:**
- Emotional framing ("reconnect" not "meet again")
- Context reminder (last met date/location)
- Pre-filled form (one-tap to post)
- Direct notification to companion (not public activity)

#### Flow 4: Builder Marketplace Transaction
```
VAN-LIFER SIDE:
1. Tap BUILDER HELP tab
2. Tap "Post Request"
3. Screen 1: Category + Description + Photos
4. Screen 2: Budget + Urgency + Location
5. Post request → Visible to nearby builders
6. Receive notifications as builders express interest
7. Tap notification → See builder profiles (ratings, portfolio, rate)
8. Select builder → Confirm booking → Payment held in escrow
9. Job completed → Release payment + Leave review

BUILDER SIDE:
1. Tap BUILDER HELP tab → See requests feed
2. Filter by category/location/budget
3. Tap request → See details + requester profile
4. Tap "Express interest" → Notification sent to requester
5. If selected: Accept booking → Job details + Chat with requester
6. Complete job → Request payment release
7. Payment received (minus 20% fee) → Leave review
```

**Design Notes:**
- Escrow payment (builds trust on both sides)
- Transparent fees (20% shown upfront)
- Review system (quality control)
- Direct chat (logistics coordination)

### UI Design Guidelines

#### Color Palette
- **Primary:** Warm Milk colour - Campfire, warmth, connection
- **Secondary:** Deep - Adventure, nature, trust
- **Accent:** Sunset - Highlights, CTAs
- **Neutrals:** 
  - Background: Off-white (#FAF9F6)
  - Text: Charcoal (#2C2C2C)
  - Borders: Light gray (#E0E0E0)

**Rationale:** Warm, inviting colors that evoke campfire gatherings and natural landscapes. High contrast for outdoor visibility.

#### Typography
Bungee
- **Display and Headings:**Clash Display Semibold
- **Section Headings and Emphasis:** Space Grotesk Medium
- **Body:** Inter Regular (readable, neutral, accessible)
- **UI Labels:** Inter Medium (clear, legible at small sizes)



#### Iconography
- **Style:** Rounded, friendly, hand-drawn feel
- **Examples:**
  - Coffee cup (Coffee/meals)
  - Mountain (Hiking)
  - Campfire (Campfire)
  - Wrench (Van help)
  - Star (Skills share)
  - Compass (Companions)
  - Map pin (Location)

Import icons from: https://icon-sets.iconify.design/

**Rationale:** Approachable, not corporate. Matches the van-life aesthetic.

#### Component Library

**1. Activity Card (Feed Item)**
```
┌─────────────────────────────────────┐
│ [Icon] Coffee at Sunrise            │ ← Title + category icon
│ 📍 0.8 miles • ⏰ Today 7am         │ ← Location + time
│ 👤 Sarah • 3/5 spots                │ ← Creator + spots filled
│ ⭐ 4.8 show-up rate                 │ ← Trust indicator
│ ─────────────────────────────────── │
│ "Let's watch sunrise and chat       │ ← Description (truncated)
│  about van builds..."               │
│ ─────────────────────────────────── │
│             [I'm Interested]        │ ← CTA button
└─────────────────────────────────────┘
```

**Design specs:**
- Card height: 180px
- Corner radius: 12px
- Shadow: 0px 2px 8px rgba(0,0,0,0.1)
- Button: Full-width, 48px height, primary color

**2. Companion Card (List Item)**
```
┌─────────────────────────────────────┐
│ [Photo] Sarah                       │ ← Profile photo + name
│         📍 84 miles away            │ ← Distance (live)
│         Last met: Moab, Oct 2025    │ ← Context
│ ─────────────────────────────────── │
│ [Reconnect]          [View Profile] │ ← Action buttons
└─────────────────────────────────────┘
```

**Design specs:**
- Photo: 60x60px, circular
- Card height: 100px
- Buttons: 40% width each, secondary style

**3. Notification Styles**

**Companion nearby:**
```
🎉 Sarah is within 100 miles!
Last time you met in Moab. Want to reconnect?
[View Details] [Not Now]
```

**Activity reminder:**
```
⏰ Your coffee meetup starts in 1 hour
3 people are waiting at Sunrise Café
[Open Directions] [Chat]
```

**Design specs:**
- Rich notification with action buttons
- High-priority (vibrate + sound)
- Inline images for companion notifications

### Accessibility

**Requirements:**
- WCAG 2.1 AA compliance minimum
- Color contrast ratio ≥ 4.5:1 for body text
- Color contrast ratio ≥ 3:1 for UI components
- Tap targets ≥ 48x48px
- Screen reader support (iOS VoiceOver, Android TalkBack)
- Dynamic type support (text scales with system settings)
- Keyboard navigation support (for future web version)

**Testing:**
- Color blindness simulation (Deuteranopia, Protanopia, Tritanopia)
- Screen reader testing on all key flows
- One-handed use testing (thumb-reach heatmap)

### Offline Experience

**Cached Data:**
- Last 50 activities viewed (24-hour cache)
- All travel companions (synced every 6 hours)
- User's own profile and activity history
- Map tiles for current region (10-mile radius)

**Offline UI:**
- Banner: "You're offline. Showing cached activities."
- Create activity: "Will post when online"
- Companion tracking: "Location updates paused"
- No error states (graceful degradation)

**Rationale:** Van-lifers often have spotty cell service. The app must work in low/no connectivity areas.

---

## 7. Technical Architecture

### Technology Stack

#### Mobile Apps

**iOS (Primary Platform)**
- **Framework:** SwiftUI (native, modern, performant)
- **Min version:** iOS 15+ (covers 95% of users)
- **Architecture:** MVVM (Model-View-ViewModel)
- **Dependencies:**
  - Firebase SDK (auth, firestore, storage, cloud messaging)
  - MapKit (native maps, best performance)
  - CoreLocation (background location tracking)
  - RevenueCat SDK (subscription management)
  - Stripe SDK (marketplace payments)

**Android (Secondary Platform)**
- **Framework:** Kotlin + Jetpack Compose (native, modern)
- **Min version:** Android 8+ (API 26, covers 93% of users)
- **Architecture:** MVVM with Android Architecture Components
- **Dependencies:**
  - Firebase SDK (same as iOS)
  - Google Maps SDK
  - FusedLocationProvider (location tracking)
  - RevenueCat SDK
  - Stripe SDK

**Rationale:** Native apps for best performance, battery life, and platform integration. SwiftUI/Compose are modern, declarative, and fast to develop with.

#### Backend

**Infrastructure:**
- **Hosting:** 
- **Database:** 
- **Storage:** 
- **Functions:** 
- **Authentication:** 

**API Layer:**
- RESTful API for core operations (CRUD)
- WebSocket for real-time chat (Firestore listeners)
- Webhooks for Stripe events (payment processing)
- Background jobs for companion tracking (Cloud Functions scheduled)

**Third-Party Services:**
- **RevenueCat:** Subscription management (required for hackathon)
- **Stripe Connect:** Marketplace payments (escrow, payouts)
- **OneSignal or Firebase Cloud Messaging:** Push notifications
- **Mapbox (optional):** Enhanced maps if needed
- **Cloudinary (optional):** Image optimization/CDN

**Rationale:** Firebase is fast to set up, scales well, has excellent mobile SDKs, and includes everything needed for MVP (auth, database, storage, hosting, functions).

### Database Schema

**Collections:**

**1. `users`**
```javascript
{
  userId: "string (firestore doc ID)",
  name: "string",
  profilePhoto: "string (storage URL)",
  bio: "string (max 100 chars)",
  vanType: "string (enum: sprinter, classb, schoolbus, other)",
  interests: ["hiking", "photography", ...],
  instagramHandle: "string (optional)",
  showUpRate: "number (0-5, calculated)",
  isVerified: "boolean",
  subscriptionTier: "string (enum: free, nomad_plus, builder_pro)",
  location: {
    latitude: "number",
    longitude: "number",
    city: "string",
    state: "string",
    lastUpdated: "timestamp"
  },
  locationPermission: "boolean",
  createdAt: "timestamp",
  lastActive: "timestamp"
}
```

**2. `activities`**
```javascript
{
  activityId: "string (firestore doc ID)",
  creatorId: "string (userId ref)",
  title: "string",
  category: "string (enum: coffee, hiking, campfire, vanhelp, skills, other)",
  dateTime: "timestamp",
  location: {
    latitude: "number",
    longitude: "number",
    description: "string"
  },
  maxParticipants: "number (2-10)",
  currentParticipants: ["userId1", "userId2", ...],
  description: "string (max 200 chars)",
  isPublic: "boolean",
  status: "string (enum: active, full, cancelled, completed)",
  createdAt: "timestamp",
  expiresAt: "timestamp"
}
```

**3. `companions`**
```javascript
{
  companionId: "string (firestore doc ID)",
  userId1: "string (userId ref)",
  userId2: "string (userId ref)",
  firstMet: {
    date: "timestamp",
    location: "string (city, state)",
    activityId: "string (optional)"
  },
  lastMet: {
    date: "timestamp",
    location: "string (city, state)"
  },
  sharedActivities: ["activityId1", "activityId2", ...],
  notificationEnabled: "boolean",
  createdAt: "timestamp"
}
```

**4. `builderRequests`**
```javascript
{
  requestId: "string (firestore doc ID)",
  requesterId: "string (userId ref)",
  title: "string",
  category: "string (enum: electrical, plumbing, carpentry, mechanical, general)",
  description: "string (max 500 chars)",
  photos: ["storageURL1", "storageURL2", ...],
  budget: {
    min: "number",
    max: "number"
  },
  urgency: "string (enum: asap, thisweek, flexible)",
  location: {
    latitude: "number",
    longitude: "number",
    description: "string"
  },
  status: "string (enum: open, in_progress, completed, cancelled)",
  interestedBuilders: ["userId1", "userId2", ...],
  selectedBuilder: "string (userId ref, optional)",
  createdAt: "timestamp",
  expiresAt: "timestamp"
}
```

**5. `bookings`**
```javascript
{
  bookingId: "string (firestore doc ID)",
  requestId: "string (builderRequest ref)",
  clientId: "string (userId ref)",
  builderId: "string (userId ref)",
  agreedPrice: "number",
  status: "string (enum: pending, confirmed, in_progress, completed, cancelled)",
  paymentStatus: "string (enum: pending, held, released, refunded)",
  stripePaymentIntent: "string",
  scheduledDate: "timestamp",
  completedDate: "timestamp (optional)",
  createdAt: "timestamp"
}
```

**6. `reviews`**
```javascript
{
  reviewId: "string (firestore doc ID)",
  bookingId: "string (booking ref)",
  reviewerId: "string (userId ref)",
  revieweeId: "string (userId ref)",
  rating: "number (1-5)",
  categories: {
    quality: "number (1-5)",
    timeliness: "number (1-5)",
    communication: "number (1-5)",
    value: "number (1-5)"
  },
  comment: "string (max 200 chars)",
  photos: ["storageURL1", "storageURL2", ...],
  response: "string (optional, from reviewee)",
  createdAt: "timestamp"
}
```

**7. `chats`**
```javascript
{
  chatId: "string (activityId or bookingId)",
  participants: ["userId1", "userId2", ...],
  messages: [
    {
      messageId: "string",
      senderId: "string (userId ref)",
      text: "string",
      timestamp: "timestamp",
      readBy: ["userId1", "userId2", ...]
    }
  ],
  createdAt: "timestamp",
  lastMessageAt: "timestamp"
}
```

**8. `notifications`**
```javascript
{
  notificationId: "string (firestore doc ID)",
  userId: "string (userId ref)",
  type: "string (enum: companion_nearby, activity_reminder, activity_joined, builder_interest, booking_confirmed)",
  title: "string",
  body: "string",
  data: "object (context-specific)",
  isRead: "boolean",
  createdAt: "timestamp"
}
```

### API Endpoints

**Authentication:**
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login existing user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh auth token

**Users:**
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update user profile
- `POST /users/:userId/location` - Update user location
- `GET /users/nearby` - Get users within radius

**Activities:**
- `GET /activities` - List activities (with filters: radius, category, time)
- `POST /activities` - Create new activity
- `GET /activities/:activityId` - Get activity details
- `PUT /activities/:activityId` - Update activity
- `DELETE /activities/:activityId` - Cancel activity
- `POST /activities/:activityId/join` - Join activity
- `DELETE /activities/:activityId/leave` - Leave activity

**Companions:**
- `GET /companions` - List user's travel companions
- `POST /companions` - Add new companion
- `DELETE /companions/:companionId` - Remove companion
- `GET /companions/nearby` - Check if companions are nearby (background job)

**Builder Marketplace:**
- `GET /builder-requests` - List builder requests (with filters)
- `POST /builder-requests` - Create new request
- `GET /builder-requests/:requestId` - Get request details
- `POST /builder-requests/:requestId/interest` - Express interest (builder)
- `POST /bookings` - Create booking (accept builder proposal)
- `PUT /bookings/:bookingId/complete` - Mark booking complete
- `POST /bookings/:bookingId/payment/release` - Release payment

**Payments (via Stripe/RevenueCat):**
- `POST /subscriptions/checkout` - Create subscription checkout session
- `POST /subscriptions/cancel` - Cancel subscription
- `GET /subscriptions/status` - Check subscription status
- `POST /payments/intent` - Create payment intent (marketplace)
- `POST /webhooks/stripe` - Handle Stripe webhooks

**Chat:**
- `GET /chats/:chatId/messages` - Get chat messages
- `POST /chats/:chatId/messages` - Send message
- `PUT /chats/:chatId/read` - Mark messages as read

### Background Jobs (Cloud Functions)

**1. Companion Tracking Job**
- **Frequency:** Every 6 hours
- **Logic:**
  1. Query all users with location permission enabled
  2. For each user, check all their companions' last-known locations
  3. If any companion is within 100 miles AND wasn't nearby last check:
     - Send push notification
     - Create notification document
  4. Update last-checked timestamp

**2. Activity Expiration Job**
- **Frequency:** Every hour
- **Logic:**
  1. Query activities with expiresAt < now AND status = active
  2. Update status to "expired"
  3. Archive activity chats

**3. Reminder Notifications Job**
- **Frequency:** Every 15 minutes
- **Logic:**
  1. Query activities with dateTime between (now + 45min) and (now + 75min)
  2. For each activity, send reminders to all participants who haven't been notified

**4. Subscription Status Sync**
- **Frequency:** Daily
- **Logic:**
  1. Query RevenueCat API for all active subscriptions
  2. Update user subscriptionTier in database
  3. Handle expired/cancelled subscriptions

**5. Show-Up Rate Calculator**
- **Frequency:** After each activity completes
- **Logic:**
  1. Check if user showed up (creator marks attendance)
  2. Calculate: (shows / total activities joined) * 5
  3. Update user's showUpRate field

### Security & Privacy

**Firebase Security Rules:**

**Users collection:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own profile and any public profiles
      allow read: if request.auth != null;
      // Users can only update their own profile
      allow update: if request.auth.uid == userId;
      // Users can create their own profile on signup
      allow create: if request.auth.uid == userId;
    }
  }
}
```

**Activities collection:**
```javascript
match /activities/{activityId} {
  // Anyone authenticated can read public activities
  allow read: if request.auth != null && resource.data.isPublic == true;
  // Creator can update/delete their own activities
  allow update, delete: if request.auth.uid == resource.data.creatorId;
  // Any authenticated user can create activities
  allow create: if request.auth != null;
}
```

**Privacy Features:**
- Location shared at city-level publicly (not exact coordinates)
- Exact location only shared with activity participants
- Users can hide location entirely (pause visibility)
- Companions can be removed without notifying the other person
- Background location data encrypted at rest
- No personal data sold or shared with third parties

**Data Retention:**
- Activity data: 90 days after expiration
- Chat messages: 90 days after activity
- Location history: 30 days rolling window
- User profiles: Until account deletion
- Payment data: 7 years (legal requirement)

### Performance Optimization

**Database Indexing:**
```javascript
// Firestore composite indexes
activities:
  - [location, dateTime, status]
  - [creatorId, status, createdAt]
  - [category, status, dateTime]

companions:
  - [userId1, createdAt]
  - [userId2, createdAt]

builderRequests:
  - [location, category, status]
  - [requesterId, status, createdAt]
```

**Caching Strategy:**
- User profiles: 5-minute cache
- Activities feed: 30-second cache
- Companion list: 5-minute cache
- Builder requests: 1-minute cache

**Image Optimization:**
- Profile photos: Compressed to 200x200px, WebP format
- Activity photos: Compressed to 1200x900px, WebP format
- Lazy loading for image feeds
- CDN delivery via Firebase Storage

**Battery Optimization:**
- Background location: Every 6 hours (not continuous)
- Use significant location change API (iOS) / Geofencing (Android)
- Batch notifications (don't wake device for each update)

---

## 8. Monetization Strategy

### Revenue Streams

**1. Subscriptions (via RevenueCat)**

**Free Tier: "Wanderer"**
- Create/join activities within 10 miles
- See 3 nearby users at a time
- Basic messaging
- 1 builder request per month
- **Goal:** Network effects, critical mass

**Nomad Plus: $4.99/month or $39.99/year (17% discount)**
- Extended radius (5-50 miles adjustable)
- See all nearby users
- **Travel companion tracking** (killer feature)
- Priority in activity feeds
- Unlimited builder requests
- Activity history & stats
- **Goal:** Core power users (target 15-20% conversion)

**Builder Pro: $19.99/month**
- All Nomad Plus features +
- Verified builder badge
- Featured in marketplace search
- Direct booking system
- First 5 jobs per month: 0% platform fee (after that, 20%)
- Analytics dashboard (requests viewed, response rate, etc.)
- **Goal:** Supply side of marketplace (target 50+ builders in year 1)

**2. Transaction Fees: 20%**
- Charged on all builder marketplace bookings
- Standard rate across industry (Airbnb 15-20%, Upwork 20%, TaskRabbit 15%)
- Transparent to both parties (shown before booking)
- **Goal:** $5-10K MRR within 6 months post-launch

### Pricing Psychology

**Why $4.99 for Nomad Plus?**
- Price anchored below standard app subscriptions ($9.99)
- Feels accessible, not premium
- Yearly plan ($39.99) saves $20, encourages commitment
- Target market (van-lifers) is cost-conscious

**Why $19.99 for Builder Pro?**
- Positioned as a business tool (not personal)
- Builders will earn $100-500+ per job, so $20/month is 4-20% of one job
- First 5 jobs per month with 0% fee = potential $1,000+ in savings
- Price signals quality/seriousness

**Freemium Conversion Funnel:**
```
100 free users
↓ (15-20% convert to Nomad Plus)
15-20 Nomad Plus subscribers @ $4.99/mo = $75-100/mo
↓ (5-10% of free users post builder requests)
5-10 builder requests @ $200 avg × 20% fee = $200-400/mo per 100 users

At 5,000 users:
- 750-1,000 Nomad Plus = $3,750-5,000/mo
- 250-500 builder requests @ $200 avg = $10,000-20,000 × 20% = $2,000-4,000/mo
- 50 Builder Pro = $1,000/mo
Total: ~$6,750-10,000/mo = $81K-120K ARR
```

### RevenueCat Integration

**Setup:**
1. Create RevenueCat account and project
2. Configure entitlements:
   - `nomad_plus` (Nomad Plus features)
   - `builder_pro` (Builder Pro features)
3. Create product offerings:
   - `nomad_plus_monthly` ($4.99/month)
   - `nomad_plus_yearly` ($39.99/year)
   - `builder_pro_monthly` ($19.99/month)
4. Configure iOS App Store Connect and Google Play Console products
5. Add RevenueCat SDK to iOS/Android apps

**Code Implementation:**
```swift
// iOS example
import RevenueCat

// Configure on app launch
Purchases.configure(withAPIKey: "your_api_key")

// Check subscription status
Purchases.shared.getCustomerInfo { (customerInfo, error) in
  if customerInfo?.entitlements["nomad_plus"]?.isActive == true {
    // User has Nomad Plus access
    enableExtendedRadius()
    enableCompanionTracking()
  }
}

// Present paywall
Purchases.shared.getOfferings { (offerings, error) in
  if let offering = offerings?.current {
    // Show paywall UI with offering packages
    presentPaywall(offering: offering)
  }
}

// Handle purchase
Purchases.shared.purchase(package: selectedPackage) { (transaction, customerInfo, error, userCancelled) in
  if customerInfo?.entitlements["nomad_plus"]?.isActive == true {
    // Unlock features
  }
}
```

**Paywall UI:**
- Triggered when user tries to:
  - Expand radius beyond 10 miles
  - Add 4th travel companion
  - View companion notification details
- Design: Simple, benefits-focused, not aggressive
- Copy: "Upgrade to never lose touch with your travel family"
- Social proof: "Join 1,000+ nomads using Campfire Circles Plus"

### Stripe Connect for Marketplace

**Setup:**
1. Create Stripe Connect platform account
2. Configure Connect Express for builders (onboarding flow)
3. Implement escrow payment flow:
   - Client confirms booking → Payment held
   - Job completed → Payment released to builder (minus 20%)
4. Automatic payouts to builders (weekly or instant for fee)

**Payment Flow:**
```
1. Van-lifer confirms booking with builder
2. Stripe PaymentIntent created for $200 (job cost)
3. Payment authorized (held in escrow)
4. Job completed → Van-lifer confirms
5. Payment captured:
   - Builder receives: $160 (80%)
   - Platform receives: $40 (20%)
6. Funds transferred to builder's bank account (7-day rolling basis)
```

**Refund Policy:**
- Full refund if builder cancels before scheduled date
- 50% refund if builder no-shows
- Dispute resolution: Manual review by platform team

---

## 9. Go-to-Market Strategy

### Pre-Launch (Weeks 1-2 of development)

**Goal:** Build anticipation and recruit beta testers

**1. Create Landing Page**
- Simple one-pager: Problem → Solution → Waitlist
- Email capture form
- Testimonials from van-life community (if available)
- "Built for Quin Gable's community" badge

**2. Social Media Teaser Campaign**
- Post in van-life Facebook groups (10+ groups, 50K+ total members)
- Reddit: r/vandwellers, r/vanlife, r/digitalnomad
- Instagram: Partner with Quin to tease the app
- Copy: "What if you never lost touch with the amazing people you meet on the road?"

**3. Recruit 20-30 Beta Testers**
- Target: Active van-lifers in 3 hotspot regions (Moab, Sedona, PNW)
- Incentive: Lifetime Nomad Plus subscription (free forever)
- Requirements: Must be actively traveling, willing to create activities

### Launch (Week 4 - Hackathon submission)

**Goal:** Demonstrate traction and product-market fit to judges

**1. Seed Initial Activities**
- Beta testers create 10-15 activities in each hotspot region
- Ensures day-1 users see active feed (not empty app)
- Mix of activity types (coffee, hiking, campfires)

**2. Submit to Hackathon**
- Demo video (2-3 minutes) - see script below
- Written proposal (1-2 pages)
- TestFlight link for iOS (at least 30 beta users registered)
- Metrics to highlight:
  - X activities created in 3 locations
  - Y successful connections made
  - Z% show-up rate
  - W beta testers converted to paid (if any)

**3. PR Push**
- Submit to Product Hunt (post-hackathon)
- Reach out to van-life influencers for features
- Press release: "New app helps van-lifers stop losing friends"

### Post-Launch (Months 1-6)

**Goal:** Achieve 5,000 users and $10K MRR

**Phase 1: Organic Growth (Month 1-2)**
- Partner with Quin for official launch to her audience
- Incentivize referrals: "Invite a friend, both get 1 month Nomad Plus free"
- Focus on 5 core regions: Moab, Sedona, PNW, Colorado, SoCal
- Goal: 500 users, 20% in hotspots

**Phase 2: Paid Acquisition (Month 3-4)**
- Instagram/Facebook ads targeting van-life interests
- Budget: $2,000-5,000/month
- Target CPA: $10-20 per install
- Goal: 2,000 users, 15% conversion to paid

**Phase 3: Community Building (Month 5-6)**
- Monthly virtual meetups ("Van-life Happy Hours")
- User-generated content campaign: "#CampfireCircles stories"
- Feature spotlight: Showcase successful reconnections
- Goal: 5,000 users, 20% paid conversion, $10K MRR

### Marketing Channels

**Primary Channels:**
1. **Instagram/Facebook ads** (paid, scalable)
   - Target interests: #vanlife, #nomad, #digitalnomad, #rvlife
   - Creative: Real user testimonials, reunion stories
   - Landing page: Direct to App Store/Google Play

2. **Influencer partnerships** (organic, high-trust)
   - Quin Gable (primary)
   - Micro-influencers (10K-100K followers) in van-life niche
   - Offer: Free Nomad Plus for 6 months + rev share on referred users

3. **Content marketing** (SEO, long-term)
   - Blog: "How to make friends as a van-lifer"
   - Blog: "The emotional cost of van-life nobody talks about"
   - Blog: "Interview with solo female van-lifers"
   - Goal: Rank for "van life loneliness" and similar keywords

4. **Community engagement** (organic, authentic)
   - Active presence in Facebook groups
   - Reddit AMAs in r/vandwellers
   - Comment on van-life YouTube videos
   - Position as helpful resource, not salesy

**Secondary Channels:**
- Product Hunt launch (one-time spike)
- App Store Optimization (ASO) - keywords: "van life", "nomad", "travel friends"
- Press outreach (van-life blogs, travel media)
- Partnership with van rental companies (Outdoorsy, RVshare) - co-marketing

### Viral Loop Mechanics

**The Companion Invite Loop:**
```
User A joins activity
↓
Meets User B in person
↓
User A adds User B as companion
↓
User B gets notification: "Sarah added you as a travel companion!"
↓
User B downloads app (if not already user)
↓
Both users reconnect when nearby later
↓
Create new activity together
↓
New users join that activity
↓
Repeat
```

**The Builder Marketplace Loop:**
```
Van-lifer posts help request
↓
Builder completes job successfully
↓
Van-lifer leaves 5-star review
↓
Review visible to other van-lifers
↓
More van-lifers book that builder
↓
Builder refers other builders to platform
↓
More builders = more requests fulfilled
↓
Network effects strengthen
```

**Incentivized Referrals:**
- Referrer: 1 month Nomad Plus free per friend who signs up
- Referee: 50% off first month of Nomad Plus
- Tracked via unique referral links

---

## 10. Success Metrics

### North Star Metric
**Successful Reconnections per Month**

Why this metric?
- Measures the core value prop (reducing goodbye grief)
- Correlates with retention and satisfaction
- Differentiates us from competitors (they don't track this)

Definition: Number of activities created where 2+ participants are existing travel companions

### Key Performance Indicators (KPIs)

#### Acquisition Metrics
- **App installs:** Target 5,000 in 6 months
- **Activation rate:** % who complete onboarding + join/create first activity (Target: 60%)
- **Source breakdown:** Organic vs. paid vs. referral

#### Engagement Metrics
- **DAU/MAU ratio:** Daily Active Users / Monthly Active Users (Target: 25%+)
  - Note: Van-lifers don't use daily, but check when traveling
- **Activities created per user per month:** (Target: 2+)
- **Activities joined per user per month:** (Target: 3+)
- **Show-up rate:** % of joined activities where user actually showed up (Target: 80%+)
- **Companion adds per user:** (Target: 5+ in first 3 months)

#### Retention Metrics
- **D7 retention:** % of users who return 7 days after signup (Target: 40%+)
- **D30 retention:** % of users who return 30 days after signup (Target: 25%+)
- **Companion notification return rate:** % who open app after companion nearby notification (Target: 70%+)

#### Monetization Metrics
- **Free-to-paid conversion rate:** (Target: 15-20%)
- **ARPU:** Average Revenue Per User (Target: $0.75-1.00/month)
- **LTV:** Lifetime Value per user (Target: $50-75 over 12 months)
- **CAC:** Customer Acquisition Cost (Target: <$20)
- **LTV:CAC ratio:** (Target: 3:1 or higher)
- **Builder marketplace GMV:** Gross Merchandise Value (Target: $20K+ in month 6)
- **Take rate:** % of GMV we earn (Fixed at 20%)

#### Product-Specific Metrics
- **Successful reconnections per month:** (Target: 50+ by month 6)
- **Companion tracking opt-in rate:** % who enable location tracking (Target: 70%+)
- **Builder requests per month:** (Target: 100+ by month 6)
- **Builder request fulfillment rate:** % of requests that get booked (Target: 60%+)
- **Builder average job value:** (Target: $200-300)
- **Average review rating:** (Target: 4.5+ stars)

### Hackathon Demo Metrics (Week 4)

To impress judges, showcase:
- **X beta users** (Target: 50-100)
- **Y activities created** (Target: 30-50)
- **Z successful connections made** (Target: 20-30)
- **W% show-up rate** (Target: 75%+)
- **V companions tracked** (Target: 30-50 companion relationships)
- **U paid subscribers** (Target: 5-10, even if discounted/free for beta)
- **$T GMV in builder marketplace** (Target: $500-1,000 if possible)

### Analytics Implementation

**Tools:**
- **Mixpanel or Amplitude:** Event tracking, funnels, cohorts
- **Firebase Analytics:** Basic app analytics, crashlytics
- **RevenueCat Dashboard:** Subscription metrics, MRR, churn
- **Stripe Dashboard:** Marketplace transactions, payouts

**Key Events to Track:**
```javascript
// User lifecycle
- app_installed
- onboarding_started
- onboarding_completed
- location_permission_granted

// Activities
- activity_viewed
- activity_created
- activity_joined
- activity_cancelled
- activity_completed
- activity_no_show

// Companions
- companion_added
- companion_notification_received
- companion_notification_opened
- companion_removed

// Builder marketplace
- request_created
- request_viewed (builder)
- builder_expressed_interest
- booking_created
- booking_completed
- review_submitted

// Monetization
- paywall_viewed
- subscription_started
- subscription_cancelled
- marketplace_transaction_completed
```

---

## 11. Development Timeline

### 4-Week Sprint (MVP for Hackathon)

#### Week 1: Foundation
**Days 1-2: Setup**
- Create Firebase project (auth, firestore, storage, functions)
- Set up iOS Xcode project with SwiftUI
- Set up Android Studio project with Jetpack Compose
- Initialize Git repo, CI/CD pipeline
- Install dependencies (Firebase SDK, RevenueCat, Stripe, Maps)

**Days 3-5: Authentication & Profiles**
- Implement Firebase Auth (email/password)
- Create user profile creation flow (3 screens)
- Design profile UI (name, photo, van type, interests)
- Implement profile editing
- Add profile photo upload (Firebase Storage)

**Days 6-7: Core Activities Feed**
- Design activity card UI
- Implement Firestore queries for nearby activities (geohashing)
- Build activities feed (list view)
- Add filter/sort controls (category, distance, time)
- Implement pull-to-refresh

#### Week 2: Activities & Location
**Days 8-10: Create Activity Flow**
- Design create activity UI (3-screen flow)
- Implement category selection (visual icons)
- Add map picker for location (MapKit/Google Maps)
- Build date/time picker
- Implement activity creation (Firestore write)
- Add real-time activity updates (Firestore listeners)

**Days 11-12: Join Activities & Chat**
- Implement "Join activity" functionality
- Build simple group chat (Firestore sub-collections)
- Add push notification setup (Firebase Cloud Messaging)
- Implement activity reminders (Cloud Function scheduled)

**Days 13-14: Location Services**
- Request location permissions (with clear explanation)
- Implement foreground location tracking
- Add location update API endpoint
- Build "users nearby" query (geohashing)
- Test location accuracy and battery usage

#### Week 3: Travel Companions
**Days 15-16: Companion System**
- Design companion list UI
- Implement "Add to companions" functionality
- Build companion detail view (profile, last met, distance)
- Implement background location tracking (iOS: significant location change, Android: geofencing)
- Add companion location checking (Cloud Function every 6 hours)

**Days 17-18: Companion Notifications**
- Build push notification system for companion proximity
- Design notification UI (rich notifications with actions)
- Implement "Create reunion activity" flow (pre-filled form)
- Test geofencing and notification delivery
- Add companion removal (soft delete, no notification to other user)

**Days 19-21: Builder Marketplace (Part 1)**
- Design builder request form UI
- Implement request creation (photos, budget, urgency)
- Build builder request feed (filter by category, location)
- Add "Express interest" functionality (builder side)
- Implement request detail view

#### Week 4: Polish & Monetization
**Days 22-23: Builder Marketplace (Part 2)**
- Implement booking flow (select builder, confirm)
- Integrate Stripe Connect (payment intent, escrow)
- Build review system (5-star rating, written review)
- Add builder profile page (portfolio, ratings, completed jobs)
- Test end-to-end marketplace transaction

**Days 24-25: RevenueCat Integration & Paywalls**
- Set up RevenueCat project and entitlements
- Configure iOS/Android in-app products
- Implement paywall UI (benefits-focused)
- Add subscription status checking throughout app
- Test subscription flow (purchase, restore, cancel)
- Add feature gates (extended radius, companion tracking, unlimited requests)

**Days 26-27: Onboarding & Polish**
- Design onboarding flow (3 screens with emotional hooks)
- Implement skip functionality (optional onboarding)
- Add empty states (no activities nearby, no companions yet)
- Improve error handling and loading states
- Add haptic feedback for key actions (iOS)
- Optimize images and reduce app size
- Test offline functionality (cached data)

**Day 28: Demo Video & Submission**
- Record demo video (2-3 minutes)
- Write 1-2 page proposal
- Prepare TestFlight/Google Play internal testing links
- Submit to Devpost by 11:59pm PST
- Create presentation slides (optional, for Q&A)

### Post-Hackathon Roadmap (Months 2-6)

**Month 2: Stability & Growth**
- Fix bugs reported by early users
- Improve onboarding conversion (A/B test messaging)
- Add social sharing (share activities to Instagram stories)
- Launch Product Hunt
- Reach 500 users

**Month 3: Enhanced Features**
- Photo sharing in activities
- Video profiles (30-second intro videos)
- Activity categories expansion (yoga, surfing, rock climbing, etc.)
- Improved search and filters
- Reach 1,500 users

**Month 4: Community Building**
- Regional hubs (PNW, Southwest, East Coast)
- Monthly challenges ("Meet 5 new people this month")
- User-generated content features (share van-life stories)
- In-app events calendar
- Reach 3,000 users

**Month 5: Advanced Companion Features**
- Companion groups (travel with multiple people)
- Route sharing ("I'm heading to Colorado next month")
- Shared trip planning
- Companion heatmap (where you've met people)
- Reach 4,000 users

**Month 6: Gamification & Retention**
- Connection streaks (days in a row meeting people)
- Badges and achievements
- Leaderboards (most connections in your area)
- Anniversary celebrations ("One year of van-life!")
- Reach 5,000 users, $10K MRR

---

## 12. Risks & Mitigation

### Critical Risks

**1. Cold Start Problem (No Users = No Activities)**

*Risk:* New users download app, see empty activity feed, uninstall.

*Mitigation:*
- Seed initial activities in 3-5 hotspot locations (Moab, Sedona, PNW, SoCal, Colorado)
- Recruit 20-30 beta testers per region to create activities
- Partner with Quin to launch to her audience simultaneously (instant critical mass)
- Show "Nearby users" count even if no activities (prove others are around)
- Add "Ghost activities" in first week (team members create real activities for testing)

**2. Safety Concerns (Bad Actors, Harassment)**

*Risk:* Users feel unsafe meeting strangers, platform gets bad reputation.

*Mitigation:*
- Invite-only at launch (controlled growth, vetted users)
- Verification through Instagram (proof of van-life, not fake profiles)
- Public activities default (not private 1-on-1 meetups)
- Robust report/block features (immediate suspension pending review)
- Safety tips prominently displayed: "Meet in public, tell someone where you're going"
- Show-up rate visible on profiles (trust indicator)
- Post-activity check-in: "How was this meetup?" (flag problematic users)
- Zero-tolerance policy for harassment (permanent ban)

**3. Location Privacy Concerns**

*Risk:* Users uncomfortable sharing location, especially solo women.

*Mitigation:*
- Opt-in location sharing (clearly explained, not default)
- City-level location publicly (not exact coordinates)
- Exact location only visible to activity participants
- "Hide my location" toggle (pause visibility anytime)
- Background tracking ONLY for companion feature (can be disabled)
- Transparent privacy policy (what we collect, why, how it's used)
- No location data sold or shared with third parties
- Option to remove specific companions from tracking (they won't know)

**4. Platform Dependency (What if Sēkr copies us?)**

*Risk:* Established player (Sēkr) copies companion tracking feature.

*Mitigation:*
- Move fast: Build strong community and brand before they notice
- Network effects: Our users' companions are on our platform, not theirs
- Emotional positioning: We own "grief reduction," they own "campsites"
- Better UX: Laser-focused on one problem, not trying to do everything
- Creator partnership: Quin's endorsement gives us legitimacy and distribution
- Patents/IP: Consider patenting companion tracking algorithm (optional)

**5. Seasonal Usage (Van-life slows in winter)**

*Risk:* User engagement drops 50%+ in winter months.

*Mitigation:*
- Target southern states in winter (Arizona, New Mexico, Texas, Florida)
- Builder marketplace less seasonal (vans need fixes year-round)
- Expand to international markets (southern hemisphere has opposite seasons)
- Offer winter-specific activities (hot springs, desert camping, snowbirding)
- Retention focus: Keep users engaged even when not actively traveling

**6. RevenueCat/Stripe Integration Complexity**

*Risk:* Payment systems fail, lose revenue, bad user experience.

*Mitigation:*
- Allocate 3 full days to payment integration (Days 22-24)
- Test thoroughly with real transactions (small amounts)
- Use RevenueCat's sandbox environment for development
- Implement comprehensive error handling (payment fails, subscription expires, etc.)
- Have backup plan: Manual payment processing if automated fails (temporary)

**7. Show-Up Rate Issues (People don't show up)**

*Risk:* Users create/join activities but don't show up, wastes everyone's time.

*Mitigation:*
- Small activities (2-5 people max) - less intimidating, more commitment
- Short time windows (next few hours, not days away) - less time to cancel
- Reputation system: Show-up rate visible on profiles
- Notifications: Remind 1 hour before, ask for confirmation
- Penalties: Users with <60% show-up rate get flagged, <40% suspended
- Post-activity check-in: "Did everyone show up?" (flag no-shows)

### Technical Risks

**8. Geolocation Accuracy**

*Risk:* Companion tracking sends false notifications (thinks you're nearby when not).

*Mitigation:*
- Use geohashing with 100-mile buffer (not tight boundaries)
- Verify distance with Haversine formula before sending notification
- Rate limit: Max 1 notification per companion per 24 hours
- User feedback: "Is this accurate?" button on notifications
- Adjust algorithm based on feedback (machine learning in future)

**9. Battery Drain**

*Risk:* Background location tracking kills battery, users uninstall.

*Mitigation:*
- Update location every 6 hours only (not continuous tracking)
- Use significant location change API (iOS) / Geofencing (Android) - battery efficient
- Clearly communicate battery usage in permissions request
- Allow users to disable companion tracking (lose feature but save battery)
- Monitor battery usage metrics (iOS Battery Usage API)
- Optimize if > 5% daily battery drain

**10. Firebase Costs**

*Risk:* Database reads/writes exceed free tier, unexpected costs.

*Mitigation:*
- Firestore free tier: 50K reads, 20K writes per day
- Implement aggressive caching (5-minute cache for most data)
- Use Firestore offline persistence (reduces reads)
- Batch writes where possible (update multiple fields in one operation)
- Monitor Firebase usage dashboard weekly
- Budget: $100-200/month for Firebase in first 6 months (acceptable)

---

## 13. Success Criteria for Hackathon

### What Judges Are Looking For

Based on Shipyard Creator Contest criteria:

**1. Audience Fit (30% of score)**
- Does this solve a real problem for Quin Gable's community?
- Is the solution tailored to van-lifers specifically?
- Does it address the brief ("dating, friend-finding, builder help")?

**Our Strength:**
- Solves #1 pain point (loneliness/constant goodbyes) validated by research
- All three features from brief: dating (through activities), friend-finding (companions), builder help (marketplace)
- Unique positioning: "grief reduction" resonates emotionally with van-lifers

**2. Product Quality (25% of score)**
- Is the app functional and polished?
- Does it work smoothly (no crashes, bugs)?
- Is the UX intuitive and delightful?

**Our Strength:**
- Native iOS/Android apps (better performance than web apps)
- SwiftUI/Compose = modern, smooth UX
- Focus on core features (not half-baked bloat)
- Emotional design (warm colors, friendly copy)

**3. Technical Execution (20% of score)**
- Is the code well-architected?
- Are integrations (RevenueCat, maps, location) implemented correctly?
- Is it scalable?

**Our Strength:**
- Firebase backend = proven, scalable infrastructure
- Proper use of RevenueCat SDK (required)
- Background location done right (battery efficient)
- Clean MVVM architecture

**4. Monetization Potential (15% of score)**
- Is the business model viable?
- Are pricing tiers reasonable?
- Is there a path to profitability?

**Our Strength:**
- Multiple revenue streams (subscriptions + marketplace)
- Clear free-to-paid conversion funnel
- 20% marketplace take rate = industry standard
- $10K MRR achievable in 6 months

**5. Innovation (10% of score)**
- Is this a unique approach?
- Does it differentiate from existing solutions?

**Our Strength:**
- Travel companion tracking = nobody else has this
- "Grief reduction" positioning = unique emotional angle
- Hyper-local + ephemeral = different from Sēkr's approach

### Demo Video Script (2:30)

**Opening (0:00-0:20)**
[Show: Person alone in van, looking at phone]

"Hi, I'm [Name]. I've been living in my van for two years. I've met incredible people on the road... and lost touch with most of them. That's the invisible cost of van-life nobody talks about."

**The Problem (0:20-0:50)**
[Show: Reddit posts about van-life loneliness]

"Existing apps like Sēkr focus on finding campsites. Dating apps focus on romance. Facebook groups plan huge events weeks in advance. But nobody solves the core emotional pain: you meet amazing people, and then you never see them again."

[Show: Testimonial quote on screen]
"'The constant goodbyes and lack of deeper connections become a significant downside' - Anonymous van-lifer"

**The Solution (0:50-1:30)**
[Show: App demo on phone]

"Campfire Circles does three things differently:

1. **Spontaneous micro-connections:** 'Coffee in 30 minutes?' not 'Meetup next month.'
   [Show: Creating activity, nearby users joining]

2. **Travel companion tracking:** Remember people you've met. Get notified when you're nearby again.
   [Show: Companion notification appearing, reunion activity being created]

3. **Builder help marketplace:** Need solar installation? Connect with verified builders.
   [Show: Builder request being posted, builders responding]

**The Magic Moment (1:30-1:50)**
[Show: Real user testimonial video or re-enactment]

"Here's Sarah. She met Chris in Moab last summer. They lost touch. Three months later, Campfire Circles notified them they were both in Sedona. They reconnected over coffee. Now they're travel companions."

[Show: Sarah and Chris meeting up, smiling]

**Business Model (1:50-2:10)**
[Show: Pricing tiers on screen]

"Free tier for casual users. $4.99/month for extended radius and companion tracking. Builder marketplace takes 20% transaction fee. Built with RevenueCat for seamless subscriptions."

[Show: Transaction happening, payment being processed]

**Traction (2:10-2:25)**
[Show: Metrics dashboard]

"In 4 weeks, we've built a working MVP with:
- 50 beta users across 3 states
- 30 activities created
- 25 successful connections
- 80% show-up rate
- 40 travel companion relationships tracked
- 5 builder marketplace transactions completed"

**Closing (2:25-2:30)**
[Show: Users around campfire, smiling]

"For Quin's community, Campfire Circles solves the biggest pain of van-life: loneliness. But it's not about forcing community — it's about making connection effortless when you want it.

**Campfire Circles: Stop losing people you care about.**"

[Show: Logo + tagline]

---

## Appendix

### A. Glossary

- **Activity:** A small gathering (2-10 people) organized through the app (e.g., "Coffee at sunrise")
- **Travel Companion:** A user you've met and want to reconnect with later
- **Builder:** A van mechanic/builder who offers services through the marketplace
- **Hyper-local:** Within a small radius (5-50 miles)
- **Ephemeral:** Short-lived (activities expire in 24-48 hours)
- **Show-up rate:** Percentage of activities a user actually attended
- **Geohashing:** Algorithm for efficiently querying nearby locations in a database
- **Escrow:** Holding payment until job completion (protects both parties)

### B. Competitor Analysis Summary

| Competitor | Focus | Strengths | Weaknesses | Our Advantage |
|------------|-------|-----------|------------|---------------|
| **Sēkr** | Campsite discovery + social | Large user base, community calendar | Trying to do everything, expensive, requires cell signal | Laser-focused on emotional connection |
| **Driftr** | Van-life social | N/A (failed) | Never launched, over-promised | Learn from their mistakes, focus on MVP |
| **Punta** | Digital nomad travel | Travel date overlap | Difficult to connect, forced travel dates | Spontaneous, activity-based matching |
| **Nomad Soulmates** | Nomad dating | Niche dating app | Only for singles, dating focus | Broader (friends, couples, builders) |
| **Facebook Groups** | Community advice | Large communities, lots of info | Slow, large events, not mobile-first | Fast, small, mobile-native |

### C. Key User Quotes from Research

**On Loneliness:**
- "The constant goodbyes and lack of deeper connections become a significant downside"
- "Losing relationships as I struggle to build new ones always brings with it an aching, invisible grief"
- "I met a lot of couples and groups of friends travelling together, and I started to think that would be nice"

**On Independence vs. Connection:**
- "Terrified I would fall into the deathtrap of needing a man in my life again"
- "Even socializing at campgrounds can feel fleeting"
- "The solitude can sometimes feel isolating rather than freeing"

**On Existing Solutions:**
- Sēkr: "Too expensive for what you get"
- Sēkr: "Requires solid cell signal to work"
- Sēkr: "Many spots listed without reviews, hard to tell if it's a good spot"
- Punta: "Difficult to connect with people... no way to match with each other"

### D. Technical Dependencies

**Required SDKs/Libraries:**
- Firebase iOS SDK (Auth, Firestore, Storage, Functions, Analytics, Crashlytics, Cloud Messaging)
- Firebase Android SDK (same as above)
- RevenueCat iOS SDK
- RevenueCat Android SDK
- Stripe iOS SDK
- Stripe Android SDK
- MapKit (iOS) / Google Maps SDK (Android)
- CoreLocation (iOS) / FusedLocationProvider (Android)

**Optional/Nice-to-Have:**
- Mapbox SDK (better maps)
- Cloudinary SDK (image optimization)
- OneSignal SDK (alternative to FCM)
- Mixpanel/Amplitude SDK (analytics)

### E. Legal & Compliance

**Privacy Policy Requirements:**
- Disclose what location data we collect
- Explain how location data is used (companion tracking)
- State that data is not sold to third parties
- Provide opt-out mechanisms
- GDPR compliance (if EU users): Right to deletion, data portability

**Terms of Service Requirements:**
- User responsibilities (safety, honesty, appropriate behavior)
- Platform responsibilities (uptime, data security, payment processing)
- Liability limitations
- Dispute resolution process
- Content ownership (user-generated content)

**Safety Disclosures:**
- "Meet in public places"
- "Tell someone where you're going"
- "Trust your instincts"
- "Report suspicious behavior"
- "We verify builders but cannot guarantee quality"

### F. Team Roles & Responsibilities

**Developer (iOS):**
- Build iOS app in SwiftUI
- Implement Firebase integration
- Handle background location tracking
- Integrate RevenueCat and Stripe
- Test on real devices
- Submit to TestFlight

**Developer (Android):**
- Build Android app in Kotlin/Compose
- Mirror iOS functionality
- Handle geofencing and location
- Test on multiple devices (different manufacturers)
- Submit to Google Play internal testing

**Backend Engineer:**
- Set up Firebase project
- Write Cloud Functions (companion tracking, reminders, etc.)
- Configure Firestore security rules
- Set up Stripe Connect
- Monitor performance and costs

**Product Designer:**
- Create high-fidelity mockups (Figma)
- Design onboarding flow
- Define color palette, typography, iconography
- Create demo video assets
- User testing and iteration

**Product Manager (You):**
- Define product requirements
- Prioritize features
- Write copy (onboarding, empty states, notifications)
- Coordinate team
- Submit to hackathon (Devpost)
- Create demo video
- Write proposal document

**Marketer:**
- Create landing page
- Recruit beta testers
- Manage social media
- Write launch posts (Product Hunt, Reddit, Facebook)
- Partner with Quin for launch
- Track acquisition metrics

### G. FAQ for Developers

**Q: Why Firebase instead of AWS/custom backend?**
A: Speed. Firebase provides auth, database, storage, functions, and hosting out of the box. We can build the entire backend in days, not weeks. It also has excellent mobile SDKs and scales automatically.

**Q: Why native apps instead of React Native/Flutter?**
A: Performance and platform integration. Background location tracking, push notifications, and maps work better with native code. SwiftUI and Compose are also mature and fast to develop with.

**Q: How do we handle background location without killing battery?**
A: Use significant location change API (iOS) and geofencing (Android). Update location every 6 hours, not continuously. Monitor battery usage and optimize if needed.

**Q: What if Firebase costs too much?**
A: Free tier covers 50K reads and 20K writes per day. With 5,000 users, we'd need ~500K reads/day to exceed this. We can cache aggressively and batch writes. Budget $100-200/month for database costs.

**Q: How do we prevent fake users/spam?**
A: Invite-only at launch. Require Instagram verification (must have van-life posts). Monitor show-up rates and ban users with <40%. Require photo ID for Builder Pro tier.

**Q: What if companion tracking doesn't work reliably?**
A: We can manually adjust the algorithm based on feedback. If geofencing fails, we can fall back to manual check-ins ("Are you near Moab right now?"). The feature is a bonus, not critical to core functionality.

### H. Resources

**Design Inspiration:**
- Meetup.com (activity discovery)
- Bumble BFF (friend-finding)
- TaskRabbit (marketplace)
- Strava (activity tracking)
- AirBnB (review system)

**Van-Life Communities to Study:**
- r/vandwellers (700K+ members)
- r/vanlife (300K+ members)
- Van Life Facebook groups (multiple, 50K+ each)
- @vanlifediaries Instagram (1M+ followers)
- Quin Gable's audience (brief details)

**Technical References:**
- Firebase documentation: https://firebase.google.com/docs
- RevenueCat documentation: https://docs.revenuecat.com
- Stripe Connect documentation: https://stripe.com/docs/connect
- iOS Background Location: https://developer.apple.com/documentation/corelocation
- Android Geofencing: https://developer.android.com/training/location/geofencing

---

## Final Notes for the Team

**This is not just a hackathon project. This is a real business opportunity.**

The research is clear: van-lifers are desperate for a solution to constant goodbyes. Existing apps (Sēkr, Driftr, dating apps) miss the emotional core of the problem.

We have a 4-week window to:
1. Build a working MVP
2. Validate product-market fit with beta users
3. Win $20,000 from Shipyard
4. Partner with Quin to launch to her audience
5. Build a sustainable business ($10K MRR in 6 months is achievable)

**Our unfair advantages:**
- We're solving a REAL pain point (not a nice-to-have)
- We have unique positioning ("grief reduction" not "social networking")
- We have a killer feature (travel companion tracking) nobody else has
- We have multiple revenue streams (subscriptions + marketplace)
- We have distribution (Quin's audience, van-life communities)

**Let's ship this. ⛴️**

---

**Document Owner:** [Your Name]  
**Contact:** [Your Email]  
**Last Updated:** January 28, 2026  
**Next Review:** February 5, 2026 (mid-sprint check-in)
  
