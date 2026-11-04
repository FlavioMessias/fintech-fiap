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

import type { LucideIcon } from "lucide-react";

import AppShell from "@/components/AppShell";

import type { MetaFinanceira } from "@/interfaces/meta-financeira.interface";
import type { TipoMeta } from "@/interfaces/tipo-meta.interface";

interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
}

interface EditarMetaClientProps {
  idMeta: string;
}

const ICONES: Record<string, LucideIcon> = {
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

export default function EditarMetaClient({
  idMeta,
}: EditarMetaClientProps) {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [tiposMeta, setTiposMeta] =
    useState<TipoMeta[]>([]);

  const [nome, setNome] =
    useState("");

  const [idTipoMeta, setIdTipoMeta] =
    useState("");

  const [valorObjetivo, setValorObjetivo] =
    useState("");

  const [valorAtual, setValorAtual] =
    useState("");

  const [dataInicio, setDataInicio] =
    useState("");

  const [dataPrazo, setDataPrazo] =
    useState("");

  const [status, setStatus] =
    useState("ATIVA");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const usuarioSalvo =
          localStorage.getItem(
            "usuario_fintech"
          );

        if (!usuarioSalvo) {
          router.push("/login");
          return;
        }

        const usuarioConvertido: UsuarioLogado =
          JSON.parse(usuarioSalvo);

        setUsuario(
          usuarioConvertido
        );

        const [
          responseMeta,
          responseTipos,
        ] = await Promise.all([
          fetch(
            `/api/metas/usuario/${usuarioConvertido.idUsuario}/${idMeta}`,
            {
              cache: "no-store",
            }
          ),
          fetch(
            "/api/tipos-meta",
            {
              cache: "no-store",
            }
          ),
        ]);

        if (!responseMeta.ok) {
          throw new Error(
            `Erro ao carregar meta: ${responseMeta.status}`
          );
        }

        if (!responseTipos.ok) {
          throw new Error(
            `Erro ao carregar tipos de meta: ${responseTipos.status}`
          );
        }

        const meta: MetaFinanceira =
          await responseMeta.json();

        const tipos: TipoMeta[] =
          await responseTipos.json();

        setTiposMeta(tipos);

        setNome(
          meta.nome ?? ""
        );

        setIdTipoMeta(
          String(
            meta.idTipoMeta
          )
        );

        setValorObjetivo(
          String(
            meta.valorObjetivo ?? ""
          )
        );

        setValorAtual(
          String(
            meta.valorAtual ?? "0"
          )
        );

        if (meta.dataInicio) {
          setDataInicio(
            meta.dataInicio.substring(
              0,
              10
            )
          );
        }

        if (meta.dataPrazo) {
          setDataPrazo(
            meta.dataPrazo.substring(
              0,
              10
            )
          );
        } else {
          setDataPrazo("");
        }

        setStatus(
          meta.status ?? "ATIVA"
        );
      } catch (error) {
        console.error(error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados da meta."
        );
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [
    router,
    idMeta,
  ]);

  const tipoSelecionado =
    useMemo(() => {
      return tiposMeta.find(
        (tipo) =>
          tipo.idTipoMeta ===
          Number(idTipoMeta)
      );
    }, [
      tiposMeta,
      idTipoMeta,
    ]);

  const IconeSelecionado =
    tipoSelecionado
      ? ICONES[
          tipoSelecionado.icone
        ] ?? Target
      : Target;

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
      objetivoNumerico <= 0
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
      atualNumerico < 0
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
      dataPrazo < dataInicio
    ) {
      setErro(
        "O prazo não pode ser anterior à data de início."
      );
      return;
    }

    try {
      setSalvando(true);

      const response =
        await fetch(
          `/api/metas/usuario/${usuario.idUsuario}/${idMeta}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
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
          "Não foi possível atualizar a meta.";

        try {
          const dados =
            await response.json();

          if (dados?.message) {
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

      router.push("/metas");
      router.refresh();
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a meta."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-[#6c756f]">
          Carregando meta...
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
              Editar meta
            </h1>

            <p className="mt-1 text-sm text-[#7b847f]">
              Atualize seu objetivo financeiro e acompanhe o progresso
            </p>
          </div>

          <Link
            href="/metas"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8dedb] bg-white px-4 text-sm text-[#59635d] transition hover:bg-[#f7f9f8]"
          >
            <ArrowLeft size={17} />
            Voltar para Metas
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-xl border border-[#dde3df] bg-white p-6 shadow-sm md:p-8"
        >
          <div className="border-b border-[#e2e6e4] pb-5">
            <h2 className="text-lg font-bold text-[#202622]">
              Atualizar meta financeira
            </h2>

            <p className="mt-1 text-sm text-[#818a85]">
              Edite os valores, prazo e status da sua meta
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
                Nome da meta
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              />
            </div>

            <div>
              <label
                htmlFor="tipo"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Tipo de meta
              </label>

              <select
                id="tipo"
                value={idTipoMeta}
                onChange={(event) =>
                  setIdTipoMeta(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              >
                <option value="">
                  Selecione o tipo
                </option>

                {tiposMeta.map(
                  (tipo) => (
                    <option
                      key={
                        tipo.idTipoMeta
                      }
                      value={
                        tipo.idTipoMeta
                      }
                    >
                      {tipo.nome}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="valorObjetivo"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Valor objetivo
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#89928d]">
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
                  onChange={(event) =>
                    setValorObjetivo(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] pl-11 pr-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="valorAtual"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Valor atual
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#89928d]">
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
                  onChange={(event) =>
                    setValorAtual(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] pl-11 pr-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dataInicio"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Data de início
              </label>

              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(event) =>
                  setDataInicio(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              />
            </div>

            <div>
              <label
                htmlFor="dataPrazo"
                className="mb-2 block text-sm font-medium text-[#3f4843]"
              >
                Prazo
              </label>

              <input
                id="dataPrazo"
                type="date"
                value={dataPrazo}
                min={dataInicio}
                onChange={(event) =>
                  setDataPrazo(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              />
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
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-[#d8dedb] bg-[#fbfcfb] px-4 text-sm text-[#252b27] outline-none transition focus:border-[#15983a] focus:bg-white focus:ring-2 focus:ring-[#15983a]/10"
              >
                {STATUS_META.map(
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3f4843]">
                Categoria selecionada
              </label>

              <div className="flex h-11 items-center gap-3 rounded-lg border border-[#d8dedb] bg-[#f7f9f8] px-4">
                <IconeSelecionado
                  size={18}
                  className="text-[#15983a]"
                />

                <span className="text-sm text-[#59635d]">
                  {tipoSelecionado?.nome ??
                    "Selecione um tipo de meta"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e4e8e6] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/metas"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d7ddda] px-5 text-sm text-[#59635d] transition hover:bg-[#f7f9f8]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={salvando}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#15983a] px-5 text-sm font-medium text-white transition hover:bg-[#117d30] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={17} />

              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </form>

        <aside className="mt-6 flex items-start gap-3 rounded-xl border border-[#cce7d4] bg-[#f4fbf6] px-5 py-4">
          <Target
            size={20}
            className="mt-0.5 shrink-0 text-[#15983a]"
          />

          <div>
            <p className="text-sm font-semibold text-[#222a25]">
              Mantenha sua meta atualizada
            </p>

            <p className="mt-1 text-sm leading-6 text-[#6b756f]">
              Atualize o valor acumulado ao longo do tempo para acompanhar corretamente o percentual e quanto ainda falta para atingir o objetivo.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}