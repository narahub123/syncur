import AdminFAQNewClient from "@/features/admin/faqs/components/AdminFAQNewClient";
import { mockFaqExample } from "@/features/admin/mocks";

interface EditFaqPageProps {
  params: {
    id: string;
  };
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const faqId = params.id;

  // 📝 실무 시점: 서버에서 DB 데이터를 직접 가져옵니다.
  // const faqData = await db.faq.findUnique({ where: { id: faqId } });

  // 테스트를 위해 어제 정의한 mock 데이터를 기존 데이터라고 가정합니다.
  const fetchedFaqData = mockFaqExample;

  return (
    <div className="p-8">
      {/* 💡 기존 컴포넌트에 id와 데이터를 넘겨주면 알아서 '수정 모드'로 작동합니다. */}
      <AdminFAQNewClient faqId={faqId} initialData={fetchedFaqData} />
    </div>
  );
}
