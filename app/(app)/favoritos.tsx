import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/contexts/AppContext';
import BagCard from '../../src/components/BagCard';

export default function FavoritosScreen() {
  const router = useRouter();
  const { bags, favorites, toggleFavorite } = useApp();

  const favoriteBags = bags.filter((bag) => favorites.includes(bag.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minhas Favoritas</Text>
          <Text style={styles.subtitle}>
            {favoriteBags.length === 1
              ? '1 sacola salva para acompanhar'
              : `${favoriteBags.length} sacolas salvas para acompanhar`}
          </Text>
        </View>
        
      </View>

      <FlatList
        data={favoriteBags}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BagCard
            bag={item}
            isFavorite={true}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={44} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma sacola favoritada ainda</Text>
            <Text style={styles.emptyDescription}>
              Toque no coração das sacolas que você mais gosta no feed para
              acompanhar a disponibilidade e resgatar antes que acabem!
            </Text>
            
          </View>
        }
      />
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  badgeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 6,
  },
  badgeCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

