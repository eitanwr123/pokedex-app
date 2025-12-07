import { db } from "../db/client";
import { pokemon } from "../db/schema";
import * as fs from "fs";
import * as path from "path";

async function seedPokemon() {
  try {
    const jsonPath = path.join(__dirname, "../../data/pokemon.json");

    if (!fs.existsSync(jsonPath)) {
      console.error(`Pokemon JSON file not found at: ${jsonPath}`);
      console.log("Please place your pokemon.json file in the backend/data/ directory");
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const pokemonData = JSON.parse(rawData);

    console.log(`Found ${pokemonData.length} Pokemon to seed...`);

    for (const poke of pokemonData) {
      await db.insert(pokemon).values({
        name: poke.name,
        pokedexNumber: poke.id || poke.pokedexNumber,
        types: poke.types,
        sprites: poke.sprites,
        stats: poke.stats,
        abilities: poke.abilities,
        height: poke.height,
        weight: poke.weight,
        data: poke,
      });

      console.log(`Seeded: ${poke.name}`);
    }

    console.log("Pokemon seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Pokemon:", error);
    process.exit(1);
  }
}

seedPokemon();
