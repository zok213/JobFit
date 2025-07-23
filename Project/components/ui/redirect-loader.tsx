"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RedirectLoaderProps {
  destination: string;
  delay?: number; // milliseconds before redirect
  message?: string;
  showLogo?: boolean;
  logoSize?: { width: number; height: number };
}

export function RedirectLoader({
  destination,
  delay = 300,
  message = "Redirecting...",
  showLogo = true,
  logoSize = { width: 120, height: 60 },
}: RedirectLoaderProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    // Preload the destination page
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = destination;
    document.head.appendChild(preloadLink);
    
    // Set up the redirect
    const redirectTimeout = setTimeout(() => {
      if (isMounted) {
        setIsRedirecting(true);
        router.push(destination);
      }
    }, delay);
    
    // Animate progress bar more smoothly
    const animationInterval = setInterval(() => {
      if (isMounted) {
        setElapsedTime(prev => {
          const newTime = prev + 30;
          
          // Progress calculation with smooth acceleration
          // Start slow, accelerate in the middle, then slow down
          let newProgress;
          if (newTime < delay * 0.3) {
            // Slow start - first 30%
            newProgress = (newTime / delay) * 100 * 0.8;
          } else if (newTime < delay * 0.7) {
            // Faster middle - 30% to 70%
            newProgress = ((newTime / delay) * 100 * 1.2);
          } else {
            // Slow end - last 30%
            newProgress = Math.min(
              ((newTime / delay) * 100 * 0.95) + 5, 
              isRedirecting ? 100 : 95
            );
          }
          
          setProgress(Math.min(newProgress, isRedirecting ? 100 : 95));
          return newTime;
        });
      }
    }, 30);
    
    return () => {
      isMounted = false;
      clearTimeout(redirectTimeout);
      clearInterval(animationInterval);
      document.head.removeChild(preloadLink);
    };
  }, [router, destination, delay, isRedirecting]);
  
  // Force complete the progress when leaving
  useEffect(() => {
    if (isRedirecting) {
      setProgress(100);
    }
  }, [isRedirecting]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-auto p-6">
        {showLogo && (
          <div className="mb-6 flex justify-center">
            <Image 
              src="/img/LOGO.png" 
              alt="JobFit.AI Logo" 
              width={logoSize.width} 
              height={logoSize.height}
              priority
              className="animate-pulse"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-lime-500 rounded-full transition-all ease-out"
            style={{ 
              width: `${progress}%`,
              transitionDuration: isRedirecting ? "300ms" : "100ms"
            }}
          ></div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-gray-500 mt-2">
          {elapsedTime > 2500 ? (
            <button 
              onClick={() => {
                setIsRedirecting(true);
                router.push(destination);
              }}
              className="text-lime-600 hover:text-lime-700 hover:underline font-medium"
            >
              Click here to continue →
            </button>
          ) : (
            <>
              <span className="block h-2 w-2 rounded-full bg-lime-500 animate-pulse"></span>
              <span>Loading your dashboard...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 