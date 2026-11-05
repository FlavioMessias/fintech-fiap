"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] =
    useState<Theme>("light");

  useEffect(() => {
    const temaSalvo =
      localStorage.getItem(
        "fintech_theme"
      );

    const temaInicial: Theme =
      temaSalvo === "dark"
        ? "dark"
        : "light";

    setTheme(temaInicial);

    document.documentElement.classList.toggle(
      "light-theme",
      temaInicial === "light"
    );
  }, []);

  function toggleTheme() {
    setTheme((temaAtual) => {
      const novoTema: Theme =
        temaAtual === "light"
          ? "dark"
          : "light";

      localStorage.setItem(
        "fintech_theme",
        novoTema
      );

      document.documentElement.classList.toggle(
        "light-theme",
        novoTema === "light"
      );

      return novoTema;
    });
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto =
    useContext(ThemeContext);

  if (!contexto) {
    throw new Error(
      "useTheme deve ser utilizado dentro de ThemeProvider."
    );
  }

  return contexto;
}