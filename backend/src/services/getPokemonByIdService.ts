import { Pokemon } from "../db/schema";
import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";

export async function getPokemonByIdService(
  pokemonId: number
): Promise<Pokemon | null> {
  const pokemonRepository = new PokemonRepositoryImpl();
  const pokemon = await pokemonRepository.findPokemonById(pokemonId);
  return pokemon;
}
