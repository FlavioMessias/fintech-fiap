import { NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ??
  "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/usuarios/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          {
            message:
              "E-mail ou senha inválidos.",
          },
          {
            status: 401,
          }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            message:
              "Dados de login inválidos.",
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json(
        {
          message:
            "Erro ao realizar login.",
        },
        {
          status:
            response.status,
        }
      );
    }

    const usuario =
      await response.json();

    return NextResponse.json(
      usuario,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao realizar login:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível conectar ao servidor.",
      },
      {
        status: 500,
      }
    );
  }
}