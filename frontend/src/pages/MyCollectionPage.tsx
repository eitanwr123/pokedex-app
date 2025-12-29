import { useQuery } from "@tanstack/react-query";
import { getUserCollection } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import PaginationControls from "../components/PaginationControls";
import { usePagination } from "../hooks/usePagination";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import type { PaginatedResponse, Pokemon } from "../types";
import { useState } from "react";
import { PokemonDetailModal } from "../components/PokemonDetailModal";

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

  if (isLoading) return <div>Loading your collection...</div>;
  if (error) return <div>Error loading collection!</div>;
  if (!collectionData) throw new Error("No collection data found");

  const myPokemon = collectionData.data;
  const totalPages = collectionData.pagination.totalPages;
  const totalPokemon = collectionData.pagination.total;

  return (
    <div>
      <h1>My Collection</h1>

      {totalPokemon === 0 ? (
        <p>You haven't caught any Pokemon yet. Go catch some!</p>
      ) : (
        <>
          <p>You have caught {totalPokemon} Pokemon!</p>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            onNext={handleNext}
            onPrev={handlePrev}
            onLimitChange={handleLimitChange}
          />

          <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {myPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemonId={pokemon.id}
                name={pokemon.name}
                type={pokemon.types}
                isCaught={true}
                onToggle={handleToggle}
                onClick={() => setSelectedPokemonId(pokemon.id)}
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
          isCaught={true}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </div>
  );
}
