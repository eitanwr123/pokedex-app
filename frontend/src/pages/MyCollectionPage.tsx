import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCollection } from "../services/pokemonService";
import { usePagination } from "../hooks/usePagination";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import type { PaginatedResponse, Pokemon } from "../types";
import { PokemonDetailModal } from "../components/PokemonDetailModal";
import { PageLayout } from "../components/PageLayout";
import { FiltersBar } from "../components/FiltersBar";
import { MainContent } from "../components/MainContent";
import { FooterStats } from "../components/FooterStats";
import { PokemonList } from "../components/PokemonList";
import { MessageBox } from "../components/MessageBox";

export default function MyCollectionPage() {
  const { page, limit, handleNext, handlePrev, handleLimitChange } =
    usePagination();
  const { handleToggle } = useTogglePokemon();
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );

  const {
    data: collectionData,
    isLoading,
    error,
  } = useQuery<PaginatedResponse<Pokemon>>({
    queryKey: ["collection", page, limit],
    queryFn: () => getUserCollection({ page, limit }),
  });

  const handlePokemonClick = useCallback((pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPokemonId(null);
  }, []);

  const myPokemon = collectionData?.data || [];
  const totalPages = collectionData?.pagination.totalPages || 1;
  const totalPokemon = collectionData?.pagination.total || 0;
  const caughtPokemonIds = new Set<number>(myPokemon.map((p) => p.id));

  return (
    <div>
      <PageLayout>
        <FiltersBar>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">My Collection</h1>
            <p className="text-gray-600 mt-2">View all your caught Pokemon</p>
          </div>
        </FiltersBar>

        <MainContent
          isLoading={isLoading}
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
              onLimitChange={handleLimitChange}
              onToggle={handleToggle}
              onPokemonClick={handlePokemonClick}
            />
          )}
        </MainContent>

        <FooterStats
          caughtCount={totalPokemon}
          totalCount={totalPokemon}
          isLoadingCaught={isLoading}
          isLoadingTotal={false}
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
