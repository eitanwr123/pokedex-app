import "dotenv/config";
import { db } from "../db/client";
import { pokemon, userPokemon } from "../db/schema";
import { sql } from "drizzle-orm";

async function cleanDatabase() {
  try {
    console.log("Cleaning database...");

    // Delete all records from tables (respects foreign keys)
    await db.delete(userPokemon);
    console.log("✓ Cleared user_pokemon table");

    await db.delete(pokemon);
    console.log("✓ Cleared pokemon table");

    // Reset the serial sequences
    await db.execute(sql`ALTER SEQUENCE pokemon_id_seq RESTART WITH 1`);
    console.log("✓ Reset pokemon ID sequence");

    console.log("\nDatabase cleaned successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning database:", error);
    process.exit(1);
  }
}

cleanDatabase();
