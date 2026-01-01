import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PublicUser, LoginRequest } from "../types";
import { login as loginService } from "../services/auth";
import { getUserCollection } from "../services/pokemonService";

interface AuthContextType {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
  loginError: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_QUERY_KEY = ["auth", "user"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        return null;
      }

      try {
        await getUserCollection();
        return JSON.parse(userStr) as PublicUser;
      } catch (error) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        throw new Error("Invalid or expired token");
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const userData = await loginService(credentials);
      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, userData);
    },
    onError: (error) => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      console.error("Login failed:", error);
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.clear();
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    error: error ?? null,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ?? null,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
