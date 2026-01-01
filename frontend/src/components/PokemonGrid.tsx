import PokemonCard from "./PokemonCard";
import PaginationControls from "./PaginationControls";
import type { Pokemon } from "../types";

interface PokemonGridProps {
  pokemons: Pokemon[];
  caughtPokemonIds: Set<number>;
  currentPage: number;
  totalPages: number;
  limit: number;
  onNext: () => void;
  onPrev: () => void;
  onLimitChange: (limit: number) => void;
  onToggle: (pokemonId: number) => void;
  onPokemonClick: (pokemonId: number) => void;
}

export function PokemonGrid({
  pokemons,
  caughtPokemonIds,
  currentPage,
  totalPages,
  limit,
  onNext,
  onPrev,
  onLimitChange,
  onToggle,
  onPokemonClick,
}: PokemonGridProps) {
  return (
    <>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onNext={onNext}
        onPrev={onPrev}
        onLimitChange={onLimitChange}
      />

      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemonId={pokemon.id}
            name={pokemon.name}
            type={pokemon.types}
            isCaught={caughtPokemonIds.has(pokemon.id)}
            onToggle={onToggle}
            onClick={onPokemonClick}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onNext={onNext}
        onPrev={onPrev}
        onLimitChange={onLimitChange}
      />
    </>
  );
}
