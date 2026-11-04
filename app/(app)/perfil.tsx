import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.email}>Logado como: {user?.email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sair da Conta" color="#d32f2f" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  email: { fontSize: 16, color: '#666', marginBottom: 24 },
  buttonContainer: { width: '100%', maxWidth: 200 },
});
