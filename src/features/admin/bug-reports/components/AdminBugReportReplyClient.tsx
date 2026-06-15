"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { FileIcon, LaptopIcon } from "lucide-react";
import {
  AdminBugReportDetail,
  bugAnswerFormConfig,
  BugAnswerFormValues,
} from "../types";
import { DynamicForm } from "@/shared/components/common/DynamicForm";

interface AdminBugReplyClientProps {
  bugReport: AdminBugReportDetail;
  existingAnswer?: BugAnswerFormValues | null; // 기존 버그 분석/답변 데이터가 존재하면 수정 모드
}

export default function AdminBugReplyClient({
  bugReport,
  existingAnswer,
}: AdminBugReplyClientProps) {
  const isEditMode = Boolean(existingAnswer);

  const handleBugReplySubmit = async (data: BugAnswerFormValues) => {
    try {
      if (isEditMode) {
        // 🔄 버그 답변/상태 수정 API 호출 (PATCH)
        console.log(`버그 ID ${bugReport.id}번 기존 피드백 수정 전송:`, data);
        // await fetch(`/api/admin/bug-reports/${bugReport.id}/reply`, { method: 'PATCH', body: JSON.stringify(data) });
        alert("버그 처리 내역 및 답변이 정상적으로 수정되었습니다.");
      } else {
        // ➕ 최초 버그 답변 등록 API 호출 (POST)
        console.log(`버그 ID ${bugReport.id}번 최초 처리 전송:`, data);
        // await fetch(`/api/admin/bug-reports/${bugReport.id}/reply`, { method: 'POST', body: JSON.stringify(data) });
        alert("버그 처리 상태가 등록되었습니다.");
      }
    } catch (error) {
      console.error("버그 처리 업데이트 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const statusVariantMap = {
    접수대기: "destructive",
    확인중: "secondary",
    수정중: "outline",
    해결완료: "default",
  } as const;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            버그 리포트 상세 관리
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            유저 제보 환경을 분석하고 처리 프로세스를 기록합니다.
          </p>
        </div>
        <Badge variant={statusVariantMap[bugReport.currentStatus] || "default"}>
          {bugReport.currentStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 유저 제보 상세 내역 (Read-Only) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="bg-muted/30 space-y-4 rounded-xl border p-6">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs">
                제보자: {bugReport.userEmail} | {bugReport.createdAt}
              </span>
              <h2 className="text-lg font-semibold">{bugReport.title}</h2>
            </div>
            <p className="text-foreground/90 bg-background min-h-37.5 rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {bugReport.content}
            </p>
          </div>

          {/* 기기 및 파일 인포 정보 */}
          <div className="bg-background grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2">
            <div className="bg-muted/20 flex items-start gap-3 rounded-lg p-3">
              <LaptopIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <div className="text-muted-foreground text-xs font-semibold">
                  유저 실행 환경
                </div>
                <div className="text-sm font-medium">OS: {bugReport.os}</div>
                <div className="text-sm font-medium">
                  Browser: {bugReport.browser}
                </div>
              </div>
            </div>

            <div className="bg-muted/20 flex items-start gap-3 rounded-lg p-3">
              <FileIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="w-full space-y-1">
                <div className="text-muted-foreground text-xs font-semibold">
                  첨부 파일 / 스크린샷
                </div>
                {bugReport.fileUrl ? (
                  <div className="pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 w-full"
                    >
                      <a
                        href={bugReport.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        파일 다운로드 / 보기
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground pt-1 text-sm italic">
                    첨부된 파일이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 관리자 답변/수정 대응 폼 */}
        <div className="bg-background h-fit space-y-4 rounded-xl border p-6 shadow-sm">
          <div>
            <h3 className="text-md font-bold">
              {isEditMode ? "버그 처리 내역 수정" : "버그 대응 폼"}
            </h3>
            <p className="text-muted-foreground text-xs">
              {isEditMode
                ? "등록된 디버깅 피드백 및 이슈 링크를 수정합니다."
                : "진행 상황을 변경하고 피드백을 기록하세요."}
            </p>
          </div>

          <DynamicForm<BugAnswerFormValues>
            configs={bugAnswerFormConfig}
            onSubmit={handleBugReplySubmit}
            submitLabel={
              isEditMode ? "처리 내역 수정 완료" : "처리 상태 업데이트"
            }
            // 💡 기존 피드백/답변 정보 유무에 따른 initialValues 주입 분기
            initialValues={
              existingAnswer || { status: "확인중", replyContent: "" }
            }
          />
        </div>
      </div>
    </div>
  );
}
