import React from 'react';

/** Reusable pulsing skeleton block. */
const Bone = ({ className = '' }) => (
  <div className={`bg-slate-200 rounded-xl animate-pulse ${className}`} />
);

/**
 * Full-page skeleton shown while analytics data is loading.
 * Mirrors the real layout so the transition feels seamless.
 */
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Filters row */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Bone className="h-7 w-52" />
        <Bone className="h-4 w-72" />
      </div>
      <Bone className="h-10 w-72 rounded-lg" />
    </div>

    {/* KPI cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Bone key={i} className="h-28" />
      ))}
    </div>

    {/* Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Bone className="h-80" />
      <Bone className="h-80" />
    </div>

    {/* Row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Bone className="h-64" />
      <Bone className="h-64" />
    </div>

    {/* Row 3 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Bone className="h-72" />
      <Bone className="h-72" />
    </div>
  </div>
);

export default LoadingSkeleton;
