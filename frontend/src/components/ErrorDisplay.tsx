interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  type?: "error" | "warning";
}

export function ErrorDisplay({
  message,
  onRetry,
  type = "error",
}: ErrorDisplayProps) {
  const isWarning = type === "warning";

  return (
    <div
      className={`${
        isWarning
          ? "bg-yellow-100 border-yellow-400 text-yellow-700"
          : "bg-red-100 border-red-400 text-red-700"
      } border px-4 py-3 rounded mb-4`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onRetry}
          className={`${
            isWarning
              ? "bg-yellow-700 hover:bg-yellow-800"
              : "bg-red-700 hover:bg-red-800"
          } text-white px-3 py-1 rounded`}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
