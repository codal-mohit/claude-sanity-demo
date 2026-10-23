import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/sections";
import { cn } from "@/lib/cn";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demo Store",
  description: "Demo store built with Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(manrope.variable, "antialiased")}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-4 py-12 sm:px-8 sm:py-16">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
