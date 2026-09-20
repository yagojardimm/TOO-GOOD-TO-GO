import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ExploreScreen({ onSelectBag }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Yago 👋</Text>
          <Text style={styles.location}>
            <Feather name="map-pin" size={14} color="#059669" /> São Paulo, SP
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Feed de Sacolas Surpresa em construção...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  location: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 15,
  },
});
