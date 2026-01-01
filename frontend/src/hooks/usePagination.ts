import { useState } from "react";

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

  const handleNext = () => setPage((p) => p + 1);
  const handlePrev = () => setPage((p) => p - 1);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    page,
    limit,
    handleNext,
    handlePrev,
    handleLimitChange,
  };
}
