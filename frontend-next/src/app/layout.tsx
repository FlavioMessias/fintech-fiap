import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";

import AppChrome from "@/components/AppChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fintech FIAP",
  description:
    "Aplicação de controle financeiro pessoal desenvolvida para a FIAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#f4f6f5] text-[#161b18]`}
      >
        <Suspense
          fallback={
            <main className="min-h-screen bg-[#f4f6f5]">
              {children}
            </main>
          }
        >
          <AppChrome>
            {children}
          </AppChrome>
        </Suspense>
      </body>
    </html>
  );
}