/**
 * SearchBar Component - React Native Paper
 * Ported from web shadcn/ui Input
 */

import React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search by state, city, or terminal...",
  value = "",
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={() => onSearch?.(value)}
      style={styles.searchbar}
      iconColor="#1e3a8a"
      inputStyle={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    fontSize: 16,
    color: '#1e3a8a',
  },
});


