"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to blog page after a short delay
    const timeout = setTimeout(() => {
      router.push("/blog");
    }, 200);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Redirecting to Resources...</h1>
        <p className="text-gray-500">Please wait, you are being redirected to our resources page.</p>
      </div>
    </div>
  );
}