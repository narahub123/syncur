import { getNoticeDetailAction } from "@/features/support/notices/actions/getNoticeDetailAction";
import SupportNoticeDetailClient from "@/features/support/notices/components/SupportNoticeDetailClient";
import { notFound } from "next/navigation";

export default async function SupportNoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const notice = await getNoticeDetailAction(id);

  if (!notice) {
    notFound();
  }

  // Client Component로 초기 데이터 전달
  return <SupportNoticeDetailClient initialData={notice} />;
}
