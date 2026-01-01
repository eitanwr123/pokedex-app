interface MessageBoxProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  variant?: "info" | "empty" | "warning";
}

export function MessageBox({
  title,
  description,
  action,
  icon,
  variant = "info",
}: MessageBoxProps) {
  const variantStyles = {
    info: "text-blue-600",
    empty: "text-gray-600",
    warning: "text-yellow-600",
  };

  return (
    <div className="text-center py-12">
      {icon && (
        <div className={`mb-4 flex justify-center ${variantStyles[variant]}`}>
          {icon}
        </div>
      )}
      <p className="text-gray-600 text-lg mb-2">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
