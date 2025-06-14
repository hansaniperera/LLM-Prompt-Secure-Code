import { User } from './user.model';

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  expiresIn?: number;
}

export interface ApiError {
  error: boolean;
  message: string;
  status: number;
}