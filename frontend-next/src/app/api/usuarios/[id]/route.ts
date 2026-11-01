import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/usuarios/${id}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return NextResponse.json(
      { message: "Erro ao buscar usuário." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/api/usuarios/${id}`,
      {
        method: "PUT",
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
    console.error("Erro ao atualizar usuário:", error);

    return NextResponse.json(
      { message: "Erro ao atualizar usuário." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/usuarios/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Não foi possível excluir o usuário." },
        { status: response.status }
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);

    return NextResponse.json(
      { message: "Erro ao excluir usuário." },
      { status: 500 }
    );
  }
}