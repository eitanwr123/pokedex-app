import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { NewUserPokemon, UserPokemon, userPokemon } from "../db/schema";

export class userPokemonRepositorylmpl {
  async addPokemonToUserCollection(
    input: NewUserPokemon | NewUserPokemon[]
  ): Promise<NewUserPokemon[]> {
    const pokemons = Array.isArray(input) ? input : [input];
    if (pokemons.length === 0) {
      return [];
    }
    return await db.insert(userPokemon).values(pokemons).returning();
  }

  async removePokemonFromUserCollection(
    input: NewUserPokemon | NewUserPokemon[]
  ): Promise<NewUserPokemon[]> {
    const pokemons = Array.isArray(input) ? input : [input];
    if (pokemons.length === 0) {
      return [];
    }

    return await db
      .delete(userPokemon)
      .where(
        and(
          eq(userPokemon.userId, pokemons[0].userId),
          inArray(
            userPokemon.pokemonId,
            pokemons.map((p) => p.pokemonId)
          )
        )
      )
      .returning();
  }
}
