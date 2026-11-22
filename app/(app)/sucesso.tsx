import React from 'react';
import {
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

export default function SucessoRoute() {
  const { orderId, voucherCode } = useLocalSearchParams<{
    orderId?: string;
    voucherCode?: string;
  }>();
  const router = useRouter();
  const { orders } = useApp();

  const order =
    orders.find((item) => item.id === String(orderId)) || orders[0] || null;

  const displayCode = voucherCode || order?.voucherCode || 'SF-0000';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBox}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={34} color="#ffffff" />
          </View>
          <Text style={styles.title}>Reserva confirmada!</Text>
          <Text style={styles.subtitle}>
            Sua sacola surpresa foi garantida e já está salva no seu aplicativo.
          </Text>
        </View>

        <View style={styles.voucherCard}>
          <Text style={styles.voucherLabel}>CÓDIGO DE RETIRADA</Text>
          <Text style={styles.voucherCode}>#{displayCode}</Text>
          <Text style={styles.voucherHint}>
            Apresente este código no balcão do estabelecimento dentro do horário informado.
          </Text>
        </View>

        {order ? (
          <View style={styles.receiptCard}>
            <Text style={styles.sectionTitle}>Resumo do recibo</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Estabelecimento</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {order.storeName}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Sacola</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {order.bagTitle}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Quantidade</Text>
              <Text style={styles.rowValue}>{order.quantity}x</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Retirada</Text>
              <Text style={styles.rowValueHighlight}>{order.pickupWindow}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Endereço</Text>
              <Text style={styles.rowValue}>{order.address}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Total pago</Text>
              <Text style={styles.totalPaid}>
                R$ {order.price.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Você economizou</Text>
              <Text style={styles.savedText}>
                R$ {order.savedAmount.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <View style={styles.ecoPill}>
              <Feather name="globe" size={15} color="#047857" />
              <Text style={styles.ecoText}>
                Aproximadamente {String(order.co2SavedKg).replace('.', ',')} kg de CO₂e evitados
              </Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/(app)')}
        >
          <Text style={styles.primaryBtnText}>Voltar para explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(app)/pedidos')}
        >
          <Text style={styles.secondaryBtnText}>Ver meus pedidos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  heroBox: {
    alignItems: 'center',
    marginBottom: 22,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 300,
  },
  voucherCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
    borderStyle: 'dashed',
    marginBottom: 18,
  },
  voucherLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#047857',
  },
  voucherCode: {
    fontSize: 30,
    fontWeight: '900',
    color: '#065f46',
    marginVertical: 6,
  },
  voucherHint: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 18,
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowValueHighlight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  totalPaid: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  savedText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  ecoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  ecoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
});
