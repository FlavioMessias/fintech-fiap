import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/usuarios`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao buscar usuários." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/api/usuarios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    return NextResponse.json(
      { message: "Não foi possível cadastrar o usuário." },
      { status: 500 }
    );
  }
}