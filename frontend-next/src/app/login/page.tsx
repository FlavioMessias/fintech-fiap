"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setCarregando(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("E-mail ou senha inválidos.");
        }

        throw new Error("Não foi possível realizar o login.");
      }

      const usuario = await response.json();

      localStorage.setItem(
        "usuario_fintech",
        JSON.stringify(usuario)
      );

      router.push("/dashboard");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao realizar login."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Entrar no Fintech
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >
          {erro && (
            <p className="text-red-600 text-sm">
              {erro}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium mb-1"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}