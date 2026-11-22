import React, { useEffect, useState } from 'react';
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

export default function LoginScreen() {
  const { signIn, savedEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, [savedEmail]);

  async function handleLogin() {
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Informe um e-mail válido para continuar.');
      return;
    }

    if (password.trim().length < 4) {
      setErrorMsg('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(cleanEmail, password, rememberEmail);
    setSubmitting(false);

    if (!result.ok) {
      setErrorMsg(result.error || 'Não foi possível entrar. Tente novamente.');
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
        <View style={styles.brandBox}>
          <View style={styles.logoCircle}>
            <Feather name="shopping-bag" size={30} color="#ffffff" />
          </View>
          <Text style={styles.brandName}>SaveFood</Text>
          <Text style={styles.brandSubtitle}>
            Resgate sacolas surpresa com até 70% de desconto e ajude a reduzir o desperdício.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Entrar na sua conta</Text>

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

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Feather name="lock" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#94a3b8"
              autoComplete="new-password"
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

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={15} color="#dc2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberEmail((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberEmail && styles.checkboxActive]}>
                {rememberEmail ? (
                  <Feather name="check" size={13} color="#ffffff" />
                ) : null}
              </View>
              <Text style={styles.rememberText}>Lembrar meu e-mail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/recuperar-senha')}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryBtnText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Ainda não tem conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
            <Text style={styles.footerLink}>Criar conta</Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 300,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
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
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 18,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  rememberText: {
    fontSize: 13,
    color: '#475569',
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: '#475569',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
});
