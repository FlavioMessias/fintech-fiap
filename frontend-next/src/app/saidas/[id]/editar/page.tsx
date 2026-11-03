import EditarSaidaClient from "./EditarSaidaClient";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarSaidaPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <EditarSaidaClient idSaida={id} />
  );
}