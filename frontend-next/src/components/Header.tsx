import Link from "next/link";

import {
  LogIn,
  WalletCards,
} from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card-bg)]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
            <WalletCards
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[17px] font-black tracking-[0.14em] text-[var(--text-primary)]">
            FINTECH
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--button-secondary-hover)] hover:text-[var(--text-primary)]"
          >
            Início
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--button-secondary-hover)] hover:text-[var(--text-primary)]"
          >
            Dashboard
          </Link>

          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            <LogIn
              size={16}
            />

            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}