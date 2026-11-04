import EditarMetaClient from "./EditarMetaClient";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarMetaPage({
  params,
}: PageProps) {
  const { id } = await params;

  return <EditarMetaClient idMeta={id} />;
}