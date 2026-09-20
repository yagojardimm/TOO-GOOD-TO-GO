import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOCK_BAGS } from '../../data/mockData';
import BagCard from '../../components/BagCard';

export default function ExploreScreen({ onSelectBag }) {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Olá, Yago 👋</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color="#059669" />
            <Text style={styles.locationText}>São Paulo, SP</Text>
          </View>
        </View>
        <View style={styles.savedMealsBadge}>
          <Feather name="heart" size={13} color="#059669" />
          <Text style={styles.savedMealsText}>Salvar Comida</Text>
        </View>
      </View>

      {/* Lista de Sacolas */}
      <FlatList
        data={MOCK_BAGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BagCard bag={item} onPress={onSelectBag} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
  savedMealsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  savedMealsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 5,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
});
