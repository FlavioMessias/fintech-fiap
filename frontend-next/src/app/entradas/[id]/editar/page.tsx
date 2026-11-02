import EditarEntradaClient from "./EditarEntradaClient";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarEntradaPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <EditarEntradaClient
      idEntrada={id}
    />
  );
}