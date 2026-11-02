"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

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
  "/configuracoes",
];

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();

  const areaAutenticada = rotasAutenticadas.some(
    (rota) =>
      pathname === rota ||
      pathname.startsWith(`${rota}/`)
  );

  if (areaAutenticada) {
    return <>{children}</>;
  }

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