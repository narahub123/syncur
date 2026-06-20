"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { ImagePreview } from "@/shared/components/common/ImagePreview";
import { DynamicForm } from "@/shared/components/common/DynamicForm";
import {
  ANSWER_STATUS,
  answerFormConfig,
  AnswerFormValues,
  AnswerStatus,
  InquiryStatus,
  UserInquiryData,
} from "../types/search";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { Avatar } from "@/shared/components/common/Avartar";
import { AdminBackButton } from "../../components/AdminBackButton";
import { ROUTES } from "@/shared/constants/routes";
import { useAdminInquiryReplyMutation } from "../hooks/useAdminInquiryReplyMutation";

interface AdminInquiryReplyClientProps {
  inquiry: UserInquiryData;
  existingAnswer?: {
    replyContent: string;
    images: ImageInfo[];
    status: AnswerStatus;
  } | null;
}

export default function AdminInquiryReplyClient({
  inquiry,
  existingAnswer,
}: AdminInquiryReplyClientProps) {
  const isEditMode = Boolean(existingAnswer);
  const [images, setImages] = useState(inquiry.metadata?.images || []);

  const { mutate: reply } = useAdminInquiryReplyMutation(isEditMode);

  const handleReplySubmit = (data: AnswerFormValues) => {
    reply({
      inquiryId: inquiry.id,
      replyContent: data.replyContent,
      status: data.status as InquiryStatus,
      images: data.images || [],
    });
  };

  return (
    <div className="w-full space-y-6 p-6">
      <AdminBackButton href={ROUTES.ADMIN_INQUIRIES} />
      {/* 1. 문의 상세 정보 */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              {inquiry.title}
            </h2>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{inquiry.createdAt}</span>
              <span>•</span>
              <span>ID: {inquiry.id.slice(-6)}</span>
            </div>
          </div>
          <Badge
            variant={
              inquiry.currentStatus === "PENDING" ? "destructive" : "default"
            }
          >
            {inquiry.currentStatus}
          </Badge>
        </div>

        <div className="bg-muted/30 mb-6 flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={inquiry.user?.profileImage || inquiry.user?.image}
              name={inquiry.user?.name}
              className="h-9 w-9"
            />
            <div>
              <p className="text-sm font-medium">
                {inquiry.user?.name ?? "사용자"}
              </p>
              <p className="text-muted-foreground text-xs">
                {inquiry.user?.email}
              </p>
            </div>
          </div>
          <button className="text-primary text-xs font-medium hover:underline">
            사용자 상세 보기
          </button>
        </div>

        <div className="bg-background rounded-lg border p-4">
          <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
            {inquiry.content}
          </p>
          {/* 문의 이미지 */}
          <ImagePreview
            images={images}
            onDelete={setImages}
            canDelete={false}
          />
        </div>
      </div>

      {/* 2. 관리자 답변 폼 */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold">
          {isEditMode ? "답변 수정" : "관리자 답변 등록"}
        </h3>
        <DynamicForm<AnswerFormValues>
          configs={answerFormConfig}
          onSubmit={handleReplySubmit}
          submitLabel={isEditMode ? "수정 완료" : "답변 전송"}
          initialValues={
            existingAnswer || {
              status: ANSWER_STATUS.COMPLETED,
              replyContent: "",
            }
          }
        />
      </div>
    </div>
  );
}
