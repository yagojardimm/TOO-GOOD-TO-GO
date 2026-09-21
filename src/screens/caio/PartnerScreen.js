import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOCK_BAGS, CATEGORIES, MOCK_ORDERS } from '../../data/mockData';

export default function PartnerScreen({ onBagCreated }) {
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

  const [bagsList, setBagsList] = useState(
    MOCK_BAGS.filter((b) => b.storeName === partnerStore.name)
  );

  // Estados do formulário de nova sacola
  const [bagTitle, setBagTitle] = useState('');
  const [category, setCategory] = useState('bakery');
  const [originalPrice, setOriginalPrice] = useState('60');
  const [discountPrice, setDiscountPrice] = useState('19.90');
  const [quantity, setQuantity] = useState(3);
  const [pickupWindow, setPickupWindow] = useState('Hoje das 18h30 às 20h00');
  const [description, setDescription] = useState(
    'Pode conter pães artesanais, croissants folhados e salgados frescos assados no dia.'
  );
  const [publishSuccessBanner, setPublishSuccessBanner] = useState(false);

  // Estados do validador de vouchers
  const [inputVoucherCode, setInputVoucherCode] = useState('');
  const [validationResult, setValidationResult] = useState(null); // null, { status: 'success' | 'error', data: ... }
  const [validatedHistory, setValidatedHistory] = useState([
    {
      code: 'SF-9124',
      customerName: 'Mariana Costa',
      bagTitle: 'Sacola Surpresa de Pães & Salgados',
      time: 'Ontem às 19:15',
    },
    {
      code: 'SF-5502',
      customerName: 'Lucas Ferreira',
      bagTitle: 'Combo Croissants & Folhados',
      time: 'Ontem às 19:40',
    },
  ]);

  // Cálculo de desconto dinâmico
  const orig = parseFloat(originalPrice) || 0;
  const disc = parseFloat(discountPrice) || 0;
  const discountPercent = orig > 0 && disc > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

  // Submissão do formulário de nova sacola
  const handleCreateBag = () => {
    if (!bagTitle.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe o título da sacola surpresa.');
      return;
    }

    const newBag = {
      id: 'partner-bag-' + Date.now(),
      storeName: partnerStore.name,
      storeAvatar: partnerStore.avatar,
      coverImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      category: category,
      categoryLabel: CATEGORIES.find((c) => c.id === category)?.label || 'Padaria',
      rating: 4.9,
      reviewsCount: 1,
      distance: '0 m (Minha Loja)',
      address: partnerStore.address,
      bagTitle: bagTitle.trim(),
      bagDescription: description.trim(),
      originalPrice: orig,
      price: disc,
      discountPercentage: discountPercent > 0 ? discountPercent : 65,
      pickupWindow: pickupWindow.trim(),
      remainingItems: quantity,
      pickupRules: [
        'Apresente o código do voucher na retirada',
        'Consumo imediato recomendado',
      ],
    };

    setBagsList([newBag, ...bagsList]);
    setBagTitle('');
    setPublishSuccessBanner(true);
    setPartnerTab('overview');

    if (onBagCreated) {
      onBagCreated(newBag);
    }
  };

  // Validação de Vouchers de clientes
  const handleValidateVoucher = (codeToTest) => {
    const rawCode = (codeToTest || inputVoucherCode).trim().toUpperCase();
    const cleanCode = rawCode.startsWith('SF-') ? rawCode : `SF-${rawCode}`;

    if (!rawCode) {
      Alert.alert('Código Vazio', 'Digite o código de 4 dígitos do voucher do cliente.');
      return;
    }

    // Procura em MOCK_ORDERS ou códigos conhecidos
    const foundOrder = MOCK_ORDERS.find(
      (ord) => ord.voucherCode.toUpperCase() === cleanCode
    );

    // Verifica se já foi validado hoje
    const alreadyValidated = validatedHistory.some(
      (v) => v.code.toUpperCase() === cleanCode
    );

    if (alreadyValidated) {
      setValidationResult({
        status: 'error',
        message: `O voucher ${cleanCode} já foi resgatado e entregue anteriormente!`,
      });
      return;
    }

    if (foundOrder || cleanCode === 'SF-4821' || cleanCode === 'SF-8821' || cleanCode === 'SF-2024') {
      const resultData = {
        code: cleanCode,
        customerName: foundOrder ? 'Caio Jotta' : 'Cliente SaveFood',
        bagTitle: foundOrder?.bagTitle || 'Sacola Surpresa de Pães & Salgados',
        pricePaid: foundOrder?.price || 19.90,
        pickupWindow: foundOrder?.pickupWindow || 'Hoje das 18h30 às 20h00',
      };
      setValidationResult({ status: 'success', data: resultData });
    } else {
      setValidationResult({
        status: 'error',
        message: `Código ${cleanCode} não encontrado no sistema. Verifique os dígitos com o cliente.`,
      });
    }
  };

  // Confirmar Entrega Física da Sacola
  const handleConfirmHandover = () => {
    if (!validationResult || validationResult.status !== 'success') return;

    const newEntry = {
      code: validationResult.data.code,
      customerName: validationResult.data.customerName,
      bagTitle: validationResult.data.bagTitle,
      time: 'Agora mesmo (' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ')',
    };

    setValidatedHistory([newEntry, ...validatedHistory]);
    setValidationResult(null);
    setInputVoucherCode('');
    Alert.alert('Sucesso!', 'Sacola entregue e resgate computado com sucesso.');
  };

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
        {/* Banner de Sucesso ao Publicar Sacola */}
        {publishSuccessBanner && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={20} color="#006654" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.successBannerTitle}>Sacola Publicada com Sucesso!</Text>
              <Text style={styles.successBannerDesc}>
                Seus excedentes já estão visíveis no feed para os clientes reservarem.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setPublishSuccessBanner(false)}>
              <Feather name="x" size={16} color="#006654" />
            </TouchableOpacity>
          </View>
        )}

        {/* ABA 1: VISÃO GERAL */}
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
              <Text style={styles.sectionTitle}>Sacolas Ativas no App ({bagsList.length})</Text>
              <TouchableOpacity
                onPress={() => setPartnerTab('new_bag')}
                style={styles.addBagQuickBtn}
              >
                <Feather name="plus" size={14} color="#006654" />
                <Text style={styles.addBagQuickText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            {bagsList.map((bag) => (
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

        {/* ABA 2: FORMULÁRIO PARA CADASTRAR NOVA SACOLA */}
        {partnerTab === 'new_bag' && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Feather name="plus-circle" size={24} color="#006654" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.formTitle}>Cadastrar Sacola Excedente</Text>
                <Text style={styles.formSubtitle}>
                  Transforme comida boa em receita extra e evite o descarte.
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título da Sacola Surpresa *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Sacola Surpresa de Focaccias & Pães"
                placeholderTextColor="#94a3b8"
                value={bagTitle}
                onChangeText={setBagTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria do Estabelecimento</Text>
              <View style={styles.categoryPillRow}>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const isCatSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catPill, isCatSelected && styles.catPillSelected]}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isCatSelected && styles.catPillTextSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.priceInputsRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Preço Original (R$)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="58.00"
                  keyboardType="numeric"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Preço SaveFood (R$)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="19.90"
                  keyboardType="numeric"
                  value={discountPrice}
                  onChangeText={setDiscountPrice}
                />
              </View>
            </View>

            {discountPercent > 0 && (
              <View style={styles.discountBadgeCalculated}>
                <Feather name="percent" size={14} color="#006654" />
                <Text style={styles.discountBadgeText}>
                  Desconto de {discountPercent}% para o cliente
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantidade de Sacolas Disponíveis</Text>
              <View style={styles.qtyControlRow}>
                <TouchableOpacity
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Feather name="minus" size={18} color={quantity <= 1 ? '#cbd5e1' : '#0f172a'} />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{quantity} sacolas</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Feather name="plus" size={18} color="#0f172a" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Janela de Horário para Coleta</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Hoje das 18h30 às 20h00"
                placeholderTextColor="#94a3b8"
                value={pickupWindow}
                onChangeText={setPickupWindow}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição ou Dica do Conteúdo</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Descreva o que pode vir na sacola..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity
              style={styles.submitBagButton}
              onPress={handleCreateBag}
              activeOpacity={0.85}
            >
              <Feather name="upload-cloud" size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.submitBagButtonText}>Publicar Sacola Surpresa</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ABA 3: VALIDADOR DE VOUCHERS DE CLIENTES */}
        {partnerTab === 'validate' && (
          <View>
            <View style={styles.validateCard}>
              <View style={styles.validateHeader}>
                <Feather name="check-square" size={24} color="#006654" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.validateTitle}>Validador de Voucher</Text>
                  <Text style={styles.validateSubtitle}>
                    Digite o código de 4 dígitos informado pelo cliente no balcão.
                  </Text>
                </View>
              </View>

              {/* Campo de Entrada do Código */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Código do Resgate (ex: 4821 ou SF-4821)</Text>
                <View style={styles.voucherInputRow}>
                  <TextInput
                    style={styles.voucherTextInput}
                    placeholder="SF-4821"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="characters"
                    value={inputVoucherCode}
                    onChangeText={(text) => {
                      setInputVoucherCode(text);
                      if (validationResult) setValidationResult(null);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.validateButton}
                    onPress={() => handleValidateVoucher()}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.validateButtonText}>Verificar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botões Rápidos de Teste */}
              <View style={styles.quickCodeRow}>
                <Text style={styles.quickCodeLabel}>Testar código:</Text>
                <TouchableOpacity
                  style={styles.quickCodeChip}
                  onPress={() => {
                    setInputVoucherCode('SF-4821');
                    handleValidateVoucher('SF-4821');
                  }}
                >
                  <Text style={styles.quickCodeChipText}>SF-4821 (Ativo Hoje)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickCodeChip}
                  onPress={() => {
                    setInputVoucherCode('SF-9124');
                    handleValidateVoucher('SF-9124');
                  }}
                >
                  <Text style={styles.quickCodeChipText}>SF-9124 (Já Usado)</Text>
                </TouchableOpacity>
              </View>

              {/* CARD DE RESULTADO DA VALIDAÇÃO */}
              {validationResult && (
                <View
                  style={[
                    styles.resultCard,
                    validationResult.status === 'success'
                      ? styles.resultCardSuccess
                      : styles.resultCardError,
                  ]}
                >
                  {validationResult.status === 'success' ? (
                    <View>
                      <View style={styles.resultHeaderRow}>
                        <View style={styles.resultSuccessIconBox}>
                          <Feather name="check" size={20} color="#ffffff" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.resultSuccessTitle}>Voucher Autenticado!</Text>
                          <Text style={styles.resultSuccessSubtitle}>
                            Pronto para entrega da sacola
                          </Text>
                        </View>
                        <View style={styles.codePillSuccess}>
                          <Text style={styles.codePillText}>
                            {validationResult.data.code}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.resultDetailsBox}>
                        <View style={styles.resultDetailRow}>
                          <Text style={styles.resultDetailLabel}>Cliente:</Text>
                          <Text style={styles.resultDetailValue}>
                            {validationResult.data.customerName}
                          </Text>
                        </View>
                        <View style={styles.resultDetailRow}>
                          <Text style={styles.resultDetailLabel}>Sacola:</Text>
                          <Text style={styles.resultDetailValue}>
                            {validationResult.data.bagTitle}
                          </Text>
                        </View>
                        <View style={styles.resultDetailRow}>
                          <Text style={styles.resultDetailLabel}>Valor Pago:</Text>
                          <Text style={styles.resultDetailValue}>
                            R$ {validationResult.data.pricePaid.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.confirmHandoverBtn}
                        onPress={handleConfirmHandover}
                        activeOpacity={0.85}
                      >
                        <Feather
                          name="check-circle"
                          size={18}
                          color="#ffffff"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.confirmHandoverBtnText}>
                          Confirmar Entrega da Sacola
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.resultErrorRow}>
                      <Feather name="alert-circle" size={24} color="#ef4444" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.resultErrorTitle}>Voucher Inválido</Text>
                        <Text style={styles.resultErrorSubtitle}>
                          {validationResult.message}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Histórico de Vouchers Validados Hoje */}
            <View style={styles.historyCard}>
              <Text style={styles.sectionTitle}>Vouchers Validados Hoje</Text>
              {validatedHistory.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.historyItem,
                    index !== validatedHistory.length - 1 && styles.historyItemBorder,
                  ]}
                >
                  <View style={styles.historyIconCircle}>
                    <Feather name="check" size={14} color="#006654" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.historyTopRow}>
                      <Text style={styles.historyCustomer}>{item.customerName}</Text>
                      <View style={styles.historyCodeBadge}>
                        <Text style={styles.historyCodeText}>{item.code}</Text>
                      </View>
                    </View>
                    <Text style={styles.historyBag}>{item.bagTitle}</Text>
                    <Text style={styles.historyTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006654',
  },
  successBannerDesc: {
    fontSize: 12,
    color: '#004d3f',
    marginTop: 1,
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

  // FORMULÁRIO DE NOVA SACOLA
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catPillSelected: {
    backgroundColor: '#e6f4f1',
    borderColor: '#006654',
  },
  catPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  catPillTextSelected: {
    color: '#006654',
    fontWeight: '700',
  },
  priceInputsRow: {
    flexDirection: 'row',
  },
  discountBadgeCalculated: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 6,
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 4,
    justifyContent: 'space-between',
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qtyBtnDisabled: {
    backgroundColor: '#f1f5f9',
  },
  qtyNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  submitBagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006654',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBagButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },

  // VALIDADOR DE VOUCHERS
  validateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  validateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  validateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  validateSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  voucherInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voucherTextInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1.5,
  },
  validateButton: {
    backgroundColor: '#006654',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 10,
  },
  validateButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  quickCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 14,
  },
  quickCodeLabel: {
    fontSize: 11,
    color: '#64748b',
    marginRight: 6,
  },
  quickCodeChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginTop: 4,
  },
  quickCodeChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006654',
  },
  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  resultCardSuccess: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  resultCardError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultSuccessIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSuccessTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065f46',
  },
  resultSuccessSubtitle: {
    fontSize: 12,
    color: '#047857',
  },
  codePillSuccess: {
    backgroundColor: '#006654',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  resultDetailsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  resultDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  resultDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  resultDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  confirmHandoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006654',
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmHandoverBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  resultErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultErrorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991b1b',
  },
  resultErrorSubtitle: {
    fontSize: 12,
    color: '#b91c1c',
    marginTop: 2,
    lineHeight: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e6f4f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyCustomer: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  historyCodeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  historyBag: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  historyTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
});
