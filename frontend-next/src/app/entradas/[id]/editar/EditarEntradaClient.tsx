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
  Star,
} from "lucide-react";

import AppShell from "@/components/AppShell";

import type {
  Entrada,
} from "@/interfaces/entrada.interface";

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

interface EditarEntradaClientProps {
  idEntrada: string;
}

export default function EditarEntradaClient({
  idEntrada,
}: EditarEntradaClientProps) {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] = useState<FormaMovimentacao[]>([]);

  const [valor, setValor] =
    useState("");

  const [
    idCategoria,
    setIdCategoria,
  ] = useState("");

  const [
    idFormaMovimentacao,
    setIdFormaMovimentacao,
  ] = useState("");

  const [
    dataEntrada,
    setDataEntrada,
  ] = useState("");

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

  const [erro, setErro] =
    useState<string | null>(null);

      useEffect(() => {
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

      const carregarDados =
        async () => {
          try {
            const [
              responseEntrada,
              responseCategorias,
              responseFormas,
            ] = await Promise.all([
              fetch(
                `/api/entradas/usuario/${usuarioConvertido.idUsuario}/${idEntrada}`,
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
              responseEntrada.status ===
              404
            ) {
              setErro(
                "Entrada não encontrada ou não pertence ao usuário."
              );

              return;
            }

            if (
              !responseEntrada.ok ||
              !responseCategorias.ok ||
              !responseFormas.ok
            ) {
              throw new Error();
            }

            const entrada: Entrada =
              await responseEntrada.json();

            const dadosCategorias: Categoria[] =
              await responseCategorias.json();

            const dadosFormas: FormaMovimentacao[] =
              await responseFormas.json();

            setCategorias(
              dadosCategorias.filter(
                (categoria) =>
                  categoria.tipo ===
                  "E"
              )
            );

            setFormasMovimentacao(
              dadosFormas.filter(
                (forma) =>
                  forma.tipo ===
                    "E" ||
                  forma.tipo ===
                    "A"
              )
            );

            setValor(
              String(
                entrada.valor
              )
            );

            setIdCategoria(
              String(
                entrada.idCategoria
              )
            );

            setIdFormaMovimentacao(
              String(
                entrada.idFormaMovimentacao
              )
            );

            setDataEntrada(
              entrada.dataEntrada
                .split("T")[0]
            );

            setDescricao(
              entrada.descricao ??
                ""
            );
          } catch {
            setErro(
              "Não foi possível carregar os dados da entrada."
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
    idEntrada,
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
      setSalvando(true);

      try {
        const response =
          await fetch(
            `/api/entradas/usuario/${usuario.idUsuario}/${idEntrada}`,
            {
              method: "PUT",
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
                    Number(valor),

                  dataEntrada:
                    `${dataEntrada}T00:00:00`,

                  descricao:
                    descricao.trim(),

                  ativo: "S",
                }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Não foi possível atualizar a entrada."
          );
        }

        router.push(
          "/entradas"
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a entrada."
        );
      } finally {
        setSalvando(false);
      }
    };

      if (carregando) {
    return (
      <div>
        Carregando entrada...
      </div>
    );
  }

  if (!usuario) {
    return null;
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
            Editar Entrada
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[#78838e]
            "
          >
            Atualize os dados da entrada
          </p>
        </div>

        <Link
          href="/entradas"
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
          <ArrowLeft size={16} />
          Voltar para Entradas
        </Link>
      </header>

      <form
        onSubmit={handleSubmit}
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
          Atualizar entrada
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
              Valor da entrada
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
                value={valor}
                onChange={(event) =>
                  setValor(event.target.value)
                }
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
              value={dataEntrada}
              onChange={(event) =>
                setDataEntrada(event.target.value)
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
              Origem da entrada
            </label>

            <select
              id="categoria"
              value={idCategoria}
              onChange={(event) =>
                setIdCategoria(event.target.value)
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
              "
            >
              <option value="">
                Selecione a origem
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.idCategoria}
                  value={categoria.idCategoria}
                >
                  {categoria.nome}
                </option>
              ))}
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
              Forma de recebimento
            </label>

            <select
              id="forma"
              value={idFormaMovimentacao}
              onChange={(event) =>
                setIdFormaMovimentacao(
                  event.target.value
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
              "
            >
              <option value="">
                Selecione a forma
              </option>

              {formasMovimentacao.map((forma) => (
                <option
                  key={forma.idForma}
                  value={forma.idForma}
                >
                  {forma.descricao}
                </option>
              ))}
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
            value={descricao}
            onChange={(event) =>
              setDescricao(event.target.value)
            }
            rows={4}
            maxLength={255}
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
            href="/entradas"
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
            "
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={salvando}
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
              disabled:opacity-60
            "
          >
            <Check size={17} />

            {salvando
              ? "Salvando..."
              : "Salvar alterações"}
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
          border-[#b9dfc5]
          bg-[#f4fbf6]
          px-5
          py-4
        "
      >
        <Star
          size={20}
          className="
            mt-0.5
            shrink-0
            text-[#18a24a]
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
            Detalhe bem suas entradas na descrição — isso facilita a visualização posteriormente.
          </p>
        </div>
      </aside>
    </section>
  </AppShell>
);}