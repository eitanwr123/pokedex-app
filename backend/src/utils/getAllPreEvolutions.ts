import {
  Pokemon,
  PokemonEvolution,
  PokemonEvolutionSchema,
} from "../db/schema";

export async function getAllPreEvolutions(
  pokemonId: number,
  getPokemonById: (id: number) => Promise<Pokemon | null>
): Promise<number[]> {
  const preEvolutions: number[] = [];
  let currentPokemonId: number | null = pokemonId;

  while (currentPokemonId !== null) {
    const pokemon = await getPokemonById(currentPokemonId);

    if (pokemon && pokemon.evolution) {
      const evolutionData = PokemonEvolutionSchema.parse(pokemon.evolution);

      if (evolutionData.prev && evolutionData.prev[0]) {
        const prevEvolutionId = parseInt(evolutionData.prev[0]);
        preEvolutions.push(prevEvolutionId);
        currentPokemonId = prevEvolutionId;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return preEvolutions.reverse();
}
