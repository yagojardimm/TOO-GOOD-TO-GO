import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export const ITEMS = [
  { id: '1', nome: 'Sacola Surpresa - Padaria Central', preco: 'R$ 14,90', descricao: 'Pães artesanais, bolos e salgados do dia.' },
  { id: '2', nome: 'Sacola Doces - Confeitaria Real', preco: 'R$ 19,90', descricao: 'Tortas e doces variados selecionados.' },
  { id: '3', nome: 'Sacola Hortifruti - Mercado Verde', preco: 'R$ 12,00', descricao: 'Frutas e legumes frescos para consumo imediato.' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sacolas Disponíveis</Text>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/${item.id}`)}
          >
            <Text style={styles.title}>{item.nome}</Text>
            <Text style={styles.price}>{item.preco}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#2e7d32', marginTop: 4 },
});