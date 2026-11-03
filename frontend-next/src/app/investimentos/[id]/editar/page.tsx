import EditarInvestimentoClient from "./EditarInvestimentoClient";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarInvestimentoPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <EditarInvestimentoClient
      idInvestimento={id}
    />
  );
}