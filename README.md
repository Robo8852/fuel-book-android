# Covenant Fuel Station Locator - Mobile App

**React Native + Expo + React Native Paper**  
**Navy blue theme matching web app**

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npx expo start
```

### Test on Phone
1. Install "Expo Go" app from Play Store
2. Scan QR code from terminal
3. App loads on your phone!

---

## 📂 Project Structure

```
fuel-book-mobile/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with theme
│   └── index.tsx            # Main screen (search, filters, list)
├── components/              # UI components
│   ├── ErrorBoundary.tsx   # Crash protection
│   ├── SearchBar.tsx       # Search input
│   ├── StationCard.tsx     # Station display
│   └── FilterSection.tsx   # State/Type/Brand filters
├── theme/                   # React Native Paper theme
│   └── index.ts            # Navy blue colors
├── types/                   # TypeScript definitions
│   └── fuel-station.ts
├── data/                    # Data files
│   ├── fuel-stations.ts    # Data loader
│   ├── state-coverage.ts   # State mappings
│   └── fuel_stations_data.json  # ~150 stations
├── utils/                   # Business logic
│   └── data-transformer.ts # Search, filter, transform (45 tests!)
└── config/                  # Configuration
    └── constants.ts        # App settings
```

---

## 🎨 Theme

**Navy Blue Color Scheme:**
- Primary: `#1e3a8a` (Navy 950)
- Secondary: `#1e40af` (Navy 900)
- Accent: `#2563eb` (Blue 700)
- Background: `#f9fafb` (Gray 50)

Matches the web app design!

---

## 🧪 Testing

**Business Logic:**
- 45 unit tests in web app
- All functions tested before mobile port
- Data transformer thoroughly validated

**Manual Testing:**
1. Search by state (CA, CALIFORNIA)
2. Search by city (Los Angeles)
3. Filter by type (Exclusive, Primary, etc.)
4. Filter by brand (TA, PETRO, Covenant)
5. Clear all filters
6. Scroll through results

---

## 🏗️ Build APK

### Setup EAS Build
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build Preview APK
```bash
eas build --profile preview --platform android
```

Wait ~20 minutes, then download APK!

---

## 📱 Features

- ✅ Search by state, city, or terminal name
- ✅ Filter by station type (Exclusive, Primary, Limited, Covenant Terminal)
- ✅ Filter by brand (TA, PETRO, Covenant)
- ✅ ~150 fuel stations included
- ✅ Works offline (all data embedded)
- ✅ Navy blue theme
- ✅ Error boundaries for crash protection
- ✅ Smooth scrolling
- ✅ Results count display
- ✅ Clear all filters

---

## 🚛 Perfect for Trucking!

**Offline-First:**
- No internet required after installation
- All station data bundled with app
- Search and filter work offline

**Driver-Friendly:**
- Large touch targets (48dp minimum)
- Clear navy blue branding
- Easy-to-read station cards
- Quick filters

---

## 📚 Documentation

See parent directory for comprehensive docs:
- `ARCHITECTURE.md` - System overview
- `DEBUGGING_GUIDE.md` - Troubleshooting
- `MOBILE_PORT_REFERENCE.md` - Web to mobile migration
- `CODE_REFERENCE.md` - Quick reference
- `MOBILE_APP_COMPLETE.md` - Build summary

---

## 🔧 Tech Stack

- **React Native**: 0.81.4
- **Expo**: SDK 54
- **Expo Router**: 6.0.12
- **React Native Paper**: Latest
- **TypeScript**: 5.9.2
- **Node**: 20.19.5

---

## 🎯 Commands

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator

# Build
eas build --profile preview --platform android   # Build APK
eas build --profile production --platform android # Production APK

# Type Check
npx tsc --noEmit      # Check TypeScript errors
```

---

**Built with ❤️ for truck drivers**


