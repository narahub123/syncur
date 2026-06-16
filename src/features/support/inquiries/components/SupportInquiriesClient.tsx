"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { inquiryFormConfig, InquiryFormValues } from "../types/inquiries";
import { toast } from "sonner";
import { useCreateRequestMutation } from "../../requests/hooks/useCreateRequestMutation";

const SupportInquiriesClient = () => {
  const { mutate: submitInquiry } = useCreateRequestMutation();

  const handleInquirySubmit = async (data: InquiryFormValues) => {
    // 2. 서버 DTO 구조에 맞게 페이로드 구성
    const payload = {
      type: "INQUIRY" as const, // DTO 타입과 일치시킴
      title: data.title,
      content: data.content,
      email: data.email,
      metadata: {
        category: data.category,
        images: data.images,
      },
    };

    try {
      console.log("제출된 문의 데이터:", payload);

      // 3. mutation 실행
      submitInquiry(payload, {
        onSuccess: () => {
          toast.success("문의가 성공적으로 접수되었습니다!");
          // 필요시 폼 초기화 로직 추가
        },
        onError: (error) => {
          console.error(error);
          toast.error("전송 중 오류가 발생했습니다.");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("예기치 않은 오류가 발생했습니다.");
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
