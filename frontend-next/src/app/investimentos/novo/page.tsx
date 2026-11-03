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

import type { ContaBancaria } from "@/interfaces/conta-bancaria.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
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

export default function NovoInvestimentoPage() {
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
    useState<ContaBancaria[]>([]);

  const [
    nome,
    setNome,
  ] = useState("");

  const [
    tipo,
    setTipo,
  ] = useState("");

  const [
    valorAplicado,
    setValorAplicado,
  ] = useState("");

  const [
    dataInvestimento,
    setDataInvestimento,
  ] = useState("");

  const [
    idContaBancaria,
    setIdContaBancaria,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("ATIVO");

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
          setCarregando(true);
          setErro(null);

          setNome("");
          setTipo("");
          setValorAplicado("");
          setIdContaBancaria("");
          setStatus("ATIVO");
          setDescricao("");

          const hoje =
            new Date();

          const ano =
            hoje.getFullYear();

          const mes =
            String(
              hoje.getMonth() + 1
            ).padStart(
              2,
              "0"
            );

          const dia =
            String(
              hoje.getDate()
            ).padStart(
              2,
              "0"
            );

          setDataInvestimento(
            `${ano}-${mes}-${dia}`
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

          const response =
            await fetch(
              `/api/contas-bancarias/usuario/${usuarioConvertido.idUsuario}`,
              {
                cache:
                  "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              `Erro ao carregar contas bancárias: ${response.status}`
            );
          }

          const dados: ContaBancaria[] =
            await response.json();

          setContas(
            dados
          );

          if (
            dados.length ===
            1
          ) {
            setIdContaBancaria(
              String(
                dados[0].idConta
              )
            );
          }
        } catch (error) {
          console.error(
            error
          );

          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados."
          );
        } finally {
          setCarregando(
            false
          );
        }
      };

    carregarDados();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!usuario) {
      return;
    }

    setErro(null);

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
        valorAplicado
          .replace(
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
      setSalvando(true);

      const response =
        await fetch(
          `/api/investimentos/usuario/${usuario.idUsuario}`,
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                {
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
                }
              ),
          }
        );

      if (!response.ok) {
        let mensagem =
          "Não foi possível registrar o investimento.";

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
    } catch (error) {
      console.error(
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar o investimento."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-[#6c756f]">
          Carregando formulário...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-[1040px] px-6 py-9 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#171b19]">
              Novo investimento
            </h1>

            <p className="mt-1 text-sm text-[#7b847f]">
              Registre uma nova aplicação financeira
            </p>
          </div>

          <Link
            href="/investimentos"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8dedb] bg-white px-4 text-sm text-[#59635d] transition hover:bg-[#f7f9f8]"
          >
            <ArrowLeft
              size={17}
            />
            Voltar para Investimentos
          </Link>
        </header>

        <form
          onSubmit={
            handleSubmit
          }
          autoComplete="off"
          className="rounded-xl border border-[#dde3df] bg-white p-6 shadow-sm md:p-8"
        >
          <div className="border-b border-[#e2e6e4] pb-5">
            <h2 className="text-lg font-bold text-[#202622]">
              Registrar investimento
            </h2>

            <p className="mt-1 text-sm text-[#818a85]">
              Preencha os dados da sua aplicação financeira
            </p>
          </div>

          {erro && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
            <div>
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Nome do investimento
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(
                  event
                ) =>
                  setNome(
                    event.target.value
                  )
                }
                placeholder="Ex: Tesouro Selic"
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition placeholder:text-[#a0a8a3] focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              />
            </div>

            <div>
              <label
                htmlFor="tipo"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Tipo de investimento
              </label>

              <select
                id="tipo"
                value={tipo}
                onChange={(
                  event
                ) =>
                  setTipo(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
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

            <div>
              <label
                htmlFor="valorAplicado"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Valor aplicado
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#89928d]">
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
                  className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] pl-11 pr-4 text-sm text-[#252b27] outline-none transition placeholder:text-[#a0a8a3] focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dataInvestimento"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
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
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              />
            </div>

            <div>
              <label
                htmlFor="conta"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
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
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
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

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
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
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
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

          <div className="mt-5">
            <label
              htmlFor="descricao"
              className="mb-2 block text-sm font-medium text-[#3f4843]"
            >
              Descrição{" "}
              <span className="font-normal text-[#9aa29e]">
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
              className="w-full resize-none rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 py-3 text-sm text-[#252b27] outline-none transition placeholder:text-[#a0a8a3] focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e4e8e6] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/investimentos"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d7ddda] px-5 text-sm text-[#59635d] transition hover:bg-[#f7f9f8]"
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#15983a] px-5 text-sm font-medium text-white transition hover:bg-[#117d30] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check
                size={17}
              />

              {salvando
                ? "Salvando..."
                : "Salvar investimento"}
            </button>
          </div>
        </form>

        <aside className="mt-6 flex items-start gap-3 rounded-xl border border-[#cce7d4] bg-[#f4fbf6] px-5 py-4">
          <Landmark
            size={20}
            className="mt-0.5 shrink-0 text-[#15983a]"
          />

          <div>
            <p className="text-sm font-semibold text-[#222a25]">
              Organização dos investimentos
            </p>

            <p className="mt-1 text-sm leading-6 text-[#6b756f]">
              Mantenha o tipo e o status atualizados para facilitar o acompanhamento da sua carteira e a geração dos relatórios financeiros.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}