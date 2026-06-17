"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { toast } from "sonner";
import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";
import {
  bugReportFormConfig,
  BugReportFormValues,
} from "../../bug-reports/types/bugReport";
import { inquiryFormConfig } from "../../inquiries/types/inquiries";
import { AdminRequestResponseDTO } from "../types/admin-search";
import { useUpdateRequestMutation } from "../hooks/useUpdateRequestMutation";

interface SupportRequestEditClientProps {
  request: AdminRequestResponseDTO; // 서버에서 가져온 전체 Request 데이터 (DTO)
}

const SupportRequestEditClient = ({
  request,
}: SupportRequestEditClientProps) => {
  const { mutate: updateRequest } = useUpdateRequestMutation();
  const isBugReport = request.type === REQUEST_TYPE.BUG_REPORT;

  // 1. 기존 데이터 -> 폼 타입으로 매핑
  const initialValues = isBugReport
    ? {
        title: request.title,
        content: request.content,
        category: request.metadata?.category,
        os: request.metadata?.os,
        browser: request.metadata?.browser,
        images: request.metadata?.images || [],
      }
    : {
        title: request.title,
        content: request.content,
        email: request.userEmail,
        category: request.metadata?.category,
        images: request.metadata?.images || [],
      };

  // 2. 제출 핸들러 (타입별 분기)
  const handleSubmit = (data: BugReportFormValues) => {
    const payload = isBugReport
      ? {
          title: data.title,
          content: data.content,
          metadata: {
            category: data.category,
            os: data.os,
            browser: data.browser,
            images: data.images,
          },
        }
      : {
          title: data.title,
          content: data.content,
          metadata: {
            category: data.category,
            images: data.images,
          },
        };

    updateRequest(
      { requestId: request._id, ...payload },
      {
        onSuccess: () => toast.success("수정이 완료되었습니다."),
        onError: () => toast.error("수정 중 오류가 발생했습니다."),
      },
    );
  };

  return (
    <div className="bg-background mx-auto w-full max-w-xl rounded-lg border p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {isBugReport ? "버그 제보 수정" : "문의 내용 수정"}
        </h1>
      </div>

      <DynamicForm
        configs={isBugReport ? bugReportFormConfig : inquiryFormConfig}
        initialValues={initialValues} // 💡 기존 정보 자동 주입
        onSubmit={handleSubmit}
        submitLabel="수정 완료"
      />
    </div>
  );
};

export default SupportRequestEditClient;
