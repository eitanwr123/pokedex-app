import { db } from "../db/client";
import { pokemon } from "../db/schema";
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

  async findPokemonById(id: number): Promise<Pokemon | undefined> {
    const result = await db
      .select()
      .from(pokemon)
      .where(eq(pokemon.id, id));
    return result[0];
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
}
