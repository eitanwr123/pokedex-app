import { Pokemon } from "../db/schema";
import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";

export async function getUserCollectionService(
  userId: number
): Promise<Pokemon[]> {
  const pokemonRepository = new PokemonRepositoryImpl();
  const userCollection = await pokemonRepository.findPokemonByUserId(userId);
  return userCollection;
}
