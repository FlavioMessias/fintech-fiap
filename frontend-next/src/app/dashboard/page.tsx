"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario_fintech");

    if (!usuarioSalvo) {
      router.push("/login");
      return;
    }

    try {
      const usuarioConvertido: UsuarioLogado =
        JSON.parse(usuarioSalvo);

      setUsuario(usuarioConvertido);
    } catch {
      localStorage.removeItem("usuario_fintech");
      router.push("/login");
    } finally {
      setCarregando(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("usuario_fintech");
    router.push("/login");
  };

  if (carregando) {
    return (
      <main className="container mx-auto p-8">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Bem-vindo, {usuario.nome}.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Sair
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/usuarios"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Usuários
          </h2>

          <p className="text-gray-600">
            Gerencie os usuários cadastrados.
          </p>
        </Link>

        <Link
          href="/entradas"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Entradas
          </h2>

          <p className="text-gray-600">
            Consulte e gerencie suas receitas.
          </p>
        </Link>

        <Link
          href="/saidas"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Saídas
          </h2>

          <p className="text-gray-600">
            Consulte e gerencie suas despesas.
          </p>
        </Link>
      </section>
    </main>
  );
}