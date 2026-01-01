import { useSearchParams } from "react-router-dom";

export interface UrlFilters {
  type: string;
  evolutionTier: string;
  description: string;
  name: string;
}

export interface UseUrlFiltersReturn {
  // Filter values
  filters: UrlFilters;
  page: number;
  limit: number;
  selectedPokemonId: number | null;

  // Filter update functions
  setFilter: (filterName: keyof UrlFilters, value: string) => void;
  clearFilters: () => void;

  // Pagination functions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  handleNext: () => void;
  handlePrev: () => void;

  // Selected Pokemon functions
  setSelectedPokemonId: (id: number | null) => void;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function useUrlFilters(): UseUrlFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const filters: UrlFilters = {
    type: searchParams.get("type") || "",
    evolutionTier: searchParams.get("evolutionTier") || "",
    description: searchParams.get("description") || "",
    name: searchParams.get("name") || "",
  };

  // Parse pagination from URL
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;

  // Parse selected Pokemon ID from URL
  const pokemonIdParam = searchParams.get("pokemonId");
  const selectedPokemonId = pokemonIdParam ? parseInt(pokemonIdParam, 10) : null;

  // Update a single filter
  const setFilter = (filterName: keyof UrlFilters, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    // Reset to page 1 when filters change
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Clear all filters (but keep pagination)
  const clearFilters = () => {
    const newParams = new URLSearchParams();
    const currentPage = searchParams.get("page");
    const currentLimit = searchParams.get("limit");

    if (currentPage) newParams.set("page", currentPage);
    if (currentLimit) newParams.set("limit", currentLimit);

    setSearchParams(newParams);
  };

  // Set page
  const setPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  // Set limit
  const setLimit = (newLimit: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", newLimit.toString());
    // Reset to page 1 when limit changes
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Navigate to next page
  const handleNext = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", (page + 1).toString());
    setSearchParams(newParams);
  };

  // Navigate to previous page
  const handlePrev = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", Math.max(1, page - 1).toString());
    setSearchParams(newParams);
  };

  // Set selected Pokemon ID
  const setSelectedPokemonId = (id: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (id !== null) {
      newParams.set("pokemonId", id.toString());
    } else {
      newParams.delete("pokemonId");
    }
    setSearchParams(newParams);
  };

  return {
    filters,
    page,
    limit,
    selectedPokemonId,
    setFilter,
    clearFilters,
    setPage,
    setLimit,
    handleNext,
    handlePrev,
    setSelectedPokemonId,
  };
}
