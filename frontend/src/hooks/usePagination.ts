import { useState, useCallback } from "react";

interface UsePaginationReturn {
  page: number;
  limit: number;
  handleNext: () => void;
  handlePrev: () => void;
  handleLimitChange: (newLimit: number) => void;
}

export function usePagination(
  initialPage = 1,
  initialLimit = 10
): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handleNext = useCallback(() => setPage((p) => p + 1), []);
  const handlePrev = useCallback(() => setPage((p) => p - 1), []);
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    handleNext,
    handlePrev,
    handleLimitChange,
  };
}
