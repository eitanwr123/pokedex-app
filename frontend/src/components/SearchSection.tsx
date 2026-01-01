import { SearchInput } from "./searchInput";
import { FilterPanel } from "./FilterPanel";
import type { UrlFilters } from "../hooks/useUrlFilters";

interface SearchSectionProps {
  filters: UrlFilters;
  onFilterChange: (filterName: keyof UrlFilters, value: string) => void;
  onClearFilters: () => void;
  isFetching: boolean;
}

export function SearchSection({
  filters,
  onFilterChange,
  onClearFilters,
  isFetching,
}: SearchSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          value={filters.name}
          onChange={(value) => onFilterChange("name", value)}
        />
        {isFetching && (
          <span className="text-sm text-gray-500">Searching...</span>
        )}
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}
