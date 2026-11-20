import { Slot } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppProvider } from '../src/contexts/AppContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <Slot />
      </AppProvider>
    </AuthProvider>
  );
}
