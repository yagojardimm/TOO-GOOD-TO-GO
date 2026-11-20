import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  MOCK_ADDRESSES,
  MOCK_BAGS,
  MOCK_ORDERS,
  MOCK_USER_IMPACT,
} from '../data/mockData';
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../services/storage';

export interface BagItem {
  id: string;
  storeName: string;
  storeAvatar: string;
  coverImage: string;
  category: string;
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  bagTitle: string;
  bagDescription: string;
  originalPrice: number;
  price: number;
  discountPercentage: number;
  pickupWindow: string;
  remainingItems: number;
  pickupRules: string[];
}

export interface OrderItem {
  id: string;
  voucherCode: string;
  bagId?: string;
  storeName: string;
  storeAvatar: string;
  coverImage: string;
  bagTitle: string;
  categoryLabel: string;
  address: string;
  pickupWindow: string;
  date: string;
  price: number;
  originalPrice: number;
  savedAmount: number;
  quantity: number;
  paymentMethod?: string;
  status: 'active' | 'completed' | 'cancelled';
  rating?: number;
  co2SavedKg: number;
  secondsLeft?: number;
}

export interface AddressItem {
  id: string;
  label: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  isDefault?: boolean;
}

export interface ImpactData {
  userName: string;
  userEmail: string;
  avatar: string;
  mealsSaved: number;
  moneySaved: number;
  co2SavedKg: number;
  waterSavedLiters: number;
  currentLevel: number;
  levelTitle: string;
  nextLevelMeals: number;
  badges: Array<{
    id: string;
    title: string;
    desc: string;
    icon: string;
    unlocked: boolean;
  }>;
}

interface AppContextData {
  bags: BagItem[];
  orders: OrderItem[];
  favorites: string[];
  addresses: AddressItem[];
  impact: ImpactData;
  preferences: string[];
  isLoadingData: boolean;
  toggleFavorite: (bagId: string) => void;
  isFavorite: (bagId: string) => boolean;
  createOrder: (
    bag: BagItem,
    quantity: number,
    paymentMethod: string
  ) => OrderItem;
  redeemOrder: (orderIdOrCode: string) => OrderItem | null;
  addBag: (newBag: BagItem) => void;
  addAddress: (address: Omit<AddressItem, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  togglePreference: (pref: string) => void;
}

const DEFAULT_PREFS = ['Padaria & Pães', 'Frutas & Legumes'];

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bags, setBags] = useState<BagItem[]>(MOCK_BAGS);
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS as OrderItem[]);
  const [favorites, setFavorites] = useState<string[]>(['bag-1', 'bag-4']);
  const [addresses, setAddresses] = useState<AddressItem[]>(MOCK_ADDRESSES);
  const [impact, setImpact] = useState<ImpactData>(MOCK_USER_IMPACT);
  const [preferences, setPreferences] = useState<string[]>(DEFAULT_PREFS);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadAppData() {
      const [
        savedBags,
        savedOrders,
        savedFavs,
        savedAddresses,
        savedImpact,
        savedPrefs,
      ] = await Promise.all([
        getStorageItem<BagItem[]>(STORAGE_KEYS.BAGS, MOCK_BAGS),
        getStorageItem<OrderItem[]>(
          STORAGE_KEYS.ORDERS,
          MOCK_ORDERS as OrderItem[]
        ),
        getStorageItem<string[]>(STORAGE_KEYS.FAVORITES, ['bag-1', 'bag-4']),
        getStorageItem<AddressItem[]>(STORAGE_KEYS.ADDRESSES, MOCK_ADDRESSES),
        getStorageItem<ImpactData>(STORAGE_KEYS.IMPACT, MOCK_USER_IMPACT),
        getStorageItem<string[]>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFS),
      ]);

      setBags(savedBags);
      setOrders(savedOrders);
      setFavorites(savedFavs);
      setAddresses(savedAddresses);
      setImpact(savedImpact);
      setPreferences(savedPrefs);
      setIsLoadingData(false);
    }

    loadAppData();
  }, []);

  function toggleFavorite(bagId: string) {
    setFavorites((prev) => {
      const updated = prev.includes(bagId)
        ? prev.filter((id) => id !== bagId)
        : [...prev, bagId];
      setStorageItem(STORAGE_KEYS.FAVORITES, updated);
      return updated;
    });
  }

  function isFavorite(bagId: string) {
    return favorites.includes(bagId);
  }

  function createOrder(
    bag: BagItem,
    quantity: number,
    paymentMethod: string
  ): OrderItem {
    const unitSaved = Math.max(0, (bag.originalPrice || 50) - (bag.price || 19.9));
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      voucherCode: `SF-${Math.floor(1000 + Math.random() * 9000)}`,
      bagId: bag.id,
      storeName: bag.storeName,
      storeAvatar: bag.storeAvatar,
      coverImage: bag.coverImage,
      bagTitle: bag.bagTitle,
      categoryLabel: bag.categoryLabel,
      address: bag.address,
      pickupWindow: bag.pickupWindow,
      date: 'Hoje',
      price: Number((bag.price * quantity).toFixed(2)),
      originalPrice: Number((bag.originalPrice * quantity).toFixed(2)),
      savedAmount: Number((unitSaved * quantity).toFixed(2)),
      quantity,
      paymentMethod,
      status: 'active',
      co2SavedKg: Number((2.5 * quantity).toFixed(1)),
      secondsLeft: 5400,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      setStorageItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });

    setBags((prev) => {
      const updated = prev.map((item) =>
        item.id === bag.id
          ? { ...item, remainingItems: Math.max(0, item.remainingItems - quantity) }
          : item
      );
      setStorageItem(STORAGE_KEYS.BAGS, updated);
      return updated;
    });

    return newOrder;
  }

  function redeemOrder(orderIdOrCode: string): OrderItem | null {
    const clean = orderIdOrCode.trim().toUpperCase();
    const target = orders.find(
      (o) =>
        o.status === 'active' &&
        (o.id === orderIdOrCode || o.voucherCode.toUpperCase() === clean)
    );

    if (!target) {
      return null;
    }

    const nowTime = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedOrders: OrderItem[] = orders.map((o) =>
      o.id === target.id
        ? { ...o, status: 'completed', date: `Hoje às ${nowTime}` }
        : o
    );
    setOrders(updatedOrders);
    setStorageItem(STORAGE_KEYS.ORDERS, updatedOrders);

    const updatedImpact: ImpactData = {
      ...impact,
      mealsSaved: impact.mealsSaved + (target.quantity || 1),
      moneySaved: Number((impact.moneySaved + (target.savedAmount || 30)).toFixed(2)),
      co2SavedKg: Number((impact.co2SavedKg + (target.co2SavedKg || 2.5)).toFixed(1)),
      waterSavedLiters: impact.waterSavedLiters + 300 * (target.quantity || 1),
    };
    setImpact(updatedImpact);
    setStorageItem(STORAGE_KEYS.IMPACT, updatedImpact);

    return { ...target, status: 'completed', date: `Hoje às ${nowTime}` };
  }

  function addBag(newBag: BagItem) {
    setBags((prev) => {
      const updated = [newBag, ...prev];
      setStorageItem(STORAGE_KEYS.BAGS, updated);
      return updated;
    });
  }

  function addAddress(address: Omit<AddressItem, 'id'>) {
    setAddresses((prev) => {
      const shouldBeDefault = address.isDefault || prev.length === 0;
      const base = shouldBeDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      const updated: AddressItem[] = [
        { ...address, id: `addr-${Date.now()}`, isDefault: shouldBeDefault },
        ...base,
      ];
      setStorageItem(STORAGE_KEYS.ADDRESSES, updated);
      return updated;
    });
  }

  function removeAddress(id: string) {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0] = { ...updated[0], isDefault: true };
      }
      setStorageItem(STORAGE_KEYS.ADDRESSES, updated);
      return updated;
    });
  }

  function setDefaultAddress(id: string) {
    setAddresses((prev) => {
      const updated = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      setStorageItem(STORAGE_KEYS.ADDRESSES, updated);
      return updated;
    });
  }

  function togglePreference(pref: string) {
    setPreferences((prev) => {
      const updated = prev.includes(pref)
        ? prev.filter((item) => item !== pref)
        : [...prev, pref];
      setStorageItem(STORAGE_KEYS.PREFERENCES, updated);
      return updated;
    });
  }

  return (
    <AppContext.Provider
      value={{
        bags,
        orders,
        favorites,
        addresses,
        impact,
        preferences,
        isLoadingData,
        toggleFavorite,
        isFavorite,
        createOrder,
        redeemOrder,
        addBag,
        addAddress,
        removeAddress,
        setDefaultAddress,
        togglePreference,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
