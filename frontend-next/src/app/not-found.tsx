import Link from "next/link";

import {
  ArrowLeft,
  CircleAlert,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] px-6 text-[var(--text-primary)]">
      <section
        className="w-full max-w-lg rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-8 text-center"
        style={{
          boxShadow:
            "var(--card-shadow)",
        }}
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "var(--error-bg)",
            color:
              "var(--error-text)",
          }}
        >
          <CircleAlert
            size={28}
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-[var(--accent)]">
          Erro 404
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em]">
          Página não encontrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          A página que você tentou acessar não existe ou pode ter sido removida.
        </p>

        <Link
          href="/dashboard"
          className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          <ArrowLeft
            size={17}
          />

          Voltar ao Dashboard
        </Link>
      </section>
    </main>
  );
}