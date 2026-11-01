import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Fintech
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>

          <Link
            href="/login"
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}