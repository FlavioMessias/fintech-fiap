"use client";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  CircleAlert,
  Landmark,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  Investimento,
} from "@/interfaces/investimento.interface";

import type {
  ContaBancaria,
} from "@/interfaces/conta-bancaria.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

interface EditarInvestimentoClientProps {
  idInvestimento: string;
}

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

export default function EditarInvestimentoClient({
  idInvestimento,
}: EditarInvestimentoClientProps) {
  const router = useRouter();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    contas,
    setContas,
  ] =
    useState<ContaBancaria[]>(
      []
    );

  const [
    nome,
    setNome,
  ] =
    useState("");

  const [
    tipo,
    setTipo,
  ] =
    useState("");

  const [
    valorAplicado,
    setValorAplicado,
  ] =
    useState("");

  const [
    dataInvestimento,
    setDataInvestimento,
  ] =
    useState("");

  const [
    idContaBancaria,
    setIdContaBancaria,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("ATIVO");

  const [
    descricao,
    setDescricao,
  ] =
    useState("");

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  const [
    salvando,
    setSalvando,
  ] =
    useState(false);

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
            router.push(
              "/login"
            );

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
            responseInvestimento,
            responseContas,
          ] =
            await Promise.all([
              fetch(
                `/api/investimentos/usuario/${usuarioConvertido.idUsuario}/${idInvestimento}`,
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
            !responseInvestimento.ok
          ) {
            throw new Error(
              `Erro ao carregar investimento: ${responseInvestimento.status}`
            );
          }

          if (
            !responseContas.ok
          ) {
            throw new Error(
              `Erro ao carregar contas bancárias: ${responseContas.status}`
            );
          }

          const investimento: Investimento =
            await responseInvestimento.json();

          const contasRecebidas: ContaBancaria[] =
            await responseContas.json();

          setContas(
            contasRecebidas
          );

          setNome(
            investimento.nome ??
              ""
          );

          setTipo(
            investimento.tipo ??
              ""
          );

          setValorAplicado(
            String(
              investimento.valorAplicado ??
                ""
            )
          );

          if (
            investimento.dataInvestimento
          ) {
            setDataInvestimento(
              investimento.dataInvestimento.substring(
                0,
                10
              )
            );
          }

          setIdContaBancaria(
            String(
              investimento.idContaBancaria
            )
          );

          setStatus(
            investimento.status ??
              "ATIVO"
          );

          setDescricao(
            investimento.descricao ??
              ""
          );
        } catch (
          error
        ) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados do investimento."
          );
        } finally {
          setCarregando(
            false
          );
        }
      };

    carregarDados();
  }, [
    router,
    idInvestimento,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!usuario) {
      return;
    }

    setErro(
      null
    );

    if (!nome.trim()) {
      setErro(
        "Informe o nome do investimento."
      );

      return;
    }

    if (!tipo) {
      setErro(
        "Selecione o tipo do investimento."
      );

      return;
    }

    if (!valorAplicado) {
      setErro(
        "Informe o valor aplicado."
      );

      return;
    }

    const valorNumerico =
      Number(
        valorAplicado.replace(
          ",",
          "."
        )
      );

    if (
      Number.isNaN(
        valorNumerico
      ) ||
      valorNumerico <= 0
    ) {
      setErro(
        "Informe um valor aplicado válido."
      );

      return;
    }

    if (!dataInvestimento) {
      setErro(
        "Informe a data do investimento."
      );

      return;
    }

    if (!idContaBancaria) {
      setErro(
        "Selecione uma conta bancária."
      );

      return;
    }

    if (!status) {
      setErro(
        "Selecione o status do investimento."
      );

      return;
    }

    try {
      setSalvando(
        true
      );

      const response =
        await fetch(
          `/api/investimentos/usuario/${usuario.idUsuario}/${idInvestimento}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                idContaBancaria:
                  Number(
                    idContaBancaria
                  ),

                nome:
                  nome.trim(),

                tipo,

                valorAplicado:
                  valorNumerico,

                dataInvestimento:
                  `${dataInvestimento}T00:00:00`,

                descricao:
                  descricao.trim() ||
                  null,

                status,

                ativo:
                  "S",
              }),
          }
        );

      if (!response.ok) {
        let mensagem =
          "Não foi possível atualizar o investimento.";

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
        "/investimentos"
      );

      router.refresh();
    } catch (
      error
    ) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o investimento."
      );
    } finally {
      setSalvando(
        false
      );
    }
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-sm text-[var(--text-secondary)]">
          Carregando investimento...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <section className="mx-auto w-full max-w-[1040px] px-6 py-9 lg:px-10">

          {/* CABEÇALHO */}

          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Editar investimento
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Atualize os dados da sua aplicação financeira
              </p>
            </div>

            <Link
              href="/investimentos"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--form-back-bg)] px-4 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--form-back-hover)]"
            >
              <ArrowLeft
                size={17}
              />

              Voltar para Investimentos
            </Link>
          </header>

          {/* FORMULÁRIO */}

          <form
            onSubmit={
              handleSubmit
            }
            autoComplete="off"
            className="rounded-[14px] border border-[var(--border)] bg-[var(--card-bg)] p-6 md:p-8"
            style={{
              boxShadow:
                "var(--form-shadow)",
            }}
          >
            <div className="border-b border-[var(--form-divider)] pb-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Atualizar investimento
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Edite as informações da aplicação selecionada
              </p>
            </div>

            {/* ERRO */}

            {erro && (
              <div
                className="mt-5 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
                style={{
                  backgroundColor:
                    "var(--error-bg)",
                  borderColor:
                    "var(--error-border)",
                  color:
                    "var(--error-text)",
                }}
              >
                <CircleAlert
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {erro}
                </span>
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* NOME */}

              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Nome do investimento
                </label>

                <input
                  id="nome"
                  type="text"
                  value={
                    nome
                  }
                  onChange={(
                    event
                  ) =>
                    setNome(
                      event.target.value
                    )
                  }
                  placeholder="Ex: Tesouro Selic"
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
                />
              </div>

              {/* TIPO */}

              <div>
                <label
                  htmlFor="tipo"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Tipo de investimento
                </label>

                <select
                  id="tipo"
                  value={
                    tipo
                  }
                  onChange={(
                    event
                  ) =>
                    setTipo(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                >
                  <option value="">
                    Selecione o tipo
                  </option>

                  {TIPOS_INVESTIMENTO.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item.valor
                        }
                        value={
                          item.valor
                        }
                      >
                        {
                          item.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* VALOR */}

              <div>
                <label
                  htmlFor="valorAplicado"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Valor aplicado
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--form-muted)]">
                    R$
                  </span>

                  <input
                    id="valorAplicado"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      valorAplicado
                    }
                    onChange={(
                      event
                    ) =>
                      setValorAplicado(
                        event.target.value
                      )
                    }
                    placeholder="0,00"
                    className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
                  />
                </div>
              </div>

              {/* DATA */}

              <div>
                <label
                  htmlFor="dataInvestimento"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Data do investimento
                </label>

                <input
                  id="dataInvestimento"
                  type="date"
                  value={
                    dataInvestimento
                  }
                  onChange={(
                    event
                  ) =>
                    setDataInvestimento(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                />
              </div>

              {/* CONTA */}

              <div>
                <label
                  htmlFor="conta"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Conta bancária
                </label>

                <select
                  id="conta"
                  value={
                    idContaBancaria
                  }
                  onChange={(
                    event
                  ) =>
                    setIdContaBancaria(
                      event.target.value
                    )
                  }
                  disabled={
                    contas.length ===
                    0
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-[var(--form-field-focus)]"
                >
                  <option value="">
                    {contas.length ===
                    0
                      ? "Nenhuma conta disponível"
                      : "Selecione a conta"}
                  </option>

                  {contas.map(
                    (
                      conta
                    ) => (
                      <option
                        key={
                          conta.idConta
                        }
                        value={
                          conta.idConta
                        }
                      >
                        {
                          conta.nomeBanco
                        }{" "}
                        - Ag.{" "}
                        {
                          conta.agencia
                        }{" "}
                        / Conta{" "}
                        {
                          conta.numeroConta
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={
                    status
                  }
                  onChange={(
                    event
                  ) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                >
                  {STATUS_INVESTIMENTO.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item.valor
                        }
                        value={
                          item.valor
                        }
                      >
                        {
                          item.label
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
                rows={4}
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
                placeholder="Ex: investimento para reserva de emergência..."
                className="w-full resize-none rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
              />
            </div>

            {/* AÇÕES */}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--form-divider)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/investimentos"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-5 text-sm text-[var(--button-secondary-text)] transition hover:bg-[var(--form-secondary-hover)]"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={
                  salvando ||
                  contas.length ===
                    0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
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

          <aside className="fin-tip mt-6 flex items-start gap-3 rounded-xl px-5 py-4">
            <Landmark
              size={20}
              className="fin-tip-icon mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Atualização da carteira
              </p>

              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                Atualize o status quando o investimento for resgatado ou atingir o vencimento para manter seus indicadores financeiros consistentes.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}