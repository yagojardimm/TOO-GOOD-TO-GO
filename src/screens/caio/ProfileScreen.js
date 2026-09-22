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
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOCK_USER_IMPACT } from '../../data/mockData';

export default function ProfileScreen({ impactData = MOCK_USER_IMPACT }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedPreferences, setSelectedPreferences] = useState([
    'bakery',
    'meals',
    'vegan',
  ]);

  const DIETARY_TAGS = [
    { id: 'bakery', label: '🥖 Padarias & Confeitaria' },
    { id: 'meals', label: '🍲 Refeições do Dia' },
    { id: 'vegan', label: '🌱 Vegano & Plant-Based' },
    { id: 'vegetarian', label: '🥗 Vegetariano' },
    { id: 'gluten_free', label: '🌾 Sem Glúten' },
    { id: 'lactose_free', label: '🥛 Sem Lactose' },
    { id: 'japanese', label: '🍣 Cozinha Japonesa' },
    { id: 'pizza', label: '🍕 Pizzas & Massas' },
  ];

  const togglePreference = (id) => {
    if (selectedPreferences.includes(id)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== id));
    } else {
      setSelectedPreferences([...selectedPreferences, id]);
    }
  };

  const MENU_OPTIONS = [
    { id: 'address', label: 'Endereços de Retirada Salvos', icon: 'map-pin', value: '3 cadastrados' },
    { id: 'payment', label: 'Métodos de Pagamento', icon: 'credit-card', value: 'Cartão •••• 8821, Pix' },
    { id: 'help', label: 'Central de Ajuda & FAQ', icon: 'help-circle' },
    { id: 'terms', label: 'Termos de Uso e Sustentabilidade', icon: 'file-text' },
    { id: 'share', label: 'Indique um Amigo e Ganhe R$ 10', icon: 'gift', highlight: true },
  ];

  const levelProgress = Math.min(
    Math.round((impactData.mealsSaved / impactData.nextLevelMeals) * 100),
    100
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil & Impacto</Text>
        <TouchableOpacity style={styles.editProfileBtn}>
          <Feather name="settings" size={20} color="#006654" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Card do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: impactData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color="#ffffff" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{impactData.userName || 'Membro SaveFood'}</Text>
            <Text style={styles.userEmail}>{impactData.userEmail || 'usuario.eco@savefood.app'}</Text>

            <View style={styles.badgePill}>
              <Feather name="shield" size={12} color="#006654" />
              <Text style={styles.badgePillText}>
                {impactData.levelTitle} • Nível {impactData.currentLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* PAINEL DE SUSTENTABILIDADE & IMPACTO VERDE */}
        <View style={styles.impactCard}>
          <View style={styles.impactCardHeader}>
            <View style={styles.impactHeaderLeft}>
              <View style={styles.impactHeaderIcon}>
                <Feather name="globe" size={18} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.impactCardTitle}>Impacto Ecológico</Text>
                <Text style={styles.impactCardSubtitle}>Seu combate direto ao desperdício</Text>
              </View>
            </View>
            <View style={styles.ecoTag}>
              <Text style={styles.ecoTagText}>Ativo</Text>
            </View>
          </View>

          {/* Grade com os 4 Contadores Principais */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#e6f4f1' }]}>
                <Feather name="shopping-bag" size={18} color="#006654" />
              </View>
              <Text style={styles.metricNumber}>{impactData.mealsSaved}</Text>
              <Text style={styles.metricLabel}>Refeições Salvas</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Feather name="dollar-sign" size={18} color="#b45309" />
              </View>
              <Text style={styles.metricNumber}>
                R$ {impactData.moneySaved.toFixed(0)}
              </Text>
              <Text style={styles.metricLabel}>Economizados</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#dcfce7' }]}>
                <Feather name="wind" size={18} color="#15803d" />
              </View>
              <Text style={styles.metricNumber}>{impactData.co2SavedKg.toFixed(1)} kg</Text>
              <Text style={styles.metricLabel}>CO₂e Evitados</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="droplet" size={18} color="#0284c7" />
              </View>
              <Text style={styles.metricNumber}>{impactData.waterSavedLiters} L</Text>
              <Text style={styles.metricLabel}>Água Poupada</Text>
            </View>
          </View>

          {/* Barra de Progresso de Nível Ecológico */}
          <View style={styles.levelProgressSection}>
            <View style={styles.levelRow}>
              <Text style={styles.levelLabel}>Rumo ao Nível {impactData.currentLevel + 1}</Text>
              <Text style={styles.levelCount}>
                {impactData.mealsSaved} / {impactData.nextLevelMeals} refeições
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${levelProgress}%` }]} />
            </View>
            <Text style={styles.levelTip}>
              Faltam apenas {impactData.nextLevelMeals - impactData.mealsSaved} sacolas para desbloquear o título de "Protetor do Planeta"!
            </Text>
          </View>

          {/* Conquistas / Medalhas Ecológicas */}
          <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Medalhas Conquistadas</Text>
            <View style={styles.badgesRow}>
              {impactData.badges.map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
                >
                  <View
                    style={[
                      styles.badgeIconBox,
                      badge.unlocked ? styles.badgeIconBoxUnlocked : styles.badgeIconBoxLocked,
                    ]}
                  >
                    <Feather
                      name={badge.unlocked ? badge.icon : 'lock'}
                      size={18}
                      color={badge.unlocked ? '#006654' : '#94a3b8'}
                    />
                  </View>
                  <Text style={styles.badgeName} numberOfLines={1}>{badge.title}</Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>{badge.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Preferências Alimentares */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="heart" size={18} color="#006654" />
            <Text style={styles.sectionTitle}>Minhas Preferências Alimentares</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Selecione seus gostos para receber recomendações personalizadas de sacolas surpresa:
          </Text>

          <View style={styles.tagsContainer}>
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedPreferences.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                  onPress={() => togglePreference(tag.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
                    {tag.label}
                  </Text>
                  {isSelected && (
                    <Feather
                      name="check"
                      size={13}
                      color="#006654"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Configurações Rápidas */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="bell" size={18} color="#006654" />
            <Text style={styles.sectionTitle}>Notificações do App</Text>
          </View>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>Alertas de Janela de Coleta</Text>
              <Text style={styles.switchDesc}>
                Lembrar quando faltar 30 minutos para o horário de retirada
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e2e8f0', true: '#a7f3d0' }}
              thumbColor={notificationsEnabled ? '#006654' : '#cbd5e1'}
            />
          </View>
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuCard}>
          {MENU_OPTIONS.map((opt, idx) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.menuItem,
                idx !== MENU_OPTIONS.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIconBox}>
                <Feather
                  name={opt.icon}
                  size={18}
                  color={opt.highlight ? '#006654' : '#475569'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuItemLabel,
                    opt.highlight && styles.menuItemLabelHighlight,
                  ]}
                >
                  {opt.label}
                </Text>
                {opt.value && (
                  <Text style={styles.menuItemValue}>{opt.value}</Text>
                )}
              </View>
              <Feather name="chevron-right" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Feather name="log-out" size={16} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>SaveFood v1.0.0 (Expo React Native) • Caio & Yago</Text>
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
  editProfileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e6f4f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#006654',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#006654',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006654',
    marginLeft: 4,
  },

  // PAINEL DE SUSTENTABILIDADE
  impactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    elevation: 3,
    shadowColor: '#006654',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  impactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  impactHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#006654',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  impactCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  impactCardSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  ecoTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ecoTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  levelProgressSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006654',
  },
  levelCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#dcfce7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#006654',
    borderRadius: 4,
  },
  levelTip: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  badgesSection: {
    marginTop: 4,
  },
  badgesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeIconBoxUnlocked: {
    backgroundColor: '#e6f4f1',
  },
  badgeIconBoxLocked: {
    backgroundColor: '#f1f5f9',
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },

  // PREFERÊNCIAS E OUTROS
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagChipSelected: {
    backgroundColor: '#e6f4f1',
    borderColor: '#006654',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tagChipTextSelected: {
    color: '#006654',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  switchDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  menuItemLabelHighlight: {
    color: '#006654',
    fontWeight: '700',
  },
  menuItemValue: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  versionText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
});
