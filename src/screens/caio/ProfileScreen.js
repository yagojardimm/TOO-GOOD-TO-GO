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

export default function ProfileScreen() {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
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
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color="#ffffff" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Caio Jotta</Text>
            <Text style={styles.userEmail}>caiojotta18@gmail.com</Text>

            <View style={styles.badgePill}>
              <Feather name="shield" size={12} color="#006654" />
              <Text style={styles.badgePillText}>Guardião da Comida • Nível 3</Text>
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
