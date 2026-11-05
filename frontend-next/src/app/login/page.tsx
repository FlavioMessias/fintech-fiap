"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  WalletCards,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

export default function LoginPage() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    senha,
    setSenha,
  ] =
    useState("");

  const [
    mostrarSenha,
    setMostrarSenha,
  ] =
    useState(false);

  const [
    carregando,
    setCarregando,
  ] =
    useState(false);

  const [
    erro,
    setErro,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem(
        "usuario_fintech"
      );

    if (
      usuarioSalvo
    ) {
      router.replace(
        "/dashboard"
      );
    }
  }, [
    router,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro(
      null
    );

    if (
      !email.trim()
    ) {
      setErro(
        "Informe seu e-mail."
      );

      return;
    }

    if (
      !senha.trim()
    ) {
      setErro(
        "Informe sua senha."
      );

      return;
    }

    try {
      setCarregando(
        true
      );

      const response =
        await fetch(
          "/api/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  email.trim(),
                senha,
              }),
          }
        );

      if (
        !response.ok
      ) {
        let mensagem =
          response.status ===
          401
            ? "E-mail ou senha inválidos."
            : "Não foi possível realizar o login.";

        try {
          const dados =
            await response.json();

          if (
            dados?.message
          ) {
            mensagem =
              dados.message;
          }
        } catch {
          // Mantém a mensagem padrão.
        }

        throw new Error(
          mensagem
        );
      }

      const usuario: UsuarioLogado =
        await response.json();

      localStorage.setItem(
        "usuario_fintech",
        JSON.stringify(
          usuario
        )
      );

      router.push(
        "/dashboard"
      );

      router.refresh();
    } catch (
      error
    ) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login."
      );
    } finally {
      setCarregando(
        false
      );
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-page)] px-6 py-12 text-[var(--text-primary)]">
      {/* brilho decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[620px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "var(--accent-glow)",
        }}
      />

      <section className="relative z-10 w-full max-w-[440px]">
        {/* MARCA */}

        <div className="mb-8 text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{
              background:
                "var(--accent)",
              boxShadow:
                "0 12px 30px var(--accent-glow)",
            }}
          >
            <WalletCards
              size={27}
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-5 text-[12px] font-bold tracking-[0.22em] text-[var(--accent)]">
            FINTECH
          </p>

          <h1 className="mt-3 text-[30px] font-bold tracking-[-0.035em] text-[var(--text-primary)]">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Acesse sua conta para continuar cuidando da sua vida financeira.
          </p>
        </div>

        {/* CARD */}

        <form
          onSubmit={
            handleSubmit
          }
          className="rounded-[16px] border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8"
          style={{
            boxShadow:
              "var(--form-shadow)",
          }}
        >
          {erro && (
            <div
              className="mb-5 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
              style={{
                backgroundColor:
                  "var(--error-bg)",
                borderColor:
                  "var(--error-border)",
                color:
                  "var(--error-text)",
              }}
            >
              <CircleAlert
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {erro}
              </span>
            </div>
          )}

          {/* E-MAIL */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--form-label)]"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--form-muted)]"
              />

              <input
                id="email"
                type="email"
                value={
                  email
                }
                onChange={(
                  event
                ) =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
                placeholder="seu@email.com"
                className="h-12 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] hover:border-[var(--field-hover-border)] focus:border-[var(--form-field-focus)] focus:bg-[var(--field-focus-bg)]"
              />
            </div>
          </div>

          {/* SENHA */}

          <div className="mt-5">
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium text-[var(--form-label)]"
            >
              Senha
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--form-muted)]"
              />

              <input
                id="senha"
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                value={
                  senha
                }
                onChange={(
                  event
                ) =>
                  setSenha(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="h-12 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] pl-11 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] hover:border-[var(--field-hover-border)] focus:border-[var(--form-field-focus)] focus:bg-[var(--field-focus-bg)]"
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(
                    (
                      atual
                    ) =>
                      !atual
                  )
                }
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--form-muted)] transition hover:bg-[var(--button-secondary-hover)] hover:text-[var(--text-primary)]"
              >
                {mostrarSenha ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>

          {/* ENTRAR */}

          <button
            type="submit"
            disabled={
              carregando
            }
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}

            {!carregando && (
              <ArrowRight
                size={17}
              />
            )}
          </button>

          <div className="mt-6 border-t border-[var(--form-divider)] pt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
            >
              <ArrowLeft
                size={16}
              />

              Voltar para o início
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Controle financeiro simples, seguro e organizado.
        </p>
      </section>
    </main>
  );
}