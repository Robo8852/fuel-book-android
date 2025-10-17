# Covenant Fuel Locator - Debugging Guide

**For APK and Mobile Troubleshooting**  
**Last Updated:** October 17, 2025

---

## 🚨 **Common APK Issues & Solutions**

### **Issue 1: Search Returns No Results**

**Symptoms:**
- Type "CA" or "CALIFORNIA" → 0 stations found
- Works on web, broken on mobile

**Diagnosis Steps:**
```typescript
// 1. Check if data loaded
console.log('Stations loaded:', allFuelStations.length);
// Expected: ~150

// 2. Check state values in data
console.log('Sample state:', allFuelStations[0]?.state);
// Expected: "CA" (abbreviation, not "CALIFORNIA")

// 3. Check STATE_NAME_TO_ABBREV imported
console.log('Mapping:', STATE_NAME_TO_ABBREV['CALIFORNIA']);
// Expected: "CA"
```

**Common Causes:**
1. ❌ `STATE_NAME_TO_ABBREV` not imported in data-transformer.ts
2. ❌ `fuel_stations_data.json` not copied to mobile
3. ❌ Import path incorrect (`@/` vs `../`)

**Solutions:**
```typescript
// Fix 1: Add import
import { STATE_NAME_TO_ABBREV } from '../data/state-coverage';

// Fix 2: Verify data file in mobile project
fuel-book-mobile/data/fuel_stations_data.json

// Fix 3: Update import in fuel-stations.ts
import fuelStationsBackendData from './fuel_stations_data.json';
// NOT: from '../../fuel_stations_data.json'
```

---

### **Issue 2: App Crashes on Startup**

**Symptoms:**
- APK installs but crashes immediately
- ErrorBoundary doesn't show

**Diagnosis:**
```bash
# Check Metro bundler logs
adb logcat | grep -i "error"

# Or in Expo Go
Shake phone → "Show Dev Menu" → "Debug Remote JS"
```

**Common Causes:**
1. ❌ Missing dependencies in package.json
2. ❌ Import error (wrong path)
3. ❌ Data file not found
4. ❌ Type error in TypeScript

**Solutions:**
```bash
# 1. Reinstall dependencies
cd fuel-book-mobile
rm -rf node_modules
npm install

# 2. Check all imports use relative paths
grep -r "@/" components/  # Should return nothing!

# 3. Verify data file exists
ls -la data/fuel_stations_data.json

# 4. Check TypeScript compilation
npx tsc --noEmit
```

---

### **Issue 3: State Filter Dropdown Empty**

**Symptoms:**
- State filter shows but has no options
- Or shows "CALIFORNIA" but selecting does nothing

**Diagnosis:**
```typescript
// Check if states loaded
console.log('Available states:', availableStates);
// Expected: ['ALABAMA', 'ALASKA', 'ARIZONA', ...]

// Check filter value
console.log('Selected state:', selectedState);
// Expected: "CALIFORNIA" or "CA"
```

**Common Causes:**
1. ❌ `availableStates` not exported from fuel-stations.ts
2. ❌ State filter prop not connected
3. ❌ Filter value doesn't match data

**Solutions:**
```typescript
// Fix 1: Verify export
export const availableStates = ALL_US_STATES;

// Fix 2: Check prop connection
<FilterSection
  states={availableStates}  // ← Must pass this!
  onStateChange={setSelectedState}
/>

// Fix 3: Ensure STATE_NAME_TO_ABBREV handles the value
// See filterStations() in data-transformer.ts
```

---

### **Issue 4: App Works in Expo Go, Breaks in APK**

**Symptoms:**
- Works perfectly when running `npx expo start`
- APK crashes or shows errors

**Diagnosis:**
```
Key difference: Expo Go has dev runtime, APK is production build
```

**Common Causes:**
1. ❌ Dev-only code not removed (ErrorTest.tsx)
2. ❌ Environment variables missing
3. ❌ Assets not bundled correctly
4. ❌ Native dependencies need linking

**Solutions:**
```bash
# 1. Remove dev-only components
# Delete ErrorTest.tsx before building APK

# 2. Check app.json
{
  "expo": {
    "assetBundlePatterns": ["**/*"],  // Includes all assets
  }
}

# 3. Rebuild with production profile
eas build --profile production --platform android
```

---

### **Issue 5: Data Shows Different on Mobile vs Web**

**Symptoms:**
- Web shows 150 stations
- Mobile shows 50 stations (or different count)

**Diagnosis:**
```typescript
// Check transformation
console.log('Backend data keys:', Object.keys(backendData));
// Expected: ['ALABAMA', 'ALASKA', ..., 'COVENANT_TERMINALS']

console.log('Flattened stations:', allFuelStations.length);
// Expected: ~150

// Check if COVENANT_TERMINALS processed
const covenantCount = allFuelStations.filter(
  s => s.stationType === 'Covenant Terminal'
).length;
console.log('Covenant terminals:', covenantCount);
// Expected: > 0
```

**Common Causes:**
1. ❌ Different fuel_stations_data.json file
2. ❌ flattenStations() skipping COVENANT_TERMINALS
3. ❌ Transformation function differs between web/mobile

**Solutions:**
```bash
# 1. Verify same JSON file
diff src/data/fuel_stations_data.json fuel-book-mobile/data/fuel_stations_data.json

# 2. Check flattenStations includes COVENANT_TERMINALS
# See line 146-151 in data-transformer.ts

# 3. Ensure exact same data-transformer.ts copied
diff src/utils/data-transformer.ts fuel-book-mobile/utils/data-transformer.ts
```

---

## 🔧 **Metro Bundler Errors**

### **Error: "Unable to resolve module"**
```
Error: Unable to resolve module @/types/fuel-station
```

**Cause:** `@/` path alias doesn't work on mobile  
**Solution:** Use relative paths
```typescript
// ❌ Web style
import { FuelStation } from '@/types/fuel-station';

// ✅ Mobile style  
import { FuelStation } from '../types/fuel-station';
```

---

### **Error: "Cannot find module"**
```
Error: Cannot find module './fuel_stations_data.json'
```

**Cause:** Data file not in correct location  
**Solution:** Check file path and Metro config
```bash
# Verify file exists
ls fuel-book-mobile/data/fuel_stations_data.json

# Check import path
import data from './fuel_stations_data.json';  # Correct if in same folder
import data from '../fuel_stations_data.json'; # If in parent folder
```

---

### **Error: "Unexpected token"**
```
Error: Unexpected token '<' in JSON at position 0
```

**Cause:** Trying to import HTML instead of JSON  
**Solution:** Check file extension and content
```bash
# Verify JSON is valid
cat data/fuel_stations_data.json | head -5
# Should see: {"CALIFORNIA": {...

# Not HTML:
# Should NOT see: <!DOCTYPE html>
```

---

## 🐛 **React Native Specific Errors**

### **Error: "Text strings must be rendered within <Text>"**
```
Error: Text strings must be rendered within a <Text> component
```

**Cause:** Using string directly in View (common mistake!)  
**Solution:**
```typescript
// ❌ Wrong
<View>
  Station Name
</View>

// ✅ Correct
<View>
  <Text>Station Name</Text>
</View>
```

---

### **Error: "Cannot read property 'state' of undefined"**
```
TypeError: Cannot read property 'state' of undefined
```

**Cause:** Station object is undefined  
**Diagnosis:**
```typescript
// Add null check
console.log('Filtered stations:', filteredStations);
// Check if array is empty or has undefined elements

// Check search logic
console.log('Search query:', searchQuery);
console.log('All stations count:', allFuelStations.length);
```

**Solution:**
```typescript
// Add safety check
{filteredStations.length > 0 && filteredStations.map(station => (
  station ? <StationCard key={station.id} station={station} /> : null
))}
```

---

## 🧪 **Testing Checklist**

### **Before Building APK:**
```
Web Tests:
□ npm test (all 45 tests pass)
□ Web app works in browser
□ State filter works
□ Search works  
□ All filters work together

Expo Go Tests:
□ npx expo start works
□ App loads on phone via Expo Go
□ Search works on phone
□ Filters work on phone
□ No console errors in Metro

Then Build APK:
□ eas build --profile preview --platform android
```

---

## 🔍 **Debug Tools**

### **Metro Bundler Console:**
```bash
# Start with logging
npx expo start

# Watch for errors in terminal
# Shows: Import errors, syntax errors, module issues
```

### **Chrome DevTools (Expo Go):**
```
1. Shake phone
2. "Debug Remote JS"
3. Opens Chrome
4. Console shows all logs/errors
```

### **React Native Debugger:**
```bash
# Alternative to Chrome DevTools
npm install -g react-native-debugger

# More features:
- Redux DevTools
- Network inspector
- Element inspector
```

---

## 📱 **APK Specific Issues**

### **APK Installs But Won't Open:**
```
Symptom: APK installed, tap icon → nothing happens or immediate crash

Check:
1. Android version compatibility (minSdkVersion in app.json)
2. Permissions (if using location, camera, etc.)
3. Native dependencies properly linked

Debug:
adb logcat | grep -i "covenant\|fuel\|error"
```

### **APK Shows "App Not Installed":**
```
Cause: Signature mismatch (updating with different keystore)

Solution:
1. Uninstall old APK completely
2. Install new APK
3. Or use same keystore for updates
```

---

## 🎯 **Troubleshooting Workflow**

### **Step-by-Step Debug Process:**

```
1. Identify symptoms
   What exactly doesn't work?
   
2. Check if it works on web
   If web works: mobile port issue
   If web broken: core logic issue
   
3. Run tests
   npm test
   If tests fail: fix core logic first
   If tests pass: mobile-specific issue
   
4. Check Metro logs
   Look for import errors, missing modules
   
5. Add console.logs
   Track data flow through the app
   
6. Check documentation
   Known issues in this guide?
   Architecture in ARCHITECTURE.md?
   
7. Isolate the problem
   Comment out code until it works
   Find the breaking component
   
8. Fix and verify
   Make fix
   Run tests
   Test in Expo Go
   Build new APK
   Verify fix
```

---

## 🚛 **Trucking-Specific Issues**

### **Issue: Stations Don't Show While Driving**
```
Possible Causes:
1. No internet (app should work offline!)
2. Data not bundled in APK
3. GPS/location blocking data (shouldn't affect this app)

Solution:
- Verify data is LOCAL (fuel_stations_data.json bundled)
- No API calls should be needed
- App should work in airplane mode
```

### **Issue: App Slow on Older Phones**
```
Diagnosis:
- Test on low-end device
- Check if FlatList used (not map)
- Check if useMemo working

Optimize:
- Use FlatList with initialNumToRender={10}
- Reduce station card complexity
- Consider search indexing
```

---

## 📞 **Getting Help**

### **Information to Provide:**

When reporting bugs, include:
```
1. Device info:
   - Phone model
   - Android version
   - RAM/storage available

2. Error details:
   - Exact steps to reproduce
   - Screenshots
   - Metro/logcat output
   - What you expected vs what happened

3. Context:
   - Does it work in Expo Go?
   - Does web version work?
   - Did tests pass?
   - Recent changes made?
```

### **Useful Commands:**
```bash
# Check APK logs
adb logcat | grep -A 10 -i "error"

# Check Metro bundler
npx expo start --clear

# Rebuild from scratch
rm -rf node_modules
npm install
eas build --platform android --clear-cache

# Run tests
npm test --verbose
```

---

## ✅ **Quick Reference**

### **"Search Broken" → Check:**
```
□ STATE_NAME_TO_ABBREV imported
□ fuel_stations_data.json exists
□ MIN_SEARCH_QUERY_LENGTH = 3
□ Tests pass (npm test)
```

### **"Filter Broken" → Check:**
```
□ Filter types (StationTypeFilter, BrandTypeFilter)
□ 'all' value handled
□ State mapping in filterStations()
□ Props connected correctly
```

### **"App Crashes" → Check:**
```
□ ErrorBoundary wrapping app
□ All imports correct (no @/ in mobile)
□ Data file path correct
□ TypeScript compiles (npx tsc --noEmit)
```

### **"Different Data" → Check:**
```
□ Same JSON file copied
□ flattenStations() includes COVENANT_TERMINALS
□ Transformation function identical
□ Console.log allFuelStations.length
```

---

## 🎓 **Understanding Error Messages**

### **TypeError: Cannot read property 'X' of undefined**
```
Meaning: Trying to access property on null/undefined object
Where: Usually in component rendering
Fix: Add null check or optional chaining

Example:
station.city          // ❌ Crashes if station undefined
station?.city         // ✅ Returns undefined safely
{station && station.city}  // ✅ Conditional render
```

### **ReferenceError: X is not defined**
```
Meaning: Variable/function not imported or declared
Where: Usually import issue
Fix: Add import statement

Example:
getFilteredStations(...)  // ❌ Not imported
import { getFilteredStations } from '../utils/data-transformer';  // ✅
```

### **Module not found: Can't resolve '@/...'**
```
Meaning: Path alias doesn't work on mobile
Where: Any import statement
Fix: Use relative paths

Example:
import X from '@/types/fuel-station';     // ❌ Web only
import X from '../types/fuel-station';    // ✅ Mobile
```

---

## 🔬 **Advanced Debugging**

### **Enable Detailed Logging:**
```typescript
// Add to data-transformer.ts for debugging
export function getFilteredStations(...) {
  console.log('🔍 Search query:', searchQuery);
  console.log('📊 Total stations:', allStations.length);
  
  let result = searchStations(allStations, searchQuery);
  console.log('🔎 After search:', result.length);
  
  result = filterStations(result, selectedState, selectedStationType);
  console.log('🎯 After state filter:', result.length);
  
  result = filterByBrand(result, selectedBrand);
  console.log('✅ Final results:', result.length);
  
  return result;
}
```

### **Verify Data Integrity:**
```typescript
// Add to fuel-stations.ts
console.log('📊 Data Loading Report:');
console.log('Total stations:', allFuelStations.length);
console.log('States with stations:', statesWithStations.length);
console.log('Sample station:', allFuelStations[0]);
console.log('Covenant terminals:', 
  allFuelStations.filter(s => s.stationType === 'Covenant Terminal').length
);
```

---

## 🎯 **Systematic Debug Process**

### **When APK Has Issues:**

**Phase 1: Isolate (5 minutes)**
```
1. Does it work in Expo Go?
   YES → APK build issue
   NO → Code issue

2. Does web version work?
   YES → Mobile port issue
   NO → Core logic issue

3. Do tests pass?
   YES → UI or data loading issue
   NO → Fix tests first!
```

**Phase 2: Narrow Down (10 minutes)**
```
4. Check Metro logs for errors
5. Add console.logs to track data flow
6. Comment out components until it works
7. Find the breaking component
```

**Phase 3: Fix (15 minutes)**
```
8. Review documentation for similar issues
9. Check test file for expected behavior
10. Make minimal fix
11. Test in Expo Go
12. Rebuild APK if confirmed
```

---

## 📋 **Pre-Flight Checklist**

### **Before Every APK Build:**
```
Code Quality:
□ npm test (all tests pass)
□ npx tsc --noEmit (no type errors)
□ No console errors in browser/Metro

Files Verified:
□ fuel_stations_data.json copied to mobile
□ All imports use relative paths (no @/)
□ Constants file imported where needed
□ ErrorBoundary wrapping app

Configuration:
□ app.json version incremented
□ package.json dependencies installed
□ No dev-only code (ErrorTest removed)

Testing:
□ Works in Expo Go on phone
□ Search tested
□ Filters tested
□ Offline mode tested (airplane mode)
```

---

## 🚀 **Performance Debugging**

### **Issue: App Laggy/Slow**

**Diagnosis:**
```typescript
// Add performance logging
const start = performance.now();
const results = getFilteredStations(...);
const end = performance.now();
console.log(`Search took ${end - start}ms`);
// Should be < 100ms
```

**Solutions:**
```typescript
// 1. Use FlatList (not map) for large lists
<FlatList
  data={filteredStations}
  renderItem={({ item }) => <StationCard station={item} />}
  initialNumToRender={10}  // Render 10 initially
  maxToRenderPerBatch={5}   // Add 5 at a time
/>

// 2. Verify useMemo working
const filteredStations = useMemo(() => {
  console.log('🔄 Recalculating filtered stations');
  return getFilteredStations(...);
}, [searchQuery, selectedState, ...]); // Check dependencies!

// 3. Consider search indexing
// See PERFORMANCE_CONFIG.useSearchIndex in constants.ts
```

---

## 🛑 **Critical Errors**

### **Error: All Stations Missing**
```
If allFuelStations.length === 0:

STOP! Don't debug further. Check:
1. Is fuel_stations_data.json in mobile project?
2. Is import path correct?
3. Is flattenStations() called?
4. Is JSON file valid?

This is CRITICAL - app is useless without data!
```

### **Error: State Mapping Fails**
```
If STATE_NAME_TO_ABBREV['CALIFORNIA'] === undefined:

STOP! Check:
1. Is state-coverage.ts copied to mobile?
2. Is STATE_NAME_TO_ABBREV exported?
3. Is import working?

This breaks filters completely!
```

---

## 💡 **Pro Tips**

### **1. Always Test in Expo Go First**
```
✅ Free, instant feedback
✅ Hot reload works
✅ Easy to debug
✅ Only build APK when Expo Go works perfectly
```

### **2. Use Console Logs Liberally**
```typescript
// Leave debugging logs in for first few APK builds
console.log('🔍 Search:', query);
console.log('📊 Results:', filteredStations.length);

// Remove once stable
```

### **3. Version Your APKs**
```bash
# Name files clearly
covenant-fuel-v1.0.0.apk
covenant-fuel-v1.0.1-fixed-search.apk

# Track what changed in each version
```

### **4. Keep Test Logs**
```bash
# Save test results for reference
npm test > test-results-$(date +%Y%m%d).txt

# Compare if tests start failing
diff test-results-20251017.txt test-results-20251018.txt
```

---

## 📞 **Emergency Debugging**

### **App Crashes While Driving (Critical!):**

**Immediate Actions:**
```
1. Don't panic!
2. Close and reopen app (ErrorBoundary might recover)
3. If still broken, uninstall and reinstall APK
4. Use backup: Web version on phone browser
```

**Report to Debug:**
```
1. What were you doing when it crashed?
   (Searching? Filtering? Opening app?)
2. What did you search/select?
3. Can you reproduce it?
4. Screenshot if possible
```

**Temporary Workaround:**
```
Use web version in phone browser:
http://your-deployed-web-url.com

or

Keep old working APK as backup
```

---

## 🎯 **Success Criteria**

### **APK is Ready When:**
```
✅ All 45 tests pass
✅ Works in Expo Go without errors
✅ Search finds stations correctly
✅ Filters work (state, brand, type)
✅ No crashes during normal use
✅ Works offline (airplane mode test)
✅ Loads in < 3 seconds
✅ Search results in < 200ms
```

---

**For architecture details, see ARCHITECTURE.md**  
**For mobile port info, see MOBILE_PORT_REFERENCE.md**  
**For code locations, see CODE_REFERENCE.md**


