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
        
        {/* Badge de Desconto */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{bag.discountPercentage}%</Text>
        </View>

        {/* Quantidade Restante */}
        <View style={styles.remainingBadge}>
          <Feather name="zap" size={12} color="#ffffff" style={styles.zapIcon} />
          <Text style={styles.remainingText}>Resta {bag.remainingItems}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Linha da Loja e Nota */}
        <View style={styles.headerRow}>
          <Image source={{ uri: bag.storeAvatar }} style={styles.avatar} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName} numberOfLines={1}>{bag.storeName}</Text>
            <Text style={styles.categoryDistance}>
              {bag.categoryLabel} • {bag.distance}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Feather name="star" size={12} color="#f59e0b" />
            <Text style={styles.ratingText}>{bag.rating}</Text>
          </View>
        </View>

        {/* Título da Sacola */}
        <Text style={styles.bagTitle} numberOfLines={1}>{bag.bagTitle}</Text>

        {/* Horário de Retirada */}
        <View style={styles.pickupRow}>
          <Feather name="clock" size={13} color="#059669" />
          <Text style={styles.pickupText}>{bag.pickupWindow}</Text>
        </View>

        {/* Linha de Preço */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>R$ {bag.originalPrice.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.price}>R$ {bag.price.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver Sacola</Text>
            <Feather name="chevron-right" size={15} color="#059669" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  imageContainer: {
    height: 150,
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
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  remainingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
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
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b45309',
    marginLeft: 3,
  },
  bagTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickupText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginRight: 2,
  },
});
