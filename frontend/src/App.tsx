import { useEffect, useState } from "react";
import { getAllPokemon } from "./services/pokemonService";
import type { Pokemon } from "./types";
import PokemonCard from "./components/PokemonCard";

function App() {
  const [caughtCount, setCaughtCount] = useState(0);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    // Fetch the list of Pokemon from the API
    const fetchAllPokemon = async () => {
      const response = await getAllPokemon();
      setPokemonList(response.data);
    };
    fetchAllPokemon();
  }, []);

  const handleCatch = () => {
    setCaughtCount(caughtCount + 1);
  };

  const handleRelease = () => {
    setCaughtCount(caughtCount - 1);
  };

  return (
    <div style={appStyle}>
      {/* Header section */}
      <h1>My Pokedex App</h1>

      <p style={counterStyle}>
        Caught: {caughtCount} / {pokemonList.length}
      </p>

      {pokemonList.map((pokemon) => (
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

const appStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
};

const counterStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "20px",
};

export default App;
