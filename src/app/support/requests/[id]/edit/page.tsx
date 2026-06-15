import SupportRequestEditClient from "@/features/support/requests/components/SupportRequestEditClient";

export default async function SupportReuuestEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 서버에서 id 추출
  return <SupportRequestEditClient requestId={id} />;
}
