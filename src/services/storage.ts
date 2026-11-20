import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USER: '@savefood:user',
  USERS: '@savefood:users',
  SAVED_EMAIL: '@savefood:saved_email',
  BAGS: '@savefood:bags',
  ORDERS: '@savefood:orders',
  FAVORITES: '@savefood:favorites',
  ADDRESSES: '@savefood:addresses',
  IMPACT: '@savefood:impact',
  PREFERENCES: '@savefood:preferences',
} as const;

export async function getStorageItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Erro ao ler dados do AsyncStorage:', key, error);
    return fallback;
  }
}

export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Erro ao salvar dados no AsyncStorage:', key, error);
  }
}

export async function removeStorageItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Erro ao remover item do AsyncStorage:', key, error);
  }
}
