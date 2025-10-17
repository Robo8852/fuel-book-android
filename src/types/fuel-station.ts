/**
 * Fuel Station Type Definitions
 * Based on extracted PDF data structure
 */

export type StationType = 'Exclusive' | 'Primary' | 'Limited' | 'Covenant Terminal';
export type BrandType = 'TA' | 'PETRO' | 'Covenant';

// Filter types that include 'all' option for UI selects
export type StationTypeFilter = StationType | 'all';
export type BrandTypeFilter = BrandType | 'all';

export interface FuelStation {
  /** Unique identifier (state + number) */
  id: string;
  
  /** Station name (e.g., "#040 TA Corning") */
  stationName: string;
  
  /** Street address */
  address: string;
  
  /** City name */
  city: string;
  
  /** State abbreviation */
  state: string;
  
  /** ZIP code */
  zip: string;
  
  /** Station type (Exclusive, Primary, Limited, or Covenant Terminal) */
  stationType: StationType;
  
  /** Brand (TA, PETRO, or Covenant) */
  brand: BrandType;
  
  /** Phone number */
  phone?: string;
  
  /** Fax number */
  fax?: string;
  
  /** NaviGo ID for routing */
  navigoId: string;
  
  /** Highway exit information */
  exitInfo?: string;
  
  /** Amenities (for Covenant terminals) */
  amenities?: string[];
  
  /** Number of showers (for Covenant terminals) */
  showers?: string;
  
  /** Number of parking spots (for Covenant terminals) */
  parking?: string;
  
  /** Has shop service (for Covenant terminals) */
  shop?: string;
}

export interface FilterState {
  /** Search query string */
  searchQuery: string;
  
  /** Selected state filter */
  selectedState?: string;
  
  /** Selected station type filter */
  selectedStationType?: StationType;
}

export interface BackendFuelStation {
  page: number;
  state: string;
  number: string;
  type: string;
  name: string;
  address: string;
  city_state_zip: string;
  exit_info?: string;
  phone?: string;
  fax?: string;
  navigo_id: string;
  site_type: string;
}

export interface BackendCovenantTerminal {
  page: number;
  type: string;
  name: string;
  phone?: string;
  navigo_id: string;
  amenities?: string[];
  showers?: string;
  parking?: string;
  shop?: string;
  address?: string;
}

export interface BackendData {
  [state: string]: {
    terminals: BackendCovenantTerminal[];
    fuel_stations: BackendFuelStation[];
  };
}




