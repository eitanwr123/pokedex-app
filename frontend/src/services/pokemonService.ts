import type { PaginationAndFilterParams } from "../schemas/pokemonFilterParamsSchem";
import type {
  PaginatedResponse,
  Pokemon,
  UserCollectionResponse,
  UserPokemon,
} from "../types";
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

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await apiClient.get<Pokemon>(`/api/pokemon/${id}`);
  return response.data;
}

export async function getUserCollection(): Promise<UserCollectionResponse> {
  const response = await apiClient.get<UserCollectionResponse>(
    "/api/me/collection"
  );
  return response.data;
}

export async function toggleCatchPokemon(
  pokemonId: number
): Promise<{ message: UserPokemon }> {
  const response = await apiClient.post<{ message: UserPokemon }>(
    `/api/me/collection/${pokemonId}/toggle`
  );
  return response.data;
}
