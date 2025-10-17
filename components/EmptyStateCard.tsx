import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

interface EmptyStateCardProps {
  stateName: string;
  nearbyStates: string[];
  onStateSelect: (state: string) => void;
}

export function EmptyStateCard({ stateName, nearbyStates, onStateSelect }: EmptyStateCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.container}>
          {/* Header Icon and Title */}
          <Text style={styles.icon}>❌</Text>
          <Text style={styles.title}>No Covenant Fuel Stations Available</Text>
          
          {/* Message */}
          <Text style={styles.message}>
            There are currently no fuel stations in {stateName}
          </Text>
          
          {/* Nearby States Suggestion */}
          {nearbyStates.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsLabel}>Try nearby states:</Text>
              <View style={styles.statesRow}>
                {nearbyStates.map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={styles.stateBadge}
                    onPress={() => onStateSelect(state)}
                  >
                    <Text style={styles.stateText}>{state}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#92400e',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
    textAlign: 'center',
  },
  statesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  stateBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stateText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

