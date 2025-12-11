import { log } from "console";
import { NewUserPokemon, Pokemon } from "../db/schema";
import { userPokemonRepositorylmpl } from "../repositories/userPokemonRepositorylmpl";

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
      userPokemon
    );
    if (result.length === 0) {
      throw new Error("Failed to catch Pokemon to collection");
    }
    console.log(`pokemon ${pokemonId} caught`);
  }
  //return the pokemon that was caught or released
  return result[0];
}
