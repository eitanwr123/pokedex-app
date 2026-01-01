interface LoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export function Loader({
  message,
  size = "medium",
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = {
    small: "w-8 h-8 border-2",
    medium: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4",
  };

  const paddingClasses = {
    small: "py-4",
    medium: "py-8",
    large: "py-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : paddingClasses[size]
      }`}
    >
      <div
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
