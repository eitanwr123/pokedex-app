import { db } from "../db/client";
import { pokemon, userPokemon } from "../db/schema";
import { Pokemon } from "../db/schema";
import { and, count, eq, ilike, SQL, sql } from "drizzle-orm";

export class PokemonRepositoryImpl {
  async findAllPokemon(
    offset: number,
    limit: number,
    type?: string,
    name?: string,
    evolutionTier?: number,
    description?: string
  ): Promise<{ pokemon: Pokemon[]; total: number }> {
    const whereClause = this.buildWhereClause(
      type,
      name,
      evolutionTier,
      description
    );

    const [pokemonList, totalCount] = await Promise.all([
      db.select().from(pokemon).where(whereClause).limit(limit).offset(offset),
      db.select({ count: count() }).from(pokemon).where(whereClause),
    ]);

    return {
      pokemon: pokemonList,
      total: totalCount[0].count,
    };
  }

  private buildWhereClause(
    type?: string,
    name?: string,
    evolutionTier?: number,
    description?: string
  ): SQL | undefined {
    const conditions: SQL[] = [];

    if (name) {
      conditions.push(ilike(pokemon.name, `%${name}%`));
    }

    if (type) {
      conditions.push(
        sql`${pokemon.types}::jsonb @> ${JSON.stringify([type])}`
      );
    }

    if (description) {
      conditions.push(
        sql`${pokemon.data}->>'description' ILIKE ${`%${description}%`}`
      );
    }

    if (evolutionTier !== undefined) {
      if (evolutionTier === 1) {
        conditions.push(sql`${pokemon.evolution}->>'prev' IS NULL`);
      } else if (evolutionTier === 2) {
        conditions.push(
          sql`${pokemon.evolution}->>'prev' IS NOT NULL AND ${pokemon.evolution}->>'next' IS NOT NULL`
        );
      } else if (evolutionTier === 3) {
        conditions.push(
          sql`${pokemon.evolution}->>'prev' IS NOT NULL AND ${pokemon.evolution}->>'next' IS NULL`
        );
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
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
  async findPokemonByUserId(
    userId: number,
    offset: number,
    limit: number
  ): Promise<{ pokemon: Pokemon[]; total: number }> {
    const [pokemonList, totalCount] = await Promise.all([
      db
        .select()
        .from(userPokemon)
        .innerJoin(pokemon, eq(userPokemon.pokemonId, pokemon.id))
        .where(eq(userPokemon.userId, userId))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(userPokemon)
        .where(eq(userPokemon.userId, userId)),
    ]);

    return {
      pokemon: pokemonList.map((r) => ({ ...r.pokemon })),
      total: totalCount[0].count,
    };
  }

  // return all the types as unique
  async findAllTypes(): Promise<string[]> {
    const result = await db.select().from(pokemon);

    const typesSet = new Set<string>();
    result.forEach((row) => {
      if (Array.isArray(row.types)) {
        row.types.forEach((type) => typesSet.add(type));
      }
    });

    return Array.from(typesSet);
  }
}
