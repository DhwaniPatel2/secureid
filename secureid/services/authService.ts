
import { UserProfile } from '../types';

const TOKEN_KEY = 'secure_id_jwt';
const USER_KEY = 'secure_id_current_user';
const KNOWN_EMAILS_KEY = 'secure_id_known_emails';

/**
 * AI-Assisted Utility: Token Validation
 * This logic mimics a backend JWT validation process.
 */
export const validateToken = (token: string): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // to ms
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
};

/**
 * Creates a mock JWT
 */
export const generateMockJWT = (user: UserProfile): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.fullName,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  }));
  const signature = "mock-signature"; // In a real scenario, this would be computed
  return `${header}.${payload}.${signature}`;
};

export const saveKnownEmail = (email: string) => {
  const emails = getKnownEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem(KNOWN_EMAILS_KEY, JSON.stringify(emails));
  }
};

export const getKnownEmails = (): string[] => {
  const stored = localStorage.getItem(KNOWN_EMAILS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const loginUser = (user: UserProfile, token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  saveKnownEmail(user.email);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): UserProfile | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || !validateToken(token)) {
    logout();
    return null;
  }
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
