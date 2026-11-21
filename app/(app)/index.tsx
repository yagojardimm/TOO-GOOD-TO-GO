import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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

export default function ExploreRoute() {
  const router = useRouter();
  const { user } = useAuth();
  const { bags, addresses, isLoadingData, isFavorite, toggleFavorite } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const PIN_POSITIONS = [
    { top: '18%', left: '16%' },
    { top: '28%', left: '62%' },
    { top: '46%', left: '34%' },
    { top: '60%', left: '68%' },
    { top: '38%', left: '14%' },
    { top: '70%', left: '26%' },
    { top: '20%', left: '42%' },
    { top: '54%', left: '50%' },
  ];

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
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'list' && styles.viewToggleBtnActive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <Feather
                name="list"
                size={14}
                color={viewMode === 'list' ? '#ffffff' : '#475569'}
              />
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === 'list' && styles.viewToggleTextActive,
                ]}
              >
                Lista
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'map' && styles.viewToggleBtnActive,
              ]}
              onPress={() => setViewMode('map')}
            >
              <Feather
                name="map"
                size={14}
                color={viewMode === 'map' ? '#ffffff' : '#475569'}
              />
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === 'map' && styles.viewToggleTextActive,
                ]}
              >
                Mapa
              </Text>
            </TouchableOpacity>
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
      ) : viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <View style={styles.mapCanvas}>
            <View style={styles.radarOuter} />
            <View style={styles.radarInner} />
            <View style={styles.userDot} />

            {filteredBags.map((bag, index) => {
              const pos = PIN_POSITIONS[index % PIN_POSITIONS.length];
              const isSelected =
                (selectedPinId || filteredBags[0]?.id) === bag.id;

              return (
                <TouchableOpacity
                  key={bag.id}
                  style={[
                    styles.mapPin,
                    { top: pos.top as any, left: pos.left as any },
                    isSelected && styles.mapPinActive,
                  ]}
                  onPress={() => setSelectedPinId(bag.id)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.mapPinText,
                      isSelected && styles.mapPinTextActive,
                    ]}
                  >
                    R$ {bag.price.toFixed(0)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {(() => {
            const activeBag =
              filteredBags.find((b) => b.id === selectedPinId) ||
              filteredBags[0];

            if (!activeBag) {
              return (
                <View style={styles.mapEmptyCard}>
                  <Text style={styles.emptyTitle}>Nenhuma loja no mapa</Text>
                  <Text style={styles.emptySubtitle}>
                    Altere os filtros para visualizar sacolas próximas.
                  </Text>
                </View>
              );
            }

            return (
              <TouchableOpacity
                style={styles.mapPreviewCard}
                onPress={() => handleOpenBag(activeBag)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: activeBag.coverImage }}
                  style={styles.mapPreviewImg}
                />
                <View style={styles.mapPreviewInfo}>
                  <Text style={styles.mapPreviewStore} numberOfLines={1}>
                    {activeBag.storeName}
                  </Text>
                  <Text style={styles.mapPreviewBag} numberOfLines={1}>
                    {activeBag.bagTitle}
                  </Text>
                  <Text style={styles.mapPreviewWindow} numberOfLines={1}>
                    {activeBag.pickupWindow} • {activeBag.distance}
                  </Text>
                  <View style={styles.mapPreviewBottom}>
                    <Text style={styles.mapPreviewPrice}>
                      R$ {activeBag.price.toFixed(2).replace('.', ',')}
                    </Text>
                    <View style={styles.mapPreviewCta}>
                      <Text style={styles.mapPreviewCtaText}>Ver detalhes</Text>
                      <Feather name="chevron-right" size={14} color="#059669" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })()}
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
            <BagCard
              bag={item}
              onPress={() => handleOpenBag(item)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  viewToggleBtnActive: {
    backgroundColor: '#059669',
  },
  viewToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  viewToggleTextActive: {
    color: '#ffffff',
  },
  mapContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#e2f1ec',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 14,
  },
  radarOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.22)',
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
  },
  radarInner: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.35)',
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
  },
  userDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  mapPin: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#059669',
    elevation: 3,
  },
  mapPinActive: {
    backgroundColor: '#059669',
    transform: [{ scale: 1.08 }],
  },
  mapPinText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  mapPinTextActive: {
    color: '#ffffff',
  },
  mapPreviewCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    elevation: 3,
  },
  mapPreviewImg: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  mapPreviewInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mapPreviewStore: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  mapPreviewBag: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  mapPreviewWindow: {
    fontSize: 12,
    color: '#64748b',
  },
  mapPreviewBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  mapPreviewPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  mapPreviewCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapPreviewCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  mapEmptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
