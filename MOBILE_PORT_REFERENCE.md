# Mobile Port Reference Guide

**Web to React Native Migration**  
**Date:** October 17, 2025

---

## 🎯 **Overview**

This document tracks exactly what changed when porting from web to mobile, and what stayed the same. Critical for debugging platform-specific issues.

---

## ✅ **What Stayed EXACTLY the Same**

### **Business Logic (100% Reused):**
```
src/types/fuel-station.ts          → fuel-book-mobile/types/fuel-station.ts
src/data/fuel-stations.ts          → fuel-book-mobile/data/fuel-stations.ts
src/data/state-coverage.ts         → fuel-book-mobile/data/state-coverage.ts
src/utils/data-transformer.ts      → fuel-book-mobile/utils/data-transformer.ts
src/config/constants.ts            → fuel-book-mobile/config/constants.ts
fuel_stations_data.json            → fuel-book-mobile/data/fuel_stations_data.json
```

**Important:** These files are IDENTICAL copies. Same logic, same tests, same bugs/fixes!

**Debugging Tip:**
```
If search works on web but not mobile:
→ NOT a business logic issue
→ Check UI component or data loading
```

---

## ❌ **What Changed Completely**

### **UI Components (100% Rebuilt):**

| Web Component | Mobile Component | Technology Change |
|--------------|------------------|-------------------|
| `shadcn/ui Card` | `React Native Paper Card` | Radix UI → Material Design |
| `shadcn/ui Input` | `React Native Paper Searchbar` | HTML → Native |
| `shadcn/ui Select` | `React Native Paper Menu` | Dropdown → Native picker |
| `<div>` | `<View>` | HTML → React Native primitive |
| `<span>`, `<p>` | `<Text>` | HTML → React Native primitive |
| `className="..."` | `style={styles.X}` | Tailwind CSS → StyleSheet |

---

## 🔄 **Component-by-Component Changes**

### **1. SearchBar**

**Web (shadcn/ui):**
```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Search..."
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="pl-12 pr-4 py-6"
/>
```

**Mobile (React Native Paper):**
```tsx
import { Searchbar } from 'react-native-paper';

<Searchbar
  placeholder="Search..."
  value={value}
  onChangeText={onChange}  // Note: onChangeText not onChange!
  style={{ backgroundColor: '#fff' }}
/>
```

**Key Differences:**
- `onChange={(e) => (...)}` → `onChangeText={(text) => (...)}`
- `className` → `style` prop
- No `type="text"` needed

---

### **2. StationCard**

**Web (shadcn/ui Card):**
```tsx
import { Card, CardContent } from "@/components/ui/card";

<Card className="hover:shadow-lg" onClick={onClick}>
  <CardContent className="p-5">
    <div className="flex items-start">
      <h3 className="text-lg font-bold">{station.stationName}</h3>
    </div>
  </CardContent>
</Card>
```

**Mobile (React Native Paper Card):**
```tsx
import { Card, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

<Card style={styles.card} onPress={onPress}>  {/* onPress not onClick! */}
  <Card.Content>
    <View style={styles.row}>
      <Text style={styles.title}>{station.stationName}</Text>
    </View>
  </Card.Content>
</Card>

const styles = StyleSheet.create({
  card: { marginVertical: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
});
```

**Key Differences:**
- `onClick` → `onPress`
- `className` → `style={styles.X}`
- All text MUST be in `<Text>` component
- Flexbox only (no CSS Grid)

---

### **3. FilterSection**

**Web (shadcn/ui Select):**
```tsx
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

<Select value={selectedState} onValueChange={onStateChange}>
  <SelectTrigger>
    <SelectValue placeholder="All States" />
  </SelectTrigger>
  <SelectContent>
    {states.map(state => (
      <SelectItem value={state}>{state}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Mobile (React Native Paper Menu):**
```tsx
import { Menu, Button } from 'react-native-paper';

const [visible, setVisible] = useState(false);

<Menu
  visible={visible}
  onDismiss={() => setVisible(false)}
  anchor={<Button onPress={() => setVisible(true)}>
    {selectedState || 'All States'}
  </Button>}
>
  {states.map(state => (
    <Menu.Item
      key={state}
      onPress={() => {
        onStateChange(state);
        setVisible(false);
      }}
      title={state}
    />
  ))}
</Menu>
```

**Key Differences:**
- Select → Menu + Button + state management
- Must manually handle open/close
- Different component structure

---

## 📝 **Import Path Changes**

### **CRITICAL: All imports must change!**

**Web (uses path aliases):**
```typescript
import { FuelStation } from '@/types/fuel-station';
import { allFuelStations } from '@/data/fuel-stations';
import { getFilteredStations } from '@/utils/data-transformer';
import { APP_CONFIG } from '@/config/constants';
```

**Mobile (relative paths only):**
```typescript
import { FuelStation } from '../types/fuel-station';
import { allFuelStations } from '../data/fuel-stations';
import { getFilteredStations } from '../utils/data-transformer';
import { APP_CONFIG } from '../config/constants';
```

**Find & Replace Strategy:**
```
Find:    @/types
Replace: ../types

Find:    @/data
Replace: ../data

Find:    @/utils
Replace: ../utils

Find:    @/config
Replace: ../config
```

---

## 🎨 **Styling Changes**

### **Web (Tailwind CSS):**
```tsx
<div className="flex items-center justify-between gap-4 p-5 bg-white border-blue-300">
  <h3 className="text-lg font-bold text-blue-900">Title</h3>
</div>
```

### **Mobile (StyleSheet):**
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderColor: '#93c5fd',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
});
```

**Translation Guide:**
```
flex               → flexDirection: 'row'
flex-col           → flexDirection: 'column'
items-center       → alignItems: 'center'
justify-between    → justifyContent: 'space-between'
gap-4              → gap: 16  (4 * 4px = 16px)
p-5                → padding: 20  (5 * 4px = 20px)
text-lg            → fontSize: 18
font-bold          → fontWeight: 'bold'
text-blue-900      → color: '#1e3a8a'
bg-white           → backgroundColor: '#ffffff'
border-blue-300    → borderColor: '#93c5fd', borderWidth: 1
rounded-xl         → borderRadius: 12
shadow-lg          → shadowColor, shadowOffset, shadowOpacity, elevation
```

---

## 📦 **Technology Stack Comparison**

| Aspect | Web | Mobile |
|--------|-----|--------|
| **Framework** | React 19 + Vite | React Native 0.81 + Expo 54 |
| **UI Library** | shadcn/ui (Radix) | React Native Paper |
| **Styling** | Tailwind CSS | StyleSheet API |
| **Icons** | Lucide React | React Native Vector Icons |
| **Navigation** | React Router DOM | Expo Router |
| **Build Tool** | Vite | Metro Bundler |
| **Runtime** | Browser | Hermes JS Engine |
| **Platform** | Web (any browser) | Android (native) |

---

## 🔧 **Configuration Differences**

### **Web (package.json):**
```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-*": "...",
    "tailwindcss": "..."
  }
}
```

### **Mobile (package.json):**
```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android"
  },
  "dependencies": {
    "expo": "~54.0.13",
    "react-native": "0.81.4",
    "react-native-paper": "...",
    "expo-router": "..."
  }
}
```

---

## 🚀 **Build Process Changes**

### **Web Build:**
```bash
npm run build
→ Creates dist/ folder
→ Static HTML/JS/CSS files
→ Deploy to any web server
```

### **Mobile Build:**
```bash
eas build --platform android
→ Uploads code to Expo servers
→ Builds APK/AAB in cloud
→ Downloads installable APK file
→ Install on phones via file transfer
```

---

## 🐛 **Common Port Issues**

### **1. Import Path Errors**
```
Symptom: "Module not found: @/types/..."
Cause: Path alias doesn't work on mobile
Fix: Use relative paths (../types/...)
```

### **2. Tailwind Classes Don't Work**
```
Symptom: No styling appears
Cause: Tailwind is web-only CSS
Fix: Convert to StyleSheet
```

### **3. onClick Doesn't Work**
```
Symptom: Button doesn't respond
Cause: React Native uses onPress not onClick
Fix: Replace all onClick with onPress
```

### **4. Text Not Showing**
```
Symptom: Blank spaces where text should be
Cause: String not wrapped in <Text>
Fix: All text must be: <Text>{string}</Text>
```

---

## 📊 **State Management (Same Logic, Different Hooks)**

### **Both Platforms Use:**
```typescript
// IDENTICAL React hooks
const [searchQuery, setSearchQuery] = useState("");
const [selectedState, setSelectedState] = useState<string>();

const filteredStations = useMemo(() => 
  getFilteredStations(allFuelStations, searchQuery, ...),
  [searchQuery, selectedState, ...]
);

// Same useState, useMemo, useEffect
// Logic is identical!
```

**This is why testing business logic was critical!**

---

## 🎨 **Design System Translation**

### **Navy Blue Theme (Constant Across Platforms):**
```typescript
// Constants file (shared)
COLORS.navy950 = '#1e3a8a'

// Web usage:
className="bg-[#1e3a8a]"  or  className="bg-blue-950"

// Mobile usage:
backgroundColor: COLORS.navy950  or  backgroundColor: '#1e3a8a'
```

---

## 📱 **Mobile-Specific Additions**

### **React Native Requires:**
```typescript
// Safe area handling (notches, rounded corners)
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView>
  {/* Your content */}
</SafeAreaView>

// Platform-specific code
import { Platform } from 'react-native';

const padding = Platform.OS === 'android' ? 16 : 20;

// Dimensions for responsive design
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
```

---

## 🧪 **Testing Differences**

### **Web Tests:**
```bash
npm test
→ Jest + ts-jest
→ Tests TypeScript/JavaScript logic
→ 45 tests for data-transformer.ts
```

### **Mobile Tests (Future):**
```bash
npm test  # Same Jest setup!
→ Tests business logic (same 45 tests)
→ PLUS React Native component tests
→ Using @testing-library/react-native
```

**Key Point:** The 45 business logic tests work on BOTH platforms! ✅

---

## 📦 **File Copy Checklist**

### **When Copying Files to Mobile:**

```
For Each File:
□ Copy file to mobile project
□ Update ALL imports (@/ → ../)
□ Verify file compiles (npx tsc --noEmit)
□ Check Metro bundler (no errors)
□ Test in Expo Go

Files to Copy:
□ types/fuel-station.ts
□ data/fuel-stations.ts
□ data/state-coverage.ts
□ utils/data-transformer.ts
□ config/constants.ts
□ data/fuel_stations_data.json (the actual data!)
```

---

## 🎯 **Migration Decisions**

### **Decision 1: Keep Separate Projects**
```
WHY: Different build tools, different dependencies
ALTERNATIVE: Monorepo with shared packages
CHOSEN: Separate projects (simpler for first mobile app)
```

### **Decision 2: React Native Paper UI Library**
```
WHY: Material Design, comprehensive, good docs
ALTERNATIVES: React Native Elements, NativeBase
CHOSEN: React Native Paper (best for beginners)
```

### **Decision 3: Expo Router**
```
WHY: File-based routing (like Next.js), modern
ALTERNATIVE: React Navigation
CHOSEN: Expo Router (simpler, more intuitive)
```

### **Decision 4: Copy Business Logic (Not Shared Package)**
```
WHY: Simple duplication, easy to understand
ALTERNATIVE: npm workspace, lerna, shared module
CHOSEN: Direct copy (faster to ship, easier to debug)
TRADEOFF: Must update both if logic changes
```

---

## 🔍 **Debugging: Web Works, Mobile Doesn't**

### **Systematic Debug Process:**

**Step 1: Verify Files Copied**
```bash
# Check all files exist
ls fuel-book-mobile/types/fuel-station.ts
ls fuel-book-mobile/data/fuel-stations.ts
ls fuel-book-mobile/utils/data-transformer.ts
ls fuel-book-mobile/data/fuel_stations_data.json
```

**Step 2: Check Imports**
```bash
# Search for @/ imports (should be zero!)
cd fuel-book-mobile
grep -r "@/" types/ data/ utils/ config/
# Expected: no results

# If found, replace with relative paths
```

**Step 3: Verify Data Loading**
```typescript
// Add to mobile app/index.tsx
import { allFuelStations } from '../data/fuel-stations';
console.log('📊 Loaded stations:', allFuelStations.length);
// Expected: ~150
// If 0: data file not loading!
```

**Step 4: Test Business Logic**
```typescript
// Add temporary test in mobile
import { searchStations } from '../utils/data-transformer';
const results = searchStations(allFuelStations, 'CA');
console.log('🔍 CA search results:', results.length);
// Expected: 10-15 (California stations)
// If 0: STATE_NAME_TO_ABBREV issue or import issue
```

---

## 🎨 **Styling Guide**

### **Tailwind to StyleSheet Conversion:**

**Tailwind Spacing:**
```
p-4   → padding: 16       (4 * 4px)
px-6  → paddingHorizontal: 24
py-3  → paddingVertical: 12
mt-4  → marginTop: 16
gap-3 → gap: 12
```

**Tailwind Colors:**
```
bg-blue-900      → backgroundColor: '#1e3a8a'  (or COLORS.navy950)
text-blue-700    → color: '#2563eb'
border-blue-300  → borderColor: '#93c5fd', borderWidth: 1
```

**Tailwind Typography:**
```
text-lg     → fontSize: 18
text-xl     → fontSize: 20
text-2xl    → fontSize: 24
font-bold   → fontWeight: 'bold'
font-semibold → fontWeight: '600'
```

**Tailwind Layout:**
```
flex            → display: 'flex'  (default in RN)
flex-col        → flexDirection: 'column'  (default in RN)
items-center    → alignItems: 'center'
justify-between → justifyContent: 'space-between'
w-full          → width: '100%'
```

**Tailwind Effects:**
```
rounded-xl  → borderRadius: 12
shadow-lg   → shadowColor: '#000', shadowOffset: {width: 0, height: 2}, 
               shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5
hover:      → (Remove - mobile uses touchable feedback)
```

---

## 🔑 **Event Handler Changes**

| Web | Mobile | Notes |
|-----|--------|-------|
| `onClick` | `onPress` | Touch handlers |
| `onChange={(e) => fn(e.target.value)}` | `onChangeText={(text) => fn(text)}` | TextInput |
| `onKeyPress={(e) => {...}}` | `onSubmitEditing={() => {...}}` | Enter key |
| `onMouseEnter` | N/A | Remove hover effects |

---

## 📱 **Mobile-Only Considerations**

### **1. Safe Area Insets**
```typescript
// Phones have notches, rounded corners
import { SafeAreaView } from 'react-native-safe-area-context';

// Wrap top-level content
<SafeAreaView style={{ flex: 1 }}>
  {/* Your app */}
</SafeAreaView>
```

### **2. Keyboard Handling**
```typescript
// Keyboard covers input
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <TextInput />
</KeyboardAvoidingView>
```

### **3. Touchable Feedback**
```typescript
// Visual feedback on press
import { TouchableOpacity } from 'react-native';

<TouchableOpacity onPress={...} activeOpacity={0.7}>
  <Text>Press me</Text>
</TouchableOpacity>
```

### **4. List Performance**
```typescript
// Use FlatList for long lists (not map!)
import { FlatList } from 'react-native';

<FlatList
  data={filteredStations}
  renderItem={({ item }) => <StationCard station={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}  // Performance optimization
/>
```

---

## 🚛 **Trucking-Specific Optimizations**

### **Offline-First:**
```
✅ All data bundled in APK (no internet needed)
✅ No API calls
✅ Works in airplane mode
✅ Fast search (local data)
```

### **Touch-Friendly:**
```
✅ Minimum touch target: 48dp (MOBILE_CONFIG.minTouchTarget)
✅ Large search bar
✅ Clear filter buttons
✅ Easy-to-read fonts (18px+)
```

### **Error Resilient:**
```
✅ ErrorBoundary catches crashes
✅ Graceful degradation
✅ No null pointer crashes
✅ Defensive programming throughout
```

---

## 📋 **Verification Checklist**

### **After Mobile Port:**
```
Functionality:
□ Search by state abbreviation works (CA, TX)
□ Search by full state name works (CALIFORNIA)
□ Search by city works (Houston, Los Angeles)
□ State filter dropdown works
□ Brand filter works
□ Station type filter works
□ Combined filters work
□ Station cards display correctly
□ No crashes on normal use

Performance:
□ Search results appear quickly (< 200ms)
□ Scrolling is smooth (60fps)
□ No lag when typing
□ App loads in < 3 seconds

Offline:
□ Works in airplane mode
□ All 150 stations available
□ No "network error" messages
```

---

## 🎓 **Learning Notes**

### **Key Concepts:**
```
1. React Native is NOT "React for mobile"
   - It's a completely different rendering engine
   - No HTML, no CSS, no DOM
   - Native platform primitives

2. Expo is a framework ON TOP of React Native
   - Simplifies setup
   - Provides extra APIs
   - Handles native dependencies

3. React (the library) is the SAME
   - useState, useEffect, useMemo - identical!
   - Component logic - identical!
   - This is why business logic ports perfectly
```

### **Common Misconceptions:**
```
❌ "React Native = React + Native styling"
✅ "React Native = React logic + Native UI components"

❌ "Can just change className to style"
✅ "Must rebuild components with React Native primitives"

❌ "Web and mobile share UI components"
✅ "Web and mobile share business logic only"
```

---

## ⚡ **Quick Reference**

### **Port Status at a Glance:**
```
✅ DONE (Shared Logic):
- Type definitions
- Data loading
- Search/filter algorithms
- Constants
- Tests

❌ TODO (UI Rebuild):
- SearchBar component
- StationCard component
- FilterSection component
- Main screen layout
- Navigation setup
```

---

**For system architecture, see ARCHITECTURE.md**  
**For debugging errors, see DEBUGGING_GUIDE.md**  
**For code locations, see CODE_REFERENCE.md**


