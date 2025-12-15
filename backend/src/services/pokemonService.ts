import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";
import { PaginatedResponse } from "../schemas/pagination";
import { Pokemon } from "../db/schema";
import { PokemonQuery } from "../schemas/filterSchema";

export const getAllPokemonService = async (
  query: PokemonQuery
): Promise<PaginatedResponse<Pokemon>> => {
  const pokemonRepository = new PokemonRepositoryImpl();

  const offset = (query.page - 1) * query.limit;

  const { pokemon, total } = await pokemonRepository.findAllPokemon(
    offset,
    query.limit,
    query.type,
    query.name,
    query.evolutionTier,
    query.description
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
