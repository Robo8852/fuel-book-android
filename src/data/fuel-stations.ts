/**
 * Fuel Stations Data
 * Imports and transforms PDF data for frontend use
 */

import fuelStationsBackendData from '../../fuel_stations_data.json';
import type { BackendData, FuelStation, BrandType } from '../types/fuel-station';
import { flattenStations, extractStates, extractStationTypes, extractBrands } from '../utils/data-transformer';
import { ALL_US_STATES, getCoverageStats } from './state-coverage';

// Cast the imported JSON to proper type
const backendData = fuelStationsBackendData as BackendData;

// Transform backend data to frontend format
export const allFuelStations: FuelStation[] = flattenStations(backendData);

// Extract filter options - use actual state abbreviations from transformed data
export const availableStates: string[] = ALL_US_STATES; // Full state names for display
export const statesWithStations = extractStates(allFuelStations); // Actual abbreviations (CA, TX, etc)
export const availableStationTypes = extractStationTypes(allFuelStations);
export const availableBrands = extractBrands(allFuelStations);

// Summary stats
export const stationStats = {
  total: allFuelStations.length,
  states: availableStates.length,
  statesWithStations: statesWithStations.length,
  covenantTerminals: allFuelStations.filter(s => s.stationType === 'Covenant Terminal').length,
  exclusiveStations: allFuelStations.filter(s => s.stationType === 'Exclusive').length,
  primaryStations: allFuelStations.filter(s => s.stationType === 'Primary').length,
  limitedStations: allFuelStations.filter(s => s.stationType === 'Limited').length,
  coverageStats: getCoverageStats(),
};

console.log('📊 Fuel Stations Loaded:', stationStats);

