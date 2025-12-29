import { useQuery } from "@tanstack/react-query";
import { useTogglePokemon } from "../hooks/useTogglePokemon";
import type { Pokemon } from "../types";
import { getPokemonById } from "../services/pokemonService";

interface PokemonDetailModalProps {
  pokemonId: number;
  isCaught: boolean;
  onClose: () => void;
}

export function PokemonDetailModal(props: PokemonDetailModalProps) {
  const { handleToggle } = useTogglePokemon();
  const { data, isLoading, isError } = useQuery<{ pokemon: Pokemon }>({
    queryKey: ["pokemonDetail", "detail", props.pokemonId],
    queryFn: () => getPokemonById(props.pokemonId),
  });

  const pokemon = data?.pokemon;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {pokemon
              ? `#${String(pokemon.pokedexNumber).padStart(3, "0")} ${
                  pokemon.name
                }`
              : "Loading..."}
          </h2>
          <button
            onClick={props.onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && <p className="text-center">Loading...</p>}
          {isError && (
            <p className="text-center text-red-600">
              Error loading Pokémon details.
            </p>
          )}

          {pokemon && (
            <div className="space-y-4">
              {/* Image */}
              {pokemon.sprites.front_default && (
                <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-48 h-48"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div>
                <p className="text-lg">
                  <strong>Types:</strong> {pokemon.types.join(", ")}
                </p>
                <p>
                  <strong>Height:</strong> {(pokemon.height / 10).toFixed(1)} m
                </p>
                <p>
                  <strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)} kg
                </p>
              </div>

              {/* Description */}
              {pokemon.data?.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{pokemon.data.description}</p>
                </div>
              )}

              {/* Stats */}
              {pokemon.stats && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>HP: {pokemon.stats.Hp}</p>
                    <p>Attack: {pokemon.stats.Attack}</p>
                    <p>Defense: {pokemon.stats.Defense}</p>
                    <p>Sp. Attack: {pokemon.stats.SpecialAttack}</p>
                    <p>Sp. Defense: {pokemon.stats.SpecialDefense}</p>
                    <p>Speed: {pokemon.stats.Speed}</p>
                  </div>
                </div>
              )}

              {/* Abilities */}
              <div>
                <h3 className="font-bold text-lg mb-2">Abilities</h3>
                <p>{pokemon.abilities.map((a) => a.name).join(", ")}</p>
              </div>

              {/* Catch/Release Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => handleToggle(pokemon.id)}
                  className={`px-8 py-3 rounded-lg font-semibold text-white ${
                    props.isCaught
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {props.isCaught ? "Release" : "Catch"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
