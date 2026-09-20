import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIES, MOCK_BAGS } from '../../data/mockData';
import BagCard from '../../components/BagCard';

const { width } = Dimensions.get('window');

export default function ExploreScreen({ onSelectBag }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'map'
  const [selectedMapStore, setSelectedMapStore] = useState(MOCK_BAGS[0]);

  // Filtro dinâmico por categoria e texto de busca
  const filteredBags = MOCK_BAGS.filter((bag) => {
    const matchesCategory =
      selectedCategory === 'all' || bag.category === selectedCategory;
    const matchesSearch =
      bag.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bag.bagTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bag.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

        {/* Botão Alternador Lista / Mapa */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
            activeOpacity={0.8}
          >
            <Feather
              name="list"
              size={15}
              color={viewMode === 'list' ? '#ffffff' : '#64748b'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
            activeOpacity={0.8}
          >
            <Feather
              name="map"
              size={15}
              color={viewMode === 'map' ? '#ffffff' : '#64748b'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar padarias, restaurantes, pratos..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x-circle" size={17} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Carrossel Horizontal de Categorias */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Feather
                  name={cat.icon}
                  size={14}
                  color={isSelected ? '#ffffff' : '#64748b'}
                  style={styles.catIcon}
                />
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Visualização em MAPA ou LISTA */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          {/* Radar / Grid do Mapa */}
          <View style={styles.mapCanvas}>
            <View style={styles.radarCircle1} />
            <View style={styles.radarCircle2} />
            <View style={styles.radarCircle3} />

            {/* Pin de localização do usuário */}
            <View style={styles.userPin}>
              <View style={styles.userPinPulse} />
              <Feather name="navigation" size={16} color="#ffffff" />
            </View>
            <Text style={styles.userPinLabel}>Você</Text>

            {/* Pins dos Estabelecimentos */}
            {filteredBags.map((bag, idx) => {
              const positions = [
                { top: 50, left: 70 },
                { top: 120, right: 60 },
                { bottom: 140, left: 50 },
                { top: 70, right: 110 },
                { bottom: 170, right: 70 },
                { top: 190, left: 120 },
              ];
              const pos = positions[idx % positions.length];
              const isSelected = selectedMapStore?.id === bag.id;

              return (
                <TouchableOpacity
                  key={bag.id}
                  style={[
                    styles.storePin,
                    pos,
                    isSelected && styles.storePinActive,
                  ]}
                  onPress={() => setSelectedMapStore(bag)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.storePinPrice, isSelected && styles.storePinPriceActive]}>
                    R$ {bag.price.toFixed(0)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Card Flutuante de Prévia no Mapa */}
          {selectedMapStore && (
            <View style={styles.mapFloatingCard}>
              <View style={styles.mapCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapCardStore}>{selectedMapStore.storeName}</Text>
                  <Text style={styles.mapCardDistance}>
                    {selectedMapStore.distance} • {selectedMapStore.pickupWindow}
                  </Text>
                </View>
                <View style={styles.mapCardPriceBlock}>
                  <Text style={styles.mapCardPrice}>R$ {selectedMapStore.price.toFixed(2).replace('.', ',')}</Text>
                  <Text style={styles.mapCardDiscount}>-{selectedMapStore.discountPercentage}%</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mapCardAction}
                onPress={() => onSelectBag && onSelectBag(selectedMapStore)}
                activeOpacity={0.8}
              >
                <Text style={styles.mapCardActionText}>Ver Detalhes da Sacola</Text>
                <Feather name="arrow-right" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        /* Visualização em Lista */
        filteredBags.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Nenhuma sacola encontrada</Text>
            <Text style={styles.emptySubtitle}>Tente buscar por outro termo ou limpar os filtros de categoria.</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBags}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BagCard bag={item} onPress={onSelectBag} />
            )}
          />
        )
      )}
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
    paddingBottom: 12,
    backgroundColor: '#ffffff',
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
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: '#059669',
    elevation: 2,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  catIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  /* Estilos do Mapa */
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  mapCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#e5eef5',
  },
  radarCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.25)',
  },
  radarCircle2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.18)',
  },
  radarCircle3: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.10)',
  },
  userPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  userPinPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  userPinLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 4,
  },
  storePin: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#059669',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  storePinActive: {
    backgroundColor: '#059669',
    borderColor: '#ffffff',
    transform: [{ scale: 1.15 }],
  },
  storePinPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  storePinPriceActive: {
    color: '#ffffff',
  },
  mapFloatingCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mapCardStore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  mapCardDistance: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  mapCardPriceBlock: {
    alignItems: 'flex-end',
  },
  mapCardPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#059669',
  },
  mapCardDiscount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  mapCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
  },
  mapCardActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 18,
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});
