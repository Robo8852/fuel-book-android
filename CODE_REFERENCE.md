# Code Reference - Quick Lookup

**Snapshot Date:** October 17, 2025  
**Last Test Run:** All 45 tests passing ✅

---

## 📊 **Test Results Baseline**

### **Test Suite Summary:**
```
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Time:        ~2-3 seconds
Coverage:    74% of data-transformer.ts
```

### **Test Breakdown:**
```
parseCityStateZip:        12 tests ✅
transformFuelStation:     4 tests ✅
searchStations:           16 tests ✅ (CRITICAL)
getFilteredStations:      8 tests ✅
extractStates:            3 tests ✅
extractStationTypes:      1 test ✅
extractBrands:            1 test ✅
```

### **Critical Tests for Trucking:**
```
✅ "should NOT match CA in city Cartersville" - CRITICAL BUG FIX
✅ "should filter by state using full state name (CALIFORNIA)"
✅ "should filter by state using full state name (TEXAS)"
✅ "should find all CA stations when searching CA"
✅ "should be case insensitive for states"
```

---

## 📁 **File Structure**

### **Web Project:**
```
/home/owner/Github/Fuel Book Android/
├── src/
│   ├── types/
│   │   └── fuel-station.ts          [Shared] Type definitions
│   ├── data/
│   │   ├── fuel-stations.ts         [Shared] Data loading
│   │   └── state-coverage.ts        [Shared] State mappings
│   ├── utils/
│   │   ├── data-transformer.ts      [Shared] Business logic
│   │   └── __tests__/
│   │       └── data-transformer.test.ts  [Tests] 45 tests
│   ├── config/
│   │   └── constants.ts             [Shared] Configuration
│   ├── components/
│   │   ├── ErrorBoundary.tsx        [Shared concept, different impl]
│   │   └── ui/                      [Web only] shadcn/ui
│   ├── polymet/
│   │   ├── components/              [Web only] Tailwind components
│   │   ├── pages/
│   │   │   └── station-search.tsx   [Web only] Main page
│   │   └── layouts/
│   │       └── station-locator-layout.tsx [Web only]
│   └── App.tsx                      [Web only] Root component
├── fuel_stations_data.json          [Shared] Raw data (150 stations)
├── package.json                     [Web] Dependencies
├── jest.config.cjs                  [Shared] Test configuration
└── Documentation:
    ├── ARCHITECTURE.md
    ├── DEBUGGING_GUIDE.md
    ├── MOBILE_PORT_REFERENCE.md
    └── CODE_REFERENCE.md (this file)
```

### **Mobile Project:**
```
fuel-book-mobile/
├── app/                             [Mobile only] Expo Router
│   ├── _layout.tsx                  Root layout
│   └── index.tsx                    Main screen
├── components/                      [Mobile only] React Native Paper
│   ├── SearchBar.tsx
│   ├── StationCard.tsx
│   └── FilterSection.tsx
├── types/                           [Copied from web]
│   └── fuel-station.ts
├── data/                            [Copied from web]
│   ├── fuel-stations.ts
│   ├── state-coverage.ts
│   └── fuel_stations_data.json
├── utils/                           [Copied from web]
│   └── data-transformer.ts
├── config/                          [Copied from web]
│   └── constants.ts
├── theme/                           [Mobile only]
│   └── index.ts                     React Native Paper theme
├── App.tsx                          [Mobile only] Entry point
├── package.json                     [Mobile] RN dependencies
└── app.json                         [Mobile] Expo configuration
```

---

## 🔑 **Critical File Locations**

### **Constants:**
```
Location: src/config/constants.ts
Purpose: All configuration in one place
```

**Key Constants:**
```typescript
MIN_SEARCH_QUERY_LENGTH = 3
MAX_SEARCH_SUGGESTIONS = 5
DEFAULT_STATION_TYPE = 'Primary'
DEFAULT_BRAND = 'TA'
COLORS.navy950 = '#1e3a8a'
APP_CONFIG.title = 'Covenant Fuel Station Locator'
FILTER_CONFIG.allFilterValue = 'all'
STATION_BADGES = { exclusive: '★', primary: '●', ... }
MOBILE_CONFIG.minTouchTarget = 48
```

---

### **State Mapping:**
```
Location: src/data/state-coverage.ts
Export: STATE_NAME_TO_ABBREV
```

**Usage:**
```typescript
STATE_NAME_TO_ABBREV['CALIFORNIA'] // → "CA"
STATE_NAME_TO_ABBREV['TEXAS']      // → "TX"
STATE_NAME_TO_ABBREV['NEW YORK']   // → "NY"
```

**Critical For:**
- State filter functionality
- Search by full state name
- Empty state detection

---

### **Main Data Source:**
```
Location: fuel_stations_data.json (root)
Format: Backend format (nested by state)
Size: ~150 stations across 41 states
```

**Structure:**
```json
{
  "CALIFORNIA": {
    "fuel_stations": [...],
    "terminals": []
  },
  "COVENANT_TERMINALS": {
    "terminals": [...]
  }
}
```

---

### **Transformed Data:**
```
Location: src/data/fuel-stations.ts
Export: allFuelStations
Type: FuelStation[] (frontend format)
```

**Transformation Chain:**
```
fuel_stations_data.json
    ↓ (flattenStations)
allFuelStations: FuelStation[]
    ↓ (searchStations, filterStations)
filteredStations: FuelStation[]
    ↓ (UI component)
Displayed to user
```

---

## 🧪 **Test File Location**

```
Location: src/utils/__tests__/data-transformer.test.ts
Run: npm test
Coverage: npm test -- --coverage
Watch: npm test -- --watch
```

**Test Commands:**
```bash
# Run all tests
npm test

# Run specific test
npm test -- -t "parseCityStateZip"

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm test -- --watch

# Verbose output
npm test -- --verbose
```

---

## 📦 **Dependencies**

### **Web Dependencies:**
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@radix-ui/react-*": "Various",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.477.0"
}
```

### **Mobile Dependencies:**
```json
{
  "expo": "~54.0.13",
  "react-native": "0.81.4",
  "react-native-paper": "Latest",
  "expo-router": "Latest",
  "react-native-vector-icons": "Latest"
}
```

### **Shared Dev Dependencies:**
```json
{
  "jest": "^30.2.0",
  "ts-jest": "^29.4.5",
  "@types/jest": "^30.0.0",
  "typescript": "~5.7.2"
}
```

---

## 🎯 **Type Definitions**

### **Main Types Location:**
```
src/types/fuel-station.ts
```

**Core Types:**
```typescript
// Station types
type StationType = 'Exclusive' | 'Primary' | 'Limited' | 'Covenant Terminal'
type StationTypeFilter = StationType | 'all'

// Brand types  
type BrandType = 'TA' | 'PETRO' | 'Covenant'
type BrandTypeFilter = BrandType | 'all'

// Main interface
interface FuelStation {
  id: string;
  stationName: string;
  address: string;
  city: string;
  state: string;         // IMPORTANT: Abbreviation (CA, TX)
  zip: string;
  stationType: StationType;
  brand: BrandType;
  phone?: string;
  navigoId: string;
  exitInfo?: string;
  // ... plus Covenant-specific fields
}
```

---

## 🔧 **Function Reference**

### **Most Used Functions:**

**1. getFilteredStations()**
```
Location: src/utils/data-transformer.ts:447
Purpose: Main search + filter function
Input: allStations, query, state, type, brand
Output: FuelStation[]
Tests: 8 tests
Used By: StationSearchPage (main screen)
```

**2. searchStations()**
```
Location: src/utils/data-transformer.ts:327
Purpose: Text search with state mapping
Input: stations, query
Output: FuelStation[]
Tests: 16 tests (CRITICAL!)
Algorithm: O(n) linear search
```

**3. parseCityStateZip()**
```
Location: src/utils/data-transformer.ts:19
Purpose: Parse "City, ST ZIP" → {city, state, zip}
Input: string ("Corning, CA 96021")
Output: {city: string, state: string, zip: string}
Tests: 12 tests
Edge Cases: Handles null, empty, malformed
```

**4. transformFuelStation()**
```
Location: src/utils/data-transformer.ts:78
Purpose: Backend format → Frontend format
Input: BackendFuelStation, stateName
Output: FuelStation
Tests: 4 tests
Used By: flattenStations()
```

---

## 📊 **Data Statistics**

### **Current Data (October 17, 2025):**
```
Total Stations: ~150
States with Stations: 41
States without Stations: 9

Breakdown:
- TA Stations: ~70
- PETRO Stations: ~50
- Covenant Terminals: ~30

Types:
- Exclusive: ~40
- Primary: ~80
- Limited: ~20
- Covenant Terminal: ~30
```

**Source:** Generated from `fuel_stations_data.json`

---

## 🎨 **Theme/Branding**

### **Color Palette (Navy Blue):**
```typescript
Primary Colors:
- navy950: #1e3a8a
- navy900: #1e40af  
- navy800: #1d4ed8

Supporting:
- white: #ffffff
- gray50: #f9fafb

Brand-Specific:
- TA: #2563eb (blue)
- PETRO: #16a34a (green)
- Covenant: #9333ea (purple)
- Exclusive: #eab308 (yellow/gold)
```

**Usage:**
```typescript
// Import constants
import { COLORS } from './config/constants';

// Use in styles
backgroundColor: COLORS.navy950
color: COLORS.white
```

---

## 🔍 **Search Behavior**

### **Search Priority:**
```
1. State abbreviation (CA, TX) - exact match
2. Full state name (california, texas) - mapped to abbrev
3. State prefix (calif → California)
4. City name (3+ chars, word boundary)
5. Station name (3+ chars, word boundary)
6. NaviGo ID (any length, contains)
```

### **Filter Behavior:**
```
AND Logic (all filters must match):
- Search query filters first
- Then state filter
- Then station type filter
- Then brand filter

"all" value = ignore that filter
```

---

## 🚨 **Known Bugs (Fixed)**

### **Bug 1: State Filter Not Working**
```
Date Fixed: October 17, 2025
Issue: Selecting "CALIFORNIA" showed no results
Cause: Dropdown value "CALIFORNIA", data has "CA"
Fix: Added STATE_NAME_TO_ABBREV mapping in filterStations()
Test: "should filter by state using full state name (CALIFORNIA)"
Files Changed: data-transformer.ts, state-coverage.ts
```

### **Bug 2: CA Matches Cartersville**
```
Date Fixed: Before Oct 17, 2025
Issue: Searching "CA" returned Georgia stations
Cause: Substring match without state priority
Fix: Check state matches FIRST, word boundary for cities
Test: "should NOT match CA in city Cartersville - CRITICAL BUG FIX"
Files Changed: data-transformer.ts
```

### **Bug 3: Type Errors with 'all' Filter**
```
Date Fixed: October 17, 2025
Issue: TypeScript error on selectedType !== 'all'
Cause: StationType didn't include 'all'
Fix: Created StationTypeFilter = StationType | 'all'
Test: "should ignore 'all' filter values"
Files Changed: fuel-station.ts, data-transformer.ts
```

---

## 📱 **Platform-Specific Code**

### **Web-Only Files:**
```
src/components/ui/**         - shadcn/ui components (54 files)
src/polymet/components/**    - Web components (6 files)
src/polymet/pages/**         - Web pages (1 file)
src/polymet/layouts/**       - Web layouts (1 file)
src/main.tsx                 - Web entry point
src/index.css                - Web global styles
```

### **Mobile-Only Files:**
```
fuel-book-mobile/app/**      - Expo Router (not built yet)
fuel-book-mobile/components/** - React Native components (not built yet)
fuel-book-mobile/theme/**    - RN Paper theme (not built yet)
fuel-book-mobile/App.tsx     - Mobile entry point
fuel-book-mobile/app.json    - Expo configuration
```

### **Shared Files (Copy to Mobile):**
```
types/fuel-station.ts        - Type definitions
data/fuel-stations.ts        - Data loading
data/state-coverage.ts       - State mappings
utils/data-transformer.ts    - All business logic
config/constants.ts          - Configuration
data/fuel_stations_data.json - Raw station data
```

---

## 🔧 **Configuration Files**

### **Testing:**
```
jest.config.cjs - Jest configuration for TypeScript
```

### **TypeScript:**
```
tsconfig.json       - Web TypeScript config
tsconfig.app.json   - App-specific TS config
tsconfig.node.json  - Node-specific TS config
```

### **Build Tools:**
```
vite.config.ts      - Web: Vite bundler config
package.json        - Both: Dependencies and scripts
```

### **Mobile Specific:**
```
app.json            - Expo configuration
eas.json            - EAS Build configuration (when created)
```

---

## 📝 **Important Code Snippets**

### **Data Loading:**
```typescript
// Location: src/data/fuel-stations.ts:15
export const allFuelStations: FuelStation[] = flattenStations(backendData);

// This is THE source of all station data
// If this is empty, nothing works!
```

### **State Filter Logic:**
```typescript
// Location: src/utils/data-transformer.ts:418-432
if (selectedState && selectedState !== 'all') {
  filtered = filtered.filter((station) => {
    const stateAbbrev = station.state.toUpperCase();
    const selectedUpper = selectedState.toUpperCase();
    
    // Direct match (CA === CA)
    if (stateAbbrev === selectedUpper) return true;
    
    // Full name match (CALIFORNIA → CA)
    if (STATE_NAME_TO_ABBREV[selectedUpper] === stateAbbrev) return true;
    
    return false;
  });
}
```

### **Search with State Priority:**
```typescript
// Location: src/utils/data-transformer.ts:336-375
const exactStateMatch = state === normalizedQuery;
const fullStateNameMatch = STATE_ALIASES[originalQuery] && 
  state === STATE_ALIASES[originalQuery].toLowerCase();
const statePrefixMatch = REVERSE_STATE_ALIASES[station.state] && 
  REVERSE_STATE_ALIASES[station.state].toLowerCase().startsWith(originalQuery);

const isStateMatch = exactStateMatch || fullStateNameMatch || statePrefixMatch;
if (isStateMatch) {
  return true;  // IMPORTANT: Return immediately for state matches
}
```

---

## 🎓 **Code Patterns Used**

### **Pattern 1: Pure Functions**
```typescript
// All transformation functions are pure
export function parseCityStateZip(input: string) {
  // No side effects
  // Same input → Same output
  // Easy to test
  return { city, state, zip };
}
```

### **Pattern 2: Immutability**
```typescript
// Never mutate arrays
let filtered = [...stations];  // Copy first
filtered = filtered.filter(...); // New array
return filtered;  // Original unchanged
```

### **Pattern 3: Type Safety**
```typescript
// Strong typing prevents bugs
type StationType = 'Exclusive' | 'Primary' | 'Limited' | 'Covenant Terminal';
// TypeScript won't let you use 'Invalid' - compile error!
```

### **Pattern 4: Defensive Programming**
```typescript
// Always check inputs
if (!cityStateZip || !cityStateZip.includes(',')) {
  return { city: '', state: '', zip: '' };
}

// Optional chaining
{station?.phone && <Text>{station.phone}</Text>}
```

### **Pattern 5: Memoization**
```typescript
// Expensive computations cached
const filteredStations = useMemo(
  () => getFilteredStations(...),
  [searchQuery, selectedState, ...]  // Only recalc when deps change
);
```

---

## 📚 **Documentation Index**

### **When to Read Which Doc:**

**Starting mobile port?**
→ Read MOBILE_PORT_REFERENCE.md

**APK has errors?**
→ Read DEBUGGING_GUIDE.md

**Need to understand system?**
→ Read ARCHITECTURE.md

**Quick code lookup?**
→ Read CODE_REFERENCE.md (this file)

---

## 🎯 **Quick Answers**

### **Q: Where are the tests?**
```
A: src/utils/__tests__/data-transformer.test.ts
   Run with: npm test
```

### **Q: Where is the data?**
```
A: fuel_stations_data.json (root)
   Loaded in: src/data/fuel-stations.ts
   Transformed by: src/utils/data-transformer.ts
```

### **Q: Where are constants?**
```
A: src/config/constants.ts
   Import: import { COLORS, APP_CONFIG } from '@/config/constants';
```

### **Q: How do I run the web app?**
```
A: npm run dev
   Opens: http://localhost:5173
```

### **Q: How do I run the mobile app?**
```
A: cd fuel-book-mobile
   npx expo start
   Scan QR code with Expo Go app
```

### **Q: How do I build APK?**
```
A: cd fuel-book-mobile
   eas build --profile preview --platform android
   Wait ~20 minutes for download link
```

### **Q: Why isn't state filter working?**
```
A: Check STATE_NAME_TO_ABBREV imported in data-transformer.ts
   See DEBUGGING_GUIDE.md → Issue 1
```

### **Q: Where's the navy blue color?**
```
A: constants.ts → COLORS.navy950 = '#1e3a8a'
   Or hardcoded in Tailwind: bg-blue-950
```

---

## 🔢 **Version History**

### **v1.0.0 - October 17, 2025**
```
✅ Initial web version complete
✅ 45 tests passing
✅ MIT fixes applied:
   - Unit tests added
   - Constants extracted
   - Error boundaries added
✅ Bugs fixed:
   - State filter bug fixed
   - Type safety issues fixed
   - "CA vs Cartersville" bug fixed
✅ Ready for mobile port
```

---

## 📞 **Quick Debug Commands**

```bash
# Check if tests pass
npm test

# Check TypeScript errors
npx tsc --noEmit

# Check data file exists
ls fuel_stations_data.json

# Check Metro bundler
npx expo start --clear

# Check APK logs
adb logcat | grep -i covenant

# Rebuild from scratch
rm -rf node_modules && npm install

# See what's running
pgrep -a node
pgrep -a expo
```

---

## ✅ **Success Indicators**

**Code is healthy when:**
```
✅ npm test → 45/45 passing
✅ npm run dev → No console errors
✅ TypeScript → No errors (npx tsc --noEmit)
✅ Web app → Search and filters work
✅ Expo Go → App loads and functions
✅ APK → Installs and runs offline
```

---

## 🚀 **Next Steps**

**Current Status:** Web complete, mobile not started  
**Next Phase:** Mobile port (Sessions 4-7)  
**Estimated Time:** 3-4 hours  
**Deliverable:** Working APK for trucking use

---

**Last Updated:** October 17, 2025  
**Maintained By:** Development team  
**For Questions:** See other documentation files


