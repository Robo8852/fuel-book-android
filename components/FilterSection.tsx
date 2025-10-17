/**
 * FilterSection Component - React Native Paper
 * State, Type, and Brand filters with Menu dropdowns
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import type { StationTypeFilter, BrandTypeFilter } from '../types/fuel-station';
import { FILTER_CONFIG } from '../config/constants';

interface FilterSectionProps {
  selectedState: string;
  selectedType: StationTypeFilter;
  selectedBrand: BrandTypeFilter;
  availableStates: string[];
  onStateChange: (state: string) => void;
  onTypeChange: (type: StationTypeFilter) => void;
  onBrandChange: (brand: BrandTypeFilter) => void;
}

export function FilterSection({
  selectedState,
  selectedType,
  selectedBrand,
  availableStates,
  onStateChange,
  onTypeChange,
  onBrandChange,
}: FilterSectionProps) {
  const [stateMenuVisible, setStateMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [brandMenuVisible, setBrandMenuVisible] = useState(false);

  const stationTypes: StationTypeFilter[] = [
    'all',
    'Exclusive',
    'Primary',
    'Limited',
    'Covenant Terminal',
  ];

  const brands: BrandTypeFilter[] = ['all', 'TA', 'PETRO', 'Covenant'];

  // Get display label for state
  const getStateLabel = () => {
    if (selectedState === 'all') return FILTER_CONFIG.allStatesLabel;
    return selectedState;
  };

  // Get display label for type
  const getTypeLabel = () => {
    if (selectedType === 'all') return FILTER_CONFIG.allTypesLabel;
    return selectedType;
  };

  // Get display label for brand
  const getBrandLabel = () => {
    if (selectedBrand === 'all') return FILTER_CONFIG.allBrandsLabel;
    return selectedBrand;
  };

  return (
    <View style={styles.container}>
      {/* State Filter */}
      <Menu
        visible={stateMenuVisible}
        onDismiss={() => setStateMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setStateMenuVisible(true)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="map-marker"
          >
            {getStateLabel()}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        <ScrollView style={styles.scrollView}>
          <Menu.Item
            onPress={() => {
              setStateMenuVisible(false);
              setTimeout(() => onStateChange('all'), 150);
            }}
            title={FILTER_CONFIG.allStatesLabel}
            titleStyle={selectedState === 'all' ? styles.selectedItem : undefined}
          />
          {availableStates.map((state) => (
            <Menu.Item
              key={state}
              onPress={() => {
                setStateMenuVisible(false);
                setTimeout(() => onStateChange(state), 150);
              }}
              title={state}
              titleStyle={selectedState === state ? styles.selectedItem : undefined}
            />
          ))}
        </ScrollView>
      </Menu>

      {/* Type Filter */}
      <Menu
        visible={typeMenuVisible}
        onDismiss={() => setTypeMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setTypeMenuVisible(true)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="gas-station"
          >
            {getTypeLabel()}
          </Button>
        }
      >
        {stationTypes.map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeMenuVisible(false);
              setTimeout(() => onTypeChange(type), 150);
            }}
            title={type === 'all' ? FILTER_CONFIG.allTypesLabel : type}
            titleStyle={selectedType === type ? styles.selectedItem : undefined}
          />
        ))}
      </Menu>

      {/* Brand Filter */}
      <Menu
        visible={brandMenuVisible}
        onDismiss={() => setBrandMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setBrandMenuVisible(true)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="tag"
          >
            {getBrandLabel()}
          </Button>
        }
      >
        {brands.map((brand) => (
          <Menu.Item
            key={brand}
            onPress={() => {
              setBrandMenuVisible(false);
              setTimeout(() => onBrandChange(brand), 150);
            }}
            title={brand === 'all' ? FILTER_CONFIG.allBrandsLabel : brand}
            titleStyle={selectedBrand === brand ? styles.selectedItem : undefined}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  button: {
    borderColor: '#93c5fd',
    borderWidth: 2,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonContent: {
    paddingHorizontal: 4,
  },
  buttonLabel: {
    color: '#1e3a8a',
    fontSize: 13,
    fontWeight: '600',
  },
  menuContent: {
    backgroundColor: '#ffffff',
    maxHeight: 400,
  },
  scrollView: {
    maxHeight: 300,
  },
  selectedItem: {
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
});

