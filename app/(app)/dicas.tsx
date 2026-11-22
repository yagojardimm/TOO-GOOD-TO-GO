import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { fetchRecipes, Recipe } from '../../src/services/recipesApi';

const QUICK_CHIPS = ['Todos', 'Chicken', 'Pasta', 'Salad', 'Soup', 'Cookies'];

export default function DicasScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedChip, setSelectedChip] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetchRecipes(query);
      setRecipes(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao carregar receitas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectChip = (chip: string) => {
    setSelectedChip(chip);
    setSearchText('');
    if (chip === 'Todos') {
      loadData('');
    } else {
      loadData(chip);
    }
  };

  const handleSearchSubmit = () => {
    setSelectedChip('');
    loadData(searchText);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedChip === 'Todos' ? '' : selectedChip || searchText);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dicas & Receitas</Text>
          <Text style={styles.headerSubtitle}>
            Aproveitamento integral e receitas antidesperdício
          </Text>
        </View>
        <View style={styles.headerIconCircle}>
          <Feather name="book-open" size={20} color="#059669" />
        </View>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar receita ou ingrediente..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchText ? (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                handleSelectChip('Todos');
              }}
            >
              <Feather name="x-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Chips Rápidos */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {QUICK_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                selectedChip === chip && styles.chipActive,
              ]}
              onPress={() => handleSelectChip(chip)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedChip === chip && styles.chipTextActive,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Receitas ou Estados */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Carregando receitas sustentáveis...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.centerContainer}>
          <Feather name="alert-triangle" size={44} color="#f59e0b" />
          <Text style={styles.errorTitle}>Não foi possível carregar</Text>
          <Text style={styles.errorSubtitle}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => loadData(selectedChip === 'Todos' ? '' : selectedChip || searchText)}
          >
            <Feather name="rotate-cw" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.retryBtnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#059669']}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedRecipe(item)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardBody}>
                <View style={styles.cardTagsRow}>
                  <View style={styles.cuisineTag}>
                    <Text style={styles.cuisineTagText}>{item.cuisine}</Text>
                  </View>
                  <View style={styles.difficultyTag}>
                    <Text style={styles.difficultyTagText}>{item.difficulty}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Feather name="star" size={12} color="#b45309" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.cardMetaRow}>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={13} color="#64748b" />
                    <Text style={styles.metaText}>
                      Preparo: {item.prepTimeMinutes + item.cookTimeMinutes} min
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="list" size={13} color="#64748b" />
                    <Text style={styles.metaText}>
                      {item.ingredients.length} ingredientes
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={44} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Nenhuma receita encontrada</Text>
              <Text style={styles.emptySubtitle}>
                Tente pesquisar por outros termos como "Pasta", "Soup" ou "Salad".
              </Text>
            </View>
          }
        />
      )}

      {/* Modal de Detalhes da Receita */}
      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedRecipe(null)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle} numberOfLines={1}>
              {selectedRecipe?.name}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {selectedRecipe ? (
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={{ uri: selectedRecipe.image }}
                style={styles.modalImage}
                resizeMode="cover"
              />

              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>

                <View style={styles.modalMetaRow}>
                  <View style={styles.modalBadge}>
                    <Feather name="clock" size={14} color="#059669" />
                    <Text style={styles.modalBadgeText}>
                      {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} min
                    </Text>
                  </View>
                  <View style={styles.modalBadge}>
                    <Feather name="bar-chart-2" size={14} color="#059669" />
                    <Text style={styles.modalBadgeText}>{selectedRecipe.difficulty}</Text>
                  </View>
                  <View style={styles.modalBadge}>
                    <Feather name="globe" size={14} color="#059669" />
                    <Text style={styles.modalBadgeText}>{selectedRecipe.cuisine}</Text>
                  </View>
                </View>

                {/* Ingredientes */}
                <Text style={styles.modalSectionTitle}>
                  Ingredientes ({selectedRecipe.ingredients.length})
                </Text>
                <View style={styles.ingredientsBox}>
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                {/* Modo de Preparo */}
                <Text style={styles.modalSectionTitle}>Modo de Preparo</Text>
                <View style={styles.instructionsBox}>
                  {selectedRecipe.instructions.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  chipsContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e2e8f0',
  },
  cardBody: {
    padding: 14,
  },
  cardTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cuisineTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cuisineTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  difficultyTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 8,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalContent: {
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 28,
  },
  modalMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 14,
    marginBottom: 10,
  },
  ingredientsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    flex: 1,
  },
  instructionsBox: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});

