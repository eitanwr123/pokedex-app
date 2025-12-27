interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onNext: () => void;
  onPrev: () => void;
  onLimitChange: (limit: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  limit,
  onNext,
  onPrev,
  onLimitChange,
}: PaginationControlsProps) {
  return (
    <div className="flex gap-4 items-center justify-center my-5" role="navigation" aria-label="Pagination">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-green-500 text-white border-0 rounded cursor-pointer text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        Previous
      </button>
      <span className="text-base font-medium" aria-live="polite" aria-atomic="true">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-green-500 text-white border-0 rounded cursor-pointer text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        Next
      </button>
      <div className="flex items-center gap-2">
        <label htmlFor="limit">Show:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-3 py-1.5 text-sm rounded border border-gray-300 cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
