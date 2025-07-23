"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  // Use useEffect to set the year on the client-side only
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-zinc-900 pt-10 pb-6">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div className="flex items-center">
              <Link href="/" aria-label="JobFit.AI Homepage">
                <Image 
                  src="/img/LOGO.png" 
                  alt="JobFit.AI Logo" 
                  width={120} 
                  height={36} 
                  className="w-auto h-[36px] brightness-200"
                />
              </Link>
            </div>
            <div className="flex gap-3">
              <Link href="#" aria-label="LinkedIn" className="bg-lime-300 rounded-full p-2 hover:bg-lime-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="2" y="9" width="4" height="12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="4" r="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Twitter" className="bg-lime-300 rounded-full p-2 hover:bg-lime-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Facebook" className="bg-lime-300 rounded-full p-2 hover:bg-lime-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-lime-300 font-medium text-lg">Contact us</h2>
              <div className="flex flex-col gap-3 text-sm text-gray-300">
                <p>Email: <a href="mailto:jobfit.ai@gmail.com" className="hover:text-lime-300 transition-colors">jobfit.ai@gmail.com</a></p>
                <p>Phone: <a href="tel:5555678901" className="hover:text-lime-300 transition-colors">555-567-8901</a></p>
                <p>Address: Vietnam</p>
              </div>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <form className="flex flex-col gap-4" onSubmit={handleSubscribe}>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-sm text-white bg-transparent focus:border-lime-300 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="md:w-auto px-6 py-3 text-sm font-medium text-black bg-lime-300 rounded-xl cursor-pointer hover:bg-lime-200 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            © {currentYear || '2023'} JobFit.AI - All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
