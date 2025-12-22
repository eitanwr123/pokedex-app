import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPokemon } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";

export default function PokedexListPage() {
  const [caughtCount, setCaughtCount] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon"],
    queryFn: () => getAllPokemon(),
  });

  if (isLoading) return <div>Loading Pokemons...</div>;
  if (error) return <div>Error loading Pokemons!</div>;
  if (!data) throw new Error("No data found");

  const allPokemons = data.data;

  const handleCatch = () => {
    setCaughtCount(caughtCount + 1);
  };

  const handleRelease = () => {
    setCaughtCount(caughtCount - 1);
  };

  return (
    <div>
      <h1>My Pokedex App</h1>

      <p>
        Caught: {caughtCount} / {allPokemons.length}
      </p>

      {allPokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.name}
          name={pokemon.name}
          type={pokemon.types}
          onCatch={handleCatch}
          onRelease={handleRelease}
        />
      ))}
    </div>
  );
}
