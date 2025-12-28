import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";

export async function getAllTypesService(): Promise<string[]> {
  const pokemonRepository = new PokemonRepositoryImpl();
  const types = await pokemonRepository.findAllTypes();
  return types;
}
