"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  Saida,
} from "@/interfaces/saida.interface";

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

const ITENS_POR_PAGINA = 7;

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(valor);
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat(
    "pt-BR"
  ).format(
    new Date(data)
  );
}

function mesmoMes(
  data: Date,
  referencia: Date
) {
  return (
    data.getMonth() ===
      referencia.getMonth() &&
    data.getFullYear() ===
      referencia.getFullYear()
  );
}

function formatarMesAno(data: Date) {
  const mes =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        month: "long",
      }
    ).format(data);

  return `${
    mes.charAt(0).toUpperCase() +
    mes.slice(1)
  }/${data.getFullYear()}`;
}

export default function SaidasPage() {
  const router = useRouter();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    saidas,
    setSaidas,
  ] =
    useState<Saida[]>([]);

  const [
    categorias,
    setCategorias,
  ] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] =
    useState<FormaMovimentacao[]>([]);

  const [
    busca,
    setBusca,
  ] =
    useState("");

  const [
    periodo,
    setPeriodo,
  ] =
    useState("todos");

  const [
    categoriaSelecionada,
    setCategoriaSelecionada,
  ] =
    useState("todas");

  const [
    paginaAtual,
    setPaginaAtual,
  ] =
    useState(1);

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  const [
    erro,
    setErro,
  ] =
    useState<string | null>(
      null
    );

  const [
    hoje,
    setHoje,
  ] =
    useState<Date | null>(
      null
    );

  const [
    menuAberto,
    setMenuAberto,
  ] =
    useState<number | null>(
      null
    );

  const [
    saidaParaExcluir,
    setSaidaParaExcluir,
  ] =
    useState<Saida | null>(
      null
    );

  const [
    excluindo,
    setExcluindo,
  ] =
    useState(false);

  useEffect(() => {
    setHoje(
      new Date()
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

      const carregarDados =
        async () => {
          try {
            const [
              responseSaidas,
              responseCategorias,
              responseFormas,
            ] =
              await Promise.all([
                fetch(
                  `/api/saidas/usuario/${usuarioConvertido.idUsuario}`,
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
              !responseSaidas.ok ||
              !responseCategorias.ok ||
              !responseFormas.ok
            ) {
              throw new Error();
            }

            const dadosSaidas: Saida[] =
              await responseSaidas.json();

            const dadosCategorias: Categoria[] =
              await responseCategorias.json();

            const dadosFormas: FormaMovimentacao[] =
              await responseFormas.json();

            setSaidas(
              dadosSaidas.filter(
                (saida) =>
                  saida.ativo !==
                  "N"
              )
            );

            setCategorias(
              dadosCategorias.filter(
                (categoria) =>
                  categoria.tipo ===
                  "S"
              )
            );

            setFormasMovimentacao(
              dadosFormas.filter(
                (forma) =>
                  forma.tipo ===
                    "S" ||
                  forma.tipo ===
                    "A"
              )
            );
          } catch {
            setErro(
              "Não foi possível carregar as saídas."
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
  ]);

  useEffect(() => {
    setPaginaAtual(
      1
    );
  }, [
    busca,
    periodo,
    categoriaSelecionada,
  ]);

  const categoriaPorId =
    useMemo(() => {
      return new Map(
        categorias.map(
          (categoria) => [
            categoria.idCategoria,
            categoria.nome,
          ]
        )
      );
    }, [
      categorias,
    ]);

  const formaPorId =
    useMemo(() => {
      return new Map(
        formasMovimentacao.map(
          (forma) => [
            forma.idForma,
            forma.descricao,
          ]
        )
      );
    }, [
      formasMovimentacao,
    ]);

  const saidasFiltradas =
    useMemo(() => {
      if (!hoje) {
        return [];
      }

      const termo =
        busca
          .trim()
          .toLowerCase();

      return [
        ...saidas,
      ]
        .filter(
          (saida) => {
            if (
              termo &&
              !(
                saida.descricao ??
                ""
              )
                .toLowerCase()
                .includes(
                  termo
                )
            ) {
              return false;
            }

            if (
              categoriaSelecionada !==
                "todas" &&
              saida.idCategoria !==
                Number(
                  categoriaSelecionada
                )
            ) {
              return false;
            }

            const dataSaida =
              new Date(
                saida.dataSaida
              );

            if (
              periodo ===
              "mes-atual"
            ) {
              return mesmoMes(
                dataSaida,
                hoje
              );
            }

            if (
              periodo ===
              "ultimos-3-meses"
            ) {
              const inicio =
                new Date(
                  hoje.getFullYear(),
                  hoje.getMonth() -
                    2,
                  1
                );

              const fim =
                new Date(
                  hoje.getFullYear(),
                  hoje.getMonth() +
                    1,
                  1
                );

              return (
                dataSaida >=
                  inicio &&
                dataSaida <
                  fim
              );
            }

            return true;
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              b.dataSaida
            ).getTime() -
            new Date(
              a.dataSaida
            ).getTime()
        );
    }, [
      saidas,
      busca,
      periodo,
      categoriaSelecionada,
      hoje,
    ]);

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        saidasFiltradas.length /
          ITENS_POR_PAGINA
      )
    );

  const saidasPagina =
    useMemo(() => {
      const inicio =
        (paginaAtual -
          1) *
        ITENS_POR_PAGINA;

      return saidasFiltradas.slice(
        inicio,
        inicio +
          ITENS_POR_PAGINA
      );
    }, [
      saidasFiltradas,
      paginaAtual,
    ]);

  const inicioExibicao =
    saidasFiltradas.length ===
    0
      ? 0
      : (paginaAtual -
          1) *
          ITENS_POR_PAGINA +
        1;

  const fimExibicao =
    Math.min(
      paginaAtual *
        ITENS_POR_PAGINA,
      saidasFiltradas.length
    );

  const limparFiltros =
    () => {
      setBusca("");

      setPeriodo(
        "todos"
      );

      setCategoriaSelecionada(
        "todas"
      );

      setPaginaAtual(
        1
      );
    };

  const handleExcluir =
    async () => {
      if (
        !usuario ||
        !saidaParaExcluir
      ) {
        return;
      }

      setExcluindo(
        true
      );

      setErro(
        null
      );

      try {
        const response =
          await fetch(
            `/api/saidas/usuario/${usuario.idUsuario}/${saidaParaExcluir.idSaida}`,
            {
              method:
                "DELETE",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Não foi possível excluir a saída."
          );
        }

        setSaidas(
          (
            saidasAtuais
          ) =>
            saidasAtuais.filter(
              (saida) =>
                saida.idSaida !==
                saidaParaExcluir.idSaida
            )
        );

        setSaidaParaExcluir(
          null
        );

        setMenuAberto(
          null
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
          Error
            ? error.message
            : "Não foi possível excluir a saída."
        );
      } finally {
        setExcluindo(
          false
        );
      }
    };

  if (
    carregando ||
    !hoje
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
        Carregando saídas...
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto max-w-[1280px] pb-8 pt-10">

          {/* CABEÇALHO */}

          <header className="flex items-start justify-between px-8 pb-8">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Histórico de saídas
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Consulte todas as despesas registradas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]">
                <CalendarDays
                  size={16}
                />

                {formatarMesAno(
                  hoje
                )}
              </div>

              <Link
                href="/saidas/nova"
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
              >
                <Plus
                  size={16}
                />

                Nova saída
              </Link>
            </div>
          </header>

          {erro && (
            <div
              className="mx-8 mb-5 rounded-lg border px-4 py-3 text-sm"
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

          {/* CARD: FILTROS + TABELA + PAGINAÇÃO */}

          <div className="mx-8 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)]">

            {/* FILTROS */}

            <div className="grid grid-cols-1 gap-3 border-b border-[var(--border)] bg-[var(--field-bg)] px-3 py-3 md:grid-cols-4">
              <div className="flex items-center rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-3">
                <Search
                  size={19}
                  className="text-[var(--text-secondary)]"
                />

                <input
                  type="text"
                  value={
                    busca
                  }
                  onChange={(
                    event
                  ) =>
                    setBusca(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Buscar saída..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>

              <select
                value={
                  periodo
                }
                onChange={(
                  event
                ) =>
                  setPeriodo(
                    event
                      .target
                      .value
                  )
                }
                className="rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none"
              >
                <option value="todos">
                  Período: Todos
                </option>

                <option value="mes-atual">
                  Mês atual
                </option>

                <option value="ultimos-3-meses">
                  Últimos 3 meses
                </option>
              </select>

              <select
                value={
                  categoriaSelecionada
                }
                onChange={(
                  event
                ) =>
                  setCategoriaSelecionada(
                    event
                      .target
                      .value
                  )
                }
                className="rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none"
              >
                <option value="todas">
                  Categoria: Todas
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

              <button
                type="button"
                onClick={
                  limparFiltros
                }
                className="flex items-center justify-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--button-secondary-hover)]"
              >
                <RotateCcw
                  size={18}
                />

                Limpar filtros
              </button>
            </div>

            {/* TABELA */}

            <div className="overflow-x-auto bg-[var(--field-bg)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-strong)] bg-[var(--table-header-bg)] text-left text-[14px] font-semibold text-[var(--text-primary)]">
                    <th className="px-6 py-5">
                      Data
                    </th>

                    <th className="px-4 py-5">
                      Descrição
                    </th>

                    <th className="px-4 py-5">
                      Categoria
                    </th>

                    <th className="px-4 py-5">
                      Valor
                    </th>

                    <th className="px-4 py-5">
                      Forma de pagamento
                    </th>

                    <th className="px-4 py-5">
                      Status
                    </th>

                    <th className="px-4 py-5 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {saidasPagina.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={
                          7
                        }
                        className="bg-[var(--table-row-bg)] px-8 py-16 text-center text-sm text-[var(--text-secondary)]"
                      >
                        Nenhuma saída encontrada.
                      </td>
                    </tr>
                  ) : (
                    saidasPagina.map(
                      (
                        saida,
                        indice
                      ) => (
                        <tr
                          key={
                            saida.idSaida
                          }
                          className="text-[13px] text-[var(--text-primary)]"
                          style={{
                            backgroundColor:
                              indice %
                                2 ===
                              0
                                ? "var(--table-row-bg)"
                                : "var(--table-row-alt-bg)",
                          }}
                        >
                          <td className="px-6 py-5">
                            {formatarData(
                              saida.dataSaida
                            )}
                          </td>

                          <td className="px-4 py-5">
                            {saida.descricao ||
                              "Sem descrição"}
                          </td>

                          <td className="px-4 py-5">
                            {categoriaPorId.get(
                              saida.idCategoria
                            ) ??
                              `Categoria #${saida.idCategoria}`}
                          </td>

                          <td className="px-4 py-5 font-medium text-[var(--expense-text)]">
                            -
                            {formatarMoeda(
                              Number(
                                saida.valor
                              )
                            )}
                          </td>

                          <td className="px-4 py-5">
                            {formaPorId.get(
                              saida.idFormaMovimentacao
                            ) ??
                              `Forma #${saida.idFormaMovimentacao}`}
                          </td>

                          <td className="px-4 py-5">
                            <span
                              className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                              style={{
                                backgroundColor:
                                  saida.status ===
                                  "PAGO"
                                    ? "var(--status-paid-bg)"
                                    : "var(--status-pending-bg)",

                                color:
                                  saida.status ===
                                  "PAGO"
                                    ? "var(--status-paid-text)"
                                    : "var(--status-pending-text)",
                              }}
                            >
                              {
                                saida.status
                              }
                            </span>
                          </td>

                          <td className="px-4 py-5">
                            <div className="relative flex items-center justify-center gap-3">
                              <Link
                                href={`/saidas/${saida.idSaida}/editar`}
                                title="Editar saída"
                                className="rounded-md p-1 text-[var(--text-primary)] transition hover:bg-[var(--action-hover-bg)] hover:text-[var(--accent)]"
                              >
                                <Pencil
                                  size={17}
                                />
                              </Link>

                              <button
                                type="button"
                                title="Mais opções"
                                onClick={() =>
                                  setMenuAberto(
                                    menuAberto ===
                                      saida.idSaida
                                      ? null
                                      : saida.idSaida
                                  )
                                }
                                className="rounded-md p-1 text-[var(--text-primary)] transition hover:bg-[var(--action-hover-bg)] hover:text-[var(--accent)]"
                              >
                                <MoreVertical
                                  size={18}
                                />
                              </button>

                              {menuAberto ===
                                saida.idSaida && (
                                <div
                                  className="absolute right-5 top-8 z-20 w-36 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--menu-bg)] py-1"
                                  style={{
                                    boxShadow:
                                      "var(--menu-shadow)",
                                  }}
                                >
                                  <Link
                                    href={`/saidas/${saida.idSaida}/editar`}
                                    className="flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--menu-hover-bg)]"
                                  >
                                    <Pencil
                                      size={15}
                                    />

                                    Editar
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSaidaParaExcluir(
                                        saida
                                      );

                                      setMenuAberto(
                                        null
                                      );
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10"
                                  >
                                    <Trash2
                                      size={15}
                                    />

                                    Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINAÇÃO */}

            <footer className="flex items-center justify-between border-t border-[var(--border-strong)] bg-[var(--field-bg)] px-7 py-3">
              <p className="text-xs text-[var(--text-secondary)]">
                Mostrando{" "}
                {inicioExibicao} a{" "}
                {fimExibicao} de{" "}
                {
                  saidasFiltradas.length
                }{" "}
                saídas
              </p>

              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <button
                  type="button"
                  disabled={
                    paginaAtual ===
                    1
                  }
                  onClick={() =>
                    setPaginaAtual(
                      1
                    )
                  }
                  className="disabled:opacity-30"
                >
                  <ChevronsLeft
                    size={20}
                  />
                </button>

                <button
                  type="button"
                  disabled={
                    paginaAtual ===
                    1
                  }
                  onClick={() =>
                    setPaginaAtual(
                      (
                        pagina
                      ) =>
                        pagina -
                        1
                    )
                  }
                  className="disabled:opacity-30"
                >
                  <ChevronLeft
                    size={20}
                  />
                </button>

                {Array.from(
                  {
                    length:
                      totalPaginas,
                  },
                  (
                    _,
                    indice
                  ) =>
                    indice +
                    1
                )
                  .slice(
                    0,
                    5
                  )
                  .map(
                    (
                      pagina
                    ) => (
                      <button
                        key={
                          pagina
                        }
                        type="button"
                        onClick={() =>
                          setPaginaAtual(
                            pagina
                          )
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                          paginaAtual ===
                          pagina
                            ? "bg-[var(--accent)] text-white"
                            : "text-[var(--text-primary)] hover:bg-[var(--pagination-hover-bg)]"
                        }`}
                      >
                        {
                          pagina
                        }
                      </button>
                    )
                  )}

                <button
                  type="button"
                  disabled={
                    paginaAtual ===
                    totalPaginas
                  }
                  onClick={() =>
                    setPaginaAtual(
                      (
                        pagina
                      ) =>
                        pagina +
                        1
                    )
                  }
                  className="disabled:opacity-30"
                >
                  <ChevronRight
                    size={20}
                  />
                </button>

                <button
                  type="button"
                  disabled={
                    paginaAtual ===
                    totalPaginas
                  }
                  onClick={() =>
                    setPaginaAtual(
                      totalPaginas
                    )
                  }
                  className="disabled:opacity-30"
                >
                  <ChevronsRight
                    size={20}
                  />
                </button>
              </div>
            </footer>
          </div>
        </section>

        {/* MODAL EXCLUSÃO */}

        {saidaParaExcluir && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              backgroundColor:
                "var(--modal-overlay)",
            }}
          >
            <div className="w-full max-w-[430px] rounded-[14px] bg-[var(--card-bg)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.20)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Excluir saída
                  </h2>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Tem certeza que deseja excluir esta saída?
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    excluindo
                  }
                  onClick={() =>
                    setSaidaParaExcluir(
                      null
                    )
                  }
                  className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--button-secondary-hover)]"
                >
                  <X
                    size={20}
                  />
                </button>
              </div>

              <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--modal-info-bg)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {saidaParaExcluir.descricao ||
                    "Saída sem descrição"}
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--expense-text)]">
                  -
                  {formatarMoeda(
                    Number(
                      saidaParaExcluir.valor
                    )
                  )}
                </p>
              </div>

              <p className="mt-4 text-xs text-[var(--text-muted)]">
                Esta ação não poderá ser desfeita.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={
                    excluindo
                  }
                  onClick={() =>
                    setSaidaParaExcluir(
                      null
                    )
                  }
                  className="rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--button-secondary-text)] transition hover:bg-[var(--form-secondary-hover)]"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={
                    excluindo
                  }
                  onClick={
                    handleExcluir
                  }
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2
                    size={16}
                  />

                  {excluindo
                    ? "Excluindo..."
                    : "Excluir saída"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}