import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import dynamic from "next/dynamic";
import "../styles/globals.css";
// import "@n8n/chat/style.css"; // Temporarily commented out
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// Dynamically import the debug panel (only loaded in development)
const DebugPanel = dynamic(
  () =>
    process.env.NODE_ENV === "development"
      ? import("../components/debug/DebugPanel")
      : Promise.resolve(() => null),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "JobFit.AI - AI-Powered Job Matching Platform",
  description:
    "Find the perfect job match with our AI-powered platform. Smart job searching and recruiting made easy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans bg-background">
        <AuthProvider>{children}</AuthProvider>
        <DebugPanel />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
