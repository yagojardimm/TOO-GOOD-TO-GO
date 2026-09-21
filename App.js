import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';

import BottomNav from './src/components/BottomNav';
import ExploreScreen from './src/screens/yago/ExploreScreen';
import BagDetailsScreen from './src/screens/yago/BagDetailsScreen';
import CheckoutScreen from './src/screens/yago/CheckoutScreen';
import OrderSuccessScreen from './src/screens/yago/OrderSuccessScreen';
import OrdersScreen from './src/screens/caio/OrdersScreen';
import ProfileScreen from './src/screens/caio/ProfileScreen';
import PartnerScreen from './src/screens/caio/PartnerScreen';
import { MOCK_ORDERS, MOCK_USER_IMPACT } from './src/data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('explore');
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main', 'details', 'checkout', 'success'
  const [selectedBag, setSelectedBag] = useState(null);

  // Estados compartilhados de pedidos e métricas do usuário
  const [ordersList, setOrdersList] = useState(MOCK_ORDERS);
  const [impactData, setImpactData] = useState(MOCK_USER_IMPACT);

  // Manipulador de resgate concluído no balcão
  const handleOrderRedeemed = (redeemedOrder) => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === redeemedOrder.id
          ? {
              ...o,
              status: 'completed',
              date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    );

    setImpactData((prev) => ({
      ...prev,
      mealsSaved: prev.mealsSaved + (redeemedOrder.quantity || 1),
      moneySaved: prev.moneySaved + (redeemedOrder.savedAmount || 38.10),
      co2SavedKg: prev.co2SavedKg + (redeemedOrder.co2SavedKg || 2.5),
      waterSavedLiters: prev.waterSavedLiters + 300,
    }));
  };

  // Manipulador de nova compra aprovada no checkout
  const handleCheckoutSuccess = () => {
    if (selectedBag) {
      const saved = (selectedBag.originalPrice || 58) - (selectedBag.price || 19.9);
      const newOrder = {
        id: 'ord-' + Date.now(),
        voucherCode: 'SF-' + Math.floor(1000 + Math.random() * 9000),
        storeName: selectedBag.storeName,
        storeAvatar: selectedBag.storeAvatar,
        coverImage: selectedBag.coverImage,
        bagTitle: selectedBag.bagTitle,
        categoryLabel: selectedBag.categoryLabel,
        address: selectedBag.address,
        pickupWindow: selectedBag.pickupWindow,
        date: 'Hoje',
        price: selectedBag.price,
        originalPrice: selectedBag.originalPrice,
        savedAmount: saved > 0 ? saved : 38.10,
        quantity: 1,
        status: 'active',
        co2SavedKg: 2.5,
        secondsLeft: 5400,
      };

      setOrdersList([newOrder, ...ordersList]);
    }
    setCurrentScreen('success');
  };

  const renderContent = () => {
    if (currentScreen === 'details' && selectedBag) {
      return (
        <BagDetailsScreen
          bag={selectedBag}
          onBack={() => setCurrentScreen('main')}
          onProceedToCheckout={() => setCurrentScreen('checkout')}
        />
      );
    }

    if (currentScreen === 'checkout' && selectedBag) {
      return (
        <CheckoutScreen
          bag={selectedBag}
          onBack={() => setCurrentScreen('details')}
          onSuccess={handleCheckoutSuccess}
        />
      );
    }

    if (currentScreen === 'success') {
      return (
        <OrderSuccessScreen
          bag={selectedBag}
          onGoToOrders={() => {
            setCurrentScreen('main');
            setCurrentTab('orders');
          }}
          onGoHome={() => {
            setCurrentScreen('main');
            setCurrentTab('explore');
          }}
        />
      );
    }

    switch (currentTab) {
      case 'explore':
        return (
          <ExploreScreen
            onSelectBag={(bag) => {
              setSelectedBag(bag);
              setCurrentScreen('details');
            }}
          />
        );
      case 'orders':
        return (
          <OrdersScreen
            orders={ordersList}
            onNavigateHome={() => {
              setCurrentScreen('main');
              setCurrentTab('explore');
            }}
            onOrderRedeemed={handleOrderRedeemed}
          />
        );
      case 'impact':
        return <ProfileScreen impactData={impactData} />;
      case 'partner':
        return (
          <PartnerScreen
            onBagCreated={(newBag) => {
              // Nova sacola cadastrada pelo parceiro pode sincronizar se necessário
            }}
          />
        );
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>{renderContent()}</View>
      {currentScreen === 'main' && (
        <BottomNav
          activeTab={currentTab}
          onTabChange={(tab) => {
            setCurrentScreen('main');
            setCurrentTab(tab);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
