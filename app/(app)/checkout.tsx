import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../src/contexts/AppContext';

export default function CheckoutRoute() {
  const { bagId } = useLocalSearchParams<{ bagId: string }>();
  const router = useRouter();
  const { bags, addresses, createOrder } = useApp();

  const bag = bags.find((item) => item.id === String(bagId));
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bag) {
    return (
      <SafeAreaView style={styles.emptyScreen}>
        <Feather name="shopping-bag" size={38} color="#94a3b8" />
        <Text style={styles.emptyTitle}>Nenhuma sacola selecionada</Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(app)')}
        >
          <Text style={styles.backHomeText}>Voltar para explorar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const maxQty = Math.max(1, bag.remainingItems);
  const totalOriginal = bag.originalPrice * quantity;
  const totalFinal = bag.price * quantity;
  const totalSaved = Math.max(0, totalOriginal - totalFinal);
  const co2Saved = (2.5 * quantity).toFixed(1).replace('.', ',');

  function handleDecrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncrease() {
    setQuantity((prev) => Math.min(maxQty, prev + 1));
  }

  function handleConfirm() {
    if (!bag || isProcessing) return;

    setIsProcessing(true);
    const paymentLabel =
      paymentMethod === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito';

    const createdOrder = createOrder(bag, quantity, paymentLabel);

    setTimeout(() => {
      setIsProcessing(false);
      router.replace({
        pathname: '/(app)/sucesso',
        params: {
          orderId: createdOrder.id,
          voucherCode: createdOrder.voucherCode,
        },
      });
    }, 350);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisar reserva</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.bagRow}>
            <Image source={{ uri: bag.coverImage }} style={styles.bagImg} />
            <View style={styles.bagInfo}>
              <Text style={styles.storeName} numberOfLines={1}>
                {bag.storeName}
              </Text>
              <Text style={styles.bagTitle} numberOfLines={2}>
                {bag.bagTitle}
              </Text>
              <View style={styles.windowRow}>
                <Feather name="clock" size={13} color="#059669" />
                <Text style={styles.windowText}>{bag.pickupWindow}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.qtyRow}>
            <View>
              <Text style={styles.qtyLabel}>Quantidade de sacolas</Text>
              <Text style={styles.qtyHint}>Disponível hoje: {maxQty}</Text>
            </View>

            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={handleDecrease}
                disabled={quantity <= 1}
              >
                <Feather name="minus" size={16} color="#0f172a" />
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{quantity}</Text>

              <TouchableOpacity
                style={[styles.qtyBtn, quantity >= maxQty && styles.qtyBtnDisabled]}
                onPress={handleIncrease}
                disabled={quantity >= maxQty}
              >
                <Feather name="plus" size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.impactBanner}>
          <View style={styles.impactIcon}>
            <Feather name="globe" size={18} color="#047857" />
          </View>
          <View style={styles.impactTextCol}>
            <Text style={styles.impactTitle}>Impacto positivo desta reserva</Text>
            <Text style={styles.impactSubtitle}>
              Você ajuda a evitar cerca de {co2Saved} kg de CO₂e na atmosfera.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Local de retirada</Text>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={16} color="#059669" />
            <Text style={styles.addressText}>{bag.address}</Text>
          </View>
          {defaultAddress ? (
            <Text style={styles.userAddressNote}>
              Seu endereço principal salvo: {defaultAddress.logradouro}, {defaultAddress.numero} - {defaultAddress.bairro}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Forma de pagamento</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'pix' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('pix')}
          >
            <View style={styles.paymentLeft}>
              <Feather
                name="zap"
                size={18}
                color={paymentMethod === 'pix' ? '#059669' : '#64748b'}
              />
              <View>
                <Text style={styles.paymentName}>Pix Instantâneo</Text>
                <Text style={styles.paymentDesc}>Aprovação imediata no app</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                paymentMethod === 'pix' && styles.radioOuterActive,
              ]}
            >
              {paymentMethod === 'pix' ? <View style={styles.radioInner} /> : null}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentLeft}>
              <Feather
                name="credit-card"
                size={18}
                color={paymentMethod === 'card' ? '#059669' : '#64748b'}
              />
              <View>
                <Text style={styles.paymentName}>Cartão de Crédito</Text>
                <Text style={styles.paymentDesc}>Final •••• 4242</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                paymentMethod === 'card' && styles.radioOuterActive,
              ]}
            >
              {paymentMethod === 'card' ? <View style={styles.radioInner} /> : null}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumo de valores</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor original ({quantity}x)</Text>
            <Text style={styles.summaryValue}>
              R$ {totalOriginal.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Desconto SaveFood</Text>
            <Text style={styles.summarySaved}>
              - R$ {totalSaved.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>
              R$ {totalFinal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, isProcessing && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.confirmBtnText}>
              Confirmar reserva • R$ {totalFinal.toFixed(2).replace('.', ',')}
            </Text>
          )}
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
  emptyScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 16,
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bagRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bagImg: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  bagInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  bagTitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  windowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  windowText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  qtyHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    minWidth: 20,
    textAlign: 'center',
  },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  impactIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactTextCol: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46',
  },
  impactSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  userAddressNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    gap: 12,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#059669',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  summarySaved: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  bottomBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  confirmBtn: {
    backgroundColor: '#059669',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
