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
  const { data, isLoading, isError, error, refetch } = useQuery<{
    pokemon: Pokemon;
  }>({
    queryKey: ["pokemonDetail", "detail", props.pokemonId],
    queryFn: () => getPokemonById(props.pokemonId),
  });

  const pokemon = data?.pokemon;

  // Get type color for card background
  const getTypeColor = (types: string[]) => {
    const typeColors: Record<string, string> = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return typeColors[types[0].toLowerCase()] || "#F5DEB3";
  };

  const cardBgColor = pokemon ? getTypeColor(pokemon.types) : "#F5DEB3";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={props.onClose}
    >
      <div
        className="relative rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: `linear-gradient(135deg, ${cardBgColor} 0%, ${cardBgColor}dd 100%)`,
          border: "12px solid #f0e68c",
          boxShadow:
            "0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(255,255,255,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={props.onClose}
          className="absolute top-2 right-2 z-10 text-gray-700 hover:text-gray-900 text-2xl font-bold bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>

        {isLoading && (
          <div className="p-8 text-center text-white text-xl">
            Loading Pokemon details...
          </div>
        )}
        {isError && (
          <div className="p-8 text-center">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-red-600 text-xl font-bold mb-2">
                Error Loading Pokemon
              </h3>
              <p className="text-gray-700 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Could not load Pokemon details. Please try again."}
              </p>
              <button
                onClick={() => refetch()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {pokemon && (
          <div className="p-6">
            {/* Card Header */}
            <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Basic Pokémon
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {pokemon.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mt-1">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs px-2 py-1 rounded-full text-white font-semibold"
                        style={{ backgroundColor: getTypeColor([type]) }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pokemon Image */}
            {pokemon.data?.image?.thumbnail && (
              <div
                className="bg-gradient-to-b from-blue-200 to-green-200 rounded-lg p-6 mb-4 shadow-inner"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                }}
              >
                <img
                  src={pokemon.data.image.thumbnail}
                  alt={pokemon.name}
                  className="w-full h-64 object-contain drop-shadow-lg"
                />
              </div>
            )}

            {/* Basic Info - Card style */}
            <div className="bg-white bg-opacity-90 rounded-lg p-3 mb-3 shadow-md">
              <p className="text-sm text-gray-700">
                <strong>Height:</strong> {pokemon.height.toFixed(1)} m |{" "}
                <strong>Weight:</strong> {pokemon.weight.toFixed(1)} kg
              </p>
            </div>

            {/* Description */}
            {pokemon.data?.description && (
              <div className="bg-white bg-opacity-90 rounded-lg p-3 mb-3 shadow-md">
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {pokemon.data.description}
                </p>
              </div>
            )}

            {/* Stats */}
            {pokemon.stats && (
              <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-3 shadow-md">
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
            <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-4 shadow-md">
              <h3 className="font-bold text-lg mb-2">Abilities</h3>
              <p>{pokemon.abilities.map((a) => a.name).join(", ")}</p>
            </div>

            {/* Catch/Release Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => handleToggle(pokemon.id)}
                className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transform transition hover:scale-105 ${
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
  );
}
