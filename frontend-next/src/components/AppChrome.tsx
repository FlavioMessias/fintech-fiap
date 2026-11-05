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

  if (
    rotaPublicaComChrome
  ) {
    return (
      <>
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      {children}
    </>
  );
}