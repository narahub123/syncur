"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { inquiryFormConfig } from "../../inquiries/types/inquiries";
import { bugReportFormConfig } from "../../bug-reports/types/bugReport";
import { BugEditFormValues, InquiryEditFormValues } from "../types";
import { useEffect, useState } from "react";
import { REQUEST_TYPE, RequestType } from "../constants/request-type";

interface SupportRequestEditClientProps {
  requestId: string;
}

const SupportRequestEditClient = ({
  requestId,
}: SupportRequestEditClientProps) => {
  const [requestType, setRequestType] = useState<RequestType | null>(null);

  // 💡 any 대신 두 가지 타입 중 하나이거나 초기값인 null이 될 수 있음을 명시
  const [initialData, setInitialData] = useState<
    InquiryEditFormValues | BugEditFormValues | null
  >(null);

  useEffect(() => {
    // 📝 [syncur 백엔드 API 호출 레이어]
    //실제로는 axios나 fetch로 /api/support/requests/${requestId} 를 찌르게 됩니다.

    // 예시: 버그 신고 데이터가 서버에서 날아왔다고 가정
    setRequestType(REQUEST_TYPE.BUG_REPORT);
    setInitialData({
      title: "대시보드 진입 시 무한 로딩이 걸립니다.",
      content:
        "특정 메뉴만 누르면 화면이 멈춰요. syncur 서비스 확인 부탁드립니다.",
      os: "Windows 11",
      browser: "Chrome",
    });
  }, [requestId]);

  const handleEditSubmit = async (
    data: InquiryEditFormValues | BugEditFormValues,
  ) => {
    try {
      console.log(
        `[syncur] ${requestType} 유형의 ${requestId}번 글 수정 요청:`,
        data,
      );
      // await fetch(`/api/support/requests/${requestId}`, { method: 'PATCH', body: JSON.stringify(data) });
      alert("성공적으로 수정되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  // 데이터가 아직 fetch되지 않았다면 로딩 UI 반환
  if (!requestType || !initialData) return <div>로딩 중...</div>;

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 p-6">
      <div>
        <h1 className="text-xl font-bold">
          {requestType === REQUEST_TYPE.BUG_REPORT
            ? "버그 제보 수정"
            : "1:1 문의 내용 수정"}
        </h1>
        <p className="text-muted-foreground text-xs">
          {requestType === REQUEST_TYPE.BUG_REPORT
            ? "제보하셨던 에러 내용을 정정합니다."
            : "작성하셨던 문의 내용을 수정합니다."}
        </p>
      </div>

      <DynamicForm
        configs={
          requestType === REQUEST_TYPE.BUG_REPORT
            ? bugReportFormConfig
            : inquiryFormConfig
        }
        onSubmit={handleEditSubmit}
        initialValues={initialData}
        submitLabel="수정 완료하기"
      />
    </div>
  );
};

export default SupportRequestEditClient;
