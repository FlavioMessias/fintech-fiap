import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ??
  "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    idUsuario: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { idUsuario } = await context.params;

    const response = await fetch(
      `${API_URL}/api/contas-bancarias/usuario/${idUsuario}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return new NextResponse(text, {
        status: response.status,
      });
    }

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "Erro ao consultar contas bancárias:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível consultar as contas bancárias.",
      },
      {
        status: 500,
      }
    );
  }
}