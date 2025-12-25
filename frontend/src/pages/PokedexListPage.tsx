import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPokemon,
  getUserCollection,
  toggleCatchPokemon,
} from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import { useState } from "react";

export default function PokedexListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const paginationParams = {
    page,
    limit,
    evolutionTier: undefined,
  };

  const queryClient = useQueryClient();

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    error: pokemonError,
  } = useQuery({
    queryKey: ["pokemon", page, limit],
    queryFn: () => getAllPokemon(paginationParams),
  });

  const { data: collectionData, isLoading: isCollectionLoading } = useQuery({
    queryKey: ["collection"],
    queryFn: getUserCollection,
  });

  const toggleMutation = useMutation({
    mutationFn: (pokemonId: number) => toggleCatchPokemon(pokemonId),
    onSuccess: async () => {
      console.log("Toggle success, refetching collection");
      await queryClient.refetchQueries({ queryKey: ["collection"] });
    },
    onError: (error) => {
      console.error("Toggle error:", error);
    },
  });

  if (isPokemonLoading || isCollectionLoading) {
    return <div>Loading Pokemons...</div>;
  }
  if (pokemonError) return <div>Error loading Pokemons!</div>;
  if (!pokemonData) throw new Error("No data found");

  const allPokemons = pokemonData.data;
  const caughtPokemonIds = new Set(
    collectionData?.collection.map((p) => p.id) ?? []
  );

  const handleToggle = (pokemonId: number) => {
    toggleMutation.mutate(pokemonId);
  };

  return (
    <div>
      <h1>My Pokedex App</h1>

      <p>
        Caught: {caughtPokemonIds.size} / {allPokemons.length}
      </p>

      {allPokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.name}
          pokemonId={pokemon.id}
          name={pokemon.name}
          type={pokemon.types}
          isCaught={caughtPokemonIds.has(pokemon.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
