import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/contexts/AppContext';

export default function BagDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { bags, isFavorite, toggleFavorite } = useApp();

  const bag = bags.find((item) => item.id === String(id));

  if (!bag) {
    return (
      <SafeAreaView style={styles.notFoundScreen}>
        <Feather name="alert-circle" size={40} color="#94a3b8" />
        <Text style={styles.notFoundTitle}>Sacola não encontrada</Text>
        <Text style={styles.notFoundSubtitle}>
          Essa oferta pode ter sido encerrada ou removida.
        </Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(app)')}
        >
          <Text style={styles.backHomeText}>Voltar para explorar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const favorited = isFavorite(bag.id);
  const soldOut = bag.remainingItems <= 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: bag.coverImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="#0f172a" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => toggleFavorite(bag.id)}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={21}
                color={favorited ? '#ef4444' : '#0f172a'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.heroBadges}>
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>-{bag.discountPercentage}% OFF</Text>
            </View>
            <View style={styles.stockPill}>
              <Feather name="zap" size={12} color="#ffffff" />
              <Text style={styles.stockText}>
                {soldOut
                  ? 'Esgotada hoje'
                  : `${bag.remainingItems} ${bag.remainingItems === 1 ? 'restante' : 'restantes'}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.storeRow}>
            <Image source={{ uri: bag.storeAvatar }} style={styles.avatar} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{bag.storeName}</Text>
              <Text style={styles.storeMeta}>
                {bag.categoryLabel} • {bag.distance}
              </Text>
            </View>
            <View style={styles.ratingBox}>
              <Feather name="star" size={14} color="#b45309" />
              <Text style={styles.ratingValue}>{bag.rating}</Text>
            </View>
          </View>

          <Text style={styles.bagTitle}>{bag.bagTitle}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="clock" size={18} color="#059669" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Janela de retirada</Text>
                <Text style={styles.infoValue}>{bag.pickupWindow}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="map-pin" size={18} color="#059669" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Endereço do estabelecimento</Text>
                <Text style={styles.infoValue}>{bag.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>O que pode vir na sacola?</Text>
            <Text style={styles.description}>{bag.bagDescription}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.oldPrice}>
            De R$ {bag.originalPrice.toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.finalPrice}>
            R$ {bag.price.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.reserveBtn, soldOut && styles.reserveBtnDisabled]}
          disabled={soldOut}
          onPress={() =>
            router.push({
              pathname: '/(app)/checkout',
              params: { bagId: bag.id },
            })
          }
        >
          <Text style={styles.reserveBtnText}>
            {soldOut ? 'Indisponível' : 'Reservar Sacola'}
          </Text>
          {!soldOut && <Feather name="arrow-right" size={17} color="#ffffff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  notFoundScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#f8fafc',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  backHomeBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backHomeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  heroContainer: {
    height: 240,
    position: 'relative',
    backgroundColor: '#cbd5e1',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heroBadges: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  discountPill: {
    backgroundColor: '#b91c1c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stockText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 18,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  storeMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400e',
  },
  bagTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  oldPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  reserveBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  reserveBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
