"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { bugReportFormConfig, BugReportFormValues } from "../types/bugReport";

const SupportBugReportClient = () => {
  const handleBugReportSubmit = async (data: BugReportFormValues) => {
    try {
      console.log("제출된 버그 신고 데이터:", data);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("os", data.os); // 변경된 필드명 적용
      formData.append("browser", data.browser); // 추가된 필드 적용
      formData.append("content", data.content);

      // fileUrls가 배열이므로 반복문으로 추가 (서버에서 여러 파일 수용 시)
      if (data.fileUrls && data.fileUrls.length > 0) {
        data.fileUrls.forEach((file) => {
          formData.append("fileUrls", file);
        });
      }

      // API 전송 로직 예시
      // const res = await fetch("/api/support/bugs", {
      //   method: "POST",
      //   body: formData,
      // });

      alert("버그 신고가 정상적으로 접수되었습니다.");
    } catch (error) {
      console.error("접수 실패:", error);
      alert("전송 중 오류가 발생했습니다.");
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
