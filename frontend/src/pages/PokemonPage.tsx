import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPokemon, getUserCollection, getTotalPokemonCount } from "../services/pokemonService";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import { useDebounce } from "../hooks/useDebounce";
import { useUrlFilters } from "../hooks/useUrlFilters";
import type { PaginatedResponse, Pokemon } from "../types";
import { PokemonDetailModal } from "../components/PokemonDetailModal";
import { FooterStats } from "../components/FooterStats";
import { SearchInput } from "../components/SearchInput";
import { Filters } from "../components/Filters";
import { PokemonList } from "../components/PokemonList";
import { PageLayout } from "../components/PageLayout";
import { FiltersBar } from "../components/FiltersBar";
import { MainContent } from "../components/MainContent";
import { MessageBox } from "../components/MessageBox";

export default function PokemonPage() {
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

  const handlePokemonClick = useCallback((pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
  }, [setSelectedPokemonId]);

  const handleModalClose = useCallback(() => {
    setSelectedPokemonId(null);
  }, [setSelectedPokemonId]);

  const handleNameChange = useCallback((value: string) => {
    setFilter("name", value);
  }, [setFilter]);

  const handleFilterChange = useCallback((
    filterName: "type" | "evolutionTier" | "description",
    value: string
  ) => {
    setFilter(filterName, value);
  }, [setFilter]);

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    error: pokemonError,
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
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["collection", "all"],
    queryFn: () => getUserCollection({ page: 1, limit: 1000 }),
    placeholderData: (oldData) => oldData,
  });

  const {
    data: totalCountData,
    isLoading: isTotalCountLoading,
    error: totalCountError,
  } = useQuery<{ total: number }>({
    queryKey: ["totalPokemonCount"],
    queryFn: getTotalPokemonCount,
  });

  const allPokemons = pokemonData?.data || [];

  const caughtPokemonIds = collectionData
    ? new Set<number>(collectionData.data.map((p) => p.id))
    : new Set<number>();

  const totalPages = pokemonData?.pagination.totalPages || 1;
  const totalPokemon = totalCountData?.total || 0;

  // Combine errors for MainContent
  const combinedError = pokemonError || collectionError || totalCountError;

  return (
    <div>
      <PageLayout>
        <FiltersBar>
          <SearchInput
            value={filters.name}
            onChange={handleNameChange}
            placeholder="Search Pokemon by name..."
          />
          <Filters
            filters={{
              type: filters.type,
              evolutionTier: filters.evolutionTier,
              description: filters.description,
            }}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </FiltersBar>

        <MainContent
          isLoading={isPokemonLoading && !pokemonData}
          error={combinedError instanceof Error ? combinedError : null}
        >
          {allPokemons.length === 0 ? (
            <MessageBox
              title="No Pokemon found"
              description="Try adjusting your search or filters"
              variant="empty"
            />
          ) : (
            <PokemonList
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
        </MainContent>

        <FooterStats
          caughtCount={caughtPokemonIds.size}
          totalCount={totalPokemon}
          isLoadingCaught={isCollectionLoading}
          isLoadingTotal={isTotalCountLoading}
        />
      </PageLayout>

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
