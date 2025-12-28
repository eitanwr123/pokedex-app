import { useQuery } from "@tanstack/react-query";
import { getAllPokemon, getUserCollection } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import PaginationControls from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import { useDebounce } from "../hooks/useDebounce";
import type { PaginatedResponse, Pokemon } from "../types";
import { useState } from "react";
import { SearchInput } from "../components/searchInput";

export default function PokedexListPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const { page, limit, handleNext, handlePrev, handleLimitChange } =
    usePagination();
  const { handleToggle } = useTogglePokemon();

  const paginationParam = {
    page,
    limit,
    ...(debouncedSearch && { name: debouncedSearch }),
  };

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    isFetching: isPokemonFetching,
    error: pokemonError,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["pokemon", page, limit, debouncedSearch],
    queryFn: () => getAllPokemon(paginationParam),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["collection", "all"],
    queryFn: () => getUserCollection({ page: 1, limit: 1000 }),
  });

  if ((isPokemonLoading || isCollectionLoading) && !pokemonData) {
    return <div>Loading Pokemons...</div>;
  }

  if (pokemonError) return <div>Error loading Pokemons!</div>;
  if (collectionError) return <div>Error loading collection data!</div>;
  if (!pokemonData) throw new Error("No data found");
  if (!collectionData) throw new Error("No collection data found");

  const allPokemons = pokemonData.data;
  const caughtPokemonIds = new Set(collectionData.data.map((p) => p.id));

  const totalPages = pokemonData.pagination.totalPages;
  const totalPokemon = pokemonData.pagination.total;

  return (
    <div>
      <h1>My Pokedex App</h1>

      <p>
        Caught: {caughtPokemonIds.size} / {totalPokemon}
      </p>

      <div className="flex items-center gap-2">
        <SearchInput value={searchInput} onChange={setSearchInput} />
        {isPokemonFetching && (
          <span className="text-sm text-gray-500">Searching...</span>
        )}
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onNext={handleNext}
        onPrev={handlePrev}
        onLimitChange={handleLimitChange}
      />

      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {allPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemonId={pokemon.id}
            name={pokemon.name}
            type={pokemon.types}
            isCaught={caughtPokemonIds.has(pokemon.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onNext={handleNext}
        onPrev={handlePrev}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
