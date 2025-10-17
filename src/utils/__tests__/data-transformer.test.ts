/**
 * Unit Tests for Data Transformer Utilities
 * Critical for ensuring data reliability in mobile app
 */

import {
  parseCityStateZip,
  transformFuelStation,
  searchStations,
  getFilteredStations,
  extractStates,
  extractStationTypes,
  extractBrands,
} from '../data-transformer';
import type {
  FuelStation,
  BackendFuelStation,
  StationType,
  BrandType,
} from '../../types/fuel-station';

describe('parseCityStateZip', () => {
  describe('valid inputs', () => {
    it('should parse complete city, state, zip', () => {
      const result = parseCityStateZip('Corning, CA 96021');
      expect(result).toEqual({
        city: 'Corning',
        state: 'CA',
        zip: '96021',
      });
    });

    it('should handle city with spaces', () => {
      const result = parseCityStateZip('Santa Nella, CA 95322');
      expect(result).toEqual({
        city: 'Santa Nella',
        state: 'CA',
        zip: '95322',
      });
    });

    it('should handle extra spaces', () => {
      const result = parseCityStateZip('Corning,  CA  96021');
      expect(result).toEqual({
        city: 'Corning',
        state: 'CA',
        zip: '96021',
      });
    });

    it('should parse without zip code', () => {
      const result = parseCityStateZip('Corning, CA');
      expect(result).toEqual({
        city: 'Corning',
        state: 'CA',
        zip: '',
      });
    });
  });

  describe('edge cases and invalid inputs', () => {
    it('should handle empty string', () => {
      const result = parseCityStateZip('');
      expect(result).toEqual({
        city: '',
        state: '',
        zip: '',
      });
    });

    it('should handle missing comma', () => {
      const result = parseCityStateZip('InvalidInput');
      expect(result).toEqual({
        city: '',
        state: '',
        zip: '',
      });
    });

    it('should handle only city name', () => {
      const result = parseCityStateZip('Corning');
      expect(result).toEqual({
        city: '',
        state: '',
        zip: '',
      });
    });

    it('should handle null-like input', () => {
      const result = parseCityStateZip(null as any);
      expect(result).toEqual({
        city: '',
        state: '',
        zip: '',
      });
    });

    it('should handle undefined', () => {
      const result = parseCityStateZip(undefined as any);
      expect(result).toEqual({
        city: '',
        state: '',
        zip: '',
      });
    });

    it('should handle malformed with too many commas gracefully', () => {
      const result = parseCityStateZip('City, State, Extra, Stuff');
      expect(result.city).toBe('City');
      // Malformed data returns empty state (safe behavior)
      expect(result.state).toBe('');
      expect(result.zip).toBe('');
    });
  });

  describe('real-world trucking data', () => {
    it('should handle Texas location', () => {
      const result = parseCityStateZip('Houston, TX 77001');
      expect(result).toEqual({
        city: 'Houston',
        state: 'TX',
        zip: '77001',
      });
    });

    it('should handle California location', () => {
      const result = parseCityStateZip('Los Angeles, CA 90001');
      expect(result).toEqual({
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
      });
    });
  });
});

describe('transformFuelStation', () => {
  const mockBackendStation: BackendFuelStation = {
    page: 1,
    state: 'CALIFORNIA',
    number: '163',
    type: 'TA',
    name: '#163 TA Santa Nella',
    address: '12310 California Hwy 33',
    city_state_zip: 'Santa Nella, CA 95322',
    exit_info: 'I-5, Exit 407',
    phone: '(209) 826-0741',
    fax: '(209) 826-0742',
    navigo_id: 'CVEN-TA163',
    site_type: 'Primary',
  };

  it('should transform complete backend station', () => {
    const result = transformFuelStation(mockBackendStation, 'CALIFORNIA');
    
    expect(result.id).toBe('CALIFORNIA-163');
    expect(result.stationName).toBe('#163 TA Santa Nella');
    expect(result.address).toBe('12310 California Hwy 33');
    expect(result.city).toBe('Santa Nella');
    expect(result.state).toBe('CA');
    expect(result.zip).toBe('95322');
    expect(result.stationType).toBe('Primary');
    expect(result.brand).toBe('TA');
    expect(result.phone).toBe('(209) 826-0741');
    expect(result.fax).toBe('(209) 826-0742');
    expect(result.navigoId).toBe('CVEN-TA163');
    expect(result.exitInfo).toBe('I-5, Exit 407');
  });

  it('should handle PETRO station', () => {
    const petroStation: BackendFuelStation = {
      ...mockBackendStation,
      type: 'PETRO',
      site_type: 'Exclusive',
    };
    
    const result = transformFuelStation(petroStation, 'TEXAS');
    expect(result.brand).toBe('PETRO');
    expect(result.stationType).toBe('Exclusive');
  });

  it('should handle Limited station type', () => {
    const limitedStation: BackendFuelStation = {
      ...mockBackendStation,
      site_type: 'Limited',
    };
    
    const result = transformFuelStation(limitedStation, 'TEXAS');
    expect(result.stationType).toBe('Limited');
  });

  it('should handle missing optional fields', () => {
    const minimalStation: BackendFuelStation = {
      page: 1,
      state: 'TEXAS',
      number: '100',
      type: 'TA',
      name: 'Test Station',
      address: '123 Main St',
      city_state_zip: 'Houston, TX 77001',
      navigo_id: 'CVEN-TA100',
      site_type: 'Primary',
    };
    
    const result = transformFuelStation(minimalStation, 'TEXAS');
    expect(result.phone).toBeUndefined();
    expect(result.fax).toBeUndefined();
    expect(result.exitInfo).toBeUndefined();
  });
});

describe('searchStations', () => {
  const mockStations: FuelStation[] = [
    {
      id: 'CA-163',
      stationName: '#163 TA Santa Nella',
      address: '12310 California Hwy 33',
      city: 'Santa Nella',
      state: 'CA',
      zip: '95322',
      stationType: 'Primary',
      brand: 'TA',
      navigoId: 'CVEN-TA163',
    },
    {
      id: 'TX-100',
      stationName: '#100 PETRO Houston',
      address: '123 Main St',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      stationType: 'Exclusive',
      brand: 'PETRO',
      navigoId: 'CVEN-PETRO100',
    },
    {
      id: 'GA-50',
      stationName: '#50 TA Cartersville',
      address: '100 Highway 20',
      city: 'Cartersville',
      state: 'GA',
      zip: '30120',
      stationType: 'Limited',
      brand: 'TA',
      navigoId: 'CVEN-TA50',
    },
  ];

  describe('empty query', () => {
    it('should return all stations for empty string', () => {
      const result = searchStations(mockStations, '');
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockStations);
    });

    it('should return all stations for whitespace only', () => {
      const result = searchStations(mockStations, '   ');
      expect(result).toHaveLength(3);
    });
  });

  describe('state abbreviation search - CRITICAL for trucking', () => {
    it('should find all CA stations when searching "CA"', () => {
      const result = searchStations(mockStations, 'CA');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('CA');
      expect(result[0].city).toBe('Santa Nella');
    });

    it('should find all TX stations when searching "TX"', () => {
      const result = searchStations(mockStations, 'TX');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('TX');
    });

    it('should NOT match "CA" in city "Cartersville" - CRITICAL BUG FIX', () => {
      const result = searchStations(mockStations, 'CA');
      // Should only return California station, NOT Cartersville, GA
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('CA');
      expect(result.find(s => s.city === 'Cartersville')).toBeUndefined();
    });

    it('should be case insensitive for states', () => {
      const result = searchStations(mockStations, 'ca');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('CA');
    });
  });

  describe('full state name search', () => {
    it('should find California stations when searching "california"', () => {
      const result = searchStations(mockStations, 'california');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('CA');
    });

    it('should find Texas stations when searching "texas"', () => {
      const result = searchStations(mockStations, 'texas');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('TX');
    });

    it('should handle state name prefix', () => {
      const result = searchStations(mockStations, 'calif');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('CA');
    });
  });

  describe('city search', () => {
    it('should find station by city name', () => {
      const result = searchStations(mockStations, 'Houston');
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('Houston');
    });

    it('should find station by partial city name (3+ chars)', () => {
      const result = searchStations(mockStations, 'Hous');
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('Houston');
    });

    it('should NOT search cities with less than 3 chars', () => {
      const result = searchStations(mockStations, 'Ho');
      expect(result).toHaveLength(0);
    });
  });

  describe('NaviGo ID search', () => {
    it('should find station by NaviGo ID', () => {
      const result = searchStations(mockStations, 'CVEN-TA163');
      expect(result).toHaveLength(1);
      expect(result[0].navigoId).toBe('CVEN-TA163');
    });

    it('should find station by partial NaviGo ID', () => {
      const result = searchStations(mockStations, 'PETRO100');
      expect(result).toHaveLength(1);
      expect(result[0].navigoId).toBe('CVEN-PETRO100');
    });
  });

  describe('station name search', () => {
    it('should find station by name', () => {
      const result = searchStations(mockStations, 'Santa Nella');
      expect(result).toHaveLength(1);
      expect(result[0].stationName).toContain('Santa Nella');
    });
  });
});

describe('getFilteredStations', () => {
  const mockStations: FuelStation[] = [
    {
      id: 'CA-1',
      stationName: 'TA Station 1',
      address: '123 St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      stationType: 'Primary',
      brand: 'TA',
      navigoId: 'CVEN-TA1',
    },
    {
      id: 'CA-2',
      stationName: 'PETRO Station 2',
      address: '456 St',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      stationType: 'Exclusive',
      brand: 'PETRO',
      navigoId: 'CVEN-PETRO2',
    },
    {
      id: 'TX-1',
      stationName: 'TA Station 3',
      address: '789 St',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
      stationType: 'Primary',
      brand: 'TA',
      navigoId: 'CVEN-TA3',
    },
  ];

  it('should return all stations with no filters', () => {
    const result = getFilteredStations(mockStations, '', undefined, undefined, undefined);
    expect(result).toHaveLength(3);
  });

  it('should filter by state only (abbreviation)', () => {
    const result = getFilteredStations(mockStations, '', 'CA', undefined, undefined);
    expect(result).toHaveLength(2);
    expect(result.every(s => s.state === 'CA')).toBe(true);
  });

  it('should filter by state using full state name (CALIFORNIA)', () => {
    const result = getFilteredStations(mockStations, '', 'CALIFORNIA', undefined, undefined);
    expect(result).toHaveLength(2);
    expect(result.every(s => s.state === 'CA')).toBe(true);
  });

  it('should filter by state using full state name (TEXAS)', () => {
    const result = getFilteredStations(mockStations, '', 'TEXAS', undefined, undefined);
    expect(result).toHaveLength(1);
    expect(result[0].state).toBe('TX');
  });

  it('should filter by station type only', () => {
    const result = getFilteredStations(mockStations, '', undefined, 'Exclusive', undefined);
    expect(result).toHaveLength(1);
    expect(result[0].stationType).toBe('Exclusive');
  });

  it('should filter by brand only', () => {
    const result = getFilteredStations(mockStations, '', undefined, undefined, 'PETRO');
    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe('PETRO');
  });

  it('should combine search and filters', () => {
    const result = getFilteredStations(mockStations, 'CA', 'CA', 'Primary', 'TA');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('CA-1');
  });

  it('should return empty array when no matches', () => {
    const result = getFilteredStations(mockStations, '', 'NY', undefined, undefined);
    expect(result).toHaveLength(0);
  });

  it('should ignore "all" filter values', () => {
    const result = getFilteredStations(mockStations, '', 'all', 'all' as any, 'all' as any);
    expect(result).toHaveLength(3);
  });
});

describe('extractStates', () => {
  it('should extract unique states and sort', () => {
    const stations: FuelStation[] = [
      { state: 'TX' } as FuelStation,
      { state: 'CA' } as FuelStation,
      { state: 'TX' } as FuelStation,
      { state: 'AZ' } as FuelStation,
    ];
    
    const result = extractStates(stations);
    expect(result).toEqual(['AZ', 'CA', 'TX']); // Alphabetically sorted
  });

  it('should handle empty array', () => {
    const result = extractStates([]);
    expect(result).toEqual([]);
  });

  it('should filter out stations with empty state', () => {
    const stations: FuelStation[] = [
      { state: 'CA' } as FuelStation,
      { state: '' } as FuelStation,
      { state: 'TX' } as FuelStation,
    ];
    
    const result = extractStates(stations);
    expect(result).toEqual(['CA', 'TX']);
  });
});

describe('extractStationTypes', () => {
  it('should extract unique station types and sort', () => {
    const stations: FuelStation[] = [
      { stationType: 'Primary' } as FuelStation,
      { stationType: 'Exclusive' } as FuelStation,
      { stationType: 'Primary' } as FuelStation,
      { stationType: 'Limited' } as FuelStation,
    ];
    
    const result = extractStationTypes(stations);
    expect(result).toContain('Primary');
    expect(result).toContain('Exclusive');
    expect(result).toContain('Limited');
    expect(result.length).toBe(3); // No duplicates
  });
});

describe('extractBrands', () => {
  it('should extract unique brands and sort', () => {
    const stations: FuelStation[] = [
      { brand: 'TA' } as FuelStation,
      { brand: 'PETRO' } as FuelStation,
      { brand: 'TA' } as FuelStation,
      { brand: 'Covenant' } as FuelStation,
    ];
    
    const result = extractBrands(stations);
    expect(result).toContain('TA');
    expect(result).toContain('PETRO');
    expect(result).toContain('Covenant');
    expect(result.length).toBe(3); // No duplicates
  });
});

