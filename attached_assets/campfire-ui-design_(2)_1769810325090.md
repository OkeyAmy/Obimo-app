# Campfire Circles: Complete UI/UX Design & Tab Structure

## 🎨 Core Design Philosophy
**Tinder-style swipeable interface + Travel storytelling + Privacy-first reconnections**

---

## 📱 TAB STRUCTURE (Bottom Navigation - 4 Tabs)

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Main Content Area]                 │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
┌───────┬───────┬───────┬───────────────────┐
│ 🔥    │ 🗺️    │ 💬    │ 👤                │
│Discover│ Map  │Connects│ Profile          │
└───────┴───────┴───────┴───────────────────┘
```

### Tab 1: 🔥 DISCOVER (Default Landing Tab)
**Purpose:** Swipe through nearby van-lifers, see their travel stories

### Tab 2: 🗺️ MAP 
**Purpose:** Visual map showing where you've been, where companions are, explore locations

### Tab 3: 💬 CONNECTS
**Purpose:** Your travel companions, past connections, reunion suggestions

### Tab 4: 👤 PROFILE
**Purpose:** Your profile, settings, privacy controls, subscription

---

## 🔥 TAB 1: DISCOVER (Main Swipe Interface)

### Screen Layout

```
┌─────────────────────────────────────────────┐
│ ⚙️ [Radius: 10mi ▼]           [Filter 🎯]  │ ← Top bar
├─────────────────────────────────────────────┤
│                                             │
│    ┌────────────────────────────────┐      │
│    │                                │      │
│    │    [PROFILE CARD - SWIPEABLE]  │      │
│    │                                │      │
│    │    📸 Main Photo (fullscreen)  │      │
│    │                                │      │
│    │    ┌──────────────────────┐   │      │
│    │    │ Sarah, 28            │   │      │
│    │    │ 📍 5 miles away      │   │      │
│    │    │ 🚐 Sprinter Van      │   │      │
│    │    │ ✨ 12 places visited │   │      │
│    │    └──────────────────────┘   │      │
│    │                                │      │
│    │    [See travel map 🗺️ →]      │      │ ← Tap to see map
│    │                                │      │
│    └────────────────────────────────┘      │
│                                             │
│    ← [Swipe Left: Pass]  [Swipe Right: Connect] →
│                                             │
│         ✕          ⭐           ❤️          │ ← Action buttons
│       PASS      SUPER LIKE    CONNECT      │
│                                             │
└─────────────────────────────────────────────┘
```

### Key Features:

**1. Profile Card (Swipeable)**
- **Main photo:** Fullscreen, high-quality image
- **Swipe gestures:**
  - Swipe LEFT (or tap ✕) = Pass
  - Swipe RIGHT (or tap ❤️) = Connect
  - Swipe UP (or tap ⭐) = Super Connect (premium feature)
- **Info overlay (bottom third):**
  - Name, age
  - Distance away (real-time)
  - Van type (Sprinter, Class B, School Bus, etc.)
  - Places visited count
  - "See travel map →" button

**2. Visual Feedback on Swipe**
- Swipe left → Card tilts left, red "PASS" stamp appears
- Swipe right → Card tilts right, green "CONNECT" stamp appears
- Swipe up → Card zooms, gold "SUPER CONNECT" animation
- Smooth card-flip animation to next profile

**3. Top Bar Controls**
- **Radius selector:** "10 mi ▼" - tap to change (5, 10, 20, 50 miles)
  - Free tier: Limited to 10 miles
  - Premium: Up to 50 miles
- **Filters button:** 
  - Van type
  - Age range
  - Gender
  - Places visited (minimum)
  - Last active (24h, week, month)

**4. Empty State (No More Profiles)**
```
┌─────────────────────────────────────────────┐
│                                             │
│         🏕️                                  │
│                                             │
│    You've seen everyone nearby!             │
│                                             │
│    [Expand radius to 20 miles]              │ ← Premium feature
│    [Come back later]                        │
│                                             │
└─────────────────────────────────────────────┘
```

### Profile Detail View (Tap on Card)

When user taps on the profile card (not swipe), it expands:

```
┌─────────────────────────────────────────────┐
│  ← Back                                  ⋮  │
├─────────────────────────────────────────────┤
│                                             │
│   📸📸📸📸 (Photo carousel - swipe horizontal)│
│                                             │
├─────────────────────────────────────────────┤
│  Sarah, 28  🚐 Sprinter Van                 │
│  📍 5 miles away • Last active 2h ago       │
├─────────────────────────────────────────────┤
│  Bio:                                       │
│  "Full-time van-lifer exploring the PNW    │
│   Looking for hiking buddies and campfire   │
│   friends. Coffee enthusiast ☕"            │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  🗺️ Travel Map (12 places)                 │
│  [See full map →]                           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   🗺️ Mini map preview showing       │   │
│  │   pins of places visited             │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  Interests: 🥾 Hiking, 📸 Photography,      │
│            🍳 Cooking, 🧘 Yoga              │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  Road Score: ⭐⭐⭐⭐⭐ (87/100)              │ ← Trust indicator
│  • Show-up rate: 92%                        │
│  • Response rate: 88%                       │
│  • Connections: 24                          │
│                                             │
└─────────────────────────────────────────────┘
│                                             │
│   [✕ Pass]     [❤️ Connect]    [⭐ Super]   │ ← Fixed bottom
└─────────────────────────────────────────────┘
```

### Travel Map View (From Profile Detail)

When user taps "See full map →":

```
┌─────────────────────────────────────────────┐
│  ← Back to Profile       Sarah's Journey    │
├─────────────────────────────────────────────┤
│                                             │
│   🗺️ INTERACTIVE MAP                        │
│                                             │
│   📍📍📍📍📍 (Pins showing places visited)   │
│   ───────── (Lines connecting route)       │
│                                             │
│   [Filter: All ▼] [Timeline ▼]             │ ← Filter controls
│                                             │
└─────────────────────────────────────────────┘
│                                             │
│  📍 Moab, Utah • Oct 2025                   │ ← Selected pin detail
│  3 days • 4 photos                          │
│  [View photos →]                            │
│                                             │
└─────────────────────────────────────────────┘
```

**Map Features:**
- **Pins:** Color-coded by timeline (recent = green, older = gray)
- **Routes:** Dotted lines showing travel path
- **Tap pin:** See location details, photos, dates
- **Photo carousel:** Swipe through location photos
- **Timeline filter:** Month, Year, All time
- **Category filter:** Campsites, Cities, National Parks, etc.

**Privacy Note:** Users control which locations are visible on their map (Settings)

---

## 🗺️ TAB 2: MAP (Your Travel Journey)

### Main Map Screen

```
┌─────────────────────────────────────────────┐
│  🗺️ My Journey        [+ Add Place] [⚙️]    │ ← Top bar
├─────────────────────────────────────────────┤
│                                             │
│      🌍 INTERACTIVE MAP (FULLSCREEN)         │
│                                             │
│   📍 Your pins (places you've been)         │
│   👥 Companion pins (where companions are)  │
│   🔵 Your current location                  │
│                                             │
│   ───── Travel routes                       │
│                                             │
└─────────────────────────────────────────────┘
│                                             │
│  [Filter Bar]                               │
│  • My Places • Companions • Hidden Places   │
│                                             │
│  ┌───────────────────────────────────────┐ │ ← Bottom sheet (swipe up)
│  │ 📍 Sedona, Arizona                    │ │
│  │ Nov 2025 • 5 days                     │ │
│  │ Met Chris & Jamie here                │ │
│  │ [View photos] [Edit] [Delete]         │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Key Features:

**1. Your Places (Blue Pins 📍)**
- Every location you've logged automatically
- Manual add: "I was here" feature
- Each pin shows:
  - Location name
  - Dates visited
  - Duration
  - Photos (if added)
  - Companions met there

**2. Companion Locations (Purple Pins 👥)**
- Shows approximate location of travel companions (city-level, not exact)
- Only shows companions who have location sharing ON
- Tap companion pin:
  - Last known location (e.g., "Near Moab, UT")
  - Distance from you
  - "Reconnect" button (creates reunion suggestion)

**3. Map Layers (Toggle On/Off)**
- My visited places
- Companion locations (live)
- Places I want to visit (wishlist)
- Hidden places (private locations)

**4. Timeline Slider**
Swipe horizontal slider to see your journey over time:
```
[◄──●────────────────►]
2023   2024   2025   2026
```
- Pins animate to show when you visited
- Routes draw to show travel path

**5. Stats Dashboard (Swipe up from bottom)**
```
┌─────────────────────────────────────────────┐
│  📊 Your Travel Stats                       │
│                                             │
│  ⭐ 47 Places Visited                       │
│  🚐 8,432 Miles Traveled                    │
│  👥 24 Companions Made                      │
│  📸 127 Memories Captured                   │
│  🏕️ 12 States Explored                      │
│                                             │
│  Most Visited: Utah (8 times)               │
│  Longest Stay: Sedona (14 days)             │
│                                             │
└─────────────────────────────────────────────┘
```

### Place Detail View (Tap on Your Pin)

```
┌─────────────────────────────────────────────┐
│  ← Map                   Moab, Utah          │
├─────────────────────────────────────────────┤
│                                             │
│   📸📸📸 (Photo carousel)                    │
│                                             │
├─────────────────────────────────────────────┤
│  📅 Oct 15-20, 2025 (5 days)                │
│  📝 Best sunrise spot! Met amazing people.  │
│                                             │
│  👥 Companions met here:                    │
│  ┌─────────────────────────────────────┐   │
│  │ Chris & Jamie                       │   │
│  │ Last seen: 84 miles away            │   │
│  │ [Reconnect] [Message]               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Alex                                │   │
│  │ Last seen: 12 miles away 🔔         │   │ ← Nearby alert!
│  │ [Reconnect Now!]                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Edit Place] [Delete] [Share Story]        │
│                                             │
└─────────────────────────────────────────────┘
```

### Add Place Manually

When user taps "+ Add Place":

```
┌─────────────────────────────────────────────┐
│  ← Cancel           Add a Place         Save │
├─────────────────────────────────────────────┤
│                                             │
│  📍 Location                                │
│  [Search or pin on map...]                  │
│                                             │
│  📅 Dates                                   │
│  From: [Oct 15, 2025]                       │
│  To:   [Oct 20, 2025]                       │
│                                             │
│  📝 Notes (optional)                        │
│  [What made this place special?...]         │
│                                             │
│  📸 Add Photos (optional)                   │
│  [+ Upload photos]                          │
│                                             │
│  👥 Tag Companions (optional)               │
│  [Select companions you met here...]        │
│                                             │
│  🔒 Privacy                                 │
│  ○ Visible to all connections               │
│  ○ Visible to tagged companions only        │
│  ● Hidden (private to me)                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 💬 TAB 3: CONNECTS (Travel Companions)

### Main Connects Screen

```
┌─────────────────────────────────────────────┐
│  💬 Connects                                │
├─────────────────────────────────────────────┤
│  [Search companions...]              [+]    │ ← Add manual
├─────────────────────────────────────────────┤
│                                             │
│  🔔 NEARBY NOW (2)                          │ ← Priority section
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📸 Alex     📍 12 miles away 🟢     │   │
│  │ Last met: Moab, Oct 2025            │   │
│  │ "Hey! I'm nearby, coffee later?"    │   │
│  │ [Reconnect Now] [Chat]              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📸 Taylor   📍 23 miles away 🟢     │   │
│  │ Last met: Sedona, Sep 2025          │   │
│  │ [Create reunion activity]           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  📅 RECENT CONNECTIONS (8)                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📸 Chris & Jamie  📍 84 miles       │   │
│  │ Last met: Moab, Oct 2025            │   │
│  │ Road Score: ⭐⭐⭐⭐⭐              │   │
│  │ [View on map] [Chat]                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [See all companions (24) →]                │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  💡 REUNION SUGGESTIONS (3)                 │ ← Smart suggestions
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ You & Sarah both loved Moab          │   │
│  │ She's 47 miles away                 │   │
│  │ [Suggest reunion] [Dismiss]         │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Key Features:

**1. Nearby Now Section (Priority)**
- Shows companions within customizable radius (default 50 miles)
- Live distance updates
- Green dot = Active in last 2 hours
- Quick action buttons:
  - "Reconnect Now" = Send reunion request
  - "Chat" = Open direct message

**2. Road Score (Trust Indicator)**
Visual scoring system showing connection strength:
```
⭐⭐⭐⭐⭐ (87/100)

Based on:
• Times met: 3
• Last met: 2 months ago
• Shared locations: 4
• Response rate: High
• Show-up history: 100%
```

**3. Sorting Options**
Tap filter icon to sort by:
- Nearby now (default)
- Recently met
- Most met (strongest bonds)
- Never met again (need reconnection)
- Road score (highest first)

### Companion Detail View

Tap any companion to see full profile:

```
┌─────────────────────────────────────────────┐
│  ← Back              Chris & Jamie       ⋮  │
├─────────────────────────────────────────────┤
│                                             │
│   📸 Profile Photo                          │
│   📍 84 miles away (Near Denver, CO)        │
│   🟢 Active 3 hours ago                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ROAD SCORE: ⭐⭐⭐⭐⭐ (92/100)              │
│                                             │
│  Connection Strength: Very Strong           │
│  • First met: Moab, UT • Oct 2025          │
│  • Total meetups: 3                         │
│  • Shared locations: 4                      │
│  • Last reunion: 2 weeks ago                │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  🗺️ SHARED JOURNEY MAP                     │
│  [View full map →]                          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Map showing:                       │   │
│  │  • Places you both visited          │   │
│  │  • Times your paths crossed         │   │
│  │  • Current locations (approximate)  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  📅 MEMORIES TOGETHER (3 meetups)           │
│                                             │
│  📍 Moab, UT • Oct 15, 2025                 │
│  "Hiked Delicate Arch, epic sunrise!"      │
│  📸📸📸 (3 photos)                           │
│                                             │
│  📍 Sedona, AZ • Nov 2, 2025                │
│  "Campfire under the stars"                │
│  📸📸 (2 photos)                             │
│                                             │
│  [See all memories →]                       │
│                                             │
└─────────────────────────────────────────────┘
│                                             │
│  [💬 Chat] [🗺️ Map] [🤝 Reunion] [🚫 Remove]│
└─────────────────────────────────────────────┘
```

### Reunion Flow (Creating Reconnection)

When user taps "Create reunion activity":

```
┌─────────────────────────────────────────────┐
│  ← Back         Reunion with Alex        Send│
├─────────────────────────────────────────────┤
│                                             │
│  💬 Message (optional)                      │
│  "Hey! I see you're nearby. Want to grab   │
│   coffee and catch up?"                     │
│                                             │
│  📍 Suggested Meeting Point                 │
│  [Midpoint Café - 6 miles from each]       │
│  [Change location...]                       │
│                                             │
│  ⏰ When?                                   │
│  ○ Today (afternoon)                        │
│  ● Tomorrow (morning)                       │
│  ○ This weekend                             │
│  ○ Pick specific time                       │
│                                             │
│  📝 Activity Type                           │
│  [Coffee ☕] [Hike 🥾] [Campfire 🔥]       │
│  [Meal 🍽️] [Other ✨]                      │
│                                             │
└─────────────────────────────────────────────┘
│                                             │
│  [Send Reunion Request]                     │
└─────────────────────────────────────────────┘
```

### Reunion Notifications

When someone sends you a reunion request:

```
┌─────────────────────────────────────────────┐
│  🎉 REUNION REQUEST                         │
│                                             │
│  Alex wants to reconnect!                   │
│  Last met in Moab, 2 months ago             │
│                                             │
│  💬 "Hey! I see you're nearby. Want to     │
│     grab coffee and catch up?"              │
│                                             │
│  📍 Midpoint Café                           │
│  ⏰ Tomorrow morning                        │
│  ☕ Coffee meetup                           │
│                                             │
│  [Accept & Chat] [Suggest Different Time]   │
│  [Decline Politely]                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 👤 TAB 4: PROFILE (Your Profile & Settings)

### Main Profile Screen

```
┌─────────────────────────────────────────────┐
│  ⚙️ Settings                            Edit │ ← Top bar
├─────────────────────────────────────────────┤
│                                             │
│        📸 Your Profile Photo                │
│        Sarah, 28                            │
│        🚐 Sprinter Van                      │
│                                             │
│  ⭐ Your Road Score: 87/100                 │
│  • Show-up rate: 92%                        │
│  • Response rate: 88%                       │
│  • Connections: 24                          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📊 YOUR STATS                              │
│  ┌───────┬───────┬───────┬───────┐         │
│  │  47   │  24   │ 8.4K  │  127  │         │
│  │Places │Connects│Miles │Photos │         │
│  └───────┴───────┴───────┴───────┘         │
│                                             │
│  🗺️ [View My Journey Map →]                │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ⚡ QUICK ACTIONS                           │
│  • 🎯 Edit Discovery Preferences            │
│  • 🔒 Privacy & Location Settings           │
│  • 💳 Upgrade to Nomad Plus                 │
│  • 👥 Invite Friends                        │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ⚙️ SETTINGS                                │
│  • Account Settings                         │
│  • Notification Preferences                 │
│  • Blocked Users                            │
│  • Help & Support                           │
│  • Privacy Policy                           │
│  • Log Out                                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Edit Profile Screen

```
┌─────────────────────────────────────────────┐
│  ← Cancel          Edit Profile          Save│
├─────────────────────────────────────────────┤
│                                             │
│  📸 PHOTOS (up to 6)                        │
│  ┌───┬───┬───┐                             │
│  │ 1 │ 2 │ 3 │  [+ Add]                    │
│  ├───┼───┼───┤                             │
│  │ 4 │ 5 │ 6 │                             │
│  └───┴───┴───┘                             │
│                                             │
│  📝 ABOUT YOU                               │
│  Name: [Sarah]                              │
│  Age: [28]                                  │
│  Van Type: [Sprinter Van ▼]                │
│                                             │
│  Bio (max 150 chars):                       │
│  [Full-time van-lifer exploring the PNW    │
│   Looking for hiking buddies and campfire   │
│   friends. Coffee enthusiast ☕]            │
│                                             │
│  🏷️ INTERESTS (select up to 8)             │
│  ✅ Hiking    ✅ Photography  ☐ Surfing     │
│  ✅ Cooking   ☐ Climbing     ✅ Yoga        │
│  ☐ Fishing   ☐ Cycling      ☐ Music        │
│  [+ Add custom interest]                    │
│                                             │
│  🗺️ TRAVEL MAP VISIBILITY                  │
│  Who can see your visited places?           │
│  ● All connections                          │
│  ○ Only confirmed companions                │
│  ○ Nobody (keep private)                    │
│                                             │
│  Which places to show?                      │
│  ● All places visited                       │
│  ○ Selected places only                     │
│  [Manage hidden places →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Privacy & Location Settings

```
┌─────────────────────────────────────────────┐
│  ← Back       Privacy & Location             │
├─────────────────────────────────────────────┤
│                                             │
│  🔒 LOCATION PRIVACY                        │
│                                             │
│  Show my location to:                       │
│  ● All connections                          │
│  ○ Only companions I've met                 │
│  ○ Nobody (stay invisible)                  │
│                                             │
│  Location detail level:                     │
│  ● City/State level (e.g., "Near Moab, UT")│ ← Recommended
│  ○ Exact distance (e.g., "12.3 miles")     │
│  ○ Hidden completely                        │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  📍 COMPANION TRACKING                      │
│                                             │
│  Get notified when companions are nearby:   │
│  [●───────────────────○] 50 miles          │ ← Slider
│                                             │
│  Background location updates:               │
│  ● Every 6 hours (battery-friendly) ✅      │
│  ○ Every 3 hours (more frequent)            │
│  ○ Off (manual only)                        │
│                                             │
│  ⚠️ Note: Disabling tracking means you      │
│     won't get reunion notifications         │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  👁️ PROFILE VISIBILITY                     │
│                                             │
│  Who can discover me:                       │
│  ● Everyone in my radius                    │
│  ○ Only people I've connected with          │
│  ○ Pause my profile (invisible mode)        │
│                                             │
│  ───────────────────────────────────────    │
│                                             │
│  🗺️ MAP PRIVACY                             │
│                                             │
│  Hide specific places:                      │
│  [Manage hidden places (3) →]               │
│                                             │
│  Who can see my travel history:             │
│  ● All connections                          │
│  ○ Only tagged companions                   │
│  ○ Nobody                                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 COMPLETE USER FLOWS

### Flow 1: First-Time User Journey

```
1. ONBOARDING (Maintain what i have)
   
2. SIGN UP
   → Email/password or social login
   → Grant location permission 
   
3. CREATE PROFILE
   → Upload 1-6 photos
   → Add name, age, van type
   → Write bio (150 chars)
   → Select interests  
   
4. SET PRIVACY PREFERENCES
   → Location visibility (recommend: City-level)
   → Companion tracking radius (default: 50 miles)
   → Map visibility (default: All connections)
   
5. LAND ON DISCOVER TAB
   → See first profile
   → Swipe tutorial overlay (first time only)
   → Start discovering!

6. FIRST MATCH
   → You swiped right on Alex
   → Alex swiped right on you
   → "It's a match! 🎉" animation
   → Option to send message or continue swiping
```

### Flow 2: Making Your First Connection

```
1. SWIPE RIGHT on profile
   → Card flies right with green "CONNECT" stamp
   → Profile added to "Pending" queue
   
2. WHEN THEY SWIPE RIGHT BACK
   → Push notification: "Alex matched with you!"
   → "It's a Match!" screen appears
   
   ┌─────────────────────────────────────────────┐
   │                                             │
   │            🎉 IT'S A MATCH! 🎉             │
   │                                             │
   │        📸        📸                         │
   │       You       Alex                        │
   │                                             │
   │    "You both want to connect!"              │
   │                                             │
   │    📍 Alex is 12 miles away                │
   │                                             │
   │    [Send Message] [Keep Swiping]            │
   │                                             │
   └─────────────────────────────────────────────┘
   
3. SEND FIRST MESSAGE (Optional)
   → Open chat
   → Pre-filled suggestions:
     • "Hey! Want to grab coffee sometime?"
     • "I saw you were in Moab! I was just there too"
     • "Your van setup is awesome!"
   → Or type custom message
   
4. AUTO-ADDED TO CONNECTS TAB
   → Alex now appears in your Connects list
   → Road Score starts building (initially low)
```

### Flow 3: Meeting Someone for the First Time

```
1. COORDINATE VIA CHAT
   You: "Want to meet for coffee tomorrow?"
   Alex: "Yes! How about Sunrise Café at 10am?"
   You: "Perfect! See you then 👍"
   
2. DAY OF MEETUP
   → Push notification reminder (1 hour before)
   → Chat notification: "Meeting in 1 hour!"
   → Option to get directions to location
   
3. AFTER MEETING (Post-Meetup Check-in)
   
   ┌─────────────────────────────────────────────┐
   │  How was your meetup with Alex?             │
   │                                             │
   │  Did you meet in person?                    │
   │  ● Yes, we met!                             │
   │  ○ No, they didn't show                     │
   │  ○ I couldn't make it                       │
   │                                             │
   │  Rate your experience:                      │
   │  ⭐⭐⭐⭐⭐                                  │
   │                                             │
   │  📸 Add photos from your meetup (optional)  │
   │  [+ Upload]                                 │
   │                                             │
   │  📍 Where did you meet?                     │
   │  [Sunrise Café, Moab, UT ▼]                │
   │                                             │
   │  [Save Memory] [Skip]                       │
   │                                             │
   └─────────────────────────────────────────────┘
   
4. MEMORY SAVED
   → Added to "Shared Journey" with Alex
   → Road Score increases (first meetup = big boost!)
   → Location logged on both your maps (if privacy allows)
   → Alex becomes a "Travel Companion" (not just a match)
```

### Flow 4: The Magical Reconnection (Core Value Prop!)

```
1. TIME PASSES (You and Alex haven't seen each other in 3 months)
   → You're in Sedona
   → Alex is traveling through Arizona
   → Background location check (every 6 hours) detects proximity
   
2. PROXIMITY NOTIFICATION TRIGGERS
   
   ┌─────────────────────────────────────────────┐
   │  🎉 COMPANION NEARBY!                       │
   │                                             │
   │  Alex is within 47 miles!                   │
   │                                             │
   │  📍 Last met: Moab, UT • 3 months ago      │
   │  ⭐ Road Score: 82/100                      │
   │                                             │
   │  "You both had an amazing time last time.   │
   │   Want to reconnect?"                       │
   │                                             │
   │  [Yes! Create Reunion] [Not Right Now]      │
   │                                             │
   └─────────────────────────────────────────────┘
   
3. CREATE REUNION (One-Tap Flow)
   
   → Tapping "Yes!" opens pre-filled reunion form:
   
   ┌─────────────────────────────────────────────┐
   │  Reunion with Alex                          │
   │                                             │
   │  💬 "Hey Alex! I see you're nearby again!   │
   │      Want to meet up? I'm in Sedona."       │
   │                                             │
   │  📍 Midpoint Suggestion:                    │
   │  Red Rock Café (21 mi from each)            │
   │                                             │
   │  ⏰ Tomorrow afternoon                      │
   │                                             │
   │  [Send Reunion Request]                     │
   │                                             │
   └─────────────────────────────────────────────┘
   
4. ALEX RECEIVES NOTIFICATION
   
   ┌─────────────────────────────────────────────┐
   │  📬 REUNION REQUEST from Sarah              │
   │                                             │
   │  "Hey Alex! I see you're nearby again!      │
   │   Want to meet up? I'm in Sedona."          │
   │                                             │
   │  📍 Red Rock Café                           │
   │  ⏰ Tomorrow afternoon                      │
   │                                             │
   │  [Accept!] [Suggest Different Time] [Pass]  │
   │                                             │
   └─────────────────────────────────────────────┘
   
5. ALEX ACCEPTS
   → Both receive confirmation
   → Chat auto-opens for coordination
   → Reminder notifications sent (day before, 1 hour before)
   
6. SECOND MEETUP HAPPENS
   → Post-meetup check-in (same as Flow 3)
   → Road Score increases significantly (repeat connection!)
   → New shared memory added
   → Relationship strengthens
```

### Flow 5: Exploring Someone's Travel Map

```
1. ON DISCOVER TAB
   → Swipe through profiles
   → See Sarah's card: "✨ 47 places visited"
   → Tap card to expand details
   
2. PROFILE DETAIL VIEW
   → Scroll down to "Travel Map" section
   → See mini preview showing pins
   → Tap "See full map →"
   
3. INTERACTIVE MAP OPENS
   
   ┌─────────────────────────────────────────────┐
   │  ← Back          Sarah's Journey            │
   │                                             │
   │  🗺️ FULL MAP VIEW                          │
   │                                             │
   │  📍 47 pins scattered across US             │
   │  Pins color-coded:                          │
   │  • 🟢 Recent (last 3 months)               │
   │  • 🟡 Medium (3-12 months)                 │
   │  • ⚪ Older (12+ months)                   │
   │                                             │
   │  Routes connecting pins (travel path)       │
   │                                             │
   └─────────────────────────────────────────────┘
   
4. TAP A PIN
   
   → Bottom sheet slides up:
   
   ┌─────────────────────────────────────────────┐
   │  📍 Moab, Utah                              │
   │  Oct 15-20, 2025 • 5 days                   │
   │                                             │
   │  📸📸📸📸 (4 photos - swipe to view)        │
   │                                             │
   │  "Best sunrise spot! Hiked Delicate Arch    │
   │   and met some amazing people."             │
   │                                             │
   │  💡 "You've both been here!"                │ ← Shared location!
   │     You visited: Sep 2025                   │
   │                                             │
   └─────────────────────────────────────────────┘
   
5. SWIPE THROUGH PHOTOS
   → Full-screen photo viewer
   → Pinch to zoom
   → Swipe left/right through photos
   → Tap X to close
   
6. NOTICE PATTERN
   → "Sarah visited 8 places you also visited!"
   → Tap to see overlap map
   → Common interest indicator
   → Increases likelihood of connection
```

### Flow 6: Using Your Own Map

```
1. OPEN MAP TAB (🗺️)
   → See your entire journey
   → 47 blue pins (places you've been)
   → 5 purple pins (companions currently nearby)
   → Your current location (blue pulsing dot)
   
2. TOGGLE FILTERS
   → Tap filter bar at top
   → Turn ON: "Companion Locations"
   → See purple pins appear
   
3. TAP PURPLE PIN (Companion Location)
   
   ┌─────────────────────────────────────────────┐
   │  👤 Chris & Jamie                           │
   │  📍 Near Denver, CO (84 miles away)         │
   │  🟢 Last active: 3 hours ago               │
   │                                             │
   │  Road Score: ⭐⭐⭐⭐⭐ (92/100)            │
   │  Last met: 2 weeks ago in Moab              │
   │                                             │
   │  [Chat] [Suggest Reunion] [View Profile]    │
   │                                             │
   └─────────────────────────────────────────────┘
   
4. TAP YOUR OWN PIN (Past Location)
   
   ┌─────────────────────────────────────────────┐
   │  📍 Sedona, Arizona                         │
   │  Nov 2-7, 2025 • 5 days                     │
   │                                             │
   │  📸📸📸 (3 photos)                          │
   │                                             │
   │  "Incredible red rocks. Best sunset ever!"  │
   │                                             │
   │  👥 Companions met here:                    │
   │  • Alex (Road Score: 82)                    │
   │  • Taylor (Road Score: 75)                  │
   │                                             │
   │  [Edit] [Add More Photos] [Share]           │
   │                                             │
   └─────────────────────────────────────────────┘
   
5. SWIPE UP FOR STATS DASHBOARD
   
   ┌─────────────────────────────────────────────┐
   │  📊 YOUR JOURNEY STATS                      │
   │                                             │
   │  ⭐ 47 Places Visited                       │
   │  🚐 8,432 Miles Traveled                    │
   │  👥 24 Companions Made                      │
   │  🤝 12 Reunions So Far                      │
   │                                             │
   │  Top States: Utah (8), Arizona (6), CA (5)  │
   │  Longest Trip: 14 days (Sedona)             │
   │  Most Companions in: Moab (5 people)        │
   │                                             │
   │  [Share Your Journey] [Download Map]        │
   │                                             │
   └─────────────────────────────────────────────┘
```

### Flow 7: Privacy Controls in Action

```
1. SCENARIO: You want to hide a specific location
   → Go to Profile tab
   → Privacy & Location Settings
   → Tap "Manage hidden places"
   
2. HIDDEN PLACES SCREEN
   
   ┌─────────────────────────────────────────────┐
   │  🔒 Hidden Places (3)                       │
   │                                             │
   │  These places won't appear on your public   │
   │  travel map or be visible to connections.   │
   │                                             │
   │  ┌───────────────────────────────────────┐ │
   │  │ 🏠 My secret camping spot              │ │
   │  │ Montana • Private                      │ │
   │  │ [Remove from hidden] [Delete]          │ │
   │  └───────────────────────────────────────┘ │
   │                                             │
   │  [+ Hide a place]                           │
   │                                             │
   └─────────────────────────────────────────────┘
   
3. HIDE A NEW PLACE
   → Search your visited places
   → Select location to hide
   → Confirm: "This will be private to you only"
   → Location disappears from public map
   → Still tracked for your own stats
   
4. LOCATION VISIBILITY LEVELS
   
   Choose who sees your current location:
   
   ● ALL CONNECTIONS (Default)
     - Shows: "12 miles away"
     - What they see: City-level (Moab, UT)
     
   ○ ONLY MET COMPANIONS
     - Only people you've physically met
     - Others see: "Location hidden"
     
   ○ INVISIBLE MODE
     - Nobody sees your location
     - You won't appear in Discover
     - Can still chat with existing connections
```

### Flow 8: Road Score Progression

```
STAGE 1: NEW MATCH (Road Score: 15/100)
┌─────────────────────────────────────────────┐
│  ⭐☆☆☆☆ (15/100)                            │
│  New Connection                              │
│                                             │
│  • Matched but haven't met yet              │
│  • Keep the conversation going!             │
│                                             │
└─────────────────────────────────────────────┘

STAGE 2: FIRST MEETUP (Road Score: 45/100)
┌─────────────────────────────────────────────┐
│  ⭐⭐⭐☆☆ (45/100)                          │
│  New Travel Companion                       │
│                                             │
│  • First meetup completed ✓                 │
│  • Both showed up ✓                         │
│  • Photos shared ✓                          │
│                                             │
│  Next: Reconnect when nearby!               │
│                                             │
└─────────────────────────────────────────────┘

STAGE 3: SECOND REUNION (Road Score: 72/100)
┌─────────────────────────────────────────────┐
│  ⭐⭐⭐⭐☆ (72/100)                         │
│  Good Friend                                │
│                                             │
│  • Met 2 times ✓                            │
│  • Shared 3 locations ✓                     │
│  • High response rate (92%) ✓               │
│  • Always shows up ✓                        │
│                                             │
└─────────────────────────────────────────────┘

STAGE 4: TRAVEL FAMILY (Road Score: 92/100)
┌─────────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐ (92/100)                         │
│  Travel Family 💙                           │
│                                             │
│  • Met 5+ times ✓                           │
│  • Shared 8 locations ✓                     │
│  • 100% show-up rate ✓                      │
│  • Last reunion: 2 weeks ago ✓              │
│                                             │
│  This is a strong bond! 🎉                  │
│                                             │
└─────────────────────────────────────────────┘

HOW ROAD SCORE IS CALCULATED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Times met together           (40 points max)
  • 1 meetup = 15 pts
  • 2 meetups = 25 pts
  • 3+ meetups = 40 pts

Shared locations             (20 points max)
  • 1 location = 5 pts
  • 3+ locations = 15 pts
  • 5+ locations = 20 pts

Response rate                (15 points max)
  • % of messages responded to

Show-up rate                 (15 points max)
  • % of planned meetups attended

Recency                      (10 points max)
  • Met within 1 month = 10 pts
  • Met within 3 months = 7 pts
  • Met 6+ months ago = 3 pts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 100 points max
```

---

## 🎨 VISUAL DESIGN SPECIFICATIONS

### Color System

```css
/* Primary Colors */
--campfire-orange: #FF6B35;      /* Primary CTA, matches */
--ember-red: #E63946;            /* Alerts, super likes */
--sunset-yellow: #FFA630;        /* Highlights, success */
--forest-teal: #004E64;          /* Secondary actions */
--sky-blue: #0099CC;             /* Links, info */

/* Neutral Colors */
--off-white: #FAF9F6;            /* Background */
--light-gray: #E0E0E0;           /* Borders, dividers */
--medium-gray: #9CA3AF;          /* Secondary text */
--charcoal: #2C2C2C;             /* Primary text */

/* Status Colors */
--active-green: #10B981;         /* Online status */
--warning-amber: #F59E0B;        /* Warnings */
--error-red: #EF4444;            /* Errors */

/* Map Colors */
--pin-recent: #10B981;           /* Recent visits (green) */
--pin-medium: #FFA630;           /* Medium visits (yellow) */
--pin-old: #9CA3AF;              /* Old visits (gray) */
--companion-pin: #8B5CF6;        /* Companion locations (purple) */
--route-line: #004E64;           /* Travel routes (teal) */
```

### Typography

```
HEADINGS (Montserrat Bold)
H1: 28px / 700 / -0.5px letter-spacing
H2: 22px / 700 / -0.3px
H3: 18px / 700 / normal

BODY (Inter)
Large: 16px / 400 / 1.5 line-height
Regular: 14px / 400 / 1.5
Small: 12px / 400 / 1.4

UI LABELS (Inter Medium)
Button: 15px / 500
Caption: 11px / 500 / uppercase
```

### Component Specifications

**SWIPE CARDS:**
```
Size: 90% of screen width × 70% of screen height
Corner Radius: 20px
Shadow: 0px 8px 24px rgba(0,0,0,0.15)
Border: none
Padding: 0 (image fullscreen)

Info Overlay (bottom):
  Background: Linear gradient (transparent → rgba(0,0,0,0.7))
  Height: 30% of card
  Padding: 20px
  Text: White color
```

**ACTION BUTTONS (Bottom of Discover):**
```
Pass Button (✕):
  Size: 56px circle
  Background: White
  Icon: Red ✕ (28px)
  Shadow: 0px 4px 12px rgba(0,0,0,0.1)

Connect Button (❤️):
  Size: 64px circle
  Background: Campfire Orange
  Icon: White ❤️ (32px)
  Shadow: 0px 6px 16px rgba(255,107,53,0.4)
  
Super Like Button (⭐):
  Size: 56px circle
  Background: Sunset Yellow
  Icon: White ⭐ (28px)
  Shadow: 0px 4px 12px rgba(255,166,48,0.3)
```

**MAP PINS:**
```
Your Places:
  Size: 32px × 40px (standard pin shape)
  Color: Sky Blue (#0099CC)
  Icon: 📍 or custom van icon
  
Companion Pins:
  Size: 40px circle (avatar-style)
  Border: 3px Companion Purple (#8B5CF6)
  Inner: Profile photo (cropped circular)
  
Selected Pin:
  Size: 1.3x normal size
  Bounce animation on tap
  Shows connecting line to info card
```

**BOTTOM SHEETS:**
```
Corner Radius: 24px (top corners only)
Handle Bar: 40px × 4px, centered, Medium Gray
Max Height: 85% of screen
Min Height: 200px
Swipe Gesture: Pull down to dismiss
Background: Off-white with slight blur
```

### Animations & Micro-interactions

**SWIPE ANIMATIONS:**
```
Card Swipe Left (Pass):
  Duration: 300ms
  Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
  Effect: Rotate -15deg, translateX(-150%), fade out
  Stamp: Red "PASS" appears at 50% swipe

Card Swipe Right (Connect):
  Duration: 300ms
  Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
  Effect: Rotate 15deg, translateX(150%), fade out
  Stamp: Green "CONNECT" appears at 50% swipe

Card Swipe Up (Super Like):
  Duration: 400ms
  Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
  Effect: Scale 1.1x, translateY(-200%), fade out
  Effect: Gold sparkle particles
```

**MATCH ANIMATION:**
```
1. Screen dims (fade to 50% black)
2. Both profile photos fly in from left/right
3. Photos bounce and settle in center
4. "It's a Match! 🎉" text fades in with scale effect
5. Confetti particles burst (if enabled)
6. Bottom buttons fade in
Duration: 2 seconds total
```

**COMPANION NEARBY NOTIFICATION:**
```
1. Badge appears on Connects tab (pulse 3x)
2. Push notification with custom sound
3. If app open: Slide-down banner from top
4. Banner style: Purple gradient, profile photo, message
5. Auto-dismiss after 5 seconds or tap to open
```

**MAP PIN INTERACTIONS:**
```
Tap Pin:
  1. Pin bounces (scale 1 → 1.3 → 1.1 → 1)
  2. Other pins fade to 50% opacity
  3. Bottom sheet slides up (300ms ease-out)
  4. Connecting line draws from pin to sheet

Change Map View:
  1. Pins cluster when zoomed out
  2. Cluster shows number badge
  3. Tap cluster to zoom in
  4. Pins scatter with stagger animation (50ms delay each)
```

### Loading States

**SKELETON SCREENS:**
```
Profile Card Loading:
  ┌─────────────────────────────────────────────┐
  │                                             │
  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │ ← Animated
  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │    shimmer
  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │    effect
  │                                             │
  │    ▓▓▓▓▓▓ ▓▓▓                              │
  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                        │
  │                                             │
  └─────────────────────────────────────────────┘

Map Loading:
  • Spinner in center
  • "Loading your journey..." text
  • Fade in pins as they load (not all at once)
  
Connects Loading:
  • Skeleton cards with pulsing gray blocks
  • 3 cards visible before scroll
```

### Empty States

**NO PROFILES NEARBY:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            🏕️                               │
│                                             │
│      No one nearby right now                │
│                                             │
│      Try expanding your radius or           │
│      check back later!                      │
│                                             │
│      [Expand to 20 miles] (Premium)         │
│                                             │
└─────────────────────────────────────────────┘
```

**NO CONNECTIONS YET:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            👥                               │
│                                             │
│      No connections yet                     │
│                                             │
│      Start swiping to meet van-lifers       │
│      and build your travel family!          │
│                                             │
│      [Go to Discover →]                     │
│                                             │
└─────────────────────────────────────────────┘
```

**NO PLACES VISITED:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            🗺️                               │
│                                             │
│      Your journey starts here               │
│                                             │
│      Add places you've visited to           │
│      build your travel map!                 │
│                                             │
│      [+ Add First Place]                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔔 NOTIFICATION SYSTEM

### Push Notification Types

**1. COMPANION NEARBY (Highest Priority)**
```
Title: 🎉 Alex is nearby!
Body: "47 miles away • Last met in Moab 3 months ago"
Sound: Custom "reunion" chime
Actions: [View] [Create Reunion] [Dismiss]
Deep Link: Opens Connects tab → Alex's profile
```

**2. NEW MATCH**
```
Title: It's a Match! 🎉
Body: "You and Sarah both connected!"
Sound: Default notification sound
Actions: [Send Message] [View Profile]
Deep Link: Opens match screen
```

**3. NEW MESSAGE**
```
Title: Message from Chris
Body: "Hey! Want to grab coffee later?"
Sound: Default message sound
Actions: [Reply] [View]
Deep Link: Opens chat
```

**4. REUNION REQUEST**
```
Title: 💬 Reunion request from Taylor
Body: "Wants to meet in Sedona tomorrow"
Sound: Custom "reunion" chime
Actions: [Accept] [View Details] [Decline]
Deep Link: Opens reunion request screen
```

**5. REMINDER (Day Before Reunion)**
```
Title: ⏰ Reunion tomorrow
Body: "Meeting Alex at Red Rock Café at 2pm"
Sound: Gentle reminder tone
Actions: [Get Directions] [Reschedule] [Chat]
Deep Link: Opens reunion details
```

**6. POST-MEETUP CHECK-IN**
```
Title: How was your meetup with Alex?
Body: "Share your experience and add photos"
Sound: None (silent notification)
Actions: [Rate Experience] [Skip]
Deep Link: Opens check-in form
```

### In-App Notifications

**BADGE SYSTEM:**
```
Connects Tab Badge:
  • Shows number of companions nearby
  • Red badge with white number
  • Pulses 3x when new companion detected
  
Profile Tab Badge:
  • Shows pending actions (profile incomplete, etc.)
  • Orange badge
```

**BANNER NOTIFICATIONS (While App Open):**
```
┌─────────────────────────────────────────────┐
│  🎉 Alex is within 47 miles!                │
│  Tap to create a reunion →                  │
└─────────────────────────────────────────────┘
  ↑ Slides down from top
  ↑ Auto-dismisses after 5 seconds
  ↑ Tap to navigate to action
```

---

## 🎯 PREMIUM FEATURES (Nomad Plus)

### Paywall Trigger Points

**1. RADIUS EXPANSION**
```
User tries to expand radius beyond 10 miles:

┌─────────────────────────────────────────────┐
│                                             │
│  🔓 Unlock Extended Radius                  │
│                                             │
│  Free tier: 10 miles                        │
│  With Nomad Plus: Up to 50 miles            │
│                                             │
│  See more van-lifers and never miss         │
│  a connection!                              │
│                                             │
│  ✓ Extended radius (50 miles)               │
│  ✓ Travel companion tracking                │
│  ✓ Unlimited swipes                         │
│  ✓ See who liked you                        │
│  ✓ Priority support                         │
│                                             │
│  $4.99/month or $39.99/year (Save 33%)      │
│                                             │
│  [Upgrade to Nomad Plus]                    │
│  [Maybe Later]                              │
│                                             │
└─────────────────────────────────────────────┘
```

**2. COMPANION TRACKING**
```
User tries to add 4th travel companion:

┌─────────────────────────────────────────────┐
│                                             │
│  💙 Upgrade for Travel Companion Tracking   │
│                                             │
│  Free tier: Up to 3 companions              │
│  With Nomad Plus: Unlimited companions      │
│                                             │
│  Never lose touch with your travel family!  │
│                                             │
│  ✓ Unlimited travel companions              │
│  ✓ Get notified when companions nearby      │
│  ✓ See reunion suggestions                  │
│  ✓ Advanced privacy controls                │
│                                             │
│  [Upgrade Now] [Learn More]                 │
│                                             │
└─────────────────────────────────────────────┘
```
━━━━━━━━━━━━━━━━━━━━━━━━
