import { useQuery } from "@tanstack/react-query";
import { getAllPokemon, getUserCollection } from "../services/pokemonService";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import { useDebounce } from "../hooks/useDebounce";
import { useUrlFilters } from "../hooks/useUrlFilters";
import type { PaginatedResponse, Pokemon } from "../types";
import { PokemonDetailModal } from "../components/PokemonDetailModal";
import { PokemonStats } from "../components/PokemonStats";
import { PageHeader } from "../components/PageHeader";
import { SearchSection } from "../components/SearchSection";
import { PokemonGrid } from "../components/PokemonGrid";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { Loader } from "../components/Loader";
import { MessageBox } from "../components/MessageBox";

export default function PokedexListPage() {
  const {
    filters,
    page,
    limit,
    selectedPokemonId,
    setFilter,
    clearFilters,
    setLimit,
    handleNext,
    handlePrev,
    setSelectedPokemonId,
  } = useUrlFilters();

  const { handleToggle } = useTogglePokemon();

  const debouncedName = useDebounce(filters.name, 500);
  const debouncedDescription = useDebounce(filters.description, 500);

  const paginationParam = {
    page,
    limit,
    ...(debouncedName && { name: debouncedName }),
    ...(filters.type && { type: filters.type }),
    ...(filters.evolutionTier && {
      evolutionTier: Number(filters.evolutionTier),
    }),
    ...(debouncedDescription && { description: debouncedDescription }),
  };

  const handlePokemonClick = (pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
  };

  const handleModalClose = () => {
    setSelectedPokemonId(null);
  };

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
      debouncedName,
      filters.type,
      filters.evolutionTier,
      debouncedDescription,
    ],
    queryFn: () => getAllPokemon(paginationParam),
    placeholderData: (oldData) => oldData,
  });

  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError,
    refetch: refetchCollection,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["collection", "all"],
    queryFn: () => getUserCollection({ page: 1, limit: 1000 }),
    placeholderData: (oldData) => oldData,
  });

  const allPokemons = pokemonData?.data || [];

  const caughtPokemonIds = collectionData
    ? new Set<number>(collectionData.data.map((p) => p.id))
    : new Set<number>();

  const totalPages = pokemonData?.pagination.totalPages || 1;
  const totalPokemon = pokemonData?.pagination.total || 0;

  return (
    <div>
      <PageHeader title="My Pokedex App" />

      {collectionError && (
        <ErrorDisplay
          message="Warning: Could not load your collection data"
          onRetry={refetchCollection}
          type="warning"
        />
      )}

      <SearchSection
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        isFetching={isPokemonFetching}
      />

      {pokemonError ? (
        <ErrorDisplay
          message={
            pokemonError instanceof Error
              ? pokemonError.message
              : "Failed to load Pokemon data. Please try again."
          }
          onRetry={refetchPokemon}
          type="error"
        />
      ) : isPokemonLoading && !pokemonData ? (
        <Loader message="Loading Pokemon..." size="medium" />
      ) : allPokemons.length === 0 ? (
        <MessageBox
          title="No Pokemon found"
          description="Try adjusting your search or filters"
          variant="empty"
        />
      ) : (
        <PokemonGrid
          pokemons={allPokemons}
          caughtPokemonIds={caughtPokemonIds}
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
          onNext={handleNext}
          onPrev={handlePrev}
          onLimitChange={setLimit}
          onToggle={handleToggle}
          onPokemonClick={handlePokemonClick}
        />
      )}

      {selectedPokemonId && (
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          isCaught={caughtPokemonIds.has(selectedPokemonId)}
          onClose={handleModalClose}
        />
      )}

      <PokemonStats
        caughtCount={caughtPokemonIds.size}
        totalCount={totalPokemon}
        isLoadingCaught={isCollectionLoading}
        isLoadingTotal={isPokemonLoading && !pokemonData}
      />
    </div>
  );
}
