import { createContext, useContext, type ReactNode, useCallback } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_QUERY_KEY = ["auth", "user"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<PublicUser | null, Error>({
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
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.clear();
  }, [queryClient]);

  const isAuthenticated = !!user;

  const value = {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    error: error as Error | null,
    login,
    logout,
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
