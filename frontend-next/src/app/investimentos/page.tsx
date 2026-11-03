"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  EllipsisVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type { Investimento } from "@/interfaces/investimento.interface";

import type { ContaBancaria } from "@/interfaces/conta-bancaria.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

const ITENS_POR_PAGINA = 7;

const TIPOS_INVESTIMENTO = [
  {
    valor: "RENDA_FIXA",
    label: "Renda fixa",
  },
  {
    valor: "ACAO",
    label: "Ações",
  },
  {
    valor: "ETF",
    label: "ETF",
  },
  {
    valor: "FII",
    label: "FII",
  },
  {
    valor: "FUNDO",
    label: "Fundo",
  },
  {
    valor: "CRIPTO",
    label: "Cripto",
  },
  {
    valor: "OUTRO",
    label: "Outro",
  },
];

const STATUS_INVESTIMENTO = [
  {
    valor: "ATIVO",
    label: "Ativo",
  },
  {
    valor: "RESGATADO",
    label: "Resgatado",
  },
  {
    valor: "VENCIDO",
    label: "Vencido",
  },
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

function formatarData(
  data: string
) {
  if (!data) {
    return "-";
  }

  const somenteData =
    data.substring(0, 10);

  const [
    ano,
    mes,
    dia,
  ] = somenteData.split("-");

  if (
    !ano ||
    !mes ||
    !dia
  ) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

function obterLabelTipo(
  tipo: string
) {
  return (
    TIPOS_INVESTIMENTO.find(
      (item) =>
        item.valor === tipo
    )?.label ?? tipo
  );
}

function obterLabelStatus(
  status: string
) {
  return (
    STATUS_INVESTIMENTO.find(
      (item) =>
        item.valor === status
    )?.label ?? status
  );
}

export default function InvestimentosPage() {
  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    investimentos,
    setInvestimentos,
  ] =
    useState<Investimento[]>([]);

  const [
    contas,
    setContas,
  ] =
    useState<ContaBancaria[]>([]);

  const [
    busca,
    setBusca,
  ] = useState("");

  const [
    filtroTipo,
    setFiltroTipo,
  ] = useState("TODOS");

  const [
    filtroStatus,
    setFiltroStatus,
  ] = useState("TODOS");

  const [
    paginaAtual,
    setPaginaAtual,
  ] = useState(1);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

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
    investimentoExcluir,
    setInvestimentoExcluir,
  ] =
    useState<Investimento | null>(
      null
    );

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  useEffect(() => {
    const carregarDados =
      async () => {
        try {
          setCarregando(true);
          setErro(null);

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
            responseInvestimentos,
            responseContas,
          ] =
            await Promise.all([
              fetch(
                `/api/investimentos/usuario/${usuarioConvertido.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),
              fetch(
                `/api/contas-bancarias/usuario/${usuarioConvertido.idUsuario}`,
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          if (
            !responseInvestimentos.ok
          ) {
            throw new Error(
              `Erro ao carregar investimentos: ${responseInvestimentos.status}`
            );
          }

          if (
            !responseContas.ok
          ) {
            throw new Error(
              `Erro ao carregar contas bancárias: ${responseContas.status}`
            );
          }

          const dadosInvestimentos: Investimento[] =
            await responseInvestimentos.json();

          const dadosContas: ContaBancaria[] =
            await responseContas.json();

          setInvestimentos(
            dadosInvestimentos
          );

          setContas(
            dadosContas
          );
        } catch (error) {
          console.error(
            error
          );

          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os investimentos."
          );
        } finally {
          setCarregando(
            false
          );
        }
      };

    carregarDados();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [
    busca,
    filtroTipo,
    filtroStatus,
  ]);

  const investimentosFiltrados =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase();

      return investimentos.filter(
        (
          investimento
        ) => {
          const correspondeBusca =
            termo.length ===
              0 ||
            investimento.nome
              .toLowerCase()
              .includes(
                termo
              ) ||
            (
              investimento.descricao ??
              ""
            )
              .toLowerCase()
              .includes(
                termo
              );

          const correspondeTipo =
            filtroTipo ===
              "TODOS" ||
            investimento.tipo ===
              filtroTipo;

          const correspondeStatus =
            filtroStatus ===
              "TODOS" ||
            investimento.status ===
              filtroStatus;

          return (
            correspondeBusca &&
            correspondeTipo &&
            correspondeStatus
          );
        }
      );
    }, [
      investimentos,
      busca,
      filtroTipo,
      filtroStatus,
    ]);

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        investimentosFiltrados.length /
          ITENS_POR_PAGINA
      )
    );

  const investimentosPagina =
    investimentosFiltrados.slice(
      (paginaAtual - 1) *
        ITENS_POR_PAGINA,
      paginaAtual *
        ITENS_POR_PAGINA
    );

  const totalInvestido =
    investimentos
      .filter(
        (investimento) =>
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

  function obterConta(
    idContaBancaria: number
  ) {
    const conta =
      contas.find(
        (item) =>
          item.idConta ===
          idContaBancaria
      );

    if (!conta) {
      return `Conta #${idContaBancaria}`;
    }

    return `${conta.nomeBanco} • ${conta.numeroConta}`;
  }

  function limparFiltros() {
    setBusca("");
    setFiltroTipo(
      "TODOS"
    );
    setFiltroStatus(
      "TODOS"
    );
    setPaginaAtual(1);
  }

  async function excluirInvestimento() {
    if (
      !usuario ||
      !investimentoExcluir
    ) {
      return;
    }

    try {
      setExcluindo(true);

      const response =
        await fetch(
          `/api/investimentos/usuario/${usuario.idUsuario}/${investimentoExcluir.idInvestimento}`,
          {
            method:
              "DELETE",
          }
        );

      if (!response.ok) {
        let mensagem =
          "Não foi possível excluir o investimento.";

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

      setInvestimentos(
        (estadoAtual) =>
          estadoAtual.filter(
            (item) =>
              item.idInvestimento !==
              investimentoExcluir.idInvestimento
          )
      );

      setInvestimentoExcluir(
        null
      );

      setMenuAberto(
        null
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o investimento."
      );
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-[#6c756f]">
          Carregando investimentos...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-[1280px] px-6 py-9 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#171b19]">
              Investimentos
            </h1>

            <p className="mt-1 text-sm text-[#7b847f]">
              Acompanhe seus investimentos e aplicações financeiras
            </p>
          </div>

          <Link
            href="/investimentos/novo"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#15983a] px-4 text-sm font-medium text-white transition hover:bg-[#117d30]"
          >
            <Plus size={17} />
            Novo investimento
          </Link>
        </header>

        {erro && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                setErro(null)
              }
              className="text-red-500 hover:text-red-700"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#e0e5e2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#76807a]">
                  Total investido
                </p>

                <p className="mt-2 text-2xl font-bold text-[#1b211e]">
                  {formatarMoeda(
                    totalInvestido
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f7ed] text-[#15983a]">
                <TrendingUp
                  size={21}
                />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[#e0e5e2] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#76807a]">
              Investimentos ativos
            </p>

            <p className="mt-2 text-2xl font-bold text-[#1b211e]">
              {
                investimentos.filter(
                  (item) =>
                    item.status ===
                    "ATIVO"
                ).length
              }
            </p>
          </article>

          <article className="rounded-xl border border-[#e0e5e2] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#76807a]">
              Total de registros
            </p>

            <p className="mt-2 text-2xl font-bold text-[#1b211e]">
              {
                investimentos.length
              }
            </p>
          </article>
        </div>

        <div className="overflow-visible rounded-xl border border-[#dde3df] bg-white shadow-sm">
          <div className="grid gap-3 border-b border-[#e2e6e4] p-3 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87918b]"
              />

              <input
                type="text"
                value={busca}
                onChange={(
                  event
                ) =>
                  setBusca(
                    event.target.value
                  )
                }
                placeholder="Buscar investimento..."
                className="h-10 w-full rounded-lg border border-[#d8dedb] bg-white pl-10 pr-3 text-sm text-[#272d29] outline-none transition focus:border-[#15983a] focus:ring-2 focus:ring-[#15983a]/10"
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
              className="h-10 rounded-lg border border-[#d8dedb] bg-white px-3 text-sm text-[#4f5953] outline-none focus:border-[#15983a]"
            >
              <option value="TODOS">
                Tipo: Todos
              </option>

              {TIPOS_INVESTIMENTO.map(
                (item) => (
                  <option
                    key={
                      item.valor
                    }
                    value={
                      item.valor
                    }
                  >
                    {item.label}
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
              className="h-10 rounded-lg border border-[#d8dedb] bg-white px-3 text-sm text-[#4f5953] outline-none focus:border-[#15983a]"
            >
              <option value="TODOS">
                Status: Todos
              </option>

              {STATUS_INVESTIMENTO.map(
                (item) => (
                  <option
                    key={
                      item.valor
                    }
                    value={
                      item.valor
                    }
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={
                limparFiltros
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8dedb] px-4 text-sm text-[#5f6963] transition hover:bg-[#f6f8f7]"
            >
              <RotateCcw
                size={16}
              />
              Limpar filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="border-b border-[#dce1de] bg-[#fbfcfb] text-left">
                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Data
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Investimento
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Tipo
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Valor aplicado
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Conta
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#252b27]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold text-[#252b27]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {investimentosPagina.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-[#7a847e]"
                    >
                      Nenhum investimento encontrado.
                    </td>
                  </tr>
                ) : (
                  investimentosPagina.map(
                    (
                      investimento
                    ) => (
                      <tr
                        key={
                          investimento.idInvestimento
                        }
                        className="border-b border-[#edf0ee] transition last:border-b-0 hover:bg-[#fafbfa]"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#545e58]">
                          {formatarData(
                            investimento.dataInvestimento
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-[#242a26]">
                              {
                                investimento.nome
                              }
                            </p>

                            {investimento.descricao && (
                              <p className="mt-1 max-w-[240px] truncate text-xs text-[#8a938e]">
                                {
                                  investimento.descricao
                                }
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#545e58]">
                          {obterLabelTipo(
                            investimento.tipo
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#18823a]">
                          {formatarMoeda(
                            Number(
                              investimento.valorAplicado
                            )
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#545e58]">
                          {obterConta(
                            investimento.idContaBancaria
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              investimento.status ===
                              "ATIVO"
                                ? "bg-[#e7f7ec] text-[#18823a]"
                                : investimento.status ===
                                    "RESGATADO"
                                  ? "bg-[#eef1f5] text-[#59636d]"
                                  : "bg-[#fff1d7] text-[#9a6700]"
                            }`}
                          >
                            {obterLabelStatus(
                              investimento.status
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="relative flex items-center justify-center gap-2">
                            <Link
                              href={`/investimentos/${investimento.idInvestimento}/editar`}
                              title="Editar investimento"
                              className="flex h-8 w-8 items-center justify-center rounded-md text-[#39423d] transition hover:bg-[#edf7f0] hover:text-[#15983a]"
                            >
                              <Pencil
                                size={16}
                              />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setMenuAberto(
                                  menuAberto ===
                                    investimento.idInvestimento
                                    ? null
                                    : investimento.idInvestimento
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-md text-[#39423d] transition hover:bg-[#f0f3f1]"
                            >
                              <EllipsisVertical
                                size={17}
                              />
                            </button>

                            {menuAberto ===
                              investimento.idInvestimento && (
                              <div className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-lg border border-[#dde3df] bg-white py-1 shadow-lg">
                                <Link
                                  href={`/investimentos/${investimento.idInvestimento}/editar`}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#404943] transition hover:bg-[#f5f7f6]"
                                >
                                  <Pencil
                                    size={15}
                                  />
                                  Editar
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvestimentoExcluir(
                                      investimento
                                    );

                                    setMenuAberto(
                                      null
                                    );
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
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

          <footer className="flex flex-col gap-3 border-t border-[#e2e6e4] px-5 py-4 text-xs text-[#78827c] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Mostrando{" "}
              {
                investimentosPagina.length
              }{" "}
              de{" "}
              {
                investimentosFiltrados.length
              }{" "}
              investimentos
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  paginaAtual <= 1
                }
                onClick={() =>
                  setPaginaAtual(
                    (pagina) =>
                      Math.max(
                        1,
                        pagina - 1
                      )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe4e1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={15}
                />
              </button>

              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#168139] px-2 font-medium text-white">
                {
                  paginaAtual
                }
              </span>

              <button
                type="button"
                disabled={
                  paginaAtual >=
                  totalPaginas
                }
                onClick={() =>
                  setPaginaAtual(
                    (pagina) =>
                      Math.min(
                        totalPaginas,
                        pagina + 1
                      )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe4e1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={15}
                />
              </button>
            </div>
          </footer>
        </div>
      </section>

      {investimentoExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1d231f]">
                  Excluir investimento
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6d7771]">
                  Tem certeza que deseja excluir este investimento?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInvestimentoExcluir(
                    null
                  )
                }
                className="text-[#7b857f] hover:text-[#242a26]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-lg bg-[#f5f7f6] p-4">
              <p className="text-sm font-semibold text-[#252c28]">
                {
                  investimentoExcluir.nome
                }
              </p>

              <p className="mt-1 text-sm font-medium text-[#18823a]">
                {formatarMoeda(
                  Number(
                    investimentoExcluir.valorAplicado
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
                  setInvestimentoExcluir(
                    null
                  )
                }
                className="h-10 rounded-lg border border-[#d7ddda] px-4 text-sm text-[#56605a] transition hover:bg-[#f6f8f7]"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  excluindo
                }
                onClick={
                  excluirInvestimento
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
    </AppShell>
  );
}