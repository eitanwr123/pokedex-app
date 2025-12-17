/**
 * API Client Configuration
 *
 * This is the base axios instance with:
 * - Base URL configuration
 * - Request interceptors (add auth token to every request)
 * - Response interceptors (handle errors globally)
 *
 * PRODUCTION PATTERN: All API calls go through this configured instance.
 */

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "../types";

// Base URL - in production, this comes from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 *
 * This runs BEFORE every API request.
 * Use it to add auth tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    // Add token to Authorization header if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * This runs AFTER every API response.
 * Use it to handle errors globally.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Just return the data if successful
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        // In a real app, you'd redirect here
        // window.location.href = '/login';
      }

      if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error("Forbidden: You do not have permission");
      }

      if (status >= 500) {
        // Server error
        console.error("Server error:", data);
      }

      // Return the error data so we can handle it in components
      return Promise.reject(data);
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        error: "Network Error",
        message: "No response from server. Check your internet connection.",
      } as ApiError);
    } else {
      // Something else happened
      return Promise.reject({
        error: "Request Error",
        message: error.message,
      } as ApiError);
    }
  }
);
