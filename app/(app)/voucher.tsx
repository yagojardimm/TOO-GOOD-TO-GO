import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/contexts/AppContext';

export default function VoucherScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { orders, redeemOrder } = useApp();

  const order =
    orders.find((o) => o.id === orderId) ||
    orders.find((o) => o.status === 'active') ||
    orders[0];

  const [isRedeemed, setIsRedeemed] = useState(order?.status === 'completed');

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Pedido não encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(app)/pedidos')}
          >
            <Text style={styles.backButtonText}>Voltar para pedidos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirmRedeem = () => {
    Alert.alert(
      'Confirmar Retirada',
      'Você confirma que está no balcão e acabou de retirar sua sacola?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: () => {
            const updated = redeemOrder(order.id);
            if (updated) {
              setIsRedeemed(true);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBackButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Digital</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isRedeemed ? (
          <View style={styles.successBanner}>
            <View style={styles.successIconCircle}>
              <Feather name="check" size={28} color="#ffffff" />
            </View>
            <Text style={styles.successTitle}>Retirada Concluída!</Text>
            <Text style={styles.successSubtitle}>
              Este voucher já foi validado no balcão. Obrigado por salvar mais um
              alimento contra o desperdício!
            </Text>
          </View>
        ) : null}

        {/* Cartão Principal do Voucher */}
        <View style={styles.voucherCard}>
          {/* Loja */}
          <View style={styles.storeRow}>
            <Image source={{ uri: order.storeAvatar }} style={styles.storeAvatar} />
            <View style={styles.storeDetails}>
              <Text style={styles.storeName} numberOfLines={1}>
                {order.storeName}
              </Text>
              <Text style={styles.storeAddress} numberOfLines={2}>
                {order.address}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Dados da Sacola */}
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle}>{order.bagTitle}</Text>
            <Text style={styles.itemQty}>Quantidade: {order.quantity}x</Text>
          </View>

          {/* Bloco QR Code Simulado */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={140} color="#065f46" />
            </View>
            <Text style={styles.qrHint}>Apresente o QR Code ao atendente</Text>
          </View>

          {/* Código em Destaque */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>CÓDIGO DE RETIRADA</Text>
            <Text style={styles.codeText}>#{order.voucherCode}</Text>
          </View>

          {/* Janela de Horário */}
          <View style={styles.pickupBox}>
            <Feather name="clock" size={16} color="#059669" />
            <View style={styles.pickupTexts}>
              <Text style={styles.pickupLabel}>Janela de Retirada</Text>
              <Text style={styles.pickupTime}>{order.pickupWindow}</Text>
            </View>
          </View>

          {/* Instruções */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesHeader}>Instruções importantes:</Text>
            <Text style={styles.ruleItem}>
              • Dirija-se ao caixa ou balcão de atendimento.
            </Text>
            <Text style={styles.ruleItem}>
              • Mostre a tela deste voucher com o código.
            </Text>
            <Text style={styles.ruleItem}>
              • Lembre-se de levar sua própria sacola retornável.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.returnButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 36,
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065f46',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 18,
  },
  voucherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
  },
  storeDetails: {
    flex: 1,
    marginLeft: 14,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  storeAddress: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  itemSection: {
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  itemQty: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrBox: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qrHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  codeContainer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    letterSpacing: 0.8,
  },
  codeText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#065f46',
    letterSpacing: 2,
    marginTop: 2,
  },
  pickupBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pickupTexts: {
    marginLeft: 10,
  },
  pickupLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  pickupTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  rulesContainer: {
    marginTop: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  rulesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  ruleItem: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  returnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 14,
  },
  returnButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

