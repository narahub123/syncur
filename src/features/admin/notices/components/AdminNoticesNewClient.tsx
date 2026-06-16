"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { noticeFormConfig, NoticeFormValues } from "../types";
import { useCreateNoticeMutation } from "../hooks/useCreateNoticeMutation";
import { CreateNoticeDto } from "@/features/support/notices/dtos";
import { toast } from "sonner";

interface AdminNoticesNewClientProps {
  noticeId?: string; // 주어지면 '수정 모드', 없으면 '생성 모드'
  initialData?: NoticeFormValues; // 수정 모드일 때 서버에서 받아온 기존 데이터
}

export default function AdminNoticesNewClient({
  noticeId,
  initialData,
}: AdminNoticesNewClientProps) {
  const isEditMode = Boolean(noticeId);

  const { mutate: createNotice, isPending } = useCreateNoticeMutation();

  const handleNoticeSubmit = async (data: NoticeFormValues) => {
    if (isEditMode) {
      // 수정 로직 (나중에 훅 구현)
      toast.info("수정 기능은 현재 준비 중입니다.");
      return;
    }

    const isPinnedBoolean = data.isPinned === "상단 고정";
    const dto: CreateNoticeDto = {
      title: data.title,
      content: data.content,
      isPinned: isPinnedBoolean,
      images: data.images || [],
    };

    // 💡 생성 처리 및 Sonner 피드백
    createNotice(dto, {
      onSuccess: () => {
        toast.success("게시글이 성공적으로 작성되었습니다.");
        // router.push("/notices"); // 필요 시 페이지 이동
      },
      onError: (error) => {
        toast.error("게시글 작성 중 오류가 발생했습니다.");
        console.error(error);
      },
    });
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
