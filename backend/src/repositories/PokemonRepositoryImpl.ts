import { db } from "../db/client";
import { pokemon, userPokemon } from "../db/schema";
import { Pokemon } from "../db/schema";
import { count, eq } from "drizzle-orm";

export class PokemonRepositoryImpl {
  async findAllPokemon(
    offset: number,
    limit: number
  ): Promise<{ pokemon: Pokemon[]; total: number }> {
    const [pokemonList, totalCount] = await Promise.all([
      db.select().from(pokemon).limit(limit).offset(offset),
      db.select({ count: count() }).from(pokemon),
    ]);

    return {
      pokemon: pokemonList,
      total: totalCount[0].count,
    };
  }

  async findPokemonById(id: number): Promise<Pokemon | null> {
    const result = await db.select().from(pokemon).where(eq(pokemon.id, id));
    return result[0] ?? null;
  }

  async findPokemonByPokedexNumber(
    pokedexNumber: number
  ): Promise<Pokemon | undefined> {
    const result = await db
      .select()
      .from(pokemon)
      .where(eq(pokemon.pokedexNumber, pokedexNumber));
    return result[0];
  }

  //find pokemon collection by user id
  async findPokemonByUserId(userId: number): Promise<Pokemon[]> {
    const result = await db
      .select()
      .from(userPokemon)
      .innerJoin(pokemon, eq(userPokemon.pokemonId, pokemon.id))
      .where(eq(userPokemon.userId, userId));
    return result.map((r) => ({ ...r.pokemon }));
  }
}
