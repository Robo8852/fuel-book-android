/**
 * Data Transformer Utility
 * Converts backend PDF data structure to frontend format
 */

import type {
  FuelStation,
  BackendFuelStation,
  BackendCovenantTerminal,
  BackendData,
  StationType,
  BrandType,
  StationTypeFilter,
  BrandTypeFilter,
} from '../types/fuel-station';
import { STATE_NAME_TO_ABBREV } from '../data/state-coverage';
import {
  MIN_SEARCH_QUERY_LENGTH,
  MAX_SEARCH_SUGGESTIONS,
  DEFAULT_STATION_TYPE,
  DEFAULT_BRAND,
} from '../config/constants';

/**
 * Parse "City, ST ZIP" into separate components
 * Example: "Corning, CA 96021" -> { city: "Corning", state: "CA", zip: "96021" }
 */
export function parseCityStateZip(cityStateZip: string): {
  city: string;
  state: string;
  zip: string;
} {
  // Handle empty or malformed input
  if (!cityStateZip || !cityStateZip.includes(',')) {
    return { city: '', state: '', zip: '' };
  }

  const parts = cityStateZip.split(',').map((p) => p.trim());
  if (parts.length !== 2) {
    return { city: parts[0] || '', state: '', zip: '' };
  }

  const [city, stateZip] = parts;
  const stateZipParts = stateZip.split(' ').filter((p) => p);

  // Expect format: "CA 96021" or just "CA"
  const state = stateZipParts[0] || '';
  const zip = stateZipParts[1] || '';

  return { city, state, zip };
}

/**
 * Normalize site type to match our enum
 */
function normalizeStationType(siteType: string): StationType {
  const normalized = siteType.toLowerCase();
  if (normalized.includes('exclusive')) return 'Exclusive';
  if (normalized.includes('primary')) return 'Primary';
  if (normalized.includes('limited')) return 'Limited';
  return DEFAULT_STATION_TYPE; // Default fallback from constants
}

/**
 * Normalize brand type
 */
function normalizeBrand(type: string): BrandType {
  const normalized = type.toUpperCase();
  if (normalized === 'TA') return 'TA';
  if (normalized === 'PETRO') return 'PETRO';
  if (normalized === 'COVENANT') return 'Covenant';
  return DEFAULT_BRAND; // Default fallback from constants
}

/**
 * Transform backend fuel station to frontend format
 */
export function transformFuelStation(
  backendStation: BackendFuelStation,
  stateName: string
): FuelStation {
  const { city, state, zip } = parseCityStateZip(backendStation.city_state_zip);

  return {
    id: `${stateName}-${backendStation.number}`,
    stationName: backendStation.name,
    address: backendStation.address,
    city,
    state,
    zip,
    stationType: normalizeStationType(backendStation.site_type),
    brand: normalizeBrand(backendStation.type),
    phone: backendStation.phone,
    fax: backendStation.fax,
    navigoId: backendStation.navigo_id,
    exitInfo: backendStation.exit_info,
  };
}

/**
 * Transform Covenant terminal to frontend format
 */
export function transformCovenantTerminal(
  backendTerminal: BackendCovenantTerminal,
  index: number
): FuelStation {
  // Extract city/state from address if available
  let city = '';
  let state = '';
  let zip = '';

  if (backendTerminal.address) {
    const parsed = parseCityStateZip(backendTerminal.address);
    city = parsed.city;
    state = parsed.state;
    zip = parsed.zip;
  }

  return {
    id: `COVENANT-${index}`,
    stationName: backendTerminal.name,
    address: backendTerminal.address || '',
    city,
    state,
    zip,
    stationType: 'Covenant Terminal',
    brand: 'Covenant',
    phone: backendTerminal.phone,
    navigoId: backendTerminal.navigo_id,
    amenities: backendTerminal.amenities,
    showers: backendTerminal.showers,
    parking: backendTerminal.parking,
    shop: backendTerminal.shop,
  };
}

/**
 * Flatten nested backend data structure to array of stations
 */
export function flattenStations(backendData: BackendData): FuelStation[] {
  const allStations: FuelStation[] = [];

  // Process each state
  Object.entries(backendData).forEach(([stateName, stateData]) => {
    // Skip Covenant terminals key - we'll process it separately
    if (stateName === 'COVENANT_TERMINALS') return;

    // Transform fuel stations
    stateData.fuel_stations.forEach((station) => {
      allStations.push(transformFuelStation(station, stateName));
    });
  });

  // Add Covenant terminals if they exist
  if (backendData.COVENANT_TERMINALS) {
    backendData.COVENANT_TERMINALS.terminals.forEach((terminal, index) => {
      allStations.push(transformCovenantTerminal(terminal, index));
    });
  }

  return allStations;
}

/**
 * Extract unique states from data for filter dropdown
 */
export function extractStates(stations: FuelStation[]): string[] {
  const stateSet = new Set<string>();
  
  stations.forEach((station) => {
    if (station.state) {
      stateSet.add(station.state);
    }
  });

  return Array.from(stateSet).sort();
}

/**
 * Extract unique station types from data for filter dropdown
 */
export function extractStationTypes(stations: FuelStation[]): StationType[] {
  const typeSet = new Set<StationType>();
  
  stations.forEach((station) => {
    typeSet.add(station.stationType);
  });

  return Array.from(typeSet).sort();
}

/**
 * Extract unique brands from data for filter dropdown
 */
export function extractBrands(stations: FuelStation[]): BrandType[] {
  const brandSet = new Set<BrandType>();
  
  stations.forEach((station) => {
    brandSet.add(station.brand);
  });

  return Array.from(brandSet).sort();
}

/**
 * State name mapping for smart search
 * IMPORTANT: Only full state names, NO partial aliases to avoid false positives
 */
const STATE_ALIASES: Record<string, string> = {
  // Full state names to abbreviations
  'alabama': 'AL',
  'alaska': 'AK', 
  'arizona': 'AZ',
  'arkansas': 'AR',
  'california': 'CA',
  'colorado': 'CO',
  'connecticut': 'CT',
  'delaware': 'DE',
  'florida': 'FL',
  'georgia': 'GA',
  'hawaii': 'HI',
  'idaho': 'ID',
  'illinois': 'IL',
  'indiana': 'IN',
  'iowa': 'IA',
  'kansas': 'KS',
  'kentucky': 'KY',
  'louisiana': 'LA',
  'maine': 'ME',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'minnesota': 'MN',
  'mississippi': 'MS',
  'missouri': 'MO',
  'montana': 'MT',
  'nebraska': 'NE',
  'nevada': 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  'ohio': 'OH',
  'oklahoma': 'OK',
  'oregon': 'OR',
  'pennsylvania': 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  'tennessee': 'TN',
  'texas': 'TX',
  'utah': 'UT',
  'vermont': 'VT',
  'virginia': 'VA',
  'washington': 'WA',
  'west virginia': 'WV',
  'wisconsin': 'WI',
  'wyoming': 'WY',
  'canada': 'CANADA',
  'ontario': 'CANADA'
};

const REVERSE_STATE_ALIASES: Record<string, string> = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona', 
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'CANADA': 'Canada'
};

/**
 * Normalize search query for smart matching
 */
function normalizeSearchQuery(query: string): string {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check if query matches a state alias
  if (STATE_ALIASES[lowerQuery]) {
    return STATE_ALIASES[lowerQuery].toLowerCase();
  }
  
  return lowerQuery;
}

/**
 * Enhanced search stations with smart state mapping and PREFIX matching
 */
export function searchStations(
  stations: FuelStation[],
  query: string
): FuelStation[] {
  if (!query.trim()) return stations;

  const normalizedQuery = normalizeSearchQuery(query);
  const originalQuery = query.toLowerCase().trim();

  return stations.filter((station) => {
    const stationName = station.stationName.toLowerCase();
    const city = station.city.toLowerCase();
    const state = station.state.toLowerCase();
    const navigoId = station.navigoId.toLowerCase();
    
    // Exact state abbreviation match (e.g., "CA" matches CA)
    const exactStateMatch = state === normalizedQuery;
    
    // Full state name exact match (e.g., "california" → matches CA via alias)
    const fullStateNameMatch = STATE_ALIASES[originalQuery] && 
      state === STATE_ALIASES[originalQuery].toLowerCase();
    
    // Prefix match on full state name (e.g., "calif" matches "California")
    const statePrefixMatch = REVERSE_STATE_ALIASES[station.state] && 
      REVERSE_STATE_ALIASES[station.state].toLowerCase().startsWith(originalQuery);
    
    // If any state match is found, return immediately (don't search other fields)
    const isStateMatch = exactStateMatch || fullStateNameMatch || statePrefixMatch;
    if (isStateMatch) {
      return true;
    }
    
    // If query was normalized to a state abbreviation, ONLY match states (no other fields)
    const wasNormalizedToState = STATE_ALIASES[originalQuery] !== undefined;
    if (wasNormalizedToState) {
      return false; // Already checked state matches above, don't search other fields
    }
    
    // Only search other fields if query meets minimum length (avoid "ca" matching "Cartersville")
    if (originalQuery.length >= MIN_SEARCH_QUERY_LENGTH) {
      const nameMatch = new RegExp(`\\b${normalizedQuery}`, 'i').test(stationName);
      const cityMatch = new RegExp(`\\b${normalizedQuery}`, 'i').test(city);
      const navigoMatch = navigoId.includes(normalizedQuery);
      
      return nameMatch || cityMatch || navigoMatch;
    }
    
    return false;
  });
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  const suggestions: string[] = [];
  
  // Check for state name matches
  Object.entries(STATE_ALIASES).forEach(([fullName, abbrev]) => {
    if (fullName.includes(lowerQuery)) {
      suggestions.push(`${fullName} (${abbrev})`);
    }
  });
  
  // Check for abbreviation matches
  Object.entries(REVERSE_STATE_ALIASES).forEach(([abbrev, fullName]) => {
    if (abbrev.toLowerCase().includes(lowerQuery) || fullName.toLowerCase().includes(lowerQuery)) {
      suggestions.push(`${fullName} (${abbrev})`);
    }
  });
  
  // Remove duplicates and limit results
  return [...new Set(suggestions)].slice(0, MAX_SEARCH_SUGGESTIONS);
}

/**
 * Filter stations by state and/or station type
 */
export function filterStations(
  stations: FuelStation[],
  selectedState?: string,
  selectedStationType?: StationTypeFilter
): FuelStation[] {
  let filtered = [...stations];

  if (selectedState && selectedState !== 'all') {
    // Handle both full state names (CALIFORNIA) and abbreviations (CA)
    filtered = filtered.filter((station) => {
      const stateAbbrev = station.state.toUpperCase();
      const selectedUpper = selectedState.toUpperCase();
      
      // Direct match (CA === CA)
      if (stateAbbrev === selectedUpper) return true;
      
      // Check if selectedState is a full name that maps to this abbreviation
      // e.g., "CALIFORNIA" → "CA" === "CA"
      if (STATE_NAME_TO_ABBREV[selectedUpper] === stateAbbrev) return true;
      
      return false;
    });
  }

  if (selectedStationType && selectedStationType !== 'all') {
    filtered = filtered.filter(
      (station) => station.stationType === selectedStationType
    );
  }

  return filtered;
}

/**
 * Filter stations by brand (TA, PETRO, Covenant)
 */
export function filterByBrand(
  stations: FuelStation[],
  selectedBrand?: BrandTypeFilter
): FuelStation[] {
  if (!selectedBrand || selectedBrand === 'all') {
    return stations;
  }

  return stations.filter((station) => station.brand === selectedBrand);
}

/**
 * Combined search and filter
 */
export function getFilteredStations(
  allStations: FuelStation[],
  searchQuery: string,
  selectedState?: string,
  selectedStationType?: StationTypeFilter,
  selectedBrand?: BrandTypeFilter
): FuelStation[] {
  let result = searchStations(allStations, searchQuery);
  result = filterStations(result, selectedState, selectedStationType);
  result = filterByBrand(result, selectedBrand);
  return result;
}


