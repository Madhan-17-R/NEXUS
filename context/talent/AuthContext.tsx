'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '@/types/talent';
import {
  initAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateUserProfile as firebaseUpdateUserProfile,
} from '@/lib/talent/firebase/auth';
import { getAppliedJobIds } from '@/lib/talent/firebase/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  appliedJobIds: Set<string>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAppliedJobs: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const refreshAppliedJobs = useCallback(() => {
    if (user) {
      setAppliedJobIds(getAppliedJobIds(user.uid));
    } else {
      setAppliedJobIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    initAuth();

    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        setAppliedJobIds(getAppliedJobIds(authUser.uid));
      } else {
        setAppliedJobIds(new Set());
      }
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(email, password, displayName, 'job_seeker');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const updated = await firebaseUpdateUserProfile(updates);
    setUser(updated);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        appliedJobIds,
        signIn,
        register,
        updateProfile,
        signOut,
        refreshAppliedJobs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}