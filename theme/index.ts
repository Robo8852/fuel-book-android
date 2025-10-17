/**
 * React Native Paper Theme
 * Navy blue color scheme for Covenant Fuel Locator
 */

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e3a8a',           // Navy blue 950
    secondary: '#1e40af',          // Navy blue 900
    tertiary: '#2563eb',           // Blue 700
    surface: '#ffffff',            // White
    surfaceVariant: '#f3f4f6',    // Gray 100
    background: '#f9fafb',         // Gray 50
    error: '#ef4444',              // Red
    errorContainer: '#fee2e2',     // Red 100
    onPrimary: '#ffffff',          // White text on navy
    onSecondary: '#ffffff',        // White text on blue
    onSurface: '#1e3a8a',          // Navy text on white
    onSurfaceVariant: '#1e40af',   // Blue text
    outline: '#93c5fd',            // Blue 300 for borders
    outlineVariant: '#bfdbfe',     // Blue 200
    inverseSurface: '#1e3a8a',     // Navy for dark mode
    inverseOnSurface: '#ffffff',   // White for dark mode
    inversePrimary: '#60a5fa',     // Light blue
    backdrop: 'rgba(30, 58, 138, 0.5)', // Navy overlay
  },
  roundness: 12,  // Rounded corners
};


