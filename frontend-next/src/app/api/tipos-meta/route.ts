import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

export async function GET(
  _request: NextRequest
) {
  try {
    const response = await fetch(
      `${API_URL}/api/tipos-meta`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return new NextResponse(
        text || null,
        {
          status:
            response.status,
        }
      );
    }

    return new NextResponse(
      text,
      {
        status:
          response.status,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao consultar tipos de meta:",
      error
    );

    return NextResponse.json(
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