
import { EncryptedUser, UserProfile, ApiResponse } from '../types';
import { encryptData, decryptData } from './cryptoService';
import { generateMockJWT } from './authService';

const DB_KEY = 'secure_id_user_db';

const getDB = (): EncryptedUser[] => {
  const db = localStorage.getItem(DB_KEY);
  return db ? JSON.parse(db) : [];
};

const saveDB = (db: EncryptedUser[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const register = async (email: string, password: string, fullName: string, idNumber: string): Promise<ApiResponse<{user: UserProfile, token: string}>> => {
  try {
    const db = getDB();
    if (db.find(u => u.email === email)) {
      return { success: false, error: "User already exists" };
    }

    const passwordHash = btoa(password);
    // Securely encrypt the Aadhaar/ID Number at rest using AES-256
    const encryptedId = await encryptData(idNumber);

    const newUser: EncryptedUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      fullName,
      encryptedId,
      createdAt: new Date().toISOString()
    };

    db.push(newUser);
    saveDB(db);

    const profile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      idNumber: idNumber,
      createdAt: newUser.createdAt
    };

    return { 
      success: true, 
      data: { user: profile, token: generateMockJWT(profile) } 
    };
  } catch (err) {
    return { success: false, error: "Registration failure" };
  }
};

export const login = async (email: string, password: string): Promise<ApiResponse<{user: UserProfile, token: string}>> => {
  try {
    const db = getDB();
    const user = db.find(u => u.email === email && u.passwordHash === btoa(password));
    
    if (!user) return { success: false, error: "Invalid credentials" };

    // Decrypt the Aadhaar/ID number before sending to the client
    const decryptedId = await decryptData(user.encryptedId);

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      idNumber: decryptedId,
      createdAt: user.createdAt
    };

    return { 
      success: true, 
      data: { user: profile, token: generateMockJWT(profile) } 
    };
  } catch (err) {
    return { success: false, error: "Auth failure" };
  }
};

export const fetchProfile = async (userId: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const db = getDB();
    const user = db.find(u => u.id === userId);
    if (!user) return { success: false, error: "User not found" };

    const decryptedId = await decryptData(user.encryptedId);
    
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        idNumber: decryptedId,
        createdAt: user.createdAt
      }
    };
  } catch (e) {
    return { success: false, error: "Fetch failure" };
  }
};
