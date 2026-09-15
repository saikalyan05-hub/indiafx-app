import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CinematicBackground } from "@/components/CinematicBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IndiaFX — The Next Big Story Is Here",
  description:
    "Bite-sized Indian micro dramas. Short episodes. Bigger feelings. New stories every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased bg-[#f7f5f2] text-[#141414] relative selection:bg-[#ffd6de]`}
      >
        <CinematicBackground />
        <Navbar />
        <main className="relative min-h-screen overflow-x-clip pb-[calc(5rem+env(safe-area-inset-bottom,16px))] lg:pb-12">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
