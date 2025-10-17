/**
 * State Coverage Data
 * Complete list of all US states with coverage information and nearby suggestions
 */

export interface StateCoverage {
  stateName: string;
  hasStations: boolean;
  stationCount: number;
  nearbyStates: string[];
}

// Mapping of full state names to abbreviations
export const STATE_NAME_TO_ABBREV: Record<string, string> = {
  'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
  'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE',
  'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI', 'IDAHO': 'ID',
  'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS',
  'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
  'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
  'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
  'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
  'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT',
  'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
  'WISCONSIN': 'WI', 'WYOMING': 'WY'
};

// List of all US states
export const ALL_US_STATES = Object.keys(STATE_NAME_TO_ABBREV);

// States without fuel stations and their nearby alternatives
// Updated to match HTML viewer exactly
const EMPTY_STATES_NEARBY: Record<string, string[]> = {
  'ALASKA': ['WASHINGTON'],
  'DELAWARE': ['PENNSYLVANIA', 'MARYLAND', 'NEW JERSEY'],
  'HAWAII': ['CALIFORNIA'],
  'MAINE': ['NEW HAMPSHIRE'],
  'MASSACHUSETTS': ['CONNECTICUT', 'NEW HAMPSHIRE'],
  'NORTH DAKOTA': ['MINNESOTA', 'MONTANA'],
  'RHODE ISLAND': ['CONNECTICUT'],
  'SOUTH DAKOTA': ['MINNESOTA', 'IOWA'],
  'VERMONT': ['NEW HAMPSHIRE', 'NEW YORK']
};

// States that have fuel stations (from our data analysis)
const STATES_WITH_STATIONS = [
  'ALABAMA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO',
  'CONNECTICUT', 'FLORIDA', 'GEORGIA', 'IDAHO', 'ILLINOIS',
  'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 'LOUISIANA',
  'MARYLAND', 'MICHIGAN', 'MINNESOTA', 'MISSISSIPPI', 'MISSOURI',
  'MONTANA', 'NEBRASKA', 'NEVADA', 'NEW HAMPSHIRE', 'NEW JERSEY',
  'NEW MEXICO', 'NEW YORK', 'NORTH CAROLINA', 'OHIO', 'OKLAHOMA',
  'OREGON', 'PENNSYLVANIA', 'SOUTH CAROLINA', 'TENNESSEE', 'TEXAS',
  'UTAH', 'VIRGINIA', 'WASHINGTON', 'WEST VIRGINIA', 'WISCONSIN', 'WYOMING'
];

/**
 * Get state coverage information
 */
export function getStateCoverage(): StateCoverage[] {
  return ALL_US_STATES.map(stateName => {
    const hasStations = STATES_WITH_STATIONS.includes(stateName);
    const nearbyStates = EMPTY_STATES_NEARBY[stateName] || [];
    
    return {
      stateName,
      hasStations,
      stationCount: 0, // Will be updated with actual counts from data
      nearbyStates
    };
  });
}

/**
 * Get states without stations
 */
export function getEmptyStates(): string[] {
  return Object.keys(EMPTY_STATES_NEARBY);
}

/**
 * Get nearby states for a given state
 */
export function getNearbyStates(stateName: string): string[] {
  return EMPTY_STATES_NEARBY[stateName] || [];
}

// State abbreviations mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'AL': 'ALABAMA', 'AK': 'ALASKA', 'AZ': 'ARIZONA', 'AR': 'ARKANSAS', 'CA': 'CALIFORNIA',
  'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DE': 'DELAWARE', 'FL': 'FLORIDA', 'GA': 'GEORGIA',
  'HI': 'HAWAII', 'ID': 'IDAHO', 'IL': 'ILLINOIS', 'IN': 'INDIANA', 'IA': 'IOWA',
  'KS': 'KANSAS', 'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'ME': 'MAINE', 'MD': 'MARYLAND',
  'MA': 'MASSACHUSETTS', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MS': 'MISSISSIPPI', 'MO': 'MISSOURI',
  'MT': 'MONTANA', 'NE': 'NEBRASKA', 'NV': 'NEVADA', 'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY',
  'NM': 'NEW MEXICO', 'NY': 'NEW YORK', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'OH': 'OHIO',
  'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA',
  'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VT': 'VERMONT',
  'VA': 'VIRGINIA', 'WA': 'WASHINGTON', 'WV': 'WEST VIRGINIA', 'WI': 'WISCONSIN', 'WY': 'WYOMING'
};

/**
 * Convert state abbreviation or name to full state name
 */
export function normalizeStateName(input: string): string {
  const upperInput = input.toUpperCase().trim();
  
  // If it's already a full state name, return as-is
  if (ALL_US_STATES.includes(upperInput)) {
    return upperInput;
  }
  
  // If it's an abbreviation, convert to full name
  if (STATE_ABBREVIATIONS[upperInput]) {
    return STATE_ABBREVIATIONS[upperInput];
  }
  
  // Return original if no match
  return upperInput;
}

/**
 * Check if a state has fuel stations
 */
export function stateHasStations(stateName: string): boolean {
  const normalizedState = normalizeStateName(stateName);
  return STATES_WITH_STATIONS.includes(normalizedState);
}

/**
 * Get coverage statistics
 */
export function getCoverageStats() {
  const totalStates = ALL_US_STATES.length;
  const statesWithStations = STATES_WITH_STATIONS.length;
  const statesWithoutStations = totalStates - statesWithStations;
  
  return {
    totalStates,
    statesWithStations,
    statesWithoutStations,
    coveragePercentage: Math.round((statesWithStations / totalStates) * 100)
  };
}

