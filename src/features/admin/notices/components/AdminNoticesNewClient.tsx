"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { noticeFormConfig, NoticeFormValues } from "../types";

interface AdminNoticesNewClientProps {
  noticeId?: string; // 주어지면 '수정 모드', 없으면 '생성 모드'
  initialData?: NoticeFormValues; // 수정 모드일 때 서버에서 받아온 기존 데이터
}

export default function AdminNoticesNewClient({
  noticeId,
  initialData,
}: AdminNoticesNewClientProps) {
  const isEditMode = Boolean(noticeId);

  const handleNoticeSubmit = async (data: NoticeFormValues) => {
    try {
      if (isEditMode) {
        // 📝 수정 API 호출 (PATCH / PUT)
        console.log(`공지사항 ${noticeId}번 수정 전송:`, data);
        // await fetch(`/api/admin/notices/${noticeId}`, { method: 'PATCH', body: JSON.stringify(data) });
        alert("공지사항이 성공적으로 수정되었습니다.");
      } else {
        // ➕ 생성 API 호출 (POST)
        console.log("새 공지사항 등록 전송:", data);
        // await fetch(`/api/admin/notices`, { method: 'POST', body: JSON.stringify(data) });
        alert("새로운 공지사항이 등록되었습니다.");
      }
    } catch (error) {
      console.error("공지사항 처리 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-2xl rounded-xl border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "공지사항 수정하기" : "새 공지사항 등록"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isEditMode
            ? "기존 공지사항 내용을 수정합니다."
            : "시스템 및 서비스에 게시할 공지사항을 작성합니다."}
        </p>
      </div>

      <DynamicForm<NoticeFormValues>
        configs={noticeFormConfig}
        onSubmit={handleNoticeSubmit}
        initialValues={initialData}
        submitLabel={isEditMode ? "수정 완료" : "공지사항 게시"}
      />
    </div>
  );
}
