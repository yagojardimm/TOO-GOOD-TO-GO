import React, { useState } from 'react';
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
import { MOCK_BAGS } from '../../data/mockData';

export default function PartnerScreen() {
  const [partnerTab, setPartnerTab] = useState('overview'); // 'overview', 'new_bag', 'validate'

  // Estabelecimento parceiro de exemplo
  const partnerStore = {
    name: 'Padaria Artesanal Bella Vista',
    category: 'Padaria & Confeitaria',
    address: 'Rua Augusta, 1420 - Consolação, São Paulo',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    isOpen: true,
  };

  const partnerBags = MOCK_BAGS.filter((b) => b.storeName === partnerStore.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho do Parceiro */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerPartnerTag}>PORTAL DO COMERCIANTE</Text>
          <Text style={styles.headerTitle}>Painel do Parceiro</Text>
        </View>
        <View style={styles.partnerStoreBadge}>
          <Feather name="shield" size={16} color="#006654" />
          <Text style={styles.partnerStoreBadgeText}>Verificado</Text>
        </View>
      </View>

      {/* Card do Estabelecimento Conectado */}
      <View style={styles.storeCard}>
        <Image source={{ uri: partnerStore.avatar }} style={styles.storeAvatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.storeStatusRow}>
            <View style={styles.openIndicatorDot} />
            <Text style={styles.openIndicatorText}>Aberto para Coletas</Text>
          </View>
          <Text style={styles.storeName}>{partnerStore.name}</Text>
          <Text style={styles.storeCategoryAddress}>
            {partnerStore.category} • {partnerStore.address}
          </Text>
        </View>
      </View>

      {/* Seletor de Abas Interno */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabBtn, partnerTab === 'overview' && styles.tabBtnActive]}
          onPress={() => setPartnerTab('overview')}
          activeOpacity={0.8}
        >
          <Feather
            name="bar-chart-2"
            size={16}
            color={partnerTab === 'overview' ? '#ffffff' : '#64748b'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabBtnText,
              partnerTab === 'overview' && styles.tabBtnTextActive,
            ]}
          >
            Visão Geral
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, partnerTab === 'new_bag' && styles.tabBtnActive]}
          onPress={() => setPartnerTab('new_bag')}
          activeOpacity={0.8}
        >
          <Feather
            name="plus-circle"
            size={16}
            color={partnerTab === 'new_bag' ? '#ffffff' : '#64748b'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabBtnText,
              partnerTab === 'new_bag' && styles.tabBtnTextActive,
            ]}
          >
            Nova Sacola
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, partnerTab === 'validate' && styles.tabBtnActive]}
          onPress={() => setPartnerTab('validate')}
          activeOpacity={0.8}
        >
          <Feather
            name="check-square"
            size={16}
            color={partnerTab === 'validate' ? '#ffffff' : '#64748b'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabBtnText,
              partnerTab === 'validate' && styles.tabBtnTextActive,
            ]}
          >
            Validar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ABA: VISÃO GERAL */}
        {partnerTab === 'overview' && (
          <View>
            {/* Resumo de Métricas de Hoje */}
            <Text style={styles.sectionTitle}>Métricas de Hoje</Text>
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#e6f4f1' }]}>
                  <Feather name="shopping-bag" size={18} color="#006654" />
                </View>
                <Text style={styles.kpiValue}>6</Text>
                <Text style={styles.kpiLabel}>Sacolas Reservadas</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#fef3c7' }]}>
                  <Feather name="dollar-sign" size={18} color="#b45309" />
                </View>
                <Text style={styles.kpiValue}>R$ 119,40</Text>
                <Text style={styles.kpiLabel}>Receita Resgatada</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#dcfce7' }]}>
                  <Feather name="trash-2" size={18} color="#15803d" />
                </View>
                <Text style={styles.kpiValue}>15 kg</Text>
                <Text style={styles.kpiLabel}>Comida Salva</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#e0f2fe' }]}>
                  <Feather name="star" size={18} color="#0284c7" />
                </View>
                <Text style={styles.kpiValue}>4.9 ★</Text>
                <Text style={styles.kpiLabel}>Nota Média</Text>
              </View>
            </View>

            {/* Banner de Dica de Combate ao Desperdício */}
            <View style={styles.tipBanner}>
              <Feather name="info" size={18} color="#006654" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tipTitle}>Horário de pico de retirada</Text>
                <Text style={styles.tipDesc}>
                  Seus clientes costumam retirar entre 19h00 e 20h00. Deixe as sacolas surpresa prontas no balcão!
                </Text>
              </View>
            </View>

            {/* Sacolas Ativas no Aplicativo */}
            <View style={styles.bagsHeaderRow}>
              <Text style={styles.sectionTitle}>Sacolas Ativas no App ({partnerBags.length})</Text>
              <TouchableOpacity
                onPress={() => setPartnerTab('new_bag')}
                style={styles.addBagQuickBtn}
              >
                <Feather name="plus" size={14} color="#006654" />
                <Text style={styles.addBagQuickText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            {partnerBags.map((bag) => (
              <View key={bag.id} style={styles.bagCard}>
                <Image source={{ uri: bag.coverImage }} style={styles.bagCover} />
                <View style={styles.bagContent}>
                  <View style={styles.bagTopRow}>
                    <Text style={styles.bagTitle}>{bag.bagTitle}</Text>
                    <View style={styles.stockBadge}>
                      <Text style={styles.stockText}>{bag.remainingItems} disponíveis</Text>
                    </View>
                  </View>

                  <Text style={styles.bagWindow}>Retirada: {bag.pickupWindow}</Text>

                  <View style={styles.bagFooterRow}>
                    <Text style={styles.bagPrice}>
                      Por R$ {bag.price.toFixed(2).replace('.', ',')}
                      <Text style={styles.bagOriginalPrice}>
                        {' '}
                        (De R$ {bag.originalPrice.toFixed(2).replace('.', ',')})
                      </Text>
                    </Text>

                    <View style={styles.bagActionBadge}>
                      <Text style={styles.bagActionText}>Publicada</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PLACEHOLDER ABA NOVA SACOLA */}
        {partnerTab === 'new_bag' && (
          <View style={styles.placeholderContainer}>
            <Feather name="plus-circle" size={40} color="#006654" />
            <Text style={styles.placeholderTitle}>Cadastrar Nova Sacola Excedente</Text>
            <Text style={styles.placeholderSubtitle}>
              Disponibilize excedentes do dia para a comunidade salvar.
            </Text>
          </View>
        )}

        {/* PLACEHOLDER ABA VALIDAR */}
        {partnerTab === 'validate' && (
          <View style={styles.placeholderContainer}>
            <Feather name="check-square" size={40} color="#006654" />
            <Text style={styles.placeholderTitle}>Validador de Voucher de Clientes</Text>
            <Text style={styles.placeholderSubtitle}>
              Digite o código de 4 dígitos apresentado pelo cliente para liberar a sacola.
            </Text>
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
  headerLeft: {},
  headerPartnerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006654',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  partnerStoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  partnerStoreBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 4,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  storeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#006654',
  },
  storeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  openIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  openIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  storeCategoryAddress: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
  },
  tabBtnActive: {
    backgroundColor: '#006654',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  kpiIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006654',
  },
  tipDesc: {
    fontSize: 12,
    color: '#004d3f',
    marginTop: 2,
    lineHeight: 16,
  },
  bagsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBagQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addBagQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 4,
  },
  bagCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bagCover: {
    width: '100%',
    height: 110,
  },
  bagContent: {
    padding: 14,
  },
  bagTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bagTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  stockBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  bagWindow: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  bagFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bagPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#006654',
  },
  bagOriginalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  bagActionBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bagActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 14,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
