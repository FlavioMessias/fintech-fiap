"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CircleAlert,
  EllipsisVertical,
  GraduationCap,
  Pencil,
  Plane,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShoppingCart,
  Target,
  Trash2,
  X,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  MetaFinanceira,
} from "@/interfaces/meta-financeira.interface";

import type {
  TipoMeta,
} from "@/interfaces/tipo-meta.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

const STATUS_META = [
  {
    valor: "ATIVA",
    label: "Ativa",
  },
  {
    valor: "CONCLUIDA",
    label: "Concluída",
  },
  {
    valor: "CANCELADA",
    label: "Cancelada",
  },
];

const ICONES: Record<
  string,
  LucideIcon
> = {
  shield: Shield,
  plane: Plane,
  "graduation-cap": GraduationCap,
  "shopping-cart": ShoppingCart,
  target: Target,
};

function formatarMoeda(
  valor: number
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(valor);
}

function formatarData(
  data: string | null
) {
  if (!data) {
    return "Sem prazo";
  }

  const somenteData =
    data.substring(
      0,
      10
    );

  const [
    ano,
    mes,
    dia,
  ] =
    somenteData.split(
      "-"
    );

  if (
    !ano ||
    !mes ||
    !dia
  ) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

function obterLabelStatus(
  status: string
) {
  return (
    STATUS_META.find(
      (item) =>
        item.valor ===
        status
    )?.label ??
    status
  );
}

function calcularPercentual(
  atual: number,
  objetivo: number
) {
  if (
    objetivo <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (atual /
          objetivo) *
          100
      )
    )
  );
}

export default function MetasPage() {
  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    metas,
    setMetas,
  ] =
    useState<MetaFinanceira[]>(
      []
    );

  const [
    tiposMeta,
    setTiposMeta,
  ] =
    useState<TipoMeta[]>(
      []
    );

  const [
    busca,
    setBusca,
  ] =
    useState("");

  const [
    filtroTipo,
    setFiltroTipo,
  ] =
    useState("TODOS");

  const [
    filtroStatus,
    setFiltroStatus,
  ] =
    useState("TODOS");

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
    menuAberto,
    setMenuAberto,
  ] =
    useState<number | null>(
      null
    );

  const [
    metaExcluir,
    setMetaExcluir,
  ] =
    useState<MetaFinanceira | null>(
      null
    );

  const [
    excluindo,
    setExcluindo,
  ] =
    useState(false);

  useEffect(() => {
    const carregarDados =
      async () => {
        try {
          setCarregando(
            true
          );

          setErro(
            null
          );

          const usuarioSalvo =
            localStorage.getItem(
              "usuario_fintech"
            );

          if (!usuarioSalvo) {
            window.location.href =
              "/login";

            return;
          }

          const usuarioConvertido: UsuarioLogado =
            JSON.parse(
              usuarioSalvo
            );

          setUsuario(
            usuarioConvertido
          );

          const [
            responseMetas,
            responseTipos,
          ] =
            await Promise.all([
              fetch(
                `/api/metas/usuario/${usuarioConvertido.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                "/api/tipos-meta",
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          if (
            !responseMetas.ok
          ) {
            throw new Error(
              `Erro ao carregar metas: ${responseMetas.status}`
            );
          }

          if (
            !responseTipos.ok
          ) {
            throw new Error(
              `Erro ao carregar tipos de meta: ${responseTipos.status}`
            );
          }

          const dadosMetas: MetaFinanceira[] =
            await responseMetas.json();

          const dadosTipos: TipoMeta[] =
            await responseTipos.json();

          setMetas(
            dadosMetas
          );

          setTiposMeta(
            dadosTipos
          );
        } catch (
          error
        ) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar as metas."
          );
        } finally {
          setCarregando(
            false
          );
        }
      };

    carregarDados();
  }, []);

  const metasFiltradas =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase();

      return metas.filter(
        (
          meta
        ) => {
          const correspondeBusca =
            termo.length ===
              0 ||
            meta.nome
              .toLowerCase()
              .includes(
                termo
              );

          const correspondeTipo =
            filtroTipo ===
              "TODOS" ||
            meta.idTipoMeta ===
              Number(
                filtroTipo
              );

          const correspondeStatus =
            filtroStatus ===
              "TODOS" ||
            meta.status ===
              filtroStatus;

          return (
            correspondeBusca &&
            correspondeTipo &&
            correspondeStatus
          );
        }
      );
    }, [
      metas,
      busca,
      filtroTipo,
      filtroStatus,
    ]);

  const metasAtivas =
    metas.filter(
      (
        meta
      ) =>
        meta.status ===
        "ATIVA"
    );

  const valorObjetivos =
    metasAtivas.reduce(
      (
        total,
        meta
      ) =>
        total +
        Number(
          meta.valorObjetivo
        ),
      0
    );

  const valorAcumulado =
    metasAtivas.reduce(
      (
        total,
        meta
      ) =>
        total +
        Number(
          meta.valorAtual
        ),
      0
    );

  function obterTipo(
    idTipoMeta: number
  ) {
    return tiposMeta.find(
      (
        tipo
      ) =>
        tipo.idTipoMeta ===
        idTipoMeta
    );
  }

  function limparFiltros() {
    setBusca("");

    setFiltroTipo(
      "TODOS"
    );

    setFiltroStatus(
      "TODOS"
    );
  }

  async function excluirMeta() {
    if (
      !usuario ||
      !metaExcluir
    ) {
      return;
    }

    try {
      setExcluindo(
        true
      );

      setErro(
        null
      );

      const response =
        await fetch(
          `/api/metas/usuario/${usuario.idUsuario}/${metaExcluir.idMeta}`,
          {
            method:
              "DELETE",
          }
        );

      if (!response.ok) {
        let mensagem =
          "Não foi possível excluir a meta.";

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
          // Mantém mensagem padrão.
        }

        throw new Error(
          mensagem
        );
      }

      setMetas(
        (
          estadoAtual
        ) =>
          estadoAtual.filter(
            (
              meta
            ) =>
              meta.idMeta !==
              metaExcluir.idMeta
          )
      );

      setMetaExcluir(
        null
      );

      setMenuAberto(
        null
      );
    } catch (
      error
    ) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a meta."
      );
    } finally {
      setExcluindo(
        false
      );
    }
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
          Carregando metas...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto w-full max-w-[1280px] px-6 py-9 lg:px-10">

          {/* CABEÇALHO */}

          <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Metas financeiras
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Acompanhe seus objetivos e veja quanto falta para alcançá-los
              </p>
            </div>

            <Link
              href="/metas/nova"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
            >
              <Plus
                size={17}
              />

              Nova meta
            </Link>
          </header>

          {/* ERRO */}

          {erro && (
            <div
              className="mb-6 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm"
              style={{
                backgroundColor:
                  "var(--error-bg)",
                borderColor:
                  "var(--error-border)",
                color:
                  "var(--error-text)",
              }}
            >
              <div className="flex items-start gap-2">
                <CircleAlert
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {erro}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setErro(
                    null
                  )
                }
                style={{
                  color:
                    "var(--error-text)",
                }}
              >
                <X
                  size={17}
                />
              </button>
            </div>
          )}

          {/* KPIs */}

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Metas ativas
              </p>

              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {
                  metasAtivas.length
                }
              </p>
            </article>

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Total dos objetivos
              </p>

              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {formatarMoeda(
                  valorObjetivos
                )}
              </p>
            </article>

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Valor acumulado
              </p>

              <p className="mt-2 text-2xl font-bold text-[var(--accent)]">
                {formatarMoeda(
                  valorAcumulado
                )}
              </p>
            </article>
          </div>

          {/* FILTROS */}

          <div className="mb-6 grid gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--field-bg)] p-3 shadow-sm lg:grid-cols-[1.3fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
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
                    event.target.value
                  )
                }
                placeholder="Buscar meta..."
                className="h-10 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <select
              value={
                filtroTipo
              }
              onChange={(
                event
              ) =>
                setFiltroTipo(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-3 text-sm text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]"
            >
              <option value="TODOS">
                Tipo: Todos
              </option>

              {tiposMeta.map(
                (
                  tipo
                ) => (
                  <option
                    key={
                      tipo.idTipoMeta
                    }
                    value={
                      tipo.idTipoMeta
                    }
                  >
                    {
                      tipo.nome
                    }
                  </option>
                )
              )}
            </select>

            <select
              value={
                filtroStatus
              }
              onChange={(
                event
              ) =>
                setFiltroStatus(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-3 text-sm text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]"
            >
              <option value="TODOS">
                Status: Todos
              </option>

              {STATUS_META.map(
                (
                  status
                ) => (
                  <option
                    key={
                      status.valor
                    }
                    value={
                      status.valor
                    }
                  >
                    {
                      status.label
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--field-bg)] px-4 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--button-secondary-hover)]"
            >
              <RotateCcw
                size={16}
              />

              Limpar filtros
            </button>
          </div>

          {/* CONTEÚDO */}

          {metasFiltradas.length ===
          0 ? (
            <div
              className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] px-6 py-16 text-center"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <Target
                size={36}
                className="mx-auto text-[var(--text-muted)]"
              />

              <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                Nenhuma meta encontrada
              </h2>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Crie uma meta financeira para acompanhar o progresso dos seus objetivos.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {metasFiltradas.map(
                (
                  meta
                ) => {
                  const tipo =
                    obterTipo(
                      meta.idTipoMeta
                    );

                  const nomeIcone =
                    tipo?.icone ??
                    meta.icone ??
                    "target";

                  const Icone =
                    ICONES[
                      nomeIcone
                    ] ??
                    Target;

                  const objetivo =
                    Number(
                      meta.valorObjetivo
                    );

                  const atual =
                    Number(
                      meta.valorAtual
                    );

                  const restante =
                    Math.max(
                      0,
                      objetivo -
                        atual
                    );

                  const percentual =
                    calcularPercentual(
                      atual,
                      objetivo
                    );

                  return (
                    <article
                      key={
                        meta.idMeta
                      }
                      className="relative rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-5 transition hover:-translate-y-0.5"
                      style={{
                        boxShadow:
                          "var(--card-shadow)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--accent)]"
                            style={{
                              backgroundColor:
                                "var(--goal-icon-bg)",
                            }}
                          >
                            <Icone
                              size={21}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                              {
                                meta.nome
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                              {tipo?.nome ??
                                "Meta financeira"}
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuAberto(
                                menuAberto ===
                                  meta.idMeta
                                  ? null
                                  : meta.idMeta
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition hover:bg-[var(--action-hover-bg)]"
                          >
                            <EllipsisVertical
                              size={18}
                            />
                          </button>

                          {menuAberto ===
                            meta.idMeta && (
                            <div
                              className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--menu-bg)] py-1"
                              style={{
                                boxShadow:
                                  "var(--menu-shadow)",
                              }}
                            >
                              <Link
                                href={`/metas/${meta.idMeta}/editar`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--menu-hover-bg)]"
                              >
                                <Pencil
                                  size={15}
                                />

                                Editar
                              </Link>

                              <button
                                type="button"
                                onClick={() => {
                                  setMetaExcluir(
                                    meta
                                  );

                                  setMenuAberto(
                                    null
                                  );
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-500/10"
                              >
                                <Trash2
                                  size={15}
                                />

                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* STATUS E PERCENTUAL */}

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{
                            backgroundColor:
                              meta.status ===
                              "ATIVA"
                                ? "var(--goal-active-bg)"
                                : meta.status ===
                                    "CONCLUIDA"
                                  ? "var(--goal-completed-bg)"
                                  : "var(--goal-cancelled-bg)",

                            color:
                              meta.status ===
                              "ATIVA"
                                ? "var(--goal-active-text)"
                                : meta.status ===
                                    "CONCLUIDA"
                                  ? "var(--goal-completed-text)"
                                  : "var(--goal-cancelled-text)",
                          }}
                        >
                          {obterLabelStatus(
                            meta.status
                          )}
                        </span>

                        <span className="text-sm font-semibold text-[var(--accent)]">
                          {
                            percentual
                          }
                          %
                        </span>
                      </div>

                      {/* PROGRESSO */}

                      <div
                        className="mt-3 h-2 overflow-hidden rounded-full"
                        style={{
                          backgroundColor:
                            "var(--goal-progress-track)",
                        }}
                      >
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all"
                          style={{
                            width:
                              `${percentual}%`,
                          }}
                        />
                      </div>

                      {/* VALORES */}

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[var(--text-muted)]">
                            Valor atual
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                            {formatarMoeda(
                              atual
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[var(--text-muted)]">
                            Objetivo
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                            {formatarMoeda(
                              objetivo
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[var(--text-muted)]">
                            Falta
                          </p>

                          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
                            {formatarMoeda(
                              restante
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[var(--text-muted)]">
                            Prazo
                          </p>

                          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
                            {formatarData(
                              meta.dataPrazo
                            )}
                          </p>
                        </div>
                      </div>

                      {/* AÇÃO */}

                      <Link
                        href={`/metas/${meta.idMeta}/editar`}
                        className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--goal-action-hover-bg)] hover:text-[var(--accent)]"
                        style={{
                          borderColor:
                            "var(--border-strong)",
                        }}
                        onMouseEnter={(
                          event
                        ) => {
                          event.currentTarget.style.borderColor =
                            "var(--goal-action-hover-border)";
                        }}
                        onMouseLeave={(
                          event
                        ) => {
                          event.currentTarget.style.borderColor =
                            "var(--border-strong)";
                        }}
                      >
                        <Pencil
                          size={15}
                        />

                        Atualizar meta
                      </Link>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* MODAL EXCLUSÃO */}

        {metaExcluir && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              backgroundColor:
                "var(--modal-overlay)",
            }}
          >
            <div className="w-full max-w-md rounded-[14px] bg-[var(--card-bg)] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Excluir meta
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Tem certeza que deseja excluir esta meta financeira?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMetaExcluir(
                      null
                    )
                  }
                  className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  <X
                    size={20}
                  />
                </button>
              </div>

              <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--modal-info-bg)] p-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {
                    metaExcluir.nome
                  }
                </p>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Objetivo:{" "}
                  {formatarMoeda(
                    Number(
                      metaExcluir.valorObjetivo
                    )
                  )}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={
                    excluindo
                  }
                  onClick={() =>
                    setMetaExcluir(
                      null
                    )
                  }
                  className="h-10 rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-4 text-sm text-[var(--button-secondary-text)] transition hover:bg-[var(--form-secondary-hover)]"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={
                    excluindo
                  }
                  onClick={
                    excluirMeta
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2
                    size={16}
                  />

                  {excluindo
                    ? "Excluindo..."
                    : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}