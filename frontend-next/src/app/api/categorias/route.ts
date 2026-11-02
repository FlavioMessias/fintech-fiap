const API_URL =
  process.env.API_URL ?? "http://localhost:8080";

export async function GET() {
  try {
    const response = await fetch(
      `${API_URL}/api/categorias`,
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
          "Não foi possível carregar as categorias.",
      },
      {
        status: 503,
      }
    );
  }
}