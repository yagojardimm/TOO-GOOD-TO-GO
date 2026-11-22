import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/contexts/AppContext';

const CATEGORIES = [
  { id: 'bakery', label: 'Padaria & Confeitaria' },
  { id: 'meals', label: 'Refeições & Pratos' },
  { id: 'market', label: 'Hortifrúti & Mercado' },
  { id: 'sweets', label: 'Doces & Sobremesas' },
  { id: 'vegan', label: 'Vegano' },
];

export default function ParceiroScreen() {
  const router = useRouter();
  const { bags, orders, addBag, redeemOrder } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'new_bag' | 'validate'>('dashboard');

  // Formulário de Nova Sacola
  const [storeName, setStoreName] = useState('Minha Loja Parceira');
  const [bagTitle, setBagTitle] = useState('');
  const [category, setCategory] = useState('bakery');
  const [originalPrice, setOriginalPrice] = useState('50.00');
  const [price, setPrice] = useState('18.90');
  const [pickupWindow, setPickupWindow] = useState('Hoje das 18h30 às 20h00');
  const [quantity, setQuantity] = useState('3');
  const [description, setDescription] = useState(
    'Sacola surpresa com produtos frescos e deliciosos preparados no dia.'
  );

  // Validador de Voucher
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    status: 'success' | 'error';
    message: string;
    orderInfo?: any;
  } | null>(null);

  // Cálculos dinâmicos do Dashboard Comercial
  const totalBags = bags.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.price || 0), 0);

  // Cálculo de desconto % automático
  const origNum = parseFloat(originalPrice.replace(',', '.')) || 0;
  const priceNum = parseFloat(price.replace(',', '.')) || 0;
  const discountPercent =
    origNum > 0 && priceNum > 0
      ? Math.max(0, Math.round(((origNum - priceNum) / origNum) * 100))
      : 0;

  const handleCadastrarSacola = () => {
    if (!bagTitle.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o título da sacola.');
      return;
    }
    if (origNum <= 0 || priceNum <= 0) {
      Alert.alert('Preço inválido', 'Informe valores válidos para preço original e promocional.');
      return;
    }

    const qty = parseInt(quantity, 10) || 1;
    const catLabel =
      CATEGORIES.find((c) => c.id === category)?.label || 'Padaria';

    addBag({
      id: `bag-partner-${Date.now()}`,
      storeName: storeName.trim(),
      storeAvatar:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
      coverImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      category,
      categoryLabel: catLabel,
      rating: 5.0,
      reviewsCount: 1,
      distance: '0 m (Sua Loja)',
      address: 'Balcão de Atendimento do Estabelecimento',
      bagTitle: bagTitle.trim(),
      bagDescription: description.trim(),
      originalPrice: origNum,
      price: priceNum,
      discountPercentage: discountPercent,
      pickupWindow: pickupWindow.trim(),
      remainingItems: qty,
      pickupRules: [
        'Apresente o código do voucher na retirada',
        'Consumo imediato recomendado',
      ],
    });

    setBagTitle('');
    Alert.alert(
      'Sacola Cadastrada!',
      'Sua sacola surpresa já foi publicada na Home e está disponível para reserva pelos clientes.'
    );
    setActiveTab('dashboard');
  };

  const handleValidarVoucher = () => {
    const clean = voucherCodeInput.trim().toUpperCase().replace('#', '');
    if (!clean) {
      Alert.alert('Código obrigatório', 'Digite o código do voucher (ex: SF-1234).');
      return;
    }

    const result = redeemOrder(clean);
    if (result) {
      setValidationResult({
        status: 'success',
        message: 'Voucher validado e resgatado com sucesso!',
        orderInfo: result,
      });
      setVoucherCodeInput('');
    } else {
      setValidationResult({
        status: 'error',
        message: 'Código de voucher não encontrado ou já foi utilizado anteriormente.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel do Parceiro</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Abas Internas */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text
            style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}
          >
            Visão Geral
          </Text>
        </TouchableOpacity>


      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'dashboard' ? (
            <View>
              {/* Cards de Métricas Comerciais */}
              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <View style={styles.metricIconBox}>
                    <Feather name="shopping-bag" size={20} color="#059669" />
                  </View>
                  <Text style={styles.metricNumber}>{totalBags}</Text>
                  <Text style={styles.metricTitle}>Sacolas Ativas</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIconBox}>
                    <Feather name="check-square" size={20} color="#059669" />
                  </View>
                  <Text style={styles.metricNumber}>{totalOrders}</Text>
                  <Text style={styles.metricTitle}>Pedidos Registrados</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIconBox}>
                    <Feather name="dollar-sign" size={20} color="#059669" />
                  </View>
                  <Text style={styles.metricNumber}>
                    R$ {totalRevenue.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.metricTitle}>Receita Gerada</Text>
                </View>
              </View>

              {/* Banner Rápido para Criar Sacola */}
              <TouchableOpacity
                style={styles.bannerNewBag}
                onPress={() => setActiveTab('new_bag')}
                activeOpacity={0.85}
              >
                <View style={styles.bannerNewBagIcon}>
                  <Feather name="plus" size={24} color="#ffffff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bannerNewBagTitle}>Cadastrar Sacola Surpresa</Text>
                  <Text style={styles.bannerNewBagSubtitle}>
                    Evite desperdícios e lucre vendendo os excedentes do dia
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#059669" />
              </TouchableOpacity>

              {/* Sacolas Cadastradas Recentes */}
              <Text style={styles.sectionHeading}>Sacolas no aplicativo ({bags.length})</Text>
              {bags.slice(0, 4).map((b) => (
                <View key={b.id} style={styles.bagListItem}>
                  <View style={styles.bagListInfo}>
                    <Text style={styles.bagListTitle} numberOfLines={1}>
                      {b.bagTitle}
                    </Text>
                    <Text style={styles.bagListStore}>
                      {b.storeName} • {b.remainingItems} restantes
                    </Text>
                    <Text style={styles.bagListPrice}>
                      R$ {b.price.toFixed(2).replace('.', ',')}{' '}
                      <Text style={styles.bagListOrig}>
                        (De R$ {b.originalPrice.toFixed(2).replace('.', ',')})
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.discountPill}>
                    <Text style={styles.discountPillText}>-{b.discountPercentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

</ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  tabActive: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricTitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  bannerNewBag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  bannerNewBagIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerNewBagTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065f46',
  },
  bannerNewBagSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  bagListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  bagListInfo: {
    flex: 1,
  },
  bagListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  bagListStore: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bagListPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
    marginTop: 4,
  },
  bagListOrig: {
    fontSize: 11,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  discountPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  discountPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    gap: 6,
  },
  discountPreviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  voucherInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1,
  },
  validateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  validateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  resultError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  resultTitleSuccess: {
    color: '#065f46',
  },
  resultTitleError: {
    color: '#b91c1c',
  },
  resultMessage: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  orderInfoBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  orderInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderInfoStore: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  orderInfoDate: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
});

