const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    idUsuario: string;
    idEntrada: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { idUsuario, idEntrada } =
    await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/entradas/usuario/${idUsuario}/${idEntrada}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        message:
          "Não foi possível carregar a entrada.",
      },
      {
        status: 503,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const { idUsuario, idEntrada } =
    await context.params;

  try {
    const body = await request.text();

    const response = await fetch(
      `${API_URL}/api/entradas/usuario/${idUsuario}/${idEntrada}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body,
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        message:
          "Não foi possível atualizar a entrada.",
      },
      {
        status: 503,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { idUsuario, idEntrada } =
    await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/entradas/usuario/${idUsuario}/${idEntrada}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      return new Response(null, {
        status: 204,
      });
    }

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        message:
          "Não foi possível excluir a entrada.",
      },
      {
        status: 503,
      }
    );
  }
}