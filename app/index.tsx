/**
 * Main Screen - Covenant Fuel Station Locator Mobile
 * Uses tested business logic from web app
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import type { StationTypeFilter, BrandTypeFilter } from '../types/fuel-station';

// Components
import { SearchBar } from '../components/SearchBar';
import { FilterSection } from '../components/FilterSection';
import { StationCard } from '../components/StationCard';
import { EmptyStateCard } from '../components/EmptyStateCard';

// Business logic (tested with 45 unit tests!)
import { getFilteredStations } from '../utils/data-transformer';
import { allFuelStations, availableStates } from '../data/fuel-stations';
import { getNearbyStates, stateHasStations } from '../data/state-coverage';

export default function HomeScreen() {
  // State management (same as web app)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<StationTypeFilter>('all');
  const [selectedBrand, setSelectedBrand] = useState<BrandTypeFilter>('all');

  // Filtered stations using tested business logic
  const filteredStations = useMemo(() => {
    return getFilteredStations(
      allFuelStations,
      searchQuery,
      selectedState,
      selectedType,
      selectedBrand
    );
  }, [searchQuery, selectedState, selectedType, selectedBrand]);

  // Check if selected state has no stations
  const showEmptyStateCard = useMemo(() => {
    return (
      selectedState !== 'all' &&
      !searchQuery &&
      !stateHasStations(selectedState) &&
      filteredStations.length === 0
    );
  }, [selectedState, searchQuery, filteredStations.length]);

  // Get nearby states for empty state
  const nearbyStates = useMemo(() => {
    if (showEmptyStateCard) {
      return getNearbyStates(selectedState);
    }
    return [];
  }, [showEmptyStateCard, selectedState]);

  // Loading state (for future)
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading stations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by state, city, or terminal..."
        />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FilterSection
          selectedState={selectedState}
          selectedType={selectedType}
          selectedBrand={selectedBrand}
          availableStates={availableStates}
          onStateChange={setSelectedState}
          onTypeChange={setSelectedType}
          onBrandChange={setSelectedBrand}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredStations.length} {filteredStations.length === 1 ? 'station' : 'stations'} found
        </Text>
        {(searchQuery || selectedState !== 'all' || selectedType !== 'all' || selectedBrand !== 'all') && (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedState('all');
              setSelectedType('all');
              setSelectedBrand('all');
            }}
          >
            Clear All
          </Text>
        )}
      </View>

      {/* Station List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.stationList}
        showsVerticalScrollIndicator={true}
      >
        {showEmptyStateCard ? (
          // Show special empty state card for states with no stations
          <EmptyStateCard
            stateName={selectedState}
            nearbyStates={nearbyStates}
            onStateSelect={(state) => {
              setSelectedState(state);
              setSearchQuery('');
              setSelectedType('all');
              setSelectedBrand('all');
            }}
          />
        ) : filteredStations.length === 0 ? (
          // Show generic empty state for search with no results
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No stations found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          // Show station list
          filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPress={() => {
                // Future: Navigate to station details or open maps
                console.log('Selected station:', station.stationName);
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1e3a8a',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,
  },
  stationList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#60a5fa',
    textAlign: 'center',
  },
});

