import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';
import { Loader } from './Loader';

interface MainContentProps {
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({
  isLoading,
  error,
  children
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {error && (
        <ErrorDisplay
          message={error.message}
          variant="error"
        />
      )}
      {isLoading ? (
        <Loader size="large" fullScreen />
      ) : (
        children
      )}
    </main>
  );
};
