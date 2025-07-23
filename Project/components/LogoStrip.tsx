"use client";

import Image from "next/image";
import { Button } from "./ui/button";

export const LogoStrip = () => {
  const logos = [
    {
      src: "/img/careerbuilder.png",
      alt: "Careerbuilder Logo",
    },
    {
      src: "/img/indeed.png",
      alt: "Indeed Logo",
    },
    {
      src: "/img/vieclam24h.png",
      alt: "Vieclam24h Logo",
    },
    {
      src: "/img/yboxvn.png",
      alt: "Ybox Logo",
    },
    {
      src: "/img/careerlink.png",
      alt: "Careerlink Logo",
    },
    {
      src: "/img/careerviet.png",
      alt: "Careerviet Logo",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-white relative overflow-hidden">
      {/* Simple CSS background pattern instead of image */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:24px_24px] opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header - Better responsive typography */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14 px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            TRUSTED BY LEADING JOB PLATFORMS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            We integrate with top job boards and recruiting platforms to provide
            the most comprehensive job search experience
          </p>
        </div>

        {/* Logo display section with improved container for better mobile display */}
        <div className="relative mx-auto max-w-full sm:max-w-3xl lg:max-w-5xl">
          {/* Edge fade effects - adjusted for better mobile view */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Improved container with better border radius for small screens */}
          <div className="overflow-hidden rounded-lg sm:rounded-xl border border-gray-100 bg-white shadow-md">
            <div className="py-6 sm:py-8 px-2 sm:px-4 overflow-hidden">
              <div className="flex logo-carousel">
                {/* Doubled logos for continuous carousel effect */}
                {[...logos, ...logos].map((logo, index) => (
                  <div
                    key={index}
                    className="flex-none mx-4 sm:mx-6 md:mx-8 transition-all duration-300 hover:scale-105 transform"
                  >
                    {/* Responsive logo container */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 h-16 sm:h-20 md:h-24 w-28 sm:w-32 md:w-40 flex items-center justify-center">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={120}
                        height={40}
                        className="max-h-8 sm:max-h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improved responsive animation styles */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-180px * 6));
          }
        }

        .logo-carousel {
          animation: scroll 30s linear infinite;
          width: calc(180px * 12);
        }

        .logo-carousel:hover {
          animation-play-state: paused;
        }

        /* Responsive adjustments for animation */
        @media (min-width: 640px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-220px * 6));
            }
          }

          .logo-carousel {
            animation: scroll 30s linear infinite;
            width: calc(220px * 12);
          }
        }

        @media (min-width: 768px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-250px * 6));
            }
          }

          .logo-carousel {
            animation: scroll 30s linear infinite;
            width: calc(250px * 12);
          }
        }
      `}</style>
    </section>
  );
};
