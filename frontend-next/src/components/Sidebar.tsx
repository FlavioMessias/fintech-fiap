"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  FileChartColumn,
  Target,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import {
  useTheme,
} from "@/components/ThemeProvider";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

const itensNavegacao = [
  {
    nome: "Dashboard",
    href: "/dashboard",
    Icone: LayoutDashboard,
  },
  {
    nome: "Entradas",
    href: "/entradas",
    Icone: ArrowDownToLine,
  },
  {
    nome: "Saídas",
    href: "/saidas",
    Icone: ArrowUpFromLine,
  },
  {
    nome: "Investimentos",
    href: "/investimentos",
    Icone: TrendingUp,
  },
  {
    nome: "Relatórios",
    href: "/relatorios",
    Icone: FileChartColumn,
  },
  {
    nome: "Metas",
    href: "/metas",
    Icone: Target,
  },
];

export default function Sidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    mounted,
    setMounted,
  ] =
    useState(false);

  /*
   * Tudo que depende do navegador é executado
   * somente depois da primeira hidratação.
   *
   * Dessa forma:
   *
   * servidor:
   * mounted = false
   *
   * primeiro render do navegador:
   * mounted = false
   *
   * depois do useEffect:
   * mounted = true
   */
  useEffect(() => {
    setMounted(
      true
    );

    const usuarioSalvo =
      localStorage.getItem(
        "usuario_fintech"
      );

    if (!usuarioSalvo) {
      return;
    }

    try {
      const usuarioConvertido: UsuarioLogado =
        JSON.parse(
          usuarioSalvo
        );

      setUsuario(
        usuarioConvertido
      );
    } catch {
      setUsuario(
        null
      );
    }
  }, []);

  const handleLogout =
    () => {
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.push(
        "/login"
      );
    };

  const iniciais =
    usuario?.nome
      ? usuario.nome
          .trim()
          .split(/\s+/)
          .slice(
            0,
            2
          )
          .map(
            (
              nome
            ) =>
              nome.charAt(
                0
              )
          )
          .join("")
          .toUpperCase()
      : "U";

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        hidden
        h-screen
        w-[248px]
        flex-col
        border-r
        border-[#20252d]
        bg-[#0d1016]
        md:flex
      "
    >
      {/* LOGO */}

      <div className="px-7 pb-7 pt-7">
        <Link
          href="/dashboard"
          className="
            text-[26px]
            font-black
            tracking-[0.17em]
            text-white
          "
        >
          FINTECH
        </Link>

        <p
          className="
            mt-1
            text-[10px]
            tracking-wide
            text-[#a0a6af]
          "
        >
          Sua vida financeira sob controle
        </p>
      </div>

      <div className="mx-4 border-t border-[#252b33]" />

      {/* NAVEGAÇÃO */}

      <nav
        className="
          mt-7
          flex
          flex-1
          flex-col
          gap-2
          px-3
        "
      >
        {itensNavegacao.map(
          ({
            nome,
            href,
            Icone,
          }) => {
            const ativo =
              pathname ===
                href ||
              pathname.startsWith(
                `${href}/`
              );

            return (
              <Link
                key={
                  href
                }
                href={
                  href
                }
                className={`
                  flex
                  h-[46px]
                  items-center
                  gap-4
                  rounded-lg
                  px-5
                  text-[14px]
                  transition-all
                  ${
                    ativo
                      ? "bg-[#176b2d] font-medium text-white"
                      : "text-[#9ca3af] hover:bg-[#171c23] hover:text-white"
                  }
                `}
              >
                <Icone
                  size={
                    19
                  }
                  strokeWidth={
                    1.7
                  }
                />

                {
                  nome
                }
              </Link>
            );
          }
        )}
      </nav>

      {/* RODAPÉ */}

      <div
        className="
          border-t
          border-[#252b33]
          px-3
          pb-5
          pt-5
        "
      >
        {/* TEMA */}

        <button
          type="button"
          onClick={
            toggleTheme
          }
          disabled={
            !mounted
          }
          aria-label={
            mounted
              ? theme ===
                "dark"
                ? "Ativar tema claro"
                : "Ativar tema escuro"
              : "Alternar tema"
          }
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            border
            border-[#252b33]
            px-5
            py-3
            text-sm
            text-[#a5abb4]
            transition
            hover:bg-[#171c23]
            hover:text-white
            disabled:cursor-default
          "
        >
          {mounted ? (
            theme ===
            "dark" ? (
              <Sun
                size={
                  18
                }
                strokeWidth={
                  1.6
                }
              />
            ) : (
              <Moon
                size={
                  18
                }
                strokeWidth={
                  1.6
                }
              />
            )
          ) : (
            <span
              aria-hidden="true"
              className="h-[18px] w-[18px] shrink-0"
            />
          )}

          <span>
            {mounted
              ? theme ===
                "dark"
                ? "Tema claro"
                : "Tema escuro"
              : "Tema"}
          </span>
        </button>

        {/* CONTA */}

        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#252b33] px-4 py-3">
          <Link
            href="/minha-conta"
            title="Minha conta"
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15983b] text-[11px] font-semibold text-white">
              {
                iniciais
              }
            </div>

            <div className="min-w-0">
              <span className="block truncate text-xs text-[#d4d7dc]">
                {usuario?.nome ??
                  "Usuário"}
              </span>

              <span className="mt-0.5 block text-[10px] text-[#7f8791]">
                Minha conta
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={
              handleLogout
            }
            title="Sair"
            aria-label="Sair da conta"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8c949e] transition hover:bg-[#171c23] hover:text-white"
          >
            <LogOut
              size={
                16
              }
              strokeWidth={
                1.6
              }
            />
          </button>
        </div>
      </div>
    </aside>
  );
}