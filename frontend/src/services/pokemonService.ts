import type { PaginationAndFilterParams } from "../schemas/pokemonFilterParamsSchem";
import type { PaginatedResponse, Pokemon, UserPokemon } from "../types";
import { apiClient } from "./api";

export async function getAllPokemon(
  params?: PaginationAndFilterParams
): Promise<PaginatedResponse<Pokemon>> {
  const response = await apiClient.get<PaginatedResponse<Pokemon>>(
    "/api/pokemon",
    { params }
  );
  return response.data;
}

export async function getPokemonById(
  id: number
): Promise<{ pokemon: Pokemon }> {
  const response = await apiClient.get<{ pokemon: Pokemon }>(
    `/api/pokemon/${id}`
  );
  return response.data;
}

export async function getUserCollection(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Pokemon>> {
  const response = await apiClient.get<PaginatedResponse<Pokemon>>(
    "/api/me/collection",
    { params }
  );
  return response.data;
}

export async function togglePokemon(
  pokemonId: number
): Promise<{ message: UserPokemon }> {
  const response = await apiClient.post<{ message: UserPokemon }>(
    `/api/me/collection/${pokemonId}/toggle`
  );
  return response.data;
}

export async function getTotalPokemonCount(): Promise<{ total: number }> {
  const response = await apiClient.get<{ total: number }>("/api/pokemon/count");
  return response.data;
}
