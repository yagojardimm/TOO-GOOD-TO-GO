import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../services/storage';

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  role: 'consumer' | 'partner';
}

interface StoredAccount extends UserData {
  password: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'consumer' | 'partner';
}

interface AuthContextData {
  user: UserData | null;
  savedEmail: string;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  signIn: (
    email?: string,
    password?: string,
    rememberEmail?: boolean
  ) => Promise<AuthResult>;
  signUp: (payload: SignUpPayload) => Promise<AuthResult>;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const DEFAULT_USER: UserData = {
  name: 'Yago Jardim',
  email: 'usuario@savefood.app',
  phone: '(11) 99999-8888',
  role: 'consumer',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [savedEmail, setSavedEmail] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const [storedUser, remembered] = await Promise.all([
        getStorageItem<UserData | null>(STORAGE_KEYS.USER, null),
        getStorageItem<string>(STORAGE_KEYS.SAVED_EMAIL, ''),
      ]);

      if (storedUser) {
        setUser(storedUser);
      }
      if (remembered) {
        setSavedEmail(remembered);
      }
      setIsLoadingAuth(false);
    }

    restoreSession();
  }, []);

  async function signIn(
    email?: string,
    password?: string,
    rememberEmail = false
  ): Promise<AuthResult> {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      setUser(DEFAULT_USER);
      await setStorageItem(STORAGE_KEYS.USER, DEFAULT_USER);
      return { ok: true };
    }

    const accounts = await getStorageItem<StoredAccount[]>(STORAGE_KEYS.USERS, []);
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (existing && password && existing.password !== password) {
      return { ok: false, error: 'Senha incorreta para este e-mail.' };
    }

    const loggedUser: UserData = existing
      ? {
          name: existing.name,
          email: existing.email,
          phone: existing.phone,
          role: existing.role,
        }
      : {
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '',
          role: 'consumer',
        };

    setUser(loggedUser);
    await setStorageItem(STORAGE_KEYS.USER, loggedUser);

    if (rememberEmail) {
      setSavedEmail(cleanEmail);
      await setStorageItem(STORAGE_KEYS.SAVED_EMAIL, cleanEmail);
    } else {
      setSavedEmail('');
      await removeStorageItem(STORAGE_KEYS.SAVED_EMAIL);
    }

    return { ok: true };
  }

  async function signUp(payload: SignUpPayload): Promise<AuthResult> {
    const cleanEmail = payload.email.trim().toLowerCase();
    const accounts = await getStorageItem<StoredAccount[]>(STORAGE_KEYS.USERS, []);

    if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newAccount: StoredAccount = {
      name: payload.name.trim(),
      email: cleanEmail,
      phone: payload.phone?.trim() || '',
      password: payload.password,
      role: payload.role || 'consumer',
    };

    const updatedAccounts = [...accounts, newAccount];
    await setStorageItem(STORAGE_KEYS.USERS, updatedAccounts);

    const sessionUser: UserData = {
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: newAccount.role,
    };

    setUser(sessionUser);
    await setStorageItem(STORAGE_KEYS.USER, sessionUser);

    return { ok: true };
  }

  async function updateProfile(data: { name?: string; phone?: string }) {
    if (!user) return;

    const updatedUser: UserData = {
      ...user,
      name: data.name !== undefined ? data.name.trim() : user.name,
      phone: data.phone !== undefined ? data.phone.trim() : user.phone,
    };

    setUser(updatedUser);
    await setStorageItem(STORAGE_KEYS.USER, updatedUser);

    const accounts = await getStorageItem<StoredAccount[]>(STORAGE_KEYS.USERS, []);
    const updatedAccounts = accounts.map((acc) =>
      acc.email.toLowerCase() === updatedUser.email.toLowerCase()
        ? { ...acc, name: updatedUser.name, phone: updatedUser.phone }
        : acc
    );
    await setStorageItem(STORAGE_KEYS.USERS, updatedAccounts);
  }

  async function resetPassword(
    email: string,
    newPassword: string
  ): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = await getStorageItem<StoredAccount[]>(STORAGE_KEYS.USERS, []);
    const exists = accounts.some((acc) => acc.email.toLowerCase() === cleanEmail);

    if (exists) {
      const updated = accounts.map((acc) =>
        acc.email.toLowerCase() === cleanEmail
          ? { ...acc, password: newPassword }
          : acc
      );
      await setStorageItem(STORAGE_KEYS.USERS, updated);
    }

    return { ok: true };
  }

  async function signOut() {
    setUser(null);
    await removeStorageItem(STORAGE_KEYS.USER);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        savedEmail,
        isAuthenticated: !!user,
        isLoadingAuth,
        signIn,
        signUp,
        updateProfile,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
