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
      `${API_URL}/api/investimentos/usuario/${idUsuario}`,
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
      "Erro ao consultar investimentos:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível consultar os investimentos.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { idUsuario } = await context.params;

    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/investimentos/usuario/${idUsuario}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
      "Erro ao registrar investimento:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível registrar o investimento.",
      },
      {
        status: 500,
      }
    );
  }
}