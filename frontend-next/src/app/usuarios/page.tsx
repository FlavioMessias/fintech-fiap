"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Usuario } from "@/interfaces/usuario.interface";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const response = await fetch("/api/usuarios");

        if (!response.ok) {
          throw new Error("Não foi possível carregar os usuários.");
        }

        const data: Usuario[] = await response.json();

        setUsuarios(data);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar usuários."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, []);

  const handleExcluir = async (id: number) => {
    const confirmar = window.confirm(
      "Deseja realmente excluir este usuário?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Não foi possível excluir o usuário.");
      }

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter(
          (usuario) => usuario.idUsuario !== id
        )
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao excluir usuário."
      );
    }
  };

  if (carregando) {
    return (
      <main className="container mx-auto p-8">
        <p>Carregando usuários...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Usuários
          </h1>

          <p className="text-gray-600 mt-2">
            Gerencie os usuários cadastrados no Fintech.
          </p>
        </div>

        <Link
          href="/usuarios/novo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Novo Usuário
        </Link>
      </div>

      {erro && (
        <p className="mb-6 text-red-600">
          {erro}
        </p>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left border-b">
                ID
              </th>

              <th className="px-6 py-3 text-left border-b">
                Nome
              </th>

              <th className="px-6 py-3 text-left border-b">
                E-mail
              </th>

              <th className="px-6 py-3 text-left border-b">
                Status
              </th>

              <th className="px-6 py-3 text-left border-b">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}

            {usuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td className="px-6 py-4 border-b">
                  {usuario.idUsuario}
                </td>

                <td className="px-6 py-4 border-b">
                  {usuario.nome}
                </td>

                <td className="px-6 py-4 border-b">
                  {usuario.email}
                </td>

                <td className="px-6 py-4 border-b">
                  {usuario.ativo === "S"
                    ? "Ativo"
                    : "Inativo"}
                </td>

                <td className="px-6 py-4 border-b">
                  <div className="flex gap-2">
                    <Link
                      href={`/usuarios/${usuario.idUsuario}/editar`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleExcluir(usuario.idUsuario)}
                       className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}