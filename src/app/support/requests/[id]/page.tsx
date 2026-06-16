import SupportRequestDetailClient from "@/features/support/requests/components/SupportRequestDetailClient";

export default async function SupportReuuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SupportRequestDetailClient requestId={id} />;
}
