import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTotalPokemonCount,
  getUserCollection,
} from "../services/pokemonService";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import type { PaginatedResponse, Pokemon } from "../types";
import { PokemonDetailModal } from "../components/PokemonDetailModal";
import { PageLayout } from "../components/PageLayout";
import { FiltersBar } from "../components/FiltersBar";
import { MainContent } from "../components/MainContent";
import { FooterStats } from "../components/FooterStats";
import { PokemonList } from "../components/PokemonList";
import { MessageBox } from "../components/MessageBox";
import { SearchInput } from "../components/searchInput";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { Filters } from "../components/Filters";
import { useDebounce } from "../hooks/useDebounce";

export default function MyCollectionPage() {
  const { handleToggle } = useTogglePokemon();

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

  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: [
      "collection",
      page,
      limit,
      debouncedName,
      filters.type,
      filters.evolutionTier,
      debouncedDescription,
    ],
    queryFn: () => getUserCollection(paginationParam),
  });

  const handleNameChange = useCallback(
    (value: string) => {
      setFilter("name", value);
    },
    [setFilter]
  );

  const handleFilterChange = useCallback(
    (filterName: "type" | "evolutionTier" | "description", value: string) => {
      setFilter(filterName, value);
    },
    [setFilter]
  );

  const handlePokemonClick = useCallback((pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPokemonId(null);
  }, []);

  const {
    data: totalCountData,
    isLoading: isTotalCountLoading,
    error: totalCountError,
  } = useQuery<{ total: number }>({
    queryKey: ["totalPokemonCount"],
    queryFn: getTotalPokemonCount,
  });

  const totalPokemonCount = totalCountData?.total || 0;

  const myPokemon = collectionData?.data || [];
  const totalPages = collectionData?.pagination.totalPages || 1;
  const totalPokemon = collectionData?.pagination.total || 0;
  const caughtPokemonIds = new Set<number>(myPokemon.map((p) => p.id));

  return (
    <div>
      <PageLayout>
        <FiltersBar>
          <SearchInput
            value={filters.name}
            onChange={handleNameChange}
            placeholder="Search in your collection..."
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
          isLoading={isCollectionLoading}
          error={error instanceof Error ? error : null}
        >
          {totalPokemon === 0 ? (
            <MessageBox
              title="No Pokemon in your collection"
              description="You haven't caught any Pokemon yet. Go catch some!"
              variant="empty"
            />
          ) : (
            <PokemonList
              pokemons={myPokemon}
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
          caughtCount={totalPokemon}
          totalCount={totalPokemonCount}
          isLoadingCaught={isCollectionLoading}
          isLoadingTotal={isTotalCountLoading || isCollectionLoading}
        />
      </PageLayout>

      {selectedPokemonId && (
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          isCaught={true}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
