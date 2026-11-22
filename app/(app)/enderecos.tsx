import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { buscarEnderecoPorCep } from '../../src/services/cepApi';

const LABEL_OPTIONS = ['Casa', 'Trabalho', 'Outro'];

export default function EnderecosScreen() {
  const router = useRouter();
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useApp();

  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [label, setLabel] = useState('Casa');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleBuscarCep = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setIsSearchingCep(true);
      const res = await buscarEnderecoPorCep(clean);
      setLogradouro(res.logradouro);
      setBairro(res.bairro);
      setCidade(res.cidade);
      setUf(res.uf);
      setShowForm(true);
    } catch (err: any) {
      Alert.alert('Erro ao buscar CEP', err.message || 'Verifique o CEP e tente novamente.');
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSalvarEndereco = () => {
    if (!logradouro.trim() || !numero.trim() || !cidade.trim()) {
      Alert.alert('Campos incompletos', 'Informe pelo menos logradouro, número e cidade.');
      return;
    }

    addAddress({
      label,
      cep: cep.replace(/\D/g, ''),
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      complemento: complemento.trim() || undefined,
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      uf: uf.trim().toUpperCase(),
      isDefault: addresses.length === 0,
    });

    // Limpar formulário
    setCep('');
    setLogradouro('');
    setNumero('');
    setComplemento('');
    setBairro('');
    setCidade('');
    setUf('');
    setShowForm(false);
    Alert.alert('Sucesso', 'Endereço salvo com sucesso!');
  };

  const handleRemover = (id: string, lbl: string) => {
    Alert.alert(
      'Remover endereço',
      `Deseja realmente excluir o endereço "${lbl}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => removeAddress(id),
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Formulário de Busca por CEP (API ViaCEP) */}
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Buscar novo endereço por CEP</Text>
            <Text style={styles.cardSubtitle}>
              Consulta em tempo real na API do ViaCEP
            </Text>

            <View style={styles.cepRow}>
              <View style={styles.cepInputContainer}>
                <Feather name="map-pin" size={18} color="#059669" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.cepInput}
                  placeholder="Ex: 01310-100"
                  placeholderTextColor="#94a3b8"
                  value={cep}
                  onChangeText={(val) => setCep(val)}
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>

              <TouchableOpacity
                style={styles.searchCepBtn}
                onPress={handleBuscarCep}
                disabled={isSearchingCep}
                activeOpacity={0.8}
              >
                {isSearchingCep ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Feather name="search" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.searchCepBtnText}>Buscar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Campos adicionais após a busca */}
            {showForm ? (
              <View style={styles.extraFields}>
                {/* Rótulo */}
                <Text style={styles.fieldLabel}>Identificação do Local</Text>
                <View style={styles.labelChips}>
                  {LABEL_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.labelChip,
                        label === item && styles.labelChipActive,
                      ]}
                      onPress={() => setLabel(item)}
                    >
                      <Text
                        style={[
                          styles.labelChipText,
                          label === item && styles.labelChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Logradouro */}
                <Text style={styles.fieldLabel}>Rua / Logradouro</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rua, Avenida..."
                  placeholderTextColor="#94a3b8"
                  value={logradouro}
                  onChangeText={setLogradouro}
                />

                {/* Número e Complemento */}
                <View style={styles.twoCols}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.fieldLabel}>Número *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#94a3b8"
                      value={numero}
                      onChangeText={setNumero}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.fieldLabel}>Complemento</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Apto 42"
                      placeholderTextColor="#94a3b8"
                      value={complemento}
                      onChangeText={setComplemento}
                    />
                  </View>
                </View>

                {/* Bairro, Cidade, UF */}
                <View style={styles.twoCols}>
                  <View style={{ flex: 2, marginRight: 8 }}>
                    <Text style={styles.fieldLabel}>Bairro</Text>
                    <TextInput
                      style={styles.input}
                      value={bairro}
                      onChangeText={setBairro}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.fieldLabel}>UF</Text>
                    <TextInput
                      style={styles.input}
                      value={uf}
                      onChangeText={setUf}
                      maxLength={2}
                      autoCapitalize="characters"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSalvarEndereco}
                  activeOpacity={0.85}
                >
                  <Feather name="check" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>Salvar endereço</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Lista de Endereços Salvos */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              Endereços salvos ({addresses.length})
            </Text>

            {addresses.map((item) => (
              <View key={item.id} style={styles.addressCard}>
                <View style={styles.addressCardTop}>
                  <View style={styles.labelBadge}>
                    <Ionicons
                      name={
                        item.label.toLowerCase() === 'casa'
                          ? 'home-outline'
                          : 'briefcase-outline'
                      }
                      size={14}
                      color="#059669"
                    />
                    <Text style={styles.labelText}>{item.label}</Text>
                  </View>

                  {item.isDefault ? (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Principal</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setDefaultAddress(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.makeDefaultText}>Definir principal</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.addressMain}>
                  {item.logradouro}, {item.numero}
                  {item.complemento ? ` - ${item.complemento}` : ''}
                </Text>
                <Text style={styles.addressSub}>
                  {item.bairro} • {item.cidade}/{item.uf} • CEP {item.cep}
                </Text>

                <View style={styles.addressActions}>
                  <TouchableOpacity
                    style={styles.deleteAction}
                    onPress={() => handleRemover(item.id, item.label)}
                    activeOpacity={0.7}
                  >
                    <Feather name="trash-2" size={14} color="#ef4444" />
                    <Text style={styles.deleteActionText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  cepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cepInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  cepInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  searchCepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchCepBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  extraFields: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  labelChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  labelChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  labelChipActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
  },
  labelChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  labelChipTextActive: {
    color: '#059669',
    fontWeight: '700',
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
  twoCols: {
    flexDirection: 'row',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  defaultBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  makeDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  addressMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  addressSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  deleteAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  deleteActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
});

