"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  ChartNoAxesColumnIncreasing,
  MoreVertical,
  Pencil,
  Plus,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type { Entrada } from "@/interfaces/entrada.interface";

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

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(data)
  );
}

function mesmoMes(
  data: Date,
  referencia: Date
) {
  return (
    data.getMonth() === referencia.getMonth() &&
    data.getFullYear() === referencia.getFullYear()
  );
}

function obterReferenciaMes(
  dataBase: Date,
  deslocamento: number
) {
  return new Date(
    dataBase.getFullYear(),
    dataBase.getMonth() + deslocamento,
    1
  );
}

function nomeMesCurto(data: Date) {
  const mes = new Intl.DateTimeFormat(
    "pt-BR",
    {
      month: "short",
      year: "2-digit",
    }
  ).format(data);

  return mes
    .replace(".", "")
    .replace(" de ", "/");
}

export default function DashboardPage() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [entradas, setEntradas] =
    useState<Entrada[]>([]);

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] = useState<FormaMovimentacao[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [hoje, setHoje] =
    useState<Date | null>(null);

  useEffect(() => {
    setHoje(new Date());

    const usuarioSalvo =
      localStorage.getItem(
        "usuario_fintech"
      );

    if (!usuarioSalvo) {
      router.replace("/login");
      return;
    }

    try {
      const usuarioConvertido: UsuarioLogado =
        JSON.parse(usuarioSalvo);

      setUsuario(
        usuarioConvertido
      );

      const carregarEntradas =
        async () => {
          try {
            const [
              responseEntradas,
              responseCategorias,
              responseFormas,
            ] = await Promise.all([
              fetch(
                `/api/entradas/usuario/${usuarioConvertido.idUsuario}`,
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/categorias",
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/formas-movimentacao",
                {
                  cache: "no-store",
                }
              ),
            ]);

            if (
              !responseEntradas.ok ||
              !responseCategorias.ok ||
              !responseFormas.ok
            ) {
              throw new Error(
                "Não foi possível carregar os dados financeiros."
              );
            }

            const dadosEntradas: Entrada[] =
              await responseEntradas.json();

            const dadosCategorias: Categoria[] =
              await responseCategorias.json();

            const dadosFormas: FormaMovimentacao[] =
              await responseFormas.json();

            setEntradas(
              dadosEntradas.filter(
                (entrada) =>
                  entrada.ativo !== "N"
              )
            );

            setCategorias(
              dadosCategorias
            );

            setFormasMovimentacao(
              dadosFormas
            );
          } catch {
            setErro(
              "Não foi possível carregar os dados financeiros."
            );
          } finally {
            setCarregando(
              false
            );
          }
        };

      carregarEntradas();
    } catch {
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.replace(
        "/login"
      );
    }
  }, [router]);

  const entradasOrdenadas =
    useMemo(() => {
      return [
        ...entradas,
      ].sort(
        (a, b) =>
          new Date(
            b.dataEntrada
          ).getTime() -
          new Date(
            a.dataEntrada
          ).getTime()
      );
    }, [entradas]);

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
    }, [categorias]);

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

  const totalMesAtual =
    useMemo(() => {
      if (!hoje) {
        return 0;
      }

      return entradas.reduce(
        (
          total,
          entrada
        ) => {
          const data =
            new Date(
              entrada.dataEntrada
            );

          return mesmoMes(
            data,
            hoje
          )
            ? total +
                Number(
                  entrada.valor
                )
            : total;
        },
        0
      );
    }, [
      entradas,
      hoje,
    ]);

  const totalMesAnterior =
    useMemo(() => {
      if (!hoje) {
        return 0;
      }

      const referenciaMesAnterior =
        obterReferenciaMes(
          hoje,
          -1
        );

      return entradas.reduce(
        (
          total,
          entrada
        ) => {
          const data =
            new Date(
              entrada.dataEntrada
            );

          return mesmoMes(
            data,
            referenciaMesAnterior
          )
            ? total +
                Number(
                  entrada.valor
                )
            : total;
        },
        0
      );
    }, [
      entradas,
      hoje,
    ]);

  const variacao =
    useMemo(() => {
      if (
        totalMesAnterior ===
        0
      ) {
        return null;
      }

      return (
        ((totalMesAtual -
          totalMesAnterior) /
          totalMesAnterior) *
        100
      );
    }, [
      totalMesAtual,
      totalMesAnterior,
    ]);

  const ultimaEntrada =
    entradasOrdenadas[0];

  const mediaTresMeses =
    useMemo(() => {
      if (!hoje) {
        return 0;
      }

      const totais = [
        0,
        -1,
        -2,
      ].map(
        (
          deslocamento
        ) => {
          const referencia =
            obterReferenciaMes(
              hoje,
              deslocamento
            );

          return entradas.reduce(
            (
              total,
              entrada
            ) => {
              const data =
                new Date(
                  entrada.dataEntrada
                );

              return mesmoMes(
                data,
                referencia
              )
                ? total +
                    Number(
                      entrada.valor
                    )
                : total;
            },
            0
          );
        }
      );

      return (
        totais.reduce(
          (
            soma,
            total
          ) =>
            soma +
            total,
          0
        ) / 3
      );
    }, [
      entradas,
      hoje,
    ]);

  const mesesGrafico =
    useMemo(() => {
      if (!hoje) {
        return [];
      }

      return [
        -5,
        -4,
        -3,
        -2,
        -1,
        0,
      ].map(
        (
          deslocamento
        ) => {
          const referencia =
            obterReferenciaMes(
              hoje,
              deslocamento
            );

          const total =
            entradas.reduce(
              (
                soma,
                entrada
              ) => {
                const data =
                  new Date(
                    entrada.dataEntrada
                  );

                return mesmoMes(
                  data,
                  referencia
                )
                  ? soma +
                      Number(
                        entrada.valor
                      )
                  : soma;
              },
              0
            );

          return {
            referencia,
            total,
          };
        }
      );
    }, [
      entradas,
      hoje,
    ]);

  const pontosGrafico =
    useMemo(() => {
      if (
        mesesGrafico.length <
        2
      ) {
        return "";
      }

      const largura =
        820;

      const altura =
        150;

      const maiorValor =
        Math.max(
          ...mesesGrafico.map(
            (mes) =>
              mes.total
          ),
          1
        );

      return mesesGrafico
        .map(
          (
            mes,
            indice
          ) => {
            const x =
              (indice /
                (mesesGrafico.length -
                  1)) *
              largura;

            const y =
              altura -
              (mes.total /
                maiorValor) *
                (altura -
                  20);

            return `${x},${y}`;
          }
        )
        .join(" ");
    }, [
      mesesGrafico,
    ]);

  const mesAtualTexto =
    hoje
      ? new Intl.DateTimeFormat(
          "pt-BR",
          {
            month:
              "long",
            year:
              "numeric",
          }
        ).format(
          hoje
        )
      : "";

  if (
    carregando ||
    !hoje
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
        Carregando dashboard...
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <AppShell>
      <section className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-9 lg:px-10">

          {/* CABEÇALHO */}

          <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Visão geral das suas entradas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--button-secondary-bg)] px-4 py-2.5 text-sm font-medium capitalize text-[var(--button-secondary-text)]"
              >
                <CalendarDays
                  size={
                    16
                  }
                />

                {
                  mesAtualTexto
                }
              </button>

              <Link
                href="/entradas/nova"
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
              >
                <Plus
                  size={
                    16
                  }
                />

                Nova entrada
              </Link>
            </div>
          </header>

          {erro && (
            <div
              className="mb-6 rounded-lg border px-4 py-3 text-sm"
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

          {/* KPIs */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div
              className="rounded-xl bg-[var(--card-bg)] p-6"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <CircleDollarSign
                  size={
                    18
                  }
                  className="text-[var(--accent)]"
                />

                Total do mês
              </div>

              <p className="mt-7 text-[27px] font-bold text-[var(--text-primary)]">
                {formatarMoeda(
                  totalMesAtual
                )}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                {variacao !==
                null ? (
                  <>
                    <TrendingUp
                      size={
                        15
                      }
                      className={
                        variacao >=
                        0
                          ? "text-[var(--accent)]"
                          : "rotate-180 text-red-500"
                      }
                    />

                    <span
                      className={
                        variacao >=
                        0
                          ? "font-medium text-[var(--accent)]"
                          : "font-medium text-red-500"
                      }
                    >
                      {variacao >=
                      0
                        ? "+"
                        : ""}

                      {variacao.toFixed(
                        0
                      )}
                      %
                    </span>

                    <span className="text-[var(--text-secondary)]">
                      vs mês anterior
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--text-secondary)]">
                    sem comparação disponível
                  </span>
                )}
              </div>
            </div>

            <div
              className="rounded-xl bg-[var(--card-bg)] p-6"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Clock3
                  size={
                    18
                  }
                  className="text-[var(--accent)]"
                />

                Última entrada
              </div>

              <p className="mt-7 text-[27px] font-bold text-[var(--text-primary)]">
                {ultimaEntrada
                  ? formatarMoeda(
                      Number(
                        ultimaEntrada.valor
                      )
                    )
                  : "—"}
              </p>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {ultimaEntrada
                  ? formatarData(
                      ultimaEntrada.dataEntrada
                    )
                  : "Nenhuma entrada registrada"}
              </p>
            </div>

            <div
              className="rounded-xl bg-[var(--card-bg)] p-6"
              style={{
                boxShadow:
                  "var(--card-shadow)",
              }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <ChartNoAxesColumnIncreasing
                  size={
                    18
                  }
                  className="text-[var(--accent)]"
                />

                Média mensal
              </div>

              <p className="mt-7 text-[27px] font-bold text-[var(--text-primary)]">
                {formatarMoeda(
                  mediaTresMeses
                )}
              </p>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                últimos 3 meses
              </p>
            </div>
          </div>

          {/* GRÁFICO */}

          <section className="mt-12 overflow-hidden rounded-xl bg-[var(--card-bg)]">
            <div className="flex items-center justify-between bg-[var(--section-header-bg)] px-7 py-2">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Entradas no período
              </h2>

              <button
                type="button"
                className="flex items-center gap-3 border border-[var(--border-strong)] bg-[var(--card-bg)] px-5 py-1.5 text-xs text-[var(--text-primary)]"
              >
                <CalendarDays
                  size={
                    14
                  }
                />

                Por mês

                <ChevronDown
                  size={
                    15
                  }
                />
              </button>
            </div>

            <div className="px-6 pb-4 pt-7">
              <div className="relative h-[205px]">
                <div className="pointer-events-none absolute inset-0 grid grid-cols-6">
                  {mesesGrafico.map(
                    (
                      _,
                      indice
                    ) => (
                      <div
                        key={
                          indice
                        }
                        className="border-r last:border-r-0"
                        style={{
                          borderColor:
                            "var(--grid-line)",
                        }}
                      />
                    )
                  )}
                </div>

                <svg
                  viewBox="0 0 820 150"
                  preserveAspectRatio="none"
                  className="absolute left-0 top-4 h-[150px] w-full overflow-visible"
                >
                  <polyline
                    points={
                      pontosGrafico
                    }
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="absolute bottom-0 left-0 right-0 grid grid-cols-6">
                  {mesesGrafico.map(
                    (
                      mes
                    ) => (
                      <span
                        key={mes.referencia.toISOString()}
                        className="text-center text-xs capitalize text-[var(--text-secondary)]"
                      >
                        {nomeMesCurto(
                          mes.referencia
                        )}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ENTRADAS RECENTES */}

          <section className="mt-5 overflow-hidden rounded-xl bg-[var(--card-bg)]">
            <div className="flex items-center justify-between bg-[var(--section-header-bg)] px-7 py-2">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Entradas recentes
              </h2>

              <Link
                href="/entradas"
                className="flex items-center gap-3 border border-[var(--border-strong)] bg-[var(--card-bg)] px-6 py-1.5 text-xs text-[var(--text-primary)]"
              >
                Ver todas

                <ChevronDown
                  size={
                    15
                  }
                />
              </Link>
            </div>

            {entradasOrdenadas.length ===
            0 ? (
              <div className="px-8 py-12 text-center text-sm text-[var(--text-secondary)]">
                Nenhuma entrada cadastrada ainda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-[var(--text-primary)]">
                      <th className="px-7 py-4">
                        Data
                      </th>

                      <th className="px-5 py-4">
                        Descrição
                      </th>

                      <th className="px-5 py-4">
                        Categoria
                      </th>

                      <th className="px-5 py-4">
                        Valor
                      </th>

                      <th className="px-5 py-4">
                        Forma de recebimento
                      </th>

                      <th className="px-5 py-4 text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {entradasOrdenadas
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          entrada
                        ) => (
                          <tr
                            key={
                              entrada.idEntrada
                            }
                            className="border-t text-xs text-[var(--text-primary)]"
                            style={{
                              borderColor:
                                "var(--grid-line)",
                            }}
                          >
                            <td className="px-7 py-4">
                              {formatarData(
                                entrada.dataEntrada
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {entrada.descricao ||
                                "Sem descrição"}
                            </td>

                            <td className="px-5 py-4">
                              {categoriaPorId.get(
                                entrada.idCategoria
                              ) ??
                                `Categoria #${entrada.idCategoria}`}
                            </td>

                            <td className="px-5 py-4 font-medium text-[var(--accent)]">
                              {formatarMoeda(
                                Number(
                                  entrada.valor
                                )
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {formaPorId.get(
                                entrada.idFormaMovimentacao
                              ) ??
                                `Forma #${entrada.idFormaMovimentacao}`}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-3">
                                <Link
                                  href={`/entradas/${entrada.idEntrada}/editar`}
                                  title="Editar"
                                  className="text-[var(--text-primary)]"
                                >
                                  <Pencil
                                    size={
                                      16
                                    }
                                  />
                                </Link>

                                <button
                                  type="button"
                                  title="Mais opções"
                                  className="text-[var(--text-primary)]"
                                >
                                  <MoreVertical
                                    size={
                                      17
                                    }
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </AppShell>
  );
}