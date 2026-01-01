import type { PaginatedResponse } from "./pagination";

export interface PokemonEvolution {
  prev?: [string, string] | null; // [pokemonId, evolutionMethod]
  next?: [string, string][] | null; // Array of [pokemonId, evolutionMethod]
}

export interface PokemonData {
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
  };
  species: string;
  description: string;
  evolution?: {
    prev?: [string, string];
    next?: [string, string][];
  };
  profile: {
    height: string;
    weight: string;
    egg: string[];
    ability: [string, string][];
    gender: string;
  };
  image: {
    sprite: string;
    thumbnail: string;
    hires: string;
  };
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
  data?: PokemonData; // Full Pokemon data from JSON
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
