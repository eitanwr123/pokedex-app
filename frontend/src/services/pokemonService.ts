import type { PaginationAndFilterParams } from "../schemas/pokemonFilterParamsSchem";
import type {
  PaginatedResponse,
  Pokemon,
  UserCollectionResponse,
  UserPokemon,
} from "../types";
import { apiClient } from "./api";

/**
 * Get all Pokemon with optional pagination and filters
 *
 * @param params - Optional query parameters for pagination and filtering
 * @returns Promise with paginated Pokemon list
 */
export async function getAllPokemon(
  params?: PaginationAndFilterParams
): Promise<PaginatedResponse<Pokemon>> {
  const response = await apiClient.get<PaginatedResponse<Pokemon>>(
    "/api/pokemon",
    { params }
  );
  return response.data;
}

/**
 * Get a single Pokemon by ID
 *
 * @param id - Pokemon ID
 * @returns Promise with Pokemon details
 */
export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await apiClient.get<Pokemon>(`/api/pokemon/${id}`);
  return response.data;
}

/**
 * Get user's Pokemon collection
 *
 * @returns Promise with user's caught Pokemon
 */
export async function getUserCollection(): Promise<UserCollectionResponse> {
  const response = await apiClient.get<UserCollectionResponse>(
    "/api/me/collection"
  );
  return response.data;
}

/**
 * Catch or release a Pokemon
 *
 * Automatically catches pre-evolutions if not already caught
 *
 * @param pokemonId - Pokemon ID to catch/release
 * @returns Promise with catch/release result
 */
export async function toggleCatchPokemon(
  pokemonId: number
): Promise<{ message: UserPokemon }> {
  const response = await apiClient.post<{ message: UserPokemon }>(
    `/api/me/collection/${pokemonId}/toggle`
  );
  return response.data;
}
