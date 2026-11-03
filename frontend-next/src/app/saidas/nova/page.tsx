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
  CircleAlert,
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

export default function NovaSaidaPage() {
  const router = useRouter();

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioLogado | null>(
      null
    );

  const [
    categorias,
    setCategorias,
  ] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] =
    useState<
      FormaMovimentacao[]
    >([]);

  const [
    valor,
    setValor,
  ] =
    useState("");

  const [
    idCategoria,
    setIdCategoria,
  ] =
    useState("");

  const [
    idFormaMovimentacao,
    setIdFormaMovimentacao,
  ] =
    useState("");

  const [
    dataSaida,
    setDataSaida,
  ] =
    useState("");

  const [
    descricao,
    setDescricao,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("PAGO");

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
  setValor("");
  setIdCategoria("");
  setIdFormaMovimentacao("");
  setDescricao("");
  setStatus("PAGO");
  setErro(null);

  const agora = new Date();

  const ano = agora.getFullYear();

  const mes = String(
    agora.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    agora.getDate()
  ).padStart(2, "0");

  setDataSaida(
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
                  "S"
              )
            );

            setFormasMovimentacao(
              dadosFormas.filter(
                (
                  forma
                ) =>
                  forma.tipo ===
                    "S" ||
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
  }, [
    router,
  ]);

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
          "Informe um valor válido para a saída."
        );

        return;
      }

      if (!idCategoria) {
        setErro(
          "Selecione a categoria da saída."
        );

        return;
      }

      if (
        !idFormaMovimentacao
      ) {
        setErro(
          "Selecione a forma de pagamento."
        );

        return;
      }

      if (!dataSaida) {
        setErro(
          "Informe a data da saída."
        );

        return;
      }

      setSalvando(
        true
      );

      try {
        const response =
          await fetch(
            `/api/saidas/usuario/${usuario.idUsuario}`,
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

                  dataSaida:
                    `${dataSaida}T00:00:00`,

                  descricao:
                    descricao.trim(),

                  status,

                  ativo:
                    "S",
                }),
            }
          );

        if (
          !response.ok
        ) {
          let mensagem =
            "Não foi possível salvar a saída.";

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
            // mantém mensagem padrão
          }

          throw new Error(
            mensagem
          );
        }

        router.push(
          "/saidas"
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
            Error
            ? error.message
            : "Não foi possível salvar a saída."
        );
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
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f4f6f5]
          text-sm
          text-[#6c756f]
        "
      >
        Carregando formulário...
      </div>
    );
  }

  return (
    <AppShell>
      <section
        className="
          mx-auto
          max-w-[980px]
          px-8
          pb-12
          pt-10
        "
      >
        <header
          className="
            mb-8
            flex
            items-start
            justify-between
          "
        >
          <div>
            <h1
              className="
                text-[27px]
                font-bold
                tracking-[-0.03em]
                text-[#171c26]
              "
            >
              Registrar Saída
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[#78838e]
              "
            >
              Cadastre uma nova despesa realizada
            </p>
          </div>

          <Link
            href="/saidas"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-[#d8dde0]
              bg-white
              px-4
              py-2.5
              text-sm
              text-[#505a54]
              transition
              hover:bg-[#f5f6f5]
            "
          >
            <ArrowLeft
              size={16}
            />

            Voltar para Saídas
          </Link>
        </header>

        <form
          onSubmit={
            handleSubmit
          }
          autoComplete="off"
          className="
            rounded-[14px]
            border
            border-[#dde2df]
            bg-white
            p-8
            shadow-[0_12px_30px_rgba(15,23,42,0.10)]
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              text-[#181d25]
            "
          >
            Nova Saída
          </h2>

          <div
            className="
              my-5
              border-t
              border-[#e7e9e8]
            "
          />

          {erro && (
            <div
              className="
                mb-5
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              {erro}
            </div>
          )}

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            <div>
              <label
                htmlFor="valor"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#36413b]
                "
              >
                Valor da saída
              </label>

              <div
                className="
                  flex
                  items-center
                  rounded-lg
                  border
                  border-[#d4dad6]
                  bg-[#f2f4f3]
                "
              >
                <span
                  className="
                    pl-4
                    text-sm
                    text-[#77817b]
                  "
                >
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
                  className="
                    w-full
                    bg-transparent
                    px-2
                    py-3
                    text-sm
                    outline-none
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="data"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#36413b]
                "
              >
                Data
              </label>

              <input
                id="data"
                type="date"
                value={
                  dataSaida
                }
                onChange={(
                  event
                ) =>
                  setDataSaida(
                    event
                      .target
                      .value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#d4dad6]
                  bg-[#f2f4f3]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-[#16803a]
                "
              />
            </div>

            <div>
              <label
                htmlFor="categoria"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#36413b]
                "
              >
                Categoria da saída
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
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#d4dad6]
                  bg-[#f2f4f3]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-[#16803a]
                "
              >
                <option value="">
                  Selecione a categoria
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

            <div>
              <label
                htmlFor="forma"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#36413b]
                "
              >
                Forma de pagamento
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
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#d4dad6]
                  bg-[#f2f4f3]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-[#16803a]
                "
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

            <div>
              <label
                htmlFor="status"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#36413b]
                "
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
                    event
                      .target
                      .value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#d4dad6]
                  bg-[#f2f4f3]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-[#16803a]
                "
              >
                <option value="PAGO">
                  Pago
                </option>

                <option value="PENDENTE">
                  Pendente
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="descricao"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#36413b]
              "
            >
              Descrição{" "}
              <span
                className="
                  font-normal
                  text-[#8b948f]
                "
              >
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
              maxLength={
                255
              }
              placeholder="Ex: supermercado, aluguel, transporte, assinatura..."
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-[#d4dad6]
                bg-[#f2f4f3]
                px-4
                py-3
                text-sm
                outline-none
                placeholder:text-[#8b948f]
                focus:border-[#16803a]
              "
            />
          </div>

          <div
            className="
              my-7
              border-t
              border-[#e7e9e8]
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <Link
              href="/saidas"
              className="
                rounded-lg
                border
                border-[#d6dcda]
                bg-[#f2f4f3]
                px-5
                py-2.5
                text-sm
                font-medium
                text-[#46514b]
                transition
                hover:bg-[#e9ecea]
              "
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={
                salvando
              }
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-[#17a447]
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#148d3e]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Check
                size={17}
              />

              {salvando
                ? "Salvando..."
                : "Salvar saída"}
            </button>
          </div>
        </form>

        <aside
          className="
            mt-7
            flex
            items-start
            gap-4
            rounded-xl
            border
            border-[#f0d5ae]
            bg-[#fffaf2]
            px-5
            py-4
          "
        >
          <CircleAlert
            size={20}
            className="
              mt-0.5
              shrink-0
              text-[#b7791f]
            "
          />

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-[#222a25]
              "
            >
              Dica de organização
            </p>

            <p
              className="
                mt-1
                text-sm
                text-[#6b756f]
              "
            >
              Categorize suas despesas corretamente para facilitar a análise dos seus gastos nos relatórios.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}