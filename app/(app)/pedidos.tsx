import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp, OrderItem } from '../../src/contexts/AppContext';

export default function PedidosScreen() {
  const router = useRouter();
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter((o) => o.status === 'active');
  const pastOrders = orders.filter((o) => o.status === 'completed');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Pedidos</Text>
          <Text style={styles.subtitle}>
            Acompanhe suas reservas e resgates no balcão
          </Text>
        </View>
        <View style={styles.headerIconCircle}>
          <Feather name="shopping-bag" size={20} color="#059669" />
        </View>
      </View>



      <FlatList
        data={displayedOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            {/* Topo do Card */}
            <View style={styles.cardHeader}>
              <Image source={{ uri: item.storeAvatar }} style={styles.storeAvatar} />
              <View style={styles.headerTexts}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {item.storeName}
                </Text>
                <Text style={styles.orderCategory}>{item.categoryLabel}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'active'
                    ? styles.statusActive
                    : styles.statusCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.status === 'active'
                      ? styles.statusActiveText
                      : styles.statusCompletedText,
                  ]}
                >
                  {item.status === 'active' ? 'Disponível' : 'Retirado'}
                </Text>
              </View>
            </View>

            {/* Informações da Sacola */}
            <View style={styles.bagInfoSection}>
              <Text style={styles.bagTitle}>{item.bagTitle}</Text>
              <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>Código:</Text>
                <Text style={styles.codeValue}>#{item.voucherCode}</Text>
              </View>
            </View>

            {/* Janela de Retirada */}
            <View style={styles.pickupRow}>
              <Feather name="clock" size={14} color="#059669" />
              <Text style={styles.pickupText}>
                {item.status === 'active'
                  ? `Retirada: ${item.pickupWindow}`
                  : `Concluído: ${item.date || 'Hoje'}`}
              </Text>
            </View>

            {/* Linha Financeira e Botão */}
            <View style={styles.cardFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.paidPrice}>
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.savedPrice}>
                  Economia de R$ {item.savedAmount.toFixed(2).replace('.', ',')}
                </Text>
              </View>

              <View style={styles.redeemedTag}>
                <Text style={styles.redeemedTagText}>Reserva confirmada</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather
                name={activeTab === 'active' ? 'clock' : 'check-circle'}
                size={40}
                color="#94a3b8"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'Nenhum pedido ativo no momento'
                : 'Seu histórico ainda está vazio'}
            </Text>
            <Text style={styles.emptyDescription}>
              {activeTab === 'active'
                ? 'Quando você reservar uma Sacola Surpresa, ela aparecerá aqui para você retirar no local.'
                : 'As sacolas que você já resgatou aparecerão aqui como prova do seu impacto ecológico!'}
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(app)')}
              activeOpacity={0.85}
            >
              <Feather name="compass" size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.exploreButtonText}>Explorar sacolas</Text>
            </TouchableOpacity>
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
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  tabButtonActive: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e2e8f0',
  },
  headerTexts: {
    flex: 1,
    marginLeft: 12,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderCategory: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusCompleted: {
    backgroundColor: '#f1f5f9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusActiveText: {
    color: '#059669',
  },
  statusCompletedText: {
    color: '#64748b',
  },
  bagInfoSection: {
    marginVertical: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  bagTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  codeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  pickupText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {},
  paidPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  savedPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  voucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  voucherButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  redeemedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
  },
  redeemedTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

