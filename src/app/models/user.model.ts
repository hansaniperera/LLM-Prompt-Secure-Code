export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}