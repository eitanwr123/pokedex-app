import type { LoginRequest, LoginResponse, PublicUser } from "../types";
import { apiClient } from "./api";

export async function login(credentials: LoginRequest): Promise<PublicUser> {
  const response = await apiClient.post("/api/auth/login", credentials);
  const data = response.data.data;

  localStorage.setItem("auth_token", data.token);

  const userData = {
    id: data.id,
    email: data.email,
    username: data.username,
  };
  localStorage.setItem("user", JSON.stringify(userData));

  return userData;
}
