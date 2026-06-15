"use client";

import { Badge } from "@/shared/components/ui/badge";
import { answerFormConfig, AnswerFormValues } from "../types";
import { DynamicForm } from "@/shared/components/common/DynamicForm";

interface UserInquiryData {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  createdAt: string;
  currentStatus: "대기중" | "처리중" | "답변완료";
}

// 📝 기존에 달아놓은 답변 데이터가 있다면 받아올 타입 정의
interface ExistingAnswerData {
  replyContent: string;
  status: "처리중" | "답변완료";
}

interface AdminInquiryReplyClientProps {
  inquiry: UserInquiryData;
  existingAnswer?: ExistingAnswerData | null; // 답변이 존재하면 수정 모드로 진입
}

export default function AdminInquiryReplyClient({
  inquiry,
  existingAnswer,
}: AdminInquiryReplyClientProps) {
  const isEditMode = Boolean(existingAnswer);

  const handleReplySubmit = async (data: AnswerFormValues) => {
    try {
      if (isEditMode) {
        // 🔄 답변 수정 API 호출 (PATCH)
        console.log(`문의 ID ${inquiry.id}번 기존 답변 수정 전송:`, data);
        // await fetch(`/api/admin/requests/${inquiry.id}/reply`, { method: 'PATCH', body: JSON.stringify(data) });
        alert("유저 문의 답변이 정상적으로 수정되었습니다.");
      } else {
        // ➕ 최초 답변 등록 API 호출 (POST)
        console.log(`문의 ID ${inquiry.id}번 최초 답변 등록 전송:`, data);
        // await fetch(`/api/admin/requests/${inquiry.id}/reply`, { method: 'POST', body: JSON.stringify(data) });
        alert("최초 답변이 정상적으로 등록되었습니다.");
      }
    } catch (error) {
      console.error("답변 처리 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      {/* 1. 유저 원본 문의 내용 보기 (상단 고정) */}
      <div className="bg-muted/40 space-y-4 rounded-xl border p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">
              작성자: {inquiry.userEmail}
            </span>
            <h2 className="text-lg font-semibold">{inquiry.title}</h2>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-muted-foreground text-xs">
              {inquiry.createdAt}
            </div>
            <Badge
              variant={
                inquiry.currentStatus === "대기중" ? "destructive" : "default"
              }
            >
              {inquiry.currentStatus}
            </Badge>
          </div>
        </div>
        <p className="text-foreground/90 min-h-25 text-sm leading-relaxed whitespace-pre-wrap">
          {inquiry.content}
        </p>
      </div>

      {/* 2. 관리자 답변 등록/수정 폼 (DynamicForm 재사용) */}
      <div className="bg-background space-y-4 rounded-xl border p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-bold">
            {isEditMode ? "작성된 답변 수정하기" : "답변 등록 및 상태 제어"}
          </h3>
          <p className="text-muted-foreground text-xs">
            {isEditMode
              ? "기존에 전송한 피드백 내용을 정정합니다."
              : "유저에게 발송될 최초 답변을 작성합니다."}
          </p>
        </div>

        <DynamicForm<AnswerFormValues>
          configs={answerFormConfig}
          onSubmit={handleReplySubmit}
          submitLabel={isEditMode ? "답변 수정 완료" : "답변 전송 및 저장"}
          // 💡 기존 답변이 있으면 폼에 채워주고, 없으면 기본값 세팅
          initialValues={
            existingAnswer || { status: "답변완료", replyContent: "" }
          }
        />
      </div>
    </div>
  );
}
