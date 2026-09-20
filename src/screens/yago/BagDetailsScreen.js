import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BagDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Sacola Surpresa</Text>
      <Text style={styles.subtitle}>Tela do desenvolvedor Yago</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
});
