const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    idUsuario: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { idUsuario } = await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/entradas/usuario/${idUsuario}`,
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
          "Não foi possível conectar ao backend.",
      },
      {
        status: 503,
      }
    );
  }
}