import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LangRoute - Unified LLM API Gateway",
  description: "A powerful proxy server for routing LLM API requests with features like caching, rate limiting, and automatic failover.",
  keywords: ["LLM", "API Gateway", "OpenAI", "Mistral AI", "Rate Limiting", "Cost Management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`} style={{ backgroundColor: '#FCFCFB' }}>
        <Sidebar />
        <div className="pl-64">
          {children}
        </div>
      </body>
    </html>
  );
}
