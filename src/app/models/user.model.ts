export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLogin?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}