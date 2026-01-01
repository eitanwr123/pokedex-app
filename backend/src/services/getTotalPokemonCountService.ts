import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";

export async function getTotalPokemonCountService(): Promise<number> {
  const pokemonRepository = new PokemonRepositoryImpl();
  const totalCount = await pokemonRepository.getTotalPokemonCount();
  return totalCount;
}
