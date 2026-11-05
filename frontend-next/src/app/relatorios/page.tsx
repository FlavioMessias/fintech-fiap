"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  PiggyBank,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  Entrada,
} from "@/interfaces/entrada.interface";

import type {
  Saida,
} from "@/interfaces/saida.interface";

import type {
  Investimento,
} from "@/interfaces/investimento.interface";

import type {
  MetaFinanceira,
} from "@/interfaces/meta-financeira.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

interface ResumoMes {
  chave: string;
  label: string;
  entradas: number;
  saidas: number;
}

const NOMES_MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

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

function obterAnoMes(
  data: string
) {
  return data.substring(
    0,
    7
  );
}

export default function RelatoriosPage() {
  const [
    entradas,
    setEntradas,
  ] =
    useState<Entrada[]>(
      []
    );

  const [
    saidas,
    setSaidas,
  ] =
    useState<Saida[]>(
      []
    );

  const [
    investimentos,
    setInvestimentos,
  ] =
    useState<Investimento[]>(
      []
    );

  const [
    metas,
    setMetas,
  ] =
    useState<MetaFinanceira[]>(
      []
    );

  const [
    referencia,
    setReferencia,
  ] =
    useState<Date | null>(
      null
    );

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

          const usuario: UsuarioLogado =
            JSON.parse(
              usuarioSalvo
            );

          setReferencia(
            new Date()
          );

          const [
            responseEntradas,
            responseSaidas,
            responseInvestimentos,
            responseMetas,
          ] =
            await Promise.all([
              fetch(
                `/api/entradas/usuario/${usuario.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                `/api/saidas/usuario/${usuario.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                `/api/investimentos/usuario/${usuario.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                `/api/metas/usuario/${usuario.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          if (
            !responseEntradas.ok
          ) {
            throw new Error(
              "Não foi possível carregar as entradas."
            );
          }

          if (
            !responseSaidas.ok
          ) {
            throw new Error(
              "Não foi possível carregar as saídas."
            );
          }

          if (
            !responseInvestimentos.ok
          ) {
            throw new Error(
              "Não foi possível carregar os investimentos."
            );
          }

          if (
            !responseMetas.ok
          ) {
            throw new Error(
              "Não foi possível carregar as metas."
            );
          }

          const [
            dadosEntradas,
            dadosSaidas,
            dadosInvestimentos,
            dadosMetas,
          ] =
            await Promise.all([
              responseEntradas.json(),
              responseSaidas.json(),
              responseInvestimentos.json(),
              responseMetas.json(),
            ]);

          setEntradas(
            dadosEntradas
          );

          setSaidas(
            dadosSaidas
          );

          setInvestimentos(
            dadosInvestimentos
          );

          setMetas(
            dadosMetas
          );
        } catch (
          error
        ) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o relatório financeiro."
          );
        } finally {
          setCarregando(
            false
          );
        }
      };

    carregarDados();
  }, []);

  const chaveMesAtual =
    useMemo(() => {
      if (
        !referencia
      ) {
        return "";
      }

      const ano =
        referencia.getFullYear();

      const mes =
        String(
          referencia.getMonth() +
            1
        ).padStart(
          2,
          "0"
        );

      return `${ano}-${mes}`;
    }, [
      referencia,
    ]);

  const totalEntradasMes =
    useMemo(() => {
      return entradas
        .filter(
          (
            entrada
          ) =>
            obterAnoMes(
              entrada.dataEntrada
            ) ===
            chaveMesAtual
        )
        .reduce(
          (
            total,
            entrada
          ) =>
            total +
            Number(
              entrada.valor
            ),
          0
        );
    }, [
      entradas,
      chaveMesAtual,
    ]);

  const totalSaidasMes =
    useMemo(() => {
      return saidas
        .filter(
          (
            saida
          ) =>
            obterAnoMes(
              saida.dataSaida
            ) ===
            chaveMesAtual
        )
        .reduce(
          (
            total,
            saida
          ) =>
            total +
            Number(
              saida.valor
            ),
          0
        );
    }, [
      saidas,
      chaveMesAtual,
    ]);

  const saldoMes =
    totalEntradasMes -
    totalSaidasMes;

  const totalInvestido =
    useMemo(() => {
      return investimentos
        .filter(
          (
            investimento
          ) =>
            investimento.status ===
            "ATIVO"
        )
        .reduce(
          (
            total,
            investimento
          ) =>
            total +
            Number(
              investimento.valorAplicado
            ),
          0
        );
    }, [
      investimentos,
    ]);

  const metasAtivas =
    useMemo(() => {
      return metas.filter(
        (
          meta
        ) =>
          meta.status ===
          "ATIVA"
      );
    }, [
      metas,
    ]);

  const progressoMetas =
    useMemo(() => {
      const objetivo =
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

      const atual =
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

      if (
        objetivo <=
        0
      ) {
        return 0;
      }

      return Math.min(
        100,
        Math.round(
          (atual /
            objetivo) *
            100
        )
      );
    }, [
      metasAtivas,
    ]);

  const historicoMensal =
    useMemo<ResumoMes[]>(
      () => {
        if (
          !referencia
        ) {
          return [];
        }

        const resultado: ResumoMes[] =
          [];

        for (
          let deslocamento =
            5;
          deslocamento >=
          0;
          deslocamento--
        ) {
          const data =
            new Date(
              referencia.getFullYear(),
              referencia.getMonth() -
                deslocamento,
              1
            );

          const ano =
            data.getFullYear();

          const mes =
            data.getMonth();

          const chave =
            `${ano}-${String(
              mes + 1
            ).padStart(
              2,
              "0"
            )}`;

          const totalEntradas =
            entradas
              .filter(
                (
                  entrada
                ) =>
                  obterAnoMes(
                    entrada.dataEntrada
                  ) ===
                  chave
              )
              .reduce(
                (
                  total,
                  entrada
                ) =>
                  total +
                  Number(
                    entrada.valor
                  ),
                0
              );

          const totalSaidas =
            saidas
              .filter(
                (
                  saida
                ) =>
                  obterAnoMes(
                    saida.dataSaida
                  ) ===
                  chave
              )
              .reduce(
                (
                  total,
                  saida
                ) =>
                  total +
                  Number(
                    saida.valor
                  ),
                0
              );

          resultado.push({
            chave,
            label:
              NOMES_MESES[
                mes
              ],
            entradas:
              totalEntradas,
            saidas:
              totalSaidas,
          });
        }

        return resultado;
      },
      [
        referencia,
        entradas,
        saidas,
      ]
    );

  const maiorValorGrafico =
    useMemo(() => {
      return Math.max(
        1,
        ...historicoMensal.flatMap(
          (
            mes
          ) => [
            mes.entradas,
            mes.saidas,
          ]
        )
      );
    }, [
      historicoMensal,
    ]);

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
          Carregando relatório...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto w-full max-w-[1280px] px-6 py-9 lg:px-10">

          {/* CABEÇALHO */}

          <header className="mb-8">
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
              Relatórios
            </h1>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Visão consolidada da sua vida financeira
            </p>
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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* ENTRADAS */}

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Entradas do mês
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[var(--report-positive)]">
                    {formatarMoeda(
                      totalEntradasMes
                    )}
                  </p>
                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--report-positive)]"
                  style={{
                    backgroundColor:
                      "var(--report-positive-bg)",
                  }}
                >
                  <ArrowUpRight
                    size={19}
                  />
                </div>
              </div>
            </article>

            {/* SAÍDAS */}

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Saídas do mês
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[var(--report-negative)]">
                    {formatarMoeda(
                      totalSaidasMes
                    )}
                  </p>
                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--report-negative)]"
                  style={{
                    backgroundColor:
                      "var(--report-negative-bg)",
                  }}
                >
                  <ArrowDownRight
                    size={19}
                  />
                </div>
              </div>
            </article>

            {/* SALDO */}

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Saldo do mês
                  </p>

                  <p
                    className="mt-2 text-2xl font-bold"
                    style={{
                      color:
                        saldoMes >=
                        0
                          ? "var(--report-positive)"
                          : "var(--report-negative)",
                    }}
                  >
                    {formatarMoeda(
                      saldoMes
                    )}
                  </p>
                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)]"
                  style={{
                    backgroundColor:
                      "var(--report-neutral-bg)",
                  }}
                >
                  <WalletCards
                    size={19}
                  />
                </div>
              </div>
            </article>

            {/* INVESTIMENTOS */}

            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Investimentos ativos
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                    {formatarMoeda(
                      totalInvestido
                    )}
                  </p>
                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--report-positive)]"
                  style={{
                    backgroundColor:
                      "var(--report-positive-bg)",
                  }}
                >
                  <TrendingUp
                    size={19}
                  />
                </div>
              </div>
            </article>
          </div>

          {/* CONTEÚDO */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

            {/* FLUXO FINANCEIRO */}

            <section
              className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-6"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Fluxo financeiro
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Comparativo entre entradas e saídas dos últimos 6 meses
                </p>
              </div>

              <div className="mt-7 space-y-5">
                {historicoMensal.map(
                  (
                    mes
                  ) => {
                    const larguraEntradas =
                      Math.max(
                        0,
                        (mes.entradas /
                          maiorValorGrafico) *
                          100
                      );

                    const larguraSaidas =
                      Math.max(
                        0,
                        (mes.saidas /
                          maiorValorGrafico) *
                          100
                      );

                    return (
                      <div
                        key={
                          mes.chave
                        }
                        className="grid grid-cols-[42px_1fr] items-center gap-4"
                      >
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          {
                            mes.label
                          }
                        </span>

                        <div className="space-y-2">

                          {/* ENTRADA */}

                          <div className="flex items-center gap-3">
                            <div
                              className="h-2 flex-1 overflow-hidden rounded-full"
                              style={{
                                backgroundColor:
                                  "var(--report-track)",
                              }}
                            >
                              <div
                                className="h-full rounded-full bg-[var(--accent)] transition-all"
                                style={{
                                  width:
                                    `${larguraEntradas}%`,
                                }}
                              />
                            </div>

                            <span className="w-[105px] text-right text-xs text-[var(--text-secondary)]">
                              {formatarMoeda(
                                mes.entradas
                              )}
                            </span>
                          </div>

                          {/* SAÍDA */}

                          <div className="flex items-center gap-3">
                            <div
                              className="h-2 flex-1 overflow-hidden rounded-full"
                              style={{
                                backgroundColor:
                                  "var(--report-track)",
                              }}
                            >
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width:
                                    `${larguraSaidas}%`,
                                  backgroundColor:
                                    "var(--report-negative)",
                                }}
                              />
                            </div>

                            <span className="w-[105px] text-right text-xs text-[var(--text-secondary)]">
                              {formatarMoeda(
                                mes.saidas
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* LEGENDA */}

              <div className="mt-6 flex items-center gap-5 border-t border-[var(--form-divider)] pt-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />

                  Entradas
                </span>

                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--report-negative)",
                    }}
                  />

                  Saídas
                </span>
              </div>
            </section>

            {/* COLUNA DIREITA */}

            <div className="space-y-6">

              {/* METAS */}

              <section
                className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-6"
                style={{
                  boxShadow:
                    "var(--card-shadow)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--accent)]"
                    style={{
                      backgroundColor:
                        "var(--goal-icon-bg)",
                    }}
                  >
                    <Target
                      size={19}
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-[var(--text-primary)]">
                      Metas financeiras
                    </h2>

                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                      Progresso consolidado
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">
                      {
                        progressoMetas
                      }
                      %
                    </p>

                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {
                        metasAtivas.length
                      }{" "}
                      {metasAtivas.length ===
                      1
                        ? "meta ativa"
                        : "metas ativas"}
                    </p>
                  </div>

                  <PiggyBank
                    size={35}
                    className="text-[var(--accent)]"
                  />
                </div>

                <div
                  className="mt-5 h-2.5 overflow-hidden rounded-full"
                  style={{
                    backgroundColor:
                      "var(--report-track)",
                  }}
                >
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{
                      width:
                        `${progressoMetas}%`,
                    }}
                  />
                </div>
              </section>

              {/* RESUMO */}

              <section
                className="rounded-[14px] border p-5"
                style={{
                  backgroundColor:
                    "var(--report-summary-bg)",
                  borderColor:
                    "var(--report-summary-border)",
                }}
              >
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Resumo financeiro
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">
                      Entradas registradas
                    </span>

                    <strong className="text-[var(--text-primary)]">
                      {
                        entradas.length
                      }
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">
                      Saídas registradas
                    </span>

                    <strong className="text-[var(--text-primary)]">
                      {
                        saidas.length
                      }
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">
                      Investimentos
                    </span>

                    <strong className="text-[var(--text-primary)]">
                      {
                        investimentos.length
                      }
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">
                      Metas
                    </span>

                    <strong className="text-[var(--text-primary)]">
                      {
                        metas.length
                      }
                    </strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}