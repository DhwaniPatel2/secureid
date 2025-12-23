
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  idNumber: string; // Decrypted Aadhaar/ID Number
  createdAt: string;
}

export interface EncryptedUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  encryptedId: string; // Aadhaar/ID Number encrypted with AES-256
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
