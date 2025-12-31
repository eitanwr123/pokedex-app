import { useQuery } from "@tanstack/react-query";
import { getAllPokemon, getUserCollection } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import PaginationControls from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import { useDebounce } from "../hooks/useDebounce";
import type { PaginatedResponse, Pokemon } from "../types";
import { useState, useMemo, useCallback } from "react";
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

  const handleFilterChange = useCallback(
    (filterName: string, value: string) => {
      const newParams = new URLSearchParams(filterParams);
      if (value) {
        newParams.set(filterName, value);
      } else {
        newParams.delete(filterName);
      }
      setFilterParams(newParams);
    },
    [filterParams, setFilterParams]
  );

  const handleClearFilters = useCallback(() => {
    setFilterParams(new URLSearchParams());
  }, [setFilterParams]);

  const handlePokemonClick = useCallback((pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPokemonId(null);
  }, []);

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    isFetching: isPokemonFetching,
    error: pokemonError,
    refetch: refetchPokemon,
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
    refetch: refetchCollection,
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
        {isPokemonLoading && !pokemonData ? "..." : totalPokemon}
      </p>

      {collectionError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between">
            <span>Warning: Could not load your collection data</span>
            <button
              onClick={() => refetchCollection()}
              className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <SearchInput value={searchInput} onChange={setSearchInput} />
        {isPokemonFetching && (
          <span className="text-sm text-gray-500">Searching...</span>
        )}
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {pokemonError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          <h3 className="font-bold mb-2">Error Loading Pokemon</h3>
          <p className="mb-3">
            {pokemonError instanceof Error
              ? pokemonError.message
              : "Failed to load Pokemon data. Please try again."}
          </p>
          <button
            onClick={() => refetchPokemon()}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      ) : isPokemonLoading && !pokemonData ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading Pokemon...</p>
        </div>
      ) : allPokemons.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">No Pokemon found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
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
                onClick={handlePokemonClick}
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
        </>
      )}

      {selectedPokemonId && (
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          isCaught={caughtPokemonIds.has(selectedPokemonId)}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
