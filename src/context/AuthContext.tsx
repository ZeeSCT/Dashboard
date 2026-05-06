"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthSession,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  getSession,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/auth";

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    setLoading(false);
  }, []);

  async function login(payload: LoginPayload): Promise<AuthSession> {
    const newSession = await loginUser(payload);
    setSession(newSession);
    return newSession;
  }

  async function register(payload: RegisterPayload): Promise<AuthSession> {
    const newSession = await registerUser(payload);
    setSession(newSession);
    return newSession;
  }

  function logout(): void {
    logoutUser();
    setSession(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      loading,
      login,
      register,
      logout,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}