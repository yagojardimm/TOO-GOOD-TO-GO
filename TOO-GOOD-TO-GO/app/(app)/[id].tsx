import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ITEMS } from './index';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams();
  const item = ITEMS.find((i) => i.id === String(id));

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>ID do Item: {id}</Text>
      {item ? (
        <>
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.price}>{item.preco}</Text>
          <Text style={styles.desc}>{item.descricao}</Text>
        </>
      ) : (
        <Text style={styles.title}>Item não encontrado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  badge: { fontSize: 14, color: '#777', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  price: { fontSize: 18, color: '#2e7d32', fontWeight: 'bold', marginBottom: 12 },
  desc: { fontSize: 16, textAlign: 'center', color: '#444' },
});