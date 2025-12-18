/**
 * Pokemon Types
 *
 * These types mirror the backend database schema.
 * Always keep them in sync with the API response!
 */

import type { PaginatedResponse } from "./pagination";

// Evolution data structure
export interface PokemonEvolution {
  prev?: [string, string] | null; // [pokemonId, evolutionMethod]
  next?: [string, string][] | null; // Array of [pokemonId, evolutionMethod]
}

// Main Pokemon interface (matches backend schema)
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
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
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

// User's caught Pokemon (from /api/me/collection)
export interface UserPokemon {
  userId: number;
  pokemonId: number;
  caughtAt: string;
  pokemon?: Pokemon; // The API might populate this
}

// API Response Types
export type PokemonListResponse = PaginatedResponse<Pokemon>;

export interface UserCollectionResponse {
  collection: UserPokemon[];
}
