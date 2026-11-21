import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BagCard from '../../src/components/BagCard';
import { CATEGORIES } from '../../src/data/mockData';
import { useApp, BagItem } from '../../src/contexts/AppContext';
import { useAuth } from '../../src/contexts/AuthContext';

export const ITEMS: Array<{ id: string; nome: string; preco: string; descricao: string }> = [];

export default function ExploreRoute() {
  const router = useRouter();
  const { user } = useAuth();
  const { bags, addresses, isLoadingData } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const locationText = defaultAddress
    ? `${defaultAddress.bairro}, ${defaultAddress.cidade}`
    : 'São Paulo, SP';

  const filteredBags = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return bags.filter((bag) => {
      const matchesCat =
        selectedCategory === 'all' || bag.category === selectedCategory;
      const matchesSearch =
        !term ||
        bag.storeName.toLowerCase().includes(term) ||
        bag.bagTitle.toLowerCase().includes(term) ||
        bag.categoryLabel.toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });
  }, [bags, searchQuery, selectedCategory]);

  function handleOpenBag(bag: BagItem) {
    router.push(`/(app)/${bag.id}`);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.name ? user.name.split(' ')[0] : 'bem-vindo'}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#059669" />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationText}
              </Text>
            </View>
          </View>
          <View style={styles.brandBadge}>
            <Feather name="shopping-bag" size={16} color="#059669" />
            <Text style={styles.brandBadgeText}>SaveFood</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Feather name="search" size={17} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar padarias, mercados, doces..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={17} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Feather
                  name={cat.icon as any}
                  size={14}
                  color={active ? '#ffffff' : '#475569'}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoadingData ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Carregando sacolas disponíveis...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBags}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sacolas surpresa hoje</Text>
              <Text style={styles.sectionCount}>
                {filteredBags.length} {filteredBags.length === 1 ? 'opção' : 'opções'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <BagCard bag={item} onPress={() => handleOpenBag(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Feather name="search" size={34} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Nenhuma sacola encontrada</Text>
              <Text style={styles.emptySubtitle}>
                Tente buscar por outro termo ou limpar os filtros ativos.
              </Text>
              {(searchQuery || selectedCategory !== 'all') && (
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  <Text style={styles.clearFilterText}>Limpar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationText: {
    fontSize: 13,
    color: '#475569',
    maxWidth: 210,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  brandBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  categoriesRow: {
    gap: 8,
    paddingTop: 12,
    paddingBottom: 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#059669',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  clearFilterBtn: {
    marginTop: 14,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
});
