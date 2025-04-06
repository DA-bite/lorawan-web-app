
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-40 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-60 bg-muted rounded"></div>
        <div className="h-60 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default LoadingState;
