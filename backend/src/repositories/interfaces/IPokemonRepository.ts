import { Pokemon } from "../../db/schema";

export interface IPokemonRepository {
  findAllPokemon(
    offset: number,
    limit: number,
    type?: string,
    name?: string,
    evolutionTier?: number,
    description?: string
  ): Promise<{ pokemon: Pokemon[]; total: number }>;

  findPokemonById(id: number): Promise<Pokemon | null>;

  findPokemonByPokedexNumber(
    pokedexNumber: number
  ): Promise<Pokemon | undefined>;

  findPokemonByUserId(
    userId: number,
    offset: number,
    limit: number,
    type?: string,
    name?: string,
    evolutionTier?: number,
    description?: string
  ): Promise<{ pokemon: Pokemon[]; total: number }>;

  getAllUniqueTypes(): Promise<string[]>;

  getTotalPokemonCount(): Promise<number>;
}
