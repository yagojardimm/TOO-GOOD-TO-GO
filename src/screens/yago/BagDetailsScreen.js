import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BagDetailsScreen({ bag, onBack, onProceedToCheckout }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!bag) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Imagem de Capa e Botões Flutuantes */}
        <View style={styles.imageHeader}>
          <Image source={{ uri: bag.coverImage }} style={styles.coverImage} resizeMode="cover" />
          
          {/* Barra Superior Flutuante */}
          <View style={styles.floatingNav}>
            <TouchableOpacity style={styles.iconCircle} onPress={onBack} activeOpacity={0.8}>
              <Feather name="arrow-left" size={20} color="#0f172a" />
            </TouchableOpacity>
            <View style={styles.floatingRightIcons}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => setIsFavorite(!isFavorite)}
                activeOpacity={0.8}
              >
                <Feather
                  name="heart"
                  size={20}
                  color={isFavorite ? '#b91c1c' : '#0f172a'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badges Flutuantes na Imagem */}
          <View style={styles.badgeRow}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{bag.discountPercentage}% OFF</Text>
            </View>
            <View style={styles.remainingBadge}>
              <Feather name="clock" size={12} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.remainingText}>Resta {bag.remainingItems} hoje</Text>
            </View>
          </View>
        </View>

        {/* Corpo dos Detalhes */}
        <View style={styles.contentBody}>
          {/* Estabelecimento */}
          <View style={styles.storeRow}>
            <Image source={{ uri: bag.storeAvatar }} style={styles.avatar} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{bag.storeName}</Text>
              <Text style={styles.storeCategory}>{bag.categoryLabel}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={14} color="#b45309" />
              <Text style={styles.ratingText}>{bag.rating}</Text>
              <Text style={styles.reviewsText}>({bag.reviewsCount})</Text>
            </View>
          </View>

          {/* Título da Sacola */}
          <Text style={styles.bagTitle}>{bag.bagTitle}</Text>

          {/* Card de Horário de Retirada */}
          <View style={styles.pickupCard}>
            <View style={styles.pickupIconBox}>
              <Feather name="clock" size={20} color="#006654" />
            </View>
            <View style={styles.pickupTextBox}>
              <Text style={styles.pickupLabel}>Janela de Retirada Hoje</Text>
              <Text style={styles.pickupValue}>{bag.pickupWindow}</Text>
            </View>
          </View>

          {/* Seção: O que pode vir na sacola? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="gift" size={18} color="#006654" />
              <Text style={styles.sectionTitle}>O que pode vir na sacola?</Text>
            </View>
            <Text style={styles.descriptionText}>{bag.bagDescription}</Text>
            <View style={styles.surpriseTip}>
              <Feather name="info" size={15} color="#006654" />
              <Text style={styles.surpriseTipText}>
                O conteúdo exato depende do excedente fresco do dia. É uma surpresa deliciosa e sustentável!
              </Text>
            </View>
          </View>

          {/* Seção: Localização */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={18} color="#006654" />
              <Text style={styles.sectionTitle}>Onde retirar</Text>
            </View>
            <Text style={styles.addressText}>{bag.address}</Text>
            <Text style={styles.distanceBadge}>A aproximadamente {bag.distance} de você</Text>
          </View>

          {/* Seção: Regras de Retirada */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="check-circle" size={18} color="#006654" />
              <Text style={styles.sectionTitle}>Como funciona o resgate</Text>
            </View>
            {bag.pickupRules &&
              bag.pickupRules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleDot} />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {/* Barra Inferior Fixa de Compra */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Valor a pagar</Text>
          <View style={styles.priceNumbers}>
            <Text style={styles.originalPrice}>De R$ {bag.originalPrice.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.finalPrice}>R$ {bag.price.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => onProceedToCheckout && onProceedToCheckout()}
          activeOpacity={0.85}
        >
          <Text style={styles.reserveButtonText}>Reservar Sacola</Text>
          <Feather name="arrow-right" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageHeader: {
    height: 260,
    width: '100%',
    position: 'relative',
    backgroundColor: '#cbd5e1',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  floatingNav: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingRightIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discountBadge: {
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
  remainingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  remainingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  contentBody: {
    padding: 20,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  storeCategory: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400e',
    marginLeft: 3,
  },
  reviewsText: {
    fontSize: 11,
    color: '#92400e',
    marginLeft: 3,
  },
  bagTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 16,
  },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5f2',
    borderWidth: 1,
    borderColor: '#ccebe4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  pickupIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#d8f0ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pickupTextBox: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: 12,
    color: '#004d3f',
    fontWeight: '600',
  },
  pickupValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#006654',
    marginTop: 2,
  },
  section: {
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  surpriseTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ebf5f2',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  surpriseTipText: {
    flex: 1,
    fontSize: 12,
    color: '#004d3f',
    lineHeight: 18,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  distanceBadge: {
    fontSize: 12,
    color: '#006654',
    fontWeight: '700',
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  ruleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#006654',
    marginTop: 7,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  priceNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  originalPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#006654',
  },
  reserveButton: {
    backgroundColor: '#006654',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 3,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
