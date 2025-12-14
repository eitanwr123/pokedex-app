// src/db/schema.ts
import { pgTable, serial, varchar, timestamp, integer, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pokemon = pgTable("pokemon", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  pokedexNumber: integer("pokedex_number").notNull().unique(),
  types: jsonb("types"), // ["grass", "poison"]
  sprites: jsonb("sprites"), // { front_default: "url", ... }
  stats: jsonb("stats"), // { hp: 45, attack: 49, ... }
  abilities: jsonb("abilities"), // [{ name: "overgrow", ... }]
  height: integer("height"), // in decimeters
  weight: integer("weight"), // in hectograms
  evolution: jsonb("evolution"), // { evolvesFrom: {...}, evolvesTo: [{method, level, ...}] }
  data: jsonb("data"), // Store full Pokemon data from JSON
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPokemon = pgTable("user_pokemon", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pokemonId: integer("pokemon_id").notNull().references(() => pokemon.id, { onDelete: "cascade" }),
  caughtAt: timestamp("caught_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.pokemonId] }),
]);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Pokemon = InferSelectModel<typeof pokemon>;
export type NewPokemon = InferInsertModel<typeof pokemon>;
export type UserPokemon = InferSelectModel<typeof userPokemon>;
export type NewUserPokemon = InferInsertModel<typeof userPokemon>;

// Evolution data structure
export interface PokemonEvolution {
  prev?: [string, string] | null; // [pokemonId, evolutionMethod] e.g., ["1", "Level 16"]
  next?: [string, string][] | null; // Array of [pokemonId, evolutionMethod] e.g., [["3", "Level 32"]]
}

// Zod schema for PokemonEvolution validation
export const PokemonEvolutionSchema = z.object({
  prev: z.tuple([z.string(), z.string()]).nullable().optional(),
  next: z.array(z.tuple([z.string(), z.string()])).nullable().optional(),
});
