"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { bugReportFormConfig, BugReportFormValues } from "../types/bugReport";

const SupportBugReportClient = () => {
  // any 없이 엄격하게 BugReportFormValues 타입을 보장받는 서브밋 핸들러
  const handleBugReportSubmit = async (data: BugReportFormValues) => {
    try {
      console.log("제출된 버그 신고 데이터:", data);

      // 💡 파일(File 객체)이 포함되어 있다면 JSON 대신 FormData를 사용해야 합니다.
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("environment", data.environment);
      formData.append("content", data.content);

      if (data.file) {
        formData.append("file", data.file); // File 객체 그대로 백엔드에 전송
      }

      // API 전송 로직 예시
      // const res = await fetch("/api/support/bugs", {
      //   method: "POST",
      //   body: formData, // headers는 브라우저가 자동으로 multipart/form-data로 세팅합니다.
      // });

      alert("버그 신고가 정상적으로 접수되었습니다. 제보해 주셔서 감사합니다!");
    } catch (error) {
      console.error("접수 실패:", error);
      alert("전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-xl rounded-lg border p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">버그 신고하기</h1>
        <p className="text-muted-foreground text-sm">
          서비스 이용 중 발견하신 시스템 오류나 불편한 점을 보내주시면 빠르게
          개선하겠습니다.
        </p>
      </div>

      {/* 공통 폼 컴포넌트에 버그 신고 타입과 설정을 주입 */}
      <DynamicForm<BugReportFormValues>
        configs={bugReportFormConfig}
        onSubmit={handleBugReportSubmit}
        submitLabel="버그 제보하기"
      />
    </div>
  );
};

export default SupportBugReportClient;
