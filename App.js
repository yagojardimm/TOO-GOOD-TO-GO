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

export default function App() {
  const [currentTab, setCurrentTab] = useState('explore');
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main', 'details', 'checkout', 'success'
  const [selectedBag, setSelectedBag] = useState(null);

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
          onSuccess={() => {
            setCurrentScreen('success');
          }}
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
        return <OrdersScreen />;
      case 'impact':
        return <ProfileScreen />;
      case 'partner':
        return <PartnerScreen />;
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
    backgroundColor: '#f9fafb',
  },
});
