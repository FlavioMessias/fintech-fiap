"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Usuario } from "@/interfaces/usuario.interface";

export default function EditarUsuarioPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const response = await fetch(`/api/usuarios/${id}`);

        if (!response.ok) {
          throw new Error("Usuário não encontrado.");
        }

        const data: Usuario = await response.json();

        setUsuario(data);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar usuário."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) {
      return;
    }

    setErro(null);

    try {
      const response = await fetch(
        `/api/usuarios/${usuario.idUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: usuario.nome,
            email: usuario.email,
            senhaHash: senha,
            ativo: usuario.ativo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível atualizar o usuário.");
      }

      router.push("/usuarios");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar usuário."
      );
    }
  };

  if (carregando) {
    return (
      <main className="container mx-auto p-8">
        <p>Carregando usuário...</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="container mx-auto p-8">
        <p className="text-red-600">
          {erro ?? "Usuário não encontrado."}
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Editar Usuário
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
              htmlFor="nome"
              className="block text-sm font-medium mb-1"
            >
              Nome
            </label>

            <input
              id="nome"
              type="text"
              value={usuario.nome}
              onChange={(e) =>
                setUsuario({
                  ...usuario,
                  nome: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded"
            />
          </div>

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
              value={usuario.email}
              onChange={(e) =>
                setUsuario({
                  ...usuario,
                  email: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium mb-1"
            >
              Nova senha
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

          <div>
            <label
              htmlFor="ativo"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>

            <select
              id="ativo"
              value={usuario.ativo}
              onChange={(e) =>
                setUsuario({
                  ...usuario,
                  ativo: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="S">Ativo</option>
              <option value="N">Inativo</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </main>
  );
}