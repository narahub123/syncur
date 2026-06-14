"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { inquiryFormConfig, InquiryFormValues } from "../types/inquiries";

const SupportInquiriesClient = () => {
  // any 없이 엄격하게 타입을 보장받는 핸들러 함수
  const handleInquirySubmit = async (data: InquiryFormValues) => {
    try {
      console.log("제출된 문의 데이터:", data);

      // API 전송 로직 예시
      // const res = await fetch("/api/inquiries", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      // });

      alert("문의가 성공적으로 접수되었습니다!");
    } catch (error) {
      console.error(error);
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-xl rounded-lg border p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">고객 문의하기</h1>
        <p className="text-muted-foreground text-sm">
          불편한 점이나 건의 사항을 남겨주시면 빠르게 답변드리겠습니다.
        </p>
      </div>

      {/* 완성된 설정 기반 공통 폼 컴포넌트 배치 */}
      <DynamicForm<InquiryFormValues>
        configs={inquiryFormConfig}
        onSubmit={handleInquirySubmit}
        submitLabel="문의 제출"
      />
    </div>
  );
};

export default SupportInquiriesClient;
