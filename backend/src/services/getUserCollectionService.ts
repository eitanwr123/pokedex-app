import { Pokemon } from "../db/schema";
import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";
import { PaginatedResponse, PaginationParams } from "../schemas/pagination";

export interface UserCollectionQuery extends PaginationParams {
  userId: number;
}

export const getUserCollectionService = async (
  query: UserCollectionQuery
): Promise<PaginatedResponse<Pokemon>> => {
  const pokemonRepository = new PokemonRepositoryImpl();

  const offset = (query.page - 1) * query.limit;

  const { pokemon, total } = await pokemonRepository.findPokemonByUserId(
    query.userId,
    offset,
    query.limit
  );

  const totalPages = Math.ceil(total / query.limit);

  return {
    data: pokemon,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};
