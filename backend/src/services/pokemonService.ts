import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";
import { PaginatedResponse } from "../schemas/pagination";
import { Pokemon } from "../db/schema";

export const getAllPokemonService = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<Pokemon>> => {
  const pokemonRepository = new PokemonRepositoryImpl();

  const offset = (page - 1) * limit;

  const { pokemon, total } = await pokemonRepository.findAllPokemon(
    offset,
    limit
  );

  const totalPages = Math.ceil(total / limit);

  return {
    data: pokemon,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
