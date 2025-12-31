import { memo } from "react";

interface PokemonCardProps {
  pokemonId: number;
  name: string;
  type: string[];
  isCaught: boolean;
  onToggle: (pokemonId: number) => void;
  onClick?: (pokemonId: number) => void;
}

const PokemonCard = memo(function PokemonCard({
  pokemonId,
  name,
  type,
  isCaught,
  onToggle,
  onClick,
}: PokemonCardProps) {
  const handleClick = () => {
    onToggle(pokemonId);
  };

  const handleCardClick = () => {
    onClick?.(pokemonId);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-300 rounded-lg p-4 my-2 bg-white shadow-sm max-w-xs cursor-pointer hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-bold mb-2">{name}</h2>

      <p className="text-gray-600 mb-2">Type: {[...type].join(", ")}</p>

      <p className="mb-3">Status: {isCaught ? "✅ Caught" : "❌ Not Caught"}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer text-sm font-bold hover:bg-green-600 transition-colors"
        aria-label={isCaught ? `Release ${name}` : `Catch ${name}`}
      >
        {isCaught ? "Release" : "Catch"}
      </button>
    </div>
  );
});

export default PokemonCard;
