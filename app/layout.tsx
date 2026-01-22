import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinagook - Dolphin-smooth teaching workspace",
  description: "Plan lessons, organize materials, and track student progress — all in one calm, organized workspace for independent English teachers.",
};

import Navbar from './components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#E6EEF2]">
            <Navbar />
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
