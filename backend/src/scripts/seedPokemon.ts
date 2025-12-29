import "dotenv/config";
import { db } from "../db/client";
import { pokemon, PokemonEvolution } from "../db/schema";
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
      // Process evolution data
      let evolutionData: PokemonEvolution | null = null;
      if (poke.evolution) {
        evolutionData = {
          prev: poke.evolution.prev || null,
          next: poke.evolution.next || null,
        };
      }

      // Transform abilities from tuples to objects
      let abilitiesData = null;
      if (poke.profile?.ability && Array.isArray(poke.profile.ability)) {
        abilitiesData = poke.profile.ability.map((abilityTuple: [string, string]) => ({
          name: abilityTuple[0],
          is_hidden: abilityTuple[1] === "true",
        }));
      }

      // Transform stats keys to match frontend interface
      let statsData = null;
      if (poke.base) {
        statsData = {
          Hp: poke.base.HP,
          Attack: poke.base.Attack,
          Defense: poke.base.Defense,
          SpecialAttack: poke.base["Sp. Attack"],
          SpecialDefense: poke.base["Sp. Defense"],
          Speed: poke.base.Speed,
        };
      }

      await db.insert(pokemon).values({
        name: poke.name.english,
        pokedexNumber: poke.id,
        types: poke.type || null,
        sprites: poke.image || null,
        stats: statsData,
        abilities: abilitiesData,
        height: poke.profile?.height ? parseInt(poke.profile.height) : null,
        weight: poke.profile?.weight ? parseInt(poke.profile.weight) : null,
        evolution: evolutionData,
        data: poke,
      });

      console.log(`Seeded: ${poke.name.english}`);
    }

    console.log("Pokemon seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Pokemon:", error);
    process.exit(1);
  }
}

seedPokemon();
