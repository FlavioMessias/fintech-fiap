"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
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

const ITENS_POR_PAGINA = 7;

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(valor);
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat(
    "pt-BR"
  ).format(new Date(data));
}

function mesmoMes(
  data: Date,
  referencia: Date
) {
  return (
    data.getMonth() ===
      referencia.getMonth() &&
    data.getFullYear() ===
      referencia.getFullYear()
  );
}

function formatarMesAno(data: Date) {
  const mes =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        month: "long",
      }
    ).format(data);

  return `${
    mes.charAt(0).toUpperCase() +
    mes.slice(1)
  }/${data.getFullYear()}`;
}

export default function EntradasPage() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(
      null
    );

  const [entradas, setEntradas] =
    useState<Entrada[]>([]);

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [
    formasMovimentacao,
    setFormasMovimentacao,
  ] = useState<FormaMovimentacao[]>(
    []
  );

  const [busca, setBusca] =
    useState("");

  const [periodo, setPeriodo] =
    useState("todos");

  const [origem, setOrigem] =
    useState("todas");

  const [paginaAtual, setPaginaAtual] =
    useState(1);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [hoje, setHoje] =
    useState<Date | null>(null);

  const [
  menuAberto,
  setMenuAberto,
] = useState<number | null>(null);

const [
  entradaParaExcluir,
  setEntradaParaExcluir,
] = useState<Entrada | null>(null);

const [
  excluindo,
  setExcluindo,
] = useState(false);  

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

      const carregarDados =
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
              throw new Error();
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
              dadosCategorias.filter(
                (categoria) =>
                  categoria.tipo === "E"
              )
            );

            setFormasMovimentacao(
              dadosFormas.filter(
                (forma) =>
                  forma.tipo === "E" ||
                  forma.tipo === "A"
              )
            );
          } catch {
            setErro(
              "Não foi possível carregar as entradas."
            );
          } finally {
            setCarregando(false);
          }
        };

      carregarDados();
    } catch {
      localStorage.removeItem(
        "usuario_fintech"
      );

      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [
    busca,
    periodo,
    origem,
  ]);

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
    }, [formasMovimentacao]);

  const entradasFiltradas =
    useMemo(() => {
      if (!hoje) {
        return [];
      }

      const termo =
        busca
          .trim()
          .toLowerCase();

      return [...entradas]
        .filter((entrada) => {
          if (
            termo &&
            !(
              entrada.descricao ??
              ""
            )
              .toLowerCase()
              .includes(termo)
          ) {
            return false;
          }

          if (
            origem !== "todas" &&
            entrada.idCategoria !==
              Number(origem)
          ) {
            return false;
          }

          const dataEntrada =
            new Date(
              entrada.dataEntrada
            );

          if (
            periodo ===
            "mes-atual"
          ) {
            return mesmoMes(
              dataEntrada,
              hoje
            );
          }

          if (
            periodo ===
            "ultimos-3-meses"
          ) {
            const inicio =
              new Date(
                hoje.getFullYear(),
                hoje.getMonth() - 2,
                1
              );

            const fim =
              new Date(
                hoje.getFullYear(),
                hoje.getMonth() + 1,
                1
              );

            return (
              dataEntrada >= inicio &&
              dataEntrada < fim
            );
          }

          return true;
        })
        .sort(
          (a, b) =>
            new Date(
              b.dataEntrada
            ).getTime() -
            new Date(
              a.dataEntrada
            ).getTime()
        );
    }, [
      entradas,
      busca,
      periodo,
      origem,
      hoje,
    ]);

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        entradasFiltradas.length /
          ITENS_POR_PAGINA
      )
    );

  const entradasPagina =
    useMemo(() => {
      const inicio =
        (paginaAtual - 1) *
        ITENS_POR_PAGINA;

      return entradasFiltradas.slice(
        inicio,
        inicio +
          ITENS_POR_PAGINA
      );
    }, [
      entradasFiltradas,
      paginaAtual,
    ]);

  const inicioExibicao =
    entradasFiltradas.length === 0
      ? 0
      : (paginaAtual - 1) *
          ITENS_POR_PAGINA +
        1;

  const fimExibicao =
    Math.min(
      paginaAtual *
        ITENS_POR_PAGINA,
      entradasFiltradas.length
    );

  const limparFiltros = () => {
    setBusca("");
    setPeriodo("todos");
    setOrigem("todas");
    setPaginaAtual(1);
  };

  const handleExcluir = async () => {
  if (
    !usuario ||
    !entradaParaExcluir
  ) {
    return;
  }

  setExcluindo(true);
  setErro(null);

  try {
    const response = await fetch(
      `/api/entradas/usuario/${usuario.idUsuario}/${entradaParaExcluir.idEntrada}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Não foi possível excluir a entrada."
      );
    }

    setEntradas(
      (entradasAtuais) =>
        entradasAtuais.filter(
          (entrada) =>
            entrada.idEntrada !==
            entradaParaExcluir.idEntrada
        )
    );

    setEntradaParaExcluir(null);
    setMenuAberto(null);
  } catch (error) {
    setErro(
      error instanceof Error
        ? error.message
        : "Não foi possível excluir a entrada."
    );
  } finally {
    setExcluindo(false);
  }
};

  if (
    carregando ||
    !hoje
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f6f7f8]
          text-sm
          text-gray-500
        "
      >
        Carregando entradas...
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
          max-w-[1280px]
          pb-8
          pt-10
        "
      >
        {/* CABEÇALHO */}
        <header
          className="
            flex
            items-start
            justify-between
            px-8
            pb-8
          "
        >
          <div>
            <h1
              className="
                text-[28px]
                font-bold
                tracking-[-0.03em]
                text-[#171c26]
              "
            >
              Histórico de entradas
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[#77818e]
              "
            >
              Consulte todas as receitas registradas
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-[#d9dde2]
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-[#4f5966]
              "
            >
              <CalendarDays
                size={16}
              />

              {formatarMesAno(
                hoje
              )}
            </div>

            <Link
              href="/entradas/nova"
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-[#176b2d]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#125824]
              "
            >
              <Plus size={16} />

              Nova entrada
            </Link>
          </div>
        </header>

        {erro && (
          <div
            className="
              mx-8
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

        {/* FILTROS */}
        <div
          className="
            grid
            grid-cols-1
            gap-3
            border-y
            border-[#e1e4e7]
            bg-white
            px-3
            py-3
            md:grid-cols-4
          "
        >
          <div
            className="
              flex
              items-center
              rounded-lg
              border
              border-[#d8dde3]
              bg-white
              px-3
            "
          >
            <Search
              size={19}
              className="text-[#788492]"
            />

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value
                )
              }
              placeholder="Buscar entrada..."
              className="
                w-full
                bg-transparent
                px-3
                py-2
                text-sm
                outline-none
                placeholder:text-[#647083]
              "
            />
          </div>

          <select
            value={periodo}
            onChange={(event) =>
              setPeriodo(
                event.target.value
              )
            }
            className="
              rounded-lg
              border
              border-[#d8dde3]
              bg-white
              px-3
              py-2
              text-sm
              text-[#4b5665]
              outline-none
            "
          >
            <option value="todos">
              Período: Todos
            </option>

            <option value="mes-atual">
              Mês atual
            </option>

            <option value="ultimos-3-meses">
              Últimos 3 meses
            </option>
          </select>

          <select
            value={origem}
            onChange={(event) =>
              setOrigem(
                event.target.value
              )
            }
            className="
              rounded-lg
              border
              border-[#d8dde3]
              bg-white
              px-3
              py-2
              text-sm
              text-[#4b5665]
              outline-none
            "
          >
            <option value="todas">
              Origem: Todas
            </option>

            {categorias.map(
              (categoria) => (
                <option
                  key={
                    categoria.idCategoria
                  }
                  value={
                    categoria.idCategoria
                  }
                >
                  {categoria.nome}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={
              limparFiltros
            }
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-lg
              border
              border-[#d8dde3]
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-[#4b5665]
              transition
              hover:bg-[#f5f6f7]
            "
          >
            <RotateCcw
              size={18}
            />

            Limpar filtros
          </button>
        </div>

        {/* TABELA */}
        <div
          className="
            overflow-x-auto
            bg-white
          "
        >
          <table
            className="
              w-full
              border-collapse
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-[#40454b]
                  bg-[#f7f8f9]
                  text-left
                  text-[14px]
                  font-semibold
                  text-[#171b22]
                "
              >
                <th className="px-7 py-5">
                  Data
                </th>

                <th className="px-5 py-5">
                  Descrição
                </th>

                <th className="px-5 py-5">
                  Categoria
                </th>

                <th className="px-5 py-5">
                  Valor
                </th>

                <th className="px-5 py-5">
                  Forma de recebimento
                </th>

                <th
                  className="
                    px-5
                    py-5
                    text-center
                  "
                >
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {entradasPagina.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      px-8
                      py-16
                      text-center
                      text-sm
                      text-[#77818e]
                    "
                  >
                    Nenhuma entrada encontrada.
                  </td>
                </tr>
              ) : (
                entradasPagina.map(
                  (
                    entrada,
                    indice
                  ) => (
                    <tr
                      key={
                        entrada.idEntrada
                      }
                      className={`
                        text-[13px]
                        text-[#20252d]
                        ${
                          indice %
                            2 ===
                          0
                            ? "bg-white"
                            : "bg-[#fafbfb]"
                        }
                      `}
                    >
                      <td className="px-7 py-5">
                        {formatarData(
                          entrada.dataEntrada
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {entrada.descricao ||
                          "Sem descrição"}
                      </td>

                      <td className="px-5 py-5">
                        {categoriaPorId.get(
                          entrada.idCategoria
                        ) ??
                          `Categoria #${entrada.idCategoria}`}
                      </td>

                      <td
                        className="
                          px-5
                          py-5
                          font-medium
                          text-[#11a13b]
                        "
                      >
                        {formatarMoeda(
                          Number(
                            entrada.valor
                          )
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {formaPorId.get(
                          entrada.idFormaMovimentacao
                        ) ??
                          `Forma #${entrada.idFormaMovimentacao}`}
                      </td>

                      <td className="px-5 py-5">
                        <div
  className="
    relative
    flex
    items-center
    justify-center
    gap-3
  "
>
  <Link
    href={`/entradas/${entrada.idEntrada}/editar`}
    title="Editar entrada"
    className="
      rounded-md
      p-1
      transition
      hover:bg-[#eef3ef]
      hover:text-[#168238]
    "
  >
    <Pencil size={17} />
  </Link>

  <button
    type="button"
    title="Mais opções"
    onClick={() =>
      setMenuAberto(
        menuAberto ===
          entrada.idEntrada
          ? null
          : entrada.idEntrada
      )
    }
    className="
      rounded-md
      p-1
      transition
      hover:bg-[#eef3ef]
      hover:text-[#168238]
    "
  >
    <MoreVertical size={18} />
  </button>

  {menuAberto ===
    entrada.idEntrada && (
    <div
      className="
        absolute
        right-5
        top-8
        z-20
        w-36
        overflow-hidden
        rounded-lg
        border
        border-[#dce1de]
        bg-white
        py-1
        shadow-[0_8px_24px_rgba(15,23,42,0.12)]
      "
    >
      <Link
        href={`/entradas/${entrada.idEntrada}/editar`}
        className="
          flex
          items-center
          gap-3
          px-4
          py-2.5
          text-left
          text-sm
          text-[#37413c]
          hover:bg-[#f4f6f5]
        "
      >
        <Pencil size={15} />
        Editar
      </Link>

      <button
        type="button"
        onClick={() => {
          setEntradaParaExcluir(
            entrada
          );

          setMenuAberto(null);
        }}
        className="
          flex
          w-full
          items-center
          gap-3
          px-4
          py-2.5
          text-left
          text-sm
          text-red-600
          hover:bg-red-50
        "
      >
        <Trash2 size={15} />
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

        <footer
          className="
            flex
            items-center
            justify-between
            border-t
            border-[#d8dce0]
            bg-white
            px-7
            py-3
          "
        >
          <p
            className="
              text-xs
              text-[#707b89]
            "
          >
            Mostrando{" "}
            {inicioExibicao} a{" "}
            {fimExibicao} de{" "}
            {
              entradasFiltradas.length
            }{" "}
            entradas
          </p>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <button
              type="button"
              disabled={
                paginaAtual === 1
              }
              onClick={() =>
                setPaginaAtual(1)
              }
              className="
                disabled:opacity-30
              "
            >
              <ChevronsLeft
                size={20}
              />
            </button>

            <button
              type="button"
              disabled={
                paginaAtual === 1
              }
              onClick={() =>
                setPaginaAtual(
                  (pagina) =>
                    pagina - 1
                )
              }
              className="
                disabled:opacity-30
              "
            >
              <ChevronLeft
                size={20}
              />
            </button>

            {Array.from(
              {
                length:
                  totalPaginas,
              },
              (_, indice) =>
                indice + 1
            )
              .slice(0, 5)
              .map(
                (pagina) => (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() =>
                      setPaginaAtual(
                        pagina
                      )
                    }
                    className={`
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      text-xs
                      ${
                        paginaAtual ===
                        pagina
                          ? "bg-[#176b2d] text-white"
                          : "text-[#22272e] hover:bg-[#eef0f1]"
                      }
                    `}
                  >
                    {pagina}
                  </button>
                )
              )}

            <button
              type="button"
              disabled={
                paginaAtual ===
                totalPaginas
              }
              onClick={() =>
                setPaginaAtual(
                  (pagina) =>
                    pagina + 1
                )
              }
              className="
                disabled:opacity-30
              "
            >
              <ChevronRight
                size={20}
              />
            </button>

            <button
              type="button"
              disabled={
                paginaAtual ===
                totalPaginas
              }
              onClick={() =>
                setPaginaAtual(
                  totalPaginas
                )
              }
              className="
                disabled:opacity-30
              "
            >
              <ChevronsRight
                size={20}
              />
            </button>
          </div>
        </footer>
      </section>
      {entradaParaExcluir && (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      px-4
    "
  >
    <div
      className="
        w-full
        max-w-[430px]
        rounded-[14px]
        bg-white
        p-6
        shadow-[0_24px_60px_rgba(0,0,0,0.20)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-[#171c26]
            "
          >
            Excluir entrada
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-[#69736d]
            "
          >
            Tem certeza que deseja excluir
            esta entrada?
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEntradaParaExcluir(
              null
            )
          }
          disabled={excluindo}
          className="
            rounded-md
            p-1
            text-[#7a847e]
            hover:bg-[#f2f4f3]
          "
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="
          mt-5
          rounded-lg
          border
          border-[#e4e8e5]
          bg-[#f7f8f7]
          px-4
          py-3
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-[#303833]
          "
        >
          {entradaParaExcluir.descricao ||
            "Entrada sem descrição"}
        </p>

        <p
          className="
            mt-1
            text-sm
            font-semibold
            text-[#16833b]
          "
        >
          {formatarMoeda(
            Number(
              entradaParaExcluir.valor
            )
          )}
        </p>
      </div>

      <p
        className="
          mt-4
          text-xs
          text-[#8a938e]
        "
      >
        Esta ação não poderá ser desfeita.
      </p>

      <div
        className="
          mt-6
          flex
          justify-end
          gap-3
        "
      >
        <button
          type="button"
          disabled={excluindo}
          onClick={() =>
            setEntradaParaExcluir(
              null
            )
          }
          className="
            rounded-lg
            border
            border-[#d8ddda]
            px-4
            py-2.5
            text-sm
            font-medium
            text-[#4b554f]
            hover:bg-[#f4f6f5]
          "
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={excluindo}
          onClick={handleExcluir}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-red-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Trash2 size={16} />

          {excluindo
            ? "Excluindo..."
            : "Excluir entrada"}
        </button>
      </div>
    </div>
  </div>
)}
    </AppShell>
  );
}