/**
 * StationCard Component - React Native Paper
 * Ported from web shadcn/ui Card
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { FuelStation } from '../types/fuel-station';
import { STATION_BADGES } from '../config/constants';

interface StationCardProps {
  station: FuelStation;
  onPress?: () => void;
}

export function StationCard({ station, onPress }: StationCardProps) {
  // Get badge for station type
  const getStationTypeBadge = () => {
    switch (station.stationType) {
      case 'Exclusive':
        return `${STATION_BADGES.exclusive} EXCLUSIVE`;
      case 'Primary':
        return `${STATION_BADGES.primary} PRIMARY`;
      case 'Limited':
        return `${STATION_BADGES.limited} LIMITED`;
      case 'Covenant Terminal':
        return `${STATION_BADGES.covenant} COVENANT`;
      default:
        return '';
    }
  };

  // Get brand badge
  const getBrandBadge = () => {
    return station.brand;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header with Title and State Badge */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {station.stationName}
          </Text>
          <View style={styles.stateBadge}>
            <Text style={styles.stateText}>{station.state}</Text>
          </View>
        </View>

        {/* Station Type and Brand Badges Row */}
        <View style={styles.badgesRow}>
          {getStationTypeBadge() && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{getStationTypeBadge()}</Text>
            </View>
          )}
          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>{getBrandBadge()}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationText}>
            <Text style={styles.address}>{station.address}</Text>
            <Text style={styles.cityState}>
              {station.city}, {station.state} {station.zip}
            </Text>
          </View>
        </View>

        {/* Exit Info */}
        {station.exitInfo && (
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🛣️</Text>
            <Text style={styles.infoText}>{station.exitInfo}</Text>
          </View>
        )}

        {/* Phone */}
        {station.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.infoText}>{station.phone}</Text>
          </View>
        )}

        {/* NaviGo ID */}
        <View style={styles.navigoRow}>
          <Text style={styles.navigoLabel}>NaviGo:</Text>
          <Text style={styles.navigoId}>{station.navigoId}</Text>
        </View>

        {/* Amenities for Covenant Terminals */}
        {station.amenities && station.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenitiesLabel}>Amenities:</Text>
            <View style={styles.amenitiesList}>
              {station.amenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityBadge}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
    marginRight: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  brandBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    flex: 1,
  },
  address: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 2,
  },
  cityState: {
    fontSize: 14,
    color: '#1e40af',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#60a5fa',
  },
  navigoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navigoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a8a',
    marginRight: 6,
  },
  navigoId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a8a',
    fontFamily: 'monospace',
  },
  amenitiesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  amenitiesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 11,
    color: '#2563eb',
  },
  stateBadge: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stateText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

