/**
 * Root Layout for Covenant Fuel Locator Mobile App
 * Expo Router + React Native Paper + ErrorBoundary
 */

import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { theme } from '../theme';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e3a8a',  // Navy blue
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Covenant Fuel Locator',
            }}
          />
        </Stack>
      </PaperProvider>
    </ErrorBoundary>
  );
}


