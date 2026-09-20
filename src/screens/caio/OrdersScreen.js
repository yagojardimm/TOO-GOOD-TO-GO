import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOCK_ORDERS } from '../../data/mockData';

export default function OrdersScreen({ orders = MOCK_ORDERS, onNavigateHome, onOpenVoucher }) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' ou 'history'
  const [timeLeft, setTimeLeft] = useState(4620); // Segundos para retirada

  // Contagem regressiva do pedido ativo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const pastOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter((o) => o.status === 'active');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe seus resgates e histórico sustentável
          </Text>
        </View>
        <View style={styles.headerIconBadge}>
          <Feather name="shopping-bag" size={20} color="#006654" />
        </View>
      </View>

      {/* Seletor de Abas (Em Andamento vs Histórico) */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'active' && styles.tabButtonTextActive,
            ]}
          >
            Em Andamento ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'history' && styles.tabButtonTextActive,
            ]}
          >
            Histórico ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ABA 1: PEDIDOS ATIVOS */}
        {activeTab === 'active' && (
          <View>
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <View key={order.id} style={styles.activeCard}>
                  {/* Banner de Status com Contagem Regressiva */}
                  <View style={styles.activeTopBanner}>
                    <View style={styles.statusLiveIndicator}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.statusLiveText}>Pronto para Retirada</Text>
                    </View>
                    <View style={styles.countdownBadge}>
                      <Feather name="clock" size={13} color="#b45309" />
                      <Text style={styles.countdownText}>{formatCountdown(timeLeft)}</Text>
                    </View>
                  </View>

                  {/* Foto e Informações Principais */}
                  <View style={styles.activeImageWrapper}>
                    <Image
                      source={{ uri: order.coverImage }}
                      style={styles.activeCoverImage}
                      resizeMode="cover"
                    />
                    <View style={styles.activeVoucherBadge}>
                      <Text style={styles.activeVoucherCodeText}>CÓDIGO: {order.voucherCode}</Text>
                    </View>
                  </View>

                  <View style={styles.activeCardContent}>
                    <View style={styles.storeHeaderRow}>
                      <Image source={{ uri: order.storeAvatar }} style={styles.activeAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.activeStoreName}>{order.storeName}</Text>
                        <Text style={styles.activeCategory}>{order.categoryLabel}</Text>
                      </View>
                    </View>

                    <Text style={styles.activeBagTitle}>{order.bagTitle}</Text>

                    {/* Dados de Retirada */}
                    <View style={styles.pickupDetailBox}>
                      <View style={styles.detailRow}>
                        <Feather name="clock" size={15} color="#006654" />
                        <View style={{ marginLeft: 8, flex: 1 }}>
                          <Text style={styles.detailLabel}>Janela de Retirada:</Text>
                          <Text style={styles.detailValueBold}>{order.pickupWindow}</Text>
                        </View>
                      </View>

                      <View style={[styles.detailRow, { marginTop: 10 }]}>
                        <Feather name="map-pin" size={15} color="#006654" />
                        <View style={{ marginLeft: 8, flex: 1 }}>
                          <Text style={styles.detailLabel}>Local para retirada:</Text>
                          <Text style={styles.detailValue}>{order.address}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Resumo de Pagamento e Economia */}
                    <View style={styles.priceRow}>
                      <View>
                        <Text style={styles.priceLabel}>Valor Pago</Text>
                        <Text style={styles.priceValue}>
                          R$ {order.price.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                      <View style={styles.savingsTag}>
                        <Feather name="tag" size={12} color="#006654" />
                        <Text style={styles.savingsTagText}>
                          Você economizou R$ {order.savedAmount.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                    </View>

                    {/* Botão de Abrir Voucher */}
                    <TouchableOpacity
                      style={styles.viewVoucherButton}
                      onPress={() => onOpenVoucher && onOpenVoucher(order)}
                      activeOpacity={0.85}
                    >
                      <Feather name="shield" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.viewVoucherButtonText}>Ver Voucher de Retirada</Text>
                      <Feather name="arrow-right" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Feather name="inbox" size={36} color="#94a3b8" />
                </View>
                <Text style={styles.emptyTitle}>Nenhum pedido ativo no momento</Text>
                <Text style={styles.emptySubtitle}>
                  Explore as padarias e restaurantes ao seu redor e resgate sacolas com até 70% de desconto!
                </Text>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={onNavigateHome}
                  activeOpacity={0.85}
                >
                  <Text style={styles.exploreButtonText}>Explorar Sacolas do Dia</Text>
                  <Feather name="arrow-right" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ABA 2: HISTÓRICO DE PEDIDOS */}
        {activeTab === 'history' && (
          <View style={styles.historySection}>
            <View style={styles.sectionHeader}>
              <Feather name="clock" size={16} color="#006654" />
              <Text style={styles.sectionTitle}>Resgates Concluídos</Text>
            </View>

            {pastOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                {/* Cabeçalho do Card */}
                <View style={styles.cardHeader}>
                  <Image source={{ uri: order.storeAvatar }} style={styles.storeAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storeName}>{order.storeName}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.statusBadgeCompleted}>
                    <Feather name="check" size={12} color="#006654" />
                    <Text style={styles.statusTextCompleted}>Resgatado</Text>
                  </View>
                </View>

                {/* Corpo do Pedido */}
                <View style={styles.cardBody}>
                  <Text style={styles.bagTitle}>{order.bagTitle}</Text>
                  <Text style={styles.storeAddress} numberOfLines={1}>
                    {order.address}
                  </Text>
                </View>

                {/* Faixa de Economia e CO2 */}
                <View style={styles.ecoHighlight}>
                  <View style={styles.ecoItem}>
                    <Feather name="globe" size={13} color="#006654" />
                    <Text style={styles.ecoText}>
                      +{order.quantity || 1} Refeição salva (-{order.co2SavedKg || 2.5}kg CO₂)
                    </Text>
                  </View>
                  <View style={styles.ecoItem}>
                    <Feather name="trending-down" size={13} color="#006654" />
                    <Text style={styles.ecoText}>
                      Economizou R$ {(order.savedAmount || 0).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                </View>

                {/* Rodapé com Preço e Ação */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Valor Pago</Text>
                    <Text style={styles.priceValue}>
                      R$ {order.price.toFixed(2).replace('.', ',')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={onNavigateHome}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reorderText}>Pedir Novamente</Text>
                    <Feather name="chevron-right" size={14} color="#006654" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  headerIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e6f4f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#006654',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // CARD DE PEDIDO ATIVO
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#006654',
    elevation: 4,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    marginBottom: 20,
  },
  activeTopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusLiveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006654',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
    marginLeft: 4,
  },
  activeImageWrapper: {
    height: 140,
    position: 'relative',
  },
  activeCoverImage: {
    width: '100%',
    height: '100%',
  },
  activeVoucherBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeVoucherCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34d399',
    letterSpacing: 0.5,
  },
  activeCardContent: {
    padding: 16,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  activeStoreName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  activeCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  activeBagTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  pickupDetailBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  detailValueBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006654',
    marginTop: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  savingsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  savingsTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 4,
  },
  viewVoucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006654',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  viewVoucherButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },

  // SEÇÃO DE HISTÓRICO
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 8,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusTextCompleted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 4,
  },
  cardBody: {
    marginBottom: 12,
  },
  bagTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  storeAddress: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  ecoHighlight: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  ecoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  ecoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#006654',
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  reorderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006654',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
