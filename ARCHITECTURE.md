# Covenant Fuel Locator - Architecture Documentation

**Last Updated:** October 17, 2025  
**Version:** 1.0.0  
**Platforms:** Web (React), Mobile (React Native)

---

## 🎯 **System Overview**

The Covenant Fuel Locator is a cross-platform application that helps truck drivers find Covenant fuel stations across the United States. The app supports search by state, city, station name, and various filters.

### **Key Features:**
- State-based search (handles both abbreviations and full names)
- Multi-criteria filtering (state, brand, station type)
- Offline-first data (all stations bundled in app)
- Navy blue branded UI
- Error-resilient architecture

---

## 📊 **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DATA SOURCE                                              │
│    fuel_stations_data.json (Backend format)                 │
│    ├── CALIFORNIA: { fuel_stations: [...], terminals: [...]}│
│    ├── TEXAS: { fuel_stations: [...], terminals: [...] }   │
│    └── COVENANT_TERMINALS: { terminals: [...] }            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. DATA TRANSFORMATION (data-transformer.ts)                │
│    Backend Format → Frontend Format                         │
│    ├── parseCityStateZip("Corning, CA 96021")             │
│    │   → {city: "Corning", state: "CA", zip: "96021"}     │
│    ├── normalizeStationType("Primary") → "Primary"         │
│    ├── normalizeBrand("TA") → "TA"                         │
│    └── flattenStations() → Array of FuelStation objects    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. DATA LOADING (fuel-stations.ts)                         │
│    export const allFuelStations: FuelStation[] = [...]     │
│    ├── ~150 total stations                                 │
│    ├── Multiple states (CA, TX, FL, etc.)                  │
│    └── Brands: TA, PETRO, Covenant                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SEARCH & FILTER (data-transformer.ts)                   │
│    User Input → Filtered Results                           │
│    ├── searchStations(allStations, "CA")                  │
│    │   → Stations in California                            │
│    ├── filterStations(results, "CALIFORNIA", "Primary")   │
│    │   → Primary stations in CA                            │
│    └── getFilteredStations() → Combined search + filters   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. REACT STATE (station-search.tsx)                        │
│    const [searchQuery, setSearchQuery] = useState("")      │
│    const [selectedState, setSelectedState] = useState()    │
│    const filteredStations = useMemo(...)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. UI RENDERING                                             │
│    WEB: shadcn/ui components + Tailwind CSS               │
│    MOBILE: React Native Paper + StyleSheet                 │
│    ├── SearchBar component                                 │
│    ├── FilterSection component                             │
│    └── StationCard list (map over filteredStations)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ **File Structure**

### **Shared Code (Web + Mobile):**
```
src/
├── types/
│   └── fuel-station.ts          ✅ Shared - Type definitions
├── data/
│   ├── fuel-stations.ts         ✅ Shared - Data loading
│   └── state-coverage.ts        ✅ Shared - State mappings
├── utils/
│   └── data-transformer.ts      ✅ Shared - All business logic
└── config/
    └── constants.ts             ✅ Shared - Configuration
```

### **Web-Only Code:**
```
src/
├── components/ui/               ❌ Web only - shadcn/ui
├── polymet/components/          ❌ Web only - HTML/Tailwind
└── App.tsx                      ❌ Web only - React DOM
```

### **Mobile-Only Code:**
```
fuel-book-mobile/
├── app/                         📱 Mobile only - Expo Router
├── components/                  📱 Mobile only - React Native
└── App.tsx                      📱 Mobile only - React Native
```

---

## 🔑 **Critical Functions Reference**

### **1. parseCityStateZip()**
```typescript
Input:  "Corning, CA 96021"
Output: { city: "Corning", state: "CA", zip: "96021" }

Purpose: Parses backend "city_state_zip" field into separate components
Tests:   12 tests covering all edge cases
Location: src/utils/data-transformer.ts:19

Edge Cases Handled:
✓ Missing zip code
✓ Empty/null input
✓ Extra spaces
✓ Malformed data (returns empty strings, doesn't crash)
```

### **2. searchStations()**
```typescript
Input:  allStations, "CA"
Output: [stations in California]

Purpose: Main search function with smart state mapping
Tests:   16 tests (CRITICAL for trucking!)
Location: src/utils/data-transformer.ts:327

Search Priority:
1. Exact state abbreviation match (CA)
2. Full state name match (california → CA)
3. State prefix match (calif → California)
4. If state match: return immediately (optimization)
5. Otherwise: search city, station name, NaviGo ID (min 3 chars)

CRITICAL BUG FIX:
✓ "CA" search does NOT match "Cartersville, GA"
✓ Uses word boundary matching (\b regex)
✓ Minimum 3 character query for non-state searches
```

### **3. getFilteredStations()**
```typescript
Input:  allStations, searchQuery, state, type, brand
Output: Filtered array of stations

Purpose: Combines search + all filters
Tests:   8 tests
Location: src/utils/data-transformer.ts:447

Filter Chain:
1. searchStations() - Text search
2. filterStations() - State + Type filters
3. filterByBrand() - Brand filter
4. Returns intersection of all filters
```

### **4. STATE_NAME_TO_ABBREV Mapping**
```typescript
Purpose: Maps full state names to abbreviations
Location: src/data/state-coverage.ts:14

Examples:
"CALIFORNIA" → "CA"
"TEXAS" → "TX"
"NEW YORK" → "NY"

Why Critical:
- UI shows full names (CALIFORNIA)
- Data has abbreviations (CA)
- Filter must handle both!
```

---

## 🏗️ **Component Architecture**

### **Web Components:**
```
App.tsx (Root)
└── ErrorBoundary
    └── StationLocatorLayout
        ├── AppHeader
        └── StationSearchPage
            ├── SearchBar
            ├── FilterSection
            └── StationCard (list)
```

### **Mobile Components (Future):**
```
App.tsx (Root)
└── ErrorBoundary
    └── NavigationContainer (Expo Router)
        └── Stack/Tabs Navigator
            └── HomeScreen (index.tsx)
                ├── SearchBar (React Native)
                ├── FilterSection (React Native)
                └── FlatList of StationCards
```

---

## 🔄 **State Management**

### **Local State (React hooks):**
```typescript
// In StationSearchPage
const [searchQuery, setSearchQuery] = useState("");
const [selectedState, setSelectedState] = useState<string>();
const [selectedStationType, setSelectedStationType] = useState<StationTypeFilter>();
const [selectedBrand, setSelectedBrand] = useState<BrandTypeFilter>();

// Computed state (memoized)
const filteredStations = useMemo(() => 
  getFilteredStations(allFuelStations, searchQuery, selectedState, ...),
  [searchQuery, selectedState, selectedStationType, selectedBrand]
);
```

**Why useMemo:**
- Search is O(n) operation
- Re-runs only when dependencies change
- Prevents lag during typing

---

## 📦 **Data Structure**

### **FuelStation Interface:**
```typescript
interface FuelStation {
  id: string;              // "CA-163" (state + number)
  stationName: string;     // "#163 TA Santa Nella"
  address: string;         // "12310 California Hwy 33"
  city: string;            // "Santa Nella"
  state: string;           // "CA" (abbreviation!)
  zip: string;             // "95322"
  stationType: StationType; // "Exclusive" | "Primary" | "Limited" | "Covenant Terminal"
  brand: BrandType;        // "TA" | "PETRO" | "Covenant"
  phone?: string;          // Optional
  fax?: string;            // Optional
  navigoId: string;        // "CVEN-TA163" (required for routing)
  exitInfo?: string;       // "I-5, Exit 407"
  amenities?: string[];    // Covenant terminals only
  showers?: string;        // Covenant terminals only
  parking?: string;        // Covenant terminals only
  shop?: string;           // Covenant terminals only
}
```

### **Type Hierarchy:**
```
StationType = 'Exclusive' | 'Primary' | 'Limited' | 'Covenant Terminal'
StationTypeFilter = StationType | 'all'  // For UI filters

BrandType = 'TA' | 'PETRO' | 'Covenant'
BrandTypeFilter = BrandType | 'all'      // For UI filters
```

---

## ⚡ **Performance Considerations**

### **Current Implementation:**
```
Search Algorithm: O(n) linear search
Station Count: ~150 stations
Performance: < 50ms on typical hardware
Good enough for: Current use case ✅
```

### **Future Optimization (if needed):**
```
Search Indexing: O(1) hash map lookups
When to implement: If station count > 1000
Constants ready: PERFORMANCE_CONFIG.useSearchIndex
```

---

## 🔍 **Search Algorithm Details**

### **State Matching Logic:**
```typescript
// Priority order:
1. Exact state abbreviation: "CA" === "CA" ✅
2. Full state name mapping: STATE_NAME_TO_ABBREV["CALIFORNIA"] === "CA" ✅
3. State prefix: "California".startsWith("calif") ✅

// If any state match found: return immediately (don't search other fields)
// This prevents "CA" from matching "Cartersville"
```

### **Non-State Search:**
```typescript
// Only if query is NOT a state name AND length >= 3:
- Station name (word boundary match: \b)
- City name (word boundary match: \b)
- NaviGo ID (contains match)
```

### **MIN_SEARCH_QUERY_LENGTH = 3:**
```
Why: Prevents false positives
Example: "ca" would match "Cartersville" (bad!)
Solution: Require 3+ chars for non-state searches
```

---

## 🐛 **Known Issues & Solutions**

### **Issue 1: State Filter Not Working**
**Symptom:** Selecting "CALIFORNIA" shows no results  
**Cause:** Dropdown value is "CALIFORNIA", but station.state is "CA"  
**Solution:** Use STATE_NAME_TO_ABBREV mapping in filterStations()  
**Fixed:** October 17, 2025  
**Test:** "should filter by state using full state name (CALIFORNIA)" ✅

### **Issue 2: Search "CA" Matches "Cartersville"**
**Symptom:** Searching "CA" returns Georgia stations  
**Cause:** Substring match without word boundaries  
**Solution:** Check if query is state name FIRST, use word boundary regex  
**Fixed:** Implemented with MIN_SEARCH_QUERY_LENGTH  
**Test:** "should NOT match CA in city Cartersville" ✅

---

## 🔧 **Configuration**

### **Constants Location:**
```
src/config/constants.ts
```

### **Key Constants:**
```typescript
MIN_SEARCH_QUERY_LENGTH = 3      // Prevents false positives
MAX_SEARCH_SUGGESTIONS = 5        // Search autocomplete limit
DEFAULT_STATION_TYPE = 'Primary'  // Fallback for unknown types
DEFAULT_BRAND = 'TA'              // Fallback for unknown brands

// Mobile-specific (future)
MOBILE_CONFIG.minSearchQueryLength = 2  // Easier on touch keyboards
MOBILE_CONFIG.minTouchTarget = 48       // Android/iOS guidelines
```

### **Color Palette:**
```typescript
Navy Blue Theme:
- navy950: #1e3a8a (primary dark)
- navy900: #1e40af (secondary)
- navy800: #1d4ed8 (medium)

Brand Colors:
- TA: #2563eb (blue)
- PETRO: #16a34a (green)
- Covenant: #9333ea (purple)
```

---

## 🧪 **Testing Coverage**

### **Tested Functions (45 tests):**
```
✅ parseCityStateZip: 12 tests
✅ transformFuelStation: 4 tests
✅ searchStations: 16 tests (CRITICAL!)
✅ getFilteredStations: 8 tests
✅ extractStates: 3 tests
✅ extractStationTypes: 1 test
✅ extractBrands: 1 test

Coverage: 74% of data-transformer.ts
```

### **Test File Location:**
```
src/utils/__tests__/data-transformer.test.ts
```

### **Run Tests:**
```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode
```

---

## 🚀 **Deployment Architecture**

### **Web (Current):**
```
Build: Vite
Hosting: Static files (dist/)
Entry: src/main.tsx → index.html
```

### **Mobile (Future):**
```
Build: EAS Build (Expo cloud service)
Distribution: APK file or Google Play Store
Entry: App.tsx → Expo Router → app/index.tsx
Runtime: Hermes JavaScript engine
```

---

## 📱 **Mobile Port Strategy**

### **Reusable Code (90%):**
```
✅ Types (fuel-station.ts)
✅ Data loading (fuel-stations.ts)
✅ Business logic (data-transformer.ts)
✅ Constants (constants.ts)
✅ State coverage (state-coverage.ts)
```

### **Must Rebuild (10%):**
```
❌ UI Components (shadcn → React Native Paper)
❌ Styling (Tailwind → StyleSheet)
❌ Navigation (React Router → Expo Router)
❌ Layout (HTML divs → React Native Views)
```

---

## 🎨 **UI Component Mapping**

### **Web → Mobile Translation:**
```
<div>                    → <View>
<span>, <p>              → <Text>
<input>                  → <TextInput>
shadcn/ui Card           → React Native Paper Card
shadcn/ui Input          → React Native Paper Searchbar
shadcn/ui Select         → React Native Paper Menu
Tailwind className       → StyleSheet.create()
onClick                  → onPress
```

---

## ⚠️ **Critical Dependencies**

### **State Mapping:**
```
STATE_NAME_TO_ABBREV must be imported in:
- data-transformer.ts (for search)
- filter components (for display)

If missing: State filter won't work!
```

### **Import Aliases:**
```
Web:    import { X } from '@/path/to/X'
Mobile: import { X } from '../path/to/X'  (relative paths!)

Must update ALL imports when copying to mobile!
```

---

## 🔐 **Error Handling**

### **Error Boundary:**
```
Location: src/components/ErrorBoundary.tsx
Wraps: Entire app in App.tsx
Catches: JavaScript errors in component tree
Shows: Friendly error screen (not blank page)
Actions: "Try Again" or "Reload Page"
```

### **Defensive Programming:**
```typescript
// Null safety
{station.phone && <Text>{station.phone}</Text>}

// Input validation
if (!cityStateZip || !cityStateZip.includes(',')) {
  return { city: '', state: '', zip: '' };
}

// Type narrowing
if (selectedState && selectedState !== 'all') {
  // Safe to filter
}
```

---

## 📈 **Performance Metrics**

### **Current Performance:**
```
Search time: < 50ms (150 stations)
Filter time: < 10ms
UI render: < 100ms
Total: < 200ms (acceptable for mobile)
```

### **Optimization Opportunities:**
```
1. Search indexing (O(n) → O(1))
2. Virtual scrolling (FlatList for 1000+ items)
3. Memoization (already using useMemo ✅)
```

---

## 🎯 **Design Decisions**

### **Why State Name + Abbreviation Support?**
```
Problem: Backend has "CALIFORNIA", data has "CA"
Solution: Support both in search/filter
Tradeoff: Slight complexity, better UX
```

### **Why MIN_SEARCH_QUERY_LENGTH = 3?**
```
Problem: "CA" matches "Cartersville"
Solution: Require 3 chars for non-state searches
Exception: State searches work with 2 chars (CA, TX)
```

### **Why useMemo for filteredStations?**
```
Problem: Re-filtering on every render = lag
Solution: Only re-filter when dependencies change
Result: Smooth typing experience
```

---

## 🛠️ **Developer Notes**

### **Adding New States:**
```typescript
// 1. Add to STATE_NAME_TO_ABBREV in state-coverage.ts
'NEW STATE': 'NS',

// 2. Add backend data to fuel_stations_data.json
"NEW STATE": {
  "fuel_stations": [...],
  "terminals": []
}

// 3. Tests should catch any issues
npm test
```

### **Adding New Station Types:**
```typescript
// 1. Update type in fuel-station.ts
export type StationType = ... | 'NewType';

// 2. Update normalizeStationType in data-transformer.ts
if (normalized.includes('newtype')) return 'NewType';

// 3. Add badge in station-card.tsx
case 'NewType': return <span>...</span>;
```

---

## 📞 **Support & Debugging**

### **When Things Break:**
1. Check this ARCHITECTURE.md for system overview
2. Check DEBUGGING_GUIDE.md for specific errors
3. Run tests: `npm test`
4. Check browser/Metro console for errors
5. Verify data file integrity

### **Common Questions:**
- Q: Why doesn't search work? → Check STATE_NAME_TO_ABBREV
- Q: Why no results? → Check data transformation
- Q: Why crash? → Check ErrorBoundary logs
- Q: Why slow? → Check useMemo dependencies

---

**For detailed debugging, see DEBUGGING_GUIDE.md**  
**For mobile port details, see MOBILE_PORT_REFERENCE.md**  
**For code locations, see CODE_REFERENCE.md**


