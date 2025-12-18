import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }

      if (status === 403) {
        console.error("Forbidden: You do not have permission");
      }

      if (status >= 500) {
        console.error("Server error:", data);
      }

      return Promise.reject(data);
    } else if (error.request) {
      return Promise.reject({
        error: "Network Error",
        message: "No response from server. Check your internet connection.",
      } as ApiError);
    } else {
      return Promise.reject({
        error: "Request Error",
        message: error.message,
      } as ApiError);
    }
  }
);
