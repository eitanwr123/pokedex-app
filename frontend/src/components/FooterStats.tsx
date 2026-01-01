import React from 'react';

interface FooterStatsProps {
  caughtCount: number;
  totalCount: number;
  isLoadingCaught: boolean;
  isLoadingTotal: boolean;
}

export const FooterStats = React.memo<FooterStatsProps>(({
  caughtCount,
  totalCount,
  isLoadingCaught,
  isLoadingTotal,
}) => {
  const percentage = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

  return (
    <div className="sticky bottom-0 z-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Collection Progress</h2>
            <p className="text-blue-100 text-sm">Gotta catch 'em all!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">
            {isLoadingCaught ? (
              <span className="animate-pulse">...</span>
            ) : (
              caughtCount
            )}
            <span className="text-2xl text-blue-200 mx-2">/</span>
            {isLoadingTotal ? (
              <span className="animate-pulse">...</span>
            ) : (
              totalCount
            )}
          </div>
          <p className="text-blue-100 text-sm mt-1">Pokemon Caught</p>
        </div>
      </div>

      <div className="relative">
        <div className="bg-white/20 backdrop-blur-sm rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold text-blue-100">
            {percentage.toFixed(1)}% Complete
          </span>
          {percentage === 100 && (
            <span className="text-yellow-300 font-bold text-sm animate-bounce">
              Master Trainer!
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

FooterStats.displayName = 'FooterStats';
