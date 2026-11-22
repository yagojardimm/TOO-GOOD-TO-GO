import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppProvider } from '../src/contexts/AppContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <View style={styles.outerWrapper}>
          <View style={styles.phoneContainer}>
            <Slot />
          </View>
        </View>
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#e2e8f0' : '#f8fafc',
    alignItems: 'center',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#cbd5e1',
  },
});
