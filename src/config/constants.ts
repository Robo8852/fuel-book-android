/**
 * Application Constants
 * Centralized configuration for easy tuning (especially for mobile)
 */

// ============================================
// SEARCH CONFIGURATION
// ============================================

/**
 * Minimum query length before searching non-state fields
 * Prevents false positives like "CA" matching "Cartersville"
 * 
 * Mobile note: Could be reduced to 2 for touch keyboards
 */
export const MIN_SEARCH_QUERY_LENGTH = 3;

/**
 * Maximum number of search suggestions to show
 */
export const MAX_SEARCH_SUGGESTIONS = 5;

/**
 * Default fallback for unknown station types
 */
export const DEFAULT_STATION_TYPE = 'Primary' as const;

/**
 * Default fallback for unknown brands
 */
export const DEFAULT_BRAND = 'TA' as const;

// ============================================
// UI/THEME CONFIGURATION
// ============================================

/**
 * Navy blue color palette
 * Primary brand colors for Covenant Fuel Locator
 */
export const COLORS = {
  // Navy blue shades
  navy950: '#1e3a8a',      // Primary dark navy
  navy900: '#1e40af',      // Secondary navy
  navy800: '#1d4ed8',      // Medium navy
  navy700: '#2563eb',      // Lighter navy
  navy600: '#3b82f6',      // Blue
  
  // Supporting colors
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  
  // Brand-specific colors
  brandTA: '#2563eb',      // Blue for TA
  brandPETRO: '#16a34a',   // Green for PETRO
  brandCovenant: '#9333ea', // Purple for Covenant
  
  // Status colors
  exclusive: '#eab308',    // Yellow/gold for Exclusive
  primary: '#2563eb',      // Blue for Primary
  limited: '#6b7280',      // Gray for Limited
  covenant: '#16a34a',     // Green for Covenant Terminal
  
  // Alert colors
  warning: '#f59e0b',      // Orange for warnings
  error: '#ef4444',        // Red for errors
  success: '#22c55e',      // Green for success
} as const;

/**
 * App title and branding
 */
export const APP_CONFIG = {
  title: 'Covenant Fuel Station Locator',
  subtitle: 'Find fuel stations by state and type',
  appName: 'Covenant Fuel',
} as const;

/**
 * Filter UI configuration
 */
export const FILTER_CONFIG = {
  allStatesLabel: 'All States',
  allBrandsLabel: 'All Brands',
  allTypesLabel: 'All Types',
  allFilterValue: 'all',
} as const;

/**
 * Station card badge icons
 */
export const STATION_BADGES = {
  exclusive: '★',
  primary: '●',
  limited: '●',
  covenant: '✓',
} as const;

// ============================================
// DATA CONFIGURATION
// ============================================

/**
 * Station data configuration
 */
export const DATA_CONFIG = {
  /** Whether to log station stats on load */
  logStats: true,
  
  /** Whether to validate data on load */
  validateData: false,
} as const;

// ============================================
// MOBILE-SPECIFIC (Future)
// ============================================

/**
 * Mobile-specific configuration
 * These can be different from web values
 */
export const MOBILE_CONFIG = {
  /** Minimum touch target size (Android/iOS guidelines) */
  minTouchTarget: 48,
  
  /** Reduced query length for mobile keyboards */
  minSearchQueryLength: 2,
  
  /** Number of stations to render initially (performance) */
  initialStationsToRender: 10,
  
  /** Maximum visible stations before virtual scrolling */
  maxVisibleStations: 50,
} as const;

// ============================================
// PERFORMANCE CONFIGURATION
// ============================================

/**
 * Performance tuning
 */
export const PERFORMANCE_CONFIG = {
  /** Debounce delay for search input (ms) */
  searchDebounceMs: 300,
  
  /** Whether to use search indexing (O(1) vs O(n)) */
  useSearchIndex: false, // Can enable later if needed
} as const;


