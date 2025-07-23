"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamic import of the LandingPage component to prevent hydration mismatch
const LandingPage = dynamic(() => import('../components/LandingPage').then(mod => ({ default: mod.LandingPage })), {
  ssr: false, // Disable SSR for this component to prevent hydration mismatch
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-lime-300 animate-spin" />
        <p className="text-lg font-medium">Loading JobFit.AI...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-lime-300 animate-spin" />
          <p className="text-lg font-medium">Loading JobFit.AI...</p>
        </div>
      </div>
    }>
      <LandingPage />
    </Suspense>
  );
}
