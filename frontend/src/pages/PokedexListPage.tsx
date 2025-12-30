import { useQuery } from "@tanstack/react-query";
import { getAllPokemon, getUserCollection } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import PaginationControls from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import { useDebounce } from "../hooks/useDebounce";
import type { PaginatedResponse, Pokemon } from "../types";
import { useState, useMemo } from "react";
import { SearchInput } from "../components/searchInput";
import { FilterPanel } from "../components/FilterPanel";
import { useSearchParams } from "react-router-dom";
import { PokemonDetailModal } from "../components/PokemonDetailModal";

export default function PokedexListPage() {
  const [filterParams, setFilterParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );

  const filters = useMemo(
    () => ({
      type: filterParams.get("type") || "",
      evolutionTier: filterParams.get("evolutionTier") || "",
      description: filterParams.get("description") || "",
    }),
    [filterParams]
  );

  const debouncedSearch = useDebounce(searchInput, 500);

  const debouncedDescription = useDebounce(filters.description, 500);

  const { page, limit, handleNext, handlePrev, handleLimitChange } =
    usePagination();

  const { handleToggle } = useTogglePokemon();

  const paginationParam = {
    page,
    limit,
    ...(debouncedSearch && { name: debouncedSearch }),
    ...(filters.type && { type: filters.type }),
    ...(filters.evolutionTier && {
      evolutionTier: Number(filters.evolutionTier),
    }),
    ...(debouncedDescription && { description: debouncedDescription }),
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const newParams = new URLSearchParams(filterParams);
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    setFilterParams(newParams);
  };

  const handleClearFilters = () => {
    setFilterParams(new URLSearchParams());
  };

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    isFetching: isPokemonFetching,
    error: pokemonError,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: [
      "pokemon",
      page,
      limit,
      debouncedSearch,
      filters.type,
      filters.evolutionTier,
      debouncedDescription,
    ],
    queryFn: () => getAllPokemon(paginationParam),
    // placeholderData: (previousData) => previousData,
  });

  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["collection", "all"],
    queryFn: () => getUserCollection({ page: 1, limit: 1000 }),
  });

  const allPokemons = pokemonData?.data || [];
  const caughtPokemonIds = collectionData
    ? new Set(collectionData.data.map((p) => p.id))
    : new Set();

  const totalPages = pokemonData?.pagination.totalPages || 1;
  const totalPokemon = pokemonData?.pagination.total || 0;

  return (
    <div>
      <h1>My Pokedex App</h1>

      <p>
        Caught: {isCollectionLoading ? "..." : caughtPokemonIds.size} /{" "}
        {isPokemonLoading ? "..." : totalPokemon}
      </p>

      <div className="flex items-center gap-2">
        <SearchInput value={searchInput} onChange={setSearchInput} />
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onNext={handleNext}
        onPrev={handlePrev}
        onLimitChange={handleLimitChange}
      />

      {isPokemonLoading && !pokemonData ? (
        <div>Loading...</div>
      ) : (
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {allPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemonId={pokemon.id}
              name={pokemon.name}
              type={pokemon.types}
              isCaught={caughtPokemonIds.has(pokemon.id)}
              onToggle={handleToggle}
              onClick={() => setSelectedPokemonId(pokemon.id)}
            />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onNext={handleNext}
        onPrev={handlePrev}
        onLimitChange={handleLimitChange}
      />

      {selectedPokemonId && (
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          isCaught={caughtPokemonIds.has(selectedPokemonId)}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </div>
  );
}
