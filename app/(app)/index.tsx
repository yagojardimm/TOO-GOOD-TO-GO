import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BagCard from '../../src/components/BagCard';
import { useApp, BagItem } from '../../src/contexts/AppContext';
import { useAuth } from '../../src/contexts/AuthContext';

export const ITEMS: Array<{ id: string; nome: string; preco: string; descricao: string }> = [];

export default function ExploreRoute() {
  const router = useRouter();
  const { user } = useAuth();
  const { bags, addresses, isLoadingData } = useApp();

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const locationText = defaultAddress
    ? `${defaultAddress.bairro}, ${defaultAddress.cidade}`
    : 'São Paulo, SP';

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
      </View>

      {isLoadingData ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Carregando sacolas disponíveis...</Text>
        </View>
      ) : (
        <FlatList
          data={bags}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sacolas surpresa hoje</Text>
              <Text style={styles.sectionCount}>{bags.length} opções</Text>
            </View>
          }
          renderItem={({ item }) => (
            <BagCard bag={item} onPress={() => handleOpenBag(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Feather name="shopping-bag" size={36} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Nenhuma sacola disponível</Text>
              <Text style={styles.emptySubtitle}>
                Volte mais tarde para conferir novas ofertas na sua região.
              </Text>
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
