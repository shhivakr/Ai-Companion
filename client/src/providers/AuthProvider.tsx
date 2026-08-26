"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

const CURRENT_USER_QUERY_KEY = ["auth", "me"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const initializationRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = initializeAuth();
    }

    void initializationRef.current;
  }, []);

  async function initializeAuth() {
    try {
      const refreshResponse = await refreshAccessToken();

      const accessToken = refreshResponse.data.accessToken;

      if (!accessToken) {
        clearAuthState();
        return;
      }

      setAccessToken(accessToken);

      const response = await getCurrentUser();

      const currentUser = response.data.user ?? null;

      setUser(currentUser);

      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, currentUser);
    } catch {
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }

  function clearAuthState() {
    setAccessToken(null);
    setUser(null);

    queryClient.removeQueries({
      queryKey: CURRENT_USER_QUERY_KEY,
    });
  }

  async function login(email: string, password: string) {
    const response = await loginUser({
      email,
      password,
    });

    const currentUser = response.data.user;

    if (currentUser) {
      setUser(currentUser);

      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, currentUser);

      return;
    }

    const me = await getCurrentUser();

    const userFromApi = me.data.user ?? null;

    setUser(userFromApi);

    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, userFromApi);
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerUser({
      name,
      email,
      password,
    });

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);

      const currentUser = response.data.user ?? null;

      setUser(currentUser);

      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, currentUser);

      return;
    }

    // Registration creates the account.
    // The user signs in separately.
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      clearAuthState();
    }
  }

  async function refresh() {
    const response = await refreshAccessToken();

    const accessToken = response.data.accessToken;

    if (!accessToken) {
      clearAuthState();

      throw new Error("Unable to refresh session");
    }

    setAccessToken(accessToken);

    const me = await getCurrentUser();

    const currentUser = me.data.user ?? null;

    setUser(currentUser);

    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, currentUser);
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
