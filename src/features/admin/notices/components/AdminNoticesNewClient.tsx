"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { useCreateNoticeMutation } from "@/features/admin/notices/hooks/useCreateNoticeMutation";
import { useUpdateNoticeMutation } from "@/features/admin/notices/hooks/useUpdateNoticeMutation";
import { useDeleteNoticeMutation } from "@/features/admin/notices/hooks/useDeleteNoticeMutation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/shared/components/common/DeleteButton";
import { extractPublicIdsFromHtml } from "@/shared/utils/extractPublicIdsFromHtml";
import { NoticeFormValues } from "../types/form";
import { noticeFormConfig } from "../constants/form";

interface AdminNoticesNewClientProps {
  noticeId?: string;
  initialData?: NoticeFormValues;
}

export default function AdminNoticesNewClient({
  noticeId,
  initialData,
}: AdminNoticesNewClientProps) {
  const router = useRouter();
  const isEditMode = Boolean(noticeId);

  const { mutate: createNotice } = useCreateNoticeMutation();
  const { mutate: updateNotice } = useUpdateNoticeMutation();
  const { mutate: deleteNotice } = useDeleteNoticeMutation();

  const handleNoticeSubmit = async (data: NoticeFormValues) => {
    // 1. 에디터 컨텐츠에서 현재 사용 중인 이미지 ID 추출
    const usedPublicIds = extractPublicIdsFromHtml(data.content);

    // 2. 이미지 분류 (유지할 것 / 삭제할 것)
    const currentImages = Array.isArray(data.images) ? data.images : [];

    const imagesToKeep = currentImages.filter((img) =>
      usedPublicIds.includes(img.publicId),
    );

    const deletedImages = currentImages.filter(
      (img) => !usedPublicIds.includes(img.publicId),
    );

    // 3. payload 구성 (DB에는 유지할 이미지만 저장)
    const payload = {
      title: data.title,
      status: data.status,
      content: data.content,
      category: data.category,
      isPinned: data.isPinned === "fixed",
      images: imagesToKeep,
      deletedImages,
    };

    if (isEditMode && noticeId) {
      // 💡 [수정] id와 함께 전송
      updateNotice(
        { id: noticeId, dto: payload },
        {
          onSuccess: () => {
            toast.success("공지사항이 성공적으로 수정되었습니다.");
          },
          onError: (error) => {
            console.error(error);
            toast.error("공지사항 수정 중 오류가 발생했습니다.");
          },
        },
      );
    } else {
      // 💡 [등록]
      createNotice(payload, {
        onSuccess: () => {
          toast.success("공지사항이 성공적으로 게시되었습니다.");
          router.push("/admin/notices"); // 등록 후 목록으로 이동
        },
        onError: (error) => {
          console.error(error);
          toast.error("공지사항 등록 중 오류가 발생했습니다.");
        },
      });
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-2xl rounded-xl border p-6 shadow-sm">
      <Link
        href="/admin/notices"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 text-sm transition"
      >
        <ArrowLeft size={16} />
        <span>공지사항 목록으로 돌아가기</span>
      </Link>

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
        footer={
          isEditMode ? (
            <DeleteButton onDelete={() => deleteNotice(noticeId!)} />
          ) : null
        }
      />
    </div>
  );
}
