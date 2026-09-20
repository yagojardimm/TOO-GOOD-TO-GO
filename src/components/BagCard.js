import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function BagCard({ bag, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(bag)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: bag.coverImage }} style={styles.coverImage} resizeMode="cover" />
        
        {/* Badge de Desconto Oficial */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{bag.discountPercentage}%</Text>
        </View>

        {/* Quantidade Restante */}
        <View style={styles.remainingBadge}>
          <Feather name="zap" size={12} color="#ffffff" style={styles.zapIcon} />
          <Text style={styles.remainingText}>Apenas {bag.remainingItems} restantes</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Linha da Loja e Nota */}
        <View style={styles.headerRow}>
          <Image source={{ uri: bag.storeAvatar }} style={styles.avatar} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName} numberOfLines={1}>{bag.storeName}</Text>
            <Text style={styles.categoryDistance}>
              {bag.categoryLabel} • a {bag.distance}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Feather name="star" size={12} color="#b45309" />
            <Text style={styles.ratingText}>{bag.rating}</Text>
          </View>
        </View>

        {/* Título da Sacola Surpresa */}
        <Text style={styles.bagTitle} numberOfLines={1}>{bag.bagTitle}</Text>

        {/* Janela de Retirada Oficial Too Good To Go */}
        <View style={styles.pickupBox}>
          <Feather name="clock" size={13} color="#006654" />
          <Text style={styles.pickupText}>Retirada: {bag.pickupWindow}</Text>
        </View>

        {/* Linha de Preço */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>De R$ {bag.originalPrice.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.price}>Por R$ {bag.price.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Reservar</Text>
            <Feather name="chevron-right" size={15} color="#006654" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
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
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zapIcon: {
    marginRight: 4,
  },
  remainingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  categoryDistance: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
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
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
    marginLeft: 3,
  },
  bagTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  pickupBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 14,
    gap: 6,
  },
  pickupText: {
    fontSize: 12,
    color: '#006654',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#006654',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006654',
    marginRight: 2,
  },
});
