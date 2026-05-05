'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AuthSession,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  getSession,
  loginUser,
  logoutUser,
  registerUser,
  seedUsersIfMissing,
} from '@/lib/auth';

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => AuthSession;
  register: (payload: RegisterPayload) => AuthSession;
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
    seedUsersIfMissing();

    const currentSession = getSession();
    setSession(currentSession);

    setLoading(false);
  }, []);

  function login(payload: LoginPayload): AuthSession {
    const newSession = loginUser(payload);
    setSession(newSession);
    return newSession;
  }

  function register(payload: RegisterPayload): AuthSession {
    const newSession = registerUser(payload);
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
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}