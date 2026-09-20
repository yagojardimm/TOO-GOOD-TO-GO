import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CheckoutScreen({ bag, onBack, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' ou 'card'

  if (!bag) return null;

  const originalTotal = bag.originalPrice * quantity;
  const finalTotal = bag.price * quantity;
  const savedAmount = originalTotal - finalTotal;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisão do Pedido</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Card da Sacola Selecionada */}
        <View style={styles.card}>
          <View style={styles.storeHeader}>
            <Image source={{ uri: bag.storeAvatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{bag.storeName}</Text>
              <Text style={styles.bagTitle}>{bag.bagTitle}</Text>
            </View>
          </View>

          {/* Seletor de Quantidade */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantidade de Sacolas:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Feather name="minus" size={16} color={quantity <= 1 ? '#cbd5e1' : '#0f172a'} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity >= bag.remainingItems && styles.qtyBtnDisabled]}
                onPress={() => quantity < bag.remainingItems && setQuantity(quantity + 1)}
                disabled={quantity >= bag.remainingItems}
              >
                <Feather name="plus" size={16} color={quantity >= bag.remainingItems ? '#cbd5e1' : '#0f172a'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card de Horário e Local de Retirada */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados de Retirada</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="clock" size={17} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Horário para resgate</Text>
              <Text style={styles.infoValue}>{bag.pickupWindow}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <View style={styles.infoIconBox}>
              <Feather name="map-pin" size={17} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Endereço da loja</Text>
              <Text style={styles.infoValue}>{bag.address}</Text>
            </View>
          </View>
        </View>

        {/* Card de Impacto Sustentável */}
        <View style={styles.impactCard}>
          <View style={styles.impactIconCircle}>
            <Feather name="globe" size={22} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactTitle}>Impacto Positivo</Text>
            <Text style={styles.impactDesc}>
              Com este resgate, você evita o desperdício de {quantity} refeição e poupa aproximadamente {(2.5 * quantity).toFixed(1)} kg de CO₂e no planeta!
            </Text>
          </View>
        </View>

        {/* Forma de Pagamento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Forma de Pagamento</Text>
          
          {/* Opção PIX */}
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('pix')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.radioCircle, paymentMethod === 'pix' && styles.radioCircleActive]}>
                {paymentMethod === 'pix' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentIconBox}>
                <Feather name="zap" size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.paymentName}>Pix Instantâneo</Text>
                <Text style={styles.paymentSub}>Aprovação imediata e reserva garantida</Text>
              </View>
            </View>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Rápido</Text>
            </View>
          </TouchableOpacity>

          {/* Opção Cartão de Crédito */}
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioCircleActive]}>
                {paymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentIconBox}>
                <Feather name="credit-card" size={18} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.paymentName}>Cartão de Crédito</Text>
                <Text style={styles.paymentSub}>•••• 4892 (Mastercard)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Resumo Financeiro */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo dos Valores</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor original ({quantity}x)</Text>
            <Text style={styles.summaryValueStriked}>R$ {originalTotal.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Desconto SaveFood ({bag.discountPercentage}%)</Text>
            <Text style={styles.summaryDiscount}>- R$ {savedAmount.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de preservação</Text>
            <Text style={styles.summaryFree}>Grátis</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a Pagar</Text>
            <Text style={styles.totalValue}>R$ {finalTotal.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Barra de Ação Inferior */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total ({quantity} item)</Text>
          <Text style={styles.bottomTotalValue}>R$ {finalTotal.toFixed(2).replace('.', ',')}</Text>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onSuccess && onSuccess()}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Confirmar e Reservar</Text>
          <Feather name="check" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: '#f1f5f9',
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  bagTitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 2,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    backgroundColor: 'transparent',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  impactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065f46',
  },
  impactDesc: {
    fontSize: 12,
    color: '#047857',
    marginTop: 3,
    lineHeight: 17,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleActive: {
    borderColor: '#059669',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  paymentIconBox: {
    marginRight: 10,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  recommendedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryValueStriked: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  summaryDiscount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  summaryFree: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
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
  bottomTotalLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  confirmButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 3,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
