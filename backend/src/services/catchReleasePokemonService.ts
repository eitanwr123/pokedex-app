import { NewUserPokemon } from "../db/schema";
import { userPokemonRepositorylmpl } from "../repositories/userPokemonRepositorylmpl";
import { getAllPreEvolutions } from "../utils/getAllPreEvolutions";
import { PokemonRepositoryImpl } from "../repositories/PokemonRepositoryImpl";

export async function catchReleasePokemonService(
  userId: number,
  pokemonId: number
): Promise<NewUserPokemon> {
  const userPokemon = { userId, pokemonId };
  let result: NewUserPokemon[];

  const userPokemonRepository = new userPokemonRepositorylmpl();

  const userCollection = await userPokemonRepository.findPokemonByUserId(
    userId
  );
  const pokemonInCollection = userCollection.find(
    (p) => p.pokemonId === pokemonId
  );

  //check for pre evolutions
  const pokemonRepo = new PokemonRepositoryImpl();
  const preEvolutionsIds = await getAllPreEvolutions(pokemonId, (id) =>
    pokemonRepo.findPokemonById(id)
  );

  // Build list of pokemon to catch/release (including pre-evolutions)
  let userPokemons: NewUserPokemon[];
  if (preEvolutionsIds.length > 0) {
    userPokemons = preEvolutionsIds
      .filter((id) => !userCollection.find((p) => p.pokemonId === id))
      .map((id) => ({ userId, pokemonId: id }));
    //add the original pokemon to the list
    userPokemons.push(userPokemon);
  } else {
    userPokemons = [userPokemon];
  }

  if (pokemonInCollection) {
    result = await userPokemonRepository.removePokemonFromUserCollection(
      userPokemon
    );
    if (result.length === 0) {
      throw new Error("Failed to release Pokemon from collection");
    }
    console.log(`pokemon ${pokemonId} released`);
  } else {
    result = await userPokemonRepository.addPokemonToUserCollection(
      userPokemons
    );
    if (result.length === 0) {
      throw new Error("Failed to catch Pokemon to collection");
    }
    console.log(`pokemon ${pokemonId} caught`);
  }
  //return the pokemon that was caught or released
  return result[0];
}
