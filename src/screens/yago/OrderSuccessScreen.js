import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function OrderSuccessScreen({ bag, onGoToOrders, onGoHome }) {
  const orderNumber = '#SF-' + Math.floor(1000 + Math.random() * 9000);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ícone de Sucesso */}
        <View style={styles.iconCircle}>
          <View style={styles.iconInner}>
            <Feather name="check" size={42} color="#ffffff" />
          </View>
        </View>

        <Text style={styles.title}>Reserva Confirmada!</Text>
        <Text style={styles.subtitle}>
          Parabéns! Você salvou mais uma refeição deliciosa e ajudou a combater o desperdício de comida.
        </Text>

        {/* Card com Detalhes do Pedido */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumberLabel}>Código do Resgate</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.orderCode}>{orderNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Feather name="shopping-bag" size={16} color="#006654" />
            <Text style={styles.infoStore} numberOfLines={1}>{bag?.storeName || 'Loja Parceira'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="clock" size={16} color="#006654" />
            <Text style={styles.infoText}>{bag?.pickupWindow || 'Hoje das 18h30 às 20h00'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color="#006654" />
            <Text style={styles.infoText} numberOfLines={1}>{bag?.address || 'São Paulo, SP'}</Text>
          </View>

          {/* Badge de Impacto */}
          <View style={styles.ecoBadge}>
            <Feather name="globe" size={15} color="#006654" />
            <Text style={styles.ecoBadgeText}>+1 Refeição salva • -2.5 kg de CO₂e evitados</Text>
          </View>
        </View>

        {/* Dica de Retirada */}
        <View style={styles.tipBox}>
          <Feather name="info" size={16} color="#004d3f" />
          <Text style={styles.tipText}>
            Ao chegar no estabelecimento dentro da janela de horário, apresente este código no balcão para retirar sua sacola.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Botões de Ação */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onGoToOrders}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Acompanhar Pedido e Voucher</Text>
          <Feather name="arrow-right" size={18} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onGoHome}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Voltar para o Início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ebf5f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  iconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#006654',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    marginTop: 24,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  codeBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  orderCode: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoStore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5f2',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 6,
  },
  ecoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#ebf5f2',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    gap: 10,
    width: '100%',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#004d3f',
    lineHeight: 18,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#006654',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 6,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
