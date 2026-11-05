import Link from "next/link";

import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  PiggyBank,
  Target,
  WalletCards,
} from "lucide-react";

export default function HomePage() {
  return (
    <section className="relative flex min-h-[calc(100vh-140px)] items-center overflow-hidden bg-[var(--bg-page)] px-6 py-16 text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "var(--accent-glow)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tip-border)] bg-[var(--tip-bg)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
            <WalletCards
              size={14}
            />

            Controle financeiro pessoal
          </span>

          <h1 className="mt-6 max-w-[680px] text-[44px] font-black leading-[1.08] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[54px]">
            Sua vida financeira organizada em um só lugar.
          </h1>

          <p className="mt-5 max-w-[610px] text-base leading-7 text-[var(--text-secondary)]">
            Controle entradas e saídas, acompanhe investimentos, defina metas e visualize sua evolução financeira de forma simples e organizada.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Entrar no Fintech

              <ArrowRight
                size={17}
              />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--button-secondary-bg)] px-6 text-sm font-medium text-[var(--button-secondary-text)] transition hover:bg-[var(--button-secondary-hover)]"
            >
              Acessar Dashboard
            </Link>
          </div>
        </div>

        <div
          className="rounded-[18px] border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8"
          style={{
            boxShadow:
              "var(--card-shadow)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Tudo conectado
          </p>

          <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)]">
            Uma visão completa das suas finanças
          </h2>

          <div className="mt-7 space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--field-bg)] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--goal-icon-bg)] text-[var(--accent)]">
                <WalletCards
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Entradas e saídas
                </p>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Registre e acompanhe suas movimentações.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--field-bg)] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--goal-icon-bg)] text-[var(--accent)]">
                <PiggyBank
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Investimentos
                </p>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Centralize o acompanhamento da sua carteira.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--field-bg)] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--goal-icon-bg)] text-[var(--accent)]">
                <Target
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Metas financeiras
                </p>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Transforme objetivos em progresso mensurável.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--field-bg)] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--goal-icon-bg)] text-[var(--accent)]">
                <ChartNoAxesColumnIncreasing
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Dashboard e relatórios
                </p>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Visualize sua situação financeira de forma consolidada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}