import type { PaginatedResponse } from "./pagination";

export interface PokemonEvolution {
  prev?: [string, string] | null; // [pokemonId, evolutionMethod]
  next?: [string, string][] | null; // Array of [pokemonId, evolutionMethod]
}

export interface Pokemon {
  id: number;
  name: string;
  pokedexNumber: number;
  types: string[]; // e.g., ["grass", "poison"]
  sprites: {
    front_default?: string;
    front_shiny?: string;
    back_default?: string;
    back_shiny?: string;
  };
  stats: {
    Hp: number;
    Attack: number;
    Defense: number;
    SpecialAttack: number;
    SpecialDefense: number;
    Speed: number;
  };
  abilities: Array<{
    name: string;
    is_hidden?: boolean;
  }>;
  height: number; // in decimeters
  weight: number; // in hectograms
  evolution: PokemonEvolution;
  data?: Record<string, any>; // Full Pokemon data
  createdAt: string;
}

export interface UserPokemon {
  userId: number;
  pokemonId: number;
  caughtAt: string;
  pokemon?: Pokemon;
}

export type PokemonListResponse = PaginatedResponse<Pokemon>;

export interface UserCollectionResponse {
  collection: Pokemon[];
}
