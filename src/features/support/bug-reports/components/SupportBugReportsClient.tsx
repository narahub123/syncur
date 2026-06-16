"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { bugReportFormConfig, BugReportFormValues } from "../types/bugReport";
import { useCreateRequestMutation } from "../../requests/hooks/useCreateRequestMutation";
import { toast } from "sonner";

const SupportBugReportClient = () => {
  const { mutate: submitRequest } = useCreateRequestMutation();

  const handleBugReportSubmit = async (data: BugReportFormValues) => {
    // 1. 서버 DTO 구조에 맞게 페이로드 구성
    const payload = {
      type: "BUG_REPORT" as const,
      title: data.title,
      content: data.content,
      // 필요 시 email 필드 추가 가능
      metadata: {
        category: data.category,
        os: data.os,
        browser: data.browser,
        images: data.images,
      },
    };

    try {
      console.log("제출된 버그 신고 데이터:", payload);

      // 2. 공용 mutation 실행
      submitRequest(payload, {
        onSuccess: () => {
          toast.success("버그 신고가 성공적으로 접수되었습니다!");
          // 필요시 폼 초기화 로직
        },
        onError: (error) => {
          console.error("전송 실패:", error);
          toast.error("전송 중 오류가 발생했습니다.");
        },
      });
    } catch (error) {
      console.error("예기치 않은 오류:", error);
      toast.error("예기치 않은 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-xl rounded-lg border p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">버그 신고하기</h1>
        <p className="text-muted-foreground text-sm">
          서비스 이용 중 발견하신 시스템 오류나 불편한 점을 보내주세요.
        </p>
      </div>

      <DynamicForm<BugReportFormValues>
        configs={bugReportFormConfig}
        onSubmit={handleBugReportSubmit}
        submitLabel="버그 제보하기"
      />
    </div>
  );
};

export default SupportBugReportClient;
