import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { NewUserPokemon, UserPokemon, userPokemon } from "../db/schema";

export class userPokemonRepositorylmpl {
  async findPokemonByUserIdAndPokemonId(
    NewUserPokemon: NewUserPokemon
  ): Promise<UserPokemon[]> {
    const result = await db
      .select()
      .from(userPokemon)
      .where(
        and(
          eq(userPokemon.userId, NewUserPokemon.userId),
          eq(userPokemon.pokemonId, NewUserPokemon.pokemonId)
        )
      );
    return result;
  }

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

  //retrieve all pokemon in user's collection
  async findPokemonByUserId(userId: number): Promise<UserPokemon[]> {
    const result = await db
      .select()
      .from(userPokemon)
      .where(eq(userPokemon.userId, userId));
    return result;
  }
}
