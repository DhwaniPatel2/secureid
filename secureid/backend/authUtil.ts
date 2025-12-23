
/**
 * AI-ASSISTED TASK: JWT Token Validation Utility
 * This utility simulates the backend middleware for stateless authentication.
 */

export const signToken = (payload: object): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  }));
  const signature = "backend-secret-signature"; // Simulated HMAC-SHA256
  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token: string): boolean => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Check expiration
    if (payload.exp && now > payload.exp) return false;
    
    return true;
  } catch (e) {
    return false;
  }
};

export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
