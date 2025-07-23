"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(true);

  // Watch for route changes
  useEffect(() => {
    // Don't trigger on mount
    if (complete) {
      setComplete(false);
      return;
    }
    
    // Start the loading bar
    let startTime = performance.now();
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress with acceleration
    const simulateProgress = () => {
      const elapsed = performance.now() - startTime;
      
      if (elapsed < 200) {
        // Fast start
        setProgress(20);
      } else if (elapsed < 400) {
        // Continue progress
        setProgress(40);
      } else if (elapsed < 700) {
        // Slow down a bit
        setProgress(60);
      } else if (elapsed < 1000) {
        // Almost there
        setProgress(80);
      } else {
        // Pretend we're still loading
        setProgress(90);
      }
    };
    
    // Start the progress animation
    const progressInterval = setInterval(simulateProgress, 200);
    
    // Complete the progress after the transition completes
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset after animation completes
      setTimeout(() => {
        setIsLoading(false);
        setComplete(true);
      }, 300); // Match transition duration
    }, 800); // Typical page transition time
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [pathname, searchParams, complete]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-50"
      style={{ 
        pointerEvents: "none",
      }}
    >
      <div 
        className="h-full bg-lime-500 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          boxShadow: "0 0 8px rgba(132, 204, 22, 0.5)" 
        }}
      />
    </div>
  );
} 