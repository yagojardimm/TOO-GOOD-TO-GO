import React, { useState } from 'react';
import {
  Alert,
  Modal,
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
import { useAuth } from '../../src/contexts/AuthContext';
import { useApp } from '../../src/contexts/AppContext';

const PREFERENCE_OPTIONS = [
  'Padaria & Pães',
  'Frutas & Legumes',
  'Refeições Prontas',
  'Doces & Bolos',
  'Opções Veganas',
  'Sem Glúten',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { impact, preferences, togglePreference } = useApp();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, insira o seu nome.');
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      setEditModalVisible(false);
      Alert.alert('Perfil atualizado', 'Seus dados foram atualizados com sucesso.');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const levelProgress = Math.min(
    Math.round(((impact.mealsSaved || 1) / (impact.nextLevelMeals || 20)) * 100),
    100
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={openEditModal}
          activeOpacity={0.7}
        >
          <Feather name="edit-3" size={18} color="#059669" />
          <Text style={styles.editHeaderBtnText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'SF'}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Membro SaveFood'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'usuario@savefood.app'}</Text>
            {user?.phone ? (
              <View style={styles.phoneRow}>
                <Feather name="phone" size={12} color="#64748b" />
                <Text style={styles.userPhone}>{user.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* PAINEL DE SUSTENTABILIDADE & IMPACTO VERDE */}
        <View style={styles.impactCard}>
          <View style={styles.impactCardHeader}>
            <View style={styles.impactHeaderIcon}>
              <Feather name="globe" size={18} color="#059669" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.impactTitle}>Impacto Ecológico</Text>
              <Text style={styles.impactSubtitle}>
                {impact.levelTitle} • Nível {impact.currentLevel}
              </Text>
            </View>
          </View>

          {/* Barra de Progresso do Nível */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {impact.mealsSaved} de {impact.nextLevelMeals} refeições salvas
              </Text>
              <Text style={styles.progressPercent}>{levelProgress}%</Text>
            </View>
          </View>

          {/* Métricas Principais em Grade 2x2 */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Feather name="check-circle" size={18} color="#059669" />
              <Text style={styles.metricValue}>{impact.mealsSaved}</Text>
              <Text style={styles.metricLabel}>Refeições Salvas</Text>
            </View>

            <View style={styles.metricItem}>
              <Feather name="trending-up" size={18} color="#059669" />
              <Text style={styles.metricValue}>
                R$ {impact.moneySaved.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.metricLabel}>Economizados</Text>
            </View>

            <View style={styles.metricItem}>
              <Feather name="wind" size={18} color="#059669" />
              <Text style={styles.metricValue}>
                {String(impact.co2SavedKg).replace('.', ',')} kg
              </Text>
              <Text style={styles.metricLabel}>CO₂e Evitados</Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="water-outline" size={18} color="#059669" />
              <Text style={styles.metricValue}>{impact.waterSavedLiters} L</Text>
              <Text style={styles.metricLabel}>Água Poupada</Text>
            </View>
          </View>

          {/* Medalhas de Conquista */}
          {impact.badges && impact.badges.length > 0 ? (
            <View style={styles.badgesSection}>
              <Text style={styles.badgesTitle}>Medalhas e Conquistas</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}
              >
                {impact.badges.map((b) => (
                  <View
                    key={b.id}
                    style={[
                      styles.badgeCard,
                      !b.unlocked && styles.badgeCardLocked,
                    ]}
                  >
                    <Feather
                      name={b.unlocked ? (b.icon as any) : 'lock'}
                      size={22}
                      color={b.unlocked ? '#059669' : '#94a3b8'}
                    />
                    <Text
                      style={[
                        styles.badgeName,
                        !b.unlocked && styles.badgeNameLocked,
                      ]}
                      numberOfLines={1}
                    >
                      {b.title}
                    </Text>
                    <Text
                      style={styles.badgeDesc}
                      numberOfLines={2}
                    >
                      {b.desc}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>

        {/* SEÇÃO DE PREFERÊNCIAS ALIMENTARES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="sliders" size={18} color="#059669" />
            <Text style={styles.sectionCardTitle}>Preferências Alimentares</Text>
          </View>
          <Text style={styles.sectionCardSubtitle}>
            Personalize as sugestões de sacolas surpresa no seu feed
          </Text>

          <View style={styles.prefsContainer}>
            {PREFERENCE_OPTIONS.map((item) => {
              const active = preferences.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.prefChip, active && styles.prefChipActive]}
                  onPress={() => togglePreference(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.prefChipText,
                      active && styles.prefChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {active ? (
                    <Feather
                      name="check"
                      size={14}
                      color="#ffffff"
                      style={{ marginLeft: 6 }}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ATALHOS DE NAVEGAÇÃO */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(app)/enderecos')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Feather name="map-pin" size={18} color="#059669" />
            </View>
            <View style={styles.menuTexts}>
              <Text style={styles.menuTitle}>Meus Endereços - CEP</Text>
              <Text style={styles.menuSubtitle}>
                Gerencie locais de retirada e consulte a API ViaCEP
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(app)/parceiro')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Feather name="briefcase" size={18} color="#059669" />
            </View>
            <View style={styles.menuTexts}>
              <Text style={styles.menuTitle}>Painel da Loja Parceira</Text>
              <Text style={styles.menuSubtitle}>
                Cadastre sacolas surpresa e faça baixa em vouchers
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* BOTÃO DE LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={18} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalCardHeader}>
              <Text style={styles.modalCardTitle}>Editar Dados do Perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Nome Completo</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.modalFieldLabel}>Telefone / WhatsApp</Text>
            <TextInput
              style={styles.modalInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="(11) 99999-8888"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveProfile}
                disabled={isSavingProfile}
              >
                <Text style={styles.modalSaveBtnText}>
                  {isSavingProfile ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  impactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  impactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  impactHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  impactSubtitle: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  badgesSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  badgesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  badgesScroll: {
    gap: 10,
  },
  badgeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: 115,
  },
  badgeCardLocked: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
    marginTop: 6,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#94a3b8',
  },
  badgeDesc: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
    lineHeight: 12,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  prefsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  prefChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  prefChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  prefChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTexts: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 14,
    borderRadius: 14,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  modalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
  },
  modalSaveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
