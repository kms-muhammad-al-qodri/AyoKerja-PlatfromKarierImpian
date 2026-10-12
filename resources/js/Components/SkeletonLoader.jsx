import React from 'react';

/**
 * SkeletonLoader — Animated Shimmer Placeholder Component for Dashboard Loading States
 * type: 'overview' | 'jobs' | 'analysis' | 'roadmap' | 'cv-builder'
 */
export default function SkeletonLoader({ type = 'overview' }) {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Skeleton Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-3 w-full max-w-xl">
            <div className="flex gap-2">
              <div className="h-5 w-32 bg-slate-800/90 rounded-full" />
              <div className="h-5 w-24 bg-slate-800/60 rounded-full" />
            </div>
            <div className="h-7 w-3/4 bg-slate-800/90 rounded-xl" />
            <div className="h-3.5 w-full bg-slate-800/50 rounded-lg" />
            <div className="h-3.5 w-2/3 bg-slate-800/50 rounded-lg" />
          </div>
          <div className="flex gap-2.5 w-full md:w-auto">
            <div className="h-9 w-36 bg-slate-800 rounded-xl" />
            <div className="h-9 w-28 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Skeleton Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-800/90 rounded" />
              <div className="w-7 h-7 rounded-lg bg-slate-800/80" />
            </div>
            <div className="h-6 w-16 bg-slate-800 rounded-lg" />
            <div className="h-3 w-32 bg-slate-800/50 rounded" />
            <div className="h-1.5 w-full bg-slate-800/70 rounded-full mt-2" />
          </div>
        ))}
      </div>

      {/* Skeleton Content Grid */}
      {type === 'roadmap' ? (
        <div className="space-y-5">
          {/* Top banner shimmer */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="h-6 w-56 bg-slate-800 rounded-lg" />
              <div className="h-4 w-72 bg-slate-800/60 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-24 bg-slate-800 rounded-xl" />
              <div className="h-9 w-28 bg-teal-500/20 rounded-xl" />
            </div>
          </div>
          {/* 3D Map / nodes shimmer */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 min-h-[460px] flex flex-col justify-around gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="h-4 w-24 bg-teal-500/30 rounded-full" />
                  <div className="h-5 w-4/5 bg-slate-800 rounded" />
                  <div className="h-3.5 w-full bg-slate-800/50 rounded" />
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-4 w-12 bg-slate-800/50 rounded" />
                    <div className="h-4 w-16 bg-slate-800/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full pt-2">
              {[4, 5].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="h-4 w-24 bg-indigo-500/30 rounded-full" />
                  <div className="h-5 w-3/4 bg-slate-800 rounded" />
                  <div className="h-3.5 w-full bg-slate-800/50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : type === 'jobs' ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2.5 w-full max-w-lg">
                <div className="h-5 w-48 bg-slate-800 rounded-lg" />
                <div className="h-3.5 w-32 bg-slate-800/60 rounded" />
                <div className="flex gap-2 pt-1">
                  <div className="h-5 w-16 bg-slate-800/40 rounded-md" />
                  <div className="h-5 w-20 bg-slate-800/40 rounded-md" />
                  <div className="h-5 w-24 bg-slate-800/40 rounded-md" />
                </div>
              </div>
              <div className="h-9 w-28 bg-teal-500/20 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-44 bg-slate-800 rounded-lg" />
              <div className="h-4 w-20 bg-slate-800/50 rounded" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full bg-slate-800/50 rounded" />
              <div className="h-3.5 w-5/6 bg-slate-800/50 rounded" />
              <div className="h-3.5 w-4/6 bg-slate-800/50 rounded" />
            </div>
            <div className="h-24 w-full bg-slate-800/30 rounded-xl mt-4" />
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4 text-center flex flex-col items-center justify-center">
            <div className="h-5 w-32 bg-slate-800 rounded-lg" />
            <div className="w-24 h-24 rounded-full bg-slate-800/70 my-2" />
            <div className="h-3.5 w-40 bg-slate-800/50 rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
