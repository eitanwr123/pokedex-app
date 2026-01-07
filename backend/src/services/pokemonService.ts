import { IPokemonRepository } from "../repositories/interfaces/IPokemonRepository";
import { PaginatedResponse } from "../schemas/pagination";
import { Pokemon } from "../db/schema";
import { PokemonQuery } from "../schemas/filterSchema";

export class PokemonService {
  constructor(private _pokemonRepository: IPokemonRepository) {}

  async getAllPokemon(
    query: PokemonQuery
  ): Promise<PaginatedResponse<Pokemon>> {
    const offset = (query.page - 1) * query.limit;

    const { pokemon, total } = await this._pokemonRepository.findAllPokemon(
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
  }

  async getPokemonById(pokemonId: number): Promise<Pokemon | null> {
    const pokemon = await this._pokemonRepository.findPokemonById(pokemonId);
    return pokemon;
  }

  async getAllTypes(): Promise<string[]> {
    const types = await this._pokemonRepository.getAllUniqueTypes();
    return types;
  }

  async getTotalPokemonCount(): Promise<number> {
    const totalCount = await this._pokemonRepository.getTotalPokemonCount();
    return totalCount;
  }
}
