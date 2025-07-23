import { redirect } from "next/navigation";
import { RedirectLoader } from "@/components/ui/redirect-loader";

// Force dynamic to ensure the redirect happens on each request
export const dynamic = "force-dynamic";

// This exports the server component with the redirect
export default function EmployerPage() {
  // Server-side redirect - fastest approach
  redirect("/employer/dashboard");
  
  // This won't render, but TypeScript needs a valid return
  return null;
} 