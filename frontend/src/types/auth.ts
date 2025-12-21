export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  token: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface PublicUser {
  id: number;
  email: string;
  username: string;
}

export interface RegisterResponse {
  publicUser: {
    id: number;
    email: string;
    username: string;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
