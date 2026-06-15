import AdminFAQNewClient from "@/features/admin/faqs/components/AdminFAQNewClient";
import { getFaqAction } from "@/features/support/faqs/actions/getFaqAction";
import { notFound } from "next/navigation";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminFAQNewPage({ params }: EditFaqPageProps) {
  const { id } = await params;

  const initialData = await getFaqAction(id);

  if (!initialData) {
    notFound();
  }

  return (
    <div className="p-8">
      {/* 💡 기존 컴포넌트에 id와 데이터를 넘겨주면 알아서 '수정 모드'로 작동합니다. */}
      <AdminFAQNewClient faqId={id} initialData={initialData} />
    </div>
  );
}
