import {
  connection,
} from "next/server";

const API_URL =
  process.env.API_URL ??
  "http://localhost:8080";

export async function GET() {
  await connection();

  try {
    const response =
      await fetch(
        `${API_URL}/api/tipos-meta`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

    const data =
      await response.json();

    return Response.json(
      data,
      {
        status:
          response.status,
      }
    );
  } catch (
    error
  ) {
    console.error(
      "Erro ao consultar tipos de meta:",
      error
    );

    return Response.json(
      {
        message:
          "Não foi possível consultar os tipos de meta.",
      },
      {
        status: 500,
      }
    );
  }
}