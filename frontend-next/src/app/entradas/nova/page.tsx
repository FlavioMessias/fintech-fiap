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
  Categoria,
  FormaMovimentacao,
} from "@/interfaces/referencia.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

export default function NovaEntradaPage() {
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
    const agora =
      new Date();

    const ano =
      agora.getFullYear();

    const mes =
      String(
        agora.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const dia =
      String(
        agora.getDate()
      ).padStart(
        2,
        "0"
      );

    setDataEntrada(
      `${ano}-${mes}-${dia}`
    );

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

      const carregarReferencias =
        async () => {
          try {
            const [
              responseCategorias,
              responseFormas,
            ] =
              await Promise.all([
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
              !responseCategorias.ok ||
              !responseFormas.ok
            ) {
              throw new Error();
            }

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
          } catch {
            setErro(
              "Não foi possível carregar os dados do formulário."
            );
          } finally {
            setCarregando(
              false
            );
          }
        };

      carregarReferencias();
    } catch {
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.replace(
        "/login"
      );
    }
  }, [router]);

  const handleSubmit =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (!usuario) {
        return;
      }

      setErro(null);

      if (
        !valor ||
        Number(valor) <= 0
      ) {
        setErro(
          "Informe um valor válido para a entrada."
        );

        return;
      }

      if (!idCategoria) {
        setErro(
          "Selecione a origem da entrada."
        );

        return;
      }

      if (
        !idFormaMovimentacao
      ) {
        setErro(
          "Selecione a forma de recebimento."
        );

        return;
      }

      if (!dataEntrada) {
        setErro(
          "Informe a data da entrada."
        );

        return;
      }

      setSalvando(true);

      try {
        const response =
          await fetch(
            `/api/entradas/usuario/${usuario.idUsuario}`,
            {
              method:
                "POST",

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
          let mensagem =
            "Não foi possível salvar a entrada.";

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

        router.push(
          "/entradas"
        );
      } catch (error) {
        if (
          error instanceof
          Error
        ) {
          setErro(
            error.message
          );
        } else {
          setErro(
            "Não foi possível salvar a entrada."
          );
        }
      } finally {
        setSalvando(
          false
        );
      }
    };

  if (
    carregando ||
    !usuario
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
        Carregando formulário...
      </div>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto max-w-[980px] px-8 pb-12 pt-10">

          {/* CABEÇALHO */}

          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-[27px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Registrar Entrada
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Cadastre uma nova receita recebida
              </p>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--form-back-bg)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--form-back-hover)]"
            >
              <ArrowLeft
                size={16}
              />

              Voltar para o Dashboard
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
              Nova Entrada
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
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="0,00"
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
                      event
                        .target
                        .value
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
                      event
                        .target
                        .value
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
                      event
                        .target
                        .value
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
                    event
                      .target
                      .value
                  )
                }
                rows={4}
                maxLength={255}
                placeholder="Ex: salário, projeto freelancer, rendimentos, vendas, etc..."
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
                  : "Salvar entrada"}
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