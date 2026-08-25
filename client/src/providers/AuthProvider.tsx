"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/lib/api/auth.api";

import { setAccessToken } from "@/lib/api/client";
import type { User } from "@/lib/api/auth.api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;

  register: (name: string, email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;

  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevent multiple refresh requests during initialization.
  const initializationRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = (async () => {
        try {
          const refreshResponse = await refreshAccessToken();
          const accessToken = refreshResponse.data.accessToken;

          if (!accessToken) {
            setAccessToken(null);
            setUser(null);
            return;
          }

          setAccessToken(accessToken);

          const response = await getCurrentUser();
          setUser(response.data.user ?? null);
        } catch {
          setAccessToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    }

    void initializationRef.current;
  }, []);

  async function login(email: string, password: string) {
    const response = await loginUser({
      email,
      password,
    });

    const currentUser = response.data.user;

    if (currentUser) {
      setUser(currentUser);
      return;
    }

    const me = await getCurrentUser();

    setUser(me.data.user ?? null);
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerUser({
      name,
      email,
      password,
    });

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);

      setUser(response.data.user ?? null);

      return;
    }

    // Registration only creates the account.
    // User will sign in separately.
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }

  async function refresh() {
    const response = await refreshAccessToken();

    const accessToken = response.data.accessToken;

    if (!accessToken) {
      throw new Error("Unable to refresh session");
    }

    setAccessToken(accessToken);

    const me = await getCurrentUser();

    setUser(me.data.user ?? null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
