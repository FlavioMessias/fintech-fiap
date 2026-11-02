"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  FileChartColumn,
  Target,
  Settings,
  Sun,
  LogOut,
} from "lucide-react";

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
  const pathname = usePathname();
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem("usuario_fintech");

    if (!usuarioSalvo) {
      return;
    }

    try {
      setUsuario(JSON.parse(usuarioSalvo));
    } catch {
      setUsuario(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario_fintech");
    router.push("/login");
  };

  const iniciais = usuario?.nome
    ? usuario.nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((nome) => nome.charAt(0))
        .join("")
        .toUpperCase()
    : "FM";

  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        hidden h-screen w-[248px]
        flex-col
        border-r border-[#20252d]
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
          ({ nome, href, Icone }) => {
            const ativo =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
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
                  size={19}
                  strokeWidth={1.7}
                />

                {nome}
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
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            border
            border-[#343b44]
            px-5
            py-3
            text-sm
            text-[#d1d5db]
            transition
            hover:bg-[#171c23]
          "
        >
          <Sun size={18} strokeWidth={1.6} />

          Tema escuro
        </button>

        <Link
          href="/configuracoes"
          className="
            mt-2
            flex
            items-center
            gap-3
            rounded-lg
            px-5
            py-3
            text-sm
            text-[#a5abb4]
            hover:bg-[#171c23]
            hover:text-white
          "
        >
          <Settings size={18} strokeWidth={1.6} />

          Configurações
        </Link>

        <div
          className="
            mt-3
            flex
            items-center
            gap-3
            rounded-lg
            border
            border-[#252b33]
            px-4
            py-3
          "
        >
          <Link
            href="/minha-conta"
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#15983b]
                text-[11px]
                font-semibold
                text-white
              "
            >
              {iniciais}
            </div>

            <span
              className="
                truncate
                text-xs
                text-[#d4d7dc]
              "
            >
              {usuario?.nome ?? "Flavio Messias"}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className="
              text-[#8c949e]
              hover:text-white
            "
          >
            <LogOut
              size={16}
              strokeWidth={1.6}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}