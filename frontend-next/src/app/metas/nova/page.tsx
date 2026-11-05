"use client";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  CircleAlert,
  GraduationCap,
  Plane,
  Shield,
  ShoppingCart,
  Target,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  TipoMeta,
} from "@/interfaces/tipo-meta.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

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

export default function NovaMetaPage() {
  const router =
    useRouter();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    tiposMeta,
    setTiposMeta,
  ] =
    useState<TipoMeta[]>(
      []
    );

  const [
    nome,
    setNome,
  ] =
    useState("");

  const [
    idTipoMeta,
    setIdTipoMeta,
  ] =
    useState("");

  const [
    valorObjetivo,
    setValorObjetivo,
  ] =
    useState("");

  const [
    valorAtual,
    setValorAtual,
  ] =
    useState("0");

  const [
    dataInicio,
    setDataInicio,
  ] =
    useState("");

  const [
    dataPrazo,
    setDataPrazo,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("ATIVA");

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

          setNome("");
          setIdTipoMeta("");
          setValorObjetivo("");
          setValorAtual("0");
          setStatus("ATIVA");
          setDataPrazo("");

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

          setDataInicio(
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
              "/api/tipos-meta",
              {
                cache:
                  "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              `Erro ao carregar tipos de meta: ${response.status}`
            );
          }

          const dados: TipoMeta[] =
            await response.json();

          setTiposMeta(
            dados
          );
        } catch (
          error
        ) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados da meta."
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
  ]);

  const tipoSelecionado =
    useMemo(() => {
      return tiposMeta.find(
        (
          tipo
        ) =>
          tipo.idTipoMeta ===
          Number(
            idTipoMeta
          )
      );
    }, [
      tiposMeta,
      idTipoMeta,
    ]);

  const IconeSelecionado =
    tipoSelecionado
      ? ICONES[
          tipoSelecionado.icone
        ] ??
        Target
      : Target;

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
        "Informe o nome da meta."
      );

      return;
    }

    if (!idTipoMeta) {
      setErro(
        "Selecione o tipo da meta."
      );

      return;
    }

    if (!valorObjetivo) {
      setErro(
        "Informe o valor objetivo."
      );

      return;
    }

    const objetivoNumerico =
      Number(
        valorObjetivo.replace(
          ",",
          "."
        )
      );

    if (
      Number.isNaN(
        objetivoNumerico
      ) ||
      objetivoNumerico <=
        0
    ) {
      setErro(
        "Informe um valor objetivo válido."
      );

      return;
    }

    const atualNumerico =
      Number(
        valorAtual.replace(
          ",",
          "."
        )
      );

    if (
      Number.isNaN(
        atualNumerico
      ) ||
      atualNumerico <
        0
    ) {
      setErro(
        "Informe um valor atual válido."
      );

      return;
    }

    if (
      atualNumerico >
      objetivoNumerico
    ) {
      setErro(
        "O valor atual não pode ser maior que o valor objetivo."
      );

      return;
    }

    if (!dataInicio) {
      setErro(
        "Informe a data de início."
      );

      return;
    }

    if (
      dataPrazo &&
      dataPrazo <
        dataInicio
    ) {
      setErro(
        "O prazo não pode ser anterior à data de início."
      );

      return;
    }

    try {
      setSalvando(
        true
      );

      const response =
        await fetch(
          `/api/metas/usuario/${usuario.idUsuario}`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                idTipoMeta:
                  Number(
                    idTipoMeta
                  ),

                nome:
                  nome.trim(),

                valorObjetivo:
                  objetivoNumerico,

                valorAtual:
                  atualNumerico,

                dataInicio:
                  `${dataInicio}T00:00:00`,

                dataPrazo:
                  dataPrazo
                    ? `${dataPrazo}T00:00:00`
                    : null,

                status,

                icone:
                  tipoSelecionado?.icone ??
                  "target",
              }),
          }
        );

      if (!response.ok) {
        let mensagem =
          "Não foi possível registrar a meta.";

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
        "/metas"
      );

      router.refresh();
    } catch (
      error
    ) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a meta."
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
          Carregando formulário...
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
                Nova meta
              </h1>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Crie um novo objetivo financeiro e acompanhe seu progresso
              </p>
            </div>

            <Link
              href="/metas"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--form-back-bg)] px-4 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--form-back-hover)]"
            >
              <ArrowLeft
                size={17}
              />

              Voltar para Metas
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
                Criar meta financeira
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Defina o objetivo, o valor e o prazo da sua meta
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
                  Nome da meta
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
                  placeholder="Ex: Viagem para o Japão"
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
                />
              </div>

              {/* TIPO */}

              <div>
                <label
                  htmlFor="tipo"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Tipo de meta
                </label>

                <select
                  id="tipo"
                  value={
                    idTipoMeta
                  }
                  onChange={(
                    event
                  ) =>
                    setIdTipoMeta(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                >
                  <option value="">
                    Selecione o tipo
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
              </div>

              {/* VALOR OBJETIVO */}

              <div>
                <label
                  htmlFor="valorObjetivo"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Valor objetivo
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--form-muted)]">
                    R$
                  </span>

                  <input
                    id="valorObjetivo"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      valorObjetivo
                    }
                    onChange={(
                      event
                    ) =>
                      setValorObjetivo(
                        event.target.value
                      )
                    }
                    placeholder="0,00"
                    className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--form-muted)] focus:border-[var(--form-field-focus)]"
                  />
                </div>
              </div>

              {/* VALOR ATUAL */}

              <div>
                <label
                  htmlFor="valorAtual"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Valor atual
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--form-muted)]">
                    R$
                  </span>

                  <input
                    id="valorAtual"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      valorAtual
                    }
                    onChange={(
                      event
                    ) =>
                      setValorAtual(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                  />
                </div>
              </div>

              {/* DATA INÍCIO */}

              <div>
                <label
                  htmlFor="dataInicio"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Data de início
                </label>

                <input
                  id="dataInicio"
                  type="date"
                  value={
                    dataInicio
                  }
                  onChange={(
                    event
                  ) =>
                    setDataInicio(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                />
              </div>

              {/* PRAZO */}

              <div>
                <label
                  htmlFor="dataPrazo"
                  className="mb-2 block text-sm font-medium text-[var(--form-label)]"
                >
                  Prazo
                </label>

                <input
                  id="dataPrazo"
                  type="date"
                  value={
                    dataPrazo
                  }
                  min={
                    dataInicio
                  }
                  onChange={(
                    event
                  ) =>
                    setDataPrazo(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--form-field-border)] bg-[var(--form-field-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--form-field-focus)]"
                />
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
                  {STATUS_META.map(
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

              {/* CATEGORIA */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--form-label)]">
                  Categoria selecionada
                </label>

                <div className="flex h-11 items-center gap-3 rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-4">
                  <IconeSelecionado
                    size={18}
                    className="text-[var(--accent)]"
                  />

                  <span className="text-sm text-[var(--text-secondary)]">
                    {tipoSelecionado?.nome ??
                      "Selecione um tipo de meta"}
                  </span>
                </div>
              </div>
            </div>

            {/* AÇÕES */}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--form-divider)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/metas"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--form-field-border)] bg-[var(--form-secondary-bg)] px-5 text-sm text-[var(--button-secondary-text)] transition hover:bg-[var(--form-secondary-hover)]"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={
                  salvando
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check
                  size={17}
                />

                {salvando
                  ? "Salvando..."
                  : "Salvar meta"}
              </button>
            </div>
          </form>

          {/* DICA */}

          <aside className="fin-tip mt-6 flex items-start gap-3 rounded-xl px-5 py-4">
            <Target
              size={20}
              className="fin-tip-icon mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Transforme objetivos em progresso
              </p>

              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                Defina um objetivo realista e mantenha o valor atual atualizado. O progresso será calculado automaticamente na tela de Metas.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}