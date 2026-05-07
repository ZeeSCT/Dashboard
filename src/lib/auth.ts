"use client";

const SESSION_KEY = "scientechnic_session";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

const DEFAULT_EMAIL = "admin@scientechnic.local";
const DEFAULT_PASSWORD = "Admin@123";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthSession {
  token: string;
  accessToken: string;
  tokenType: string;
  user: AuthUser;
  isLocalFallback?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface BackendAuthResponse {
  accessToken: string;
  tokenType?: string;
  user: AuthUser;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function writeSession(session: AuthSession): void {
  if (!isBrowser()) return;

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function createDefaultLocalSession(): AuthSession {
  return {
    token: "local-dev-token",
    accessToken: "local-dev-token",
    tokenType: "Bearer",
    isLocalFallback: true,
    user: {
      id: "local-admin",
      name: "Admin User",
      email: DEFAULT_EMAIL,
      role: "SUPER_ADMIN",
    },
  };
}

function normalizeBackendSession(data: BackendAuthResponse): AuthSession {
  return {
    token: data.accessToken,
    accessToken: data.accessToken,
    tokenType: data.tokenType || "Bearer",
    user: data.user,
  };
}

async function parseAuthResponse(response: Response): Promise<AuthSession> {
  const text = await response.text();

  let data: unknown = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Unexpected response",
    };
  }

  if (!response.ok) {
    const errorData = data as {
      message?: string | string[];
      error?: string;
    };

    const message = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || errorData.error || "Authentication failed";

    throw new Error(message);
  }

  return normalizeBackendSession(data as BackendAuthResponse);
}

export function seedUsersIfMissing(): void {
  // No longer needed for backend auth.
  // Kept only so older imports do not break.
}

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;

  /**
   * Temporary fallback login.
   * This allows local login even before backend DB auth is ready.
   */
  
 
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const session = await parseAuthResponse(response);
  writeSession(session);

  return session;
}
 
export async function registerUser(
  payload: RegisterPayload
): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const session = await parseAuthResponse(response);
  writeSession(session);

  return session;
}

export function getSession(): AuthSession | null {
  if (!isBrowser()) return null;

  try {
    const rawSession = localStorage.getItem(SESSION_KEY);

    if (!rawSession) return null;

    return JSON.parse(rawSession) as AuthSession;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(SESSION_KEY);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const session = localStorage.getItem(SESSION_KEY);

    if (!session) return null;

    const parsed = JSON.parse(session);

    return parsed.accessToken || parsed.token || null;
  } catch {
    return null;
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}