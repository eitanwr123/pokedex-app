import { eq, and } from "drizzle-orm";
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
    NewUserPokemon: NewUserPokemon
  ): Promise<NewUserPokemon[]> {
    return await db.insert(userPokemon).values(NewUserPokemon).returning();
  }

  async removePokemonFromUserCollection(
    NewUserPokemon: NewUserPokemon
  ): Promise<NewUserPokemon[]> {
    return await db
      .delete(userPokemon)
      .where(
        and(
          eq(userPokemon.userId, NewUserPokemon.userId),
          eq(userPokemon.pokemonId, NewUserPokemon.pokemonId)
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
