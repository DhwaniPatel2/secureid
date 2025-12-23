
/**
 * BACKEND UTILITY: AES-256-GCM Encryption
 * This simulates the backend encryption logic for the Identity Microservice.
 */

const MASTER_KEY = "secure-id-microservice-key-2025-!"; // 32-byte master key

const getDerivedKey = async (): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(MASTER_KEY),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("backend-static-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptAtRest = async (text: string): Promise<string> => {
  const enc = new TextEncoder();
  const key = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
};

export const decryptFromRest = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getDerivedKey();
    const combined = new Uint8Array(
      atob(encryptedBase64).split("").map((c) => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error("Backend Decryption Logic Failed: Check Integrity");
  }
};
