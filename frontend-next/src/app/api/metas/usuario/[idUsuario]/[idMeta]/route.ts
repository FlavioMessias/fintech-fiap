import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    idUsuario: string;
    idMeta: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const {
      idUsuario,
      idMeta,
    } = await context.params;

    const response = await fetch(
      `${API_URL}/api/metas/usuario/${idUsuario}/${idMeta}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return new NextResponse(text || null, {
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
      "Erro ao consultar meta:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível consultar a meta.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const {
      idUsuario,
      idMeta,
    } = await context.params;

    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/metas/usuario/${idUsuario}/${idMeta}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return new NextResponse(text || null, {
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
      "Erro ao atualizar meta:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível atualizar a meta.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const {
      idUsuario,
      idMeta,
    } = await context.params;

    const response = await fetch(
      `${API_URL}/api/metas/usuario/${idUsuario}/${idMeta}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const text =
        await response.text();

      return new NextResponse(
        text || null,
        {
          status:
            response.status,
        }
      );
    }

    if (
      response.status ===
      204
    ) {
      return new NextResponse(
        null,
        {
          status: 204,
        }
      );
    }

    const text =
      await response.text();

    return new NextResponse(
      text || null,
      {
        status:
          response.status,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao excluir meta:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível excluir a meta.",
      },
      {
        status: 500,
      }
    );
  }
}