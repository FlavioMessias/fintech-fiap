"use client";

import type {
  ReactNode,
} from "react";

import {
  usePathname,
} from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AppChromeProps {
  children: ReactNode;
}

const rotasAutenticadas = [
  "/dashboard",
  "/entradas",
  "/saidas",
  "/investimentos",
  "/metas",
  "/relatorios",
  "/minha-conta",
];

const rotasPublicasComChrome = [
  "/",
];

export default function AppChrome({
  children,
}: AppChromeProps) {
  const pathname =
    usePathname();

  const areaAutenticada =
    rotasAutenticadas.some(
      (
        rota
      ) =>
        pathname ===
          rota ||
        pathname.startsWith(
          `${rota}/`
        )
    );

  if (
    areaAutenticada
  ) {
    return (
      <>
        {children}
      </>
    );
  }

  const rotaPublicaComChrome =
    rotasPublicasComChrome.includes(
      pathname
    );

  if (rotaPublicaComChrome) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <Header />

      <main className="flex flex-1 flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}

  return (
    <>
      {children}
    </>
  );
}