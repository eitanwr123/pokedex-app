interface FilterPanelProps {
  filters: {
    type: string;
    evolutionTier: string;
    description: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  // All Pokémon types (you can also fetch this from an API or constants file)
  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  // Count active filters (excluding empty strings)
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {/* Filter Controls Row */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Type Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Evolution Tier Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evolution Tier
          </label>
          <select
            value={filters.evolutionTier}
            onChange={(e) => onFilterChange("evolutionTier", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stages</option>
            <option value="1">1st Stage (Base)</option>
            <option value="2">2nd Stage (Evolved)</option>
            <option value="3">3rd Stage (Final)</option>
          </select>
        </div>

        {/* Description Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={filters.description}
            onChange={(e) => onFilterChange("description", e.target.value)}
            placeholder="Search description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Clear Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters Display (Optional) */}
      {activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.type && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              Type: {filters.type}
              <button
                onClick={() => onFilterChange("type", "")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.evolutionTier && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              Tier: {filters.evolutionTier}
              <button
                onClick={() => onFilterChange("evolutionTier", "")}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.description && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              Description: "{filters.description}"
              <button
                onClick={() => onFilterChange("description", "")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
