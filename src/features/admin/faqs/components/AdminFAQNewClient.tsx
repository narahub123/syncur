"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { faqFormConfig, FaqFormValues } from "../types";

interface AdminFAQNewClientProps {
  faqId?: string; // 주어지면 '수정 모드', 없으면 '생성 모드'
  initialData?: FaqFormValues; // 수정 모드일 때 채워줄 기존 FAQ 데이터
}

export default function AdminFAQNewClient({
  faqId,
  initialData,
}: AdminFAQNewClientProps) {
  const isEditMode = Boolean(faqId);

  const handleFaqSubmit = async (data: FaqFormValues) => {
    // API로 전송하기 전 가공 (예: 가중치 스트링을 숫자로 변환)
    const payload = {
      ...data,
      sortOrder: parseInt(data.sortOrder, 10) || 10,
      isPublished: data.isPublished === "공개",
    };

    try {
      if (isEditMode) {
        console.log(`FAQ ID ${faqId}번 수정 데이터 전송:`, payload);
        // await fetch(`/api/admin/faqs/${faqId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        alert("FAQ가 성공적으로 수정되었습니다.");
      } else {
        console.log("새 FAQ 등록 데이터 전송:", payload);
        // await fetch(`/api/admin/faqs`, { method: 'POST', body: JSON.stringify(payload) });
        alert("새로운 FAQ가 성공적으로 등록되었습니다.");
      }
    } catch (error) {
      console.error("FAQ 처리 중 에러 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-2xl rounded-xl border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "FAQ 수정하기" : "새 FAQ 등록"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isEditMode
            ? "사용자 고객센터에 게시된 자주 묻는 질문 내용을 수정합니다."
            : "유저들이 고객센터에서 스스로 문제를 해결할 수 있도록 자주 묻는 질문을 추가합니다."}
        </p>
      </div>

      <DynamicForm<FaqFormValues>
        configs={faqFormConfig}
        onSubmit={handleFaqSubmit}
        initialValues={initialData}
        submitLabel={isEditMode ? "FAQ 수정 완료" : "FAQ 등록하기"}
      />
    </div>
  );
}
