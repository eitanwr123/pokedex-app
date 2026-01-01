import React from 'react';

interface FiltersBarProps {
  children: React.ReactNode;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ children }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
};
