import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

export default function CadastroScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'consumer' | 'partner'>('consumer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validateForm() {
    if (name.trim().length < 3) {
      setErrorMsg('Digite seu nome completo.');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Informe um endereço de e-mail válido.');
      return false;
    }

    if (phone.trim().length < 8) {
      setErrorMsg('Informe um número de telefone válido.');
      return false;
    }

    if (password.length < 4) {
      setErrorMsg('A senha deve ter no mínimo 4 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não conferem.');
      return false;
    }

    return true;
  }

  async function handleRegister() {
    setErrorMsg('');
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await signUp({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role,
    });
    setSubmitting(false);

    if (!result.ok) {
      setErrorMsg(result.error || 'Não foi possível concluir o cadastro.');
      return;
    }

    router.replace('/(app)');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#0f172a" />
          <Text style={styles.backText}>Voltar ao login</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Criar sua conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para começar a resgatar sacolas surpresa.
        </Text>

        <View style={styles.roleSwitch}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'consumer' && styles.roleOptionActive]}
            onPress={() => setRole('consumer')}
          >
            <Feather
              name="user"
              size={16}
              color={role === 'consumer' ? '#ffffff' : '#475569'}
            />
            <Text
              style={[
                styles.roleOptionText,
                role === 'consumer' && styles.roleOptionTextActive,
              ]}
            >
              Consumidor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleOption, role === 'partner' && styles.roleOptionActive]}
            onPress={() => setRole('partner')}
          >
            <Feather
              name="shopping-bag"
              size={16}
              color={role === 'partner' ? '#ffffff' : '#475569'}
            />
            <Text
              style={[
                styles.roleOptionText,
                role === 'partner' && styles.roleOptionTextActive,
              ]}
            >
              Loja Parceira
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Ex: Yago Jardim"
              placeholderTextColor="#94a3b8"
              autoComplete="off"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <Feather name="mail" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#94a3b8"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Telefone / WhatsApp</Text>
          <View style={styles.inputRow}>
            <Feather name="phone" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              placeholderTextColor="#94a3b8"
              autoComplete="off"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Feather name="lock" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputRow}>
            <Feather name="check-circle" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Repita sua senha"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={15} color="#dc2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryBtnText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleOptionActive: {
    backgroundColor: '#059669',
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  roleOptionTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: '#059669',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
