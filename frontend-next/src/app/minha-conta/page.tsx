"use client";

import {
  CircleUserRound,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppShell from "@/components/AppShell";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

export default function MinhaContaPage() {
  const router =
    useRouter();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem(
        "usuario_fintech"
      );

    if (!usuarioSalvo) {
      router.push(
        "/login"
      );

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
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.push(
        "/login"
      );
    } finally {
      setCarregando(
        false
      );
    }
  }, [
    router,
  ]);

  const iniciais =
    useMemo(() => {
      if (!usuario?.nome) {
        return "U";
      }

      return usuario.nome
        .trim()
        .split(/\s+/)
        .slice(
          0,
          2
        )
        .map(
          (
            parte
          ) =>
            parte
              .charAt(
                0
              )
              .toUpperCase()
        )
        .join("");
    }, [
      usuario,
    ]);

  function sair() {
    localStorage.removeItem(
      "usuario_fintech"
    );

    router.push(
      "/login"
    );
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
          Carregando sua conta...
        </div>
      </AppShell>
    );
  }

  if (!usuario) {
    return null;
  }

  const usuarioAtivo =
    usuario.ativo ===
    "S";

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto w-full max-w-[1040px] px-6 py-9 lg:px-10">

          {/* CABEÇALHO */}

          <header className="mb-8">
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
              Minha conta
            </h1>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Consulte suas informações de acesso e os dados da sua conta
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

            {/* PERFIL */}

            <aside
              className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-6"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-2xl font-bold text-white">
                  {
                    iniciais
                  }
                </div>

                <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">
                  {
                    usuario.nome
                  }
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {
                    usuario.email
                  }
                </p>

                <span
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      usuarioAtivo
                        ? "var(--goal-active-bg)"
                        : "var(--error-bg)",

                    color:
                      usuarioAtivo
                        ? "var(--goal-active-text)"
                        : "var(--error-text)",
                  }}
                >
                  <ShieldCheck
                    size={14}
                  />

                  {usuarioAtivo
                    ? "Conta ativa"
                    : "Conta inativa"}
                </span>
              </div>

              <div className="mt-6 border-t border-[var(--form-divider)] pt-6">
                <button
                  type="button"
                  onClick={
                    sair
                  }
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition hover:bg-red-500/10"
                  style={{
                    borderColor:
                      "var(--error-border)",
                    color:
                      "var(--error-text)",
                  }}
                >
                  <LogOut
                    size={17}
                  />

                  Sair da conta
                </button>
              </div>
            </aside>

            {/* CONTEÚDO */}

            <div className="space-y-6">

              {/* DADOS PESSOAIS */}

              <section
                className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-6 md:p-7"
                style={{
                  boxShadow:
                    "var(--card-shadow)",
                }}
              >
                <div className="flex items-center gap-3 border-b border-[var(--form-divider)] pb-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--accent)]"
                    style={{
                      backgroundColor:
                        "var(--goal-icon-bg)",
                    }}
                  >
                    <CircleUserRound
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-[var(--text-primary)]">
                      Dados pessoais
                    </h2>

                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                      Informações vinculadas ao seu usuário
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* NOME */}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <UserRound
                        size={16}
                      />

                      Nome
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {
                        usuario.nome
                      }
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <Mail
                        size={16}
                      />

                      E-mail
                    </div>

                    <p className="mt-2 break-all text-sm font-semibold text-[var(--text-primary)]">
                      {
                        usuario.email
                      }
                    </p>
                  </div>

                  {/* ID */}

                  <div>
                    <p className="text-sm text-[var(--text-muted)]">
                      Código do usuário
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      #
                      {
                        usuario.idUsuario
                      }
                    </p>
                  </div>

                  {/* SITUAÇÃO */}

                  <div>
                    <p className="text-sm text-[var(--text-muted)]">
                      Situação
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {usuarioAtivo
                        ? "Ativa"
                        : "Inativa"}
                    </p>
                  </div>
                </div>
              </section>

              {/* SEGURANÇA */}

              <section className="fin-tip rounded-[14px] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="fin-tip-icon mt-0.5 shrink-0"
                  />

                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                      Segurança da conta
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      Suas informações financeiras são exibidas de acordo com o usuário autenticado. Para encerrar o acesso neste dispositivo, utilize o botão “Sair da conta”.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}