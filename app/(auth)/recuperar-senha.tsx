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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [typedCode, setTypedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleSendCode() {
    setErrorMsg('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Informe o e-mail cadastrado para receber o código.');
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setStep('reset');
  }

  async function handleConfirmReset() {
    setErrorMsg('');

    if (typedCode.trim() !== generatedCode) {
      setErrorMsg('O código digitado não confere com o código enviado.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('A nova senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('A confirmação da nova senha não confere.');
      return;
    }

    await resetPassword(email.trim(), newPassword);
    setStep('done');
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {step === 'email' && (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Feather name="key" size={24} color="#059669" />
            </View>
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.subtitle}>
              Digite o e-mail da sua conta para gerar um código de verificação e definir uma nova senha.
            </Text>

            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputRow}>
              <Feather name="mail" size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#94a3b8"
                autoComplete="off"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendCode}>
              <Text style={styles.primaryBtnText}>Enviar código</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'reset' && (
          <View style={styles.card}>
            <Text style={styles.title}>Digite o código enviado</Text>
            <Text style={styles.subtitle}>
              Enviamos um código de 6 dígitos para {email.trim()}.
            </Text>

            <View style={styles.codeNotice}>
              <Feather name="info" size={16} color="#047857" />
              <Text style={styles.codeNoticeText}>
                Código de demonstração gerado: {generatedCode}
              </Text>
            </View>

            <Text style={styles.label}>Código de verificação</Text>
            <View style={styles.inputRow}>
              <Feather name="hash" size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={6}
                value={typedCode}
                onChangeText={setTypedCode}
              />
            </View>

            <Text style={styles.label}>Nova senha</Text>
            <View style={styles.inputRow}>
              <Feather name="lock" size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Digite a nova senha"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <Text style={styles.label}>Confirmar nova senha</Text>
            <View style={styles.inputRow}>
              <Feather name="check-circle" size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Repita a nova senha"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleConfirmReset}
            >
              <Text style={styles.primaryBtnText}>Redefinir senha</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'done' && (
          <View style={[styles.card, styles.doneCard]}>
            <View style={styles.successCircle}>
              <Feather name="check" size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>Senha atualizada!</Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              Sua senha foi redefinida com sucesso. Agora você já pode entrar na sua conta.
            </Text>

            <TouchableOpacity
              style={[styles.primaryBtn, styles.fullWidth]}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.primaryBtnText}>Ir para o login</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 52,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  doneCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 20,
  },
  centerText: {
    textAlign: 'center',
  },
  codeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  codeNoticeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    flex: 1,
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
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: '#059669',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  fullWidth: {
    width: '100%',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
