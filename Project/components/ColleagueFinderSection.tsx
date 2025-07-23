"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export const ColleagueFinderSection = () => {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12 max-w-[1440px] mx-auto">
      <div className="bg-gray-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-[550px]">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Find Your Perfect Colleague
          </h2>
          <p className="text-base text-gray-700">
            Contact us today to discover how our AI-powered hiring platform can connect you with the right talent effortlessly!
          </p>
          <Link href="/register" className="mt-4">
            <Button className="bg-zinc-900 text-lime-300 hover:bg-lime-300 hover:text-zinc-900 transition-all px-6 py-3">
              Get your free trial
            </Button>
          </Link>
        </div>
        
        <div className="relative w-full md:w-1/2 h-[250px]">
          <Image
            src="/img/Find_Your_Perfect_Colleague.png"
            alt="Find Your Perfect Colleague"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}; 