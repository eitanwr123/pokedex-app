/**
 * Authentication Types
 */

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response from API
export interface LoginResponse {
  user: User;
  token: string;
}

// Register request payload
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// Register response from API
export interface RegisterResponse {
  user: User;
  token: string;
}

// API Error Response
export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
