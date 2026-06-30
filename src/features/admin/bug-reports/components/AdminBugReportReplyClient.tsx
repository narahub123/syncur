"use client";

import { Badge } from "@/shared/components/ui/badge";
import { LaptopIcon } from "lucide-react";
import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { ImagePreview } from "@/shared/components/common/ImagePreview";
import { useState } from "react";
import { Avatar } from "@/shared/components/common/Avartar";
import { AdminBackButton } from "../../components/AdminBackButton";
import { ROUTES } from "@/shared/constants/routes";
import { AdminBugReportDetail } from "../dto/bugReportDto";
import { BugAnswerFormValues } from "../types/form";
import { bugAnswerFormConfig } from "../constants/form";
import { BUG_REPORT_STATUS } from "../types/search";
import { useAdminBugReportReplyMutation } from "../hooks/useAdminBugReportReplyMutation";

interface AdminBugReplyClientProps {
  bugReport: AdminBugReportDetail;
  existingAnswer?: BugAnswerFormValues | null;
}

export default function AdminBugReplyClient({
  bugReport,
  existingAnswer,
}: AdminBugReplyClientProps) {
  const isEditMode = Boolean(existingAnswer);
  const [images, setImages] = useState(bugReport.metadata?.images || []);

  // 훅에서 onSuccess 시 토스트 처리
  const { mutate: reply } = useAdminBugReportReplyMutation(isEditMode);

  const handleBugReplySubmit = (data: BugAnswerFormValues) => {
    reply({
      bugReportId: bugReport._id,
      userId: bugReport.user?._id || "",
      replyContent: data.replyContent,
      status: data.status,
      images: data.images || [],
    });
  };

  return (
    <div className="w-full space-y-6 p-6">
      <AdminBackButton href={ROUTES.ADMIN_BUG_REPORTS} />
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            버그 리포트 상세 관리
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            유저 제보 환경을 분석하고 처리 프로세스를 기록합니다.
          </p>
        </div>
        <Badge
          variant={
            bugReport.currentStatus === BUG_REPORT_STATUS.COMPLETED
              ? "default"
              : "secondary"
          }
        >
          {bugReport.currentStatus}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 lg:col-span-2">
          <div className="bg-muted/30 space-y-4 rounded-xl border p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Avatar
                  src={bugReport.user?.profileImage || bugReport.user?.image}
                  name={bugReport.user?.name}
                  className="h-9 w-9"
                />
                <div>
                  <p className="text-sm font-medium">
                    {bugReport.user?.name ?? "사용자"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {bugReport.user?.email}
                  </p>
                </div>
              </div>
              <h2 className="text-lg font-semibold">{bugReport.title}</h2>
            </div>
            <p className="text-foreground/90 bg-background rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {bugReport.content}
            </p>

            <ImagePreview
              images={images}
              onDelete={setImages}
              canDelete={false}
            />
          </div>

          <div className="bg-background grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2">
            <div className="bg-muted/20 flex items-start gap-3 rounded-lg p-3">
              <LaptopIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1 text-sm">
                <div className="text-muted-foreground font-semibold">
                  유저 실행 환경
                </div>
                <div>OS: {bugReport.metadata?.os}</div>
                <div>Browser: {bugReport.metadata?.browser}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 답변 폼 */}
        <div className="bg-background h-fit space-y-4 rounded-xl border p-6 shadow-sm">
          <h3 className="text-md font-bold">
            {isEditMode ? "버그 처리 내역 수정" : "버그 대응 폼"}
          </h3>
          <DynamicForm<BugAnswerFormValues>
            configs={bugAnswerFormConfig} // 설정 내에 반드시 images 필드 포함
            onSubmit={handleBugReplySubmit}
            submitLabel={
              isEditMode ? "처리 내역 수정 완료" : "처리 상태 업데이트"
            }
            initialValues={
              existingAnswer || {
                status: BUG_REPORT_STATUS.CHECKING,
                replyContent: "",
                images: [],
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
