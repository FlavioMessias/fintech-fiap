"use client";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Check,
  Star,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  Entrada,
} from "@/interfaces/entrada.interface";

import type {
  Categoria,
  FormaMovimentacao,
} from "@/interfaces/referencia.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

interface EditarEntradaClientProps {
  idEntrada: string;
}

export default function EditarEntradaClient({
  idEntrada,
}: EditarEntradaClientProps) {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(
      null
    );

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] =
    useState<FormaMovimentacao[]>([]);

  const [valor, setValor] =
    useState("");

  const [
    idCategoria,
    setIdCategoria,
  ] = useState("");

  const [
    idFormaMovimentacao,
    setIdFormaMovimentacao,
  ] = useState("");

  const [
    dataEntrada,
    setDataEntrada,
  ] = useState("");

  const [
    descricao,
    setDescricao,
  ] = useState("");

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [erro, setErro] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem(
        "usuario_fintech"
      );

    if (!usuarioSalvo) {
      router.replace(
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

      const carregarDados =
        async () => {
          try {
            const [
              responseEntrada,
              responseCategorias,
              responseFormas,
            ] =
              await Promise.all([
                fetch(
                  `/api/entradas/usuario/${usuarioConvertido.idUsuario}/${idEntrada}`,
                  {
                    cache:
                      "no-store",
                  }
                ),

                fetch(
                  "/api/categorias",
                  {
                    cache:
                      "no-store",
                  }
                ),

                fetch(
                  "/api/formas-movimentacao",
                  {
                    cache:
                      "no-store",
                  }
                ),
              ]);

            if (
              responseEntrada.status ===
              404
            ) {
              setErro(
                "Entrada não encontrada ou não pertence ao usuário."
              );

              return;
            }

            if (
              !responseEntrada.ok ||
              !responseCategorias.ok ||
              !responseFormas.ok
            ) {
              throw new Error();
            }

            const entrada: Entrada =
              await responseEntrada.json();

            const dadosCategorias: Categoria[] =
              await responseCategorias.json();

            const dadosFormas: FormaMovimentacao[] =
              await responseFormas.json();

            setCategorias(
              dadosCategorias.filter(
                (
                  categoria
                ) =>
                  categoria.tipo ===
                  "E"
              )
            );

            setFormasMovimentacao(
              dadosFormas.filter(
                (
                  forma
                ) =>
                  forma.tipo ===
                    "E" ||
                  forma.tipo ===
                    "A"
              )
            );

            setValor(
              String(
                entrada.valor
              )
            );

            setIdCategoria(
              String(
                entrada.idCategoria
              )
            );

            setIdFormaMovimentacao(
              String(
                entrada.idFormaMovimentacao
              )
            );

            setDataEntrada(
              entrada.dataEntrada
                .split("T")[0]
            );

            setDescricao(
              entrada.descricao ??
                ""
            );
          } catch {
            setErro(
              "Não foi possível carregar os dados da entrada."
            );
          } finally {
            setCarregando(
              false
            );
          }
        };

      carregarDados();
    } catch {
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.replace(
        "/login"
      );
    }
  }, [
    router,
    idEntrada,
  ]);

  const handleSubmit =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (!usuario) {
        return;
      }

      setErro(null);
      setSalvando(true);

      try {
        const response =
          await fetch(
            `/api/entradas/usuario/${usuario.idUsuario}/${idEntrada}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  idCategoria:
                    Number(
                      idCategoria
                    ),

                  idFormaMovimentacao:
                    Number(
                      idFormaMovimentacao
                    ),

                  valor:
                    Number(
                      valor
                    ),

                  dataEntrada:
                    `${dataEntrada}T00:00:00`,

                  descricao:
                    descricao.trim(),

                  ativo:
                    "S",
                }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Não foi possível atualizar a entrada."
          );
        }

        router.push(
          "/entradas"
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a entrada."
        );
      } finally {
        setSalvando(
          false
        );
      }
    };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
        Carregando entrada...
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto max-w-[980px] px-8 pb-12 pt-10">

          {/* CABEÇALHO */}

          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-[27px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Editar Entrada
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Atualize os dados da entrada
              </p>
            </div>

            <Link
              href="/entradas"
              className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--form-back-bg)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--form-back-hover)]"
            >
              <ArrowLeft
                size={16}
              />

              Voltar para Entradas
            </Link>
          </header>

          {/* FORMULÁRIO */}

          <form
            onSubmit={
              handleSubmit
            }
            className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-8"
            style={{
              boxShadow:
                "var(--form-shadow)",
            }}
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Atualizar entrada
            </h2>

            <div className="my-5 border-t border-[var(--form-divider)]" />

            {erro && (
              <div
                className="mb-5 rounded-lg border px-4 py-3 text-sm"
                style={{
                  backgroundColor:
                    "var(--error-bg)",
                  borderColor:
                    "var(--error-border)",
                  color:
                    "var(--error-text)",
                }}
              >
                {erro}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* VALOR */}

              <div>
                <label
                  htmlFor="valor"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Valor da entrada
                </label>

                <div className="flex items-center rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] transition focus-within:border-[var(--form-field-focus)]">
                  <span className="pl-4 text-sm text-[var(--form-muted)]">
                    R$
                  </span>

                  <input
                    id="valor"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      valor
                    }
                    onChange={(
                      event
                    ) =>
                      setValor(
                        event.target.value
                      )
                    }
                    className="w-full bg-transparent px-2 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--form-muted)]"
                  />
                </div>
              </div>

              {/* DATA */}

              <div>
                <label
                  htmlFor="data"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Data
                </label>

                <input
                  id="data"
                  type="date"
                  value={
                    dataEntrada
                  }
                  onChange={(
                    event
                  ) =>
                    setDataEntrada(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                />
              </div>

              {/* ORIGEM */}

              <div>
                <label
                  htmlFor="categoria"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Origem da entrada
                </label>

                <select
                  id="categoria"
                  value={
                    idCategoria
                  }
                  onChange={(
                    event
                  ) =>
                    setIdCategoria(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                >
                  <option value="">
                    Selecione a origem
                  </option>

                  {categorias.map(
                    (
                      categoria
                    ) => (
                      <option
                        key={
                          categoria.idCategoria
                        }
                        value={
                          categoria.idCategoria
                        }
                      >
                        {
                          categoria.nome
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* FORMA */}

              <div>
                <label
                  htmlFor="forma"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Forma de recebimento
                </label>

                <select
                  id="forma"
                  value={
                    idFormaMovimentacao
                  }
                  onChange={(
                    event
                  ) =>
                    setIdFormaMovimentacao(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                >
                  <option value="">
                    Selecione a forma
                  </option>

                  {formasMovimentacao.map(
                    (
                      forma
                    ) => (
                      <option
                        key={
                          forma.idForma
                        }
                        value={
                          forma.idForma
                        }
                      >
                        {
                          forma.descricao
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* DESCRIÇÃO */}

            <div className="mt-5">
              <label
                htmlFor="descricao"
                className="mb-2 block text-sm font-medium text-[var(--form-label)]"
              >
                Descrição{" "}

                <span className="font-normal text-[var(--form-muted)]">
                  (Opcional)
                </span>
              </label>

              <textarea
                id="descricao"
                value={
                  descricao
                }
                onChange={(
                  event
                ) =>
                  setDescricao(
                    event.target.value
                  )
                }
                rows={4}
                maxLength={255}
                className="w-full resize-none rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
              />
            </div>

            <div className="my-7 border-t border-[var(--form-divider)]" />

            {/* AÇÕES */}

            <div className="flex items-center justify-between">
              <Link
                href="/entradas"
                className="rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-5 py-2.5 text-sm font-medium text-[var(--button-secondary-text)] transition hover:bg-[var(--form-secondary-hover)]"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={
                  salvando
                }
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check
                  size={17}
                />

                {salvando
                  ? "Salvando..."
                  : "Salvar alterações"}
              </button>
            </div>
          </form>

          {/* DICA */}

          <aside className="fin-tip mt-7 flex items-start gap-4 rounded-xl px-5 py-4">
            <Star
              size={20}
              className="fin-tip-icon mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Dica de organização
              </p>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Detalhe bem suas entradas na descrição — isso facilita a visualização posteriormente.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}