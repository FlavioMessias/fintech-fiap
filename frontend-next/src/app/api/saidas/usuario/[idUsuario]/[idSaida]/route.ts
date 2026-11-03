const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    idUsuario: string;
    idSaida: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const {
    idUsuario,
    idSaida,
  } = await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/saidas/usuario/${idUsuario}/${idSaida}`,
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
          "Não foi possível carregar a saída.",
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
  const {
    idUsuario,
    idSaida,
  } = await context.params;

  try {
    const body = await request.text();

    const response = await fetch(
      `${API_URL}/api/saidas/usuario/${idUsuario}/${idSaida}`,
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
          "Não foi possível atualizar a saída.",
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
  const {
    idUsuario,
    idSaida,
  } = await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/saidas/usuario/${idUsuario}/${idSaida}`,
      {
        method: "DELETE",
      }
    );

    if (
      response.status === 204
    ) {
      return new Response(
        null,
        {
          status: 204,
        }
      );
    }

    const data =
      await response.text();

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
          "Não foi possível excluir a saída.",
      },
      {
        status: 503,
      }
    );
  }
}