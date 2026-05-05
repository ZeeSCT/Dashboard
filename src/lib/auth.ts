'use client';

const USERS_KEY = 'scientechnic_users';
const SESSION_KEY = 'scientechnic_session';

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
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

const defaultUser: StoredUser = {
  name: 'Admin User',
  email: 'admin@scientechnic.local',
  password: 'Admin@123',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];

  try {
    const rawUsers = localStorage.getItem(USERS_KEY);
    return rawUsers ? (JSON.parse(rawUsers) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(session: AuthSession): void {
  if (!isBrowser()) return;

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function seedUsersIfMissing(): void {
  if (!isBrowser()) return;

  const existing = localStorage.getItem(USERS_KEY);

  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
  }
}

export function registerUser({
  name,
  email,
  password,
}: RegisterPayload): AuthSession {
  seedUsersIfMissing();

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const exists = users.some(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (exists) {
    throw new Error('This email is already registered.');
  }

  const user: StoredUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
  };

  users.push(user);
  writeUsers(users);

  const session: AuthSession = {
    token: `local-token-${Date.now()}`,
    user: {
      name: user.name,
      email: user.email,
    },
  };

  writeSession(session);

  return session;
}

export function loginUser({ email, password }: LoginPayload): AuthSession {
  seedUsersIfMissing();

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const session: AuthSession = {
    token: `local-token-${Date.now()}`,
    user: {
      name: user.name,
      email: user.email,
    },
  };

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