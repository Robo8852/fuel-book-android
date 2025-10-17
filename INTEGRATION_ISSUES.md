# Frontend-Backend Integration Issues

## ❌ Critical Mismatches

### 1. **Data Field Mismatch**

**Backend provides:**
```json
{
  "name": "#163 TA Santa Nella",
  "address": "12310 California Hwy 33",
  "city_state_zip": "Santa Nella, CA 95322",
  "state": "CALIFORNIA",
  "type": "TA",
  "site_type": "Primary",
  "navigo_id": "CVEN-TA163",
  "phone": "(209) 826-0741",
  "exit_info": "I-5, Exit 407"
}
```

**Frontend expects:**
```typescript
{
  stationName: string,  // ← Backend has "name"
  address: string,      // ✓ Match
  city: string,         // ← Backend has "city_state_zip" (combined)
  state: string,        // ✓ Match
  terminal: string,     // ← Backend has "type" (TA/PETRO)
  phone: string         // ✓ Match
}
```

### 2. **Filter Data Mismatch**

**Frontend FilterSection expects:**
- `states: string[]` - Array of state names
- `terminals: string[]` - Array of terminal names

**Backend provides:**
- States as top-level keys (need to extract)
- No "terminals" array (has "site_type": Exclusive/Primary/Limited instead)

### 3. **Data Structure Mismatch**

**Backend:** Grouped by state
```json
{
  "CALIFORNIA": {
    "terminals": [],
    "fuel_stations": [...]
  }
}
```

**Frontend:** Expects flat array
```typescript
const stations: any[] = []; // Needs flattened list
```

### 4. **Missing Data Transformation**

**city_state_zip parsing:**
- Backend: `"Santa Nella, CA 95322"`
- Frontend needs: `city: "Santa Nella"` and `state: "CA"`

**Terminal vs Site Type:**
- Backend has `type: "TA"` (brand) and `site_type: "Primary"` (network level)
- Frontend calls it `terminal` (unclear which to use)

### 5. **Covenant Terminals Handling**

- Backend has special `COVENANT_TERMINALS` key with different structure
- Frontend doesn't know how to handle these differently

## ✅ Solutions Needed

1. **Create data adapter/transformer:**
   ```typescript
   // Transform backend data to frontend format
   function transformStationData(backendData) {
     // Flatten state structure
     // Parse city_state_zip
     // Map field names
     // Handle Covenant terminals
   }
   ```

2. **Update TypeScript interfaces:**
   ```typescript
   interface FuelStation {
     stationName: string;
     address: string;
     city: string;
     state: string;
     stationType: 'Exclusive' | 'Primary' | 'Limited' | 'Covenant Terminal';
     brand: 'TA' | 'PETRO' | 'Covenant';
     phone?: string;
     fax?: string;
     navigoId: string;
     exitInfo?: string;
   }
   ```

3. **Fix filter component:**
   - Change "Terminal" filter to "Station Type" 
   - Use site_type values: Exclusive, Primary, Limited

4. **Add data loading:**
   - Import JSON file in React
   - Transform on load
   - Or create API endpoint

## 📋 Implementation Checklist

- [ ] Create data transformation utility
- [ ] Parse city_state_zip into separate fields
- [ ] Map backend fields to frontend props
- [ ] Extract states list from JSON keys
- [ ] Change "terminal" to "station type" in UI
- [ ] Handle Covenant terminals separately
- [ ] Update TypeScript types to match real data
- [ ] Import and transform fuel_stations_data.json
- [ ] Test search functionality
- [ ] Test filter functionality




